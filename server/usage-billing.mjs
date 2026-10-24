/**
 * Usage sync — bills calls and SMS at what Telnyx ACTUALLY charged for them.
 *
 * Every few minutes this reads Telnyx's detail records (sip-trunking = calls,
 * messaging = SMS/MMS), maps each record with a cost to the DIGIRINGO user it
 * belongs to, and hands it to db.recordUsage() (cost + markup, plan pool first
 * for US/Canada). The ledger is unique on the Telnyx record id, so re-reading
 * an overlapping window never bills twice.
 *
 * How a call shows up in the records:
 *   • outgoing app call  → one leg on the user's WebRTC connection
 *                          ("DIGIRINGO u<id> …"), cld = the number dialled
 *   • incoming call      → the number's leg on the TeXML app (cld = our number)
 *                          + the leg that rang the app (user's connection)
 *                          + a forward leg to the cellphone, when forwarded
 */
import { isDomestic, rateKey } from "./usage-rates.mjs";

const SYNC_EVERY_MS = 3 * 60_000;
const OVERLAP_MS = 6 * 3600_000; // re-read this far back: records can land late
const PAGE_SIZE = 250;
const MAX_PAGES = 40;

const iso = (ms) => new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
const isPstn = (s) => /^\+\d{6,15}$/.test(String(s || ""));
const minutesOf = (sec) => Math.max(1, Math.ceil((Number(sec) || 0) / 60));
const money = (v) => Math.max(0, Number(v) || 0);

