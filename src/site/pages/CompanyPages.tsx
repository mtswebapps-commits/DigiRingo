import { useEffect, useState, type ReactNode } from "react";
import { Globe, ShieldCheck, Sparkles, HeartHandshake, Mail, MapPin, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { LinkButton } from "../components/ui";

/* ============================================================================
   Company pages — About, Careers and the live system Status page (footer links).
   ========================================================================== */

function Hero({ eyebrow, title, lead }: { eyebrow: string; title: ReactNode; lead: string }) {
  return (
    <section className="dg-section" style={{ paddingTop: "calc(var(--nav-h) + clamp(40px,8vw,90px))", paddingBottom: 30 }}>
      <div className="dg-wrap dg-center">
        <Reveal><span className="dg-eyebrow">{eyebrow}</span></Reveal>
        <Reveal delay={80}>
          <h1 className="dg-h1" style={{ marginTop: 22, fontSize: "clamp(36px,6vw,72px)" }}>{title}</h1>
        </Reveal>
        <Reveal delay={150}>
          <p className="dg-lead" style={{ maxWidth: 600, margin: "22px auto 0" }}>{lead}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ About */
const VALUES = [
  { icon: Globe, title: "Borderless by default", body: "Real local numbers in the US, UK, Europe and beyond — so you can be local anywhere without a SIM or a contract." },
  { icon: ShieldCheck, title: "Compliant & secure", body: "We register numbers with carriers the right way (10DLC, regulatory checks) and keep secrets and payments server-side." },
  { icon: Sparkles, title: "Simple to use", body: "Calls, texts, voicemail and your wallet in one clean app on web, Android and iPhone." },
  { icon: HeartHandshake, title: "Pay for what you use", body: "No lock-in. Top up your wallet, rent the numbers you need and cancel anytime." },
];

export function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About us"
        title={<>A second number for a <span className="dg-grad-text">borderless</span> world.</>}
        lead="DIGIRINGO gives people and businesses real local phone numbers in multiple countries — to call, text and stay reachable from one app."
      />
      <section className="dg-section" style={{ paddingTop: 10 }}>
        <div className="dg-wrap">
          <div className="dg-grid dg-grid-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 80}>
                <div className="dg-card" style={{ height: "100%" }}>
                  <div className="dg-card-icon"><v.icon size={22} /></div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, marginTop: 16 }}>{v.title}</h3>
                  <p className="dg-muted" style={{ marginTop: 8, lineHeight: 1.6 }}>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="dg-card" style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <MapPin size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontWeight: 800 }}>DIGIRINGO</p>
                  <p className="dg-muted" style={{ marginTop: 4 }}>14 Hughes Ste B200, Irvine, CA 92618, USA</p>
                  <p className="dg-muted" style={{ marginTop: 2 }}>support@digiringo.com</p>
                </div>
              </div>
              <LinkButton to="/contact">Contact us</LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- Careers */
export function CareersPage() {
  return (
    <>
      <Hero
        eyebrow="Careers"
        title={<>Build the future of <span className="dg-grad-text">calling</span>.</>}
        lead="We're a small team building global telephony that feels effortless. We don't have open roles listed right now, but we're always happy to hear from great people."
      />
      <section className="dg-section" style={{ paddingTop: 10 }}>
        <div className="dg-wrap" style={{ maxWidth: 760 }}>
          <Reveal>
            <div className="dg-card dg-center">
              <div className="dg-card-icon" style={{ margin: "0 auto" }}><Mail size={22} /></div>
              <h3 style={{ fontSize: 21, fontWeight: 800, marginTop: 16 }}>No open positions right now</h3>
              <p className="dg-muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
                Engineers, designers and support specialists who love telecom are welcome to send a short intro and CV.
                We'll reach out when a role opens up.
              </p>
              <a className="dg-btn dg-btn-primary" style={{ marginTop: 22, display: "inline-flex" }}
                href="mailto:support@digiringo.com?subject=Careers%20at%20DIGIRINGO">Email your CV</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ----------------------------------------------------------------- Status */
interface Service { id: string; name: string; ok: boolean; ms?: number }

export function StatusPage() {
  const [data, setData] = useState<{ checkedAt: string; services: Service[] } | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => { setData(j); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  const allOk = !!data && !error && data.services.every((s) => s.ok);
  const banner = error ? { text: "We can't reach our servers right now", color: "#ef4444" }
    : !data ? { text: "Checking systems…", color: "var(--muted)" }
    : allOk ? { text: "All systems operational", color: "#22c55e" }
    : { text: "Some services are degraded", color: "#f59e0b" };

  return (
    <>
      <Hero eyebrow="Status" title={<>System <span className="dg-grad-text">status</span></>} lead="Live health of the DIGIRINGO platform, checked every minute." />
      <section className="dg-section" style={{ paddingTop: 10 }}>
        <div className="dg-wrap" style={{ maxWidth: 760 }}>
          <div className="dg-card" style={{ display: "flex", alignItems: "center", gap: 12, borderColor: banner.color }}>
            {!data && !error ? <Loader2 size={22} className="dg-spin" /> : allOk ? <CheckCircle2 size={22} color={banner.color} /> : <XCircle size={22} color={banner.color} />}
            <p style={{ flex: 1, fontWeight: 800, fontSize: 17, color: banner.color }}>{banner.text}</p>
            <button onClick={load} disabled={loading} aria-label="Refresh" className="dg-btn dg-btn-ghost dg-btn-sm" style={{ display: "inline-flex", gap: 6 }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          <div className="dg-card" style={{ marginTop: 16, padding: 0, overflow: "hidden" }}>
            {(data?.services ?? []).map((s, i, arr) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none" }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: s.ok ? "#22c55e" : "#ef4444", flexShrink: 0 }} />
                <p style={{ flex: 1, fontWeight: 600 }}>{s.name}</p>
                <p className="dg-muted" style={{ fontSize: 13.5 }}>{s.ok ? "Operational" : "Disruption"}</p>
              </div>
            ))}
            {!data && <p className="dg-muted" style={{ padding: 20 }}>{error ? "Status unavailable — please try again shortly." : "Loading…"}</p>}
          </div>
          {data && <p className="dg-muted" style={{ fontSize: 12.5, marginTop: 12 }}>Last checked {new Date(data.checkedAt).toLocaleString()}</p>}
          <p className="dg-muted" style={{ fontSize: 13.5, marginTop: 18 }}>
            Having trouble that isn't shown here? Email <a href="mailto:support@digiringo.com">support@digiringo.com</a> or use in-app live chat.
          </p>
        </div>
      </section>
    </>
  );
}
