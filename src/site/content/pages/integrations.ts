import type { PageDoc, Block, Item, Faq, Shot, IconName } from "../types";

/**
 * Integrations directory + per-app pages, and the translated landing pages
 * under /es and /fr. Every third-party integration is "soon" (not built yet);
 * only per-number webhook routing exists today, so /integrations/webhooks is
 * "beta". Copy describes what each integration WILL do and what works today.
 */

type Cat =
  | "CRM" | "Automation" | "AI assistants" | "Collaboration" | "Contacts"
  | "Conversation intelligence" | "Home services" | "Legal" | "Developer";

interface Integration {
  slug: string;
  name: string;
  cat: Cat;
  icon: IconName;
  /** one-line card blurb for the index */
  blurb: string;
  title: string;
  description: string;
  sub: string;
  bullets: string[];
  shot: Shot;
  about: string[];
  willDo: Item[];
  faq: Faq[];
}

/** "What you can do today" — live DIGIRINGO features, varied by category. */
const TODAY: Record<Cat, { intro: string; items: Item[] }> = {
  CRM: {
    intro: "There is no CRM sync yet. These live features keep your customer conversations organised in the meantime.",
    items: [
      { title: "Give each pipeline its own number", body: "Buy a separate number for sales or for a campaign, so you know where every call came from.", icon: "hash" },
      { title: "Check the call log", body: "Every inbound and outbound call is listed with time, number and duration in your call history.", icon: "list" },
      { title: "Developers: use the webhook route", body: "Send a number's incoming calls to your own webhook (beta). Your code sees the caller's number and can look them up in your CRM before answering with TeXML.", icon: "webhook", status: "beta" },
    ],
  },
  Automation: {
    intro: "A ready-made connector is not available yet. Here is what already works.",
    items: [
      { title: "Per-number webhook routing", body: "Each number can send incoming calls to a URL you choose (beta). The URL must reply with TeXML call instructions.", icon: "webhook", status: "beta" },
      { title: "Forward to a cellphone", body: "Unanswered calls move to your mobile after about 30 seconds, then to voicemail.", icon: "phone-forwarded" },
      { title: "Two-way SMS from the app", body: "Reply to customers from the browser or Android once your 10DLC registration is approved.", icon: "message" },
    ],
  },
  "AI assistants": {
    intro: "The assistant connection is still being built. You can already put AI on your phone line another way.",
    items: [
      { title: "Bring your own AI voice agent", body: "Route any DIGIRINGO number to a SIP address or webhook where your AI agent answers calls.", icon: "bot", status: "beta" },
      { title: "Keep a human fallback", body: "Use a second number that rings your devices and forwards to your cell, for callers who want a person.", icon: "phone-forwarded" },
      { title: "Review calls in history", body: "Your call log shows every call on each number, including the ones your agent handled.", icon: "list" },
    ],
  },
  Collaboration: {
    intro: "Slack alerts are not live yet. These keep you from missing calls today.",
    items: [
      { title: "Ring every device", body: "Incoming calls ring the web app and Android app at the same time, wherever you are signed in.", icon: "bell" },
      { title: "Background notifications", body: "Browser push notifications alert you to calls even when the DIGIRINGO tab is not in front.", icon: "monitor" },
      { title: "Forward when nobody answers", body: "After about 30 seconds unanswered, the call goes to your cellphone.", icon: "phone-forwarded" },
    ],
  },
  Contacts: {
    intro: "Contact sync is coming. For now, you can still work quickly from your history.",
    items: [
      { title: "Call back from history", body: "Tap any recent call to dial the number back from the business line it came in on.", icon: "refresh" },
      { title: "Pick your caller ID", body: "Choose which of your numbers shows up when you place a call.", icon: "phone-outgoing" },
      { title: "Threaded texts", body: "Each customer's SMS conversation stays in one thread per number.", icon: "messages" },
    ],
  },
  "Conversation intelligence": {
    intro: "These tools work on call recordings, and DIGIRINGO call recording is still coming. Here is what is live.",
    items: [
      { title: "Call history per user", body: "See who called, when, and for how long on every number.", icon: "list" },
      { title: "Voicemail", body: "When nobody answers, callers can leave a recorded voicemail.", icon: "voicemail" },
      { title: "Route to your own system", body: "Developers can send a number's calls to their own SIP endpoint or webhook (beta).", icon: "code", status: "beta" },
    ],
  },
  "Home services": {
    intro: "The job-software link is not built yet. These live features help crews catch every lead.",
    items: [
      { title: "Never miss a job call", body: "Calls ring the office browser and your Android phone together, then forward to your cell.", icon: "phone-incoming" },
      { title: "Text customers back", body: "Confirm arrival times and estimates by SMS from your business number.", icon: "message" },
      { title: "One number per service area", body: "Get local numbers for each town you serve, at $2.50 a month each.", icon: "map-pin" },
    ],
  },
  Legal: {
    intro: "Automatic matter logging is not available yet. Here is what helps firms today.",
    items: [
      { title: "Keep client calls off personal phones", body: "Give each attorney a business number that rings the web app and Android.", icon: "shield" },
      { title: "Review call history", body: "Look up call times and durations when you record time manually.", icon: "clock" },
      { title: "Voicemail after hours", body: "Unanswered calls forward to a cellphone, then go to voicemail.", icon: "voicemail" },
    ],
  },
  Developer: { intro: "", items: [] },
};

function intPage(i: Integration): PageDoc {
  const today = TODAY[i.cat];
  const siblings = INTEGRATIONS.filter((x) => x.cat === i.cat && x.slug !== i.slug).map((x) => `/integrations/${x.slug}`);
  const sections: Block[] = [
    { type: "hero", eyebrow: `Integrations · ${i.cat}`, h1: `DIGIRINGO + ${i.name}`, sub: i.sub, bullets: i.bullets, shot: i.shot },
    { type: "definition", title: `What is ${i.name}?`, paragraphs: i.about },
    { type: "cards", eyebrow: "Planned", title: "What the integration will do", intro: "This integration is in planning. Details may change before it ships.", items: i.willDo.map((x) => ({ ...x, status: "soon" as const })), cols: i.willDo.length === 4 ? 4 : 3, tone: "tint" },
    { type: "steps", title: "What you can do today", intro: today.intro, items: today.items },
    {
      type: "callout",
      title: "Honest status",
      body: `The ${i.name} integration is not available yet. Nothing on this page syncs with ${i.name} today. Ask to be notified and we will email you when it is ready to try.`,
      tone: "dark",
    },
    { type: "cta", title: `Want ${i.name} sooner?`, body: "Tell us how you would use it. Requests help us decide what to build next.", button: { label: "Get notified", href: `/contact?topic=integration-${i.slug}` }, tone: "tint" },
    { type: "faq", title: `${i.name} integration FAQ`, items: i.faq },
  ];
  return {
    path: `/integrations/${i.slug}`,
    title: i.title,
    description: i.description,
    crumbs: [{ label: "Integrations", href: "/integrations" }],
    status: "soon",
    sections,
    related: [...siblings.slice(0, 2), "/integrations/webhooks", "/integrations"].slice(0, 4),
  };
}

