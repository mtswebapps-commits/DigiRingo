/**
 * Retail pricing — applies a uniform markup to all Telnyx wholesale costs.
 *
 * The MARKUP_PCT is added on top of the Telnyx cost, so 150 means the customer
 * pays 2.5× what Telnyx charges (cost + 150% of cost).
 */
type Env = Record<string, string | undefined>;
const env: Env = (import.meta as unknown as { env: Env }).env ?? {};

export const MARKUP_PCT = Number(env.VITE_MARKUP_PCT ?? 150);

/** wholesale cost → retail price shown to the user (rounded to given decimals). */
export function retailPrice(wholesale: number, decimals = 2): number {
  const marked = wholesale * (1 + MARKUP_PCT / 100);
  return Math.round(marked * 10 ** decimals) / 10 ** decimals;
}
