import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "../router";

interface Num { e164: string; city: string | null; region: string | null }
type Kind = "US" | "CA" | "TF";

const fmt = (e164: string) => {
  const d = e164.replace(/\D/g, "").replace(/^1/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : e164;
};
const title = (s: string) => s.toLowerCase().replace(/\b[a-z]/g, (m) => m.toUpperCase());

/** Highlight the searched digits inside the formatted number. */
function Highlighted({ e164, digits }: { e164: string; digits: string }) {
  const text = fmt(e164);
  if (!digits) return <>{text}</>;
  // Map each digit in the formatted string back to its index so the match survives the punctuation.
  const idx: number[] = [];
  [...text].forEach((ch, i) => /\d/.test(ch) && idx.push(i));
  const plain = idx.map((i) => text[i]).join("");
  const at = plain.lastIndexOf(digits);
  if (at < 0) return <>{text}</>;
  const s = idx[at], e = idx[at + digits.length - 1] + 1;
  return <>{text.slice(0, s)}<mark>{text.slice(s, e)}</mark>{text.slice(e)}</>;
}

/**
 * Live number search for the marketing pages (US, Canada, toll-free). Results
 * come from /api/public/numbers; picking one sends the visitor to sign up.
 */
export default function NumberSearch(props: { npa?: string; kind?: Kind; nearby?: string; title?: string; contains?: string }) {
  const [kind, setKind] = useState<Kind>(props.kind ?? "US");
  const [npa, setNpa] = useState(props.npa ?? "");
  const [digits, setDigits] = useState(props.contains ?? "");
  const [nums, setNums] = useState<Num[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const req = useRef(0);

  const search = async (code = npa, k = kind) => {
    const id = ++req.current;
    setBusy(true); setErr("");
    const q = new URLSearchParams({ country: k === "CA" ? "CA" : "US", type: k === "TF" ? "toll_free" : "local" });
    if (code) q.set("npa", code);
    if (digits) q.set("contains", digits);
    try {
      const r = await fetch(`/api/public/numbers?${q}`);
      const j = await r.json().catch(() => ({}));
      if (id !== req.current) return;
      if (!r.ok) throw new Error(j.error || "Search failed");
      setNums(j.numbers || []);
    } catch (e) {
      if (id === req.current) { setErr((e as Error).message); setNums([]); }
    } finally {
      if (id === req.current) setBusy(false);
    }
  };

  // Show something straight away for pages that know their area code / prefix.
  useEffect(() => { search(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const nearby = (props.nearby || "").split(",").map((x) => x.trim()).filter(Boolean);

  return (
    <div className="dg-tool" id="choose-number">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
        <h3 className="dg-h3b" style={{ margin: 0 }}>{props.title ?? "Find your number"}</h3>
        <div className="dg-seg" role="tablist">
          {(["US", "CA", "TF"] as Kind[]).map((k) => (
            <button key={k} className={kind === k ? "on" : ""} onClick={() => { setKind(k); const c = k === "TF" ? "" : npa; if (k === "TF") setNpa(""); search(c, k); }}>
              {k === "US" ? "US numbers" : k === "CA" ? "Canada" : "Toll-free"}
            </button>
          ))}
        </div>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); search(); }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 22 }}
        className="dg-search-row"
      >
        <input className="dg-input" inputMode="numeric" maxLength={3} placeholder={kind === "TF" ? "Prefix (800, 888…)" : "Area code (e.g. 212)"} value={npa} onChange={(e) => setNpa(e.target.value.replace(/\D/g, ""))} aria-label="Area code" />
        <input className="dg-input" inputMode="numeric" maxLength={7} placeholder="Digits it should contain" value={digits} onChange={(e) => setDigits(e.target.value.replace(/\D/g, ""))} aria-label="Digits" />
        <button className="dg-btn dg-btn-primary" type="submit" disabled={busy} style={{ height: 50 }}><Search size={17} /> {busy ? "Searching…" : "Search"}</button>
      </form>

      {err && <p className="dg-item-body" style={{ marginBottom: 14 }}>{err}</p>}
      {nums === null ? (
        <div className="dg-widget-loading" style={{ minHeight: 160 }} />
      ) : nums.length === 0 ? (
        <div style={{ textAlign: "center", padding: "26px 10px" }}>
          <p className="dg-item-body">No numbers match right now. Try fewer digits or another area code.</p>
          {nearby.length > 0 && (
            <div className="dg-chips center" style={{ marginTop: 14 }}>
              {nearby.map((n) => <button key={n} className="dg-chip link" onClick={() => { setNpa(n); search(n); }}>{n}</button>)}
            </div>
          )}
        </div>
      ) : (
        <div className="dg-numgrid">
          {nums.map((n) => (
            <a key={n.e164} href="/app" className="dg-num" title="Sign up to claim this number">
              <b><Highlighted e164={n.e164} digits={digits} /></b>
              <small>{n.city ? `${title(n.city)}${n.region ? `, ${n.region}` : ""}` : kind === "TF" ? "Toll-free" : "Available"}</small>
            </a>
          ))}
        </div>
      )}
      <p className="dg-note" style={{ textAlign: "left" }}>
        Availability changes by the minute. Numbers are reserved when you buy them in the app — see <Link to="/pricing">pricing</Link>.
      </p>
    </div>
  );
}