const INTEGRATIONS: Integration[] = [
  // ─────────────── CRM
  {
    slug: "hubspot", name: "HubSpot", cat: "CRM", icon: "briefcase",
    blurb: "Log calls and texts on HubSpot contacts automatically.",
    title: "HubSpot Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and HubSpot integration to log calls and texts on contact timelines. See what it will do, and what you can set up with DIGIRINGO today.",
    sub: "We are planning a HubSpot connection so your calls and texts land on the right contact record without copy and paste.",
    bullets: ["Calls and texts logged to contact timelines", "Caller details shown when the phone rings", "New contacts created from unknown callers"],
    shot: "calls",
    about: [
      "HubSpot is a customer platform that combines a CRM with marketing, sales and service tools. Teams use it to keep contacts, companies and deals in one place, with a timeline of every interaction.",
      "A phone connection matters because calls are often the most important touchpoint and the easiest to forget to log. Linking DIGIRINGO to HubSpot would keep that timeline complete without extra clicks.",
    ],
    willDo: [
      { title: "Automatic activity logging", body: "Each call and SMS would appear on the matching HubSpot contact with time, direction and duration.", icon: "list" },
      { title: "Caller lookup", body: "When a known number calls, the app would show the HubSpot contact name and owner.", icon: "search" },
      { title: "Create contacts from calls", body: "Unknown callers could become new HubSpot contacts in one tap.", icon: "user" },
    ],
    faq: [
      { q: "Does DIGIRINGO work with HubSpot today?", a: "No. The integration is planned but not built. Calls and texts are not synced to HubSpot yet." },
      { q: "Which HubSpot plans will it support?", a: "We have not finalised that. We aim to use HubSpot's standard app framework so it works broadly, and will confirm when we launch." },
      { q: "Will call recordings be attached?", a: "Call recording is itself still coming to DIGIRINGO. Once both are live, attaching recordings is something we plan to look at." },
      { q: "Can a developer build a stopgap?", a: "Yes. Per-number webhook routing (beta) gives your code each incoming call, so you can look up or log the caller in HubSpot through its own API." },
    ],
  },
  {
    slug: "salesforce", name: "Salesforce", cat: "CRM", icon: "briefcase",
    blurb: "Match callers to Salesforce records and log every activity.",
    title: "Salesforce Integration (Coming Soon) | DIGIRINGO",
    description: "Planned DIGIRINGO integration for Salesforce: match callers to leads and log calls and texts as activities. Here is what works with DIGIRINGO today.",
    sub: "A Salesforce connection is on our roadmap, aimed at logging calls and texts against leads, contacts and accounts.",
    bullets: ["Calls logged as Salesforce activities", "Lead and contact match on incoming calls", "Text history kept with the record"],
    shot: "inbox",
    about: [
      "Salesforce is a widely used CRM platform. Sales Cloud and related products track leads, contacts, accounts and opportunities, and companies often customise it heavily for their own process.",
      "Phone data is a natural fit: reps want to see who is calling and have each conversation recorded as an activity without typing it up. That is what a DIGIRINGO integration would aim to do.",
    ],
    willDo: [
      { title: "Activity logging", body: "Calls and SMS would be saved as Salesforce activities on the matched record.", icon: "list" },
      { title: "Screen pop", body: "Incoming calls would show the matching lead or contact in the app.", icon: "phone-incoming" },
      { title: "Click to call from records", body: "Phone numbers in Salesforce could open a DIGIRINGO call.", icon: "phone-outgoing" },
    ],
    faq: [
      { q: "Is the Salesforce integration live?", a: "No. It is planned and not available yet." },
      { q: "Will it support custom objects?", a: "Our first version would focus on leads, contacts and accounts. Custom objects may come later." },
      { q: "Can I click to call from Salesforce today?", a: "Not through an integration. You can copy a number into the DIGIRINGO web app dialer, which takes a few seconds." },
      { q: "Will it be included in the price?", a: "We have not set pricing for integrations. DIGIRINGO has no per-user fees today, and we will publish any integration pricing before launch." },
    ],
  },
  {
    slug: "zoho-crm", name: "Zoho CRM", cat: "CRM", icon: "briefcase",
    blurb: "Sync calls and SMS with leads and contacts in Zoho CRM.",
    title: "Zoho CRM Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and Zoho CRM integration to sync calls and texts with leads and contacts. Learn what it will do and which DIGIRINGO features work right now.",
    sub: "We plan to connect DIGIRINGO with Zoho CRM so phone conversations show up next to the rest of your customer history.",
    bullets: ["Call logs on Zoho leads and contacts", "SMS history saved with records", "Caller name shown on incoming calls"],
    shot: "calls",
    about: [
      "Zoho CRM is the customer relationship tool in Zoho's suite of business apps. It handles leads, contacts, deals and workflows, and is popular with small and mid-sized businesses that use other Zoho products.",
      "Zoho CRM supports telephony integrations, which is the kind of connection we plan to build: calls and texts flowing into records so nobody has to log them by hand.",
    ],
    willDo: [
      { title: "Call logging", body: "Inbound and outbound calls would be recorded on the matching Zoho record.", icon: "list" },
      { title: "Text history", body: "SMS threads would be saved alongside the lead or contact.", icon: "messages" },
      { title: "Caller ID lookup", body: "The app would display the Zoho contact name when a known number rings.", icon: "search" },
    ],
    faq: [
      { q: "Can I use DIGIRINGO with Zoho CRM now?", a: "Not through a built-in integration. It is planned." },
      { q: "Will it work with Zoho Desk or Bigin?", a: "Our first target is Zoho CRM. Other Zoho apps may follow based on demand." },
      { q: "Does DIGIRINGO support international numbers for Zoho users abroad?", a: "Yes, DIGIRINGO sells numbers in many countries today. That part does not depend on the integration." },
      { q: "How do I hear when it launches?", a: "Use the Get notified button on this page and we will email you." },
    ],
  },
  {
    slug: "pipedrive", name: "Pipedrive", cat: "CRM", icon: "briefcase",
    blurb: "Keep deal timelines complete with calls and texts.",
    title: "Pipedrive Integration (Coming Soon) | DIGIRINGO",
    description: "Planned DIGIRINGO integration for Pipedrive: calls and texts logged on deals and people, with caller lookup. See the plan and what works today.",
    sub: "Pipedrive users live in their pipeline. We plan to put DIGIRINGO calls and texts right on the deals and people they belong to.",
    bullets: ["Calls attached to deals and people", "Texts logged in the timeline", "Fewer manual activity notes"],
    shot: "activity",
    about: [
      "Pipedrive is a sales CRM built around a visual pipeline. Deals move through stages, and each deal and person has a history of calls, emails and notes.",
      "Because Pipedrive is activity-driven, logging calls quickly matters. A DIGIRINGO integration would aim to make each call and text appear on the right deal automatically.",
    ],
    willDo: [
      { title: "Deal-level logging", body: "Calls and texts would be attached to the person and their open deal.", icon: "briefcase" },
      { title: "Caller context", body: "Incoming calls would show the person's name and deal stage.", icon: "user" },
      { title: "Follow-up prompts", body: "After a call, you could add a Pipedrive activity without leaving DIGIRINGO.", icon: "calendar" },
    ],
    faq: [
      { q: "Is there a Pipedrive integration today?", a: "No. It is planned and not yet available." },
      { q: "Will it use Pipedrive's caller app framework?", a: "We plan to use Pipedrive's official integration options. Details will be shared at launch." },
      { q: "Can sales reps each have their own number now?", a: "Yes. An account can hold several numbers, and you can pick which one is your caller ID. Multi-user seats are coming soon." },
      { q: "What will it cost?", a: "Not decided. We will publish pricing before launch." },
    ],
  },
  {
    slug: "attio", name: "Attio", cat: "CRM", icon: "briefcase",
    blurb: "Add calls and texts to Attio records and lists.",
    title: "Attio Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and Attio integration to bring calls and texts into Attio people and company records. See what it will do and what works now.",
    sub: "Attio teams like a CRM that fits their own data model. We plan to send DIGIRINGO calls and texts into it the same way.",
    bullets: ["Calls on people and company records", "Texts in the interaction history", "Works alongside your custom lists"],
    shot: "chat",
    about: [
      "Attio is a CRM with a flexible data model. Teams define their own objects, attributes and lists, and Attio builds records from email, calendar and other connected sources.",
      "Phone calls and texts are a missing piece for many Attio setups. A DIGIRINGO integration would add them to the record so the history is complete.",
    ],
    willDo: [
      { title: "Interaction sync", body: "Calls and SMS would appear on the person and their company in Attio.", icon: "refresh" },
      { title: "Number matching", body: "Phone numbers on Attio records would be matched to DIGIRINGO conversations.", icon: "search" },
      { title: "List-friendly data", body: "Call counts and last-contacted dates could be available as attributes.", icon: "list" },
    ],
    faq: [
      { q: "Does DIGIRINGO connect to Attio yet?", a: "No. The integration is planned." },
      { q: "Will it support custom objects?", a: "We plan to start with people and companies. Custom objects are something we would like to support later." },
      { q: "Can I get notified when it ships?", a: "Yes. Use Get notified on this page." },
      { q: "Is there a workaround now?", a: "Developers can use per-number webhook routing (beta) to receive incoming calls and write details to Attio through its API." },
    ],
  },
  {
    slug: "clay", name: "Clay", cat: "CRM", icon: "search",
    blurb: "Use DIGIRINGO call and text activity in Clay workflows.",
    title: "Clay Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and Clay integration to use call and text activity inside Clay tables and outbound workflows. See the plan and what DIGIRINGO offers today.",
    sub: "Clay is where many outbound teams build and enrich lead lists. We plan to let DIGIRINGO activity flow into those tables.",
    bullets: ["Call outcomes available in Clay tables", "Texts tracked against enriched leads", "Phone steps in outbound workflows"],
    shot: "activity",
    about: [
      "Clay is a data enrichment and go-to-market workflow tool. Teams build tables of companies and people, pull in data from many providers, and use it to research and personalise outreach.",
      "Phone outreach is often the step that happens outside those tables. A DIGIRINGO integration would aim to bring call and text results back in, so lists stay current.",
    ],
    willDo: [
      { title: "Activity columns", body: "Whether a lead was called or texted, and when, could appear as Clay columns.", icon: "list" },
      { title: "Number checks", body: "Phone numbers in Clay could be matched with DIGIRINGO conversations.", icon: "search" },
      { title: "Workflow triggers", body: "A DIGIRINGO call or reply could update a row or trigger the next step.", icon: "zap" },
    ],
    faq: [
      { q: "Can I use DIGIRINGO with Clay today?", a: "Not through a built-in integration. It is planned." },
      { q: "Will DIGIRINGO support bulk outbound texting?", a: "DIGIRINGO is built for one-to-one business texting. US texting requires 10DLC registration and follows carrier rules on consent." },
      { q: "Will this include phone number enrichment?", a: "No. Clay handles enrichment. Our side would supply call and text activity." },
      { q: "How do I follow progress?", a: "Ask to be notified from this page." },
    ],
  },

  // ─────────────── Automation
  {
    slug: "zapier", name: "Zapier", cat: "Automation", icon: "zap",
    blurb: "Trigger Zaps from calls and texts, no code needed.",
    title: "Zapier Integration (Coming Soon) | DIGIRINGO",
    description: "Planned DIGIRINGO app for Zapier: start Zaps from calls, missed calls and texts and send messages from other apps. See what it will do and what works today.",
    sub: "A DIGIRINGO app for Zapier is planned, so you can connect calls and texts to thousands of other tools without writing code.",
    bullets: ["Triggers for calls, missed calls and texts", "Actions to send an SMS", "No code required"],
    shot: "inbox",
    about: [
      "Zapier is a no-code automation service. You build Zaps: when something happens in one app (a trigger), Zapier does something in another (an action). It connects a very large catalogue of apps.",
      "For a phone service, Zapier is a way to connect with tools we will never build a direct integration for, such as spreadsheets, email tools and niche industry software.",
    ],
    willDo: [
      { title: "Call triggers", body: "New call, missed call and new voicemail could start a Zap.", icon: "phone-missed" },
      { title: "Text triggers", body: "An incoming SMS could start a Zap with the sender and message.", icon: "message" },
      { title: "Send SMS action", body: "Other apps could send a text from your DIGIRINGO number, within carrier rules.", icon: "send" },
    ],
    faq: [
      { q: "Is DIGIRINGO on Zapier yet?", a: "No. The Zapier app is planned and not published." },
      { q: "Can I use a Zapier webhook with my DIGIRINGO number now?", a: "Not reliably. Our webhook route expects your URL to reply with TeXML call instructions, and Zapier's catch hooks do not return custom responses." },
      { q: "Will automated texts cost extra?", a: "Texts would be billed at the normal SMS rate, $0.015 per message within the US and Canada." },
      { q: "What triggers would you like?", a: "Tell us through Get notified. Requests shape the first version." },
    ],
  },
  {
    slug: "make", name: "Make", cat: "Automation", icon: "git-branch",
    blurb: "Build visual scenarios around calls and SMS.",
    title: "Make Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO app for Make (formerly Integromat) to use calls and texts in visual automation scenarios. See what is coming and what you can do right now.",
    sub: "We plan a DIGIRINGO app for Make so calls and texts can be modules in your visual scenarios.",
    bullets: ["Call and SMS events as scenario triggers", "Send texts from scenarios", "Branching and filters handled in Make"],
    shot: "activity",
    about: [
      "Make, formerly called Integromat, is a visual automation platform. You build scenarios on a canvas by linking modules from different apps, with routers, filters and data mapping between steps.",
      "Make is a good fit for multi-step logic around the phone, like sending a missed caller a text and adding them to a sheet, which is the kind of flow the DIGIRINGO app would support.",
    ],
    willDo: [
      { title: "Watch calls", body: "A module could fire on new or missed calls with caller details.", icon: "phone-incoming" },
      { title: "Watch texts", body: "Incoming SMS could start a scenario.", icon: "message" },
      { title: "Send SMS", body: "A module could send a text from one of your numbers.", icon: "send" },
    ],
    faq: [
      { q: "Is the Make app available?", a: "No. It is planned." },
      { q: "Can Make handle my number's webhook today?", a: "Advanced users can try. Our webhook route needs a TeXML reply, so the scenario must return a custom webhook response. This is beta and we do not provide templates yet." },
      { q: "Will it support international numbers?", a: "Yes, any number on your DIGIRINGO account should work, subject to that number's SMS support." },
      { q: "How will I know when it launches?", a: "Use Get notified on this page." },
    ],
  },
  {
    slug: "pipedream", name: "Pipedream", cat: "Automation", icon: "code",
    blurb: "Code-friendly workflows triggered by calls and texts.",
    title: "Pipedream Integration (Coming Soon) | DIGIRINGO",
    description: "Planned DIGIRINGO components for Pipedream: call and SMS triggers and actions for code-first workflows. See the plan and the webhook routing live today.",
    sub: "Pipedream suits developers who want automation with real code. We plan DIGIRINGO triggers and actions for it.",
    bullets: ["Event sources for calls and texts", "Send SMS from a workflow step", "Mix with your own Node.js or Python steps"],
    shot: "settings",
    about: [
      "Pipedream is a workflow platform for developers. Workflows start from triggers such as HTTP requests or app events, and each step can be a pre-built action or your own code in languages like Node.js and Python.",
      "Because Pipedream can receive HTTP requests and send custom responses, it pairs naturally with phone webhooks. Official DIGIRINGO components would make it simpler still.",
    ],
    willDo: [
      { title: "Call and SMS sources", body: "Pre-built triggers for new calls, missed calls and incoming texts.", icon: "zap" },
      { title: "SMS action", body: "A step to send a text from a chosen DIGIRINGO number.", icon: "send" },
      { title: "Typed event data", body: "Clean, documented fields for caller, number and timestamps.", icon: "code" },
    ],
    faq: [
      { q: "Are there DIGIRINGO components on Pipedream yet?", a: "No. They are planned." },
      { q: "Can I point my number's webhook at Pipedream?", a: "Yes, if your workflow returns a valid TeXML response to the request. The webhook route is in beta." },
      { q: "Is there a REST API I can call from a step?", a: "A full public API is coming soon. It is not available yet." },
      { q: "Where are the webhook docs?", a: "See the webhooks integration page and the developers page for what the beta supports." },
    ],
  },
  {
    slug: "relay-app", name: "Relay.app", cat: "Automation", icon: "repeat",
    blurb: "Phone steps in workflows with human approvals.",
    title: "Relay.app Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO integration for Relay.app to add calls and texts to workflows with AI steps and human approvals. See the plan and what works today.",
    sub: "Relay.app workflows can pause for a person to check things. We plan to add DIGIRINGO calls and texts to those flows.",
    bullets: ["Call and text triggers", "Send a text after a human approves it", "Works with Relay's AI steps"],
    shot: "inbox",
    about: [
      "Relay.app is a workflow automation tool that combines app integrations with AI steps and human-in-the-loop checkpoints, where a teammate reviews or approves something before the workflow continues.",
      "That approval step suits customer texting well: draft a reply automatically, have someone glance at it, then send. A DIGIRINGO integration would make that possible.",
    ],
    willDo: [
      { title: "Incoming text trigger", body: "Start a workflow when a customer texts your number.", icon: "message" },
      { title: "Missed call trigger", body: "Kick off follow-up when a call goes unanswered.", icon: "phone-missed" },
      { title: "Approved send", body: "Send an SMS from DIGIRINGO after a person approves it in Relay.", icon: "check" },
    ],
    faq: [
      { q: "Is DIGIRINGO available in Relay.app?", a: "Not yet. The integration is planned." },
      { q: "Can AI write my texts automatically?", a: "Relay's AI steps could draft them once the integration exists. DIGIRINGO itself does not generate replies today." },
      { q: "Will texts follow carrier rules?", a: "Yes. US business texting needs 10DLC registration and consent from recipients, whatever tool sends the message." },
      { q: "How can I get early access?", a: "Use Get notified and mention Relay.app." },
    ],
  },

  // ─────────────── AI assistants
  {
    slug: "chatgpt", name: "ChatGPT", cat: "AI assistants", icon: "sparkles",
    blurb: "Ask ChatGPT about your calls and texts.",
    title: "ChatGPT Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO connection for ChatGPT to ask about recent calls and draft texts from your business number. See the plan and the AI routing live today.",
    sub: "We plan to let ChatGPT read your DIGIRINGO activity, with your permission, so you can ask questions and draft replies in plain language.",
    bullets: ["Ask about recent calls and texts", "Draft replies to customers", "You approve anything before it is sent"],
    shot: "chat",
    about: [
      "ChatGPT is OpenAI's AI assistant. People use it to write, summarise, answer questions and, through connectors, work with data from other apps.",
      "Connected to DIGIRINGO, it could answer things like which customers called yesterday, or draft a follow-up text, without you digging through history yourself.",
    ],
    willDo: [
      { title: "Activity questions", body: "Ask who called, who you missed, or which texts are waiting for a reply.", icon: "search" },
      { title: "Draft texts", body: "Have ChatGPT write a reply that you review before sending.", icon: "send" },
      { title: "Permission controls", body: "Choose which numbers and data the assistant can see.", icon: "lock" },
    ],
    faq: [
      { q: "Does DIGIRINGO work with ChatGPT today?", a: "No. The connection is planned and not available yet." },
      { q: "Can I use an OpenAI-powered voice agent on my number now?", a: "If you run your own AI voice agent that accepts SIP or webhook calls, you can route a DIGIRINGO number to it today (beta)." },
      { q: "Will ChatGPT send texts on its own?", a: "Our plan is that sending always needs your confirmation." },
      { q: "Will this cost extra?", a: "Pricing is not set. Any cost would be published before launch." },
    ],
  },
  {
    slug: "claude", name: "Claude", cat: "AI assistants", icon: "bot",
    blurb: "Work with your DIGIRINGO activity from Claude.",
    title: "Claude Integration (Coming Soon) | DIGIRINGO",
    description: "Planned DIGIRINGO connector for Claude, Anthropic's AI assistant, to look up calls and texts and draft replies you approve. See what works with DIGIRINGO today.",
    sub: "A DIGIRINGO connector for Claude is planned, so you can look up phone activity and draft customer replies from a conversation.",
    bullets: ["Look up calls and texts in plain language", "Draft follow-ups for review", "Access limited to what you allow"],
    shot: "inbox",
    about: [
      "Claude is an AI assistant made by Anthropic. It can connect to other tools through the Model Context Protocol (MCP), which lets it read data and take actions in apps you authorise.",
      "A DIGIRINGO connector would let Claude see your calls and texts and help with follow-up, with you deciding what it can access and confirming anything it sends.",
    ],
    willDo: [
      { title: "Search your history", body: "Ask Claude about recent callers, missed calls or open text threads.", icon: "search" },
      { title: "Prepare replies", body: "Draft SMS responses that you approve before they go out.", icon: "message" },
      { title: "Scoped access", body: "Limit the connector to specific numbers.", icon: "shield" },
    ],
    faq: [
      { q: "Is the Claude connector available?", a: "No. It is planned. Our MCP work is listed as coming soon." },
      { q: "Can Claude answer my phone?", a: "Not through this connector. If you have your own AI voice agent, you can route a number to it by SIP or webhook today." },
      { q: "Will my data be used to train models?", a: "That depends on the AI provider's terms and your account settings. We will document exactly what the connector shares." },
      { q: "How do I get notified?", a: "Use Get notified on this page." },
    ],
  },

  // ─────────────── Collaboration
  {
    slug: "slack", name: "Slack", cat: "Collaboration", icon: "messages",
    blurb: "Missed calls, voicemails and texts posted to channels.",
    title: "Slack Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and Slack integration to post missed calls, voicemails and new texts into channels. See how it will work and what keeps you covered today.",
    sub: "We plan to post DIGIRINGO alerts into Slack, so your team sees missed calls and new texts where they already talk.",
    bullets: ["Missed call and voicemail alerts", "New text notifications per number", "Pick the channel for each number"],
    shot: "activity",
    about: [
      "Slack is a messaging app for teams, organised into channels by topic, project or team. Many businesses use it as their main place for internal communication and alerts from other tools.",
      "Phone alerts in Slack help small teams react quickly: someone sees the missed call in the channel and calls back, even if the person it was meant for is busy.",
    ],
    willDo: [
      { title: "Channel alerts", body: "Missed calls, voicemails and texts posted to the channel you choose.", icon: "bell" },
      { title: "Per-number routing", body: "Send sales-line alerts to one channel and support-line alerts to another.", icon: "route" },
      { title: "Quick call back", body: "Open the caller in DIGIRINGO straight from the Slack message.", icon: "phone-outgoing" },
    ],
    faq: [
      { q: "Can DIGIRINGO post to Slack today?", a: "No. The Slack integration is planned and not available yet." },
      { q: "Will I be able to reply to texts from Slack?", a: "The first version would focus on alerts. Replying from Slack may come later." },
      { q: "How do I avoid missing calls now?", a: "Sign in on the web app and the Android app. Both ring together, with browser notifications, and unanswered calls forward to your cell." },
      { q: "Is this tied to the Slack VoIP feature page?", a: "Yes, it is the same planned work. Both are marked coming soon." },
    ],
  },

  // ─────────────── Contacts
  {
    slug: "google-contacts", name: "Google Contacts", cat: "Contacts", icon: "user",
    blurb: "See names instead of numbers, synced from Google.",
    title: "Google Contacts Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and Google Contacts sync so callers show up by name and you can dial saved contacts. See what it will do and what works now.",
    sub: "We plan to sync your Google Contacts so calls and texts show names, not just numbers.",
    bullets: ["Caller names from your Google address book", "Dial saved contacts from the app", "Read-only sync, you stay in control"],
    shot: "dialer",
    about: [
      "Google Contacts is Google's address book. It stores names, numbers and other details for your Google account and syncs them with Gmail, Android and other Google services.",
      "Many small businesses already keep customer details there. Syncing it to DIGIRINGO would mean recognising callers at a glance without setting up a separate CRM.",
    ],
    willDo: [
      { title: "Name display", body: "Incoming calls and texts would show the matching contact's name.", icon: "phone-incoming" },
      { title: "Contact search in the dialer", body: "Start typing a name and dial from your Google address book.", icon: "search" },
      { title: "Choose what syncs", body: "Pick contact groups or labels to bring in.", icon: "settings" },
    ],
    faq: [
      { q: "Does DIGIRINGO sync Google Contacts now?", a: "No. Contact management and this sync are planned." },
      { q: "Will DIGIRINGO edit my Google contacts?", a: "Our plan is a read-only sync to start." },
      { q: "Can I search my call history?", a: "You can scroll and call back from history today. Contact-based search is part of the planned work." },
      { q: "Will it work with Android's contacts?", a: "Android contacts tied to your Google account would be covered by the same sync." },
    ],
  },

  // ─────────────── Conversation intelligence
  {
    slug: "gong", name: "Gong", cat: "Conversation intelligence", icon: "chart",
    blurb: "Send call recordings to Gong for analysis.",
    title: "Gong Integration (Coming Soon) | DIGIRINGO",
    description: "Planned DIGIRINGO integration for Gong to send call recordings for analysis and coaching. Recording is also coming soon. See what is live today.",
    sub: "Gong analyses sales conversations. Once DIGIRINGO call recording is live, we plan to send recordings to Gong.",
    bullets: ["Recorded calls shared with Gong", "Calls matched to reps and deals", "Requires call recording (coming soon)"],
    shot: "calls",
    about: [
      "Gong is a revenue intelligence platform. It records and analyses sales calls and meetings, surfaces trends across deals, and helps managers coach reps based on what actually happens in conversations.",
      "Gong needs recordings to work with. DIGIRINGO call recording is still on the roadmap, so this integration depends on that shipping first.",
    ],
    willDo: [
      { title: "Recording export", body: "Recorded DIGIRINGO calls would be sent to Gong automatically.", icon: "mic" },
      { title: "Rep matching", body: "Calls would be attributed to the right user in Gong.", icon: "user" },
      { title: "Call metadata", body: "Direction, duration and numbers passed along with each recording.", icon: "list" },
    ],
    faq: [
      { q: "Does DIGIRINGO record calls?", a: "Not yet. Call recording is coming soon. This integration depends on it." },
      { q: "Is the Gong integration available?", a: "No. It is planned." },
      { q: "Will consent announcements be supported?", a: "Recording laws vary by location. We plan to offer a recording notice option when recording launches." },
      { q: "Who is this for?", a: "Sales teams that already use Gong and want their phone calls included." },
    ],
  },
  {
    slug: "fireflies", name: "Fireflies", cat: "Conversation intelligence", icon: "file",
    blurb: "Transcripts and notes for your phone calls.",
    title: "Fireflies Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and Fireflies.ai integration for transcripts and searchable notes on phone calls, once call recording is live. See what works today.",
    sub: "Fireflies writes up meetings. We plan to send DIGIRINGO call recordings to it, once recording is available, for transcripts and notes.",
    bullets: ["Phone calls transcribed in Fireflies", "Searchable notes next to your meetings", "Depends on call recording (coming soon)"],
    shot: "calls",
    about: [
      "Fireflies.ai is an AI note-taker. It joins or ingests meetings and calls, transcribes them, and produces summaries and searchable notes your team can share.",
      "Adding phone calls means your sales or support calls sit next to your video meetings in one searchable place. That requires DIGIRINGO call recording, which is still coming.",
    ],
    willDo: [
      { title: "Send recordings", body: "Recorded calls would be uploaded to your Fireflies workspace.", icon: "send" },
      { title: "Transcripts and summaries", body: "Fireflies would transcribe and summarise them as it does for meetings.", icon: "file" },
      { title: "Per-number control", body: "Choose which numbers' calls are shared.", icon: "settings" },
    ],
    faq: [
      { q: "Can I get call transcripts in DIGIRINGO now?", a: "No. Call recording, transcription and AI summaries are all coming soon." },
      { q: "Is the Fireflies integration live?", a: "No. It is planned and depends on call recording." },
      { q: "Will voicemails be included?", a: "Possibly. We will share details at launch." },
      { q: "Can I get notified?", a: "Yes, use the Get notified button." },
    ],
  },

  // ─────────────── Home services
  {
    slug: "jobber", name: "Jobber", cat: "Home services", icon: "wrench",
    blurb: "Link calls and texts to Jobber clients and jobs.",
    title: "Jobber Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and Jobber integration to match callers to Jobber clients and log calls and texts on their record. See what crews can use today.",
    sub: "We plan to connect DIGIRINGO to Jobber so the office can see which client is calling and keep a record of every call and text.",
    bullets: ["Caller matched to Jobber clients", "Calls and texts saved on the client record", "New leads from unknown callers"],
    shot: "calls",
    about: [
      "Jobber is field service management software for home service businesses such as landscaping, cleaning and HVAC. It handles quotes, scheduling, invoicing and payments, plus a client hub for customers.",
      "Most home service work starts with a phone call. Linking calls and texts to Jobber clients would save office staff from switching screens to find out who is on the line.",
    ],
    willDo: [
      { title: "Client lookup", body: "See the Jobber client's name and address when they call.", icon: "home" },
      { title: "Communication history", body: "Calls and SMS logged on the client in Jobber.", icon: "list" },
      { title: "Lead capture", body: "Turn a new caller into a Jobber request in a tap.", icon: "user" },
    ],
    faq: [
      { q: "Does DIGIRINGO work with Jobber today?", a: "Not through an integration. It is planned." },
      { q: "Can my techs answer calls in the field?", a: "Yes. Install the Android app, or calls can forward to their cellphone if the app is not answered." },
      { q: "Can I text customers on-the-way updates?", a: "Yes, one at a time from your business number. Automated texts are coming soon." },
      { q: "Can I get a local number for each area I serve?", a: "Yes. Local US numbers are $2.50 a month each." },
    ],
  },
  {
    slug: "dripjobs", name: "DripJobs", cat: "Home services", icon: "truck",
    blurb: "Keep contractor leads and follow-ups in sync.",
    title: "DripJobs Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and DripJobs integration for contractors: callers matched to leads, calls and texts logged in the pipeline. See what works right now.",
    sub: "DripJobs helps contractors follow up with leads. We plan to connect DIGIRINGO calls and texts to that pipeline.",
    bullets: ["Calls and texts on DripJobs leads", "New callers added as leads", "Fits your follow-up sequences"],
    shot: "inbox",
    about: [
      "DripJobs is a CRM for home service contractors, especially painting companies. It tracks leads through a pipeline and combines automated follow-ups, proposals, scheduling, invoicing and two-way texting.",
      "Since DripJobs already handles follow-up, the useful link is getting phone activity into it, so a call from a lead is not lost between systems.",
    ],
    willDo: [
      { title: "Lead activity", body: "Calls from known numbers logged on the matching lead.", icon: "list" },
      { title: "New lead creation", body: "Unknown callers added to your DripJobs pipeline.", icon: "user" },
      { title: "Stage-aware context", body: "See the lead's stage when they call.", icon: "chart" },
    ],
    faq: [
      { q: "Is there a DripJobs integration now?", a: "No. It is planned." },
      { q: "DripJobs already texts. Why add DIGIRINGO?", a: "DIGIRINGO gives you business numbers, browser and Android calling, forwarding and routing. The integration would keep both systems in sync." },
      { q: "Does DIGIRINGO support toll-free numbers?", a: "Yes, for voice. Toll-free texting verification is coming soon." },
      { q: "How do I hear about it?", a: "Use Get notified on this page." },
    ],
  },

  // ─────────────── Legal
  {
    slug: "legalmate", name: "LegalMate", cat: "Legal", icon: "scale",
    blurb: "Client calls logged to matters for time tracking.",
    title: "LegalMate Integration (Coming Soon) | DIGIRINGO",
    description: "A planned DIGIRINGO and LegalMate integration so law firm calls can be captured and logged to the right matter for time entries. See what firms can use today.",
    sub: "LegalMate helps law firms capture client communication. We plan to make DIGIRINGO one of the phone systems it can read from.",
    bullets: ["Client calls captured automatically", "Logged against the right matter", "Less time reconstructing billable calls"],
    shot: "calls",
    about: [
      "LegalMate is a communication capture tool for law firms. It connects to a firm's phone system and email and logs calls and messages against the right matter in Clio, including time entries and call summaries.",
      "Phone calls are often unbilled because nobody wrote them down. A DIGIRINGO connection would let LegalMate pick up calls from DIGIRINGO numbers the same way it does with other phone systems.",
    ],
    willDo: [
      { title: "Call capture", body: "DIGIRINGO call details made available to LegalMate.", icon: "phone-call" },
      { title: "Matter logging", body: "LegalMate would match calls to clients and matters on its side.", icon: "file" },
      { title: "Per-attorney numbers", body: "Each attorney's number mapped to the right user.", icon: "user" },
    ],
    faq: [
      { q: "Does DIGIRINGO work with LegalMate today?", a: "No. The integration is planned." },
      { q: "Does DIGIRINGO record calls for summaries?", a: "Not yet. Call recording and transcription are coming soon." },
      { q: "Can attorneys keep their personal numbers private?", a: "Yes. Each attorney can call and text from a DIGIRINGO business number in the browser or Android app." },
      { q: "Is DIGIRINGO HIPAA or bar-compliance certified?", a: "We do not claim any certifications. See our security page for what we do to protect accounts." },
    ],
  },
];

