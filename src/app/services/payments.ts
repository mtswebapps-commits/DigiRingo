/**
 * Unified payment gateway — exposes both PayPal and Freemius so the UI can
 * offer whichever are configured, with automatic fallback if one goes down.
 */
import { API_ORIGIN } from "./origin";
import { getToken } from "./api";
import { openCheckout as fsOpenCheckout, type CheckoutItem as FsCheckoutItem } from "./freemius";

export type Gateway = "paypal" | "freemius";

interface PaymentsConfig {
  paypal: { enabled: boolean; clientId: string };
  freemius: { enabled: boolean; productId: string; publicKey: string; checkouts: Record<string, unknown> };
}

let cached: PaymentsConfig | null = null;
let configPromise: Promise<PaymentsConfig | null> | null = null;

export function loadPaymentsConfig(): Promise<PaymentsConfig | null> {
  if (configPromise) return configPromise;
  configPromise = fetch(`${API_ORIGIN}/api/payments/config`)
    .then((r) => (r.ok ? (r.json() as Promise<PaymentsConfig>) : null))
    .then((c) => { cached = c; return c; })
    .catch(() => null);
  return configPromise;
}

export function availableGateways(): Gateway[] {
  const gw: Gateway[] = [];
  if (cached?.paypal?.enabled) gw.push("paypal");
  if (cached?.freemius?.enabled) gw.push("freemius");
  return gw;
}

export function anyPaymentReady(): boolean {
  return !!(cached?.paypal?.enabled || cached?.freemius?.enabled);
}

export function isGatewayReady(gw: Gateway): boolean {
  if (gw === "paypal") return !!cached?.paypal?.enabled;
  if (gw === "freemius") return !!cached?.freemius?.enabled;
  return false;
}

export interface CheckoutGrant {
  kind: "topup" | "plan" | "plan_number" | "number";
  amount?: number;
  tier?: string;
  cycle?: "monthly" | "annual";
  phone?: string;
  numberKind?: "local" | "tollfree";
}

/** Start a checkout via the chosen gateway. PayPal redirects away; Freemius opens an overlay. */
export async function startGatewayCheckout(gw: Gateway, g: CheckoutGrant, buyer?: { email?: string; name?: string }): Promise<void> {
  if (gw === "freemius") {
    let fsItem: FsCheckoutItem;
    if (g.kind === "topup") {
      fsItem = { kind: "topup", amount: g.amount || 0 };
    } else if (g.kind === "plan" || g.kind === "plan_number") {
      fsItem = { kind: "bundle", tier: g.tier || "", cycle: g.cycle || "monthly" };
    } else {
      throw new Error("Number-only checkout is not available via Freemius — use PayPal or wallet.");
    }
    await fsOpenCheckout(fsItem, buyer);
    return;
  }
  // PayPal — redirect flow
  const token = getToken();
  const r = await fetch(`${API_ORIGIN}/api/paypal/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(g),
  });
  const j = await r.json().catch(() => ({} as { url?: string; error?: string }));
  if (!r.ok || !j.url) throw new Error(j.error || "Could not start checkout");
  window.location.href = j.url;
}

/** Capture a PayPal return (unchanged from before — Freemius doesn't need this). */
export async function capturePaypalReturn(): Promise<"paid" | "cancelled" | null> {
  const url = new URL(window.location.href);
  const pay = url.searchParams.get("pay");
  if (pay !== "paypal" && pay !== "cancel") return null;
  const orderId = url.searchParams.get("token") || "";
  for (const k of ["pay", "token", "PayerID"]) url.searchParams.delete(k);
  window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  if (pay === "cancel" || !orderId) return pay === "cancel" ? "cancelled" : null;
  try {
    const token = getToken();
    const r = await fetch(`${API_ORIGIN}/api/paypal/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ orderID: orderId }),
    });
    const j = await r.json().catch(() => ({} as { ok?: boolean }));
    return r.ok && j.ok ? "paid" : null;
  } catch {
    return null;
  }
}
