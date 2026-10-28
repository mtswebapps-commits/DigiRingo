import { useEffect, useState } from "react";
import { Phone, DollarSign, Loader2 } from "lucide-react";
import { C, font, radius } from "../core/theme";
import { flagOf } from "../core/countries";
import { apiCountryRates, apiNumberCountries, type ApiCountryRates, type ApiNumberCountry } from "../services/api";

const TYPE_LABEL: Record<string, string> = {
  local: "Local number", mobile: "Mobile number", national: "National number",
  toll_free: "Toll-free number", shared_cost: "Shared-cost number",
};
const PINNED = ["US", "GB", "CA", "AU"];

/**
 * Rate list for one country at a time: what its numbers cost and what calls
 * and texts cost. Prices come from /api/rates/country (carrier cost + markup).
 */
export function CountryRates({ desktop = false }: { desktop?: boolean }) {
  const [countries, setCountries] = useState<ApiNumberCountry[]>([{ iso: "US", name: "United States", types: ["local", "toll_free"] }]);
  const [iso, setIso] = useState("US");
  const [rates, setRates] = useState<ApiCountryRates | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiNumberCountries().then(({ countries: list }) => {
      if (!list?.length) return;
      setCountries([
        ...PINNED.map((p) => list.find((c) => c.iso === p)).filter((c): c is ApiNumberCountry => !!c),
        ...list.filter((c) => !PINNED.includes(c.iso)),
      ]);
    }).catch(() => { /* keep US */ });
  }, []);

  useEffect(() => {
    let live = true;
    setRates(null); setError("");
    apiCountryRates(iso)
      .then((r) => { if (live) setRates(r); })
      .catch((e) => { if (live) setError(e instanceof Error ? e.message : "Couldn't load rates"); });
    return () => { live = false; };
  }, [iso]);

  const card = { background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, padding: 18 };
  const row = (i: number) => ({
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
    padding: "11px 0", borderTop: i > 0 ? `1px solid ${C.lineSoft}` : "none",
  });
  const price = (v: number, unit: string, decimals = 2) => (
    <span style={{ color: C.text, fontSize: 13.5, fontWeight: 800, fontFamily: font.mono, whiteSpace: "nowrap" }}>
      ${v.toFixed(decimals)}<span style={{ color: C.muted, fontSize: 11, fontWeight: 600 }}>{unit}</span>
    </span>
  );
  const head = (icon: JSX.Element, title: string, sub?: string) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{icon}<span style={{ color: C.text, fontSize: 15, fontWeight: 800 }}>{title}</span></div>
      {sub && <p style={{ color: C.muted, fontSize: 12, marginTop: 4, lineHeight: 1.45 }}>{sub}</p>}
    </div>
  );
  const name = countries.find((c) => c.iso === iso)?.name || rates?.name || iso;
  const o = rates?.outbound;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={card}>
        <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>Country</label>
        <select value={iso} onChange={(e) => setIso(e.target.value)} style={{
          width: "100%", marginTop: 8, padding: "12px 14px", background: C.input, color: C.text,
          border: "1.5px solid rgba(255,255,255,0.07)", borderRadius: radius.md, fontSize: 14, fontFamily: font.sans, cursor: "pointer",
        }}>
          {countries.map((c) => <option key={c.iso} value={c.iso}>{`${flagOf(c.iso)}  ${c.name}`}</option>)}
        </select>
      </div>

      {error && <div style={{ ...card, color: C.muted, fontSize: 13 }}>{error}</div>}
      {!rates && !error && (
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 10, color: C.muted, fontSize: 13 }}>
          <Loader2 size={16} className="dg-spin" /> Loading {name} rates…
        </div>
      )}

      {rates && o && (
        <div style={{ display: "grid", gridTemplateColumns: desktop ? "1fr 1fr" : "1fr", gap: 16, alignItems: "start" }}>
          <div style={card}>
            {head(<Phone size={16} color={C.blue} />, `${flagOf(rates.iso)} ${name} numbers`, "Monthly rental per number. The first month is charged when you buy it.")}
            {rates.numbers.length === 0 && <p style={{ color: C.muted, fontSize: 13 }}>No numbers on sale in {name} right now.</p>}
            {rates.numbers.map((n, i) => (
              <div key={n.type} style={{ ...row(i), alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: C.text, fontSize: 13.5, fontWeight: 600 }}>{TYPE_LABEL[n.type] || n.type}</p>
                  {n.firstCharge > n.monthly && <p style={{ color: C.muted, fontSize: 11.5, marginTop: 3 }}>First payment ${n.firstCharge.toFixed(2)}</p>}
                  {n.incomingPerMin != null && <p style={{ color: C.muted, fontSize: 11.5, marginTop: 3 }}>Incoming calls ${n.incomingPerMin.toFixed(3)}/min</p>}
                </div>
                {price(n.monthly, "/mo")}
              </div>
            ))}
          </div>

          <div style={card}>
            {head(<DollarSign size={16} color={C.green} />, "Calls & texts", "Charged per use from your wallet. Rates for calls and texts to US & Canada numbers.")}
            <div style={row(0)}><span style={{ color: C.text, fontSize: 13 }}>Outgoing calls</span>{price(o.callsPerMin, "/min", 3)}</div>
            <div style={row(1)}><span style={{ color: C.text, fontSize: 13 }}>SMS</span>{price(o.smsPerMsg, "/msg", 3)}</div>
            <div style={row(2)}><span style={{ color: C.text, fontSize: 13 }}>SMS from a toll-free number</span>{price(o.tollFreeSmsPerMsg, "/msg", 3)}</div>
            <div style={row(3)}><span style={{ color: C.text, fontSize: 13 }}>MMS (picture message)</span>{price(o.mmsPerMsg, "/msg", 3)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
