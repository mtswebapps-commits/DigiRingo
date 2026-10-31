import { useEffect, useState } from "react";
import { flagOf } from "../lib/flags";
import { loadAllRates, money, type RateRow } from "./RatesTable";

interface CountryRates {
  iso: string;
  name: string;
  numbers: { type: string; monthly: number; firstCharge: number; incomingPerMin: number | null }[];
  callsTo: { landlinePerMin: number; mobilePerMin: number };
  smsTo: number | null;
  outbound: { callsPerMin: number; smsPerMsg: number };
}

const TYPE_LABEL: Record<string, string> = {
  local: "Local number", mobile: "Mobile number", national: "National number", toll_free: "Toll-free number", shared_cost: "Shared-cost number",
};
const PINNED = ["US", "CA", "GB", "AU"];

/** Number prices + call/text rates for one country, with a country picker. */
export default function CountryRatesWidget({ iso: initial = "US", picker = true }: { iso?: string; picker?: boolean }) {
  const [iso, setIso] = useState(String(initial).toUpperCase());
  const [list, setList] = useState<RateRow[]>([]);
  const [rates, setRates] = useState<CountryRates | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => { if (picker) loadAllRates().then(setList); }, [picker]);
  useEffect(() => { setIso(String(initial).toUpperCase()); }, [initial]);

  useEffect(() => {
    let live = true;
    setRates(null); setErr("");
    fetch(`/api/rates/country?iso=${iso}`)
      .then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || "No rates for that country"); return j; })
      .then((j) => live && setRates(j))
      .catch((e) => live && setErr(e.message));
    return () => { live = false; };
  }, [iso]);

  const ordered = [
    ...PINNED.map((p) => list.find((c) => c.iso === p)).filter((c): c is RateRow => !!c),
    ...list.filter((c) => !PINNED.includes(c.iso)),
  ];

  return (
    <div className="dg-tool">
      {picker && (
        <div className="row" style={{ maxWidth: 420 }}>
          <label htmlFor="cr-country">Country</label>
          <select id="cr-country" className="dg-input" value={iso} onChange={(e) => setIso(e.target.value)}>
            {!ordered.some((c) => c.iso === iso) && <option value={iso}>{flagOf(iso)} {iso}</option>}
            {ordered.map((c) => <option key={c.iso} value={c.iso}>{flagOf(c.iso)} {c.name}</option>)}
          </select>
        </div>
      )}
      {err ? (
        <p className="dg-item-body">{err}</p>
      ) : !rates ? (
        <div className="dg-widget-loading" style={{ minHeight: 200 }} />
      ) : (
        <div className="dg-grid dg-grid-2" style={{ marginTop: 8 }}>
          <div className="dg-result">
            <h4 className="dg-item-title">{flagOf(rates.iso)} Numbers in {rates.name}</h4>
            {rates.numbers.length === 0 ? (
              <p className="dg-item-body">We can't sell numbers in {rates.name} right now — you can still call and text it from any of your numbers.</p>
            ) : (
              <table className="dg-table" style={{ minWidth: 0 }}>
                <tbody>
                  {rates.numbers.map((n) => (
                    <tr key={n.type}>
                      <th scope="row">{TYPE_LABEL[n.type] ?? n.type}</th>
                      <td>
                        {money(n.monthly, 2)}/mo
                        {n.firstCharge > n.monthly && <div className="dg-note" style={{ textAlign: "left", margin: 0 }}>First payment {money(n.firstCharge, 2)}</div>}
                        {n.incomingPerMin != null && <div className="dg-note" style={{ textAlign: "left", margin: 0 }}>Incoming {money(n.incomingPerMin)}/min</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="dg-result">
            <h4 className="dg-item-title">Calling & texting {rates.name}</h4>
            <table className="dg-table" style={{ minWidth: 0 }}>
              <tbody>
                <tr><th scope="row">Calls to landlines</th><td>{money(rates.callsTo.landlinePerMin)}/min</td></tr>
                <tr><th scope="row">Calls to mobiles</th><td>{money(rates.callsTo.mobilePerMin)}/min</td></tr>
                <tr><th scope="row">Texts</th><td>{rates.smsTo == null ? "Not available" : `${money(rates.smsTo)}/msg`}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <p className="dg-note" style={{ textAlign: "left" }}>Prices in USD, drawn from your prepaid wallet. Calls are billed per minute; the app shows the rate before you dial.</p>
    </div>
  );
}
