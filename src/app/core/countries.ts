/**
 * Country helpers for any ISO country — flag, display name, calling code, and
 * the country of an E.164 number. No per-country tables to keep in sync beyond
 * the calling codes below.
 */

/** ISO 3166-1 alpha-2 → calling code (without "+"). */
export const DIAL_CODES: Record<string, string> = {
  AD: "376", AE: "971", AF: "93", AG: "1", AI: "1", AL: "355", AM: "374", AO: "244", AR: "54", AS: "1",
  AT: "43", AU: "61", AW: "297", AX: "358", AZ: "994", BA: "387", BB: "1", BD: "880", BE: "32", BF: "226",
  BG: "359", BH: "973", BI: "257", BJ: "229", BL: "590", BM: "1", BN: "673", BO: "591", BQ: "599", BR: "55",
  BS: "1", BT: "975", BW: "267", BY: "375", BZ: "501", CA: "1", CD: "243", CF: "236", CG: "242", CH: "41",
  CI: "225", CK: "682", CL: "56", CM: "237", CN: "86", CO: "57", CR: "506", CU: "53", CV: "238", CW: "599",
  CY: "357", CZ: "420", DE: "49", DJ: "253", DK: "45", DM: "1", DO: "1", DZ: "213", EC: "593", EE: "372",
  EG: "20", ER: "291", ES: "34", ET: "251", FI: "358", FJ: "679", FK: "500", FM: "691", FO: "298", FR: "33",
  GA: "241", GB: "44", GD: "1", GE: "995", GF: "594", GG: "44", GH: "233", GI: "350", GL: "299", GM: "220",
  GN: "224", GP: "590", GQ: "240", GR: "30", GT: "502", GU: "1", GW: "245", GY: "592", HK: "852", HN: "504",
  HR: "385", HT: "509", HU: "36", ID: "62", IE: "353", IL: "972", IM: "44", IN: "91", IQ: "964", IR: "98",
  IS: "354", IT: "39", JE: "44", JM: "1", JO: "962", JP: "81", KE: "254", KG: "996", KH: "855", KI: "686",
  KM: "269", KN: "1", KP: "850", KR: "82", KW: "965", KY: "1", KZ: "7", LA: "856", LB: "961", LC: "1",
  LI: "423", LK: "94", LR: "231", LS: "266", LT: "370", LU: "352", LV: "371", LY: "218", MA: "212", MC: "377",
  MD: "373", ME: "382", MF: "590", MG: "261", MH: "692", MK: "389", ML: "223", MM: "95", MN: "976", MO: "853",
  MP: "1", MQ: "596", MR: "222", MS: "1", MT: "356", MU: "230", MV: "960", MW: "265", MX: "52", MY: "60",
  MZ: "258", NA: "264", NC: "687", NE: "227", NG: "234", NI: "505", NL: "31", NO: "47", NP: "977", NR: "674",
  NZ: "64", OM: "968", PA: "507", PE: "51", PF: "689", PG: "675", PH: "63", PK: "92", PL: "48", PM: "508",
  PR: "1", PS: "970", PT: "351", PW: "680", PY: "595", QA: "974", RE: "262", RO: "40", RS: "381", RU: "7",
  RW: "250", SA: "966", SB: "677", SC: "248", SD: "249", SE: "46", SG: "65", SI: "386", SK: "421", SL: "232",
  SM: "378", SN: "221", SO: "252", SR: "597", SS: "211", ST: "239", SV: "503", SX: "1", SY: "963", SZ: "268",
  TC: "1", TD: "235", TG: "228", TH: "66", TJ: "992", TL: "670", TM: "993", TN: "216", TO: "676", TR: "90",
  TT: "1", TV: "688", TW: "886", TZ: "255", UA: "380", UG: "256", US: "1", UY: "598", UZ: "998", VA: "39",
  VC: "1", VE: "58", VG: "1", VI: "1", VN: "84", VU: "678", WS: "685", XK: "383", YE: "967", YT: "262",
  ZA: "27", ZM: "260", ZW: "263",
};

// +1 countries other than the US, by area code.
const NANP: Record<string, string> = {
  "242": "BS", "246": "BB", "264": "AI", "268": "AG", "284": "VG", "340": "VI", "345": "KY", "441": "BM",
  "473": "GD", "649": "TC", "658": "JM", "664": "MS", "670": "MP", "671": "GU", "684": "AS", "721": "SX",
  "758": "LC", "767": "DM", "784": "VC", "787": "PR", "809": "DO", "829": "DO", "849": "DO", "868": "TT",
  "869": "KN", "876": "JM", "939": "PR",
  // Canada
  "204": "CA", "226": "CA", "236": "CA", "249": "CA", "250": "CA", "263": "CA", "289": "CA", "306": "CA",
  "343": "CA", "354": "CA", "365": "CA", "367": "CA", "368": "CA", "382": "CA", "403": "CA", "416": "CA",
  "418": "CA", "428": "CA", "431": "CA", "437": "CA", "438": "CA", "450": "CA", "468": "CA", "474": "CA",
  "506": "CA", "514": "CA", "519": "CA", "548": "CA", "579": "CA", "581": "CA", "584": "CA", "587": "CA",
  "604": "CA", "613": "CA", "639": "CA", "647": "CA", "672": "CA", "683": "CA", "705": "CA", "709": "CA",
  "742": "CA", "753": "CA", "778": "CA", "780": "CA", "782": "CA", "807": "CA", "819": "CA", "825": "CA",
  "867": "CA", "873": "CA", "879": "CA", "902": "CA", "905": "CA",
};

// Shared codes: the country shown when only the code is known.
const PRIMARY: Record<string, string> = { "1": "US", "7": "RU", "44": "GB", "39": "IT", "262": "RE", "358": "FI", "590": "GP", "599": "CW" };

const BY_CODE = new Map<string, string>();
for (const [iso, code] of Object.entries(DIAL_CODES)) if (!BY_CODE.has(code)) BY_CODE.set(code, iso);
for (const [code, iso] of Object.entries(PRIMARY)) BY_CODE.set(code, iso);

/** "PK" → 🇵🇰 */
export function flagOf(iso: string): string {
  const c = (iso || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return "🌍";
  return String.fromCodePoint(...[...c].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

let names: Intl.DisplayNames | null = null;
try { names = new Intl.DisplayNames(["en"], { type: "region" }); } catch { /* old engine */ }

/** "PK" → "Pakistan" */
export function countryName(iso: string): string {
  const c = (iso || "").toUpperCase();
  try { return names?.of(c) || c; } catch { return c; }
}

/** "+92518105054" → "PK", "+18765550000" → "JM". "US" when unknown. */
export function isoOfE164(e164: string): string {
  const d = (e164 || "").replace(/\D/g, "");
  if (d.startsWith("1")) return NANP[d.slice(1, 4)] ?? "US";
  for (const len of [3, 2, 1]) {
    const iso = BY_CODE.get(d.slice(0, len));
    if (iso) return iso;
  }
  return "US";
}