// ─────────────── Webhooks (beta)
const WEBHOOKS: PageDoc = {
  path: "/integrations/webhooks",
  title: "Webhooks: Route Calls to Your Own App | DIGIRINGO",
  description: "Point any DIGIRINGO number at your own webhook and control incoming calls with TeXML. Live in beta today; more event webhooks and a full API are coming soon.",
  crumbs: [{ label: "Integrations", href: "/integrations" }],
  status: "beta",
  sections: [
    {
      type: "hero",
      eyebrow: "Integrations · Developer",
      h1: "Webhooks for your phone numbers",
      sub: "Send a number's incoming calls to a URL you control. Your server replies with TeXML and decides what happens next: play a message, gather digits, dial someone, or hand off to an AI agent.",
      bullets: ["Set per number in the app", "Answer with TeXML call instructions", "Works alongside SIP and cellphone routing"],
      shot: "settings",
      primary: { label: "Get your number", href: "/app" },
      secondary: { label: "Developer overview", href: "/developers" },
    },
    {
      type: "definition",
      title: "What is a call webhook?",
      paragraphs: [
        "A webhook is an HTTP request sent to your server when something happens. With DIGIRINGO, the event is an incoming call to one of your numbers. The request tells your server who is calling and which number they dialled.",
        "Your server responds with TeXML, an XML format for call control. That response tells the call what to do. It is the same idea many voice platforms use, so if you have built call flows before, it will feel familiar.",
      ],
      tone: "tint",
    },
    {
      type: "steps",
      title: "Set it up in DIGIRINGO",
      items: [
        { title: "Buy or pick a number", body: "Any number on your account can be routed, local or toll-free, US or international.", icon: "hash" },
        { title: "Open the number's routing", body: "In number settings, choose Webhook as the destination for incoming calls.", icon: "route" },
        { title: "Enter your HTTPS URL", body: "Use a public HTTPS endpoint that returns valid TeXML within a few seconds.", icon: "webhook" },
        { title: "Call it and watch your logs", body: "Ring the number from your cellphone and check your server received the request and responded.", icon: "phone-call" },
      ],
    },
    {
      type: "tabs",
      title: "What is available",
      intro: "Webhook routing is in beta. Here is what exists and what is still to come.",
      tabs: [
        {
          name: "Today (beta)",
          items: [
            { title: "Incoming call webhook", body: "Each incoming call on a routed number triggers a request to your URL.", icon: "phone-incoming", status: "beta" },
            { title: "TeXML responses", body: "Control the call with your TeXML reply.", icon: "code", status: "beta" },
            { title: "Per-number setting", body: "Route some numbers to your webhook and keep others ringing the app.", icon: "settings", status: "live" },
            { title: "SIP agent routing", body: "Prefer SIP? Point a number at a SIP address instead.", icon: "bot", status: "beta" },
          ],
        },
        {
          name: "Coming soon",
          items: [
            { title: "SMS event webhooks", body: "Notifications for incoming texts and delivery status.", icon: "message", status: "soon" },
            { title: "Call event webhooks", body: "Missed call, voicemail and call-ended events for apps that do not control the call.", icon: "bell", status: "soon" },
            { title: "Public REST API", body: "Manage numbers, send texts and read history from your own code.", icon: "code", status: "soon" },
            { title: "Signed requests", body: "Signatures so you can verify each request came from DIGIRINGO.", icon: "lock", status: "soon" },
          ],
        },
      ],
      tone: "tint",
    },
    {
      type: "cards",
      title: "What people build with it",
      items: [
        { title: "AI voice agents", body: "Hand calls to an AI agent you host, with your own prompts and tools.", icon: "bot", href: "/ai-agent", status: "beta" },
        { title: "Custom phone menus", body: "Write your own press-1-for-sales logic while our built-in menus are still coming.", icon: "list" },
        { title: "CRM lookups", body: "Check the caller against your database and route VIPs differently.", icon: "search" },
      ],
      cols: 3,
    },
    {
      type: "callout",
      title: "Beta means beta",
      body: "Webhook routing works today, but the request format may still change and there is no request signing yet. Keep a fallback number that rings the app for anything business-critical.",
      tone: "dark",
    },
    { type: "cta", title: "Route your first number in a few minutes", button: { label: "Get your number", href: "/app" } },
    {
      type: "faq",
      title: "Webhooks FAQ",
      items: [
        { q: "What does my server need to return?", a: "Valid TeXML describing what the call should do. If your server errors or times out, the call cannot be handled as you intended, so test carefully." },
        { q: "Are calls through the webhook billed differently?", a: "No. Calls are billed at normal rates, for example $0.015 a minute within the US and Canada." },
        { q: "Can I get webhooks for text messages?", a: "Not yet. SMS event webhooks are coming soon." },
        { q: "Can I use Zapier with this?", a: "Not reliably, because the endpoint must respond with TeXML. Tools that let you return a custom HTTP response work better." },
        { q: "Is there an API key or REST API?", a: "A full public API is coming soon. Today, routing is configured in the app per number." },
      ],
    },
  ],
  related: ["/developers", "/ai-agent", "/product/call-routing", "/integrations/pipedream"],
};

