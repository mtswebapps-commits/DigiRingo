import type { PageDoc, LinkRef } from "../types";

/**
 * Product pages, part B: the /product index, virtual phone system, voicemail,
 * call logs, the "coming soon" product areas, call recording, auto attendant,
 * AI and the /ai-agent landing page.
 *
 * Honesty rule for the AI pages: routing a number's calls to the customer's
 * OWN AI voice agent / SIP endpoint / TeXML webhook works today (beta).
 * DIGIRINGO's built-in AI (receptionist, summaries, tags, appointment setting,
 * MCP server) is not built yet and is always marked "soon".
 */

const PRODUCT: LinkRef = { label: "Product", href: "/product" };
const AI: LinkRef = { label: "AI", href: "/product/ai" };
const RECORDING: LinkRef = { label: "Call recording", href: "/product/call-recording" };
const ATTENDANT: LinkRef = { label: "Auto attendant", href: "/product/auto-attendant" };

export const PAGES: PageDoc[] = [
  // ───────────────────────────────── /product
  {
    path: "/product",
    title: "Product overview: every DIGIRINGO feature | DIGIRINGO",
    description:
      "Tour every part of DIGIRINGO: calling, texting, forwarding, routing, voicemail, call logs and AI hand-off, with clear labels for what's live and what's coming.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Product",
        h1: "One business number. Everything it can do, in one place.",
        sub: "DIGIRINGO gives you a real phone number that works in your browser and on Android. This page maps every product area, and tells you plainly which parts are ready today and which are still being built.",
        bullets: [
          "Call and text from the web app or the Android app",
          "Route each number to the app, your cellphone, a SIP agent or your own webhook",
          "Pay as you go from a prepaid wallet, with no seat fees or contracts",
        ],
        shot: "home",
        primary: { label: "Get your number", href: "/app" },
        secondary: { label: "See pricing", href: "/pricing" },
      },
      {
        type: "cards",
        eyebrow: "Connect",
        title: "Talk and text with customers",
        intro: "The core of DIGIRINGO. These areas are live, with a few individual features still on the way.",
        cols: 3,
        items: [
          { title: "Calling", icon: "phone-call", status: "live", href: "/product/calling", body: "Place and take calls over the internet from a browser tab or the Android app, with your business number as caller ID." },
          { title: "Messaging", icon: "messages", status: "live", href: "/product/messaging", body: "Two-way SMS in threaded conversations, with delivery receipts and guided 10DLC registration for US numbers." },
          { title: "Voicemail", icon: "voicemail", status: "live", href: "/product/voicemail", body: "When nobody picks up, callers can leave a message with a standard greeting. Custom greetings are coming." },
          { title: "Virtual phone system", icon: "building", status: "live", href: "/product/virtual-phone-system", body: "Numbers, calling, texting, forwarding and routing without desk phones or a PBX box in the closet." },
          { title: "Call logs", icon: "list", status: "live", href: "/product/call-analytics/call-logs", body: "A running history of every inbound, outbound and missed call on your account, with one-tap call back." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Route",
        title: "Decide where every call goes",
        tone: "tint",
        cols: 3,
        items: [
          { title: "Call forwarding", icon: "phone-forwarded", status: "live", href: "/product/call-forwarding", body: "If the app goes unanswered for about 30 seconds, the call moves to your cellphone, in the US or abroad." },
          { title: "Call routing", icon: "route", status: "live", href: "/product/call-routing", body: "Per-number rules: ring the app, forward to a phone, hand off to a SIP or AI agent, or ask your webhook." },
          { title: "Call management", icon: "settings", status: "live", href: "/product/call-management", body: "Hold, mute, keypad and simultaneous ring on every device, so fewer calls slip through." },
          { title: "Auto attendant", icon: "git-branch", status: "soon", href: "/product/auto-attendant", body: "A 'press 1 for sales' phone menu that sorts callers before anyone answers." },
          { title: "Phone menus", icon: "hash", status: "soon", href: "/product/menu-routing", body: "Menu-based routing that sends each keypress to the right person, number or message." },
          { title: "Virtual receptionist", icon: "user", status: "soon", href: "/product/virtual-receptionist", body: "A greeting and routing layer that answers for your business when you can't." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Automate",
        title: "AI on your phone line",
        intro: "Handing a number's calls to your own AI voice agent works today. DIGIRINGO's own built-in AI is still in development.",
        cols: 3,
        items: [
          { title: "AI on DIGIRINGO", icon: "sparkles", status: "beta", href: "/product/ai", body: "Today: connect any number to your own AI voice agent by SIP or webhook. Built-in AI features come later." },
          { title: "Bring your AI agent", icon: "bot", status: "beta", href: "/ai-agent", body: "Already use an AI phone agent? Point a DIGIRINGO number at it and it answers that number's calls." },
          { title: "In-app assistant", icon: "zap", status: "soon", href: "/product/assistant", body: "An assistant inside the app that helps you find calls, draft replies and catch up faster." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Collaborate and review",
        title: "Team tools on our roadmap",
        intro: "These areas are not available yet. Each page explains what we plan and what you can do in the meantime.",
        tone: "tint",
        cols: 3,
        items: [
          { title: "Call recording", icon: "mic", status: "soon", href: "/product/call-recording", body: "Automatic or on-demand recording, with clear consent prompts." },
          { title: "Analytics", icon: "chart", status: "soon", href: "/product/analytics", body: "Dashboards for call volume, missed calls and response times." },
          { title: "CRM and contacts", icon: "users", status: "soon", href: "/product/crm", body: "Contact records with names, notes and full conversation history." },
          { title: "Shared numbers", icon: "inbox", status: "soon", href: "/product/shared-numbers", body: "One number, one inbox, several teammates answering together." },
          { title: "Task management", icon: "check", status: "soon", href: "/product/task-management", body: "Turn a call or text into a follow-up with an owner and a due date." },
        ],
      },
      {
        type: "callout",
        title: "Why we label everything",
        body: "Every DIGIRINGO page marks features as live, beta or coming soon. If something is marked live, you can use it the day you sign up. If it says soon, it isn't ready yet, and we won't charge you for it or pretend otherwise.",
        tone: "dark",
      },
      {
        type: "steps",
        title: "Getting started takes a few minutes",
        items: [
          { title: "Create an account", body: "Sign up at digiringo.com/app in any browser, or install the Android app from Google Play." },
          { title: "Add funds", body: "Top up your prepaid wallet with $5, $10, $20 or $50 by card. There is no subscription." },
          { title: "Pick a number", body: "Choose a local US or Canada number, a toll-free number, or a number in another country." },
          { title: "Start calling and texting", body: "Make your first call from the dialer, then set how incoming calls should ring and forward." },
        ],
      },
      {
        type: "cta",
        title: "A US local number is $2.50 a month. Calls and texts in the US and Canada are $0.015 each.",
        button: { label: "See pricing", href: "/pricing" },
        tone: "brand",
      },
      {
        type: "faq",
        items: [
          { q: "Which DIGIRINGO features work today?", a: "Calling from the browser and Android, two-way SMS, local, toll-free and international numbers, call forwarding to your cellphone, per-number routing, simultaneous ring, voicemail, call logs, the Trust Center for 10DLC and in-app live chat support. Anything marked 'soon' on this site isn't available yet." },
          { q: "Is there an iPhone app?", a: "Not yet. iPhone users can use the DIGIRINGO web app in Safari, which handles calls and texts in the browser." },
          { q: "Do I need a plan or a contract?", a: "No. DIGIRINGO runs on a prepaid wallet. You pay for your numbers and for the minutes and messages you use, with no per-user fees." },
          { q: "Can I connect my own AI phone agent?", a: "Yes. Any number can route its incoming calls to your AI voice agent over SIP, or to your own webhook that returns TeXML call instructions. DIGIRINGO's own built-in AI receptionist is still coming." },
          { q: "How do I hear about new features?", a: "Pages for upcoming features have a 'Get notified' button. Leave your email there and we'll let you know when that feature ships." },
        ],
      },
    ],
    related: ["/product/calling", "/product/messaging", "/product/call-routing", "/product/ai"],
  },

  // ───────────────────────────────── /product/virtual-phone-system
  {
    path: "/product/virtual-phone-system",
    title: "Virtual phone system for small business | DIGIRINGO",
    description:
      "Run your business phone line from a browser or Android app. Real local and toll-free numbers, calling, SMS, forwarding and routing, with pay-as-you-go pricing.",
    crumbs: [PRODUCT],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Virtual phone system",
        h1: "A business phone system that lives in your browser",
        sub: "No desk phones, no wiring, no PBX contract. Get a real number, then call and text from your laptop or Android phone wherever you work.",
        bullets: [
          "Local US and Canada numbers from $2.50 a month",
          "Rings every device you're signed in on at once",
          "Unanswered calls forward to your cellphone automatically",
        ],
        shot: "dialer",
        primary: { label: "Get your number", href: "/app" },
        secondary: { label: "See pricing", href: "/pricing" },
      },
      {
        type: "definition",
        title: "What is a virtual phone system?",
        paragraphs: [
          "A virtual phone system is a business phone line that runs over the internet instead of a copper line or an office switchboard. The number belongs to your account, not to a physical handset, so you can answer it from whatever device you have with you.",
          "With DIGIRINGO, the 'system' is the web app and the Android app. You buy numbers, set how each one rings, and handle calls and texts from either app. The routing that used to require on-site hardware is a setting on each number.",
        ],
        shot: "numbers",
        tone: "tint",
      },
      {
        type: "cards",
        title: "What you get on day one",
        cols: 4,
        items: [
          { title: "Real numbers", icon: "hash", body: "Local numbers in the US and Canada, toll-free numbers, and numbers in many other countries." },
          { title: "Calling anywhere", icon: "laptop", body: "Call from a browser tab or the Android app over Wi-Fi or mobile data." },
          { title: "Business texting", icon: "message", body: "Two-way SMS with threaded conversations and delivery receipts." },
          { title: "Smart ringing", icon: "bell", body: "Ring all your devices at once, then fall back to your cellphone or voicemail." },
        ],
      },
      {
        type: "flex",
        title: "How the pieces fit together",
        rows: [
          { title: "Numbers you control", body: "Search by area code or country, see the monthly price before you buy, and add more numbers whenever you need a new line for a location or a campaign.", shot: "buy" },
          { title: "One inbox for texts", body: "Each conversation is threaded by contact and by number, so you can see what was said and which line it came in on. Delivery receipts show when a message lands.", shot: "inbox" },
          { title: "Calls that find you", body: "An incoming call rings the web app and the Android app at the same time, with push notifications when the tab is in the background. If nobody answers in about 30 seconds, it forwards to your cellphone.", shot: "calls" },
        ],
      },
      {
        type: "steps",
        title: "How to set up a virtual phone system in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Sign up and top up", body: "Create an account and add funds to your wallet. Top-ups start at $5." },
          { title: "Buy your first number", body: "Pick a local or toll-free number. Some countries ask for ID or an address, which the carrier usually reviews in 1-3 days." },
          { title: "Choose how it rings", body: "Keep calls in the app, add a forwarding cellphone, or route the number to a SIP agent or webhook." },
          { title: "Register for texting", body: "For US texting, complete the guided 10DLC registration in the built-in Trust Center." },
        ],
      },
      {
        type: "table",
        title: "Virtual phone system vs. a traditional office line",
        head: ["", "DIGIRINGO", "Traditional landline / on-site PBX"],
        rows: [
          ["Hardware needed", "None, just a browser or Android phone", "Desk phones, wiring, often a PBX unit"],
          ["Answer away from the office", "yes", "Only with forwarding add-ons"],
          ["Add a new number", "A few clicks", "Usually a service call or order"],
          ["Two-way business texting", "yes", "no"],
          ["Contract", "None, prepaid wallet", "Often 1-3 years"],
          ["Phone menu (IVR)", "soon", "Often included or extra"],
        ],
        note: "Traditional setups vary by provider. Check your current carrier's terms for specifics.",
      },
      {
        type: "longform",
        title: "Good to know before you switch",
        tone: "plain",
        items: [
          { title: "Bring your existing number", body: "Number porting isn't available yet. Many businesses start with a new DIGIRINGO number and forward their old line to it while they transition.", status: "soon" },
          { title: "Team seats", body: "DIGIRINGO is built for one account owner today. Shared numbers and multi-user roles are on the roadmap.", status: "soon" },
          { title: "Internet requirements", body: "A steady connection of a few hundred kilobits per second per call is enough. If your connection drops, forwarding to your cellphone still catches the call." },
          { title: "International reach", body: "Call 220+ countries at per-country rates listed in the app, and buy numbers abroad where the carrier supports them." },
        ],
      },
      {
        type: "cta",
        title: "Set up your business line in less time than a coffee break.",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Do I need special equipment?", a: "No. A computer with a modern browser, or an Android phone, plus a headset or earbuds for better audio, is all you need." },
          { q: "Can customers tell it's a virtual number?", a: "No. Your DIGIRINGO number is a normal phone number. Callers dial it like any other line, and it shows as your caller ID when you call out." },
          { q: "What does it cost?", a: "A US local number is $2.50 a month and toll-free starts at $2.50 a month. Calls and texts in the US and Canada are $0.015 per minute or message. International rates vary by country." },
          { q: "Does it work on iPhone?", a: "There's no iOS app yet, but the web app works in Safari on iPhone." },
          { q: "Can I have more than one number?", a: "Yes. Buy as many numbers as you like and choose which one to call or text from each time." },
        ],
      },
    ],
    related: ["/product/calling", "/product/call-routing", "/product/messaging", "/product"],
  },

  // ───────────────────────────────── /product/voicemail
  {
    path: "/product/voicemail",
    title: "Business voicemail for missed calls | DIGIRINGO",
    description:
      "When nobody answers, DIGIRINGO records a voicemail with a standard greeting so callers can still reach you. Custom greetings and transcription are coming soon.",
    crumbs: [PRODUCT],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Voicemail",
        h1: "When you can't pick up, callers can still leave a message",
        sub: "Every DIGIRINGO number has voicemail built in. If a call isn't answered in the app or on your forwarding phone, the caller hears a standard greeting and can leave a recording.",
        bullets: [
          "Included on every number, no extra charge",
          "Kicks in after the app and your cellphone have had their turn",
          "Custom greetings and transcription are on the way",
        ],
        shot: "calls",
        primary: { label: "Get your number", href: "/app" },
      },
      {
        type: "definition",
        title: "What is business voicemail?",
        paragraphs: [
          "Business voicemail is the safety net behind your phone line. When a call goes unanswered, the system answers it for you, plays a greeting, and records whatever the caller wants to say.",
          "In DIGIRINGO, voicemail is the last stop in the ring order. The call rings your signed-in devices first, then forwards to your cellphone if you've set one, and only then goes to voicemail. That way a recording is the backup, not the default.",
        ],
        tone: "tint",
      },
      {
        type: "steps",
        title: "How voicemail works in DIGIRINGO",
        items: [
          { title: "The call rings you", body: "Your web app and Android app ring at the same time." },
          { title: "It tries your cellphone", body: "If you've added a forwarding number, the call moves there after about 30 seconds." },
          { title: "Voicemail answers", body: "Still no answer? The caller hears a standard greeting and leaves a message." },
          { title: "You follow up", body: "The missed call shows in your call log so you can call back with one tap." },
        ],
      },
      {
        type: "tabs",
        title: "Voicemail features",
        tone: "tint",
        tabs: [
          {
            name: "Available now",
            items: [
              { title: "Recorded messages", icon: "voicemail", status: "live", body: "Unanswered calls are recorded with a standard greeting." },
              { title: "Missed-call history", icon: "phone-missed", status: "live", body: "Each missed call appears in your call log with the time and caller." },
              { title: "Works on every number", icon: "hash", status: "live", body: "Local, toll-free and international numbers all get voicemail." },
              { title: "In-app playback", icon: "headphones", status: "beta", body: "Listening to messages inside the app is being finished now." },
            ],
          },
          {
            name: "Coming soon",
            items: [
              { title: "Custom greetings", icon: "mic", status: "soon", body: "Record or upload your own greeting per number." },
              { title: "Voicemail-to-text", icon: "file", status: "soon", body: "Read a transcript instead of listening." },
              { title: "Email alerts", icon: "send", status: "soon", body: "Get each new voicemail sent to your inbox." },
              { title: "After-hours greeting", icon: "moon", status: "soon", body: "A different message outside your business hours." },
            ],
          },
        ],
      },
      {
        type: "callout",
        title: "Need to write a greeting now?",
        body: "Our free voicemail greeting generator gives you a script you can use on any phone line today, and keep ready for when custom DIGIRINGO greetings arrive.",
        tone: "dark",
      },
      {
        type: "cta",
        title: "Try the voicemail greeting generator",
        button: { label: "Write a greeting", href: "/tools/voicemail-generator" },
      },
      {
        type: "faq",
        items: [
          { q: "Does voicemail cost extra?", a: "No. Voicemail comes with every DIGIRINGO number. You pay only the normal per-minute rate for the inbound call." },
          { q: "Can I record my own greeting?", a: "Not yet. Today every number uses a standard greeting. Custom greetings are coming soon." },
          { q: "Will I get voicemail transcripts?", a: "Not yet. Voicemail-to-text is on our roadmap, and we'll mark it live on this page when it ships." },
          { q: "How long does a call ring before voicemail?", a: "The app rings first. If you've set a forwarding cellphone, the call moves there after about 30 seconds, and voicemail answers if that phone isn't picked up either." },
          { q: "Can I skip voicemail and send calls somewhere else?", a: "Yes. Per-number routing lets you send calls to a SIP agent, your AI voice agent or your own webhook instead." },
        ],
      },
    ],
    related: ["/product/call-forwarding", "/product/call-management/never-miss-a-call", "/product/call-analytics/call-logs", "/features/voicemail-to-text"],
  },

  // ───────────────────────────────── /product/call-analytics/call-logs
  {
    path: "/product/call-analytics/call-logs",
    title: "Call logs: your full call history | DIGIRINGO",
    description:
      "See every inbound, outbound and missed call on your DIGIRINGO numbers in one list, with time, number and duration, and call anyone back in a single tap.",
    crumbs: [PRODUCT, { label: "Call logs", href: "/product/call-analytics/call-logs" }],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Call logs",
        h1: "Every call, in order, on every device",
        sub: "DIGIRINGO keeps a history of the calls you make and receive. Open it in the web app or on Android to see who called, when, and which calls you missed.",
        bullets: [
          "Inbound, outbound and missed calls in one list",
          "Synced between the browser and the Android app",
          "Call back from the log in one tap",
        ],
        shot: "calls",
        primary: { label: "Get your number", href: "/app" },
      },
      {
        type: "definition",
        title: "What is a call log?",
        paragraphs: [
          "A call log is a record of the phone calls on a line: the other party's number, the direction of the call, when it happened and how long it lasted. It answers simple questions fast, like 'did that customer call back?' or 'who rang while I was on the road?'",
          "Your DIGIRINGO call log is tied to your account rather than a single handset. Calls you take on your laptop show up on your phone too, so there's one history instead of several partial ones.",
        ],
        tone: "tint",
        shot: "activity",
      },
      {
        type: "cards",
        title: "Why it matters",
        cols: 3,
        items: [
          { title: "Spot missed calls", icon: "phone-missed", body: "Missed calls stand out, so you can return them before the caller tries a competitor." },
          { title: "Call back fast", icon: "refresh", body: "Tap any entry to dial that number again from the right business line." },
          { title: "Settle questions", icon: "search", body: "Check exactly when a call came in and how long you talked." },
        ],
      },
      {
        type: "steps",
        title: "How to use call logs in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Open Calls", body: "Go to the Calls tab in the web app or Android app." },
          { title: "Scan the list", body: "Recent calls appear first, with direction, number and time." },
          { title: "Tap to call back", body: "Choose an entry and dial out with your business caller ID." },
        ],
      },
      {
        type: "table",
        title: "What's in the log today",
        head: ["Detail", "Status"],
        rows: [
          ["Caller or dialed number", "yes"],
          ["Inbound, outbound or missed", "yes"],
          ["Date and time", "yes"],
          ["Call duration", "yes"],
          ["Call notes", "soon"],
          ["Recordings and transcripts", "soon"],
          ["Team-wide reports and charts", "soon"],
        ],
        note: "Analytics dashboards with trends and team reports are planned. See the analytics page for details.",
      },
      {
        type: "cta",
        title: "Never lose track of who called.",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is my call history shared between devices?", a: "Yes. Your call log belongs to your account, so the browser and the Android app show the same history." },
          { q: "Can I export my call logs?", a: "Not yet. Exports and reports are part of the analytics work we have planned." },
          { q: "Do forwarded calls appear in the log?", a: "Yes. Calls that came in on your DIGIRINGO number appear in your history, including ones that were forwarded to your cellphone." },
          { q: "Can teammates see my call log?", a: "Call history is per user today. Shared numbers and team views are coming later." },
        ],
      },
    ],
    related: ["/product/analytics", "/product/call-management/never-miss-a-call", "/product/voicemail", "/product/calling"],
  },

  // ───────────────────────────────── /product/analytics
  {
    path: "/product/analytics",
    title: "Call analytics and reporting (coming soon) | DIGIRINGO",
    description:
      "DIGIRINGO call analytics are on the way: charts for call volume, missed calls and busy hours. Today, your full call history is already in the call log.",
    crumbs: [PRODUCT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Analytics",
        h1: "See how your phone line is really doing",
        sub: "We're building analytics that turn your call and text history into simple charts: how many calls came in, how many were missed, and when your phone is busiest.",
        bullets: [
          "Call volume by day and hour",
          "Missed-call rate per number",
          "Text response times",
        ],
        shot: "activity",
      },
      {
        type: "definition",
        title: "What is call analytics?",
        paragraphs: [
          "Call analytics is reporting built from your phone records. Instead of scrolling a long list of calls, you get totals and trends: busy days, quiet hours, numbers that ring the most, and how often calls go unanswered.",
          "For a small business, the most useful number is often the simplest one: how many callers didn't reach a person. Analytics makes that visible so you can adjust forwarding, staffing or hours.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What we plan to include",
        cols: 4,
        items: [
          { title: "Volume charts", icon: "chart", status: "soon", body: "Inbound and outbound calls over time." },
          { title: "Missed calls", icon: "phone-missed", status: "soon", body: "How many calls went unanswered, by number and by hour." },
          { title: "Busy hours", icon: "clock", status: "soon", body: "A heat map of when customers call most." },
          { title: "Spend view", icon: "wallet", status: "soon", body: "Usage costs broken down by number and destination." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        intro: "Analytics isn't live yet, but your raw data is already being kept.",
        tone: "tint",
        items: [
          { title: "Check the call log", body: "Every inbound, outbound and missed call is listed with time and duration.", href: "/product/call-analytics/call-logs" },
          { title: "Review your wallet activity", body: "The wallet shows top-ups and usage charges, so you can see what your line costs." },
          { title: "Cut missed calls now", body: "Add a forwarding cellphone so calls that the app misses still reach you.", href: "/product/call-forwarding" },
        ],
      },
      {
        type: "callout",
        title: "No made-up dashboards",
        body: "The screenshots on this site show the real app. We'll add analytics screenshots only once the feature exists.",
        tone: "dark",
      },
      {
        type: "cta",
        title: "Start building call history now, so your first report has data in it.",
        button: { label: "Get your number", href: "/app" },
      },
      {
        type: "faq",
        items: [
          { q: "When will analytics be available?", a: "We don't have a public date yet. Use the 'Get notified' button and we'll email you when it launches." },
          { q: "Will past calls be included?", a: "That's the plan. Your call history is already stored with your account, so reports should be able to look back." },
          { q: "Will analytics cost extra?", a: "We haven't set pricing for it. We'll publish any cost on the pricing page before it applies to you." },
          { q: "Can I export data in the meantime?", a: "Not yet. For now, the call log and wallet activity are viewable in the app." },
        ],
      },
    ],
    related: ["/product/call-analytics/call-logs", "/product/call-management/never-miss-a-call", "/tools/missed-call-cost-calculator"],
  },

  // ───────────────────────────────── /product/crm
  {
    path: "/product/crm",
    title: "Built-in phone CRM and contacts (soon) | DIGIRINGO",
    description:
      "A simple CRM inside DIGIRINGO is coming: contact cards with names, notes and full call and text history. Until then, conversations are threaded by number.",
    crumbs: [PRODUCT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "CRM",
        h1: "Know who's calling before you say hello",
        sub: "We're adding contact records to DIGIRINGO, so each caller has a name, your notes, and every call and text you've exchanged in one place.",
        bullets: [
          "Names and company on incoming calls",
          "Notes that stay with the contact",
          "Full call and text timeline per person",
        ],
        shot: "chat",
      },
      {
        type: "definition",
        title: "What is a phone CRM?",
        paragraphs: [
          "A CRM (customer relationship management tool) keeps track of the people you do business with. A phone CRM focuses on the conversations: it links each call and message to a contact so the history is there when they call again.",
          "Big CRMs can be a lot to set up. Ours is meant to be light: the contact details a small team actually uses, attached directly to the phone line, with connections to larger CRMs planned through integrations.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned features",
        cols: 3,
        items: [
          { title: "Contact cards", icon: "user", status: "soon", body: "Name, company, email and extra numbers for each person." },
          { title: "Conversation timeline", icon: "list", status: "soon", body: "Calls, texts and voicemails in one view." },
          { title: "Notes and tags", icon: "tag", status: "soon", body: "Jot down context and group contacts your way." },
          { title: "Caller name on ring", icon: "phone-incoming", status: "soon", body: "See the contact's name, not just digits, when they call." },
          { title: "Import contacts", icon: "file", status: "soon", body: "Bring in a list from a spreadsheet or your phone." },
          { title: "CRM integrations", icon: "plug", status: "soon", body: "Sync with tools like HubSpot or Salesforce.", href: "/integrations" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Use threaded texts", body: "Every SMS conversation is grouped by the other person's number and by your business line.", href: "/product/messaging" },
          { title: "Check the call log", body: "See each caller's past calls with time and duration.", href: "/product/call-analytics/call-logs" },
          { title: "Use separate numbers", body: "Give sales and support their own numbers so you know the context of each call from the line it came in on." },
        ],
      },
      {
        type: "cta",
        title: "Want a say in what our CRM includes? Tell us what you track today.",
        button: { label: "Contact us", href: "/contact" },
        tone: "dark",
      },
      {
        type: "callout",
        title: "Small on purpose",
        body: "We're not trying to rebuild a sales platform. The goal is the handful of contact details that make the next call go better, kept right next to the conversation.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO have contacts today?", a: "Not as a full contact manager. Conversations and call history are organized by phone number. Named contact records are coming." },
          { q: "Will it replace my existing CRM?", a: "It's meant for teams that don't need a big CRM. If you already use one, integrations are planned so your phone data can flow into it." },
          { q: "Which CRMs will you integrate with?", a: "We're planning connections with popular tools such as HubSpot, Salesforce and Pipedrive. None are live yet. See the integrations page for the list." },
          { q: "Will my data be private?", a: "Yes. Your contacts and conversations belong to your account and aren't shared or sold." },
        ],
      },
    ],
    related: ["/integrations", "/product/messaging", "/product/shared-numbers", "/features/crm-with-text-messaging"],
  },

  // ───────────────────────────────── /product/shared-numbers
  {
    path: "/product/shared-numbers",
    title: "Shared phone numbers for teams (soon) | DIGIRINGO",
    description:
      "Shared numbers are coming to DIGIRINGO: one line several teammates can answer, with a shared text inbox. Today, every device you sign in on rings at once.",
    crumbs: [PRODUCT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Shared numbers",
        h1: "One number your whole team can answer",
        sub: "We're building shared lines for DIGIRINGO: a single business number that rings several teammates, with one inbox for texts so nobody replies twice.",
        bullets: [
          "Several people on one number",
          "Shared SMS inbox with clear ownership",
          "Each person keeps their own login",
        ],
        shot: "inbox",
      },
      {
        type: "definition",
        title: "What is a shared phone number?",
        paragraphs: [
          "A shared number is one phone line used by a group. Customers save a single number, and whoever is free picks up. Texts land in a shared inbox, so the team can see which conversations are handled and which are waiting.",
          "It's the difference between 'call Maria's cell' and 'call the office.' The business keeps the number and the history even when people change roles.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What shared numbers will add",
        cols: 4,
        items: [
          { title: "Team seats", icon: "users", status: "soon", body: "Invite teammates with their own logins." },
          { title: "Shared inbox", icon: "inbox", status: "soon", body: "One list of conversations for the whole team." },
          { title: "Ring groups", icon: "bell", status: "soon", body: "Ring several teammates at once or in order.", href: "/features/ring-groups" },
          { title: "Roles", icon: "shield", status: "soon", body: "Choose who can buy numbers or change settings." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        intro: "DIGIRINGO accounts are single-user right now, but you can cover a lot of ground already.",
        tone: "tint",
        items: [
          { title: "Ring every device at once", body: "Sign in on a desktop browser and an Android phone, and both ring for every call.", href: "/product/call-routing/simultaneous-ring" },
          { title: "Forward to a colleague's cell", body: "Set the forwarding number to whoever is covering the line that day.", href: "/product/call-forwarding" },
          { title: "Use more than one number", body: "Give each department or location its own number on the same account." },
        ],
      },
      {
        type: "table",
        title: "Today vs. with shared numbers",
        head: ["", "Today", "With shared numbers"],
        rows: [
          ["Logins per account", "One", "One per teammate"],
          ["Ring several people", "Via forwarding to one cellphone", "soon"],
          ["Shared text inbox", "no", "soon"],
          ["Who handled a conversation", "no", "soon"],
        ],
      },
      {
        type: "cta",
        title: "Get a number now. You'll be able to share it when team features launch.",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can two people use one DIGIRINGO number today?", a: "Not with separate logins. You can sign in to the same account on several devices, which all ring, but team seats and shared inboxes aren't available yet." },
          { q: "Will team seats cost extra?", a: "We don't charge per-user fees today, and we'll publish any change on the pricing page before it takes effect." },
          { q: "Will my existing numbers work with shared numbers?", a: "That's the plan. Numbers you buy now should be shareable once the feature launches." },
          { q: "Is there a read on what's coming first?", a: "Team seats and a shared text inbox are the foundation, with ring groups after. We'll announce dates once they're firm." },
        ],
      },
    ],
    related: ["/product/call-routing/simultaneous-ring", "/features/ring-groups", "/product/crm", "/blog/shared-team-phone-inbox"],
  },

  // ───────────────────────────────── /product/virtual-receptionist
  {
    path: "/product/virtual-receptionist",
    title: "Virtual receptionist for calls (coming soon) | DIGIRINGO",
    description:
      "A DIGIRINGO virtual receptionist is coming: greet callers, offer options and route them. Today, simultaneous ring, forwarding and voicemail cover the basics.",
    crumbs: [PRODUCT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Virtual receptionist",
        h1: "A front desk for your phone line, without the front desk",
        sub: "We're building a virtual receptionist that greets every caller by your business name, offers a short menu, and sends them to the right place.",
        bullets: [
          "A branded greeting on every call",
          "Simple choices like sales, support or hours",
          "Messages taken when nobody's free",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is a virtual receptionist?",
        paragraphs: [
          "A virtual receptionist is an automated answering layer for a business phone. It picks up, introduces your company, and either connects the caller or takes a message. It works all day, every day, and never puts anyone on hold to answer another line.",
          "There are two flavors: menu-based ('press 1 for...') and AI-based, where the caller simply says what they need. DIGIRINGO plans to offer both, and you can already route calls to your own AI agent today.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned receptionist features",
        cols: 3,
        items: [
          { title: "Custom greeting", icon: "mic", status: "soon", body: "Your business name and a short welcome." },
          { title: "Menu options", icon: "hash", status: "soon", body: "Keypress choices that route to people or numbers.", href: "/product/menu-routing" },
          { title: "Business hours", icon: "clock", status: "soon", body: "Different handling for open and closed hours." },
          { title: "AI receptionist", icon: "bot", status: "soon", body: "A conversational receptionist built into DIGIRINGO.", href: "/product/ai/receptionist" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Ring all your devices", body: "Answer from whichever screen is closest." },
          { title: "Forward to your cellphone", body: "Calls the app doesn't catch move to your phone after about 30 seconds." },
          { title: "Fall back to voicemail", body: "If nobody answers anywhere, callers can leave a message." },
          { title: "Or use your own AI agent", body: "Route a number to an AI voice agent you already use, over SIP or webhook.", href: "/ai-agent" },
        ],
      },
      {
        type: "cta",
        title: "Script your greeting now with our free generator.",
        button: { label: "Try the greeting generator", href: "/tools/auto-attendant-greeting-generator" },
        tone: "dark",
      },
      {
        type: "callout",
        title: "Automated, not a call center",
        body: "The receptionist we're building is software. It won't put a human operator on your line, and it won't pretend to be one.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Is the virtual receptionist available?", a: "Not yet. It's on our roadmap. Today you can combine simultaneous ring, forwarding and voicemail, or route calls to your own AI agent." },
          { q: "Will it be an AI or a menu?", a: "We plan to offer a keypad menu and, later, a built-in AI receptionist. You'll be able to choose per number." },
          { q: "Is this a live human answering service?", a: "No. DIGIRINGO doesn't provide human receptionists. The planned receptionist is automated." },
          { q: "How do I get notified when it launches?", a: "Use the 'Get notified' button on this page." },
        ],
      },
    ],
    related: ["/product/auto-attendant", "/product/ai/receptionist", "/product/menu-routing", "/answering-service"],
  },

  // ───────────────────────────────── /product/menu-routing
  {
    path: "/product/menu-routing",
    title: "Phone menu and IVR routing (coming soon) | DIGIRINGO",
    description:
      "Phone menus are coming to DIGIRINGO: 'press 1 for sales' options that route each caller. Today, per-number routing sends calls to the app, a phone or a webhook.",
    crumbs: [PRODUCT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Phone menu & routing",
        h1: "Let callers pick where they need to go",
        sub: "We're adding phone menus to DIGIRINGO. Callers hear a short list of options, press a key, and reach the right person, number or message.",
        bullets: [
          "Keypress options for each department",
          "Send options to the app, a cellphone or voicemail",
          "Built on the per-number routing that's live today",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is menu routing?",
        paragraphs: [
          "Menu routing, often called IVR (interactive voice response), plays a recorded menu and routes the call based on which key the caller presses. It's how a small office can sound organized: sales, support and billing each get their own path.",
          "DIGIRINGO already routes each number to one destination. Phone menus will add a step in front of that, so one number can branch to several destinations.",
        ],
        tone: "tint",
      },
      {
        type: "flex",
        title: "Routing that works now, and what's next",
        rows: [
          { title: "Per-number routing (live)", body: "Open a number's settings and choose where its calls go: ring in the app, forward to a phone, connect to a SIP or AI agent, or hand the call to your own webhook.", status: "live", shot: "settings", href: "/product/call-routing" },
          { title: "Keypress menus (soon)", body: "Record a menu, map each key to a destination, and set what happens if the caller presses nothing.", status: "soon" },
          { title: "Hours-based menus (soon)", body: "Play a different menu, or skip straight to voicemail, outside business hours.", status: "soon", href: "/product/call-routing/business-hours-call-routing" },
        ],
      },
      {
        type: "callout",
        title: "Developers can build a menu today",
        body: "If you route a number to your own webhook, your server returns TeXML instructions for the call. That's enough to build your own keypress menu right now, while our point-and-click version is in development.",
        tone: "dark",
      },
      {
        type: "steps",
        title: "How phone menus will work",
        items: [
          { title: "Write a greeting", body: "Keep it short and name the options in order." },
          { title: "Map each key", body: "Press 1 to ring the app, 2 to forward to a cellphone, 3 for voicemail, and so on." },
          { title: "Set a fallback", body: "Choose what happens on no input or an invalid key." },
        ],
      },
      {
        type: "cta",
        title: "Read our guide to small business phone menus.",
        button: { label: "Read the guide", href: "/blog/small-business-phone-menu-ivr" },
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Can I set up a phone menu in DIGIRINGO today?", a: "Not with a built-in editor. You can build one yourself by routing a number to a webhook that returns TeXML, or route calls to an AI agent that handles the conversation." },
          { q: "How many options will a menu support?", a: "We'll publish the details at launch. Most small businesses do best with three or four options." },
          { q: "Will menus support more than one level?", a: "Multi-level menus are planned as part of the auto attendant work." },
          { q: "Will there be an extra charge?", a: "We haven't set pricing. Any cost will be listed on the pricing page before it applies." },
        ],
      },
    ],
    related: ["/product/auto-attendant", "/product/call-routing", "/product/auto-attendant/cloud-ivr", "/developers"],
  },

  // ───────────────────────────────── /product/task-management
  {
    path: "/product/task-management",
    title: "Follow-up tasks from calls and texts (soon) | DIGIRINGO",
    description:
      "Task management is coming to DIGIRINGO: turn a call or text into a follow-up with a due date. Today, missed calls stand out in your log for a fast call back.",
    crumbs: [PRODUCT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Tasks",
        h1: "Turn 'I'll call you back' into a real to-do",
        sub: "We're adding tasks to DIGIRINGO so a promise made on a call doesn't get lost. Create a follow-up from any call or conversation and see what's due.",
        bullets: [
          "Create a task from a call or a text thread",
          "Due dates and reminders",
          "A single list of open follow-ups",
        ],
        shot: "activity",
      },
      {
        type: "definition",
        title: "What is task management in a phone app?",
        paragraphs: [
          "Most follow-ups start on the phone: send a quote, confirm a time, check on a delivery. Task management inside your phone app lets you capture that while the call is fresh, linked to the person and the conversation.",
          "It's not meant to replace a project tool. It's the small list of 'things I owe callers' that otherwise lives on sticky notes.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned features",
        cols: 3,
        items: [
          { title: "Tasks from calls", icon: "phone", status: "soon", body: "Add a follow-up from any entry in your call log." },
          { title: "Tasks from texts", icon: "message", status: "soon", body: "Flag a conversation that needs action." },
          { title: "Reminders", icon: "bell", status: "soon", body: "A nudge when a task comes due." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Watch for missed calls", body: "Missed calls are highlighted in the call log.", href: "/product/call-analytics/call-logs" },
          { title: "Call back in one tap", body: "Return any call from history with your business caller ID." },
          { title: "Keep texts threaded", body: "Each SMS conversation stays in its own thread, with the latest messages first, so open questions are easy to find." },
        ],
      },
      {
        type: "cta",
        title: "Tell us how you track follow-ups today. It shapes what we build.",
        button: { label: "Contact us", href: "/contact" },
        tone: "dark",
      },
      {
        type: "callout",
        title: "Small list, big difference",
        body: "Most missed opportunities aren't missed calls. They're callbacks that never happened. Tasks are meant to close that gap.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Is task management live?", a: "No, it's on the roadmap. The call log and threaded inbox are the closest tools today." },
          { q: "Will tasks be shared across a team?", a: "Assigning tasks to teammates depends on team seats, which are also coming. We'll launch personal tasks first." },
          { q: "Will tasks sync with my calendar or project tool?", a: "Integrations are planned but not scheduled. See the integrations page for what's on the list." },
          { q: "Could AI create tasks for me?", a: "That's an idea we're exploring for the in-app assistant. It isn't available yet." },
        ],
      },
    ],
    related: ["/product/call-analytics/call-logs", "/product/crm", "/product/assistant", "/product/calling/call-notes"],
  },

  // ───────────────────────────────── /product/assistant
  {
    path: "/product/assistant",
    title: "In-app AI assistant (coming soon) | DIGIRINGO",
    description:
      "An AI assistant inside DIGIRINGO is planned: find calls, draft replies and catch up on missed conversations. It isn't available yet. Here's what we plan.",
    crumbs: [PRODUCT, AI],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Assistant",
        h1: "Ask your phone line a question",
        sub: "We're designing an assistant inside the DIGIRINGO app that understands your calls and texts. Ask what you missed, have it draft a reply, or find the conversation you're thinking of.",
        bullets: [
          "Catch up on missed calls and texts",
          "Draft SMS replies you can edit before sending",
          "Search your history in plain language",
        ],
        shot: "chat",
      },
      {
        type: "definition",
        title: "What is an in-app AI assistant?",
        paragraphs: [
          "An in-app assistant is a helper that works on your own data inside the product. Instead of opening several screens, you ask it something like 'who called about the quote yesterday?' and it finds the answer.",
          "Our assistant is for you, the account owner. It's different from an AI voice agent, which talks to your callers. If you want an AI to answer your phone today, you can route a number to your own agent.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Ideas on the table",
        intro: "None of these are live. We're sharing them so you can tell us what matters most.",
        cols: 2,
        items: [
          { title: "Daily catch-up", icon: "sparkles", status: "soon", body: "A short summary of calls, texts and voicemails since you last checked." },
          { title: "Reply drafts", icon: "send", status: "soon", body: "Suggested SMS replies that you review and send yourself." },
          { title: "Natural-language search", icon: "search", status: "soon", body: "Find calls and texts by describing them." },
          { title: "Follow-up suggestions", icon: "check", status: "soon", body: "Reminders to get back to people who are waiting.", href: "/product/task-management" },
        ],
      },
      {
        type: "callout",
        title: "You stay in control",
        body: "The assistant will never text or call anyone on its own. Anything it drafts waits for you to approve it.",
        tone: "dark",
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Route calls to your AI agent", body: "Connect a number to an AI voice agent you already use.", href: "/ai-agent" },
          { title: "Use the call log", body: "Scan recent and missed calls in one list.", href: "/product/call-analytics/call-logs" },
          { title: "Ask our support team", body: "Live chat support is built into the app if you need help." },
        ],
      },
      {
        type: "callout",
        title: "Built on data you already have",
        body: "Your calls and texts are already stored with your account. The assistant will work from that history, not from anything outside it.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Is the assistant available?", a: "No. It's in planning. We'll mark this page live when you can use it." },
          { q: "Will it read my messages?", a: "To summarize or search, it would need access to your account's calls and texts. We'll explain exactly what it uses before you turn it on, and it will be optional." },
          { q: "How is this different from an AI voice agent?", a: "The assistant helps you inside the app. A voice agent answers phone calls. DIGIRINGO can route calls to your own voice agent today." },
          { q: "Which AI model will it use?", a: "We haven't announced that. We'll share details, including how data is handled, at launch." },
        ],
      },
    ],
    related: ["/product/ai", "/ai-agent", "/product/ai/mcp", "/product/task-management"],
  },

  // ───────────────────────────────── /product/call-recording
  {
    path: "/product/call-recording",
    title: "Business call recording (coming soon) | DIGIRINGO",
    description:
      "Call recording is coming to DIGIRINGO, both automatic and on-demand, with consent prompts built in. It is not available yet. Here is what we have planned.",
    crumbs: [PRODUCT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call recording",
        h1: "Keep a record of the calls that matter",
        sub: "We're building call recording into DIGIRINGO. Record every call on a number automatically, or start and stop recording during a call when you need it.",
        bullets: [
          "Automatic recording per number",
          "On-demand recording from the call screen",
          "Consent announcement options for callers",
        ],
        shot: "dialer",
      },
      {
        type: "definition",
        title: "What is call recording?",
        paragraphs: [
          "Call recording saves the audio of a phone call so you can listen back later. Businesses use it to confirm details of an order, train new staff, or settle a 'that's not what I said' disagreement.",
          "Recording laws differ by place. Some US states and many countries require everyone on the call to agree before it's recorded. That's why we're building a consent announcement into the feature, not leaving it as an afterthought.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Two ways to record",
        cols: 2,
        items: [
          { title: "Automatic call recording", icon: "repeat", status: "soon", href: "/product/call-recording/automatic-call-recording", body: "Turn it on for a number and every call on that line is recorded." },
          { title: "On-demand call recording", icon: "mic", status: "soon", href: "/product/call-recording/on-demand-call-recording", body: "Tap record mid-call for just the conversations you want to keep." },
        ],
      },
      {
        type: "cards",
        title: "Planned with it",
        tone: "tint",
        cols: 3,
        items: [
          { title: "Playback in the app", icon: "headphones", status: "soon", body: "Listen from your call log on any device." },
          { title: "Transcripts", icon: "file", status: "soon", body: "Read the call as text.", href: "/features/call-transcriptions" },
          { title: "AI summaries", icon: "sparkles", status: "soon", body: "A few lines on what was discussed.", href: "/features/call-summary" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        items: [
          { title: "Route to your own system", body: "If you route a number to your own webhook, your TeXML app controls the call, which can include your own recording setup.", href: "/developers" },
          { title: "Keep your call log", body: "Times, numbers and durations are saved for every call.", href: "/product/call-analytics/call-logs" },
          { title: "Take notes during calls", body: "Until built-in call notes arrive, a notes app next to the dialer works fine." },
        ],
      },
      {
        type: "callout",
        title: "Recording will always be your choice",
        body: "Recording will be off by default. You'll decide which numbers record, and whether callers hear a notice.",
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can DIGIRINGO record calls today?", a: "No. Built-in call recording isn't available yet. It's on our roadmap." },
          { q: "Is it legal to record business calls?", a: "It depends on where you and the caller are. Some places allow one-party consent, others require all parties to agree. Check the rules that apply to you, and when in doubt, announce the recording." },
          { q: "Will recordings cost extra?", a: "We haven't set pricing. Any storage or recording cost will appear on the pricing page before it applies." },
          { q: "Will voicemails count as recordings?", a: "Voicemail already records messages from callers who don't reach you. Call recording is separate and covers live conversations." },
        ],
      },
    ],
    related: ["/product/call-recording/automatic-call-recording", "/product/call-recording/on-demand-call-recording", "/features/call-transcriptions", "/product/voicemail"],
  },

  // ───────────────────────────────── /product/call-recording/automatic-call-recording
  {
    path: "/product/call-recording/automatic-call-recording",
    title: "Automatic call recording (coming soon) | DIGIRINGO",
    description:
      "Automatic call recording for DIGIRINGO is in development: switch it on per number and every call is saved, with an optional notice for callers.",
    crumbs: [PRODUCT, RECORDING],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Automatic call recording",
        h1: "Record every call on a line, without remembering to",
        sub: "When automatic recording arrives, you'll switch it on for a number once. From then on, each call on that line is recorded and saved alongside its entry in your call log.",
        bullets: [
          "On or off per number",
          "Optional notice played to callers",
          "Recordings linked to your call history",
        ],
        shot: "numbers",
      },
      {
        type: "definition",
        title: "What is automatic call recording?",
        paragraphs: [
          "Automatic call recording captures every call on a phone line from the moment it connects, with no button to press. It suits lines where you always want a record, like an order line or a support number.",
          "The trade-off is volume and consent. You'll keep more audio than you need, and callers should be told. Per-number control means you can record your order line and leave your personal line alone.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "When automatic recording makes sense",
        cols: 3,
        items: [
          { title: "Orders and bookings", icon: "calendar", body: "Have the exact details if a date or quantity is disputed." },
          { title: "Training", icon: "graduation", body: "Let new staff hear how real calls go." },
          { title: "Quality checks", icon: "star", body: "Review a sample of calls to improve service." },
        ],
      },
      {
        type: "steps",
        title: "How it will work",
        tone: "tint",
        items: [
          { title: "Open the number's settings", body: "Pick the line you want to record." },
          { title: "Turn on recording", body: "Choose whether callers hear a short notice first." },
          { title: "Find recordings in your log", body: "Each recorded call shows a play button in your history." },
        ],
      },
      {
        type: "table",
        title: "Automatic vs. on-demand recording",
        head: ["", "Automatic", "On-demand"],
        rows: [
          ["Records every call", "yes", "no"],
          ["Needs a tap during the call", "no", "yes"],
          ["Best for", "Order lines, support lines", "Occasional important calls"],
          ["Storage used", "More", "Less"],
          ["Available in DIGIRINGO", "soon", "soon"],
        ],
      },
      {
        type: "cta",
        title: "Get a number today. Turn on recording when it ships.",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is automatic call recording available?", a: "Not yet. This page describes the planned feature." },
          { q: "Will it record forwarded calls?", a: "We're working out the details for calls forwarded to a cellphone. We'll document exactly which calls are recorded at launch." },
          { q: "How long will recordings be kept?", a: "Retention settings are part of the design. We'll publish the defaults when the feature launches." },
          { q: "Can I delete a recording?", a: "We plan to let you delete recordings from the start." },
        ],
      },
    ],
    related: ["/product/call-recording", "/product/call-recording/on-demand-call-recording", "/product/call-analytics/call-logs"],
  },

  // ───────────────────────────────── /product/call-recording/on-demand-call-recording
  {
    path: "/product/call-recording/on-demand-call-recording",
    title: "On-demand call recording (coming soon) | DIGIRINGO",
    description:
      "On-demand call recording is planned for DIGIRINGO: tap record during a call to save just the conversations you need. Not live yet. Here's how it will work.",
    crumbs: [PRODUCT, RECORDING],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "On-demand call recording",
        h1: "Hit record only when the call calls for it",
        sub: "On-demand recording will add a record button to the DIGIRINGO call screen, next to mute, hold and keypad. Start it when a call turns important and stop it whenever you like.",
        bullets: [
          "One tap to start or stop",
          "Works on inbound and outbound calls",
          "Keeps storage and clutter down",
        ],
        shot: "dialer",
      },
      {
        type: "definition",
        title: "What is on-demand call recording?",
        paragraphs: [
          "On-demand (or manual) recording lets you choose which calls, or which part of a call, to save. Nothing is captured until you press the button.",
          "It's a good fit when most calls are routine but a few aren't, like when a client starts listing specifications or agrees to terms you'll want to check later.",
        ],
        tone: "tint",
      },
      {
        type: "flex",
        title: "Built into the call screen you already use",
        rows: [
          { title: "Today: in-call controls", body: "The call screen already has keypad, hold, mute and speaker on both the web app and Android.", status: "live", shot: "dialer" },
          { title: "Coming: a record button", body: "Recording will sit with those controls, with a visible indicator while it's running.", status: "soon" },
          { title: "Coming: saved with the call", body: "The recording will attach to the call's entry in your history for playback.", status: "soon", shot: "calls" },
        ],
      },
      {
        type: "steps",
        title: "How it will work",
        tone: "tint",
        items: [
          { title: "Start a call", body: "Make or answer a call as usual." },
          { title: "Tap record", body: "Let the other person know, then tap the record button." },
          { title: "Stop or hang up", body: "Recording ends when you tap stop or the call ends." },
        ],
      },
      {
        type: "cta",
        title: "Want on-demand recording? Get notified when it's ready.",
        button: { label: "Contact us", href: "/contact" },
        tone: "dark",
      },
      {
        type: "callout",
        title: "Tell the other person first",
        body: "Even with a record button, the courteous and often legally required step is to say the call is being recorded before you tap it.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Can I record a call in DIGIRINGO right now?", a: "No. Recording isn't available yet in either automatic or on-demand form." },
          { q: "Will the other person be notified?", a: "We plan to offer an announcement option. Regardless of the tool, you're responsible for following the recording laws where you and the caller are." },
          { q: "Will it work on Android and the web app?", a: "That's the plan, since both apps share the same call screen controls." },
          { q: "Can I record part of a call?", a: "Yes, starting and stopping mid-call is the point of on-demand recording." },
        ],
      },
    ],
    related: ["/product/call-recording", "/product/call-recording/automatic-call-recording", "/product/calling/call-notes"],
  },

  // ───────────────────────────────── /product/auto-attendant
  {
    path: "/product/auto-attendant",
    title: "Auto attendant for business calls (soon) | DIGIRINGO",
    description:
      "A DIGIRINGO auto attendant is in development: greet callers, offer keypress options and route each one. Until then, per-number routing decides where calls go.",
    crumbs: [PRODUCT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Auto attendant",
        h1: "Answer every call with a greeting and a choice",
        sub: "The DIGIRINGO auto attendant will answer your number, play your welcome message and let callers choose where to go, all before anyone on your side picks up.",
        bullets: [
          "Your greeting, recorded or typed",
          "Keypress options that route calls",
          "Single-level and multi-level menus",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is an auto attendant?",
        paragraphs: [
          "An auto attendant is an automated operator. It answers incoming calls, plays a message like 'Thanks for calling. For sales, press 1,' and connects the caller based on their choice.",
          "It helps a small business route calls without a receptionist, and it gives callers a way to reach the right place on the first try. In DIGIRINGO, it will sit in front of the per-number routing that works today.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Auto attendant pages",
        cols: 3,
        items: [
          { title: "Cloud IVR", icon: "globe", status: "soon", href: "/product/auto-attendant/cloud-ivr", body: "A phone menu hosted online, with nothing to install." },
          { title: "Multi-level auto attendant", icon: "git-branch", status: "soon", href: "/product/auto-attendant/multi-level-auto-attendant", body: "Sub-menus for businesses with several departments." },
          { title: "AI IVR", icon: "bot", status: "soon", href: "/product/ai/ivr", body: "Callers say what they need instead of pressing keys." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        intro: "No built-in menu yet, but these live features cover a lot of the same ground.",
        tone: "tint",
        items: [
          { title: "Use separate numbers", body: "Give sales and support their own numbers, each with its own routing." },
          { title: "Route by number", body: "Send one number to the app and another to a cellphone or a SIP agent.", href: "/product/call-routing" },
          { title: "Build your own menu", body: "Route a number to your webhook and return TeXML to play options and gather keypresses.", href: "/developers" },
        ],
      },
      {
        type: "table",
        title: "Auto attendant vs. virtual receptionist",
        head: ["", "Auto attendant", "Virtual receptionist"],
        rows: [
          ["How callers choose", "Keypad options", "Keypad or speech"],
          ["Takes messages", "Via voicemail option", "yes"],
          ["Best for", "Clear departments", "Greeting plus general help"],
          ["DIGIRINGO status", "soon", "soon"],
        ],
      },
      {
        type: "cta",
        title: "Write your attendant greeting now, free.",
        button: { label: "Greeting generator", href: "/tools/auto-attendant-greeting-generator" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO have an auto attendant today?", a: "Not yet. You can route each number to one destination today, and developers can build a menu with a TeXML webhook." },
          { q: "Will I be able to record my own greeting?", a: "Yes, custom greetings are part of the plan, along with text-to-speech for people who'd rather type." },
          { q: "Will it work with toll-free numbers?", a: "We intend it to work on any DIGIRINGO number, local or toll-free." },
          { q: "What happens if a caller presses nothing?", a: "You'll set a default, such as ringing the app or going to voicemail." },
        ],
      },
    ],
    related: ["/product/menu-routing", "/product/virtual-receptionist", "/product/auto-attendant/cloud-ivr", "/features/self-service-ivr"],
  },

  // ───────────────────────────────── /product/auto-attendant/cloud-ivr
  {
    path: "/product/auto-attendant/cloud-ivr",
    title: "Cloud IVR phone menus (coming soon) | DIGIRINGO",
    description:
      "Cloud IVR is coming to DIGIRINGO: a hosted phone menu you set up in the browser, no hardware. Today developers can already build menus with a TeXML webhook.",
    crumbs: [PRODUCT, ATTENDANT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Cloud IVR",
        h1: "A phone menu that runs online, not in a server closet",
        sub: "Our cloud IVR will let you build a keypad menu for any DIGIRINGO number from the web app. Change an option and it's live on the next call.",
        bullets: [
          "Set up in the browser",
          "No PBX hardware or installs",
          "Edit options any time",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is a cloud IVR?",
        paragraphs: [
          "IVR stands for interactive voice response: the system that plays a menu and acts on the caller's keypresses. A cloud IVR runs on the provider's servers, so there's nothing to install or maintain at your office.",
          "Older IVRs were configured by a technician. A cloud IVR is meant to be edited by whoever runs the business, from a browser, as often as needed.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Why host your menu in the cloud",
        cols: 3,
        items: [
          { title: "Nothing to install", icon: "monitor", body: "The menu lives with your number, not on a box at the office." },
          { title: "Quick changes", icon: "zap", body: "Add a holiday option or reword a greeting in minutes." },
          { title: "Works anywhere", icon: "globe", body: "Calls are routed the same way whether you're in the office or not." },
        ],
      },
      {
        type: "longform",
        title: "Build one today with a webhook",
        intro: "If you're comfortable with a little code, you don't have to wait for our editor.",
        tone: "tint",
        items: [
          { title: "Point the number at your URL", body: "In the number's settings, choose 'Send to my app (webhook)' and enter an HTTPS address.", status: "beta" },
          { title: "Return TeXML", body: "When a call arrives, your URL receives the request and replies with TeXML instructions, such as playing a message and gathering digits.", status: "beta" },
          { title: "Branch on keypresses", body: "Your app decides what each key does: dial a phone, connect a SIP agent or play another message.", status: "beta" },
          { title: "Point-and-click editor", body: "A no-code menu builder inside DIGIRINGO is coming.", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "How the built-in cloud IVR will work",
        items: [
          { title: "Write your greeting", body: "Type it or record it." },
          { title: "Add options", body: "Map keys to the app, a cellphone, voicemail or a sub-menu." },
          { title: "Publish", body: "Save and the menu answers the next call." },
        ],
      },
      {
        type: "cta",
        title: "Read our developer notes on webhook routing.",
        button: { label: "Developers", href: "/developers" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is cloud IVR available in DIGIRINGO?", a: "The no-code editor isn't. Routing a number to your own TeXML webhook works today, so developers can build an IVR now." },
          { q: "What is TeXML?", a: "TeXML is an XML format for call instructions, similar in style to TwiML. Your server returns it to tell the call what to do next." },
          { q: "Do I need a developer for the built-in version?", a: "No. The upcoming editor is meant for non-technical owners." },
          { q: "Will it support multiple languages?", a: "You'll be able to record greetings in any language. Language-specific menu options are something we'll look at after launch." },
        ],
      },
    ],
    related: ["/product/auto-attendant", "/product/auto-attendant/multi-level-auto-attendant", "/product/menu-routing", "/developers"],
  },

  // ───────────────────────────────── /product/auto-attendant/multi-level-auto-attendant
  {
    path: "/product/auto-attendant/multi-level-auto-attendant",
    title: "Multi-level auto attendant (coming soon) | DIGIRINGO",
    description:
      "Multi-level phone menus are planned for DIGIRINGO: sub-menus for departments, locations or languages. Here's how they'll work and how to keep menus short.",
    crumbs: [PRODUCT, ATTENDANT],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Multi-level auto attendant",
        h1: "Menus inside menus, without losing your callers",
        sub: "A multi-level attendant lets one option open another set of choices. We're building it for businesses with several locations, departments or languages on one number.",
        bullets: [
          "Sub-menus under any option",
          "A way back to the main menu",
          "Sensible defaults when callers don't choose",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is a multi-level auto attendant?",
        paragraphs: [
          "A single-level attendant has one menu. A multi-level attendant nests menus: press 2 for service, then 1 for repairs or 2 for installations. Each branch can lead to a person, a number, voicemail or another menu.",
          "Depth is a tool to use carefully. Two levels can make a large business easy to navigate. Four levels usually frustrates people. Our design will keep menus short and always offer a way back.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Common multi-level layouts",
        cols: 3,
        items: [
          { title: "By location", icon: "map-pin", body: "Pick a branch first, then the department at that branch." },
          { title: "By language", icon: "globe", body: "Choose a language, then hear the menu in that language." },
          { title: "By customer type", icon: "users", body: "New customers and existing customers get different options." },
        ],
      },
      {
        type: "accordion",
        title: "Tips for menus callers don't hate",
        tone: "tint",
        items: [
          { title: "Keep each level to four options or fewer", body: "People remember three or four choices. Beyond that, they press 0 or hang up." },
          { title: "Put the most common choice first", body: "If most callers want hours or booking, make that option 1." },
          { title: "Say the action, then the key", body: "'For billing, press 3' is easier to follow than 'press 3 for billing.'" },
          { title: "Always offer a way out", body: "Let callers repeat the menu or go back a level." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        items: [
          { title: "One number per branch", body: "Buy a local number for each location and route each one separately." },
          { title: "Nest menus with a webhook", body: "A TeXML webhook can play any number of menu levels you design.", href: "/developers" },
          { title: "Plan your tree", body: "Sketch your menu now so it's ready when the built-in editor launches." },
        ],
      },
      {
        type: "cta",
        title: "Read our phone menu guide for small businesses.",
        button: { label: "Read the guide", href: "/blog/small-business-phone-menu-ivr" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is the multi-level attendant live?", a: "No. Both single and multi-level menus are coming. Developers can build nested menus today with a webhook." },
          { q: "How many levels will be allowed?", a: "We'll publish limits at launch. We recommend no more than two or three levels for callers' sake." },
          { q: "Can a sub-menu send callers to voicemail?", a: "Yes, that's one of the planned destinations." },
          { q: "Will it support business hours?", a: "Hours-based routing is also on the roadmap and designed to work with menus." },
        ],
      },
    ],
    related: ["/product/auto-attendant", "/product/auto-attendant/cloud-ivr", "/product/call-routing/business-hours-call-routing"],
  },

  // ───────────────────────────────── /product/ai
  {
    path: "/product/ai",
    title: "AI for your business phone line | DIGIRINGO",
    description:
      "Route any DIGIRINGO number to your own AI voice agent by SIP or webhook today (beta). DIGIRINGO's own AI receptionist, summaries and tags are coming soon.",
    crumbs: [PRODUCT],
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "AI",
        h1: "Put an AI on your phone line, starting with the one you already have",
        sub: "DIGIRINGO numbers can send their calls straight to your own AI voice agent today. Our own built-in AI features are in development, and every one is labeled on this page.",
        bullets: [
          "Live in beta: route a number to your AI or SIP agent",
          "Live in beta: hand calls to your own TeXML webhook",
          "Coming soon: DIGIRINGO's built-in AI receptionist",
        ],
        shot: "settings",
        primary: { label: "Get your number", href: "/app" },
        secondary: { label: "Bring your AI agent", href: "/ai-agent" },
      },
      {
        type: "definition",
        title: "What does AI on a phone line mean?",
        paragraphs: [
          "An AI on a phone line is software that listens to callers and talks back: it can answer questions, take a message or book a time. To do that, it needs a phone number and a way for calls to reach it. That second part is what DIGIRINGO handles today.",
          "Many businesses already use an AI voice agent from a specialist provider. DIGIRINGO gives that agent a real local or toll-free number and passes each call to it over SIP or a webhook. A DIGIRINGO-built agent, for people who don't have one, comes later.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        eyebrow: "Available in beta",
        title: "What works today",
        cols: 3,
        items: [
          { title: "Bring your AI agent", icon: "bot", status: "beta", href: "/ai-agent", body: "The overview: what to set up, what it costs and how calls flow." },
          { title: "AI voice agent routing", icon: "route", status: "beta", href: "/product/ai/voice-agent", body: "Send a number's calls to a SIP URI where your agent answers." },
          { title: "AI phone calls", icon: "phone-incoming", status: "beta", href: "/product/ai/phone-calls", body: "Let your agent answer inbound calls on a real business number." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Coming soon",
        title: "Built-in DIGIRINGO AI",
        intro: "None of these are available yet. Each page explains the plan and what you can use meanwhile.",
        tone: "tint",
        cols: 4,
        items: [
          { title: "AI receptionist", icon: "user", status: "soon", href: "/product/ai/receptionist", body: "Answers, helps and routes callers." },
          { title: "After-hours answering", icon: "moon", status: "soon", href: "/product/ai/after-hours-answering-service", body: "Covers the phone when you're closed." },
          { title: "Appointment setter", icon: "calendar", status: "soon", href: "/product/ai/appointment-setter", body: "Books times while on the call." },
          { title: "AI IVR", icon: "git-branch", status: "soon", href: "/product/ai/ivr", body: "Speech-based phone menus." },
          { title: "Call tagging", icon: "tag", status: "soon", href: "/product/ai/call-tagging", body: "Labels calls by topic automatically." },
          { title: "Suggested contacts", icon: "users", status: "soon", href: "/product/ai/suggested-contacts", body: "Fills in contact details from calls." },
          { title: "MCP server", icon: "plug", status: "soon", href: "/product/ai/mcp", body: "Lets AI assistants work with your account." },
          { title: "In-app assistant", icon: "sparkles", status: "soon", href: "/product/assistant", body: "Helps you catch up and reply." },
        ],
      },
      {
        type: "steps",
        title: "How to connect your AI agent in DIGIRINGO",
        items: [
          { title: "Get a number", body: "Buy a local, toll-free or international number in the app." },
          { title: "Open its routing settings", body: "Go to Numbers, pick the number and find incoming call routing." },
          { title: "Choose SIP or webhook", body: "Enter your agent's SIP URI, or an HTTPS URL that returns TeXML." },
          { title: "Call it to test", body: "Dial the number from another phone and talk to your agent." },
        ],
      },
      {
        type: "table",
        title: "Your agent today vs. DIGIRINGO AI later",
        head: ["", "Your own AI agent (today)", "DIGIRINGO AI (coming)"],
        rows: [
          ["Status", "beta", "soon"],
          ["Who builds the agent", "You or your AI provider", "DIGIRINGO"],
          ["How calls reach it", "SIP URI or TeXML webhook", "Built in"],
          ["Setup", "Some technical setup", "Planned as no-code"],
          ["Summaries and tags in the app", "no", "soon"],
        ],
      },
      {
        type: "cta",
        title: "Have an AI agent already? Give it a real phone number today.",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO have its own AI receptionist?", a: "Not yet. It's in development. Today you can route any number to an AI agent you run or subscribe to elsewhere." },
          { q: "What AI agents can I connect?", a: "Any agent that can accept a call at a SIP address, or any system that can respond to a webhook with TeXML call instructions." },
          { q: "What does it cost?", a: "You pay for the number and the normal call minutes, for example $0.015 per minute in the US and Canada. Your AI provider bills you separately for their service." },
          { q: "What if my agent doesn't answer?", a: "If the SIP agent doesn't pick up, the call falls back to voicemail so the caller can still leave a message." },
          { q: "Why is it labeled beta?", a: "The routing works, but it's new and we're still refining setup and error messages. We'd love feedback through in-app live chat." },
        ],
      },
    ],
    related: ["/ai-agent", "/product/ai/voice-agent", "/product/call-routing", "/developers"],
  },

  // ───────────────────────────────── /product/ai/voice-agent
  {
    path: "/product/ai/voice-agent",
    title: "Route calls to your AI voice agent | DIGIRINGO",
    description:
      "Connect a DIGIRINGO number to your AI voice agent or SIP endpoint. Incoming calls are dialed to your agent's SIP URI, with voicemail as backup. Now in beta.",
    crumbs: [PRODUCT, AI],
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "AI voice agent",
        h1: "Give your AI voice agent a real business number",
        sub: "Choose 'Connect to my agent (SIP)' on any DIGIRINGO number, paste your agent's SIP address, and calls to that number go straight to your agent.",
        bullets: [
          "Works with any agent that accepts SIP calls",
          "Local, toll-free and international numbers",
          "Voicemail picks up if the agent doesn't",
        ],
        shot: "settings",
        primary: { label: "Get your number", href: "/app" },
        secondary: { label: "Read the overview", href: "/ai-agent" },
      },
      {
        type: "definition",
        title: "What is an AI voice agent?",
        paragraphs: [
          "An AI voice agent is a program that holds a spoken conversation on the phone. It turns the caller's speech into text, decides how to respond, and speaks the reply. Businesses use them to answer common questions, qualify leads or take messages.",
          "The agent itself is built on an AI platform. What it lacks is a phone number customers recognize. DIGIRINGO supplies that number and delivers each call to the agent's SIP address.",
        ],
        tone: "tint",
      },
      {
        type: "flex",
        title: "How SIP routing works",
        rows: [
          { title: "Pick the number", body: "In Numbers, open the line you want your agent to answer. You can keep your other numbers ringing in the app as usual.", status: "live", shot: "numbers" },
          { title: "Choose 'Connect to my agent (SIP)'", body: "Enter a SIP URI like sip:agent@your-domain.com. Save, and the change applies to the next incoming call.", status: "beta", shot: "settings" },
          { title: "Calls go to your agent", body: "DIGIRINGO dials your agent's SIP address. If it doesn't answer, the caller reaches voicemail instead of dead air.", status: "beta" },
        ],
      },
      {
        type: "cards",
        title: "Why route through DIGIRINGO",
        tone: "tint",
        cols: 3,
        items: [
          { title: "Numbers in many countries", icon: "globe", body: "Put your agent on a US, Canadian or international number." },
          { title: "Switch back any time", body: "Change the route back to the app in seconds if you'd rather answer yourself.", icon: "refresh" },
          { title: "Simple pricing", icon: "dollar", body: "A US local number is $2.50 a month and US and Canada minutes are $0.015." },
        ],
      },
      {
        type: "cards",
        title: "What's coming next",
        cols: 3,
        items: [
          { title: "Agent call summaries", icon: "file", status: "soon", body: "See what each AI-handled call was about in your call log." },
          { title: "Hand-off to a person", icon: "phone-forwarded", status: "soon", body: "Let the agent transfer a caller to you." },
          { title: "Built-in agent", icon: "bot", status: "soon", body: "A DIGIRINGO agent for people without one.", href: "/product/ai/receptionist" },
        ],
      },
      {
        type: "cta",
        title: "Prefer to control the call yourself? Use the webhook route instead.",
        button: { label: "Developers", href: "/developers" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Which AI platforms work?", a: "Any agent or platform that can receive a call at a SIP URI. Check your provider's documentation for the SIP address they give you." },
          { q: "Can the agent make outbound calls from my number?", a: "Not through DIGIRINGO today. This route handles incoming calls." },
          { q: "Can the agent transfer callers to me?", a: "Transfers back into DIGIRINGO aren't supported yet. Call transfer is on our roadmap." },
          { q: "Is SIP routing secure?", a: "Use a SIP address from your provider that they publish for this purpose. DIGIRINGO stores the destination with your number and only sends that number's calls to it." },
          { q: "Do I pay twice?", a: "You pay DIGIRINGO for the number and call minutes, and your AI provider for their agent. We don't add a fee for using the SIP route." },
        ],
      },
    ],
    related: ["/ai-agent", "/product/ai/phone-calls", "/product/call-routing", "/product/ai"],
  },

  // ───────────────────────────────── /product/ai/phone-calls
  {
    path: "/product/ai/phone-calls",
    title: "AI phone calls on a business number | DIGIRINGO",
    description:
      "Let an AI answer the inbound calls on a DIGIRINGO number. Route the line to your AI agent over SIP or a TeXML webhook, in beta. No outbound AI calls yet.",
    crumbs: [PRODUCT, AI],
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "AI phone calls",
        h1: "Let an AI pick up the calls you can't",
        sub: "Point a DIGIRINGO number at your AI agent and it answers that line's incoming calls. Keep your main number ringing in the app and give the AI a separate line, or switch a line over after hours.",
        bullets: [
          "Inbound calls answered by your AI",
          "Choose per number which calls the AI takes",
          "Change the route back in a few taps",
        ],
        shot: "calls",
        primary: { label: "Get your number", href: "/app" },
      },
      {
        type: "definition",
        title: "What are AI phone calls?",
        paragraphs: [
          "AI phone calls are calls where one side is an AI rather than a person. For a business, that usually means an AI answering inbound calls: greeting the caller, answering common questions and capturing their details.",
          "DIGIRINGO's part is the phone network side. Your number takes the call and connects it to the AI you've chosen. The conversation itself is handled by your AI provider.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Ways businesses use it",
        cols: 3,
        items: [
          { title: "A dedicated info line", icon: "phone-incoming", body: "A separate number for hours, directions and FAQs, answered by the AI." },
          { title: "Lead capture", icon: "user", body: "An ad or campaign number where the AI collects caller details." },
          { title: "Overflow cover", icon: "clock", body: "Switch a number to the AI while you're on holiday, then switch it back." },
        ],
      },
      {
        type: "steps",
        title: "How to set up AI phone calls in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Have an AI agent ready", body: "Set one up with an AI voice provider and note its SIP address." },
          { title: "Buy or choose a number", body: "Use an existing DIGIRINGO number or add a new one for the AI." },
          { title: "Route the number", body: "In the number's settings, pick 'Connect to my agent (SIP)' or 'Send to my app (webhook)'." },
          { title: "Test and adjust", body: "Call the number and listen. Tweak your agent's prompt with your provider." },
        ],
      },
      {
        type: "table",
        title: "What's supported",
        head: ["Capability", "Status"],
        rows: [
          ["AI answers incoming calls (SIP)", "beta"],
          ["Your webhook controls incoming calls (TeXML)", "beta"],
          ["Voicemail fallback if the SIP agent doesn't answer", "yes"],
          ["AI places outbound calls from your number", "no"],
          ["Call summaries in the DIGIRINGO app", "soon"],
          ["Built-in DIGIRINGO AI agent", "soon"],
        ],
      },
      {
        type: "callout",
        title: "Be upfront with callers",
        body: "It's good practice, and in some places required, to let callers know they're speaking with an AI. Add a line to your agent's greeting.",
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can the AI call my customers?", a: "Not through DIGIRINGO today. AI routing covers incoming calls." },
          { q: "Can the AI and I share one number?", a: "Each number has one route at a time. Many businesses keep their main number in the app and give the AI its own number." },
          { q: "What happens to the call history?", a: "Calls on your DIGIRINGO numbers appear in your call log. The conversation details stay with your AI provider." },
          { q: "Is there a minimum commitment?", a: "No. You pay for the number and minutes from your prepaid wallet, with no contract." },
        ],
      },
    ],
    related: ["/product/ai/voice-agent", "/ai-agent", "/product/ai/after-hours-answering-service", "/product/ai"],
  },

  // ───────────────────────────────── /product/ai/receptionist
  {
    path: "/product/ai/receptionist",
    title: "AI receptionist (coming soon) | DIGIRINGO",
    description:
      "DIGIRINGO's own AI receptionist is in development: it will answer calls, help callers and take messages. Today you can route any number to your own AI agent.",
    crumbs: [PRODUCT, AI],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "AI receptionist",
        h1: "A receptionist that knows your business, built into DIGIRINGO",
        sub: "We're building an AI receptionist you can switch on for any number. It will greet callers, answer common questions from what you tell it, and send you a message when someone needs you.",
        bullets: [
          "Trained on your hours, services and FAQs",
          "Takes messages and sends them to the app",
          "Turn it on per number, no code",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is an AI receptionist?",
        paragraphs: [
          "An AI receptionist answers your phone in a natural voice. Instead of a menu, callers just say what they need. It can tell them your hours, explain a service, take their details, or pass the call along.",
          "Ours is meant for owners who don't want to set up an AI platform. You'll describe your business in plain language, and the receptionist will use that to handle calls. If you already have an AI agent, you can connect it today.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned abilities",
        cols: 3,
        items: [
          { title: "Answer questions", icon: "message", status: "soon", body: "Hours, location, services and pricing you provide." },
          { title: "Take messages", icon: "file", status: "soon", body: "Name, number and reason for calling, sent to you." },
          { title: "Route calls", icon: "route", status: "soon", body: "Ring you when a caller asks for a person." },
          { title: "Book appointments", icon: "calendar", status: "soon", href: "/product/ai/appointment-setter", body: "Offer open times and confirm a slot." },
          { title: "Cover after hours", icon: "moon", status: "soon", href: "/product/ai/after-hours-answering-service", body: "Answer when you're closed." },
          { title: "Summaries", icon: "sparkles", status: "soon", body: "A short recap of each call in your log." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Connect your own AI agent", body: "Route a number to any AI voice agent over SIP.", href: "/product/ai/voice-agent" },
          { title: "Ring every device", body: "Answer from the browser or Android, whichever is nearer." },
          { title: "Forward and fall back", body: "Missed in the app? It goes to your cellphone, then voicemail." },
        ],
      },
      {
        type: "cta",
        title: "Want early access to the AI receptionist? Tell us about your calls.",
        button: { label: "Contact us", href: "/contact" },
        tone: "dark",
      },
      {
        type: "callout",
        title: "Not here yet, and we'll say when it is",
        body: "This page will switch from 'coming soon' to 'live' only when you can turn the receptionist on in your account. Until then, the bring-your-own route is the way to put AI on your line.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "When will the AI receptionist be ready?", a: "We haven't set a date. Use 'Get notified' on this page and we'll email you." },
          { q: "Can I use an AI receptionist with DIGIRINGO now?", a: "Yes, if you bring your own. Route a number to an AI agent from another provider over SIP or a webhook." },
          { q: "Will it sound robotic?", a: "We're designing it to use natural, modern voices. We'll share samples before launch rather than make promises now." },
          { q: "How much will it cost?", a: "Pricing isn't set. We'll publish it on the pricing page before launch." },
        ],
      },
    ],
    related: ["/ai-agent", "/product/virtual-receptionist", "/product/ai/after-hours-answering-service", "/answering-service"],
  },

  // ───────────────────────────────── /product/ai/after-hours-answering-service
  {
    path: "/product/ai/after-hours-answering-service",
    title: "After-hours AI answering (coming soon) | DIGIRINGO",
    description:
      "A built-in after-hours AI answering service is planned for DIGIRINGO. Today, cover closed hours with cell forwarding, voicemail or your own AI agent.",
    crumbs: [PRODUCT, AI],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "After-hours answering",
        h1: "Calls at 9 p.m. still deserve an answer",
        sub: "We're building after-hours answering into DIGIRINGO: when you're closed, an AI will pick up, help where it can and leave you a clear message for the morning.",
        bullets: [
          "Kicks in on your schedule",
          "Handles routine questions",
          "Flags urgent calls for you",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is an after-hours answering service?",
        paragraphs: [
          "An after-hours answering service picks up your business calls when you're not open. Traditionally that meant a call center with operators reading from a script. AI makes it possible to do the same thing without a monthly retainer.",
          "Our version depends on two pieces still in development: business-hours routing and the DIGIRINGO AI receptionist. Until both ship, there are practical ways to cover closed hours today.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned features",
        cols: 3,
        items: [
          { title: "Business-hours schedule", icon: "clock", status: "soon", href: "/product/call-routing/business-hours-call-routing", body: "Tell DIGIRINGO when you're open." },
          { title: "AI answering", icon: "bot", status: "soon", body: "A friendly answer outside those hours." },
          { title: "Urgent flags", icon: "bell", status: "soon", body: "Get alerted when a caller says it can't wait." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Forward to an on-call phone", body: "Set the forwarding number to whoever is on call tonight." },
          { title: "Let voicemail catch the rest", body: "Callers can leave a message with the standard greeting.", href: "/product/voicemail" },
          { title: "Switch a number to your AI agent", body: "Route the number to your own AI agent at closing time and back in the morning.", href: "/product/ai/voice-agent" },
        ],
      },
      {
        type: "callout",
        title: "A quick reality check",
        body: "Switching routes by hand works, but it's manual. Automatic, schedule-based switching is part of the coming business-hours feature.",
        tone: "dark",
      },
      {
        type: "callout",
        title: "Closed doesn't have to mean unreachable",
        body: "Many after-hours calls are simple: are you open tomorrow, can I book, is this urgent. An answer to those, even an automated one, beats a ringing phone.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Is there an after-hours AI service in DIGIRINGO now?", a: "Not built in. You can route a number to your own AI agent, but there's no automatic schedule yet." },
          { q: "Is this a human answering service?", a: "No. DIGIRINGO doesn't provide human operators." },
          { q: "Can I get a text when someone calls after hours?", a: "Missed calls show in your log and you get notified of incoming calls. Dedicated after-hours alerts are planned." },
          { q: "Will it work on weekends and holidays?", a: "That's the plan, with holiday overrides as part of the schedule." },
        ],
      },
    ],
    related: ["/product/ai/receptionist", "/product/call-routing/business-hours-call-routing", "/product/ai/phone-calls", "/answering-service"],
  },

  // ───────────────────────────────── /product/ai/appointment-setter
  {
    path: "/product/ai/appointment-setter",
    title: "AI appointment setter (coming soon) | DIGIRINGO",
    description:
      "An AI appointment setter is planned for DIGIRINGO: it will offer open times on the call and confirm bookings. Not live yet. See the plan and what works today.",
    crumbs: [PRODUCT, AI],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "AI appointment setter",
        h1: "Book the job while the caller is still on the line",
        sub: "We're planning an AI appointment setter for DIGIRINGO that checks your availability, offers a few times and confirms the booking by text.",
        bullets: [
          "Offers real open slots",
          "Confirms by SMS",
          "Hands tricky requests to you",
        ],
        shot: "chat",
      },
      {
        type: "definition",
        title: "What is an AI appointment setter?",
        paragraphs: [
          "An AI appointment setter is a phone agent focused on one job: getting the caller booked. It asks what they need, checks a calendar, suggests times and confirms the choice.",
          "For service businesses, a caller who can't book often calls the next name on the list. An AI that books on the first call keeps that customer. It will need calendar integrations, which are also on our roadmap.",
        ],
        tone: "tint",
      },
      {
        type: "steps",
        title: "How it will work",
        items: [
          { title: "Connect your calendar", body: "Link the calendar that holds your availability.", status: "soon" },
          { title: "Set booking rules", body: "Appointment length, buffer time and which services can be booked.", status: "soon" },
          { title: "Let the AI answer", body: "It offers times, books one and texts a confirmation.", status: "soon" },
        ],
      },
      {
        type: "cards",
        title: "What you can do today",
        tone: "tint",
        cols: 3,
        items: [
          { title: "Use your own booking agent", icon: "bot", status: "beta", href: "/product/ai/voice-agent", body: "If your AI provider supports scheduling, route a number to it over SIP." },
          { title: "Confirm by text", icon: "message", status: "live", href: "/product/messaging/two-way-sms", body: "Send booking confirmations from your business number." },
          { title: "Call back fast", icon: "refresh", status: "live", href: "/product/call-analytics/call-logs", body: "Return missed calls from the log in one tap." },
        ],
      },
      {
        type: "cta",
        title: "Tell us which calendar you use so we can prioritize it.",
        button: { label: "Contact us", href: "/contact" },
        tone: "dark",
      },
      {
        type: "callout",
        title: "You keep the final say",
        body: "Booking rules will be yours to set. The AI will only offer times you've made available and will hand anything unusual back to you.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Can DIGIRINGO book appointments today?", a: "Not on its own. If your AI agent from another provider books appointments, you can route a DIGIRINGO number to it." },
          { q: "Which calendars will it support?", a: "We haven't finalized the list. Popular options like Google Calendar are likely first." },
          { q: "Will it send confirmation texts?", a: "That's the plan. US texting requires 10DLC registration, which you can complete in the Trust Center today." },
          { q: "Can it reschedule or cancel?", a: "We're scoping that. Booking new appointments comes first." },
        ],
      },
    ],
    related: ["/product/ai/receptionist", "/product/ai/voice-agent", "/product/messaging/two-way-sms", "/integrations"],
  },

  // ───────────────────────────────── /product/ai/ivr
  {
    path: "/product/ai/ivr",
    title: "AI IVR with speech recognition (soon) | DIGIRINGO",
    description:
      "AI IVR is planned for DIGIRINGO: callers say what they need and get routed. Not live yet. Today, route a number to your own AI agent or TeXML webhook.",
    crumbs: [PRODUCT, AI],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "AI IVR",
        h1: "Skip the 'press 1.' Let callers just say it.",
        sub: "Our planned AI IVR will ask callers what they're calling about and send them to the right place based on their answer, in their own words.",
        bullets: [
          "Speech instead of keypresses",
          "Routes to the app, a phone or voicemail",
          "Falls back to a keypad menu if needed",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is an AI IVR?",
        paragraphs: [
          "A traditional IVR plays a list of options and waits for a key. An AI IVR asks an open question, like 'How can I help?', understands the answer and routes the call. Callers don't have to guess which number matches their problem.",
          "It sits between a simple phone menu and a full AI receptionist. It doesn't try to solve the caller's issue; it just gets them to the right destination quickly.",
        ],
        tone: "tint",
      },
      {
        type: "table",
        title: "Keypad IVR vs. AI IVR",
        head: ["", "Keypad IVR", "AI IVR"],
        rows: [
          ["How callers choose", "Press a number", "Say what they need"],
          ["Menu length", "Limited to a few options", "Can cover more topics"],
          ["Works on noisy lines", "yes", "Usually, with keypad fallback"],
          ["DIGIRINGO status", "soon", "soon"],
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Route to your AI agent", body: "An AI voice agent from another provider can greet and route callers in its own way.", href: "/product/ai/voice-agent" },
          { title: "Build a TeXML flow", body: "Developers can route a number to a webhook and handle the call in their own code.", href: "/developers" },
          { title: "Use one number per need", body: "Separate numbers for sales and support are the simplest routing there is." },
        ],
      },
      {
        type: "cta",
        title: "See the keypad auto attendant we're building alongside it.",
        button: { label: "Auto attendant", href: "/product/auto-attendant" },
        tone: "dark",
      },
      {
        type: "callout",
        title: "Built on routing that already works",
        body: "The destinations an AI IVR will send callers to, like the app, a cellphone or voicemail, are the same ones per-number routing uses today.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Is AI IVR available?", a: "No. Both keypad and AI menus are in development." },
          { q: "Will callers be able to press keys too?", a: "Yes, we plan to keep keypad options as a fallback." },
          { q: "What languages will it understand?", a: "We'll announce supported languages at launch." },
          { q: "Is this the same as the AI receptionist?", a: "No. AI IVR routes callers. The AI receptionist will also answer questions and take messages." },
        ],
      },
    ],
    related: ["/product/auto-attendant", "/product/ai/receptionist", "/product/menu-routing", "/product/ai"],
  },

  // ───────────────────────────────── /product/ai/call-tagging
  {
    path: "/product/ai/call-tagging",
    title: "Automatic AI call tagging (coming soon) | DIGIRINGO",
    description:
      "AI call tagging is planned for DIGIRINGO: calls labeled by topic, like quote, booking or complaint, so you can sort your history. It's not live yet.",
    crumbs: [PRODUCT, AI],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "AI call tagging",
        h1: "Know what each call was about, at a glance",
        sub: "Call tagging will read what a call covered and add labels like 'new lead', 'quote' or 'billing question' to its entry in your call log.",
        bullets: [
          "Tags added after each call",
          "Your own tag list",
          "Filter your history by tag",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is AI call tagging?",
        paragraphs: [
          "Call tagging adds short labels to calls so you can sort and count them. Done by hand, it rarely happens. AI tagging listens to, or reads a transcript of, the call and picks the tags for you.",
          "Tagging depends on transcripts, which depend on call recording. All three are on our roadmap, which is why this page is marked coming soon.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What tags will help you do",
        cols: 3,
        items: [
          { title: "Find calls fast", icon: "search", status: "soon", body: "Pull up every 'quote request' from last week." },
          { title: "Count what matters", icon: "chart", status: "soon", body: "See how many calls were sales versus support.", href: "/product/analytics" },
          { title: "Spot problems", icon: "bell", status: "soon", body: "Notice when complaints spike." },
        ],
      },
      {
        type: "steps",
        title: "How it will work",
        tone: "tint",
        items: [
          { title: "Turn on recording", body: "Tagging uses the call's recording and transcript.", href: "/product/call-recording" },
          { title: "Pick your tags", body: "Start from a suggested list or write your own." },
          { title: "Review and adjust", body: "Change a tag if the AI got it wrong, and it learns your preferences." },
        ],
      },
      {
        type: "cta",
        title: "Your call log is already keeping the history tags will build on.",
        button: { label: "See call logs", href: "/product/call-analytics/call-logs" },
        tone: "dark",
      },
      {
        type: "callout",
        title: "Tags you can trust",
        body: "Every tag will be editable. If the AI labels a complaint as a sales call, fix it in one tap and move on.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO tag calls today?", a: "No. Call tagging, transcripts and recording are all coming soon." },
          { q: "Will I be able to tag calls manually?", a: "We plan to support manual tags alongside AI suggestions." },
          { q: "Will tagging work for texts?", a: "Calls come first. Tagging SMS conversations is something we're considering." },
          { q: "Will tagging need recording turned on?", a: "Yes. The AI needs the call's content to choose tags, so recording will have to be enabled for that number." },
        ],
      },
    ],
    related: ["/product/call-recording", "/product/analytics", "/features/call-summary", "/product/ai"],
  },

  // ───────────────────────────────── /product/ai/suggested-contacts
  {
    path: "/product/ai/suggested-contacts",
    title: "AI suggested contacts (coming soon) | DIGIRINGO",
    description:
      "Suggested contacts are planned for DIGIRINGO: AI picks up names and companies from calls and texts and offers to save them. Not available yet. Here is the idea.",
    crumbs: [PRODUCT, AI],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Suggested contacts",
        h1: "Stop saving contacts by hand",
        sub: "When a caller says 'Hi, it's Dana from the dental office down the street,' suggested contacts will offer to save Dana's name and business to that number with one tap.",
        bullets: [
          "Names and companies picked up from conversations",
          "You approve every suggestion",
          "Builds on the coming contacts feature",
        ],
        shot: "chat",
      },
      {
        type: "definition",
        title: "What are suggested contacts?",
        paragraphs: [
          "Suggested contacts use AI to spot details people share during calls and texts, like a name, a business or an email address, and propose adding them to the contact record. You decide whether to keep each one.",
          "This needs two things DIGIRINGO doesn't have yet: contact records and call transcripts. It's an early-stage idea on our roadmap, listed here so you know where we're heading.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned behavior",
        cols: 3,
        items: [
          { title: "From texts", icon: "message", status: "soon", body: "Pick up a name someone signs off with." },
          { title: "From calls", icon: "phone", status: "soon", body: "Use the call transcript to find introductions." },
          { title: "Your approval", icon: "check", status: "soon", body: "Nothing is saved until you accept it." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Keep threads by number", body: "Texts are already grouped by each person's number.", href: "/product/messaging" },
          { title: "Check call history", body: "See every call from a number in your log.", href: "/product/call-analytics/call-logs" },
        ],
      },
      {
        type: "cta",
        title: "Follow the CRM work this feature depends on.",
        button: { label: "CRM", href: "/product/crm" },
        tone: "dark",
      },
      {
        type: "callout",
        title: "Suggestions, not surprises",
        body: "Nothing about a caller is saved automatically. Every suggested name or company appears as a prompt you can accept or dismiss.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Is this available?", a: "No. It's planned and depends on contacts and transcripts, which are also coming." },
          { q: "Will it change contacts without asking?", a: "No. Suggestions will always wait for your approval." },
          { q: "Will it work with my phone's contacts?", a: "Importing contacts is planned as part of the CRM feature. We'll share details then." },
          { q: "Is my conversation data used to train AI models?", a: "We'll publish exactly how data is handled before this launches, and it will be optional." },
        ],
      },
    ],
    related: ["/product/crm", "/product/ai/call-tagging", "/product/assistant", "/product/ai"],
  },

  // ───────────────────────────────── /product/ai/mcp
  {
    path: "/product/ai/mcp",
    title: "DIGIRINGO MCP server (coming soon) | DIGIRINGO",
    description:
      "A DIGIRINGO MCP server is planned so AI assistants can read your call log and draft texts with your approval. Not live yet. Today, use webhook routing.",
    crumbs: [PRODUCT, AI],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "MCP",
        h1: "Connect your AI assistant to your phone line",
        sub: "We're planning an MCP server for DIGIRINGO, so assistants that support the Model Context Protocol can look up calls and conversations on your account and prepare texts for you to approve.",
        bullets: [
          "Works with MCP-capable AI assistants",
          "Read access to calls and messages you allow",
          "Sending always needs your approval",
        ],
        shot: "activity",
      },
      {
        type: "definition",
        title: "What is MCP?",
        paragraphs: [
          "MCP, the Model Context Protocol, is an open standard for connecting AI assistants to outside tools and data. An app publishes an MCP server, and any compatible assistant can use it, with the user's permission, to look things up or take actions.",
          "A DIGIRINGO MCP server would let you ask your assistant things like 'who called this morning?' or 'draft a reply to the last text from this number,' without copying and pasting between apps.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned tools",
        cols: 2,
        items: [
          { title: "Look up call history", icon: "list", status: "soon", body: "Recent, missed and past calls by number or date." },
          { title: "Read conversations", icon: "messages", status: "soon", body: "SMS threads on your business numbers." },
          { title: "Draft texts", icon: "send", status: "soon", body: "Prepare a message for you to review before it goes out." },
          { title: "Check your numbers", icon: "hash", status: "soon", body: "List numbers and how each one is routed." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Use webhook routing", body: "Send a number's calls to your own TeXML app for full control of the call.", href: "/developers" },
          { title: "Route to an AI agent", body: "Let an AI voice agent answer a number's calls over SIP.", href: "/ai-agent" },
        ],
      },
      {
        type: "callout",
        title: "Permissions first",
        body: "The MCP server will use access you grant and can revoke at any time. Actions that contact customers will need your confirmation.",
        tone: "dark",
      },
      {
        type: "callout",
        title: "Why MCP and not just an API",
        body: "An API is for developers writing code. MCP lets the AI assistant you already use talk to DIGIRINGO directly, so non-developers can ask questions about their phone line in plain language.",
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Is the MCP server live?", a: "No. It's planned. A full public REST API is also on the roadmap." },
          { q: "Which assistants will work with it?", a: "Any assistant or app that supports MCP servers. We'll publish setup steps at launch." },
          { q: "Will it be able to place calls?", a: "We're starting with read access and drafting texts. Anything that contacts customers will need your approval." },
          { q: "Is there an API I can use now?", a: "Not a general API yet. Per-number webhook routing with TeXML and SIP routing are available today." },
        ],
      },
    ],
    related: ["/developers", "/product/assistant", "/integrations", "/product/ai"],
  },

  // ───────────────────────────────── /ai-agent
  {
    path: "/ai-agent",
    title: "Bring your AI agent to a real number | DIGIRINGO",
    description:
      "Already use an AI phone agent? Route any DIGIRINGO number's calls to it over SIP or a TeXML webhook today, in beta. A built-in DIGIRINGO agent is coming soon.",
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "Bring your AI agent",
        h1: "Your AI agent answers. DIGIRINGO handles the phone number.",
        sub: "Buy a number in minutes, point it at the AI voice agent you already use, and every call to that number goes to your agent. No phone carrier contracts, no seat fees.",
        bullets: [
          "Route by SIP URI or by TeXML webhook",
          "Local, toll-free and international numbers",
          "Voicemail backup if your SIP agent doesn't answer",
        ],
        shot: "settings",
        primary: { label: "Get your number", href: "/app" },
        secondary: { label: "See pricing", href: "/pricing" },
      },
      {
        type: "definition",
        title: "What does 'bring your AI agent' mean?",
        paragraphs: [
          "AI voice platforms let you build an agent that talks on the phone. Getting that agent a number customers can call is often the fiddly part. DIGIRINGO is a phone provider with per-number routing, so you can give the agent a real business line and keep control of it.",
          "We call it 'bring your own' because DIGIRINGO doesn't build the agent today. You choose the AI provider. We deliver the calls. A DIGIRINGO-built agent is coming for people who'd rather not set one up.",
        ],
        tone: "tint",
      },
      {
        type: "tabs",
        title: "Two ways to connect",
        tabs: [
          {
            name: "SIP agent",
            items: [
              { title: "Best for hosted AI agents", icon: "bot", status: "beta", body: "Most AI voice platforms give you a SIP address for your agent." },
              { title: "Paste the SIP URI", icon: "plug", status: "beta", body: "Choose 'Connect to my agent (SIP)' and enter something like sip:agent@your-domain.com." },
              { title: "Calls are dialed to it", icon: "phone-forwarded", status: "beta", body: "Each incoming call on that number is sent to the agent." },
              { title: "Voicemail fallback", icon: "voicemail", status: "live", body: "If the agent doesn't answer, the caller can leave a voicemail." },
            ],
          },
          {
            name: "Webhook (TeXML)",
            items: [
              { title: "Best for your own code", icon: "code", status: "beta", body: "Run your own caller agent or call logic on your server." },
              { title: "Enter an HTTPS URL", icon: "webhook", status: "beta", body: "Choose 'Send to my app (webhook)' and add your endpoint." },
              { title: "Return TeXML", icon: "file", status: "beta", body: "When a call arrives, your URL is asked for instructions and replies in TeXML." },
              { title: "You control the call", icon: "settings", status: "beta", body: "Play audio, gather keypresses, or dial the call onward to your agent." },
            ],
          },
          {
            name: "Coming soon",
            items: [
              { title: "Built-in DIGIRINGO agent", icon: "sparkles", status: "soon", href: "/product/ai/receptionist", body: "An AI receptionist you set up without code." },
              { title: "Call summaries in the app", icon: "list", status: "soon", body: "A recap of each AI-handled call in your log." },
              { title: "Hand-off to you", icon: "phone-incoming", status: "soon", body: "Let the agent pass a caller to a person." },
              { title: "Schedules", icon: "clock", status: "soon", body: "Switch routes automatically by business hours." },
            ],
          },
        ],
      },
      {
        type: "steps",
        title: "Set it up in four steps",
        tone: "tint",
        items: [
          { title: "Create your DIGIRINGO account", body: "Sign up at digiringo.com/app and add $5 or more to your wallet." },
          { title: "Buy a number", body: "Pick a local, toll-free or international number. A US local number is $2.50 a month." },
          { title: "Set the route", body: "Open the number, choose SIP or webhook, paste your agent's address and save." },
          { title: "Place a test call", body: "Call the number from your cellphone and talk to your agent." },
        ],
      },
      {
        type: "table",
        title: "What it costs on DIGIRINGO",
        head: ["Item", "Price"],
        rows: [
          ["US local number", "$2.50 / month"],
          ["Toll-free number", "From $2.50 / month"],
          ["Calls in the US and Canada", "$0.015 / minute"],
          ["International numbers and calls", "Varies by country, see the rate list"],
          ["Using the SIP or webhook route", "No extra fee"],
        ],
        note: "Your AI provider charges separately for their agent. DIGIRINGO has no contracts or per-user fees.",
      },
      {
        type: "callout",
        title: "Honest status: beta",
        body: "Per-number SIP and webhook routing works today. It's labeled beta because it's new and we're still improving setup help and diagnostics. If something doesn't connect, our live chat support in the app can help.",
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO provide the AI?", a: "Not today. You bring an agent from the AI provider of your choice. DIGIRINGO's own AI receptionist is coming soon." },
          { q: "Can I route only some numbers to the agent?", a: "Yes. Routing is per number. Keep one line ringing in the app and send another to your agent." },
          { q: "Can my agent make outbound calls on my number?", a: "Not through DIGIRINGO today. Routing covers incoming calls." },
          { q: "What happens if my agent's server is down?", a: "With SIP routing, an unanswered call falls back to voicemail. With webhook routing, make sure your endpoint is reliable, because your app controls the call." },
          { q: "Can I switch back to answering myself?", a: "Yes. Change the number's route back to the app at any time." },
          { q: "Does it work with international numbers?", a: "Yes, routing works on any DIGIRINGO number. Some countries need ID or address documents before the number is active." },
        ],
      },
    ],
    related: ["/product/ai", "/product/ai/voice-agent", "/developers", "/product/call-routing"],
  },
];
