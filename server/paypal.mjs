/**
 * PayPal integration — Orders API v2 (hosted approval) + webhook verification.
 * Zero dependencies (PayPal's REST API via fetch). This is the card/PayPal rail:
 * it can charge ANY amount, so it fulfils the same four checkout kinds as the old
 * Stripe rail — arbitrary wallet top-ups, a plan, a plan + number in one payment,
 * or an extra number. Fulfilment is server-side (see fulfilPurchase in
 * telnyx-proxy) and is provider-agnostic.
 *
 * Flow (redirect, mirrors Stripe hosted Checkout):
 *   server createCheckoutSession() → order id + approve URL → browser redirects to
 *   PayPal → user approves → PayPal redirects back to successUrl?token=<orderId>
 *   → server captureOrder() → fulfilPurchase(). A webhook is also accepted as a
 *   backup fulfilment path (both are idempotent via the event-dedup table).
 *
 * Env (server .env — SECRETS never reach the browser):
 *   PAYPAL_CLIENT_ID     public client id (also sent to the browser)
 *   PAYPAL_SECRET        REST app secret        (a.k.a. PAYPAL_CLIENT_SECRET)
 *   PAYPAL_WEBHOOK_ID    id of the webhook configured in the PayPal dashboard
 *   PAYPAL_ENV           "live" | "sandbox"     (default sandbox)
 *   PAYPAL_VAULT         "1" to vault the payer for off-session renewals (needs
 *                        Reference Transactions enabled on the merchant account;
 *                        otherwise leave unset and renewals draw from the wallet)
 */
import * as settings from "./settings-store.mjs";

// Read lazily — this module is imported before the server calls loadEnvFile().
// A key saved via the Control Hub (encrypted in the DB) takes precedence over the
// env var; if none is saved (cache empty / DB down) we fall back to env.
const clientIdVal = () =>
  settings.getSecret("PAYPAL_CLIENT_ID") || process.env.PAYPAL_CLIENT_ID || "";
const secretVal = () =>
  settings.getSecret("PAYPAL_SECRET") || settings.getSecret("PAYPAL_CLIENT_SECRET") ||
  process.env.PAYPAL_SECRET || process.env.PAYPAL_CLIENT_SECRET || "";
const webhookId = () =>
  settings.getSecret("PAYPAL_WEBHOOK_ID") || process.env.PAYPAL_WEBHOOK_ID || "";

export const clientId = () => clientIdVal();
export const paypalConfigured = () => !!(clientIdVal() && secretVal());
export const vaultEnabled = () => String(process.env.PAYPAL_VAULT || "") === "1";

const apiBase = () =>
  (settings.getSecret("PAYPAL_ENV") || process.env.PAYPAL_ENV) === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

/* ---------------------------------------------------------------- OAuth token */
// Cache the client-credentials token until shortly before it expires.
let _tok = { value: "", exp: 0 };
async function token() {
  const now = Math.floor(Date.now() / 1000);
  if (_tok.value && now < _tok.exp - 60) return _tok.value;
  const auth = Buffer.from(`${clientIdVal()}:${secretVal()}`).toString("base64");
  const r = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error(j?.error_description || `PayPal token ${r.status}`);
  _tok = { value: j.access_token, exp: now + (Number(j.expires_in) || 3000) };
  return _tok.value;
}

async function ppApi(path, { method = "POST", body } = {}) {
  const r = await fetch(`${apiBase()}${path}`, {
    method,
    headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const detail = j?.details?.[0]?.description || j?.message || `PayPal error (${r.status})`;
    throw new Error(detail);
  }
  return j;
}

const usd = (cents) => (Math.round(Number(cents)) / 100).toFixed(2);

/**
 * Create a hosted PayPal order.
 *   lineItems: [{ name, amountCents, quantity? }]
 *   metadata:  string map carried to fulfilment — packed into custom_id (<=127)
 * Returns { id, url } where url is PayPal's hosted approval page.
 */
export async function createCheckoutSession({ lineItems, metadata, successUrl, cancelUrl }) {
  if (!paypalConfigured()) throw new Error("PayPal is not configured");
  const items = lineItems.map((li) => ({
    name: String(li.name).slice(0, 127),
    quantity: String(li.quantity || 1),
    unit_amount: { currency_code: "USD", value: usd(li.amountCents) },
  }));
  const totalCents = lineItems.reduce((s, li) => s + Math.round(li.amountCents) * (li.quantity || 1), 0);
  const value = usd(totalCents);
  // custom_id carries our metadata back on capture + webhook (PayPal cap: 255).
  const custom = JSON.stringify(metadata).slice(0, 255);

  const body = {
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "USD",
        value,
        breakdown: { item_total: { currency_code: "USD", value } },
      },
      items,
      custom_id: custom,
      description: (items[0]?.name || "DIGIRINGO purchase").slice(0, 127),
    }],
    application_context: {
      brand_name: "DIGIRINGO",
      user_action: "PAY_NOW",
      shipping_preference: "NO_SHIPPING",
      // "BILLING" lands the payer on PayPal's card-entry (guest) form so people
      // WITHOUT a PayPal account can pay by debit/credit card. (The newer
      // "GUEST_CHECKOUT" enum is rejected 400 by this account — verified live —
      // so we use the classic "BILLING" value.) Whether the card form actually
      // appears also depends on "PayPal Account Optional / guest checkout" being
      // enabled on the merchant account.
      landing_page: "BILLING",
      return_url: successUrl,
      cancel_url: cancelUrl,
    },
  };
  // Optional: vault the payer so renewals can charge off-session. Requires the
  // merchant account to have Reference Transactions enabled.
  if (vaultEnabled()) {
    body.payment_source = {
      paypal: {
        attributes: { vault: { store_in_vault: "ON_SUCCESS", usage_type: "MERCHANT", customer_type: "CONSUMER" } },
        experience_context: {
          brand_name: "DIGIRINGO",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: successUrl,
          cancel_url: cancelUrl,
        },
      },
    };
    delete body.application_context; // experience_context replaces it under payment_source
  }

  const order = await ppApi("/v2/checkout/orders", { body });
  const link = (order.links || []).find((l) => l.rel === "approve" || l.rel === "payer-action");
  if (!link?.href) throw new Error("PayPal did not return an approval URL");
  return { id: order.id, url: link.href };
}

