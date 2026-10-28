/**
 * DIGIRINGO — Telnyx backend proxy + inbox store (Node 18+, zero dependencies).
 *
 * Two jobs:
 *  1) PROXY  — the app calls /api/telnyx/* on YOUR origin; this server forwards
 *     to https://api.telnyx.com/v2/* and injects `Authorization: Bearer <KEY>`
 *     so the secret API key NEVER reaches the browser.
 *  2) INBOX  — Telnyx has no "list conversations" endpoint. This server receives
 *     inbound SMS via the `message.received` webhook, records outbound sends, and
 *     groups them into threads per (owned number, contact). The app reads them at
 *     GET /api/telnyx/messaging/conversations.
 *
 * Run:
 *   TELNYX_API_KEY=KEY_xxx node server/telnyx-proxy.mjs
 *
 * Endpoints:
 *   ANY  /api/telnyx/*                      → forwarded to api.telnyx.com/v2/*
 *   POST /api/telnyx/messages               → forwarded, then recorded as outbound
 *   GET  /api/telnyx/messaging/conversations→ served from the local inbox store
 *   POST /webhooks/telnyx                    → Telnyx events (message.received, DLRs)
 *
 * NOTE: the inbox store is IN-MEMORY (resets on restart). For production, swap the
 * `threads` Map for a database (Postgres/Redis). The route shapes stay identical.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHmac, timingSafeEqual, createPublicKey, randomBytes, verify as edVerify } from "node:crypto";
import { numberPrice, bundleCharge, bundleFor, BUNDLES, MARKUP_PCT, OVERFLOW_RATES } from "./plans.mjs";
import { smsParts } from "./usage-rates.mjs";
import { createUsageSync } from "./usage-billing.mjs";
const markup = (cost, decimals = 3) => Math.round(cost * (1 + MARKUP_PCT / 100) * 10 ** decimals) / 10 ** decimals;
import { sendPush, vapidPublicKey, webPushConfigured } from "./webpush.mjs";
import { createCheckoutSession as stripeCheckout, verifyWebhook as stripeVerify, publishableKey as stripePubKey, stripeConfigured, createCustomer as stripeCreateCustomer, createSetupSession as stripeSetupSession, cardFromIntent as stripeCardFromIntent } from "./stripe.mjs";
import { createCheckoutSession as paypalCheckout, captureOrder as paypalCapture, getOrder as paypalGetOrder, orderMetadata as paypalOrderMeta, verifyWebhook as paypalVerify, clientId as paypalClientId, paypalConfigured } from "./paypal.mjs";
import { freemiusConfigured, verifyWebhook as fsVerifyWebhook, parseEvent as fsParseEvent, grantFor as fsGrantFor, getProductId as fsProductId, getPublicKey as fsPublicKey, getCheckouts as fsCheckouts } from "./freemius.mjs";
import * as settings from "./settings-store.mjs";
import { createTenDlc } from "./tendlc.mjs";
import { sendFcmToUser, sendFcm, fcmConfigured } from "./fcm.mjs";
import { authorizeUrl as oauthAuthorizeUrl, exchangeCode as oauthExchangeCode, providerStatus as oauthProviders, isProvider as oauthIsProvider } from "./oauth.mjs";

// Resolve the app root and load env from a `.env` there (DB creds + all secrets)
// if present — keeps the deployment self-contained and SSH-configurable.
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
try { process.loadEnvFile?.(join(ROOT, ".env")); } catch { /* rely on host-injected env */ }

// DB layer for real auth + persistent wallet. Optional: the site still serves if
// mysql2 / the database is unavailable; the auth & wallet routes then 503.
let db = null;
try { db = await import("./auth-db.mjs"); }
catch (e) { console.warn("⚠ DB layer disabled:", e.message); }

// Email (password-reset). Configured via SMTP_* env; off until set.
let mailer = null;
try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(process.env.SMTP_PORT || 465);
    mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port, secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } else {
    console.warn("⚠ SMTP not configured — password-reset emails won't send.");
  }
} catch (e) { console.warn("⚠ nodemailer unavailable:", e.message); }

async function sendResetEmail(to, name, link) {
  if (!mailer) throw new Error("Email is not configured");
  await mailer.sendMail({
    from: process.env.SMTP_FROM || `DIGIRINGO <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset your DIGIRINGO password",
    html: `<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;padding:8px">
      <h2 style="color:#0a1b3d">Reset your password</h2>
      <p style="color:#475">Hi ${name || "there"}, we got a request to reset your DIGIRINGO password.
      Click the button below to choose a new one. This link expires in 1 hour.</p>
      <p style="margin:26px 0"><a href="${link}" style="background:linear-gradient(120deg,#4f8ef7,#9b6ff7);color:#fff;text-decoration:none;padding:13px 26px;border-radius:10px;font-weight:700;display:inline-block">Reset password</a></p>
      <p style="color:#889;font-size:13px">If you didn't request this, you can safely ignore this email — your password won't change.</p>
      <p style="color:#aab;font-size:12px;word-break:break-all">Or paste this link: ${link}</p>
    </div>`,
  });
}

async function sendVerifyEmail(to, name, link) {
  if (!mailer) throw new Error("Email is not configured");
  await mailer.sendMail({
    from: process.env.SMTP_FROM || `DIGIRINGO <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your DIGIRINGO email",
    html: `<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;padding:8px">
      <h2 style="color:#0a1b3d">Welcome to DIGIRINGO 👋</h2>
      <p style="color:#475">Hi ${name || "there"}, thanks for signing up! Please confirm this is your
      email address by clicking the button below. This link expires in 24 hours.</p>
      <p style="margin:26px 0"><a href="${link}" style="background:linear-gradient(120deg,#4f8ef7,#9b6ff7);color:#fff;text-decoration:none;padding:13px 26px;border-radius:10px;font-weight:700;display:inline-block">Verify email</a></p>
      <p style="color:#889;font-size:13px">If you didn't create a DIGIRINGO account, you can safely ignore this email.</p>
      <p style="color:#aab;font-size:12px;word-break:break-all">Or paste this link: ${link}</p>
    </div>`,
  });
}

const bearer = (req) => {
  const h = req.headers["authorization"] || "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
};

// Admin (Control Hub) auth — a single shared password (ADMIN_PASSWORD) gates the
// dashboard; sessions are short-lived HMAC tokens. No DB needed.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// No guessable fallback: without AUTH_SECRET a random per-boot secret is used.
const ADMIN_SECRET = process.env.AUTH_SECRET || randomBytes(32).toString("hex");
const adminHmac = (s) => createHmac("sha256", ADMIN_SECRET).update(String(s)).digest();
function signAdminToken() {
  const payload = Buffer.from(JSON.stringify({ admin: true, exp: Date.now() + 12 * 3600 * 1000 })).toString("base64url");
  return `${payload}.${createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url")}`;
}
function verifyAdminToken(token) {
  if (!token) return false;
  const [payload, sig] = String(token).split(".");
  if (!payload || !sig) return false;
  const expect = createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(expect);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try { const p = JSON.parse(Buffer.from(payload, "base64url").toString()); return p.admin === true && Date.now() < p.exp; } catch { return false; }
}

// Telnyx webhook signature verification (Ed25519). Set TELNYX_PUBLIC_KEY (the
// base64 public key from the Telnyx portal) to reject spoofed webhooks. If unset,
// verification is skipped (with a warning) so inbound SMS still works meanwhile.
const TELNYX_PUBLIC_KEY = process.env.TELNYX_PUBLIC_KEY;
let telnyxPubKey = null;
if (TELNYX_PUBLIC_KEY) {
  try {
    const raw = Buffer.from(TELNYX_PUBLIC_KEY, "base64");
    const der = Buffer.concat([Buffer.from("302a300506032b6570032100", "hex"), raw]); // SPKI prefix + 32-byte key
    telnyxPubKey = createPublicKey({ key: der, format: "der", type: "spki" });
  } catch (e) { console.warn("⚠ TELNYX_PUBLIC_KEY invalid:", e.message); }
}
function verifyTelnyxWebhook(rawBody, sigB64, timestamp) {
  if (!telnyxPubKey) return true; // not configured → allow (warned at boot)
  if (!sigB64 || !timestamp) return false;
  // Reject replays of an old (validly signed) webhook. Telnyx sends unix seconds;
  // the window is generous so its own delayed retries are never dropped.
  if (!(Math.abs(Date.now() / 1000 - Number(timestamp)) <= 3600)) return false;
  try {
    return edVerify(null, Buffer.from(`${timestamp}|${rawBody}`), telnyxPubKey, Buffer.from(sigB64, "base64"));
  } catch { return false; }
}
if (!TELNYX_PUBLIC_KEY) console.warn("⚠ TELNYX_PUBLIC_KEY not set — webhook signatures NOT verified.");

// The Telnyx API key: a key saved via the Control Hub (encrypted in the DB) wins,
// otherwise the env var — so DB management can never remove a working key (empty
// cache / DB down → env fallback = today's behaviour). Read through telnyxKey().
const telnyxKey = () => settings.getSecret("TELNYX_API_KEY") || process.env.TELNYX_API_KEY || "";
// Hostinger (and most PaaS) inject the port to listen on via PORT.
const PORT = Number(process.env.PORT ?? process.env.TELNYX_PROXY_PORT ?? 8787);
const TELNYX = "https://api.telnyx.com/v2";
const PREFIX = "/api/telnyx";

// (ROOT/DIST resolved above — this one Node server hosts the marketing site (/),
// the app (/app) and the Control Hub (/admin) alongside the API.)

// Payments run through Stripe (hosted Checkout) — see server/stripe.mjs.
// The browser opens Stripe's Checkout; fulfilment happens via the signed webhook.
// No card secrets live in this process.

// The Telnyx key is optional at boot: without it the static site still serves
// (so the marketing pages are live even before Telnyx is configured); the
// /api/telnyx/* routes just answer 503 until the key is set in the host's env.
if (!telnyxKey()) {
  console.warn("⚠ TELNYX_API_KEY not set — serving site only; /api/telnyx/* will return 503.");
}

/* ---- Telnyx rates cache (fetched from /v2/pricing, refreshed every 24h) ---- */
const ratesMarkup = (cost, decimals = 3) => Math.round(cost * (1 + MARKUP_PCT / 100) * 10 ** decimals) / 10 ** decimals;

// Wholesale usage rates — env-overridable so they can be updated without redeploy
const WHOLESALE_USAGE = {
  voice:        Number(process.env.TELNYX_VOICE_RATE       ?? 0.006),
  sms_local:    Number(process.env.TELNYX_SMS_LOCAL_RATE    ?? 0.006),
  sms_tollfree: Number(process.env.TELNYX_SMS_TF_RATE      ?? 0.008),
  sms_shortcode:Number(process.env.TELNYX_SMS_SC_RATE      ?? 0.01),
  mms_out:      Number(process.env.TELNYX_MMS_OUT_RATE     ?? 0.018),
  mms_in:       Number(process.env.TELNYX_MMS_IN_RATE      ?? 0.006),
};

let _ratesCache = null;
let _ratesCacheAt = 0;
const RATES_TTL = 24 * 60 * 60 * 1000; // 24h

