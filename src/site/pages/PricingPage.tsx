import { ArrowRight, Check, Clock3 } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { Link } from "../router";
import { FaqList, ReadyBand, Widget } from "../components/blocks";
import { usePageMeta } from "../lib/seo";

const CARDS = [
  {
    name: "Numbers", price: "$2.50", unit: "per number / month", desc: "Local US & Canada numbers. Toll-free from $2.50; other countries priced per country.",
    items: ["Local, toll-free and international", "Buy and release anytime", "Each number gets its own routing", "No per-user or setup fees"],
  },
  {
    name: "Calls & texts", price: "$0.015", unit: "per minute or message", desc: "US & Canada calling and SMS, drawn from your prepaid wallet.", featured: true,
    items: ["HD calling from browser and Android", "Two-way SMS (after 10DLC registration)", "Forwarding to your cellphone", "Voicemail on every number"],
  },
  {
    name: "International", price: "By country", unit: "per minute / per message", desc: "Call and text 200+ countries. The exact rate is shown before you dial.",
    items: ["Landline and mobile rates listed", "Lower rates from local caller IDs", "No international add-on", "Searchable rate list"],
  },
];

type Row = [string, "yes" | "soon" | string];
const GROUPS: { name: string; rows: Row[] }[] = [
  { name: "Numbers", rows: [["Local US & Canada numbers", "yes"], ["Toll-free numbers (calls)", "yes"], ["International numbers", "yes"], ["Toll-free texting", "soon"], ["Number porting", "soon"]] },
  { name: "Calling", rows: [["Calls from browser and Android", "yes"], ["All devices ring at once", "yes"], ["Forward unanswered calls to your cell", "yes"], ["Choose your caller ID", "yes"], ["Keypad, hold, mute", "yes"], ["Call recording", "soon"], ["Call transfer & 3-way calls", "soon"]] },
  { name: "Messaging", rows: [["Two-way SMS", "yes"], ["10DLC registration in the Trust Center", "yes"], ["MMS (pictures)", "soon"], ["Group texts, auto-replies, scheduled texts", "soon"]] },
  { name: "Routing & automation", rows: [["Per-number routing (app / phone / SIP / webhook)", "yes"], ["Route calls to your own AI agent", "yes"], ["Phone menus (IVR) & business hours", "soon"], ["Built-in AI receptionist & call summaries", "soon"], ["Integrations (CRM, Slack, Zapier)", "soon"]] },
  { name: "Account & support", rows: [["Prepaid wallet with itemised history", "yes"], ["Live chat support in the app", "yes"], ["Voicemail", "yes"], ["Voicemail transcription", "soon"], ["Team seats & shared numbers", "soon"]] },
];

const FAQ = [
  { q: "How does DIGIRINGO work?", a: "It's a phone service that runs over the internet. You buy a number in the app and use it to call and text from your browser or the Android app. Unanswered calls can forward to your regular cellphone." },
  { q: "Which devices can I use?", a: "Any modern browser on Windows, Mac or Linux, and the Android app. On iPhone, open the web app in Safari — a native iPhone app is on the way." },
  { q: "Does it use my mobile plan's minutes?", a: "Calls in the app use data or Wi-Fi, not your carrier minutes. Calls forwarded to your cellphone arrive like normal calls, so your carrier plan applies on that leg." },
  { q: "How good is the call quality?", a: "Calls are HD over a carrier-grade network. A stable connection of about 100 kbps per call is enough; Wi-Fi or 4G/5G works well." },
  { q: "Which countries can I call and text?", a: "More than 200. Every country's rate is in the rate list, and the app shows it before you dial." },
  { q: "Can my team use it?", a: "Today each account is one user who can have many numbers. Team seats and shared numbers are coming soon." },
  { q: "Can I keep business and personal calls apart?", a: "Yes — that's one of the main reasons people use DIGIRINGO. Your business number rings in the app, so your personal number stays private." },
  { q: "How do I cancel?", a: "There's nothing to cancel. Release any number you don't need in the app; unused wallet credit stays in your account." },
  { q: "What caller ID do people see?", a: "The DIGIRINGO number you call from. If you have several, you choose which one before you dial." },
  { q: "Can I receive verification codes (2FA) on my number?", a: "Many services work, but some banks and apps block internet-based numbers from receiving codes. Check with the service if it's critical." },
];

