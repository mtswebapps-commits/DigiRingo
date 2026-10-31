import type { Block, Faq, Item, LinkRef, PageDoc, Shot } from "../types";

/* ------------------------------------------------------------------ */
/* Solutions: /solutions index + 12 industry / team pages              */
/* ------------------------------------------------------------------ */

const SOLUTION_CRUMBS: LinkRef[] = [{ label: "Solutions", href: "/solutions" }];

const SOLUTIONS: PageDoc[] = [
  /* ---------------- /solutions ---------------- */
  {
    path: "/solutions",
    title: "Business Phone Solutions by Industry | DIGIRINGO",
    description:
      "See how trades, law offices, clinics, landlords, schools, startups and sales or support teams use DIGIRINGO numbers, calling, SMS and forwarding every day.",
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Solutions",
        h1: "One business number, set up for the way your work actually runs",
        sub: "A plumber on a roof, a lawyer in court and a support lead at a desk need different things from a phone. Pick your industry or team to see what DIGIRINGO does for it today, and what is still on the way.",
        bullets: [
          "Local, toll-free and international numbers from $2.50/month",
          "Calls ring your browser and Android phone at once, then forward to your cell",
          "Pay as you go: $0.015/min and $0.015/text in the US and Canada",
        ],
        shot: "home",
      },
      {
        type: "cards",
        eyebrow: "By industry",
        title: "Solutions for your line of work",
        cols: 3,
        items: [
          { title: "Home services", body: "Catch emergency jobs and estimate requests while you're on a ladder or under a sink.", icon: "wrench", href: "/solutions/home-services", status: "live" },
          { title: "Law firms", body: "Keep client calls off your personal cell and make sure no new-matter call slips by.", icon: "scale", href: "/solutions/law-firms", status: "live" },
          { title: "Property management", body: "One number for tenants, owners and vendors, with after-hours calls forwarded to whoever is on duty.", icon: "building", href: "/solutions/property-management", status: "live" },
          { title: "Healthcare", body: "A front-desk line for small practices: appointment calls, reminders by text and a voicemail backstop.", icon: "stethoscope", href: "/solutions/healthcare", status: "live" },
          { title: "Education", body: "Tutoring centers, private schools and coaches reach parents without giving out a personal number.", icon: "graduation", href: "/solutions/education", status: "live" },
          { title: "Startups", body: "Numbers in the US, Canada and many other countries, plus webhook and SIP routing for builders.", icon: "rocket", href: "/solutions/startups", status: "live" },
          { title: "Small business", body: "A real business line on the phone and laptop you already own, without a contract.", icon: "store", href: "/solutions/small-business", status: "live" },
          { title: "Franchise", body: "A local number for every location so each shop answers its own neighborhood.", icon: "map-pin", href: "/solutions/franchise", status: "live" },
          { title: "Construction", body: "Reach crews, subs and clients from the job site, and stop losing bids to voicemail.", icon: "truck", href: "/solutions/construction", status: "live" },
        ],
      },
      {
        type: "cards",
        eyebrow: "By team",
        title: "Solutions for your team",
        tone: "tint",
        cols: 3,
        items: [
          { title: "Sales", body: "Call prospects from a local number at $0.015/min in the US and Canada, and follow up by text.", icon: "briefcase", href: "/solutions/sales", status: "live" },
          { title: "Customer support", body: "A toll-free or local support line that rings every device and never dead-ends.", icon: "headphones", href: "/solutions/support", status: "live" },
          { title: "Operations", body: "Route each number where it needs to go: the app, a phone, a SIP agent or your own webhook.", icon: "route", href: "/solutions/operations", status: "live" },
        ],
      },
      {
        type: "callout",
        title: "Looking for someone to answer the phone?",
        body: "Our answering-service pages cover 19 industries, from HVAC to accounting. They explain how DIGIRINGO keeps calls from going unanswered today, with forwarding, voicemail and your own AI or SIP agent, and where our built-in AI receptionist fits once it ships.",
        tone: "dark",
      },
      {
        type: "chips",
        title: "Answering service by industry",
        links: [
          { label: "Answering service overview", href: "/answering-service" },
          { label: "Plumbing", href: "/answering-service/plumbing" },
          { label: "HVAC", href: "/answering-service/hvac" },
          { label: "Legal", href: "/answering-service/legal" },
          { label: "Property management", href: "/answering-service/property-management" },
          { label: "Real estate", href: "/answering-service/real-estate" },
          { label: "Salon", href: "/answering-service/salon" },
        ],
      },
      {
        type: "steps",
        title: "How to get started, whatever your industry",
        items: [
          { title: "Pick a number", body: "Search by area code, city or digits. Local and toll-free numbers go live in minutes; some countries need documents first.", icon: "search" },
          { title: "Top up your wallet", body: "Add $5, $10, $20 or $50 by card. Your number and usage come out of the balance. No contract.", icon: "wallet" },
          { title: "Sign in everywhere you work", body: "Open the web app on your laptop and install the Android app. Add your cellphone as the forwarding backup.", icon: "smartphone" },
        ],
      },
      {
        type: "cta",
        title: "Pick a number and start taking business calls today",
        button: { label: "Get your number", href: "/app" },
        tone: "brand",
      },
      {
        type: "faq",
        items: [
          { q: "Do I need a different plan for my industry?", a: "No. Every account gets the same features and pay-as-you-go pricing. The solution pages simply show how different businesses tend to set things up." },
          { q: "Can my whole team share one DIGIRINGO number?", a: "Not yet. Shared numbers, team seats and ring groups across team members are coming. Today each person signs in with their own account, and a number rings every device that account is signed in on." },
          { q: "Is there an iPhone app?", a: "Not yet. iPhone users can use the DIGIRINGO web app in Safari. Android users can install our app from Google Play." },
          { q: "What does it cost to run?", a: "A US local number is $2.50/month and toll-free starts at $2.50/month. Calls and texts in the US and Canada are $0.015 each per minute or message. International rates are on our rate list." },
        ],
      },
    ],
    related: ["/answering-service", "/pricing", "/product", "/features"],
  },

  /* ---------------- /solutions/home-services ---------------- */
  {
    path: "/solutions/home-services",
    title: "Phone System for Home Service Businesses | DIGIRINGO",
    description:
      "A business number for plumbers, electricians, cleaners and HVAC techs. Calls ring your phone and laptop, forward to your cell, and texts confirm every job.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Home services",
        h1: "Answer the job, not just the phone",
        sub: "When you're elbow-deep in a crawlspace, the next customer is already dialing. DIGIRINGO rings your Android phone and laptop together, forwards to your cell if you can't get to it, and keeps every missed call in a list you can return between jobs.",
        bullets: [
          "Local number in your service area from $2.50/month",
          "Text arrival windows and photos-of-the-problem requests by SMS",
          "Voicemail catches the caller when your hands are full",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What a home service business needs from a phone",
        paragraphs: [
          "Most home service work starts with a phone call from someone who has a problem right now: no hot water, a breaker that keeps tripping, a carpet that needs cleaning before guests arrive. If you don't pick up, they call the next company on the search page.",
          "A business phone for the trades has to reach you on site, separate business calls from personal ones, and let you confirm jobs by text without handing out your own cell number. That's the gap DIGIRINGO fills.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Why trades and service crews use DIGIRINGO",
        cols: 4,
        items: [
          { title: "Rings wherever you are", body: "Phone in your pocket, tablet in the truck, laptop at the office: every signed-in device rings at once.", icon: "phone-incoming" },
          { title: "Cell backup", body: "No answer in about 30 seconds? The call forwards to your regular cellphone so it still reaches you.", icon: "phone-forwarded" },
          { title: "Text the customer", body: "Send 'On my way, 20 minutes out' from your business number after 10DLC registration.", icon: "message" },
          { title: "Callback list", body: "Call history shows every missed call with the number and time, so nobody waits until tomorrow.", icon: "list" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "A number that looks local", body: "Customers trust a number with their own area code. Pick one from the city you serve, or add a second number for a neighboring town and see which one rings.", shot: "buy", icon: "map-pin" },
          { title: "Texts that save a trip", body: "Ask for the model number on the water heater or the address gate code before you drive out. Threads stay organized per number, with delivery receipts.", shot: "chat", icon: "messages" },
          { title: "Call from the dashboard", body: "Back at the shop, return calls from the browser with your business caller ID instead of your personal cell.", shot: "dialer", icon: "laptop" },
        ],
      },
      {
        type: "steps",
        title: "How to set up a home services line in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Choose a local number", body: "Search by your city or area code and buy it from your wallet.", icon: "search" },
          { title: "Add your cellphone for forwarding", body: "Set the phone that should get the call when the app isn't answered.", icon: "phone-forwarded" },
          { title: "Register for business texting", body: "Use the Trust Center to complete A2P 10DLC so your texts get delivered. Carrier approval takes 1 to 7 days.", icon: "shield" },
          { title: "Put the number on your truck and site", body: "Use it on your vehicle, invoices, yard signs and Google profile.", icon: "truck" },
        ],
      },
      {
        type: "tabs",
        title: "What works today, and what's coming",
        tabs: [
          {
            name: "Available now",
            items: [
              { title: "Simultaneous ring", body: "Browser and Android ring together.", status: "live" },
              { title: "Forward to cell", body: "Unanswered calls go to your phone.", status: "live" },
              { title: "Voicemail", body: "Recorded with a standard greeting.", status: "live" },
              { title: "Two-way SMS", body: "Threaded texting from your number.", status: "live" },
            ],
          },
          {
            name: "Coming soon",
            items: [
              { title: "Missed-call auto-reply", body: "Text back automatically when you can't answer.", status: "soon" },
              { title: "AI receptionist", body: "Take job details when you're on a call.", status: "soon" },
              { title: "Business-hours routing", body: "Different handling after 6 p.m.", status: "soon" },
              { title: "Picture messages (MMS)", body: "Receive photos of the problem.", status: "soon" },
            ],
          },
        ],
      },
      {
        type: "cta",
        title: "Get a local number for your service area",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can customers text me photos of the problem?", a: "Not yet. Picture messages (MMS) are coming soon. Plain two-way SMS works today on US and Canada numbers after 10DLC registration." },
          { q: "What if I'm on a job and two calls come in?", a: "The first rings your devices. If you don't answer, it forwards to your cell and then voicemail. Every call, answered or not, shows in call history so you can call back." },
          { q: "Can my office manager answer while I'm in the field?", a: "If they sign in to the same account, their browser rings too. Separate team seats and ring groups are coming soon." },
          { q: "Do I need a contract?", a: "No. You pay $2.50/month for a US local number plus $0.015 per minute or text in the US and Canada, from a prepaid wallet." },
        ],
      },
    ],
    related: ["/answering-service/plumbing", "/answering-service/hvac", "/solutions/construction", "/product/call-forwarding"],
  },

  /* ---------------- /solutions/law-firms ---------------- */
  {
    path: "/solutions/law-firms",
    title: "Business Phone for Law Firms and Solo Attorneys | DIGIRINGO",
    description:
      "A separate law office number for solo attorneys and small firms. Take intake calls on any device, forward to your cell from court, and keep a log of every call.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Law firms",
        h1: "A professional line for your practice, without the desk phone",
        sub: "Potential clients usually call one firm and hire the first lawyer who calls back. DIGIRINGO gives your practice a dedicated number that rings your laptop and phone, forwards when you're in a hearing, and keeps your personal cell private.",
        bullets: [
          "Dedicated office number, separate from your personal phone",
          "Call history to make sure every intake call gets returned",
          "Text appointment confirmations from the firm's number",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "Why lawyers need a separate business number",
        paragraphs: [
          "When a client has your cell number, they call it at 10 p.m. on a Sunday, and your call log becomes part of your personal life. A separate firm number lets you decide when you're reachable and keeps client communication in one place.",
          "Solo attorneys and small firms also need to look established. A local number with your city's area code, answered on any device, does that without paying for a full office phone system.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What DIGIRINGO does for a law practice",
        cols: 3,
        items: [
          { title: "Intake calls that land", body: "New-matter calls ring every device you're signed in on, then forward to your cell, then go to voicemail.", icon: "phone-incoming" },
          { title: "Privacy for your own number", body: "Call clients back from the firm number in the browser or the Android app. Your personal cell stays out of it.", icon: "lock" },
          { title: "A record of who called", body: "Call history lists every inbound and outbound call with time and number, useful for returning calls in order.", icon: "list" },
        ],
      },
      {
        type: "flex",
        tone: "plain",
        rows: [
          { title: "Calling from the office or the courthouse hallway", body: "Use the web app at your desk and the Android app on the go. Pick which firm number shows as caller ID if you run more than one practice area.", shot: "dialer", icon: "phone-outgoing" },
          { title: "Texts for scheduling, not for case details", body: "Confirm consultations and send office directions by SMS. Keep privileged information out of text messages, as you would anyway.", shot: "chat", icon: "message" },
        ],
      },
      {
        type: "steps",
        title: "How to set up a firm line in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Pick a number in your market", body: "Choose your city's area code, or a toll-free number if you take cases statewide.", icon: "hash" },
          { title: "Set your cellphone as backup", body: "When you're in court, unanswered calls reach your cell after about 30 seconds, then voicemail.", icon: "phone-forwarded" },
          { title: "Return every missed call", body: "Work through the call history after each hearing so no potential client goes cold.", icon: "refresh" },
        ],
      },
      {
        type: "table",
        title: "What's ready for a law office today",
        head: ["Feature", "Status"],
        rows: [
          ["Dedicated local or toll-free number", "yes"],
          ["Ring browser and Android together", "yes"],
          ["Forward unanswered calls to cellphone", "yes"],
          ["Voicemail", "yes"],
          ["Call recording", "soon"],
          ["Voicemail-to-text", "soon"],
          ["Call notes and CRM", "soon"],
          ["Shared line for paralegals", "soon"],
        ],
        note: "Check your state bar's rules before recording calls once recording becomes available.",
      },
      {
        type: "cta",
        title: "Give your practice its own number",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can DIGIRINGO record client calls?", a: "Not today. Call recording is coming soon. When it ships, check your jurisdiction's consent rules, since many states require all parties to agree." },
          { q: "Can I use it with a legal practice management tool?", a: "Integrations, including legal tools, are coming soon. Today you can route a number to your own webhook if a developer wants to connect it to other systems." },
          { q: "Will clients see my personal number?", a: "No. When you call from the DIGIRINGO app, clients see the firm number you chose as caller ID." },
          { q: "What if I need someone to answer while I'm in trial?", a: "Today you can forward to a colleague's cell or send the number to your own AI or SIP answering agent. Our built-in AI receptionist is coming soon. See our legal answering service page for details." },
        ],
      },
    ],
    related: ["/answering-service/legal", "/product/calling/voip-caller-id", "/product/call-analytics/call-logs", "/solutions/small-business"],
  },

  /* ---------------- /solutions/property-management ---------------- */
  {
    path: "/solutions/property-management",
    title: "Phone System for Property Managers | DIGIRINGO",
    description:
      "Give tenants, owners and vendors one number. DIGIRINGO rings your devices, forwards after-hours emergencies to your cell and texts tenants from the office line.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Property management",
        h1: "One number tenants can always reach, even at 2 a.m.",
        sub: "Leaks, lockouts and no-heat calls don't wait for office hours. DIGIRINGO rings your laptop and Android phone, forwards unanswered calls to your cell, and gives you an office texting line for maintenance updates.",
        bullets: [
          "A number per building or portfolio, from $2.50/month each",
          "Texts tenants about repairs, inspections and showings",
          "Every call logged, so maintenance requests don't get lost",
        ],
        shot: "inbox",
      },
      {
        type: "definition",
        title: "Why property managers outgrow a personal cell",
        paragraphs: [
          "Once you manage more than a handful of units, your personal phone becomes the maintenance hotline, the leasing line and the owner line all at once. You can't tell a tenant emergency from a sales call until you answer.",
          "Separate numbers solve that. Give one to tenants, one to owners and one to vendors if you like, and see which line is ringing before you pick up.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Built for the calls you actually get",
        cols: 4,
        items: [
          { title: "Emergency maintenance", body: "Unanswered calls forward to your cell after about 30 seconds so a burst pipe reaches someone.", icon: "phone-forwarded" },
          { title: "Leasing inquiries", body: "Prospects calling about a listing ring your laptop while you're in the office.", icon: "home" },
          { title: "Tenant texting", body: "Send 'Plumber arrives Tuesday 9–11' from the office number, not your own.", icon: "message" },
          { title: "Several lines, one app", body: "Run separate numbers for different buildings or owners and switch caller ID per call.", icon: "phone" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "Know which property is calling", body: "Each number shows up separately in your call history and inbox, so you can tell the Elm Street line from the downtown portfolio.", shot: "numbers", icon: "building" },
          { title: "Threads per tenant", body: "Two-way SMS keeps a conversation per contact, with delivery receipts, once your 10DLC registration is approved.", shot: "chat", icon: "messages" },
        ],
      },
      {
        type: "steps",
        title: "How to set up a property line in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Buy a local number per portfolio", body: "Use the area code of the buildings you manage.", icon: "hash" },
          { title: "Choose where unanswered calls go", body: "Forward to your cell, or to the cell of whoever is on call this week.", icon: "phone-forwarded" },
          { title: "Register for texting", body: "Complete A2P 10DLC in the built-in Trust Center before sending tenant texts.", icon: "shield" },
          { title: "Publish the number", body: "Put it in leases, on the lobby notice and in your listings.", icon: "file" },
        ],
      },
      {
        type: "tabs",
        title: "What's live and what's next",
        tabs: [
          {
            name: "Live today",
            items: [
              { title: "Multiple numbers per account", status: "live" },
              { title: "Forward to any cellphone", status: "live" },
              { title: "Voicemail", status: "live" },
              { title: "Route a number to a webhook or SIP agent", status: "live" },
            ],
          },
          {
            name: "Coming soon",
            items: [
              { title: "After-hours routing schedules", status: "soon" },
              { title: "Phone menu: press 1 for emergencies", status: "soon" },
              { title: "Shared team inbox", status: "soon" },
              { title: "AI receptionist for maintenance intake", status: "soon" },
            ],
          },
        ],
      },
      {
        type: "cta",
        title: "Set up a tenant line in a few minutes",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I send after-hours calls to an on-call maintenance tech?", a: "Yes. Set the forwarding phone to the tech's cell. Calls that aren't answered in the app go there. Automatic schedules by time of day are coming soon, so for now you change the forwarding number when the rotation changes." },
          { q: "Can tenants press 1 for emergencies?", a: "Phone menus are coming soon. Today, one number per purpose (emergency line vs. office line) is the simplest workaround." },
          { q: "Can I text all tenants in a building at once?", a: "Group texting and bulk messages are coming soon. Today you text tenants one-to-one." },
          { q: "Is there a contract or per-unit fee?", a: "No. Numbers are $2.50/month each in the US, plus $0.015 per minute or text in the US and Canada." },
        ],
      },
    ],
    related: ["/answering-service/property-management", "/templates/property-management", "/answering-service/real-estate", "/phone-numbers/multiple-phone-lines"],
  },

  /* ---------------- /solutions/healthcare ---------------- */
  {
    path: "/solutions/healthcare",
    title: "Phone Line for Small Practices and Clinics | DIGIRINGO",
    description:
      "A simple front-desk line for small clinics, therapists and wellness practices: ring every device, forward to a cell, voicemail and appointment reminder texts.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Healthcare",
        h1: "A front-desk line for small practices",
        sub: "Therapists, chiropractors, physical therapists, dental offices and wellness studios use DIGIRINGO for scheduling calls and reminders. Calls ring your desk and phone, voicemail catches what you miss, and patients get a number that isn't your personal cell.",
        bullets: [
          "Local or toll-free number from $2.50/month",
          "Scheduling calls ring every device you're signed in on",
          "Appointment reminder texts from the practice number",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What a small practice needs from its phone",
        paragraphs: [
          "Most calls to a small practice are about scheduling: booking, moving or confirming an appointment. If they go unanswered, the slot sits empty and the patient may book somewhere else.",
          "DIGIRINGO handles those everyday calls well. It is not a clinical communication system, and we don't currently advertise HIPAA compliance, so keep diagnoses, test results and other health details out of calls you route through third-party agents and out of text messages.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "How practices use DIGIRINGO",
        cols: 3,
        items: [
          { title: "Between sessions", body: "If you're with a patient, the call forwards to your cell or goes to voicemail. Call history shows who to call back at the break.", icon: "clock" },
          { title: "Reminder texts", body: "'See you Thursday at 3' from the practice number reduces no-shows. Requires 10DLC registration and patient consent.", icon: "calendar" },
          { title: "Private personal number", body: "Return calls from the web app or Android app with the practice's caller ID.", icon: "lock" },
        ],
      },
      {
        type: "steps",
        title: "How to set up a practice line",
        tone: "plain",
        items: [
          { title: "Choose a number", body: "Pick a local number near your office.", icon: "map-pin" },
          { title: "Sign in at the front desk", body: "Open the web app on the reception computer so calls ring there first.", icon: "monitor" },
          { title: "Add a backup cellphone", body: "Unanswered calls forward after about 30 seconds, then voicemail picks up.", icon: "phone-forwarded" },
        ],
      },
      {
        type: "callout",
        title: "A note on patient privacy",
        body: "DIGIRINGO does not currently offer a business associate agreement or claim HIPAA compliance. If your practice needs one for phone and text communication, contact us before you use DIGIRINGO for anything beyond scheduling.",
        tone: "dark",
      },
      {
        type: "tabs",
        title: "Today vs. coming soon",
        tabs: [
          {
            name: "Today",
            items: [
              { title: "Simultaneous ring on browser and Android", status: "live" },
              { title: "Forward to cellphone", status: "live" },
              { title: "Voicemail", status: "live" },
              { title: "Two-way SMS", status: "live" },
            ],
          },
          {
            name: "Coming soon",
            items: [
              { title: "Business-hours routing", status: "soon" },
              { title: "Scheduled reminder texts", status: "soon" },
              { title: "Phone menu", status: "soon" },
              { title: "Voicemail-to-text", status: "soon" },
            ],
          },
        ],
      },
      {
        type: "cta",
        title: "Give your practice its own scheduling line",
        button: { label: "See pricing", href: "/pricing" },
        tone: "tint",
      },
      {
        type: "faq",
        items: [
          { q: "Is DIGIRINGO HIPAA compliant?", a: "We don't currently claim HIPAA compliance or sign business associate agreements. Use it for scheduling and general calls, and contact us if your practice needs more." },
          { q: "Can I schedule reminder texts in advance?", a: "Scheduled messages are coming soon. Today you send reminders manually from the inbox." },
          { q: "Can the front desk and I both answer?", a: "If you're both signed in to the same account, both devices ring. Separate team seats are coming soon." },
          { q: "What happens after hours?", a: "Calls ring, forward to your backup cell if you set one, then go to voicemail. Business-hours routing is coming soon." },
        ],
      },
    ],
    related: ["/answering-service/chiropractic", "/product/voicemail", "/product/messaging/two-way-sms", "/solutions/small-business"],
  },

  /* ---------------- /solutions/education ---------------- */
  {
    path: "/solutions/education",
    title: "Phone and SMS for Tutors and Schools | DIGIRINGO",
    description:
      "Tutoring centers, private schools, music teachers and coaches get a business number for parent calls and texts, so personal cells stay private. No contract.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Education",
        h1: "Talk to parents without giving out your cell",
        sub: "Tutors, coaches, music teachers and small schools use DIGIRINGO to run a dedicated line for families. Parents call and text one number; you answer from your laptop or Android phone and keep your personal number to yourself.",
        bullets: [
          "Dedicated number for parent calls and texts",
          "Answer from any device you're signed in on",
          "Keep work and family conversations apart",
        ],
        shot: "chat",
      },
      {
        type: "definition",
        title: "Why educators use a separate number",
        paragraphs: [
          "Teachers who use their personal phones end up with parent texts at dinner and student numbers mixed in with their own contacts. A business number draws a clear line, and you can stop checking it at the end of the day.",
          "For tutoring centers and small private schools, one public number also makes enrollment simpler: the same line goes on the website, the flyer and the registration form.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Where it helps",
        cols: 4,
        items: [
          { title: "Lesson changes", body: "Text a parent that Tuesday's session moves to Thursday.", icon: "calendar" },
          { title: "Enrollment calls", body: "New-family calls ring your desk and phone together.", icon: "phone-incoming" },
          { title: "Clear boundaries", body: "Sign out of the app after hours; voicemail takes the message.", icon: "moon" },
          { title: "Low cost", body: "$2.50/month for a US number plus pay-as-you-go usage.", icon: "dollar" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "Texting families", body: "Two-way SMS with threads per parent and delivery receipts. Register your use case through the Trust Center first so carriers deliver your messages.", shot: "chat", icon: "message" },
          { title: "Calls from the browser", body: "Call parents from a classroom computer or your laptop with the school's number as caller ID.", shot: "dialer", icon: "laptop" },
        ],
      },
      {
        type: "steps",
        title: "How to start",
        tone: "tint",
        items: [
          { title: "Buy a local number", body: "Families recognize your local area code.", icon: "hash" },
          { title: "Register for texting", body: "Complete A2P 10DLC in the Trust Center; approval takes 1 to 7 days.", icon: "shield" },
          { title: "Share it with families", body: "Add it to your website, newsletters and sign-up forms.", icon: "send" },
        ],
      },
      {
        type: "cta",
        title: "Set up a family line for your classes",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I send one text to every parent in a class?", a: "Group texting is coming soon. Today, texts go one-to-one." },
          { q: "Can several teachers share the line?", a: "Shared numbers and team seats are coming soon. Today one account owns the number, and every device signed in to it rings." },
          { q: "Do I need consent to text parents?", a: "Yes. Only text families who gave you their number and agreed to receive messages. Our opt-in guide on the blog walks through it." },
          { q: "Does it work on an iPhone?", a: "Use the web app in Safari. There is no iOS app yet." },
        ],
      },
    ],
    related: ["/product/messaging/two-way-sms", "/blog/sms-opt-in-consent-guide", "/solutions/small-business", "/phone-numbers/dedicated"],
  },

  /* ---------------- /solutions/startups ---------------- */
  {
    path: "/solutions/startups",
    title: "Business Phone Numbers for Startups | DIGIRINGO",
    description:
      "Startups get US, Canadian and international numbers, browser calling, SMS and per-number webhook or SIP routing. Pay as you go, with no seats and no contract.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Startups",
        h1: "A real company phone line before you have a real office",
        sub: "Founders need a number for customers, investors and app-store listings on day one. DIGIRINGO gives you numbers in the US, Canada and many other countries, a browser dialer, SMS, and webhook routing when you want to build something on top.",
        bullets: [
          "No seat fees: pay for numbers and usage, nothing else",
          "Route any number to your own webhook (TeXML) or SIP agent",
          "Numbers in many countries for international launches",
        ],
        shot: "numbers",
      },
      {
        type: "definition",
        title: "What a startup phone setup should look like",
        paragraphs: [
          "Early on, the founder answers the phone. That number ends up on the website, the Stripe statement descriptor and the support page, so it shouldn't be a personal cell you'll want back later.",
          "A cloud number you can point anywhere grows with you: today it rings your laptop, next quarter it goes to a support agent or a voice bot you built.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What startups get",
        cols: 3,
        items: [
          { title: "Global numbers", body: "Local numbers in many countries. Some need ID or address documents, which the carrier usually reviews in 1 to 3 days.", icon: "globe" },
          { title: "Developer routing", body: "Send a number's calls to your own webhook or a SIP endpoint, such as an AI voice agent you host.", icon: "webhook", href: "/developers", status: "beta" },
          { title: "Spend control", body: "Prepaid wallet with $5 to $50 top-ups. No surprise invoice at month end.", icon: "wallet" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "Try a voice agent on a real number", body: "Point a number at your SIP or webhook agent and call it. If the agent is down, change the route back to the app in settings.", shot: "settings", icon: "bot" },
          { title: "Founder-friendly calling", body: "Call customers from the browser with your company number as caller ID. US and Canada calls are $0.015/min.", shot: "dialer", icon: "phone-outgoing" },
        ],
      },
      {
        type: "steps",
        title: "How to set up a startup line",
        tone: "tint",
        items: [
          { title: "Pick a number in your launch market", body: "US local, toll-free, Canadian or international.", icon: "search" },
          { title: "Decide the route", body: "Ring the app, forward to a phone, or send to your webhook or SIP agent.", icon: "route" },
          { title: "Add more numbers as you grow", body: "A sales line, a support line, a number per country. Each is billed separately.", icon: "phone" },
        ],
      },
      {
        type: "table",
        title: "What's available for builders",
        head: ["Capability", "Status"],
        rows: [
          ["Per-number webhook routing (TeXML)", "yes"],
          ["Route to SIP or AI voice agent", "yes"],
          ["Two-way SMS", "yes"],
          ["Full public REST API", "soon"],
          ["Integrations (Slack, HubSpot, Zapier)", "soon"],
          ["Team seats and roles", "soon"],
        ],
      },
      {
        type: "cta",
        title: "Get a company number in minutes",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is there an API?", a: "A full public REST API is coming soon. Today you can route each number's calls to your own webhook using TeXML, or to a SIP endpoint." },
          { q: "Can co-founders share a line?", a: "Team seats and shared numbers are coming soon. For now, every device signed in to the account rings, so co-founders sometimes share one login." },
          { q: "Can I port my existing number?", a: "Number porting is coming soon. Today you'd buy a new DIGIRINGO number." },
          { q: "Do you charge per user?", a: "No. There are no per-user fees. You pay for numbers and usage from your wallet." },
        ],
      },
    ],
    related: ["/developers", "/ai-agent", "/phone-numbers", "/solutions/sales"],
  },

  /* ---------------- /solutions/small-business ---------------- */
  {
    path: "/solutions/small-business",
    title: "Small Business Phone System, No Contract | DIGIRINGO",
    description:
      "A small business phone line that runs on your Android phone and browser. Local or toll-free numbers, calling, SMS, forwarding and voicemail. Pay as you go.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Small business",
        h1: "A business line on the phone you already carry",
        sub: "Shops, studios, consultants and side businesses use DIGIRINGO to get a real business number without new hardware. Calls ring your Android phone and laptop, forward to your cell when you're busy, and go to voicemail as a last resort.",
        bullets: [
          "$2.50/month for a US local number",
          "$0.015/min calling and $0.015/text in the US and Canada",
          "No contract, no per-user fees",
        ],
        shot: "home",
      },
      {
        type: "definition",
        title: "What counts as a small business phone system now",
        paragraphs: [
          "It used to mean a closet box and desk phones. For most small businesses today it means a number that customers can call and text, which rings wherever the owner happens to be.",
          "DIGIRINGO runs over the internet, in a browser tab or the Android app. You keep your personal number for friends and family, and your business number for everyone else.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Why small businesses pick DIGIRINGO",
        cols: 4,
        items: [
          { title: "No hardware", body: "Use your laptop and Android phone. iPhone users can use the web app in Safari.", icon: "smartphone" },
          { title: "Predictable cost", body: "Top up a prepaid wallet and see every charge.", icon: "wallet" },
          { title: "Texting included", body: "Two-way SMS once your 10DLC registration is approved.", icon: "message" },
          { title: "Human support", body: "Live chat support inside the app.", icon: "headphones" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "Calls follow you", body: "Your laptop and phone ring together. If neither answers in about 30 seconds, the call forwards to your cell, then voicemail.", shot: "calls", icon: "phone-incoming" },
          { title: "Texts in one inbox", body: "Every number has its own threads, with delivery receipts so you know the message landed.", shot: "inbox", icon: "inbox" },
          { title: "See your spending", body: "The wallet shows top-ups and charges for numbers, calls and texts.", shot: "wallet", icon: "dollar" },
        ],
      },
      {
        type: "steps",
        title: "How to set up your business line",
        tone: "tint",
        items: [
          { title: "Top up and pick a number", body: "Local or toll-free, chosen by area code or digits.", icon: "search" },
          { title: "Install the app", body: "Android from Google Play, or the web app on any computer.", icon: "smartphone" },
          { title: "Set a forwarding phone", body: "Your cell catches calls you miss in the app.", icon: "phone-forwarded" },
          { title: "Register for texting", body: "Use the Trust Center for A2P 10DLC.", icon: "shield" },
        ],
      },
      {
        type: "cta",
        title: "See exactly what it costs before you start",
        button: { label: "See pricing", href: "/pricing" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I keep my current business number?", a: "Number porting is coming soon. Today you can get a new number and forward your old line to it with your current carrier." },
          { q: "Do you offer a phone menu?", a: "Auto-attendant and phone menus are coming soon." },
          { q: "What if I want two numbers, like sales and service?", a: "Buy as many numbers as you need. Each is billed separately and shows up in the app with its own calls and texts." },
          { q: "Is there a free trial?", a: "There's no free plan. You start with a small wallet top-up, as low as $5, and pay only for what you use." },
        ],
      },
    ],
    related: ["/product/virtual-phone-system", "/features/small-business-voip", "/blog/set-up-small-business-phone-system", "/solutions/home-services"],
  },

  /* ---------------- /solutions/franchise ---------------- */
  {
    path: "/solutions/franchise",
    title: "Local Phone Numbers for Franchise Locations | DIGIRINGO",
    description:
      "Give every franchise location its own local number that rings the people on site and forwards to the manager's cell. Low per-minute cost and no contracts.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Franchise",
        h1: "A local number for every location",
        sub: "Customers want to call the shop down the street, not a national hotline. DIGIRINGO lets each franchise location run its own local number that rings the people on site and forwards to the manager when nobody picks up.",
        bullets: [
          "Local area codes for each territory",
          "Each location answers its own calls on any device",
          "Pay-as-you-go pricing that scales location by location",
        ],
        shot: "numbers",
      },
      {
        type: "definition",
        title: "Why franchises need location-level numbers",
        paragraphs: [
          "Local search listings, maps and door signs all point to a phone number. When every location shares one central number, callers wait while someone figures out which store they meant.",
          "With a number per location, the call lands where the work happens. Owners can still see the setup is consistent: same app, same pricing, same features.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "How franchise operators use DIGIRINGO today",
        cols: 3,
        items: [
          { title: "Number per store", body: "Buy a local number for each territory and put it on that location's listing.", icon: "map-pin" },
          { title: "Manager backup", body: "Unanswered calls forward to the location manager's cell after about 30 seconds.", icon: "phone-forwarded" },
          { title: "Local texting", body: "Confirm bookings and pickups from the store's own number.", icon: "message" },
        ],
      },
      {
        type: "callout",
        title: "How accounts work for multi-location brands today",
        body: "Multi-user team seats and a central multi-location admin are coming soon. Today, each location usually runs its own DIGIRINGO account, which also keeps billing separate per franchisee.",
        tone: "dark",
      },
      {
        type: "steps",
        title: "How to roll out numbers across locations",
        items: [
          { title: "Each location signs up", body: "The franchisee or manager creates an account and tops up.", icon: "user" },
          { title: "Pick a local number", body: "Search the territory's area code.", icon: "search" },
          { title: "Set forwarding and voicemail", body: "Choose the manager's cell as the backup.", icon: "phone-forwarded" },
          { title: "Update listings", body: "Put the new number on maps, the website locator and signage.", icon: "globe" },
        ],
      },
      {
        type: "tabs",
        title: "What's ready for franchises",
        tone: "tint",
        tabs: [
          {
            name: "Now",
            items: [
              { title: "Local numbers in US and Canada", status: "live" },
              { title: "Ring all devices at a location", status: "live" },
              { title: "Forward to manager's cell", status: "live" },
              { title: "Two-way SMS", status: "live" },
            ],
          },
          {
            name: "Coming",
            items: [
              { title: "Central admin for many locations", status: "soon" },
              { title: "Team seats and roles", status: "soon" },
              { title: "Call analytics across locations", status: "soon" },
              { title: "Business-hours routing", status: "soon" },
            ],
          },
        ],
      },
      {
        type: "cta",
        title: "Start with one location and expand",
        button: { label: "Get your number", href: "/app" },
      },
      {
        type: "faq",
        items: [
          { q: "Can headquarters see every location's calls?", a: "Not yet. Cross-location analytics and a central admin are coming soon. Today each account has its own call history." },
          { q: "Can I keep the numbers my locations already use?", a: "Porting is coming soon. Until then, locations can forward their old line to a new DIGIRINGO number." },
          { q: "What does a location pay?", a: "A US local number is $2.50/month, with calls and texts at $0.015 each per minute or message in the US and Canada." },
          { q: "Can staff answer on their own phones?", a: "Anyone signed in to the location's account can answer in the browser or Android app. Individual staff seats are coming soon." },
        ],
      },
    ],
    related: ["/answering-service/franchise", "/local-numbers", "/phone-numbers/multiple-phone-lines", "/solutions/small-business"],
  },

  /* ---------------- /solutions/construction ---------------- */
  {
    path: "/solutions/construction",
    title: "Business Phone for Construction Companies | DIGIRINGO",
    description:
      "General contractors and builders take bid calls, update clients and coordinate subs from one business number that rings on site and forwards to any cellphone.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Construction",
        h1: "Stay reachable from the slab to the final walkthrough",
        sub: "On a job site, the phone is in your pocket and your hands are full. DIGIRINGO gives your company a number that rings your phone and the office laptop, forwards to the site super when you can't answer, and keeps bid calls from vanishing into voicemail.",
        bullets: [
          "Company number for bids, clients and subs",
          "Forward unanswered calls to any cellphone",
          "Text schedule changes and inspection times",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "Why builders need a company line",
        paragraphs: [
          "Construction runs on calls: homeowners asking for estimates, subs confirming start dates, inspectors moving appointments. When all of that hits a personal cell, it's hard to hand off when you go on vacation or hire a project manager.",
          "A company number belongs to the business. You can change where it forwards without telling every client a new number.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Built for job-site reality",
        cols: 4,
        items: [
          { title: "Loud site? Forward it", body: "Point unanswered calls to the super's cell so they still get picked up.", icon: "phone-forwarded" },
          { title: "Bid calls logged", body: "Every inbound call appears in history, so estimate requests get returned.", icon: "list" },
          { title: "Text the schedule", body: "'Drywall starts Monday' sent to the homeowner from the company number.", icon: "message" },
          { title: "Works on mobile data", body: "Calls run over Wi-Fi or mobile data, wherever you have a signal.", icon: "smartphone" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "Separate lines for separate work", body: "Run one number for residential remodels and another for commercial bids, and see at a glance which one is ringing.", shot: "numbers", icon: "phone" },
          { title: "Return calls from the trailer", body: "Use the web app on the site-office laptop with your company caller ID.", shot: "dialer", icon: "laptop" },
        ],
      },
      {
        type: "steps",
        title: "How to set it up",
        tone: "tint",
        items: [
          { title: "Get a local number", body: "Match the market where you build.", icon: "hash" },
          { title: "Set the forwarding phone", body: "Your cell, or the project manager's on a big job.", icon: "phone-forwarded" },
          { title: "Put it on signs and trucks", body: "Yard signs and vehicle wraps bring in calls for years.", icon: "truck" },
        ],
      },
      {
        type: "cta",
        title: "Get a company number for your crew",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I transfer a call to my foreman?", a: "Call transfer is coming soon. Today you can set the foreman's cell as the forwarding number so unanswered calls reach them." },
          { q: "Can I record calls with clients about change orders?", a: "Call recording is coming soon. For now, follow up important calls with a text summary so there's a written record." },
          { q: "Will it work in areas with weak signal?", a: "DIGIRINGO calls need an internet connection. If data is weak, forwarding to your cellphone sends the call over the regular cell network instead." },
          { q: "Do you have ring groups for the whole crew?", a: "Ring groups across team members are coming soon." },
        ],
      },
    ],
    related: ["/answering-service/construction", "/answering-service/contractor", "/solutions/home-services", "/product/call-forwarding"],
  },

  /* ---------------- /solutions/sales ---------------- */
  {
    path: "/solutions/sales",
    title: "Phone System for Sales Teams and Reps | DIGIRINGO",
    description:
      "Sales reps call prospects from a local number in the browser at $0.015/min in the US and Canada, follow up by text, and work every callback from call history.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Sales",
        h1: "More conversations, fewer dialing headaches",
        sub: "DIGIRINGO gives reps a browser dialer, local caller ID and two-way texting at pay-as-you-go prices. Call from the laptop you already prospect on, and work through callbacks from a clean call history.",
        bullets: [
          "Choose which number shows as caller ID on each call",
          "$0.015/min to the US and Canada, no seat fees",
          "Follow up by SMS from the same number",
        ],
        shot: "dialer",
      },
      {
        type: "definition",
        title: "What a sales rep needs from a phone",
        paragraphs: [
          "Reps live in a browser: lead lists, email, the CRM. A dialer in the same place removes the step of reaching for a desk phone or typing numbers into a cell.",
          "Caller ID matters too. Prospects pick up more often for a number they recognize, so reps who sell into several regions often keep a number per area code.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What sales teams use",
        cols: 3,
        items: [
          { title: "Pick your caller ID", body: "Own numbers in several area codes and choose which one dials out.", icon: "hash", href: "/product/calling/voip-caller-id", status: "live" },
          { title: "Text follow-ups", body: "Send a recap or a meeting link by SMS after the call.", icon: "send" },
          { title: "Callbacks that come back", body: "Prospects who call back ring your browser and phone at once.", icon: "phone-incoming" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "Dial from the browser", body: "Type or paste a number and call. In-call keypad for extension menus, plus hold and mute.", shot: "dialer", icon: "phone-outgoing" },
          { title: "International prospects", body: "Call 220+ countries at the per-country rates on our rate list.", shot: "activity", icon: "globe" },
        ],
      },
      {
        type: "steps",
        title: "How to set up a sales line",
        tone: "tint",
        items: [
          { title: "Buy numbers in your target regions", body: "One per area code you call into most.", icon: "map-pin" },
          { title: "Top up the wallet", body: "Calls draw from the balance at $0.015/min in the US and Canada.", icon: "wallet" },
          { title: "Register for texting", body: "10DLC registration lets your follow-up texts get delivered.", icon: "shield" },
        ],
      },
      {
        type: "table",
        title: "Sales features: now and next",
        head: ["Feature", "Status"],
        rows: [
          ["Browser and Android calling", "yes"],
          ["Choose caller ID per call", "yes"],
          ["Two-way SMS", "yes"],
          ["CRM integrations (HubSpot, Salesforce)", "soon"],
          ["Call recording and coaching", "soon"],
          ["AI call summaries", "soon"],
          ["Text templates and snippets", "soon"],
        ],
      },
      {
        type: "cta",
        title: "Start dialing at $0.015 a minute",
        button: { label: "See pricing", href: "/pricing" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO have a power dialer?", a: "No. You place calls one at a time from the dialer. Automation features are on our roadmap." },
          { q: "Can I log calls to my CRM?", a: "CRM integrations are coming soon. Today, call history in the app lists every call with time and duration." },
          { q: "How do I avoid being flagged as spam?", a: "Use a real business number, register for 10DLC if you text, and avoid high-volume cold blasts. Our blog post on spam-likely labels has more." },
          { q: "Are there seat fees for a team of reps?", a: "No per-user fees. Separate team seats are coming soon; today reps each use their own account." },
        ],
      },
    ],
    related: ["/product/calling/call-from-browser", "/product/calling/voip-caller-id", "/blog/business-number-spam-likely-fix", "/solutions/support"],
  },

  /* ---------------- /solutions/support ---------------- */
  {
    path: "/solutions/support",
    title: "Customer Support Phone Line | DIGIRINGO",
    description:
      "Run a customer support line on a toll-free or local number. Calls ring every signed-in device, unanswered calls forward, and voicemail catches the rest.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Customer support",
        h1: "A support line that never dead-ends",
        sub: "Customers who call support are already frustrated. DIGIRINGO rings your laptop and Android phone together, forwards to a backup cell when you're tied up, and records a voicemail rather than letting the call ring out.",
        bullets: [
          "Toll-free numbers from $2.50/month",
          "Ring, forward, then voicemail: no call left hanging",
          "Text replies for customers who prefer SMS",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What makes a small support line work",
        paragraphs: [
          "For a small team, support usually means one or two people who also do other jobs. The phone has to reach them wherever they are, and anything they miss has to be easy to find later.",
          "DIGIRINGO covers those basics. Each number rings every device you're signed in on, misses are logged, and you can route the line to an outside SIP agent or webhook if you outsource overflow.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Support basics, handled",
        cols: 4,
        items: [
          { title: "Toll-free option", body: "Customers anywhere in the US call free.", icon: "phone" },
          { title: "Never ring out", body: "Forwarding then voicemail catch every unanswered call.", icon: "voicemail" },
          { title: "Callback queue", body: "Call history doubles as a list of people to call back.", icon: "list" },
          { title: "Overflow routing", body: "Send the number to an outside SIP agent or your webhook.", icon: "route" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "Answer from the help desk", body: "Keep the web app open next to your ticket tool. Calls pop up in the browser, even when the tab is in the background.", shot: "calls", icon: "monitor" },
          { title: "Text when it's faster", body: "Send a tracking link or a reset step by SMS from the support number.", shot: "chat", icon: "message" },
        ],
      },
      {
        type: "steps",
        title: "How to set up a support line",
        tone: "tint",
        items: [
          { title: "Choose toll-free or local", body: "Toll-free for national customers, local for a regional business.", icon: "hash" },
          { title: "Set backup forwarding", body: "A second phone catches calls you can't take in the app.", icon: "phone-forwarded" },
          { title: "Publish it", body: "Add it to your help center, receipts and contact page.", icon: "globe" },
        ],
      },
      {
        type: "table",
        title: "Support features: now and next",
        head: ["Feature", "Status"],
        rows: [
          ["Toll-free and local numbers", "yes"],
          ["Ring all signed-in devices", "yes"],
          ["Forward to cellphone, then voicemail", "yes"],
          ["Route to outside SIP agent or webhook", "yes"],
          ["Phone menu (IVR)", "soon"],
          ["Shared team inbox", "soon"],
          ["Call queues and distribution", "soon"],
          ["Toll-free texting", "soon"],
        ],
      },
      {
        type: "cta",
        title: "Set up your support number today",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can customers text my toll-free number?", a: "Not yet. Toll-free texting verification is coming soon. Local US and Canada numbers support SMS after 10DLC registration." },
          { q: "Can I put callers in a queue?", a: "Call queues and automatic call distribution are coming soon. Today calls ring your devices, then forward, then go to voicemail." },
          { q: "Can two agents answer the same line?", a: "Shared numbers and team seats are coming soon. Today, everyone signed in to one account rings together." },
          { q: "Can I outsource after-hours calls?", a: "Yes. Route the number to an outside SIP agent or your own webhook in the number's routing settings." },
        ],
      },
    ],
    related: ["/toll-free-numbers", "/answering-service", "/product/call-routing", "/solutions/operations"],
  },

  /* ---------------- /solutions/operations ---------------- */
  {
    path: "/solutions/operations",
    title: "Call Routing and Phone Ops for Operations Teams | DIGIRINGO",
    description:
      "Operations leads choose where every number's calls go: the app, a cellphone, a SIP agent or your own webhook. Prepaid wallet billing, one place to manage it.",
    crumbs: SOLUTION_CRUMBS,
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Operations",
        h1: "Decide where every number goes",
        sub: "Dispatch, scheduling and back-office lines all need different handling. DIGIRINGO lets you route each number on its own: ring the app, forward to a phone, hand it to a SIP or AI agent, or send it to your own webhook.",
        bullets: [
          "Per-number routing: app, phone, SIP agent or webhook",
          "One prepaid wallet for all numbers and usage",
          "Call history for every line in one place",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "Phone operations without a telecom team",
        paragraphs: [
          "Operations teams usually inherit the phone system nobody else wanted to own. They need to change where calls go when a dispatcher is out, add a number for a new service, and know what it's all costing.",
          "DIGIRINGO keeps those controls in one settings screen, with no tickets to a carrier and no hardware to reconfigure.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Routing options per number",
        cols: 4,
        items: [
          { title: "Ring the app", body: "Every signed-in browser and Android device rings at once.", icon: "phone-incoming", href: "/product/call-routing/simultaneous-ring", status: "live" },
          { title: "Forward to a phone", body: "Send calls straight to a cellphone, in the US or abroad.", icon: "phone-forwarded", href: "/product/call-forwarding", status: "live" },
          { title: "SIP or AI agent", body: "Hand the call to a SIP endpoint, such as a voice agent you run.", icon: "bot", href: "/product/ai/voice-agent", status: "beta" },
          { title: "Your webhook", body: "Return TeXML from your own server to control the call.", icon: "webhook", href: "/developers", status: "beta" },
        ],
      },
      {
        type: "flex",
        rows: [
          { title: "Change routing in seconds", body: "Pick the route for a number in settings. The next call follows the new rule.", shot: "settings", icon: "route" },
          { title: "Spending in one view", body: "The wallet shows every top-up and charge across numbers, calls and texts.", shot: "wallet", icon: "wallet" },
          { title: "Activity across lines", body: "Recent calls and messages for every number you own, in one feed.", shot: "activity", icon: "chart" },
        ],
      },
      {
        type: "steps",
        title: "How to set up routing",
        tone: "tint",
        items: [
          { title: "List your lines", body: "Dispatch, scheduling, billing: buy a number for each.", icon: "list" },
          { title: "Choose each route", body: "App, phone, SIP agent or webhook.", icon: "git-branch" },
          { title: "Test with a call", body: "Call the number from your cell and confirm it lands where you expect.", icon: "check" },
        ],
      },
      {
        type: "tabs",
        title: "Ops tools: available and planned",
        tabs: [
          {
            name: "Available",
            items: [
              { title: "Per-number routing", status: "live" },
              { title: "Simultaneous and sequential ring", status: "live" },
              { title: "Webhook (TeXML) routing", status: "beta" },
              { title: "Call logs", status: "live" },
            ],
          },
          {
            name: "Planned",
            items: [
              { title: "Business-hours and time-of-day rules", status: "soon" },
              { title: "Call flow builder", status: "soon" },
              { title: "Automatic call distribution", status: "soon" },
              { title: "Call analytics dashboards", status: "soon" },
            ],
          },
        ],
      },
      {
        type: "cta",
        title: "See every routing option",
        button: { label: "Get your number", href: "/app" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I route by time of day?", a: "Business-hours and time-of-day routing are coming soon. Today, each number has one route that you can change anytime, or a webhook you control can make time-based decisions." },
          { q: "What is TeXML?", a: "It's an XML format for telling the phone network what to do with a call: ring a SIP address, play a message, forward. Your server returns it when a call comes in." },
          { q: "Can I see usage per number?", a: "Call history lists calls per number, and the wallet lists every charge. Analytics dashboards are coming soon." },
          { q: "Is there an admin role?", a: "Team seats and roles are coming soon. Today one account owns and manages all its numbers." },
        ],
      },
    ],
    related: ["/product/call-routing", "/developers", "/product/call-analytics/call-logs", "/solutions/support"],
  },
];

