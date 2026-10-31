/**
 * Page schema for the data-driven marketing pages. A page is a list of typed
 * blocks rendered top-to-bottom by `PageRenderer`; content lives in plain data
 * files under src/site/content/pages/*, so copy can change without touching
 * layout.
 *
 * `status` is honesty plumbing: "soon" pages and items show a "Coming soon"
 * badge and swap the sign-up CTA for "Get notified" (→ /contact?topic=…).
 */
export type Status = "live" | "beta" | "soon";

/** Screenshot keys (public/shots/*.png), shown inside a phone frame. */
export type Shot =
  | "home" | "numbers" | "buy" | "inbox" | "chat" | "calls" | "dialer" | "wallet" | "settings" | "activity";

/** Icon names the renderer knows (lucide). Unknown names fall back to a dot. */
export type IconName =
  | "phone" | "phone-call" | "phone-forwarded" | "phone-incoming" | "phone-outgoing" | "phone-missed"
  | "message" | "messages" | "inbox" | "voicemail" | "mic" | "headphones" | "users" | "user" | "building"
  | "globe" | "map-pin" | "hash" | "clock" | "calendar" | "shield" | "lock" | "zap" | "bot" | "sparkles"
  | "wallet" | "credit-card" | "dollar" | "chart" | "list" | "settings" | "route" | "git-branch" | "bell"
  | "smartphone" | "laptop" | "monitor" | "plug" | "code" | "webhook" | "check" | "star" | "heart"
  | "briefcase" | "home" | "wrench" | "truck" | "stethoscope" | "scale" | "graduation" | "store" | "rocket"
  | "file" | "search" | "refresh" | "music" | "pause" | "volume" | "moon" | "tag" | "repeat" | "send";

export interface Item {
  title: string;
  body?: string;
  icon?: IconName;
  status?: Status;
  href?: string;
  bullets?: string[];
}

export interface Faq { q: string; a: string }
export interface LinkRef { label: string; href: string }

export type Tone = "plain" | "tint" | "dark" | "brand";

export type Block =
  | {
      type: "hero";
      eyebrow?: string;
      h1: string;
      sub: string;
      bullets?: string[];
      shot?: Shot;
      /** "split" = text left / phone right (default); "center" = centred, no visual. */
      layout?: "split" | "center";
      primary?: LinkRef;
      secondary?: LinkRef;
    }
  /** Thin "what this is" block: heading + paragraphs, optional phone visual. */
  | { type: "definition"; title: string; paragraphs: string[]; shot?: Shot; tone?: Tone }
  /** Numbered steps (1, 2, 3…). */
  | { type: "steps"; title: string; intro?: string; items: Item[]; tone?: Tone }
  /** Grid of cards; `cols` 2–4. */
  | { type: "cards"; eyebrow?: string; title: string; intro?: string; items: Item[]; cols?: 2 | 3 | 4; tone?: Tone }
  /** Alternating text/screenshot rows. */
  | { type: "flex"; title?: string; intro?: string; rows: (Item & { shot?: Shot })[]; tone?: Tone }
  /** Long-form sub-sections (title + paragraph), two columns on desktop. */
  | { type: "longform"; title: string; intro?: string; items: Item[]; tone?: Tone }
  /** Comparison or data table. Cells: "yes" / "no" / "soon" render as icons. */
  | { type: "table"; title: string; intro?: string; head: string[]; rows: string[][]; note?: string; tone?: Tone }
  /** Tabbed groups of mini features. */
  | { type: "tabs"; title: string; intro?: string; tabs: { name: string; items: Item[] }[]; tone?: Tone }
  /** Accordion of expandable items (title + body). */
  | { type: "accordion"; title: string; intro?: string; items: Item[]; tone?: Tone }
  /** Flat banner with one line and a button. */
  | { type: "cta"; title: string; body?: string; button?: LinkRef; tone?: Tone }
  | { type: "faq"; title?: string; items: Faq[] }
  /** Pill links (sibling pages, area codes…). */
  | { type: "chips"; title: string; intro?: string; links: LinkRef[]; tone?: Tone }
  /** Highlighted single statement (no invented quotes — use for facts/promises). */
  | { type: "callout"; title: string; body: string; tone?: Tone }
  /** Interactive widgets with their own components. */
  | { type: "widget"; widget: WidgetName; props?: Record<string, string | number | boolean> };

export type WidgetName =
  | "number-search" | "country-rates" | "rates-table" | "voip-calculator" | "missed-call-calculator"
  | "number-generator" | "voicemail-generator" | "greeting-generator" | "click-to-call" | "click-to-text";

export interface PageDoc {
  path: string;
  /** <title> and meta description. */
  title: string;
  description: string;
  /** Breadcrumb trail above the hero, e.g. [{label:"Product",href:"/product"},{label:"Messaging",href:"/product/messaging"}]. */
  crumbs?: LinkRef[];
  status?: Status;
  sections: Block[];
  /** Paths of related pages, shown as cards before the closing band. */
  related?: string[];
}
