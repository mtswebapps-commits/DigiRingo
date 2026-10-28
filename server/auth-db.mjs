/**
 * DIGIRINGO — database layer (MySQL/MariaDB) for real auth + persistent wallet.
 *
 * The only external dependency in the whole backend. Everything else (password
 * hashing, auth tokens) uses Node's built-in `node:crypto` — no bcrypt/jwt deps.
 *
 * Tables (created once via SQL):
 *   users(id, email UNIQUE, password_hash, name, wallet_balance, created_at)
 *   wallet_transactions(id, user_id, amount, label, kind, ref, created_at)
 *   subscriptions(id, user_id, tier, cycle, minutes_included, sms_included,
 *                 minutes_used, sms_used, status, period_end, pay_method,
 *                 auto_renew, renew_amount, created_at)
 *
 * Env: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, AUTH_SECRET
 */
import mysql from "mysql2/promise";
import { randomBytes, scryptSync, timingSafeEqual, createHmac, createHash } from "node:crypto";
import { PAYG_RELOAD, OVERFLOW_RATES, NUMBER_RENTAL, bundleFor } from "./plans.mjs";
import { retailOf, isDomestic, rateKey, defaultWholesale } from "./usage-rates.mjs";
import { outboundRate, smsRateMax } from "./rate-deck.mjs";
import { chargeOffSession, stripeConfigured } from "./stripe.mjs";
import { chargeOffSession as paypalChargeOffSession, paypalConfigured } from "./paypal.mjs";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  charset: "utf8mb4_unicode_ci",
});

// Never fall back to a guessable constant — anyone could forge tokens with it.
// Without AUTH_SECRET a random per-boot secret is used (sessions end on restart).
const AUTH_SECRET = process.env.AUTH_SECRET || randomBytes(32).toString("hex");
if (!process.env.AUTH_SECRET) console.warn("⚠ AUTH_SECRET not set — using a random secret; logins won't survive a restart.");

/** Throws an Error carrying an HTTP status the router can use. */
function httpErr(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

export async function dbHealth() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows[0]?.ok === 1;
}

export async function rawQuery(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/* ----------------------------------------------------------- password hashing */
function hashPassword(pw) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(pw, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(pw, salt, 64);
  const orig = Buffer.from(hash, "hex");
  return test.length === orig.length && timingSafeEqual(test, orig);
}

/* --------------------------------------------------- stateless HMAC auth token */
const b64u = (s) => Buffer.from(s).toString("base64url");
const TOKEN_DAYS = 30;

// Revocation: tokens issued before a user's "valid after" time are rejected
// (set on password reset and on suspension; suspended = Infinity). Kept in
// memory so verifyToken stays synchronous, persisted in users.tokens_valid_after.
const tokenFloor = new Map(); // uid → ms
async function loadTokenFloors() {
  try { await pool.query("ALTER TABLE users ADD COLUMN tokens_valid_after BIGINT NOT NULL DEFAULT 0"); }
  catch (e) { if (e?.errno !== 1060) throw e; }
  const [rows] = await pool.query("SELECT id, tokens_valid_after, status FROM users WHERE tokens_valid_after > 0 OR status = 'suspended'");
  for (const r of rows) {
    tokenFloor.set(Number(r.id), String(r.status) === "suspended" ? Infinity : Number(r.tokens_valid_after) || 0);
  }
}
loadTokenFloors().catch((e) => console.error("token revocation list:", e.message));

/** End every existing session of a user (persisted best-effort). */
async function revokeTokens(uid, { suspended = false } = {}) {
  const now = Date.now();
  tokenFloor.set(Number(uid), suspended ? Infinity : now);
  try { await pool.query("UPDATE users SET tokens_valid_after = ? WHERE id = ?", [now, uid]); }
  catch (e) { console.error("revokeTokens:", e.message); }
}

function signToken(uid, days = TOKEN_DAYS) {
  const now = Date.now();
  const payload = b64u(JSON.stringify({ uid, iat: now, exp: now + days * 86400000 }));
  const sig = createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
/** Returns the user id from a valid token, or null. */
export function verifyToken(token) {
  if (!token) return null;
  const [payload, sig] = String(token).split(".");
  if (!payload || !sig) return null;
  const expect = createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(expect);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { uid, exp, iat } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!uid || Date.now() > exp) return null;
    const floor = tokenFloor.get(Number(uid));
    if (floor) {
      const issued = Number(iat) || Number(exp) - TOKEN_DAYS * 86400000; // older tokens carry no iat
      if (!(issued >= floor)) return null;
    }
    return uid;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ shaping */
const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  walletBalance: Number(u.wallet_balance),
  emailVerified: !!Number(u.email_verified),
});

function relTime(d) {
  const t = d instanceof Date ? d : new Date(d);
  const diff = Date.now() - t.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return t.toLocaleDateString([], { month: "short", day: "numeric" });
}

/* -------------------------------------------------------------------- auth */
export async function registerUser(email, password, name) {
  email = String(email || "").trim().toLowerCase();
  if (!email || !password) throw httpErr(400, "Email and password are required");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw httpErr(400, "Enter a valid email");
  if (String(password).length < 6) throw httpErr(400, "Password must be at least 6 characters");

  const [dup] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (dup.length) throw httpErr(409, "An account with this email already exists");

  const [r] = await pool.query(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    [email, hashPassword(password), String(name || "").trim()]
  );
  // Issue an email-verification token (valid 24h) so the caller can email a link.
  const verifyToken = randomBytes(32).toString("hex");
  await pool.query(
    "UPDATE users SET verify_token_hash = ?, verify_expires = ? WHERE id = ?",
    [sha256(verifyToken), Date.now() + 24 * 60 * 60 * 1000, r.insertId]
  );
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [r.insertId]);
  return { token: signToken(r.insertId), user: publicUser(rows[0]), verifyToken };
}

/* ------------------------------------------------------ email verification */
/** Consume a verification token and mark the email verified (expiry-checked). */
export async function verifyEmail(rawToken) {
  if (!rawToken) throw httpErr(400, "Invalid verification link");
  const [rows] = await pool.query(
    "SELECT id, email FROM users WHERE verify_token_hash = ? AND verify_expires > ?",
    [sha256(rawToken), Date.now()]
  );
  if (!rows[0]) throw httpErr(400, "This verification link is invalid or has expired");
  await pool.query(
    "UPDATE users SET email_verified = 1, verify_token_hash = '', verify_expires = 0 WHERE id = ?",
    [rows[0].id]
  );
  return { ok: true, email: rows[0].email };
}

/** Create a fresh verification token for a user (resend). Returns {user, token},
 *  or {alreadyVerified:true} if the email is already verified, or null if no user. */
export async function createVerifyToken(uid) {
  const [rows] = await pool.query("SELECT id, email, name, email_verified FROM users WHERE id = ?", [uid]);
  const u = rows[0];
  if (!u) return null;
  if (Number(u.email_verified)) return { alreadyVerified: true, user: { email: u.email, name: u.name } };
  const token = randomBytes(32).toString("hex");
  await pool.query(
    "UPDATE users SET verify_token_hash = ?, verify_expires = ? WHERE id = ?",
    [sha256(token), Date.now() + 24 * 60 * 60 * 1000, uid]
  );
  return { user: { email: u.email, name: u.name }, token };
}

export async function loginUser(email, password) {
  email = String(email || "").trim().toLowerCase();
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const u = rows[0];
  if (!u || !verifyPassword(password, u.password_hash)) {
    throw httpErr(401, "Invalid email or password");
  }
  if (String(u.status || "active") === "suspended") {
    throw httpErr(403, "This account has been suspended. Contact support.");
  }
  return { token: signToken(u.id), user: publicUser(u) };
}

export async function getUser(uid) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [uid]);
  if (!rows[0]) throw httpErr(404, "User not found");
  return publicUser(rows[0]);
}

/* ------------------------------------------------ social sign-in (Google/Apple)
 * The users table predates OAuth. Add the provider columns on first use — the
 * hosts block the shell, so DDL is self-applied (like sip_devices). MySQL has no
 * ADD COLUMN IF NOT EXISTS, so each ALTER is tried and "duplicate column" (errno
 * 1060) is swallowed. */
let oauthColsReady = false;
async function ensureOAuthColumns() {
  if (oauthColsReady) return;
  const add = async (sql) => { try { await pool.query(sql); } catch (e) { if (e?.errno !== 1060) throw e; } };
  await add("ALTER TABLE users ADD COLUMN provider VARCHAR(16) NOT NULL DEFAULT ''");
  await add("ALTER TABLE users ADD COLUMN provider_id VARCHAR(255) NOT NULL DEFAULT ''");
  // OAuth-only accounts carry no password — make the column nullable if it isn't.
  try { await pool.query("ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL"); } catch { /* already nullable / different type — non-fatal */ }
  oauthColsReady = true;
}

/* ---------------------------------------------- per-number incoming-call routing
 * By default a number rings the owner's in-app softphone (route_kind 'app'). A
 * user can instead point ONE number's inbound calls at their own destination:
 *   'number'  → forward to a PSTN number  (<Dial><Number>)
 *   'sip'     → connect to a SIP endpoint (<Dial><Sip>) — e.g. an AI voice agent
 *   'webhook' → hand the whole call to their own TeXML URL (<Redirect>) — e.g. a
 *               caller agent that controls the call itself.
 * Columns are self-applied like the OAuth ones (no shell on the host). */
const ROUTE_KINDS = new Set(["app", "number", "sip", "webhook"]);
let routeColsReady = false;
async function ensureRoutingColumns() {
  if (routeColsReady) return;
  const add = async (sql) => { try { await pool.query(sql); } catch (e) { if (e?.errno !== 1060) throw e; } };
  await add("ALTER TABLE numbers ADD COLUMN route_kind VARCHAR(16) NOT NULL DEFAULT 'app'");
  await add("ALTER TABLE numbers ADD COLUMN route_dest VARCHAR(255) NOT NULL DEFAULT ''");
  routeColsReady = true;
}

/** Read one owned number's incoming-call routing (owner-scoped). */
export async function getNumberRouting(uid, e164) {
  await ensureRoutingColumns();
  const norm = onlyDigitsPlus(e164);
  if (!norm) throw httpErr(400, "Invalid number");
  const [rows] = await pool.query(
    "SELECT route_kind, route_dest FROM numbers WHERE user_id = ? AND e164 = ? AND status = 'active' LIMIT 1",
    [uid, norm]
  );
  const r = rows[0];
  if (!r) throw httpErr(404, "Number not found");
  return { routeKind: r.route_kind || "app", routeDest: r.route_dest || "" };
}

/** Validate + save one owned number's incoming-call routing (owner-scoped). */
export async function setNumberRouting(uid, e164, { routeKind, routeDest }) {
  await ensureRoutingColumns();
  const norm = onlyDigitsPlus(e164);
  if (!norm) throw httpErr(400, "Invalid number");
  const kind = ROUTE_KINDS.has(routeKind) ? routeKind : "app";
  let dest = String(routeDest || "").trim();
  if (kind === "app") {
    dest = "";
  } else if (kind === "number") {
    dest = onlyDigitsPlus(dest);
    if (!dest) throw httpErr(400, "Enter a valid phone number to forward to");
  } else if (kind === "sip") {
    if (!/^sip:/i.test(dest)) dest = `sip:${dest}`;
    if (!/^sip:[^\s@]+@[^\s@]+$/i.test(dest)) throw httpErr(400, "Enter a valid SIP URI, e.g. sip:agent@example.com");
  } else if (kind === "webhook") {
    if (!/^https:\/\/[^\s]+$/i.test(dest)) throw httpErr(400, "Webhook URL must start with https://");
    if (dest.length > 255) throw httpErr(400, "Webhook URL is too long");
  }
  const [r] = await pool.query(
    "UPDATE numbers SET route_kind = ?, route_dest = ? WHERE user_id = ? AND e164 = ? AND status = 'active'",
    [kind, dest, uid, norm]
  );
  if (!r.affectedRows) throw httpErr(404, "Number not found");
  return { routeKind: kind, routeDest: dest };
}