// ─────────────── /integrations index
const CATS: Cat[] = ["CRM", "Automation", "AI assistants", "Collaboration", "Contacts", "Conversation intelligence", "Home services", "Legal", "Developer"];

const INDEX: PageDoc = {
  path: "/integrations",
  title: "Integrations for DIGIRINGO | DIGIRINGO",
  description: "See the integrations planned for DIGIRINGO: HubSpot, Salesforce, Slack, Zapier, ChatGPT, Claude and more. Per-number call webhooks are live in beta.",
  status: "soon",
  sections: [
    {
      type: "hero",
      eyebrow: "Integrations",
      h1: "Connect DIGIRINGO to the tools you use",
      sub: "We are building connections to popular CRMs, automation tools and AI assistants. Most are not ready yet, and each one is clearly marked. Per-number call webhooks work today in beta.",
      bullets: ["20 integrations planned or in beta", "Webhook and SIP routing available now", "Tell us which one you need first"],
      shot: "settings",
      layout: "split",
    },
    {
      type: "definition",
      title: "Where integrations stand",
      paragraphs: [
        "DIGIRINGO's core, numbers, calling, texting, forwarding and routing, is live. Integrations with other apps are the next layer, and none of the third-party connectors below are available yet.",
        "If you are a developer, you do not have to wait. Any number can send its incoming calls to your own webhook or SIP endpoint, which is enough to build custom call flows or connect an AI voice agent.",
      ],
      tone: "tint",
    },
    {
      type: "tabs",
      title: "Browse by category",
      tabs: CATS.map((cat) => ({
        name: cat,
        items:
          cat === "Developer"
            ? [{ title: "Webhooks", body: "Route a number's incoming calls to your own URL and control them with TeXML.", icon: "webhook" as const, href: "/integrations/webhooks", status: "beta" as const }]
            : INTEGRATIONS.filter((i) => i.cat === cat).map((i) => ({ title: i.name, body: i.blurb, icon: i.icon, href: `/integrations/${i.slug}`, status: "soon" as const })),
      })),
    },
    {
      type: "steps",
      title: "What you can connect today",
      items: [
        { title: "Your own webhook", body: "Set a number's routing to Webhook and answer calls with TeXML from your server.", icon: "webhook", status: "beta" },
        { title: "A SIP or AI agent", body: "Send calls to any SIP address, such as an AI voice agent you run.", icon: "bot", status: "beta" },
        { title: "Your cellphone", body: "Forward unanswered calls to any mobile number, in the US or abroad.", icon: "phone-forwarded" },
      ],
      tone: "plain",
    },
    {
      type: "callout",
      title: "We would rather under-promise",
      body: "Every integration marked coming soon is exactly that: not built yet. We do not show logos as if they were working partners, and we will not list an integration as live until you can use it.",
      tone: "dark",
    },
    {
      type: "faq",
      title: "Integrations FAQ",
      items: [
        { q: "Which integration is coming first?", a: "We have not committed to an order. Requests through Get notified on each page help us decide." },
        { q: "Is there a public API?", a: "A full REST API is coming soon. Per-number webhook routing is available in beta today." },
        { q: "Will integrations cost extra?", a: "Pricing is not set. DIGIRINGO has no per-user fees today, and we will publish any integration costs before launch." },
        { q: "Can I request an app that is not listed?", a: "Yes. Use the contact page and tell us what you use and what you would want it to do." },
      ],
    },
    { type: "cta", title: "Start with the parts that work today", body: "Numbers, calls, texts and routing are live now.", button: { label: "Get your number", href: "/app" }, tone: "tint" },
  ],
  related: ["/integrations/webhooks", "/developers", "/ai-agent", "/product"],
};

