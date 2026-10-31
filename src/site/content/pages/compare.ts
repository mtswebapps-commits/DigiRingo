import type { PageDoc, Block, Item, Faq, Shot } from "../types";

/**
 * Comparison pages. Competitor details were checked in October 2026 on each
 * competitor's own public site (pricing / features pages). Anything we could
 * not confirm there is written as "Check current plans" instead of guessed.
 * DIGIRINGO cells follow digiringo-facts.md: not-yet-built features are "soon".
 */

const CHECK = "Check current plans";

/** Row labels + the DIGIRINGO cell for each (single source of truth). */
const R = {
  payg: ["Pay as you go, no monthly plan required", "yes"],
  seats: ["No per-user (seat) fees", "yes"],
  local: ["US local numbers", "yes"],
  tollfree: ["Toll-free numbers", "yes"],
  intl: ["Phone numbers in other countries", "yes"],
  browser: ["Call and text from a web browser", "yes"],
  android: ["Android app", "yes"],
  ios: ["iPhone app", "soon"],
  desktop: ["Desktop app (Windows / Mac)", "soon"],
  sms: ["Two-way business texting (SMS)", "yes"],
  mms: ["MMS / picture messages", "soon"],
  forward: ["Forward unanswered calls to a cellphone", "yes"],
  aiagent: ["Send a number's calls to your own AI agent (SIP / webhook)", "yes"],
  ivr: ["Phone menu (IVR / auto attendant)", "soon"],
  recording: ["Call recording", "soon"],
  vmtext: ["Voicemail transcription", "soon"],
  ringgroups: ["Ring groups across team members", "soon"],
  aisummary: ["AI call summaries / transcripts", "soon"],
  crm: ["CRM integrations", "soon"],
  porting: ["Number porting", "soon"],
  video: ["Video meetings", "no"],
  deskphones: ["Desk phone support", "no"],
  autoreply: ["Missed-call auto-reply texts", "soon"],
} as const;

type RowKey = keyof typeof R;

interface Competitor {
  note?: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  sub: string;
  bullets: string[];
  shot: Shot;
  summary: string[];
  rows: [RowKey, string][];
  digiWins: Item[];
  theyWin: Item[];
  pricing: Item[];
  switchTip: string;
  faq: Faq[];
  related: string[];
}

const DIGI_PRICE: Item = {
  title: "DIGIRINGO",
  icon: "wallet",
  body:
    "A US local number is $2.50 a month and toll-free numbers start at $2.50 a month. Calls within the US and Canada are $0.015 a minute and texts are $0.015 each. You top up a prepaid wallet ($5, $10, $20 or $50) and usage comes out of it. No contract, and adding people does not add seat fees. International rates are listed per country on the rates page.",
};

function comparePage(c: Competitor): PageDoc {
  const sections: Block[] = [
    {
      type: "hero",
      eyebrow: "Compare",
      h1: `DIGIRINGO vs ${c.name}`,
      sub: c.sub,
      bullets: c.bullets,
      shot: c.shot,
      primary: { label: "Get your number", href: "/app" },
      secondary: { label: "See pricing", href: "/pricing" },
    },
    { type: "definition", title: `${c.name} and DIGIRINGO, in short`, paragraphs: c.summary },
    {
      type: "table",
      title: "Feature by feature",
      intro: `What each service offers today. "Soon" means DIGIRINGO is building it and it is not available yet.`,
      head: ["Features", "DIGIRINGO", c.name],
      rows: c.rows.map(([k, theirs]) => [R[k][0], R[k][1], theirs]),
      note: c.note ?? `Competitor details checked October 2026 from ${c.name}'s public site; plans change — verify before buying.`,
      tone: "tint",
    },
    {
      type: "cards",
      eyebrow: "Where DIGIRINGO fits",
      title: `When DIGIRINGO is the better fit than ${c.name}`,
      items: c.digiWins,
      cols: c.digiWins.length === 4 ? 4 : 3,
    },
    {
      type: "cards",
      eyebrow: "Being fair",
      title: `When ${c.name} is the better pick`,
      intro: "No phone service is right for everyone. These are the cases where we would point you the other way.",
      items: c.theyWin,
      cols: c.theyWin.length === 2 ? 2 : 3,
      tone: "tint",
    },
    {
      type: "longform",
      title: "How the pricing works",
      intro: "Prices below are as listed in October 2026. Taxes and carrier fees are extra on most services, including ours.",
      items: c.pricing,
    },
    {
      type: "steps",
      title: `How to switch from ${c.name}`,
      intro:
        "Moving an existing number into DIGIRINGO (porting) is coming soon. Until then, most people run both side by side for a while.",
      items: [
        { title: "Get a DIGIRINGO number", body: "Sign up at digiringo.com/app, search by area code or country, and buy a number. Local US numbers are usually ready in a minute.", icon: "hash" },
        { title: "Top up your wallet", body: "Add $5 to $50 by card. Calls and texts draw from the balance, so you can test everything before you commit.", icon: "wallet" },
        { title: `Forward your ${c.name} number`, body: c.switchTip, icon: "phone-forwarded" },
        { title: "Update the places customers find you", body: "Swap the new number into your website, Google listing and email signature. Keep the old one forwarding until porting arrives, then bring it over.", icon: "refresh" },
      ],
      tone: "plain",
    },
    {
      type: "cta",
      title: "Try DIGIRINGO with a $5 top-up",
      body: "One number, a few dollars of credit, and you can call and text from your browser today.",
      button: { label: "Get your number", href: "/app" },
      tone: "dark",
    },
    { type: "faq", title: `DIGIRINGO vs ${c.name}: common questions`, items: c.faq },
  ];
  return {
    path: `/compare/digiringo-vs-${c.slug}`,
    title: c.title,
    description: c.description,
    crumbs: [{ label: "Compare", href: "/compare" }],
    status: "live",
    sections,
    related: c.related,
  };
}

