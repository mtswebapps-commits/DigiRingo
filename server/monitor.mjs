/**
 * DIGIRINGO — monitoring: who is online, what they do, what is going wrong.
 *
 * Feeds the Control Hub's Live / Issues / Activity / Health pages:
 *   - client beats (POST /api/monitor/beat): presence + screen + client events
 *   - server: every API request (see onRequest), console.error, account activity,
 *     Telnyx delivery failures
 * Events are buffered and written in batches, so recording can never slow down or
 * break a request. Same-looking errors are grouped into one row in mon_issues.
 *
 * Never recorded: message text, passwords, tokens, request bodies.
 */
import { createHash } from "node:crypto";
import { statfs } from "node:fs/promises";
import { totalmem, freemem, loadavg, cpus } from "node:os";

const ONLINE_MS = 75_000;       // a client beats every 30s while visible
const HOUR = 3600_000;
const DAY = 24 * HOUR;
const KEEP_EVENTS = 90 * DAY, KEEP_SCREENS = 14 * DAY, KEEP_DEBUG = 14 * DAY, KEEP_PRESENCE = 35 * DAY;
const MAX_QUEUE = 5000;
const REPORT_MAX_HOURS = 24 * 30;

const PLATFORMS = new Set(["web", "pwa", "android", "ios"]);
const CLIENT_KINDS = new Set(["screen", "action", "call", "network", "ui_error", "js_error", "debug"]);
const LEVELS = new Set(["info", "warn", "error"]);

// Mutating API calls worth showing in the activity feed, in plain words.
const ACTIONS = [
  ["POST", /^\/api\/auth\/register/, "Signed up"],
  ["POST", /^\/api\/auth\/login/, "Logged in"],
  ["POST", /^\/api\/auth\/forgot/, "Asked for a password reset"],
  ["POST", /^\/api\/auth\/reset/, "Reset their password"],
  ["POST", /^\/api\/auth\/resend-verification/, "Asked for the verification email again"],
  ["POST", /^\/api\/numbers\/buy/, "Bought a number"],
  ["POST", /^\/api\/numbers\/release/, "Released a number"],
  ["POST", /^\/api\/numbers\/routing/, "Changed call routing"],
  ["POST", /^\/api\/bundles\/subscribe/, "Subscribed to a plan"],
  ["POST", /^\/api\/subscription\/cancel/, "Cancelled their plan"],
  ["POST", /^\/api\/subscription\/auto-renew/, "Changed auto-renew"],
  ["POST", /^\/api\/billing\//, "Changed payment method"],
  ["POST", /^\/api\/paypal\/capture/, "Paid with PayPal"],
  ["POST", /^\/api\/10dlc/, "Submitted 10DLC details"],
  ["POST", /^\/api\/support/, "Wrote to support"],
  ["POST", /^\/api\/user\/forward/, "Changed call forwarding"],
  ["POST", /^\/api\/telnyx\/messages/, "Sent an SMS"],
];
// Too chatty or not meaningful, even when they fail.
const QUIET = /^\/api\/(monitor|admin\/monitor|voice\/heartbeat|activity\/read|push\/|user\/push-token|telnyx\/rtc-token|status)/;
// Browser noise that says nothing about our code.
const IGNORE_CLIENT = /ResizeObserver loop|^Script error\.?$|Non-Error promise rejection/i;
const WEBHOOKS = [["/webhooks/telnyx", "telnyx-webhook"], ["/webhooks/texml", "texml-webhook"], ["/api/freemius/webhook", "freemius-webhook"], ["/api/paypal/webhook", "paypal-webhook"]];

/** Removes anything secret-looking before it is stored. */
export function scrub(s, max = 2000) {
  return String(s ?? "")
    .replace(/Bearer\s+[\w.~+/=-]+/gi, "Bearer [hidden]")
    .replace(/\b(password|passwd|pwd|token|secret|api[_-]?key|login_token)(["']?\s*[:=]\s*["']?)[^\s"',&}]+/gi, "$1$2[hidden]")
    .replace(/\beyJ[\w-]{10,}\.[\w-]{10,}(\.[\w-]+)?/g, "[hidden]")
    .replace(/\b[A-Za-z0-9+/_-]{48,}={0,2}/g, "[hidden]")
    .slice(0, max);
}

/** Same problem, different number/id/email → same group. */
function fingerprint(source, name) {
  const norm = String(name).toLowerCase()
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "@")
    .replace(/\b[0-9a-f]{8,}\b/g, "#")
    .replace(/\d+/g, "#");
  return createHash("sha1").update(`${source}|${norm}`).digest("hex");
}

