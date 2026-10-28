/**
 * Telnyx outbound voice rate deck ("Global Conversational", the deck our
 * outbound profiles bill on). Telnyx has no per-destination rate API; the
 * portal links this CSV instead (public, ~35 MB, ~260k prefixes). We download
 * it once a day, keep the last good copy on disk, and index it by destination
 * prefix.
 *
 * A prefix can carry several rates depending on the caller ID's country
 * ("local" = caller in the same country, or a list of surcharged origins).
 * Affordability checks use the highest of them, so a call is never let
 * through on a rate lower than Telnyx may charge.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DECK_URL = process.env.TELNYX_RATE_DECK_URL
  || "https://portal.telnyx.com/downloads/global_conversational/global_conver_e6762f4dc6.csv";
const CACHE = process.env.TELNYX_RATE_DECK_CACHE || path.join(os.tmpdir(), "digiringo-rate-deck.csv");
// International SMS price sheet (per country + operator), linked from the portal's Messaging pricing.
const SMS_URL = process.env.TELNYX_SMS_RATES_URL
  || "https://portal.telnyx.com/downloads/intl_sms/usd_rates_20260505_0930.csv";
const SMS_CACHE = path.join(path.dirname(CACHE), "digiringo-sms-rates.csv");
const TTL = 24 * 3600_000;

let deck = null;   // { at, prefixes: Map<digits, Entry>, countries: Map<iso, summary> }
// Entry: { iso, max, base, local, sur: [[originPrefixes[], rate]] }
let loading = null;

function cells(line) {
  const out = []; let cur = "", q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

function build(csv) {
  const prefixes = new Map();
  const origins = new Map(); // the same origin lists repeat thousands of times — share one array each
  const perIso = new Map(); // iso → { name, code, fixed: [], mobile: [] } from non-surcharged rows
  const lines = csv.split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const [iso, name, origin, dest, desc, , , rateRaw, perCall] = cells(lines[i]);
    const rate = (parseFloat(rateRaw) || 0) + (parseFloat(perCall) || 0) / 3; // fold a per-call fee into a short call
    if (!dest || !/^\d+$/.test(dest) || rate <= 0) continue;
    const e = prefixes.get(dest) || { iso, max: 0, base: null, local: null, sur: [] };
    e.max = Math.max(e.max, rate);
    if (!origin) e.base = rate;
    else if (origin === "local") e.local = rate;
    else {
      if (!origins.has(origin)) origins.set(origin, origin.split(",").map((x) => x.trim()).filter(Boolean));
      e.sur.push([origins.get(origin), rate]);
    }
    prefixes.set(dest, e);
    if (!origin) {
      const c = perIso.get(iso) || { name, code: "", fixed: [], mobile: [] };
      if (!c.code || dest.length < c.code.length) c.code = dest;
      (/mobile/i.test(desc) ? c.mobile : c.fixed).push({ dest, rate });
      perIso.set(iso, c);
    }
  }
  const countries = new Map();
  const mode = (list) => {
    if (!list.length) return null;
    const n = new Map();
    for (const { rate } of list) n.set(rate, (n.get(rate) || 0) + 1);
    return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
  };
  for (const [iso, c] of perIso) {
    // Landline: the country-code row itself when present, else the usual fixed rate.
    const landline = c.fixed.find((x) => x.dest === c.code)?.rate ?? mode(c.fixed);
    countries.set(iso, { name: c.name, code: c.code, landline, mobile: mode(c.mobile) ?? landline });
  }
  return { at: Date.now(), prefixes, countries };
}

let sms = null; // Map<iso, highest $/part across the country's operators>

function buildSms(csv) {
  const out = new Map();
  for (const line of csv.split("\n").slice(1)) {
    if (!line) continue;
    const c = cells(line);
    const iso = String(c[4] || "").trim().toUpperCase(), price = parseFloat(c[7]) || 0;
    if (/^[A-Z]{2}$/.test(iso) && price > 0) out.set(iso, Math.max(out.get(iso) || 0, price));
  }
  return out;
}

async function loadSms() {
  try {
    const r = await fetch(SMS_URL);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const csv = await r.text();
    if (!/^Region,Country/.test(csv)) throw new Error("not an SMS rate sheet");
    sms = buildSms(csv);
    fs.promises.writeFile(SMS_CACHE, csv).catch(() => {});
  } catch (e) {
    console.warn("sms rates: download failed —", e.message);
    if (!sms) { try { sms = buildSms(await fs.promises.readFile(SMS_CACHE, "utf8")); } catch { /* no copy yet */ } }
  }
}

async function load() {
  await loadSms();
  try {
    const r = await fetch(DECK_URL);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const csv = await r.text();
    if (!csv.startsWith("ISO,")) throw new Error("not a rate deck");
    deck = build(csv);
    fs.promises.writeFile(CACHE, csv).catch(() => {});
    console.log(`rate deck: ${deck.prefixes.size} prefixes, ${deck.countries.size} countries`);
  } catch (e) {
    console.warn("rate deck: download failed —", e.message);
    if (!deck) {
      try { deck = build(await fs.promises.readFile(CACHE, "utf8")); deck.at = Date.now() - TTL + 3600_000; }
      catch { /* no copy yet */ }
    } else deck.at = Date.now() - TTL + 3600_000; // retry in an hour
  }
}

/** Make sure the deck is loaded (and refreshed daily). Never throws. */
export async function ensureRateDeck() {
  if (deck && Date.now() - deck.at < TTL) return deck;
  loading ??= load().finally(() => { loading = null; });
  await loading;
  return deck;
}

const digits = (e164) => String(e164 || "").replace(/\D/g, "");

function entryFor(d) {
  for (let n = Math.min(d.length, 15); n > 0; n--) {
    const hit = deck.prefixes.get(d.slice(0, n));
    if (hit) return hit;
  }
  return null;
}

/** Rate for one caller ID: local, surcharged origin, or the plain rate. */
function rateFrom(e, from) {
  const f = digits(from);
  const fromEntry = f && entryFor(f);
  if (e.local != null && fromEntry?.iso === e.iso) return e.local;
  let sur = null;
  for (const [list, rate] of e.sur) if (list.some((p) => f.startsWith(p))) sur = Math.max(sur ?? 0, rate);
  return sur ?? e.base ?? e.max;
}

/**
 * Wholesale $/min Telnyx may charge for a call to `to` placed from any of the
 * caller IDs in `froms` (the highest of them). With no caller IDs, the highest
 * rate the prefix carries. Null when the destination isn't in the deck.
 */
export function outboundRate(to, froms = []) {
  if (!deck) return null;
  const e = entryFor(digits(to));
  if (!e) return null;
  const ids = froms.filter(Boolean);
  if (!ids.length) return e.max;
  return Math.max(...ids.map((f) => rateFrom(e, f)));
}

/** Highest wholesale $/part to text `to` abroad (any operator in its country), or null. */
export function smsRateMax(to) {
  if (!deck || !sms) return null;
  const e = entryFor(digits(to));
  return e ? sms.get(e.iso) ?? null : null;
}

/** Highest wholesale $/part to text a number in `iso`, or null. */
export function countrySmsRate(iso) {
  return sms?.get(String(iso || "").toUpperCase()) ?? null;
}

/** Typical wholesale $/min to a country's landlines and mobiles (non-surcharged). */
export function countryCallRates(iso) {
  return deck?.countries.get(String(iso || "").toUpperCase()) || null;
}

/** Every ISO country code the deck can terminate calls to. */
export function deckCountries() {
  return deck ? [...deck.countries.keys()] : [];
}