/* ------------------------------------------------------------------ */
/* Answering service: hub + 19 industry pages                          */
/* ------------------------------------------------------------------ */

const AS_CRUMBS: LinkRef[] = [{ label: "Answering service", href: "/answering-service" }];

const INDUSTRY_LINKS: LinkRef[] = [
  { label: "Accountants", href: "/answering-service/accountant" },
  { label: "Automotive", href: "/answering-service/automotive" },
  { label: "Chiropractic", href: "/answering-service/chiropractic" },
  { label: "Construction", href: "/answering-service/construction" },
  { label: "Contractors", href: "/answering-service/contractor" },
  { label: "Ecommerce", href: "/answering-service/ecommerce" },
  { label: "Electricians", href: "/answering-service/electrician" },
  { label: "Franchises", href: "/answering-service/franchise" },
  { label: "HVAC", href: "/answering-service/hvac" },
  { label: "Insurance", href: "/answering-service/insurance" },
  { label: "Landscaping", href: "/answering-service/landscaping" },
  { label: "Legal", href: "/answering-service/legal" },
  { label: "Pest control", href: "/answering-service/pest-control" },
  { label: "Plumbing", href: "/answering-service/plumbing" },
  { label: "Property management", href: "/answering-service/property-management" },
  { label: "Real estate", href: "/answering-service/real-estate" },
  { label: "Roofing", href: "/answering-service/roofing" },
  { label: "Salons", href: "/answering-service/salon" },
  { label: "Cleaning", href: "/answering-service/cleaning" },
];