/** One CSV line → cells (Telnyx quotes names like "Korea, Republic of"). */
function csvCells(line) {
  const out = []; let cur = "", q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

// Telnyx's price sheet, per country and line type (wholesale USD).
const PRICE_TYPES = { "local": "local", "mobile": "mobile", "national": "national", "toll free": "toll_free", "shared cost": "shared_cost" };
let priceSheet = null; // { at, rows: { [iso]: { name, types: { [type]: { setup, monthly, inLandline, inMobile } } } } }
async function telnyxPriceSheet() {
  if (priceSheet && Date.now() - priceSheet.at < RATES_TTL) return priceSheet.rows;
  const r = await fetch(`${TELNYX}/pricing`, { headers: { Authorization: `Bearer ${telnyxKey()}` } });
  if (!r.ok) { if (priceSheet) return priceSheet.rows; throw new Error(`pricing → HTTP ${r.status}`); }
  const rows = {};
  for (const line of (await r.text()).trim().split(/\r?\n/).slice(1)) {
    const [iso, name, , rawType, setup, monthly, inLandline, inMobile] = csvCells(line);
    const type = PRICE_TYPES[String(rawType).toLowerCase()];
    if (!/^[A-Z]{2}$/.test(iso || "") || !type) continue;
    rows[iso] ??= { name, types: {} };
    rows[iso].types[type] = { setup: +setup || 0, monthly: +monthly || 0, inLandline: +inLandline || 0, inMobile: +inMobile || 0 };
  }
  priceSheet = { at: Date.now(), rows };
  return rows;
}

// What Telnyx actually quotes for a number of this country + type right now
// (the price sheet's US row, for one, is not what US numbers cost).
const quoteCache = new Map();
async function liveNumberQuote(iso, type) {
  const k = `${iso}:${type}`, hit = quoteCache.get(k);
  if (hit && Date.now() - hit.at < 6 * 3600_000) return hit.q;
  const r = await telnyxFetch(`/available_phone_numbers?filter[country_code]=${iso}&filter[phone_number_type]=${encodeURIComponent(type)}&filter[limit]=1`);
  const ci = (await r.json().catch(() => ({})))?.data?.[0]?.cost_information;
  const q = ci ? { setup: parseFloat(ci.upfront_cost) || 0, monthly: parseFloat(ci.monthly_cost) || 0 } : null;
  quoteCache.set(k, { q, at: Date.now() });
  return q;
}

/** Retail rates for one country: each number type it sells, plus calling/texting. */
async function countryRates(iso) {
  const [sheet, coverage] = await Promise.all([telnyxPriceSheet().catch(() => ({})), numberCountries().catch(() => [])]);
  const cov = coverage.find((c) => c.iso === iso);
  const row = sheet[iso];
  if (!cov && !row) return null;
  const types = cov?.types?.length ? cov.types : Object.keys(row?.types || {});
  const numbers = [];
  for (const type of types) {
    const p = row?.types?.[type] || {};
    const q = await liveNumberQuote(iso, type).catch(() => null);
    const monthly = q?.monthly || p.monthly || 0;
    if (!monthly) continue;
    const setup = q ? q.setup : p.setup || 0;
    numbers.push({
      type,
      monthly: markup(monthly, 2),
      // Today's charge for a new number is the higher of setup and the first month.
      firstCharge: markup(Math.max(monthly, setup), 2),
      // US/CA aren't on the sheet's inbound columns; they bill at the domestic voice rate.
      incomingPerMin: p.inLandline ? markup(Math.max(p.inLandline, p.inMobile || 0), 3)
        : iso === "US" || iso === "CA" ? markup(WHOLESALE_USAGE.voice, 3) : null,
    });
  }
  const u = (k) => markup(WHOLESALE_USAGE[k], 3);
  return {
    iso, name: cov?.name || row?.name || iso, numbers,
    outbound: { callsPerMin: u("voice"), smsPerMsg: u("sms_local"), tollFreeSmsPerMsg: u("sms_tollfree"), mmsPerMsg: u("mms_out") },
  };
}

async function fetchTelnyxPricing() {
  if (!telnyxKey()) return null;
  try {
    const rows = await telnyxPriceSheet();
    const numbers = {};
    for (const [iso, { types }] of Object.entries(rows)) {
      for (const [type, p] of Object.entries(types)) {
        if (p.monthly <= 0) continue;
        numbers[iso] ??= {};
        numbers[iso][type.replace("_", " ")] = { wholesale: p.monthly, retail: ratesMarkup(p.monthly, 2) };
      }
    }
    // US/CA: the sheet's rows aren't what those numbers cost — use live quotes.
    for (const iso of ["US", "CA"]) {
      for (const type of ["local", "toll_free"]) {
        const q = await liveNumberQuote(iso, type).catch(() => null);
        if (q?.monthly) (numbers[iso] ??= {})[type.replace("_", " ")] = { wholesale: q.monthly, retail: ratesMarkup(q.monthly, 2) };
      }
    }
    return numbers;
  } catch (e) { console.error("Failed to fetch Telnyx pricing:", e.message); return null; }
}

async function getRatesWithMarkup() {
  if (_ratesCache && Date.now() - _ratesCacheAt < RATES_TTL) return _ratesCache;
  const numberPricing = await fetchTelnyxPricing();
  const usage = Object.fromEntries(
    Object.entries(WHOLESALE_USAGE).map(([k, w]) => [k, { wholesale: w, retail: ratesMarkup(w, 3) }])
  );
  _ratesCache = {
    markupPct: MARKUP_PCT,
    usage,
    numbers: numberPricing || _ratesCache?.numbers || {},
    cachedAt: new Date().toISOString(),
  };
  _ratesCacheAt = Date.now();
  return _ratesCache;
}

/* ---- Blog ---- */
let blogTableReady = false;
async function ensureBlogTable() {
  if (blogTableReady || !db) return;
  await db.rawQuery(`CREATE TABLE IF NOT EXISTS blog_posts (
    id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title      TEXT         NOT NULL,
    slug       VARCHAR(255) NOT NULL UNIQUE,
    excerpt    TEXT,
    body       LONGTEXT,
    cover_url  TEXT,
    author     VARCHAR(255) NOT NULL DEFAULT 'DIGIRINGO',
    tags       TEXT,
    status     ENUM('draft','published') NOT NULL DEFAULT 'draft',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blog_status (status),
    INDEX idx_blog_slug (slug)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  blogTableReady = true;
}
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 200);
}

/* ---- Control Hub config (Payments / Integrations / Settings) helpers ---- */
const nowId = () => Date.now().toString(36) + createHmac("sha256", ADMIN_SECRET).update(String(process.hrtime.bigint())).digest("hex").slice(0, 5);
// Secrets the dashboard is allowed to store (encrypted). These override the env.
const ALLOWED_SECRETS = new Set(["TELNYX_API_KEY", "STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET", "PAYPAL_CLIENT_ID", "PAYPAL_SECRET", "PAYPAL_CLIENT_SECRET", "PAYPAL_WEBHOOK_ID", "SMTP_PASS", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "APPLE_SERVICES_ID", "APPLE_TEAM_ID", "APPLE_KEY_ID", "APPLE_PRIVATE_KEY"]);
const PROVIDER_SECRET = { stripe: "STRIPE_SECRET_KEY", paypal: "PAYPAL_SECRET" };
const GENERAL_DEFAULTS = { platformName: "DIGIRINGO", supportEmail: "support@digiringo.com", currency: "USD", platformFeePct: 0, payoutSchedule: "Daily", payoutDestination: "Stripe" };

/** Real status for a secret: a value saved via the Control Hub (encrypted in the
 *  DB) wins, else the live env var. `source` tells the UI which is active. */
function secretStatus(name, envVar) {
  const m = settings.secretMeta(name);
  if (m.set) return { status: "set", last4: m.last4, source: "dashboard" };
  const ev = process.env[envVar];
  if (ev) return { status: "set", last4: String(ev).replace(/\s/g, "").slice(-4), source: "env" };
  return { status: "missing" };
}
function shortDate(iso) { try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return "—"; } }
function defaultWebhooks() {
  return [
    { id: "wh_telnyx", label: "Telnyx — inbound SMS & DLR", url: "/webhooks/telnyx", enabled: true, secretSet: !!TELNYX_PUBLIC_KEY },
    { id: "wh_paypal", label: "PayPal — payment events", url: "/api/paypal/webhook", enabled: true, secretSet: secretStatus("PAYPAL_WEBHOOK_ID", "PAYPAL_WEBHOOK_ID").status === "set" },
    { id: "wh_stripe", label: "Stripe — payment events", url: "/api/stripe/webhook", enabled: true, secretSet: secretStatus("STRIPE_WEBHOOK_SECRET", "STRIPE_WEBHOOK_SECRET").status === "set" },
    { id: "wh_freemius", label: "Freemius — payment events", url: "/api/freemius/webhook", enabled: true, secretSet: !!process.env.FREEMIUS_SECRET_KEY },
  ];
}
/** Assemble the full Control Hub config from the encrypted store + live env. */
function buildConfig() {
  const cred = (id, service, blurb, name, envVar) => ({ id, service, blurb, ...secretStatus(name, envVar) });
  const credentials = [
    cred("telnyx", "Telnyx", "Numbers, SMS, voice, 10DLC", "TELNYX_API_KEY", "TELNYX_API_KEY"),
    cred("stripe", "Stripe", "Payments secret key (sk_live_…)", "STRIPE_SECRET_KEY", "STRIPE_SECRET_KEY"),
    cred("paypal_id", "PayPal client id", "REST app client id (public)", "PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_ID"),
    cred("paypal", "PayPal secret", "REST app secret", "PAYPAL_SECRET", "PAYPAL_SECRET"),
    cred("freemius_pk", "Freemius public key", "pk_… (public, also sent to browser)", "FREEMIUS_PUBLIC_KEY", "FREEMIUS_PUBLIC_KEY"),
    cred("freemius_sk", "Freemius secret key", "sk_… (webhook signature)", "FREEMIUS_SECRET_KEY", "FREEMIUS_SECRET_KEY"),
    cred("smtp", "Email (SMTP)", "Transactional / password-reset email", "SMTP_PASS", "SMTP_PASS"),
    cred("google_id", "Google sign-in — client id", "OAuth client id (…apps.googleusercontent.com)", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_ID"),
    cred("google_secret", "Google sign-in — secret", "OAuth client secret", "GOOGLE_CLIENT_SECRET", "GOOGLE_CLIENT_SECRET"),
    cred("apple_sid", "Apple sign-in — Services ID", "Apple Services ID (the client_id)", "APPLE_SERVICES_ID", "APPLE_SERVICES_ID"),
    cred("apple_key", "Apple sign-in — key (.p8)", "Sign in with Apple private key", "APPLE_PRIVATE_KEY", "APPLE_PRIVATE_KEY"),
  ];
  const prov = settings.getJSON("providers", {});
  const stripeS = secretStatus("STRIPE_SECRET_KEY", "STRIPE_SECRET_KEY");
  const paypalS = secretStatus("PAYPAL_SECRET", "PAYPAL_SECRET");
  const providers = [
    { id: "stripe", name: "Stripe", blurb: "Card payments, subscriptions & payouts", connected: stripeS.status === "set", enabled: prov.stripe?.enabled ?? (stripeS.status === "set"), secretLast4: stripeS.last4, account: prov.stripe?.account || "" },
    { id: "paypal", name: "PayPal", blurb: "PayPal balance & checkout", connected: paypalConfigured(), enabled: prov.paypal?.enabled ?? paypalConfigured(), secretLast4: paypalS.last4, account: prov.paypal?.account || "" },
    { id: "freemius", name: "Freemius", blurb: "Merchant of Record — hosted checkout", connected: freemiusConfigured(), enabled: prov.freemius?.enabled ?? freemiusConfigured(), account: prov.freemius?.account || "" },
    { id: "bank", name: "Bank transfer", blurb: "Manual / wire top-ups", connected: !!prov.bank?.connected, enabled: prov.bank?.enabled ?? false, account: prov.bank?.account || "" },
  ];
  const general = { ...GENERAL_DEFAULTS, ...settings.getJSON("general", {}) };
  const platformKeys = settings.getJSON("platformKeys", []).map((k) => ({ id: k.id, name: k.name, masked: `pk_live_••••••••${k.last4}`, created: shortDate(k.created), lastUsed: "—" }));
  const webhooks = settings.getJSON("webhooks", null) || defaultWebhooks();
  return { providers, credentials, platformKeys, webhooks, general };
}

/* ------------------------------------------------------------------ helpers */
// CORS: only our own front-ends may call the API from a browser — the website,
// the Capacitor app (https://localhost / capacitor://localhost) and local dev.
// Extra origins can be added with CORS_ORIGINS (comma-separated). Server-to-
// server callers (webhooks, curl) send no Origin and are unaffected.
const CORS_ORIGINS = new Set([
  "https://digiringo.com", "https://www.digiringo.com",
  "https://localhost", "capacitor://localhost", "http://localhost",
  "http://localhost:5173", "http://localhost:8788", "http://127.0.0.1:5173", "http://127.0.0.1:8788",
  ...String(process.env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
]);
const corsHeaders = (res) => {
  const origin = res.req?.headers?.origin;
  if (!origin || !CORS_ORIGINS.has(origin)) return { Vary: "Origin" };
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    Vary: "Origin",
  };
};
const send = (res, status, body) => {
  if (res.headersSent) { try { res.end(); } catch { /* ignore */ } return; }
  res.writeHead(status, { "Content-Type": "application/json", ...corsHeaders(res) });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
};

const readBody = async (req) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return chunks.length ? Buffer.concat(chunks).toString() : "";
};

/** 302 redirect (used by the OAuth start/callback flow). */
const redirect = (res, location) => { res.writeHead(302, { Location: location }); res.end(); };

/* ----------------------------------------------------------- OAuth state store
 * A short-lived, in-memory CSRF/flow map: a random `state` we hand to the
 * provider and validate on the callback. Also remembers whether the flow was
 * started by the web app or the native app, so the callback knows where to send
 * the session token back. Single-process server, so a Map is enough. */
const oauthStates = new Map();
const OAUTH_STATE_TTL = 10 * 60 * 1000;
function newOAuthState(provider, flow) {
  const state = createHmac("sha256", ADMIN_SECRET).update(`${Date.now()}:${Math.random()}:${provider}`).digest("hex");
  oauthStates.set(state, { provider, flow, exp: Date.now() + OAUTH_STATE_TTL });
  // Opportunistic cleanup of expired entries.
  if (oauthStates.size > 500) for (const [k, v] of oauthStates) if (v.exp < Date.now()) oauthStates.delete(k);
  return state;
}
function takeOAuthState(state) {
  const s = oauthStates.get(state);
  if (!s) return null;
  oauthStates.delete(state);
  return s.exp < Date.now() ? null : s;
}

/* --------------------------------------------------- wallet charge (in-app pay) */
const payErr = (status, msg) => { const e = new Error(msg); e.status = status; return e; };

/**
 * Take payment of `amount` USD from a user's wallet balance. The SERVER decides
 * the amount — callers pass the authoritative figure from plans.mjs, never a
 * client-sent price. Direct card payments go through Stripe's hosted Checkout
 * (which credits the wallet / activates the plan via webhook), so anything paid
 * here draws from the prepaid wallet. Throws payErr(402) if the balance is short.
 */
async function takePayment(uid, amount, label) {
  const wallet = await db.debitWallet(uid, amount, label); // throws 402 if insufficient
  return { method: "wallet", wallet };
}

/* ------------------------------------------------------------ static serving */
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
  ".map": "application/json", ".csv": "text/csv", ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json", ".wasm": "application/wasm",
};

// Clean URLs → built HTML entries. Root is the marketing site; the app and the
// Control Hub live under /app and /admin.
// /privacy and /terms are standalone static pages (Google Play requires a public,
// stable privacy-policy URL for the store listing).
const PAGE_ROUTES = {
  "/": "site.html",
  "/app": "index.html",
  "/admin": "admin.html",
  "/privacy": "privacy.html",
  "/terms": "terms.html",
  "/delete-account": "delete-account.html",
};

async function tryFile(absPath) {
  try {
    const s = await stat(absPath);
    if (s.isFile()) return absPath;
  } catch { /* not found */ }
  return null;
}

/** Serve the built front-end from /dist. Returns true if it handled the request. */
async function serveStatic(req, res) {
  // strip query/hash, decode, and prevent path traversal
  let pathname = "/";
  try { pathname = decodeURIComponent((req.url || "/").split("?")[0].split("#")[0]); } catch { /* malformed %-escape → site fallback */ }
  const clean = pathname.replace(/\/+$/, "") || "/";

  let filePath = null;
  if (PAGE_ROUTES[clean]) {
    filePath = join(DIST, PAGE_ROUTES[clean]);
  } else {
    // safe-join inside DIST
    const rel = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    const candidate = join(DIST, rel);
    if (candidate.startsWith(DIST)) filePath = await tryFile(candidate);
  }

  // SPA / unknown-route fallback → marketing site (its router is hash-based)
  if (!filePath) filePath = join(DIST, "site.html");

  try {
    const data = await readFile(filePath);
    const type = MIME[extname(filePath)] || "application/octet-stream";
    const cacheable = filePath.includes(`${join("dist", "assets")}`) || /\.(png|jpe?g|svg|webp|woff2?|ico)$/.test(filePath);
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": cacheable ? "public, max-age=31536000, immutable" : "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found. Did you run `npm run build`?");
  }
  return true;
}

const digits = (s) => (s ?? "").replace(/\D/g, "");

// Parse a "M:SS" / "H:MM:SS" call duration into billed minutes (rounded up per
// minute, min 1 for any connected call). Empty/"0:00" → 0 (nothing to meter).
const callMinutes = (dur) => {
  const s = String(dur || "").trim();
  if (!s) return 0;
  const parts = s.split(":").map((n) => parseInt(n, 10));
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return 0;
  const sec = parts.reduce((acc, p) => acc * 60 + p, 0);
  return sec > 0 ? Math.ceil(sec / 60) : 0;
};
const shortTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const flagFor = (e164) => {
  const d = digits(e164);
  if (d.startsWith("1")) return "🇺🇸";
  if (d.startsWith("44")) return "🇬🇧";
  if (d.startsWith("92")) return "🇵🇰";
  if (d.startsWith("91")) return "🇮🇳";
  if (d.startsWith("971")) return "🇦🇪";
  if (d.startsWith("61")) return "🇦🇺";
  return "🌐";
};

const telnyxFetch = (path, init = {}) =>
  fetch(TELNYX + path, {
    ...init,
    headers: { Authorization: `Bearer ${telnyxKey()}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });

let statusCache = null; // /api/status result, refreshed at most once a minute

// Per-user 10DLC (US SMS registration) — see tendlc.mjs.
const tenDlc = db ? createTenDlc({ db, telnyxFetch }) : null;

/* ------------------------------------------------------ WebRTC (browser voice)
 * Real in-browser calling uses the Telnyx WebRTC SDK, which logs in with an
 * ephemeral JWT minted here from a Credential Connection — the SIP password
 * NEVER reaches the browser. We resolve the connection once, then create (and
 * cache) one short-lived telephony credential + token, refreshing before expiry.
 */
// Find (or create) an enabled Outbound Voice Profile — REQUIRED for outbound
// calls. Without an OVP attached to the connection, Telnyx rejects the call.
async function ensureOutboundProfileId() {
  const r = await telnyxFetch("/outbound_voice_profiles?page[size]=1");
  const j = await r.json().catch(() => ({}));
  if (j?.data?.[0]?.id) return j.data[0].id;
  const cr = await telnyxFetch("/outbound_voice_profiles", {
    method: "POST", body: JSON.stringify({ name: "DIGIRINGO Voice" }),
  });
  const cj = await cr.json().catch(() => ({}));
  if (!cr.ok || !cj?.data?.id) throw new Error(cj?.errors?.[0]?.detail || "Could not create outbound voice profile");
  return cj.data.id;
}

// Resolve the credential connection used for the WebRTC softphone. We use a
// DEDICATED connection ("DIGIRINGO WebRTC") with an OVP attached so outbound
// calling works — without touching any pre-existing connection. Auto-created on
// first use; override with TELNYX_SIP_CONNECTION_ID.
let SIP_CONN = null;
const SIP_CONN_NAME = "DIGIRINGO WebRTC";
async function getSipConnectionId() {
  if (SIP_CONN) return SIP_CONN;
  if (process.env.TELNYX_SIP_CONNECTION_ID) return (SIP_CONN = process.env.TELNYX_SIP_CONNECTION_ID);
  // reuse ours if it already exists
  const list = await telnyxFetch("/credential_connections?page[size]=100");
  const lj = await list.json().catch(() => ({}));
  const existing = (lj.data || []).find((c) => c.connection_name === SIP_CONN_NAME);
  if (existing) return (SIP_CONN = existing.id);
  // create a dedicated credential connection with an OVP for outbound
  const ovp = await ensureOutboundProfileId();
  const rand = () => Math.random().toString(36).slice(2, 12);
  const cr = await telnyxFetch("/credential_connections", {
    method: "POST",
    body: JSON.stringify({
      connection_name: SIP_CONN_NAME,
      user_name: `digiringo${rand()}`,
      password: `Dg${rand()}${rand()}`,
    }),
  });
  const cj = await cr.json().catch(() => ({}));
  if (!cr.ok || !cj?.data?.id) throw new Error(cj?.errors?.[0]?.detail || "Could not create WebRTC connection");
  const newId = cj.data.id;
  // Attach the OVP so OUTBOUND works. Must be a NESTED PATCH — Telnyx silently
  // ignores `outbound_voice_profile_id` on the create body.
  await telnyxFetch(`/credential_connections/${newId}`, {
    method: "PATCH", body: JSON.stringify({ outbound: { outbound_voice_profile_id: ovp } }),
  }).catch(() => {});
  return (SIP_CONN = newId);
}

// The WebRTC client logs in with the credential connection's STATIC SIP
// username/password — NOT an on-demand telephony-credential token. Telnyx
// on-demand credentials are OUTBOUND-ONLY (inbound calls never ring them), so
// they broke incoming calls. Static credential-connection logins receive
// inbound. We set a DETERMINISTIC password (derived from AUTH_SECRET) on the
// connection so the server always knows it without persisting anything.
let SIP_CREDS = null;
async function ensureSipCreds() {
  if (SIP_CREDS) return SIP_CREDS;
  const connId = await getSipConnectionId();
  // Telnyx requires SIP username/password to be ALPHANUMERIC only (no symbols,
  // no spaces). Hex digests satisfy this.
  const login = "digiringowebrtc";
  const password = "Dg" + createHmac("sha256", process.env.AUTH_SECRET || "digiringo")
    .update("sip:" + connId).digest("hex").slice(0, 26);
  // Set the connection's SIP credentials to our known values (idempotent).
  const r = await telnyxFetch(`/credential_connections/${connId}`, {
    method: "PATCH", body: JSON.stringify({ user_name: login, password }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.errors?.[0]?.detail || "Could not set SIP credentials");
  }
  SIP_CREDS = { login, password };
  return SIP_CREDS;
}

/* Per-user WebRTC identity — each user gets their OWN Telnyx CREDENTIAL CONNECTION
 * (static username/password). This is deliberate: on-demand telephony credentials
 * are OUTBOUND-ONLY (inbound never rings them), which sent every incoming call to
 * voicemail even with the app open. A registered credential connection RECEIVES
 * inbound, so the TeXML <Dial><Sip> leg rings the right user's softphone. Creds
 * are deterministic (derived from AUTH_SECRET + uid) — nothing secret persisted. */
const userSipPassword = (uid) =>
  "Dg" + createHmac("sha256", process.env.AUTH_SECRET || "digiringo").update("sipuser:" + uid).digest("hex").slice(0, 26);

async function ensureUserSipCredential(uid) {
  const v = await db.getVoiceSettings(uid);
  const username = `digiringou${uid}`;            // Telnyx SIP usernames must be alphanumeric
  const password = userSipPassword(uid);
  // Reuse the stored per-user credential connection if it still exists.
  if (v.sipCredentialId && String(v.sipUsername || "").startsWith("digiringou")) {
    const chk = await telnyxFetch(`/credential_connections/${v.sipCredentialId}`).catch(() => null);
    if (chk && chk.ok) {
      await telnyxFetch(`/credential_connections/${v.sipCredentialId}`, {
        // sip_uri_calling_preference must be enabled or dialing sip:user@sip.telnyx.com
        // from the TeXML app is REJECTED with SIP 403 → the call never rings the app.
        method: "PATCH", body: JSON.stringify({ user_name: username, password, sip_uri_calling_preference: "unrestricted" }),
      }).catch(() => {}); // keep creds pinned to our known values (idempotent)
      return { credentialId: v.sipCredentialId, sipUsername: username, password };
    }
  }
  // Create a dedicated per-user credential connection (+ OVP so outbound works).
  const ovp = await ensureOutboundProfileId().catch(() => null);
  const cr = await telnyxFetch("/credential_connections", {
    method: "POST", body: JSON.stringify({ connection_name: `DIGIRINGO u${uid}`, user_name: username, password, sip_uri_calling_preference: "unrestricted" }),
  });
  const cj = await cr.json().catch(() => ({}));
  if (!cr.ok || !cj?.data?.id) throw new Error(cj?.errors?.[0]?.detail || "Could not create voice identity");
  const connId = cj.data.id;
  if (ovp) await telnyxFetch(`/credential_connections/${connId}`, {
    method: "PATCH", body: JSON.stringify({ outbound: { outbound_voice_profile_id: ovp } }),
  }).catch(() => {});
  await db.setSipCredential(uid, { sipUsername: username, sipCredentialId: connId });
  return { credentialId: connId, sipUsername: username, password };
}

/* Per-DEVICE WebRTC identity. A Telnyx credential connection accepts only ONE
 * registration at a time, so the phone and the browser sharing the per-USER
 * credential kicked each other in a ~2s takeover loop and inbound rang neither.
 * Giving each device its OWN credential lets them all stay registered; the
 * inbound TeXML then rings every active device in parallel (ring on BOTH). */
const MAX_DEVICES_PER_USER = 5;
const deviceSipUsername = (uid, deviceId) =>
  `digiringou${uid}d` + createHmac("sha256", process.env.AUTH_SECRET || "digiringo").update("sipdevice:" + uid + ":" + deviceId).digest("hex").slice(0, 10);
const deviceSipPassword = (uid, deviceId) =>
  "Dg" + createHmac("sha256", process.env.AUTH_SECRET || "digiringo").update("sipdevicepw:" + uid + ":" + deviceId).digest("hex").slice(0, 26);

async function ensureDeviceSipCredential(uid, deviceId, platform = "") {
  const username = deviceSipUsername(uid, deviceId);
  const password = deviceSipPassword(uid, deviceId);

  // Reuse this device's credential connection if it still exists on Telnyx.
  const existing = await db.getSipDevice(uid, deviceId).catch(() => null);
  if (existing?.sipCredentialId) {
    const chk = await telnyxFetch(`/credential_connections/${existing.sipCredentialId}`).catch(() => null);
    if (chk && chk.ok) {
      await telnyxFetch(`/credential_connections/${existing.sipCredentialId}`, {
        method: "PATCH", body: JSON.stringify({ user_name: username, password, sip_uri_calling_preference: "unrestricted" }),
      }).catch(() => {});
      await db.upsertSipDevice(uid, { deviceId, sipUsername: username, sipCredentialId: existing.sipCredentialId, platform });
      return { credentialId: existing.sipCredentialId, sipUsername: username, password };
    }
  }

  // Evict the least-recently-used device(s) so credential connections stay bounded.
  try {
    const devs = await db.listSipDevices(uid);
    const stale = devs.filter((d) => d.deviceId !== deviceId).slice(MAX_DEVICES_PER_USER - 1);
    for (const d of stale) {
      if (d.sipCredentialId) await telnyxFetch(`/credential_connections/${d.sipCredentialId}`, { method: "DELETE" }).catch(() => {});
      await db.deleteSipDevice(uid, d.deviceId).catch(() => {});
    }
  } catch { /* eviction is best-effort */ }

  // Create a fresh per-device credential connection (+ OVP so outbound works).
  const ovp = await ensureOutboundProfileId().catch(() => null);
  const cr = await telnyxFetch("/credential_connections", {
    method: "POST", body: JSON.stringify({ connection_name: `DIGIRINGO u${uid} ${platform || "dev"} ${username}`.slice(0, 60), user_name: username, password, sip_uri_calling_preference: "unrestricted" }),
  });
  const cj = await cr.json().catch(() => ({}));
  if (!cr.ok || !cj?.data?.id) throw new Error(cj?.errors?.[0]?.detail || "Could not create device voice identity");
  const connId = cj.data.id;
  if (ovp) await telnyxFetch(`/credential_connections/${connId}`, {
    method: "PATCH", body: JSON.stringify({ outbound: { outbound_voice_profile_id: ovp } }),
  }).catch(() => {});
  await db.upsertSipDevice(uid, { deviceId, sipUsername: username, sipCredentialId: connId, platform });
  return { credentialId: connId, sipUsername: username, password };
}

/* --------------------------------------------------- incoming-call routing (TeXML)
 * Every owned number points its inbound at ONE TeXML application whose Voice URL
 * is /webhooks/texml here. On an inbound call we answer with TeXML that rings the
 * user's in-app WebRTC softphone first, then their forwarding cellphone, then
 * records voicemail — so a call reaches them whether or not the app is open. */
const PUBLIC_BASE = (process.env.PUBLIC_BASE_URL || "https://digiringo.com").replace(/\/$/, "");
let TEXML_APP = null;
const TEXML_APP_NAME = "DIGIRINGO Inbound";
async function getTexmlAppId() {
  if (TEXML_APP) return TEXML_APP;
  if (process.env.TELNYX_TEXML_APP_ID) return (TEXML_APP = process.env.TELNYX_TEXML_APP_ID);
  const list = await telnyxFetch("/texml_applications?page[size]=100");
  const lj = await list.json().catch(() => ({}));
  const existing = (lj.data || []).find((a) => a.friendly_name === TEXML_APP_NAME);
  if (existing) return (TEXML_APP = existing.id);
  const cr = await telnyxFetch("/texml_applications", { method: "POST", body: JSON.stringify({
    friendly_name: TEXML_APP_NAME, voice_url: `${PUBLIC_BASE}/webhooks/texml`,
    voice_method: "post", active: true, anchorsite_override: "Latency",
  }) });
  const cj = await cr.json().catch(() => ({}));
  if (!cr.ok || !cj?.data?.id) throw new Error(cj?.errors?.[0]?.detail || "Could not create inbound app");
  return (TEXML_APP = cj.data.id);
}

// Inbound SMS reach us only if the number's MESSAGING PROFILE has its webhook_url
// pointed at /webhooks/telnyx (the mirror of getTexmlAppId's voice_url for calls).
// Numbers are provisioned onto VITE_TELNYX_MESSAGING_PROFILE_ID, so we (re)point
// that profile's inbound webhook at boot — otherwise texts to owned numbers are
// silently dropped by Telnyx (there's nowhere to deliver message.received).
let MSG_PROFILE_OK = false;
async function ensureMessagingProfile() {
  if (MSG_PROFILE_OK) return;
  const mp = process.env.VITE_TELNYX_MESSAGING_PROFILE_ID;
  if (!mp) { console.warn("⚠ VITE_TELNYX_MESSAGING_PROFILE_ID not set — inbound SMS webhook can't be configured."); return; }
  const want = `${PUBLIC_BASE}/webhooks/telnyx`;
  const r = await telnyxFetch(`/messaging_profiles/${mp}`);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { console.error("messaging profile fetch failed:", j?.errors?.[0]?.detail || r.status); return; }
  const cur = j?.data?.webhook_url || null;
  if (cur === want && j?.data?.webhook_api_version === "2") { MSG_PROFILE_OK = true; return; }
  const pr = await telnyxFetch(`/messaging_profiles/${mp}`, { method: "PATCH", body: JSON.stringify({
    webhook_url: want, webhook_api_version: "2",
  }) });
  if (pr.ok) { MSG_PROFILE_OK = true; console.log(`✓ inbound SMS webhook set on messaging profile → ${want}`); }
  else { const pj = await pr.json().catch(() => ({})); console.error("could not set messaging webhook:", pj?.errors?.[0]?.detail || pr.status); }
}

const xmlEsc = (s) => String(s || "").replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));
const texmlResponse = (inner) => `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n${inner}\n</Response>`;

