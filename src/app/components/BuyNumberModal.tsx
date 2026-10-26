import { useState, useEffect, useCallback, useMemo } from "react";
import { X, ChevronDown, Check, Search, Loader2, Wallet } from "lucide-react";
import { NUMBER_RENTAL } from "../core/plans";
import { DIAL_CODES, flagOf } from "../core/countries";
import { apiNumberCountries } from "../services/api";
import type { AvailableNumber, NumberLineType } from "../store/AppStore";

const C = {
  bg: "var(--dg-bg)", card: "var(--dg-card)", input: "var(--dg-input)", line: "var(--dg-line)",
  blue: "#7c5cff", purple: "#9b6ff7", green: "#22c55e", amber: "#f59e0b",
  text: "var(--dg-text)", muted: "var(--dg-muted)", red: "#ef4444",
};

const FALLBACK_PRICE = NUMBER_RENTAL.local;

type NumType = NumberLineType;

interface Country { iso: string; flag: string; name: string; code: string; types: NumType[] }

const toCountry = (c: { iso: string; name: string; types: NumType[] }): Country =>
  ({ iso: c.iso, name: c.name, types: c.types, flag: flagOf(c.iso), code: `+${DIAL_CODES[c.iso] ?? ""}` });

// Shown until Telnyx's full coverage list loads (or if it can't be reached).
const FALLBACK_COUNTRIES: Country[] = ([
  { iso: "US", name: "United States", types: ["local", "toll_free"] },
  { iso: "GB", name: "United Kingdom", types: ["local", "mobile", "national", "toll_free"] },
  { iso: "CA", name: "Canada", types: ["local", "toll_free"] },
  { iso: "AU", name: "Australia", types: ["local", "mobile", "toll_free"] },
] as Array<{ iso: string; name: string; types: NumType[] }>).map(toCountry);

// Most-used countries first, then the rest A–Z.
const PINNED = ["US", "GB", "CA", "AU"];
const sortCountries = (list: Country[]) => [
  ...PINNED.map((iso) => list.find((c) => c.iso === iso)).filter((c): c is Country => !!c),
  ...list.filter((c) => !PINNED.includes(c.iso)),
];

const PAGE = 20;      // numbers per "load more"
const MAX_LIST = 500; // Telnyx's search cap

const TYPE_INFO: Record<NumType, { title: string; sub: string; note: string }> = {
  local: { title: "Local", sub: "City number", note: "Geographic number for calls. On local numbers SMS works only in the US & Canada — elsewhere choose Mobile to send texts." },
  mobile: { title: "Mobile", sub: "Calls + SMS", note: "Mobile number that supports both calls and SMS." },
  national: { title: "National", sub: "Country-wide", note: "Non-geographic national number for calls, reachable from anywhere in the country." },
  toll_free: { title: "Toll-free", sub: "Free to call", note: "Free for callers to dial — incoming calls are billed to you at the carrier rate + 150%." },
};

interface Props {
  onClose: () => void;
  onSearch: (countryIso: string, type: NumType, areaCode?: string, limit?: number) => Promise<AvailableNumber[]>;
  walletBalance: number;
  onBuyNumber: (n: AvailableNumber) => Promise<void> | void;
  onTopUp: () => void;
  desktop?: boolean;
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 0.4, padding: "2px 7px", borderRadius: 6,
      background: "rgba(124,92,255,0.14)", color: C.blue, textTransform: "uppercase",
    }}>{label}</span>
  );
}

function TypeBtn({ active, onClick, title, sub }: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "11px 12px", borderRadius: 14, cursor: "pointer", textAlign: "left",
      background: active ? "rgba(124,92,255,0.12)" : C.input,
      border: `1.5px solid ${active ? C.blue : "rgba(255,255,255,0.07)"}`,
      fontFamily: "'Inter',sans-serif",
    }}>
      <p style={{ color: active ? C.text : C.muted, fontSize: 14, fontWeight: 700 }}>{title}</p>
      <p style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{sub}</p>
    </button>
  );
}