// ─────────────── Spanish & French landing pages
const ES_FREE: PageDoc = {
  path: "/es/mensajes-de-texto-gratuitos",
  title: "Mensajes de texto para empresas a bajo costo | DIGIRINGO",
  description: "¿Buscas mensajes de texto gratuitos? DIGIRINGO no es gratis, pero cada SMS en EE. UU. y Canadá cuesta solo $0.015, sin planes ni cuotas por usuario.",
  status: "live",
  sections: [
    {
      type: "hero",
      eyebrow: "Mensajes de texto",
      h1: "Mensajes de texto para tu negocio, a muy bajo costo",
      sub: "Seamos claros: DIGIRINGO no ofrece SMS gratis. Lo que sí ofrecemos es un precio muy bajo, $0.015 por mensaje en Estados Unidos y Canadá, sin contrato y sin pagar por cada usuario.",
      bullets: ["$0.015 por mensaje en EE. UU. y Canadá", "Sin planes mensuales ni cuotas por usuario", "Envía y responde desde el navegador o Android"],
      shot: "chat",
      primary: { label: "Obtén tu número", href: "/app" },
      secondary: { label: "Ver precios", href: "/pricing" },
    },
    {
      type: "definition",
      title: "¿Por qué no hay SMS empresariales realmente gratis?",
      paragraphs: [
        "Cada mensaje que envía una empresa pasa por los operadores telefónicos, y ellos cobran por entregarlo. En Estados Unidos, además, los operadores exigen que las empresas registren su marca y su campaña (registro A2P 10DLC) antes de enviar mensajes desde números locales.",
        "Las apps que prometen textos gratis suelen cobrar de otra forma: con publicidad, con planes por usuario o con límites estrictos. Nosotros preferimos cobrarte poco y decirte exactamente cuánto: $0.015 por SMS, descontado de tu saldo prepago.",
      ],
      tone: "tint",
    },
    {
      type: "cards",
      title: "Lo que obtienes",
      items: [
        { title: "Conversaciones de ida y vuelta", body: "Recibe y responde mensajes de tus clientes, organizados en un hilo por cliente y por número.", icon: "messages" },
        { title: "Confirmación de entrega", body: "Ves cuándo el operador confirma que tu mensaje llegó.", icon: "check" },
        { title: "Registro 10DLC guiado", body: "Nuestro Trust Center te acompaña paso a paso. Las tarifas del operador se cobran al costo.", icon: "shield" },
        { title: "Billetera prepago", body: "Recarga $5, $10, $20 o $50. Nunca gastas más de lo que recargaste.", icon: "wallet" },
      ],
      cols: 4,
    },
    {
      type: "table",
      title: "¿Cuánto cuesta en la práctica?",
      intro: "Ejemplos con precios de EE. UU. y Canadá.",
      head: ["Uso mensual", "Costo de mensajes", "Número local"],
      rows: [
        ["100 mensajes", "$1.50", "$2.50/mes"],
        ["500 mensajes", "$7.50", "$2.50/mes"],
        ["1,000 mensajes", "$15.00", "$2.50/mes"],
      ],
      note: "Los mensajes largos o con caracteres especiales pueden dividirse en varios segmentos. Las tarifas de registro 10DLC del operador son aparte y se cobran al costo.",
    },
    {
      type: "steps",
      title: "Cómo empezar a enviar mensajes",
      items: [
        { title: "Crea tu cuenta y elige un número", body: "Busca por código de área y compra un número local de EE. UU. por $2.50 al mes.", icon: "hash" },
        { title: "Registra tu negocio para SMS", body: "Completa el registro 10DLC en el Trust Center. La aprobación del operador tarda de 1 a 7 días.", icon: "shield" },
        { title: "Recarga y escribe", body: "Agrega saldo con tarjeta y empieza a conversar con tus clientes desde la app.", icon: "send" },
      ],
      tone: "tint",
    },
    {
      type: "cta",
      title: "Paga solo por los mensajes que envías",
      button: { label: "Obtén tu número", href: "/app" },
      tone: "dark",
    },
    {
      type: "faq",
      title: "Preguntas frecuentes",
      items: [
        { q: "¿DIGIRINGO tiene un plan gratis?", a: "No. Es un servicio prepago: pagas el número ($2.50 al mes en EE. UU.) y cada mensaje ($0.015 en EE. UU. y Canadá)." },
        { q: "¿Puedo enviar fotos (MMS)?", a: "Todavía no. Los mensajes con imágenes (MMS) llegarán pronto. Hoy puedes enviar y recibir SMS de texto." },
        { q: "¿Puedo enviar mensajes a otros países?", a: "Sí, si el número lo permite. El precio varía según el país y lo ves en la lista de tarifas." },
        { q: "¿Puedo enviar mensajes en grupo o programados?", a: "Aún no. Los mensajes grupales, las respuestas automáticas y los mensajes programados están en camino." },
        { q: "¿Por qué tengo que registrarme para enviar SMS?", a: "Los operadores de EE. UU. lo exigen a todas las empresas que envían mensajes desde números locales. Sin registro, los mensajes pueden bloquearse." },
      ],
    },
  ],
  related: ["/es/numeros-sms-virtuales", "/es/sms-mms-empresarial", "/product/messaging/two-way-sms", "/pricing"],
};

