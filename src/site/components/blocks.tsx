import { lazy, Suspense, useState, type ComponentType, type LazyExoticComponent, type ReactNode } from "react";
import { ArrowRight, Check, ChevronDown, Clock3, Minus } from "lucide-react";
import type { Block, Faq, Item, LinkRef, Shot, Status, Tone, WidgetName } from "../content/types";
import { Link } from "../router";
import { Icon } from "./Icon";
import { PhoneFrame } from "./PhoneFrame";
import { Reveal } from "./Reveal";

/* ---------------------------------------------------------------- helpers */

export function StatusBadge({ status }: { status?: Status }) {
  if (!status || status === "live") return null;
  return <span className={`dg-status dg-status-${status}`}>{status === "soon" ? "Coming soon" : "Beta"}</span>;
}

/** Internal links go through the router; external ones open in a new tab. */
export function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (/^https?:|^mailto:|^tel:|^sms:|^\/app/.test(href)) {
    const ext = /^https?:/.test(href);
    return <a href={href} className={className} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>{children}</a>;
  }
  return <Link to={href} className={className}>{children}</Link>;
}

export function Btn({ link, variant = "primary", size }: { link: LinkRef; variant?: "primary" | "ghost"; size?: "sm" | "lg" }) {
  return (
    <SmartLink href={link.href} className={`dg-btn dg-btn-${variant}${size ? ` dg-btn-${size}` : ""}`}>
      {link.label}
    </SmartLink>
  );
}

const shotSrc = (s?: Shot) => (s ? `/shots/${s}.png` : undefined);

function Section({ tone = "plain", id, children, tight }: { tone?: Tone; id?: string; children: ReactNode; tight?: boolean }) {
  return (
    <section id={id} className={`dg-block dg-tone-${tone}${tight ? " tight" : ""}`}>
      <div className="dg-wrap">{children}</div>
    </section>
  );
}

function Head({ eyebrow, title, intro, center = true }: { eyebrow?: string; title?: string; intro?: string; center?: boolean }) {
  if (!title && !intro) return null;
  return (
    <Reveal>
      <div className={`dg-block-head${center ? " center" : ""}`}>
        {eyebrow && <span className="dg-eyebrow">{eyebrow}</span>}
        {title && <h2 className="dg-h2b">{title}</h2>}
        {intro && <p className="dg-lead-b">{intro}</p>}
      </div>
    </Reveal>
  );
}

function ItemBody({ item }: { item: Item }) {
  return (
    <>
      {item.body && <p className="dg-item-body">{item.body}</p>}
      {item.bullets && item.bullets.length > 0 && (
        <ul className="dg-ticks">
          {item.bullets.map((b) => <li key={b}><Check size={16} />{b}</li>)}
        </ul>
      )}
    </>
  );
}

function Card({ item, i }: { item: Item; i: number }) {
  const inner = (
    <>
      {item.icon && <div className="dg-card-icon sm"><Icon name={item.icon} /></div>}
      <h3 className="dg-item-title">{item.title} <StatusBadge status={item.status} /></h3>
      <ItemBody item={item} />
      {item.href && <span className="dg-more">Learn more <ArrowRight size={15} /></span>}
    </>
  );
  return (
    <Reveal delay={Math.min(i, 6) * 50}>
      {item.href ? <Link to={item.href} className="dg-card dg-card-b link">{inner}</Link> : <div className="dg-card dg-card-b">{inner}</div>}
    </Reveal>
  );
}

/* ---------------------------------------------------------------- FAQ */

