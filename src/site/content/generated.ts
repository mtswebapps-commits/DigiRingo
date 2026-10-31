import type { Block, Faq, Item, PageDoc } from "./types";
import { US_STATES, type UsState } from "./areaCodes";

/**
 * Pages built from data rather than written one by one: local numbers (state
 * and area code), toll-free prefixes, country rates and the free tools.
 */

const regionName = (iso: string) => {
  try { return new Intl.DisplayNames(["en"], { type: "region" }).of(iso.toUpperCase()) || iso.toUpperCase(); }
  catch { return iso.toUpperCase(); }
};
const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

const BUY_STEPS: Item[] = [
  { title: "Create your account", body: "Sign up with email or Google at digiringo.com/app — no contract, no store visit." },
  { title: "Search and pick", body: "Search by area code, city or digits and choose the number you like." },
  { title: "Top up and buy", body: "Add credit from $5 by card. The number is paid from your wallet and goes live right away." },
  { title: "Call and text", body: "Use it in your browser or the Android app. Incoming calls ring every device you're signed in on." },
];

const LOCAL_FAQ = (where: string): Faq[] => [
  { q: `How much does a ${where} number cost?`, a: "US local numbers are $2.50 a month. Calls and texts within the US and Canada are $0.015 a minute or message, paid from a prepaid wallet." },
  { q: "Do I need a new phone or SIM?", a: "No. DIGIRINGO works over the internet in your browser and in the Android app, on the phone or computer you already have. iPhone users can use the web app in Safari." },
  { q: `Can I text from a ${where} number?`, a: "Yes. US carriers require business texting to be registered (A2P 10DLC). The Trust Center in the app walks you through it; carrier approval usually takes a few days." },
  { q: "Can my calls ring my cellphone too?", a: "Yes. If you don't answer in the app, DIGIRINGO forwards the call to the cellphone you choose, and voicemail catches anything you miss." },
  { q: "Can I bring my existing number?", a: "Number porting is coming soon. Until then, many people get a new DIGIRINGO number and forward their old line to it." },
];

/* ------------------------------------------------------------- local numbers */

function hubDoc(): PageDoc {
  const total = US_STATES.reduce((n, s) => n + s.codes.length, 0);
  return {
    path: "/local-numbers",
    title: "Local Phone Numbers in Every US State | DIGIRINGO",
    description: `Get a local phone number in any of ${US_STATES.length} US states and ${total}+ area codes. Search live numbers, buy in a minute and call or text from any device.`,
    sections: [
      { type: "hero", eyebrow: "Local numbers", h1: "A local number for every place you do business", sub: "Pick a number with the area code your customers know. Search live inventory across the US and Canada and start calling in about a minute.", bullets: ["$2.50/month per US local number", `${total}+ US area codes`, "Works on web and Android"], shot: "buy", primary: { label: "Choose a number", href: "#choose-number" } },
      { type: "widget", widget: "number-search" },
      { type: "definition", title: "What is a local phone number?", paragraphs: [
        "A local number is a regular phone number tied to a city or region by its area code — 212 for Manhattan, 305 for Miami, 512 for Austin. People see a familiar code and are more comfortable picking up or calling back.",
        "With DIGIRINGO the number lives in the cloud instead of on a SIM card. You can have several — one per city you serve, one per team, one for a side business — and use them all from the same app.",
      ] },
      { type: "cards", title: "Why businesses use local numbers", items: [
        { title: "Look local anywhere", body: "Serve customers in another city or state with a number that matches where they are.", icon: "map-pin" },
        { title: "Keep your cell private", body: "Hand out a business number and keep your personal number for friends and family.", icon: "lock" },
        { title: "Many numbers, one app", body: "Add numbers for each location or campaign and see every call and text in one place.", icon: "hash" },
        { title: "No extra phone", body: "Your number rings in the browser and the Android app — no desk phone or second device.", icon: "smartphone" },
      ] },
      { type: "steps", title: "How to get a local number", items: BUY_STEPS, tone: "tint" },
      { type: "chips", title: "Local numbers by state", intro: "Choose a state to see its area codes and the towns where numbers are available.", links: US_STATES.map((s) => ({ label: s.name, href: `/local-numbers/${s.slug}` })), tone: "plain" },
      { type: "faq", items: LOCAL_FAQ("local") },
    ],
    related: ["/toll-free-numbers", "/phone-numbers/canada", "/vanity-number"],
  };
}

