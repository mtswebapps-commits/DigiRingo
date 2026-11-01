/**
 * Conversion events for Google Ads.
 *
 * Native: the @capacitor-firebase/analytics plugin, so events come from the
 * Android Firebase SDK (what Google Ads App campaigns link to).
 * Web: gtag.js (GA4 + Google Ads), loaded by index.html / site.html on
 * digiringo.com only. Elsewhere `window.gtag` is missing and every call is a
 * no-op. Nothing here ever throws into the app.
 *
 * Event names are Firebase's standard ones (sign_up, purchase) so Google Ads
 * recognises them without custom mapping.
 */
import { Capacitor } from "@capacitor/core";

const native = () => { try { return Capacitor.isNativePlatform(); } catch { return false; } };

type Params = Record<string, string | number>;

/**
 * Google Ads conversion labels (Ads → Goals → Conversions → tag setup, the part
 * after "AW-18520064773/"). Empty = only GA4 gets the event; import the GA4 key
 * event into Google Ads instead.
 */
const ADS_ID = "AW-18520064773";
const ADS_LABELS: Record<string, string> = { sign_up: "", purchase: "" };

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | null => (typeof window !== "undefined" && typeof (window as { gtag?: Gtag }).gtag === "function" ? (window as unknown as { gtag: Gtag }).gtag : null);

/** Is there anywhere to send events on this build? */
const enabled = () => native() || !!gtag();

async function log(name: string, params: Params): Promise<void> {
  if (!native()) {
    const g = gtag();
    if (!g) return;
    try {
      g("event", name, params);
      const label = ADS_LABELS[name];
      if (label) g("event", "conversion", { send_to: `${ADS_ID}/${label}`, value: params.value, currency: params.currency, transaction_id: params.transaction_id });
    } catch { /* analytics must never break the app */ }
    return;
  }
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
  if (!enabled() || !(value > 0)) return;
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
  if (!enabled()) return;
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
