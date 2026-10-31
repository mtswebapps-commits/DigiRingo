import { useState } from "react";
import { ArrowRight, Check, Globe, Monitor, Smartphone } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { HeroPhones } from "../components/HeroPhones";
import { PixelRipple } from "../components/PixelRipple";
import { PhoneFrame } from "../components/PhoneFrame";
import { Link } from "../router";
import { Icon } from "../components/Icon";
import { FaqList, ReadyBand, StatusBadge } from "../components/blocks";
import { COUNTRIES, FAQS } from "../data";
import { usePageMeta } from "../lib/seo";
import type { IconName, Shot, Status } from "../content/types";

const TRIO: { title: string; body: string; icon: IconName; href: string; status?: Status }[] = [
  { title: "Bring your AI agent", body: "Point any number at your own voice AI or SIP agent and let it pick up.", icon: "bot", href: "/ai-agent", status: "beta" },
  { title: "Never miss a call", body: "Every device rings, then your cellphone, then voicemail.", icon: "phone-incoming", href: "/product/call-management/never-miss-a-call" },
  { title: "Numbers worldwide", body: "Local, toll-free and international numbers, all in one app.", icon: "globe", href: "/phone-numbers" },
];

const GRID: { title: string; body: string; shot: Shot; href: string }[] = [
  { title: "Get a number in a minute", body: "Search local, toll-free and international numbers and go live straight away.", shot: "buy", href: "/phone-numbers" },
  { title: "Calls that follow you", body: "Answer in the browser or on Android, or have calls forwarded to your cell.", shot: "calls", href: "/product/calling" },
  { title: "Texting that's registered", body: "Two-way SMS with 10DLC registration built into the Trust Center.", shot: "chat", href: "/product/messaging" },
  { title: "Route each number your way", body: "Ring the app, forward to a phone, or send to your SIP agent or webhook.", shot: "settings", href: "/product/call-routing" },
  { title: "Every call in one history", body: "Missed, answered and forwarded calls, with one-tap call back.", shot: "activity", href: "/product/call-analytics/call-logs" },
  { title: "Pay only for what you use", body: "A prepaid wallet with itemised charges. No seats, no contracts.", shot: "wallet", href: "/pricing" },
];

const SOLUTIONS: { label: string; href: string; icon: IconName; line: string; shot: Shot }[] = [
  { label: "Home services", href: "/solutions/home-services", icon: "wrench", line: "Catch the emergency call while you're under a sink — it rings your cell when the app can't.", shot: "calls" },
  { label: "Law firms", href: "/solutions/law-firms", icon: "scale", line: "Give each practice area its own number and keep client calls off personal phones.", shot: "numbers" },
  { label: "Property management", href: "/solutions/property-management", icon: "building", line: "One number per building, so tenants always know who to call — and you know which property it's about.", shot: "inbox" },
  { label: "Healthcare", href: "/solutions/healthcare", icon: "stethoscope", line: "A front-desk line that rings every device, with forwarding to the on-call phone after hours.", shot: "dialer" },
  { label: "Startups", href: "/solutions/startups", icon: "rocket", line: "Look established from day one with local numbers in the cities you sell to.", shot: "home" },
  { label: "Sales", href: "/solutions/sales", icon: "dollar", line: "Call prospects from a local number in their area code, from your laptop.", shot: "dialer" },
  { label: "Support", href: "/solutions/support", icon: "headphones", line: "A toll-free line customers can call free, answered wherever your team is.", shot: "calls" },
];

const PRICE_FACTS = [
  { big: "$2.50", small: "per US number a month" },
  { big: "$0.015", small: "per minute or text, US & Canada" },
  { big: "$0", small: "per-user or setup fees" },
];

