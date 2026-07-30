/**
 * PayPal (card rail) — CLIENT. Replaces the Stripe hosted Checkout with PayPal's
 * hosted approval: we ask the server for an approval URL (server sets all prices)
 * and redirect to it. All fulfilment (credit wallet / activate plan / provision
 * number) happens SERVER-SIDE — after the payer approves, PayPal redirects back to
 * /app?pay=paypal&token=<orderId>, and capturePaypalReturn() posts that order id
 * to the server which captures + fulfils it idempotently.
 */
import { API_ORIGIN } from "./origin";
import { getToken } from "./api";

export interface CheckoutGrant {
  kind: "topup" | "plan" | "plan_number" | "number";
  amount?: number;
  tier?: string;
  cycle?: "monthly" | "annual";
  phone?: string;
  numberKind?: "local" | "tollfree";
}

/** Start a PayPal checkout and REDIRECT the browser to PayPal's approval page.
 *  Resolves only if the order couldn't be created (else the page navigates away). */
export async function startCheckout(g: CheckoutGrant): Promise<void> {
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

let cachedReady = false;
let configPromise: Promise<boolean> | null = null;

/** Fetch PayPal availability once (cached). */
export function loadPaymentConfig(): Promise<boolean> {
  if (configPromise) return configPromise;
  configPromise = fetch(`${API_ORIGIN}/api/paypal/config`)
    .then((r) => r.json())
    .then((c) => { cachedReady = !!c.enabled; return cachedReady; })
    .catch(() => false);
  return configPromise;
}

export const paymentReady = (): boolean => cachedReady;

/** PayPal manages the funding source on its side — there's no card-on-file to
 *  show or swap in-app (unlike Stripe). Lets the UI hide the saved-card panel. */
export const supportsSavedCard = (): boolean => false;

/**
 * On app load, finish a PayPal checkout if we've just been redirected back.
 * Returns "paid" when an order was captured (caller should refresh wallet/plan),
 * "cancelled" if the payer backed out, or null if this isn't a PayPal return.
 * Always strips the pay params from the URL so a refresh can't re-trigger it.
 */
export async function capturePaypalReturn(): Promise<"paid" | "cancelled" | null> {
  const url = new URL(window.location.href);
  const pay = url.searchParams.get("pay");
  if (pay !== "paypal" && pay !== "cancel") return null;
  const orderId = url.searchParams.get("token") || "";
  // Clean the URL first so a page refresh can never double-submit.
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