export function PricingPage() {
  usePageMeta("Pricing — Pay as You Go | DIGIRINGO", "Business numbers from $2.50/month and US & Canada calls and texts at $0.015. No contracts, no per-user fees — top up your wallet and pay only for what you use.");
  return (
    <>
      <section className="dg-hero-b center">
        <div className="dg-wrap dg-hero-b-center">
          <Reveal><span className="dg-eyebrow">Pricing</span></Reveal>
          <Reveal delay={60}><h1 className="dg-h1b">Pay for numbers and usage. That's it.</h1></Reveal>
          <Reveal delay={120}><p className="dg-lead-b hero">No plans to pick, no seats to count, no contract. Top up from $5 and every charge comes out of your wallet with a clear receipt.</p></Reveal>
        </div>
      </section>

      <section className="dg-block" style={{ paddingTop: 0 }}>
        <div className="dg-wrap">
          <div className="dg-grid dg-grid-3">
            {CARDS.map((c, i) => (
              <Reveal key={c.name} delay={i * 80}>
                <div className={`dg-card dg-price-card${c.featured ? " feat" : ""}`} style={{ height: "100%" }}>
                  {c.featured && <span className="dg-badge-pop">Most used</span>}
                  <span className="dg-eyebrow" style={{ alignSelf: "flex-start" }}>{c.name}</span>
                  <div className="dg-price-amt" style={{ marginTop: 18 }}>{c.price}</div>
                  <div className="dg-muted" style={{ fontSize: 14 }}>{c.unit}</div>
                  <p className="dg-item-body" style={{ margin: "14px 0 6px" }}>{c.desc}</p>
                  <div style={{ flex: 1 }}>
                    {c.items.map((x) => <div key={x} className="dg-feat-li"><Check size={17} />{x}</div>)}
                  </div>
                  <a href="/app" className={`dg-btn ${c.featured ? "dg-btn-primary" : "dg-btn-ghost"}`} style={{ marginTop: 18 }}>Get started <ArrowRight size={16} /></a>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="dg-note">Wallet top-ups: $5, $10, $20 or $50. Prices in USD; taxes may apply. Carrier registration fees for business texting (10DLC) are passed through at cost.</p>
        </div>
      </section>

      <section className="dg-block dg-tone-tint">
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-block-head center">
              <h2 className="dg-h2b">What you get</h2>
              <p className="dg-lead-b">Every account gets every available feature. Items marked soon are on our roadmap.</p>
            </div>
          </Reveal>
          <div className="dg-table-wrap">
            <table className="dg-table">
              <tbody>
                {GROUPS.flatMap((g) => [
                  <tr key={g.name}><th colSpan={2} style={{ background: "var(--bg-2)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>{g.name}</th></tr>,
                  ...g.rows.map(([label, v]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td style={{ width: 160 }}>{v === "yes" ? <span className="dg-cell-yes"><Check size={18} /></span> : v === "soon" ? <span className="dg-cell-soon"><Clock3 size={14} /> Soon</span> : v}</td>
                    </tr>
                  )),
                ])}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="dg-block">
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-block-head center">
              <h2 className="dg-h2b">Rates by country</h2>
              <p className="dg-lead-b">Pick a country to see what its numbers cost and what calls and texts to it cost.</p>
            </div>
          </Reveal>
          <Widget widget="country-rates" />
          <div style={{ textAlign: "center", marginTop: 20 }}><Link to="/rates" className="dg-more">Full international rate list <ArrowRight size={15} /></Link></div>
        </div>
      </section>

      <section className="dg-block dg-tone-dark">
        <div className="dg-wrap">
          <Reveal>
            <div className="dg-block-head center"><h2 className="dg-h2b">Good to know</h2></div>
          </Reveal>
          <div className="dg-grid dg-grid-3">
            {[
              ["Business texting registration", "US carriers require 10DLC registration to text from local numbers. The Trust Center walks you through it; one-time and monthly carrier fees are passed through at cost."],
              ["International numbers", "Some countries ask for an ID or address before a number goes live. The app lists what's needed and refunds numbers that don't get approved."],
              ["Incoming calls", "Incoming calls are billed per minute like outgoing ones. Toll-free numbers are free for your callers; you pay the minutes."],
            ].map(([t, b]) => (
              <div key={t} className="dg-card dg-card-b"><h3 className="dg-item-title">{t}</h3><p className="dg-item-body">{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="dg-block"><div className="dg-wrap"><FaqList items={FAQ} /></div></section>
      <ReadyBand />
    </>
  );
}