export function HomePage() {
  usePageMeta(undefined, "Business phone numbers for calls and texts. Local, toll-free and international numbers that ring your browser, Android app and cellphone. Pay as you go.");
  const [sol, setSol] = useState(0);
  const s = SOLUTIONS[sol];

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="dg-hero-ripple" style={{ position: "relative", overflow: "hidden", textAlign: "center", paddingTop: "calc(var(--nav-h) + clamp(64px, 10vw, 128px))", paddingBottom: "clamp(40px, 6vw, 72px)" }}>
        <PixelRipple />
        <div className="dg-wrap" style={{ position: "relative", zIndex: 1 }}>
          <Reveal><span className="dg-eyebrow">Business phone, minus the phone bill</span></Reveal>
          <Reveal delay={90}>
            <h1 className="dg-h1" style={{ marginTop: 26, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
              Your business line,<br /><span className="dg-grad-text">wherever you are.</span>
            </h1>
          </Reveal>
          <Reveal delay={170}>
            <p className="dg-lead" style={{ marginTop: 24, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
              Get local, toll-free and international numbers. Call and text from your browser or Android phone, and never let a customer reach a dead line.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="/app" className="dg-btn dg-btn-primary dg-btn-lg">Get started <ArrowRight size={17} /></a>
              <Link to="/demo" className="dg-btn dg-btn-ghost dg-btn-lg">Take the tour</Link>
            </div>
          </Reveal>
          <Reveal delay={330}>
            <div style={{ display: "flex", gap: 22, marginTop: 30, flexWrap: "wrap", justifyContent: "center", color: "var(--muted)", fontSize: 13.5 }}>
              <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Monitor size={15} /> Web app</span>
              <a href="https://play.google.com/store/apps/details?id=com.digiringo.app" target="_blank" rel="noopener" style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Smartphone size={15} /> Android</a>
              <Link to="/downloads" className="" ><span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Globe size={15} /> iPhone via Safari</span></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="dg-section" style={{ paddingTop: 8, paddingBottom: 24 }}>
        <div className="dg-wrap"><HeroPhones /></div>
      </section>

      {/* ---------------------------------------------------------------- TRIO */}
      <section className="dg-block">
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-block-head center">
              <span className="dg-eyebrow">Built for small teams</span>
              <h2 className="dg-h2b" style={{ marginTop: 18 }}>Answer more calls with less effort</h2>
            </div>
          </Reveal>
          <div className="dg-grid dg-grid-3">
            {TRIO.map((t, i) => (
              <Reveal key={t.title} delay={i * 70}>
                <Link to={t.href} className="dg-card dg-card-b link">
                  <div className="dg-card-icon sm"><Icon name={t.icon} /></div>
                  <h3 className="dg-item-title">{t.title} <StatusBadge status={t.status} /></h3>
                  <p className="dg-item-body">{t.body}</p>
                  <span className="dg-more">Learn more <ArrowRight size={15} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- COUNTRIES */}
      <section style={{ padding: "8px 0 48px" }}>
        <div className="dg-wrap">
          <p className="dg-center dg-muted" style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 22 }}>Numbers available in</p>
        </div>
        <div className="dg-marquee">
          <div className="dg-marquee-track">
            {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
              <span className="dg-flagchip" key={i}><span className="flag">{c.flag}</span> {c.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- FEATURE GRID */}
      <section className="dg-block dg-tone-tint">
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-block-head center">
              <h2 className="dg-h2b">Everything a business line needs</h2>
              <p className="dg-lead-b">One app for your numbers, calls, texts and voicemail — on the devices you already own.</p>
            </div>
          </Reveal>
          <div className="dg-grid dg-grid-3">
            {GRID.map((g, i) => (
              <Reveal key={g.title} delay={(i % 3) * 70}>
                <Link to={g.href} className="dg-card dg-card-b link" >
                  <h3 className="dg-item-title">{g.title}</h3>
                  <p className="dg-item-body">{g.body}</p>
                  <div style={{ marginTop: 22, height: 230, overflow: "hidden", display: "flex", justifyContent: "center" }}>
                    <PhoneFrame src={`/shots/${g.shot}.png`} glow={false} style={{ width: 210 }} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ HOW IT WORKS */}
      <section className="dg-block dg-tone-dark">
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-block-head center">
              <h2 className="dg-h2b">Live in four steps</h2>
              <p className="dg-lead-b">No hardware, no paperwork for US numbers, no waiting on a technician.</p>
            </div>
          </Reveal>
          <div className="dg-steps">
            {[
              ["Sign up", "Email or Google — under a minute."],
              ["Pick a number", "Search by area code, city or digits."],
              ["Top up from $5", "Pay by card; every charge is itemised."],
              ["Call and text", "Browser, Android, and your cell as backup."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 70}>
                <div className="dg-step"><span className="dg-step-n">{i + 1}</span><h3 className="dg-item-title">{t}</h3><p className="dg-item-body">{b}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- PRICING BAND */}
      <section className="dg-block">
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-block-head center">
              <h2 className="dg-h2b">Simple, usage-based pricing</h2>
              <p className="dg-lead-b">Pay for your numbers and what you use. Nothing per seat, nothing locked in.</p>
            </div>
          </Reveal>
          <div className="dg-grid dg-grid-3">
            {PRICE_FACTS.map((p, i) => (
              <Reveal key={p.small} delay={i * 70}>
                <div className="dg-card dg-card-b" style={{ textAlign: "center" }}>
                  <div className="dg-big grad">{p.big}</div>
                  <p className="dg-item-body" style={{ marginTop: 10 }}>{p.small}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            <Link to="/pricing" className="dg-btn dg-btn-primary">See pricing</Link>
            <Link to="/rates" className="dg-btn dg-btn-ghost">International rates</Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- SOLUTIONS */}
      <section className="dg-block dg-tone-tint">
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-block-head center">
              <h2 className="dg-h2b">Made for the way your business runs</h2>
            </div>
          </Reveal>
          <div className="dg-chips center" style={{ marginBottom: 32 }}>
            {SOLUTIONS.map((x, i) => (
              <button key={x.label} className={`dg-chip link${i === sol ? " on" : ""}`} onClick={() => setSol(i)}
                style={i === sol ? { borderColor: "var(--blue)", color: "var(--text)" } : undefined}>
                <Icon name={x.icon} size={15} /> {x.label}
              </button>
            ))}
          </div>
          <div className="dg-split">
            <div className="dg-split-visual"><PhoneFrame src={`/shots/${s.shot}.png`} glow={false} /></div>
            <div>
              <h3 className="dg-h3b">{s.label}</h3>
              <p className="dg-para">{s.line}</p>
              <Link to={s.href} className="dg-more">Explore {s.label.toLowerCase()} <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- WHY LIST */}
      <section className="dg-block">
        <div className="dg-wrap dg-split">
          <div>
            <h2 className="dg-h2b">Switching is painless</h2>
            <p className="dg-para">Keep your current line running while you try DIGIRINGO. Forward your old number to your new one and nothing gets missed. Number porting is on the way.</p>
            <ul className="dg-ticks" style={{ marginTop: 20 }}>
              {["No contract to sign or cancel", "Works on the phone and laptop you already have", "Live chat support inside the app"].map((t) => <li key={t}><Check size={16} />{t}</li>)}
            </ul>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              <a href="/app" className="dg-btn dg-btn-primary">Get started</a>
              <Link to="/porting" className="dg-btn dg-btn-ghost">About porting</Link>
            </div>
          </div>
          <div className="dg-split-visual"><PhoneFrame src="/shots/home.png" /></div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ FAQ */}
      <section className="dg-block dg-tone-tint"><div className="dg-wrap"><FaqList items={FAQS.map((f) => ({ q: f.q, a: f.a }))} /></div></section>

      <ReadyBand />
    </>
  );
}
