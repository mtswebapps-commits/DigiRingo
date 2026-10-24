/**
 * Usage pricing helpers — shared by the billing ledger (auth-db.mjs) and the
 * Telnyx usage sync (usage-billing.mjs).
 *
 * Calls and SMS are billed at what Telnyx ACTUALLY charged for them (read from
 * Telnyx's detail records) plus MARKUP_PCT. Telnyx publishes no per-destination
 * rate API, so the only thing estimated is the pre-call / pre-send affordability
 * check: it uses the rates we've already been charged per destination prefix,
 * falling back to the conservative defaults below until one is seen.
 */
import { MARKUP_PCT } from "./plans.mjs";

/** Customer price for a Telnyx cost (unrounded — the ledger keeps sub-cent amounts). */
export const retailOf = (wholesale) => Number(wholesale || 0) * (1 + MARKUP_PCT / 100);

// NANP area codes that are NOT the US or Canada (Caribbean & co.). They dial as
// +1 but are billed as international — often at premium rates.
const NANP_FOREIGN = new Set([
  "242", "246", "264", "268", "284", "345", "441", "473", "649", "658", "664",
  "721", "758", "767", "784", "809", "829", "849", "868", "869", "876",
]);

// ITU country calling codes that are 1 or 2 digits long; everything else is 3.
const CC1 = new Set(["7"]);
const CC2 = new Set([
  "20", "27", "30", "31", "32", "33", "34", "36", "39", "40", "41", "43", "44", "45", "46", "47", "48", "49",
  "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "64", "65", "66",
  "81", "82", "84", "86", "90", "91", "92", "93", "94", "95", "98",
]);

const digitsOf = (e164) => String(e164 || "").replace(/\D/g, "");

/** True for a US/Canada (+1, non-Caribbean) number. */
export function isDomestic(e164) {
  const d = digitsOf(e164);
  return d.length === 11 && d[0] === "1" && !NANP_FOREIGN.has(d.slice(1, 4));
}

/**
 * The rate bucket a number falls in: "1" for US/Canada, "1876"-style for the
 * other NANP areas, otherwise the country calling code ("44", "92", "971"…).
 */
export function rateKey(e164) {
  const d = digitsOf(e164);
  if (!d) return "";
  if (d[0] === "1") return isDomestic(e164) ? "1" : d.slice(0, 4);
  if (CC1.has(d[0])) return d[0];
  if (CC2.has(d.slice(0, 2))) return d.slice(0, 2);
  return d.slice(0, 3);
}

// Wholesale fallbacks (USD) used ONLY to decide whether an account can afford a
// call/SMS before any real rate for that destination has been seen.
const DEFAULT_WHOLESALE = {
  sms:   { domestic: 0.008, intl: 0.10 }, // per message part (US includes carrier fee)
  voice: { domestic: 0.006, intl: 0.10 }, // per minute
};
export const defaultWholesale = (kind, key) =>
  DEFAULT_WHOLESALE[kind === "sms" ? "sms" : "voice"][key === "1" ? "domestic" : "intl"];

/** SMS segment count for a text (GSM-7: 160 / 153 per part, otherwise 70 / 67). */
export function smsParts(text) {
  const s = String(text || "");
  if (!s) return 1;
  // eslint-disable-next-line no-control-regex
  const gsm = /^[\n\r\x20-\x7E£¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ¤¡ÄÖÑÜ§¿äöñüà€^{}\\[~\]|]*$/.test(s);
  const len = [...s].length;
  const [single, multi] = gsm ? [160, 153] : [70, 67];
  return len <= single ? 1 : Math.ceil(len / multi);
}