const ES_VIRTUAL: PageDoc = {
  path: "/es/numeros-sms-virtuales",
  title: "Números virtuales para SMS y llamadas | DIGIRINGO",
  description: "Consigue un número virtual de EE. UU., Canadá u otros países para SMS y llamadas desde el navegador o Android. Desde $2.50 al mes, sin contrato.",
  status: "live",
  sections: [
    {
      type: "hero",
      eyebrow: "Números virtuales",
      h1: "Un número virtual para enviar SMS y atender llamadas",
      sub: "Separa tu vida personal de tu negocio con un número propio. Funciona por internet, en el navegador y en la app de Android, sin tarjeta SIM nueva.",
      bullets: ["Números locales de EE. UU. desde $2.50 al mes", "Números en Canadá y en muchos otros países", "SMS y llamadas en la misma app"],
      shot: "numbers",
      primary: { label: "Obtén tu número", href: "/app" },
      secondary: { label: "Ver tarifas", href: "/rates" },
    },
    {
      type: "definition",
      title: "¿Qué es un número SMS virtual?",
      paragraphs: [
        "Es un número de teléfono real que no está atado a una tarjeta SIM ni a un aparato. Vive en la nube: lo usas desde una app o desde el navegador, y tus clientes lo ven como cualquier otro número.",
        "Con DIGIRINGO puedes enviar y recibir SMS desde ese número, hacer y recibir llamadas, y desviarlas a tu celular si no contestas. Puedes tener varios números en la misma cuenta, por ejemplo uno por ciudad o por país.",
      ],
      tone: "tint",
    },
    {
      type: "flex",
      title: "Cómo funciona",
      rows: [
        { title: "Elige tu número", body: "Busca por código de área en EE. UU. o elige otro país. Ves el precio mensual antes de comprar. Algunos países piden documentos de identidad o domicilio, que el operador revisa en 1 a 3 días.", shot: "buy", icon: "search" },
        { title: "Envía y recibe mensajes", body: "En números de EE. UU. y Canadá, los SMS funcionan después del registro 10DLC. En otros países depende de si el número admite SMS.", shot: "chat", icon: "message" },
        { title: "Atiende llamadas en todos tus dispositivos", body: "Las llamadas suenan a la vez en el navegador y en Android. Si nadie contesta en unos 30 segundos, pasan a tu celular.", shot: "calls", icon: "phone-incoming" },
      ],
    },
    {
      type: "cards",
      title: "Ideal para",
      items: [
        { title: "Pequeños negocios", body: "Un número profesional sin compartir tu celular personal.", icon: "store" },
        { title: "Negocios con clientes en EE. UU.", body: "Ten un número estadounidense aunque trabajes desde otro país.", icon: "globe" },
        { title: "Equipos con varias líneas", body: "Varios números en una sola cuenta, sin cuotas por usuario.", icon: "hash" },
      ],
      cols: 3,
      tone: "tint",
    },
    {
      type: "callout",
      title: "Precios sin sorpresas",
      body: "Número local de EE. UU.: $2.50 al mes. Llamadas y SMS en EE. UU. y Canadá: $0.015 por minuto o por mensaje. Sin cuotas por usuario y sin contrato. Para otros países, el precio aparece antes de comprar.",
    },
    {
      type: "cta",
      title: "Tu número virtual en minutos",
      body: "Recarga desde $5 y empieza hoy.",
      button: { label: "Obtén tu número", href: "/app" },
      tone: "dark",
    },
    {
      type: "faq",
      title: "Preguntas frecuentes",
      items: [
        { q: "¿Puedo usar el número para recibir códigos de verificación?", a: "Algunos servicios no aceptan números virtuales para códigos. No podemos garantizar que todos los códigos lleguen." },
        { q: "¿Hay app para iPhone?", a: "Todavía no. En iPhone puedes usar la app web en Safari. La app nativa para iPhone llegará pronto." },
        { q: "¿Puedo traer mi número actual?", a: "La portabilidad de números llegará pronto. Mientras tanto, puedes desviar tu número actual a tu nuevo número DIGIRINGO." },
        { q: "¿Cuánto cuesta una llamada?", a: "$0.015 por minuto dentro de EE. UU. y Canadá. Las llamadas internacionales varían según el país." },
      ],
    },
  ],
  related: ["/es/mensajes-de-texto-gratuitos", "/es/sms-mms-empresarial", "/product/messaging/virtual-sms-number", "/phone-numbers"],
};