/** The voicemail (or graceful goodbye) tail of an inbound flow. */
function voicemailTeXML(owner, to, from) {
  if (owner?.voicemailEnabled) {
    const cb = `${PUBLIC_BASE}/webhooks/texml/voicemail?to=${encodeURIComponent(to)}&from=${encodeURIComponent(from)}`;
    return texmlResponse(
      `  <Say voice="Polly.Joanna">You've reached ${xmlEsc(owner?.name ? owner.name.split(" ")[0] : "a DIGIRINGO customer")}. Please leave a message after the tone.</Say>\n` +
      `  <Record maxLength="120" playBeep="true" trim="trim-silence" recordingStatusCallback="${xmlEsc(cb)}" recordingStatusCallbackMethod="POST" />\n` +
      `  <Hangup/>`
    );
  }
  return texmlResponse(`  <Say voice="Polly.Joanna">This number is not available right now. Goodbye.</Say>\n  <Hangup/>`);
}

/** Build the TeXML for a given stage of the inbound ring chain. Stateless: the
 *  owner is re-resolved from `to` each hop, and `stage`/to/from ride the action URL. */
async function inboundTeXML({ stage, to, from }) {
  const owner = db ? await db.findNumberOwner(to).catch(() => null) : null;
  // Number isn't ours (or DB down) → straight to a graceful voicemail/goodbye.
  if (!owner) return texmlResponse(`  <Say voice="Polly.Joanna">This number is not available right now. Goodbye.</Say>\n  <Hangup/>`);

  // Talk-time budget (plan minutes left + wallet-funded overflow, minus calls
  // already burning). Out of budget → don't ring anything billable; go straight
  // to voicemail. Otherwise cap every <Dial> leg with timeLimit so Telnyx CUTS
  // the call when the budget runs out — even mid-conversation.
  let capSec = 14400; // Telnyx max 4h
  try {
    const rem = await db.voiceRemainingSec(owner.userId, liveCallList(owner.userId), { to, inbound: true });
    if (rem < 30) return voicemailTeXML(owner, to, from);
    capSec = Math.min(capSec, rem);
  } catch { /* budget check is best-effort — never kill inbound on a DB blip */ }

  const qs = (s) => `${PUBLIC_BASE}/webhooks/texml?stage=${s}&to=${encodeURIComponent(to)}&from=${encodeURIComponent(from)}`;

  // Per-number custom routing (set by the user in Number settings) OVERRIDES the
  // default softphone→cellphone→voicemail chain on the first hop: the call goes
  // straight to the user's own destination — a phone, a SIP agent, or their own
  // TeXML webhook (a "caller agent" that controls the call). Any failed/ended leg
  // falls through to voicemail. Only applied at "start"; later hops (fwd/vm) keep
  // the normal tail. NB: a <Redirect> hands control to the user's server, so our
  // per-call timeLimit budget cap can't be enforced past that point (the pre-call
  // budget gate above still applies).
  if (stage === "start" && owner.routeKind && owner.routeKind !== "app" && owner.routeDest) {
    const vmAction = xmlEsc(qs("vm"));
    if (owner.routeKind === "webhook") {
      return texmlResponse(`  <Redirect method="POST">${xmlEsc(owner.routeDest)}</Redirect>`);
    }
    if (owner.routeKind === "sip") {
      return texmlResponse(
        `  <Dial timeout="30" timeLimit="${capSec}" answerOnBridge="true" callerId="${xmlEsc(from)}" action="${vmAction}" method="POST">\n` +
        `    <Sip>${xmlEsc(owner.routeDest)}</Sip>\n` +
        `  </Dial>`
      );
    }
    if (owner.routeKind === "number") {
      return texmlResponse(
        `  <Dial timeout="30" timeLimit="${capSec}" callerId="${xmlEsc(to)}" action="${vmAction}" method="POST">\n` +
        `    <Number>${xmlEsc(owner.routeDest)}</Number>\n` +
        `  </Dial>`
      );
    }
  }

  // Stage 1: ring the in-app WebRTC softphone(s). Every signed-in device has its
  // own SIP identity, so we <Dial> them ALL in one leg — Telnyx forks the INVITE
  // in parallel and the call rings the phone AND the browser (AND any other
  // device) at once; first to answer wins. Falls back to the legacy per-user
  // identity for accounts that haven't signed in on the new client yet.
  if (stage === "start") {
    let sipUsers = [];
    try { sipUsers = await db.getActiveSipUsernames(owner.userId); } catch { /* table may not exist yet */ }
    if (owner.sipUsername && !sipUsers.includes(owner.sipUsername)) sipUsers.push(owner.sipUsername);
    if (sipUsers.length) {
      const nouns = sipUsers.map((u) => `    <Sip>sip:${xmlEsc(u)}@sip.telnyx.com</Sip>`).join("\n");
      return texmlResponse(
        `  <Dial timeout="30" timeLimit="${capSec}" answerOnBridge="true" callerId="${xmlEsc(from)}" action="${xmlEsc(qs("fwd"))}" method="POST">\n` +
        `${nouns}\n` +
        `  </Dial>`
      );
    }
  }
  // Stage 2: forward to the user's real cellphone (if set).
  if ((stage === "start" || stage === "fwd") && owner.forwardNumber) {
    return texmlResponse(
      `  <Dial timeout="25" timeLimit="${capSec}" callerId="${xmlEsc(to)}" action="${xmlEsc(qs("vm"))}" method="POST">\n` +
      `    <Number>${xmlEsc(owner.forwardNumber)}</Number>\n` +
      `  </Dial>`
    );
  }
  // Stage 3 (or nothing left to try): voicemail.
  return voicemailTeXML(owner, to, from);
}

/** Web-push an "incoming call" alert to a user's browsers (so a backgrounded /
 *  minimized tab still notifies — the WebRTC leg still rings the app if open). */
async function notifyIncomingCall(userId, from) {
  if (!db) return;
  const title = "Incoming call", body = `${from || "Someone"} is calling you`;
  // Browsers / PWA (Web Push).
  if (webPushConfigured()) {
    try {
      const subs = await db.getPushSubscriptions(userId);
      await Promise.all(subs.map(async (s) => {
        const r = await sendPush(s, { type: "call", title, body, from: from || "" });
        if (r.gone) await db.deletePushSubscription(s.endpoint).catch(() => {});
      }));
    } catch (e) { console.error("notifyIncomingCall (web):", e.message); }
  }
  // Native Android/iOS app (FCM).
  if (fcmConfigured()) {
    try {
      const tokens = await db.getPushTokens(userId);
      // NB: `from` is a RESERVED key in an FCM data payload — including it makes
      // FCM reject the whole message with 400 INVALID_ARGUMENT. Use `caller`.
      // dataOnly → the native app builds a full-screen CallStyle notification
      // (Answer/Decline + caller) in every state, instead of a plain tray alert.
      const r = await sendFcmToUser(tokens, { title, body, dataOnly: true, data: { type: "call", caller: from || "" } }, (t) => db.deletePushToken(t));
      console.error(`📲 FCM call-alert uid=${userId} tokens=${tokens.length} sent=${r.sent}/${r.total}`); // TEMP diagnostic
    } catch (e) { console.error("notifyIncomingCall (fcm):", e.message); }
  } else { console.error(`📲 FCM not configured — no call alert for uid=${userId}`); }
}

/** Tell a user's devices to STOP ringing — the inbound call's ring phase is over
 *  (answered on one device, caller gave up, or it moved to forward/voicemail).
 *  Fans a data-only `{type:"cancel"}` push so every browser tab + native app that
 *  is still showing the incoming-call notification dismisses it. The device that
 *  actually answered has already cleared its own locally, so a redundant cancel to
 *  it is harmless. */
async function notifyCancelCall(userId) {
  if (!db) return;
  if (webPushConfigured()) {
    try {
      const subs = await db.getPushSubscriptions(userId);
      await Promise.all(subs.map(async (s) => {
        const r = await sendPush(s, { type: "cancel" });
        if (r.gone) await db.deletePushSubscription(s.endpoint).catch(() => {});
      }));
    } catch (e) { console.error("notifyCancelCall (web):", e.message); }
  }
  if (fcmConfigured()) {
    try {
      const tokens = await db.getPushTokens(userId);
      await sendFcmToUser(tokens, { dataOnly: true, data: { type: "cancel" } }, (t) => db.deletePushToken(t));
    } catch (e) { console.error("notifyCancelCall (fcm):", e.message); }
  }
}

/** Alert a user's browsers AND native app on inbound SMS (backgrounded/closed). */
async function notifyIncomingSms(userId, from, text) {
  if (!db) return;
  const title = `New message from ${from || "someone"}`;
  const body = text ? (text.length > 120 ? `${text.slice(0, 117)}…` : text) : "You have a new message";
  if (webPushConfigured()) {
    try {
      const subs = await db.getPushSubscriptions(userId);
      await Promise.all(subs.map(async (s) => {
        const r = await sendPush(s, { type: "sms", title, body, from: from || "" });
        if (r.gone) await db.deletePushSubscription(s.endpoint).catch(() => {});
      }));
    } catch (e) { console.error("notifyIncomingSms (web):", e.message); }
  }
  if (fcmConfigured()) {
    try {
      const tokens = await db.getPushTokens(userId);
      // `from` is reserved in FCM data payloads (400 INVALID_ARGUMENT) — use `caller`.
      await sendFcmToUser(tokens, { title, body, data: { type: "sms", caller: from || "" } }, (t) => db.deletePushToken(t));
    } catch (e) { console.error("notifyIncomingSms (fcm):", e.message); }
  }
}

/* ---------------------------------------------------- live-call usage guard */
// In-memory registry of calls in progress, pooled per user across every
// browser/profile: uid → Map(callId → {startedAt, lastBeat, to, inbound}). `to`
// is the number whose rate applies (dialled number, or our number for an
// incoming call); older apps don't send it → treated as US/Canada. Browsers report
// via POST /api/voice/heartbeat every ~15s; entries that miss 2 beats are
// pruned. Powers the pre-call gate, the in-call countdown and the auto-cut.
const liveCalls = new Map();
const HEARTBEAT_STALE_MS = 75_000;

/** Seconds of talk-time currently burning across ALL of a user's live calls. */
function liveElapsedSec(uid) {
  const calls = liveCalls.get(uid);
  if (!calls) return 0;
  const now = Date.now();
  let sec = 0;
  for (const [id, c] of calls) {
    if (now - c.lastBeat > HEARTBEAT_STALE_MS) { calls.delete(id); continue; }
    sec += (now - c.startedAt) / 1000;
  }
  if (calls.size === 0) liveCalls.delete(uid);
  return Math.floor(sec);
}

function beatCall(uid, callId, ended = false, { to = "", inbound = false } = {}) {
  let calls = liveCalls.get(uid);
  if (ended) { if (calls) { calls.delete(callId); if (!calls.size) liveCalls.delete(uid); } return; }
  if (!calls) { calls = new Map(); liveCalls.set(uid, calls); }
  const now = Date.now();
  const cur = calls.get(callId);
  if (cur) { cur.lastBeat = now; if (to) { cur.to = to; cur.inbound = inbound; } }
  else calls.set(callId, { startedAt: now, lastBeat: now, to, inbound });
}

/** The user's live calls as [{ sec, to, inbound }] for the rate-aware budget. */
function liveCallList(uid) {
  liveElapsedSec(uid); // prunes stale entries
  const calls = liveCalls.get(uid);
  if (!calls) return [];
  const now = Date.now();
  return [...calls.values()].map((c) => ({ sec: (now - c.startedAt) / 1000, to: c.to || "", inbound: !!c.inbound }));
}

const e164Param = (v) => { const d = String(v || "").replace(/[^\d+]/g, ""); return /^\+\d{6,15}$/.test(d) ? d : ""; };

/**
 * Telnyx's number coverage → [{ iso, name, types }], where types are the line
 * types we can sell there (local / mobile / national / toll_free). Cached 12h;
 * a failed refresh keeps serving the last good list.
 */
const NUMBER_TYPES = ["local", "mobile", "national", "toll_free"];
let countryCache = null;
async function numberCountries() {
  if (countryCache && Date.now() - countryCache.at < 12 * 3600_000) return countryCache.list;
  try {
    const r = await telnyxFetch("/country_coverage");
    if (!r.ok) throw new Error(`country_coverage → HTTP ${r.status}`);
    const data = (await r.json())?.data || {};
    const list = Object.entries(data)
      .map(([name, c]) => ({
        iso: String(c?.code || "").toUpperCase(), name,
        types: NUMBER_TYPES.filter((t) => (c?.phone_number_type || []).includes(t)),
      }))
      .filter((c) => /^[A-Z]{2}$/.test(c.iso) && c.types.length && data[c.name]?.numbers)
      .sort((a, b) => a.name.localeCompare(b.name));
    if (!list.length) throw new Error("country_coverage returned no countries");
    countryCache = { list, at: Date.now() };
    return list;
  } catch (e) {
    if (countryCache) { countryCache.at = Date.now() - 11 * 3600_000; return countryCache.list; } // retry in 1h
    throw e;
  }
}

/**
 * Telnyx's monthly cost for an owned number (country + line type), for renewals
 * of numbers bought before the per-number cost was stored. Reads the price
 * Telnyx quotes for an available number of the same country and type.
 */
const monthlyCostCache = new Map();
async function numberMonthlyCost(e164) {
  const r0 = await telnyxFetch(`/phone_numbers?filter[phone_number]=${encodeURIComponent(e164)}`);
  const pn = (await r0.json().catch(() => ({})))?.data?.[0];
  const cc = pn?.country_iso_alpha2, type = pn?.phone_number_type;
  if (!cc || !type) return 0;
  const k = `${cc}:${type}`;
  const hit = monthlyCostCache.get(k);
  if (hit && Date.now() - hit.at < 6 * 3600_000) return hit.cost;
  const r = await telnyxFetch(`/available_phone_numbers?filter[country_code]=${cc}&filter[phone_number_type]=${encodeURIComponent(type)}&filter[limit]=1`);
  const cost = parseFloat((await r.json().catch(() => ({})))?.data?.[0]?.cost_information?.monthly_cost) || 0;
  if (cost > 0) monthlyCostCache.set(k, { cost, at: Date.now() });
  return cost;
}

/** Remaining affordable talk-time for a call to/from `to`, minus what's burning right now. */
async function voiceRemaining(uid, { to = "", inbound = false } = {}) {
  const remainingSec = await db.voiceRemainingSec(uid, liveCallList(uid), { to, inbound });
  return { remainingSec, allowed: remainingSec > 0 };
}

// Non-US numbers can sit in "requirement-info-pending" until regulatory documents are approved.
const numberStatusCache = new Map();
async function telnyxNumberStatus(e164) {
  return (await telnyxNumberInfo(e164)).status;
}
/** { status, type } of a number on Telnyx — type is local / mobile / national / toll_free. */
async function telnyxNumberInfo(e164) {
  const hit = numberStatusCache.get(e164);
  if (hit && Date.now() - hit.at < 5 * 60_000) return hit;
  try {
    const r = await telnyxFetch(`/phone_numbers?filter[phone_number]=${encodeURIComponent(e164)}`);
    const pn = (await r.json())?.data?.[0];
    const status = pn?.status || null;
    const info = { status, type: pn?.phone_number_type || null, at: Date.now() };
    numberStatusCache.set(e164, info);
    // Numbers ordered while regulatory-pending come out without a messaging profile.
    const mp = process.env.VITE_TELNYX_MESSAGING_PROFILE_ID;
    if (pn && status === "active" && !pn.messaging_profile_id && mp) {
      telnyxFetch(`/phone_numbers/${pn.id}/messaging`, { method: "PATCH", body: JSON.stringify({ messaging_profile_id: mp }) }).catch(() => {});
    }
    return info;
  } catch { return hit ?? { status: null, type: null }; }
}