const COMPETITORS: Competitor[] = [
  // ───────────────────────────────── Google Voice
  {
    slug: "google-voice",
    name: "Google Voice",
    title: "DIGIRINGO vs Google Voice: Honest Comparison | DIGIRINGO",
    description:
      "Google Voice or DIGIRINGO? Compare per-user Workspace pricing with pay-as-you-go numbers, international numbers, texting, forwarding and AI agent routing.",
    sub: "Google Voice makes sense if your team already runs on Google Workspace. DIGIRINGO is for people who want a business number without a per-user subscription, including numbers outside the US.",
    bullets: [
      "No Workspace plan needed: pay for numbers and usage only",
      "Local numbers in the US, Canada and many other countries",
      "Route any number to your own AI agent or webhook",
    ],
    shot: "dialer",
    summary: [
      "Google Voice is Google's business phone service. Most of its plans are added on top of a Google Workspace subscription and billed per user, and calls and texts show up in Gmail and the Voice apps. A single-user Starter option is also sold on its own for US users.",
      "DIGIRINGO works on a prepaid wallet instead. You buy a number, add credit, and pay by the minute and by the message. There is no seat count and no productivity suite to buy first. You call and text from the web app or the Android app, and incoming calls ring every device you are signed in on.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["intl", CHECK],
      ["browser", "yes"],
      ["ios", "yes"],
      ["sms", "yes"],
      ["aiagent", CHECK],
      ["ivr", "Standard plan and up"],
      ["recording", "Standard plan and up"],
      ["vmtext", "yes"],
      ["deskphones", "yes"],
    ],
    digiWins: [
      { title: "No suite to buy first", icon: "wallet", body: "You do not need a Workspace subscription. A number and a small top-up are enough to start taking calls." },
      { title: "Numbers beyond the US", icon: "globe", body: "Pick local numbers in Canada and many other countries, each priced up front before you buy." },
      { title: "Bring your own AI agent", icon: "bot", body: "Point a number at your SIP or AI voice agent, or at your own webhook, and calls go straight there." },
      { title: "Light use stays cheap", icon: "dollar", body: "If a line only gets a handful of calls a month, you pay for those minutes, not a monthly seat." },
    ],
    theyWin: [
      { title: "Your team lives in Gmail", icon: "inbox", body: "Calls, voicemail and texts inside Gmail and Calendar are hard to beat if Google Workspace is already home base." },
      { title: "You need menus and recording now", icon: "list", body: "Google Voice Standard lists auto attendants, ring groups and on-demand recording. On DIGIRINGO these are still coming." },
      { title: "iPhone apps and desk phones", icon: "smartphone", body: "Google Voice has mobile apps for iOS and Android and supports certain desk phones. DIGIRINGO has Android and a web app for now." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Google Voice", icon: "credit-card", body: "Listed at $10, $20 and $30 per user per month for Starter, Standard and Premier. Most plans are added to a Google Workspace subscription, which is billed separately. Check Google's current pricing page before deciding." },
    ],
    switchTip: "Set Google Voice to forward incoming calls to your new DIGIRINGO number (check Google's help pages for the exact setting on your plan). Callers keep dialing the number they know.",
    faq: [
      { q: "Do I need Google Workspace to use DIGIRINGO?", a: "No. DIGIRINGO is a separate service. You sign up with an email or Google sign-in, buy a number and top up a wallet. Nothing else is required." },
      { q: "Can I bring my Google Voice number to DIGIRINGO?", a: "Number porting is coming soon. Today the usual approach is to get a new DIGIRINGO number and forward your Google Voice number to it, then port once we support it." },
      { q: "Does DIGIRINGO transcribe voicemail like Google Voice?", a: "Not yet. DIGIRINGO records voicemail when nobody answers. Voicemail-to-text is on our list but is not available today." },
      { q: "Can I get a number outside the US?", a: "Yes. DIGIRINGO sells numbers in many countries. Some countries ask for an ID or address document, which the carrier reviews, usually in one to three days." },
      { q: "What does a basic setup cost on DIGIRINGO?", a: "A US local number is $2.50 a month. Calls and texts within the US and Canada are $0.015 per minute or per message, paid from your prepaid wallet." },
    ],
    related: ["/compare/digiringo-vs-openphone", "/compare/digiringo-vs-line2", "/phone-numbers", "/pricing"],
  },

  // ───────────────────────────────── RingCentral
  {
    slug: "ringcentral",
    name: "RingCentral",
    title: "DIGIRINGO vs RingCentral: Honest Comparison | DIGIRINGO",
    description:
      "RingCentral vs DIGIRINGO: a full unified communications suite with per-user plans, or pay-as-you-go business numbers with no seat fees. See the trade-offs.",
    sub: "RingCentral is a large communications platform with phones, meetings, contact center tools and AI add-ons. DIGIRINGO is a lighter option: business numbers, calls and texts, paid as you use them.",
    bullets: [
      "No per-user licence: one wallet covers every number",
      "Calls and texts at $0.015 within the US and Canada",
      "Send calls to your own AI or SIP agent today",
    ],
    shot: "calls",
    summary: [
      "RingCentral's main business phone product, RingEX, is sold per user in tiers. Each tier bundles domestic calling, a set number of texts per user each month, video meetings and, at higher levels, CRM integrations and reporting. AI receptionist and conversation tools are offered as add-ons.",
      "DIGIRINGO is deliberately smaller. It gives you local, toll-free and international numbers, calling from the browser and Android, two-way texting and per-number routing. You pay for numbers and usage from a prepaid balance, with no licences to count.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["tollfree", "yes"],
      ["intl", "yes (add-on)"],
      ["sms", "yes (monthly allowance per user)"],
      ["aiagent", CHECK],
      ["ivr", "yes"],
      ["recording", "yes (on demand)"],
      ["crm", "Advanced plan and up"],
      ["video", "yes"],
      ["porting", CHECK],
    ],
    digiWins: [
      { title: "Small teams, uneven usage", icon: "users", body: "If some people barely use the phone, paying per minute beats paying a full licence for each of them." },
      { title: "No text allowance math", icon: "message", body: "Every text is $0.015 within the US and Canada. There is no per-user bundle to run out of." },
      { title: "Your own AI agent", icon: "bot", body: "Route a number to a voice agent you already built, over SIP or a webhook, without buying an add-on." },
    ],
    theyWin: [
      { title: "You want one vendor for everything", icon: "building", body: "Phones, meetings, webinars and contact center in one account is RingCentral's strength." },
      { title: "Phone menus, recording, CRM today", icon: "list", body: "RingCentral offers auto attendants, call recording and CRM integrations now. DIGIRINGO has them on the roadmap." },
      { title: "Larger or regulated organisations", icon: "shield", body: "Bigger rollouts with admin controls, desk phones and analytics are what RingCentral is built around." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "RingCentral", icon: "credit-card", body: "RingEX was listed at $20, $25 and $35 per user per month billed annually ($30, $35 and $45 monthly) for Core, Advanced and Ultra. Extra local or toll-free numbers, international numbers and AI features are priced as add-ons. Check RingCentral's pricing page for current figures." },
    ],
    switchTip: "In the RingCentral admin portal, forward your main number (or the relevant user's number) to your new DIGIRINGO number. Test a call from your cellphone before you change anything else.",
    faq: [
      { q: "Is DIGIRINGO a full RingCentral replacement?", a: "For many small teams that mainly need numbers, calls and texts, yes. If you rely on phone menus, call recording, meetings or CRM sync today, not yet: those are either coming soon or outside what we offer." },
      { q: "Does DIGIRINGO include video meetings?", a: "No. DIGIRINGO focuses on phone numbers, calling and texting. Use the meeting tool you already like alongside it." },
      { q: "How many texts can I send?", a: "There is no monthly allowance. Each SMS within the US and Canada costs $0.015 from your wallet. US business texting requires a 10DLC registration, which our Trust Center walks you through." },
      { q: "Can I keep my RingCentral number?", a: "Porting into DIGIRINGO is coming soon. For now, forward the RingCentral number to a new DIGIRINGO number and move it over once porting is available." },
    ],
    related: ["/compare/digiringo-vs-vonage", "/compare/digiringo-vs-nextiva", "/compare/digiringo-vs-zoom-phone", "/product/call-routing"],
  },

  // ───────────────────────────────── Vonage
  {
    slug: "vonage",
    name: "Vonage",
    title: "DIGIRINGO vs Vonage: Honest Comparison | DIGIRINGO",
    description:
      "Compare Vonage Business Communications with DIGIRINGO: per-line plans with a virtual receptionist versus prepaid numbers, browser calling and AI routing.",
    sub: "Vonage Business Communications sells per-line plans with a virtual receptionist, desk phone support and team chat. DIGIRINGO keeps it simpler: numbers, calls and texts paid from a wallet.",
    bullets: [
      "No per-line fee: pay per minute and per message",
      "Ring the browser and Android at the same time",
      "Forward to any cellphone if nobody picks up",
    ],
    shot: "home",
    summary: [
      "Vonage Business Communications (VBC) is priced per line in three tiers: Mobile, Premium and Advanced. Its virtual receptionist answers calls with a menu, and higher tiers add desk phone support, video meetings, call groups and on-demand recording. Texting from the mobile app covers the US and Canada.",
      "DIGIRINGO is a pay-as-you-go phone app. You choose a number, top up, and your calls ring the web app and the Android app together. If nobody answers in about 30 seconds, the call goes to your cellphone, then to voicemail.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["intl", CHECK],
      ["browser", CHECK],
      ["android", "yes"],
      ["ios", "yes"],
      ["sms", "yes (US & Canada)"],
      ["ivr", "yes"],
      ["recording", "Advanced plan"],
      ["vmtext", "Advanced plan"],
      ["deskphones", "Premium plan and up"],
    ],
    digiWins: [
      { title: "No per-line bill", icon: "dollar", body: "A second or third number costs $2.50 a month plus usage, not another line subscription." },
      { title: "International numbers", icon: "globe", body: "Buy numbers in other countries from the same account and see each country's price before you pay." },
      { title: "Webhook and SIP routing", icon: "webhook", body: "Developers can send a number's calls to their own app or AI agent today." },
    ],
    theyWin: [
      { title: "You want an auto attendant now", icon: "list", body: "Vonage's virtual receptionist with menus and business-hours routing is available today. Ours is coming soon." },
      { title: "Office desk phones", icon: "phone", body: "If your team uses IP desk phones, Vonage supports them on Premium and above. DIGIRINGO does not." },
      { title: "Recording and transcribed voicemail", icon: "mic", body: "Vonage Advanced lists on-demand recording and visual voicemail with transcription." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Vonage", icon: "credit-card", body: "VBC was listed at $19.99, $29.99 and $39.99 per line per month (Mobile, Premium, Advanced), with promotional discounts for the first year. Vonage notes a one-year minimum for new annual accounts. Check Vonage's pricing page for current offers." },
    ],
    switchTip: "Use call forwarding in the Vonage admin portal or app to send your Vonage line to your new DIGIRINGO number. Leave voicemail on the Vonage side off so callers reach the new setup.",
    faq: [
      { q: "Does DIGIRINGO have a virtual receptionist like Vonage?", a: "Not yet. Phone menus and auto attendants are coming soon. Today you can ring all your devices, forward to a cellphone, take voicemail, or route the number to your own AI agent." },
      { q: "Is there a contract?", a: "No. DIGIRINGO is prepaid. You can stop topping up and release your numbers whenever you like." },
      { q: "Can I use a desk phone with DIGIRINGO?", a: "No. DIGIRINGO runs in the browser and on Android. iPhone users can use the web app in Safari." },
      { q: "Can I text from my business number?", a: "Yes. Two-way SMS works on US and Canada numbers once your 10DLC registration is approved, which takes 1–7 days through our built-in Trust Center." },
    ],
    related: ["/compare/digiringo-vs-ringcentral", "/compare/digiringo-vs-ooma", "/product/call-forwarding", "/pricing"],
  },

  // ───────────────────────────────── Dialpad
  {
    slug: "dialpad",
    name: "Dialpad",
    title: "DIGIRINGO vs Dialpad: Honest Comparison | DIGIRINGO",
    description:
      "Dialpad vs DIGIRINGO: AI-first per-user phone plans compared with pay-as-you-go numbers, browser calling, texting and bring-your-own AI agent routing.",
    sub: "Dialpad leans heavily into AI, with live transcripts and call summaries built into its plans. DIGIRINGO focuses on the basics done cheaply: numbers, calls and texts, with no seat fees.",
    bullets: [
      "Pay per minute instead of per seat",
      "Numbers in the US, Canada and many more countries",
      "Plug in the AI agent you already use",
    ],
    shot: "calls",
    summary: [
      "Dialpad sells several products: Connect for business calling, Sell for outbound sales teams, Support for contact centers and Resolve for AI agents. Connect plans are priced per user and include real-time transcripts and call summaries. Dialpad also lists IVR, call recording, number porting and local numbers in more than 50 countries.",
      "DIGIRINGO does not try to be an AI meeting and calling suite. It gives you a business number that rings your browser and Android phone, two-way texting, forwarding and voicemail. If you have your own AI voice agent, you can point a number at it today.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["intl", "yes"],
      ["browser", "yes"],
      ["sms", "yes"],
      ["aiagent", CHECK],
      ["ivr", "yes"],
      ["recording", "yes"],
      ["aisummary", "yes"],
      ["crm", "Pro plan and up"],
      ["porting", "yes"],
    ],
    digiWins: [
      { title: "You don't need AI on every call", icon: "dollar", body: "If transcripts are not a must, paying $0.015 a minute is usually cheaper than an AI-included seat." },
      { title: "Bring your own agent", icon: "bot", body: "Already built a voice agent elsewhere? Route a DIGIRINGO number to it by SIP or webhook." },
      { title: "One person, many numbers", icon: "hash", body: "Add local numbers for different cities or countries without adding users." },
    ],
    theyWin: [
      { title: "AI transcripts and summaries", icon: "sparkles", body: "Dialpad includes real-time transcripts and recaps today. DIGIRINGO's transcription and summaries are coming soon." },
      { title: "Sales and support teams", icon: "headphones", body: "Power dialers, coaching and contact center routing are part of Dialpad's Sell and Support products." },
      { title: "Port in on day one", icon: "refresh", body: "Dialpad lists number porting. DIGIRINGO porting is still coming." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Dialpad", icon: "credit-card", body: "Dialpad Connect was listed at $15 per user per month (Standard) and $25 (Pro), with Enterprise on custom pricing. Sell and Support plans cost more per user. Check Dialpad's pricing page for current terms." },
    ],
    switchTip: "In Dialpad's settings, forward your number to the new DIGIRINGO number. Ring it from another phone to check the call lands in the DIGIRINGO app and on your Android phone.",
    faq: [
      { q: "Does DIGIRINGO transcribe calls?", a: "Not today. Call transcription, recording and AI summaries are on our roadmap and marked coming soon." },
      { q: "Can I connect my own AI voice agent?", a: "Yes. Each number has a routing setting. Choose SIP agent or webhook, enter your endpoint, and incoming calls go there instead of the app." },
      { q: "Which countries can I get numbers in?", a: "Many. The app shows availability and the monthly price per country before you buy. Some countries need ID or address documents." },
      { q: "Is DIGIRINGO good for a call center?", a: "Not yet. Ring groups, call queues and transfers are coming soon. DIGIRINGO works best today for individuals and small teams." },
    ],
    related: ["/compare/digiringo-vs-aircall", "/compare/digiringo-vs-justcall", "/ai-agent", "/product/ai/voice-agent"],
  },

  // ───────────────────────────────── Grasshopper
  {
    slug: "grasshopper",
    name: "Grasshopper",
    title: "DIGIRINGO vs Grasshopper: Honest Comparison | DIGIRINGO",
    description:
      "Grasshopper or DIGIRINGO? Compare flat monthly virtual phone plans for the US and Canada with pay-as-you-go numbers worldwide, texting and AI routing.",
    sub: "Grasshopper offers flat monthly virtual phone plans for the US and Canada, with extensions and a phone menu. DIGIRINGO charges per number and per use, and sells numbers in many more countries.",
    bullets: [
      "Numbers from $2.50 a month, no plan tier to pick",
      "International numbers and calling to 220+ countries",
      "Call from your browser or Android app",
    ],
    shot: "numbers",
    summary: [
      "Grasshopper is a virtual phone system aimed at solo owners and small teams. Plans are priced per account rather than per user, starting with a single-number, single-extension plan and going up to plans with several numbers and unlimited extensions. Its features page lists call recording, business texting, voicemail transcription and a phone menu. Grasshopper says it is available only in the US and Canada.",
      "DIGIRINGO is closer to a pay-per-use carrier with an app on top. Each number has its own small monthly price, calls and texts are billed as you go, and you can buy numbers in other countries from the same account.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "yes (flat plans)"],
      ["local", "yes"],
      ["tollfree", "yes"],
      ["intl", "no"],
      ["sms", "yes"],
      ["forward", "yes"],
      ["aiagent", CHECK],
      ["ivr", "yes"],
      ["recording", "yes"],
      ["vmtext", "yes"],
      ["autoreply", "yes"],
    ],
    digiWins: [
      { title: "Customers outside North America", icon: "globe", body: "Get local numbers abroad and call 220+ countries at per-country rates." },
      { title: "Several numbers, low cost", icon: "hash", body: "Each extra US number is $2.50 a month. No need to move up a plan tier to get more." },
      { title: "Developer-friendly routing", icon: "code", body: "Send a number's calls to a webhook or SIP agent and control the call yourself." },
    ],
    theyWin: [
      { title: "You want menus and extensions now", icon: "list", body: "Grasshopper's phone menu and extensions are ready to use. DIGIRINGO's are coming soon." },
      { title: "Missed-call text replies", icon: "message", body: "Grasshopper lists instant text responses. Auto-replies on DIGIRINGO are not available yet." },
      { title: "Predictable flat bill", icon: "calendar", body: "If you prefer one fixed monthly price over usage billing, a flat plan may suit you better." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Grasshopper", icon: "credit-card", body: "Grasshopper advertises plans starting at $14 a month. Higher plans add more numbers, extensions and users. Some features, such as the virtual receptionist and international calling, are listed as add-ons. Check Grasshopper's pricing page for the current plan list." },
    ],
    switchTip: "Forward your Grasshopper number (or a specific extension) to your new DIGIRINGO number from Grasshopper's settings. Make a test call before turning off anything on the old account.",
    faq: [
      { q: "Is DIGIRINGO available outside the US and Canada?", a: "Yes. You can buy numbers in many countries and call more than 220. Prices for each country are shown in the app before you buy." },
      { q: "Does DIGIRINGO have extensions?", a: "Not yet. Phone menus, extensions and ring groups are coming soon. Today, each person can have their own number on the same account." },
      { q: "Will my monthly bill change from month to month?", a: "It can, because usage is pay-as-you-go. Your number fees are fixed, and the wallet balance means you never spend more than you have topped up." },
      { q: "Can I keep my Grasshopper number?", a: "Porting is coming soon. Until then, forward it to a DIGIRINGO number so callers reach you in the new app." },
    ],
    related: ["/compare/digiringo-vs-ooma", "/compare/digiringo-vs-line2", "/phone-numbers/multiple-phone-lines", "/rates"],
  },

  // ───────────────────────────────── Line2
  {
    slug: "line2",
    name: "Line2",
    title: "DIGIRINGO vs Line2: Honest Comparison | DIGIRINGO",
    description:
      "Thinking about Line2 for a second business number? See how DIGIRINGO compares: pay-as-you-go numbers, browser calling, texting and international numbers.",
    sub: "Line2 is a long-running second-line app for your phone. DIGIRINGO also gives you a second number, with pay-as-you-go billing, browser calling and numbers in many countries.",
    bullets: [
      "A business number that is not your personal one",
      "Use it in the browser and on Android",
      "Pay for what you use from a prepaid wallet",
    ],
    shot: "dialer",
    summary: [
      "Line2 is an app that adds a second phone number to your smartphone. It is listed on Apple's App Store as a free download with in-app subscription purchases. We could not confirm Line2's current plan details on its own website for this comparison, so where we were unsure, the table says to check their current plans.",
      "DIGIRINGO covers the same basic need, keeping business calls off your personal number, and adds a few things: numbers in other countries, calling from any browser, per-number routing, and a built-in flow for US business texting registration.",
    ],
    rows: [
      ["payg", CHECK],
      ["seats", CHECK],
      ["local", "yes"],
      ["intl", CHECK],
      ["browser", CHECK],
      ["ios", "yes"],
      ["sms", CHECK],
      ["forward", CHECK],
      ["aiagent", CHECK],
      ["ivr", CHECK],
      ["porting", CHECK],
    ],
    digiWins: [
      { title: "No subscription to commit to", icon: "wallet", body: "Top up $5 and you are running. Number fees and usage come out of the balance." },
      { title: "Works from any computer", icon: "laptop", body: "Open digiringo.com/app in a browser and take calls at your desk, no install needed." },
      { title: "Room to grow", icon: "route", body: "Per-number routing lets you send calls to a cellphone, a SIP agent or your own webhook as needs change." },
    ],
    theyWin: [
      { title: "You are on iPhone", icon: "smartphone", body: "Line2 has an iOS app. DIGIRINGO's iPhone app is coming soon; for now iPhone users use our web app in Safari." },
      { title: "You prefer a flat subscription", icon: "calendar", body: "If you would rather pay a fixed fee than track usage, a subscription app may feel simpler." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Line2", icon: "credit-card", body: "Line2's App Store listing shows a free download with in-app subscriptions. We could not verify plan prices on Line2's own site for this page. Check their current plans before you compare." },
    ],
    switchTip: "If your Line2 plan includes call forwarding, point it at your new DIGIRINGO number. Otherwise, start giving out the DIGIRINGO number and keep Line2 until you are ready to move.",
    faq: [
      { q: "Is DIGIRINGO a second number app?", a: "Yes, that is one of the most common uses. You get a separate business number you can call and text from, while your personal number stays private." },
      { q: "Can I use DIGIRINGO on an iPhone?", a: "Yes, through the web app in Safari. A native iPhone app is coming soon." },
      { q: "Do calls use my mobile minutes?", a: "No. DIGIRINGO calls run over the internet (Wi-Fi or mobile data) and are billed at $0.015 a minute within the US and Canada." },
      { q: "What if I stop needing the number?", a: "Release it from the app. There is no contract and no cancellation fee." },
    ],
    related: ["/compare/digiringo-vs-sideline", "/compare/digiringo-vs-google-voice", "/phone-numbers/dedicated", "/blog/best-second-phone-number-apps"],
  },

  // ───────────────────────────────── Sideline
  {
    slug: "sideline",
    name: "Sideline",
    title: "DIGIRINGO vs Sideline: Honest Comparison | DIGIRINGO",
    description:
      "Sideline vs DIGIRINGO for a second number: compare carrier-network calling and group texts with browser calling, international numbers and pay-as-you-go.",
    sub: "Sideline is a second-number app for iPhone and Android that rides on your carrier network. DIGIRINGO is internet-based, works in the browser too, and is billed per use.",
    bullets: [
      "Answer from your laptop as well as your phone",
      "Local numbers abroad, not just in the US",
      "No subscription: top up and pay as you go",
    ],
    shot: "chat",
    summary: [
      "Sideline gives you a second phone number on your existing phone. Its site highlights unlimited SMS, MMS and group messages, auto-replies to missed calls, spam protection, and calling over your carrier's network so you do not need Wi-Fi. It also says you can bring an existing number with you.",
      "DIGIRINGO takes a different route. Calls run over the internet, so the same number rings in a browser tab and in the Android app at once. You pay per minute and per message rather than a subscription, and you can add numbers in other countries.",
    ],
    rows: [
      ["payg", CHECK],
      ["local", "yes"],
      ["intl", CHECK],
      ["browser", "Web messaging"],
      ["ios", "yes"],
      ["android", "yes"],
      ["sms", "yes"],
      ["mms", "yes"],
      ["autoreply", "yes"],
      ["aiagent", CHECK],
      ["porting", "yes"],
    ],
    digiWins: [
      { title: "Desk and phone together", icon: "laptop", body: "Calls ring the browser and Android app at the same time, so you can pick up wherever you are." },
      { title: "Multiple countries", icon: "globe", body: "Need a UK or Canadian number next to your US one? Add it to the same account." },
      { title: "Routing options", icon: "route", body: "Send a number to your cell, a SIP agent or a webhook when you outgrow the basics." },
    ],
    theyWin: [
      { title: "Weak Wi-Fi or data", icon: "phone", body: "Sideline calls use your carrier network. If your data connection is often poor, that can matter." },
      { title: "Picture and group texts", icon: "messages", body: "Sideline offers MMS and group messaging today. On DIGIRINGO both are coming soon." },
      { title: "Port your number now", icon: "refresh", body: "Sideline says you can bring an existing number. DIGIRINGO porting is not available yet." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Sideline", icon: "credit-card", body: "Sideline's public pages did not list plan prices when we checked. Check their current plans in the app or on their site." },
    ],
    switchTip: "If Sideline lets you forward calls on your plan, send them to your new DIGIRINGO number. If not, share the new number with customers and keep Sideline running during the change-over.",
    faq: [
      { q: "Does DIGIRINGO need Wi-Fi?", a: "It needs an internet connection: Wi-Fi or mobile data. Calls do not use your carrier minutes." },
      { q: "Can I send group texts or pictures?", a: "Not yet. DIGIRINGO supports two-way SMS today. MMS and group texting are coming soon." },
      { q: "Can I use the same number on my laptop?", a: "Yes. Sign in at digiringo.com/app and your calls and texts are there, in sync with the Android app." },
      { q: "Is there a free plan?", a: "No. DIGIRINGO is prepaid. A US local number is $2.50 a month and usage is billed from your wallet." },
    ],
    related: ["/compare/digiringo-vs-line2", "/compare/digiringo-vs-google-voice", "/product/messaging/two-way-sms", "/downloads"],
  },

  // ───────────────────────────────── Zoom Phone
  {
    slug: "zoom-phone",
    name: "Zoom Phone",
    title: "DIGIRINGO vs Zoom Phone: Honest Comparison | DIGIRINGO",
    description:
      "Zoom Phone vs DIGIRINGO: per-user calling bundled with Zoom Workplace, or prepaid business numbers with no seat fees. Features and pricing compared fairly.",
    sub: "Zoom Phone fits teams already paying for Zoom Workplace. DIGIRINGO is a standalone, pay-as-you-go option for people who mainly need numbers, calls and texts.",
    bullets: [
      "No Zoom licence needed",
      "Numbers priced per number, not per user",
      "Route calls to your own AI agent or webhook",
    ],
    shot: "dialer",
    summary: [
      "Zoom Phone is Zoom's cloud phone system. It is sold per user, either added to a Zoom Workplace plan or bundled with one. Plans listed on Zoom's pricing page include call recording, unlimited auto attendants, SMS and MMS in the US and Canada, metered international calling, desktop apps for Windows, macOS and Linux, mobile apps, and AI post-call summaries.",
      "DIGIRINGO is not a meetings platform. It is a phone app with a wallet: buy numbers, call and text from the browser or Android, forward to your cell, and route numbers where you want them.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["intl", CHECK],
      ["desktop", "yes"],
      ["ios", "yes"],
      ["sms", "yes (US & Canada)"],
      ["mms", "yes (US & Canada)"],
      ["ivr", "yes"],
      ["recording", "yes"],
      ["aisummary", "yes"],
      ["video", "yes"],
    ],
    digiWins: [
      { title: "You don't use Zoom meetings", icon: "dollar", body: "No need to pay for a meetings bundle just to get a phone number." },
      { title: "Low-volume lines", icon: "phone", body: "A number that only takes a few calls a month costs $2.50 plus those minutes." },
      { title: "Your own AI agent", icon: "bot", body: "Point a number at an AI or SIP agent you run elsewhere, without extra licences." },
    ],
    theyWin: [
      { title: "Your company runs on Zoom", icon: "building", body: "One admin console for meetings, chat and phone is a real benefit at scale." },
      { title: "Desktop apps and AI summaries", icon: "monitor", body: "Zoom Phone has native desktop apps and AI post-call summaries today. On DIGIRINGO both are coming soon." },
      { title: "Menus, recording and MMS", icon: "list", body: "Auto attendants, recording and picture messages are already in Zoom Phone's plans." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Zoom Phone", icon: "credit-card", body: "Zoom listed its US & Canada Unlimited plan at $18 per user per month billed monthly ($16 billed annually), with bundles that include Zoom Workplace at higher prices. Check Zoom's pricing page for current plans." },
    ],
    switchTip: "In the Zoom Phone web portal, set your number to forward to your new DIGIRINGO number. Call it from your cellphone to confirm it rings in the DIGIRINGO app.",
    faq: [
      { q: "Can I use DIGIRINGO for video calls?", a: "No. DIGIRINGO is for phone calls and texts. Keep using your meeting tool of choice for video." },
      { q: "Is there a DIGIRINGO desktop app?", a: "A desktop app is coming soon. Today you use the web app in any modern browser, and you get notifications for incoming calls even when the tab is in the background." },
      { q: "Do you have AI call summaries?", a: "Not yet. AI summaries and transcription are coming soon. If you already have an AI voice agent, you can route calls to it today." },
      { q: "Can I call internationally?", a: "Yes, to 220+ countries. Each country's per-minute rate is listed on our rates page and in the app." },
    ],
    related: ["/compare/digiringo-vs-ringcentral", "/compare/digiringo-vs-dialpad", "/product/calling/call-from-browser", "/rates"],
  },

  // ───────────────────────────────── Aircall
  {
    slug: "aircall",
    name: "Aircall",
    title: "DIGIRINGO vs Aircall: Honest Comparison | DIGIRINGO",
    description:
      "Aircall vs DIGIRINGO: per-licence call center software with a three-licence minimum, or prepaid numbers for one person or a small team. Compared honestly.",
    sub: "Aircall is built for sales and support teams, with a minimum of three licences and hundreds of integrations. DIGIRINGO suits individuals and small teams who want to pay only for what they use.",
    bullets: [
      "Start with one person and one number",
      "No licence minimum, no seat fees",
      "Calls ring your browser and Android together",
    ],
    shot: "calls",
    summary: [
      "Aircall is a cloud phone system for customer-facing teams. Its plans are priced per licence with a minimum of three licences, and include IVR, SMS and MMS (MMS on US, Canada and Australia numbers), call recording and a large integration marketplace. Higher plans add AI call summaries, power dialers and full API access.",
      "DIGIRINGO is for the earlier stage: a solo owner or a few people who need business numbers, calls and texts without a team-software price tag. You can grow into routing and AI agents, but you start with a single number and a small top-up.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["intl", CHECK],
      ["sms", "yes"],
      ["mms", "US, CA & AU numbers"],
      ["aiagent", "AI Voice Agents (paid)"],
      ["ivr", "yes"],
      ["recording", "yes"],
      ["aisummary", "Professional plan"],
      ["crm", "yes"],
      ["ringgroups", CHECK],
    ],
    digiWins: [
      { title: "Teams of one or two", icon: "user", body: "No three-licence minimum. One person can run a business line for a few dollars a month." },
      { title: "Seasonal or part-time lines", icon: "calendar", body: "Keep a number alive at $2.50 a month and only pay for the calls it actually gets." },
      { title: "Agent you already built", icon: "bot", body: "Send calls to your own SIP or AI agent instead of buying agent minutes." },
    ],
    theyWin: [
      { title: "Sales and support teams", icon: "headphones", body: "Queues, dialers, analytics and coaching are Aircall's core. DIGIRINGO's team features are still coming." },
      { title: "You need integrations today", icon: "plug", body: "Aircall lists 250+ integrations. DIGIRINGO integrations are coming soon; per-number webhooks are in beta." },
      { title: "Picture messages", icon: "messages", body: "Aircall supports MMS on some countries' numbers. DIGIRINGO MMS is coming soon." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Aircall", icon: "credit-card", body: "Aircall listed Essentials at $30 and Professional at $50 per licence per month, each with a three-licence minimum, and Enterprise on custom pricing. Extra numbers were listed at $6 a month. Check Aircall's pricing page for current terms." },
    ],
    switchTip: "In the Aircall dashboard, set the number's routing to forward to your new DIGIRINGO number. Place a test call and confirm it reaches the DIGIRINGO app.",
    faq: [
      { q: "Is DIGIRINGO a call center tool?", a: "Not today. It has no queues, transfers or supervisor tools yet. It is a straightforward business phone for individuals and small teams." },
      { q: "Do I need a minimum number of users?", a: "No. One person with one number is a normal DIGIRINGO account." },
      { q: "Does DIGIRINGO connect to my CRM?", a: "CRM integrations are coming soon. Developers can already route calls on a number to their own webhook (beta)." },
      { q: "Can I record calls?", a: "Call recording is coming soon. It is not available yet." },
    ],
    related: ["/compare/digiringo-vs-justcall", "/compare/digiringo-vs-dialpad", "/integrations", "/solutions/small-business"],
  },

  // ───────────────────────────────── Ooma
  {
    slug: "ooma",
    name: "Ooma",
    title: "DIGIRINGO vs Ooma Office: Honest Comparison | DIGIRINGO",
    description:
      "Ooma Office vs DIGIRINGO: per-user plans with a virtual receptionist and desk phones, or prepaid numbers with browser calling and worldwide number choice.",
    sub: "Ooma Office is a small-business phone system with a virtual receptionist and desk phone support. DIGIRINGO is app-first, billed per use, with numbers in many countries.",
    bullets: [
      "No activation fee and no per-user plan",
      "Calling from the browser and Android",
      "International numbers on the same account",
    ],
    shot: "home",
    summary: [
      "Ooma Office has three per-user plans: Essentials, Pro and Pro Plus. Every plan includes a virtual receptionist with greetings and menus, a mobile app, and unlimited calling to the US, Canada, Mexico and Puerto Rico. Pro adds call recording and a text allowance; Pro Plus adds call queues and CRM integration. Ooma advertises no contracts, and its sign-up flow showed a one-time activation fee.",
      "DIGIRINGO skips hardware and plans. You pick numbers, top up a wallet and take calls in the web app or the Android app. If you do not answer, calls forward to your cellphone and then go to voicemail.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["intl", CHECK],
      ["desktop", "Pro plan and up"],
      ["sms", "Pro plan and up"],
      ["ivr", "yes"],
      ["recording", "Pro plan and up"],
      ["crm", "Pro Plus plan"],
      ["porting", "yes"],
      ["deskphones", "yes"],
    ],
    digiWins: [
      { title: "Nothing to install", icon: "laptop", body: "No base station or desk phone. Sign in from a browser and start calling." },
      { title: "Texting priced per message", icon: "message", body: "No monthly text allowance to track; each SMS is $0.015 within the US and Canada." },
      { title: "Numbers abroad", icon: "globe", body: "Add local numbers in other countries alongside your US line." },
    ],
    theyWin: [
      { title: "An auto attendant on every plan", icon: "list", body: "Ooma's virtual receptionist is included from Essentials. DIGIRINGO's phone menus are coming soon." },
      { title: "Desk phones in the office", icon: "phone", body: "If staff want physical phones, Ooma supports them. DIGIRINGO is software only." },
      { title: "Free number transfer now", icon: "refresh", body: "Ooma lists free number transfer. DIGIRINGO porting is not available yet." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Ooma Office", icon: "credit-card", body: "Ooma listed Essentials at $19.95, Pro at $24.95 and Pro Plus at $29.95 per user per month, with no contract. Its sign-up calculator showed a one-time activation fee. Check Ooma's plans page for current pricing." },
    ],
    switchTip: "Set up call forwarding on your Ooma Office number to your new DIGIRINGO number, then call it to make sure the DIGIRINGO app rings.",
    faq: [
      { q: "Do I need any hardware for DIGIRINGO?", a: "No. A browser or an Android phone is enough. iPhone users can use the web app in Safari." },
      { q: "Does DIGIRINGO answer with a menu?", a: "Not yet. Phone menus are coming soon. Today, calls ring all your devices, forward to your cell if unanswered, then go to voicemail." },
      { q: "Can I call Mexico?", a: "Yes. International calls are billed per minute at the rate shown for each country in our rate list." },
      { q: "Is there an activation fee?", a: "No. You pay for the number and your usage. That is it." },
    ],
    related: ["/compare/digiringo-vs-grasshopper", "/compare/digiringo-vs-vonage", "/product/virtual-phone-system", "/pricing"],
  },

  // ───────────────────────────────── Nextiva
  {
    slug: "nextiva",
    name: "Nextiva",
    title: "DIGIRINGO vs Nextiva: Honest Comparison | DIGIRINGO",
    description:
      "Nextiva vs DIGIRINGO: per-user plans with chat, AI and contact center tools, or prepaid business numbers with no seat fees. See where each is the better fit.",
    sub: "Nextiva bundles voice, video, texting, live chat and AI into per-user plans. DIGIRINGO stays focused on numbers, calls and texts with simple pay-as-you-go pricing.",
    bullets: [
      "No 12-month term to get the best price",
      "Pay per minute and per text",
      "Forward to any cellphone, at home or abroad",
    ],
    shot: "inbox",
    summary: [
      "Nextiva's small-business plans (NEXT Core, Engage and Scale) are priced per user and include unlimited voice and video, a monthly text allowance per user, and set amounts of AI transcriptions and summaries. Annual pricing requires a 12-month term. Nextiva also lists auto attendants, call recording, free number porting and the NextivaONE app for Mac, Windows, iOS and Android.",
      "DIGIRINGO has a narrower scope and no term. You buy the numbers you need, top up, and pay for usage. It suits teams that want a business line without a broad communications bundle.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["intl", CHECK],
      ["desktop", "yes"],
      ["ios", "yes"],
      ["sms", "yes (allowance per user)"],
      ["ivr", "yes"],
      ["recording", "yes"],
      ["aisummary", "yes (allowance per plan)"],
      ["porting", "yes"],
      ["video", "yes"],
    ],
    digiWins: [
      { title: "No term commitment", icon: "calendar", body: "There is no annual contract. Stop topping up whenever you like." },
      { title: "Lean phone needs", icon: "phone", body: "If you only need calls and texts, you avoid paying for chat, video and AI you will not use." },
      { title: "International reach", icon: "globe", body: "Buy numbers in other countries and forward calls to cellphones abroad at per-country rates." },
    ],
    theyWin: [
      { title: "One platform for many channels", icon: "messages", body: "Voice, video, live chat and shared inboxes under one vendor is Nextiva's pitch." },
      { title: "Port and record from day one", icon: "mic", body: "Nextiva offers free porting and call recording now. Both are coming soon on DIGIRINGO." },
      { title: "Desktop and iPhone apps", icon: "monitor", body: "NextivaONE runs on Mac, Windows, iOS and Android. DIGIRINGO has a web app and Android." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Nextiva", icon: "credit-card", body: "Nextiva listed NEXT Core at $15, Engage at $25 and Scale at $75 per user per month on annual terms, with higher month-to-month prices for Core and Engage. Check Nextiva's pricing page for current offers." },
    ],
    switchTip: "In the Nextiva admin dashboard, forward the number you want to move to your new DIGIRINGO number. Test with a call from another phone.",
    faq: [
      { q: "Does DIGIRINGO require an annual contract?", a: "No. It is prepaid and month to month by nature. Numbers renew monthly from your wallet." },
      { q: "Can several people share one DIGIRINGO account?", a: "Multi-user team seats and shared numbers are coming soon. Today, an account can hold several numbers, and every device signed in rings together." },
      { q: "Is there live chat support?", a: "Yes. DIGIRINGO has live chat support inside the app." },
      { q: "When will porting be available?", a: "It is on our roadmap and marked coming soon. In the meantime, forwarding your old number to a new DIGIRINGO number works well." },
    ],
    related: ["/compare/digiringo-vs-ringcentral", "/compare/digiringo-vs-vonage", "/porting", "/pricing"],
  },

  // ───────────────────────────────── JustCall
  {
    slug: "justcall",
    name: "JustCall",
    title: "DIGIRINGO vs JustCall: Honest Comparison | DIGIRINGO",
    description:
      "JustCall vs DIGIRINGO: sales-focused per-user plans with dialers and CRM links, or pay-as-you-go numbers for small teams. Honest feature and price notes.",
    sub: "JustCall is a cloud phone and SMS tool for sales and support teams, priced per user with a two-user minimum. DIGIRINGO works for a single person and charges only for usage.",
    bullets: [
      "One user is fine, no minimum",
      "No SMS segment allowance to track",
      "Numbers in the US, Canada and beyond",
    ],
    shot: "inbox",
    summary: [
      "JustCall's plans are priced per user per month with a minimum of two users. They include IVR, 100+ CRM and data integrations, API access and a monthly SMS allowance per user, with power dialers, bulk SMS and AI coaching on higher tiers. JustCall lists local numbers in 70+ countries, number porting and mobile apps for iOS and Android.",
      "DIGIRINGO is a simpler phone app. It does not have dialers or campaigns. It does give you local and toll-free numbers, two-way SMS, browser and Android calling, and per-number routing to a cellphone, SIP agent or webhook, billed per use.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["intl", "yes"],
      ["ios", "yes"],
      ["sms", "yes (allowance per user)"],
      ["aiagent", "AI Voice Agent (add-on)"],
      ["ivr", "yes"],
      ["crm", "yes"],
      ["porting", "yes"],
      ["ringgroups", CHECK],
    ],
    digiWins: [
      { title: "Solo operators", icon: "user", body: "No two-user minimum. A single number for a single person is a normal setup." },
      { title: "Steady, low-cost texting", icon: "message", body: "Each SMS is $0.015 within the US and Canada, with no per-user segment cap." },
      { title: "Your own voice agent", icon: "bot", body: "Route calls to an agent you host, by SIP or webhook, at normal call rates." },
    ],
    theyWin: [
      { title: "Outbound sales teams", icon: "briefcase", body: "Power dialers, bulk SMS campaigns and CRM-linked calling are JustCall's focus." },
      { title: "CRM integrations now", icon: "plug", body: "JustCall connects to many CRMs today. DIGIRINGO's CRM integrations are coming soon." },
      { title: "Phone menus and porting", icon: "list", body: "IVR and number porting are available on JustCall. Both are coming soon on DIGIRINGO." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "JustCall", icon: "credit-card", body: "JustCall listed Team at $29, Pro at $49 and Pro Plus at $89 per user per month billed annually, with a two-user minimum, plus custom Business and SalesPro plans. Check JustCall's pricing page for current terms." },
    ],
    switchTip: "In JustCall, set the number to forward calls to your new DIGIRINGO number. Send a test text too, and remember SMS on a new US number needs a 10DLC registration first.",
    faq: [
      { q: "Does DIGIRINGO have a power dialer?", a: "No. DIGIRINGO is a business phone for calling and texting customers one to one. It is not built for high-volume outbound campaigns." },
      { q: "Can I text from a new US number right away?", a: "US carriers require A2P 10DLC registration for business texting. Our Trust Center guides you through it, and approval usually takes 1–7 days. Carrier fees are passed through at cost." },
      { q: "Do you have an API?", a: "A full public API is coming soon. Today, each number can send incoming calls to your own webhook (TeXML) or a SIP endpoint." },
      { q: "Is there a free trial?", a: "There is no trial plan, but there is no subscription either. A $5 top-up is enough to buy a US number and try calls and texts." },
    ],
    related: ["/compare/digiringo-vs-aircall", "/compare/digiringo-vs-dialpad", "/developers", "/product/messaging"],
  },

  // ───────────────────────────────── Quo (formerly OpenPhone)
  {
    slug: "openphone",
    name: "Quo",
    note: "Quo details reflect its publicly described plans as of late 2026 and may have changed — check Quo's pricing page before deciding.",
    title: "DIGIRINGO vs Quo (formerly OpenPhone) | DIGIRINGO",
    description:
      "Quo, formerly OpenPhone, vs DIGIRINGO: per-user plans with shared numbers and AI, or pay-as-you-go numbers with no seat fees and numbers in many countries.",
    sub: "Quo, the business phone app formerly called OpenPhone, is a polished per-user product for small teams. DIGIRINGO covers the core calling and texting for less, if you can live without some team features for now.",
    bullets: [
      "No per-user subscription: one wallet for every number",
      "Local numbers in many countries",
      "Route any number to your own AI or SIP agent",
    ],
    shot: "chat",
    summary: [
      "Quo (formerly OpenPhone) is a business phone app with shared numbers, a team inbox, an AI phone agent and a long list of integrations. It is sold per user per month in several tiers, with apps for iPhone, Android, Mac, Windows and the web. Higher tiers add phone menus, call transfers, automatic recording and CRM integrations.",
      "DIGIRINGO covers the core of what most small businesses use every day: a business number, calls from the browser and Android, two-way texting, forwarding and voicemail. Several of Quo's team features are on our roadmap rather than in the product today, and we mark them that way below.",
    ],
    rows: [
      ["payg", "no"],
      ["seats", "no"],
      ["local", "yes"],
      ["intl", CHECK],
      ["ios", "yes"],
      ["desktop", "yes"],
      ["sms", "yes"],
      ["aiagent", CHECK],
      ["ivr", "Business plan and up"],
      ["recording", "yes"],
      ["crm", "Business plan and up"],
      ["porting", "yes"],
    ],
    digiWins: [
      { title: "Cost with occasional users", icon: "dollar", body: "With no per-user fee, adding someone who takes a few calls a week does not add a monthly seat." },
      { title: "Numbers abroad", icon: "globe", body: "Buy local numbers in many countries from the same account, with the price shown up front." },
      { title: "Bring your own AI agent", icon: "bot", body: "Already using an AI voice agent? Point a DIGIRINGO number at it by SIP or webhook today." },
      { title: "Prepaid control", icon: "wallet", body: "Your wallet balance is your ceiling. No surprise invoice at the end of the month." },
    ],
    theyWin: [
      { title: "Shared numbers and team inbox", icon: "users", body: "Quo is built for teams sharing one line. DIGIRINGO shared numbers and team seats are coming soon." },
      { title: "iPhone and desktop apps", icon: "smartphone", body: "Quo has native apps on every major platform. DIGIRINGO has Android and the web app for now." },
      { title: "Built-in AI and integrations", icon: "sparkles", body: "Quo's AI agent, summaries and CRM connections exist today. Ours are coming soon." },
    ],
    pricing: [
      DIGI_PRICE,
      { title: "Quo", icon: "credit-card", body: "As of late 2026, Quo's public plans were priced per user per month, roughly $15 to $47 depending on tier and whether you pay yearly. Check Quo's current pricing page for exact figures." },
    ],
    switchTip: "If your Quo plan supports forwarding, point your Quo number at your new DIGIRINGO number (Quo's help center has the steps), then test with a call from your cell.",
    faq: [
      { q: "Is DIGIRINGO the same as OpenPhone or Quo?", a: "No. DIGIRINGO is a separate, independent service. OpenPhone renamed itself Quo; we are not affiliated with either." },
      { q: "Can my team share one DIGIRINGO number?", a: "Not yet. Shared numbers, team inbox and multi-user seats are coming soon. Today, every device you sign in on rings together, and an account can hold several numbers." },
      { q: "Can I move my Quo number to DIGIRINGO?", a: "Porting is coming soon. For now, get a DIGIRINGO number and forward your Quo number to it." },
      { q: "Does DIGIRINGO have an AI phone agent?", a: "Our own AI receptionist is coming soon. What works today is routing a number to your own AI or SIP agent, or to a webhook you control." },
      { q: "Which is cheaper?", a: "It depends on usage. For a few people with light or uneven call volume, pay-as-you-go is usually cheaper. Heavy users on unlimited-style plans may pay less with a per-user plan. Our pricing page lists every rate." },
    ],
    related: ["/compare/digiringo-vs-google-voice", "/compare/digiringo-vs-grasshopper", "/ai-agent", "/pricing"],
  },
];

// ───────────────────────────────── /compare index
const INDEX: PageDoc = {
  path: "/compare",
  title: "Compare DIGIRINGO With Other Phone Apps | DIGIRINGO",
  description:
    "Side-by-side comparisons of DIGIRINGO with Google Voice, RingCentral, Dialpad, Quo and more. Honest notes on pricing models, features and when to pick them.",
  status: "live",
  sections: [
    {
      type: "hero",
      eyebrow: "Compare",
      h1: "How DIGIRINGO compares",
      sub: "Fair, side-by-side looks at DIGIRINGO and other business phone services. We say where we fit well, where we don't yet, and when someone else is the better choice.",
      bullets: [
        "Competitor details checked on their own sites in October 2026",
        "Our unfinished features are clearly marked as coming soon",
        "Each page explains how to switch without losing calls",
      ],
      shot: "home",
      primary: { label: "Get your number", href: "/app" },
      secondary: { label: "See pricing", href: "/pricing" },
    },
    {
      type: "definition",
      title: "What makes DIGIRINGO different",
      paragraphs: [
        "Most business phone services charge per user, per month, often with a plan tier that decides which features you get. DIGIRINGO charges per number and per use from a prepaid wallet. A US local number is $2.50 a month, and calls and texts within the US and Canada are $0.015 each.",
        "That model is a good match for solo owners, small teams with uneven call volume, and businesses that need numbers in more than one country. It is a weaker match if you need phone menus, call recording or team inboxes today; those are on our roadmap.",
      ],
      tone: "tint",
    },
    {
      type: "cards",
      title: "Pick a comparison",
      items: COMPETITORS.map((c) => ({
        title: `DIGIRINGO vs ${c.name}`,
        body: c.sub.split(". ")[0] + ".",
        href: `/compare/digiringo-vs-${c.slug}`,
        icon: "list" as const,
        status: "live" as const,
      })),
      cols: 3,
    },
    {
      type: "table",
      title: "Pricing models at a glance",
      intro: "How each service bills, as listed on their own sites in October 2026.",
      head: ["Service", "How it bills", "Per-user fee"],
      rows: [
        ["DIGIRINGO", "Prepaid wallet: per number + per minute / message", "no"],
        ["Google Voice", "Per user per month, mostly on top of Google Workspace", "yes"],
        ["RingCentral", "Per user per month, tiered", "yes"],
        ["Vonage", "Per line per month, tiered", "yes"],
        ["Dialpad", "Per user per month, by product", "yes"],
        ["Grasshopper", "Flat monthly plans per account", "no"],
        ["Line2", CHECK, CHECK],
        ["Sideline", CHECK, CHECK],
        ["Zoom Phone", "Per user per month, alone or bundled with Zoom Workplace", "yes"],
        ["Aircall", "Per licence per month, three-licence minimum", "yes"],
        ["Ooma Office", "Per user per month, no contract", "yes"],
        ["Nextiva", "Per user per month, best prices on annual terms", "yes"],
        ["JustCall", "Per user per month, two-user minimum", "yes"],
        ["Quo", "Per user per month, tiered", "yes"],
      ],
      note: "Competitor details checked October 2026 from each competitor's public site; plans change — verify before buying.",
    },
    {
      type: "steps",
      title: "How to choose",
      items: [
        { title: "List what you need on day one", body: "Numbers, countries, texting, menus, recording, team seats. Be strict about must-haves.", icon: "list" },
        { title: "Estimate your minutes and texts", body: "Multiply by $0.015 for US and Canada usage on DIGIRINGO and compare it with seat prices elsewhere.", icon: "dollar" },
        { title: "Check what is live vs coming", body: "Our comparison tables mark unfinished DIGIRINGO features as soon. Make sure your must-haves are not among them.", icon: "check" },
        { title: "Try it cheaply", body: "A $5 top-up covers a US number and a few dozen minutes, so you can test before switching.", icon: "rocket" },
      ],
      tone: "tint",
    },
    {
      type: "callout",
      title: "Our promise on these pages",
      body: "We only state competitor facts we could confirm on their own websites, and we write \"Check current plans\" where we could not. If you spot something out of date, tell us through the contact page and we will fix it.",
    },
    {
      type: "faq",
      title: "Questions about comparing",
      items: [
        { q: "Why do some cells say Check current plans?", a: "Because we could not confirm that detail on the competitor's own site when we checked in October 2026. We would rather say that than guess." },
        { q: "What does soon mean in the tables?", a: "It means DIGIRINGO is building the feature and it is not available yet. We do not count it as a feature you can use today." },
        { q: "Can I move my number from another provider?", a: "Number porting is coming soon. Until then, forward your existing number to a new DIGIRINGO number so customers can still reach you." },
        { q: "Is DIGIRINGO cheaper than everyone?", a: "Not always. For light or uneven usage, pay-as-you-go usually wins. For heavy callers on unlimited-style plans, a per-user plan can cost less. Do the math with your own numbers." },
      ],
    },
    {
      type: "cta",
      title: "See every rate before you sign up",
      button: { label: "See pricing", href: "/pricing" },
      tone: "dark",
    },
  ],
  related: ["/pricing", "/rates", "/phone-numbers", "/blog/google-voice-alternatives-business"],
};

export const PAGES: PageDoc[] = [INDEX, ...COMPETITORS.map(comparePage)];