export function FaqList({ items, title = "Frequently asked questions" }: { items: Faq[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="dg-faq-b">
      <Head title={title} />
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {items.map((f, i) => (
          <div key={f.q} className={`dg-faq-item${open === i ? " open" : ""}`}>
            <button className="dg-faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              {f.q}
              <ChevronDown className="chev" size={20} />
            </button>
            <div className="dg-faq-a"><p>{f.a}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- table cells */

function Cell({ v }: { v: string }) {
  const t = v.trim().toLowerCase();
  if (t === "yes") return <span className="dg-cell-yes" aria-label="Yes"><Check size={18} /></span>;
  if (t === "no") return <span className="dg-cell-no" aria-label="No"><Minus size={18} /></span>;
  if (t === "soon") return <span className="dg-cell-soon"><Clock3 size={14} /> Soon</span>;
  return <>{v}</>;
}

/* ---------------------------------------------------------------- widgets */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WIDGETS: Record<WidgetName, LazyExoticComponent<ComponentType<any>>> = {
  "number-search": lazy(() => import("../widgets/NumberSearch")),
  "country-rates": lazy(() => import("../widgets/CountryRatesWidget")),
  "rates-table": lazy(() => import("../widgets/RatesTable")),
  "voip-calculator": lazy(() => import("../widgets/VoipCalculator")),
  "missed-call-calculator": lazy(() => import("../widgets/MissedCallCalculator")),
  "number-generator": lazy(() => import("../widgets/NumberGenerator")),
  "voicemail-generator": lazy(() => import("../widgets/GreetingGenerator")),
  "greeting-generator": lazy(() => import("../widgets/GreetingGenerator")),
  "click-to-call": lazy(() => import("../widgets/ClickLink")),
  "click-to-text": lazy(() => import("../widgets/ClickLink")),
};

export function Widget({ widget, props = {} }: { widget: WidgetName; props?: Record<string, string | number | boolean> }) {
  const C = WIDGETS[widget];
  if (!C) return null;
  const extra = widget === "click-to-text" ? { mode: "sms" } : widget === "voicemail-generator" ? { mode: "voicemail" } : widget === "greeting-generator" ? { mode: "menu" } : {};
  return (
    <Suspense fallback={<div className="dg-widget-loading" />}>
      <C {...extra} {...props} />
    </Suspense>
  );
}

/* ---------------------------------------------------------------- blocks */

export function BlockView({ block, pageStatus }: { block: Block; pageStatus?: Status }) {
  switch (block.type) {
    case "hero": {
      const soon = pageStatus === "soon";
      const primary = soon
        ? { label: "Get notified", href: `/contact?topic=${encodeURIComponent(block.h1)}` }
        : block.primary ?? { label: "Get your number", href: "/app" };
      const secondary = block.secondary ?? { label: "See pricing", href: "/pricing" };
      const center = block.layout === "center" || !block.shot;
      return (
        <section className={`dg-hero-b${center ? " center" : ""}`}>
          <div className="dg-wrap">
            <div className={center ? "dg-hero-b-center" : "dg-hero-b-grid"}>
              <div>
                <Reveal>
                  <div className="dg-hero-b-tags">
                    {block.eyebrow && <span className="dg-eyebrow">{block.eyebrow}</span>}
                    <StatusBadge status={pageStatus} />
                  </div>
                </Reveal>
                <Reveal delay={60}><h1 className="dg-h1b">{block.h1}</h1></Reveal>
                <Reveal delay={120}><p className="dg-lead-b hero">{block.sub}</p></Reveal>
                {block.bullets && block.bullets.length > 0 && (
                  <Reveal delay={160}>
                    <ul className="dg-ticks hero">
                      {block.bullets.map((b) => <li key={b}><Check size={17} />{b}</li>)}
                    </ul>
                  </Reveal>
                )}
                <Reveal delay={200}>
                  <div className="dg-hero-b-cta">
                    <Btn link={primary} size="lg" />
                    <Btn link={secondary} variant="ghost" size="lg" />
                  </div>
                </Reveal>
              </div>
              {!center && (
                <Reveal delay={120}>
                  <div className="dg-hero-b-visual"><PhoneFrame src={shotSrc(block.shot)} /></div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      );
    }

    case "definition":
      return (
        <Section tone={block.tone ?? "tint"}>
          <div className={block.shot ? "dg-split" : "dg-narrow"}>
            {block.shot && <Reveal><div className="dg-split-visual"><PhoneFrame src={shotSrc(block.shot)} glow={false} /></div></Reveal>}
            <Reveal>
              <div>
                <h2 className="dg-h2b">{block.title}</h2>
                {block.paragraphs.map((p, i) => <p key={i} className="dg-para">{p}</p>)}
              </div>
            </Reveal>
          </div>
        </Section>
      );

    case "steps":
      return (
        <Section tone={block.tone ?? "plain"}>
          <Head title={block.title} intro={block.intro} />
          <div className={`dg-steps n${Math.min(block.items.length, 4)}`}>
            {block.items.map((it, i) => (
              <Reveal key={it.title} delay={i * 70}>
                <div className="dg-step">
                  <span className="dg-step-n">{i + 1}</span>
                  <h3 className="dg-item-title">{it.title} <StatusBadge status={it.status} /></h3>
                  <ItemBody item={it} />
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      );

    case "cards":
      return (
        <Section tone={block.tone ?? "plain"}>
          <Head eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <div className={`dg-grid dg-grid-${block.cols ?? (block.items.length % 3 === 0 ? 3 : block.items.length === 4 ? 4 : 3)}`}>
            {block.items.map((it, i) => <Card key={it.title + i} item={it} i={i} />)}
          </div>
        </Section>
      );

    case "flex":
      return (
        <Section tone={block.tone ?? "plain"}>
          <Head title={block.title} intro={block.intro} />
          <div className="dg-flex-rows">
            {block.rows.map((r, i) => (
              <div key={r.title} className={`dg-split${i % 2 ? " rev" : ""}`}>
                <Reveal>
                  <div className="dg-split-visual">
                    {r.shot ? <PhoneFrame src={shotSrc(r.shot)} glow={false} /> : <div className="dg-icon-tile"><Icon name={r.icon ?? "sparkles"} size={56} /></div>}
                  </div>
                </Reveal>
                <Reveal delay={80}>
                  <div>
                    <h3 className="dg-h3b">{r.title} <StatusBadge status={r.status} /></h3>
                    <ItemBody item={r} />
                    {r.href && <Link to={r.href} className="dg-more">Learn more <ArrowRight size={15} /></Link>}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </Section>
      );

    case "longform":
      return (
        <Section tone={block.tone ?? "plain"}>
          <Head title={block.title} intro={block.intro} />
          <div className="dg-longform">
            {block.items.map((it, i) => (
              <Reveal key={it.title} delay={(i % 2) * 60}>
                <div>
                  <h3 className="dg-item-title">{it.icon && <span className="dg-inline-ic"><Icon name={it.icon} size={18} /></span>}{it.title} <StatusBadge status={it.status} /></h3>
                  <ItemBody item={it} />
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      );

    case "table":
      return (
        <Section tone={block.tone ?? "plain"}>
          <Head title={block.title} intro={block.intro} />
          <Reveal>
            <div className="dg-table-wrap">
              <table className="dg-table">
                <thead><tr>{block.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                <tbody>
                  {block.rows.map((r, i) => (
                    <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}><Cell v={c} /></td>))}</tr>
                  ))}
                </tbody>
              </table>
            </div>
            {block.note && <p className="dg-note">{block.note}</p>}
          </Reveal>
        </Section>
      );

    case "tabs":
      return <TabsBlock block={block} />;

    case "accordion":
      return <AccordionBlock block={block} />;

    case "cta":
      return (
        <Section tone={block.tone ?? "plain"} tight>
          <Reveal>
            <div className="dg-flat-cta">
              <div>
                <h3 className="dg-h3b">{block.title}</h3>
                {block.body && <p className="dg-item-body">{block.body}</p>}
              </div>
              <Btn link={block.button ?? { label: "See pricing", href: "/pricing" }} />
            </div>
          </Reveal>
        </Section>
      );

    case "faq":
      return <Section tone="plain"><FaqList items={block.items} title={block.title} /></Section>;

    case "chips":
      return (
        <Section tone={block.tone ?? "tint"}>
          <Head title={block.title} intro={block.intro} />
          <div className="dg-chips center">
            {block.links.map((l) => <Link key={l.href} to={l.href} className="dg-chip link">{l.label}</Link>)}
          </div>
        </Section>
      );

    case "callout":
      return (
        <Section tone={block.tone ?? "brand"} tight>
          <Reveal>
            <div className="dg-callout">
              <h3 className="dg-h3b">{block.title}</h3>
              <p>{block.body}</p>
            </div>
          </Reveal>
        </Section>
      );

    case "widget":
      return <Section tone="plain"><Widget widget={block.widget} props={block.props} /></Section>;
  }
}

function TabsBlock({ block }: { block: Extract<Block, { type: "tabs" }> }) {
  const [tab, setTab] = useState(0);
  const cur = block.tabs[tab] ?? block.tabs[0];
  return (
    <Section tone={block.tone ?? "plain"}>
      <Head title={block.title} intro={block.intro} />
      <div className="dg-tabs">
        <div className="dg-tab-list" role="tablist">
          {block.tabs.map((t, i) => (
            <button key={t.name} role="tab" aria-selected={i === tab} className={`dg-tab${i === tab ? " on" : ""}`} onClick={() => setTab(i)}>
              {t.name}
            </button>
          ))}
        </div>
        <div className="dg-tab-panel" role="tabpanel">
          {cur?.items.map((it) => (
            <div key={it.title} className="dg-mini">
              {it.icon && <span className="dg-inline-ic"><Icon name={it.icon} size={18} /></span>}
              <div>
                <h4>{it.href ? <Link to={it.href}>{it.title}</Link> : it.title} <StatusBadge status={it.status} /></h4>
                {it.body && <p>{it.body}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function AccordionBlock({ block }: { block: Extract<Block, { type: "accordion" }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section tone={block.tone ?? "plain"}>
      <Head title={block.title} intro={block.intro} />
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {block.items.map((it, i) => (
          <div key={it.title} className={`dg-faq-item${open === i ? " open" : ""}`}>
            <button className="dg-faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span>{it.title} <StatusBadge status={it.status} /></span>
              <ChevronDown className="chev" size={20} />
            </button>
            <div className="dg-faq-a"><div style={{ padding: "0 4px 24px" }}><ItemBody item={it} /></div></div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- shared bands */

/** Closing "ready to get started" band — 3 cards, used at the end of most pages. */
export function ReadyBand({ title = "Ready to get started?" }: { title?: string }) {
  const cards: (Item & { href: string })[] = [
    { title: "Choose a number", body: "Local, toll-free or international — pick one in under a minute.", icon: "hash", href: "/phone-numbers" },
    { title: "See it in action", body: "A quick tour of calling, texting and routing in the app.", icon: "monitor", href: "/demo" },
    { title: "View pricing", body: "Pay as you go. No contracts, no per-user fees.", icon: "wallet", href: "/pricing" },
  ];
  return (
    <section className="dg-block dg-tone-plain">
      <div className="dg-wrap">
        <Head title={title} />
        <div className="dg-grid dg-grid-3">
          {cards.map((c, i) => <Card key={c.title} item={c} i={i} />)}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: LinkRef[] }) {
  return (
    <nav className="dg-crumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {crumbs.map((c) => (
        <span key={c.href}><span className="sep">/</span><Link to={c.href}>{c.label}</Link></span>
      ))}
    </nav>
  );
}
