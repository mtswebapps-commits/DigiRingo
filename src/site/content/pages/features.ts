import type { PageDoc, LinkRef } from "../types";

const FEATURES: LinkRef = { label: "Features", href: "/features" };
const PHONE_NUMBERS: LinkRef = { label: "Phone numbers", href: "/phone-numbers" };
const TEMPLATES: LinkRef = { label: "Templates", href: "/templates" };
const SKILLS: LinkRef = { label: "Skills", href: "/skills" };
const GET_NUMBER: LinkRef = { label: "Get your number", href: "/app" };
const SEE_PRICING: LinkRef = { label: "See pricing", href: "/pricing" };

const FEATURE_PAGES: PageDoc[] = [
  // ───────────────────────────── /features ─────────────────────────────
  {
    path: "/features",
    title: "Business Phone Features | DIGIRINGO",
    description:
      "Every DIGIRINGO feature in one place: business numbers, browser and Android calling, SMS, forwarding, routing and voicemail, with clear labels on what's coming.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Features",
        h1: "Everything DIGIRINGO does, and what's next",
        sub: "A short tour of the phone system: what works today, what's in beta, and what we're still building. Each card links to a page with the details.",
        bullets: [
          "Calls and texts from your browser or Android phone",
          "Pay-as-you-go: $0.015/min and $0.015/text in the US and Canada",
          "Clear 'coming soon' labels, so you know what you're buying",
        ],
        shot: "home",
      },
      {
        type: "cards",
        eyebrow: "Live today",
        title: "Core phone system",
        intro: "The parts of DIGIRINGO you can sign up and use right now.",
        cols: 3,
        items: [
          { title: "VoIP phone system", body: "A complete business line that runs over the internet.", icon: "phone", href: "/features/voip-phone-system", status: "live" },
          { title: "Cloud VoIP", body: "Nothing to install. Your number lives in the cloud and follows you.", icon: "globe", href: "/features/cloud-voip", status: "live" },
          { title: "Small business VoIP", body: "One number or a handful, priced for small teams.", icon: "store", href: "/features/small-business-voip", status: "live" },
          { title: "Inbound call software", body: "Ring every device, route by number, forward to a cell.", icon: "phone-incoming", href: "/features/inbound-call-software", status: "live" },
          { title: "Low-cost calling", body: "$0.015/min across the US and Canada. No seat fees.", icon: "dollar", href: "/features/unlimited-calls", status: "live" },
          { title: "Business SMS", body: "Two-way texting with threads and delivery receipts.", icon: "message", href: "/features/business-sms-mms", status: "live" },
        ],
      },
      {
        type: "cards",
        eyebrow: "Beta",
        title: "Working, still being polished",
        cols: 2,
        tone: "tint",
        items: [
          { title: "Missed call service", body: "Unanswered calls go to your cellphone, then voicemail.", icon: "phone-missed", href: "/features/missed-call-service", status: "beta" },
          { title: "Callback service", body: "Return a call from your history in one tap.", icon: "refresh", href: "/features/callback-service", status: "beta" },
        ],
      },
      {
        type: "cards",
        eyebrow: "On the roadmap",
        title: "Coming soon",
        intro: "These are planned but not available yet. Ask to be notified and we'll email you when they ship.",
        cols: 4,
        items: [
          { title: "Ring groups", icon: "users", href: "/features/ring-groups", status: "soon" },
          { title: "Call summaries", icon: "sparkles", href: "/features/call-summary", status: "soon" },
          { title: "Call transcriptions", icon: "file", href: "/features/call-transcriptions", status: "soon" },
          { title: "Voicemail to text", icon: "voicemail", href: "/features/voicemail-to-text", status: "soon" },
          { title: "CRM with texting", icon: "list", href: "/features/crm-with-text-messaging", status: "soon" },
          { title: "Slack calling alerts", icon: "plug", href: "/features/slack-voip", status: "soon" },
          { title: "Reply suggestions", icon: "bot", href: "/features/text-message-response-generator", status: "soon" },
          { title: "Post-call automation", icon: "zap", href: "/features/post-call-automation", status: "soon" },
          { title: "Hold music", icon: "music", href: "/features/hold-music", status: "soon" },
          { title: "Self-service IVR", icon: "git-branch", href: "/features/self-service-ivr", status: "soon" },
        ],
      },
      {
        type: "cards",
        title: "Numbers and getting started",
        cols: 4,
        tone: "plain",
        items: [
          { title: "Phone numbers", icon: "hash", href: "/phone-numbers", status: "live" },
          { title: "Vanity search", icon: "search", href: "/vanity-number", status: "live" },
          { title: "Downloads", icon: "smartphone", href: "/downloads", status: "live" },
          { title: "Call-flow templates", icon: "route", href: "/templates", status: "live" },
        ],
      },
      {
        type: "callout",
        title: "Our labeling promise",
        body: "If a feature says 'coming soon', it doesn't work yet, and we won't charge you for it. 'Beta' means it works today but may change as we improve it.",
        tone: "dark",
      },
      { type: "cta", title: "Start with one number and add the rest when you need it.", button: GET_NUMBER },
      {
        type: "faq",
        items: [
          { q: "Do I need a plan to use these features?", a: "No. You pay for your number each month and for the minutes and texts you use. Live features are included at no extra charge." },
          { q: "Is there an iPhone app?", a: "Not yet. iPhone users can use the full web app in Safari, and add it to the home screen." },
          { q: "How do I find out when a 'soon' feature launches?", a: "Open the feature's page and click 'Get notified'. We'll send one email when it's ready." },
          { q: "Are features charged per user?", a: "No. DIGIRINGO has no per-user or seat fees." },
        ],
      },
    ],
    related: ["/product", "/pricing", "/phone-numbers", "/downloads"],
  },

  // ───────────────────────── /features/voip-phone-system ─────────────────────────
  {
    path: "/features/voip-phone-system",
    title: "VoIP Phone System for Business | DIGIRINGO",
    description:
      "Run your business line over the internet. DIGIRINGO gives you a real number, calls from the browser or Android, two-way SMS and forwarding, with no contract.",
    crumbs: [FEATURES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "VoIP phone system",
        h1: "A business phone system that runs on the internet",
        sub: "Get a US, Canadian or international number and make calls from your laptop or Android phone. No desk phones, no wiring, no contract.",
        bullets: [
          "Local, toll-free and international numbers",
          "Calls, texts and voicemail in one app",
          "US local number for $2.50/month",
        ],
        shot: "dialer",
      },
      {
        type: "definition",
        title: "What is a VoIP phone system?",
        paragraphs: [
          "VoIP stands for Voice over Internet Protocol. Instead of a copper phone line, your voice travels as data over any internet connection: office Wi-Fi, home broadband or mobile data.",
          "A VoIP phone system adds the business parts on top: a dedicated number, caller ID, routing rules, voicemail and texting. With DIGIRINGO, all of that sits in an app you open in a browser or on Android.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Why small businesses switch to VoIP",
        cols: 3,
        items: [
          { title: "No hardware", body: "Your laptop and phone are the desk phone. Nothing to buy or rack.", icon: "laptop" },
          { title: "Works anywhere", body: "Take calls on the same number from the office, home or the road.", icon: "globe" },
          { title: "Predictable cost", body: "$0.015/min for US and Canada calls, billed from a prepaid wallet.", icon: "wallet" },
        ],
      },
      {
        type: "flex",
        title: "What's inside",
        rows: [
          { title: "Calls in the browser and on Android", body: "Dial out with your business caller ID and answer incoming calls on whichever device is in front of you.", shot: "dialer", icon: "phone-call" },
          { title: "One inbox for texts", body: "Two-way SMS threads per number with delivery receipts. US texting requires a quick 10DLC registration, handled in the built-in Trust Center.", shot: "inbox", icon: "messages" },
          { title: "Your numbers, your rules", body: "Choose per number whether calls ring the app, forward to a cellphone, go to a SIP agent, or hit your own webhook.", shot: "numbers", icon: "route" },
        ],
      },
      {
        type: "steps",
        title: "How to set up a VoIP phone system in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Create an account", body: "Sign up at digiringo.com/app with email or Google." },
          { title: "Top up your wallet", body: "Add $5, $10, $20 or $50 by card." },
          { title: "Pick a number", body: "Search by country, area code or digits and buy it in a click." },
          { title: "Start calling", body: "Allow microphone access and dial. Install the Android app to take calls on the go." },
        ],
      },
      {
        type: "table",
        title: "VoIP vs a traditional landline",
        head: ["", "DIGIRINGO VoIP", "Landline"],
        rows: [
          ["Works from any location", "yes", "no"],
          ["Answer on laptop and phone", "yes", "no"],
          ["Business texting", "yes", "no"],
          ["Install visit needed", "no", "yes"],
          ["Long-term contract", "no", "Often"],
          ["Phone menu (IVR)", "soon", "Extra hardware"],
        ],
      },
      { type: "cta", title: "Get a business line today and keep your personal number private.", button: GET_NUMBER, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "What internet speed do I need?", a: "A stable connection of about 100 kbps per call in each direction is enough. Wired or strong Wi-Fi gives the most consistent quality." },
          { q: "Can I keep my existing number?", a: "Number porting is coming soon. For now, you can get a new number and forward your old one to it through your current carrier." },
          { q: "Does it work for international calls?", a: "Yes. You can call 220+ countries. Each country has its own per-minute rate, listed on our rates page." },
          { q: "Is there a phone menu or auto-attendant?", a: "Not yet. Phone menus are on the roadmap. Today you can route each number to the app, a cellphone, a SIP agent or a webhook." },
          { q: "What if my internet drops?", a: "Unanswered calls forward to your cellphone after about 30 seconds, and voicemail picks up if nobody answers." },
        ],
      },
    ],
    related: ["/features/cloud-voip", "/features/small-business-voip", "/product/virtual-phone-system", "/blog/how-voip-calling-works"],
  },

  // ───────────────────────── /features/cloud-voip ─────────────────────────
  {
    path: "/features/cloud-voip",
    title: "Cloud VoIP Calling, Nothing to Install | DIGIRINGO",
    description:
      "Cloud VoIP with DIGIRINGO: your number and settings live online, so you can call and text from any browser or your Android phone. Pay only for what you use.",
    crumbs: [FEATURES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Cloud VoIP",
        h1: "Your phone line, hosted in the cloud",
        sub: "Sign in from any computer and your number, call history and texts are already there. No servers, no PBX box, no IT ticket.",
        bullets: [
          "Open the web app and call within minutes",
          "Settings sync across browser and Android",
          "No equipment to maintain or replace",
        ],
        shot: "home",
      },
      {
        type: "definition",
        title: "What is cloud VoIP?",
        paragraphs: [
          "Older office phone systems ran on a box in a closet, called a PBX. Cloud VoIP moves that box to a provider's data center. You reach it over the internet and the provider keeps it running.",
          "In practice this means your phone system is just an account. Log in on a new laptop and you're ready. Lose your phone and your number is still safe. Changes to routing take effect right away for everyone.",
        ],
      },
      {
        type: "cards",
        title: "What cloud hosting gives you",
        cols: 4,
        tone: "tint",
        items: [
          { title: "Instant setup", body: "Buy a number and it's ready to use.", icon: "zap" },
          { title: "Any device", body: "Chrome, Edge, Firefox, Safari or Android.", icon: "monitor" },
          { title: "Always updated", body: "New features arrive without downloads on the web.", icon: "refresh" },
          { title: "Carrier network", body: "Calls run on a carrier-grade voice network.", icon: "shield" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "Same history everywhere", body: "Calls you made from the laptop show up on your phone, and the other way around. Each user sees their own call log.", shot: "calls", icon: "list" },
          { title: "Notifications in the background", body: "Incoming calls trigger a push notification even when the browser tab is minimized, so you don't have to keep it in front.", shot: "activity", icon: "bell" },
        ],
      },
      {
        type: "steps",
        title: "How to move to cloud VoIP",
        tone: "tint",
        items: [
          { title: "Sign up online", body: "Open digiringo.com/app. No sales call needed." },
          { title: "Choose your number", body: "Local, toll-free, or a number in another country." },
          { title: "Point your old line", body: "Forward your old number to the new one while porting is still on our roadmap." },
        ],
      },
      { type: "cta", title: "See what a cloud number costs before you sign up.", button: SEE_PRICING },
      {
        type: "faq",
        items: [
          { q: "Is cloud VoIP the same as a virtual number?", a: "Close. A virtual number is a number not tied to a physical line. Cloud VoIP is the full system around it: calling, routing, voicemail and texting." },
          { q: "Do I need a desktop app?", a: "No. The web app runs in your browser. A separate desktop app is on our roadmap." },
          { q: "Where is my data stored?", a: "Your account data is stored on our servers and calls are carried by our carrier partner. See our security page for details." },
          { q: "Can I use it on more than one computer?", a: "Yes. Sign in on as many browsers as you like. Incoming calls ring all of them at once." },
        ],
      },
    ],
    related: ["/features/voip-phone-system", "/downloads", "/security", "/product/calling/call-from-browser"],
  },

  // ───────────────────────── /features/small-business-voip ─────────────────────────
  {
    path: "/features/small-business-voip",
    title: "Small Business VoIP Without Seat Fees | DIGIRINGO",
    description:
      "VoIP built for small businesses: a $2.50/month number, low per-minute rates, texting and forwarding to your cell. No seat fees, no contracts, cancel anytime.",
    crumbs: [FEATURES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Small business VoIP",
        h1: "A phone line sized for a small business",
        sub: "You don't need a twelve-seat plan to look professional. Get one number, answer it on your phone, and pay for the minutes you actually use.",
        bullets: [
          "No per-user or seat fees",
          "Prepaid wallet keeps spending in check",
          "Separate work calls from your personal number",
        ],
        shot: "wallet",
      },
      {
        type: "definition",
        title: "What makes VoIP a fit for small businesses?",
        paragraphs: [
          "Most small businesses start with the owner's cellphone. It works until you're on a job site, on vacation or simply off the clock, and every call still comes to you.",
          "A small business VoIP line gives you a separate number that can ring your phone when you want it to and go to voicemail when you don't. Because it's software, it costs a fraction of a traditional line and grows with you one number at a time.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Built around how small teams work",
        cols: 3,
        items: [
          { title: "Pay as you go", body: "Top up $5 to $50 at a time. Calls in the US and Canada are $0.015/min.", icon: "wallet" },
          { title: "Forward to your cell", body: "If you don't pick up in the app within about 30 seconds, the call goes to your phone.", icon: "phone-forwarded" },
          { title: "Text customers", body: "Confirm appointments and answer questions by SMS from the business number.", icon: "message" },
        ],
      },
      {
        type: "table",
        title: "What a small setup might cost",
        intro: "Example for one US local number. Your usage will differ.",
        head: ["Item", "Price"],
        rows: [
          ["US local number", "$2.50/month"],
          ["300 minutes of US/Canada calls", "$4.50"],
          ["200 US/Canada texts", "$3.00"],
          ["Seat or user fees", "$0"],
        ],
        note: "10DLC carrier registration fees for US texting are passed through at cost.",
        tone: "tint",
      },
      {
        type: "steps",
        title: "How to get started",
        items: [
          { title: "Sign up", body: "Create an account in the web app." },
          { title: "Add funds", body: "Start with as little as $5." },
          { title: "Buy a local number", body: "Pick an area code your customers recognize." },
          { title: "Register for texting", body: "Use the Trust Center to complete 10DLC if you'll text US customers." },
        ],
      },
      { type: "cta", title: "Try it with one number for $2.50 a month.", button: GET_NUMBER, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Can my employees have their own logins?", a: "Multi-user team seats and roles are coming soon. Today each account is used by one person, though you can sign in on several devices." },
          { q: "What happens when my wallet runs low?", a: "You'll see your balance in the app. Top up any time by card in $5, $10, $20 or $50 amounts." },
          { q: "Can I get a number in a different city?", a: "Yes. Choose any available US or Canadian area code, regardless of where you live." },
          { q: "Is there a contract?", a: "No. You can release a number whenever you like." },
        ],
      },
    ],
    related: ["/features/unlimited-calls", "/phone-numbers/multiple-phone-lines", "/pricing", "/blog/set-up-small-business-phone-system"],
  },

  // ───────────────────────── /features/inbound-call-software ─────────────────────────
  {
    path: "/features/inbound-call-software",
    title: "Inbound Call Software for Small Teams | DIGIRINGO",
    description:
      "Handle incoming calls with DIGIRINGO: every device rings at once, unanswered calls forward to your cell, and each number can route to an agent or webhook.",
    crumbs: [FEATURES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Inbound call software",
        h1: "Answer more of the calls that come in",
        sub: "Decide where each number's calls go, ring every device you're signed in on, and fall back to your cellphone or voicemail when you're busy.",
        bullets: [
          "Simultaneous ring on browser and Android",
          "Per-number routing: app, phone, SIP agent or webhook",
          "Push notifications when the tab is in the background",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is inbound call software?",
        paragraphs: [
          "Inbound call software controls what happens after someone dials your number. It decides which devices ring, how long they ring, and where the call goes if nobody picks up.",
          "For a small business, the goal is simple: a real person answers whenever possible, and the caller is never left listening to endless ringing.",
        ],
      },
      {
        type: "flex",
        title: "How incoming calls flow",
        tone: "tint",
        rows: [
          { title: "1. Every device rings", body: "Your browser tabs and Android app ring together. Answer wherever you are; the others stop.", shot: "home", icon: "phone-incoming" },
          { title: "2. Then your cellphone", body: "If nobody answers in about 30 seconds, DIGIRINGO forwards the call to the cellphone you set.", shot: "settings", icon: "phone-forwarded" },
          { title: "3. Then voicemail", body: "Still no answer? The caller hears a standard greeting and can leave a message.", shot: "activity", icon: "voicemail" },
        ],
      },
      {
        type: "tabs",
        title: "Routing options per number",
        tabs: [
          {
            name: "Live today",
            items: [
              { title: "Ring the app", body: "Default. Rings every signed-in device.", icon: "smartphone", status: "live" },
              { title: "Forward to a phone", body: "Send calls straight to any cellphone or landline.", icon: "phone-forwarded", status: "live" },
              { title: "SIP or AI agent", body: "Hand calls to a SIP endpoint such as your own voice agent.", icon: "bot", status: "beta" },
              { title: "Your webhook", body: "Return TeXML instructions from your server to control the call.", icon: "webhook", status: "beta" },
            ],
          },
          {
            name: "Coming soon",
            items: [
              { title: "Phone menus (IVR)", icon: "git-branch", status: "soon" },
              { title: "Business-hours routing", icon: "clock", status: "soon" },
              { title: "Ring groups for teams", icon: "users", status: "soon" },
              { title: "Call transfer", icon: "repeat", status: "soon" },
            ],
          },
        ],
      },
      {
        type: "steps",
        title: "How to set up inbound routing",
        tone: "tint",
        items: [
          { title: "Open Numbers", body: "Pick the number you want to configure." },
          { title: "Choose a route", body: "App, phone, SIP agent or webhook." },
          { title: "Add your cellphone", body: "Set the forwarding number for unanswered calls." },
        ],
      },
      { type: "cta", title: "Stop losing calls to voicemail you never check.", button: GET_NUMBER },
      {
        type: "faq",
        items: [
          { q: "Can I change how long the app rings before forwarding?", a: "Not yet. The app rings for about 30 seconds before forwarding. Custom timing is planned along with business-hours routing." },
          { q: "Do I pay for forwarded calls?", a: "Yes, forwarding uses minutes. A forward to a US or Canadian phone costs the standard $0.015/min." },
          { q: "Can two people answer the same number?", a: "Shared numbers and ring groups for teams are coming soon. Today, every device signed in to your account rings." },
          { q: "Does it work if my browser is minimized?", a: "Yes. You'll get a push notification once you've allowed notifications for the site." },
        ],
      },
    ],
    related: ["/product/call-routing", "/product/call-routing/simultaneous-ring", "/features/missed-call-service", "/product/call-forwarding"],
  },

  // ───────────────────────── /features/unlimited-calls ─────────────────────────
  {
    path: "/features/unlimited-calls",
    title: "Low-Cost Business Calling, $0.015/min | DIGIRINGO",
    description:
      "DIGIRINGO doesn't sell unlimited plans. You get honest pay-as-you-go calling: $0.015/min in the US and Canada, no seat fees and no contract to lock you in.",
    crumbs: [FEATURES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Low-cost calling",
        h1: "Not unlimited. Just inexpensive.",
        sub: "Many 'unlimited' plans hide fair-use caps and per-seat fees. We charge a flat $0.015 per minute for US and Canada calls and let you see every cent.",
        bullets: [
          "$0.015/min to and from the US and Canada",
          "No seat fees, no monthly plan",
          "Prepaid wallet, so no surprise bills",
        ],
        shot: "wallet",
      },
      {
        type: "definition",
        title: "Why we don't offer unlimited calling",
        paragraphs: [
          "Unlimited plans are priced for the heaviest user. If you make a few hundred minutes of calls a month, you're often paying for thousands you never use, multiplied by every seat on the account.",
          "Pay-as-you-go flips that. You pay for your number and the minutes you actually talk. For most small businesses, that adds up to a few dollars a month.",
        ],
        tone: "tint",
      },
      {
        type: "table",
        title: "What calls cost",
        head: ["Usage", "Cost at $0.015/min"],
        rows: [
          ["100 minutes", "$1.50"],
          ["500 minutes", "$7.50"],
          ["1,000 minutes", "$15.00"],
          ["2,000 minutes", "$30.00"],
        ],
        note: "US and Canada. International rates vary by country; see the rate list.",
      },
      {
        type: "cards",
        title: "Where your money goes",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Your number", body: "$2.50/month for a US local number. Toll-free from $2.50/month.", icon: "hash" },
          { title: "Minutes", body: "Billed per minute from your wallet, inbound and outbound.", icon: "clock" },
          { title: "Nothing else", body: "No seat fees, no setup fee, no cancellation fee.", icon: "check" },
        ],
      },
      {
        type: "steps",
        title: "How to estimate your bill",
        items: [
          { title: "Count your monthly minutes", body: "Check last month's phone bill or call log." },
          { title: "Multiply by $0.015", body: "Or use our VoIP calculator for a quick estimate." },
          { title: "Add your numbers", body: "$2.50 for each US local number." },
        ],
      },
      { type: "cta", title: "Run your numbers through the calculator.", button: { label: "Open VoIP calculator", href: "/tools/voip-calculator" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Is DIGIRINGO cheaper than an unlimited plan?", a: "For light and moderate callers, usually yes. If you talk thousands of minutes a month on many seats, compare the totals with the calculator." },
          { q: "Are incoming calls billed?", a: "Yes, incoming calls use minutes at the published rate for your number type." },
          { q: "What about international calls?", a: "They're billed per minute at the country's rate. You can see each rate in the app before you dial." },
          { q: "Can I set a spending limit?", a: "The prepaid wallet is the limit. You can only spend what you've topped up." },
        ],
      },
    ],
    related: ["/pricing", "/rates", "/tools/voip-calculator", "/features/small-business-voip"],
  },

  // ───────────────────────── /features/missed-call-service ─────────────────────────
  {
    path: "/features/missed-call-service",
    title: "Missed Call Service: Forward & Voicemail | DIGIRINGO",
    description:
      "Catch calls you'd otherwise miss. DIGIRINGO rings your devices, forwards unanswered calls to your cellphone after about 30 seconds, then takes a voicemail.",
    crumbs: [FEATURES],
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "Missed call service",
        h1: "Fewer missed calls, without hiring anyone",
        sub: "When you can't get to the app, DIGIRINGO tries your cellphone next. If that doesn't work either, the caller leaves a voicemail instead of hanging up.",
        bullets: [
          "Rings all your devices first",
          "Forwards to your cellphone after about 30 seconds",
          "Voicemail as the last safety net",
        ],
        shot: "activity",
      },
      {
        type: "definition",
        title: "What is a missed call service?",
        paragraphs: [
          "A missed call service is a set of fallbacks that kick in when nobody answers. Instead of ringing out, the call moves on to the next person, device or option.",
          "In DIGIRINGO this is built in and in beta: the app rings, then your cellphone, then voicemail. More options, like texting the caller back automatically, are on the roadmap.",
        ],
      },
      {
        type: "steps",
        title: "How to set it up",
        tone: "tint",
        items: [
          { title: "Install the Android app or open the web app", body: "Sign in on every device you want to ring." },
          { title: "Add a forwarding number", body: "Enter the cellphone that should get unanswered calls." },
          { title: "Allow notifications", body: "So the browser can alert you even when the tab is hidden." },
        ],
      },
      {
        type: "cards",
        title: "What's working and what's next",
        cols: 3,
        items: [
          { title: "Simultaneous ring", body: "Browser and Android ring together.", icon: "phone-incoming", status: "live" },
          { title: "Forward to cell", body: "Unanswered calls go to your phone.", icon: "phone-forwarded", status: "beta" },
          { title: "Voicemail", body: "Recorded with a standard greeting.", icon: "voicemail", status: "beta" },
          { title: "Missed-call text back", body: "Auto-text the caller when you miss them.", icon: "message", status: "soon" },
          { title: "Voicemail to text", body: "Read messages instead of listening.", icon: "file", status: "soon" },
          { title: "Custom greetings", body: "Record your own voicemail greeting.", icon: "mic", status: "soon" },
        ],
      },
      { type: "cta", title: "Find out what missed calls are costing you.", button: { label: "Missed-call cost calculator", href: "/tools/missed-call-cost-calculator" }, tone: "dark" },
      { type: "callout", title: "Why the order matters", body: "Ringing the app first keeps calls on your business line. Forwarding to your cell is the backup, and voicemail is the net under both. Each step only runs if the one before it wasn't answered.", tone: "tint" },
      {
        type: "faq",
        items: [
          { q: "Why is this in beta?", a: "Forwarding and voicemail work today. We're still finishing the voicemail playback screen and adding custom timing, so details may change." },
          { q: "Do forwarded calls show my business number?", a: "Forwarded calls arrive on your cellphone like a normal incoming call. Treat any call from an unknown number as possibly a business call." },
          { q: "Can I skip the app and always forward?", a: "Yes. Set the number's route to 'forward to a phone' and calls go straight to your cell." },
          { q: "Does the missed call get logged?", a: "Yes. It appears in your call history so you can call back." },
        ],
      },
    ],
    related: ["/product/call-management/never-miss-a-call", "/features/callback-service", "/product/voicemail", "/blog/missed-call-text-back"],
  },

  // ───────────────────────── /features/business-sms-mms ─────────────────────────
  {
    path: "/features/business-sms-mms",
    title: "Business SMS Texting (MMS Soon) | DIGIRINGO",
    description:
      "Text customers from your business number. Two-way SMS with threads and delivery receipts, 10DLC registration built in. Picture messages (MMS) are coming soon.",
    crumbs: [FEATURES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Business SMS",
        h1: "Text customers from your business number",
        sub: "Send and receive SMS from the web app or your Android phone. Conversations stay grouped by number, so nothing gets lost in your personal texts.",
        bullets: [
          "$0.015 per message in the US and Canada",
          "Delivery receipts on every text",
          "Guided 10DLC registration in the Trust Center",
        ],
        shot: "chat",
      },
      {
        type: "definition",
        title: "What's the difference between SMS and MMS?",
        paragraphs: [
          "SMS is plain text, up to 160 characters per segment. It works on every phone and is what most appointment reminders and quick replies use.",
          "MMS adds pictures, video and longer messages. DIGIRINGO supports SMS today. MMS and group texting are on the roadmap and marked 'coming soon' below.",
        ],
        tone: "tint",
      },
      {
        type: "flex",
        rows: [
          { title: "Threads per number", body: "Each contact gets one conversation per business number, so you always know which line a customer texted.", shot: "inbox", icon: "messages" },
          { title: "Know it arrived", body: "Delivery receipts show whether the carrier delivered each message.", shot: "chat", icon: "check" },
          { title: "Register once", body: "Carriers require US business texters to register a brand and campaign (10DLC). Our Trust Center walks you through it; approval usually takes 1 to 7 days.", shot: "settings", icon: "shield" },
        ],
      },
      {
        type: "cards",
        title: "Texting features",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Two-way SMS", icon: "message", status: "live" },
          { title: "Delivery receipts", icon: "check", status: "live" },
          { title: "International SMS", body: "Where the number supports it.", icon: "globe", status: "live" },
          { title: "MMS / picture messages", icon: "file", status: "soon" },
          { title: "Group texting", icon: "users", status: "soon" },
          { title: "Scheduled messages", icon: "calendar", status: "soon" },
          { title: "Auto-replies", icon: "zap", status: "soon" },
          { title: "Saved snippets", icon: "list", status: "soon" },
          { title: "Toll-free texting", icon: "hash", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "How to start texting in DIGIRINGO",
        items: [
          { title: "Buy a US or Canadian number", body: "Local numbers support SMS." },
          { title: "Open the Trust Center", body: "Submit your business details and a campaign description." },
          { title: "Wait for approval", body: "Carriers usually approve in 1 to 7 days. Fees are passed through at cost." },
          { title: "Send your first text", body: "Open Inbox, start a new message and hit send." },
        ],
      },
      { type: "cta", title: "Get a textable business number.", button: GET_NUMBER, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Why do I need 10DLC registration?", a: "US carriers block or filter unregistered business texts sent from local numbers. Registration tells them who you are and what you send." },
          { q: "Can I text from a toll-free number?", a: "Not yet. Toll-free numbers are voice-only in DIGIRINGO today; toll-free texting verification is coming soon." },
          { q: "When will MMS be available?", a: "It's on the roadmap but has no date yet. Click 'Get notified' on the messaging pages to hear when it ships." },
          { q: "What does a text cost?", a: "$0.015 per SMS segment in the US and Canada. International SMS varies by country." },
        ],
      },
    ],
    related: ["/product/messaging/two-way-sms", "/product/messaging/group-texting", "/blog/sms-vs-mms-business", "/blog/what-is-a2p-10dlc"],
  },

  // ───────────────────────── /features/callback-service ─────────────────────────
  {
    path: "/features/callback-service",
    title: "Callback Service: Return Calls Fast | DIGIRINGO",
    description:
      "Missed someone? Call them back from your DIGIRINGO call history in one tap, from the same business number they dialed. Works in the browser and on Android.",
    crumbs: [FEATURES],
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "Callback service",
        h1: "Call people back before they call someone else",
        sub: "Every missed call lands in your history with the number and time. Tap it to dial back from your business line.",
        bullets: [
          "One-tap callback from call history",
          "Calls back from the number they dialed",
          "Same history on browser and Android",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is a callback service?",
        paragraphs: [
          "A callback service makes sure missed callers hear back from you. At its simplest, it's a clear list of who called and a fast way to return the call.",
          "Speed matters. A customer who hears back within minutes is more likely to book with you than one who waits until tomorrow.",
        ],
      },
      {
        type: "steps",
        title: "How to return a call in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Open Calls", body: "Missed calls are marked so they stand out." },
          { title: "Tap the call", body: "DIGIRINGO dials the caller from your business number." },
          { title: "Or text instead", body: "If you can't talk, send a quick SMS from the same number." },
        ],
      },
      {
        type: "cards",
        title: "Callback features",
        cols: 3,
        items: [
          { title: "Call history", icon: "list", status: "live" },
          { title: "One-tap redial", icon: "phone-outgoing", status: "beta" },
          { title: "Caller ID choice", body: "Pick which number to call from.", icon: "hash", status: "live" },
          { title: "Callback reminders", icon: "bell", status: "soon" },
          { title: "Auto text-back", icon: "message", status: "soon" },
          { title: "Call notes", icon: "file", status: "soon" },
        ],
      },
      { type: "cta", title: "Give missed callers a fast reply.", button: GET_NUMBER, tone: "dark" },
      { type: "callout", title: "A simple habit", body: "Check the Calls tab at the end of every job or meeting. Returning missed calls in batches takes a few minutes and keeps leads from going cold.", tone: "tint" },
      {
        type: "faq",
        items: [
          { q: "Can customers request a callback from my website?", a: "Not as a form yet. You can add a click-to-call link so they reach you directly; try our click-to-call tool." },
          { q: "Does the callback show my business number?", a: "Yes, it uses your business caller ID. If you have several numbers, you can choose which one." },
          { q: "Why is it beta?", a: "Callbacks work today. We're refining how missed calls are highlighted and planning reminders." },
          { q: "Are callbacks charged?", a: "They're normal outbound calls: $0.015/min in the US and Canada." },
        ],
      },
    ],
    related: ["/features/missed-call-service", "/product/call-analytics/call-logs", "/tools/click-to-call", "/product/calling/voip-caller-id"],
  },
];