const industryChips = (): Block => ({
  type: "chips",
  title: "Answering service by industry",
  links: INDUSTRY_LINKS,
  tone: "tint",
});

/** Shared, honest comparison rows; each industry adds its own rows on top. */
const comparisonTable = (industryRows: string[][]): Block => ({
  type: "table",
  title: "DIGIRINGO today vs. a traditional answering service",
  intro: "Both have a place. Here's an honest look at what each one does.",
  head: ["", "DIGIRINGO today", "Traditional answering service"],
  rows: [
    ...industryRows,
    ["Your own devices ring first", "yes", "no"],
    ["Unanswered calls forward to your cellphone", "yes", "Varies by provider"],
    ["Voicemail when nobody answers", "yes", "Agent takes a message"],
    ["Every missed call listed for callback", "yes", "Message log or email"],
    ["A live person answers around the clock", "no", "yes"],
    ["Built-in AI receptionist", "soon", "Some offer one"],
    ["Plug in your own AI or SIP answering agent", "yes", "no"],
    ["Voicemail-to-text and call recording", "soon", "Often included"],
    ["Pricing", "$2.50/mo number + $0.015/min (US & Canada)", "Usually a monthly plan plus per-minute or per-call fees"],
    ["Contract", "None", "Varies by provider"],
  ],
  note: "Answering-service features and prices vary widely; check each provider's current pricing page.",
});

