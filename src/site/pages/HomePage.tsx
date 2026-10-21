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
      <section className="dg-section" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="dg-wrap">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 48,
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            borderRadius: 32,
            padding: "60px 56px",
            background: "linear-gradient(160deg, #080e1f 0%, #111638 35%, #1a0e3a 65%, #0d1428 100%)",
            border: "1px solid rgba(124,92,255,0.15)",
          }}>
            {/* Decorative blurred orbs */}
            <div style={{ position: "absolute", top: -120, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -100, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Left: Text content */}
            <Reveal style={{ position: "relative", zIndex: 1 }}>
              <div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "7px 16px", borderRadius: 999,
                  background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
                  color: "#22c55e", fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
                  Now on Google Play
                </span>

                <h2 style={{
                  color: "#fff", fontSize: "clamp(30px, 3.8vw, 48px)", fontWeight: 800,
                  lineHeight: 1.15, letterSpacing: "-0.03em", marginTop: 24,
                }}>
                  Your second number,<br />
                  <span style={{ background: "linear-gradient(135deg, #4f8ef7 0%, #7c5cff 50%, #b06aff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>always in your pocket</span>
                </h2>

                <p style={{
                  color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.7,
                  marginTop: 18, maxWidth: 420,
                }}>
                  Call, text, and manage all your numbers from one app. Top up your wallet, pick a number, and start talking — no SIM, no contract.
                </p>

                {/* Feature pills */}
                <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
                  {["4 MB download", "Works offline", "Dark theme"].map(t => (
                    <span key={t} style={{
                      padding: "6px 14px", borderRadius: 999,
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600,
                    }}>{t}</span>
                  ))}
                </div>

                {/* Google Play button */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.digiringo.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 16,
                    marginTop: 36, padding: "14px 32px 14px 24px", borderRadius: 14,
                    background: "#fff", color: "#111", textDecoration: "none",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)"; }}
                >
                  <svg width="28" height="28" viewBox="0 0 512 512"><path fill="#4285F4" d="M386.5 257l-105-61 32-32 115 64c7 4 7 12 0 16l-42 23z"/><path fill="#34A853" d="M281.5 196l-250 145c-4 2-9 1-11-3l261-261 32 32-32 87z"/><path fill="#FBBC04" d="M313.5 109L52.5 370c2 4 7 5 11 3l250-145 32-32-32-87z"/><path fill="#EA4335" d="M281.5 316l105-61 42 23c7 4 7 12 0 16l-115 64-32-32v-10z"/><path fill="#34A853" d="M20.5 142c-2 5-3 11-3 17v194c0 6 1 12 3 17l261-261-261 33z"/></svg>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#666", letterSpacing: 0.5, textTransform: "uppercase" }}>Get it on</div>
                    <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, marginTop: -2 }}>Google Play</div>
                  </div>
                </a>

                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 16 }}>
                  Requires Android 7.0+ &middot; Free to download
                </p>
              </div>
            </Reveal>

            {/* Right: Phone mockup */}
            <Reveal delay={150} style={{ position: "relative", zIndex: 1 }}>
              <div style={{ position: "relative" }}>
                {/* Glow behind phone */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  width: 280, height: 400, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(124,92,255,0.2) 0%, rgba(79,142,247,0.08) 50%, transparent 70%)",
                  pointerEvents: "none", filter: "blur(40px)",
                }} />
                <PhoneFrame src={SHOTS.home} caption="" glow={false} />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Mobile: stacked layout override */}
        <style>{`
          @media (max-width: 768px) {
            .dg-section > .dg-wrap > [style*="grid-template-columns: 1fr auto"] {
              grid-template-columns: 1fr !important;
              padding: 40px 24px !important;
              text-align: center;
            }
            .dg-section > .dg-wrap > [style*="grid-template-columns: 1fr auto"] .dg-phone-wrap {
              margin: 0 auto;
            }
          }
        `}</style>
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