const SOON_FEATURE_PAGES: PageDoc[] = [
  // ───────────────────────── /features/ring-groups ─────────────────────────
  {
    path: "/features/ring-groups",
    title: "Ring Groups for Teams (Coming Soon) | DIGIRINGO",
    description:
      "Ring groups are coming to DIGIRINGO: one number that rings a set of teammates together or in order. Today, every device on your account rings at once.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Ring groups",
        h1: "Let one number ring the whole team",
        sub: "Ring groups will send a call to several teammates at once, or one after another, so whoever is free can pick up.",
        bullets: [
          "Group teammates under one number",
          "Ring together or in a set order",
          "Fallback to voicemail when nobody's free",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is a ring group?",
        paragraphs: [
          "A ring group is a list of people who share incoming calls. When the number rings, everyone in the group gets the call, and the first to answer takes it.",
          "It's the simplest way to make sure a sales line or front desk number never depends on a single person being available.",
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Sign in on every device", body: "All browsers and Android phones on your account ring together." },
          { title: "Forward to a cellphone", body: "Unanswered calls go to a second phone after about 30 seconds." },
          { title: "Route to an agent", body: "Send a number's calls to a SIP endpoint that can distribute them." },
        ],
      },
      {
        type: "cards",
        title: "Planned for ring groups",
        cols: 3,
        items: [
          { title: "Team members", body: "Requires multi-user seats, also on the roadmap.", icon: "users", status: "soon" },
          { title: "Simultaneous or sequential", icon: "repeat", status: "soon" },
          { title: "Business-hours rules", icon: "clock", status: "soon" },
        ],
      },
      { type: "callout", title: "Why it isn't live yet", body: "Ring groups only make sense once each teammate has their own login. We're building multi-user accounts first so groups can be set up properly.", tone: "dark" },
      { type: "cta", title: "Need more than one phone to ring today?", body: "Sign in on every device and they all ring together.", button: { label: "Get your number", href: "/app" }, tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "When will ring groups launch?", a: "There's no date yet. They depend on multi-user team accounts, which we're building first." },
          { q: "Can two people share a number now?", a: "Not as separate users. You can share one login across devices, but shared numbers and roles are coming soon." },
          { q: "Will ring groups cost extra?", a: "We don't plan per-seat fees. Pricing for team features will be announced before launch." },
        ],
      },
    ],
    related: ["/product/call-routing/simultaneous-ring", "/product/shared-numbers", "/product/call-routing/automatic-call-distribution", "/blog/ring-multiple-phones-one-number"],
  },

  // ───────────────────────── /features/call-summary ─────────────────────────
  {
    path: "/features/call-summary",
    title: "AI Call Summaries (Coming Soon) | DIGIRINGO",
    description:
      "AI call summaries are on the DIGIRINGO roadmap: a short recap of each call with next steps. They aren't available today; call history and logs are live now.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call summaries",
        h1: "A short recap of every call, written for you",
        sub: "We're planning AI summaries that list what was discussed and what to do next, so you don't have to take notes while you talk.",
        bullets: ["Key points from each call", "Action items you can copy", "Saved next to the call in history"],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is an AI call summary?",
        paragraphs: [
          "A call summary is a few lines that describe a conversation: who called, what they needed, and what was agreed. AI tools create these from a recording and transcript of the call.",
          "Because summaries need call recording and transcription first, both of which are also on our roadmap, this feature will arrive after them.",
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Check call history", body: "See who called, when, and how long you talked." },
          { title: "Text a recap", body: "Send the customer a quick SMS confirming what you agreed." },
          { title: "Route to your own AI agent", body: "Advanced users can send calls to a SIP or webhook agent that does its own note-taking." },
        ],
      },
      {
        type: "callout",
        title: "Consent comes first",
        body: "Summaries will require recording, and recording laws differ by state and country. We'll build in clear notices before this feature launches.",
      },
      { type: "cta", title: "Start with a number and clean call logs today.", button: { label: "Get your number", href: "/app" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO record calls now?", a: "No. Call recording is coming soon but is not available today." },
          { q: "Will summaries cost extra?", a: "Pricing hasn't been set. We'll publish it before launch." },
          { q: "Can I get notified?", a: "Yes. Use the 'Get notified' button at the top of this page." },
        ],
      },
    ],
    related: ["/features/call-transcriptions", "/product/call-recording", "/product/assistant", "/features/post-call-automation"],
  },

  // ───────────────────────── /features/call-transcriptions ─────────────────────────
  {
    path: "/features/call-transcriptions",
    title: "Call Transcriptions (Coming Soon) | DIGIRINGO",
    description:
      "Searchable call transcripts are planned for DIGIRINGO. They're not live yet. See how they'll work and what you can use today: call logs, SMS and forwarding.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call transcriptions",
        h1: "Read your calls instead of replaying them",
        sub: "Transcriptions will turn recorded calls into text you can search, skim and share with your team.",
        bullets: ["Speaker-labeled transcripts", "Search across past calls", "Copy quotes into notes or texts"],
        shot: "activity",
      },
      {
        type: "definition",
        title: "What is call transcription?",
        paragraphs: [
          "Call transcription uses speech recognition to convert a call recording into written text. Good transcripts separate the speakers and include timestamps.",
          "Transcripts make it easy to check what a customer asked for, find a quoted price, or train a new hire on real conversations.",
        ],
      },
      {
        type: "cards",
        title: "How it will fit together",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Call recording", body: "Needed first; also coming soon.", icon: "mic", status: "soon" },
          { title: "Transcripts", icon: "file", status: "soon" },
          { title: "AI summaries", icon: "sparkles", status: "soon", href: "/features/call-summary" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        items: [
          { title: "Review call logs", body: "Every call is listed with time and duration." },
          { title: "Use SMS for written records", body: "Confirm details by text so both sides have it in writing." },
        ],
      },
      { type: "callout", title: "We won't record without telling you", body: "When recording and transcription launch, they'll be off by default and come with consent notices you can play to callers.", tone: "dark" },
      { type: "cta", title: "Keep a written trail today with SMS.", button: { label: "See business texting", href: "/features/business-sms-mms" }, tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Are voicemails transcribed?", a: "Not yet. Voicemail-to-text is a separate roadmap item." },
          { q: "Which languages will be supported?", a: "We'll start with English and share the list before launch." },
          { q: "Is any call recorded now?", a: "No. DIGIRINGO doesn't record live calls today. Only voicemail messages are recorded." },
        ],
      },
    ],
    related: ["/features/call-summary", "/features/voicemail-to-text", "/product/call-recording", "/product/call-analytics/call-logs"],
  },

  // ───────────────────────── /features/voicemail-to-text ─────────────────────────
  {
    path: "/features/voicemail-to-text",
    title: "Voicemail to Text (Coming Soon) | DIGIRINGO",
    description:
      "DIGIRINGO records voicemail today. Voicemail-to-text is coming soon, so you'll be able to read messages instead of listening. Here's what works right now.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Voicemail to text",
        h1: "Skim your voicemail like a text message",
        sub: "We're adding transcription to voicemail so you can read a message in a meeting and decide whether to call back now or later.",
        bullets: ["Text version of every voicemail", "Shown next to the audio", "Faster triage between jobs"],
        shot: "activity",
      },
      {
        type: "definition",
        title: "What is voicemail to text?",
        paragraphs: [
          "Voicemail to text, also called visual voicemail transcription, converts a recorded message into written words. You still have the audio, but you don't have to play it to know what it says.",
          "Today DIGIRINGO records voicemail with a standard greeting when a call goes unanswered. Transcription will be added on top of those recordings.",
        ],
      },
      {
        type: "cards",
        title: "Voicemail in DIGIRINGO",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Recorded voicemail", icon: "voicemail", status: "beta" },
          { title: "Custom greeting", icon: "mic", status: "soon" },
          { title: "Transcription", icon: "file", status: "soon" },
        ],
      },
      {
        type: "cards",
        title: "What you'll see for each message",
        cols: 3,
        tone: "plain",
        items: [
          { title: "Caller and time", icon: "phone-missed", status: "beta" },
          { title: "Audio playback", icon: "volume", status: "soon" },
          { title: "Transcript", icon: "file", status: "soon" },
        ],
      },
      { type: "cta", title: "Set up voicemail as your safety net now.", button: { label: "Get your number", href: "/app" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Can I get voicemails by email?", a: "Not yet. Email delivery is being considered alongside transcription." },
          { q: "Where do voicemails show up now?", a: "They're recorded when nobody answers. The playback screen is being finished and will appear in the app." },
          { q: "Will transcription be accurate?", a: "Speech recognition is good on clear audio but not perfect, so we'll always keep the original recording." },
        ],
      },
    ],
    related: ["/product/voicemail", "/features/call-transcriptions", "/tools/voicemail-generator", "/blog/voicemail-to-text-and-email"],
  },

  // ───────────────────────── /features/crm-with-text-messaging ─────────────────────────
  {
    path: "/features/crm-with-text-messaging",
    title: "CRM with Text Messaging (Coming Soon) | DIGIRINGO",
    description:
      "A lightweight CRM with texting is on the DIGIRINGO roadmap: contacts, notes and tags beside your SMS threads. Today you get two-way texting per number.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "CRM with texting",
        h1: "Know who you're texting before you reply",
        sub: "We plan to add contact cards, notes and tags right next to each conversation, so customer context lives where you talk.",
        bullets: ["Contact names on threads", "Notes and tags per customer", "Calls and texts in one timeline"],
        shot: "inbox",
      },
      {
        type: "definition",
        title: "What is a CRM with text messaging?",
        paragraphs: [
          "A CRM (customer relationship management) tool keeps a record of every customer. Adding texting means you can message them from the same place you track deals, jobs or appointments.",
          "For small businesses, a full CRM is often overkill. Our plan is a light contact layer built into the phone app, plus integrations for teams who already use a CRM.",
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Text from your business number", body: "Two-way SMS with delivery receipts." },
          { title: "Keep threads by number", body: "Each customer has one conversation per line." },
          { title: "Pipe calls to your systems", body: "Use per-number webhooks to log calls in your own tools." },
        ],
      },
      {
        type: "cards",
        title: "Planned contact features",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Contact names", icon: "user", status: "soon" },
          { title: "Notes and tags", icon: "tag", status: "soon" },
          { title: "CRM integrations", icon: "plug", status: "soon", href: "/integrations" },
        ],
      },
      { type: "cta", title: "Two-way texting is ready now.", button: { label: "Get your number", href: "/app" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Will DIGIRINGO connect to HubSpot or Salesforce?", a: "Integrations are planned but not available yet. See the integrations page for the list." },
          { q: "Can I import contacts?", a: "Contacts management is coming soon. There's no import today." },
          { q: "Is it free?", a: "Pricing isn't final. We'll announce it before launch." },
        ],
      },
    ],
    related: ["/product/crm", "/integrations", "/features/business-sms-mms", "/product/messaging"],
  },

  // ───────────────────────── /features/slack-voip ─────────────────────────
  {
    path: "/features/slack-voip",
    title: "Slack Call & Text Alerts (Coming Soon) | DIGIRINGO",
    description:
      "A Slack integration is planned for DIGIRINGO: missed calls, voicemails and texts posted to a channel. Not live yet; webhooks can do some of this today.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Slack + VoIP",
        h1: "Phone activity, posted where your team already talks",
        sub: "We're planning a Slack integration that drops missed calls, new texts and voicemails into the channel of your choice.",
        bullets: ["Missed-call alerts in a channel", "New-text notifications", "Click through to reply in DIGIRINGO"],
        shot: "activity",
      },
      {
        type: "definition",
        title: "Why connect phone and Slack?",
        paragraphs: [
          "When the phone lives on one person's device, nobody else sees what's coming in. Posting call and text events to Slack makes them visible to the whole team.",
          "It also gives you a simple audit trail: who called, when, and whether anyone followed up.",
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Route a number to your webhook", body: "Your server receives the call event and returns call instructions." },
          { title: "Post to Slack yourself", body: "From your webhook, forward a message to a Slack incoming webhook." },
        ],
      },
      {
        type: "cards",
        title: "Events we plan to post",
        cols: 3,
        tone: "plain",
        items: [
          { title: "Missed calls", icon: "phone-missed", status: "soon" },
          { title: "New texts", icon: "message", status: "soon" },
          { title: "New voicemails", icon: "voicemail", status: "soon" },
        ],
      },
      { type: "cta", title: "Building it yourself? Start with the webhook route.", button: { label: "Developer options", href: "/developers" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Will I be able to call from Slack?", a: "We're starting with notifications. Calling from inside Slack isn't planned for the first version." },
          { q: "Is the webhook route hard to set up?", a: "It needs a developer. See the developers page for what the webhook route supports." },
          { q: "How do I get updates?", a: "Click 'Get notified' above, or check the Slack integration page." },
        ],
      },
    ],
    related: ["/integrations/slack", "/integrations/webhooks", "/developers", "/integrations"],
  },

  // ───────────────────────── /features/text-message-response-generator ─────────────────────────
  {
    path: "/features/text-message-response-generator",
    title: "AI Text Reply Suggestions (Coming Soon) | DIGIRINGO",
    description:
      "Suggested replies are planned for DIGIRINGO: AI drafts a response to a customer text and you edit and send. Not live yet. See what texting can do today.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Reply suggestions",
        h1: "A first draft for every customer text",
        sub: "We're working on suggested replies that read the conversation and propose an answer. You stay in control: nothing sends until you tap send.",
        bullets: ["Draft replies in your tone", "Edit before sending", "Never sends on its own"],
        shot: "chat",
      },
      {
        type: "definition",
        title: "What is a text response generator?",
        paragraphs: [
          "A response generator uses an AI language model to suggest a reply based on the messages in a thread. It's useful for routine questions like hours, prices or directions.",
          "The point isn't to automate conversations, it's to save typing. A person still reviews each message.",
        ],
      },
      {
        type: "cards",
        title: "Planned writing helpers",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Suggested replies", icon: "sparkles", status: "soon" },
          { title: "Saved snippets", icon: "list", status: "soon" },
          { title: "Auto-replies", icon: "zap", status: "soon", href: "/product/messaging/sms-autoresponder" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        items: [
          { title: "Text from the web app", body: "Typing on a keyboard is faster for longer replies." },
          { title: "Borrow from our templates", body: "Our blog has ready-to-use business text examples." },
        ],
      },
      { type: "cta", title: "Text customers from your business number today.", button: { label: "Get your number", href: "/app" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Will my messages train an AI model?", a: "We'll publish clear data-use terms before this launches. Our goal is not to use your conversations to train third-party models." },
          { q: "Can it reply automatically?", a: "No. Suggestions will always need a human to send them." },
          { q: "Where can I find text templates now?", a: "Try our post on business text message templates." },
        ],
      },
    ],
    related: ["/features/business-sms-mms", "/product/messaging/instant-response", "/product/assistant", "/blog/business-text-message-templates"],
  },

  // ───────────────────────── /features/post-call-automation ─────────────────────────
  {
    path: "/features/post-call-automation",
    title: "Post-Call Automation (Coming Soon) | DIGIRINGO",
    description:
      "Post-call automation is planned for DIGIRINGO: follow-up texts, tags and CRM updates after a call ends. Not live yet; developers can use webhooks today.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Post-call automation",
        h1: "Let the follow-up start when the call ends",
        sub: "We're planning simple rules that run after a call: send a thank-you text, tag the contact, or push the details to another tool.",
        bullets: ["Follow-up texts after calls", "Tags based on outcome", "Send call data to other apps"],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is post-call automation?",
        paragraphs: [
          "Post-call automation means a set of actions that run on their own once a call is over. Common examples are logging the call, texting a link, or creating a task.",
          "It removes the small chores that pile up after a busy day on the phone.",
        ],
      },
      {
        type: "longform",
        title: "Examples of what it will do",
        tone: "tint",
        items: [
          { title: "Missed call, then text", body: "If a call goes unanswered, send the caller a short message with your booking link.", status: "soon" },
          { title: "Long call, then task", body: "If a call runs over five minutes, create a reminder to send a quote.", status: "soon" },
          { title: "Any call, then log", body: "Push the caller, time and duration to your CRM or spreadsheet.", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        items: [
          { title: "Route to your webhook", body: "Your server sees each inbound call and can trigger its own actions." },
          { title: "Follow up by hand", body: "Use call history and one-tap callback or SMS." },
        ],
      },
      { type: "cta", title: "Prefer to wire it up yourself?", button: { label: "See developer options", href: "/developers" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Will this need code?", a: "No. The plan is a simple rule builder. Webhooks remain available for developers." },
          { q: "Will it work with Zapier?", a: "A Zapier integration is on the roadmap, not live yet." },
          { q: "When is it coming?", a: "No date yet. Click 'Get notified' to hear first." },
        ],
      },
    ],
    related: ["/features/call-summary", "/integrations/zapier", "/developers", "/product/messaging/automated-text-messages"],
  },

  // ───────────────────────── /features/hold-music ─────────────────────────
  {
    path: "/features/hold-music",
    title: "Hold Music for Business Calls (Soon) | DIGIRINGO",
    description:
      "Custom hold music is coming to DIGIRINGO. Today you can put a call on hold with one tap. Next up: music and short messages for callers who wait.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Hold music",
        h1: "Something better than silence while they wait",
        sub: "Hold already works in DIGIRINGO. Next, we're adding music and short messages so callers know they haven't been dropped.",
        bullets: ["Pick from a set of royalty-free tracks", "Or upload your own audio", "Optional spoken messages"],
        shot: "dialer",
      },
      {
        type: "definition",
        title: "Why does hold music matter?",
        paragraphs: [
          "Silence on hold makes people think the call has dropped, and many hang up. A little music, or a short 'we'll be right with you', keeps them on the line.",
          "It's also a small branding moment: the right audio makes a one-person business sound settled and organized.",
        ],
      },
      {
        type: "cards",
        title: "Hold in DIGIRINGO",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Hold button", body: "Pause a call during the conversation.", icon: "pause", status: "live" },
          { title: "Mute and speaker", icon: "volume", status: "live" },
          { title: "Hold music", icon: "music", status: "soon" },
        ],
      },
      { type: "callout", title: "What callers will hear", body: "A short loop of music with optional messages every 30 to 60 seconds, like 'Thanks for waiting, we'll be right with you.' You'll be able to preview it before turning it on.", tone: "plain" },
      { type: "cta", title: "Hold, mute and keypad already work on every call.", button: { label: "Get your number", href: "/app" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Can I use any song?", a: "Only audio you have the rights to use. We'll provide licensed tracks so you don't have to worry about it." },
          { q: "Will callers in a phone menu hear music?", a: "Phone menus are also on the roadmap. When both launch, they'll work together." },
          { q: "Does hold cost extra?", a: "No. A call on hold is billed like any other minute." },
        ],
      },
    ],
    related: ["/features/self-service-ivr", "/product/auto-attendant", "/product/calling", "/tools/auto-attendant-greeting-generator"],
  },

  // ───────────────────────── /features/self-service-ivr ─────────────────────────
  {
    path: "/features/self-service-ivr",
    title: "Self-Service IVR Phone Menu (Coming Soon) | DIGIRINGO",
    description:
      "A self-service IVR is on the DIGIRINGO roadmap: 'press 1 for sales' menus that send callers to the right place. Not live today; per-number routing is.",
    crumbs: [FEATURES],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Self-service IVR",
        h1: "Let callers pick where they need to go",
        sub: "A phone menu will greet callers and let them press a key for sales, support, hours or directions, without anyone answering first.",
        bullets: ["Press-a-key menus", "Recorded or text-to-speech greeting", "Route each option to a person, phone or voicemail"],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is a self-service IVR?",
        paragraphs: [
          "IVR stands for interactive voice response. It's the menu you hear when you call a business: press 1 for this, 2 for that. 'Self-service' means callers can get simple answers, like opening hours, without talking to anyone.",
          "Small businesses use a short IVR to look organized and to keep sales calls from interrupting support work, and the other way around.",
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Use separate numbers", body: "A sales line and a support line, each routed differently." },
          { title: "Route to a SIP agent or webhook", body: "Developers can build their own menu with TeXML on a webhook route." },
          { title: "Write your greeting", body: "Draft the menu script now with our greeting generator." },
        ],
      },
      {
        type: "cards",
        title: "Planned menu features",
        cols: 3,
        items: [
          { title: "Single-level menu", icon: "git-branch", status: "soon" },
          { title: "Multi-level menus", icon: "route", status: "soon", href: "/product/auto-attendant/multi-level-auto-attendant" },
          { title: "Business-hours menus", icon: "clock", status: "soon" },
        ],
      },
      { type: "callout", title: "Keep menus short", body: "Three or four options is plenty for a small business. Long menus frustrate callers, and many will press 0 or hang up anyway.", tone: "dark" },
      { type: "cta", title: "Plan your menu now and set up separate lines today.", button: { label: "Write a greeting", href: "/tools/auto-attendant-greeting-generator" }, tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Is an IVR the same as an auto-attendant?", a: "Mostly. Auto-attendant usually means a simple menu that routes calls; IVR can also include self-service answers." },
          { q: "Can I build a menu with webhooks now?", a: "Yes, if you have a developer. A webhook route can return TeXML that plays a message and gathers key presses." },
          { q: "When will the built-in menu launch?", a: "No date yet. Click 'Get notified' to hear when it's ready." },
        ],
      },
    ],
    related: ["/product/menu-routing", "/product/auto-attendant/cloud-ivr", "/tools/auto-attendant-greeting-generator", "/blog/small-business-phone-menu-ivr"],
  },
];