const calculator = (): Block => ({ type: "widget", widget: "missed-call-calculator" });

interface IndustrySpec {
  slug: string;
  /** Short name used in titles, e.g. "Plumbers". */
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  sub: string;
  bullets: string[];
  shot?: Shot;
  defTitle: string;
  def: [string, string];
  scenariosTitle: string;
  scenarios: Item[];
  stepsTitle: string;
  steps: Item[];
  tableRows: string[][];
  soonTitle: string;
  soonBody: string;
  ctaTitle: string;
  faq: Faq[];
  related: string[];
}

const industryPage = (s: IndustrySpec): PageDoc => ({
  path: `/answering-service/${s.slug}`,
  title: s.title,
  description: s.description,
  crumbs: AS_CRUMBS,
  status: "beta",
  sections: [
    { type: "hero", eyebrow: s.eyebrow, h1: s.h1, sub: s.sub, bullets: s.bullets, shot: s.shot ?? "calls" },
    { type: "definition", title: s.defTitle, paragraphs: s.def, tone: "tint" },
    { type: "cards", title: s.scenariosTitle, items: s.scenarios, cols: s.scenarios.length === 3 ? 3 : 4 },
    { type: "steps", title: s.stepsTitle, items: s.steps, tone: "tint" },
    comparisonTable(s.tableRows),
    calculator(),
    { type: "callout", title: s.soonTitle, body: s.soonBody, tone: "dark" },
    { type: "cta", title: s.ctaTitle, button: { label: "Get your number", href: "/app" }, tone: "brand" },
    { type: "faq", items: s.faq },
    industryChips(),
  ],
  related: s.related,
});

const ANSWERING_HUB: PageDoc = {
  path: "/answering-service",
  title: "Answering Service Alternative for Small Business | DIGIRINGO",
  description:
    "Stop losing callers to voicemail. DIGIRINGO rings every device, forwards to your cell, takes voicemail and can hand calls to your own AI or SIP answering agent.",
  status: "beta",
  sections: [
    {
      type: "hero",
      eyebrow: "Answering service",
      h1: "Every call answered by you, your cell, your agent or voicemail",
      sub: "A missed call is often a customer who already moved on. DIGIRINGO stacks several layers so calls don't ring out: your devices first, your cellphone next, then voicemail, or a number routed straight to the AI or SIP answering agent you choose. Our own AI receptionist is in development.",
      bullets: [
        "Browser and Android ring together, with background push alerts",
        "No answer in about 30 seconds: the call forwards to your cell",
        "Missed calls listed in call history so you can call back fast",
      ],
      shot: "calls",
    },
    {
      type: "definition",
      title: "What is an answering service?",
      paragraphs: [
        "Traditionally, an answering service is a call center that picks up your business line when you can't. An operator greets the caller with your business name, takes a message and sends it to you by email or text. Some also book appointments or dispatch emergencies.",
        "DIGIRINGO approaches the same problem from your side of the line. Instead of a stranger answering first, your own devices ring, then your cell, then voicemail. If you do want someone else to pick up, you can point the number at an answering agent of your choice over SIP or a webhook.",
      ],
      tone: "tint",
    },
    {
      type: "cards",
      title: "The layers that catch your calls today",
      cols: 4,
      items: [
        { title: "Every device rings", body: "Browser tabs and the Android app ring at the same time, even when the tab is in the background.", icon: "phone-incoming", status: "live", href: "/product/call-routing/simultaneous-ring" },
        { title: "Forward to your cell", body: "After about 30 seconds without an answer, the call goes to your regular phone.", icon: "phone-forwarded", status: "live", href: "/product/call-forwarding" },
        { title: "Voicemail", body: "Callers leave a message with a standard greeting when nobody picks up.", icon: "voicemail", status: "live", href: "/product/voicemail" },
        { title: "Your own AI or SIP agent", body: "Route a number to an outside answering agent or service by SIP or webhook.", icon: "bot", status: "beta", href: "/ai-agent" },
      ],
    },
    {
      type: "steps",
      title: "How to set up call coverage in DIGIRINGO",
      items: [
        { title: "Get a number", body: "Local or toll-free, from $2.50/month.", icon: "search" },
        { title: "Sign in on every device", body: "Web app on your computer, Android app on your phone.", icon: "smartphone" },
        { title: "Add a forwarding cellphone", body: "Yours, a partner's, or whoever is on call.", icon: "phone-forwarded" },
        { title: "Optional: route to an agent", body: "Point the number at your SIP or AI answering agent in routing settings.", icon: "route" },
      ],
      tone: "tint",
    },
    comparisonTable([]),
    calculator(),
    {
      type: "cards",
      title: "Coming next",
      tone: "tint",
      cols: 3,
      items: [
        { title: "DIGIRINGO AI receptionist", body: "Answers in your business name, collects the caller's details and sends you a summary.", icon: "sparkles", status: "soon", href: "/product/ai/receptionist" },
        { title: "After-hours rules", body: "Different handling for nights and weekends.", icon: "moon", status: "soon", href: "/product/call-routing/business-hours-call-routing" },
        { title: "Voicemail-to-text", body: "Read messages instead of listening to them.", icon: "file", status: "soon", href: "/features/voicemail-to-text" },
      ],
    },
    {
      type: "cta",
      title: "Stop sending customers to the next listing",
      button: { label: "Get your number", href: "/app" },
      tone: "brand",
    },
    {
      type: "faq",
      items: [
        { q: "Is DIGIRINGO an answering service?", a: "Not in the call-center sense. No live operators answer for you. DIGIRINGO makes sure your calls reach you, your cell or voicemail, and lets you plug in an answering agent of your own. A built-in AI receptionist is coming soon." },
        { q: "Can I connect a live answering service I already pay for?", a: "If they accept calls over SIP, you can route your number to them. Some providers also give you a phone number to forward to, which works with our cellphone forwarding." },
        { q: "How long does a call ring before it forwards?", a: "About 30 seconds in the app, then it goes to your forwarding number. If that isn't answered, voicemail picks up." },
        { q: "What does it cost?", a: "$2.50/month for a US local number and $0.015/min for calls in the US and Canada, including forwarded minutes. No contract." },
        { q: "When is the AI receptionist coming?", a: "It's in development. Use the Get notified option on the AI receptionist page and we'll tell you when it's ready." },
      ],
    },
    { type: "chips", title: "Answering service by industry", intro: "See how call coverage works for your kind of business.", links: INDUSTRY_LINKS, tone: "tint" },
  ],
  related: ["/product/ai/receptionist", "/product/call-management/never-miss-a-call", "/tools/missed-call-cost-calculator", "/blog/cost-of-missed-calls"],
};