// Per-field values/statuses live on the order's phone_numbers entry, not on the sub-order.
async function findSubNumberOrder(e164) {
  const r = await telnyxFetch(`/number_orders?filter[phone_numbers.phone_number]=${encodeURIComponent(e164)}`);
  const orders = (await r.json())?.data || [];
  orders.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  if (!orders[0]?.id) return null;
  const full = await telnyxFetch(`/number_orders/${orders[0].id}`);
  const order = (await full.json())?.data || orders[0];
  const subId = order?.sub_number_orders_ids?.[0];
  if (!subId) return null;
  const pn = (order.phone_numbers || []).find((p) => p.phone_number === e164) || {};
  return {
    id: subId, country_code: pn.country_code, phone_number_type: pn.phone_number_type,
    status: pn.status || order.status, requirements_met: pn.requirements_met ?? order.requirements_met,
    regulatory_requirements: pn.regulatory_requirements || [],
  };
}

const requirementTypesCache = new Map();
async function describeRequirements(sub) {
  const key = `${sub.country_code}:${sub.phone_number_type}`;
  let types = requirementTypesCache.get(key);
  if (!types) {
    const r = await telnyxFetch(`/requirements?filter[country_code]=${sub.country_code}&filter[phone_number_type]=${sub.phone_number_type}&filter[action]=ordering`);
    types = new Map(((await r.json())?.data?.[0]?.requirement_types || []).map((t) => [t.id, t]));
    requirementTypesCache.set(key, types);
  }
  // Telnyx sometimes leaves the list off a pending order (and flags it met) yet
  // still auto-cancels it ~48h later for missing documents — ask for the
  // country's full set instead of telling the user nothing is needed.
  let list = sub.regulatory_requirements || [];
  const bare = !list.length && sub.status === "pending" && types.size > 0;
  if (bare) list = [...types.keys()].map((id) => ({ requirement_id: id }));
  return {
    country: sub.country_code,
    numberType: sub.phone_number_type,
    orderStatus: sub.status,
    requirementsMet: bare ? false : !!sub.requirements_met,
    requirements: list.map((q) => {
      const t = types.get(q.requirement_id) || {};
      const rejected = /declin|reject|denied/i.test(q.status || "");
      return {
        id: q.requirement_id, type: t.type || q.field_type, name: t.name || "Requirement",
        description: t.description || "", example: t.example || "",
        status: q.status || null, rejected, submitted: !!q.field_value && !rejected,
      };
    }),
  };
}

/** Place a Telnyx number order + record ownership + log it. Throws on failure.
 *  Shared by the wallet buy route and the Stripe webhook (card fulfilment). */
async function orderTelnyxNumber(uid, phoneNumber, kind = "local", { free = false, amount = 0, monthlyCost = null } = {}) {
  // Make sure the messaging profile can deliver inbound SMS for this new number.
  await ensureMessagingProfile().catch(() => {});
  const voiceConn = await getTexmlAppId().catch(() =>
    getSipConnectionId().catch(() => process.env.VITE_TELNYX_CONNECTION_ID));
  const r = await telnyxFetch("/number_orders", { method: "POST", body: JSON.stringify({
    phone_numbers: [{ phone_number: phoneNumber }],
    messaging_profile_id: process.env.VITE_TELNYX_MESSAGING_PROFILE_ID,
    connection_id: voiceConn || process.env.VITE_TELNYX_CONNECTION_ID,
  }) });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.errors?.[0]?.detail || "Number order failed");
  const telnyxId = j?.data?.phone_numbers?.[0]?.id || "";
  await db.provisionNumber(uid, { e164: phoneNumber, kind, telnyxId, free, monthlyCost });
  const isUS = phoneNumber.startsWith("+1");
  // Any non-US order still pending waits on documents (requirements_met can be true while it does).
  const needsDocs = !isUS && (j?.data?.requirements_met === false || j?.data?.status === "pending");
  const trustNote = isUS ? " Register it in Trust center to send SMS."
    : needsDocs ? " Submit your ID & address in Trust center within 48 hours — otherwise the carrier cancels the order and you're refunded." : "";
  await db.logActivity(uid, { kind: "number", title: "Number added", body: free
    ? `${phoneNumber} added with your plan.${trustNote}`
    : `${phoneNumber} added for $${Number(amount).toFixed(2)}/mo.${trustNote}` });
  return j.data;
}

/** Free a number on Telnyx so its rental stops. The stored telnyx_id is the
 *  number-ORDER id (not the phone_number resource id needed for DELETE), so look
 *  the resource up by E.164 first. Best-effort: returns {ok,reason} and never
 *  throws — the DB release must proceed regardless so local billing stops. */
async function releaseTelnyxNumber(e164) {
  try {
    const r = await telnyxFetch(`/phone_numbers?filter[phone_number]=${encodeURIComponent(e164)}`);
    const j = await r.json().catch(() => ({}));
    const id = j?.data?.[0]?.id;
    if (!id) return { ok: false, reason: "not found on Telnyx" };
    const d = await telnyxFetch(`/phone_numbers/${id}`, { method: "DELETE" });
    if (!d.ok) { const dj = await d.json().catch(() => ({})); return { ok: false, reason: dj?.errors?.[0]?.detail || `HTTP ${d.status}` }; }
    return { ok: true };
  } catch (e) { return { ok: false, reason: e.message }; }
}

/**
 * Keep our numbers table honest against Telnyx. A number the app shows as live
 * but Telnyx no longer holds (order auto-cancelled for missing documents, or
 * deleted) is closed — refunded when it never went live — and a pending
 * international number that just got approved starts its first month.
 */
async function reconcileNumbers() {
  const owned = new Map();
  for (let page = 1; ; page++) {
    const r = await telnyxFetch(`/phone_numbers?page[size]=250&page[number]=${page}`);
    if (!r.ok) throw new Error(`phone_numbers HTTP ${r.status}`);
    const j = await r.json();
    for (const p of j.data || []) owned.set(p.phone_number, p.status);
    if (!j.meta || page >= (j.meta.total_pages || 1)) break;
  }
  let closed = 0;
  for (const n of await db.listLiveNumbers()) {
    if (Date.now() - new Date(n.created_at).getTime() < 15 * 60_000) continue; // order still in flight
    const status = owned.get(n.e164);
    if (status) {
      if (status === "active" && n.activated_at == null) await db.markNumberActivated(n.id, n.e164, n.user_id);
      continue;
    }
    // The order lookup by number is flaky (sometimes empty) and rate-limited
    // (429 on bursts), so pace it and try a few times.
    let order = null;
    for (let i = 0; i < 3 && !order; i++) {
      await new Promise((ok) => setTimeout(ok, 2000 * (i + 1)));
      const r = await telnyxFetch(`/number_orders?filter[phone_numbers.phone_number]=${encodeURIComponent(n.e164)}`);
      if (!r.ok) continue;
      order = ((await r.json())?.data || []).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0] || null;
    }
    if (order?.status === "pending") continue;
    const neverLive = n.activated_at == null && !n.e164.startsWith("+1");
    // Never settle a possible refund without seeing the order — retry next sweep.
    if (neverLive && !order) continue;
    const res = await db.closeLapsedNumber(n.id, {
      refund: neverLive,
      reason: neverLive ? "the required documents weren't received in time" : "",
    });
    if (res) {
      closed++;
      numberStatusCache.delete(n.e164);
      console.log(`numbers: closed ${n.e164} (user ${n.user_id}, order ${order?.status || "none"}${res.refunded ? `, refunded $${res.refunded}` : ""})`);
    }
  }
  return closed;
}

/** Fulfil a completed checkout (Stripe or PayPal) from its metadata: credit wallet
 *  (topup), activate the plan, and/or provision the paid number. Provider-agnostic
 *  — it only reads the metadata map (uid, kind, tier, cycle, phone, numberKind). */
async function fulfilPurchase(uid, m, sessionId) {
  const kind = m.kind;
  if (kind === "topup") {
    const amt = Number(m.amount) || 0;
    if (amt > 0) await db.creditWallet(uid, amt, `Wallet top-up $${amt.toFixed(2)} (PayPal)`, `pay_${sessionId}`);
    return;
  }
  if (kind === "plan" || kind === "plan_number") {
    const cycle = m.cycle === "annual" ? "annual" : "monthly";
    const charge = bundleCharge(m.tier, cycle);
    if (charge) {
      const b = charge.bundle;
      await db.activateBundle(uid, { tier: b.id, cycle, minutes: b.minutes, sms: b.sms, payMethod: "card", autoRenew: true, amount: charge.amount });
      await db.logActivity(uid, { kind: "wallet", title: "Plan activated", body: `Your ${b.name} plan (${cycle}) is now active.` });
    }
  }
  if (kind === "plan_number" || kind === "number") {
    if (!m.phone) {
      // The customer PAID for a number this session — never skip silently.
      console.error(`[stripe] ${kind} checkout ${sessionId} for uid=${uid} has NO phone in metadata — number NOT provisioned, needs manual follow-up`);
      await db.logActivity(uid, { kind: "system", title: "Number purchase needs attention", body: "We couldn't provision your number automatically. Support has been notified — you will not be charged twice." }).catch(() => {});
      return;
    }
    const nkind = m.numberKind === "tollfree" ? "tollfree" : "local";
    await orderTelnyxNumber(uid, m.phone, nkind, { free: false, amount: numberPrice(nkind) });
  }
}

/** Turn a client checkout request into server-priced line items + fulfilment
 *  metadata (the SERVER decides every price; the client is never trusted). Shared
 *  by the Stripe and PayPal checkout routes. Returns { error } or
 *  { lineItems, metadata }. */
function buildPurchase(g, uid) {
  const pickedPhone = String(g.phone || "").replace(/[^\d+]/g, "");
  if ((g.kind === "plan_number" || g.kind === "number") && !pickedPhone) {
    return { error: "No phone number selected" };
  }
  let lineItems, metadata = { uid: String(uid) };
  if (g.kind === "topup") {
    const amt = Math.max(1, Math.min(1000, Number(g.amount) || 0)); // clamp $1–$1000
    lineItems = [{ name: "DIGIRINGO wallet top-up", amountCents: Math.round(amt * 100) }];
    metadata = { ...metadata, kind: "topup", amount: amt.toFixed(2) };
  } else if (g.kind === "plan" || g.kind === "plan_number") {
    const cycle = g.cycle === "annual" ? "annual" : "monthly";
    const charge = bundleCharge(g.tier, cycle);
    if (!charge) return { error: "Unknown plan" };
    lineItems = [{ name: `${charge.bundle.name} plan (${cycle})`, amountCents: Math.round(charge.amount * 100) }];
    metadata = { ...metadata, kind: g.kind, tier: charge.bundle.id, cycle };
    if (g.kind === "plan_number") {
      const nkind = g.numberKind === "tollfree" ? "tollfree" : "local";
      lineItems.push({ name: `Phone number ${pickedPhone}`, amountCents: Math.round(numberPrice(nkind) * 100) });
      metadata = { ...metadata, phone: pickedPhone, numberKind: nkind };
    }
  } else if (g.kind === "number") {
    const nkind = g.numberKind === "tollfree" ? "tollfree" : "local";
    lineItems = [{ name: `Phone number ${pickedPhone}`, amountCents: Math.round(numberPrice(nkind) * 100) }];
    metadata = { ...metadata, kind: "number", phone: pickedPhone, numberKind: nkind };
  } else {
    return { error: "Unknown checkout type" };
  }
  return { lineItems, metadata };
}

/* ----------------------------------------------------------------- Freemius */
async function fulfilFreemius(p) {
  if (!db) throw new Error("DB not configured");
  const user = p.email ? await db.getUserByEmail(p.email) : null;
  if (!user) { console.warn("[freemius] no DGRINGO user for", p.email, "— event", p.type); return; }
  const uid = user.id;
  if (p.type === "payment.created") {
    const grant = fsGrantFor({ pricingId: p.pricingId, planId: p.planId, billingCycle: p.billingCycle });
    if (!grant) { console.warn("[freemius] no grant mapped for pricing", p.pricingId, "plan", p.planId); return; }
    if (grant.kind === "topup") {
      const amt = grant.amount || p.amount;
      if (!(amt > 0)) { console.warn("[freemius] top-up with no amount", p.id); return; }
      await db.creditWallet(uid, amt, `Wallet top-up $${amt.toFixed(2)} (Freemius)`, `fs_${p.id}`);
      await db.logActivity(uid, { kind: "wallet", title: "Top-up successful", body: `$${amt.toFixed(2)} added to your wallet.` });
    } else if (grant.kind === "bundle") {
      const b = bundleFor(grant.tier);
      if (!b) { console.warn("[freemius] unknown bundle tier", grant.tier); return; }
      await db.activateBundle(uid, {
        tier: b.id, cycle: grant.cycle, minutes: b.minutes, sms: b.sms,
        payMethod: "card", autoRenew: true,
        amount: grant.cycle === "annual" ? b.annualTotal : b.monthly,
      });
      await db.logActivity(uid, { kind: "wallet", title: "Plan activated", body: `Your ${b.name} plan (${grant.cycle}) is now active.` });
    }
  } else if (p.type === "subscription.cancelled" || p.type === "subscription.renewal.failed") {
    await db.markSubscriptionPastDue(uid);
  }
}

/* ------------------------------------------------------ in-memory inbox store */
// key: `${ownedE164}|${contactE164}`  →  thread object
const threads = new Map();
let msgSeq = 0;

const keyOf = (owned, contact) => `${digits(owned)}|${digits(contact)}`;

function recordMessage({ owned, contact, direction, text, status, telnyxId }) {
  if (!owned || !contact) return;
  // Persist to the DB when available (survives restarts); else in-memory.
  if (db) {
    db.recordMessage({ owned, contact, direction, body: text, status, telnyxId }).catch((e) => console.error("db recordMessage:", e.message));
    return;
  }
  const k = keyOf(owned, contact);
  let t = threads.get(k);
  if (!t) {
    t = { id: `thr_${digits(owned)}_${digits(contact)}`, owned, contact, contact_flag: flagFor(contact), unread: 0, messages: [] };
    threads.set(k, t);
  }
  t.messages.push({
    id: telnyxId ?? `local_${++msgSeq}`,
    direction,
    text: text ?? "",
    status: status ?? (direction === "inbound" ? "delivered" : "sent"),
    time: shortTime(),
  });
  t.time = shortTime();
  if (direction === "inbound") t.unread += 1;
}

function updateStatus(telnyxId, status) {
  if (!telnyxId) return;
  if (db) { db.updateMessageStatus(telnyxId, status).catch(() => {}); return; }
  for (const t of threads.values()) {
    const m = t.messages.find((x) => x.id === telnyxId);
    if (m) { m.status = status; return; }
  }
}

// Resolve owned E.164 → Telnyx phone_number_id (cached 60s), so the app can
// match each thread to the right owned number (Conversation.numberId).
let idMap = new Map();
let idMapAt = 0;
async function ownedNumberId(e164) {
  if (Date.now() - idMapAt > 60_000) {
    try {
      const r = await telnyxFetch("/phone_numbers?page[size]=250");
      const j = await r.json();
      const next = new Map();
      for (const n of j.data ?? []) next.set(digits(n.phone_number), n.id);
      idMap = next; idMapAt = Date.now();
    } catch (e) { console.error("phone_numbers lookup failed:", e.message); }
  }
  return idMap.get(digits(e164)) ?? digits(e164); // fall back to E.164 digits
}

async function conversationsPayload(uid) {
  // Per-user scoping: the DB path filters threads to this user's numbers. The
  // in-memory dev fallback isn't multi-tenant, so only expose it without a db.
  const list = db ? await db.getThreads(uid) : [...threads.values()];
  const out = [];
  for (const t of list) {
    out.push({
      id: `thr_${digits(t.owned)}_${digits(t.contact)}`,
      phone_number_id: await ownedNumberId(t.owned),
      owned: t.owned, // the owned E.164 — client matches threads to numbers by DIGITS
                      // (opaque Telnyx ids differ between the number-order and phone_number resources)
      contact: t.contact,
      contact_flag: flagFor(t.contact),
      unread: t.unread,
      time: t.time ?? shortTime(),
      messages: t.messages,
    });
  }
  return { data: out };
}