const NUMBER_PAGES: PageDoc[] = [
  // ───────────────────────── /phone-numbers ─────────────────────────
  {
    path: "/phone-numbers",
    title: "Business Phone Numbers: Local & Toll-Free | DIGIRINGO",
    description:
      "Get a business phone number in minutes: US and Canadian local, toll-free, and numbers in many other countries. US local from $2.50/month, no contract needed.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Phone numbers",
        h1: "A business number in the city, country or format you need",
        sub: "Search by area code, country or digits, see the monthly price before you buy, and start calling right away.",
        bullets: [
          "US local numbers for $2.50/month",
          "Toll-free from $2.50/month",
          "Numbers in many other countries",
        ],
        shot: "buy",
      },
      { type: "widget", widget: "number-search" },
      {
        type: "cards",
        title: "Number types",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Local numbers", body: "Any available US or Canadian area code. Calls and SMS.", icon: "map-pin", href: "/local-numbers", status: "live" },
          { title: "Toll-free numbers", body: "800, 833, 844, 855, 866, 877 and 888. Voice today.", icon: "phone", href: "/toll-free-numbers", status: "live" },
          { title: "International numbers", body: "Local numbers in many countries; some need ID documents.", icon: "globe", href: "/rates", status: "live" },
          { title: "Canadian numbers", icon: "map-pin", href: "/phone-numbers/canada", status: "live" },
          { title: "Vanity search", icon: "search", href: "/vanity-number", status: "live" },
          { title: "Port your number", icon: "refresh", href: "/porting", status: "soon" },
        ],
      },
      {
        type: "cards",
        title: "Ways to use your numbers",
        cols: 2,
        items: [
          { title: "Dedicated business line", body: "A number that's only for work, separate from your cell.", icon: "briefcase", href: "/phone-numbers/dedicated" },
          { title: "Multiple phone lines", body: "Different numbers for sales, support or each location.", icon: "list", href: "/phone-numbers/multiple-phone-lines" },
        ],
      },
      {
        type: "steps",
        title: "How to get a number in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Open the web app", body: "Sign up with email or Google." },
          { title: "Add funds", body: "Top up your wallet by card." },
          { title: "Search and buy", body: "Filter by country, type or area code. The price is shown before you confirm." },
          { title: "Upload documents if asked", body: "Some countries require ID or an address. Carrier review usually takes 1 to 3 days." },
        ],
      },
      { type: "cta", title: "Find a number you like.", button: GET_NUMBER, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "How fast is a number active?", a: "US and Canadian numbers are usually ready right away. Countries that require documents take 1 to 3 days for carrier review." },
          { q: "Can I text from every number?", a: "US and Canadian local numbers can text after 10DLC registration. International SMS depends on the number. Toll-free texting is coming soon." },
          { q: "What happens if an international order isn't approved?", a: "If a number never goes live, it's closed and the cost is refunded to your wallet." },
          { q: "Can I bring my current number?", a: "Porting is coming soon. Until then, forward your old number to your new DIGIRINGO number." },
        ],
      },
    ],
    related: ["/local-numbers", "/toll-free-numbers", "/vanity-number", "/blog/local-vs-toll-free-number"],
  },

  // ───────────────────────── /phone-numbers/dedicated ─────────────────────────
  {
    path: "/phone-numbers/dedicated",
    title: "Dedicated Business Phone Number | DIGIRINGO",
    description:
      "Keep work and personal calls apart with a dedicated business number that rings your laptop and Android phone. $2.50/month for US local, cancel anytime.",
    crumbs: [PHONE_NUMBERS],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Dedicated number",
        h1: "One number that's only for business",
        sub: "Give customers a number that belongs to the business, not to your personal phone. Answer it when you're working and let voicemail take it when you're not.",
        bullets: ["Your cell number stays private", "Rings on laptop and Android", "Keep the number if you change phones"],
        shot: "numbers",
      },
      {
        type: "definition",
        title: "What is a dedicated phone number?",
        paragraphs: [
          "A dedicated number is assigned only to you. It isn't shared with other customers of the provider and doesn't rotate. It's the number on your website, your van and your business cards.",
          "Because it's a virtual number, it isn't tied to a SIM card. If you change phones or carriers, the business number stays exactly where it is.",
        ],
      },
      {
        type: "cards",
        title: "Why get a dedicated line",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Privacy", body: "Customers never see your personal cellphone number.", icon: "lock" },
          { title: "Boundaries", body: "Know at a glance whether a call is work or personal.", icon: "moon" },
          { title: "Continuity", body: "Hand the line to a new hire or partner without changing it.", icon: "repeat" },
        ],
      },
      {
        type: "steps",
        title: "How to get a dedicated number",
        items: [
          { title: "Sign up and top up", body: "Start with a $5 wallet top-up." },
          { title: "Pick your number", body: "Local, toll-free or international." },
          { title: "Install the app", body: "Add the Android app or use the web app on your computer." },
        ],
      },
      { type: "cta", title: "Get a business number for $2.50 a month.", button: GET_NUMBER, tone: "dark" },
      { type: "chips", title: "Find a number by type", links: [{ label: "Local numbers", href: "/local-numbers" }, { label: "Toll-free numbers", href: "/toll-free-numbers" }, { label: "Canada", href: "/phone-numbers/canada" }, { label: "Vanity search", href: "/vanity-number" }], tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Can I use it on the same phone as my personal number?", a: "Yes. The Android app adds the business line alongside your normal phone number." },
          { q: "Will customers see my business number when I call?", a: "Yes, outbound calls show your business number as caller ID." },
          { q: "Is the number recycled?", a: "Numbers come from carrier inventory, so some may have had a previous owner. That's normal across the industry." },
          { q: "What if I stop paying?", a: "Monthly number fees are paid from your wallet, so keep a balance to make sure renewals go through. Contact support if a renewal ever fails." },
        ],
      },
    ],
    related: ["/phone-numbers/multiple-phone-lines", "/blog/stop-using-personal-number-for-business", "/blog/second-phone-number-same-phone", "/phone-numbers"],
  },

  // ───────────────────────── /phone-numbers/multiple-phone-lines ─────────────────────────
  {
    path: "/phone-numbers/multiple-phone-lines",
    title: "Multiple Phone Lines on One Phone | DIGIRINGO",
    description:
      "Run several business numbers from one app: a line for sales, one for support, one per location. Pick which number to call from and route each separately.",
    crumbs: [PHONE_NUMBERS],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Multiple lines",
        h1: "Several business numbers, one app",
        sub: "Add as many numbers as you need and manage them side by side. Each can have its own routing, and you choose which one to call from.",
        bullets: ["Separate lines for sales, support or locations", "Choose caller ID for every outbound call", "$2.50/month per US local number"],
        shot: "numbers",
      },
      {
        type: "definition",
        title: "Why use more than one line?",
        paragraphs: [
          "Different numbers help you know what a call is about before you answer. A call on the support line is probably an existing customer; a call on the ad-tracking line is a new lead.",
          "Multiple lines also let you have a local presence in more than one city, or keep a toll-free number for national customers alongside a local one.",
        ],
      },
      {
        type: "flex",
        tone: "tint",
        rows: [
          { title: "Pick your caller ID", body: "Before you dial, choose which of your numbers the other person will see.", shot: "dialer", icon: "hash" },
          { title: "Route each number differently", body: "Send one line to the app, another straight to your cell, another to a SIP agent.", shot: "settings", icon: "route" },
          { title: "Texts stay separated", body: "SMS conversations are grouped by number so lines don't mix.", shot: "inbox", icon: "messages" },
        ],
      },
      {
        type: "table",
        title: "Example setup",
        head: ["Line", "Route", "Monthly"],
        rows: [
          ["Main local number", "Ring app, then cell", "$2.50"],
          ["Toll-free sales line", "Ring app", "from $2.50"],
          ["Second-city local number", "Forward to cell", "$2.50"],
        ],
        note: "Minutes and texts billed separately at $0.015 each in the US and Canada.",
      },
      { type: "cta", title: "Add your next line in a minute.", button: GET_NUMBER, tone: "dark" },
      { type: "callout", title: "Name your lines", body: "Give each number a clear label in the app, like 'Sales' or 'Downtown shop', so you know which line a call came in on before you answer.", tone: "tint" },
      {
        type: "faq",
        items: [
          { q: "Is there a limit on numbers?", a: "No fixed limit. Each number has its own monthly fee." },
          { q: "Can different people answer different lines?", a: "Multi-user seats are coming soon. Today, you can forward a line to someone else's cellphone." },
          { q: "Can I release a number I don't need?", a: "Yes, at any time. There's no contract." },
          { q: "Do texts from different lines get mixed?", a: "No. Each number keeps its own conversation threads." },
        ],
      },
    ],
    related: ["/phone-numbers/dedicated", "/product/calling/voip-caller-id", "/product/call-routing", "/blog/small-business-call-routing"],
  },

  // ───────────────────────── /phone-numbers/canada ─────────────────────────
  {
    path: "/phone-numbers/canada",
    title: "Canadian Business Phone Numbers | DIGIRINGO",
    description:
      "Get a Canadian local business number for calls and texts, usable from anywhere. Calls across the US and Canada are $0.015/min. No contract, no seat fees.",
    crumbs: [PHONE_NUMBERS],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Canada",
        h1: "A Canadian business number, wherever you work",
        sub: "Pick a number in Toronto, Vancouver, Montreal, Calgary or any other available area code and answer it from your browser or Android phone.",
        bullets: ["Local Canadian area codes", "Calls and SMS", "$0.015/min across the US and Canada"],
        shot: "buy",
      },
      {
        type: "definition",
        title: "Why get a Canadian number?",
        paragraphs: [
          "Canadian customers are more likely to answer, and call, a number with a familiar area code. A local number also signals you serve their market.",
          "If you're based in the US or overseas, a Canadian virtual number lets you build that presence without an office or a Canadian SIM.",
        ],
      },
      {
        type: "cards",
        title: "What you get",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Local area codes", body: "Search across provinces.", icon: "map-pin" },
          { title: "Same app as US lines", body: "Manage Canadian and US numbers together.", icon: "smartphone" },
          { title: "Forward anywhere", body: "Send calls to a cellphone in Canada or abroad.", icon: "phone-forwarded" },
        ],
      },
      {
        type: "steps",
        title: "How to get a Canadian number",
        items: [
          { title: "Sign up at /app", body: "No Canadian address needed for most area codes." },
          { title: "Search Canada", body: "Choose a city or area code from the list." },
          { title: "Buy and start calling", body: "The monthly price is shown before you confirm." },
        ],
      },
      { type: "cta", title: "See Canadian rates and number prices.", button: { label: "Canada rates", href: "/rates/ca" }, tone: "dark" },
      { type: "chips", title: "Related number types", links: [{ label: "Canadian toll-free", href: "/toll-free-numbers/canada" }, { label: "US local numbers", href: "/local-numbers" }, { label: "All phone numbers", href: "/phone-numbers" }], tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Can I text from a Canadian number?", a: "Yes, Canadian local numbers support two-way SMS at $0.015 per message." },
          { q: "Are calls between the US and Canada international?", a: "No. Calls to and from both countries are $0.015/min." },
          { q: "Do I need to live in Canada?", a: "Not for most area codes. If an area requires documents, the app will tell you before you buy." },
          { q: "Are Canadian toll-free numbers available?", a: "North American toll-free numbers work for callers in both the US and Canada." },
        ],
      },
    ],
    related: ["/toll-free-numbers/canada", "/rates/ca", "/blog/get-canadian-business-number", "/phone-numbers"],
  },

  // ───────────────────────── /vanity-number ─────────────────────────
  {
    path: "/vanity-number",
    title: "Vanity Phone Number Search by Digits | DIGIRINGO",
    description:
      "Search for a memorable business number by the digits you want: a repeating pattern, a year, or a word on the keypad. See what's available and buy instantly.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Vanity numbers",
        h1: "Find a number people remember",
        sub: "Type the digits you want and DIGIRINGO shows available numbers that contain them. Great for patterns like 2000, 7777 or a word spelled on the keypad.",
        bullets: ["Search by any digit sequence", "Local and toll-free results", "Same price as any other number"],
        shot: "buy",
      },
      { type: "widget", widget: "number-search" },
      {
        type: "definition",
        title: "What is a vanity number?",
        paragraphs: [
          "A vanity number is one chosen because it's easy to recall. Some spell a word using the letters on a phone keypad (like 1-800-FLOWERS); others use repeating or sequential digits.",
          "The fully spelled-out kind is rare and often taken. Partial matches, like a number ending in your street number or a round figure, are much easier to find and still help people remember you.",
        ],
        tone: "tint",
      },
      {
        type: "longform",
        title: "Tips for picking a good one",
        items: [
          { title: "Put the pattern at the end", body: "People remember the last four digits best, so search for an ending like 1000 or 4357 (HELP)." },
          { title: "Keep it local if it matters", body: "A memorable number in the wrong area code can cost more trust than it gains." },
          { title: "Avoid confusing letters", body: "Words with Q, Z, O and I can be mistyped. Test it by dialing it yourself." },
          { title: "Check toll-free too", body: "Toll-free prefixes like 833 and 844 often have more open combinations than 800." },
        ],
      },
      {
        type: "steps",
        title: "How to search in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Open Buy a number", body: "In the web or Android app." },
          { title: "Enter your digits", body: "Use the 'contains' field to search for a sequence." },
          { title: "Pick and confirm", body: "Available matches are shown with their monthly price." },
        ],
      },
      { type: "cta", title: "Try a few searches. It's free to look.", button: GET_NUMBER, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Do vanity numbers cost more?", a: "No. A number found by digit search costs the same as any other number of its type." },
          { q: "Can I search by letters?", a: "Convert the word to keypad digits (ABC=2, DEF=3, and so on) and search for those." },
          { q: "What if the exact number I want is taken?", a: "Try the same pattern with a different area code or toll-free prefix." },
        ],
      },
    ],
    related: ["/tools/phone-number-generator", "/toll-free-numbers", "/local-numbers", "/blog/choose-area-code-vanity-number"],
  },

  // ───────────────────────── /porting ─────────────────────────
  {
    path: "/porting",
    title: "Number Porting (Coming Soon) | DIGIRINGO",
    description:
      "Number porting is coming soon to DIGIRINGO. Until it's ready, keep your old number and forward it to a new DIGIRINGO line so customers can still reach you.",
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Number porting",
        h1: "Bring your existing number with you",
        sub: "We're building number porting so you can move your current business number to DIGIRINGO without customers noticing a change.",
        bullets: ["Keep the number customers already know", "Guided transfer request", "Status updates while it moves"],
        shot: "numbers",
      },
      {
        type: "definition",
        title: "What is number porting?",
        paragraphs: [
          "Porting moves a phone number from one carrier to another. The number stays the same; only the company that handles it changes. In the US this is protected by law, and your old carrier can't refuse a valid request.",
          "A port typically needs your account number, a PIN, and the name and address on the old account. US ports usually complete in days to a couple of weeks.",
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Get a DIGIRINGO number", body: "Choose a new local or toll-free number." },
          { title: "Forward your old number to it", body: "Set call forwarding with your current carrier." },
          { title: "Port later", body: "When porting launches, move the old number over and release the temporary one." },
        ],
      },
      {
        type: "callout",
        title: "Don't cancel your old line yet",
        body: "Cancelling service before a port completes can release the number for good. Keep the old account active until porting is available and the transfer finishes.",
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "When will porting be available?", a: "We don't have a date yet. Click 'Get notified' to get one email when it's ready." },
          { q: "Will porting cost anything?", a: "We'll publish any fee before launch." },
          { q: "Where can I learn more about how porting works?", a: "Our blog has guides on porting timelines and common rejection reasons." },
        ],
      },
    ],
    related: ["/blog/what-is-number-porting", "/blog/how-long-does-porting-take", "/blog/number-port-rejected-fixes", "/blog/forward-landline-to-mobile"],
  },

  // ───────────────────────── /developers ─────────────────────────
  {
    path: "/developers",
    title: "Developers: Webhooks & SIP Routing | DIGIRINGO",
    description:
      "Route any DIGIRINGO number to your own webhook (TeXML) or a SIP endpoint, including AI voice agents. Available in beta today; a full REST API is coming soon.",
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "Developers",
        h1: "Control your calls with your own code",
        sub: "Point a number at your webhook and decide what happens on every inbound call. Or hand calls to a SIP endpoint, like a voice AI agent you run.",
        bullets: ["Per-number webhook routing (TeXML)", "SIP routing to your own agent", "REST API on the roadmap"],
        shot: "settings",
        primary: GET_NUMBER,
        secondary: { label: "Talk to us", href: "/contact" },
      },
      {
        type: "definition",
        title: "What's available for developers",
        paragraphs: [
          "Today the developer surface is call routing. Each number can be set to send inbound calls to a URL you control. When a call arrives, we request your URL and you answer with TeXML, an XML format for call instructions such as say, play, gather digits, dial or hang up.",
          "Alternatively, set a number to route to a SIP URI. That's the simplest way to connect an AI voice agent or an existing PBX. There's no public REST API for managing numbers, messages or calls yet.",
        ],
      },
      {
        type: "tabs",
        title: "Routes and roadmap",
        tone: "tint",
        tabs: [
          {
            name: "Available (beta)",
            items: [
              { title: "Webhook route", body: "We call your URL on each inbound call; you return TeXML.", icon: "webhook", status: "beta" },
              { title: "SIP route", body: "Send calls to any SIP endpoint or voice agent.", icon: "bot", status: "beta" },
              { title: "Forward route", body: "Send calls to a phone number.", icon: "phone-forwarded", status: "live" },
            ],
          },
          {
            name: "Coming soon",
            items: [
              { title: "REST API", body: "Numbers, calls and messages over HTTP.", icon: "code", status: "soon" },
              { title: "Event webhooks", body: "Notifications for texts, missed calls and voicemail.", icon: "bell", status: "soon" },
              { title: "MCP server", body: "Let AI assistants work with your phone data.", icon: "plug", status: "soon", href: "/product/ai/mcp" },
            ],
          },
        ],
      },
      {
        type: "steps",
        title: "How to route a number to your webhook",
        items: [
          { title: "Host an HTTPS endpoint", body: "It should respond with valid TeXML." },
          { title: "Open the number's routing settings", body: "Choose 'Webhook' and paste your URL." },
          { title: "Call the number", body: "Watch your server logs and adjust the response." },
        ],
      },
      {
        type: "table",
        title: "Which route should I use?",
        head: ["Goal", "Route"],
        rows: [
          ["Connect an AI voice agent", "SIP"],
          ["Build a custom phone menu", "Webhook"],
          ["Log calls to your database", "Webhook"],
          ["Ring a desk phone or PBX", "SIP"],
        ],
        tone: "tint",
      },
      { type: "cta", title: "Have a use case for the API? Tell us about it.", button: { label: "Contact us", href: "/contact" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Is there API documentation?", a: "Public API docs will come with the REST API. For webhook routing, TeXML follows a widely documented XML call-control format; contact us for examples." },
          { q: "Are webhook calls billed?", a: "The call itself is billed at normal per-minute rates. There's no extra fee for using the webhook route." },
          { q: "Can I send SMS through an API?", a: "Not yet. Messaging over the API is part of the planned REST API." },
          { q: "What happens if my webhook is down?", a: "The call can't be handled. Keep your endpoint reliable, or use app routing for critical numbers." },
        ],
      },
    ],
    related: ["/ai-agent", "/integrations/webhooks", "/product/call-routing", "/product/ai/voice-agent"],
  },

  // ───────────────────────── /downloads ─────────────────────────
  {
    path: "/downloads",
    title: "Download DIGIRINGO: Android, Web & PWA | DIGIRINGO",
    description:
      "Get DIGIRINGO on Android from Google Play, use the web app in any browser, or install it as a PWA. iPhone users can run the web app in Safari today.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Downloads",
        h1: "Use DIGIRINGO on the devices you already have",
        sub: "Android app on Google Play, the web app in any modern browser, and an installable version for your home screen or desktop.",
        bullets: ["Android: Google Play", "Computer: any modern browser", "iPhone: the web app in Safari"],
        shot: "home",
        primary: { label: "Get it on Google Play", href: "https://play.google.com/store/apps/details?id=com.digiringo.app" },
        secondary: { label: "Open the web app", href: "/app" },
      },
      {
        type: "cards",
        title: "Pick your platform",
        cols: 4,
        items: [
          { title: "Android", body: "Native app with incoming-call notifications.", icon: "smartphone", status: "live", href: "https://play.google.com/store/apps/details?id=com.digiringo.app" },
          { title: "Web app", body: "Chrome, Edge, Firefox or Safari. Nothing to install.", icon: "monitor", status: "live", href: "/app" },
          { title: "Installable app (PWA)", body: "Add the web app to your home screen or desktop.", icon: "laptop", status: "live", href: "/app" },
          { title: "iPhone app", body: "Use the web app in Safari for now.", icon: "smartphone", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "How to install the web app (PWA)",
        tone: "tint",
        items: [
          { title: "Open digiringo.com/app", body: "In Chrome or Edge on a computer or Android, or Safari on iPhone." },
          { title: "Choose 'Install' or 'Add to Home Screen'", body: "In Chrome look for the install icon in the address bar. On iPhone, tap Share, then Add to Home Screen." },
          { title: "Allow notifications and microphone", body: "So calls can ring and you can talk." },
        ],
      },
      {
        type: "table",
        title: "What works where",
        head: ["Feature", "Android app", "Web app", "iPhone (Safari)"],
        rows: [
          ["Make and receive calls", "yes", "yes", "yes"],
          ["Two-way SMS", "yes", "yes", "yes"],
          ["Background call alerts", "yes", "yes", "Limited"],
          ["Native app store install", "yes", "no", "soon"],
        ],
        note: "Background alerts on iPhone depend on iOS web-push support and work only when the web app is added to the home screen.",
      },
      { type: "cta", title: "On a computer? Start in your browser.", button: { label: "Open the web app", href: "/app" }, tone: "dark" },
      { type: "callout", title: "Calls need two permissions", body: "Allow the microphone so the other person can hear you, and notifications so incoming calls can reach you when the app isn't on screen. You can change both in your browser or Android settings.", tone: "tint" },
      {
        type: "faq",
        items: [
          { q: "Is there a desktop app for Windows or Mac?", a: "Not a separate one yet. The web app runs in any modern browser, and Chrome or Edge can install it like a desktop app." },
          { q: "When is the iPhone app coming?", a: "It's on our roadmap without a date. The Safari web app covers calls and texts in the meantime." },
          { q: "Do I need to sign in separately on each device?", a: "Yes, sign in once per device. Your numbers and history sync automatically." },
          { q: "Which Android versions are supported?", a: "Recent Android versions from Google Play. If the store says your device isn't compatible, use the web app in Chrome." },
        ],
      },
    ],
    related: ["/features/cloud-voip", "/product/calling/call-from-browser", "/demo", "/security"],
  },

  // ───────────────────────── /demo ─────────────────────────
  {
    path: "/demo",
    title: "Product Demo: App Walkthrough | DIGIRINGO",
    description:
      "Take a quick screenshot tour of DIGIRINGO: the home screen, buying a number, the dialer, call history, texting, wallet and settings. No sign-up needed to look.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Demo",
        h1: "See the app before you sign up",
        sub: "A short walkthrough of the main screens, in the order you'd use them on day one.",
        bullets: ["Buy a number", "Make a call and send a text", "Manage your wallet and routing"],
        shot: "home",
      },
      {
        type: "flex",
        title: "Day one in DIGIRINGO",
        rows: [
          { title: "Home", body: "Your numbers, balance and recent activity at a glance.", shot: "home", icon: "home" },
          { title: "Buy a number", body: "Search by country, area code or digits. Prices are shown before you buy.", shot: "buy", icon: "search" },
          { title: "Your numbers", body: "Every line you own, with routing and forwarding settings.", shot: "numbers", icon: "hash" },
          { title: "Dialer", body: "Pick a caller ID and dial. Keypad, hold, mute and speaker are one tap away.", shot: "dialer", icon: "phone" },
        ],
      },
      {
        type: "flex",
        tone: "tint",
        rows: [
          { title: "Calls", body: "Incoming, outgoing and missed calls with time and duration.", shot: "calls", icon: "list" },
          { title: "Inbox and chat", body: "Text threads grouped by number with delivery receipts.", shot: "chat", icon: "messages" },
          { title: "Activity", body: "A timeline of calls, texts and account events.", shot: "activity", icon: "bell" },
          { title: "Wallet and settings", body: "Top up by card, review charges, and set your forwarding number.", shot: "wallet", icon: "wallet" },
        ],
      },
      {
        type: "cta",
        title: "Rather talk to a person?",
        body: "Our team can answer questions about setup or numbers.",
        button: { label: "Contact sales", href: "/sales" },
      },
      {
        type: "cards",
        title: "What the screenshots don't show yet",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Phone menus", icon: "git-branch", status: "soon" },
          { title: "Call recording", icon: "mic", status: "soon" },
          { title: "Team seats", icon: "users", status: "soon" },
        ],
      },
      { type: "cta", title: "Seen enough? Try it with a $5 top-up.", button: { label: "Get your number", href: "/app" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Is there a free trial?", a: "There's no free trial, but you can start with a $5 top-up and a $2.50 number." },
          { q: "Can I book a live demo?", a: "Yes, reach out through the sales page and we'll find a time." },
          { q: "Do the screenshots show every feature?", a: "They show the main live screens. Features marked 'coming soon' on our site aren't pictured." },
        ],
      },
    ],
    related: ["/features", "/downloads", "/pricing", "/product"],
  },

  // ───────────────────────── /security ─────────────────────────
  {
    path: "/security",
    title: "Security at DIGIRINGO | DIGIRINGO",
    description:
      "How DIGIRINGO protects your account and calls: HTTPS everywhere, encrypted secrets, a carrier-grade voice network and sign-in protection. Plain facts, no hype.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Security",
        h1: "How we protect your account",
        sub: "A plain description of the safeguards we use today. We'd rather tell you exactly what we do than wave around badges.",
        bullets: ["Encrypted connections everywhere", "Secrets stored encrypted, never in the browser", "Calls carried on a carrier-grade network"],
        shot: "settings",
        layout: "split",
      },
      {
        type: "longform",
        title: "What we do today",
        items: [
          { title: "HTTPS everywhere", body: "The website, web app and app connections use TLS. Calls in the browser use WebRTC, which encrypts media between your device and the voice network.", icon: "lock" },
          { title: "Encrypted secrets", body: "Provider keys and sensitive credentials are kept on our servers, encrypted, and never sent to your browser.", icon: "shield" },
          { title: "Carrier-grade network", body: "Calls and texts are carried by an established telecom carrier partner with its own network security and monitoring.", icon: "globe" },
          { title: "Account protection", body: "Sign-in sessions use tokens that can be revoked, and you can sign in with Google instead of a password.", icon: "user" },
          { title: "Payments", body: "Card details are handled by our payment provider. We don't store full card numbers.", icon: "credit-card" },
          { title: "Hardened servers", body: "Internal services aren't exposed to the internet, cross-site requests are limited to our own domains, and we review our setup regularly.", icon: "settings" },
        ],
      },
      {
        type: "callout",
        title: "About certifications",
        body: "DIGIRINGO doesn't currently hold third-party security or compliance certifications. If your business needs a specific one, please ask us before you rely on the service for regulated data.",
        tone: "dark",
      },
      {
        type: "cards",
        title: "What you can do",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Use a strong password or Google sign-in", icon: "lock" },
          { title: "Sign out of shared computers", icon: "laptop" },
          { title: "Tell us if something looks wrong", icon: "bell", href: "/contact" },
        ],
      },
      { type: "cta", title: "Questions about how we handle your data?", button: { label: "Contact us", href: "/contact" }, tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Are calls recorded?", a: "No. Live calls aren't recorded. Voicemail messages are recorded when a caller leaves one." },
          { q: "Is DIGIRINGO suitable for healthcare data?", a: "We don't hold healthcare compliance certifications. Don't use DIGIRINGO for protected health information unless you've confirmed it meets your obligations." },
          { q: "How do I report a security issue?", a: "Contact us through the contact page with details. We'll respond and keep you updated." },
          { q: "Where can I read about data use?", a: "See our privacy policy for what we collect and why." },
        ],
      },
    ],
    related: ["/privacy", "/terms", "/fair-use", "/status"],
  },

  // ───────────────────────── /fair-use ─────────────────────────
  {
    path: "/fair-use",
    title: "Fair Use Policy | DIGIRINGO",
    description:
      "DIGIRINGO's fair-use policy in plain language: no spam, robocalls or illegal use, follow TCPA and 10DLC rules, get consent before auto-dialing or mass texting.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Fair use",
        h1: "Fair use policy",
        sub: "DIGIRINGO is pay-as-you-go, so there are no artificial minute caps. In return, we ask that you use the service the way a normal business would. Here's what that means.",
        layout: "center",
      },
      {
        type: "longform",
        title: "What's not allowed",
        items: [
          { title: "Spam and unwanted messages", body: "Don't send texts to people who haven't agreed to hear from you, and stop when they reply STOP.", icon: "message" },
          { title: "Robocalls and auto-dialers without consent", body: "Don't use automated dialing, prerecorded messages or AI voices to call people unless you have the consent the law requires.", icon: "phone-outgoing" },
          { title: "Illegal or harmful use", body: "No fraud, harassment, threats, scams, impersonation, or anything else that breaks the law where you or the recipient are.", icon: "shield" },
          { title: "Caller ID spoofing", body: "Only call from numbers you own in DIGIRINGO. Don't misrepresent who you are.", icon: "hash" },
          { title: "Reselling or traffic pumping", body: "Don't resell service without an agreement with us, or generate artificial call traffic.", icon: "repeat" },
        ],
      },
      {
        type: "longform",
        title: "Rules you're responsible for",
        tone: "tint",
        items: [
          { title: "TCPA and similar laws", body: "In the US, the Telephone Consumer Protection Act limits automated calls and texts. Other countries have their own rules. Follow the ones that apply to you." },
          { title: "10DLC registration", body: "Business texting from US local numbers must be registered through the Trust Center, and your messages must match the campaign you registered." },
          { title: "Do-not-call lists", body: "Respect national and internal do-not-call lists for sales calls." },
          { title: "Recording and privacy laws", body: "If you record or process calls through your own systems, get any consent your jurisdiction requires." },
        ],
      },
      {
        type: "callout",
        title: "What happens if there's abuse",
        body: "If we see activity that breaks this policy, or a carrier reports it to us, we may limit, suspend or close the account and release affected numbers. Where we can, we'll contact you first. Wallet balances on accounts closed for abuse may not be refunded.",
        tone: "dark",
      },
      { type: "cta", title: "Not sure if your use case is allowed? Ask before you start.", button: { label: "Contact us", href: "/contact" }, tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Is there a limit on minutes or texts?", a: "No fixed cap. Very high or unusual volume may be reviewed to protect the network and other customers." },
          { q: "Can I send marketing texts?", a: "Yes, if recipients opted in, your 10DLC campaign covers marketing, and you honor opt-outs." },
          { q: "I got a suspension notice. What now?", a: "Reply through the contact page with details about your use. We'll review it." },
          { q: "Does this replace the Terms of Service?", a: "No. This page summarizes expectations; the Terms are the binding agreement." },
        ],
      },
    ],
    related: ["/terms", "/privacy", "/blog/sms-opt-in-consent-guide", "/blog/what-is-a2p-10dlc"],
  },

  // ───────────────────────── /partners ─────────────────────────
  {
    path: "/partners",
    title: "Partner Program (Coming Soon) | DIGIRINGO",
    description:
      "A DIGIRINGO partner program for agencies, IT providers and consultants is in the works. Tell us about your clients and we'll reach out when it launches.",
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Partners",
        h1: "Set up business phones for your clients",
        sub: "We're designing a partner program for agencies, IT providers and consultants who help small businesses get their phones in order.",
        bullets: ["For agencies, MSPs and consultants", "Help clients pick numbers and routing", "Details to be announced"],
        shot: "numbers",
      },
      {
        type: "definition",
        title: "Who it's for",
        paragraphs: [
          "If you build websites, run IT for small offices, or set up AI voice agents, your clients probably need a reliable business number. We want to make that easy to recommend and easy to manage.",
          "The program details, including any referral terms, aren't final. We'd rather hear what would help you before we publish them.",
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Set up a client number", body: "Create an account and buy a number in a few minutes." },
          { title: "Route to your agent", body: "Connect a voice AI or PBX you manage by SIP or webhook." },
          { title: "Tell us about your clients", body: "Use the contact page so we can include you in early conversations." },
        ],
      },
      {
        type: "cards",
        title: "What a partner might do",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Set up numbers for clients", icon: "hash" },
          { title: "Connect voice AI agents", icon: "bot" },
          { title: "Design call flows", icon: "route" },
        ],
      },
      { type: "cta", title: "Interested? Introduce yourself.", button: { label: "Contact us", href: "/contact" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Is there a commission?", a: "Terms haven't been set. We'll share them when the program opens." },
          { q: "Can I manage several client accounts from one login?", a: "Not yet. Multi-user and account management features are on our roadmap." },
          { q: "How do I get on the list?", a: "Click 'Get notified' or contact us with a short note about your business." },
        ],
      },
    ],
    related: ["/developers", "/ai-agent", "/contact", "/sales"],
  },

  // ───────────────────────── /press ─────────────────────────
  {
    path: "/press",
    title: "Press Kit & Media Information | DIGIRINGO",
    description:
      "DIGIRINGO press kit: company boilerplate, product facts, pricing, logo guidance and how to reach us. For journalists and writers covering business phones.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Press",
        h1: "Press kit",
        sub: "Facts, boilerplate and contact details for anyone writing about DIGIRINGO.",
        layout: "center",
        primary: { label: "Press inquiries", href: "/contact" },
      },
      {
        type: "callout",
        title: "About DIGIRINGO",
        body: "DIGIRINGO is a business phone app for small businesses and independent professionals. It provides local US and Canadian numbers, toll-free numbers and numbers in many other countries, with calling from a web browser or an Android app, two-way SMS, call forwarding, per-number call routing and voicemail. Pricing is pay-as-you-go from a prepaid wallet, with no contracts and no per-user fees. DIGIRINGO is available at digiringo.com and on Google Play.",
        tone: "tint",
      },
      {
        type: "table",
        title: "Quick facts",
        head: ["", ""],
        rows: [
          ["Website", "digiringo.com"],
          ["Web app", "digiringo.com/app"],
          ["Mobile", "Android on Google Play; iPhone via the web app in Safari"],
          ["US local number", "$2.50/month"],
          ["US & Canada calls", "$0.015/min"],
          ["US & Canada SMS", "$0.015/message"],
          ["International calling", "220+ countries, per-country rates"],
          ["Contracts / seat fees", "None"],
        ],
      },
      {
        type: "longform",
        title: "Using our name and logo",
        tone: "tint",
        items: [
          { title: "Name", body: "Write it as DIGIRINGO in all capitals." },
          { title: "Logo", body: "Contact us for logo files. Please don't stretch, recolor or add effects to the logo." },
          { title: "Screenshots", body: "Product screenshots can be requested through the contact page and used in coverage of DIGIRINGO." },
          { title: "Roadmap features", body: "Several features listed on our site are marked 'coming soon'. Please describe them as planned, not available." },
        ],
      },
      { type: "cta", title: "Writing a story? We're happy to help with facts and screenshots.", button: { label: "Contact us", href: "/contact" }, tone: "dark" },
    ],
    related: ["/about", "/features", "/pricing", "/llm-info"],
  },

  // ───────────────────────── /webinars ─────────────────────────
  {
    path: "/webinars",
    title: "Webinars (Coming Soon) | DIGIRINGO",
    description:
      "DIGIRINGO webinars are coming soon: short live sessions on setting up a business number, 10DLC texting and call routing. Get notified when the first is set.",
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Webinars",
        h1: "Short live sessions on business phones",
        sub: "We're planning practical 30-minute webinars with time for questions. No sales pitch, just setup walkthroughs.",
        bullets: ["Setting up your first number", "Getting 10DLC approved", "Routing calls so you miss fewer"],
        layout: "center",
      },
      {
        type: "cards",
        title: "Planned topics",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Your first business line", icon: "phone", status: "soon" },
          { title: "10DLC without the headaches", icon: "shield", status: "soon" },
          { title: "Connecting an AI voice agent", icon: "bot", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "Learn now",
        items: [
          { title: "Read the guides", body: "Our blog covers 10DLC, routing and porting step by step." },
          { title: "Ask support", body: "Live chat in the app answers setup questions." },
        ],
      },
      { type: "cta", title: "Have a question now? Read the guides.", button: { label: "Visit the blog", href: "/blog" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Will webinars be recorded?", a: "That's the plan, so you can watch later." },
          { q: "Can I suggest a topic?", a: "Yes, send it through the contact page." },
        ],
      },
    ],
    related: ["/blog", "/blog/10dlc-registration-step-by-step", "/podcast", "/community"],
  },

  // ───────────────────────── /podcast ─────────────────────────
  {
    path: "/podcast",
    title: "Podcast (Coming Soon) | DIGIRINGO",
    description:
      "A DIGIRINGO podcast about running a small business by phone is in the planning stage. Short episodes on calls, texting and customer service. Get notified.",
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Podcast",
        h1: "Conversations about answering the phone well",
        sub: "We're planning short episodes on the unglamorous parts of customer contact: picking up, calling back, and texting without being annoying.",
        bullets: ["Short, practical episodes", "Small business focus", "No launch date yet"],
        layout: "center",
      },
      {
        type: "definition",
        title: "What it will cover",
        paragraphs: [
          "Phone habits that win jobs, voicemail greetings that don't sound robotic, texting etiquette, and how small teams handle call volume without a call center.",
          "Until the first episode is out, our blog covers the same ground in writing.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned episode ideas",
        cols: 3,
        tone: "plain",
        items: [
          { title: "The first five seconds of a call", icon: "phone-call", status: "soon" },
          { title: "Texting customers without annoying them", icon: "message", status: "soon" },
          { title: "What a missed call really costs", icon: "dollar", status: "soon" },
        ],
      },
      { type: "cta", title: "Read while you wait.", button: { label: "Visit the blog", href: "/blog" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Where will it be available?", a: "On the usual podcast apps. We'll list them at launch." },
          { q: "Can I be a guest?", a: "If you run a small business and have phone stories to share, get in touch through the contact page." },
        ],
      },
    ],
    related: ["/blog", "/webinars", "/community", "/blog/answer-business-phone-professionally"],
  },

  // ───────────────────────── /community ─────────────────────────
  {
    path: "/community",
    title: "Community (Coming Soon) | DIGIRINGO",
    description:
      "A DIGIRINGO community for customers to swap setups, call-flow ideas and texting tips is coming soon. In the meantime, our support team is one chat away.",
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Community",
        h1: "A place to compare notes with other users",
        sub: "We're planning a space where customers can share routing setups, ask questions and suggest features.",
        bullets: ["Ask and answer setup questions", "Share call-flow recipes", "Vote on roadmap features"],
        layout: "center",
      },
      {
        type: "cards",
        title: "Where to get help today",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Live chat", body: "Inside the app, from the support button.", icon: "messages", status: "live" },
          { title: "Templates", body: "Ready-made call-flow recipes.", icon: "route", href: "/templates", status: "live" },
          { title: "Blog guides", body: "Step-by-step articles.", icon: "file", href: "/blog", status: "live" },
        ],
      },
      { type: "callout", title: "Shape what we build", body: "Many items on our roadmap came from customer requests. Until the community opens, send yours through live chat and we'll log it.", tone: "plain" },
      { type: "cta", title: "Have a setup question today?", button: { label: "Contact us", href: "/contact" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Where can I request a feature now?", a: "Send it through live chat or the contact page. We read every request." },
          { q: "Will the community be public?", a: "We expect it to be readable by anyone, with posting for customers." },
        ],
      },
    ],
    related: ["/templates", "/blog", "/webinars", "/contact"],
  },

  // ───────────────────────── /customers ─────────────────────────
  {
    path: "/customers",
    title: "Who DIGIRINGO Is For | DIGIRINGO",
    description:
      "DIGIRINGO is built for solo pros, small teams, remote businesses and builders of AI voice agents. See which setup fits you, and share your own story with us.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Customers",
        h1: "Who DIGIRINGO is built for",
        sub: "We're a young product, so instead of polished case studies, here's an honest look at the businesses DIGIRINGO fits best today.",
        bullets: ["Solo owners and freelancers", "Small teams with one or a few lines", "Developers connecting voice AI"],
        shot: "home",
      },
      {
        type: "cards",
        title: "Good fits today",
        cols: 2,
        tone: "tint",
        items: [
          { title: "Trades and home services", body: "On a job site all day? Ring the app, forward to your cell, and let voicemail catch the rest.", icon: "wrench", href: "/solutions/home-services" },
          { title: "Consultants and freelancers", body: "A separate business number that keeps clients off your personal phone.", icon: "briefcase", href: "/solutions/small-business" },
          { title: "Businesses selling across borders", body: "Local numbers in the US, Canada and many other countries, with per-country call rates.", icon: "globe", href: "/rates" },
          { title: "AI and voice developers", body: "Route a real number to your SIP agent or webhook in minutes.", icon: "code", href: "/developers" },
        ],
      },
      {
        type: "callout",
        title: "Not a fit yet",
        body: "If you need a phone menu, call recording, team seats with roles, or CRM integrations today, those are still on our roadmap. We'd rather tell you now than after you sign up.",
      },
      {
        type: "steps",
        title: "Share your story",
        tone: "tint",
        items: [
          { title: "Tell us how you use DIGIRINGO", body: "A few lines through the contact page is plenty." },
          { title: "We'll follow up", body: "With your permission, we may feature your setup on this page." },
        ],
      },
      { type: "cta", title: "See if DIGIRINGO fits your business.", button: GET_NUMBER, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Why aren't there testimonials here?", a: "We only publish real stories with permission. As customers share theirs, we'll add them." },
          { q: "Is DIGIRINGO good for large teams?", a: "Not yet. Multi-user seats, shared numbers and ring groups are still coming." },
          { q: "Can I talk to someone about my use case?", a: "Yes, reach our team through the sales page." },
        ],
      },
    ],
    related: ["/solutions", "/features", "/sales", "/compare"],
  },
];