export function BuyNumberModal({ onClose, onSearch, walletBalance, onBuyNumber, onTopUp, desktop = false }: Props) {
  const [countries, setCountries] = useState<Country[]>(FALLBACK_COUNTRIES);
  const [country, setCountry] = useState<Country>(FALLBACK_COUNTRIES[0]);
  const [cDrop, setCDrop] = useState(false);
  const [cQuery, setCQuery] = useState("");
  const [numType, setNumType] = useState<NumType>("local");
  const [areaCode, setAreaCode] = useState("");
  const [results, setResults] = useState<AvailableNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [more, setMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"pick" | "pay">("pick");
  const [busy, setBusy] = useState(false);

  // Every country Telnyx sells numbers in (server-cached coverage list).
  useEffect(() => {
    let live = true;
    apiNumberCountries()
      .then(({ countries: list }) => {
        if (!live || !list?.length) return;
        const all = sortCountries(list.map(toCountry));
        setCountries(all);
        setCountry((cur) => all.find((c) => c.iso === cur.iso) ?? all[0]);
      })
      .catch(() => { /* keep the fallback list */ });
    return () => { live = false; };
  }, []);

  const pickCountry = (c: Country) => {
    setCountry(c); setCDrop(false); setCQuery(""); setAreaCode("");
    if (!c.types.includes(numType)) setNumType(c.types[0] ?? "local");
  };

  const load = useCallback(async (iso: string, type: NumType, ac: string) => {
    setLoading(true); setSelected(null); setLimit(PAGE); setMore(false);
    const r = await onSearch(iso, type, ac, PAGE);
    setResults(r); setMore(r.length >= PAGE); setLoading(false); setSearched(true);
  }, [onSearch]);

  // Telnyx has no paging: ask again for a bigger list and append what's new.
  const loadMore = async () => {
    const next = Math.min(MAX_LIST, limit + PAGE);
    setLoadingMore(true);
    const r = await onSearch(country.iso, numType, areaCode, next);
    setResults((prev) => {
      const seen = new Set(prev.map((n) => n.e164));
      return [...prev, ...r.filter((n) => !seen.has(n.e164))];
    });
    setLimit(next);
    setMore(r.length >= next && next < MAX_LIST);
    setLoadingMore(false);
  };

  useEffect(() => {
    if (country.types.includes(numType)) load(country.iso, numType, areaCode);
    /* eslint-disable-next-line */
  }, [country.iso, numType]);

  const shownCountries = useMemo(() => {
    const q = cQuery.trim().toLowerCase();
    if (!q) return countries;
    const code = `+${q.replace(/^\+/, "")}`;
    return countries.filter((c) => c.name.toLowerCase().includes(q) || c.iso.toLowerCase() === q || c.code === code);
  }, [countries, cQuery]);

  const chosenNumber = results.find((n) => n.number === selected) ?? null;
  const numPrice = chosenNumber?.price ?? FALLBACK_PRICE;
  // Today's charge: Telnyx's first charge (upfront/setup when higher) + markup.
  const dueNow = Math.max(numPrice, chosenNumber?.firstPrice ?? 0);
  const enough = walletBalance >= dueNow;

  const completeWallet = async () => {
    if (!chosenNumber) return;
    setBusy(true);
    await onBuyNumber(chosenNumber);
    setBusy(false);
    onClose();
  };

  const showAreaCode = numType === "local";

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: desktop ? "fixed" : "absolute", inset: 0, zIndex: 400,
        background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: desktop ? "center" : "flex-end",
        justifyContent: "center", padding: desktop ? "24px" : 0,
      }}
    >
      <div style={{
        width: desktop ? "min(560px, 96vw)" : "100%", background: C.card,
        borderRadius: desktop ? 22 : "26px 26px 0 0",
        border: `1px solid ${C.line}`,
        maxHeight: desktop ? "88vh" : "90%", overflowY: "auto",
        boxShadow: desktop ? "0 30px 90px rgba(0,0,0,0.65)" : "0 -12px 60px rgba(0,0,0,0.6)",
      }}>
        {!desktop && (
          <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 2px" }}>
            <div style={{ width: 38, height: 4, borderRadius: 2, background: C.line }} />
          </div>
        )}

        <div style={{
          padding: "14px 20px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 19, fontWeight: 800 }}>
              {step === "pay" ? "Confirm & Pay" : "Get a Number"}
            </h2>
            {step === "pick" && <p style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>Pick a number — pricing varies by country</p>}
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 11,
            background: C.input, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} color={C.muted} />
          </button>
        </div>

        {step === "pick" ? (
          <div style={{ padding: "20px 20px 28px" }}>
            {/* Country picker */}
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>
              Country <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({countries.length} available)</span>
            </p>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <button onClick={() => setCDrop((v) => !v)} style={{
                width: "100%", padding: "13px 16px",
                background: C.input, border: `1.5px solid ${cDrop ? C.blue : "rgba(255,255,255,0.07)"}`,
                borderRadius: 14, color: C.text, fontSize: 14,
                display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                fontFamily: "'Inter',sans-serif",
              }}>
                <span style={{ fontSize: 22 }}>{country.flag}</span>
                <span style={{ flex: 1, textAlign: "left", fontWeight: 500 }}>{country.name}</span>
                <span style={{ color: C.muted, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{country.code}</span>
                <ChevronDown size={15} color={C.muted} style={{ transform: cDrop ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {cDrop && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20,
                  background: C.card, border: `1px solid ${C.line}`,
                  borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.65)",
                }}>
                  <div style={{ padding: 8, borderBottom: `1px solid ${C.line}` }}>
                    <input
                      autoFocus
                      value={cQuery}
                      onChange={(e) => setCQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && shownCountries[0]) pickCountry(shownCountries[0]); }}
                      placeholder={`Search ${countries.length} countries or +code…`}
                      style={{
                        width: "100%", padding: "10px 12px", background: C.input,
                        border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10,
                        color: C.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif",
                      }}
                    />
                  </div>
                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    {shownCountries.length === 0 && (
                      <p style={{ padding: "14px 16px", color: C.muted, fontSize: 13 }}>No country matches “{cQuery}”.</p>
                    )}
                    {shownCountries.map((c, i) => (
                      <button key={c.iso} onClick={() => pickCountry(c)} style={{
                        width: "100%", padding: "12px 16px",
                        background: country.iso === c.iso ? "rgba(124,92,255,0.12)" : "transparent",
                        border: "none", cursor: "pointer",
                        borderBottom: i < shownCountries.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        display: "flex", alignItems: "center", gap: 10,
                        fontFamily: "'Inter',sans-serif",
                      }}>
                        <span style={{ fontSize: 20 }}>{c.flag}</span>
                        <span style={{ flex: 1, color: C.text, fontSize: 13, textAlign: "left", fontWeight: country.iso === c.iso ? 600 : 400 }}>{c.name}</span>
                        <span style={{ color: C.muted, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Number type — only the types Telnyx sells in this country */}
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Number Type</p>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(Math.max(country.types.length, 1), 2)}, 1fr)`, gap: 8, marginBottom: 10 }}>
              {country.types.map((t) => (
                <TypeBtn key={t} active={numType === t} onClick={() => setNumType(t)} title={TYPE_INFO[t].title} sub={TYPE_INFO[t].sub} />
              ))}
            </div>
            <p style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.5, marginBottom: 18 }}>
              {numType === "local" && (country.iso === "US" || country.iso === "CA")
                ? "Geographic number for calls and SMS."
                : TYPE_INFO[numType].note}
            </p>

            {/* Area code */}
            {showAreaCode && (<>
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Area Code <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></p>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input
                value={areaCode}
                onChange={(e) => setAreaCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") load(country.iso, numType, areaCode); }}
                placeholder={country.iso === "US" || country.iso === "CA" ? "e.g. 628, 212, 310…" : "e.g. 20, 161…"}
                style={{
                  flex: 1, padding: "13px 16px",
                  background: C.input, border: "1.5px solid rgba(255,255,255,0.07)",
                  borderRadius: 14, color: C.text, fontSize: 14,
                  outline: "none", fontFamily: "'Inter',sans-serif",
                }}
              />
              <button onClick={() => load(country.iso, numType, areaCode)} disabled={loading} style={{
                padding: "0 16px", background: C.input, border: "1.5px solid rgba(255,255,255,0.07)",
                borderRadius: 14, color: C.text, cursor: loading ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 700, fontSize: 13,
              }}>
                <Search size={15} color={C.muted} /> Search
              </button>
            </div>
            </>)}

            {/* Available numbers */}
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>
              Available Numbers {results.length > 0 && !loading && <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({results.length})</span>}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8, minHeight: 80, maxHeight: 360, overflowY: "auto" }}>
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "26px 0", color: C.muted, fontSize: 13 }}>
                  <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Searching for numbers…
                </div>
              ) : results.length > 0 ? (<>
                {results.map((n) => {
                  const isSel = selected === n.number;
                  return (
                    <button key={n.e164} onClick={() => setSelected(isSel ? null : n.number)} style={{
                      width: "100%", padding: "14px 16px", flexShrink: 0,
                      background: isSel ? "rgba(124,92,255,0.1)" : C.input,
                      border: `1.5px solid ${isSel ? C.blue : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 14, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                      fontFamily: "'Inter',sans-serif", transition: "border-color 0.15s, background 0.15s",
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        border: isSel ? "none" : "2px solid rgba(255,255,255,0.2)",
                        background: isSel ? C.blue : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isSel && <Check size={12} color="#fff" strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ color: C.text, fontSize: 14, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.3 }}>{n.number}</span>
                        <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
                          {n.voice && <Tag label="Voice" />}
                          {n.sms && <Tag label="SMS" />}
                        </div>
                      </div>
                      <span style={{ display: "flex", alignItems: "baseline", gap: 1, color: C.text, fontSize: 13.5, fontWeight: 800 }}>
                        ${n.price.toFixed(2)}<span style={{ color: C.muted, fontSize: 10, fontWeight: 600 }}>/mo</span>
                      </span>
                    </button>
                  );
                })}
                {more && (
                  <button onClick={loadMore} disabled={loadingMore} style={{
                    width: "100%", padding: "12px", borderRadius: 14, flexShrink: 0,
                    background: "transparent", border: `1.5px dashed ${C.line}`,
                    color: C.text, fontSize: 13, fontWeight: 700, fontFamily: "'Inter',sans-serif",
                    cursor: loadingMore ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    {loadingMore
                      ? <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Loading more…</>
                      : "Load more numbers"}
                  </button>
                )}
              </>) : (
                <div style={{ textAlign: "center", padding: "26px 12px", color: C.muted, fontSize: 13 }}>
                  {searched
                    ? `No ${TYPE_INFO[numType].title.toLowerCase()} numbers available in ${country.name} right now. ${country.types.length > 1 ? "Try another number type or a different country." : "Try a different country."}`
                    : "Searching…"}
                </div>
              )}
            </div>

            {selected && (
              <div style={{ position: "sticky", bottom: 0, paddingTop: 12, background: C.card }}>
                <button
                  onClick={() => setStep("pay")}
                  style={{
                    width: "100%", padding: "13px", border: "none", borderRadius: 13,
                    background: `linear-gradient(135deg,${C.blue},${C.purple})`, color: "#fff",
                    fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif",
                    boxShadow: "0 6px 20px rgba(124,92,255,0.4)",
                  }}
                >
                  Continue · ${numPrice.toFixed(2)}/mo{dueNow > numPrice ? ` ($${dueNow.toFixed(2)} today)` : ""} →
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ---- PAY step ---- */
          <div style={{ padding: "20px 20px 32px" }}>
            <div style={{
              background: C.input, borderRadius: 18, padding: "18px 20px",
              border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <span style={{ fontSize: 34 }}>{country.flag}</span>
                <div>
                  <p style={{ color: C.text, fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.4 }}>{selected}</p>
                  <p style={{ color: C.muted, fontSize: 12.5, marginTop: 3 }}>{country.name} · {TYPE_INFO[numType].title}</p>
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  { k: "Number rental", v: `$${numPrice.toFixed(2)}/mo` },
                  ...(dueNow > numPrice ? [{ k: "First month + setup", v: `$${dueNow.toFixed(2)}` }] : []),
                  { k: "Usage", v: "Pay-as-you-go from wallet" },
                  { k: "Total today", v: `$${dueNow.toFixed(2)}` },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: C.muted, fontSize: 13 }}>{k}</span>
                    <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {country.iso !== "US" && country.iso !== "CA" && (
              <div style={{
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.32)",
                borderRadius: 14, padding: "12px 14px", marginBottom: 18,
              }}>
                <p style={{ color: C.text, fontSize: 12.5, fontWeight: 700 }}>Documents needed within 48 hours</p>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
                  {country.name} numbers usually need your ID and proof of address before the carrier switches them on.
                  Submit them in Trust center right after buying — if they aren't received within 48 hours the carrier
                  cancels the order and the payment is refunded to your wallet.
                </p>
              </div>
            )}

            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Pay with</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <div style={{
                flex: 1, padding: "12px 12px", borderRadius: 14, textAlign: "left",
                background: "rgba(124,92,255,0.12)",
                border: `1.5px solid ${C.blue}`,
                fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", gap: 10,
              }}>
                <Wallet size={18} color={C.blue} />
                <span>
                  <span style={{ display: "block", color: C.text, fontSize: 14, fontWeight: 700 }}>Wallet</span>
                  <span style={{ display: "block", color: C.muted, fontSize: 10.5, marginTop: 1 }}>Balance ${walletBalance.toFixed(2)}</span>
                </span>
              </div>
            </div>

            {!enough && (
              <p style={{ color: C.red, fontSize: 12, marginBottom: 10 }}>
                Not enough balance — top up ${(dueNow - walletBalance).toFixed(2)} more from the Wallet tab, then come back.
              </p>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep("pick")} style={{
                flex: 1, padding: "14px", background: C.input, border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, color: C.text, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Inter',sans-serif",
              }}>Back</button>
              {enough ? (
                <button
                  onClick={completeWallet}
                  disabled={busy}
                  style={{
                    flex: 2, padding: "14px", border: "none", borderRadius: 14, color: "#fff",
                    fontSize: 14, fontWeight: 800, fontFamily: "'Inter',sans-serif",
                    background: `linear-gradient(135deg,${C.blue},${C.purple})`,
                    cursor: busy ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 20px rgba(124,92,255,0.4)",
                    opacity: busy ? 0.7 : 1,
                  }}
                >
                  {busy ? "Processing…" : `Pay $${dueNow.toFixed(2)} from wallet`}
                </button>
              ) : (
                <button
                  onClick={() => { onClose(); onTopUp(); }}
                  style={{
                    flex: 2, padding: "14px", border: "none", borderRadius: 14, color: "#fff",
                    fontSize: 14, fontWeight: 800, fontFamily: "'Inter',sans-serif",
                    background: `linear-gradient(135deg,${C.blue},${C.purple})`,
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(124,92,255,0.4)",
                  }}
                >
                  Top up wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