/* -------------------------------------------- simple auth rate limiter (in-mem) */
// Per-IP sliding window so login/register/forgot/reset can't be brute-forced or
// used to spam reset emails. In-memory is fine for a single-process server.
const rlBuckets = new Map(); // key → { count, resetAt }
function rateLimited(key, max, windowMs) {
  const now = Date.now();
  const b = rlBuckets.get(key);
  if (!b || now > b.resetAt) {
    if (rlBuckets.size > 5000) for (const [k, v] of rlBuckets) if (now > v.resetAt) rlBuckets.delete(k); // keep memory bounded
    rlBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  b.count += 1;
  return b.count > max;
}
// The client IP. Only trust the proxy's header when the request really came
// through our local nginx (which overwrites X-Real-IP with $remote_addr); the
// left-most X-Forwarded-For value is client-supplied and can't be trusted.
function clientIp(req) {
  const peer = req.socket?.remoteAddress || "unknown";
  const viaLocalProxy = peer === "127.0.0.1" || peer === "::1" || peer === "::ffff:127.0.0.1";
  if (viaLocalProxy) {
    const real = req.headers["x-real-ip"];
    if (real) return String(real).trim();
    const xff = String(req.headers["x-forwarded-for"] || "").split(",").map((x) => x.trim()).filter(Boolean);
    if (xff.length) return xff[xff.length - 1]; // the hop nginx itself appended
  }
  return peer;
}

/* --------------------------------------------------------------- webhook in */
function handleWebhook(payload) {
  const ev = payload?.data ?? payload;
  const type = ev?.event_type ?? ev?.record_type;
  const p = ev?.payload ?? {};
  if (type === "message.received") {
    const contact = p.from?.phone_number;
    const owned = p.to?.[0]?.phone_number;
    recordMessage({ owned, contact, direction: "inbound", text: p.text, telnyxId: p.id });
    console.log(`📥 inbound SMS ${contact} → ${owned}`);
    // Push-alert the number's owner so a backgrounded/closed tab still notifies.
    if (db && owned) db.findNumberOwner(owned)
      .then((o) => { if (o) notifyIncomingSms(o.userId, contact, p.text); })
      .catch(() => {});
  } else if (type === "message.sent" || type === "message.finalized") {
    const status = p.to?.[0]?.status ?? "sent";
    updateStatus(p.id, status);
  } else if (type && String(type).startsWith("call.")) {
    // Trace call routing/hangup causes without logging the actual phone numbers.
    console.log(`☎ ${type} dir=${p.direction || ""} state=${p.state || ""} cause=${p.hangup_cause || ""} sip=${p.sip_hangup_cause || ""}`);
  }
}

/* ------------------------------------------------------------------- routing */
const handleRequest = async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, "");

  // 1) Telnyx webhooks (signature-verified when TELNYX_PUBLIC_KEY is set)
  if (req.url?.startsWith("/webhooks/telnyx")) {
    const body = await readBody(req);
    if (!verifyTelnyxWebhook(body, req.headers["telnyx-signature-ed25519"], req.headers["telnyx-timestamp"])) {
      console.warn("⚠ rejected webhook: invalid signature");
      return send(res, 401, { error: "invalid signature" });
    }
    try { handleWebhook(JSON.parse(body || "{}")); } catch (e) { console.error("webhook parse:", e.message); }
    return send(res, 200, { ok: true });
  }

  // 1b) Voicemail recording ready (Telnyx TeXML <Record> callback). Store it
  //     against the owner + surface it as an activity item. Checked BEFORE the
  //     generic /webhooks/texml route (more specific path first).
  if (req.url?.startsWith("/webhooks/texml/voicemail") && req.method === "POST") {
    const body = await readBody(req);
    try {
      const p = new URLSearchParams(body || "");
      const q = new URL(req.url, "http://x").searchParams;
      const to = q.get("to") || p.get("To") || "";
      const from = q.get("from") || p.get("From") || "";
      const url = p.get("RecordingUrl") || "";
      const duration = Number(p.get("RecordingDuration") || 0) || 0;
      const owner = db ? await db.findNumberOwner(to).catch(() => null) : null;
      if (owner && url) {
        await db.addVoicemail(owner.userId, { fromNumber: from, toNumber: to, recordingUrl: url, duration });
        await db.logActivity(owner.userId, { kind: "call", title: "New voicemail", body: `${from || "Unknown caller"} left a ${duration}s voicemail.` });
      }
    } catch (e) { console.error("voicemail cb:", e.message); }
    return send(res, 200, { ok: true });
  }

  // 1c) Inbound voice — Telnyx TeXML application Voice URL. Answers with TeXML
  //     that rings the in-app softphone → forwarding cellphone → voicemail. The
  //     same route serves the <Dial action> callbacks (advanced via ?stage=).
  if (req.url?.startsWith("/webhooks/texml")) {
    const body = await readBody(req);
    let xml;
    try {
      const p = new URLSearchParams(body || "");
      const q = new URL(req.url, "http://x").searchParams;
      const stage = q.get("stage") || "start";
      const to = q.get("to") || p.get("To") || "";
      const from = q.get("from") || p.get("From") || "";
      const dialStatus = p.get("DialCallStatus") || "";
      const own = db ? await db.findNumberOwner(to).catch(() => null) : null;
      // Trace inbound routing without logging caller/callee/forward numbers (PII).
      console.log(`☎ TEXML stage=${stage} dialStatus=${dialStatus || "-"} owner=${own?.userId ?? "none"} vm=${own?.voicemailEnabled ?? "-"}`);
      // On the first hop, web-push the owner so a backgrounded browser tab alerts.
      if (stage === "start" && own) notifyIncomingCall(own.userId, from).catch(() => {});
      // Any action callback (stage != start) means the in-app/native ring is over
      // — the SIP <Dial> answered on one device, timed out, or the caller hung up.
      // Dismiss the incoming-call notification on ALL of the user's devices so it
      // stops ringing elsewhere once one device (or none) took it.
      else if (stage !== "start" && own) notifyCancelCall(own.userId).catch(() => {});
      // Meter FORWARDED-to-cellphone legs server-side (the browser is not in the
      // call, so nothing else logs them). stage=vm is the forward <Dial>'s action
      // callback; in-app SIP legs (stage=fwd) are logged/metered by the app.
      if (stage === "vm" && own && (dialStatus === "completed" || dialStatus === "answered")) {
        const durSec = Number(p.get("DialCallDuration") || 0) || 0;
        if (durSec > 0) {
          // Billed from Telnyx's detail records (usage-billing.mjs); log only.
          db.logCall(own.userId, { contact: from, direction: "incoming", status: "Forwarded call", duration: `${Math.floor(durSec / 60)}:${String(durSec % 60).padStart(2, "0")}`, via: to }).catch(() => {});
        }
      }
      // If a prior <Dial> leg was answered & completed, stop — don't fall through
      // to voicemail after a real conversation.
      if (dialStatus === "completed" || dialStatus === "answered") {
        xml = texmlResponse("  <Hangup/>");
      } else {
        xml = await inboundTeXML({ stage, to, from });
      }
    } catch (e) {
      console.error("texml:", e.message);
      xml = texmlResponse(`  <Say voice="Polly.Joanna">Sorry, something went wrong. Goodbye.</Say>\n  <Hangup/>`);
    }
    res.writeHead(200, { "Content-Type": "application/xml", "Access-Control-Allow-Origin": "*" });
    return res.end(xml);
  }

  // 2b) Stripe (card rail). Public config (publishable key) + create a Checkout
  //     Session + fulfil via the signed webhook.
  if (req.url?.startsWith("/api/stripe/config") && req.method === "GET") {
    return send(res, 200, { publishableKey: stripePubKey(), enabled: stripeConfigured() });
  }
  //    POST /api/stripe/webhook — verify the signature, then fulfil the completed
  //    checkout (credit wallet / activate plan / provision number) idempotently.
  if (req.url?.startsWith("/api/stripe/webhook") && req.method === "POST") {
    const raw = await readBody(req);
    const evt = stripeVerify(raw, req.headers["stripe-signature"]);
    if (!evt) { console.warn("⚠ rejected Stripe webhook: invalid signature"); return send(res, 401, { error: "invalid signature" }); }
    if (evt.type !== "checkout.session.completed") return send(res, 200, { ok: true, ignored: evt.type });
    if (!db) return send(res, 503, { error: "Database not configured" });
    const session = evt.data?.object || {};
    const m = session.metadata || {};
    const uid = Number(m.uid) || 0;
    if (!uid) return send(res, 200, { ok: true, nouid: true });
    // SETUP-mode session (change/add card — nothing was charged): save the new
    // default card, done. Must run BEFORE the paid check (setup sessions report
    // payment_status "no_payment_required").
    if (session.mode === "setup" || m.kind === "setcard") {
      try {
        if (session.setup_intent) {
          const card = await stripeCardFromIntent(session.setup_intent);
          if (card) {
            await db.saveBillingProfile(uid, { customerId: String(session.customer || ""), ...card, paymentMethodId: card.pmId });
            await db.logActivity(uid, { kind: "wallet", title: "Payment method updated", body: `Your ${card.brand || "card"} •••• ${card.last4} is now the card on file for renewals.` });
          }
        }
      } catch (e) { console.error("[stripe] setcard failed:", e.message); }
      return send(res, 200, { ok: true, setup: true });
    }
    if (session.payment_status && session.payment_status !== "paid") return send(res, 200, { ok: true, unpaid: true });
    let claimed = false;
    try {
      claimed = await db.recordFreemiusEvent(evt.id); // reuse the event-dedup table
      if (!claimed) return send(res, 200, { ok: true, duplicate: true });
      await fulfilPurchase(uid, m, session.id || evt.id);
      // Card-on-file: remember the customer + masked card so renewals can charge
      // it DIRECTLY and the app can show "VISA •••• 4242". Best-effort.
      try {
        if (session.customer && session.payment_intent) {
          const card = await stripeCardFromIntent(session.payment_intent);
          await db.saveBillingProfile(uid, { customerId: String(session.customer), ...(card ? { ...card, paymentMethodId: card.pmId } : {}) });
        }
      } catch (e) { console.error("[stripe] card capture failed:", e.message); }
      return send(res, 200, { ok: true });
    } catch (e) {
      if (claimed) await db.unrecordFreemiusEvent(evt.id);
      console.error("[stripe] fulfil failed:", e.message);
      return send(res, 500, { error: "fulfilment failed" });
    }
  }
  //    POST /api/stripe/checkout — create a hosted Checkout Session for a topup /
  //    plan / plan+number / number. SERVER sets all prices (never trusts client).
  if (req.url?.startsWith("/api/stripe/checkout") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    if (!stripeConfigured()) return send(res, 503, { error: "Card payments are not configured" });
    const body = await readBody(req);
    let g; try { g = JSON.parse(body || "{}"); } catch { g = {}; }
    const base = PUBLIC_BASE;
    const successUrl = `${base}/app?pay=success`;
    const cancelUrl = `${base}/app?pay=cancel`;
    let email = null; try { const u = await db.getUser?.(uid); email = u?.email || null; } catch { /* optional */ }
    try {
      const built = buildPurchase(g, uid);
      if (built.error) return send(res, 400, { error: built.error });
      // Reuse the saved Stripe customer so the card stays attached to one identity.
      let customerId = null;
      try { customerId = (await db.getBillingProfile?.(uid))?.customerId || null; } catch { /* optional */ }
      const sess = await stripeCheckout({ ...built, successUrl, cancelUrl, customerEmail: email, customerId });
      return send(res, 200, { url: sess.url, id: sess.id });
    } catch (e) {
      return send(res, 502, { error: e.message || "Could not start checkout" });
    }
  }

  /* ----------------------------------------------------- PayPal (card rail) */
  //    GET /api/paypal/config → { clientId, enabled } (public client id only).
  if (req.url?.startsWith("/api/paypal/config") && req.method === "GET") {
    const on = process.env.PAYPAL_CHECKOUT === "1" && paypalConfigured();
    return send(res, 200, on ? { clientId: paypalClientId(), enabled: true } : { enabled: false });
  }
  //    POST /api/paypal/checkout — create a hosted PayPal order for a topup /
  //    plan / plan+number / number. SERVER sets all prices (never trusts client).
  if (req.url?.startsWith("/api/paypal/checkout") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    if (!paypalConfigured()) return send(res, 503, { error: "PayPal is not configured" });
    const body = await readBody(req);
    let g; try { g = JSON.parse(body || "{}"); } catch { g = {}; }
    const base = PUBLIC_BASE;
    try {
      const built = buildPurchase(g, uid);
      if (built.error) return send(res, 400, { error: built.error });
      const sess = await paypalCheckout({
        ...built,
        successUrl: `${base}/app?pay=paypal`,   // PayPal appends &token=<orderId>
        cancelUrl: `${base}/app?pay=cancel`,
      });
      return send(res, 200, { url: sess.url, id: sess.id });
    } catch (e) {
      return send(res, 502, { error: e.message || "Could not start PayPal checkout" });
    }
  }
  //    POST /api/paypal/capture — capture an APPROVED order after the payer
  //    returns, then fulfil it idempotently. Body: { orderID }.
  if (req.url?.startsWith("/api/paypal/capture") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    if (!paypalConfigured()) return send(res, 503, { error: "PayPal is not configured" });
    const body = await readBody(req);
    let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
    const orderId = String(d.orderID || d.token || "").trim();
    if (!orderId) return send(res, 400, { error: "Missing orderID" });
    // The caller's bearer token is OPTIONAL here. After a PayPal redirect the
    // native (Capacitor) app lands back on the https://digiringo.com WEB origin —
    // NOT its https://localhost shell — so the token it stored under localhost is
    // gone and would 401. Instead we trust the uid we baked into the order's
    // custom_id at creation (set server-side from the authenticated creator). The
    // orderId itself is the capability: PayPal only hands it to the payer who
    // approved it, funds ALWAYS credit the order's own uid, and pp_<orderId> dedups
    // — so completing it without a token can't misdirect or double-charge.
    const callerUid = db.verifyToken(bearer(req)); // may be null on the native web-return
    let claimed = false;
    try {
      // Read the order first so we trust OUR metadata (uid, kind) over anything the
      // client sends.
      const order = await paypalGetOrder(orderId);
      const m = paypalOrderMeta(order);
      const orderUid = Number(m.uid) || 0;
      if (!orderUid) return send(res, 400, { error: "Order has no owner" });
      // If a token WAS supplied (normal web flow) it must match the order's owner.
      if (callerUid && Number(callerUid) !== orderUid) return send(res, 403, { error: "Order does not belong to you" });
      claimed = await db.recordFreemiusEvent(`pp_${orderId}`); // reuse the dedup table
      if (!claimed) return send(res, 200, { ok: true, duplicate: true });
      const cap = await paypalCapture(orderId);
      if (!cap.paid) { await db.unrecordFreemiusEvent(`pp_${orderId}`); return send(res, 402, { error: "Payment not completed" }); }
      await fulfilPurchase(orderUid, m, orderId);
      // Remember the vaulted payer (if any) so renewals can charge off-session.
      if (cap.vaultId) {
        try { await db.saveBillingProfile(orderUid, { customerId: cap.payerId || "", paymentMethodId: cap.vaultId, brand: "PayPal", last4: (cap.email || "").slice(0, 4) }); } catch { /* best-effort */ }
      }
      return send(res, 200, { ok: true });
    } catch (e) {
      if (claimed) await db.unrecordFreemiusEvent(`pp_${orderId}`);
      console.error("[paypal] capture failed:", e.message);
      return send(res, 502, { error: e.message || "Capture failed" });
    }
  }
  //    POST /api/paypal/webhook — backup fulfilment path (verified signature).
  //    Fulfils on PAYMENT.CAPTURE.COMPLETED / CHECKOUT.ORDER.APPROVED, idempotent.
  if (req.url?.startsWith("/api/paypal/webhook") && req.method === "POST") {
    const raw = await readBody(req);
    const evt = await paypalVerify(req.headers, raw);
    if (!evt) { console.warn("⚠ rejected PayPal webhook: invalid signature"); return send(res, 401, { error: "invalid signature" }); }
    if (!db) return send(res, 503, { error: "Database not configured" });
    const type = evt.event_type;
    try {
      // Resolve the order id from either event shape.
      const r = evt.resource || {};
      const orderId = r.supplementary_data?.related_ids?.order_id || (type === "CHECKOUT.ORDER.APPROVED" ? r.id : "") || "";
      if (!orderId) return send(res, 200, { ok: true, ignored: type });
      const order = await paypalGetOrder(orderId).catch(() => null);
      if (!order) return send(res, 200, { ok: true, noorder: true });
      const m = paypalOrderMeta(order);
      const uid = Number(m.uid) || 0;
      if (!uid) return send(res, 200, { ok: true, nouid: true });
      const claimed = await db.recordFreemiusEvent(`pp_${orderId}`);
      if (!claimed) return send(res, 200, { ok: true, duplicate: true });
      // Capture if still approved; if already captured elsewhere just fulfil.
      if (order.status === "APPROVED") {
        const cap = await paypalCapture(orderId);
        if (!cap.paid) { await db.unrecordFreemiusEvent(`pp_${orderId}`); return send(res, 200, { ok: true, unpaid: true }); }
      }
      await fulfilPurchase(uid, m, orderId);
      return send(res, 200, { ok: true });
    } catch (e) {
      console.error("[paypal] webhook fulfil failed:", e.message);
      return send(res, 500, { error: "fulfilment failed" });
    }
  }

  /* ------------------------------------------------- Freemius (MoR card rail) */
  if (req.url?.startsWith("/api/freemius/config") && req.method === "GET") {
    if (!freemiusConfigured()) return send(res, 503, { error: "Freemius is not configured" });
    return send(res, 200, { productId: fsProductId(), publicKey: fsPublicKey(), checkouts: fsCheckouts() });
  }
  if (req.url?.startsWith("/api/freemius/webhook") && req.method === "POST") {
    const raw = await readBody(req);
    if (!freemiusConfigured()) return send(res, 503, { error: "Freemius is not configured" });
    if (!fsVerifyWebhook(raw, req.headers["x-signature"])) {
      console.warn("⚠ rejected Freemius webhook: invalid signature");
      return send(res, 401, { error: "invalid signature" });
    }
    let evt; try { evt = JSON.parse(raw || "{}"); } catch { return send(res, 400, { error: "bad JSON" }); }
    const parsed = fsParseEvent(evt);
    const HANDLED = new Set(["payment.created", "subscription.cancelled", "subscription.renewal.failed"]);
    if (!HANDLED.has(parsed.type)) return send(res, 200, { ok: true, ignored: parsed.type });
    if (!db) return send(res, 503, { error: "Database not configured" });
    let claimed = false;
    try {
      claimed = await db.recordFreemiusEvent(parsed.id);
      if (!claimed) return send(res, 200, { ok: true, duplicate: true });
      await fulfilFreemius(parsed);
      return send(res, 200, { ok: true });
    } catch (e) {
      if (claimed) await db.unrecordFreemiusEvent(parsed.id);
      console.error("[freemius] fulfil failed:", e.message);
      return send(res, 500, { error: "fulfilment failed" });
    }
  }

  /* ------------------------------------------- Combined payments config (both gateways) */
  if (req.url?.startsWith("/api/payments/config") && req.method === "GET") {
    return send(res, 200, {
      // Freemius is the live card rail; PayPal is only advertised when switched
      // back on explicitly (PAYPAL_CHECKOUT=1), so its client id isn't published.
      paypal: process.env.PAYPAL_CHECKOUT === "1" && paypalConfigured()
        ? { enabled: true, clientId: paypalClientId() }
        : { enabled: false },
      freemius: { enabled: freemiusConfigured(), productId: fsProductId(), publicKey: fsPublicKey(), checkouts: fsCheckouts() },
    });
  }

  // 2b-2) Billing — the saved (masked) card + a hosted flow to change it.
  //   GET  /api/billing/payment-method → { card: {brand,last4,expMonth,expYear} | null }
  //   POST /api/billing/change-card    → { url } (Stripe setup-mode Checkout)
  if (req.url?.startsWith("/api/billing/payment-method") && req.method === "GET") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    try {
      const bp = await db.getBillingProfile(uid);
      const card = bp?.paymentMethodId
        ? { brand: bp.brand, last4: bp.last4, expMonth: bp.expMonth, expYear: bp.expYear }
        : null;
      return send(res, 200, { card });
    } catch (e) { return send(res, 500, { error: e.message }); }
  }
  if (req.url?.startsWith("/api/billing/change-card") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    if (!stripeConfigured()) return send(res, 503, { error: "Card payments are not configured" });
    try {
      // A setup session needs a customer to attach the card to — create one now
      // if the user has never paid by card before.
      let bp = await db.getBillingProfile(uid);
      if (!bp?.customerId) {
        let email = null, name = null;
        try { const u = await db.getUser?.(uid); email = u?.email || null; name = u?.name || null; } catch { /* optional */ }
        const cust = await stripeCreateCustomer({ email, name, metadata: { uid: String(uid) } });
        await db.saveBillingProfile(uid, { customerId: cust.id });
        bp = { customerId: cust.id };
      }
      const base = PUBLIC_BASE;
      const sess = await stripeSetupSession({
        customerId: bp.customerId,
        metadata: { uid: String(uid), kind: "setcard" },
        successUrl: `${base}/app?card=saved`,
        cancelUrl: `${base}/app?card=cancel`,
      });
      return send(res, 200, { url: sess.url, id: sess.id });
    } catch (e) { return send(res, 502, { error: e.message || "Could not start card update" }); }
  }

  // 2c) Admin (Control Hub) auth — gates the dashboard behind a password.
  if (req.url?.startsWith("/api/admin/")) {
    if (req.url.startsWith("/api/admin/login") && req.method === "POST") {
      if (!ADMIN_PASSWORD) return send(res, 503, { error: "Admin login is not configured" });
      if (rateLimited(`admin-login:${clientIp(req)}`, 5, 60_000)) {
        return send(res, 429, { error: "Too many attempts — please wait a minute and try again." });
      }
      const body = await readBody(req);
      let pw = ""; try { pw = JSON.parse(body || "{}").password || ""; } catch { /* ignore */ }
      const ok = pw.length > 0 && timingSafeEqual(adminHmac(pw), adminHmac(ADMIN_PASSWORD));
      if (!ok) return send(res, 401, { error: "Invalid admin password" });
      return send(res, 200, { token: signAdminToken() });
    }
    if (req.url.startsWith("/api/admin/verify") && req.method === "GET") {
      return send(res, 200, { ok: verifyAdminToken(bearer(req)), role: "admin" });
    }
    // Team (agent) management — admin only.
    if (req.url.startsWith("/api/admin/agents")) {
      if (!verifyAdminToken(bearer(req))) return send(res, 401, { error: "Not authenticated" });
      if (!db) return send(res, 503, { error: "Database not configured" });
      if (req.method === "GET") { try { return send(res, 200, { agents: await db.listAgents() }); } catch (e) { return send(res, 500, { error: e.message }); } }
      if (req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        try { const agent = await db.createAgent({ name: d.name, email: d.email, password: d.password }); return send(res, 200, { ok: true, agent }); }
        catch (e) { return send(res, e.status || 500, { error: e.message }); }
      }
      if (req.method === "DELETE") {
        const id = Number(new URL(req.url, "http://x").searchParams.get("id")) || 0;
        if (id) { try { await db.deleteAgent(id); } catch (e) { return send(res, 500, { error: e.message }); } }
        return send(res, 200, { ok: true });
      }
      return send(res, 405, { error: "Method not allowed" });
    }

    // ---- Blog management ----
    if (req.url.startsWith("/api/admin/blog")) {
      if (!verifyAdminToken(bearer(req))) return send(res, 401, { error: "Not authenticated" });
      if (!db) return send(res, 503, { error: "Database not configured" });
      await ensureBlogTable();
      const u = new URL(req.url, "http://x");
      // GET — list all posts (including drafts)
      if (req.method === "GET") {
        try { return send(res, 200, { posts: await db.rawQuery("SELECT * FROM blog_posts ORDER BY created_at DESC") }); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }
      // POST — create
      if (req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!d.title) return send(res, 400, { error: "title required" });
        const slug = d.slug ? slugify(d.slug) : slugify(d.title);
        if (!slug) return send(res, 400, { error: "Could not generate slug" });
        try {
          const r = await db.rawQuery(
            "INSERT INTO blog_posts (title, slug, excerpt, body, cover_url, author, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [d.title, slug, d.excerpt || "", d.body || "", d.cover_url || "", d.author || "DIGIRINGO", d.tags || "", d.status || "draft"]
          );
          const rows = await db.rawQuery("SELECT * FROM blog_posts WHERE id = ?", [r.insertId]);
          return send(res, 200, { ok: true, post: rows[0] });
        } catch (e) {
          if (e.code === "ER_DUP_ENTRY") return send(res, 409, { error: "A post with this slug already exists" });
          return send(res, 500, { error: e.message });
        }
      }
      // PUT — update
      if (req.method === "PUT") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!d.id) return send(res, 400, { error: "id required" });
        const fields = []; const vals = [];
        for (const k of ["title", "slug", "excerpt", "body", "cover_url", "author", "tags", "status"]) {
          if (d[k] !== undefined) { fields.push(`${k} = ?`); vals.push(k === "slug" ? slugify(d[k]) : d[k]); }
        }
        if (!fields.length) return send(res, 400, { error: "Nothing to update" });
        vals.push(d.id);
        try {
          await db.rawQuery(`UPDATE blog_posts SET ${fields.join(", ")} WHERE id = ?`, vals);
          const rows = await db.rawQuery("SELECT * FROM blog_posts WHERE id = ?", [d.id]);
          return send(res, 200, { ok: true, post: rows[0] });
        } catch (e) {
          if (e.code === "ER_DUP_ENTRY") return send(res, 409, { error: "A post with this slug already exists" });
          return send(res, 500, { error: e.message });
        }
      }
      // DELETE
      if (req.method === "DELETE") {
        const id = Number(u.searchParams.get("id")) || 0;
        if (!id) return send(res, 400, { error: "id required" });
        try { await db.rawQuery("DELETE FROM blog_posts WHERE id = ?", [id]); return send(res, 200, { ok: true }); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }
      return send(res, 405, { error: "Method not allowed" });
    }

    // ---- Client management (real data from the app's own DB) ----
    // Everything below is admin-only and DB-backed.
    if (req.url.startsWith("/api/admin/users") || req.url.startsWith("/api/admin/user")
        || req.url.startsWith("/api/admin/numbers") || req.url.startsWith("/api/admin/transactions")
        || req.url.startsWith("/api/admin/kpis") || req.url.startsWith("/api/admin/wallet")
        || req.url.startsWith("/api/admin/billing") || req.url.startsWith("/api/admin/config")) {
      if (!verifyAdminToken(bearer(req))) return send(res, 401, { error: "Not authenticated" });
      if (!db) return send(res, 503, { error: "Database not configured" });
      const u = new URL(req.url, "http://x");

      // GET /api/admin/users?q= — all customers
      if (u.pathname === "/api/admin/users" && req.method === "GET") {
        try { return send(res, 200, { users: await db.adminListUsers({ q: u.searchParams.get("q") || "" }) }); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }
      // GET /api/admin/kpis — platform metrics + chart series
      if (u.pathname === "/api/admin/kpis" && req.method === "GET") {
        try { return send(res, 200, await db.adminKpis()); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }
      // GET /api/admin/numbers?q= — all provisioned numbers
      if (u.pathname === "/api/admin/numbers" && req.method === "GET") {
        try { return send(res, 200, { numbers: await db.adminListNumbers({ q: u.searchParams.get("q") || "" }) }); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }
      // GET /api/admin/transactions — full wallet ledger
      if (u.pathname === "/api/admin/transactions" && req.method === "GET") {
        try { return send(res, 200, { txns: await db.adminListTransactions({}) }); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }
      // GET /api/admin/user?id= — one customer's full detail
      if (u.pathname === "/api/admin/user" && req.method === "GET") {
        const id = Number(u.searchParams.get("id")) || 0;
        if (!id) return send(res, 400, { error: "id required" });
        try { return send(res, 200, { user: await db.adminGetUser(id) }); }
        catch (e) { return send(res, e.status || 500, { error: e.message }); }
      }
      // POST /api/admin/user/status { userId, status } — suspend / reactivate
      if (u.pathname === "/api/admin/user/status" && req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!d.userId) return send(res, 400, { error: "userId required" });
        try { return send(res, 200, await db.adminSetUserStatus(d.userId, d.status)); }
        catch (e) { return send(res, e.status || 500, { error: e.message }); }
      }
      // POST /api/admin/user/subscription { userId, action } — cancel/pause/resume plan
      if (u.pathname === "/api/admin/user/subscription" && req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!d.userId || !d.action) return send(res, 400, { error: "userId and action required" });
        try { return send(res, 200, { subscription: await db.setSubscriptionStatus(d.userId, d.action, "admin") }); }
        catch (e) { return send(res, e.status || 500, { error: e.message }); }
      }
      // POST /api/admin/user/number { userId, e164 } — release a client's number
      if (u.pathname === "/api/admin/user/number" && req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!d.userId || !d.e164) return send(res, 400, { error: "userId and e164 required" });
        try {
          const rel = await db.releaseNumber(d.userId, d.e164, "admin");
          const tel = await releaseTelnyxNumber(d.e164);
          if (!tel.ok) console.error(`Telnyx release ${d.e164}: ${tel.reason}`);
          return send(res, 200, { ok: true, released: rel.ok, telnyxReleased: tel.ok });
        } catch (e) { return send(res, e.status || 500, { error: e.message }); }
      }
      // POST /api/admin/wallet { userId, amount, label } — credit (+) or debit (-)
      if (u.pathname === "/api/admin/wallet" && req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!d.userId || !d.amount) return send(res, 400, { error: "userId and amount required" });
        try { return send(res, 200, { ok: true, wallet: await db.adminAdjustWallet(d.userId, d.amount, d.label) }); }
        catch (e) { return send(res, e.status || 500, { error: e.message }); }
      }

      // GET /api/admin/billing — real plan counts + recent plan activations
      if (u.pathname === "/api/admin/billing" && req.method === "GET") {
        try { return send(res, 200, await db.adminBilling()); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }

      // ---- Persistent config (Payments / Integrations / Settings) ----
      // Real status merges the encrypted DB store with the live server env: a key
      // saved here is used by the server (see stripe.mjs / telnyxKey), else env.
      if (u.pathname === "/api/admin/config" && req.method === "GET") {
        return send(res, 200, buildConfig());
      }
      if (u.pathname === "/api/admin/config/secret" && req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!ALLOWED_SECRETS.has(d.name)) return send(res, 400, { error: "Unknown secret" });
        try { await settings.setSecret(d.name, d.value || ""); return send(res, 200, buildConfig()); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }
      if (u.pathname === "/api/admin/config/general" && req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        try {
          const merged = { ...GENERAL_DEFAULTS, ...settings.getJSON("general", {}), ...(d.patch || {}) };
          await settings.setJSON("general", merged);
          return send(res, 200, buildConfig());
        } catch (e) { return send(res, 500, { error: e.message }); }
      }
      if (u.pathname === "/api/admin/config/provider" && req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        const id = d.id; if (!["stripe", "paypal", "bank"].includes(id)) return send(res, 400, { error: "Unknown provider" });
        try {
          const prov = settings.getJSON("providers", {});
          const cur = prov[id] || {};
          if (typeof d.enabled === "boolean") cur.enabled = d.enabled;
          if (typeof d.account === "string") cur.account = d.account;
          if (d.secret) { const sn = PROVIDER_SECRET[id]; if (sn) await settings.setSecret(sn, d.secret); if (id === "bank") cur.connected = true; }
          prov[id] = cur;
          await settings.setJSON("providers", prov);
          return send(res, 200, buildConfig());
        } catch (e) { return send(res, 500, { error: e.message }); }
      }
      if (u.pathname === "/api/admin/config/webhook" && req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        try {
          const list = settings.getJSON("webhooks", null) || defaultWebhooks();
          if (d.action === "toggle") { const w = list.find((x) => x.id === d.id); if (w) w.enabled = !w.enabled; }
          else if (d.action === "add" && d.url) { list.push({ id: `wh_${nowId()}`, label: d.label || "Webhook", url: d.url, enabled: true, secretSet: false, custom: true }); }
          await settings.setJSON("webhooks", list);
          return send(res, 200, buildConfig());
        } catch (e) { return send(res, 500, { error: e.message }); }
      }
      if (u.pathname === "/api/admin/config/key" && req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!d.name) return send(res, 400, { error: "Name required" });
        try {
          const full = "pk_live_" + createHmac("sha256", ADMIN_SECRET + nowId()).update(String(d.name)).digest("hex").slice(0, 32);
          const list = settings.getJSON("platformKeys", []);
          const rec = { id: `pk_${nowId()}`, name: String(d.name).slice(0, 60), last4: full.slice(-4), created: new Date().toISOString() };
          list.unshift(rec);
          await settings.setJSON("platformKeys", list);
          // The full key is shown ONCE here and never stored in the clear.
          return send(res, 200, { ok: true, key: full, config: buildConfig() });
        } catch (e) { return send(res, 500, { error: e.message }); }
      }
      if (u.pathname === "/api/admin/config/key" && req.method === "DELETE") {
        const id = u.searchParams.get("id");
        try {
          const list = settings.getJSON("platformKeys", []).filter((k) => k.id !== id);
          await settings.setJSON("platformKeys", list);
          return send(res, 200, buildConfig());
        } catch (e) { return send(res, 500, { error: e.message }); }
      }

      return send(res, 404, { error: "Unknown admin route" });
    }

    return send(res, 404, { error: "Unknown admin route" });
  }

  // 2d) Team member (agent) auth — individual logins for the support console.
  if (req.url?.startsWith("/api/agent/")) {
    if (!db) return send(res, 503, { error: "Database not configured" });
    if (req.url.startsWith("/api/agent/login") && req.method === "POST") {
      if (rateLimited(`agent-login:${clientIp(req)}`, 10, 60_000)) {
        return send(res, 429, { error: "Too many attempts — please wait a minute and try again." });
      }
      const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
      try { return send(res, 200, await db.loginAgent(d.email, d.password)); }
      catch (e) { return send(res, e.status || 401, { error: e.message }); }
    }
    if (req.url.startsWith("/api/agent/verify") && req.method === "GET") {
      const aid = db.verifyAgentToken(bearer(req));
      if (!aid) return send(res, 200, { ok: false });
      const a = await db.getAgent(aid).catch(() => null);
      return send(res, 200, { ok: !!a, role: "agent", name: a?.name || "Agent", agentId: aid });
    }
    return send(res, 404, { error: "Unknown agent route" });
  }

  // 2e) Live support chat. Customers (user token) talk to the team; the Control
  //     Hub / team members (admin or agent token) answer.
  if (req.url?.startsWith("/api/support")) {
    if (!db) return send(res, 503, { error: "Database not configured" });
    // Customer side — their own thread.
    if (req.url.startsWith("/api/support/messages")) {
      const uid = db.verifyToken(bearer(req));
      if (!uid) return send(res, 401, { error: "Not authenticated" });
      if (req.method === "GET") {
        try { return send(res, 200, { messages: await db.getSupportMessages(uid, { markReadFor: "user" }) }); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }
      if (req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!d.body || !String(d.body).trim()) return send(res, 400, { error: "Message required" });
        try {
          await db.addSupportMessage(uid, { sender: "user", body: String(d.body).trim() });
          return send(res, 200, { ok: true, messages: await db.getSupportMessages(uid, { markReadFor: "user" }) });
        } catch (e) { return send(res, 500, { error: e.message }); }
      }
      return send(res, 405, { error: "Method not allowed" });
    }
    // Staff side — requires an admin or agent token.
    const staff = verifyAdminToken(bearer(req)) ? { role: "admin", agentId: null }
      : (db.verifyAgentToken(bearer(req)) ? { role: "agent", agentId: db.verifyAgentToken(bearer(req)) } : null);
    if (!staff) return send(res, 401, { error: "Not authenticated" });
    if (req.url.startsWith("/api/support/threads")) {
      try { return send(res, 200, { threads: await db.listSupportThreads() }); }
      catch (e) { return send(res, 500, { error: e.message }); }
    }
    if (req.url.startsWith("/api/support/thread")) {
      const userId = Number(new URL(req.url, "http://x").searchParams.get("userId")) || 0;
      if (!userId) return send(res, 400, { error: "userId required" });
      if (req.method === "GET") {
        try { return send(res, 200, { messages: await db.getSupportMessages(userId, { markReadFor: "agent" }) }); }
        catch (e) { return send(res, 500, { error: e.message }); }
      }
      if (req.method === "POST") {
        const body = await readBody(req); let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
        if (!d.body || !String(d.body).trim()) return send(res, 400, { error: "Message required" });
        try {
          await db.addSupportMessage(userId, { sender: "agent", agentId: staff.agentId, body: String(d.body).trim() });
          try { await db.logActivity(userId, { kind: "system", title: "Support replied", body: String(d.body).trim().slice(0, 140) }); } catch { /* best effort */ }
          return send(res, 200, { ok: true, messages: await db.getSupportMessages(userId, { markReadFor: "agent" }) });
        } catch (e) { return send(res, 500, { error: e.message }); }
      }
      return send(res, 405, { error: "Method not allowed" });
    }
    return send(res, 404, { error: "Unknown support route" });
  }

  // 2b) Social sign-in (Google / Apple) — OAuth authorization-code flow. Shared by
  // the web app and the native app; the callback hands a DIGIRINGO session token
  // back via a URL hash (web) or a com.digiringo.app://oauth deep link (native).
  if (req.url?.startsWith("/api/auth/providers") || /^\/api\/auth\/(google|apple)\/(start|callback)/.test(req.url || "")) {
    try {
      const u = new URL(req.url, `https://${req.headers.host}`);
      const path = u.pathname;

      // Which providers are live (frontend shows a button only for these).
      if (path === "/api/auth/providers") return send(res, 200, oauthProviders());

      const provider = path.split("/")[3]; // google | apple
      const redirectUri = `${PUBLIC_BASE}/api/auth/${provider}/callback`;

      // Kick off the flow → redirect the browser to the provider's consent page.
      if (path.endsWith("/start")) {
        if (!oauthIsProvider(provider)) return send(res, 404, { error: `${provider} sign-in is not configured` });
        const flow = u.searchParams.get("flow") === "native" ? "native" : "web";
        const state = newOAuthState(provider, flow);
        return redirect(res, oauthAuthorizeUrl(provider, { redirectUri, state }));
      }

      // Provider redirected back with a code. Apple posts a form; Google uses query.
      if (path.endsWith("/callback")) {
        let code = u.searchParams.get("code");
        let state = u.searchParams.get("state");
        let providerErr = u.searchParams.get("error");
        if (req.method === "POST") {
          const form = new URLSearchParams(await readBody(req));
          code = code || form.get("code");
          state = state || form.get("state");
          providerErr = providerErr || form.get("error");
        }
        const st = state ? takeOAuthState(state) : null;
        const flow = st?.flow || "web";
        const back = (params) => {
          const qs = new URLSearchParams(params).toString();
          return flow === "native"
            ? redirect(res, `com.digiringo.app://oauth?${qs}`)
            : redirect(res, `${PUBLIC_BASE}/app#${qs}`);
        };
        if (providerErr) return back({ error: providerErr });
        if (!st || st.provider !== provider) return back({ error: "sign-in session expired, please try again" });
        if (!code) return back({ error: "no authorization code returned" });
        if (!db) return back({ error: "database not configured" });
        try {
          const profile = await oauthExchangeCode(provider, { code, redirectUri });
          const { token, isNew } = await db.upsertOAuthUser(profile);
          // new=1 lets the app report a sign_up (vs. a returning login) to analytics.
          return back(isNew ? { token, new: "1", provider } : { token });
        } catch (e) {
          console.error(`OAuth ${provider} failed:`, e.message);
          return back({ error: e.message || "sign-in failed" });
        }
      }
      return send(res, 404, { error: "Unknown auth route" });
    } catch (e) {
      return send(res, 500, { error: e.message });
    }
  }

  // 3) Auth + wallet (DB-backed): real register/login and persistent wallet.
  if (req.url?.startsWith("/api/auth/") || req.url?.startsWith("/api/wallet") || req.url?.startsWith("/api/subscription") || req.url?.startsWith("/api/activity")) {
    if (!db) return send(res, 503, { error: "Database not configured" });
    try {
      const body = await readBody(req);
      const data = body ? JSON.parse(body) : {};
      // Throttle the unauthenticated, abusable auth endpoints: 10 attempts/min per
      // IP stops password brute-force and reset-email spam.
      if (req.method === "POST" && /^\/api\/auth\/(login|register|forgot|reset)/.test(req.url)) {
        if (rateLimited(`auth:${clientIp(req)}`, 10, 60_000)) {
          return send(res, 429, { error: "Too many attempts — please wait a minute and try again." });
        }
      }
      if (req.method === "POST" && req.url.startsWith("/api/auth/register")) {
        const result = await db.registerUser(data.email, data.password, data.name);
        // Email a verification link (best-effort — don't fail signup if mail is down).
        if (result.verifyToken) {
          const base = PUBLIC_BASE;
          try { await sendVerifyEmail(result.user.email, result.user.name, `${base}/?verify=${result.verifyToken}`); }
          catch (e) { console.error("verify email failed:", e.message); }
        }
        const { verifyToken, ...safe } = result; // never expose the token to the client
        return send(res, 200, safe);
      }
      if (req.method === "POST" && req.url.startsWith("/api/auth/verify")) {
        return send(res, 200, await db.verifyEmail(data.token));
      }
      if (req.method === "POST" && req.url.startsWith("/api/auth/login")) {
        return send(res, 200, await db.loginUser(data.email, data.password));
      }
      if (req.method === "POST" && req.url.startsWith("/api/auth/forgot")) {
        const r = await db.createResetToken(data.email);
        if (r) {
          const base = PUBLIC_BASE;
          try { await sendResetEmail(r.user.email, r.user.name, `${base}/?reset=${r.token}`); }
          catch (e) { console.error("reset email failed:", e.message); }
        }
        return send(res, 200, { ok: true }); // always 200 — don't reveal whether the email exists
      }
      if (req.method === "POST" && req.url.startsWith("/api/auth/reset")) {
        return send(res, 200, await db.resetPassword(data.token, data.password));
      }
      // Routes below require a valid token.
      const uid = db.verifyToken(bearer(req));
      if (!uid) return send(res, 401, { error: "Not authenticated" });
      if (req.method === "GET" && req.url.startsWith("/api/auth/me")) {
        return send(res, 200, await db.getUser(uid));
      }
      if (req.method === "POST" && req.url.startsWith("/api/auth/resend-verification")) {
        const r = await db.createVerifyToken(uid);
        if (r && r.token) {
          const base = PUBLIC_BASE;
          try { await sendVerifyEmail(r.user.email, r.user.name, `${base}/?verify=${r.token}`); }
          catch (e) { console.error("verify email failed:", e.message); }
        }
        return send(res, 200, { ok: true, alreadyVerified: !!(r && r.alreadyVerified) });
      }
      if (req.method === "GET" && req.url.startsWith("/api/wallet")) {
        return send(res, 200, await db.getWallet(uid));
      }
      if (req.method === "POST" && req.url.startsWith("/api/subscription/auto-renew")) {
        return send(res, 200, { subscription: await db.setAutoRenew(uid, data.on !== false) });
      }
      if (req.method === "POST" && req.url.startsWith("/api/subscription/cancel")) {
        return send(res, 200, { subscription: await db.cancelSubscription(uid) });
      }
      if (req.method === "GET" && req.url.startsWith("/api/subscription")) {
        return send(res, 200, { subscription: await db.getSubscription(uid) });
      }
      // Activity feed (persisted so it survives a refresh).
      if (req.method === "GET" && req.url.startsWith("/api/activity")) {
        return send(res, 200, { activity: await db.listActivity(uid) });
      }
      if (req.method === "POST" && req.url.startsWith("/api/activity/read")) {
        await db.markAllActivityRead(uid);
        return send(res, 200, { ok: true });
      }
      if (req.method === "POST" && req.url.startsWith("/api/activity")) {
        await db.logActivity(uid, { kind: data.kind, title: data.title, body: data.body });
        return send(res, 200, { ok: true });
      }
      return send(res, 404, { error: "Unknown route" });
    } catch (e) {
      return send(res, e.status || 500, { error: e.message });
    }
  }

  // 3a) List the user's owned numbers + their plan's number-capacity.
  // 3a-i) Per-number incoming-call routing (ring my app / forward to a number /
  //       connect to a SIP agent / hand to my webhook). MUST be matched before the
  //       generic GET /api/numbers below (which would otherwise swallow it).
  if (req.url?.startsWith("/api/numbers/routing")) {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    if (req.method === "GET") {
      const e164 = new URL(req.url, `https://${req.headers.host}`).searchParams.get("e164") || "";
      try { return send(res, 200, await db.getNumberRouting(uid, e164)); }
      catch (e) { return send(res, e.status || 500, { error: e.message }); }
    }
    if (req.method === "POST") {
      const body = await readBody(req);
      let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
      try {
        const r = await db.setNumberRouting(uid, d.e164, { routeKind: d.routeKind, routeDest: d.routeDest });
        return send(res, 200, { ok: true, ...r });
      } catch (e) { return send(res, e.status || 500, { error: e.message }); }
    }
    return send(res, 405, { error: "Method not allowed" });
  }

  // 10DLC (US SMS registration) — per-user brand / campaign / number assignment.
  if (req.url?.startsWith("/api/10dlc")) {
    if (!db || !tenDlc) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    const url = new URL(req.url, "http://x");
    const route = url.pathname.replace(/^\/api\/10dlc\/?/, "");
    let data = {};
    if (req.method === "POST") {
      try { data = JSON.parse((await readBody(req)) || "{}"); } catch { return send(res, 400, { error: "Invalid request" }); }
    }
    try {
      if (req.method === "GET" && route === "") return send(res, 200, await tenDlc.status(uid));
      if (req.method === "GET" && route === "cost") {
        const c = await tenDlc.campaignCost(String(url.searchParams.get("usecase") || "MIXED"));
        return send(res, 200, tenDlc.billUsers ? c : { upfront: 0, monthly: 0 });
      }
      if (req.method === "POST" && route === "brand") return send(res, 200, await tenDlc.registerBrand(uid, data));
      if (req.method === "POST" && route === "brand/otp") return send(res, 200, await tenDlc.brandOtp(uid, data.pin));
      if (req.method === "POST" && route === "campaign") return send(res, 200, await tenDlc.createCampaign(uid, data));
      if (req.method === "POST" && route === "assign") return send(res, 200, await tenDlc.assignNumber(uid, data.e164));
      return send(res, 404, { error: "Not found" });
    } catch (e) {
      console.warn("10dlc:", route, e.message);
      return send(res, e.status || 502, { error: e.message || "Couldn't reach the carrier registry" });
    }
  }

  // Regulatory requirements (non-US numbers): read what Telnyx needs for a number the
  // user owns, and submit text / document / address answers onto its sub-number-order.
  if (req.url?.startsWith("/api/numbers/requirements")) {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    let e164, data = {};
    if (req.method === "GET") e164 = new URL(req.url, "http://x").searchParams.get("e164");
    else if (req.method === "POST") {
      try { data = JSON.parse((await readBody(req)) || "{}"); } catch { return send(res, 400, { error: "Invalid request" }); }
      e164 = data.e164;
    } else return send(res, 405, { error: "Method not allowed" });
    e164 = String(e164 || "").replace(/[^\d+]/g, "");
    const owner = await db.findNumberOwner(e164).catch(() => null);
    if (!owner || Number(owner.userId) !== Number(uid)) return send(res, 404, { error: "Number not found on your account" });
    try {
      const sub = await findSubNumberOrder(e164);
      if (req.method === "GET") {
        numberStatusCache.delete(e164);
        const status = await telnyxNumberStatus(e164);
        if (!sub) return send(res, 200, { status, requirements: [], requirementsMet: true });
        return send(res, 200, { status, ...(await describeRequirements(sub)) });
      }
      if (!sub) return send(res, 400, { error: "This number has no pending requirements" });
      const out = [];
      // Address first: it's the step most likely to bounce, so fail before uploading files.
      const entries = Object.entries(data.values || {}).sort(([, x], [, y]) => (y?.address ? 1 : 0) - (x?.address ? 1 : 0));
      for (const [requirementId, v] of entries) {
        if (v == null || v === "") continue;
        if (typeof v === "string") { out.push({ requirement_id: requirementId, field_value: v.trim() }); continue; }
        if (v.file) {
          const buf = Buffer.from(String(v.file.data || ""), "base64");
          if (!buf.length || buf.length > 10 * 1024 * 1024) return send(res, 400, { error: `${v.file.name || "File"}: must be under 10 MB` });
          const fd = new FormData();
          fd.append("file", new Blob([buf], { type: v.file.type || "application/octet-stream" }), v.file.name || "document");
          const r = await fetch(`${TELNYX}/documents`, { method: "POST", headers: { Authorization: `Bearer ${telnyxKey()}` }, body: fd });
          const j = await r.json().catch(() => ({}));
          if (!r.ok || !j?.data?.id) return send(res, 400, { error: `Upload failed: ${j?.errors?.[0]?.detail || r.status}` });
          out.push({ requirement_id: requirementId, field_value: j.data.id });
          continue;
        }
        if (v.address) {
          const a = v.address;
          const t = (x) => (x == null ? "" : String(x).trim()) || undefined;
          const body = {
            first_name: t(a.firstName), last_name: t(a.lastName), business_name: t(a.businessName) || t(`${a.firstName || ""} ${a.lastName || ""}`),
            street_address: t(a.street), extended_address: t(a.street2), locality: t(a.city),
            administrative_area: t(a.region), postal_code: t(a.postalCode)?.toUpperCase(),
            country_code: t(a.country)?.toUpperCase(), phone_number: t(a.phone),
          };
          const create = async () => {
            const r = await telnyxFetch("/addresses", { method: "POST", body: JSON.stringify(body) });
            return { r, j: await r.json().catch(() => ({})) };
          };
          let { r, j } = await create();
          // When the address differs from Telnyx's normalised form (spacing, case,
          // "California" vs "CA"…) it answers 422 with one "Suggestion" per field
          // instead of creating it. Take the suggestions, as the portal does, and retry.
          const errs = j?.errors || [];
          if (!j?.data?.id && errs.length && errs.every((x) => x.title === "Suggestion")) {
            for (const x of errs) {
              const field = String(x.source?.pointer || "").replace(/^\//, "");
              if (field in body || ["street_address", "extended_address", "locality", "administrative_area", "postal_code", "country_code"].includes(field)) {
                body[field] = x.detail ? String(x.detail) : undefined;
              }
            }
            ({ r, j } = await create());
          }
          if (!r.ok || !j?.data?.id) {
            console.warn(`[docs] ${e164} address rejected:`, JSON.stringify(j?.errors || r.status));
            const why = (j?.errors || []).filter((x) => x.title !== "Suggestion").map((x) => x.detail).filter(Boolean).join(" · ");
            return send(res, 400, { error: `Address not accepted by the carrier${why ? `: ${why}` : " — check the street, city, state and ZIP"}` });
          }
          out.push({ requirement_id: requirementId, field_value: j.data.id });
        }
      }
      if (!out.length) return send(res, 400, { error: "Nothing to submit" });
      const r = await telnyxFetch(`/sub_number_orders/${sub.id}`, { method: "PATCH", body: JSON.stringify({ regulatory_requirements: out }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        console.warn(`[docs] ${e164} submission rejected:`, JSON.stringify(j?.errors || r.status));
        return send(res, 400, { error: (j?.errors || []).map((x) => x.detail).filter(Boolean).join(" · ") || "Telnyx rejected the submission" });
      }
      await db.logActivity(uid, { kind: "number", title: "Documents submitted", body: `${e164}: your details were sent for review. The number activates once approved.` }).catch(() => {});
      numberStatusCache.delete(e164);
      const fresh = (await findSubNumberOrder(e164)) || sub;
      return send(res, 200, { ok: true, status: await telnyxNumberStatus(e164), ...(await describeRequirements(fresh)) });
    } catch (e) {
      return send(res, 502, { error: e.message || "Couldn't reach Telnyx" });
    }
  }

  // Countries Telnyx sells numbers in, with the line types on offer in each
  // (for the buy screen's country picker). Public catalog data, cached.
  if (req.url?.startsWith("/api/numbers/countries") && req.method === "GET") {
    if (!telnyxKey()) return send(res, 503, { error: "Telephony not configured" });
    try { return send(res, 200, { countries: await numberCountries() }); }
    catch (e) { return send(res, 502, { error: e.message || "Couldn't reach Telnyx" }); }
  }

  if (req.url?.startsWith("/api/numbers") && req.method === "GET") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    try {
      const [numbers, capacity] = await Promise.all([db.listNumbers(uid), db.numberCapacity(uid)]);
      await Promise.all((numbers || []).map(async (n) => {
        if (n.e164?.startsWith("+1")) {
          n.numberType = n.kind === "tollfree" ? "toll_free" : "local";
          // 10DLC registration state drives whether the app lets this number text.
          if (tenDlc && n.kind !== "tollfree") n.smsStatus = await tenDlc.numberSmsStatus(uid, n.e164).catch(() => "none");
          return;
        }
        const info = await telnyxNumberInfo(n.e164);
        n.telnyxStatus = info.status;
        n.numberType = info.type || n.kind;
      }));
      return send(res, 200, { numbers, capacity });
    } catch (e) {
      return send(res, e.status || 500, { error: e.message });
    }
  }

  // 3b) Buy a number — server-orchestrated so it can't be bypassed. Pay-as-you-go:
  //     every number costs the flat rental (markup over Telnyx wholesale), billed
  //     to the wallet. No plan required — just sufficient wallet balance.
  if (req.url?.startsWith("/api/numbers/buy") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    if (!telnyxKey()) return send(res, 503, { error: "Telephony not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    const body = await readBody(req);
    let data; try { data = JSON.parse(body || "{}"); } catch { data = {}; }
    const phoneNumber = String(data.phoneNumber || "");
    const kind = data.kind === "tollfree" ? "tollfree" : "local";
    const clientPrice = typeof data.price === "number" ? data.price : 0;
    if (!phoneNumber) return send(res, 400, { error: "Invalid request" });

    const free = false;
    // Look up actual Telnyx wholesale cost for this number and apply markup.
    // If the lookup fails (number already reserved), use the client-provided
    // retail price (which came from the same Telnyx API at search time).
    let wholesaleCost = kind === "tollfree" ? 2.0 : 1.0;
    let monthlyCost = null; // Telnyx's monthly cost for this exact number (renewals)
    let lookedUp = false;
    try {
      const lookupUrl = `https://api.telnyx.com/v2/available_phone_numbers?filter[phone_number]=${encodeURIComponent(phoneNumber)}&filter[limit]=1`;
      const lr = await fetch(lookupUrl, { headers: { Authorization: `Bearer ${telnyxKey()}` } });
      if (lr.ok) {
        const ld = await lr.json();
        const hit = ld?.data?.[0];
        // Telnyx ignores the exact-number filter for some countries and returns an unrelated number.
        const ci = hit?.phone_number === phoneNumber ? hit?.cost_information : null;
        const mc = parseFloat(ci?.monthly_cost), up = parseFloat(ci?.upfront_cost);
        // First charge = Telnyx's upfront cost (first month, plus any setup) when higher.
        if (mc > 0) { monthlyCost = mc; wholesaleCost = Math.max(mc, up > 0 ? up : 0); lookedUp = true; }
      }
    } catch { /* fall back */ }
    const amount = lookedUp ? markup(wholesaleCost, 2) : Math.max(clientPrice, markup(wholesaleCost, 2));
    const label = `Number ${phoneNumber} (${kind})`;

    // 1) Pay from wallet — every number costs its rental.
    let paid;
    try { paid = await takePayment(uid, amount, label); }
    catch (e) { return send(res, e.status || 500, { error: e.message }); }

    // 2) Place the Telnyx order
    try {
      const order = await orderTelnyxNumber(uid, phoneNumber, kind, { free, amount, monthlyCost });
      const wallet = paid.wallet;
      return send(res, 200, { ok: true, order, wallet, free });
    } catch (e) {
      let wallet;
      try { wallet = await db.creditWallet(uid, amount, `Refund — ${phoneNumber} order failed`); } catch { /* ignore */ }
      return send(res, 502, { error: e.message, wallet });
    }
  }

  // 3b-ii) Release (give up) a number — frees it on Telnyx + stops its rental.
  if (req.url?.startsWith("/api/numbers/release") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    const body = await readBody(req);
    let data; try { data = JSON.parse(body || "{}"); } catch { data = {}; }
    const phoneNumber = String(data.phoneNumber || "");
    if (!phoneNumber) return send(res, 400, { error: "Invalid request" });
    try {
      // Mark released in our DB first (authoritative — throws 404 if not owned),
      // then free it on Telnyx best-effort so the rental actually stops.
      const rel = await db.releaseNumber(uid, phoneNumber, "user");
      const tel = await releaseTelnyxNumber(phoneNumber);
      if (!tel.ok) console.error(`Telnyx release ${phoneNumber}: ${tel.reason}`);
      const [numbers, capacity] = await Promise.all([db.listNumbers(uid), db.numberCapacity(uid).catch(() => null)]);
      return send(res, 200, { ok: true, released: rel.ok, telnyxReleased: tel.ok, numbers, capacity });
    } catch (e) { return send(res, e.status || 500, { error: e.message }); }
  }

  // 3c) Subscribe to a bundle (Starter/Business/Pro) FROM THE WALLET. Server sets
  //     the price from plans.mjs by tier+cycle and debits the prepaid wallet;
  //     auto-renew then draws from the wallet next cycle. Paying by CARD instead
  //     goes through Stripe's Checkout (fulfilled by webhook → activateBundle),
  //     so this route is wallet-only. On activation failure the wallet is refunded.
  if (req.url?.startsWith("/api/bundles/subscribe") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    const body = await readBody(req);
    let data; try { data = JSON.parse(body || "{}"); } catch { data = {}; }
    const cycle = data.cycle === "annual" ? "annual" : "monthly";
    const charge = bundleCharge(data.tier, cycle);  // authoritative price + bundle
    if (!charge) return send(res, 400, { error: "Unknown plan" });
    const { amount, bundle } = charge;
    const label = `${bundle.name} plan (${cycle})`;

    // 1) take payment from the wallet (402 if short → app prompts a Stripe top-up)
    let paid;
    try { paid = await takePayment(uid, amount, label); }
    catch (e) { return send(res, e.status || 500, { error: e.message }); }

    // 2) activate the subscription (wallet-funded, so it auto-renews from wallet)
    try {
      const subscription = await db.activateBundle(uid, {
        tier: bundle.id, cycle, minutes: bundle.minutes, sms: bundle.sms,
        payMethod: "wallet", autoRenew: data.autoRenew !== false, amount,
      });
      await db.logActivity(uid, { kind: "wallet", title: "Plan activated", body: `Your ${bundle.name} plan (${cycle}) is now active.` });
      return send(res, 200, { ok: true, subscription, wallet: paid.wallet });
    } catch (e) {
      // refund on activation failure
      let wallet;
      try { wallet = await db.creditWallet(uid, amount, `Refund — ${bundle.name} plan`); } catch { /* ignore */ }
      return send(res, 500, { error: e.message || "Could not activate plan", wallet });
    }
  }

  // 3d) WebRTC login token for the browser softphone. Auth required; mints an
  //     ephemeral JWT (SIP password stays server-side) + returns the user's own
  //     number to use as caller ID.
  if (req.url?.startsWith("/api/telnyx/rtc-token") && req.method === "POST") {
    if (!telnyxKey()) return send(res, 503, { error: "Telephony not configured" });
    const uid = db ? db.verifyToken(bearer(req)) : null;
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    try {
      // A stable per-device id lets each signed-in device keep its OWN SIP
      // identity, so the phone and the browser can both stay registered and both
      // ring. Older clients don't send one → fall back to the per-user credential.
      let deviceId = "", platform = "";
      try { const b = JSON.parse((await readBody(req)) || "{}"); deviceId = String(b.deviceId || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 48); platform = String(b.platform || "").slice(0, 16); } catch { /* no body */ }

      let callerNumber = null, callerName = null;
      try {
        const nums = await db.listNumbers(uid);
        if (nums && nums[0]) callerNumber = nums[0].e164;
      } catch { /* no numbers yet — caller id falls back to connection default */ }
      try { const u = await db.getUser?.(uid); callerName = u?.name || null; } catch { /* optional */ }
      // Per-device (or, for legacy clients, per-user) CREDENTIAL CONNECTION login
      // (static user/pass) so the client both places AND receives calls.
      try {
        const { sipUsername, password } = deviceId
          ? await ensureDeviceSipCredential(uid, deviceId, platform)
          : await ensureUserSipCredential(uid);
        return send(res, 200, { login: sipUsername, password, sipUsername, callerNumber, callerName });
      } catch (e) {
        // Fallback to the shared static credential so voice still works at all.
        console.error("rtc per-user cred failed, using shared:", e.message);
        const creds = await ensureSipCreds();
        return send(res, 200, { login: creds.login, password: creds.password, sipUsername: creds.login, callerNumber, callerName });
      }
    } catch (e) {
      return send(res, e.status || 502, { error: e.message || "Could not start voice session" });
    }
  }

  // 3e-0) Voice usage guard — pooled talk-time budget across all profiles.
  //   GET  /api/voice/remaining  → checked BEFORE dialing (block at 0)
  //   POST /api/voice/heartbeat  → every ~15s during a call {callId, phase};
  //                                response drives the countdown + auto-cut.
  if (req.url?.startsWith("/api/voice/remaining") && req.method === "GET") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    const q = new URL(req.url, "http://x").searchParams;
    try { return send(res, 200, await voiceRemaining(uid, { to: e164Param(q.get("to")), inbound: q.get("dir") === "in" })); }
    catch (e) { return send(res, 500, { error: e.message }); }
  }
  if (req.url?.startsWith("/api/voice/heartbeat") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    const body = await readBody(req);
    let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
    const callId = String(d.callId || "");
    if (!callId) return send(res, 400, { error: "callId required" });
    try {
      const callTo = e164Param(d.to), inbound = d.dir === "in";
      beatCall(uid, callId, d.phase === "ended", { to: callTo, inbound });
      return send(res, 200, await voiceRemaining(uid, { to: callTo, inbound }));
    } catch (e) { return send(res, 500, { error: e.message }); }
  }
  // One device answered an inbound call → immediately tell the user's OTHER
  // devices to stop ringing (don't wait for the call to end). The answering
  // device already cleared its own ring locally, so a redundant cancel to it is
  // harmless (its call is "active", not "incoming").
  if (req.url?.startsWith("/api/voice/answered") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    notifyCancelCall(uid).catch(() => {});
    return send(res, 200, { ok: true });
  }

  // 3e) Call history — persisted per-user so Recents survive a refresh (WebRTC
  //     calls aren't reliably in Telnyx CDRs). GET lists; POST logs one call.
  if (req.url?.startsWith("/api/calls")) {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    if (req.method === "GET") {
      try { return send(res, 200, { calls: await db.listCalls(uid) }); }
      catch (e) { return send(res, 500, { error: e.message }); }
    }
    if (req.method === "POST") {
      const body = await readBody(req);
      let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
      try {
        const r = await db.logCall(uid, { contact: d.contact, direction: d.direction, status: d.status, duration: d.duration, via: d.via });
        // History only — the call itself is billed from Telnyx's detail records
        // (usage-billing.mjs) at its real cost, so nothing is metered here.
        return send(res, 200, { ok: true, id: r.id, minutes: callMinutes(d.duration), usage: null });
      } catch (e) { return send(res, 500, { error: e.message }); }
    }
    return send(res, 405, { error: "Method not allowed" });
  }

  // 3f) Incoming-call delivery settings — the user's forwarding cellphone +
  //     voicemail toggle. GET reads; POST updates.
  if (req.url?.startsWith("/api/user/forward")) {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    if (req.method === "GET") {
      try { const v = await db.getVoiceSettings(uid); return send(res, 200, { forwardNumber: v.forwardNumber, voicemailEnabled: v.voicemailEnabled }); }
      catch (e) { return send(res, 500, { error: e.message }); }
    }
    if (req.method === "POST") {
      const body = await readBody(req);
      let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
      try { const v = await db.setVoiceSettings(uid, { forwardNumber: d.forwardNumber, voicemailEnabled: d.voicemailEnabled }); return send(res, 200, { ok: true, ...v }); }
      catch (e) { return send(res, 500, { error: e.message }); }
    }
    return send(res, 405, { error: "Method not allowed" });
  }

  // 3g) Voicemails left when a call wasn't answered.
  if (req.url?.startsWith("/api/voicemails") && req.method === "GET") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    try { return send(res, 200, { voicemails: await db.listVoicemails(uid) }); }
    catch (e) { return send(res, 500, { error: e.message }); }
  }

  // 3h) Web Push — public VAPID key (for the browser to subscribe) + save the
  //     subscription. Lets a backgrounded browser tab get incoming-call alerts.
  if (req.url?.startsWith("/api/push/vapid") && req.method === "GET") {
    // `fcm` tells the native shell whether the server can reach Firebase at all,
    // so a device that registers a token knows to expect background alerts.
    return send(res, 200, { publicKey: vapidPublicKey(), enabled: webPushConfigured(), fcm: fcmConfigured() });
  }
  if (req.url?.startsWith("/api/push/subscribe") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    const body = await readBody(req);
    let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
    const sub = d.subscription || d;
    const keys = sub.keys || {};
    if (!sub.endpoint || !keys.p256dh || !keys.auth) return send(res, 400, { error: "Invalid subscription" });
    try { await db.savePushSubscription(uid, { endpoint: sub.endpoint, p256dh: keys.p256dh, auth: keys.auth }); return send(res, 200, { ok: true }); }
    catch (e) { return send(res, 500, { error: e.message }); }
  }
  // Native (FCM) device token registration — the Capacitor app POSTs its token here.
  if (req.url?.startsWith("/api/user/push-token") && req.method === "POST") {
    if (!db) return send(res, 503, { error: "Database not configured" });
    const uid = db.verifyToken(bearer(req));
    if (!uid) return send(res, 401, { error: "Not authenticated" });
    const body = await readBody(req);
    let d; try { d = JSON.parse(body || "{}"); } catch { d = {}; }
    if (!d.token) return send(res, 400, { error: "token required" });
    try { await db.savePushToken(uid, d.token, d.platform || "android"); return send(res, 200, { ok: true }); }
    catch (e) { return send(res, 500, { error: e.message }); }
  }

  // ── /api/blog — public blog endpoints (no auth).
  if (req.url?.startsWith("/api/blog") && !req.url.startsWith("/api/blog/admin")) {
    if (!db) return send(res, 503, { error: "Database not configured" });
    await ensureBlogTable();
    const u = new URL(req.url, "http://x");
    // GET /api/blog — list published posts
    if ((u.pathname === "/api/blog" || u.pathname === "/api/blog/") && req.method === "GET") {
      const tag = u.searchParams.get("tag") || "";
      let sql = "SELECT id, title, slug, excerpt, cover_url, author, tags, created_at FROM blog_posts WHERE status = 'published'";
      const params = [];
      if (tag) { sql += " AND FIND_IN_SET(?, tags) > 0"; params.push(tag); }
      sql += " ORDER BY created_at DESC";
      try { return send(res, 200, { posts: await db.rawQuery(sql, params) }); }
      catch (e) { return send(res, 500, { error: e.message }); }
    }
    // GET /api/blog/:slug — single published post
    const slugMatch = u.pathname.match(/^\/api\/blog\/([a-z0-9-]+)$/);
    if (slugMatch && req.method === "GET") {
      try {
        const rows = await db.rawQuery("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1", [slugMatch[1]]);
        if (!rows.length) return send(res, 404, { error: "Post not found" });
        return send(res, 200, { post: rows[0] });
      } catch (e) { return send(res, 500, { error: e.message }); }
    }
    return send(res, 404, { error: "Unknown blog route" });
  }

  // ── /api/status — public, no auth: live health of each service for the site's
  // Status page. Only up/down booleans + latency are exposed (never balances).
  if (req.url?.split("?")[0] === "/api/status" && req.method === "GET") {
    if (!statusCache || Date.now() - statusCache.at > 60_000) {
      const time = async (fn) => { const t = Date.now(); try { return { ok: !!(await fn()), ms: Date.now() - t }; } catch { return { ok: false, ms: Date.now() - t }; } };
      const [database, carrier] = await Promise.all([
        time(() => db?.dbHealth()),
        time(async () => (await telnyxFetch("/messaging_profiles?page[size]=1")).ok),
      ]);
      statusCache = { at: Date.now(), body: {
        checkedAt: new Date().toISOString(),
        services: [
          { id: "website", name: "Website & web app", ok: true },
          { id: "api", name: "Accounts, wallet & billing", ok: database.ok, ms: database.ms },
          { id: "calls", name: "Voice calls", ok: carrier.ok, ms: carrier.ms },
          { id: "sms", name: "SMS messaging", ok: carrier.ok, ms: carrier.ms },
          { id: "numbers", name: "Number search & provisioning", ok: carrier.ok, ms: carrier.ms },
        ],
      } };
    }
    return send(res, 200, statusCache.body);
  }

  // ── /api/rates — public, no auth: returns all retail rates (Telnyx wholesale + markup).
  // The app + marketing site fetch this on load so prices auto-update when Telnyx changes.
  if (req.url?.startsWith("/api/rates/country") && req.method === "GET") {
    if (!telnyxKey()) return send(res, 503, { error: "Telephony not configured" });
    const iso = String(new URL(req.url, "http://x").searchParams.get("iso") || "").toUpperCase();
    if (!/^[A-Z]{2}$/.test(iso)) return send(res, 400, { error: "Pick a country" });
    try {
      const out = await countryRates(iso);
      return out ? send(res, 200, out) : send(res, 404, { error: "No rates for that country" });
    } catch (e) { return send(res, 502, { error: e.message || "Couldn't reach the carrier" }); }
  }
  if (req.url?.startsWith("/api/rates") && req.method === "GET") {
    return send(res, 200, await getRatesWithMarkup());
  }

  // Anything that isn't an API/webhook route → serve the built front-end.
  if (!req.url?.startsWith(PREFIX)) return serveStatic(req, res);

  if (!telnyxKey()) return send(res, 503, { errors: [{ detail: "Telephony not configured (set TELNYX_API_KEY)" }] });

  // Require a valid user (or admin) token on the telephony proxy — without this,
  // anyone could call /api/telnyx/* and spend the PLATFORM's Telnyx money.
  const tnToken = bearer(req);
  const tnUid = db ? db.verifyToken(tnToken) : null;
  if (!tnUid && !verifyAdminToken(tnToken)) {
    return send(res, 401, { errors: [{ detail: "Authentication required" }] });
  }

  const path = req.url.slice(PREFIX.length); // e.g. "/messages" or "/messaging/conversations"
  const qAt = path.indexOf("?");
  const pathOnly = qAt < 0 ? path : path.slice(0, qAt);

  // Path hardening for regular users: fetch() resolves "..", "%2e%2e" and the
  // like before the request leaves, so a path that *starts* with an allowed
  // prefix could still land on any Telnyx endpoint. Only plain segments
  // (letters, digits, _ and -) are accepted — no dots, no %-escapes, no "//".
  if (tnUid && (!/^(\/[A-Za-z0-9_-]+)+$/.test(pathOnly))) {
    return send(res, 400, { errors: [{ detail: "Invalid path." }] });
  }

  // Block direct number ordering on the raw proxy — purchases MUST go through the
  // billed /api/numbers/buy route (which debits the wallet first, refunds on fail).
  if (req.method === "POST" && path.startsWith("/number_orders")) {
    return send(res, 403, { errors: [{ detail: "Use /api/numbers/buy to purchase numbers." }] });
  }

  // 2) Inbox: serve conversations from the store (DB when available). SCOPED to
  //    the authenticated user so nobody ever sees another user's messages.
  if (req.method === "GET" && path.startsWith("/messaging/conversations")) {
    return send(res, 200, await conversationsPayload(tnUid));
  }

  // Mark a thread's inbound messages read (clears the unread badge). Scoped to
  // the caller's own numbers.
  if (req.method === "POST" && path.startsWith("/messaging/read")) {
    const rb = await readBody(req);
    let d = {}; try { d = JSON.parse(rb || "{}"); } catch { /* ignore */ }
    if (db && d.owned && d.contact && tnUid) await db.markThreadRead(d.owned, d.contact, tnUid).catch(() => {});
    return send(res, 200, { ok: true });
  }

  // Delete a single message (by Telnyx id) — scoped to the caller's own numbers.
  if (req.method === "DELETE" && path.startsWith("/messaging/message")) {
    const u = new URL(req.url, "http://x");
    if (db && tnUid) await db.deleteMessageById(u.searchParams.get("id"), tnUid).catch(() => {});
    return send(res, 200, { ok: true });
  }

  // Delete a whole conversation (all messages between owned ↔ contact).
  if (req.method === "DELETE" && path.startsWith("/messaging/conversation")) {
    const u = new URL(req.url, "http://x");
    if (db && tnUid) await db.deleteThread(u.searchParams.get("owned"), u.searchParams.get("contact"), tnUid).catch(() => {});
    return send(res, 200, { ok: true });
  }

  // 2b) Document upload (regulatory KYC). The browser POSTs the raw file bytes
  //     (Content-Type = the file's type, ?filename=…); we wrap them in multipart
  //     form-data and forward to Telnyx /documents with the secret key injected.
  if (req.method === "POST" && pathOnly === "/documents") {
    try {
      const MAX_DOC = 10 * 1024 * 1024; // 10 MB — Telnyx's own limit is lower
      if (Number(req.headers["content-length"] || 0) > MAX_DOC) {
        req.resume();
        return send(res, 413, { errors: [{ detail: "File is too large (max 10 MB)." }] });
      }
      // Drain the whole body (so the 413 reply still reaches the client) but stop
      // buffering once it's over the limit — memory stays bounded.
      const chunks = [];
      let size = 0;
      for await (const c of req) {
        size += c.length;
        if (size <= MAX_DOC) chunks.push(c);
      }
      if (size > MAX_DOC) return send(res, 413, { errors: [{ detail: "File is too large (max 10 MB)." }] });
      const buf = Buffer.concat(chunks);
      const u = new URL(req.url, "http://x");
      const filename = u.searchParams.get("filename") || "document";
      const ctype = req.headers["content-type"] || "application/octet-stream";
      const fd = new FormData();
      fd.append("file", new Blob([buf], { type: ctype }), filename);
      const r = await fetch(`${TELNYX}/documents`, { method: "POST", headers: { Authorization: `Bearer ${telnyxKey()}` }, body: fd });
      return send(res, r.status, (await r.text()) || "{}");
    } catch (e) {
      return send(res, 502, { errors: [{ detail: `Document upload failed: ${e.message}` }] });
    }
  }

  const body = await readBody(req);

  // Tenancy guard: a regular user may only send SMS FROM a number they own —
  // never spoof another user's number. (Admins, tnUid null, skip this.)
  // `from` is REQUIRED: without it Telnyx would pick a sender from the shared
  // messaging profile's pool — i.e. possibly another user's number. One plain
  // recipient per send, so the 1-send metering below can't be multiplied.
  if (req.method === "POST" && path.startsWith("/messages") && tnUid) {
    if (!db) return send(res, 503, { errors: [{ detail: "Messaging is temporarily unavailable." }] });
    let msg = null;
    try { msg = JSON.parse(body || "{}"); } catch { /* ignore */ }
    const from = typeof msg?.from === "string" ? msg.from.trim() : "";
    const to = typeof msg?.to === "string" ? msg.to.trim() : "";
    if (!from || !/^\+\d{6,15}$/.test(to)) {
      return send(res, 400, { errors: [{ detail: "A sender number you own and one recipient number are required." }] });
    }
    const owner = await db.findNumberOwner(from).catch(() => null);
    if (!owner || Number(owner.userId) !== Number(tnUid)) {
      return send(res, 403, { errors: [{ detail: "You can only send from a number you own." }] });
    }
  }

  // Balance gate: block the send if the account can't afford it (plan SMS pool
  // exhausted AND an empty wallet with no card on file). Without this a $0 account
  // could send unlimited SMS that the platform pays Telnyx for. Fail-open on a DB
  // blip so a transient error never blocks a paying user.
  if (req.method === "POST" && path.startsWith("/messages") && tnUid && db) {
    let gate = {};
    try { const m = JSON.parse(body || "{}"); gate = { to: m.to, parts: smsParts(m.text) }; } catch { /* ignore */ }
    const affordable = await db.canSendSms(tnUid, gate).catch(() => true);
    if (!affordable) return send(res, 402, { errors: [{ detail: "Out of SMS credit — top up your wallet or upgrade your plan to send messages." }] });
  }

  // Lock down the raw Telnyx proxy for REGULAR users. Everything below reaches ONE
  // shared platform Telnyx account, so any unlisted path is a cross-tenant / fraud
  // risk: listing or DELETING other users' numbers, reading the whole account's
  // call detail records, or POSTing /calls to originate Call-Control calls on the
  // platform's dime. In LIVE mode the app only needs number search, outbound SMS
  // and 10DLC registration here — owned numbers, call history and dialing all go
  // through DB-scoped /api/* routes or WebRTC, never this raw proxy. Admin tokens
  // (tnUid null + valid admin token) are trusted and skip the allow-list.
  if (tnUid) {
    // Exact paths only (pathOnly is already restricted to plain segments above).
    const allowed =
      (req.method === "GET"  && pathOnly === "/available_phone_numbers") ||
      (req.method === "POST" && pathOnly === "/messages") ||
      (req.method === "GET"  && /^\/messages\/[A-Za-z0-9-]+$/.test(pathOnly));
    // 10DLC is NOT passed through: the shared account holds every user's brands,
    // so registration goes through the ownership-checked /api/10dlc/* routes.
    if (!allowed) return send(res, 403, { errors: [{ detail: "This operation isn't permitted." }] });
  }

  // 3) Everything else → forward to Telnyx with the secret key
  try {
    const r = await telnyxFetch(path, {
      method: req.method,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : body || undefined,
    });
    const text = await r.text();

    // A single-message lookup is only returned to the user who owns one end of it.
    if (tnUid && req.method === "GET" && pathOnly.startsWith("/messages/") && r.ok) {
      let ends = [];
      try {
        const d = JSON.parse(text).data ?? {};
        ends = [d.from?.phone_number, ...(Array.isArray(d.to) ? d.to.map((t) => t?.phone_number) : [])].filter(Boolean);
      } catch { /* unparseable → treated as not owned */ }
      let mine = false;
      for (const e of ends) {
        const o = await db?.findNumberOwner(e).catch(() => null);
        if (o && Number(o.userId) === Number(tnUid)) { mine = true; break; }
      }
      if (!mine) return send(res, 404, { errors: [{ detail: "Message not found." }] });
    }

    // record outbound sends so they appear in the inbox immediately
    if (req.method === "POST" && path.startsWith("/messages") && r.ok) {
      try {
        const j = JSON.parse(text);
        const d = j.data ?? {};
        recordMessage({
          owned: d.from?.phone_number ?? JSON.parse(body || "{}").from,
          contact: d.to?.[0]?.phone_number ?? JSON.parse(body || "{}").to,
          direction: "outbound",
          text: d.text ?? JSON.parse(body || "{}").text,
          status: d.to?.[0]?.status ?? "queued",
          telnyxId: d.id,
        });
      } catch { /* ignore record errors */ }
      // Billing: from Telnyx's messaging records at the real cost (usage-billing.mjs).
    }
    send(res, r.status, text || "{}");
  } catch (e) {
    send(res, 502, { errors: [{ detail: `Proxy error: ${e.message}` }] });
  }
};

// Any error a route didn't catch (malformed URL, bad JSON, DB blip…) answers 500
// instead of becoming an unhandled rejection — which would crash the process.
createServer((req, res) => {
  handleRequest(req, res).catch((e) => {
    console.error(`request failed ${req.method} ${String(req.url || "").split("?")[0].slice(0, 120)}:`, e?.message || e);
    try { send(res, 500, { error: "Something went wrong — please try again." }); } catch { /* socket gone */ }
  });
// Loopback only: the public reaches us through nginx (TLS, headers, real IP).
// Set LISTEN_HOST=0.0.0.0 to expose the port directly (e.g. a container).
}).listen(PORT, process.env.LISTEN_HOST || "127.0.0.1", () => {
  console.log(`DIGIRINGO server listening on :${PORT}`);
  console.log(`  site     : http://localhost:${PORT}/         (marketing)`);
  console.log(`  app      : http://localhost:${PORT}/app      (mobile app)`);
  console.log(`  admin    : http://localhost:${PORT}/admin    (Control Hub)`);
  console.log(`  app API  : http://localhost:${PORT}${PREFIX}  → ${TELNYX}`);
  console.log(`  webhooks : http://localhost:${PORT}/webhooks/telnyx`);

  // Load Control-Hub-managed settings (encrypted key overrides + config) into
  // the in-memory cache, THEN point the messaging profile's inbound webhook at us
  // (best-effort — a Telnyx blip must not crash boot). Until load() resolves,
  // telnyxKey()/Stripe fall back to env, so nothing breaks in the gap.
  settings.load()
    .catch((e) => console.error("settings.load:", e.message))
    .finally(() => {
      if (telnyxKey()) ensureMessagingProfile().catch((e) => console.error("ensureMessagingProfile:", e.message));
    });

  // Usage billing: calls & SMS at Telnyx's real cost + markup, every few minutes.
  if (db?.recordUsage && telnyxKey()) createUsageSync({ db, telnyxFetch }).start();

  // Auto-renew engine: charge due bundle subscriptions from the wallet, at boot
  // and hourly thereafter. Lazy renewal on access (getSubscription) covers the
  // gaps between ticks for active users.
  if (db?.renewDueSubscriptions) {
    const runRenewals = () => Promise.allSettled([
      db.renewDueSubscriptions()
        .then((n) => { if (n) console.log(`↻ auto-renewed ${n} subscription(s)`); }),
      db.renewDueNumbers?.({ resolveMonthlyCost: numberMonthlyCost })
        .then((n) => { if (n) console.log(`↻ auto-renewed ${n} number rental(s)`); }),
      db.renewDueTenDlc?.()
        .then((n) => { if (n) console.log(`↻ charged ${n} 10DLC campaign fee(s)`); }),
    ]).then((rs) => rs.forEach((r) => { if (r.status === "rejected") console.error("renewal sweep failed:", r.reason?.message); }));
    runRenewals();
    setInterval(runRenewals, 60 * 60 * 1000).unref?.();
  }

  // Carrier-side changes to numbers (cancelled orders, approvals) every 15 min.
  if (db?.listLiveNumbers && telnyxKey()) {
    const runReconcile = () => reconcileNumbers().catch((e) => console.error("number reconcile failed:", e.message));
    setTimeout(runReconcile, 30_000).unref?.();
    setInterval(runReconcile, 15 * 60 * 1000).unref?.();
  }
});