const ES_BIZ: PageDoc = {
  path: "/es/sms-mms-empresarial",
  title: "SMS empresarial para pequeños negocios | DIGIRINGO",
  description: "SMS empresarial bidireccional desde tu número de negocio, con registro 10DLC guiado. $0.015 por mensaje en EE. UU. y Canadá. MMS muy pronto.",
  status: "live",
  sections: [
    {
      type: "hero",
      eyebrow: "SMS empresarial",
      h1: "Mensajes de texto profesionales desde el número de tu negocio",
      sub: "Habla con tus clientes por SMS desde el navegador o tu Android, con tu número de empresa. Hoy enviamos SMS de texto; los MMS con imágenes llegan pronto.",
      bullets: ["SMS de ida y vuelta con hilos por cliente", "Registro 10DLC guiado dentro de la app", "Sin contratos ni cuotas por usuario"],
      shot: "inbox",
      primary: { label: "Obtén tu número", href: "/app" },
      secondary: { label: "Ver precios", href: "/pricing" },
    },
    {
      type: "definition",
      title: "¿Qué es el SMS empresarial?",
      paragraphs: [
        "Es usar mensajes de texto para comunicarte con clientes desde un número de la empresa, no desde tu celular personal: confirmar citas, enviar presupuestos, responder preguntas o avisar que vas en camino.",
        "En EE. UU., los operadores tratan estos mensajes como tráfico A2P (de aplicación a persona) y exigen un registro 10DLC. DIGIRINGO incluye un Trust Center que te guía en ese proceso.",
      ],
      tone: "tint",
    },
    {
      type: "tabs",
      title: "Funciones de mensajería",
      tabs: [
        {
          name: "Disponible hoy",
          items: [
            { title: "SMS bidireccional", body: "Envía y recibe mensajes en números de EE. UU. y Canadá tras el registro 10DLC.", icon: "messages", status: "live" },
            { title: "Confirmación de entrega", body: "Sabes cuándo el operador entregó tu mensaje.", icon: "check", status: "live" },
            { title: "Hilos por número", body: "Cada conversación queda ordenada por cliente y por número.", icon: "inbox", status: "live" },
            { title: "SMS internacional", body: "Disponible en números de otros países que admiten SMS, con tarifas por país.", icon: "globe", status: "live" },
          ],
        },
        {
          name: "Muy pronto",
          items: [
            { title: "MMS (imágenes)", body: "Envío y recepción de fotos y archivos.", icon: "send", status: "soon" },
            { title: "Mensajes grupales", body: "Conversaciones con varios contactos a la vez.", icon: "users", status: "soon" },
            { title: "Respuestas automáticas", body: "Respuestas fuera de horario o tras una llamada perdida.", icon: "clock", status: "soon" },
            { title: "Mensajes programados y plantillas", body: "Prepara mensajes para enviarlos más tarde y guarda respuestas frecuentes.", icon: "calendar", status: "soon" },
          ],
        },
      ],
    },
    {
      type: "steps",
      title: "Cómo activarlo",
      items: [
        { title: "Compra un número", body: "Un número local de EE. UU. cuesta $2.50 al mes.", icon: "hash" },
        { title: "Registra tu marca y tu campaña", body: "El Trust Center te pide los datos de tu empresa y el uso de los mensajes. El operador responde en 1 a 7 días.", icon: "shield" },
        { title: "Empieza a conversar", body: "Cada SMS en EE. UU. y Canadá cuesta $0.015 y se descuenta de tu saldo.", icon: "message" },
      ],
      tone: "tint",
    },
    {
      type: "callout",
      title: "Lo que no prometemos",
      body: "No ofrecemos SMS gratis ni envíos masivos sin consentimiento. Te damos un número de empresa, mensajes a $0.015 en EE. UU. y Canadá, y ayuda para cumplir las reglas de los operadores.",
    },
    {
      type: "cta",
      title: "Mensajes claros, precios claros",
      button: { label: "Ver precios", href: "/pricing" },
      tone: "dark",
    },
    {
      type: "faq",
      title: "Preguntas frecuentes",
      items: [
        { q: "¿Puedo enviar MMS hoy?", a: "No. Los MMS están en desarrollo y llegarán pronto. Hoy puedes enviar y recibir SMS de texto." },
        { q: "¿Puedo enviar SMS desde un número gratuito (toll-free)?", a: "Todavía no. La verificación de números toll-free para mensajes llegará pronto. Los números toll-free funcionan hoy para llamadas." },
        { q: "¿Necesito el consentimiento de mis clientes?", a: "Sí. Los operadores exigen que tus clientes acepten recibir mensajes y que puedan darse de baja." },
        { q: "¿Cuánto cuesta el registro 10DLC?", a: "Las tarifas del operador se cobran al costo, sin recargo. Verás el importe antes de enviar el registro." },
      ],
    },
  ],
  related: ["/es/mensajes-de-texto-gratuitos", "/es/numeros-sms-virtuales", "/features/business-sms-mms", "/blog/what-is-a2p-10dlc"],
};