function stateDoc(s: UsState): PageDoc {
  const codes = s.codes.map((c) => c.npa);
  const towns = [...new Set(s.codes.flatMap((c) => c.cities))];
  return {
    path: `/local-numbers/${s.slug}`,
    title: `${s.name} Phone Numbers & Area Codes | DIGIRINGO`,
    description: `Get a local ${s.name} phone number with area code ${list(codes.slice(0, 4))}${codes.length > 4 ? " and more" : ""}. Search live numbers and call or text from your browser or Android.`,
    crumbs: [{ label: "Local numbers", href: "/local-numbers" }, { label: s.name, href: `/local-numbers/${s.slug}` }],
    sections: [
      { type: "hero", eyebrow: `${s.name} numbers`, h1: `Get a local ${s.name} phone number`, sub: `${s.name} uses ${codes.length === 1 ? `one area code, ${codes[0]}` : `${codes.length} area codes: ${list(codes)}`}. Pick the one your customers recognize and start taking calls today.`, bullets: ["$2.50/month, no contract", "Rings every device you use", "Text-ready after 10DLC registration"], shot: "numbers", primary: { label: "Choose a number", href: "#choose-number" } },
      { type: "widget", widget: "number-search", props: { npa: codes[0], nearby: codes.slice(1, 9).join(",") } },
      { type: "cards", title: `${s.name} area codes`, intro: "Towns listed are where numbers were in stock when we last checked. Live availability is in the search above.", cols: codes.length >= 3 ? 3 : 2, items: s.codes.map((c) => ({
        title: `${c.npa} area code`, icon: "map-pin" as const, href: `/local-numbers/${s.slug}/${c.npa}-area-code`,
        body: c.cities.length ? `Numbers available in ${list(c.cities.slice(0, 5))}.` : "Inventory changes often — search to see what's available now.",
      })) },
      { type: "definition", title: `Why use a ${s.name} number?`, tone: "tint", paragraphs: [
        `If you sell to, serve or hire in ${s.name}, a number with a local area code tells people you're nearby — even if your team works from somewhere else. It also keeps your personal cellphone out of your marketing.`,
        towns.length ? `Recent inventory included numbers in ${list(towns.slice(0, 8))}. You can add more than one, for example a different area code for each region you cover.` : "You can add more than one number, for example a different area code for each region you cover.",
      ] },
      { type: "steps", title: `How to get your ${s.name} number`, items: BUY_STEPS },
      { type: "faq", items: [...LOCAL_FAQ(s.name), { q: `How many area codes does ${s.name} have?`, a: `We list ${codes.length} for ${s.name}: ${list(codes)}. Overlay codes share the same area, so either works for a local presence.` }] },
      { type: "chips", title: "Other states", links: US_STATES.filter((x) => x.slug !== s.slug).map((x) => ({ label: x.name, href: `/local-numbers/${x.slug}` })) },
    ],
    related: ["/local-numbers", "/toll-free-numbers", "/phone-numbers/multiple-phone-lines"],
  };
}