/**
 * Find-or-create a user from a verified OAuth profile, then issue a session.
 *   1) match on (provider, provider_id) — the stable account link;
 *   2) else match on email and LINK this provider onto that existing account;
 *   3) else create a fresh, already-verified, password-less account.
 * Returns { token, user } exactly like loginUser.
 */
export async function upsertOAuthUser({ provider, providerId, email, name }) {
  await ensureOAuthColumns();
  provider = String(provider || "").slice(0, 16);
  providerId = String(providerId || "");
  email = String(email || "").trim().toLowerCase();
  if (!provider || !providerId) throw httpErr(400, "Incomplete sign-in profile");

  // 1) existing provider link
  let [rows] = await pool.query(
    "SELECT * FROM users WHERE provider = ? AND provider_id = ? LIMIT 1", [provider, providerId]
  );
  let u = rows[0];

  // 2) link this provider onto an account that already owns the email
  if (!u && email) {
    [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    u = rows[0];
    if (u) {
      await pool.query(
        "UPDATE users SET provider = ?, provider_id = ?, email_verified = 1 WHERE id = ?",
        [provider, providerId, u.id]
      );
    }
  }

  // 3) brand-new verified account (no password)
  let isNew = false;
  if (!u) {
    isNew = true;
    if (!email) throw httpErr(400, "This sign-in did not share an email address");
    const [r] = await pool.query(
      "INSERT INTO users (email, password_hash, name, provider, provider_id, email_verified) VALUES (?, NULL, ?, ?, ?, 1)",
      [email, String(name || "").trim(), provider, providerId]
    );
    [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [r.insertId]);
    u = rows[0];
  } else if (String(u.status || "active") === "suspended") {
    throw httpErr(403, "This account has been suspended. Contact support.");
  }

  return { token: signToken(u.id), user: publicUser(u), isNew };
}

/* ------------------------------------------------------ password reset */
const sha256 = (s) => createHash("sha256").update(String(s)).digest("hex");

/** Create a one-hour reset token for an email. Returns {user, token} or null if
 *  no such user (the caller still responds 200, to not reveal who has an account). */
export async function createResetToken(email) {
  email = String(email || "").trim().toLowerCase();
  const [rows] = await pool.query("SELECT id, email, name FROM users WHERE email = ?", [email]);
  const u = rows[0];
  if (!u) return null;
  const token = randomBytes(32).toString("hex");
  await pool.query(
    "UPDATE users SET reset_token_hash = ?, reset_expires = ? WHERE id = ?",
    [sha256(token), Date.now() + 60 * 60 * 1000, u.id]
  );
  return { user: { id: u.id, email: u.email, name: u.name }, token };
}

/** Consume a reset token and set a new password (one-time, expiry-checked). */
export async function resetPassword(rawToken, newPassword) {
  if (!rawToken) throw httpErr(400, "Invalid reset link");
  if (!newPassword || String(newPassword).length < 6) throw httpErr(400, "Password must be at least 6 characters");
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE reset_token_hash = ? AND reset_expires > ?",
    [sha256(rawToken), Date.now()]
  );
  if (!rows[0]) throw httpErr(400, "This reset link is invalid or has expired");
  await pool.query(
    "UPDATE users SET password_hash = ?, reset_token_hash = '', reset_expires = 0 WHERE id = ?",
    [hashPassword(newPassword), rows[0].id]
  );
  await revokeTokens(rows[0].id); // a new password signs out every old session
  return { ok: true };
}

/* ------------------------------------------------------------------ wallet */
export async function getWallet(uid) {
  const [u] = await pool.query("SELECT wallet_balance FROM users WHERE id = ?", [uid]);
  const [tx] = await pool.query(
    "SELECT id, amount, label, kind, ref, created_at FROM wallet_transactions WHERE user_id = ? ORDER BY id DESC LIMIT 100",
    [uid]
  );
  return {
    balance: Number(u[0]?.wallet_balance ?? 0),
    txns: tx.map((t) => ({
      id: `tx_${t.id}`,
      amount: Number(t.amount),
      label: t.label,
      kind: t.kind,
      time: relTime(t.created_at),
      // Payment reference (e.g. "fs_<Freemius payment id>") + epoch ms — lets the
      // app report each card top-up to analytics exactly once.
      ref: t.ref || "",
      at: new Date(t.created_at).getTime() || 0,
    })),
  };
}