const TEMPLATE_PAGES: PageDoc[] = [
  // ───────────────────────── /templates ─────────────────────────
  {
    path: "/templates",
    title: "Call-Flow Templates for Small Business | DIGIRINGO",
    description:
      "Ready-made call-flow recipes for voicemail, business hours, front desks and field trades. Each shows what you can set up in DIGIRINGO today and what's next.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Templates",
        h1: "Call-flow recipes you can copy",
        sub: "Practical setups for common situations. Each template describes the ideal flow, the parts you can build in DIGIRINGO now, and the parts still on the roadmap.",
        bullets: ["Written for real small-business scenarios", "Clear 'today' vs 'coming soon' steps", "No code needed for most of them"],
        shot: "settings",
      },
      {
        type: "cards",
        title: "Browse templates",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Smart voicemail", body: "Ring, forward, then a voicemail you'll actually check.", icon: "voicemail", href: "/templates/smart-voicemail", status: "live" },
          { title: "Business hours + voicemail", body: "Answer during opening hours, voicemail after.", icon: "clock", href: "/templates/business-hours-with-voicemail", status: "beta" },
          { title: "Business hours + AI", body: "People by day, an AI agent at night.", icon: "bot", href: "/templates/business-hours-with-ai", status: "beta" },
          { title: "Property management", body: "Separate lines for tenants, owners and emergencies.", icon: "building", href: "/templates/property-management", status: "live" },
          { title: "Front desk", body: "One main number that every desk device answers.", icon: "headphones", href: "/templates/front-desk", status: "live" },
          { title: "Emergency plumber", body: "Never let an after-hours emergency ring out.", icon: "wrench", href: "/templates/emergency-plumber", status: "live" },
          { title: "Home services estimate", body: "Capture estimate requests from calls and texts.", icon: "home", href: "/templates/home-services-estimate", status: "live" },
        ],
      },
      {
        type: "definition",
        title: "What is a call flow?",
        paragraphs: [
          "A call flow is the path a call takes from the moment it rings until it ends: which phones ring, for how long, and what happens if nobody answers.",
          "Writing yours down, even as three lines, is the fastest way to stop missing calls. These templates give you a starting point.",
        ],
      },
      {
        type: "cards",
        title: "Building blocks available today",
        cols: 4,
        tone: "tint",
        items: [
          { title: "Ring all devices", icon: "phone-incoming", status: "live" },
          { title: "Forward to a cell", icon: "phone-forwarded", status: "live" },
          { title: "Voicemail", icon: "voicemail", status: "beta" },
          { title: "SIP / webhook route", icon: "webhook", status: "beta" },
        ],
      },
      { type: "cta", title: "Pick a template and set it up in minutes.", button: GET_NUMBER, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Can I import a template with one click?", a: "Not yet. Templates are written guides; you apply the settings yourself in a few steps." },
          { q: "Why do some steps say 'coming soon'?", a: "Some ideal flows need business-hours routing or phone menus, which aren't live yet. Each template shows a workaround." },
          { q: "Can I suggest a template?", a: "Yes, send us your scenario through the contact page." },
        ],
      },
    ],
    related: ["/product/call-routing", "/features/inbound-call-software", "/tools/voicemail-generator", "/blog/small-business-call-routing"],
  },

  // ───────────────────────── /templates/smart-voicemail ─────────────────────────
  {
    path: "/templates/smart-voicemail",
    title: "Smart Voicemail Call-Flow Template | DIGIRINGO",
    description:
      "A call flow that tries your app, then your cellphone, then takes a voicemail. Set it up in DIGIRINGO in three steps, with transcription coming later on.",
    crumbs: [TEMPLATES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Template",
        h1: "Smart voicemail: try every option before the beep",
        sub: "Callers only reach voicemail after the app and your cellphone have both had a chance to ring.",
        bullets: ["App rings first", "Cellphone second", "Voicemail last"],
        shot: "activity",
      },
      {
        type: "steps",
        title: "The flow",
        items: [
          { title: "Ring the app on all devices", body: "Browser and Android ring together for about 30 seconds.", status: "live" },
          { title: "Forward to your cellphone", body: "If nobody picks up, the call goes to your phone.", status: "live" },
          { title: "Record a voicemail", body: "The caller hears a standard greeting and leaves a message.", status: "beta" },
          { title: "Get it as text", body: "Read the message without playing it.", status: "soon" },
        ],
      },
      {
        type: "longform",
        title: "Set it up in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "1. Keep routing on 'App'", body: "This is the default for new numbers." },
          { title: "2. Add a forwarding number", body: "In settings, enter the cellphone for unanswered calls." },
          { title: "3. Sign in everywhere", body: "Web app on your computer, Android app on your phone, and allow notifications." },
        ],
      },
      {
        type: "cards",
        title: "Coming later for this flow",
        cols: 3,
        items: [
          { title: "Custom greeting", icon: "mic", status: "soon" },
          { title: "Voicemail to text", icon: "file", status: "soon", href: "/features/voicemail-to-text" },
          { title: "Missed-call text back", icon: "message", status: "soon" },
        ],
      },
      { type: "cta", title: "Write a greeting for when custom ones arrive.", button: { label: "Voicemail script generator", href: "/tools/voicemail-generator" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Will the caller hear ringing the whole time?", a: "Yes. They hear ringing while the app and then your cell are tried, then the greeting." },
          { q: "Is the forwarding leg billed?", a: "Yes, at the normal per-minute rate for the destination." },
        ],
      },
    ],
    related: ["/features/missed-call-service", "/product/voicemail", "/templates/business-hours-with-voicemail", "/blog/business-voicemail-greeting-examples"],
  },

  // ───────────────────────── /templates/business-hours-with-voicemail ─────────────────────────
  {
    path: "/templates/business-hours-with-voicemail",
    title: "Business Hours + Voicemail Template | DIGIRINGO",
    description:
      "Answer calls during opening hours and send the rest to voicemail. Automatic schedules are coming soon; here's how to run this flow in DIGIRINGO today.",
    crumbs: [TEMPLATES],
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "Template",
        h1: "Open hours to you, after hours to voicemail",
        sub: "Ring your devices while you're open and let callers leave a message once you've closed.",
        bullets: ["Calls ring during opening hours", "Voicemail after closing", "Automatic schedule coming soon"],
        shot: "settings",
      },
      {
        type: "steps",
        title: "The ideal flow",
        items: [
          { title: "Check the time", body: "Is the business open?", status: "soon" },
          { title: "Open: ring the app, then your cell", status: "live" },
          { title: "Closed: play an after-hours greeting", status: "soon" },
          { title: "Take a voicemail", status: "beta" },
        ],
      },
      {
        type: "longform",
        title: "How to run it today",
        intro: "Until business-hours routing ships, you control the schedule by hand.",
        tone: "tint",
        items: [
          { title: "During the day", body: "Stay signed in to the app and keep a forwarding number set." },
          { title: "At closing", body: "Sign out of the app or remove the forwarding number, so unanswered calls go to voicemail." },
          { title: "Developers", body: "A webhook route can check the time and return different TeXML for open and closed hours." },
        ],
      },
      { type: "cta", title: "Want automatic schedules? Get notified when they launch.", button: { label: "Business-hours routing", href: "/product/call-routing/business-hours-call-routing" }, tone: "dark" },
      { type: "callout", title: "Set a reminder", body: "A phone alarm at closing time is the simplest way to remember the switch. It takes ten seconds and saves you from a 9 p.m. sales call.", tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Can I set holiday hours?", a: "Not yet. Holiday schedules are planned as part of business-hours routing." },
          { q: "What does the caller hear after hours today?", a: "The standard voicemail greeting. Custom greetings are coming soon." },
        ],
      },
    ],
    related: ["/product/call-routing/business-hours-call-routing", "/product/call-routing/time-of-day-routing", "/templates/business-hours-with-ai", "/blog/after-hours-auto-reply-texts"],
  },

  // ───────────────────────── /templates/business-hours-with-ai ─────────────────────────
  {
    path: "/templates/business-hours-with-ai",
    title: "Business Hours + AI Agent Template | DIGIRINGO",
    description:
      "People answer during the day; your AI voice agent takes calls at night. Route a DIGIRINGO number to a SIP or webhook agent today; a built-in agent is coming.",
    crumbs: [TEMPLATES],
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "Template",
        h1: "Humans by day, an AI agent after hours",
        sub: "Callers always reach someone, or something, that can take their details and answer simple questions.",
        bullets: ["Team answers during opening hours", "Your AI voice agent covers nights", "Built-in DIGIRINGO agent coming soon"],
        shot: "settings",
      },
      {
        type: "steps",
        title: "The ideal flow",
        items: [
          { title: "Open: ring the app and your cell", status: "live" },
          { title: "Closed: hand off to an AI agent", body: "Today via SIP or webhook to an agent you run.", status: "beta" },
          { title: "Agent sends you a summary", body: "Depends on what your agent supports.", status: "beta" },
        ],
      },
      {
        type: "longform",
        title: "How to run it today",
        tone: "tint",
        items: [
          { title: "Option A: switch routes at closing", body: "Change the number's route to your SIP agent in the evening and back to 'App' in the morning." },
          { title: "Option B: a webhook that checks the time", body: "Your webhook returns TeXML that dials the app during the day and your agent's SIP address at night." },
          { title: "Option C: a second number", body: "Publish a dedicated after-hours line routed to your agent." },
        ],
      },
      {
        type: "cards",
        title: "Pieces of this flow",
        cols: 3,
        items: [
          { title: "SIP / AI agent route", icon: "bot", status: "beta", href: "/ai-agent" },
          { title: "Business-hours routing", icon: "clock", status: "soon" },
          { title: "Built-in AI receptionist", icon: "sparkles", status: "soon", href: "/product/ai/receptionist" },
        ],
      },
      { type: "cta", title: "Connect your AI agent to a real number.", button: { label: "Bring your AI agent", href: "/ai-agent" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Which AI agents work?", a: "Any voice agent that accepts calls over SIP, or that you can reach from a TeXML webhook." },
          { q: "Do I have to tell callers they're talking to AI?", a: "Laws vary. Being upfront is the safest choice, and some places require it." },
        ],
      },
    ],
    related: ["/ai-agent", "/product/ai/after-hours-answering-service", "/templates/business-hours-with-voicemail", "/developers"],
  },

  // ───────────────────────── /templates/property-management ─────────────────────────
  {
    path: "/templates/property-management",
    title: "Property Management Call-Flow Template | DIGIRINGO",
    description:
      "A phone setup for property managers: one line for tenants, one for owners and leasing, and an emergency line that forwards to whoever is on call tonight.",
    crumbs: [TEMPLATES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Template",
        h1: "Separate lines for tenants, owners and emergencies",
        sub: "Property managers juggle very different callers. Giving each group its own number means you know who's calling, and how urgent it is, before you answer.",
        bullets: ["Tenant line with voicemail", "Leasing line that rings the app", "Emergency line forwarded to the on-call phone"],
        shot: "numbers",
      },
      {
        type: "table",
        title: "The setup",
        head: ["Number", "Route", "Status"],
        rows: [
          ["Tenant line", "App, then cell, then voicemail", "Live"],
          ["Leasing / prospects", "App on all devices", "Live"],
          ["Maintenance emergency", "Forward to on-call cellphone", "Live"],
          ["Phone menu on one number", "Press 1 tenant, 2 leasing…", "Coming soon"],
        ],
        tone: "tint",
      },
      {
        type: "longform",
        title: "Set it up in DIGIRINGO",
        items: [
          { title: "Buy three local numbers", body: "$2.50/month each in the US." },
          { title: "Route the emergency line", body: "Set it to forward to a phone. Change the number when the on-call person changes." },
          { title: "Text tenants from the tenant line", body: "Register for 10DLC first, then send maintenance updates by SMS." },
        ],
      },
      { type: "cta", title: "Set up your three lines.", button: GET_NUMBER, tone: "dark" },
      { type: "callout", title: "Publish the emergency line separately", body: "Put the emergency number on lease paperwork and building notices, apart from the office line, so tenants know which one to use when it can't wait.", tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Can I use one number with a menu instead?", a: "Phone menus are coming soon. Until then, separate numbers are the most reliable way to sort calls." },
          { q: "Can several staff share the tenant line?", a: "Shared numbers and team seats are coming soon. Today you can forward a line to a staff member's cell." },
        ],
      },
    ],
    related: ["/solutions/property-management", "/answering-service/property-management", "/phone-numbers/multiple-phone-lines", "/templates/front-desk"],
  },

  // ───────────────────────── /templates/front-desk ─────────────────────────
  {
    path: "/templates/front-desk",
    title: "Front Desk Call-Flow Template | DIGIRINGO",
    description:
      "One main number that rings every front-desk device at once, falls back to a manager's cell, and takes a voicemail last. A simple flow you can set up today.",
    crumbs: [TEMPLATES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Template",
        h1: "A front desk that never lets the phone ring out",
        sub: "Every computer and tablet at the desk rings together. If the desk is busy, a manager's phone is next.",
        bullets: ["All desk devices ring at once", "Manager's cell as backup", "Voicemail if both are busy"],
        shot: "home",
      },
      {
        type: "steps",
        title: "The flow",
        items: [
          { title: "Ring every signed-in device", body: "Front-desk computers and tablets in the browser.", status: "live" },
          { title: "Forward to the manager", body: "After about 30 seconds unanswered.", status: "live" },
          { title: "Voicemail", status: "beta" },
          { title: "Transfer to a colleague", body: "Pass a call to another staff member.", status: "soon" },
        ],
      },
      {
        type: "longform",
        title: "Tips for the desk",
        tone: "tint",
        items: [
          { title: "Use headsets", body: "A USB or Bluetooth headset sounds better than a laptop mic and keeps hands free." },
          { title: "Pin the tab", body: "Keep the web app pinned and allow notifications so calls ring even when the tab isn't active." },
          { title: "Answer with a script", body: "A consistent greeting sounds professional. See our post on answering the phone." },
        ],
      },
      { type: "cta", title: "Get a main number for the front desk.", button: GET_NUMBER, tone: "dark" },
      { type: "callout", title: "Coming next for desks", body: "Team seats, ring groups and call transfer will let each person sign in separately and pass calls between them. Until then, one shared account keeps every desk ringing.", tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Can each desk person have their own login?", a: "Not yet. Multi-user seats are coming soon. Today the desk devices share one account." },
          { q: "Can we put callers on hold?", a: "Yes. Hold, mute and the keypad work during any call. Hold music is coming soon." },
        ],
      },
    ],
    related: ["/product/call-routing/simultaneous-ring", "/features/ring-groups", "/templates/property-management", "/blog/answer-business-phone-professionally"],
  },

  // ───────────────────────── /templates/emergency-plumber ─────────────────────────
  {
    path: "/templates/emergency-plumber",
    title: "Emergency Plumber Call-Flow Template | DIGIRINGO",
    description:
      "An after-hours flow for plumbers and other emergency trades: calls go straight to the on-call tech's cellphone so a burst pipe never reaches voicemail.",
    crumbs: [TEMPLATES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Template",
        h1: "Burst pipe at 2 a.m.? Someone answers.",
        sub: "Emergency jobs are often the best-paying ones, and the callers won't wait. This flow sends them straight to whoever is on call.",
        bullets: ["Dedicated emergency number", "Forwards directly to the on-call cellphone", "Voicemail only as a last resort"],
        shot: "calls",
      },
      {
        type: "steps",
        title: "The flow",
        items: [
          { title: "Caller dials the emergency line", status: "live" },
          { title: "Forward straight to the on-call tech", body: "No app ringing first, so there's no delay.", status: "live" },
          { title: "Fallback voicemail", status: "beta" },
          { title: "Auto-text the caller an ETA", status: "soon" },
        ],
      },
      {
        type: "longform",
        title: "Set it up",
        tone: "tint",
        items: [
          { title: "Buy a separate number", body: "Advertise it as your 24/7 line, apart from your office number." },
          { title: "Set route to 'Forward to phone'", body: "Enter the on-call tech's cellphone." },
          { title: "Swap at shift change", body: "Update the forwarding number when the rotation changes." },
        ],
      },
      { type: "cta", title: "How much are missed emergency calls costing you?", button: { label: "Missed-call cost calculator", href: "/tools/missed-call-cost-calculator" }, tone: "dark" },
      { type: "callout", title: "Tell callers what to expect", body: "On the forwarded call, answer with your business name and confirm the address first. It reassures a stressed caller and avoids crossed wires.", tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Can the rotation switch automatically?", a: "Not yet. Schedules are part of business-hours routing, which is coming soon." },
          { q: "What does forwarding cost?", a: "$0.015/min to US and Canadian phones." },
        ],
      },
    ],
    related: ["/answering-service/plumbing", "/solutions/home-services", "/templates/home-services-estimate", "/blog/cost-of-missed-calls"],
  },

  // ───────────────────────── /templates/home-services-estimate ─────────────────────────
  {
    path: "/templates/home-services-estimate",
    title: "Home Services Estimate Call-Flow Template | DIGIRINGO",
    description:
      "Turn estimate calls into booked visits: ring the office, forward to the field, then follow up by text. A flow for roofers, HVAC, cleaners and other trades.",
    crumbs: [TEMPLATES],
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Template",
        h1: "From 'can I get a quote?' to a booked visit",
        sub: "Estimate requests are where jobs start. This flow makes sure every one gets answered and followed up in writing.",
        bullets: ["Office and field both get the call", "Text to confirm the visit", "Callback from history if you miss it"],
        shot: "chat",
      },
      {
        type: "steps",
        title: "The flow",
        items: [
          { title: "Ring the office app", status: "live" },
          { title: "Forward to the estimator's cell", status: "live" },
          { title: "Text the customer to confirm a time", body: "From the same business number.", status: "live" },
          { title: "Missed? Call back from history", status: "beta" },
          { title: "Auto-reply to texts after hours", status: "soon" },
        ],
      },
      {
        type: "longform",
        title: "Make it work",
        tone: "tint",
        items: [
          { title: "Register for texting early", body: "10DLC approval takes 1 to 7 days, so do it before your busy season." },
          { title: "Use a local number", body: "Homeowners answer local area codes more readily than unknown ones." },
          { title: "Confirm in writing", body: "A text with the date, time and address cuts no-shows on both sides." },
        ],
      },
      { type: "cta", title: "Get a local number for estimates.", button: GET_NUMBER, tone: "dark" },
      { type: "callout", title: "Answer fast, confirm in writing", body: "Estimate requests often go to whoever responds first. A quick callback followed by a confirmation text covers both speed and clarity.", tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Can customers send photos of the job?", a: "Picture messages (MMS) are coming soon. Today, texts are SMS only." },
          { q: "Can I schedule the reminder text?", a: "Scheduled messages are on the roadmap. Send the reminder manually for now." },
        ],
      },
    ],
    related: ["/solutions/home-services", "/features/business-sms-mms", "/templates/emergency-plumber", "/blog/business-text-message-templates"],
  },
];

