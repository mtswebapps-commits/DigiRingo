import {
  Hash,
  MessageSquare,
  PhoneCall,
  Wallet,
  ShieldCheck,
  Globe,
  ArrowRight,
  Star,
  Check,
} from "lucide-react";
import { Reveal } from "../components/Reveal";
import { PhoneFrame } from "../components/PhoneFrame";
import { HeroPhones } from "../components/HeroPhones";
import { PixelRipple } from "../components/PixelRipple";
import { CountUpStat } from "../components/CountUpStat";
import { LinkButton, SectionIntro } from "../components/ui";
import { Link } from "../router";
import { COUNTRIES, STATS, FEATURES, STEPS, SHOTS } from "../data";

const ICONS: Record<string, typeof Hash> = { Hash, MessageSquare, PhoneCall, Wallet, ShieldCheck, Globe };

export function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section
        className="dg-hero-ripple"
        style={{
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          paddingTop: "calc(var(--nav-h) + clamp(72px, 12vw, 150px))",
          paddingBottom: "clamp(56px, 9vw, 120px)",
        }}
      >
        <PixelRipple />
        <div className="dg-wrap" style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <span className="dg-eyebrow">
              <Star size={13} fill="currentColor" /> Your number. Anywhere on Earth.
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="dg-h1" style={{ marginTop: 26, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
              Borderless.<br />
              <span className="dg-grad-text">Effortless.</span>
            </h1>
          </Reveal>
          <Reveal delay={170}>
            <p className="dg-lead" style={{ marginTop: 24, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
              One app for every number — call, text and manage real local lines in 8+ countries.
              No SIM, no contract, no second phone.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}>
              <LinkButton to="/signup" variant="primary" size="lg">
                Get started free <ArrowRight size={17} />
              </LinkButton>
              <LinkButton to="/pricing" variant="ghost" size="lg">
                See pricing
              </LinkButton>
            </div>
          </Reveal>
          <Reveal delay={330}>
            <div style={{ display: "flex", gap: 22, marginTop: 30, flexWrap: "wrap", justifyContent: "center" }}>
              {["No SIM required", "Cancel anytime", "Live in 60 seconds"].map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, color: "var(--muted)" }}>
                  <Check size={15} color="var(--green)" /> {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------- COUNTRY MARQUEE */}
      <section style={{ padding: "8px 0 36px" }}>
        <div className="dg-wrap">
          <Reveal>
            <p className="dg-center dg-muted" style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 22 }}>
              Local numbers available in
            </p>
          </Reveal>
        </div>
        <div className="dg-marquee">
          <div className="dg-marquee-track">
            {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
              <span className="dg-flagchip" key={i}>
                <span className="flag">{c.flag}</span> {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ PRODUCT PREVIEW */}
      <section className="dg-section" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="dg-wrap">
          <HeroPhones />
        </div>
      </section>

      {/* -------------------------------------------------------------- STATS */}
      <section className="dg-section" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="dg-wrap">
          <div className="dg-grid dg-grid-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="dg-card dg-center" style={{ padding: "30px 18px" }}>
                  <CountUpStat value={s.num} className="dg-stat-num grad" />
                  <p className="dg-muted" style={{ fontSize: 13.5, marginTop: 8 }}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- FEATURES */}
      <section className="dg-section" id="features">
        <div className="dg-wrap">
          <Reveal>
            <SectionIntro
              eyebrow="Everything you need"
              title={<>One app. <span className="dg-grad-text">Every number you’ll ever need.</span></>}
              lead="From your first local line to a full business presence across continents — DIGIRINGO keeps it effortless."
            />
          </Reveal>
          <div className="dg-grid dg-grid-3" style={{ marginTop: 56 }}>
            {FEATURES.map((f, i) => {
              const Icon = ICONS[f.icon] ?? Hash;
              return (
                <Reveal key={f.title} delay={(i % 3) * 90}>
                  <div className="dg-card" style={{ height: "100%" }}>
                    <div className="dg-card-icon"><Icon size={22} /></div>
                    <h3 className="dg-h3">{f.title}</h3>
                    <p className="dg-muted" style={{ fontSize: 14.5, lineHeight: 1.6, marginTop: 10 }}>{f.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------- SHOWCASE (REVault-style) */}
      <Showcase
        eyebrow="Buy in seconds"
        title={<>Pick a number. <span className="dg-grad-text">It’s yours instantly.</span></>}
        body="Browse live local and mobile numbers across 8+ countries. Filter by area code, see what supports SMS, and own it with a single tap — your wallet handles the rest."
        points={["Live inventory from real carriers", "Local & mobile options explained", "Pay from your prepaid wallet"]}
        shot={SHOTS.buy}
        caption="Buy a number"
      />
      <Showcase
        reverse
        eyebrow="Messaging"
        title={<>Texts, organised the <span className="dg-grad-text">way you think.</span></>}
        body="Every number gets its own inbox with threaded conversations and delivery receipts. Switch between lines from a tidy drawer — work, family and side-project, never tangled."
        points={["Per-number inboxes", "Delivery & read receipts", "Snippets for quick replies"]}
        shot={SHOTS.chat}
        caption="Inbox"
      />
      <Showcase
        eyebrow="Calling"
        title={<>Dial out from <span className="dg-grad-text">any of your numbers.</span></>}
        body="A full keypad with a ‘calling from’ selector lets you place HD calls on whichever line fits the moment. Your call log keeps a clean record of everything."
        points={["HD voice over the internet", "Choose the line you call from", "Searchable call history"]}
        shot={SHOTS.dialer}
        caption="Dialer"
      />

      {/* ----------------------------------------------------------- HOW IT WORKS */}
      <section className="dg-section">
        <div className="dg-wrap">
          <Reveal>
            <SectionIntro
              eyebrow="How it works"
              title="Live in four simple steps"
              lead="From download to your first text in under a minute."
            />
          </Reveal>
          <div className="dg-grid dg-grid-4" style={{ marginTop: 56 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="dg-card" style={{ height: "100%" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: "var(--blue)", fontWeight: 600 }}>{s.n}</div>
                  <h3 className="dg-h3" style={{ marginTop: 14, fontSize: 19 }}>{s.title}</h3>
                  <p className="dg-muted" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- DOWNLOAD APP */}
      <section className="dg-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="dg-wrap">
          <Reveal>
            <div style={{
              position: "relative", overflow: "hidden",
              borderRadius: 28, padding: "56px 32px",
              background: "linear-gradient(135deg, #0f1729 0%, #1a1045 40%, #0c1a3a 100%)",
              border: "1px solid rgba(124,92,255,0.2)",
              textAlign: "center",
            }}>
              {/* Glow effects */}
              <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,92,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{
                  display: "inline-block", padding: "6px 16px", borderRadius: 999,
                  background: "rgba(124,92,255,0.15)", border: "1px solid rgba(124,92,255,0.3)",
                  color: "var(--blue)", fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
                  marginBottom: 24,
                }}>
                  Available on Android
                </span>

                <h2 className="dg-h2" style={{ maxWidth: 600, margin: "0 auto", fontSize: "clamp(28px, 4vw, 42px)" }}>
                  Take your second number <span className="dg-grad-text">everywhere</span>
                </h2>

                <p className="dg-lead" style={{ margin: "18px auto 0", maxWidth: 480, fontSize: 16 }}>
                  Download DIGIRINGO on your Android phone. Call, text, and manage your numbers on the go — all from one sleek app.
                </p>

                <a
                  href="https://play.google.com/store/apps/details?id=com.digiringo.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 14,
                    marginTop: 36, padding: "16px 36px", borderRadius: 16,
                    background: "linear-gradient(135deg, #4f8ef7, #7c5cff, #9b6ff7)",
                    color: "#fff", textDecoration: "none",
                    fontSize: 16, fontWeight: 800, letterSpacing: -0.3,
                    boxShadow: "0 8px 32px rgba(124,92,255,0.4), 0 2px 8px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,92,255,0.5), 0 4px 12px rgba(0,0,0,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,92,255,0.4), 0 2px 8px rgba(0,0,0,0.3)"; }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302-2.302 2.302-2.592-2.302 2.592-2.302zM5.864 2.658L16.8 9.09l-2.302 2.302-8.634-8.734z"/></svg>
                  Get it on Google Play
                </a>

                <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
                  {[
                    { icon: "⚡", label: "Fast & lightweight" },
                    { icon: "🔒", label: "Private & secure" },
                    { icon: "🌙", label: "Beautiful dark UI" },
                  ].map(f => (
                    <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{f.icon}</span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600 }}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- CTA BAND */}
      <section className="dg-section" style={{ paddingTop: 20 }}>
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-cta-band">
              <h2 className="dg-h2" style={{ maxWidth: 720, margin: "0 auto" }}>
                Ready to claim your <span className="dg-grad-text">borderless number?</span>
              </h2>
              <p className="dg-lead" style={{ margin: "20px auto 0", maxWidth: 520 }}>
                Join DIGIRINGO today. Your first number is minutes away.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
                <LinkButton to="/signup" variant="primary" size="lg">
                  Get started free <ArrowRight size={17} />
                </LinkButton>
                <Link to="/contact" className="dg-btn dg-btn-ghost dg-btn-lg">Talk to us</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** Alternating image + copy block — the detailed product story sections. */
function Showcase({
  eyebrow,
  title,
  body,
  points,
  shot,
  caption,
  reverse = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  points: string[];
  shot: string;
  caption: string;
  reverse?: boolean;
}) {
  return (
    <section className="dg-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="dg-wrap">
        <div className="dg-showcase">
          <Reveal style={{ order: reverse ? 2 : 1 }}>
            <span className="dg-eyebrow">{eyebrow}</span>
            <h2 className="dg-h2" style={{ marginTop: 20, fontSize: "clamp(28px,3.6vw,44px)" }}>{title}</h2>
            <p className="dg-lead" style={{ marginTop: 18, fontSize: 17 }}>{body}</p>
            <div style={{ marginTop: 22 }}>
              {points.map((p) => (
                <div className="dg-feat-li" key={p} style={{ color: "var(--text)" }}>
                  <Check size={18} /> {p}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} style={{ order: reverse ? 1 : 2, display: "flex", justifyContent: "center" }}>
            <PhoneFrame src={shot} caption={caption} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
