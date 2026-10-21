/**
 * Live rates fetched from /api/rates — Telnyx wholesale + markup, cached.
 * Falls back to the hardcoded values in plans.ts if the server is unreachable.
 */
import { USAGE_RATES as FALLBACK_USAGE, NUMBER_RENTAL as FALLBACK_RENTAL, type UsageRate } from "./plans";

interface ServerRates {
  markupPct: number;
  usage: Record<string, { wholesale: number; retail: number }>;
  numbers: Record<string, Record<string, { wholesale: number; retail: number }>>;
  cachedAt: string;
}

let _cached: ServerRates | null = null;
let _fetchPromise: Promise<void> | null = null;

const API = import.meta.env.VITE_API_BASE || "";

async function doFetch() {
  try {
    const r = await fetch(`${API}/api/rates`);
    if (r.ok) _cached = await r.json();
  } catch { /* keep fallback */ }
}

export function fetchRates(): Promise<void> {
  if (!_fetchPromise) _fetchPromise = doFetch();
  return _fetchPromise;
}

export function refetchRates(): Promise<void> {
  _fetchPromise = doFetch();
  return _fetchPromise;
}

export function liveUsageRates(): UsageRate[] {
  if (!_cached) return FALLBACK_USAGE;
  const labels: Record<string, { label: string; unit: string }> = {
    voice: { label: "Voice — in & out", unit: "/min" },
    sms_local: { label: "Local SMS", unit: "/msg" },
    sms_tollfree: { label: "Toll-free SMS", unit: "/msg" },
    sms_shortcode: { label: "Short-code SMS", unit: "/msg" },
    mms_out: { label: "MMS — outbound", unit: "/msg" },
    mms_in: { label: "MMS — inbound", unit: "/msg" },
  };
  return Object.entries(_cached.usage).map(([key, { retail }]) => ({
    key,
    label: labels[key]?.label ?? key,
    price: retail,
    unit: labels[key]?.unit ?? "/unit",
  }));
}

export function liveNumberRental(): { local: number; tollfree: number } {
  if (!_cached?.numbers) return FALLBACK_RENTAL;
  const us = _cached.numbers["US"];
  return {
    local: us?.["local"]?.retail ?? FALLBACK_RENTAL.local,
    tollfree: us?.["toll free"]?.retail ?? FALLBACK_RENTAL.tollfree,
  };
}

export function liveMarkupPct(): number {
  return _cached?.markupPct ?? 150;
}

export function liveRatesLoaded(): boolean {
  return _cached !== null;
}

export function rawRates(): ServerRates | null {
  return _cached;
}
