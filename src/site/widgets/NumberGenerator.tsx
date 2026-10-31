import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import NumberSearch from "./NumberSearch";

const KEYPAD: Record<string, string> = {
  a: "2", b: "2", c: "2", d: "3", e: "3", f: "3", g: "4", h: "4", i: "4", j: "5", k: "5", l: "5",
  m: "6", n: "6", o: "6", p: "7", q: "7", r: "7", s: "7", t: "8", u: "8", v: "8", w: "9", x: "9", y: "9", z: "9",
};
const toDigits = (word: string) => [...word.toLowerCase()].map((c) => KEYPAD[c] ?? (/\d/.test(c) ? c : "")).join("");

/** NANP reserves 555-0100 through 555-0199 for fiction and testing — safe to publish anywhere. */
function fictional(area: string) {
  const a = /^\d{3}$/.test(area) ? area : String(200 + Math.floor(Math.random() * 700));
  return `(${a}) 555-01${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`;
}

/** Two jobs: turn a word into keypad digits (and search it live), or make safe fake numbers for mock-ups. */
export default function NumberGenerator() {
  const [word, setWord] = useState("");
  const [area, setArea] = useState("212");
  const [fakes, setFakes] = useState<string[]>(() => Array.from({ length: 6 }, () => fictional("212")));
  const digits = toDigits(word).slice(0, 7);
  // Search only once typing pauses, so each keystroke isn't a carrier lookup.
  const [query, setQuery] = useState("");
  useEffect(() => { const t = window.setTimeout(() => setQuery(digits), 700); return () => window.clearTimeout(t); }, [digits]);

  return (
    <div style={{ display: "grid", gap: 28 }}>
      <div className="dg-tool">
        <h3 className="dg-h3b">Turn a word into a phone number</h3>
        <p className="dg-item-body" style={{ marginBottom: 16 }}>Type a word (up to 7 letters) and we'll convert it to keypad digits, then look for real numbers that contain them.</p>
        <div className="row" style={{ maxWidth: 420 }}>
          <input className="dg-input" placeholder="e.g. PLUMBER, CLEAN, TAXI" value={word} onChange={(e) => setWord(e.target.value.replace(/[^A-Za-z0-9]/g, ""))} aria-label="Word" />
        </div>
        {digits && <p className="dg-item-body"><b style={{ color: "var(--text)" }}>{word.toUpperCase()}</b> = <span className="dg-code" style={{ display: "inline", padding: "3px 8px" }}>{digits}</span></p>}
      </div>
      {query.length >= 3 && <NumberSearch key={query} title={`Real numbers containing ${query}`} contains={query} />}

      <div className="dg-tool">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <h3 className="dg-h3b" style={{ margin: 0 }}>Safe sample numbers for mock-ups</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <input className="dg-input" style={{ width: 110, height: 42 }} maxLength={3} value={area} onChange={(e) => setArea(e.target.value.replace(/\D/g, ""))} aria-label="Area code" />
            <button className="dg-btn dg-btn-ghost dg-btn-sm" onClick={() => setFakes(Array.from({ length: 6 }, () => fictional(area)))}><RefreshCw size={15} /> Generate</button>
          </div>
        </div>
        <div className="dg-numgrid" style={{ marginTop: 18 }}>
          {fakes.map((f, i) => <div key={i} className="dg-num"><b>{f}</b><small>Fictional — never rings anyone</small></div>)}
        </div>
        <p className="dg-note" style={{ textAlign: "left" }}>555-0100 to 555-0199 are set aside for films, ads and test data, so they're safe to print. They can't receive calls — for a real line, search above.</p>
      </div>
    </div>
  );
}
