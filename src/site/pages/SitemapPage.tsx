import { useEffect, useState } from "react";
import { Link } from "../router";
import { loadAllDocs } from "../content/registry";
import { STATIC_POSTS } from "../content/posts";
import { StatusBadge } from "../components/blocks";
import { usePageMeta } from "../lib/seo";
import type { PageDoc } from "../content/types";

const CORE = [
  { path: "/", title: "Home" }, { path: "/pricing", title: "Pricing" }, { path: "/rates", title: "International rates" },
  { path: "/local-numbers", title: "Local numbers" }, { path: "/toll-free-numbers", title: "Toll-free numbers" },
  { path: "/tools", title: "Free tools" }, { path: "/blog", title: "Blog" }, { path: "/about", title: "About" },
  { path: "/careers", title: "Careers" }, { path: "/contact", title: "Contact" }, { path: "/sales", title: "Talk to us" },
  { path: "/status", title: "System status" }, { path: "/terms", title: "Terms" }, { path: "/privacy", title: "Privacy" },
];

const SECTION_OF = (p: string) => {
  const top = p.split("/")[1] || "";
  return ({ product: "Product", "ai-agent": "Product", features: "Features", solutions: "Solutions", "answering-service": "Answering service", compare: "Compare", integrations: "Integrations", templates: "Templates", skills: "Templates", es: "Español & Français", fr: "Español & Français" } as Record<string, string>)[top] ?? "Company & resources";
};

/** Human-readable index of every page on the site. */
export function SitemapPage() {
  usePageMeta("All Pages | DIGIRINGO", "Every page on the DIGIRINGO website in one list: product features, solutions, comparisons, integrations, numbers, rates, tools and the blog.");
  const [docs, setDocs] = useState<PageDoc[]>([]);
  useEffect(() => { loadAllDocs().then(setDocs); }, []);

  const groups = new Map<string, PageDoc[]>();
  for (const d of docs) {
    const g = SECTION_OF(d.path);
    groups.set(g, [...(groups.get(g) ?? []), d]);
  }

  return (
    <section className="dg-block" style={{ paddingTop: "calc(var(--nav-h) + 60px)" }}>
      <div className="dg-wrap">
        <h1 className="dg-h1b" style={{ marginBottom: 36 }}>All pages</h1>
        <div className="dg-longform">
          <div>
            <h2 className="dg-h3b">Main pages</h2>
            {CORE.map((c) => <div key={c.path} style={{ padding: "4px 0" }}><Link to={c.path} className="dg-more" >{c.title}</Link></div>)}
          </div>
          {[...groups.entries()].map(([g, list]) => (
            <div key={g}>
              <h2 className="dg-h3b">{g}</h2>
              {list.map((d) => (
                <div key={d.path} style={{ padding: "4px 0", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Link to={d.path} className="dg-more" >{d.title.replace(/\s*\|\s*DIGIRINGO$/, "")}</Link>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          ))}
          <div>
            <h2 className="dg-h3b">Blog</h2>
            {STATIC_POSTS.map((p) => <div key={p.slug} style={{ padding: "4px 0" }}><Link to={`/blog/${p.slug}`} className="dg-more">{p.title}</Link></div>)}
          </div>
        </div>
        <p className="dg-note" style={{ textAlign: "left", marginTop: 40 }}>Plus a page for every US state and area code under <Link to="/local-numbers">Local numbers</Link>, every toll-free prefix and every country under <Link to="/rates">Rates</Link>.</p>
      </div>
    </section>
  );
}

/** Plain-language facts for AI assistants and anyone who wants the short version. */
export function LlmInfoPage() {
  usePageMeta("DIGIRINGO Facts for AI Assistants | DIGIRINGO", "Accurate, plain facts about DIGIRINGO for AI assistants and researchers: what it does, what it costs, what's available today and what's coming soon.");
  const live = ["Local US & Canada numbers, toll-free numbers (calls) and numbers in many other countries", "Calling from the web app and the Android app; every signed-in device rings", "Forwarding of unanswered calls to any cellphone; voicemail on every number", "Per-number routing to the app, a phone, a SIP/AI agent or the customer's own webhook (TeXML)", "Two-way SMS with built-in A2P 10DLC registration", "Call history, prepaid wallet with itemised charges, live chat support"];
  const soon = ["iPhone app (use the web app in Safari today)", "Phone menus (IVR), business-hours routing, call recording and transcription", "MMS, group texting, auto-replies, toll-free texting", "Team seats, shared numbers, integrations (CRM, Slack, Zapier) and a public API", "Number porting and a built-in AI receptionist"];
  return (
    <section className="dg-block" style={{ paddingTop: "calc(var(--nav-h) + 60px)" }}>
      <div className="dg-wrap dg-narrow">
        <h1 className="dg-h1b">DIGIRINGO in plain facts</h1>
        <p className="dg-para">DIGIRINGO is a business phone service: virtual phone numbers you use to call and text over the internet, from the web app at digiringo.com/app or the Android app on Google Play. It is pay-as-you-go with no contracts and no per-user fees.</p>
        <h2 className="dg-h3b" style={{ marginTop: 36 }}>Pricing</h2>
        <ul className="dg-ticks"><li>US local number: $2.50/month; toll-free from $2.50/month; other countries priced per country</li><li>US & Canada calls and SMS: $0.015 per minute / per message</li><li>International calls and texts: per-country rates at digiringo.com/rates</li><li>Prepaid wallet top-ups of $5, $10, $20 or $50</li></ul>
        <h2 className="dg-h3b" style={{ marginTop: 36 }}>Available today</h2>
        <ul className="dg-ticks">{live.map((x) => <li key={x}>{x}</li>)}</ul>
        <h2 className="dg-h3b" style={{ marginTop: 36 }}>Not available yet (coming soon)</h2>
        <ul className="dg-ticks">{soon.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="dg-para">Company address: 14 Hughes Ste B200, Irvine, CA 92618, USA. Contact: support@digiringo.com.</p>
      </div>
    </section>
  );
}