/** Read an order (its status + our custom_id metadata) without capturing. */
export async function getOrder(orderId) {
  return ppApi(`/v2/checkout/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
}

/** Parse the metadata we packed into an order's custom_id. */
export function orderMetadata(order) {
  const raw = order?.purchase_units?.[0]?.custom_id;
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

/**
 * Capture an approved order. Returns
 *   { paid, amountCents, vaultId, payerId, email }
 * `vaultId` is set only when the payer was vaulted (PAYPAL_VAULT + account
 * supports reference transactions) — used for off-session renewals.
 */
export async function captureOrder(orderId) {
  const res = await ppApi(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, { body: {} });
  const pu = res?.purchase_units?.[0] || {};
  const cap = pu?.payments?.captures?.[0] || {};
  const paid = res?.status === "COMPLETED" && (cap?.status === "COMPLETED" || cap?.status === "PENDING");
  const amountCents = cap?.amount?.value ? Math.round(Number(cap.amount.value) * 100) : 0;
  const vaultId = res?.payment_source?.paypal?.attributes?.vault?.id || "";
  const payer = res?.payer || res?.payment_source?.paypal || {};
  return {
    paid,
    amountCents,
    vaultId,
    payerId: payer?.payer_id || "",
    email: payer?.email_address || "",
    raw: res,
  };
}

/**
 * Charge a vaulted payer off-session (auto-renew). Creates + captures an order
 * against the stored vault id in one round-trip. Throws if PayPal declines or the
 * account doesn't support reference transactions.
 */
export async function chargeOffSession({ vaultId, amountCents, description, metadata }) {
  if (!paypalConfigured()) throw new Error("PayPal is not configured");
  if (!vaultId) throw new Error("No vaulted PayPal payer on file");
  const value = usd(amountCents);
  const order = await ppApi("/v2/checkout/orders", {
    body: {
      intent: "CAPTURE",
      purchase_units: [{
        amount: { currency_code: "USD", value },
        custom_id: JSON.stringify(metadata || {}).slice(0, 255),
        description: String(description || "DIGIRINGO renewal").slice(0, 127),
      }],
      payment_source: { paypal: { vault_id: vaultId } },
    },
  });
  // With a vault_id the order is captured immediately (no payer approval).
  if (order?.status === "COMPLETED") return order;
  return ppApi(`/v2/checkout/orders/${encodeURIComponent(order.id)}/capture`, { body: {} });
}

/**
 * Verify a PayPal webhook via the notifications API. Returns the parsed event on a
 * valid signature, else null. Needs PAYPAL_WEBHOOK_ID (from the dashboard).
 */
export async function verifyWebhook(headers, rawBody) {
  const id = webhookId();
  if (!id) return null;
  let event;
  try { event = JSON.parse(rawBody); } catch { return null; }
  const body = {
    auth_algo: headers["paypal-auth-algo"],
    cert_url: headers["paypal-cert-url"],
    transmission_id: headers["paypal-transmission-id"],
    transmission_sig: headers["paypal-transmission-sig"],
    transmission_time: headers["paypal-transmission-time"],
    webhook_id: id,
    webhook_event: event,
  };
  if (!body.transmission_id || !body.transmission_sig) return null;
  try {
    const v = await ppApi("/v1/notifications/verify-webhook-signature", { body });
    return v?.verification_status === "SUCCESS" ? event : null;
  } catch {
    return null;
  }
}