/** Credits the wallet atomically and records a transaction. Returns the wallet. */
export async function creditWallet(uid, amount, label = "Wallet top-up", ref = "") {
  amount = Number(amount);
  if (!(amount > 0)) throw httpErr(400, "Invalid amount");
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?", [amount, uid]);
    await conn.query(
      "INSERT INTO wallet_transactions (user_id, amount, label, kind, ref) VALUES (?, ?, ?, 'topup', ?)",
      [uid, amount, label, ref]
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  // Collect any usage still owed from when the wallet ran dry (never reloads).
  await settleOwed(uid, "", { reload: false }).catch((e) => console.error("settleOwed:", e.message));
  return getWallet(uid);
}

/* ------------------------------------------------------------------- inbox */
const digits = (s) => (s ?? "").toString().replace(/\D/g, "");
const shortTimeOf = (d) => {
  const t = d instanceof Date ? d : new Date(d);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/** Persist a single SMS (inbound or outbound) so the inbox survives restarts. */
export async function recordMessage({ owned, contact, direction, body, status, telnyxId }) {
  if (!owned || !contact) return;
  await pool.query(
    "INSERT INTO messages (owned, contact, direction, body, status, telnyx_id) VALUES (?, ?, ?, ?, ?, ?)",
    [owned, contact, direction, body || "", status || (direction === "inbound" ? "delivered" : "sent"), telnyxId || ""]
  );
}

/** Update a message's delivery status by its Telnyx id (DLR webhook). */
export async function updateMessageStatus(telnyxId, status) {
  if (!telnyxId) return;
  await pool.query("UPDATE messages SET status = ? WHERE telnyx_id = ?", [status, telnyxId]);
}

/** Mark a thread's inbound messages as read (clears the unread badge). Matches on
 *  digits only so "+44 7700…" and "447700…" are treated the same. */
export async function markThreadRead(owned, contact, uid) {
  if (!uid) return;
  await pool.query(
    `UPDATE messages SET status = 'read'
       WHERE REGEXP_REPLACE(owned, '[^0-9]', '') = REGEXP_REPLACE(?, '[^0-9]', '')
         AND REGEXP_REPLACE(contact, '[^0-9]', '') = REGEXP_REPLACE(?, '[^0-9]', '')
         AND direction = 'inbound' AND status <> 'read'
         AND EXISTS (SELECT 1 FROM numbers n WHERE n.user_id = ?
                       AND REGEXP_REPLACE(n.e164, '[^0-9]', '') = REGEXP_REPLACE(?, '[^0-9]', ''))`,
    [owned, contact, Number(uid), owned]
  );
}

/** Delete an entire conversation (all messages between owned ↔ contact). SCOPED:
 *  only deletes if the owned number belongs to `uid`, so nobody can wipe another
 *  user's thread. Matches on digits. */
export async function deleteThread(owned, contact, uid) {
  if (!uid || !owned || !contact) return;
  await pool.query(
    `DELETE m FROM messages m
       JOIN numbers n ON REGEXP_REPLACE(n.e164, '[^0-9]', '') = REGEXP_REPLACE(m.owned, '[^0-9]', '')
      WHERE n.user_id = ?
        AND REGEXP_REPLACE(m.owned, '[^0-9]', '')   = REGEXP_REPLACE(?, '[^0-9]', '')
        AND REGEXP_REPLACE(m.contact, '[^0-9]', '') = REGEXP_REPLACE(?, '[^0-9]', '')`,
    [Number(uid), owned, contact]
  );
}

/** Delete a single message by its Telnyx id. SCOPED to the caller's own numbers. */
export async function deleteMessageById(telnyxId, uid) {
  if (!uid || !telnyxId) return;
  await pool.query(
    `DELETE m FROM messages m
       JOIN numbers n ON REGEXP_REPLACE(n.e164, '[^0-9]', '') = REGEXP_REPLACE(m.owned, '[^0-9]', '')
      WHERE n.user_id = ? AND m.telnyx_id = ?`,
    [Number(uid), telnyxId]
  );
}

/** Group a user's messages into conversation threads (owned number ↔ contact).
 *  SCOPED per-user: only threads whose `owned` number belongs to `uid` are
 *  returned — a user must NEVER see another user's inbox. Matches on digits so
 *  "+1 (770)…" and "1770…" are the same number. */
export async function getThreads(uid) {
  if (!uid) return [];
  const [rows] = await pool.query(
    `SELECT m.owned, m.contact, m.direction, m.body, m.status, m.telnyx_id, m.created_at
       FROM messages m
       JOIN numbers n
         ON REGEXP_REPLACE(n.e164, '[^0-9]', '') = REGEXP_REPLACE(m.owned, '[^0-9]', '')
      WHERE n.user_id = ?
      ORDER BY m.id ASC`,
    [Number(uid)]
  );
  const map = new Map();
  for (const m of rows) {
    const k = `${m.owned}|${m.contact}`;
    let t = map.get(k);
    if (!t) { t = { owned: m.owned, contact: m.contact, unread: 0, time: "", messages: [] }; map.set(k, t); }
    t.messages.push({
      id: m.telnyx_id || `db_${digits(m.created_at)}_${t.messages.length}`,
      direction: m.direction, text: m.body || "", status: m.status, time: shortTimeOf(m.created_at),
    });
    t.time = shortTimeOf(m.created_at);
    if (m.direction === "inbound" && m.status !== "read") t.unread += 1;
  }
  return [...map.values()];
}

/** Record a card (PayPal) purchase in the history WITHOUT touching the wallet
 *  balance — the money went straight to the purchase, never into the wallet.
 *  Shows up as a spend in the transaction list. Returns the wallet. */
export async function recordCardCharge(uid, amount, label = "Card payment") {
  amount = Math.abs(Number(amount));
  if (!(amount > 0)) throw httpErr(400, "Invalid amount");
  await pool.query(
    "INSERT INTO wallet_transactions (user_id, amount, label, kind) VALUES (?, ?, ?, 'card')",
    [uid, -amount, label]
  );
  return getWallet(uid);
}

/* ----------------------------------------------------------- subscriptions */
const CYCLE_MS = { monthly: 30 * 86400000, annual: 365 * 86400000 };

const shapeSub = (s) => s ? {
  tier: s.tier,
  cycle: s.cycle,
  minutesIncluded: Number(s.minutes_included),
  smsIncluded: Number(s.sms_included),
  minutesUsed: Number(s.minutes_used),
  smsUsed: Number(s.sms_used),
  status: s.status,
  periodEnd: Number(s.period_end),
  payMethod: s.pay_method || "wallet",
  autoRenew: !!Number(s.auto_renew),
  renewAmount: Number(s.renew_amount || 0),
} : null;

/**
 * Try to auto-renew a due subscription by debiting the wallet for its renewal
 * amount. On success the period rolls forward and included-usage resets; on
 * failure (or if the wallet is short) the plan is marked 'past_due'. Returns the
 * refreshed row, or null if it could not be renewed.
 *
 * NOTE: renewals are funded from the WALLET. Unattended card charging needs a
 * PayPal billing agreement / Subscriptions API (a future upgrade); until then
 * users keep the wallet topped up (by card) and renewals draw from it.
 */
/* ------------------------------------------------------------ card on file */
/** The user's saved Stripe customer + masked default card (or null). */
export async function getBillingProfile(uid) {
  const [rows] = await pool.query("SELECT * FROM billing_profiles WHERE user_id = ?", [uid]);
  const r = rows[0];
  if (!r) return null;
  return {
    customerId: r.stripe_customer_id || "",
    paymentMethodId: r.payment_method_id || "",
    brand: r.brand || "", last4: r.last4 || "",
    expMonth: Number(r.exp_month) || 0, expYear: Number(r.exp_year) || 0,
  };
}

/** Upsert the saved customer/card. Card fields optional (customer-only save). */
export async function saveBillingProfile(uid, { customerId, paymentMethodId, brand, last4, expMonth, expYear } = {}) {
  await pool.query(
    `INSERT INTO billing_profiles (user_id, stripe_customer_id, payment_method_id, brand, last4, exp_month, exp_year)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         stripe_customer_id = IF(VALUES(stripe_customer_id) <> '', VALUES(stripe_customer_id), stripe_customer_id),
         payment_method_id  = IF(VALUES(payment_method_id)  <> '', VALUES(payment_method_id),  payment_method_id),
         brand     = IF(VALUES(payment_method_id) <> '', VALUES(brand),     brand),
         last4     = IF(VALUES(payment_method_id) <> '', VALUES(last4),     last4),
         exp_month = IF(VALUES(payment_method_id) <> '', VALUES(exp_month), exp_month),
         exp_year  = IF(VALUES(payment_method_id) <> '', VALUES(exp_year),  exp_year)`,
    [uid, customerId || "", paymentMethodId || "", brand || "", last4 || "", Number(expMonth) || 0, Number(expYear) || 0]
  );
}

/** Charge the user's saved payment method off-session (auto-renew). Works with
 *  either rail: a vaulted PayPal payer (brand "PayPal" → reference transaction) or
 *  a saved Stripe card. Returns true when the charge succeeded, false when there's
 *  no usable method on file or the provider declined it — the caller then falls
 *  back to the wallet. PayPal off-session needs Reference Transactions enabled on
 *  the merchant account (PAYPAL_VAULT); without it this simply returns false. */
async function chargeSavedCard(uid, amount, description) {
  const bp = await getBillingProfile(uid);
  if (!bp?.paymentMethodId) return false;
  // PayPal vaulted payer.
  if (bp.brand === "PayPal" && paypalConfigured()) {
    try {
      await paypalChargeOffSession({
        vaultId: bp.paymentMethodId, amountCents: Math.round(amount * 100),
        description, metadata: { uid: String(uid), kind: "renewal" },
      });
      return true;
    } catch (e) {
      console.error(`[billing] PayPal off-session charge failed for uid=${uid}:`, e.message);
      return false;
    }
  }
  // Stripe saved card.
  if (!stripeConfigured() || !bp.customerId) return false;
  try {
    await chargeOffSession({
      customerId: bp.customerId, paymentMethodId: bp.paymentMethodId,
      amountCents: Math.round(amount * 100), description,
      metadata: { uid: String(uid), kind: "renewal" },
    });
    return true;
  } catch (e) {
    console.error(`[billing] off-session charge failed for uid=${uid}:`, e.message);
    return false;
  }
}

/** Atomic wallet debit; returns true when the balance covered it. */
async function debitIfEnough(uid, amount, label) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.query(
      "UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ? AND wallet_balance >= ?",
      [amount, uid, amount]
    );
    if (r.affectedRows === 0) { await conn.rollback(); return false; }
    await conn.query(
      "INSERT INTO wallet_transactions (user_id, amount, label, kind) VALUES (?, ?, ?, 'charge')",
      [uid, -amount, label]
    );
    await conn.commit();
    return true;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

/** Renew one due subscription. CARD-paid plans charge the saved card DIRECTLY
 *  (wallet untouched); wallet-paid plans debit the wallet. Either path falls
 *  back to the other before going past_due. */
async function tryRenew(s) {
  // Claim this renewal atomically so concurrent triggers — the lazy renew in
  // getSubscription (which the app can fire ~6× in a couple seconds during a
  // billing sync) racing the hourly sweep — can't each charge for the same
  // period. Only the worker that flips the row out of its exact (active,
  // period_end) state wins; everyone else reloads and bails without charging.
  const [claim] = await pool.query(
    "UPDATE subscriptions SET status = 'renewing' WHERE id = ? AND status = 'active' AND period_end = ?",
    [s.id, s.period_end]
  );
  if (!claim.affectedRows) {
    const [rows] = await pool.query("SELECT * FROM subscriptions WHERE id = ?", [s.id]);
    return rows[0] || null;
  }

  const amount = Number(s.renew_amount || 0);
  const c = s.cycle === "annual" ? "annual" : "monthly";
  const label = `Auto-renew — ${s.tier} plan (${c})`;

  let paid = false, how = "";
  const cardFirst = s.pay_method === "card";
  if (cardFirst && await chargeSavedCard(s.user_id, amount, label)) { paid = true; how = "card"; }
  if (!paid && await debitIfEnough(s.user_id, amount, label)) { paid = true; how = "wallet"; }
  if (!paid && !cardFirst && await chargeSavedCard(s.user_id, amount, label)) { paid = true; how = "card"; }

  if (!paid) {
    await pool.query("UPDATE subscriptions SET status = 'past_due' WHERE id = ?", [s.id]);
    await logActivity(s.user_id, { kind: "wallet", title: "Plan renewal failed", body: `We couldn't renew your ${s.tier} plan — your card was declined or missing and the wallet is short. Top up or update your card to restore service.` }).catch(() => {});
  } else {
    const nextEnd = Number(s.period_end) + (CYCLE_MS[c] || CYCLE_MS.monthly);
    await pool.query(
      "UPDATE subscriptions SET status = 'active', period_end = ?, minutes_used = 0, sms_used = 0 WHERE id = ?",
      [nextEnd, s.id]
    );
    const bp = how === "card" ? await getBillingProfile(s.user_id) : null;
    await logActivity(s.user_id, { kind: "wallet", title: "Plan auto-renewed", body: how === "card"
      ? `Your ${s.tier} plan renewed — $${amount.toFixed(2)} charged to your ${bp?.brand || "card"} •••• ${bp?.last4 || ""}.`
      : `Your ${s.tier} plan renewed — $${amount.toFixed(2)} paid from your wallet.` }).catch(() => {});
  }
  // Always return the refreshed row (active if renewed, past_due if it failed).
  const [rows] = await pool.query("SELECT * FROM subscriptions WHERE id = ?", [s.id]);
  return rows[0] || null;
}

/** Attach the plan's number-capacity (used / free-included / max) to a shaped
 *  subscription so the app knows whether the next number is free, a rental, or
 *  over the cap. No-op for a null subscription. */
async function attachCapacity(uid, shaped) {
  if (!shaped) return null;
  const b = bundleFor(shaped.tier);
  const used = await countNumbers(uid);
  return {
    ...shaped,
    numbersUsed: used,
    numbersIncluded: b ? b.numbersIncluded : 0,
    numbersMax: b ? b.maxNumbers : 0,
  };
}

/** The user's current subscription (active or past_due), or null. Active plans
 *  whose period has lapsed are auto-renewed from the wallet lazily on access. */
export async function getSubscription(uid) {
  const [rows] = await pool.query(
    "SELECT * FROM subscriptions WHERE user_id = ? AND status IN ('active','past_due','renewing') ORDER BY id DESC LIMIT 1",
    [uid]
  );
  const s = rows[0];
  if (!s) return null;
  // Mid-renewal (another worker holds the claim) → show it as active; don't
  // trigger a second renewal. It resolves to active/past_due within ~1s.
  if (s.status === "renewing") return attachCapacity(uid, shapeSub({ ...s, status: "active" }));
  // Only an ACTIVE plan whose period has lapsed triggers a renewal attempt. A
  // past_due plan is surfaced as-is so the app can prompt a top-up (recovery is
  // by re-subscribing, which supersedes the past_due row).
  if (s.status === "active" && Number(s.period_end) > 0 && Date.now() > Number(s.period_end)) {
    if (Number(s.auto_renew)) {
      const renewed = await tryRenew(s).catch(() => null);
      return attachCapacity(uid, shapeSub(renewed)); // active (rolled) or past_due
    }
    await pool.query("UPDATE subscriptions SET status = 'expired' WHERE id = ?", [s.id]);
    return null;
  }
  return attachCapacity(uid, shapeSub(s));
}

/** The raw ACTIVE subscription row (no renewal side-effects), or null. */
async function getActiveSubRow(uid) {
  const [rows] = await pool.query(
    "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1",
    [uid]
  );
  return rows[0] || null;
}

/** The latest ACTIONABLE subscription (active/past_due/paused) — for the admin
 *  view + status changes, which need to see paused plans that getSubscription hides. */
async function latestActionableSub(uid) {
  const [rows] = await pool.query(
    "SELECT * FROM subscriptions WHERE user_id = ? AND status IN ('active','past_due','paused') ORDER BY id DESC LIMIT 1",
    [uid]
  );
  return rows[0] || null;
}

/**
 * Change a subscription's lifecycle state. `action`:
 *   cancel  → ends the plan now (→ pay-as-you-go); from active/past_due/paused
 *   pause   → temporarily suspends benefits (reversible); from active
 *   resume  → re-activates a paused plan
 * `by` ('user' | 'admin') only affects the activity-log wording. Returns the
 * user's subscription as the app would see it (null once cancelled/paused).
 */
export async function setSubscriptionStatus(uid, action, by = "user") {
  uid = Number(uid);
  if (action === "cancel") {
    const [r] = await pool.query(
      "UPDATE subscriptions SET status = 'cancelled', auto_renew = 0 WHERE user_id = ? AND status IN ('active','past_due','paused')",
      [uid]
    );
    if (r.affectedRows) await logActivity(uid, { kind: "system", title: "Plan cancelled", body: by === "admin" ? "Your plan was cancelled by support — you're now on pay-as-you-go." : "You cancelled your plan — you're now on pay-as-you-go." });
  } else if (action === "pause") {
    const [r] = await pool.query("UPDATE subscriptions SET status = 'paused' WHERE user_id = ? AND status = 'active'", [uid]);
    if (r.affectedRows) await logActivity(uid, { kind: "system", title: "Plan paused", body: "Your plan was paused by support. Contact us to resume it." });
  } else if (action === "resume") {
    const [r] = await pool.query("UPDATE subscriptions SET status = 'active' WHERE user_id = ? AND status = 'paused'", [uid]);
    if (r.affectedRows) await logActivity(uid, { kind: "system", title: "Plan resumed", body: "Your plan was resumed — benefits restored." });
  } else {
    throw httpErr(400, "Unknown action");
  }
  return getSubscription(uid);
}

/** Convenience: user-initiated self-cancel. */
export async function cancelSubscription(uid) {
  return setSubscriptionStatus(uid, "cancel", "user");
}

/* --------------------------------------------------------------- owned numbers */
/** How many active numbers the user owns (for plan-capacity enforcement). */
export async function countNumbers(uid) {
  const [r] = await pool.query("SELECT COUNT(*) AS c FROM numbers WHERE user_id = ? AND status = 'active'", [uid]);
  return Number(r[0]?.c || 0);
}

/** List the user's active numbers. */
export async function listNumbers(uid) {
  const [rows] = await pool.query(
    "SELECT id, e164, kind, telnyx_id, free, created_at FROM numbers WHERE user_id = ? AND status = 'active' ORDER BY id ASC",
    [uid]
  );
  return rows.map((n) => ({
    id: `num_${n.id}`, e164: n.e164, kind: n.kind,
    telnyxId: n.telnyx_id, free: !!Number(n.free), time: relTime(n.created_at),
  }));
}

/** Record a provisioned number against the user (idempotent on the E.164).
 *  The monthly rental renews 30 days out (see renewDueNumbers). */
// Telnyx's monthly cost for each number (wholesale) — renewals bill this + markup.
let numberCostColReady = false;
async function ensureNumberCostColumn() {
  if (numberCostColReady) return;
  try { await pool.query("ALTER TABLE numbers ADD COLUMN monthly_cost DECIMAL(10,4) NULL DEFAULT NULL"); }
  catch (e) { if (e?.errno !== 1060) throw e; }
  numberCostColReady = true;
}

export async function provisionNumber(uid, { e164, kind = "local", telnyxId = "", free = false, monthlyCost = null }) {
  await ensureNumberCostColumn();
  const renewsAt = Date.now() + 30 * 24 * 3600 * 1000;
  const cost = Number(monthlyCost) > 0 ? Number(monthlyCost) : null;
  await pool.query(
    `INSERT INTO numbers (user_id, e164, kind, telnyx_id, free, status, renews_at, monthly_cost) VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), kind = VALUES(kind),
         telnyx_id = VALUES(telnyx_id), free = VALUES(free), status = 'active', renews_at = VALUES(renews_at),
         monthly_cost = VALUES(monthly_cost)`,
    [uid, String(e164), kind === "tollfree" ? "tollfree" : "local", String(telnyxId || ""), free ? 1 : 0, renewsAt, cost]
  );
}

/**
 * Release a number the user owns: marks it 'released' (dropped from the app,
 * stops the monthly rental) and returns its stored telnyx_id so the caller can
 * also free it on Telnyx. Matches on digits so formatting differences don't miss.
 * `by` ('user' | 'admin') only tunes the activity-log wording. Throws 404 if the
 * user doesn't own an active number matching `e164`.
 */
export async function releaseNumber(uid, e164, by = "user") {
  uid = Number(uid);
  const [rows] = await pool.query(
    `SELECT id, telnyx_id FROM numbers
       WHERE user_id = ? AND REGEXP_REPLACE(e164, '[^0-9]', '') = REGEXP_REPLACE(?, '[^0-9]', '')
         AND status IN ('active','past_due') ORDER BY id DESC LIMIT 1`,
    [uid, String(e164)]
  );
  const row = rows[0];
  if (!row) throw httpErr(404, "Number not found");
  await pool.query("UPDATE numbers SET status = 'released', renews_at = 0 WHERE id = ?", [row.id]);
  await logActivity(uid, { kind: "number", title: "Number released", body: by === "admin" ? `${e164} was released by support.` : `${e164} was released.` });
  return { ok: true, telnyxId: row.telnyx_id || "" };
}

/**
 * Monthly number rentals: every ACTIVE number whose renews_at has passed is
 * billed for the next month — saved card FIRST (direct), wallet as fallback.
 * NOTE: no plan includes a free number any more (numbersIncluded: 0 across all
 * bundles), so EVERY number is billed — including legacy rows still flagged
 * free=1. When neither payment rail works the number goes 'past_due': it
 * disappears from the app and stops receiving calls until the user pays
 * (support can reactivate).
 */
export async function renewDueNumbers({ resolveMonthlyCost } = {}) {
  await ensureNumberCostColumn();
  await ensureActivatedColumn();
  // A number still waiting on carrier approval isn't billed again — its first
  // month restarts when it goes live (markNumberActivated).
  const [due] = await pool.query(
    "SELECT * FROM numbers WHERE status = 'active' AND renews_at > 0 AND renews_at < ? AND (activated_at IS NOT NULL OR e164 LIKE '+1%')",
    [Date.now()]
  );
  let renewed = 0;
  for (const n of due) {
    try {
      const nextAt = Number(n.renews_at) + 30 * 24 * 3600 * 1000;
      // Telnyx's monthly cost for THIS number + markup. Numbers bought before the
      // cost was stored get it looked up once (by country + type) and saved.
      let cost = Number(n.monthly_cost) || 0;
      if (!(cost > 0) && resolveMonthlyCost) {
        cost = Number(await resolveMonthlyCost(n.e164, n.kind).catch(() => 0)) || 0;
        if (cost > 0) await pool.query("UPDATE numbers SET monthly_cost = ? WHERE id = ?", [cost, n.id]);
      }
      const amount = cost > 0
        ? Math.round(retailOf(cost) * 100) / 100
        : (NUMBER_RENTAL[n.kind] ?? NUMBER_RENTAL.local);
      const label = `Number rental — ${n.e164}`;
      let paid = await chargeSavedCard(n.user_id, amount, label);
      if (!paid) paid = await debitIfEnough(n.user_id, amount, label);
      if (paid) {
        await pool.query("UPDATE numbers SET renews_at = ? WHERE id = ?", [nextAt, n.id]);
        await logActivity(n.user_id, { kind: "number", title: "Number renewed", body: `${n.e164} renewed for $${amount.toFixed(2)}/mo.` }).catch(() => {});
        renewed++;
      } else {
        await pool.query("UPDATE numbers SET status = 'past_due' WHERE id = ?", [n.id]);
        await logActivity(n.user_id, { kind: "number", title: "Number suspended — payment failed", body: `We couldn't collect $${amount.toFixed(2)} for ${n.e164}. Update your card or top up your wallet, then contact support to restore it.` }).catch(() => {});
      }
    } catch (e) { console.error("number renewal failed for", n.e164, e.message); }
  }
  return renewed;
}

/* ------------------------------------- numbers vs. Telnyx reconciliation */
// activated_at = when the number first went live on Telnyx. US/CA numbers go
// live on purchase; other countries wait for document approval.
let activatedColReady = false;
async function ensureActivatedColumn() {
  if (activatedColReady) return;
  try {
    await pool.query("ALTER TABLE numbers ADD COLUMN activated_at BIGINT NULL DEFAULT NULL");
    await pool.query("UPDATE numbers SET activated_at = UNIX_TIMESTAMP(created_at) * 1000 WHERE e164 LIKE '+1%'");
  } catch (e) { if (e?.errno !== 1060) throw e; }
  activatedColReady = true;
}

/** Every number we still treat as live (active or past_due), across all users. */
export async function listLiveNumbers() {
  await ensureActivatedColumn();
  const [rows] = await pool.query(
    "SELECT id, user_id, e164, status, activated_at, created_at FROM numbers WHERE status IN ('active','past_due')"
  );
  return rows;
}

/** First time a pending number is seen live: stamp it and start its month now. */
export async function markNumberActivated(id, e164, uid) {
  await ensureActivatedColumn();
  const now = Date.now();
  const [r] = await pool.query(
    "UPDATE numbers SET activated_at = ?, renews_at = IF(e164 LIKE '+1%', renews_at, ?) WHERE id = ? AND activated_at IS NULL",
    [now, now + 30 * 24 * 3600 * 1000, id]
  );
  if (r.affectedRows && !String(e164).startsWith("+1")) {
    await logActivity(uid, { kind: "number", title: "Number activated", body: `${e164} was approved by the carrier and can now make and receive calls.` }).catch(() => {});
  }
}

/**
 * A number Telnyx no longer holds for us. If it never went live (the carrier
 * cancelled the order, e.g. documents not sent in time) the user gets back what
 * they paid for it; otherwise it's just released. Runs once per number — the
 * status change is the guard.
 */
export async function closeLapsedNumber(id, { refund = false, reason = "" } = {}) {
  const [rows] = await pool.query("SELECT id, user_id, e164 FROM numbers WHERE id = ?", [id]);
  const n = rows[0];
  if (!n) return null;
  const [r] = await pool.query(
    "UPDATE numbers SET status = ?, renews_at = 0 WHERE id = ? AND status IN ('active','past_due')",
    [refund ? "cancelled" : "released", id]
  );
  if (!r.affectedRows) return null;
  let amount = 0;
  if (refund) {
    const [tx] = await pool.query(
      "SELECT COALESCE(SUM(-amount), 0) AS paid FROM wallet_transactions WHERE user_id = ? AND kind = 'charge' AND label LIKE ?",
      [n.user_id, `Number ${n.e164} (%`]
    );
    amount = Math.round(Number(tx[0]?.paid || 0) * 100) / 100;
    if (amount > 0) await creditWallet(n.user_id, amount, `Refund — ${n.e164} cancelled by carrier`, `numrefund_${n.id}`);
  }
  await logActivity(n.user_id, refund
    ? { kind: "number", title: "Number order cancelled", body: `The carrier cancelled ${n.e164}${reason ? ` (${reason})` : ""}.${amount > 0 ? ` $${amount.toFixed(2)} was refunded to your wallet.` : ""} You can buy a new number any time.` }
    : { kind: "number", title: "Number removed", body: `${n.e164} is no longer on your account.` }).catch(() => {});
  return { e164: n.e164, userId: n.user_id, refunded: amount };
}

/* -------------------------------------------------- incoming-call delivery */
const onlyDigitsPlus = (s) => { const d = String(s || "").replace(/[^\d+]/g, ""); return d ? (d.startsWith("+") ? d : `+${d}`) : ""; };

/** The user's incoming-call settings (forwarding number, voicemail, SIP id). */
export async function getVoiceSettings(uid) {
  const [rows] = await pool.query(
    "SELECT forward_number, voicemail_enabled, sip_username, sip_credential_id FROM users WHERE id = ?", [uid]
  );
  const r = rows[0] || {};
  return {
    forwardNumber: r.forward_number || "",
    voicemailEnabled: r.voicemail_enabled == null ? true : !!Number(r.voicemail_enabled),
    sipUsername: r.sip_username || "",
    sipCredentialId: r.sip_credential_id || "",
  };
}

/** Update the forwarding number + voicemail toggle. */
export async function setVoiceSettings(uid, { forwardNumber, voicemailEnabled }) {
  const fwd = onlyDigitsPlus(forwardNumber);
  await pool.query(
    "UPDATE users SET forward_number = ?, voicemail_enabled = ? WHERE id = ?",
    [fwd, voicemailEnabled === false ? 0 : 1, uid]
  );
  return { forwardNumber: fwd, voicemailEnabled: voicemailEnabled !== false };
}

/** Persist the user's per-user Telnyx SIP identity (WebRTC). */
export async function setSipCredential(uid, { sipUsername, sipCredentialId }) {
  await pool.query(
    "UPDATE users SET sip_username = ?, sip_credential_id = ? WHERE id = ?",
    [String(sipUsername || ""), String(sipCredentialId || ""), uid]
  );
}

/* ---------------------------------------------------- per-DEVICE SIP identities
 * Each signed-in device gets its OWN Telnyx credential connection so several can
 * stay registered at once (a single credential accepts only one registration and
 * the clients kick each other in a loop). The inbound TeXML then rings every
 * active device in parallel. See 014_sip_devices.sql. The table is self-created
 * on first use because Hostinger blocks the shell (migrations can't be run by hand). */
let sipDevicesReady = false;
async function ensureSipDevicesTable() {
  if (sipDevicesReady) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS sip_devices (
    id                BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT       NOT NULL,
    device_id         VARCHAR(64)  NOT NULL,
    sip_username      VARCHAR(64)  NOT NULL,
    sip_credential_id VARCHAR(64)  NOT NULL,
    platform          VARCHAR(16)  NOT NULL DEFAULT '',
    last_seen         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_device (user_id, device_id),
    UNIQUE KEY uq_sip_username (sip_username),
    INDEX idx_sipdev_user (user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  sipDevicesReady = true;
}

/** The device's stored SIP identity, if we've already provisioned one. */
export async function getSipDevice(uid, deviceId) {
  await ensureSipDevicesTable();
  const [rows] = await pool.query(
    "SELECT device_id, sip_username, sip_credential_id, platform FROM sip_devices WHERE user_id = ? AND device_id = ? LIMIT 1",
    [uid, String(deviceId)]
  );
  const r = rows[0];
  return r ? { deviceId: r.device_id, sipUsername: r.sip_username, sipCredentialId: r.sip_credential_id, platform: r.platform || "" } : null;
}

/** Create/refresh a device's SIP identity and bump last_seen (registration ping). */
export async function upsertSipDevice(uid, { deviceId, sipUsername, sipCredentialId, platform }) {
  await ensureSipDevicesTable();
  await pool.query(
    `INSERT INTO sip_devices (user_id, device_id, sip_username, sip_credential_id, platform, last_seen)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE sip_username = VALUES(sip_username), sip_credential_id = VALUES(sip_credential_id),
       platform = VALUES(platform), last_seen = CURRENT_TIMESTAMP`,
    [uid, String(deviceId), String(sipUsername), String(sipCredentialId), String(platform || "")]
  );
}

/** All of a user's devices, most-recently-seen first (for LRU eviction + reuse). */
export async function listSipDevices(uid) {
  await ensureSipDevicesTable();
  const [rows] = await pool.query(
    "SELECT device_id, sip_username, sip_credential_id, platform, last_seen FROM sip_devices WHERE user_id = ? ORDER BY last_seen DESC",
    [uid]
  );
  return rows.map((r) => ({ deviceId: r.device_id, sipUsername: r.sip_username, sipCredentialId: r.sip_credential_id, platform: r.platform || "", lastSeen: r.last_seen }));
}

/** Drop a device row (used when evicting the least-recently-used credential). */
export async function deleteSipDevice(uid, deviceId) {
  await ensureSipDevicesTable();
  await pool.query("DELETE FROM sip_devices WHERE user_id = ? AND device_id = ?", [uid, String(deviceId)]);
}

/** SIP usernames to ring for an inbound call: every device seen recently, newest
 *  first, capped so a pile of stale devices can't bloat the parallel <Dial>. */
export async function getActiveSipUsernames(uid, { withinDays = 45, limit = 5 } = {}) {
  await ensureSipDevicesTable();
  const [rows] = await pool.query(
    `SELECT sip_username FROM sip_devices
       WHERE user_id = ? AND last_seen >= (NOW() - INTERVAL ? DAY)
       ORDER BY last_seen DESC LIMIT ?`,
    [uid, Number(withinDays), Number(limit)]
  );
  return rows.map((r) => r.sip_username).filter(Boolean);
}

/** Resolve who owns a DIGIRINGO number + their call-routing settings, for inbound
 *  TeXML routing. Matches on the E.164 of an active number. */
export async function findNumberOwner(e164) {
  await ensureRoutingColumns();
  const norm = onlyDigitsPlus(e164);
  if (!norm) return null;
  const [rows] = await pool.query(
    `SELECT u.id AS user_id, u.forward_number, u.voicemail_enabled, u.sip_username, u.name,
            n.route_kind, n.route_dest
       FROM numbers n JOIN users u ON u.id = n.user_id
      WHERE n.e164 = ? AND n.status = 'active' LIMIT 1`, [norm]
  );
  const r = rows[0];
  if (!r) return null;
  return {
    userId: r.user_id,
    forwardNumber: r.forward_number || "",
    voicemailEnabled: r.voicemail_enabled == null ? true : !!Number(r.voicemail_enabled),
    sipUsername: r.sip_username || "",
    name: r.name || "",
    routeKind: r.route_kind || "app",
    routeDest: r.route_dest || "",
  };
}

/** Store a voicemail recording + surface it as an activity item. */
export async function addVoicemail(uid, { fromNumber = "", toNumber = "", recordingUrl = "", duration = 0 }) {
  const [r] = await pool.query(
    "INSERT INTO voicemails (user_id, from_number, to_number, recording_url, duration) VALUES (?, ?, ?, ?, ?)",
    [uid, String(fromNumber), String(toNumber), String(recordingUrl || ""), Number(duration) || 0]
  );
  return { id: `vm_${r.insertId}` };
}

/** The user's voicemails, newest first. */
export async function listVoicemails(uid, limit = 100) {
  const [rows] = await pool.query(
    "SELECT id, from_number, to_number, recording_url, duration, is_read, created_at FROM voicemails WHERE user_id = ? ORDER BY id DESC LIMIT ?",
    [uid, limit]
  );
  return rows.map((v) => ({
    id: `vm_${v.id}`, from: v.from_number, to: v.to_number,
    url: v.recording_url || "", duration: Number(v.duration) || 0,
    read: !!Number(v.is_read), time: relTime(v.created_at),
  }));
}

/* ------------------------------------------------------------------- calls */
/** Persist a finished call so the Calls log survives a refresh. */
export async function logCall(uid, { contact, direction = "outgoing", status = "", duration = "", via = "" }) {
  const [r] = await pool.query(
    "INSERT INTO call_logs (user_id, contact, direction, status, duration, via_e164) VALUES (?, ?, ?, ?, ?, ?)",
    [uid, String(contact || ""), direction, String(status || ""), String(duration || ""), String(via || "")]
  );
  return { id: `call_${r.insertId}` };
}

/** The user's recent calls, newest first. */
export async function listCalls(uid, limit = 100) {
  const [rows] = await pool.query(
    "SELECT id, contact, direction, status, duration, via_e164, created_at FROM call_logs WHERE user_id = ? ORDER BY id DESC LIMIT ?",
    [uid, limit]
  );
  return rows.map((c) => ({
    id: `call_${c.id}`, contact: c.contact, direction: c.direction,
    status: c.status, duration: c.duration, via: c.via_e164, time: relTime(c.created_at),
  }));
}

/**
 * Number capacity for the user's ACTIVE plan. Returns whether they can add a
 * number, and whether the NEXT one is free (included) or a paid rental.
 *   { hasPlan, tier, used, included, max, isFree, atCap, numberType }
 * hasPlan=false means no active bundle — a plan is required to hold a number.
 */
export async function numberCapacity(uid) {
  const sub = await getActiveSubRow(uid);
  if (!sub) return { hasPlan: false };
  const b = bundleFor(sub.tier);
  if (!b) return { hasPlan: false };
  const used = await countNumbers(uid);
  return {
    hasPlan: true, tier: sub.tier, used,
    included: b.numbersIncluded, max: b.maxNumbers,
    isFree: used < b.numbersIncluded,
    atCap: used >= b.maxNumbers,
    numberType: b.numberType,
  };
}

/* --------------------------------------------------------------- usage metering */
/**
 * Record usage against the active plan and bill any overflow (beyond the
 * included pool) to the wallet at pay-as-you-go rates. Best-effort: never throws
 * for a caller in a hot path. Returns flags the app uses to alert the user.
 *   { hasPlan, nearLimit, overLimit, walletShort, cost }
 *
 * NOTE: overflow is drawn from the WALLET. When the wallet can't cover it we set
 * walletShort — that's where a card auto-reload (PAYG_RELOAD) will kick in once
 * card-on-file billing (PayPal Business) is live; until then the app alerts the
 * user to top up / upgrade.
 */
export async function applyUsage(uid, { minutes = 0, sms = 0 } = {}) {
  const sub = await getActiveSubRow(uid);
  if (!sub) {
    // No plan → PURE pay-as-you-go: every unit billed to the wallet (previously
    // un-metered — free calls). walletShort mirrors the overflow path below.
    const cost = +(Number(minutes || 0) * OVERFLOW_RATES.voice + Number(sms || 0) * OVERFLOW_RATES.sms).toFixed(2);
    let walletShort = false;
    if (cost > 0) {
      const bits = [minutes ? `${minutes} min` : "", sms ? `${sms} SMS` : ""].filter(Boolean).join(" + ");
      try { await debitWallet(uid, cost, `Pay-as-you-go — ${bits}`); }
      catch {
        // Wallet short → auto-reload from the saved card, then retry the debit.
        try { await reloadWalletFromCard(uid); await debitWallet(uid, cost, `Pay-as-you-go — ${bits}`); }
        catch { walletShort = true; }
      }
    }
    return { hasPlan: false, nearLimit: false, overLimit: false, walletShort, cost };
  }
  const prevMin = Number(sub.minutes_used), prevSms = Number(sub.sms_used);
  const incMin = Number(sub.minutes_included), incSms = Number(sub.sms_included);
  const newMin = prevMin + Number(minutes || 0);
  const newSms = prevSms + Number(sms || 0);
  await pool.query("UPDATE subscriptions SET minutes_used = ?, sms_used = ? WHERE id = ?", [newMin, newSms, sub.id]);

  // Charge only the NEW overflow units this call added (units past the pool).
  const chargeMin = Math.max(0, newMin - incMin) - Math.max(0, prevMin - incMin);
  const chargeSms = Math.max(0, newSms - incSms) - Math.max(0, prevSms - incSms);
  const cost = +(chargeMin * OVERFLOW_RATES.voice + chargeSms * OVERFLOW_RATES.sms).toFixed(2);
  let walletShort = false;
  if (cost > 0) {
    const bits = [chargeMin ? `${chargeMin} min` : "", chargeSms ? `${chargeSms} SMS` : ""].filter(Boolean).join(" + ");
    try { await debitWallet(uid, cost, `Pay-as-you-go — ${bits}`); }
    catch {
      // Wallet short → auto-reload from the saved card, then retry the debit.
      try { await reloadWalletFromCard(uid); await debitWallet(uid, cost, `Pay-as-you-go — ${bits}`); }
      catch { walletShort = true; }
    }
  }
  const pctMin = incMin > 0 ? newMin / incMin : 0;
  const pctSms = incSms > 0 ? newSms / incSms : 0;
  const nearLimit = (pctMin >= 0.8 && pctMin < 1) || (pctSms >= 0.8 && pctSms < 1);
  const overLimit = newMin > incMin || newSms > incSms;
  return { hasPlan: true, nearLimit, overLimit, walletShort, cost };
}

/* ------------------------------------------- Telnyx-cost usage billing (ledger)
 * Calls and SMS are billed from Telnyx's own detail records (see
 * usage-billing.mjs): what Telnyx charged us + MARKUP_PCT. Every billed record
 * is one usage_charges row (unique on its Telnyx id, so nothing is billed
 * twice). The wallet holds whole cents, so sub-cent amounts accumulate in
 * users.usage_owed and are debited once they reach a cent; if the wallet runs
 * dry the remainder stays owed and is collected on the next top-up.
 *
 * Plans: US/Canada usage draws from the plan's pool first (minutes per call,
 * SMS parts per outbound text) — anything past the pool and ALL international
 * usage is billed at cost + markup. */
let usageTablesReady = false;
async function ensureUsageTables() {
  if (usageTablesReady) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS usage_charges (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    kind       VARCHAR(8) NOT NULL,
    leg        VARCHAR(8) NOT NULL DEFAULT '',
    ref        VARCHAR(96) NOT NULL,
    session    VARCHAR(96) NOT NULL DEFAULT '',
    rate_key   VARCHAR(8) NOT NULL DEFAULT '',
    units      DECIMAL(10,3) NOT NULL DEFAULT 0,
    wholesale  DECIMAL(12,5) NOT NULL DEFAULT 0,
    retail     DECIMAL(12,5) NOT NULL DEFAULT 0,
    plan_units DECIMAL(10,3) NOT NULL DEFAULT 0,
    detail     VARCHAR(160) NOT NULL DEFAULT '',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_usage_ref (ref),
    KEY idx_usage_user (user_id),
    KEY idx_usage_session (session),
    KEY idx_usage_rate (kind, leg, rate_key)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await pool.query(`CREATE TABLE IF NOT EXISTS billing_state (
    k VARCHAR(32) PRIMARY KEY,
    v VARCHAR(64) NOT NULL DEFAULT ''
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  try { await pool.query("ALTER TABLE users ADD COLUMN usage_owed DECIMAL(12,5) NOT NULL DEFAULT 0"); }
  catch (e) { if (e?.errno !== 1060) throw e; }
  usageTablesReady = true;
}

export async function getBillingState(k) {
  await ensureUsageTables();
  const [rows] = await pool.query("SELECT v FROM billing_state WHERE k = ?", [k]);
  return rows[0]?.v ?? null;
}
export async function setBillingState(k, v) {
  await ensureUsageTables();
  await pool.query("INSERT INTO billing_state (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)", [k, String(v)]);
}

/** Which of these Telnyx record ids are already in the ledger. */
export async function knownUsageRefs(refs) {
  await ensureUsageTables();
  const list = [...new Set(refs.filter(Boolean))];
  const known = new Set();
  for (let i = 0; i < list.length; i += 500) {
    const [rows] = await pool.query("SELECT ref FROM usage_charges WHERE ref IN (?)", [list.slice(i, i + 500)]);
    for (const r of rows) known.add(r.ref);
  }
  return known;
}

/** The user an earlier leg of this Telnyx call session was billed to. */
export async function usageSessionOwner(session) {
  if (!session) return null;
  await ensureUsageTables();
  const [rows] = await pool.query("SELECT user_id FROM usage_charges WHERE session = ? AND user_id > 0 LIMIT 1", [session]);
  return rows[0] ? Number(rows[0].user_id) : null;
}

/**
 * Bill one Telnyx record. `plan`: "count" = draws `units` from the plan pool
 * (the main leg of a call / an outbound text), "ride" = free while the pool
 * isn't exhausted (extra legs of the same call, inbound texts), "none" = always
 * billed. Plans only ever apply to domestic (US/Canada) usage.
 * Returns { billed, retail } — billed=false when the record was already in.
 */
export async function recordUsage({ uid, kind, leg = "", ref, session = "", rateKey: key = "", units = 0, wholesale = 0, domestic = false, plan = "none", detail = "" }) {
  await ensureUsageTables();
  uid = Number(uid) || 0;
  wholesale = Math.max(0, Number(wholesale) || 0);
  units = Math.max(0, Number(units) || 0);
  const conn = await pool.getConnection();
  let retail = 0;
  try {
    await conn.beginTransaction();
    const [ins] = await conn.query(
      `INSERT IGNORE INTO usage_charges (user_id, kind, leg, ref, session, rate_key, units, wholesale, detail)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, kind, leg, String(ref), String(session || ""), String(key || ""), units, wholesale, String(detail).slice(0, 160)]
    );
    if (!ins.affectedRows) { await conn.rollback(); return { billed: false, retail: 0 }; }
    if (!uid || !(wholesale > 0)) { await conn.commit(); return { billed: true, retail: 0 }; }

    let payFrac = 1, planUnits = 0;
    if (domestic && plan !== "none") {
      const [subs] = await conn.query(
        "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1 FOR UPDATE", [uid]
      );
      const sub = subs[0];
      if (sub) {
        const col = kind === "sms" ? "sms" : "minutes";
        const used = Number(sub[`${col}_used`]), inc = Number(sub[`${col}_included`]);
        if (plan === "count" && units > 0) {
          planUnits = Math.min(units, Math.max(0, inc - used));
          payFrac = (units - planUnits) / units;
          await conn.query(`UPDATE subscriptions SET ${col}_used = ${col}_used + ? WHERE id = ?`, [Math.ceil(units), sub.id]);
        } else if (plan === "ride" && used <= inc) {
          payFrac = 0;
        }
      }
    }
    retail = Math.round(retailOf(wholesale) * payFrac * 100000) / 100000;
    await conn.query("UPDATE usage_charges SET retail = ?, plan_units = ? WHERE ref = ?", [retail, planUnits, String(ref)]);
    if (retail > 0) await conn.query("UPDATE users SET usage_owed = usage_owed + ? WHERE id = ?", [retail, uid]);
    await conn.commit();
  } catch (e) {
    await conn.rollback().catch(() => {});
    throw e;
  } finally {
    conn.release();
  }
  if (retail > 0) await settleOwed(uid, detail).catch((e) => console.error("settleOwed:", e.message));
  return { billed: true, retail };
}

/**
 * Move whole cents of what the user owes for usage out of the wallet. Takes what
 * the wallet can cover; with a saved card it may auto-reload once (reload=false
 * when called after a credit, so a reload can never trigger another reload).
 */
export async function settleOwed(uid, label = "", { reload = true } = {}) {
  await ensureUsageTables();
  const conn = await pool.getConnection();
  let short = false;
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query("SELECT wallet_balance, usage_owed FROM users WHERE id = ? FOR UPDATE", [uid]);
    const owed = Number(rows[0]?.usage_owed || 0);
    const wallet = Number(rows[0]?.wallet_balance || 0);
    const due = Math.floor(owed * 100 + 1e-6) / 100;
    const take = Math.min(due, Math.floor(wallet * 100 + 1e-6) / 100);
    if (take >= 0.01) {
      await conn.query("UPDATE users SET wallet_balance = wallet_balance - ?, usage_owed = usage_owed - ? WHERE id = ?", [take, take, uid]);
      const text = label && take <= 0.05 ? `Usage — ${label}` : "Calls & SMS usage";
      await conn.query("INSERT INTO wallet_transactions (user_id, amount, label, kind) VALUES (?, ?, ?, 'charge')", [uid, -take, text.slice(0, 190)]);
    }
    short = due - take >= 0.01;
    await conn.commit();
  } catch (e) {
    await conn.rollback().catch(() => {});
    throw e;
  } finally {
    conn.release();
  }
  if (short && reload) {
    try { await reloadWalletFromCard(uid); } catch { return; } // no card / declined → stays owed
    await settleOwed(uid, label, { reload: false });
  }
}

/** Money the account can still spend on usage: wallet − owed (+ one card reload). */
async function usageCredit(uid) {
  await ensureUsageTables();
  const [u] = await pool.query("SELECT wallet_balance, usage_owed FROM users WHERE id = ?", [uid]);
  let credit = Number(u[0]?.wallet_balance ?? 0) - Number(u[0]?.usage_owed ?? 0);
  try {
    const bp = await getBillingProfile(uid);
    if (bp?.paymentMethodId) credit += PAYG_RELOAD;
  } catch { /* card check is best-effort */ }
  return credit;
}

// What Telnyx has actually been charging per unit for a destination bucket
// (last 60 days), cached briefly. Falls back to the conservative defaults.
const rateCache = new Map(); // "kind:leg:key" → { rate, at }
export async function usageRate(kind, leg, key) {
  const k = `${kind}:${leg}:${key}`;
  const hit = rateCache.get(k);
  if (hit && Date.now() - hit.at < 10 * 60_000) return hit.rate;
  let rate = defaultWholesale(kind, key);
  try {
    await ensureUsageTables();
    const [rows] = await pool.query(
      `SELECT SUM(wholesale) AS w, SUM(units) AS u FROM usage_charges
        WHERE kind = ? AND leg = ? AND rate_key = ? AND units > 0 AND wholesale > 0
          AND created_at > NOW() - INTERVAL 60 DAY`, [kind, leg, key]
    );
    const w = Number(rows[0]?.w || 0), n = Number(rows[0]?.u || 0);
    if (w > 0 && n > 0) rate = w / n;
  } catch { /* keep the default */ }
  rateCache.set(k, { rate, at: Date.now() });
  return rate;
}

/** PRE-SEND gate: can this account afford this SMS right now? True when a
 *  domestic text still fits the plan's SMS pool, or the wallet (or a saved card
 *  that can auto-reload) covers the destination's rate. */
export async function canSendSms(uid, { to = "", parts = 1 } = {}) {
  parts = Math.max(1, Number(parts) || 1);
  const domestic = !to || isDomestic(to);
  const sub = await getActiveSubRow(uid);
  if (domestic && sub && Number(sub.sms_used) + parts <= Number(sub.sms_included)) return true;
  let perPart = await usageRate("sms", "out", rateKey(to) || "1");
  if (!domestic) perPart = Math.max(perPart, smsRateMax(to) ?? 0); // never below the carrier's sheet abroad
  const price = retailOf(perPart) * parts;
  return (await usageCredit(uid)) >= price;
}

/** Estimated customer price per SECOND of a call — outbound to `to`, or inbound
 *  on the user's number `to` (the number's leg plus the in-app WebRTC leg). */
async function callPricePerSec({ to = "", inbound = false, froms = [] } = {}) {
  const key = rateKey(to) || "1";
  let perMin = inbound
    ? (await usageRate("voice", "in", key)) + (await usageRate("voice", "app", "1"))
    : await usageRate("voice", "out", key);
  // Abroad, never budget below the carrier's published rate for that exact
  // destination (a country's satellite / premium ranges cost far more than its average).
  if (!inbound && key !== "1") {
    const deck = outboundRate(to, froms);
    if (deck != null) perMin = Math.max(perMin, deck);
  }
  return retailOf(perMin) / 60;
}

/**
 * How many more seconds of talk-time this account can AFFORD for a call to/from
 * `to`, pooled across every call in progress (`live`: [{ sec, to, inbound }] —
 * a plain number is still accepted as total live seconds). Domestic calls draw
 * plan minutes first; the rest is wallet credit at the destination's rate.
 */
export async function voiceRemainingSec(uid, live = [], { to = "", inbound = false } = {}) {
  const calls = Array.isArray(live) ? live : [{ sec: Number(live) || 0, to: "", inbound: false }];
  const sub = await getActiveSubRow(uid);
  let planSec = sub ? Math.max(0, Number(sub.minutes_included) - Number(sub.minutes_used)) * 60 : 0;
  let credit = await usageCredit(uid);
  // The caller IDs this account can dial out from (abroad, rates depend on them).
  const froms = to && !isDomestic(to) || calls.some((c) => c.to && !isDomestic(c.to))
    ? (await listNumbers(uid).catch(() => [])).map((n) => n.e164).filter(Boolean) : [];
  for (const c of calls) {
    let sec = Math.max(0, Math.floor(Number(c.sec) || 0));
    if (!c.to || isDomestic(c.to)) { const use = Math.min(planSec, sec); planSec -= use; sec -= use; }
    if (sec > 0) credit -= sec * (await callPricePerSec({ ...c, froms }));
  }
  const domestic = !to || isDomestic(to);
  const perSec = await callPricePerSec({ to, inbound, froms });
  const walletSec = perSec > 0 ? Math.floor(Math.max(0, credit) / perSec) : 0;
  return Math.max(0, (domestic ? planSec : 0) + walletSec);
}

/**
 * Auto-reload the wallet from the user's saved card when overflow can't be
 * covered (wired to PAYG_RELOAD). Uses the card-on-file; throws when there is
 * no saved card or Stripe declines, so callers fall back to alerting the user.
 */
export async function reloadWalletFromCard(uid, amount = PAYG_RELOAD) {
  const ok = await chargeSavedCard(uid, amount, `Wallet auto-reload $${Number(amount).toFixed(2)}`);
  if (!ok) throw httpErr(402, "Card auto-reload failed — top up your wallet or update your card");
  return creditWallet(uid, amount, `Auto-reload from card $${Number(amount).toFixed(2)}`);
}

/**
 * Batch renewal: charge every active auto-renew subscription whose period has
 * ended. Called on a timer + at boot by the server. Returns the number renewed.
 */
export async function renewDueSubscriptions() {
  const [due] = await pool.query(
    "SELECT * FROM subscriptions WHERE status = 'active' AND auto_renew = 1 AND period_end > 0 AND period_end < ?",
    [Date.now()]
  );
  let renewed = 0;
  for (const s of due) {
    try { const r = await tryRenew(s); if (r && r.status === "active") renewed++; }
    catch (e) { console.error("renew failed for sub", s.id, e.message); }
  }
  return renewed;
}

/** Turn auto-renew on/off for the user's active (or past_due) plan. */
export async function setAutoRenew(uid, on) {
  await pool.query(
    "UPDATE subscriptions SET auto_renew = ? WHERE user_id = ? AND status IN ('active','past_due')",
    [on ? 1 : 0, uid]
  );
  return getSubscription(uid);
}

/** Activate (or replace) the user's bundle. Any prior active plan is superseded.
 *  Does NOT charge — the caller charges (wallet or card) first. Stores the pay
 *  method + renewal amount so the plan can auto-renew from the wallet. */
export async function activateBundle(uid, { tier, cycle, minutes, sms, payMethod = "wallet", autoRenew = true, amount = 0 }) {
  const c = cycle === "annual" ? "annual" : "monthly";
  const periodEnd = Date.now() + (CYCLE_MS[c] || CYCLE_MS.monthly);
  const pm = payMethod === "card" ? "card" : "wallet";
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("UPDATE subscriptions SET status = 'replaced' WHERE user_id = ? AND status IN ('active','past_due')", [uid]);
    await conn.query(
      `INSERT INTO subscriptions
         (user_id, tier, cycle, minutes_included, sms_included, status, period_end, pay_method, auto_renew, renew_amount)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)`,
      [uid, String(tier), c, Number(minutes) || 0, Number(sms) || 0, periodEnd, pm, autoRenew ? 1 : 0, Number(amount) || 0]
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  return getSubscription(uid);
}

/** Debits the wallet if funds suffice (atomic). Throws 402 if insufficient. */
export async function debitWallet(uid, amount, label = "Charge") {
  amount = Number(amount);
  if (!(amount > 0)) throw httpErr(400, "Invalid amount");
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.query(
      "UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ? AND wallet_balance >= ?",
      [amount, uid, amount]
    );
    if (r.affectedRows === 0) {
      await conn.rollback();
      throw httpErr(402, "Insufficient wallet balance");
    }
    await conn.query(
      "INSERT INTO wallet_transactions (user_id, amount, label, kind) VALUES (?, ?, ?, 'charge')",
      [uid, -amount, label]
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  return getWallet(uid);
}

/* ------------------------------------------------------------ Freemius (MoR) */
/** Look up a user id by email (Freemius webhooks identify the buyer by email). */
export async function getUserByEmail(email) {
  email = String(email || "").trim().toLowerCase();
  if (!email) return null;
  const [rows] = await pool.query("SELECT id, email, name FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

/**
 * Idempotency guard for Freemius webhooks — Freemius may deliver the same event
 * more than once. Returns TRUE the first time an event id is seen (caller should
 * process it) and FALSE on any repeat (caller should skip). Relies on the
 * PRIMARY KEY of freemius_events to reject duplicates atomically.
 */
export async function recordFreemiusEvent(eventId) {
  const id = String(eventId || "").trim();
  if (!id) return true; // unidentifiable event — process but can't dedupe
  try {
    const [r] = await pool.query("INSERT INTO freemius_events (event_id) VALUES (?)", [id]);
    return r.affectedRows === 1;
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") return false; // already handled
    throw e;
  }
}

/** Release a claimed event id so a failed fulfilment can be retried by Freemius. */
export async function unrecordFreemiusEvent(eventId) {
  const id = String(eventId || "").trim();
  if (!id) return;
  try { await pool.query("DELETE FROM freemius_events WHERE event_id = ?", [id]); } catch { /* best-effort */ }
}

/** Flag the user's active plan past-due (Freemius cancel / renewal failure). */
export async function markSubscriptionPastDue(uid) {
  await pool.query(
    "UPDATE subscriptions SET status = 'past_due' WHERE user_id = ? AND status = 'active'",
    [uid]
  );
  return getSubscription(uid);
}

/* --------------------------------------------------------------- activity feed */
/** Append an activity item for a user (persisted so it survives a refresh).
 *  Best-effort for callers in hot paths — swallow errors, never block the action. */
export async function logActivity(uid, { kind = "system", title, body = "" } = {}) {
  if (!uid || !title) return;
  try {
    await pool.query(
      "INSERT INTO activity_log (user_id, kind, title, body) VALUES (?, ?, ?, ?)",
      [uid, String(kind).slice(0, 32), String(title).slice(0, 191), String(body || "")]
    );
  } catch (e) { console.error("logActivity:", e.message); }
}

/** The user's recent activity, newest first (shaped for the app). */
export async function listActivity(uid, limit = 100) {
  const [rows] = await pool.query(
    "SELECT id, kind, title, body, is_read, created_at FROM activity_log WHERE user_id = ? ORDER BY id DESC LIMIT ?",
    [uid, limit]
  );
  return rows.map((a) => ({
    id: `act_${a.id}`, kind: a.kind, title: a.title, body: a.body || "",
    time: relTime(a.created_at), read: !!Number(a.is_read),
  }));
}

/** Mark all of the user's activity as read (clears the badge). */
export async function markAllActivityRead(uid) {
  await pool.query("UPDATE activity_log SET is_read = 1 WHERE user_id = ? AND is_read = 0", [uid]);
}

/* ------------------------------------------------------ live support chat */
/** Append a message to a customer's support thread. `sender` is 'user' or
 *  'agent'; agent messages carry the replying agent's id. */
export async function addSupportMessage(userId, { sender = "user", agentId = null, body }) {
  if (!userId || !body) return null;
  const isAgent = sender === "agent";
  const [r] = await pool.query(
    "INSERT INTO support_messages (user_id, sender, agent_id, body, read_by_user, read_by_agent) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, isAgent ? "agent" : "user", isAgent ? agentId : null, String(body).slice(0, 4000), isAgent ? 0 : 1, isAgent ? 1 : 0]
  );
  return { id: `sm_${r.insertId}` };
}

/** A customer's full support thread (oldest first). `markReadFor` clears unread
 *  from the other party's perspective ('user' clears agent msgs, 'agent' clears
 *  the customer's msgs). */
export async function getSupportMessages(userId, { markReadFor } = {}) {
  const [rows] = await pool.query(
    `SELECT m.id, m.sender, m.agent_id, m.body, m.created_at, a.name AS agent_name
       FROM support_messages m LEFT JOIN agents a ON a.id = m.agent_id
      WHERE m.user_id = ? ORDER BY m.id ASC`, [userId]
  );
  if (markReadFor === "user") await pool.query("UPDATE support_messages SET read_by_user = 1 WHERE user_id = ? AND sender = 'agent' AND read_by_user = 0", [userId]);
  if (markReadFor === "agent") await pool.query("UPDATE support_messages SET read_by_agent = 1 WHERE user_id = ? AND sender = 'user' AND read_by_agent = 0", [userId]);
  return rows.map((m) => ({
    id: `sm_${m.id}`, sender: m.sender, agentName: m.agent_name || null,
    body: m.body, time: relTime(m.created_at),
  }));
}

/** Unread agent replies for a customer (app badge). */
export async function supportUnreadForUser(userId) {
  const [r] = await pool.query("SELECT COUNT(*) AS c FROM support_messages WHERE user_id = ? AND sender = 'agent' AND read_by_user = 0", [userId]);
  return Number(r[0]?.c || 0);
}

/** All support threads for the Control Hub inbox — one row per customer, newest
 *  activity first, with the last message + how many of their messages are unread. */
export async function listSupportThreads() {
  const [rows] = await pool.query(
    `SELECT m.user_id, u.name, u.email, MAX(m.id) AS last_id,
            SUM(CASE WHEN m.sender = 'user' AND m.read_by_agent = 0 THEN 1 ELSE 0 END) AS unread
       FROM support_messages m JOIN users u ON u.id = m.user_id
      GROUP BY m.user_id, u.name, u.email
      ORDER BY last_id DESC`
  );
  const out = [];
  for (const r of rows) {
    const [last] = await pool.query("SELECT sender, body, created_at FROM support_messages WHERE id = ?", [r.last_id]);
    const l = last[0] || {};
    out.push({
      userId: r.user_id, name: r.name || "Customer", email: r.email || "",
      unread: Number(r.unread) || 0, lastSender: l.sender || "user",
      lastBody: l.body || "", time: relTime(l.created_at),
    });
  }
  return out;
}

/* ------------------------------------------------------ team (agent) accounts */
function signAgentToken(aid, days = 30) {
  const payload = b64u(JSON.stringify({ aid, exp: Date.now() + days * 86400000 }));
  const sig = createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
/** Returns the agent id from a valid agent token, or null. */
export function verifyAgentToken(token) {
  if (!token) return null;
  const [payload, sig] = String(token).split(".");
  if (!payload || !sig) return null;
  const expect = createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(expect);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { aid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!aid || Date.now() > exp) return null;
    return aid;
  } catch { return null; }
}

export async function createAgent({ name, email, password }) {
  email = String(email || "").trim().toLowerCase();
  if (!email || !password) throw httpErr(400, "Email and password are required");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw httpErr(400, "Enter a valid email");
  if (String(password).length < 6) throw httpErr(400, "Password must be at least 6 characters");
  const [dup] = await pool.query("SELECT id FROM agents WHERE email = ?", [email]);
  if (dup.length) throw httpErr(409, "A team member with this email already exists");
  const [r] = await pool.query("INSERT INTO agents (name, email, password_hash) VALUES (?, ?, ?)",
    [String(name || "").slice(0, 120), email, hashPassword(password)]);
  return { id: r.insertId, name: name || "", email };
}

export async function listAgents() {
  const [rows] = await pool.query("SELECT id, name, email, active, created_at FROM agents ORDER BY id ASC");
  return rows.map((a) => ({ id: a.id, name: a.name, email: a.email, active: !!Number(a.active), time: relTime(a.created_at) }));
}

export async function setAgentActive(id, active) {
  await pool.query("UPDATE agents SET active = ? WHERE id = ?", [active ? 1 : 0, id]);
}

export async function deleteAgent(id) {
  await pool.query("DELETE FROM agents WHERE id = ?", [id]);
}

export async function loginAgent(email, password) {
  email = String(email || "").trim().toLowerCase();
  const [rows] = await pool.query("SELECT * FROM agents WHERE email = ?", [email]);
  const a = rows[0];
  if (!a || !Number(a.active) || !verifyPassword(password, a.password_hash)) throw httpErr(401, "Invalid email or password");
  return { token: signAgentToken(a.id), agent: { id: a.id, name: a.name, email: a.email } };
}

export async function getAgent(id) {
  const [rows] = await pool.query("SELECT id, name, email, active FROM agents WHERE id = ?", [id]);
  const a = rows[0];
  if (!a) return null;
  return { id: a.id, name: a.name, email: a.email, active: !!Number(a.active) };
}

/* ------------------------------------------------- web push subscriptions */
export async function savePushSubscription(uid, { endpoint, p256dh, auth } = {}) {
  if (!uid || !endpoint || !p256dh || !auth) return;
  await pool.query(
    `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), p256dh = VALUES(p256dh), auth = VALUES(auth)`,
    [uid, String(endpoint).slice(0, 512), String(p256dh).slice(0, 191), String(auth).slice(0, 191)]
  );
}

export async function getPushSubscriptions(uid) {
  const [rows] = await pool.query("SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?", [uid]);
  return rows.map((r) => ({ endpoint: r.endpoint, p256dh: r.p256dh, auth: r.auth }));
}

export async function deletePushSubscription(endpoint) {
  if (!endpoint) return;
  await pool.query("DELETE FROM push_subscriptions WHERE endpoint = ?", [String(endpoint)]);
}

/* --------------------------------------- native (FCM) device push tokens */
export async function savePushToken(uid, token, platform = "android") {
  if (!uid || !token) return;
  await pool.query(
    `INSERT INTO device_tokens (user_id, token, platform) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), platform = VALUES(platform)`,
    [uid, String(token).slice(0, 255), String(platform || "android").slice(0, 16)]
  );
}

export async function getPushTokens(uid) {
  const [rows] = await pool.query("SELECT token, platform FROM device_tokens WHERE user_id = ?", [uid]);
  return rows.map((r) => ({ token: r.token, platform: r.platform }));
}

/** Remove a dead token (FCM returned UNREGISTERED/NOT_FOUND). */
export async function deletePushToken(token) {
  if (!token) return;
  await pool.query("DELETE FROM device_tokens WHERE token = ?", [String(token)]);
}

/* ================================================================= *
 *  Control Hub (admin) — cross-user aggregates for managing clients. *
 *  Every function here is admin-only; the router gates them behind   *
 *  verifyAdminToken. They read the SAME tables the app writes, so    *
 *  the dashboard shows real customers, real wallets, real numbers.   *
 * ================================================================= */

/** All customer accounts (newest first) with plan, number count and balance.
 *  `q` filters by name/email; empty q returns everyone up to `limit`. */
export async function adminListUsers({ q = "", limit = 500 } = {}) {
  const like = `%${String(q || "").trim()}%`;
  const hasQ = String(q || "").trim() !== "";
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.name, u.wallet_balance, u.status, u.email_verified, u.created_at,
            (SELECT COUNT(*) FROM numbers n WHERE n.user_id = u.id AND n.status = 'active') AS numbers,
            (SELECT s.tier FROM subscriptions s WHERE s.user_id = u.id AND s.status IN ('active','past_due')
               ORDER BY s.id DESC LIMIT 1) AS tier
       FROM users u
      ${hasQ ? "WHERE u.email LIKE ? OR u.name LIKE ?" : ""}
      ORDER BY u.id DESC LIMIT ?`,
    hasQ ? [like, like, Number(limit)] : [Number(limit)]
  );
  return rows.map((u) => ({
    id: u.id,
    name: u.name || "—",
    email: u.email,
    plan: u.tier ? u.tier.charAt(0).toUpperCase() + u.tier.slice(1) : "Free",
    numbers: Number(u.numbers) || 0,
    balance: Number(u.wallet_balance) || 0,
    status: String(u.status || "active"),
    verified: !!Number(u.email_verified),
    joined: relTime(u.created_at),
  }));
}

/** Full detail for one customer — profile, wallet + ledger, numbers, plan,
 *  and recent activity. Powers the admin "View customer" drawer. */
export async function adminGetUser(uid) {
  uid = Number(uid);
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [uid]);
  const u = rows[0];
  if (!u) throw httpErr(404, "User not found");
  const [wallet, numbers, activity, subRow] = await Promise.all([
    getWallet(uid),
    listNumbers(uid),
    listActivity(uid, 50),
    latestActionableSub(uid),
  ]);
  return {
    id: u.id,
    name: u.name || "—",
    email: u.email,
    status: String(u.status || "active"),
    verified: !!Number(u.email_verified),
    joined: relTime(u.created_at),
    wallet,               // { balance, txns[] }
    numbers,              // [{ e164, kind, ... }]
    activity,             // [{ title, body, time, ... }]
    subscription: shapeSub(subRow),
  };
}

/** Admin wallet adjustment. `amount` > 0 credits, < 0 debits. Records a
 *  wallet_transaction AND an activity-log line the customer can see. */
export async function adminAdjustWallet(uid, amount, label = "") {
  uid = Number(uid);
  amount = Number(amount);
  if (!amount) throw httpErr(400, "Amount is required");
  const note = String(label || "").trim();
  let wallet;
  if (amount > 0) {
    wallet = await creditWallet(uid, amount, note || "Admin credit", "admin");
    await logActivity(uid, { kind: "wallet", title: `Wallet credited $${amount.toFixed(2)}`, body: note });
  } else {
    wallet = await debitWallet(uid, -amount, note || "Admin adjustment");
    await logActivity(uid, { kind: "wallet", title: `Wallet adjusted -$${(-amount).toFixed(2)}`, body: note });
  }
  return wallet;
}

/** Suspend or reactivate an account. A suspended account cannot sign in. */
export async function adminSetUserStatus(uid, status) {
  uid = Number(uid);
  status = status === "suspended" ? "suspended" : "active";
  await pool.query("UPDATE users SET status = ? WHERE id = ?", [status, uid]);
  // Suspension ends live sessions at once; reactivating keeps the old ones dead.
  await revokeTokens(uid, { suspended: status === "suspended" });
  await logActivity(uid, {
    kind: "system",
    title: status === "suspended" ? "Account suspended" : "Account reactivated",
    body: status === "suspended" ? "Sign-in disabled by an administrator." : "Access restored by an administrator.",
  });
  return { ok: true, status };
}

/** Every provisioned number across all users (with owner). */
export async function adminListNumbers({ q = "", limit = 1000 } = {}) {
  const like = `%${String(q || "").trim()}%`;
  const hasQ = String(q || "").trim() !== "";
  const [rows] = await pool.query(
    `SELECT n.id, n.e164, n.kind, n.status, n.free, n.created_at, u.name AS owner, u.email
       FROM numbers n JOIN users u ON u.id = n.user_id
      WHERE n.status IN ('active','past_due')
      ${hasQ ? "AND (n.e164 LIKE ? OR u.name LIKE ? OR u.email LIKE ?)" : ""}
      ORDER BY n.id DESC LIMIT ?`,
    hasQ ? [like, like, like, Number(limit)] : [Number(limit)]
  );
  return rows.map((n) => ({
    id: `num_${n.id}`,
    number: n.e164,
    owner: n.owner || "—",
    email: n.email,
    kind: n.kind === "tollfree" ? "Toll-free" : "Local",
    status: n.status === "active" ? "active" : "past_due",
    free: !!Number(n.free),
    time: relTime(n.created_at),
  }));
}

/** The full platform wallet ledger (all users), newest first. */
export async function adminListTransactions({ limit = 500 } = {}) {
  const [rows] = await pool.query(
    `SELECT t.id, t.amount, t.label, t.kind, t.created_at, u.name AS user, u.email
       FROM wallet_transactions t JOIN users u ON u.id = t.user_id
      ORDER BY t.id DESC LIMIT ?`,
    [Number(limit)]
  );
  return rows.map((t) => ({
    id: `tx_${t.id}`,
    user: t.user || "—",
    email: t.email,
    label: t.label || "",
    kind: t.kind || "charge",
    amount: Number(t.amount),
    time: relTime(t.created_at),
  }));
}

/** Billing detail — real subscriber counts per plan + recent plan activations
 *  (used in place of the old fake "invoices"). */
export async function adminBilling() {
  const [counts] = await pool.query(
    "SELECT tier, COUNT(*) AS c FROM subscriptions WHERE status = 'active' GROUP BY tier"
  );
  const planCounts = {};
  for (const r of counts) planCounts[String(r.tier || "").toLowerCase()] = Number(r.c) || 0;
  const [subs] = await pool.query(
    `SELECT s.id, s.tier, s.cycle, s.renew_amount, s.status, s.created_at, u.name, u.email
       FROM subscriptions s JOIN users u ON u.id = s.user_id
      ORDER BY s.id DESC LIMIT 20`
  );
  const invoices = subs.map((s) => ({
    id: `SUB-${s.id}`,
    user: s.name || "—",
    email: s.email,
    period: `${(s.tier || "").charAt(0).toUpperCase() + (s.tier || "").slice(1)} · ${s.cycle || "monthly"}`,
    amount: Number(s.renew_amount) || 0,
    status: s.status || "active",
  }));
  return { planCounts, invoices };
}

/** Platform KPIs + chart series, all computed live from the DB. */
export async function adminKpis() {
  const [uRows] = await pool.query("SELECT COUNT(*) AS c FROM users");
  const [nRows] = await pool.query("SELECT COUNT(*) AS c FROM numbers WHERE status = 'active'");
  const [mRows] = await pool.query(
    "SELECT COALESCE(SUM(CASE WHEN cycle = 'annual' THEN renew_amount/12 ELSE renew_amount END),0) AS v FROM subscriptions WHERE status = 'active'"
  );
  const [sRows] = await pool.query("SELECT COUNT(*) AS c FROM messages WHERE created_at >= (NOW() - INTERVAL 7 DAY)");
  const [bRows] = await pool.query("SELECT COALESCE(SUM(wallet_balance),0) AS v FROM users");
  const [spRows] = await pool.query("SELECT COUNT(*) AS c FROM users WHERE status = 'suspended'");
  const users = uRows[0], nums = nRows[0], mrr = mRows[0], sms = sRows[0], bal = bRows[0], susp = spRows[0];
  const [msgSeries] = await pool.query(
    `SELECT DATE_FORMAT(created_at,'%a') AS d, DATE(created_at) AS day, COUNT(*) AS sms
       FROM messages WHERE created_at >= (NOW() - INTERVAL 7 DAY)
      GROUP BY day, d ORDER BY day ASC`
  );
  const [revSeries] = await pool.query(
    `SELECT DATE_FORMAT(created_at,'%b') AS m, DATE_FORMAT(created_at,'%Y-%m') AS ym, COALESCE(SUM(amount),0) AS rev
       FROM wallet_transactions WHERE kind = 'topup' AND created_at >= (NOW() - INTERVAL 6 MONTH)
      GROUP BY ym, m ORDER BY ym ASC`
  );
  return {
    totalUsers: Number(users.c) || 0,
    activeNumbers: Number(nums.c) || 0,
    mrr: Math.round(Number(mrr.v) || 0),
    smsSent7d: Number(sms.c) || 0,
    walletTotal: Number(bal.v) || 0,
    suspended: Number(susp.c) || 0,
    messages7d: msgSeries.map((r) => ({ d: r.d, sms: Number(r.sms) || 0 })),
    revenue6m: revSeries.map((r) => ({ m: r.m, rev: Math.round(Number(r.rev) || 0) })),
  };
}

/* ── 10DLC (US A2P SMS) registration — one brand + one campaign per user ──── */
// Every user shares ONE platform Telnyx account, so the brand/campaign a user
// registered must be remembered here — Telnyx itself can't tell them apart.
// Self-created on first use (same pattern as sip_devices).
let tenDlcReady = false;
async function ensureTenDlcTable() {
  if (tenDlcReady) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS tendlc_registrations (
    user_id         BIGINT       NOT NULL PRIMARY KEY,
    brand_id        VARCHAR(64)  NOT NULL DEFAULT '',
    entity_type     VARCHAR(32)  NOT NULL DEFAULT '',
    display_name    VARCHAR(255) NOT NULL DEFAULT '',
    campaign_id     VARCHAR(64)  NOT NULL DEFAULT '',
    usecase         VARCHAR(48)  NOT NULL DEFAULT '',
    monthly_fee     DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid_until      BIGINT       NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tendlc_brand (brand_id),
    INDEX idx_tendlc_campaign (campaign_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  tenDlcReady = true;
}

function rowToTenDlc(r) {
  return r ? {
    brandId: r.brand_id || "", entityType: r.entity_type || "", displayName: r.display_name || "",
    campaignId: r.campaign_id || "", usecase: r.usecase || "",
    monthlyFee: Number(r.monthly_fee) || 0, paidUntil: Number(r.paid_until) || 0,
  } : null;
}

export async function getTenDlc(uid) {
  await ensureTenDlcTable();
  const [rows] = await pool.query("SELECT * FROM tendlc_registrations WHERE user_id = ? LIMIT 1", [uid]);
  return rowToTenDlc(rows[0]);
}

export async function saveTenDlcBrand(uid, { brandId, entityType, displayName }) {
  await ensureTenDlcTable();
  await pool.query(
    `INSERT INTO tendlc_registrations (user_id, brand_id, entity_type, display_name) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE brand_id = VALUES(brand_id), entity_type = VALUES(entity_type), display_name = VALUES(display_name)`,
    [uid, String(brandId), String(entityType || ""), String(displayName || "")]
  );
}

export async function saveTenDlcCampaign(uid, { campaignId, usecase, monthlyFee, paidUntil }) {
  await ensureTenDlcTable();
  await pool.query(
    "UPDATE tendlc_registrations SET campaign_id = ?, usecase = ?, monthly_fee = ?, paid_until = ? WHERE user_id = ?",
    [String(campaignId), String(usecase || ""), Number(monthlyFee) || 0, Number(paidUntil) || 0, uid]
  );
}

/** Monthly campaign fee (after the prepaid first 3 months), drawn from the wallet.
 *  A short wallet is retried each sweep and the user is told; the campaign itself
 *  is never torn down automatically. Returns the number renewed. */
export async function renewDueTenDlc() {
  await ensureTenDlcTable();
  const [due] = await pool.query(
    "SELECT * FROM tendlc_registrations WHERE campaign_id <> '' AND monthly_fee > 0 AND paid_until > 0 AND paid_until < ?",
    [Date.now()]
  );
  let renewed = 0;
  for (const r of due) {
    const fee = Number(r.monthly_fee);
    const ok = await debitIfEnough(r.user_id, fee, "SMS campaign (10DLC) — monthly carrier fee").catch(() => false);
    if (ok) {
      await pool.query("UPDATE tendlc_registrations SET paid_until = ? WHERE user_id = ?", [Number(r.paid_until) + 30 * 24 * 3600 * 1000, r.user_id]);
      renewed++;
    } else if (Date.now() - Number(r.paid_until) < 3600 * 1000 * 1.5) {
      // Nudge once (first sweep after it fell due), not every hour.
      await logActivity(r.user_id, { kind: "wallet", title: "Top up to keep SMS active", body: `Your US SMS campaign's $${fee.toFixed(2)} monthly carrier fee couldn't be charged — please top up your wallet.` }).catch(() => {});
    }
  }
  return renewed;
}
