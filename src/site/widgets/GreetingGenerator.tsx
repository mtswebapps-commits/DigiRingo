import { useState } from "react";
import { Copy, Check } from "lucide-react";

type Tone = "friendly" | "professional" | "brief";

function voicemail(o: { biz: string; name: string; hours: string; site: string; callback: string; tone: Tone }) {
  const biz = o.biz || "our business";
  const who = o.name ? `${o.name} at ${biz}` : biz;
  const hours = o.hours ? ` Our hours are ${o.hours}.` : "";
  const site = o.site ? ` You can also find answers at ${o.site}.` : "";
  const cb = o.callback || "within one business day";
  return {
    friendly: [
      `Hi, you've reached ${who}! Sorry we missed you. Leave your name, number and a quick note about what you need, and we'll call you back ${cb}.${hours}${site}`,
      `Thanks for calling ${biz}! We're helping another customer right now. Leave a message after the tone and we'll get back to you ${cb}. Talk soon!`,
    ],
    professional: [
      `Thank you for calling ${who}. We're unable to take your call at the moment. Please leave your name, phone number and the reason for your call, and a member of our team will return it ${cb}.${hours}`,
      `You've reached ${biz}. Our team is currently unavailable.${hours} Please leave a detailed message and we'll respond ${cb}.${site}`,
    ],
    brief: [
      `${biz}. Leave your name and number — we'll call you back ${cb}.`,
      `You've reached ${who}. Please leave a message after the tone.`,
    ],
  }[o.tone];
}

function menu(o: { biz: string; hours: string; site: string; options: string; tone: Tone }) {
  const biz = o.biz || "our business";
  const opts = o.options.split(",").map((x) => x.trim()).filter(Boolean);
  const list = opts.map((x, i) => `For ${x}, press ${i + 1}.`).join(" ");
  const hours = o.hours ? ` Our hours are ${o.hours}.` : "";
  const site = o.site ? ` You can also visit ${o.site}.` : "";
  const open = o.tone === "friendly" ? `Hi, and thanks for calling ${biz}!` : o.tone === "brief" ? `${biz}.` : `Thank you for calling ${biz}.`;
  return [
    `${open} ${list} To hear these options again, press 9. To leave a message, press 0.`,
    `${open}${hours} ${list} To leave a message for our team, stay on the line.${site}`,
    `${open} We're closed right now.${hours} ${opts.length ? `If this is about ${opts[0]}, ` : ""}please leave a message after the tone and we'll call you back the next business day.`,
  ];
}

/** Writes voicemail greetings or phone-menu scripts from a few details. */
export default function GreetingGenerator({ mode = "voicemail" }: { mode?: "voicemail" | "menu" }) {
  const [biz, setBiz] = useState("");
  const [name, setName] = useState("");
  const [hours, setHours] = useState("Monday to Friday, 9 a.m. to 5 p.m.");
  const [site, setSite] = useState("");
  const [callback, setCallback] = useState("within one business day");
  const [options, setOptions] = useState("sales, support, billing");
  const [tone, setTone] = useState<Tone>("friendly");
  const [copied, setCopied] = useState(-1);

  const scripts = mode === "menu" ? menu({ biz, hours, site, options, tone }) : voicemail({ biz, name, hours, site, callback, tone });
  const copy = (t: string, i: number) => { navigator.clipboard?.writeText(t).then(() => { setCopied(i); setTimeout(() => setCopied(-1), 1500); }); };

  return (
    <div className="dg-tool">
      <div className="dg-tool-grid">
        <div>
          <div className="row"><label>Business name</label><input className="dg-input" value={biz} onChange={(e) => setBiz(e.target.value)} placeholder="Acme Plumbing" /></div>
          {mode === "voicemail" && <div className="row"><label>Your name (optional)</label><input className="dg-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sam" /></div>}
          {mode === "menu" && <div className="row"><label>Menu options (comma-separated)</label><input className="dg-input" value={options} onChange={(e) => setOptions(e.target.value)} /></div>}
          <div className="row"><label>Opening hours</label><input className="dg-input" value={hours} onChange={(e) => setHours(e.target.value)} /></div>
          <div className="row"><label>Website (optional)</label><input className="dg-input" value={site} onChange={(e) => setSite(e.target.value)} placeholder="acmeplumbing.com" /></div>
          {mode === "voicemail" && <div className="row"><label>When you'll call back</label><input className="dg-input" value={callback} onChange={(e) => setCallback(e.target.value)} /></div>}
          <div className="row">
            <label>Tone</label>
            <div className="dg-seg">
              {(["friendly", "professional", "brief"] as Tone[]).map((t) => <button key={t} className={tone === t ? "on" : ""} onClick={() => setTone(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {scripts.map((s, i) => (
            <div key={i} className="dg-result">
              <p className="dg-item-body" style={{ color: "var(--text)", fontSize: 16 }}>{s}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <span className="dg-note" style={{ margin: 0 }}>{s.split(/\s+/).length} words · about {Math.max(5, Math.round(s.split(/\s+/).length / 2.5))} seconds</span>
                <button className="dg-btn dg-btn-ghost dg-btn-sm" onClick={() => copy(s, i)}>{copied === i ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
