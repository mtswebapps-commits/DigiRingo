import { useState, useEffect, useCallback } from "react";
import { X, ChevronDown, Check, Search, Loader2, Wallet } from "lucide-react";
import { NUMBER_RENTAL } from "../core/plans";

const C = {
  bg: "var(--dg-bg)", card: "var(--dg-card)", input: "var(--dg-input)", line: "var(--dg-line)",
  blue: "#7c5cff", purple: "#9b6ff7", green: "#22c55e", amber: "#f59e0b",
  text: "var(--dg-text)", muted: "var(--dg-muted)", red: "#ef4444",
};

const FALLBACK_PRICE = NUMBER_RENTAL.local;

const COUNTRIES = [
  { iso:"US", flag:"🇺🇸", name:"United States", code:"+1"  },
  { iso:"GB", flag:"🇬🇧", name:"United Kingdom",code:"+44" },
  { iso:"DE", flag:"🇩🇪", name:"Germany",       code:"+49" },
  { iso:"FR", flag:"🇫🇷", name:"France",        code:"+33" },
  { iso:"CA", flag:"🇨🇦", name:"Canada",        code:"+1"  },
  { iso:"JP", flag:"🇯🇵", name:"Japan",         code:"+81" },
  { iso:"AU", flag:"🇦🇺", name:"Australia",     code:"+61" },
  { iso:"BR", flag:"🇧🇷", name:"Brazil",        code:"+55" },
];

export interface AvailableNumber { e164: string; number: string; price: number; sms: boolean; voice: boolean; }

type NumType = "local" | "mobile";

interface Props {
  onClose: () => void;
  onSearch: (countryIso: string, type: NumType, areaCode?: string) => Promise<AvailableNumber[]>;
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
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [cDrop, setCDrop] = useState(false);
  const [numType, setNumType] = useState<NumType>("local");
  const [areaCode, setAreaCode] = useState("");
  const [results, setResults] = useState<AvailableNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"pick" | "pay">("pick");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (iso: string, type: NumType, ac: string) => {
    setLoading(true); setSelected(null);
    const r = await onSearch(iso, type, ac);
    setResults(r); setLoading(false); setSearched(true);
  }, [onSearch]);

  useEffect(() => { load(country.iso, numType, areaCode); /* eslint-disable-next-line */ }, [country.iso, numType]);

  const chosenNumber = results.find((n) => n.number === selected) ?? null;
  const numPrice = chosenNumber?.price ?? FALLBACK_PRICE;
  const enough = walletBalance >= numPrice;

  const completeWallet = async () => {
    if (!chosenNumber) return;
    setBusy(true);
    await onBuyNumber(chosenNumber);
    setBusy(false);
    onClose();
  };

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
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Country</p>
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
                  {COUNTRIES.map((c, i) => (
                    <button key={c.iso} onClick={() => { setCountry(c); setCDrop(false); }} style={{
                      width: "100%", padding: "12px 16px",
                      background: country.iso === c.iso ? "rgba(124,92,255,0.12)" : "transparent",
                      border: "none", cursor: "pointer",
                      borderBottom: i < COUNTRIES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      display: "flex", alignItems: "center", gap: 10,
                      fontFamily: "'Inter',sans-serif",
                    }}>
                      <span style={{ fontSize: 20 }}>{c.flag}</span>
                      <span style={{ flex: 1, color: C.text, fontSize: 13, textAlign: "left", fontWeight: country.iso === c.iso ? 600 : 400 }}>{c.name}</span>
                      <span style={{ color: C.muted, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Number type */}
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Number Type</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <TypeBtn active={numType === "local"} onClick={() => setNumType("local")} title="Local" sub="Calls · cheaper" />
              <TypeBtn active={numType === "mobile"} onClick={() => setNumType("mobile")} title="Mobile" sub="Calls + SMS" />
            </div>
            <p style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.5, marginBottom: 18 }}>
              {numType === "local"
                ? "Geographic number for calls. On local numbers SMS works only in the US & Canada — elsewhere choose Mobile to send texts."
                : "Mobile number that supports both calls and SMS in every country."}
            </p>

            {/* Area code */}
            {numType === "local" && (<>
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Area Code <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></p>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input
                value={areaCode}
                onChange={(e) => setAreaCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") load(country.iso, numType, areaCode); }}
                placeholder="e.g. 628, 212, 310…"
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
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>Available Numbers</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8, minHeight: 80 }}>
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "26px 0", color: C.muted, fontSize: 13 }}>
                  <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Searching for numbers…
                </div>
              ) : results.length > 0 ? (
                results.map((n) => {
                  const isSel = selected === n.number;
                  return (
                    <button key={n.e164} onClick={() => setSelected(isSel ? null : n.number)} style={{
                      width: "100%", padding: "14px 16px",
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
                })
              ) : (
                <div style={{ textAlign: "center", padding: "26px 12px", color: C.muted, fontSize: 13 }}>
                  {searched
                    ? `No ${numType} numbers available for ${country.name}. Try ${numType === "local" ? "Mobile" : "Local"}, or a different country.`
                    : "Searching…"}
                </div>
              )}
            </div>

            {selected && (
              <button
                onClick={() => setStep("pay")}
                style={{
                  width: "100%", padding: "13px", border: "none", borderRadius: 13,
                  background: `linear-gradient(135deg,${C.blue},${C.purple})`, color: "#fff",
                  fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif",
                  boxShadow: "0 6px 20px rgba(124,92,255,0.4)",
                }}
              >
                Continue · ${numPrice.toFixed(2)}/mo →
              </button>
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
                  <p style={{ color: C.muted, fontSize: 12.5, marginTop: 3 }}>{country.name}</p>
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  { k: "Number rental", v: `$${numPrice.toFixed(2)}/mo` },
                  { k: "Usage", v: "Pay-as-you-go from wallet" },
                  { k: "Total today", v: `$${numPrice.toFixed(2)}` },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: C.muted, fontSize: 13 }}>{k}</span>
                    <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

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
                Not enough balance — top up ${(numPrice - walletBalance).toFixed(2)} more from the Wallet tab, then come back.
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
                  {busy ? "Processing…" : `Pay $${numPrice.toFixed(2)} from wallet`}
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