const INDUSTRIES: IndustrySpec[] = [
  /* accountant */
  {
    slug: "accountant",
    title: "Answering Service for Accountants and CPAs | DIGIRINGO",
    description:
      "Tax season call spikes, client questions and new-client inquiries reach you on any device, forward to your cell, or land in voicemail. No contract, low rates.",
    eyebrow: "Answering service for accountants",
    h1: "Get through tax season without missing a new client",
    sub: "From February to April, your phone rings while you're deep in a return. DIGIRINGO rings your laptop and phone together, forwards to your cell when you step away, and keeps a list of everyone who called so you can return calls between appointments.",
    bullets: [
      "New-client calls ring every device you're signed in on",
      "Missed calls listed in call history, ready to return",
      "Text clients a reminder to send their W-2s",
    ],
    defTitle: "Why accounting firms need call coverage",
    def: [
      "Accounting calls come in waves. Outside tax season it's a trickle of bookkeeping questions; in March it's dozens of calls a day from people asking whether their return is filed, what documents to bring, or whether you're taking new clients.",
      "If a prospect reaches voicemail in early April, they'll call the next CPA on the list. Making sure that call gets to you, or to your cell, matters more than having someone read a script.",
    ],
    scenariosTitle: "Calls an accounting practice can't let slip",
    scenarios: [
      { title: "The April 10th prospect", body: "Someone needs a return filed this week. A fast callback wins the engagement.", icon: "calendar" },
      { title: "IRS notice panic", body: "A client just got a letter. Getting back to them the same day keeps their trust.", icon: "file" },
      { title: "Payroll deadline questions", body: "Small business clients call before a payroll run and need an answer now.", icon: "clock" },
      { title: "Document reminders", body: "Text clients which forms are still missing from their file.", icon: "message" },
    ],
    stepsTitle: "How to cover your practice's calls",
    steps: [
      { title: "Get a local office number", body: "Pick your city's area code so clients recognize it.", icon: "hash" },
      { title: "Forward to your cell during client meetings", body: "Calls you can't take in the app reach your phone after about 30 seconds.", icon: "phone-forwarded" },
      { title: "Clear the callback list at lunch", body: "Call history shows every missed caller and when they rang.", icon: "list" },
    ],
    tableRows: [["Extra cost during tax-season call spikes", "Only the minutes you use", "Plans often charge more for extra calls"]],
    soonTitle: "Coming: an AI receptionist that knows tax season",
    soonBody: "Our built-in AI receptionist, in development, will answer in your firm's name, ask whether the caller is a new or existing client and send you the details. Until then, you can route your number to an AI or SIP answering agent you already use.",
    ctaTitle: "Give your practice a line that keeps up in April",
    faq: [
      { q: "Can I share sensitive tax details by text?", a: "We'd advise against it. Use SMS for reminders and scheduling, and keep Social Security numbers and financial details in your secure client portal." },
      { q: "Can my seasonal staff answer calls too?", a: "Anyone signed in to the account rings with you. Separate team seats are coming soon." },
      { q: "Can calls go to voicemail after 5 p.m.?", a: "Business-hours routing is coming soon. Today, sign out of the app and leave out the forwarding phone, and calls go to voicemail." },
      { q: "What's the cost of forwarded calls?", a: "Forwarded minutes to US and Canada cellphones are billed like other calls, $0.015/min." },
    ],
    related: ["/solutions/small-business", "/answering-service/insurance", "/product/voicemail"],
  },
  /* automotive */
  {
    slug: "automotive",
    title: "Answering Service for Auto Repair Shops | DIGIRINGO",
    description:
      "Auto shops and dealers catch service calls while techs are on the floor. Calls ring the front counter and your phone, forward to a cell, and fall to voicemail.",
    eyebrow: "Answering service for auto shops",
    h1: "Book the brake job, even when everyone's under a car",
    sub: "Service writers juggle walk-ins, parts calls and customers asking if their car is ready. DIGIRINGO rings the counter computer and your Android phone at once, forwards to the owner's cell, and logs every missed call so it gets returned before closing.",
    bullets: [
      "Counter laptop and shop phone ring together",
      "Text customers when their car is ready",
      "Every missed call kept in a callback list",
    ],
    defTitle: "Why repair shops lose calls",
    def: [
      "A busy shop has a phone that rings exactly when nobody can reach it: the service writer is with a customer, the techs are on lifts and the owner is road-testing a car. A missed call is often someone with a warning light who will book wherever answers first.",
      "Covering those calls doesn't always need an operator. It needs the call to reach someone with a free hand, and a reliable record of who to call back.",
    ],
    scenariosTitle: "Shop calls worth catching",
    scenarios: [
      { title: "Check-engine light", body: "A driver wants to bring it in today. A quick answer books the diagnostic.", icon: "zap" },
      { title: "Is my car ready?", body: "Text the customer when it's done and cut down on these calls.", icon: "message" },
      { title: "Tow-in coordination", body: "A tow driver calls from the road; forwarding gets it to the owner's cell.", icon: "truck" },
      { title: "Parts supplier callbacks", body: "Return the supplier's call from call history with the shop's number.", icon: "phone-outgoing" },
    ],
    stepsTitle: "How to cover your shop's phone",
    steps: [
      { title: "Get a local shop number", body: "Use it on your sign, your listing and your invoices.", icon: "store" },
      { title: "Sign in at the counter and on your phone", body: "Both ring at once for every call.", icon: "monitor" },
      { title: "Set the owner's cell as backup", body: "Unanswered calls forward there, then voicemail.", icon: "phone-forwarded" },
    ],
    tableRows: [["Knows your shop's labor rates and hours", "You answer, so yes", "Only what's in their script"]],
    soonTitle: "Coming: AI booking for service appointments",
    soonBody: "Our AI receptionist, in development, will take the caller's name, vehicle and problem and send it to you. Missed-call text-back is coming too. Today you can route the number to your own AI or SIP agent if you already use one.",
    ctaTitle: "Stop losing service calls to the shop down the road",
    faq: [
      { q: "Can customers text me photos of damage?", a: "Picture messages (MMS) are coming soon. Plain SMS works today after 10DLC registration." },
      { q: "Does it replace my shop's landline?", a: "It can. Porting your existing number is coming soon; until then many shops forward the old line to a new DIGIRINGO number." },
      { q: "Can I send an automatic text when I miss a call?", a: "Missed-call auto-replies are coming soon. Today you text back manually from the call history." },
      { q: "Is there a contract?", a: "No. Prepaid wallet, $2.50/month per US number, $0.015/min in the US and Canada." },
    ],
    related: ["/solutions/small-business", "/features/callback-service", "/blog/missed-call-text-back"],
  },
  /* chiropractic */
  {
    slug: "chiropractic",
    title: "Answering Service for Chiropractors | DIGIRINGO",
    description:
      "Chiropractic offices keep booking calls from going unanswered during adjustments. Calls ring the front desk and your phone, forward to a cell, then voicemail.",
    eyebrow: "Answering service for chiropractors",
    h1: "Keep the schedule full while your hands are busy",
    sub: "During an adjustment you can't pick up, and in a small office there may be nobody else to. DIGIRINGO rings the front desk and your phone together, forwards unanswered calls to a backup cell, and keeps a list of missed callers to ring back between patients.",
    bullets: [
      "Front desk and practitioner phones ring at once",
      "Call back new patients the same hour",
      "Appointment reminder texts from the office number",
    ],
    defTitle: "Why chiropractic offices miss calls",
    def: [
      "Many chiropractors run lean: one doctor, one front-desk person, sometimes neither free. New patients often call during a flare-up of back pain and want to be seen soon. If they can't get through, they'll try the next clinic.",
      "Good call coverage for a practice like this means booking calls reach someone quickly, and the ones that don't get returned before the caller books elsewhere.",
    ],
    scenariosTitle: "Calls a practice wants to catch",
    scenarios: [
      { title: "Acute pain, wants today", body: "A new patient threw out their back. A same-day callback can fill an open slot.", icon: "phone-incoming" },
      { title: "Reschedules", body: "A regular can't make Thursday. Catching it frees the slot for someone else.", icon: "calendar" },
      { title: "Reminder replies", body: "Patients reply to your text to confirm, and fewer slots go empty.", icon: "message" },
    ],
    stepsTitle: "How to set up coverage for your clinic",
    steps: [
      { title: "Pick a number near your clinic", body: "A local area code patients recognize.", icon: "map-pin" },
      { title: "Sign in at the desk and on your phone", body: "Every call rings both.", icon: "monitor" },
      { title: "Forward to a backup cell", body: "If the desk is empty, calls reach the backup phone after about 30 seconds.", icon: "phone-forwarded" },
    ],
    tableRows: [["Can book directly into your schedule", "soon", "Some can, with access to your calendar"]],
    soonTitle: "Coming: an AI receptionist for booking calls",
    soonBody: "Our built-in AI receptionist, in development, will collect a new patient's name, number and reason for the visit. Scheduled reminder texts are on the way too. DIGIRINGO doesn't currently claim HIPAA compliance, so keep clinical details off calls and texts.",
    ctaTitle: "Turn missed calls into booked adjustments",
    faq: [
      { q: "Is DIGIRINGO HIPAA compliant?", a: "We don't currently claim HIPAA compliance or sign business associate agreements. Use it for scheduling and general calls." },
      { q: "Can I schedule reminder texts ahead of time?", a: "Scheduled messages are coming soon. Today you send them from the inbox." },
      { q: "Can calls go to voicemail at lunch?", a: "Business-hours routing is coming soon. Today calls ring, forward if you set a phone, then go to voicemail." },
      { q: "How much does it cost?", a: "$2.50/month for a US local number, $0.015/min for calls and $0.015 per text in the US and Canada." },
    ],
    related: ["/solutions/healthcare", "/answering-service/salon", "/product/voicemail"],
  },
  /* construction */
  {
    slug: "construction",
    title: "Answering Service for Construction Companies | DIGIRINGO",
    description:
      "Builders and GCs catch bid requests and client calls from the job site. Calls ring the office and your phone, forward to the site super, and land in voicemail.",
    eyebrow: "Answering service for construction",
    h1: "Don't let the next bid go to voicemail",
    sub: "When the saw is running, you won't hear the phone. DIGIRINGO rings the office and your Android phone together, forwards unanswered calls to your superintendent's cell, and keeps every missed call in a list so bid requests get answered the same day.",
    bullets: [
      "Office and field ring at the same time",
      "Forward to the site super or project manager",
      "Callback list of every missed call",
    ],
    defTitle: "Why construction calls go unanswered",
    def: [
      "General contractors and builders spend the day on sites with noise, gloves and ladders. The office might be one person, or nobody. Meanwhile a developer is calling to invite you to bid, an inspector wants to move tomorrow's visit and a homeowner is asking about a change order.",
      "Each of those calls can be worth a lot. The aim is to get them to whoever is free, quickly, and to make sure none disappear without a callback.",
    ],
    scenariosTitle: "Calls a builder can't miss",
    scenarios: [
      { title: "Invitation to bid", body: "A developer has a deadline. Calling back the same day keeps you on the list.", icon: "briefcase" },
      { title: "Inspector reschedule", body: "Missing this call can stall a pour or a framing inspection.", icon: "calendar" },
      { title: "Sub no-show", body: "Your electrician can't make it. You need to know before the crew stands around.", icon: "users" },
      { title: "Change-order question", body: "The homeowner wants to talk before approving extra work.", icon: "file" },
    ],
    stepsTitle: "How to cover calls from the field",
    steps: [
      { title: "Get a company number", body: "Put it on your yard signs, trucks and bid documents.", icon: "truck" },
      { title: "Sign in on the office computer and your phone", body: "Every call rings both.", icon: "smartphone" },
      { title: "Forward to the super's cell", body: "Change the forwarding phone as projects change.", icon: "phone-forwarded" },
    ],
    tableRows: [["Can answer technical questions about the job", "You or your super answer", "Usually takes a message"]],
    soonTitle: "Coming: AI intake for estimate requests",
    soonBody: "Our AI receptionist, in development, will ask callers about project type, address and timeline and send you a summary. Call transfer and ring groups for your crew are also coming. Today you can route your number to your own AI or SIP agent.",
    ctaTitle: "Answer every bid request, even from the roof",
    faq: [
      { q: "Can I transfer a call to my project manager?", a: "Call transfer is coming soon. Today you can set the PM's cell as your forwarding phone." },
      { q: "What if the site has no Wi-Fi?", a: "The app works on mobile data. If data is weak, forwarding sends the call to your cellphone over the regular cell network." },
      { q: "Can I record client calls?", a: "Call recording is coming soon." },
      { q: "Do I pay per user?", a: "No. You pay for numbers and minutes only." },
    ],
    related: ["/solutions/construction", "/answering-service/contractor", "/answering-service/roofing"],
  },
  /* contractor */
  {
    slug: "contractor",
    title: "Answering Service for Contractors | DIGIRINGO",
    description:
      "Remodelers, handymen and specialty contractors catch estimate calls while working. Ring your phone and laptop, forward to a cell, voicemail and a callback list.",
    eyebrow: "Answering service for contractors",
    h1: "Win the estimate, even when you're mid-install",
    sub: "Homeowners often call a few contractors and go with whoever calls back first. DIGIRINGO rings your Android phone and laptop at once, forwards to your cell or your partner's when you can't answer, and keeps every missed call ready for a callback.",
    bullets: [
      "Local business number separate from your personal cell",
      "Forward unanswered calls to a partner or helper",
      "Text homeowners estimate times and reminders",
    ],
    defTitle: "Why independent contractors need coverage",
    def: [
      "If you're a one- or two-person outfit, you're the estimator, the installer and the office. Every hour on a job is an hour the phone can't be answered properly, and voicemail-only feels like a closed business to a homeowner.",
      "You don't need a call center. You need a business number that reaches you wherever you are, a backup when you're busy, and a quick way to return calls.",
    ],
    scenariosTitle: "Contractor calls that turn into work",
    scenarios: [
      { title: "Kitchen remodel inquiry", body: "A homeowner saw your yard sign. The first callback usually gets the walkthrough.", icon: "home" },
      { title: "Deck estimate for spring", body: "Seasonal rush calls stack up; the callback list keeps them in order.", icon: "list" },
      { title: "Punch-list follow-up", body: "A past client calls about a sticking door. A fast reply earns a referral.", icon: "wrench" },
    ],
    stepsTitle: "How to set up your line",
    steps: [
      { title: "Pick a local number", body: "Use it on signs, your truck and online listings.", icon: "hash" },
      { title: "Add a backup phone", body: "Your cell or your partner's catches what you can't.", icon: "phone-forwarded" },
      { title: "Register for texting", body: "Complete 10DLC in the Trust Center so estimate reminders get delivered.", icon: "shield" },
    ],
    tableRows: [["Gives real answers about scope and pricing", "You answer, so yes", "Usually takes a message"]],
    soonTitle: "Coming: missed-call text-back and AI intake",
    soonBody: "Automatic texts to missed callers and our own AI receptionist are in development. Today, you can point your number at an AI or SIP agent you already use, or rely on forwarding plus voicemail.",
    ctaTitle: "Get a contractor line that follows you to the job",
    faq: [
      { q: "Can I use my existing number?", a: "Porting is coming soon. You can forward your old number to a new DIGIRINGO line in the meantime." },
      { q: "Will homeowners see my personal cell?", a: "No. Calls you make from the app show your business number." },
      { q: "Can I send a text when I miss a call?", a: "Manually today; automatic text-back is coming soon." },
      { q: "Is there a monthly minimum?", a: "No. Just $2.50/month per US number and pay-as-you-go usage." },
    ],
    related: ["/solutions/home-services", "/answering-service/construction", "/templates/home-services-estimate"],
  },
  /* ecommerce */
  {
    slug: "ecommerce",
    title: "Answering Service for Ecommerce Stores | DIGIRINGO",
    description:
      "Online stores give shoppers a real support number. Calls ring your laptop and phone, forward to a cell, voicemail catches the rest, and texts answer fast.",
    eyebrow: "Answering service for ecommerce",
    h1: "A phone number shoppers trust, without a call center",
    sub: "A visible phone number makes a store look real, but it means calls about orders, returns and sizing. DIGIRINGO rings your laptop and phone, forwards when you're packing orders, and lets you text a tracking link instead of talking through it.",
    bullets: [
      "Toll-free or local support number from $2.50/month",
      "Ring every device, then forward, then voicemail",
      "Route overflow to an AI or SIP support agent",
    ],
    shot: "inbox",
    defTitle: "Why online stores need phone coverage",
    def: [
      "Most shoppers never call, but the ones who do are often about to place a larger order or about to dispute a charge. Both are worth catching. A number that rings out makes the store look abandoned.",
      "For a small brand, the person answering is also the person packing boxes and running ads. The phone has to reach them in the stockroom and at the desk, and make missed calls easy to clear.",
    ],
    scenariosTitle: "Ecommerce calls worth answering",
    scenarios: [
      { title: "Pre-sale sizing question", body: "A shopper with a full cart wants to check fit. Answer and you keep the sale.", icon: "store" },
      { title: "Where is my order?", body: "Text back a tracking link from your local support number in seconds.", icon: "truck" },
      { title: "Chargeback prevention", body: "A customer calling about a wrong item is better than one who disputes the charge.", icon: "credit-card" },
      { title: "Wholesale inquiry", body: "A boutique owner wants to stock your product. Don't let it ring out.", icon: "briefcase" },
    ],
    stepsTitle: "How to add phone support to your store",
    steps: [
      { title: "Choose toll-free or local", body: "Toll-free if you sell nationally; local if you want to text customers today.", icon: "hash" },
      { title: "Put it in your footer and order emails", body: "Shoppers see it at checkout and in their receipt.", icon: "globe" },
      { title: "Route overflow if you need to", body: "Send the number to an outside SIP or AI agent during sales events.", icon: "route" },
    ],
    tableRows: [["Answers from your own order system", "If you route to your own AI agent", "Rarely has store access"]],
    soonTitle: "Coming: AI answers for order questions",
    soonBody: "Our built-in AI receptionist is in development. Today, developers can route the number to their own voice agent through a webhook or SIP and connect it to their store's data. Toll-free texting is also coming soon.",
    ctaTitle: "Add a support number to your store today",
    faq: [
      { q: "Can shoppers text my toll-free number?", a: "Toll-free texting verification is coming soon. Local US and Canada numbers support SMS today after 10DLC registration." },
      { q: "Can I connect it to Shopify?", a: "Store integrations are not available yet. A developer can use per-number webhook routing to build a custom flow." },
      { q: "Can I handle international customers?", a: "Yes. You can buy numbers in many countries and call 220+ countries at the rates on our rate list." },
      { q: "Is there a seat fee?", a: "No per-user fees." },
    ],
    related: ["/solutions/support", "/toll-free-numbers", "/ai-agent"],
  },
  /* electrician */
  {
    slug: "electrician",
    title: "Answering Service for Electricians | DIGIRINGO",
    description:
      "Electricians catch outage and panel calls while on a job. Calls ring your phone and laptop, forward to the on-call electrician, and voicemail catches the rest.",
    eyebrow: "Answering service for electricians",
    h1: "Half the house is dark. Make sure they reach you.",
    sub: "Electrical calls are often urgent, and they arrive while you're inside a panel with the power off. DIGIRINGO rings your phone and laptop together, forwards to the on-call electrician's cell, and keeps every missed call ready to return when you're done.",
    bullets: [
      "Forward after-hours outages to whoever is on call",
      "Business number separate from your personal phone",
      "Text customers your arrival window",
    ],
    defTitle: "Why electricians need call coverage",
    def: [
      "When a breaker won't reset or an outlet is scorched, people call until somebody answers. If that's not you, it's a competitor. At the same time, you can't answer safely while working on live circuits.",
      "Call coverage for an electrician means the phone reaches someone who's free to talk, and anything missed is easy to return within minutes.",
    ],
    scenariosTitle: "Electrical calls you can't miss",
    scenarios: [
      { title: "Partial power outage", body: "Half the house is dead after a storm. Urgent and well paid.", icon: "zap" },
      { title: "Panel upgrade quote", body: "A homeowner adding an EV charger wants an estimate this week.", icon: "home" },
      { title: "Builder call for rough-in", body: "A GC needs you on site tomorrow. Missing the call can cost the relationship.", icon: "briefcase" },
      { title: "Inspection scheduling", body: "The inspector's office calls to confirm a time.", icon: "calendar" },
    ],
    stepsTitle: "How to cover your calls",
    steps: [
      { title: "Get a local number", body: "Use it on your van, your website and your estimates.", icon: "truck" },
      { title: "Set the on-call cell as forwarding phone", body: "Change it when the rotation changes.", icon: "phone-forwarded" },
      { title: "Return missed calls from history", body: "Call back with your business caller ID.", icon: "refresh" },
    ],
    tableRows: [["Can judge whether it's a real emergency", "You do", "Follows a script"]],
    soonTitle: "Coming: after-hours rules and AI triage",
    soonBody: "Business-hours routing and our AI receptionist are in development, so after-hours calls can be screened before they wake you. Today you can route the number to your own AI or SIP answering agent.",
    ctaTitle: "Keep emergency calls coming to you",
    faq: [
      { q: "Can only emergencies forward at night?", a: "Not yet. Business-hours rules and phone menus are coming soon. Today all unanswered calls forward to the phone you set." },
      { q: "Can I answer hands-free?", a: "Use a Bluetooth headset with the Android app, or let calls forward to your cell." },
      { q: "Can customers send photos of the panel?", a: "MMS is coming soon. SMS works today after 10DLC registration." },
      { q: "What does it cost?", a: "$2.50/month per US number, $0.015/min in the US and Canada." },
    ],
    related: ["/solutions/home-services", "/answering-service/hvac", "/answering-service/plumbing"],
  },
  /* franchise */
  {
    slug: "franchise",
    title: "Answering Service for Franchise Locations | DIGIRINGO",
    description:
      "Each franchise location answers its own calls on a local number. Ring the front counter and manager's phone, forward to a cell, voicemail as a final backstop.",
    eyebrow: "Answering service for franchises",
    h1: "Every location answers its own phone",
    sub: "When a customer calls the location near them, they want that location. DIGIRINGO gives each one a local number that rings the counter and the manager's phone, forwards when it's busy, and keeps missed calls in that location's callback list.",
    bullets: [
      "Local number per territory",
      "Counter and manager ring together",
      "Missed calls kept per location",
    ],
    shot: "numbers",
    defTitle: "Why franchise locations miss calls",
    def: [
      "Franchise staff are usually serving customers in person. The phone rings during the lunch rush or the Saturday morning peak, exactly when nobody can step away.",
      "Brand-level answering services can help, but callers often want something only the location knows: does this store have it in stock, can they fit me in at 4. Getting the call to the location, or its manager, solves most of that.",
    ],
    scenariosTitle: "Location calls that matter",
    scenarios: [
      { title: "Same-day booking", body: "A caller wants a slot this afternoon. Only the store knows if there is one.", icon: "calendar" },
      { title: "Catering or bulk order", body: "One big order call can be worth more than a dozen walk-ins.", icon: "store" },
      { title: "Hours and directions", body: "Simple calls, but unanswered ones send people elsewhere.", icon: "map-pin" },
    ],
    stepsTitle: "How to cover calls at each location",
    steps: [
      { title: "Each location gets a number", body: "Search the territory's area code.", icon: "search" },
      { title: "Sign in at the counter", body: "The counter computer and the manager's Android phone both ring.", icon: "monitor" },
      { title: "Set the manager's cell as backup", body: "Busy rush? Calls forward after about 30 seconds.", icon: "phone-forwarded" },
    ],
    tableRows: [["Knows local stock and availability", "Location staff answer", "Usually not"]],
    soonTitle: "Coming: brand-wide management and AI answering",
    soonBody: "A central admin for many locations, team seats and our AI receptionist are in development. Today each location runs its own account, and any location can route its number to an AI or SIP agent the brand provides.",
    ctaTitle: "Give each location a line that gets answered",
    faq: [
      { q: "Can headquarters manage every location?", a: "A central admin is coming soon. Today each location has its own account." },
      { q: "Can one brand answering service cover all locations?", a: "If it accepts SIP calls, each location can route its number to it." },
      { q: "Can I see missed calls across locations?", a: "Cross-location analytics are coming soon." },
      { q: "What does each location pay?", a: "$2.50/month per US number plus $0.015/min and $0.015/text in the US and Canada." },
    ],
    related: ["/solutions/franchise", "/local-numbers", "/answering-service/salon"],
  },
  /* hvac */
  {
    slug: "hvac",
    title: "Answering Service for HVAC Companies | DIGIRINGO",
    description:
      "HVAC companies catch no-heat and no-cool calls in the first heat wave or cold snap. Ring every device, forward to the on-call tech, use voicemail as backup.",
    eyebrow: "Answering service for HVAC",
    h1: "The first cold snap is when your phone matters most",
    sub: "When the first freeze hits or the AC quits in July, everyone calls at once. DIGIRINGO rings the dispatch computer and your phone together, forwards to the on-call tech's cell, and lists every missed call so you can book them in order.",
    bullets: [
      "Dispatch laptop and phone ring at once",
      "On-call tech gets forwarded calls at night",
      "Text customers their service window",
    ],
    defTitle: "Why HVAC call volume breaks voicemail",
    def: [
      "HVAC demand follows the weather. A mild Tuesday might bring a handful of calls; the first 95-degree day brings far more, and the callers are hot, uncomfortable and dialing every company they can find.",
      "In those surges, the goal is simple: answer what you can, forward what you can't to a tech who can, and have a complete list of the rest to call back before they book with someone else.",
    ],
    scenariosTitle: "HVAC calls you can't afford to lose",
    scenarios: [
      { title: "No heat at night", body: "A family with a dead furnace in January. They'll pay for an emergency visit.", icon: "moon" },
      { title: "AC down in a heat wave", body: "During a surge, the callback list keeps every caller in order.", icon: "list" },
      { title: "Maintenance plan tune-ups", body: "Text members to book their spring tune-up.", icon: "message" },
      { title: "Replacement quote", body: "A new system is a large ticket. Don't let it reach voicemail.", icon: "dollar" },
    ],
    stepsTitle: "How to set up HVAC call coverage",
    steps: [
      { title: "Get a local number", body: "Put it on vans, equipment stickers and your site.", icon: "truck" },
      { title: "Sign in at dispatch and on phones", body: "Every call rings both.", icon: "monitor" },
      { title: "Set the on-call tech's cell for forwarding", body: "Update it when the on-call rotation changes.", icon: "phone-forwarded" },
    ],
    tableRows: [["Handles dozens of calls at once in a heat wave", "Rings you; overflow goes to voicemail or your AI agent", "Yes, with enough agents"]],
    soonTitle: "Coming: storm-day overflow with AI",
    soonBody: "Our AI receptionist, in development, will take name, address and symptoms for every overflow call. Business-hours routing is coming too. Today, you can route the number to your own AI or SIP agent for surge days.",
    ctaTitle: "Be the HVAC company that answers",
    faq: [
      { q: "Can I switch to an answering agent just for heat waves?", a: "Yes. Change the number's route to your SIP or AI agent in settings, and switch it back when things calm down." },
      { q: "Can I send all members a tune-up reminder at once?", a: "Group and scheduled texting are coming soon. Today texts go one by one." },
      { q: "Can after-hours calls go to a different tech each night?", a: "Today you update the forwarding phone. Scheduled rotations are coming soon." },
      { q: "How much do forwarded calls cost?", a: "Calls to US and Canada phones are $0.015/min." },
    ],
    related: ["/solutions/home-services", "/answering-service/plumbing", "/answering-service/electrician"],
  },
  /* insurance */
  {
    slug: "insurance",
    title: "Answering Service for Insurance Agencies | DIGIRINGO",
    description:
      "Insurance agents catch quote requests and claim questions on any device. Forward unanswered calls to a cell, keep voicemail as backup, text policy reminders.",
    eyebrow: "Answering service for insurance agents",
    h1: "Answer the quote request before another agent does",
    sub: "Quote shoppers often call several agencies in one afternoon. DIGIRINGO rings your desk and phone together, forwards to your cell when you're with a client, and keeps a list of missed callers so you're the agent who calls back first.",
    bullets: [
      "Agency number on every device",
      "Callback list so no quote request goes cold",
      "Renewal reminder texts from the agency line",
    ],
    defTitle: "Why insurance agencies lose calls",
    def: [
      "An independent agent spends the day in client meetings, on carrier portals and on the road. Inbound calls are a mix of new quote requests, policy questions and clients who just had an accident.",
      "Each kind matters. The quote shopper may be gone in an hour; the client with a claim wants to hear a familiar voice. Coverage that reaches you, or a colleague, does more than a generic operator would.",
    ],
    scenariosTitle: "Calls an agency must catch",
    scenarios: [
      { title: "Auto quote shopper", body: "They're comparing agencies today. The first callback often wins.", icon: "search" },
      { title: "Fender-bender call", body: "A client just had an accident and wants guidance. Forwarding gets it to you.", icon: "phone-incoming" },
      { title: "Renewal questions", body: "A client sees a premium increase and wants to talk before switching.", icon: "refresh" },
      { title: "Certificate requests", body: "A contractor client needs a certificate of insurance today for a job.", icon: "file" },
    ],
    stepsTitle: "How to set up agency call coverage",
    steps: [
      { title: "Get a local agency number", body: "Clients are more likely to pick up a callback from a local area code.", icon: "hash" },
      { title: "Forward to your cell during meetings", body: "Calls you can't take in the app reach your phone.", icon: "phone-forwarded" },
      { title: "Work the callback list", body: "Return every missed call from history with your agency caller ID.", icon: "list" },
    ],
    tableRows: [["Licensed to discuss coverage", "You are", "Usually not; takes a message"]],
    soonTitle: "Coming: AI intake for quote requests",
    soonBody: "Our AI receptionist, in development, will collect the caller's name, the type of policy and a good callback time. Call recording and CRM integrations are coming too. Today, you can route your number to an AI or SIP agent you already use.",
    ctaTitle: "Be the first agent to call back",
    faq: [
      { q: "Can I record calls for compliance?", a: "Call recording is coming soon." },
      { q: "Does it connect to my agency management system?", a: "Integrations are coming soon. A developer can use per-number webhook routing in the meantime." },
      { q: "Can my CSR answer too?", a: "Anyone signed in to the account rings with you. Team seats are coming soon." },
      { q: "Is there a contract?", a: "No. Pay as you go from a prepaid wallet." },
    ],
    related: ["/solutions/sales", "/answering-service/accountant", "/product/call-analytics/call-logs"],
  },
  /* landscaping */
  {
    slug: "landscaping",
    title: "Answering Service for Landscapers | DIGIRINGO",
    description:
      "Landscaping crews catch spring estimate calls over the noise of mowers. Calls ring your phone and laptop, forward to a crew lead, and land in voicemail last.",
    eyebrow: "Answering service for landscapers",
    h1: "You can't hear the phone over a mower. That's fine.",
    sub: "Spring brings a flood of estimate requests while your crews are at their loudest. DIGIRINGO rings your phone and the office laptop, forwards to the crew lead when you're on a mower, and keeps a full list of missed calls to return at the end of the day.",
    bullets: [
      "Estimate calls ring office and field together",
      "Forward to a crew lead's cell",
      "Text customers when the crew is on the way",
    ],
    defTitle: "Why landscapers miss calls in peak season",
    def: [
      "Landscaping is seasonal and loud. From March to June, you're booking spring cleanups, mulch, new installs and weekly mowing contracts, all while running equipment that drowns out a ringtone.",
      "A weekly mowing customer can be worth a full season of revenue. Catching that first call, or calling back the same evening, is what fills the route.",
    ],
    scenariosTitle: "Landscaping calls worth catching",
    scenarios: [
      { title: "Weekly mowing contract", body: "One call can fill a route slot for the whole season.", icon: "repeat" },
      { title: "Spring cleanup estimate", body: "Homeowners call in bunches after the first warm weekend.", icon: "calendar" },
      { title: "Storm damage", body: "A fallen limb on the driveway. A quick response earns loyalty.", icon: "zap" },
      { title: "Rain delay notices", body: "Text customers that Thursday moves to Friday.", icon: "message" },
    ],
    stepsTitle: "How to set up landscaping call coverage",
    steps: [
      { title: "Pick a local number", body: "Use it on trucks, trailers and door hangers.", icon: "truck" },
      { title: "Forward to your crew lead", body: "Whoever isn't on a machine catches the call.", icon: "phone-forwarded" },
      { title: "Return calls at the end of the day", body: "Call history shows every missed caller.", icon: "list" },
    ],
    tableRows: [["Can price a job over the phone", "You can", "Usually takes a message"]],
    soonTitle: "Coming: auto-replies for peak season",
    soonBody: "Missed-call text-back and our AI receptionist are in development, so callers get a reply even when you're on a mower. Today you can route your number to your own AI or SIP agent.",
    ctaTitle: "Fill your route this season",
    faq: [
      { q: "Can I quiet the line in winter?", a: "Yes. Sign out of the app and remove the forwarding phone, and calls go to voicemail. You keep paying only for the number and any minutes used." },
      { q: "Can customers send yard photos?", a: "MMS is coming soon." },
      { q: "Can I text all my weekly customers about a rain day?", a: "Group texting is coming soon. Today texts go one-to-one." },
      { q: "How much is a number?", a: "$2.50/month for a US local number." },
    ],
    related: ["/solutions/home-services", "/answering-service/pest-control", "/answering-service/cleaning"],
  },
  /* legal */
  {
    slug: "legal",
    title: "Answering Service for Law Firms | DIGIRINGO",
    description:
      "Law firms catch potential-client intake calls on any device. Forward to your cell from court, voicemail when nobody answers, and route to your own intake agent.",
    eyebrow: "Answering service for law firms",
    h1: "The client who calls first is often the one who hires you",
    sub: "Someone just got arrested, served or injured, and they're calling lawyers in order. DIGIRINGO rings your laptop and phone together, forwards to your cell when you're in court, and lists every missed intake call so you can call back between hearings.",
    bullets: [
      "Intake calls ring every device you're signed in on",
      "Forward to a partner's or paralegal's cell",
      "Route to your own legal intake agent over SIP",
    ],
    defTitle: "Why law firms lose intake calls",
    def: [
      "Most people with a new legal problem don't wait. They search, call the first few firms and retain whoever responds with real answers. A solo attorney in a deposition is unreachable for hours.",
      "Some firms use a legal intake service for this. DIGIRINGO can work alongside one, by routing your number to them, or on its own, by getting calls to whoever in the firm is free.",
    ],
    scenariosTitle: "Calls a firm has to catch",
    scenarios: [
      { title: "Arrest on a Saturday", body: "A family member calls to retain a defense attorney. Forwarding gets it to your cell.", icon: "phone-forwarded" },
      { title: "Personal injury intake", body: "An accident victim is calling several firms. The first callback often wins.", icon: "phone-incoming" },
      { title: "Opposing counsel", body: "A settlement call you don't want sitting in voicemail.", icon: "scale" },
      { title: "Existing client update", body: "Text a hearing reminder from the firm's number.", icon: "message" },
    ],
    stepsTitle: "How to cover intake calls",
    steps: [
      { title: "Get a firm number", body: "Local for your city, or toll-free for statewide practice.", icon: "hash" },
      { title: "Forward when you're in court", body: "Set a colleague's cell as backup after about 30 seconds.", icon: "phone-forwarded" },
      { title: "Optional: route to an intake service", body: "Send the number to your legal intake agent over SIP or webhook.", icon: "route" },
    ],
    tableRows: [["Screens for conflicts", "You do, on callback", "Some legal intake services do"]],
    soonTitle: "Coming: AI intake and call recording",
    soonBody: "Our AI receptionist, in development, will gather the caller's name, matter type and urgency. Call recording and voicemail-to-text are also coming. Check your state's consent rules before recording calls.",
    ctaTitle: "Return every intake call first",
    faq: [
      { q: "Can I use DIGIRINGO with my legal intake service?", a: "Yes, if they accept SIP calls or give you a number to forward to." },
      { q: "Will my personal cell be exposed?", a: "No. Callbacks from the app show the firm's number." },
      { q: "Can I get voicemail transcripts?", a: "Voicemail-to-text is coming soon." },
      { q: "Does it integrate with practice management software?", a: "Integrations are coming soon." },
    ],
    related: ["/solutions/law-firms", "/ai-agent", "/product/calling/voip-caller-id"],
  },
  /* pest-control */
  {
    slug: "pest-control",
    title: "Answering Service for Pest Control | DIGIRINGO",
    description:
      "Pest control companies catch urgent wasp, rodent and bed bug calls on any device. Forward to the route tech, keep voicemail as backup, text arrival windows.",
    eyebrow: "Answering service for pest control",
    h1: "Nobody waits politely when there's a wasp nest by the door",
    sub: "Pest calls are emotional and urgent: mice in the pantry, bed bugs after a trip, a nest over the kids' swing set. DIGIRINGO rings the office and your phone together, forwards to the route tech's cell and lists missed calls to call back before the caller books elsewhere.",
    bullets: [
      "Office and route techs ring together",
      "Forward urgent calls to whoever is closest",
      "Text quarterly service reminders",
    ],
    defTitle: "Why pest control calls can't wait",
    def: [
      "People call a pest company the moment they see the problem, often in the evening when they find droppings or on a weekend when they spot a nest. They want someone soon and they'll keep dialing until they get them.",
      "Recurring service plans are where pest control earns. A first call answered fast can turn into years of quarterly visits.",
    ],
    scenariosTitle: "Pest calls that turn into plans",
    scenarios: [
      { title: "Mice in the kitchen", body: "An evening call. A callback the same night books a morning visit.", icon: "home" },
      { title: "Bed bugs after travel", body: "A bigger treatment, and the caller wants it handled discreetly and fast.", icon: "moon" },
      { title: "Wasp nest at a daycare", body: "A commercial client who needs you before the kids arrive.", icon: "building" },
      { title: "Quarterly reminder", body: "Text plan customers their next service date.", icon: "calendar" },
    ],
    stepsTitle: "How to set up coverage",
    steps: [
      { title: "Get a local number", body: "Use it on trucks, door hangers and your listing.", icon: "truck" },
      { title: "Sign in at the office and on route phones", body: "All signed-in devices ring together.", icon: "smartphone" },
      { title: "Forward to the on-call tech", body: "Evening calls reach someone who can schedule.", icon: "phone-forwarded" },
    ],
    tableRows: [["Can identify the pest from the caller's description", "You can", "Takes a message"]],
    soonTitle: "Coming: missed-call text-back and AI booking",
    soonBody: "Automatic replies to missed callers and our AI receptionist are in development. Today you can route the number to an AI or SIP agent you already use, or rely on forwarding plus voicemail.",
    ctaTitle: "Answer the call before they find another exterminator",
    faq: [
      { q: "Can customers text me a photo of the bug?", a: "MMS is coming soon. Plain SMS works today after 10DLC registration." },
      { q: "Can I schedule reminder texts for plan customers?", a: "Scheduled messages are coming soon. Today you send them manually." },
      { q: "Can evening calls go to a different person?", a: "Set the forwarding phone to that person's cell. Time-based rules are coming soon." },
      { q: "What do calls cost?", a: "$0.015/min in the US and Canada." },
    ],
    related: ["/solutions/home-services", "/answering-service/landscaping", "/answering-service/cleaning"],
  },
  /* plumbing */
  {
    slug: "plumbing",
    title: "Answering Service for Plumbers | DIGIRINGO",
    description:
      "Plumbers catch burst pipe and backed-up drain calls at 2 a.m. Ring your phone and laptop, forward to the on-call plumber's cell, and keep voicemail as backup.",
    eyebrow: "Answering service for plumbers",
    h1: "A burst pipe at 2 a.m. should reach a plumber, not a ringtone",
    sub: "Water emergencies don't keep office hours. DIGIRINGO rings your phone and the office laptop together, forwards to the on-call plumber's cell when nobody answers in the app, and keeps a list of every missed call so no flooded basement waits until morning.",
    bullets: [
      "Night calls forward to the on-call plumber",
      "Office and truck ring together during the day",
      "Text arrival windows from the business number",
    ],
    defTitle: "Why plumbers can't afford missed calls",
    def: [
      "A homeowner standing in an inch of water will call every plumber on the first page of results. The first one who answers usually gets the emergency job, and often becomes their plumber for years.",
      "During the day the problem is different: you're under a sink with wet hands. Either way, the call needs to reach someone, and anything missed needs a fast callback.",
    ],
    scenariosTitle: "Plumbing calls worth getting up for",
    scenarios: [
      { title: "Burst pipe at 2 a.m.", body: "Forwarding sends it to the on-call plumber's cell so it doesn't ring out.", icon: "moon" },
      { title: "Sewer backup", body: "A messy, urgent job. Callers won't wait.", icon: "zap" },
      { title: "Water heater out", body: "No hot water for a family of five. A same-day install is likely.", icon: "home" },
      { title: "Restaurant clog at lunch", body: "Commercial clients need you before the dinner rush.", icon: "store" },
    ],
    stepsTitle: "How to set up after-hours coverage",
    steps: [
      { title: "Get a local number", body: "Use it on your van, invoices and Google profile.", icon: "truck" },
      { title: "Set the on-call plumber's cell as forwarding", body: "Unanswered app calls reach them after about 30 seconds.", icon: "phone-forwarded" },
      { title: "Check the callback list each morning", body: "Anyone who reached voicemail gets a call first thing.", icon: "list" },
    ],
    tableRows: [["Emergency at 2 a.m. reaches the plumber directly", "yes", "Agent takes it, then pages the plumber"]],
    soonTitle: "Coming: AI triage for emergency calls",
    soonBody: "Our AI receptionist, in development, will separate true emergencies from routine calls and pass the details on. Business-hours routing is coming too. Today you can route the number to your own AI or SIP answering agent.",
    ctaTitle: "Be the plumber who answers at 2 a.m.",
    faq: [
      { q: "Can only emergency calls ring at night?", a: "Phone menus and after-hours rules are coming soon. Today, every unanswered call forwards to the phone you set." },
      { q: "How do I rotate on-call between plumbers?", a: "Update the forwarding phone in settings when the rotation changes." },
      { q: "Can customers send photos of the leak?", a: "MMS is coming soon." },
      { q: "What do night calls cost?", a: "The same as any other: $0.015/min to US and Canada phones." },
    ],
    related: ["/templates/emergency-plumber", "/solutions/home-services", "/answering-service/hvac"],
  },
  /* property-management */
  {
    slug: "property-management",
    title: "Answering Service for Property Managers | DIGIRINGO",
    description:
      "Property managers catch tenant lockouts, leaks and leasing calls around the clock. Forward to the on-call manager, use voicemail as backup, text tenant updates.",
    eyebrow: "Answering service for property managers",
    h1: "A tenant locked out at midnight needs a human, not a menu",
    sub: "Lockouts, leaks and no-heat calls come at the worst hours. DIGIRINGO rings the office and your phone, forwards after-hours calls to the on-call manager's cell, and keeps every missed call so maintenance requests don't slip through.",
    bullets: [
      "After-hours calls forward to the on-call manager",
      "A number per building or portfolio",
      "Text tenants when the repair is scheduled",
    ],
    shot: "inbox",
    defTitle: "Why property managers need around-the-clock coverage",
    def: [
      "A property manager's phone is three lines in one: maintenance emergencies, leasing inquiries and owner calls. An emergency can mean water spreading to the unit below if nobody responds.",
      "Coverage here means urgent calls always reach someone, leasing calls are returned fast, and there's a record of every call in case a dispute comes up later.",
    ],
    scenariosTitle: "Calls a property manager can't miss",
    scenarios: [
      { title: "Tenant lockout at midnight", body: "Forwarding sends it to the on-call manager, who can send a locksmith.", icon: "lock" },
      { title: "Ceiling leak from upstairs", body: "Minutes matter before the damage spreads.", icon: "zap" },
      { title: "Leasing inquiry", body: "A prospect calling about a vacancy. Fast callbacks shorten vacancy time.", icon: "home" },
      { title: "Owner check-in", body: "An owner wants an update. A separate number lets you see who's calling.", icon: "building" },
    ],
    stepsTitle: "How to set up tenant call coverage",
    steps: [
      { title: "Get a number for tenant calls", body: "Add another for leasing if you like.", icon: "hash" },
      { title: "Set the on-call cell for forwarding", body: "Update it when the rotation changes.", icon: "phone-forwarded" },
      { title: "Review call history each morning", body: "Every after-hours call is listed, answered or not.", icon: "list" },
    ],
    tableRows: [["Dispatches a vendor at night", "Your on-call person does", "Some services do, per your instructions"]],
    soonTitle: "Coming: press 1 for emergencies, and AI intake",
    soonBody: "Phone menus, after-hours rules and our AI receptionist are in development, so non-urgent calls can wait until morning. Today you can route the number to your own AI or SIP agent, or rely on forwarding plus voicemail.",
    ctaTitle: "Make sure tenant emergencies reach someone",
    faq: [
      { q: "Can tenants choose emergency vs. non-emergency?", a: "Phone menus are coming soon. A separate emergency number works well today." },
      { q: "Can I text all tenants about a water shutoff?", a: "Group texting is coming soon. Today texts go one-to-one." },
      { q: "Can I use one number per building?", a: "Yes. Buy as many numbers as you need, $2.50/month each in the US." },
      { q: "Is there a record of tenant calls?", a: "Call history lists every inbound call with time and number. Call recording is coming soon." },
    ],
    related: ["/solutions/property-management", "/templates/property-management", "/answering-service/real-estate"],
  },
  /* real-estate */
  {
    slug: "real-estate",
    title: "Answering Service for Real Estate Agents | DIGIRINGO",
    description:
      "Real estate agents catch buyer calls from yard signs during showings. Calls ring your devices, forward to your cell or a teammate, and voicemail backs it up.",
    eyebrow: "Answering service for real estate",
    h1: "The sign call comes in while you're showing another house",
    sub: "Buyers call from the curb, and they want an answer while they're still standing there. DIGIRINGO rings your phone and laptop together, forwards to a teammate's cell when you're mid-showing, and keeps every missed call so you can follow up within minutes.",
    bullets: [
      "A dedicated number for each listing or campaign",
      "Forward to a teammate while you're showing",
      "Text buyers listing details and showing times",
    ],
    shot: "chat",
    defTitle: "Why agents lose leads to voicemail",
    def: [
      "Real estate leads are fast and impatient. Someone driving past a sign calls the number on it, and if nobody answers, they call the agent on the next sign. Online inquiries work the same way.",
      "Agents spend much of their day in showings, inspections and closings where they can't pick up. Getting the call to a teammate, and calling back fast, protects the lead.",
    ],
    scenariosTitle: "Real estate calls worth catching",
    scenarios: [
      { title: "Yard-sign call", body: "A buyer at the curb right now. Speed wins.", icon: "home" },
      { title: "Open house follow-up", body: "A visitor wants to make an offer. Don't let it sit in voicemail.", icon: "calendar" },
      { title: "Seller listing appointment", body: "A homeowner is interviewing agents this week.", icon: "briefcase" },
    ],
    stepsTitle: "How to cover listing calls",
    steps: [
      { title: "Get a number per listing or campaign", body: "See which sign or ad is producing calls.", icon: "tag" },
      { title: "Forward to a teammate", body: "Set their cell as your forwarding phone during showings.", icon: "phone-forwarded" },
      { title: "Text listing details", body: "Send the address, price and showing times by SMS after 10DLC approval.", icon: "message" },
    ],
    tableRows: [["Knows the listing details", "You and your team do", "Only what you give them"]],
    soonTitle: "Coming: AI lead capture",
    soonBody: "Our AI receptionist, in development, will ask buyers which property they're calling about, their timeline and whether they're pre-approved. Missed-call text-back and CRM integrations are coming too. Today you can route a number to your own AI or SIP agent.",
    ctaTitle: "Get a number for your next listing",
    faq: [
      { q: "Can I use a number per listing?", a: "Yes. Numbers are $2.50/month each in the US, and calls to each show up separately." },
      { q: "Can listing photos be texted?", a: "MMS is coming soon. Send a link to the listing by SMS today." },
      { q: "Does it connect to my CRM?", a: "CRM integrations are coming soon." },
      { q: "Can my team answer the same number?", a: "Anyone signed in to the account rings. Team seats and ring groups are coming soon." },
    ],
    related: ["/answering-service/property-management", "/solutions/sales", "/phone-numbers/multiple-phone-lines"],
  },
  /* roofing */
  {
    slug: "roofing",
    title: "Answering Service for Roofing Companies | DIGIRINGO",
    description:
      "Roofers catch storm-damage and leak calls from the roof or the road. Calls ring your phone and office, forward to a sales rep's cell, then go to voicemail.",
    eyebrow: "Answering service for roofers",
    h1: "After the hailstorm, every homeowner on the street calls at once",
    sub: "Storm days bring a wave of leak and damage calls while your crews are already on roofs. DIGIRINGO rings your phone and the office together, forwards to a sales rep's cell, and keeps every missed call so you can book inspections in order.",
    bullets: [
      "Office and field phones ring together",
      "Forward overflow to a sales rep",
      "Text homeowners inspection times",
    ],
    defTitle: "Why roofing calls come in waves",
    def: [
      "Roofing demand spikes after storms. A neighborhood with hail damage can produce a pile of inspection requests in a day, and out-of-town crews compete for every one.",
      "Local roofers win by answering fast and showing up. Between climbing ladders and meeting adjusters, that means the phone has to reach someone with free hands.",
    ],
    scenariosTitle: "Roofing calls you want",
    scenarios: [
      { title: "Active leak in a rainstorm", body: "Water coming through the ceiling. They need a tarp today.", icon: "zap" },
      { title: "Hail damage inspection", body: "Insurance-backed replacement jobs often start with this call.", icon: "search" },
      { title: "Adjuster meeting", body: "The insurance adjuster calls to set a time. Missing it delays the job.", icon: "calendar" },
      { title: "Missing shingles after wind", body: "A quick repair that builds trust for a future replacement.", icon: "home" },
    ],
    stepsTitle: "How to set up storm-day coverage",
    steps: [
      { title: "Get a local number", body: "Homeowners are wary of out-of-area numbers after storms.", icon: "map-pin" },
      { title: "Forward to a sales rep's cell", body: "Inspection requests reach someone who can book them.", icon: "phone-forwarded" },
      { title: "Work the callback list in order", body: "Call history shows who called first.", icon: "list" },
    ],
    tableRows: [["Handles a storm-day surge", "Rings you; overflow to voicemail or your AI agent", "Yes, if staffed for it"]],
    soonTitle: "Coming: AI intake for storm surges",
    soonBody: "Our AI receptionist, in development, will capture the address, damage type and insurance details for every overflow call. Today you can route your number to your own AI or SIP agent on storm days and switch it back after.",
    ctaTitle: "Book the inspection before the out-of-town crews do",
    faq: [
      { q: "Can I switch routing just for a storm?", a: "Yes. Change the number's route in settings, then switch it back." },
      { q: "Can homeowners text photos of damage?", a: "MMS is coming soon." },
      { q: "Can I record adjuster calls?", a: "Call recording is coming soon." },
      { q: "What does a number cost?", a: "$2.50/month for a US local number." },
    ],
    related: ["/answering-service/construction", "/answering-service/contractor", "/solutions/home-services"],
  },
  /* salon */
  {
    slug: "salon",
    title: "Answering Service for Salons and Spas | DIGIRINGO",
    description:
      "Salons, barbershops and spas catch booking calls while stylists are with clients. Ring the front desk and your phone, forward to a cell, voicemail as backup.",
    eyebrow: "Answering service for salons",
    h1: "Book the next client without putting down the shears",
    sub: "Mid-color or mid-fade is the worst time to answer the phone. DIGIRINGO rings the front-desk computer and your Android phone together, forwards to the owner's cell when nobody can pick up, and keeps a callback list of every client who tried to book.",
    bullets: [
      "Front desk and owner phone ring together",
      "Text appointment confirmations",
      "Callback list for every missed booking",
    ],
    shot: "chat",
    defTitle: "Why salons miss booking calls",
    def: [
      "In a small salon or barbershop, every chair is busy at peak times and there may not be a receptionist. The phone rings during a balayage or a shave, and stopping isn't an option.",
      "A missed booking call is a lost appointment, and clients who can't get through may try the salon down the street. Getting the call answered, or returned quickly, keeps the book full.",
    ],
    scenariosTitle: "Salon calls you want to catch",
    scenarios: [
      { title: "Same-day cancellation fill", body: "Someone cancels; a waiting client calls. A quick callback fills the chair.", icon: "calendar" },
      { title: "Wedding party booking", body: "Six people, one morning. A big booking that shouldn't ring out.", icon: "heart" },
      { title: "Running late", body: "A client texts that they're ten minutes late. You reply from the salon number.", icon: "message" },
    ],
    stepsTitle: "How to set up salon call coverage",
    steps: [
      { title: "Get a local number", body: "Put it on your booking page, social profiles and window.", icon: "store" },
      { title: "Sign in at the front desk", body: "The desk computer's browser and your phone ring together.", icon: "monitor" },
      { title: "Forward to the owner's cell", body: "Busy chairs? Calls forward after about 30 seconds.", icon: "phone-forwarded" },
    ],
    tableRows: [["Knows which stylist has an opening", "Your staff do", "Only with access to your booking system"]],
    soonTitle: "Coming: AI booking and reminder texts",
    soonBody: "Our AI receptionist, in development, will take the client's name, service and preferred time. Scheduled reminders and auto-replies are coming too. Today you can route your number to your own AI or SIP agent.",
    ctaTitle: "Keep every chair booked",
    faq: [
      { q: "Can it book directly into my salon software?", a: "Integrations are coming soon." },
      { q: "Can I send automatic reminders?", a: "Scheduled messages are coming soon. Manual texts work today." },
      { q: "Can stylists use their own phones?", a: "Anyone signed in to the salon's account rings. Separate staff seats are coming soon." },
      { q: "How much does texting cost?", a: "$0.015 per text in the US and Canada." },
    ],
    related: ["/answering-service/chiropractic", "/solutions/small-business", "/product/messaging/two-way-sms"],
  },
  /* cleaning */
  {
    slug: "cleaning",
    title: "Answering Service for Cleaning Businesses | DIGIRINGO",
    description:
      "House cleaners and janitorial companies catch quote and rebooking calls while on jobs. Ring your devices, forward to a cell, voicemail and a callback list.",
    eyebrow: "Answering service for cleaning businesses",
    h1: "Quote the move-out clean while you're finishing another one",
    sub: "Cleaning work keeps your hands busy and your phone in a bag. DIGIRINGO rings your Android phone and laptop together, forwards to a team lead's cell, and keeps every missed call ready for a callback so move-out and recurring-clean requests don't drift to a competitor.",
    bullets: [
      "Business number separate from your personal cell",
      "Forward to a team lead on the next job",
      "Text clients arrival times and entry details",
    ],
    defTitle: "Why cleaning businesses miss calls",
    def: [
      "Most cleaning companies are small crews moving from house to house. The owner is often cleaning too. Calls come in from new clients wanting quotes, regulars rescheduling and property managers needing a turnover clean.",
      "Recurring clients are the core of the business, and the first call is where you win them. Getting that call answered or returned quickly is worth more than most ads.",
    ],
    scenariosTitle: "Cleaning calls worth catching",
    scenarios: [
      { title: "Move-out clean this weekend", body: "A tenant needs it before inspection. Urgent and often booked same day.", icon: "home" },
      { title: "Vacation rental turnover", body: "A host needs a reliable cleaner between guests. Recurring work.", icon: "repeat" },
      { title: "Office contract inquiry", body: "A commercial client asking for a walkthrough.", icon: "building" },
      { title: "Access details", body: "Text the client to confirm the lockbox code before you arrive.", icon: "lock" },
    ],
    stepsTitle: "How to set up coverage for your crew",
    steps: [
      { title: "Get a local number", body: "Use it on your website, flyers and booking forms.", icon: "hash" },
      { title: "Forward to a team lead", body: "Whoever isn't mid-job catches the call.", icon: "phone-forwarded" },
      { title: "Text from the business number", body: "Register for 10DLC so confirmations get delivered.", icon: "message" },
    ],
    tableRows: [["Can quote based on square footage", "You can", "Takes a message"]],
    soonTitle: "Coming: auto-replies and AI quotes",
    soonBody: "Missed-call text-back and our AI receptionist are in development, so callers can get a reply and leave their details even when nobody's free. Today, you can route the number to your own AI or SIP agent.",
    ctaTitle: "Win the recurring client on the first call",
    faq: [
      { q: "Can clients text me photos of the space?", a: "MMS is coming soon." },
      { q: "Can I set up recurring reminders?", a: "Scheduled messages are coming soon." },
      { q: "Can my team leads answer on their phones?", a: "Set one as your forwarding phone, or have them sign in to the account. Team seats are coming soon." },
      { q: "Is there a contract?", a: "No. Prepaid wallet, pay as you go." },
    ],
    related: ["/solutions/home-services", "/answering-service/property-management", "/answering-service/landscaping"],
  },
];

export const PAGES: PageDoc[] = [...SOLUTIONS, ANSWERING_HUB, ...INDUSTRIES.map(industryPage)];
