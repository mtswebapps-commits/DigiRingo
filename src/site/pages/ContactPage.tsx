import { useState, type FormEvent } from "react";
import { Send, Check } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { Icon } from "../components/Icon";
import { Link } from "../router";
import { usePageMeta } from "../lib/seo";
import type { IconName } from "../content/types";

const CARDS: { icon: IconName; title: string; body: string; href: string; cta: string }[] = [
  { icon: "dollar", title: "Talk to us about your setup", body: "Several numbers, other countries or a team? We'll help you plan it.", href: "/sales", cta: "Contact sales" },
  { icon: "message", title: "Customer support", body: "Already a customer? Live chat inside the app is the fastest way to reach us.", href: "/app", cta: "Open the app" },
  { icon: "send", title: "Email", body: "support@digiringo.com — we reply within one business day.", href: "mailto:support@digiringo.com", cta: "Send an email" },
  { icon: "code", title: "Developers", body: "Routing calls to your own webhook or SIP agent? Start with the developer page.", href: "/developers", cta: "Developer info" },
  { icon: "file", title: "Press", body: "Logos, boilerplate and quick facts about DIGIRINGO.", href: "/press", cta: "Press kit" },
  { icon: "zap", title: "System status", body: "Check whether calls, texts and numbers are running normally.", href: "/status", cta: "View status" },
];

/** Contact page (and the /sales variant): routing cards plus a form that emails the team. */
export function ContactPage({ sales = false }: { sales?: boolean }) {
  usePageMeta(
    sales ? "Talk to Our Team | DIGIRINGO" : "Contact Us | DIGIRINGO",
    sales ? "Planning numbers for your business, other countries or a team? Tell us what you need and we'll help you set up DIGIRINGO the right way." : "Get in touch with DIGIRINGO: live chat in the app, email support@digiringo.com or send us a message. Sales, support, developers and press.",
  );
  const topicParam = (() => { try { return new URLSearchParams(window.location.search).get("topic") || ""; } catch { return ""; } })();
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: topicParam ? `Notify me: ${topicParam}` : "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [err, setErr] = useState("");
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState("sending"); setErr("");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, sales }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Something went wrong");
      setState("sent");
    } catch (ex) {
      setErr((ex as Error).message); setState("idle");
    }
  };

  return (
    <>
      <section className="dg-hero-b center">
        <div className="dg-wrap dg-hero-b-center">
          <Reveal><span className="dg-eyebrow">{sales ? "Sales" : "Contact"}</span></Reveal>
          <Reveal delay={60}><h1 className="dg-h1b">{sales ? "Let's set up your business line" : "How can we help?"}</h1></Reveal>
          <Reveal delay={120}>
            <p className="dg-lead-b hero">
              {sales ? "Tell us how many numbers you need, which countries and how your calls should be handled. A real person will reply." : "Pick the quickest route below, or send us a message and we'll get back to you."}
            </p>
          </Reveal>
        </div>
      </section>

      {!sales && (
        <section className="dg-block" style={{ paddingTop: 0 }}>
          <div className="dg-wrap">
            <div className="dg-contact-grid">
              {CARDS.map((c, i) => (
                <Reveal key={c.title} delay={i * 50}>
                  {c.href.startsWith("/") && !c.href.startsWith("/app") ? (
                    <Link to={c.href} className="dg-card dg-card-b link">
                      <div className="dg-card-icon sm"><Icon name={c.icon} /></div>
                      <h3 className="dg-item-title">{c.title}</h3><p className="dg-item-body">{c.body}</p>
                      <span className="dg-more">{c.cta} →</span>
                    </Link>
                  ) : (
                    <a href={c.href} className="dg-card dg-card-b link">
                      <div className="dg-card-icon sm"><Icon name={c.icon} /></div>
                      <h3 className="dg-item-title">{c.title}</h3><p className="dg-item-body">{c.body}</p>
                      <span className="dg-more">{c.cta} →</span>
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="dg-block dg-tone-tint" id="message">
        <div className="dg-wrap" style={{ maxWidth: 760 }}>
          <div className="dg-card" style={{ padding: "clamp(24px,4vw,40px)" }}>
            {state === "sent" ? (
              <div className="dg-center" style={{ padding: "40px 10px" }}>
                <div className="dg-card-icon" style={{ margin: "0 auto 18px", width: 60, height: 60, color: "var(--green)", background: "rgba(34,197,94,0.12)" }}><Check size={28} /></div>
                <h3 className="dg-h3">Message sent</h3>
                <p className="dg-muted" style={{ marginTop: 10, fontSize: 14.5 }}>Thanks — we'll reply to {form.email} within one business day.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <h2 className="dg-h3b" style={{ marginBottom: 22 }}>Send us a message</h2>
                <div className="dg-grid dg-grid-2" style={{ gap: 14 }}>
                  <div className="dg-field"><label className="dg-label">Name</label><input className="dg-input" value={form.name} onChange={set("name")} required maxLength={120} /></div>
                  <div className="dg-field"><label className="dg-label">Email</label><input className="dg-input" type="email" value={form.email} onChange={set("email")} required maxLength={160} /></div>
                </div>
                {sales && <div className="dg-field"><label className="dg-label">Company (optional)</label><input className="dg-input" value={form.company} onChange={set("company")} maxLength={160} /></div>}
                <div className="dg-field"><label className="dg-label">Topic</label><input className="dg-input" value={form.topic} onChange={set("topic")} placeholder={sales ? "e.g. 5 numbers in the US and UK" : "How can we help?"} maxLength={160} /></div>
                <div className="dg-field"><label className="dg-label">Message</label><textarea className="dg-input dg-textarea" value={form.message} onChange={set("message")} required maxLength={5000} /></div>
                {/* Honeypot: hidden from people, filled in by bots. */}
                <input value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
                {err && <p className="dg-item-body" style={{ color: "#dc2626", marginBottom: 12 }}>{err}</p>}
                <button type="submit" className="dg-btn dg-btn-primary dg-btn-lg" style={{ width: "100%", marginTop: 6 }} disabled={state === "sending"}>
                  {state === "sending" ? "Sending…" : <>Send message <Send size={16} /></>}
                </button>
                <p className="dg-note">We use your details only to reply to you. See our <Link to="/privacy">privacy policy</Link>.</p>
              </form>
            )}
          </div>
          <p className="dg-note" style={{ marginTop: 22 }}>DIGIRINGO · 14 Hughes Ste B200, Irvine, CA 92618, USA</p>
        </div>
      </section>
    </>
  );
}
