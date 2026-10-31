import type { IconName, Status } from "./types";

export interface MenuLink { label: string; href: string; hint?: string; icon?: IconName; status?: Status }
export interface Menu {
  label: string;
  cols: { title: string; links: MenuLink[] }[];
  feature: { title: string; body: string; cta: string; href: string };
  foot?: { text: string; cta: string; href: string };
}

export const MENUS: Menu[] = [
  {
    label: "Product",
    cols: [
      {
        title: "Connect",
        links: [
          { label: "Calling", href: "/product/calling", hint: "HD calls from browser and Android", icon: "phone-call" },
          { label: "Text messaging", href: "/product/messaging", hint: "Two-way business SMS", icon: "message" },
          { label: "Call forwarding", href: "/product/call-forwarding", hint: "Reach your cellphone anywhere", icon: "phone-forwarded" },
          { label: "Call routing", href: "/product/call-routing", hint: "Send each number where it belongs", icon: "route" },
        ],
      },
      {
        title: "Manage",
        links: [
          { label: "Voicemail", href: "/product/voicemail", hint: "Never lose a message", icon: "voicemail" },
          { label: "Call logs", href: "/product/call-analytics/call-logs", hint: "Every call, in one history", icon: "list" },
          { label: "Phone menus", href: "/product/menu-routing", hint: "Press 1 for sales…", icon: "git-branch", status: "soon" },
          { label: "Shared numbers", href: "/product/shared-numbers", hint: "One number, whole team", icon: "users", status: "soon" },
        ],
      },
      {
        title: "Automate",
        links: [
          { label: "Bring your AI agent", href: "/ai-agent", hint: "Route calls to your voice AI", icon: "bot", status: "beta" },
          { label: "AI features", href: "/product/ai", hint: "Summaries, receptionist and more", icon: "sparkles" },
          { label: "Integrations", href: "/integrations", hint: "CRM, Slack, Zapier", icon: "plug", status: "soon" },
          { label: "Developers", href: "/developers", hint: "Webhooks and SIP routing", icon: "code", status: "beta" },
        ],
      },
    ],
    feature: { title: "Set up your number", body: "Local, toll-free or international — live in about a minute.", cta: "Choose a number", href: "/phone-numbers" },
    foot: { text: "See every product area in one place.", cta: "All features →", href: "/product" },
  },
  {
    label: "Solutions",
    cols: [
      {
        title: "By industry",
        links: [
          { label: "Home services", href: "/solutions/home-services", icon: "wrench" },
          { label: "Law firms", href: "/solutions/law-firms", icon: "scale" },
          { label: "Property management", href: "/solutions/property-management", icon: "building" },
          { label: "Healthcare", href: "/solutions/healthcare", icon: "stethoscope" },
          { label: "Education", href: "/solutions/education", icon: "graduation" },
          { label: "Construction", href: "/solutions/construction", icon: "truck" },
        ],
      },
      {
        title: "By company size",
        links: [
          { label: "Startups", href: "/solutions/startups", icon: "rocket" },
          { label: "Small business", href: "/solutions/small-business", icon: "store" },
          { label: "Franchise", href: "/solutions/franchise", icon: "briefcase" },
        ],
      },
      {
        title: "By use case",
        links: [
          { label: "Sales", href: "/solutions/sales", icon: "dollar" },
          { label: "Support", href: "/solutions/support", icon: "headphones" },
          { label: "Operations", href: "/solutions/operations", icon: "settings" },
          { label: "Answering service", href: "/answering-service", icon: "phone-incoming", status: "beta" },
        ],
      },
    ],
    feature: { title: "Compare DIGIRINGO", body: "See how we stack up against Google Voice, RingCentral and others.", cta: "Compare", href: "/compare" },
  },
  {
    label: "Resources",
    cols: [
      {
        title: "Learn",
        links: [
          { label: "Blog", href: "/blog", icon: "file" },
          { label: "Product tour", href: "/demo", icon: "monitor" },
          { label: "Templates", href: "/templates", icon: "list" },
          { label: "Free tools", href: "/tools", icon: "wrench" },
          { label: "Customers", href: "/customers", icon: "heart" },
        ],
      },
      {
        title: "Numbers & rates",
        links: [
          { label: "Local numbers", href: "/local-numbers", icon: "map-pin" },
          { label: "Toll-free numbers", href: "/toll-free-numbers", icon: "phone" },
          { label: "Vanity numbers", href: "/vanity-number", icon: "hash" },
          { label: "International rates", href: "/rates", icon: "globe" },
          { label: "Downloads", href: "/downloads", icon: "smartphone" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about", icon: "building" },
          { label: "Careers", href: "/careers", icon: "briefcase" },
          { label: "Press", href: "/press", icon: "send" },
          { label: "Contact us", href: "/contact", icon: "message" },
          { label: "System status", href: "/status", icon: "zap" },
        ],
      },
    ],
    feature: { title: "Free business tools", body: "Missed-call cost calculator, VoIP savings, greeting scripts and more.", cta: "Open tools", href: "/tools" },
  },
];

export const FOOTER_COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Calling", href: "/product/calling" },
      { label: "Text messaging", href: "/product/messaging" },
      { label: "Call forwarding", href: "/product/call-forwarding" },
      { label: "Call routing", href: "/product/call-routing" },
      { label: "Voicemail", href: "/product/voicemail" },
      { label: "Bring your AI agent", href: "/ai-agent" },
      { label: "Answering service", href: "/answering-service" },
      { label: "All features", href: "/product" },
    ],
  },
  {
    title: "Numbers",
    links: [
      { label: "Phone numbers", href: "/phone-numbers" },
      { label: "Local numbers", href: "/local-numbers" },
      { label: "Toll-free numbers", href: "/toll-free-numbers" },
      { label: "Canadian numbers", href: "/phone-numbers/canada" },
      { label: "Vanity numbers", href: "/vanity-number" },
      { label: "International rates", href: "/rates" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Compare", href: "/compare" },
      { label: "Free tools", href: "/tools" },
      { label: "Templates", href: "/templates" },
      { label: "Integrations", href: "/integrations" },
      { label: "Developers", href: "/developers" },
      { label: "Downloads", href: "/downloads" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact us", href: "/contact" },
      { label: "Security", href: "/security" },
      { label: "System status", href: "/status" },
      { label: "All pages", href: "/sitemap" },
    ],
  },
];