function npaDoc(s: UsState, npa: string): PageDoc | null {
  const c = s.codes.find((x) => x.npa === npa);
  if (!c) return null;
  const others = s.codes.filter((x) => x.npa !== npa).map((x) => x.npa);
  const where = s.name;
  return {
    path: `/local-numbers/${s.slug}/${npa}-area-code`,
    title: `${npa} Area Code Phone Numbers (${s.name}) | DIGIRINGO`,
    description: `Get a ${npa} area code number in ${where}. See live ${npa} numbers, buy one for $2.50/month and call or text from your browser or Android phone.`,
    crumbs: [{ label: "Local numbers", href: "/local-numbers" }, { label: s.name, href: `/local-numbers/${s.slug}` }, { label: `${npa}`, href: `/local-numbers/${s.slug}/${npa}-area-code` }],
    sections: [
      { type: "hero", eyebrow: `${npa} area code`, h1: `Get a ${npa} area code number in ${s.name}`, sub: `A ${npa} number puts you in ${s.name}'s local dialing landscape${c.cities.length > 1 ? `, with numbers around ${list(c.cities.slice(0, 3))}` : ""}. Choose one and it's live in about a minute.`, bullets: ["$2.50/month", "Calls & texts at $0.015", "Forward to any cellphone"], shot: "buy", primary: { label: "See available numbers", href: "#choose-number" } },
      { type: "widget", widget: "number-search", props: { npa, nearby: others.join(","), title: `Available ${npa} numbers` } },
      { type: "longform", title: `About the ${npa} area code`, items: [
        { title: "Where it's used", body: `${npa} is one of ${s.codes.length === 1 ? "the area codes" : `${s.name}'s ${s.codes.length} area codes`} in ${s.name}.${c.cities.length ? ` Recent inventory included ${list(c.cities.slice(0, 6))}.` : ""}`, icon: "map-pin" },
        { title: "Neighboring codes", body: others.length ? `Other ${s.name} codes: ${list(others)}. Pick whichever matches the customers you want to reach.` : `${npa} covers the whole state, so a ${npa} number is local everywhere in ${s.name}.`, icon: "hash" },
        { title: "Calling and texting", body: "Calls and texts to the US and Canada cost $0.015 a minute or message. International calls are billed per country — see the rate list.", icon: "phone-call" },
        { title: "Who it suits", body: `Local service businesses, sales teams covering ${s.name}, and anyone who wants a ${s.name} presence without opening an office there.`, icon: "briefcase" },
      ] },
      { type: "steps", title: `How to get a ${npa} number`, items: BUY_STEPS, tone: "tint" },
      { type: "faq", items: LOCAL_FAQ(`${npa}`) },
      { type: "chips", title: `More ${s.name} area codes`, links: [{ label: `All ${s.name} codes`, href: `/local-numbers/${s.slug}` }, ...others.map((o) => ({ label: o, href: `/local-numbers/${s.slug}/${o}-area-code` }))] },
    ],
    related: [`/local-numbers/${s.slug}`, "/vanity-number", "/product/call-forwarding"],
  };
}

/* ------------------------------------------------------------- toll-free */

const PREFIXES: Record<string, string> = {
  "800": "the original toll-free code, introduced in 1967 — the most recognized, and the hardest to find memorable numbers in",
  "888": "added in 1996 when 800 numbers started running out; as familiar to callers as 800 today",
  "877": "introduced in 1998; plenty of inventory, including easy-to-remember patterns",
  "866": "introduced in 2000; widely used for customer support lines",
  "855": "introduced in 2010; good availability for vanity and repeating digits",
  "844": "introduced in 2013; one of the best places to find a number that spells a word",
  "833": "introduced in 2017; the newest widely used prefix, with the most open inventory",
};
const TF_FAQ: Faq[] = [
  { q: "How much does a toll-free number cost?", a: "Toll-free numbers start at $2.50 a month. Your exact price is shown before you buy. Callers pay nothing; incoming minutes are billed to you per minute." },
  { q: "Are all toll-free prefixes the same?", a: "Yes. 800, 833, 844, 855, 866, 877 and 888 all work identically and are free to call from the US and Canada. 800 is the most familiar; newer prefixes have more numbers to choose from." },
  { q: "Can I text from a toll-free number?", a: "Not yet. Toll-free texting needs a separate carrier verification that we're adding. For now DIGIRINGO toll-free numbers are for calls; use a local number for texting." },
  { q: "Can toll-free calls ring my cellphone?", a: "Yes. They ring in the app on every signed-in device, then forward to your cellphone if you don't answer." },
];

function tollFreeHub(): PageDoc {
  return {
    path: "/toll-free-numbers",
    title: "Toll-Free Numbers: 800, 888, 877, 833 | DIGIRINGO",
    description: "Get an 800, 888, 877, 866, 855, 844 or 833 toll-free number from $2.50/month. Callers in the US and Canada call free; you answer in the browser or on Android.",
    sections: [
      { type: "hero", eyebrow: "Toll-free numbers", h1: "A toll-free number your customers can call for free", sub: "Look bigger, reach the whole country with one number and take calls anywhere. Pick an 800, 888, 877, 866, 855, 844 or 833 number in minutes.", bullets: ["From $2.50/month", "Free for callers in the US & Canada", "Rings browser, Android and your cell"], shot: "dialer", primary: { label: "Find a toll-free number", href: "#choose-number" } },
      { type: "widget", widget: "number-search", props: { kind: "TF", title: "Toll-free number lookup" } },
      { type: "cards", title: "Why use a toll-free number", items: [
        { title: "Nationwide in one number", body: "One number works for callers everywhere in the US and Canada — no need for an area code per region.", icon: "globe" },
        { title: "Free to call", body: "Customers aren't charged for the call, which makes it easier for them to reach you.", icon: "dollar" },
        { title: "Easy to remember", body: "Newer prefixes like 833 and 844 have more numbers with repeating or spelled-out digits.", icon: "star" },
      ] },
      { type: "definition", title: "What is a toll-free number?", tone: "tint", paragraphs: [
        "A toll-free number starts with 800, 888, 877, 866, 855, 844 or 833. Calls to it are free for the caller; the business that owns the number pays for the minutes instead.",
        "They're popular for sales and support lines, national brands and anyone advertising across several states. With DIGIRINGO it rings in the app like any other number, so you can answer from your laptop or phone.",
      ] },
      { type: "steps", title: "How to get a toll-free number", items: BUY_STEPS.map((s, i) => (i === 1 ? { ...s, body: "Choose the Toll-free tab, pick a prefix and browse available numbers." } : s)) },
      { type: "chips", title: "Toll-free prefixes", links: [...Object.keys(PREFIXES).map((p) => ({ label: p, href: `/toll-free-numbers/${p}` })), { label: "US toll-free", href: "/toll-free-numbers/us" }, { label: "Canada toll-free", href: "/toll-free-numbers/canada" }, { label: "Toll-free texting", href: "/toll-free-numbers/texting" }] },
      { type: "faq", items: TF_FAQ },
    ],
    related: ["/local-numbers", "/vanity-number", "/pricing"],
  };
}

function prefixDoc(p: string): PageDoc {
  return {
    path: `/toll-free-numbers/${p}`,
    title: `Get an ${p} Toll-Free Number | DIGIRINGO`,
    description: `Search available ${p} toll-free numbers and get one from $2.50/month. Free for callers in the US and Canada; answer in your browser, on Android or on your cell.`,
    crumbs: [{ label: "Toll-free numbers", href: "/toll-free-numbers" }, { label: p, href: `/toll-free-numbers/${p}` }],
    sections: [
      { type: "hero", eyebrow: `${p} numbers`, h1: `Get ${/^8[08]/.test(p) ? "an" : "an"} ${p} toll-free number`, sub: `${p} is ${PREFIXES[p]}. Search live numbers below and claim one in a minute.`, bullets: ["From $2.50/month", "Free for your callers", "No contract"], shot: "dialer", primary: { label: `See ${p} numbers`, href: "#choose-number" } },
      { type: "widget", widget: "number-search", props: { kind: "TF", npa: p, title: `Available ${p} numbers`, nearby: Object.keys(PREFIXES).filter((x) => x !== p).join(",") } },
      { type: "longform", title: `Is ${p} the right prefix?`, items: [
        { title: "Recognition", body: p === "800" ? "800 is the code people know best. That familiarity is why good 800 numbers are scarce." : `Callers treat ${p} like any other toll-free code — it's free to call and works the same as 800.`, icon: "star" },
        { title: "Availability", body: ["833", "844", "855"].includes(p) ? `${p} has more open inventory, so it's easier to find repeating digits or a number that spells a word.` : `Memorable ${p} numbers go fast; search by the digits you want and grab one you like.`, icon: "search" },
        { title: "Cost", body: "Every prefix is the same price with DIGIRINGO: from $2.50 a month, plus per-minute incoming charges shown in the app.", icon: "dollar" },
        { title: "Texting", body: "Toll-free texting is coming soon. Use a local number alongside it if you need to text customers today.", icon: "message", status: "soon" },
      ] },
      { type: "steps", title: `How to get your ${p} number`, items: BUY_STEPS, tone: "tint" },
      { type: "faq", items: TF_FAQ },
      { type: "chips", title: "Other toll-free prefixes", links: Object.keys(PREFIXES).filter((x) => x !== p).map((x) => ({ label: x, href: `/toll-free-numbers/${x}` })) },
    ],
    related: ["/toll-free-numbers", "/vanity-number", "/local-numbers"],
  };
}

function tollFreeSpecial(kind: "us" | "canada" | "texting"): PageDoc {
  if (kind === "texting") {
    return {
      path: "/toll-free-numbers/texting", status: "soon",
      title: "Toll-Free Texting | DIGIRINGO",
      description: "Toll-free SMS for DIGIRINGO numbers is on the way. Learn how toll-free verification works and how to text customers today with a local number.",
      crumbs: [{ label: "Toll-free numbers", href: "/toll-free-numbers" }, { label: "Texting", href: "/toll-free-numbers/texting" }],
      sections: [
        { type: "hero", eyebrow: "Toll-free texting", h1: "Text from your toll-free number", sub: "Toll-free SMS needs a one-time carrier verification. We're building it into the Trust Center so you can text from your 800-style number.", shot: "chat" },
        { type: "definition", title: "What is toll-free verification?", paragraphs: [
          "US carriers ask businesses to verify toll-free numbers before sending texts from them. You describe your business, what you'll send and how customers opt in; the carrier reviews it, usually within a few business days.",
          "Until verification is in the app, DIGIRINGO toll-free numbers handle calls. To text customers today, add a local number and register it for 10DLC in the Trust Center.",
        ] },
        { type: "steps", title: "What you can do today", items: [
          { title: "Keep your toll-free number for calls", body: "It rings in the app and forwards to your cell when you're away." },
          { title: "Add a local number for texts", body: "$2.50/month, registered for business texting through the Trust Center." },
          { title: "Get notified", body: "Tell us you want toll-free texting and we'll email you when it's live." },
        ] },
        { type: "faq", items: TF_FAQ.slice(2) },
      ],
      related: ["/toll-free-numbers", "/product/messaging", "/blog/what-is-a2p-10dlc"],
    };
  }
  const ca = kind === "canada";
  return {
    path: `/toll-free-numbers/${kind}`,
    title: `${ca ? "Canadian" : "US"} Toll-Free Numbers | DIGIRINGO`,
    description: `Get a toll-free number that's free to call from ${ca ? "Canada and the US" : "the US and Canada"}. From $2.50/month, answered in the browser, on Android or on your cell.`,
    crumbs: [{ label: "Toll-free numbers", href: "/toll-free-numbers" }, { label: ca ? "Canada" : "United States", href: `/toll-free-numbers/${kind}` }],
    sections: [
      { type: "hero", eyebrow: ca ? "Canada toll-free" : "US toll-free", h1: ca ? "A toll-free number for your Canadian customers" : "A US toll-free number for nationwide reach", sub: ca ? "North American toll-free numbers are free to call from both Canada and the US, so one number covers customers on both sides of the border." : "One number customers anywhere in the country can call for free — answered wherever you are.", bullets: ["From $2.50/month", "Same number works in US & Canada", "Answer anywhere"], shot: "dialer", primary: { label: "Find a number", href: "#choose-number" } },
      { type: "widget", widget: "number-search", props: { kind: "TF" } },
      { type: "definition", title: ca ? "How toll-free works in Canada" : "How toll-free works in the US", tone: "tint", paragraphs: [
        "The US and Canada share the North American Numbering Plan, so 800, 888, 877, 866, 855, 844 and 833 numbers are toll-free in both countries.",
        ca ? "That makes one toll-free number an easy way to serve Canadian customers whether your team is in Toronto, Vancouver or abroad." : "Your callers don't pay for the call; you're billed per incoming minute, shown in the app before you buy.",
      ] },
      { type: "steps", title: "How to get one", items: BUY_STEPS },
      { type: "faq", items: TF_FAQ },
    ],
    related: ["/toll-free-numbers", ca ? "/phone-numbers/canada" : "/local-numbers", "/pricing"],
  };
}

/* ------------------------------------------------------------- rates */

function ratesDoc(): PageDoc {
  return {
    path: "/rates",
    title: "International Calling & SMS Rates | DIGIRINGO",
    description: "Per-minute calling and per-message texting rates to 200+ countries. Search a country to see landline, mobile and SMS prices, paid from your prepaid wallet.",
    sections: [
      { type: "hero", layout: "center", eyebrow: "Rates", h1: "International calling and texting rates", sub: "Prices per minute and per message, by country. US and Canada are $0.015 for calls and texts; everywhere else is listed below.", primary: { label: "Get started", href: "/app" }, secondary: { label: "See pricing", href: "/pricing" } },
      { type: "widget", widget: "rates-table" },
      { type: "longform", title: "How international billing works", tone: "tint", items: [
        { title: "Pay as you go", body: "Every call and text is drawn from your prepaid wallet. No international plan or add-on needed.", icon: "wallet" },
        { title: "Shown before you dial", body: "The app's rate list shows the price to each country, so there are no surprises.", icon: "search" },
        { title: "Landline vs mobile", body: "Calls to mobile phones often cost more than landlines — both rates are listed.", icon: "smartphone" },
        { title: "Your caller ID matters", body: "Some countries charge less when you call from one of their local numbers. We bill the real rate for the number you call from.", icon: "phone-outgoing" },
      ] },
    ],
    related: ["/pricing", "/blog/cheap-international-business-calls", "/product/call-forwarding/international-call-forwarding"],
  };
}

function countryRateDoc(iso: string): PageDoc {
  const name = regionName(iso);
  return {
    path: `/rates/${iso.toLowerCase()}`,
    title: `${name} Calling & SMS Rates | DIGIRINGO`,
    description: `What it costs to call and text ${name} with DIGIRINGO, plus ${name} phone number prices where available. Pay as you go from a prepaid wallet.`,
    crumbs: [{ label: "Rates", href: "/rates" }, { label: name, href: `/rates/${iso.toLowerCase()}` }],
    sections: [
      { type: "hero", layout: "center", eyebrow: "Rates", h1: `Calling and texting ${name}`, sub: `Per-minute and per-message prices for ${name}, and what a ${name} number costs if we offer one.` },
      { type: "widget", widget: "country-rates", props: { iso: iso.toUpperCase(), picker: false } },
      { type: "cta", title: "Check another country", body: "Search 200+ destinations in the full rate list.", button: { label: "All rates", href: "/rates" } },
    ],
    related: ["/rates", "/pricing", "/blog/international-virtual-numbers"],
  };
}

/* ------------------------------------------------------------- tools */

const TOOLS: { slug: string; name: string; title: string; description: string; h1: string; sub: string; widget: Block; about: string[]; faqs: Faq[]; icon: Item["icon"] }[] = [
  {
    slug: "voip-calculator", name: "VoIP cost calculator", icon: "dollar",
    title: "VoIP Cost Calculator | DIGIRINGO", description: "Compare what your team pays per user today with DIGIRINGO's pay-as-you-go pricing. Adjust users, minutes and texts to see monthly and yearly savings.",
    h1: "How much could you save on your phone bill?", sub: "Enter what you pay today and how much your team calls and texts. We'll compare it with pay-as-you-go pricing.",
    widget: { type: "widget", widget: "voip-calculator" },
    about: ["Per-user phone plans charge the same whether someone makes ten calls a month or a thousand. Usage pricing charges for the number plus what you actually use, which tends to be cheaper for light and medium callers.", "The calculator is transparent: every assumption is a field you can change. It doesn't include taxes or one-time texting registration fees, and it only counts US and Canada usage."],
    faqs: [{ q: "Is the estimate exact?", a: "No — it's a model. Real bills include taxes and any international usage. Use your last few invoices for the most accurate numbers." }, { q: "When is a per-user plan cheaper?", a: "Heavy callers with thousands of minutes a month can come out ahead on unlimited per-user plans. The calculator tells you when that's the case." }],
  },
  {
    slug: "missed-call-cost-calculator", name: "Missed-call cost calculator", icon: "phone-missed",
    title: "Missed Call Cost Calculator | DIGIRINGO", description: "Estimate the revenue lost to unanswered business calls. Set your call volume, miss rate, close rate and customer value to see what's at stake each year.",
    h1: "What are missed calls costing you?", sub: "Put in your own numbers to estimate the revenue behind calls nobody answers — and how much you could win back.",
    widget: { type: "widget", widget: "missed-call-calculator" },
    about: ["A missed call from an existing customer is an inconvenience. A missed call from a new one is often a lost sale — many people simply call the next business on the list.", "The calculator multiplies your call volume by the share you miss, the share of those that are new customers, and your usual close rate. Every value is adjustable; the defaults are only examples."],
    faqs: [{ q: "Where do the default numbers come from?", a: "They're illustrative starting points, not industry statistics. Replace them with figures from your own call history." }, { q: "How does DIGIRINGO reduce missed calls?", a: "Every signed-in device rings at once, unanswered calls forward to your cellphone, voicemail records the rest and your call history lists every missed call to return." }],
  },
  {
    slug: "phone-number-generator", name: "Phone number generator", icon: "hash",
    title: "Phone Number Generator & Word-to-Number Tool | DIGIRINGO", description: "Turn a word into keypad digits and find real numbers that contain it, or generate safe fictional 555 numbers for mock-ups, demos and test data.",
    h1: "Phone number generator", sub: "Spell a word on the keypad and search for real numbers that contain it — or create safe fictional numbers for designs and testing.",
    widget: { type: "widget", widget: "number-generator" },
    about: ["Vanity numbers like 1-833-PLUMBER are easier to remember than random digits. Each letter maps to a key: ABC is 2, DEF is 3, and so on.", "For mock-ups and test data, use 555-0100 to 555-0199. Those numbers are reserved for fiction, so you'll never accidentally print someone's real number."],
    faqs: [{ q: "Can I buy a number I find here?", a: "Yes — real numbers in the search results can be bought in the app. Availability changes quickly, so grab one you like." }, { q: "Are the generated 555 numbers real?", a: "No. 555-0100 through 555-0199 are set aside for fictional use and can't receive calls." }],
  },
  {
    slug: "voicemail-generator", name: "Voicemail greeting generator", icon: "voicemail",
    title: "Voicemail Greeting Generator | DIGIRINGO", description: "Write a professional business voicemail greeting in seconds. Add your business name, hours and callback promise, pick a tone and copy the script.",
    h1: "Voicemail greeting generator", sub: "Fill in a few details and get ready-to-record greetings in a friendly, professional or brief tone.",
    widget: { type: "widget", widget: "voicemail-generator" },
    about: ["A good greeting confirms the caller reached the right place, tells them what to leave and says when they'll hear back. Keep it under 20 seconds.", "Custom recorded greetings in DIGIRINGO are coming soon; today voicemail uses a standard greeting. These scripts work with any phone system in the meantime."],
    faqs: [{ q: "How long should a voicemail greeting be?", a: "Aim for 10–20 seconds. Callers want to leave their message, not listen to a speech." }, { q: "Can I record this greeting in DIGIRINGO?", a: "Custom greetings are coming soon. Voicemail works today with a standard greeting." }],
  },
  {
    slug: "auto-attendant-greeting-generator", name: "Phone menu script generator", icon: "git-branch",
    title: "Auto Attendant Greeting Generator | DIGIRINGO", description: "Create a clear phone menu (IVR) script for your business. List your options, set your hours and tone, and copy a ready-to-record auto attendant greeting.",
    h1: "Phone menu script generator", sub: "List your departments and get a clear 'press 1 for…' script, plus an after-hours version.",
    widget: { type: "widget", widget: "greeting-generator" },
    about: ["Keep menus short: three or four options is plenty. Put the most common reason first and always offer a way to reach a person or leave a message.", "Phone menus in DIGIRINGO are coming soon. Until then you can give each department its own number and route each one separately."],
    faqs: [{ q: "How many options should a phone menu have?", a: "Three to five. More than that and callers forget the first ones by the time you finish." }, { q: "Does DIGIRINGO support phone menus?", a: "They're coming soon. Today each number can ring the app, forward to a phone, or go to your own SIP or AI agent." }],
  },
  {
    slug: "click-to-call", name: "Click-to-call link generator", icon: "phone-call",
    title: "Click-to-Call Link & Button Generator | DIGIRINGO", description: "Create a tel: link and a copy-paste HTML call button for your website, emails or signature. Customers tap once to call your business number.",
    h1: "Click-to-call link generator", sub: "Make a tap-to-call link and button for your website, emails and social profiles.",
    widget: { type: "widget", widget: "click-to-call" },
    about: ["A click-to-call link uses the tel: format. On a phone, tapping it opens the dialer with your number filled in — one less step between a visitor and a conversation.", "Put it in your site header, on your contact page and in your email signature. Use your business number, not your personal one."],
    faqs: [{ q: "Does it work on desktop?", a: "It opens the computer's default calling app. On phones it opens the dialer directly." }, { q: "Which number should I use?", a: "Your business number — for example a DIGIRINGO local or toll-free number — so calls ring your team wherever they are." }],
  },
  {
    slug: "click-to-text", name: "Click-to-text link generator", icon: "message",
    title: "Click-to-Text (SMS) Link Generator | DIGIRINGO", description: "Create an sms: link with a pre-filled message, plus an HTML button. Let customers text your business with one tap from your website or emails.",
    h1: "Click-to-text link generator", sub: "Create an SMS link with a pre-filled message so customers can text you in one tap.",
    widget: { type: "widget", widget: "click-to-text" },
    about: ["Many customers would rather text than call. An sms: link opens their messaging app with your number — and optionally a starter message — already filled in.", "If you text back from a DIGIRINGO number, register it for business texting (10DLC) in the Trust Center first so your replies are delivered."],
    faqs: [{ q: "Does the pre-filled message work everywhere?", a: "Most phones support it. A few older Android messaging apps ignore the message and only fill in the number." }, { q: "Can I reply from my computer?", a: "Yes. Texts to your DIGIRINGO number arrive in the web app and the Android app." }],
  },
];

function toolsIndex(): PageDoc {
  return {
    path: "/tools",
    title: "Free Business Phone Tools | DIGIRINGO",
    description: "Free calculators and generators for business phones: missed-call cost, VoIP savings, voicemail greetings, phone menu scripts, vanity numbers and click-to-call links.",
    sections: [
      { type: "hero", layout: "center", eyebrow: "Free tools", h1: "Free tools for your business phone", sub: "Calculators and generators you can use right now — no sign-up needed." },
      { type: "cards", title: "Pick a tool", items: TOOLS.map((t) => ({ title: t.name, body: t.sub, icon: t.icon, href: `/tools/${t.slug}` })) },
    ],
  };
}

function toolDoc(slug: string): PageDoc | null {
  const t = TOOLS.find((x) => x.slug === slug);
  if (!t) return null;
  return {
    path: `/tools/${slug}`, title: t.title, description: t.description,
    crumbs: [{ label: "Tools", href: "/tools" }, { label: t.name, href: `/tools/${slug}` }],
    sections: [
      { type: "hero", layout: "center", eyebrow: "Free tool", h1: t.h1, sub: t.sub, primary: { label: "Get a business number", href: "/app" }, secondary: { label: "All tools", href: "/tools" } },
      t.widget,
      { type: "definition", title: "About this tool", paragraphs: t.about },
      { type: "faq", items: t.faqs },
      { type: "chips", title: "More free tools", links: TOOLS.filter((x) => x.slug !== slug).map((x) => ({ label: x.name, href: `/tools/${x.slug}` })) },
    ],
  };
}

/* ------------------------------------------------------------- resolve */

export function generatedDoc(path: string): PageDoc | null {
  if (path === "/local-numbers") return hubDoc();
  let m = path.match(/^\/local-numbers\/([a-z-]+)$/);
  if (m) { const s = US_STATES.find((x) => x.slug === m![1]); return s ? stateDoc(s) : null; }
  m = path.match(/^\/local-numbers\/([a-z-]+)\/(\d{3})-area-code$/);
  if (m) { const s = US_STATES.find((x) => x.slug === m![1]); return s ? npaDoc(s, m[2]) : null; }
  if (path === "/toll-free-numbers") return tollFreeHub();
  m = path.match(/^\/toll-free-numbers\/([a-z0-9]+)$/);
  if (m) {
    if (PREFIXES[m[1]]) return prefixDoc(m[1]);
    if (m[1] === "us" || m[1] === "canada" || m[1] === "texting") return tollFreeSpecial(m[1]);
    return null;
  }
  if (path === "/rates") return ratesDoc();
  m = path.match(/^\/rates\/([a-z]{2})$/);
  if (m) return countryRateDoc(m[1]);
  if (path === "/tools") return toolsIndex();
  m = path.match(/^\/tools\/([a-z-]+)$/);
  if (m) return toolDoc(m[1]);
  return null;
}

/** Every generated path (for the sitemap). */
export function generatedPaths(): { path: string; title: string }[] {
  const out: { path: string; title: string }[] = [{ path: "/local-numbers", title: "Local numbers" }];
  for (const s of US_STATES) {
    out.push({ path: `/local-numbers/${s.slug}`, title: `${s.name} numbers` });
    for (const c of s.codes) out.push({ path: `/local-numbers/${s.slug}/${c.npa}-area-code`, title: `${c.npa} area code` });
  }
  out.push({ path: "/toll-free-numbers", title: "Toll-free numbers" });
  for (const p of [...Object.keys(PREFIXES), "us", "canada", "texting"]) out.push({ path: `/toll-free-numbers/${p}`, title: `Toll-free ${p}` });
  out.push({ path: "/rates", title: "International rates" }, { path: "/tools", title: "Free tools" });
  for (const t of TOOLS) out.push({ path: `/tools/${t.slug}`, title: t.name });
  return out;
}
