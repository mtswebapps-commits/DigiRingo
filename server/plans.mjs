/**
 * DIGIRINGO plan catalog — SERVER SIDE (authoritative pricing).
 *
 * Mirrors src/app/core/plans.ts. The backend NEVER trusts a price sent by the
 * client: it looks the amount up here. Keep the two files in sync.
 */

/** Markup applied to all Telnyx wholesale costs (150% = customer pays 2.5× cost). */
export const MARKUP_PCT = Number(process.env.MARKUP_PCT ?? 150);
const markup = (cost, decimals = 3) => Math.round(cost * (1 + MARKUP_PCT / 100) * 10 ** decimals) / 10 ** decimals;

/** Flat monthly rental — Telnyx wholesale + markup. */
export const NUMBER_RENTAL = { local: markup(1.0, 2), tollfree: markup(2.0, 2) };

export const PAYG_RELOAD = 3.99;

export const OVERFLOW_RATES = { voice: markup(0.006), sms: markup(0.006) };

// Each bundle includes ONE free number and allows a capped number of extra
// numbers (billed at NUMBER_RENTAL) that all share the plan's minute/SMS pool.
export const BUNDLES = {
  starter: { id: "starter", name: "Starter", monthly: 9.99, annualTotal: 99, numberType: "local", minutes: 300, sms: 300, numbersIncluded: 0, maxNumbers: 3 },
  business: { id: "business", name: "Business", monthly: 24.99, annualTotal: 249, numberType: "local", minutes: 1000, sms: 1000, numbersIncluded: 0, maxNumbers: 5 },
  pro: { id: "pro", name: "Pro", monthly: 49.99, annualTotal: 499, numberType: "tollfree", minutes: 3000, sms: 3000, numbersIncluded: 0, maxNumbers: 10 },
};

/** Look up a bundle by tier id. Returns the bundle or null. */
export function bundleFor(tier) {
  return BUNDLES[String(tier)] || null;
}

/** Authoritative flat rental price for a number kind. Returns null if unknown. */
export function numberPrice(kind) {
  const p = NUMBER_RENTAL[String(kind)];
  return p > 0 ? p : null;
}

/** Authoritative bundle price for a tier + cycle. Returns { amount, bundle } or null. */
export function bundleCharge(tier, cycle) {
  const b = BUNDLES[String(tier)];
  if (!b) return null;
  const amount = cycle === "annual" ? b.annualTotal : b.monthly;
  return { amount, bundle: b, cycle: cycle === "annual" ? "annual" : "monthly" };
}
