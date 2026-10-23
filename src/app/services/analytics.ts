/**
 * Firebase Analytics (native only) — conversion events for Google Ads App campaigns.
 *
 * Uses the native @capacitor-firebase/analytics plugin so events come from the
 * Android Firebase SDK (what Google Ads links to). On the web / mock build every
 * call is a no-op, and nothing here ever throws into the app.
 *
 * Event names are Firebase's standard ones (sign_up, purchase) so Google Ads
 * recognises them without custom mapping.
 */
import { Capacitor } from "@capacitor/core";

const native = () => { try { return Capacitor.isNativePlatform(); } catch { return false; } };

type Params = Record<string, string | number>;

async function log(name: string, params: Params): Promise<void> {
  if (!native()) return;
  try {
    const { FirebaseAnalytics } = await import("@capacitor-firebase/analytics");
    await FirebaseAnalytics.logEvent({ name, params });
  } catch { /* analytics must never break the app */ }
}

/** A NEW account was created (not a returning login). */
export function trackSignUp(method: "email" | "google" | "apple"): void {
  void log("sign_up", { method });
}

/** A number was bought (wallet or plan). */
export function trackBuyNumber(value: number): void {
  void log("buy_number", { value: round(value), currency: "USD" });
}

/* ----------------------------------------------------------------- purchase */
// Purchases can be seen twice: the Freemius overlay's purchaseCompleted callback
// AND the credited top-up that later shows up in the server wallet history (the
// only signal if checkout ever completes outside the WebView). Each is logged once:
//   • logged transaction ids are remembered in localStorage;
//   • an overlay purchase also leaves a "pending" {amount, at} marker, so the
//     matching wallet credit (same amount, within a day) is treated as the same sale.
const LOGGED_KEY = "dg-an-purchases";
const PENDING_KEY = "dg-an-pending";
const SINCE_KEY = "dg-an-since";
const DAY = 24 * 3600 * 1000;

const read = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const round = (n: number) => Math.round(Number(n || 0) * 100) / 100;

function remember(id: string) {
  const ids = read<string[]>(LOGGED_KEY, []);
  if (!ids.includes(id)) write(LOGGED_KEY, [...ids, id].slice(-200));
}
const seen = (id: string) => read<string[]>(LOGGED_KEY, []).includes(id);

/** Freemius overlay reported a completed purchase. */
export function trackPurchase(transactionId: string, value: number): void {
  if (!native() || !(value > 0)) return;
  const id = transactionId || `fs_overlay_${Date.now()}`;
  if (seen(id)) return;
  remember(id);
  write(PENDING_KEY, [...read<{ amount: number; at: number }[]>(PENDING_KEY, []), { amount: round(value), at: Date.now() }].slice(-20));
  void log("purchase", { value: round(value), currency: "USD", transaction_id: id });
}

/**
 * Wallet history synced from the server: log any Freemius top-up credited after
 * analytics started on this install that wasn't already logged from the overlay.
 */
export function trackWalletPurchases(txns: { ref?: string; amount: number; at?: number }[]): void {
  if (!native()) return;
  let since = read<number>(SINCE_KEY, 0);
  if (!since) { since = Date.now(); write(SINCE_KEY, since); return; } // never back-fill old top-ups
  const pending = read<{ amount: number; at: number }[]>(PENDING_KEY, []).filter((p) => Date.now() - p.at < DAY);
  for (const t of txns) {
    if (!t.ref?.startsWith("fs_") || !(t.amount > 0) || !t.at || t.at < since || seen(t.ref)) continue;
    remember(t.ref);
    const match = pending.findIndex((p) => p.amount === round(t.amount) && Math.abs(t.at! - p.at) < DAY);
    if (match >= 0) { pending.splice(match, 1); continue; } // already logged via the overlay
    void log("purchase", { value: round(t.amount), currency: "USD", transaction_id: t.ref });
  }
  write(PENDING_KEY, pending);
}