export function createUsageSync({ db, telnyxFetch }) {
  let running = false;

  async function fetchAll(recordType, timeField, sinceMs) {
    const out = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const q = `filter[record_type]=${recordType}&filter[${timeField}][gte]=${iso(sinceMs)}` +
        `&sort=${timeField}&page[size]=${PAGE_SIZE}&page[number]=${page}`;
      const r = await telnyxFetch(`/detail_records?${q.replace(/\[/g, "%5B").replace(/\]/g, "%5D")}`);
      if (!r.ok) throw new Error(`detail_records ${recordType} → HTTP ${r.status}`);
      const j = await r.json();
      out.push(...(j.data || []));
      if (page >= Number(j.meta?.total_pages || 0)) break;
    }
    return out;
  }

  // Owner lookups are cached per run (a number's owner doesn't change mid-run).
  function ownerLookup() {
    const cache = new Map();
    return async (e164) => {
      if (!isPstn(e164)) return null;
      if (!cache.has(e164)) cache.set(e164, await db.findNumberOwner(e164).then((o) => (o ? Number(o.userId) : null)).catch(() => null));
      return cache.get(e164);
    };
  }

  async function billCalls(sinceMs) {
    const recs = (await fetchAll("sip-trunking", "started_at", sinceMs)).filter((r) => money(r.cost) > 0);
    if (!recs.length) return 0;
    const known = await db.knownUsageRefs(recs.map((r) => `cdr:${r.id}`));
    const owner = ownerLookup();
    const sessionUser = new Map();
    const userConn = (r) => /^DIGIRINGO u(\d+)\b/i.exec(String(r.connection_name || ""));
    // The number's own inbound leg first, so forward legs can find their owner.
    const isNumberLeg = (r) => !userConn(r) && r.direction === "inbound" && isPstn(r.cld);
    recs.sort((a, b) => Number(isNumberLeg(b)) - Number(isNumberLeg(a)));

    let n = 0;
    for (const r of recs) {
      const ref = `cdr:${r.id}`;
      if (known.has(ref)) continue;
      const session = String(r.telnyx_session_id || "");
      const sec = Number(r.billed_sec) || 0;
      const mins = minutesOf(sec);
      const base = { kind: "voice", ref, session, wholesale: money(r.cost), units: sec / 60 };
      let row = null;
      const m = userConn(r);
      if (m && r.direction === "outbound" && isPstn(r.cld)) {
        row = { uid: m[1], leg: "out", rateKey: rateKey(r.cld), domestic: isDomestic(r.cld), plan: "count", units: mins,
          detail: `Call to ${r.cld} · ${mins} min` };
      } else if (m) {
        row = { uid: m[1], leg: "app", rateKey: "1", domestic: !isPstn(r.cli) || isDomestic(r.cli), plan: "ride",
          detail: `Call in app · ${mins} min` };
      } else if (isNumberLeg(r)) {
        const uid = await owner(r.cld);
        if (uid) sessionUser.set(session, uid);
        row = { uid, leg: "in", rateKey: rateKey(r.cld), domestic: isDomestic(r.cld), plan: "count", units: mins,
          detail: `Incoming call${isPstn(r.cli) ? ` from ${r.cli}` : ""} · ${mins} min` };
      } else if (r.direction === "outbound" && isPstn(r.cld)) {
        const uid = sessionUser.get(session) || await db.usageSessionOwner(session).catch(() => null);
        row = { uid, leg: "fwd", rateKey: rateKey(r.cld), domestic: isDomestic(r.cld), plan: "ride",
          detail: `Forwarded call to ${r.cld} · ${mins} min` };
      } else {
        const sip = /^sip:digiringou(\d+)d/i.exec(String(r.cld || ""));
        row = { uid: sip ? sip[1] : null, leg: "app", rateKey: "1", domestic: true, plan: "ride", detail: `Call in app · ${mins} min` };
      }
      if (!row.uid) console.warn(`usage: call record ${r.id} ($${r.cost}) has no DIGIRINGO owner — not billed`);
      const res = await db.recordUsage({ ...base, ...row, uid: row.uid || 0 });
      if (res.billed) n++;
    }
    return n;
  }

  async function billMessages(sinceMs) {
    const FINAL = new Set(["queued", "sending", "pending"]);
    const recs = (await fetchAll("messaging", "created_at", sinceMs))
      .filter((r) => !FINAL.has(String(r.status || "").toLowerCase()));
    const priced = recs.map((r) => {
      // `cost` normally already includes the carrier fee; add it only when cost
      // is exactly rate × parts (i.e. the fee was left out).
      const cost = money(r.cost), rate = money(r.rate), parts = Math.max(1, Number(r.parts) || 1);
      const fee = money(r.carrier_fee);
      const total = fee > 0 && Math.abs(cost - rate * parts) < 1e-6 ? cost + fee : cost;
      return { r, total, parts };
    }).filter((x) => x.total > 0);
    if (!priced.length) return 0;
    const known = await db.knownUsageRefs(priced.map((x) => `msg:${x.r.id}`));
    const owner = ownerLookup();
    let n = 0;
    for (const { r, total, parts } of priced) {
      const ref = `msg:${r.id}`;
      if (known.has(ref)) continue;
      const outbound = r.direction === "outbound";
      const ours = outbound ? r.cli : r.cld;     // the DIGIRINGO number
      const other = outbound ? r.cld : r.cli;    // the other party
      const uid = await owner(ours);
      if (!uid) console.warn(`usage: message ${r.id} ($${total}) has no DIGIRINGO owner — not billed`);
      const label = r.message_type === "MMS" ? "MMS" : "SMS";
      const res = await db.recordUsage({
        uid: uid || 0, kind: "sms", leg: outbound ? "out" : "in", ref, units: parts, wholesale: total,
        rateKey: rateKey(outbound ? other : ours),
        domestic: isDomestic(ours) && (!isPstn(other) || isDomestic(other)),
        plan: outbound ? "count" : "ride",
        detail: `${label} ${outbound ? "to" : "from"} ${other}${parts > 1 ? ` (${parts} parts)` : ""}`,
      });
      if (res.billed) n++;
    }
    return n;
  }

  /** One sync pass. Never overlaps itself; a failed pass is simply retried next tick. */
  async function run() {
    if (running) return;
    running = true;
    try {
      const now = Date.now();
      let since = Number(await db.getBillingState("usage_since")) || 0;
      if (!since) {
        // First run: start billing from now (earlier usage was billed by the old meter).
        await db.setBillingState("usage_since", now);
        await db.setBillingState("usage_last_ok", now);
        console.log("usage billing: starting from", iso(now));
        return;
      }
      const lastOk = Number(await db.getBillingState("usage_last_ok")) || since;
      const from = Math.max(since, lastOk - OVERLAP_MS);
      const calls = await billCalls(from);
      const msgs = await billMessages(from);
      await db.setBillingState("usage_last_ok", now);
      if (calls || msgs) console.log(`usage billing: ${calls} call leg(s), ${msgs} message(s) billed`);
    } catch (e) {
      console.error("usage billing sync failed:", e.message);
    } finally {
      running = false;
    }
  }

  function start() {
    setTimeout(run, 30_000).unref?.();
    setInterval(run, SYNC_EVERY_MS).unref?.();
  }

  return { run, start };
}
