/** Flag emoji for an ISO 3166 alpha-2 code ("GB" → 🇬🇧). */
export function flagOf(iso: string): string {
  const s = String(iso || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(s)) return "🌐";
  return String.fromCodePoint(...[...s].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}