function deviceFromUa(ua = "") {
  const os = /Android ([\d.]+)/.exec(ua)?.[0] || (/iPhone|iPad/.test(ua) && "iOS") || (/Windows NT/.test(ua) && "Windows") || (/Mac OS X/.test(ua) && "macOS") || (/Linux/.test(ua) && "Linux") || "Unknown OS";
  // Most specific first: Edge and Opera also say "Chrome", and Chrome and the Android app's WebView also say "Version" or "Safari".
  const chrome = /; wv\)/.test(ua) ? "App WebView" : "Chrome";
  const browsers = [["Edg", "Edge"], ["OPR", "Opera"], ["SamsungBrowser", "Samsung"], ["Firefox", "Firefox"], ["Chrome", chrome], ["Version", "Safari"]];
  let browser = "";
  for (const [token, name] of browsers) {
    const v = new RegExp(`\\b${token}/(\\d+)`).exec(ua)?.[1];
    if (v) { browser = `${name} ${v}`; break; }
  }
  const model = /Android [\d.]+; ([^;)]+?)(?: Build|; wv|\))/.exec(ua)?.[1];
  return [model, os, browser].filter(Boolean).join(" · ").slice(0, 120);
}

function percentile(sorted, p) { return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] : 0; }
const stamp = (ms) => new Date(ms).toISOString().replace("T", " ").slice(0, 19) + " UTC";
const clampHours = (h) => Math.min(REPORT_MAX_HOURS, Math.max(1, Number(h) || 24));

