import { useState } from "react";
import { Copy, Check } from "lucide-react";

/** Builds tel: / sms: links and a copy-paste HTML button for a website or email signature. */
export default function ClickLink({ mode = "call" }: { mode?: "call" | "sms" }) {
  const [num, setNum] = useState("");
  const [label, setLabel] = useState(mode === "sms" ? "Text us" : "Call us");
  const [msg, setMsg] = useState("Hi! I have a question about…");
  const [copied, setCopied] = useState("");

  const digits = num.replace(/[^\d+]/g, "");
  const e164 = digits.startsWith("+") ? digits : digits.length === 10 ? `+1${digits}` : digits ? `+${digits}` : "";
  const href = !e164 ? "" : mode === "sms" ? `sms:${e164}${msg ? `?&body=${encodeURIComponent(msg)}` : ""}` : `tel:${e164}`;
  const html = href
    ? `<a href="${href}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#7c5cff;color:#fff;font:600 15px/1 sans-serif;text-decoration:none">${label.replace(/</g, "&lt;")}</a>`
    : "";
  const copy = (t: string, k: string) => navigator.clipboard?.writeText(t).then(() => { setCopied(k); setTimeout(() => setCopied(""), 1500); });

  return (
    <div className="dg-tool">
      <div className="dg-tool-grid">
        <div>
          <div className="row"><label>Your business number</label><input className="dg-input" value={num} onChange={(e) => setNum(e.target.value)} placeholder="(212) 555-0142" inputMode="tel" /></div>
          <div className="row"><label>Button text</label><input className="dg-input" value={label} onChange={(e) => setLabel(e.target.value)} /></div>
          {mode === "sms" && <div className="row"><label>Pre-filled message (optional)</label><input className="dg-input" value={msg} onChange={(e) => setMsg(e.target.value)} /></div>}
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {!href ? (
            <div className="dg-result"><p className="dg-item-body">Enter a number to build your link.</p></div>
          ) : (
            <>
              <div className="dg-result" style={{ textAlign: "center" }}>
                <div className="dg-note" style={{ margin: "0 0 12px" }}>Preview</div>
                <span dangerouslySetInnerHTML={{ __html: html }} />
              </div>
              {[["Link", href, "l"], ["HTML button", html, "h"]].map(([t, v, k]) => (
                <div key={k}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label style={{ margin: 0 }}>{t}</label>
                    <button className="dg-btn dg-btn-ghost dg-btn-sm" onClick={() => copy(v, k)}>{copied === k ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}</button>
                  </div>
                  <div className="dg-code">{v}</div>
                </div>
              ))}
            </>
          )}
          <p className="dg-note" style={{ textAlign: "left" }}>
            {mode === "sms" ? "On phones, the link opens the texting app with your number and message filled in. On computers without a texting app, it may do nothing." : "On phones, tapping starts a call. On computers, it opens the default calling app (such as DIGIRINGO in your browser, once allowed)."}
          </p>
        </div>
      </div>
    </div>
  );
}
