import { useState } from "react";

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Slider({ label, value, onChange, min, max, step = 1, suffix = "" }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number; suffix?: string }) {
  return (
    <div className="row">
      <label style={{ display: "flex", justifyContent: "space-between" }}><span>{label}</span><b style={{ color: "var(--text)" }}>{value.toLocaleString()}{suffix}</b></label>
      <input className="dg-range" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
    </div>
  );
}

/**
 * Estimates the revenue behind unanswered calls. Every rate is a visible,
 * adjustable assumption — the defaults are examples, not industry statistics.
 */
export default function MissedCallCalculator() {
  const [calls, setCalls] = useState(200);
  const [missedPct, setMissedPct] = useState(25);
  const [newPct, setNewPct] = useState(40);
  const [closePct, setClosePct] = useState(50);
  const [value, setValue] = useState(300);
  const [recoverPct, setRecoverPct] = useState(60);

  const missed = Math.round(calls * missedPct / 100);
  const leads = Math.round(missed * newPct / 100);
  const lostCustomers = Math.round(leads * closePct / 100);
  const lost = lostCustomers * value;
  const recovered = Math.round(lost * recoverPct / 100);

  return (
    <div className="dg-tool">
      <div className="dg-tool-grid">
        <div>
          <Slider label="Calls you get per month" value={calls} onChange={setCalls} min={10} max={3000} step={10} />
          <Slider label="Share that go unanswered" value={missedPct} onChange={setMissedPct} min={1} max={80} suffix="%" />
          <Slider label="Of those, new potential customers" value={newPct} onChange={setNewPct} min={1} max={100} suffix="%" />
          <Slider label="How many you'd normally win" value={closePct} onChange={setClosePct} min={1} max={100} suffix="%" />
          <Slider label="Average value of a new customer ($)" value={value} onChange={setValue} min={10} max={10000} step={10} />
          <Slider label="Missed calls you could catch with forwarding + voicemail" value={recoverPct} onChange={setRecoverPct} min={0} max={100} suffix="%" />
        </div>
        <div>
          <div className="dg-table-wrap">
            <table className="dg-table" style={{ minWidth: 0 }}>
              <thead><tr><th></th><th>Per month</th><th>Per year</th></tr></thead>
              <tbody>
                <tr><th scope="row">Unanswered calls</th><td>{missed.toLocaleString()}</td><td>{(missed * 12).toLocaleString()}</td></tr>
                <tr><th scope="row">Potential customers among them</th><td>{leads.toLocaleString()}</td><td>{(leads * 12).toLocaleString()}</td></tr>
                <tr><th scope="row">Customers you'd likely have won</th><td>{lostCustomers.toLocaleString()}</td><td>{(lostCustomers * 12).toLocaleString()}</td></tr>
                <tr><th scope="row">Revenue at stake</th><td>{usd(lost)}</td><td>{usd(lost * 12)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="dg-result" style={{ marginTop: 18 }}>
            <div className="dg-note" style={{ textAlign: "left", margin: "0 0 6px" }}>Revenue you could win back each year</div>
            <div className="dg-big grad">{usd(recovered * 12)}</div>
            <p className="dg-item-body" style={{ marginTop: 8 }}>
              With every device ringing at once, unanswered calls forwarded to your cellphone and voicemail catching the rest.
            </p>
          </div>
          <p className="dg-note" style={{ textAlign: "left" }}>The starting values are examples. Use your own call history for a real estimate.</p>
        </div>
      </div>
    </div>
  );
}
