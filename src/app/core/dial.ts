/** Country calling-code helpers for the dialer (ITU E.164 code lengths). */

// 2-digit calling codes; "1" and "7" are 1-digit, everything else is 3-digit.
const TWO_DIGIT = new Set([
  "20", "27", "30", "31", "32", "33", "34", "36", "39", "40", "41", "43", "44", "45", "46", "47", "48", "49",
  "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "64", "65", "66",
  "81", "82", "84", "86", "90", "91", "92", "93", "94", "95", "98",
]);

/** "+447418612133" → "44", "+13855130953" → "1". Empty when unknown. */
export function dialCode(e164: string | null | undefined): string {
  const d = (e164 ?? "").replace(/\D/g, "");
  if (!d) return "";
  if (d[0] === "1" || d[0] === "7") return d[0];
  if (TWO_DIGIT.has(d.slice(0, 2))) return d.slice(0, 2);
  return d.slice(0, 3);
}

// Countries whose numbers keep the leading 0 after the country code (Italy).
const KEEPS_ZERO = new Set(["39"]);

/**
 * Dialed input → E.164, using the caller-ID's country when no code is given:
 * "07418 612133" from a UK number → "+447418612133", "8578557855" from a US
 * number → "+18578557855". Also drops the domestic trunk 0 typed after the
 * country code ("+44 07418…" → "+447418…").
 */
export function dialToE164(input: string, callerE164: string | null): string {
  let raw = input.replace(/[^\d+]/g, "");
  if (raw.startsWith("00")) raw = `+${raw.slice(2)}`;
  if (raw.startsWith("+")) {
    const cc = dialCode(raw);
    const rest = raw.slice(1 + cc.length);
    // "+1" prefilled, then "1 385 513 0953" typed → one leading 1 too many
    // (NANP area codes never start with 1).
    if (cc === "1" && rest.length === 11 && rest.startsWith("1")) return `+${rest}`;
    return cc && rest.startsWith("0") && !KEEPS_ZERO.has(cc) ? `+${cc}${rest.slice(1)}` : raw;
  }
  const cc = dialCode(callerE164) || "1";
  if (cc === "1") {
    if (raw.length === 11 && raw.startsWith("1")) return `+${raw}`;
    return raw.length === 10 ? `+1${raw}` : `+${raw}`;
  }
  if (raw.startsWith("0")) return KEEPS_ZERO.has(cc) ? `+${cc}${raw}` : `+${cc}${raw.slice(1)}`;
  // No trunk 0 → already international digits (e.g. a call-back to "17657927337").
  return `+${raw}`;
}
