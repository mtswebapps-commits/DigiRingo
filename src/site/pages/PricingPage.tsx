import { useState } from "react";
import { Check, ChevronDown, ArrowRight } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { LinkButton, SectionIntro } from "../components/ui";
import { Link } from "../router";
import { FAQS, COUNTRIES, NUMBER_RENTAL, USAGE_RATES } from "../data";

export function PricingPage() {
  return (
    <>
      {/* hero */}
      <section className="dg-section" style={{ paddingTop: "calc(var(--nav-h) + clamp(40px,8vw,90px))", paddingBottom: 30 }}>
        <div className="dg-wrap dg-center">
          <Reveal>
            <span className="dg-eyebrow">Pricing</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="dg-h1" style={{ marginTop: 22, fontSize: "clamp(36px,6vw,72px)" }}>
              Pay only for what you use. <span className="dg-grad-text">Nothing more.</span>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="dg-lead" style={{ marginTop: 22, maxWidth: 560, margin: "22px auto 0" }}>
              No plans, no bundles, no commitments. Top up your wallet, pick a number
              and pay per minute &amp; message — simple and transparent.
            </p>
          </Reveal>
        </div>
      </section>

      {/* numbers + usage rates */}
      <section className="dg-section" style={{ paddingTop: 10 }}>
        <div className="dg-wrap">
          <Reveal>
            <SectionIntro
              eyebrow="Rates"
              title="Transparent, per-use pricing"
              lead="Rent a number at a flat monthly rate. Calls and texts are charged per use from your prepaid wallet — no hidden fees, no contracts."
            />
          </Reveal>
          <div className="dg-grid dg-grid-2" style={{ marginTop: 40, alignItems: "start", gap: 22 }}>
            <Reveal>
              <div className="dg-card" style={{ padding: 28 }}>
                <h3 className="dg-h3" style={{ fontSize: 18 }}>Numbers</h3>
                <p className="dg-muted" style={{ fontSize: 13.5, marginTop: 6 }}>Flat monthly rental per number — no contract, cancel any time.</p>
                <div style={{ marginTop: 18 }}>
                  {NUMBER_RENTAL.map((r) => (
                    <PriceRow key={r.type} label={r.type} price={r.price} unit={r.unit} />
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="dg-card" style={{ padding: 28 }}>
                <h3 className="dg-h3" style={{ fontSize: 18 }}>Usage rates</h3>
                <p className="dg-muted" style={{ fontSize: 13.5, marginTop: 6 }}>Charged from your wallet as you go.</p>
                <div style={{ marginTop: 18 }}>
                  {USAGE_RATES.map((r) => (
                    <PriceRow key={r.item} label={r.item} price={r.price} unit={r.unit} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div className="dg-center" style={{ marginTop: 36 }}>
              <LinkButton to="/signup" variant="primary" size="lg">
                Sign up free <ArrowRight size={17} />
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section className="dg-section" style={{ paddingTop: 20 }}>
        <div className="dg-wrap">
          <Reveal>
            <SectionIntro
              eyebrow="How it works"
              title="Up and running in 60 seconds"
            />
          </Reveal>
          <div className="dg-grid dg-grid-3" style={{ marginTop: 40, gap: 22 }}>
            {[
              { n: "1", title: "Sign up free", body: "Create your account in under a minute — no card required." },
              { n: "2", title: "Top up your wallet", body: "Add $5, $10, $20 or $50 securely by card. Your balance is ready instantly." },
              { n: "3", title: "Pick a number & go", body: "Choose a local or toll-free number and start calling & texting right away." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="dg-card" style={{ padding: 28, textAlign: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 999, background: "var(--grad)", color: "#fff", fontSize: 18, fontWeight: 800 }}>{s.n}</span>
                  <h3 className="dg-h3" style={{ fontSize: 17, marginTop: 16 }}>{s.title}</h3>
                  <p className="dg-muted" style={{ fontSize: 13.5, marginTop: 8, lineHeight: 1.6 }}>{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* countries / coverage */}
      <section className="dg-section">
        <div className="dg-wrap">
          <Reveal>
            <SectionIntro eyebrow="Coverage" title="Numbers in 8+ countries" lead="Local and mobile numbers, with more regions added all the time." />
          </Reveal>
          <Reveal>
            <div className="dg-chips" style={{ justifyContent: "center", marginTop: 36, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
              {COUNTRIES.map((c) => (
                <span className="dg-chip" key={c.name}>
                  <span style={{ fontSize: 18 }}>{c.flag}</span> {c.name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* faq */}
      <section className="dg-section" style={{ paddingTop: 20 }}>
        <div className="dg-wrap" style={{ maxWidth: 800 }}>
          <Reveal>
            <SectionIntro eyebrow="FAQ" title="Questions, answered" />
          </Reveal>
          <div style={{ marginTop: 44 }}>
            {FAQS.map((f, i) => (
              <Reveal key={i} delay={i * 50}>
                <FaqItem q={f.q} a={f.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="dg-section" style={{ paddingTop: 0 }}>
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-cta-band">
              <h2 className="dg-h2" style={{ maxWidth: 640, margin: "0 auto" }}>
                Your number, live in 60 seconds.
              </h2>
              <p className="dg-lead" style={{ margin: "18px auto 0", maxWidth: 500 }}>
                Sign up free, top up your wallet, pick a number — start on your terms.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
                <LinkButton to="/signup" variant="primary" size="lg">
                  Get started <ArrowRight size={17} />
                </LinkButton>
                <Link to="/contact" className="dg-btn dg-btn-ghost dg-btn-lg">Contact sales</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function PriceRow({ label, price, unit }: { label: string; price: string; unit: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
      <span style={{ color: "var(--text)", fontSize: 14.5 }}>{label}</span>
      <span style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <b style={{ color: "var(--text)", fontSize: 16 }}>{price}</b>
        <span className="dg-muted" style={{ fontSize: 12.5 }}>{unit}</span>
      </span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`dg-faq-item ${open ? "open" : ""}`}>
      <button className="dg-faq-q" onClick={() => setOpen((o) => !o)}>
        {q}
        <ChevronDown size={20} className="chev" />
      </button>
      <div className="dg-faq-a">
        <p>{a}</p>
      </div>
    </div>
  );
}
