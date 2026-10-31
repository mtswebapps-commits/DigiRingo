import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "../router";
import { flagOf } from "../lib/flags";

export interface RateRow { iso: string; name: string; code: string; landlinePerMin: number; mobilePerMin: number; smsPerMsg: number | null }

let cached: Promise<RateRow[]> | null = null;
/** All countries' retail rates (shared by the rates list and the country pages). */
export function loadAllRates(): Promise<RateRow[]> {
  cached ??= fetch("/api/rates/countries")
    .then((r) => (r.ok ? r.json() : { countries: [] }))
    .then((j) => j.countries || [])
    .catch(() => { cached = null; return []; });
  return cached;
}

export const money = (n: number | null | undefined, d = 3) => (n == null ? "—" : `$${n.toFixed(d)}`);
const PAGE = 50;

/** Searchable, paginated list of per-country call and SMS rates. */
export default function RatesTable() {
  const [rows, setRows] = useState<RateRow[] | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => { loadAllRates().then(setRows); }, []);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase().replace(/^\+/, "");
    if (!rows) return [];
    if (!t) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(t) || r.iso.toLowerCase() === t || r.code.startsWith(t));
  }, [rows, q]);

  useEffect(() => setPage(0), [q]);
  const shown = list.slice(page * PAGE, page * PAGE + PAGE);

  return (
    <div className="dg-tool">
      <div className="dg-input-wrap" style={{ marginBottom: 20 }}>
        <Search className="ic" size={18} />
        <input className="dg-input" placeholder="Search a country or dialing code" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search countries" />
      </div>
      {rows === null ? (
        <div className="dg-widget-loading" />
      ) : rows.length === 0 ? (
        <p className="dg-item-body">Rates are being refreshed — please check again in a few minutes, or see the rate list inside the app.</p>
      ) : (
        <>
          <div className="dg-table-wrap">
            <table className="dg-table">
              <thead><tr><th>Country</th><th>Code</th><th>Calls to landlines</th><th>Calls to mobiles</th><th>Texts</th></tr></thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.iso}>
                    <th scope="row"><Link to={`/rates/${r.iso.toLowerCase()}`}>{flagOf(r.iso)} {r.name}</Link></th>
                    <td>+{r.code}</td>
                    <td>{money(r.landlinePerMin)}/min</td>
                    <td>{money(r.mobilePerMin)}/min</td>
                    <td>{r.smsPerMsg == null ? "—" : `${money(r.smsPerMsg)}/msg`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, gap: 12, flexWrap: "wrap" }}>
            <span className="dg-note" style={{ margin: 0 }}>{list.length} countries · rates per minute / per message in USD</span>
            {list.length > PAGE && (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="dg-btn dg-btn-ghost dg-btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                <button className="dg-btn dg-btn-ghost dg-btn-sm" disabled={(page + 1) * PAGE >= list.length} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