const SKILL_PAGES: PageDoc[] = [
  // ───────────────────────── /skills ─────────────────────────
  {
    path: "/skills",
    title: "AI Agent Skills for Your Phone (Soon) | DIGIRINGO",
    description:
      "Skills are planned AI recipes that read your calls and texts and produce reports, coaching and follow-ups. None are live yet; here's what's on the roadmap.",
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Skills",
        h1: "Ready-made AI recipes for your phone data",
        sub: "We're planning a library of skills: small, focused AI tasks that turn your call logs and messages into something useful, like a daily report or a follow-up plan.",
        bullets: ["One task per skill", "Runs on your call and text history", "You review every output"],
        shot: "activity",
      },
      {
        type: "definition",
        title: "What is an AI agent skill?",
        paragraphs: [
          "A skill is a packaged set of instructions an AI assistant follows to do one job well, such as 'summarize yesterday's calls' or 'draft follow-up texts for missed callers'.",
          "Skills will depend on features that are still coming, including call recording, transcripts and our MCP connector. We're listing them now so you can tell us which matter most.",
        ],
      },
      {
        type: "cards",
        title: "Planned skills",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Call log digest", icon: "list", href: "/skills/call-log", status: "soon" },
          { title: "Daily report", icon: "calendar", href: "/skills/daily-report-template", status: "soon" },
          { title: "Sales call coaching", icon: "headphones", href: "/skills/sales-call-coaching", status: "soon" },
          { title: "Sales call report", icon: "chart", href: "/skills/sales-call-report", status: "soon" },
          { title: "Win/loss analysis", icon: "scale", href: "/skills/win-loss-analysis", status: "soon" },
          { title: "3-month drip", icon: "send", href: "/skills/3-month-drip", status: "soon" },
          { title: "Voicemail triage", icon: "voicemail", href: "/skills/voicemail-triage", status: "soon" },
        ],
      },
      { type: "callout", title: "Tell us which skill to build first", body: "We'll prioritize the skills customers ask for most. Use 'Get notified' on any skill page to cast your vote.", tone: "dark" },
      { type: "cta", title: "Already running an AI agent? Connect it today.", button: { label: "Bring your AI agent", href: "/ai-agent" }, tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Which AI assistants will skills work with?", a: "We're designing them around an MCP connector, which several assistants support. Details will come at launch." },
          { q: "Can I use anything like this today?", a: "If you run your own AI agent, you can route calls to it by SIP or webhook. Skills on top of your history aren't available yet." },
          { q: "Will my data leave DIGIRINGO?", a: "Only to the assistant you connect, and only when you run a skill. We'll document this clearly before launch." },
        ],
      },
    ],
    related: ["/product/ai/mcp", "/product/assistant", "/product/ai", "/integrations/claude"],
  },

  // ───────────────────────── /skills/call-log ─────────────────────────
  {
    path: "/skills/call-log",
    title: "Call Log Digest AI Skill (Coming Soon) | DIGIRINGO",
    description:
      "A planned AI skill that reads your call log and tells you who to call back first, which numbers are repeat callers, and when calls peak. Not available yet.",
    crumbs: [SKILLS],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Skill",
        h1: "Your call log, turned into a to-do list",
        sub: "This skill will scan recent calls and highlight what needs attention: missed callers, repeat callers and unusually long or short calls.",
        bullets: ["Missed calls not yet returned", "Repeat callers this week", "Busiest hours of the day"],
        shot: "calls",
      },
      {
        type: "definition",
        title: "How it will work",
        paragraphs: [
          "You connect an AI assistant to DIGIRINGO and ask for a call log digest. The skill reads your call history, groups it, and returns a short list sorted by urgency.",
          "It only needs call metadata (numbers, times, durations), so it won't depend on recording.",
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Open Calls in the app", body: "Filter mentally for missed calls and return them." },
          { title: "Call back in one tap", body: "From the same number they dialed." },
        ],
      },
      {
        type: "cards",
        title: "What the digest will flag",
        cols: 3,
        tone: "plain",
        items: [
          { title: "Unreturned missed calls", icon: "phone-missed", status: "soon" },
          { title: "Repeat callers", icon: "repeat", status: "soon" },
          { title: "Peak call hours", icon: "clock", status: "soon" },
        ],
      },
      { type: "cta", title: "Your call history is already being kept.", button: { label: "Get your number", href: "/app" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Does it need call recording?", a: "No, just the call history that DIGIRINGO already keeps." },
          { q: "When is it coming?", a: "After our MCP connector. No date yet." },
        ],
      },
    ],
    related: ["/skills", "/product/call-analytics/call-logs", "/skills/daily-report-template", "/features/callback-service"],
  },

  // ───────────────────────── /skills/daily-report-template ─────────────────────────
  {
    path: "/skills/daily-report-template",
    title: "Daily Phone Report AI Skill (Coming Soon) | DIGIRINGO",
    description:
      "A planned AI skill that writes an end-of-day report: calls taken, calls missed, texts sent and follow-ups due. Not live yet. Get notified when it ships.",
    crumbs: [SKILLS],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Skill",
        h1: "An end-of-day phone report, written for you",
        sub: "A short summary of the day's calls and texts, plus the follow-ups you still owe.",
        bullets: ["Calls answered vs missed", "Texts sent and received", "Open follow-ups for tomorrow"],
        shot: "activity",
      },
      {
        type: "longform",
        title: "A sample report outline",
        tone: "tint",
        items: [
          { title: "Today in numbers", body: "Total calls, missed calls, total talk time, texts sent." },
          { title: "Still waiting on you", body: "Missed callers not returned and texts with no reply." },
          { title: "Notable", body: "First-time callers and anyone who called more than once." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        items: [
          { title: "Check Activity before you log off", body: "The timeline shows the day's calls and texts." },
          { title: "Copy this outline", body: "Use it as a manual checklist until the skill is ready." },
        ],
      },
      { type: "callout", title: "Five minutes at the end of the day", body: "Even without the skill, a quick review of missed calls and unanswered texts before you log off catches most dropped leads.", tone: "plain" },
      { type: "cta", title: "See what's in your Activity tab.", button: { label: "Open the web app", href: "/app" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Can it be emailed automatically?", a: "Scheduled delivery is something we're considering for launch." },
          { q: "Does it cost extra?", a: "Pricing isn't set yet." },
        ],
      },
    ],
    related: ["/skills", "/skills/call-log", "/product/analytics", "/skills/sales-call-report"],
  },

  // ───────────────────────── /skills/sales-call-coaching ─────────────────────────
  {
    path: "/skills/sales-call-coaching",
    title: "Sales Call Coaching AI Skill (Coming Soon) | DIGIRINGO",
    description:
      "A planned AI skill that reviews sales call transcripts and suggests what to try next time. It needs call recording, which is also coming soon to DIGIRINGO.",
    crumbs: [SKILLS],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Skill",
        h1: "Feedback on your sales calls, without a sales manager",
        sub: "This skill will read a call transcript and point out what went well, where the customer hesitated, and one thing to try next time.",
        bullets: ["Talk-to-listen balance", "Questions you asked (or didn't)", "One concrete suggestion per call"],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What it depends on",
        paragraphs: [
          "Coaching needs a transcript, and transcripts need call recording. Both are on the roadmap, so this skill will follow them.",
          "Recording will come with consent notices, since many states and countries require all parties to agree.",
        ],
      },
      {
        type: "cards",
        title: "Required pieces",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Call recording", icon: "mic", status: "soon", href: "/product/call-recording" },
          { title: "Transcription", icon: "file", status: "soon", href: "/features/call-transcriptions" },
          { title: "MCP connector", icon: "plug", status: "soon", href: "/product/ai/mcp" },
        ],
      },
      { type: "callout", title: "Coaching, not surveillance", body: "The skill will be designed for self-review. You choose which calls to analyze, and nothing is shared unless you share it.", tone: "dark" },
      { type: "cta", title: "Selling by phone? See our sales setup.", button: { label: "Phones for sales teams", href: "/solutions/sales" }, tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "Will it score my calls?", a: "We're leaning toward plain-language feedback rather than scores." },
          { q: "Can I try something similar now?", a: "If your own AI agent handles calls via SIP, it may offer its own analysis." },
        ],
      },
    ],
    related: ["/skills", "/skills/sales-call-report", "/solutions/sales", "/features/call-summary"],
  },

  // ───────────────────────── /skills/sales-call-report ─────────────────────────
  {
    path: "/skills/sales-call-report",
    title: "Sales Call Report AI Skill (Coming Soon) | DIGIRINGO",
    description:
      "A planned AI skill that turns a week of sales calls into a short report: who you spoke with, deal stage and next step. Not available yet in DIGIRINGO.",
    crumbs: [SKILLS],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Skill",
        h1: "A weekly sales report from your actual calls",
        sub: "Instead of filling in a spreadsheet on Friday, ask for a report built from the week's conversations.",
        bullets: ["Who you spoke with", "Where each deal stands", "Next step for each lead"],
        shot: "calls",
      },
      {
        type: "longform",
        title: "What the report will include",
        tone: "tint",
        items: [
          { title: "Activity", body: "Calls and texts per lead, with dates.", status: "soon" },
          { title: "Status", body: "A best guess at deal stage from what was said.", status: "soon" },
          { title: "Next steps", body: "Follow-ups that were promised on calls.", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        items: [
          { title: "Use call history as your activity log", body: "Every call has a time and duration." },
          { title: "Confirm next steps by text", body: "It gives both you and the customer a written record." },
        ],
      },
      { type: "cta", title: "Keep your activity log clean from day one.", button: { label: "Get your number", href: "/app" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Will it sync to my CRM?", a: "CRM integrations are planned separately. See the integrations page." },
          { q: "Does it need recording?", a: "The full version does. A lighter version based only on call history may come first." },
        ],
      },
    ],
    related: ["/skills", "/skills/sales-call-coaching", "/skills/win-loss-analysis", "/integrations"],
  },

  // ───────────────────────── /skills/win-loss-analysis ─────────────────────────
  {
    path: "/skills/win-loss-analysis",
    title: "Win/Loss Analysis AI Skill (Coming Soon) | DIGIRINGO",
    description:
      "A planned AI skill that compares won and lost deals across your calls and texts to spot patterns in objections, pricing questions and response time.",
    crumbs: [SKILLS],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Skill",
        h1: "Why you win some deals and lose others",
        sub: "This skill will look across conversations with customers you won and lost, and point out what was different.",
        bullets: ["Common objections", "How fast you responded", "Pricing questions that came up"],
        shot: "inbox",
      },
      {
        type: "definition",
        title: "How it will work",
        paragraphs: [
          "You tag a set of contacts as won or lost. The skill reviews their calls and texts and writes a short comparison, with examples.",
          "It needs contact tags and transcripts, which are both coming soon, so this is one of the later skills on our list.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Signals it will compare",
        cols: 3,
        tone: "plain",
        items: [
          { title: "Time to first reply", icon: "clock", status: "soon" },
          { title: "Objections raised", icon: "messages", status: "soon" },
          { title: "Pricing questions", icon: "dollar", status: "soon" },
        ],
      },
      { type: "callout", title: "Small samples, careful conclusions", body: "With only a handful of deals, patterns can be coincidence. The skill will say how confident it is rather than presenting guesses as facts.", tone: "dark" },
      { type: "cta", title: "Start building your history now.", button: { label: "Get your number", href: "/app" }, tone: "plain" },
      {
        type: "faq",
        items: [
          { q: "How many deals does it need?", a: "Patterns get clearer with more examples. We'll publish guidance at launch." },
          { q: "Can I do this manually now?", a: "Yes. Review texts with won and lost customers side by side and note response times from call history." },
          { q: "Is it part of a CRM?", a: "It will work with our planned contact features." },
        ],
      },
    ],
    related: ["/skills", "/skills/sales-call-report", "/product/crm", "/solutions/sales"],
  },

  // ───────────────────────── /skills/3-month-drip ─────────────────────────
  {
    path: "/skills/3-month-drip",
    title: "3-Month Text Drip AI Skill (Coming Soon) | DIGIRINGO",
    description:
      "A planned AI skill that drafts a 3-month follow-up text sequence for a lead, based on your past conversation. Needs scheduled messages, coming soon too.",
    crumbs: [SKILLS],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Skill",
        h1: "Stay in touch for three months without nagging",
        sub: "Give the skill a lead and it will draft a short series of follow-up texts, spaced out and tied to what you discussed.",
        bullets: ["Five or six messages over 90 days", "Based on your actual conversation", "You approve every message"],
        shot: "chat",
      },
      {
        type: "longform",
        title: "A sample sequence",
        tone: "tint",
        items: [
          { title: "Day 1", body: "Thanks for the call, with the one detail they asked about." },
          { title: "Week 2", body: "A useful tip related to their project." },
          { title: "Month 1", body: "A check-in: has anything changed?" },
          { title: "Month 3", body: "A last, low-pressure note with how to reach you." },
        ],
      },
      {
        type: "callout",
        title: "Consent still applies",
        body: "Follow-up texts need the recipient's permission and must honor STOP replies. The skill will only work with numbers covered by your 10DLC campaign.",
      },
      { type: "cta", title: "Text opted-in customers from your business number today.", button: { label: "See business texting", href: "/features/business-sms-mms" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "Can it send the texts automatically?", a: "That needs scheduled messages, which are coming soon. You'll approve the sequence first." },
          { q: "Where can I read about opt-in rules?", a: "See our SMS opt-in consent guide on the blog." },
        ],
      },
    ],
    related: ["/skills", "/product/messaging/automated-text-messages", "/blog/sms-opt-in-consent-guide", "/fair-use"],
  },

  // ───────────────────────── /skills/voicemail-triage ─────────────────────────
  {
    path: "/skills/voicemail-triage",
    title: "Voicemail Triage AI Skill (Coming Soon) | DIGIRINGO",
    description:
      "A planned AI skill that sorts your voicemails by urgency and drafts a reply for each one. It relies on voicemail-to-text, which is also coming to DIGIRINGO.",
    crumbs: [SKILLS],
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Skill",
        h1: "Urgent voicemails first, the rest after lunch",
        sub: "This skill will read transcribed voicemails, rank them by urgency and suggest a quick text or call back for each.",
        bullets: ["Sorted by urgency", "Caller's request in one line", "Suggested reply for each"],
        shot: "activity",
      },
      {
        type: "cards",
        title: "What it needs",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Recorded voicemail", icon: "voicemail", status: "beta" },
          { title: "Voicemail to text", icon: "file", status: "soon", href: "/features/voicemail-to-text" },
          { title: "MCP connector", icon: "plug", status: "soon", href: "/product/ai/mcp" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        items: [
          { title: "Forward to your cell first", body: "So fewer calls reach voicemail at all." },
          { title: "Return missed calls from history", body: "Even without listening, you know who called." },
        ],
      },
      { type: "cta", title: "Catch more calls before they reach voicemail.", button: { label: "Missed call service", href: "/features/missed-call-service" }, tone: "dark" },
      {
        type: "faq",
        items: [
          { q: "How will it decide what's urgent?", a: "From words in the message, like 'leak', 'today' or 'cancel', and from whether the caller has called before." },
          { q: "Will it reply for me?", a: "No. It drafts replies; you choose whether to send them." },
        ],
      },
    ],
    related: ["/skills", "/product/voicemail", "/features/voicemail-to-text", "/templates/smart-voicemail"],
  },
];

export const PAGES: PageDoc[] = [
  ...FEATURE_PAGES,
  ...SOON_FEATURE_PAGES,
  ...NUMBER_PAGES,
  ...TEMPLATE_PAGES,
  ...SKILL_PAGES,
];
