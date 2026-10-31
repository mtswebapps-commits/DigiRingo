import { useState } from "react";

const NUMBER = 2.5, MIN = 0.015, SMS = 0.015;
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n < 100 ? 2 : 0 });

function Field({ label, value, onChange, min, max, step = 1, prefix }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number; prefix?: string }) {
  return (
    <div className="row">
      <label>{label}</label>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input className="dg-range" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <input className="dg-input" style={{ width: 110, height: 42 }} type="number" min={min} max={max * 10} step={step} value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} aria-label={label} />
      </div>
      {prefix && <small className="dg-note" style={{ textAlign: "left", display: "block", margin: "4px 0 0" }}>{prefix}</small>}
    </div>
  );
}

/**
 * Compares what a team pays per user today with DIGIRINGO's usage pricing
 * (numbers + minutes + texts). Every assumption is an input the visitor sets.
 */
export default function VoipCalculator() {
  const [users, setUsers] = useState(5);
  const [perUser, setPerUser] = useState(25);
  const [minutes, setMinutes] = useState(400);
  const [texts, setTexts] = useState(200);

  const current = users * perUser;
  const ours = users * (NUMBER + minutes * MIN + texts * SMS);
  const save = current - ours;
  const pct = current > 0 ? Math.round((save / current) * 100) : 0;

  return (
    <div className="dg-tool">
      <div className="dg-tool-grid">
        <div>
          <Field label="People who need a business number" value={users} onChange={setUsers} min={1} max={100} />
          <Field label="What you pay per person per month today ($)" value={perUser} onChange={setPerUser} min={0} max={100} />
          <Field label="Call minutes per person per month (US & Canada)" value={minutes} onChange={setMinutes} min={0} max={3000} step={50} />
          <Field label="Texts per person per month (US & Canada)" value={texts} onChange={setTexts} min={0} max={3000} step={50} />
        </div>
        <div>
          <div className="dg-table-wrap">
            <table className="dg-table" style={{ minWidth: 0 }}>
              <thead><tr><th></th><th>Today</th><th>DIGIRINGO</th></tr></thead>
              <tbody>
                <tr><th scope="row">Per person / month</th><td>{usd(perUser)}</td><td>{usd(ours / users)}</td></tr>
                <tr><th scope="row">Team / month</th><td>{usd(current)}</td><td>{usd(ours)}</td></tr>
                <tr><th scope="row">Team / year</th><td>{usd(current * 12)}</td><td>{usd(ours * 12)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="dg-result" style={{ marginTop: 18 }}>
            <div className="dg-note" style={{ textAlign: "left", margin: "0 0 6px" }}>{save >= 0 ? "Estimated yearly savings" : "Estimated extra cost per year"}</div>
            <div className={`dg-big${save >= 0 ? " grad" : ""}`}>{usd(Math.abs(save * 12))}</div>
            {save >= 0 && current > 0 && <p className="dg-item-body" style={{ marginTop: 8 }}>About {pct}% less than you pay today.</p>}
            {save < 0 && <p className="dg-item-body" style={{ marginTop: 8 }}>At this much talk time a flat per-user plan may suit you better — usage pricing wins for lighter use.</p>}
          </div>
          <p className="dg-note" style={{ textAlign: "left" }}>
            DIGIRINGO estimate = one US local number ($2.50/mo) per person + calls at $0.015/min + texts at $0.015/msg. It leaves out taxes, one-time
            10DLC registration fees for texting and international usage (see the rate list). Your provider's real bill may include fees not shown here.
          </p>
        </div>
      </div>
    </div>
  );
}