export function createMonitor({ pool, rawConsole = console, telnyxCheck, smtpCheck, sendMail, getAlertEmail, setAlertEmail }) {
  let queue = [];
  let flushing = false;
  let ready = null;
  const presenceSeen = new Set();
  const dirtyBeats = new Map();
  const debugUntil = new Map(); // uid → ms; users whose app should send detailed logs
  const pendingAlerts = new Map();
  // Request stats since the last restart (a rolling hour, one bucket per minute).
  const minutes = new Map();
  let latencies = [];
  const slowRoutes = new Map();
  const bootAt = Date.now();

  const ensure = () => (ready ??= (async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS mon_sessions (
      session_id VARCHAR(40) PRIMARY KEY, user_id INT NULL, platform VARCHAR(12) NOT NULL DEFAULT 'web',
      form VARCHAR(12) NOT NULL DEFAULT '', app_version VARCHAR(40) NOT NULL DEFAULT '', device VARCHAR(120) NOT NULL DEFAULT '',
      ip VARCHAR(64) NOT NULL DEFAULT '', screen VARCHAR(80) NOT NULL DEFAULT '', ended TINYINT NOT NULL DEFAULT 0,
      started_at BIGINT NOT NULL, last_seen BIGINT NOT NULL,
      KEY idx_ms_seen (last_seen), KEY idx_ms_user (user_id, last_seen)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    await pool.query(`CREATE TABLE IF NOT EXISTS mon_events (
      id BIGINT AUTO_INCREMENT PRIMARY KEY, at BIGINT NOT NULL, user_id INT NULL, session_id VARCHAR(40) NOT NULL DEFAULT '',
      platform VARCHAR(12) NOT NULL DEFAULT '', source VARCHAR(12) NOT NULL DEFAULT 'server', kind VARCHAR(12) NOT NULL DEFAULT 'action',
      level VARCHAR(6) NOT NULL DEFAULT 'info', name VARCHAR(200) NOT NULL DEFAULT '', detail TEXT NULL,
      route VARCHAR(120) NOT NULL DEFAULT '', status SMALLINT NOT NULL DEFAULT 0, ms INT NOT NULL DEFAULT 0, fingerprint CHAR(40) NULL,
      KEY idx_me_at (at), KEY idx_me_user (user_id, at), KEY idx_me_fp (fingerprint, at), KEY idx_me_level (level, at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    await pool.query(`CREATE TABLE IF NOT EXISTS mon_issues (
      id INT AUTO_INCREMENT PRIMARY KEY, fingerprint CHAR(40) NOT NULL, source VARCHAR(12) NOT NULL, level VARCHAR(6) NOT NULL,
      title VARCHAR(200) NOT NULL, sample TEXT NULL, hits INT NOT NULL DEFAULT 0, status VARCHAR(10) NOT NULL DEFAULT 'open',
      first_seen BIGINT NOT NULL, last_seen BIGINT NOT NULL,
      UNIQUE KEY uq_issue_fp (fingerprint), KEY idx_issue_seen (status, last_seen)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    await pool.query(`CREATE TABLE IF NOT EXISTS mon_presence (
      hour BIGINT NOT NULL, who VARCHAR(48) NOT NULL, platform VARCHAR(12) NOT NULL DEFAULT '',
      PRIMARY KEY (hour, who)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    await pool.query(`CREATE TABLE IF NOT EXISTS mon_heartbeats (
      k VARCHAR(32) PRIMARY KEY, at BIGINT NOT NULL, ok TINYINT NOT NULL DEFAULT 1, detail VARCHAR(200) NOT NULL DEFAULT ''
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    await pool.query(`CREATE TABLE IF NOT EXISTS mon_debug (
      user_id INT PRIMARY KEY, until_at BIGINT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    const [rows] = await pool.query("SELECT user_id, until_at FROM mon_debug WHERE until_at > ?", [Date.now()]);
    for (const r of rows) debugUntil.set(Number(r.user_id), Number(r.until_at));
  })());

  /* ------------------------------------------------------------- recording */
  function track(ev) {
    if (queue.length >= MAX_QUEUE) return;
    queue.push({
      at: ev.at || Date.now(), userId: ev.userId ?? null, sessionId: ev.sessionId || "", platform: ev.platform || "",
      source: ev.source || "server", kind: ev.kind || "action", level: LEVELS.has(ev.level) ? ev.level : "info",
      name: scrub(ev.name, 200), detail: ev.detail ? scrub(ev.detail) : null, route: String(ev.route || "").slice(0, 120),
      status: Number(ev.status) || 0, ms: Math.min(2e9, Number(ev.ms) || 0), issue: !!ev.issue, alert: !!ev.alert,
    });
  }

  /** A background job / webhook did its thing — shown on the Health page. */
  function mark(k, ok = true, detail = "") { dirtyBeats.set(k, { at: Date.now(), ok: ok ? 1 : 0, detail: scrub(detail, 200) }); }

  async function upsertIssue(e) {
    const fp = fingerprint(e.source, e.name);
    const [prev] = await pool.query("SELECT status FROM mon_issues WHERE fingerprint = ?", [fp]);
    await pool.query(
      `INSERT INTO mon_issues (fingerprint, source, level, title, sample, hits, status, first_seen, last_seen)
       VALUES (?, ?, ?, ?, ?, 1, 'open', ?, ?)
       ON DUPLICATE KEY UPDATE hits = hits + 1, last_seen = VALUES(last_seen), sample = COALESCE(VALUES(sample), sample),
         status = IF(status = 'resolved', 'open', status)`,
      [fp, e.source, e.level, e.name, e.detail, e.at, e.at]
    );
    const before = prev[0]?.status;
    if (e.alert && before !== "ignored" && before !== "open") pendingAlerts.set(fp, { title: e.name, detail: e.detail, reopened: before === "resolved" });
    return fp;
  }

  async function flush() {
    if (flushing) return;
    flushing = true;
    const batch = queue; queue = [];
    try {
      await ensure();
      const rows = [];
      for (const e of batch) {
        const fp = e.issue ? await upsertIssue(e) : null;
        rows.push([e.at, e.userId, e.sessionId, e.platform, e.source, e.kind, e.level, e.name, e.detail, e.route, e.status, e.ms, fp]);
      }
      for (let i = 0; i < rows.length; i += 200) {
        await pool.query("INSERT INTO mon_events (at, user_id, session_id, platform, source, kind, level, name, detail, route, status, ms, fingerprint) VALUES ?", [rows.slice(i, i + 200)]);
      }
      if (dirtyBeats.size) {
        const beats = [...dirtyBeats.entries()]; dirtyBeats.clear();
        for (const [k, b] of beats) {
          await pool.query("INSERT INTO mon_heartbeats (k, at, ok, detail) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE at = VALUES(at), ok = VALUES(ok), detail = VALUES(detail)", [k, b.at, b.ok, b.detail]);
        }
      }
    } catch (e) {
      // rawConsole, never console: the patched console.error would feed this straight back in.
      rawConsole.error("monitor flush:", e.message);
      if (queue.length + batch.length <= MAX_QUEUE) queue = batch.concat(queue); // DB blip: try again next tick
    } finally { flushing = false; }
  }

  async function sendAlerts() {
    if (!pendingAlerts.size) return;
    const to = getAlertEmail();
    const list = [...pendingAlerts.values()]; pendingAlerts.clear();
    if (!to || !sendMail) return;
    const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
    try {
      await sendMail({
        to,
        subject: `[DIGIRINGO] ${list.length} new problem${list.length > 1 ? "s" : ""}: ${list[0].title}`.replace(/[\r\n]+/g, " ").slice(0, 150),
        html: `<div style="font-family:Arial,sans-serif">${list.slice(0, 20).map((a) => `<p><b>${a.reopened ? "Came back: " : ""}${esc(a.title)}</b><br><span style="color:#667;white-space:pre-wrap">${esc(String(a.detail || "").slice(0, 400))}</span></p>`).join("")}
          <p><a href="https://digiringo.com/admin">Open the Control Hub → Issues</a></p></div>`,
      });
    } catch (e) { rawConsole.error("monitor alert mail:", e.message); }
  }

  async function prune() {
    try {
      await ensure();
      const now = Date.now();
      await pool.query("DELETE FROM mon_events WHERE at < ?", [now - KEEP_EVENTS]);
      await pool.query("DELETE FROM mon_events WHERE kind = 'screen' AND at < ?", [now - KEEP_SCREENS]);
      await pool.query("DELETE FROM mon_events WHERE kind = 'debug' AND at < ?", [now - KEEP_DEBUG]);
      await pool.query("DELETE FROM mon_sessions WHERE last_seen < ?", [now - KEEP_EVENTS]);
      await pool.query("DELETE FROM mon_presence WHERE hour < ?", [now - KEEP_PRESENCE]);
      await pool.query("DELETE FROM mon_debug WHERE until_at < ?", [now]);
    } catch (e) { rawConsole.error("monitor prune:", e.message); }
  }

  /** One finished API request. `uid` is null for logged-out callers. */
  function onRequest({ method, url, status, ms, uid, ip, errorMessage, logged }) {
    const path = String(url || "").split("?")[0];
    if (!path.startsWith("/api") && !path.startsWith("/webhooks")) return;
    for (const [prefix, k] of WEBHOOKS) if (path.startsWith(prefix)) mark(k, status < 400, status < 400 ? "" : `HTTP ${status}`);
    if (QUIET.test(path) || method === "OPTIONS") return;
    const route = path.replace(/\/\d+(?=\/|$)/g, "/:id").replace(/\/[0-9a-f-]{16,}(?=\/|$)/gi, "/:id").slice(0, 120);

    const minute = Math.floor(Date.now() / 60_000);
    const m = minutes.get(minute) ?? { n: 0, e5: 0, e4: 0 };
    m.n++; if (status >= 500) m.e5++; else if (status >= 400) m.e4++;
    minutes.set(minute, m);
    if (minutes.size > 65) minutes.delete(minutes.keys().next().value);
    latencies.push(ms); if (latencies.length > 4000) latencies = latencies.slice(-2000);
    const sr = slowRoutes.get(route) ?? { route, n: 0, total: 0, max: 0, errors: 0 };
    sr.n++; sr.total += ms; sr.max = Math.max(sr.max, ms); if (status >= 500) sr.errors++;
    if (slowRoutes.size < 300 || slowRoutes.has(route)) slowRoutes.set(route, sr);

    const base = { userId: uid, route, status, ms, source: path.startsWith("/api/admin") ? "admin" : "server" };
    if (status >= 500) {
      track({ ...base, kind: "api", level: "error", name: `${method} ${route} failed (${status})`, detail: errorMessage, issue: !logged, alert: !logged });
    } else if (status >= 400) {
      if (path.startsWith("/api/admin/login")) { track({ ...base, kind: "security", level: "warn", name: "Failed Control Hub login", detail: `IP ${ip}` }); return; }
      if (path.startsWith("/api/auth/login")) { track({ ...base, kind: "security", level: "warn", name: "Failed login", detail: `IP ${ip}` }); return; }
      if (status === 401) return; // an expired session, not a problem
      if (uid) track({ ...base, kind: "api", level: "warn", name: `${method} ${route} refused (${status})`, detail: errorMessage });
    } else if (method !== "GET") {
      if (path === "/api/admin/login") { track({ ...base, kind: "security", name: "Control Hub login", detail: `IP ${ip}` }); return; }
      const hit = ACTIONS.find(([mm, re]) => mm === method && re.test(path));
      if (hit) track({ ...base, kind: "action", name: hit[2] });
    }
  }

  /** Client heartbeat. `uid` comes from the verified token, never from the body. */
  async function beat({ body, uid, ip, ua }) {
    await ensure();
    const sid = String(body?.sid || "").replace(/[^\w-]/g, "").slice(0, 40);
    if (sid.length < 8) return { ok: false };
    const platform = PLATFORMS.has(body.platform) ? body.platform : "web";
    const now = Date.now();
    const screen = scrub(body.screen, 80);
    const version = scrub(body.version, 40);
    const form = body.form === "mobile" ? "mobile" : "desktop";
    await pool.query(
      `INSERT INTO mon_sessions (session_id, user_id, platform, form, app_version, device, ip, screen, ended, started_at, last_seen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE user_id = COALESCE(VALUES(user_id), user_id), platform = VALUES(platform), form = VALUES(form), app_version = VALUES(app_version),
         device = VALUES(device), ip = VALUES(ip), screen = VALUES(screen), ended = VALUES(ended), last_seen = VALUES(last_seen)`,
      [sid, uid, platform, form, version, deviceFromUa(ua), String(ip).slice(0, 64), screen, body.ended ? 1 : 0, now, now]
    );

    const hour = now - (now % HOUR);
    const who = uid ? `u${uid}` : `s${sid}`;
    const key = `${hour}|${who}`;
    if (!presenceSeen.has(key)) {
      if (presenceSeen.size > 20000) presenceSeen.clear();
      presenceSeen.add(key);
      await pool.query("INSERT IGNORE INTO mon_presence (hour, who, platform) VALUES (?, ?, ?)", [hour, who, platform]);
    }

    for (const raw of (Array.isArray(body.events) ? body.events : []).slice(0, 60)) {
      const kind = CLIENT_KINDS.has(raw?.k) ? raw.k : null;
      if (!kind || !raw.n) continue;
      if (IGNORE_CLIENT.test(String(raw.n))) continue;
      // Logs are only accepted from a user support actually asked them from.
      if (kind === "debug" && !(uid && (debugUntil.get(uid) ?? 0) > now)) continue;
      const t = Number(raw.t);
      const level = kind === "js_error" ? "error" : raw.l;
      const isIssue = kind === "js_error" || kind === "ui_error" || (kind === "call" && level === "error");
      track({
        at: t && Math.abs(now - t) < 30 * 60_000 ? t : now, userId: uid, sessionId: sid, platform,
        source: "client", kind, level, name: raw.n, detail: raw.d, issue: isIssue,
        // Only signed-in users can trigger an email; the endpoint is public.
        alert: kind === "js_error" && !!uid,
      });
    }
    return { ok: true, debug: !!(uid && (debugUntil.get(uid) ?? 0) > now) };
  }

  /* --------------------------------------------------------- Control Hub API */
  const WHO = "COUNT(DISTINCT COALESCE(CONCAT('u', user_id), CONCAT('s', session_id)))";
  const num = (v) => Number(v) || 0;

  async function live() {
    const now = Date.now(), since = now - ONLINE_MS, d1 = now - DAY;
    const [online] = await pool.query(
      `SELECT s.session_id AS sid, s.user_id AS userId, u.name, u.email, s.platform, s.form, s.app_version AS version, s.device, s.ip, s.screen,
              s.started_at AS startedAt, s.last_seen AS lastSeen
         FROM mon_sessions s LEFT JOIN users u ON u.id = s.user_id
        WHERE s.last_seen > ? AND s.ended = 0 ORDER BY s.user_id IS NULL, s.last_seen DESC LIMIT 300`, [since]);
    const [[active]] = await pool.query(
      `SELECT COUNT(DISTINCT CASE WHEN last_seen > ? THEN user_id END) AS dau,
              COUNT(DISTINCT CASE WHEN last_seen > ? THEN user_id END) AS wau,
              COUNT(DISTINCT user_id) AS mau
         FROM mon_sessions WHERE last_seen > ?`, [d1, now - 7 * DAY, now - 30 * DAY]);
    const [byPlatform] = await pool.query(`SELECT platform, ${WHO} AS n FROM mon_sessions WHERE last_seen > ? GROUP BY platform`, [d1]);
    const [versions] = await pool.query(`SELECT platform, app_version AS version, ${WHO} AS n FROM mon_sessions WHERE last_seen > ? GROUP BY platform, app_version ORDER BY n DESC LIMIT 12`, [now - 7 * DAY]);
    const [series] = await pool.query("SELECT hour, COUNT(*) AS n FROM mon_presence WHERE hour >= ? GROUP BY hour ORDER BY hour", [d1 - (d1 % HOUR)]);
    const [[errs]] = await pool.query(
      `SELECT SUM(level = 'error') AS errors, SUM(level = 'warn') AS warnings, COUNT(DISTINCT CASE WHEN level <> 'info' THEN user_id END) AS affected
         FROM mon_events WHERE at > ? AND kind <> 'debug'`, [d1]);
    const [[openIssues]] = await pool.query("SELECT COUNT(*) AS n, COALESCE(SUM(level = 'error'), 0) AS errors FROM mon_issues WHERE status = 'open'");
    const [[signups]] = await pool.query("SELECT COUNT(*) AS n FROM users WHERE created_at > (NOW() - INTERVAL 1 DAY)");
    const [problems] = await pool.query(
      `SELECT e.user_id AS userId, u.name, u.email, COUNT(*) AS n, SUM(e.level = 'error') AS errors, MAX(e.at) AS lastAt,
              SUBSTRING_INDEX(GROUP_CONCAT(e.name ORDER BY e.at DESC SEPARATOR '\\n'), '\\n', 1) AS lastProblem
         FROM mon_events e JOIN users u ON u.id = e.user_id
        WHERE e.at > ? AND e.level <> 'info' AND e.kind <> 'debug'
        GROUP BY e.user_id, u.name, u.email ORDER BY errors DESC, lastAt DESC LIMIT 30`, [d1]);
    const [feed] = await pool.query(
      `SELECT e.id, e.at, e.user_id AS userId, u.name, e.platform, e.source, e.kind, e.level, e.name AS title, e.status
         FROM mon_events e LEFT JOIN users u ON u.id = e.user_id WHERE e.kind NOT IN ('screen', 'debug') ORDER BY e.id DESC LIMIT 30`);
    const oneHour = [...minutes.entries()].filter(([m]) => m * 60_000 > now - HOUR).reduce((a, [, m]) => ({ n: a.n + m.n, e5: a.e5 + m.e5 }), { n: 0, e5: 0 });
    return {
      now, online, onlineUsers: new Set(online.filter((o) => o.userId).map((o) => o.userId)).size,
      active: { dau: num(active.dau), wau: num(active.wau), mau: num(active.mau) },
      platforms: byPlatform.map((p) => ({ platform: p.platform, n: num(p.n) })),
      versions: versions.map((v) => ({ platform: v.platform, version: v.version, n: num(v.n) })),
      series: series.map((s) => ({ hour: Number(s.hour), n: num(s.n) })),
      errors24h: num(errs.errors), warnings24h: num(errs.warnings), affected24h: num(errs.affected),
      openIssues: num(openIssues.n), openErrors: num(openIssues.errors), signups24h: num(signups.n),
      problems: problems.map((p) => ({ ...p, n: num(p.n), errors: num(p.errors), lastAt: Number(p.lastAt) })),
      feed, requestsHour: oneHour.n, errors5xxHour: oneHour.e5,
    };
  }

  async function events(q) {
    const where = ["1=1"], args = [];
    const add = (sql, v) => { where.push(sql); args.push(v); };
    if (q.get("userId")) add("e.user_id = ?", Number(q.get("userId")));
    if (q.get("level")) add("e.level = ?", q.get("level"));
    if (q.get("source")) add("e.source = ?", q.get("source"));
    if (q.get("platform")) add("e.platform = ?", q.get("platform"));
    if (q.get("kind")) add("e.kind = ?", q.get("kind")); else where.push("e.kind NOT IN ('screen', 'debug')");
    if (q.get("before")) add("e.id < ?", Number(q.get("before")));
    if (q.get("q")) {
      const like = `%${q.get("q")}%`;
      where.push("(e.name LIKE ? OR e.detail LIKE ? OR u.email LIKE ? OR u.name LIKE ?)");
      args.push(like, like, like, like);
    }
    const [rows] = await pool.query(
      `SELECT e.id, e.at, e.user_id AS userId, u.name, u.email, e.platform, e.source, e.kind, e.level, e.name AS title, e.detail, e.route, e.status, e.ms
         FROM mon_events e LEFT JOIN users u ON u.id = e.user_id WHERE ${where.join(" AND ")} ORDER BY e.id DESC LIMIT 100`, args);
    return { events: rows };
  }

  async function issues(q) {
    const where = ["1=1"], args = [];
    where.push("i.status = ?"); args.push(q.get("status") || "open");
    if (q.get("source")) { where.push("i.source = ?"); args.push(q.get("source")); }
    if (q.get("level")) { where.push("i.level = ?"); args.push(q.get("level")); }
    if (q.get("q")) { where.push("i.title LIKE ?"); args.push(`%${q.get("q")}%`); }
    const [rows] = await pool.query(
      `SELECT i.id, i.source, i.level, i.title, i.hits, i.status, i.first_seen AS firstSeen, i.last_seen AS lastSeen,
              (SELECT COUNT(DISTINCT e.user_id) FROM mon_events e WHERE e.fingerprint = i.fingerprint) AS users
         FROM mon_issues i WHERE ${where.join(" AND ")} ORDER BY i.last_seen DESC LIMIT 200`, args);
    return { issues: rows.map((r) => ({ ...r, users: num(r.users) })) };
  }

  async function issue(id) {
    const [[row]] = await pool.query("SELECT id, fingerprint, source, level, title, sample, hits, status, first_seen AS firstSeen, last_seen AS lastSeen FROM mon_issues WHERE id = ?", [id]);
    if (!row) throw Object.assign(new Error("Issue not found"), { status: 404 });
    const [users] = await pool.query(
      `SELECT e.user_id AS userId, u.name, u.email, COUNT(*) AS n, MAX(e.at) AS lastAt FROM mon_events e JOIN users u ON u.id = e.user_id
        WHERE e.fingerprint = ? GROUP BY e.user_id, u.name, u.email ORDER BY lastAt DESC LIMIT 100`, [row.fingerprint]);
    const [recent] = await pool.query(
      `SELECT e.id, e.at, e.user_id AS userId, u.name, e.platform, e.detail, e.route, e.status FROM mon_events e LEFT JOIN users u ON u.id = e.user_id
        WHERE e.fingerprint = ? ORDER BY e.id DESC LIMIT 30`, [row.fingerprint]);
    const { fingerprint: _fp, ...issueRow } = row;
    return { issue: issueRow, users: users.map((u) => ({ ...u, n: num(u.n), lastAt: Number(u.lastAt) })), recent };
  }

  /**
   * Everything about one user over the last `hours`, for checking a complaint:
   * plain-language findings, the timeline, and the same thing as a text file.
   */
  async function userReport(uid, hoursRaw) {
    const hours = clampHours(hoursRaw);
    const now = Date.now(), since = now - hours * HOUR;
    const [[user]] = await pool.query("SELECT id, name, email, status FROM users WHERE id = ?", [uid]);
    if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
    const [sessions] = await pool.query(
      `SELECT session_id AS sid, platform, form, app_version AS version, device, ip, screen, ended, started_at AS startedAt, last_seen AS lastSeen
         FROM mon_sessions WHERE user_id = ? AND last_seen > ? ORDER BY last_seen DESC LIMIT 50`, [uid, since]);
    const [timeline] = await pool.query(
      `SELECT id, at, platform, source, kind, level, name AS title, detail, route, status, ms
         FROM mon_events WHERE user_id = ? AND at > ? ORDER BY at DESC, id DESC LIMIT 3000`, [uid, since]);
    const [calls] = await pool.query(
      `SELECT contact, direction, status, duration, via_e164 AS via, UNIX_TIMESTAMP(created_at) * 1000 AS at FROM call_logs
        WHERE user_id = ? AND created_at > FROM_UNIXTIME(?) ORDER BY id DESC LIMIT 200`, [uid, Math.floor(since / 1000)]);

    const online = sessions.some((s) => Number(s.lastSeen) > now - ONLINE_MS && !s.ended);
    const debugAt = debugUntil.get(Number(uid)) ?? 0;
    const problems = timeline.filter((e) => e.level !== "info" && e.kind !== "debug");
    const errors = problems.filter((e) => e.level === "error");
    const counts = new Map();
    for (const p of problems) {
      const c = counts.get(p.title) ?? { title: p.title, level: p.level, n: 0, lastAt: Number(p.at), detail: p.detail };
      c.n++; counts.set(p.title, c);
    }
    const top = [...counts.values()].sort((a, b) => b.n - a.n).slice(0, 15);
    const callsMade = calls.filter((c) => c.direction !== "missed").length;
    const findings = [
      online ? "Online right now." : sessions[0] ? `Last seen ${stamp(Number(sessions[0].lastSeen))}.` : `Did not open the app in the last ${hours}h.`,
      problems.length ? `${errors.length} errors and ${problems.length - errors.length} warnings in the last ${hours}h.` : `No errors recorded in the last ${hours}h.`,
      `${callsMade} calls, ${calls.length - callsMade} missed.`,
    ];

    const line = (e) => `${stamp(Number(e.at))}  ${e.level.toUpperCase().padEnd(5)}  ${(e.platform || e.source).padEnd(8)} ${e.title}${e.status ? ` [${e.status}]` : ""}${e.detail ? `\n    ${String(e.detail).replace(/\n/g, "\n    ")}` : ""}`;
    const text = [
      `DIGIRINGO diagnostics: ${user.name} <${user.email}> (user #${user.id}, ${user.status})`,
      `Period: last ${hours} hours, generated ${stamp(now)}`, "",
      "SUMMARY", ...findings.map((f) => `  - ${f}`), "",
      "PROBLEMS (most frequent first)", ...(top.length ? top.map((t) => `  ${String(t.n).padStart(4)}x ${t.level.toUpperCase()}  ${t.title}`) : ["  none"]), "",
      "DEVICES", ...(sessions.length ? sessions.map((s) => `  ${s.platform} ${s.version}  ${s.device}  IP ${s.ip}  last seen ${stamp(Number(s.lastSeen))}`) : ["  none"]), "",
      "CALLS", ...(calls.length ? calls.map((c) => `  ${stamp(Number(c.at))}  ${c.direction}  ${c.contact}  ${c.status}  ${c.duration}`) : ["  none"]), "",
      "TIMELINE (oldest first)", ...[...timeline].reverse().map(line), "",
    ].join("\n");

    return {
      user, hours, online, findings, problems: top, sessions, calls, timeline: timeline.slice(0, 500),
      truncated: timeline.length > 500, debugUntil: debugAt > now ? debugAt : null, text,
    };
  }

  async function setDebug(uid, hours) {
    if (!(hours > 0)) {
      debugUntil.delete(uid);
      await pool.query("DELETE FROM mon_debug WHERE user_id = ?", [uid]);
      return { debugUntil: null };
    }
    const until = Date.now() + Math.min(72, hours) * HOUR;
    debugUntil.set(uid, until);
    await pool.query("INSERT INTO mon_debug (user_id, until_at) VALUES (?, ?) ON DUPLICATE KEY UPDATE until_at = VALUES(until_at)", [uid, until]);
    track({ userId: uid, source: "admin", kind: "admin", name: "Support turned on detailed logs", detail: `Until ${stamp(until)}` });
    return { debugUntil: until };
  }

  const JOBS = [
    { k: "renewals", label: "Plan and number renewals", everyMs: HOUR },
    { k: "reconcile", label: "Number reconcile", everyMs: 15 * 60_000 },
    { k: "rate-deck", label: "Rate deck refresh", everyMs: 6 * HOUR },
  ];
  const WEBHOOK_LABELS = { "telnyx-webhook": "Telnyx (SMS)", "texml-webhook": "Telnyx (calls)", "freemius-webhook": "Freemius (payments)", "paypal-webhook": "PayPal (payments)" };

  async function health() {
    const now = Date.now();
    const t0 = Date.now();
    let dbOk = true, dbMs = 0;
    try { await pool.query("SELECT 1"); dbMs = Date.now() - t0; } catch { dbOk = false; }
    const [beats] = await pool.query("SELECT k, at, ok, detail FROM mon_heartbeats").catch(() => [[]]);
    const beatOf = (k) => beats.find((b) => b.k === k);
    let disk = null;
    try { const s = await statfs("/"); disk = { total: s.blocks * s.bsize, free: s.bavail * s.bsize }; } catch { /* not supported here */ }
    const [telnyx, smtp] = await Promise.all([telnyxCheck().catch((e) => ({ ok: false, detail: e.message })), smtpCheck().catch((e) => ({ ok: false, detail: e.message }))]);
    const sorted = [...latencies].sort((a, b) => a - b);
    const buckets = [...minutes.entries()].filter(([m]) => m * 60_000 > now - HOUR);
    const totals = buckets.reduce((a, [, m]) => ({ n: a.n + m.n, e5: a.e5 + m.e5, e4: a.e4 + m.e4 }), { n: 0, e5: 0, e4: 0 });
    return {
      now, bootAt, uptimeSec: Math.round(process.uptime()), node: process.version,
      process: { rss: process.memoryUsage().rss, heap: process.memoryUsage().heapUsed },
      system: { totalMem: totalmem(), freeMem: freemem(), load: loadavg(), cpus: cpus().length, disk },
      db: { ok: dbOk, ms: dbMs }, telnyx, smtp,
      jobs: JOBS.map((j) => {
        const b = beatOf(j.k);
        return { ...j, at: b ? Number(b.at) : null, ok: !!b?.ok, detail: b?.detail || "", stale: !b || now - Number(b.at) > j.everyMs * 2.5 };
      }),
      webhooks: Object.entries(WEBHOOK_LABELS).map(([k, label]) => {
        const b = beatOf(k);
        return { k, label, at: b ? Number(b.at) : null, ok: b ? !!b.ok : null, detail: b?.detail || "" };
      }),
      requests: { ...totals, p50: percentile(sorted, 0.5), p95: percentile(sorted, 0.95), series: buckets.map(([m, v]) => ({ at: m * 60_000, n: v.n, errors: v.e5 })) },
      routes: [...slowRoutes.values()].map((r) => ({ route: r.route, n: r.n, avg: Math.round(r.total / r.n), max: r.max, errors: r.errors })).sort((a, b) => b.avg - a.avg).slice(0, 12),
      queue: queue.length, alertEmail: getAlertEmail(),
    };
  }

  /** Routes under /api/admin/monitor/ (the caller has already checked the admin token). */
  async function adminApi(path, q, method, d) {
    await ensure();
    await flush(); // show what just happened, not what happened 3 seconds ago
    if (path === "live" && method === "GET") return live();
    if (path === "events" && method === "GET") return events(q);
    if (path === "issues" && method === "GET") return issues(q);
    if (path === "issue" && method === "GET") return issue(Number(q.get("id")));
    if (path === "issue/status" && method === "POST") {
      if (!["open", "resolved", "ignored"].includes(d.status)) throw Object.assign(new Error("Bad status"), { status: 400 });
      await pool.query("UPDATE mon_issues SET status = ? WHERE id = ?", [d.status, Number(d.id)]);
      track({ source: "admin", kind: "admin", name: `Marked an issue as ${d.status}`, detail: `Issue #${Number(d.id)}` });
      return { ok: true };
    }
    if (path === "user/report" && method === "GET") return userReport(Number(q.get("id")), q.get("hours"));
    if (path === "user/debug" && method === "POST") {
      if (!d.userId) throw Object.assign(new Error("userId required"), { status: 400 });
      return setDebug(Number(d.userId), Number(d.hours));
    }
    if (path === "health" && method === "GET") return health();
    if (path === "settings" && method === "POST") {
      const email = String(d.alertEmail || "").trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Object.assign(new Error("That email doesn't look right"), { status: 400 });
      await setAlertEmail(email);
      return { ok: true };
    }
    throw Object.assign(new Error("Not found"), { status: 404 });
  }

  function start() {
    setInterval(flush, 3000).unref?.();
    setInterval(sendAlerts, 5 * 60_000).unref?.();
    setInterval(prune, 6 * HOUR).unref?.();
    setTimeout(prune, 60_000).unref?.();
    mark("boot");
    track({ kind: "system", name: "Server started" });
  }

  return { track, mark, flush, beat, onRequest, adminApi, start };
}