const FR_TOLLFREE: PageDoc = {
  path: "/fr/numeros-sans-frais-etats-unis",
  title: "Numéros sans frais aux États-Unis | DIGIRINGO",
  description: "Obtenez un numéro sans frais américain (800, 833, 844, 855…) dès 2,50 $ par mois et répondez depuis votre navigateur ou Android. Appels vocaux uniquement.",
  status: "live",
  sections: [
    {
      type: "hero",
      eyebrow: "Numéros sans frais",
      h1: "Un numéro sans frais américain pour votre entreprise",
      sub: "Vos clients aux États-Unis vous appellent gratuitement, et vous répondez depuis votre navigateur ou l'application Android, où que vous soyez. Pour l'instant, ces numéros servent aux appels vocaux.",
      bullets: ["À partir de 2,50 $ US par mois", "Préfixes 800, 833, 844, 855, 866, 877 et 888 selon disponibilité", "Sans contrat ni frais par utilisateur"],
      shot: "numbers",
      primary: { label: "Obtenir un numéro", href: "/app" },
      secondary: { label: "Voir les tarifs", href: "/pricing" },
    },
    {
      type: "definition",
      title: "Qu'est-ce qu'un numéro sans frais ?",
      paragraphs: [
        "Aux États-Unis et au Canada, un numéro sans frais (toll-free) commence par un préfixe comme 800 ou 888. L'appel est gratuit pour la personne qui appelle : c'est l'entreprise qui paie la communication.",
        "Avec DIGIRINGO, le numéro est entièrement en ligne. Pas de ligne physique à installer : les appels sonnent dans l'application web et sur Android en même temps, et peuvent être renvoyés vers votre mobile si personne ne répond.",
      ],
      tone: "tint",
    },
    {
      type: "cards",
      title: "Ce qui fonctionne aujourd'hui",
      items: [
        { title: "Appels entrants partout", body: "Le navigateur et l'application Android sonnent ensemble, avec des notifications même en arrière-plan.", icon: "phone-incoming", status: "live" },
        { title: "Renvoi vers un mobile", body: "Sans réponse après environ 30 secondes, l'appel est renvoyé vers votre téléphone portable, y compris hors des États-Unis.", icon: "phone-forwarded", status: "live" },
        { title: "Messagerie vocale", body: "Les appelants peuvent laisser un message quand personne ne répond.", icon: "voicemail", status: "live" },
        { title: "SMS sur numéro sans frais", body: "La vérification des numéros sans frais pour l'envoi de SMS arrive bientôt.", icon: "message", status: "soon" },
      ],
      cols: 4,
    },
    {
      type: "table",
      title: "Tarifs",
      head: ["Élément", "Prix (USD)"],
      rows: [
        ["Numéro sans frais", "à partir de 2,50 $ / mois"],
        ["Appels États-Unis et Canada", "0,015 $ / minute"],
        ["Renvoi vers un mobile à l'étranger", "selon le pays (voir la grille tarifaire)"],
        ["SMS sur numéro sans frais", "soon"],
      ],
      note: "Paiement par portefeuille prépayé : rechargez 5, 10, 20 ou 50 $ par carte.",
      tone: "tint",
    },
    {
      type: "steps",
      title: "Mise en place en trois étapes",
      items: [
        { title: "Créez votre compte", body: "Inscrivez-vous sur digiringo.com/app avec votre adresse e-mail.", icon: "user" },
        { title: "Choisissez votre numéro", body: "Sélectionnez un préfixe sans frais et achetez le numéro disponible qui vous convient.", icon: "hash" },
        { title: "Rechargez et répondez", body: "Ajoutez du crédit et recevez vos premiers appels depuis le navigateur ou Android.", icon: "wallet" },
      ],
    },
    {
      type: "cta",
      title: "Soyez joignable gratuitement par vos clients américains",
      button: { label: "Obtenir un numéro", href: "/app" },
      tone: "dark",
    },
    {
      type: "faq",
      title: "Questions fréquentes",
      items: [
        { q: "Puis-je envoyer des SMS depuis mon numéro sans frais ?", a: "Pas encore. Les numéros sans frais DIGIRINGO fonctionnent aujourd'hui pour les appels vocaux. L'envoi de SMS demandera une vérification qui arrive bientôt." },
        { q: "Dois-je être basé aux États-Unis ?", a: "Non. Vous pouvez gérer un numéro sans frais américain depuis n'importe quel pays avec une connexion internet." },
        { q: "Existe-t-il une application iPhone ?", a: "Pas encore. Sur iPhone, utilisez l'application web dans Safari. L'application iPhone arrive bientôt." },
        { q: "Puis-je transférer mon numéro sans frais actuel ?", a: "La portabilité des numéros arrive bientôt. En attendant, vous pouvez renvoyer votre numéro actuel vers un nouveau numéro DIGIRINGO." },
        { q: "Y a-t-il un menu vocal (appuyez sur 1…) ?", a: "Les menus vocaux arrivent bientôt. Aujourd'hui, les appels sonnent sur vos appareils, puis sont renvoyés vers votre mobile ou la messagerie vocale." },
      ],
    },
  ],
  related: ["/toll-free-numbers", "/pricing", "/rates", "/es/numeros-sms-virtuales"],
};

export const PAGES: PageDoc[] = [
  INDEX,
  ...INTEGRATIONS.map(intPage),
  WEBHOOKS,
  ES_FREE,
  ES_VIRTUAL,
  ES_BIZ,
  FR_TOLLFREE,
];
