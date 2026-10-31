import type { PageDoc, LinkRef } from "../types";

/*
 * Product pages, part A: Calling, Messaging, Call forwarding, Call routing and
 * Call management (hubs + sub-pages). Anything not live today carries
 * status "soon" (or "beta") so the renderer badges it honestly.
 */

const PRODUCT: LinkRef = { label: "Product", href: "/product" };
const crumbs = (...extra: LinkRef[]): LinkRef[] => [PRODUCT, ...extra];

const CALLING: LinkRef = { label: "Calling", href: "/product/calling" };
const MESSAGING: LinkRef = { label: "Messaging", href: "/product/messaging" };
const FORWARDING: LinkRef = { label: "Call forwarding", href: "/product/call-forwarding" };
const ROUTING: LinkRef = { label: "Call routing", href: "/product/call-routing" };
const MANAGEMENT: LinkRef = { label: "Call management", href: "/product/call-management" };

const PRICING: LinkRef = { label: "See pricing", href: "/pricing" };
const GET_NUMBER: LinkRef = { label: "Get your number", href: "/app" };

export const PAGES: PageDoc[] = [
  /* ───────────────────────────── CALLING ───────────────────────────── */
  {
    path: "/product/calling",
    title: "Business Calling in Your Browser | DIGIRINGO",
    description:
      "Make and take business calls from your browser or Android phone with DIGIRINGO. Pick your caller ID, ring every device at once, and pay $0.015/min in the US.",
    crumbs: crumbs(CALLING),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Calling",
        h1: "Business calls from the devices you already own",
        sub: "DIGIRINGO puts a real business phone line in your browser and on your Android phone. No desk phone, no hardware, no contract.",
        bullets: [
          "Call from the web app or the Android app",
          "Choose which of your numbers shows as caller ID",
          "US & Canada calls at $0.015 per minute",
        ],
        shot: "dialer",
        primary: GET_NUMBER,
        secondary: PRICING,
      },
      {
        type: "definition",
        title: "What is business calling in DIGIRINGO?",
        paragraphs: [
          "It is a phone line that lives on the internet instead of a copper wire. You get a business number, sign in at digiringo.com/app or in the Android app, and you can place and answer calls right away. Calls travel over a carrier-grade voice network, so the person you call sees a normal phone number and hears a normal call.",
          "Because the line isn't tied to one handset, the same number follows you from your laptop at the office to your phone in the truck. Your personal number stays private, and your customers always reach the business.",
        ],
        shot: "calls",
        tone: "tint",
      },
      {
        type: "cards",
        eyebrow: "Everything in Calling",
        title: "Calling features, one page each",
        intro: "Some of these work today. The ones marked coming soon are on our roadmap and are not available yet.",
        cols: 3,
        items: [
          { title: "Call from your browser", body: "Place and answer calls in Chrome, Edge, Firefox or Safari. Nothing to install.", icon: "laptop", href: "/product/calling/call-from-browser", status: "live" },
          { title: "Click to call", body: "Turn phone numbers on your site into tap-to-dial links, and dial from the web app in one click.", icon: "phone-outgoing", href: "/product/calling/click-to-call", status: "live" },
          { title: "VoIP caller ID", body: "Pick which of your numbers the other person sees before every call.", icon: "hash", href: "/product/calling/voip-caller-id", status: "live" },
          { title: "Call notes", body: "Jot down what was said, attached to the call itself.", icon: "file", href: "/product/calling/call-notes", status: "soon" },
          { title: "Shared calling", body: "Several teammates working the same business line.", icon: "users", href: "/product/calling/shared-calling", status: "soon" },
          { title: "Three-way calling", body: "Bring a third person into a live call.", icon: "phone-call", href: "/product/calling/three-way-calling", status: "soon" },
        ],
      },
      {
        type: "flex",
        title: "What a call looks like in DIGIRINGO",
        rows: [
          {
            title: "Dial out with the number you choose",
            body: "Open the dialer, pick the business number you want to call from, and dial. If you own a local number and a toll-free number, you can switch between them per call.",
            shot: "dialer",
          },
          {
            title: "Answer anywhere you're signed in",
            body: "Incoming calls ring your browser and your Android phone at the same time. A push notification appears even when the tab is in the background, so you don't need to keep the app in front of you.",
            shot: "calls",
          },
          {
            title: "In-call controls that matter",
            body: "Mute, hold, speaker and a keypad for menus and extensions on the other end. Simple, and they work the same on the web and on Android.",
            shot: "home",
          },
        ],
      },
      {
        type: "steps",
        title: "How to start calling in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Create your account", body: "Sign up at digiringo.com/app. It takes about a minute." },
          { title: "Add funds and pick a number", body: "Top up your wallet with $5 or more, then choose a local or toll-free number. US local numbers are $2.50 per month." },
          { title: "Allow your microphone", body: "Your browser asks once. Say yes, and the dialer is ready." },
          { title: "Make your first call", body: "Dial any number, or install the Android app to take calls on the go." },
        ],
      },
      {
        type: "table",
        title: "What calling costs",
        head: ["Item", "Price"],
        rows: [
          ["US local number", "$2.50 per month"],
          ["Toll-free number", "From $2.50 per month"],
          ["Calls within the US & Canada", "$0.015 per minute"],
          ["International calls", "Varies by country (see the rate list)"],
          ["Per-user or seat fees", "None"],
          ["Contract", "None. Prepaid wallet, pay as you go."],
        ],
        note: "International rates for 220+ countries are on the rates page and in the app.",
      },
      {
        type: "cta",
        title: "Get a business line running in a few minutes.",
        body: "Prepaid, no contract, and you can stop any time.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Do I need a desk phone or special hardware?", a: "No. A computer with a browser, or an Android phone, is enough. A headset makes calls clearer but isn't required." },
          { q: "Is there an iPhone app?", a: "Not yet. iPhone users can open the web app in Safari and make calls from there." },
          { q: "Can I call internationally?", a: "Yes, to 220+ countries. Each country has its own per-minute rate, which you can check on the rates page before you dial." },
          { q: "What happens if I miss a call?", a: "If nobody answers in the app within about 30 seconds, the call can forward to your cellphone. If that isn't answered either, the caller can leave a voicemail." },
          { q: "Can my whole team share one number?", a: "Shared calling and team seats are coming soon. Today each account manages its own numbers." },
        ],
      },
    ],
    related: ["/product/messaging", "/product/call-forwarding", "/product/call-routing", "/product/voicemail"],
  },

  {
    path: "/product/calling/call-from-browser",
    title: "Make Calls From Your Browser | DIGIRINGO",
    description:
      "Call any phone from Chrome, Edge, Firefox or Safari with your DIGIRINGO business number. No downloads or hardware. US & Canada calls cost $0.015 per minute.",
    crumbs: crumbs(CALLING, { label: "Call from browser", href: "/product/calling/call-from-browser" }),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Calling",
        h1: "Your business phone, in a browser tab",
        sub: "Open digiringo.com/app on any computer, sign in, and you can call landlines and cellphones with your business number. Nothing to install.",
        bullets: [
          "Works in current Chrome, Edge, Firefox and Safari",
          "Calls show your business number, not your personal one",
          "Incoming calls ring the tab and your Android phone together",
        ],
        shot: "dialer",
        primary: GET_NUMBER,
        secondary: PRICING,
      },
      {
        type: "definition",
        title: "What does calling from a browser mean?",
        paragraphs: [
          "Modern browsers can send and receive live audio on their own, using a standard called WebRTC. DIGIRINGO uses it to connect your microphone and speakers to the regular phone network. To the person you call, it's an ordinary phone call from your business number.",
          "That means a shared office PC, a borrowed laptop or a hotel business center can all become your work phone for the day. Sign out when you're done and nothing is left behind.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Why teams like calling from the browser",
        cols: 3,
        items: [
          { title: "No install, no IT ticket", body: "If the computer has a modern browser and a microphone, it's ready.", icon: "zap" },
          { title: "Keep your cell number private", body: "Customers see the business line. Your personal number never leaves your pocket.", icon: "lock" },
          { title: "Type while you talk", body: "Look up an order or a calendar in the next tab without juggling a handset.", icon: "laptop" },
          { title: "Catch calls in the background", body: "A push notification pops up for incoming calls even when the DIGIRINGO tab isn't in view.", icon: "bell" },
        ],
      },
      {
        type: "steps",
        title: "How to call from your browser in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Sign in at digiringo.com/app", body: "Use your email or your Google account." },
          { title: "Allow the microphone", body: "The browser asks once per site. Choose Allow so the other side can hear you." },
          { title: "Pick your caller ID", body: "If you have more than one number, choose which one to call from." },
          { title: "Dial and talk", body: "Type the number or paste it in, then press call. Use mute, hold and the keypad as needed." },
        ],
      },
      {
        type: "longform",
        title: "Tips for clear browser calls",
        items: [
          { title: "Use a headset if you can", body: "Laptop speakers and microphones sit close together and can cause echo. Any wired or Bluetooth headset helps a lot." },
          { title: "Prefer a steady connection", body: "Voice needs very little bandwidth, but it does need consistency. A wired connection or a strong Wi-Fi signal beats a crowded café network." },
          { title: "Keep the browser up to date", body: "Browser updates often include audio fixes. If a call sounds off, updating is a good first step." },
          { title: "Allow notifications", body: "Say yes to notifications so incoming calls reach you when you're working in another tab." },
        ],
      },
      {
        type: "table",
        title: "Browser calling vs a desk phone",
        head: ["", "DIGIRINGO in a browser", "Traditional desk phone"],
        rows: [
          ["Hardware to buy", "None", "A handset per person"],
          ["Works from home or on the road", "yes", "no"],
          ["Same number on your Android phone", "yes", "no"],
          ["Setup time", "Minutes", "Often days, with an installer"],
          ["Contract", "None", "Often 1-3 years"],
        ],
      },
      {
        type: "cta",
        title: "Make your first browser call today.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Which browsers are supported?", a: "Current versions of Chrome, Edge, Firefox and Safari. If you hit an issue, try Chrome first and make sure the browser is updated." },
          { q: "Do I have to keep the tab open to receive calls?", a: "You need to be signed in, but the tab doesn't have to be in front. Background push notifications let you know a call is coming in." },
          { q: "Does it work on a Chromebook?", a: "Yes. Chromebooks run Chrome, so the web app works the same way." },
          { q: "How much data does a call use?", a: "Voice calls use very little data, roughly in the range of a few hundred kilobytes per minute depending on conditions." },
          { q: "Can I use it on an iPhone?", a: "There's no iOS app yet, but you can open the web app in Safari on your iPhone." },
        ],
      },
    ],
    related: ["/product/calling/click-to-call", "/product/calling/voip-caller-id", "/product/call-routing/simultaneous-ring"],
  },

  {
    path: "/product/calling/click-to-call",
    title: "Click to Call for Your Business | DIGIRINGO",
    description:
      "Add tap-to-call links to your website so visitors reach your DIGIRINGO number in one tap, and dial customers from the web app in one click. No plugins needed.",
    crumbs: crumbs(CALLING, { label: "Click to call", href: "/product/calling/click-to-call" }),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Calling",
        h1: "One tap from your website to your phone line",
        sub: "Put your DIGIRINGO number on your site as a call link. Visitors on a phone tap it and their dialer opens. You answer in the browser or the Android app.",
        bullets: [
          "Standard tel: links that work on every phone",
          "Free click-to-call button maker in our tools",
          "Dial customers from the web app in one click",
        ],
        shot: "calls",
        primary: GET_NUMBER,
        secondary: { label: "Make a call button", href: "/tools/click-to-call" },
      },
      {
        type: "definition",
        title: "What is click to call?",
        paragraphs: [
          "Click to call means a phone number that acts like a button. On a website it's a tel: link. When a mobile visitor taps it, their phone offers to dial the number straight away, so nobody has to copy digits by hand.",
          "Inside DIGIRINGO, the same idea runs the other way. You can call a contact back from your call history or paste a number into the dialer and place the call with one click, using whichever business number you choose.",
        ],
        tone: "tint",
      },
      {
        type: "flex",
        title: "Two halves of click to call",
        rows: [
          {
            title: "On your website",
            body: "Use a link like <a href=\"tel:+15551234567\"> around your business number. Our free click-to-call tool writes the code for you, with a styled button you can paste into most site builders.",
            icon: "globe",
            shot: "home",
          },
          {
            title: "In the DIGIRINGO app",
            body: "Your call history lists every inbound and outbound call. Tap a missed call to ring them back from the same number they dialed. The dialer also accepts pasted numbers in most common formats.",
            icon: "phone-outgoing",
            shot: "activity",
          },
        ],
      },
      {
        type: "cards",
        title: "Why it's worth adding",
        cols: 3,
        items: [
          { title: "Fewer lost leads", body: "Every extra step between interest and a call is a chance for someone to give up.", icon: "phone-incoming" },
          { title: "Your business number, every time", body: "The link points to your DIGIRINGO line, so the call reaches every device you're signed in on.", icon: "hash" },
          { title: "No plugin to maintain", body: "A tel: link is plain HTML. It won't break when your site theme updates.", icon: "code" },
        ],
      },
      {
        type: "steps",
        title: "How to set up click to call with DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Get a number", body: "Pick a local or toll-free number in the web app." },
          { title: "Build your link", body: "Open the click-to-call tool, enter your number, and copy the button code." },
          { title: "Paste it on your site", body: "Add it to your header, contact page or footer. Most builders have an HTML or embed block." },
          { title: "Answer wherever you are", body: "Calls ring your browser and Android app together, and can forward to your cellphone if nobody picks up." },
        ],
      },
      {
        type: "cta",
        title: "Prefer texting? There's a matching click-to-text tool.",
        button: { label: "Make a text button", href: "/tools/click-to-text" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Does click to call cost extra?", a: "No. A tel: link is free. You only pay normal call rates when someone calls you or you call out, such as $0.015 per minute within the US and Canada for outbound calls." },
          { q: "What happens on a desktop computer?", a: "Desktop browsers usually offer to open a calling app, like a softphone or a linked phone. Many visitors will simply read the number, so show it as text inside the link." },
          { q: "Should I format the number a certain way?", a: "Use the full international format in the link, such as tel:+15551234567. You can display it however you like on the page." },
          { q: "Can I track which page a call came from?", a: "Not yet. Call analytics are on our roadmap. A common workaround today is to use a separate DIGIRINGO number for a specific page or campaign." },
        ],
      },
    ],
    related: ["/product/calling/call-from-browser", "/product/calling/voip-caller-id", "/product/messaging/two-way-sms"],
  },

  {
    path: "/product/calling/voip-caller-id",
    title: "VoIP Caller ID: Choose Your Number | DIGIRINGO",
    description:
      "Choose which DIGIRINGO number appears when you call: local, toll-free or international. Keep your personal cell private and match the line to the customer.",
    crumbs: crumbs(CALLING, { label: "VoIP caller ID", href: "/product/calling/voip-caller-id" }),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Calling",
        h1: "Decide which number they see when you call",
        sub: "If you own more than one DIGIRINGO number, you pick the outgoing caller ID before each call. Local for neighbors, toll-free for nationwide customers.",
        bullets: [
          "Switch caller ID per call in the dialer",
          "Callbacks return to the number they saw",
          "Your personal cell number stays hidden",
        ],
        shot: "dialer",
        primary: GET_NUMBER,
        secondary: { label: "Browse local numbers", href: "/local-numbers" },
      },
      {
        type: "definition",
        title: "What is VoIP caller ID?",
        paragraphs: [
          "Caller ID is the number that shows up on the other person's screen when you ring them. With an internet phone service like DIGIRINGO, that number comes from your account rather than from a SIM card, so you can choose among the numbers you own.",
          "DIGIRINGO only lets you present numbers that are actually in your account. That keeps calls honest and helps them reach people instead of being flagged.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Ways people use caller ID choice",
        cols: 4,
        items: [
          { title: "Local presence", body: "Call Denver customers from a 720 number and Austin customers from a 512.", icon: "map-pin" },
          { title: "Separate brands", body: "Run two businesses from one login, each with its own number.", icon: "briefcase" },
          { title: "Toll-free for support", body: "Use your toll-free line when following up on support requests.", icon: "phone" },
          { title: "Country numbers", body: "Call UK clients from a UK number where one is available.", icon: "globe" },
        ],
      },
      {
        type: "steps",
        title: "How to change your caller ID in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Add a second number", body: "Buy another local, toll-free or international number in the app." },
          { title: "Open the dialer", body: "The current caller ID is shown above the keypad." },
          { title: "Tap to switch", body: "Pick the number you want for this call." },
          { title: "Call as usual", body: "When they call back, the call comes in on that same number." },
        ],
      },
      {
        type: "longform",
        title: "Good caller ID habits",
        items: [
          { title: "Be consistent with each customer", body: "If you first called someone from your local line, keep using it. People save numbers and answer the ones they recognize." },
          { title: "Answer on the number you call from", body: "Every number in your account can ring your devices, so a callback never lands in a dead end." },
          { title: "Mind carrier spam labels", body: "Making very high volumes of short calls from one number can attract spam labels. Our blog has a guide on what to do if your number shows as Spam Likely." },
          { title: "Register for texting separately", body: "Caller ID covers calls. Sending business texts from US numbers also needs 10DLC registration, which you can do in the Trust Center." },
        ],
      },
      {
        type: "chips",
        title: "Related guides",
        links: [
          { label: "Fix a Spam Likely label", href: "/blog/business-number-spam-likely-fix" },
          { label: "Local vs toll-free numbers", href: "/blog/local-vs-toll-free-number" },
          { label: "Choosing an area code", href: "/blog/choose-area-code-vanity-number" },
        ],
      },
      {
        type: "cta",
        title: "Add a second number for $2.50 a month.",
        button: PRICING,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I show a number I don't own in DIGIRINGO?", a: "No. You can only present numbers that are in your account. This protects you and the people you call." },
          { q: "Can I use my existing cell number as caller ID?", a: "Not today. Bringing an existing number over (porting) is coming soon. For now, caller ID choices are the numbers you buy in DIGIRINGO." },
          { q: "Does caller ID name (CNAM) show too?", a: "Whether a name appears depends on the receiving carrier and phone. Many mobile phones show only the number." },
          { q: "Does switching caller ID cost anything?", a: "No. You pay the normal rate for the call, such as $0.015 per minute within the US and Canada." },
        ],
      },
    ],
    related: ["/product/calling/call-from-browser", "/product/messaging/virtual-sms-number", "/product/call-routing"],
  },

  {
    path: "/product/calling/call-notes",
    title: "Call Notes (Coming Soon) | DIGIRINGO",
    description:
      "Call notes in DIGIRINGO will let you write down what was said and keep it attached to the call. Here's what's planned, and how teams keep track of calls today.",
    crumbs: crumbs(CALLING, { label: "Call notes", href: "/product/calling/call-notes" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Calling",
        h1: "Notes that stay with the call",
        sub: "We're building call notes so the details of a conversation live right next to the call record, not on a sticky note that disappears.",
        bullets: [
          "Write notes during or after a call",
          "Find them later in call history",
          "Planned, not available yet",
        ],
        shot: "activity",
      },
      {
        type: "definition",
        title: "What are call notes?",
        paragraphs: [
          "Call notes are short written records tied to a specific call: what the customer asked for, the price you quoted, the date you promised to follow up. They turn a phone call into something you can look back on.",
          "In DIGIRINGO, notes will sit inside the call history entry, so when the same person rings again you can see what happened last time before you answer.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What we're planning",
        intro: "These are design goals for the feature. Details may change before launch.",
        cols: 3,
        items: [
          { title: "Notes on any call", body: "Add a note while you talk or right after you hang up.", icon: "file", status: "soon" },
          { title: "Visible on callback", body: "See your last note when that number calls again.", icon: "phone-incoming", status: "soon" },
          { title: "Search", body: "Look up a note by a word you remember.", icon: "search", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        intro: "Until notes ship, these live features help you keep track of calls.",
        tone: "tint",
        items: [
          { title: "Check your call history", body: "Every call is logged with the number, direction, time and duration." },
          { title: "Use one number per purpose", body: "A separate line for a campaign or a brand makes it obvious what a call was about." },
          { title: "Follow up by text", body: "Send a quick SMS recap after the call. It stays in the conversation thread for that number." },
        ],
      },
      {
        type: "callout",
        title: "No surprises",
        body: "Call notes are not part of DIGIRINGO yet. We'll mark this page live when they are. Ask to be notified and we'll email you once.",
      },
      {
        type: "cta",
        title: "Get started with calling and call history today.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "When will call notes be available?", a: "We don't have a public date yet. Use the Get notified button and we'll let you know when it ships." },
          { q: "Will call notes be shared with teammates?", a: "Team accounts and shared numbers are also on the roadmap. Sharing notes depends on that work, so it may come in a later step." },
          { q: "Will DIGIRINGO write notes for me automatically?", a: "Not at first. Call recording, transcription and AI summaries are separate features that are also coming soon." },
          { q: "Is call history available now?", a: "Yes. Every user has a call log showing inbound, outbound and missed calls." },
        ],
      },
    ],
    related: ["/product/calling", "/product/call-analytics/call-logs", "/product/calling/shared-calling"],
  },

  {
    path: "/product/calling/shared-calling",
    title: "Shared Calling for Teams (Coming Soon) | DIGIRINGO",
    description:
      "Shared calling will let several teammates make and answer calls on one DIGIRINGO business number. See what's planned and how to cover a line together today.",
    crumbs: crumbs(CALLING, { label: "Shared calling", href: "/product/calling/shared-calling" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Calling",
        h1: "One business line, a whole team behind it",
        sub: "Shared calling is on our roadmap: multiple people answering and calling out from the same DIGIRINGO number, each with their own login.",
        bullets: [
          "Several teammates on one number",
          "Everyone sees who handled which call",
          "Planned with team seats, not available yet",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is shared calling?",
        paragraphs: [
          "Shared calling means a single phone number that several people can use. A customer dials your main line, and whoever is free picks up. When someone calls out, the customer sees the same main number no matter who is on the other end.",
          "It needs team seats and roles behind it so each person signs in separately. Those pieces are being built together, so shared calling will arrive alongside multi-user accounts.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned pieces",
        cols: 3,
        items: [
          { title: "Team seats", body: "Invite teammates with their own logins.", icon: "users", status: "soon" },
          { title: "Shared numbers", body: "Give a number to a group instead of one person.", icon: "hash", status: "soon" },
          { title: "Shared call history", body: "See every call on the line, and who took it.", icon: "list", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Sign in on several devices", body: "One DIGIRINGO account can be signed in on multiple browsers and Android phones. Incoming calls ring all of them at once." },
          { title: "Forward to a cellphone", body: "If nobody answers in the app, the call can forward to a cellphone you choose, such as the person on call." },
          { title: "Route to a SIP agent or webhook", body: "Technical teams can send a number's calls to their own SIP system or webhook and handle distribution there." },
        ],
      },
      {
        type: "callout",
        title: "A note on sharing logins",
        body: "Signing several people into one account works for small teams, but everyone sees everything and acts as the same user. Proper team seats will fix that when they ship.",
      },
      {
        type: "cta",
        title: "Start with simultaneous ring today, add teammates when seats launch.",
        button: { label: "How simultaneous ring works", href: "/product/call-routing/simultaneous-ring" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is shared calling available now?", a: "No. It's coming soon together with team seats and shared numbers." },
          { q: "Will there be per-user fees?", a: "DIGIRINGO has no per-user fees today. We'll publish any team pricing clearly before the feature launches." },
          { q: "Can two people take calls on one number right now?", a: "If both are signed in to the same account, both devices ring and either can answer. It isn't a true team setup, but it covers the basics." },
          { q: "Will ring groups be part of this?", a: "Ring groups across team members are also planned. They depend on the same team-seat work." },
        ],
      },
    ],
    related: ["/product/shared-numbers", "/product/calling/three-way-calling", "/product/call-routing/simultaneous-ring"],
  },

  {
    path: "/product/calling/three-way-calling",
    title: "Three-Way Calling (Coming Soon) | DIGIRINGO",
    description:
      "Three-way calling will let you add a third person to a live DIGIRINGO call. It's not available yet. See what's planned and how to loop people in for now.",
    crumbs: crumbs(CALLING, { label: "Three-way calling", href: "/product/calling/three-way-calling" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Calling",
        h1: "Bring a third person into the conversation",
        sub: "We're working on three-way calling so you can add a colleague, a contractor or an interpreter to a call that's already happening.",
        bullets: [
          "Add a third caller without hanging up",
          "Works from the browser and Android",
          "Coming soon, not available yet",
        ],
        shot: "dialer",
      },
      {
        type: "definition",
        title: "What is three-way calling?",
        paragraphs: [
          "Three-way calling joins three people on one call. You're talking with a customer, you dial someone else, and then merge the two so everyone hears everyone.",
          "It's useful when a question needs an expert, when a landlord, tenant and repair crew need to agree on a time, or when a client wants their partner on the line too.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Common situations it will help with",
        cols: 3,
        items: [
          { title: "Ask an expert", body: "Pull in the person who actually knows the answer.", icon: "user" },
          { title: "Schedule with everyone", body: "Settle a time with two parties at once instead of relaying messages.", icon: "calendar" },
          { title: "Language help", body: "Bring an interpreter onto the call.", icon: "globe" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Use hold", body: "Put the first caller on hold while you check something, then resume." },
          { title: "Call back with an answer", body: "Your call history makes it quick to ring the customer back from the same number." },
          { title: "Text a recap", body: "Send both parties a short SMS with what was agreed." },
        ],
      },
      {
        type: "callout",
        title: "Related work",
        body: "Call transfer, which hands a call to someone else, is also coming soon. Both features share the same plumbing, so they are being built together.",
      },
      {
        type: "cta",
        title: "Calling, hold and mute work today.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I merge calls in DIGIRINGO today?", a: "No. Three-way calling isn't available yet. We'll update this page when it is." },
          { q: "Will each leg be billed?", a: "Most likely each outbound leg will be billed at the normal per-minute rate. We'll confirm pricing before launch." },
          { q: "Will it support more than three people?", a: "Our first goal is three. Larger conference calls may come later." },
          { q: "Can I use another conferencing tool alongside DIGIRINGO?", a: "Yes. You can dial into a conference bridge number from DIGIRINGO like any other call." },
        ],
      },
    ],
    related: ["/product/call-forwarding/call-transfer", "/product/calling/shared-calling", "/product/calling"],
  },

  /* ──────────────────────────── MESSAGING ──────────────────────────── */
  {
    path: "/product/messaging",
    title: "Business Text Messaging | DIGIRINGO",
    description:
      "Send and receive business texts from your DIGIRINGO number on the web or Android. Threaded chats, delivery receipts and guided 10DLC setup. $0.015 per SMS.",
    crumbs: crumbs(MESSAGING),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Messaging",
        h1: "Text customers from your business number",
        sub: "Two-way SMS on the same number people already call. Reply from your laptop or your Android phone, and keep every conversation in one thread.",
        bullets: [
          "Threaded conversations for each of your numbers",
          "Delivery receipts so you know a text arrived",
          "US & Canada SMS at $0.015 per message",
        ],
        shot: "inbox",
        primary: GET_NUMBER,
        secondary: PRICING,
      },
      {
        type: "definition",
        title: "What is business messaging in DIGIRINGO?",
        paragraphs: [
          "It's SMS from a business phone number instead of your personal cell. Customers text your DIGIRINGO number, the message appears in your inbox, and you reply from whichever device is handy.",
          "In the US, carriers require businesses to register before texting at scale. This is called A2P 10DLC. DIGIRINGO has a built-in Trust Center that walks you through it, so your messages are accepted by the networks.",
        ],
        shot: "chat",
        tone: "tint",
      },
      {
        type: "cards",
        eyebrow: "Everything in Messaging",
        title: "Messaging features, one page each",
        intro: "Live features are ready to use. Coming-soon items are planned and not available yet.",
        cols: 3,
        items: [
          { title: "Two-way SMS", body: "Real conversations with customers, sent and received from your business number.", icon: "messages", href: "/product/messaging/two-way-sms", status: "live" },
          { title: "Virtual SMS number", body: "A text-capable number that isn't tied to a SIM card.", icon: "hash", href: "/product/messaging/virtual-sms-number", status: "live" },
          { title: "Group texting", body: "One thread with several people at once.", icon: "users", href: "/product/messaging/group-texting", status: "soon" },
          { title: "Automated text messages", body: "Texts that go out on their own, triggered by events or a schedule.", icon: "zap", href: "/product/messaging/automated-text-messages", status: "soon" },
          { title: "Instant response", body: "An immediate text back when you can't take a call.", icon: "send", href: "/product/messaging/instant-response", status: "soon" },
          { title: "SMS autoresponder", body: "Automatic replies to incoming texts, such as after hours.", icon: "repeat", href: "/product/messaging/sms-autoresponder", status: "soon" },
        ],
      },
      {
        type: "flex",
        title: "How texting works day to day",
        rows: [
          {
            title: "One inbox for every number",
            body: "Conversations are grouped by number, so texts to your local line and your second brand line never get mixed up.",
            shot: "inbox",
          },
          {
            title: "A chat view that feels familiar",
            body: "Each conversation reads top to bottom like the messaging app on your phone, with a status under each sent message.",
            shot: "chat",
          },
          {
            title: "Registration built in",
            body: "The Trust Center collects your business details, submits your brand and campaign to the carriers, and shows the approval status. Carrier fees are passed through at cost.",
            shot: "settings",
          },
        ],
      },
      {
        type: "steps",
        title: "How to start texting in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Get a number", body: "Pick a US or Canada local number, or an international number that supports SMS." },
          { title: "Register for 10DLC", body: "For US texting, complete the Trust Center steps. Carrier approval usually takes 1-7 days." },
          { title: "Send your first text", body: "Start a new conversation, type a number and your message, and send." },
        ],
      },
      {
        type: "table",
        title: "What works today and what's coming",
        head: ["Feature", "Status"],
        rows: [
          ["Two-way SMS", "yes"],
          ["Delivery receipts", "yes"],
          ["Threaded conversations per number", "yes"],
          ["Guided 10DLC registration", "yes"],
          ["MMS / picture messages", "soon"],
          ["Group texting", "soon"],
          ["Auto-replies and scheduled messages", "soon"],
          ["Saved snippets / templates", "soon"],
          ["Toll-free texting verification", "soon"],
        ],
      },
      {
        type: "cta",
        title: "Texting costs $0.015 per message in the US and Canada.",
        body: "No monthly messaging plan. Pay from your prepaid wallet.",
        button: PRICING,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Do I have to register before texting?", a: "For US numbers, yes. Carriers require A2P 10DLC registration for business texting. DIGIRINGO's Trust Center guides you through it, and carrier approval usually takes 1-7 days." },
          { q: "Can I send photos?", a: "Not yet. MMS picture messages are coming soon. Today DIGIRINGO sends and receives text-only SMS." },
          { q: "Can I text from a toll-free number?", a: "Toll-free texting needs a separate carrier verification, which we don't support yet. Use a local number for texting for now." },
          { q: "Can I text international numbers?", a: "Yes, where the number and destination support SMS. Rates vary by country and are listed on the rates page." },
          { q: "Can I read texts on my computer?", a: "Yes. The web app shows the same conversations as the Android app." },
        ],
      },
    ],
    related: ["/product/calling", "/product/messaging/two-way-sms", "/features/business-sms-mms", "/blog/what-is-a2p-10dlc"],
  },

  {
    path: "/product/messaging/two-way-sms",
    title: "Two-Way SMS for Business | DIGIRINGO",
    description:
      "Have real text conversations with customers from your DIGIRINGO number. Replies land in threaded chats on web and Android, with delivery receipts on each text.",
    crumbs: crumbs(MESSAGING, { label: "Two-way SMS", href: "/product/messaging/two-way-sms" }),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Messaging",
        h1: "Texts that go both ways",
        sub: "Customers can reply to your business texts, and you can answer from the web app or Android. It's a conversation, not a one-way blast.",
        bullets: [
          "Replies arrive in the same thread",
          "A delivery status on every message you send",
          "Works on US, Canada and many international numbers",
        ],
        shot: "chat",
        primary: GET_NUMBER,
        secondary: PRICING,
      },
      {
        type: "definition",
        title: "What is two-way SMS?",
        paragraphs: [
          "Two-way SMS means your number can both send and receive text messages. Plenty of business texting tools only send, with replies going nowhere or to a 'do not reply' line. DIGIRINGO numbers receive replies just like a personal phone does.",
          "That makes texting useful for the small back-and-forth of running a business: confirming an appointment, sending an address, answering 'are you open today?'.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Good uses for two-way texting",
        cols: 4,
        items: [
          { title: "Appointment confirmations", body: "Ask them to reply YES, and see the answer in the thread.", icon: "calendar" },
          { title: "Quick quotes", body: "Send a price, get a go-ahead, keep a written record.", icon: "dollar" },
          { title: "On-the-way updates", body: "Let a customer know you're 15 minutes out.", icon: "truck" },
          { title: "Follow-ups after a call", body: "Recap what was agreed while it's fresh.", icon: "check" },
        ],
      },
      {
        type: "flex",
        rows: [
          {
            title: "Conversations, not message logs",
            body: "Each contact gets one thread per business number. Scroll up to see what you said last week.",
            shot: "chat",
          },
          {
            title: "Know when a text arrived",
            body: "Delivery receipts from the carrier update each message's status, so you can tell 'sent' from 'delivered' from 'failed'.",
            shot: "inbox",
          },
        ],
      },
      {
        type: "steps",
        title: "How to send two-way texts in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Choose a text-capable number", body: "US and Canada local numbers work after 10DLC registration. Many international numbers support SMS too." },
          { title: "Finish 10DLC in the Trust Center", body: "Enter your business details and describe how you'll text. Approval usually takes 1-7 days." },
          { title: "Start a conversation", body: "Open the inbox, start a new message and send it. Replies show up in the same thread." },
        ],
      },
      {
        type: "longform",
        title: "Texting customers the right way",
        items: [
          { title: "Get consent first", body: "Only text people who've given you their number for that purpose. Our SMS opt-in guide covers the basics." },
          { title: "Say who you are", body: "Start the first message with your business name. Unknown numbers are easy to ignore." },
          { title: "Honor STOP", body: "If someone replies STOP, don't message them again. Carriers watch for this." },
          { title: "Keep it short", body: "One standard SMS is 160 characters. Longer texts are split into segments, and each segment is billed." },
        ],
      },
      {
        type: "cta",
        title: "Send your first two-way text this week.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "How much does each text cost?", a: "$0.015 per message within the US and Canada. International SMS rates vary by country. Long messages can count as more than one segment." },
          { q: "Why did my text fail?", a: "Common reasons are an unregistered 10DLC campaign, a landline destination, or carrier filtering. Our blog post on undelivered texts walks through the fixes." },
          { q: "Can I send pictures?", a: "Not yet. MMS is coming soon." },
          { q: "Do texts sync between web and Android?", a: "Yes. Both apps show the same threads." },
          { q: "Can I set an automatic reply?", a: "Auto-replies are coming soon. Today, replies are sent by you." },
        ],
      },
    ],
    related: ["/product/messaging/virtual-sms-number", "/product/messaging/group-texting", "/blog/sms-opt-in-consent-guide", "/blog/business-texts-not-delivered"],
  },

  {
    path: "/product/messaging/virtual-sms-number",
    title: "Virtual SMS Number for Business | DIGIRINGO",
    description:
      "Get a virtual number that sends and receives texts without a SIM card. Use it on the web and Android, keep your cell private, and text from $0.015 per SMS.",
    crumbs: crumbs(MESSAGING, { label: "Virtual SMS number", href: "/product/messaging/virtual-sms-number" }),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Messaging",
        h1: "A texting number that lives in the cloud",
        sub: "A DIGIRINGO number isn't attached to a SIM card or a single phone. Send and receive texts from it on any device you sign in to.",
        bullets: [
          "No SIM, no second phone to carry",
          "Local US & Canada numbers from $2.50 per month",
          "Calls and texts on the same number",
        ],
        shot: "numbers",
        primary: GET_NUMBER,
        secondary: { label: "Browse local numbers", href: "/local-numbers" },
      },
      {
        type: "definition",
        title: "What is a virtual SMS number?",
        paragraphs: [
          "A virtual SMS number is a real phone number hosted by a provider instead of a mobile carrier's SIM. Messages to it are delivered over the internet to an app, so you can read and answer them on a laptop, a tablet or a phone.",
          "With DIGIRINGO the same number also makes and takes calls, so customers only have one number to remember for your business.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Why use a virtual number for texting",
        cols: 3,
        items: [
          { title: "Separate work and personal", body: "Business texts stay out of your family group chats.", icon: "lock" },
          { title: "Text from your computer", body: "Typing on a full keyboard is faster when you're answering lots of messages.", icon: "laptop" },
          { title: "Pick the area code", body: "Choose a local number that matches where your customers are.", icon: "map-pin" },
        ],
      },
      {
        type: "table",
        title: "Which DIGIRINGO numbers can text",
        head: ["Number type", "SMS today", "Notes"],
        rows: [
          ["US local", "yes", "After 10DLC registration in the Trust Center"],
          ["Canada local", "yes", "Uses the same registration flow as US numbers"],
          ["US toll-free", "soon", "Toll-free texting verification is coming soon"],
          ["International", "yes", "Where the number and country support SMS; shown before you buy"],
          ["Picture messages (MMS)", "soon", "Text-only SMS for now"],
        ],
      },
      {
        type: "steps",
        title: "How to get a virtual SMS number",
        tone: "tint",
        items: [
          { title: "Sign up and top up", body: "Create your account and add at least $5 to your wallet." },
          { title: "Search for a number", body: "Filter by country and area code. The app shows whether a number supports SMS." },
          { title: "Register (US numbers)", body: "Complete 10DLC brand and campaign registration so carriers accept your texts." },
          { title: "Start texting", body: "Messages and replies appear in your inbox on web and Android." },
        ],
      },
      {
        type: "chips",
        title: "Related guides",
        links: [
          { label: "What is a virtual phone number?", href: "/blog/what-is-a-virtual-phone-number" },
          { label: "Text customers from a computer", href: "/blog/text-customers-from-computer" },
          { label: "International virtual numbers", href: "/blog/international-virtual-numbers" },
        ],
      },
      {
        type: "cta",
        title: "Pick a number and start texting.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is a virtual SMS number a real phone number?", a: "Yes. It's a standard number that anyone can call or text. The difference is that it's delivered to an app instead of a SIM card." },
          { q: "Can I use it for verification codes?", a: "Some websites block virtual numbers for sign-up codes. DIGIRINGO numbers are meant for conversations with your customers, not for receiving one-time codes." },
          { q: "Can I keep my existing number?", a: "Number porting is coming soon. For now, you choose a new number in the app." },
          { q: "Can I have more than one?", a: "Yes. Each number is billed monthly, and each gets its own set of conversations." },
        ],
      },
    ],
    related: ["/product/messaging/two-way-sms", "/product/calling/voip-caller-id", "/phone-numbers"],
  },

  {
    path: "/product/messaging/group-texting",
    title: "Group Texting (Coming Soon) | DIGIRINGO",
    description:
      "Group texting in DIGIRINGO will put several people in one business text thread. Not available yet. See what's planned and how to text multiple people today.",
    crumbs: crumbs(MESSAGING, { label: "Group texting", href: "/product/messaging/group-texting" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Messaging",
        h1: "One thread, everyone in it",
        sub: "Group texting is on the way: a single conversation between your business number and several people, where everyone sees every reply.",
        bullets: [
          "Coordinate a crew, a client and a supplier together",
          "Replies visible to the whole group",
          "Coming soon, not available yet",
        ],
        shot: "chat",
      },
      {
        type: "definition",
        title: "What is group texting?",
        paragraphs: [
          "A group text is a conversation with three or more participants. When anyone replies, the message goes to the whole group. It's different from a mass text, where each person gets a private copy and replies only to you.",
          "Group threads rely on MMS behind the scenes, which is why this feature will arrive after picture messaging support.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Where group texts help",
        cols: 3,
        items: [
          { title: "Job sites", body: "Keep the homeowner, foreman and electrician on the same page.", icon: "wrench" },
          { title: "Events", body: "Share last-minute changes with a small group of attendees or vendors.", icon: "calendar" },
          { title: "Families and clients", body: "Some decisions involve two people. Text them both at once.", icon: "users" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Text people one by one", body: "Send the same update to each person in their own thread. They reply privately to you." },
          { title: "Call when it's urgent", body: "For quick agreements, a phone call is often faster than a group thread." },
          { title: "Ask to be notified", body: "Use the Get notified button and we'll tell you when group texting is ready." },
        ],
      },
      {
        type: "callout",
        title: "Honest status",
        body: "DIGIRINGO sends one-to-one SMS today. Group texting and MMS are both coming soon and are not part of the product yet.",
      },
      {
        type: "cta",
        title: "Two-way SMS is ready now.",
        button: { label: "See two-way SMS", href: "/product/messaging/two-way-sms" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "When will group texting launch?", a: "There's no public date. It follows MMS support, which is also in progress." },
          { q: "Will group texts cost more?", a: "Group messages are typically billed per recipient. We'll publish exact pricing before launch." },
          { q: "How many people can be in a group?", a: "Carriers put limits on group size. We'll publish DIGIRINGO's exact limit when the feature ships." },
          { q: "Is this the same as bulk texting?", a: "No. Bulk texts are individual copies. Group texting is a shared conversation." },
        ],
      },
    ],
    related: ["/product/messaging/two-way-sms", "/product/messaging/automated-text-messages", "/blog/sms-vs-mms-business"],
  },

  {
    path: "/product/messaging/automated-text-messages",
    title: "Automated Text Messages (Coming Soon) | DIGIRINGO",
    description:
      "Automated texts in DIGIRINGO will send messages for you on a schedule or after an event like a missed call. Coming soon. See what's planned and what works now.",
    crumbs: crumbs(MESSAGING, { label: "Automated text messages", href: "/product/messaging/automated-text-messages" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Messaging",
        h1: "Texts that send themselves",
        sub: "We're building automation for routine messages: reminders, follow-ups and replies that go out without you typing them each time.",
        bullets: [
          "Scheduled messages for a set time",
          "Event-based texts, like after a missed call",
          "Coming soon, not available yet",
        ],
        shot: "inbox",
      },
      {
        type: "definition",
        title: "What are automated text messages?",
        paragraphs: [
          "Automated texts are messages that a system sends based on a rule. The rule might be a time ('send at 9am tomorrow'), an event ('someone called and nobody answered'), or an incoming keyword.",
          "Done well, automation handles the repetitive part of texting while you handle the actual conversations.",
        ],
        tone: "tint",
      },
      {
        type: "tabs",
        title: "Automation we're planning",
        tabs: [
          {
            name: "Scheduled",
            items: [
              { title: "Send later", body: "Write a message now and pick when it goes out.", icon: "clock", status: "soon" },
              { title: "Reminders", body: "Nudge a customer the day before an appointment.", icon: "calendar", status: "soon" },
            ],
          },
          {
            name: "Triggered",
            items: [
              { title: "Missed-call text", body: "A text back when a call goes unanswered.", icon: "phone-missed", status: "soon" },
              { title: "Away replies", body: "An automatic answer to incoming texts outside your hours.", icon: "moon", status: "soon" },
            ],
          },
          {
            name: "Reusable",
            items: [
              { title: "Snippets", body: "Save common replies and insert them in a tap.", icon: "file", status: "soon" },
            ],
          },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Use your own webhook", body: "Developers can route a number's calls to their own webhook today. Message automation through DIGIRINGO itself is coming later." },
          { title: "Keep templates handy", body: "Store your common replies in a notes app and paste them in. Our blog has a collection of business text templates." },
          { title: "Reply quickly by hand", body: "Two-way SMS on web and Android makes manual replies fast." },
        ],
      },
      {
        type: "callout",
        title: "Automation and consent go together",
        body: "Automated texts still need the recipient's permission and a clear way to opt out. We'll build STOP handling into every automation so you stay on the right side of carrier rules.",
      },
      {
        type: "cta",
        title: "Get notified when automation launches.",
        body: "Meanwhile, two-way texting works today.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can DIGIRINGO send scheduled texts now?", a: "No. Scheduled and automated messages are coming soon." },
          { q: "Will automated texts need 10DLC?", a: "Yes. Any business texting from US local numbers needs 10DLC registration, automated or not." },
          { q: "Will there be an extra charge for automation?", a: "Each text will cost the normal SMS rate. We'll announce any feature pricing before launch." },
          { q: "Where can I find text templates?", a: "See our blog post on business text message templates for examples you can adapt." },
        ],
      },
    ],
    related: ["/product/messaging/instant-response", "/product/messaging/sms-autoresponder", "/blog/business-text-message-templates"],
  },

  {
    path: "/product/messaging/instant-response",
    title: "Instant Text Response (Coming Soon) | DIGIRINGO",
    description:
      "Instant response will text callers back right away when you miss their call, so they know you'll be in touch. Coming soon to DIGIRINGO. Here's what works now.",
    crumbs: crumbs(MESSAGING, { label: "Instant response", href: "/product/messaging/instant-response" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Messaging",
        h1: "Missed the call? Answer with a text in seconds",
        sub: "Instant response will send a short, friendly text to anyone whose call you couldn't take, so they don't move on to the next business on the list.",
        bullets: [
          "Automatic text after a missed call",
          "Your own wording, your business number",
          "Coming soon, not available yet",
        ],
        shot: "chat",
      },
      {
        type: "definition",
        title: "What is instant response?",
        paragraphs: [
          "Instant response, often called missed-call text back, is a message that goes out the moment a call goes unanswered. Something like: 'Sorry we missed you. We're on a job and will call back within the hour. Reply here if it's easier to text.'",
          "It gives the caller a way to keep the conversation going in writing, and it tells them a real business is on the other end.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Why it's on our roadmap",
        cols: 3,
        items: [
          { title: "Callers don't wait long", body: "Many people try another business after one unanswered call.", icon: "clock" },
          { title: "Texting is easier for some", body: "A text lets them explain what they need without another call.", icon: "message" },
          { title: "Works while you're busy", body: "You can be under a sink or in a meeting and still respond.", icon: "wrench" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        intro: "DIGIRINGO already helps you catch more calls before they become missed calls.",
        tone: "tint",
        items: [
          { title: "Ring every device", body: "Incoming calls ring your browser and Android phone at the same time." },
          { title: "Forward to your cellphone", body: "If the app isn't answered in about 30 seconds, the call goes to your cell." },
          { title: "Take a voicemail", body: "If nobody answers anywhere, the caller can leave a message." },
          { title: "Text them back yourself", body: "Open the missed call in history and start a text to that number." },
        ],
      },
      {
        type: "chips",
        title: "Read more",
        links: [
          { label: "Missed-call text back explained", href: "/blog/missed-call-text-back" },
          { label: "The cost of missed calls", href: "/blog/cost-of-missed-calls" },
          { label: "Missed-call cost calculator", href: "/tools/missed-call-cost-calculator" },
        ],
      },
      {
        type: "cta",
        title: "Catch more calls today with forwarding and voicemail.",
        button: { label: "Never miss a call", href: "/product/call-management/never-miss-a-call" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO send missed-call texts now?", a: "Not automatically. Instant response is coming soon. You can text a caller back by hand from your call history." },
          { q: "Will it work for toll-free numbers?", a: "It will need a text-capable number. Toll-free texting verification is also on our roadmap." },
          { q: "Can I customize the message?", a: "That's the plan. You'll write your own wording." },
          { q: "Will it text landlines?", a: "Landlines can't receive SMS, so those callers would be skipped." },
        ],
      },
    ],
    related: ["/product/messaging/sms-autoresponder", "/product/call-management/never-miss-a-call", "/features/missed-call-service"],
  },

  {
    path: "/product/messaging/sms-autoresponder",
    title: "SMS Autoresponder (Coming Soon) | DIGIRINGO",
    description:
      "An SMS autoresponder in DIGIRINGO will reply to incoming texts for you, such as after hours or when you're away. Coming soon. See the plan and what works today.",
    crumbs: crumbs(MESSAGING, { label: "SMS autoresponder", href: "/product/messaging/sms-autoresponder" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Messaging",
        h1: "An automatic reply for every text you can't answer yet",
        sub: "The SMS autoresponder will acknowledge incoming texts when you're closed, on holiday or simply busy, so customers know their message landed.",
        bullets: [
          "After-hours and away messages",
          "Sent from your business number",
          "Coming soon, not available yet",
        ],
        shot: "inbox",
      },
      {
        type: "definition",
        title: "What is an SMS autoresponder?",
        paragraphs: [
          "An autoresponder is a rule that answers incoming texts with a pre-written message. The classic example is an after-hours reply: 'Thanks for your message. We're closed until 8am and will reply first thing.'",
          "It doesn't replace a real answer. It sets expectations, so a customer isn't left wondering whether anyone saw their text.",
        ],
        tone: "tint",
      },
      {
        type: "tabs",
        title: "Planned autoresponder options",
        tabs: [
          {
            name: "Away",
            items: [
              { title: "Vacation reply", body: "Turn on a message while you're out, off when you're back.", icon: "moon", status: "soon" },
            ],
          },
          {
            name: "Hours",
            items: [
              { title: "After-hours reply", body: "Only reply outside the hours you set.", icon: "clock", status: "soon" },
            ],
          },
          {
            name: "First contact",
            items: [
              { title: "Welcome text", body: "A greeting for someone texting your number for the first time.", icon: "message", status: "soon" },
            ],
          },
        ],
      },
      {
        type: "longform",
        title: "Writing a good auto-reply",
        intro: "Worth drafting now so you're ready when it launches.",
        items: [
          { title: "Name the business", body: "Start with who they reached. It reassures people they texted the right number." },
          { title: "Give a time", body: "'We'll reply by 9am' is more useful than 'we'll get back to you soon'." },
          { title: "Offer another route for urgent needs", body: "If you have an emergency line, include it." },
          { title: "Keep it under 160 characters", body: "One segment keeps it cheap and easy to read." },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Reply from your phone", body: "The Android app lets you answer texts quickly, even in the evening." },
          { title: "Put your hours on your site", body: "Customers who know your hours expect a reply in the morning." },
          { title: "Draft your message now", body: "Write and save your auto-reply text so it's ready the day the feature launches." },
        ],
      },
      {
        type: "cta",
        title: "See after-hours reply examples on our blog.",
        button: { label: "Read the guide", href: "/blog/after-hours-auto-reply-texts" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I set an auto-reply in DIGIRINGO today?", a: "No. The autoresponder is coming soon. Replies are sent manually for now." },
          { q: "Will auto-replies count as texts I pay for?", a: "Yes. Each auto-reply will be billed at the normal SMS rate, such as $0.015 per message in the US and Canada." },
          { q: "Will it reply to every single message?", a: "We plan to avoid sending the same auto-reply repeatedly to the same person in a short time." },
          { q: "Does it need 10DLC registration?", a: "For US local numbers, yes. All business texting requires it." },
        ],
      },
    ],
    related: ["/product/messaging/instant-response", "/product/messaging/automated-text-messages", "/product/call-routing/business-hours-call-routing"],
  },

  /* ───────────────────────── CALL FORWARDING ───────────────────────── */
  {
    path: "/product/call-forwarding",
    title: "Call Forwarding to Any Phone | DIGIRINGO",
    description:
      "Forward your DIGIRINGO business calls to any cellphone, in the US or abroad. Ring the app first, then your phone, or forward straight away. No contract needed.",
    crumbs: crumbs(FORWARDING),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Call forwarding",
        h1: "Your business calls, wherever you are",
        sub: "Send calls on any DIGIRINGO number to a cellphone. Let the app ring first and forward if nobody picks up, or forward every call directly.",
        bullets: [
          "Forward to any mobile number, US or international",
          "Fallback forwarding after about 30 seconds",
          "Set it per number in the app's settings",
        ],
        shot: "settings",
        primary: GET_NUMBER,
        secondary: PRICING,
      },
      {
        type: "definition",
        title: "What is call forwarding?",
        paragraphs: [
          "Call forwarding sends an incoming call to another phone number. The caller dials your business line and your cellphone rings, without them ever seeing your personal number.",
          "In DIGIRINGO, forwarding is part of each number's routing. You can use it as a backup when the app isn't answered, or as the main destination when you'd rather pick up on your regular phone.",
        ],
        shot: "calls",
        tone: "tint",
      },
      {
        type: "cards",
        eyebrow: "Everything in Call forwarding",
        title: "Forwarding features, one page each",
        cols: 2,
        items: [
          { title: "International call forwarding", body: "Forward a US number to a cellphone in another country.", icon: "globe", href: "/product/call-forwarding/international-call-forwarding", status: "live" },
          { title: "Busy and no-answer forwarding", body: "Calls you don't take in the app go to your cellphone.", icon: "phone-forwarded", href: "/product/call-forwarding/busy-call-forwarding", status: "beta" },
          { title: "Call transfer", body: "Hand a live call to a colleague.", icon: "repeat", href: "/product/call-forwarding/call-transfer", status: "soon" },
          { title: "Do not disturb", body: "Quiet hours for your business line.", icon: "moon", href: "/product/call-forwarding/do-not-disturb", status: "soon" },
        ],
      },
      {
        type: "flex",
        title: "Two ways to forward",
        rows: [
          {
            title: "App first, then your phone",
            body: "The call rings every device where you're signed in to DIGIRINGO. If nobody answers in about 30 seconds, it moves to your cellphone. Good for people who work at a computer most of the day.",
            icon: "laptop",
            shot: "calls",
          },
          {
            title: "Straight to your phone",
            body: "Skip the app and send every call on that number to a cellphone. Handy for a field line or a number you only answer on the go.",
            icon: "smartphone",
            shot: "settings",
          },
        ],
      },
      {
        type: "steps",
        title: "How to set up call forwarding in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Open the number's settings", body: "In the app, choose the number you want to forward." },
          { title: "Choose a routing option", body: "Pick ring in the app with forwarding as a fallback, or forward to a phone." },
          { title: "Enter the destination", body: "Type the cellphone number in full international format." },
          { title: "Test it", body: "Call your business number from another phone and let it ring." },
        ],
      },
      {
        type: "table",
        title: "Forwarding options at a glance",
        head: ["Option", "Status", "What it does"],
        rows: [
          ["Forward to a cellphone", "yes", "Every call on the number rings your phone"],
          ["No-answer fallback", "yes", "Rings the app first, then your phone after about 30 seconds"],
          ["International destinations", "yes", "Forward to mobile numbers abroad at that country's rate"],
          ["Separate busy / no-answer rules", "soon", "One fallback covers all unanswered calls today"],
          ["Business-hours forwarding", "soon", "Different destinations by time of day"],
          ["Transfer a live call", "soon", "Hand an answered call to someone else"],
        ],
      },
      {
        type: "cta",
        title: "Forwarding is included with every number.",
        body: "You pay for the forwarded call minutes, not for the feature.",
        button: PRICING,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Does forwarding cost extra?", a: "There's no fee for the feature. The forwarded leg of the call is billed per minute, at $0.015 per minute to US and Canada phones and at the destination's rate for other countries." },
          { q: "Will the caller know they've been forwarded?", a: "No. They hear ringing as usual. Your cellphone sees the incoming call." },
          { q: "What if I don't answer the forwarded call either?", a: "The caller can leave a voicemail on your DIGIRINGO number." },
          { q: "Can I forward to a landline?", a: "Forwarding is designed for cellphones, but any reachable phone number can be entered as the destination." },
          { q: "Can I forward to more than one phone?", a: "Today each number forwards to one destination. Ring groups across several people are coming soon." },
        ],
      },
    ],
    related: ["/product/call-routing", "/product/call-management/never-miss-a-call", "/product/voicemail", "/blog/how-to-forward-business-calls"],
  },

  {
    path: "/product/call-forwarding/international-call-forwarding",
    title: "International Call Forwarding | DIGIRINGO",
    description:
      "Forward calls from your DIGIRINGO number to a cellphone in another country. Keep a US number while you travel or live abroad. Pay that country's call rate.",
    crumbs: crumbs(FORWARDING, { label: "International", href: "/product/call-forwarding/international-call-forwarding" }),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Call forwarding",
        h1: "Keep your US number, answer it from abroad",
        sub: "Forward calls on your DIGIRINGO number to a mobile phone in another country. Customers dial a local number; you pick up wherever you are.",
        bullets: [
          "Forward to mobiles in 220+ countries",
          "Per-minute rate shown for each country",
          "Or skip forwarding and answer in the app over Wi-Fi",
        ],
        shot: "settings",
        primary: GET_NUMBER,
        secondary: { label: "Check country rates", href: "/rates" },
      },
      {
        type: "definition",
        title: "What is international call forwarding?",
        paragraphs: [
          "International call forwarding takes a call that arrives on a number in one country and sends it on to a phone in another. A client in Chicago calls your 312 number, and your phone in Lisbon rings.",
          "It's popular with founders running a US business from overseas, people on long trips, and companies with a team member based in another country.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Who uses it",
        cols: 3,
        items: [
          { title: "Business owners abroad", body: "Keep a US presence while living in another country.", icon: "globe" },
          { title: "Travelers", body: "Stay reachable on your business line during a long trip.", icon: "map-pin" },
          { title: "Remote team members", body: "Point one number at the person who covers it from overseas.", icon: "user" },
        ],
      },
      {
        type: "callout",
        title: "Often the cheaper option: answer in the app",
        body: "If you have a data connection, you don't need to forward at all. Sign in to the Android app or the web app and calls ring there over the internet, so there is no international forwarding leg to pay for.",
        tone: "tint",
      },
      {
        type: "steps",
        title: "How to forward to another country",
        items: [
          { title: "Look up the rate", body: "Check the destination country on the rates page so you know the per-minute cost." },
          { title: "Open the number's routing", body: "Choose forward to a phone, or app first with phone fallback." },
          { title: "Enter the full number", body: "Include the country code, for example +44 for the UK." },
          { title: "Keep your wallet funded", body: "Forwarded minutes come from your prepaid balance." },
        ],
      },
      {
        type: "widget",
        widget: "country-rates",
      },
      {
        type: "cta",
        title: "Find the rate for the country you're forwarding to.",
        button: { label: "View rates", href: "/rates" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "How much does international forwarding cost?", a: "You pay the outbound per-minute rate for the destination country, the same as if you'd called it. Rates are listed on the rates page." },
          { q: "Can I forward to a landline abroad?", a: "You can enter any reachable number, though mobile rates and landline rates can differ by country." },
          { q: "Is answering in the app cheaper?", a: "Usually, yes. Answering over the internet avoids the international forwarding leg." },
          { q: "Can I get a number in the country I live in too?", a: "Yes, DIGIRINGO offers numbers in many countries. Some require ID or address documents, reviewed by the carrier in 1-3 days." },
        ],
      },
    ],
    related: ["/product/call-forwarding", "/product/call-forwarding/busy-call-forwarding", "/blog/get-us-phone-number-from-abroad", "/blog/cheap-international-business-calls"],
  },

  {
    path: "/product/call-forwarding/busy-call-forwarding",
    title: "Busy and No-Answer Call Forwarding | DIGIRINGO",
    description:
      "When you don't answer in the DIGIRINGO app, whether you're busy, away or you decline, the call forwards to your cellphone. In beta, one fallback rule today.",
    crumbs: crumbs(FORWARDING, { label: "Busy call forwarding", href: "/product/call-forwarding/busy-call-forwarding" }),
    status: "beta",
    sections: [
      {
        type: "hero",
        eyebrow: "Call forwarding",
        h1: "Busy in the app? The call finds your cellphone",
        sub: "When a call on your DIGIRINGO number isn't picked up in the app, because you're on another call, away from the desk or you tap decline, it moves to your cellphone.",
        bullets: [
          "Covers unanswered, busy and declined calls",
          "Kicks in after about 30 seconds of ringing",
          "Beta: one fallback rule for now",
        ],
        shot: "calls",
        primary: GET_NUMBER,
      },
      {
        type: "definition",
        title: "What is busy call forwarding?",
        paragraphs: [
          "Busy call forwarding, also called conditional forwarding, only forwards a call when you can't take it. If you answer, nothing changes. If you don't, the call gets a second chance on another phone.",
          "Some phone systems let you set a different destination for each condition. DIGIRINGO currently uses one fallback for all of them: whatever the reason the app didn't answer, the call goes to the cellphone you chose.",
        ],
        tone: "tint",
      },
      {
        type: "table",
        title: "What happens in each case today",
        head: ["Situation", "What DIGIRINGO does"],
        rows: [
          ["You answer in the app", "Call connects. No forwarding."],
          ["No answer for about 30 seconds", "Forwards to your cellphone"],
          ["You're already on a call", "Forwards to your cellphone"],
          ["You tap decline", "Forwards to your cellphone"],
          ["Cellphone doesn't answer either", "Caller can leave a voicemail"],
          ["Different rule per situation", "soon"],
        ],
      },
      {
        type: "cards",
        title: "Why it helps",
        cols: 3,
        items: [
          { title: "Back-to-back calls", body: "A second caller isn't stuck while you finish the first.", icon: "phone-incoming" },
          { title: "Away from the computer", body: "Step out for lunch and the call still reaches you.", icon: "smartphone" },
          { title: "Decline without losing it", body: "Can't talk at your desk? Decline and take it on your phone in the hallway.", icon: "phone-forwarded" },
        ],
      },
      {
        type: "steps",
        title: "How to turn it on",
        tone: "tint",
        items: [
          { title: "Open the number's routing", body: "Find it in the app's settings for that number." },
          { title: "Choose ring in the app with fallback", body: "Add the cellphone number that should catch unanswered calls." },
          { title: "Test each case", body: "Try ignoring a test call, and try declining one, to see the forwarding happen." },
        ],
      },
      {
        type: "callout",
        title: "Why beta?",
        body: "The fallback works today, but we want to give you separate choices for busy, declined and unanswered calls, and a custom ring time. Those controls are still being built.",
      },
      {
        type: "cta",
        title: "Set up a fallback for your business line.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I change how long it rings before forwarding?", a: "Not yet. It's about 30 seconds today. A custom ring time is planned." },
          { q: "Can declined calls go to voicemail instead?", a: "Not separately for now. Separate rules per condition are coming soon." },
          { q: "Is the forwarded leg billed?", a: "Yes, at the per-minute rate for the destination phone, such as $0.015 per minute within the US and Canada." },
          { q: "Does this work for toll-free numbers?", a: "Yes. Forwarding applies to any DIGIRINGO number that receives calls." },
        ],
      },
    ],
    related: ["/product/call-forwarding", "/product/call-routing/sequential-ring", "/blog/conditional-call-forwarding"],
  },

  {
    path: "/product/call-forwarding/call-transfer",
    title: "Call Transfer (Coming Soon) | DIGIRINGO",
    description:
      "Call transfer will let you pass a live DIGIRINGO call to a teammate or another number, with or without an intro. Coming soon. The plan and today's options.",
    crumbs: crumbs(FORWARDING, { label: "Call transfer", href: "/product/call-forwarding/call-transfer" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call forwarding",
        h1: "Pass a live call to the right person",
        sub: "Call transfer is coming to DIGIRINGO. Answer a call, realize someone else should take it, and send it over without the caller hanging up.",
        bullets: [
          "Blind transfer: send it straight over",
          "Warm transfer: introduce the caller first",
          "Coming soon, not available yet",
        ],
        shot: "dialer",
      },
      {
        type: "definition",
        title: "What is call transfer?",
        paragraphs: [
          "Forwarding happens before anyone answers. Transfer happens after. You're already talking with the caller and you move the call to a colleague or another phone number.",
          "There are two common styles. A blind transfer sends the call immediately. A warm transfer lets you speak with the colleague first, explain the situation, and then connect everyone.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned transfer types",
        cols: 2,
        items: [
          { title: "Blind transfer", body: "Quick hand-off when the next person doesn't need context.", icon: "phone-forwarded", status: "soon" },
          { title: "Warm transfer", body: "A short private chat with your colleague before you connect the caller.", icon: "users", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Give out the right number", body: "If a different person handles billing or scheduling, give them their own DIGIRINGO number." },
          { title: "Use hold while you check", body: "Put the caller on hold, find the answer, then come back." },
          { title: "Route the number differently", body: "If calls on a number should go to someone else, change that number's routing to their phone." },
        ],
      },
      {
        type: "callout",
        title: "Built alongside three-way calling",
        body: "Warm transfer and three-way calling share the same foundation, so they're being developed together. Neither is available yet.",
      },
      {
        type: "cta",
        title: "Get notified when transfer launches.",
        button: { label: "See call routing today", href: "/product/call-routing" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I transfer calls in DIGIRINGO now?", a: "No. Call transfer is coming soon." },
          { q: "Will I be able to transfer to an outside number?", a: "That's part of the plan, billed at the normal per-minute rate for the outbound leg." },
          { q: "What's the difference between forwarding and transfer?", a: "Forwarding redirects a call before it's answered. Transfer moves a call that's already in progress." },
          { q: "Will transfer need team seats?", a: "Transferring to a teammate inside DIGIRINGO will. Transferring to an outside phone number won't." },
        ],
      },
    ],
    related: ["/product/calling/three-way-calling", "/product/call-forwarding", "/product/call-management/call-delegation"],
  },

  {
    path: "/product/call-forwarding/do-not-disturb",
    title: "Do Not Disturb for Business Calls | DIGIRINGO",
    description:
      "Do not disturb in DIGIRINGO will silence your business line on a schedule and send callers to voicemail. Coming soon. See the plan and today's options.",
    crumbs: crumbs(FORWARDING, { label: "Do not disturb", href: "/product/call-forwarding/do-not-disturb" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call forwarding",
        h1: "Quiet hours for your business number",
        sub: "We're adding do not disturb so your work line can go silent in the evening or on weekends, while callers still get a way to leave a message.",
        bullets: [
          "One switch to pause ringing",
          "Schedules for nights and weekends",
          "Coming soon, not available yet",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is do not disturb for a business line?",
        paragraphs: [
          "Do not disturb stops a phone line from ringing for a while. Calls aren't lost. They go straight to voicemail or another destination instead of interrupting you.",
          "For a business number it's the difference between being reachable and being on call all the time. You decide when the line rests.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What we're planning",
        cols: 3,
        items: [
          { title: "Manual toggle", body: "Turn it on and off in a tap.", icon: "moon", status: "soon" },
          { title: "Schedules", body: "Set recurring quiet hours.", icon: "calendar", status: "soon" },
          { title: "Where calls go", body: "Choose voicemail or a backup number while you're off.", icon: "voicemail", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Sign out of the web app", body: "If you're signed out everywhere, the app won't ring you." },
          { title: "Silence the Android app", body: "Use your phone's own Do Not Disturb or notification settings for DIGIRINGO." },
          { title: "Remove forwarding for the evening", body: "If you forward to your cellphone, switch the number's routing back to the app only." },
          { title: "Let voicemail catch the rest", body: "Unanswered callers can still leave a message." },
        ],
      },
      {
        type: "callout",
        title: "Not live yet",
        body: "DIGIRINGO doesn't have a do-not-disturb switch or quiet-hours schedule today. We'll mark this page live when it ships.",
      },
      {
        type: "cta",
        title: "Planning your hours? Read our guide to small-business call routing.",
        button: { label: "Read the guide", href: "/blog/small-business-call-routing" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO have do not disturb now?", a: "Not as a built-in setting. It's coming soon. The workarounds above help in the meantime." },
          { q: "Will callers hear a special message?", a: "Custom greetings are planned for voicemail. Today callers hear the standard voicemail greeting." },
          { q: "Will texts be silenced too?", a: "That's our intent, so the whole line goes quiet." },
          { q: "Is this the same as business-hours routing?", a: "They're related. Business-hours routing, also coming soon, sends calls to different places depending on the time." },
        ],
      },
    ],
    related: ["/product/call-routing/business-hours-call-routing", "/product/voicemail", "/product/call-forwarding"],
  },

  /* ─────────────────────────── CALL ROUTING ─────────────────────────── */
  {
    path: "/product/call-routing",
    title: "Call Routing for Every Number | DIGIRINGO",
    description:
      "Choose where calls on each DIGIRINGO number go: ring the app, forward to a phone, hand off to a SIP or AI agent, or call your own webhook. Change it any time.",
    crumbs: crumbs(ROUTING),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Call routing",
        h1: "Send each number's calls exactly where they belong",
        sub: "Every DIGIRINGO number has its own routing. Ring your devices, forward to a cellphone, connect a SIP or AI agent, or let your own webhook decide.",
        bullets: [
          "Four routing options, set per number",
          "Changes apply to the next call",
          "Developer-friendly webhook option (TeXML)",
        ],
        shot: "settings",
        primary: GET_NUMBER,
        secondary: PRICING,
      },
      {
        type: "definition",
        title: "What is call routing?",
        paragraphs: [
          "Call routing is the set of rules that decides what happens when someone dials your number. Which device rings, in what order, and where the call goes if nobody answers.",
          "DIGIRINGO keeps routing simple and per number. Your main line can ring the whole office, your field line can go straight to a cellphone, and a test number can hit your own AI agent.",
        ],
        tone: "tint",
      },
      {
        type: "tabs",
        title: "The four routing options",
        tabs: [
          {
            name: "Ring in the app",
            items: [
              { title: "Every signed-in device", body: "Browser tabs and Android phones ring together.", icon: "laptop", status: "live" },
              { title: "Cellphone fallback", body: "Unanswered after about 30 seconds? It moves to your cell.", icon: "phone-forwarded", status: "live" },
            ],
          },
          {
            name: "Forward to a phone",
            items: [
              { title: "Any phone number", body: "Calls go straight to the number you enter, in the US or abroad.", icon: "smartphone", status: "live" },
            ],
          },
          {
            name: "SIP or AI agent",
            items: [
              { title: "Your SIP endpoint", body: "Connect a PBX, a softphone or an AI voice agent that accepts SIP.", icon: "bot", status: "live" },
            ],
          },
          {
            name: "Your webhook",
            items: [
              { title: "TeXML instructions", body: "DIGIRINGO asks your URL what to do and follows the reply.", icon: "webhook", status: "live" },
            ],
          },
        ],
      },
      {
        type: "cards",
        eyebrow: "Everything in Call routing",
        title: "Routing features, one page each",
        cols: 3,
        items: [
          { title: "Simultaneous ring", body: "All your devices ring at once.", icon: "bell", href: "/product/call-routing/simultaneous-ring", status: "live" },
          { title: "Sequential ring", body: "The app first, then your cellphone.", icon: "list", href: "/product/call-routing/sequential-ring", status: "live" },
          { title: "Business-hours routing", body: "Different destinations when you're open and closed.", icon: "clock", href: "/product/call-routing/business-hours-call-routing", status: "soon" },
          { title: "Time-of-day routing", body: "Rules based on the hour or the day of the week.", icon: "calendar", href: "/product/call-routing/time-of-day-routing", status: "soon" },
          { title: "Call flow builder", body: "Design a call path visually.", icon: "git-branch", href: "/product/call-routing/call-flow-software", status: "soon" },
          { title: "Automatic call distribution", body: "Spread calls across a team fairly.", icon: "users", href: "/product/call-routing/automatic-call-distribution", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "How to change routing in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Pick the number", body: "Open settings and choose the number you want to change." },
          { title: "Pick a destination", body: "App, phone, SIP agent or webhook." },
          { title: "Add the details", body: "A phone number, a SIP address or a webhook URL, depending on your choice." },
          { title: "Save and test", body: "The next call to that number follows the new route." },
        ],
      },
      {
        type: "cta",
        title: "Building on top of DIGIRINGO? Start with the developer page.",
        button: { label: "For developers", href: "/developers" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can each number have its own routing?", a: "Yes. Routing is set per number, so two numbers on one account can behave completely differently." },
          { q: "Do you have a phone menu (press 1 for sales)?", a: "Not yet. Phone menus and auto-attendant are coming soon. Developers can build one today with the webhook option." },
          { q: "What is TeXML?", a: "It's an XML format for phone instructions, similar to TwiML. Your webhook replies with instructions like dial this number or play this message." },
          { q: "Does routing cost extra?", a: "No. You pay normal call rates. Forwarded legs are billed per minute at the destination's rate." },
          { q: "Can I route by time of day?", a: "Built-in time rules are coming soon. With the webhook option, your own server can already decide based on the time." },
        ],
      },
    ],
    related: ["/product/call-forwarding", "/product/menu-routing", "/product/ai/voice-agent", "/blog/small-business-call-routing"],
  },

  {
    path: "/product/call-routing/simultaneous-ring",
    title: "Simultaneous Ring on All Devices | DIGIRINGO",
    description:
      "With simultaneous ring, a call to your DIGIRINGO number rings every browser and Android phone you're signed in on at once. Answer on whichever is closest.",
    crumbs: crumbs(ROUTING, { label: "Simultaneous ring", href: "/product/call-routing/simultaneous-ring" }),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Call routing",
        h1: "Every device rings. You answer on the nearest one",
        sub: "Sign in to DIGIRINGO on your laptop, your office PC and your Android phone. A call to your number rings all of them at the same moment.",
        bullets: [
          "Browser tabs and Android phones ring together",
          "Push notifications when the tab is in the background",
          "Answer on one, the others stop ringing",
        ],
        shot: "calls",
        primary: GET_NUMBER,
      },
      {
        type: "definition",
        title: "What is simultaneous ring?",
        paragraphs: [
          "Simultaneous ring, sometimes called ring all, sends one incoming call to several endpoints at once. The first one to pick up gets the call.",
          "It removes the guesswork of 'where will I be when they call?'. Whether you're at your desk, in the kitchen or in the car park, the phone closest to you is ringing.",
        ],
        tone: "tint",
      },
      {
        type: "flex",
        rows: [
          {
            title: "Desk and pocket, together",
            body: "Keep the web app open at work and the Android app on your phone. Both light up for each call.",
            shot: "home",
          },
          {
            title: "Background alerts",
            body: "Browser push notifications mean you don't lose a call because the DIGIRINGO tab was hidden behind a spreadsheet.",
            shot: "calls",
          },
        ],
      },
      {
        type: "cards",
        title: "Good to know",
        cols: 3,
        items: [
          { title: "One account, several devices", body: "Use the same login on your work computer, your laptop and your Android phone.", icon: "smartphone" },
          { title: "Pairs with forwarding", body: "If no device answers in about 30 seconds, the call can go to your cellphone.", icon: "phone-forwarded" },
          { title: "Ring groups are separate", body: "Ringing several teammates, each with their own login, is coming soon.", icon: "users", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "How to use simultaneous ring",
        tone: "tint",
        items: [
          { title: "Set the number to ring in the app", body: "This is the default routing for a new number." },
          { title: "Sign in on each device", body: "Web app on your computers, Android app on your phone." },
          { title: "Allow notifications", body: "Say yes when the browser and phone ask, so background calls reach you." },
        ],
      },
      {
        type: "cta",
        title: "Get one number that rings everywhere.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I ring my teammates' phones too?", a: "If they're signed in to the same account, yes. Ring groups with separate team logins are coming soon." },
          { q: "Does it ring my cellphone number as well?", a: "Not at the same time. Your cellphone can be the fallback if no app device answers. That's sequential ring." },
          { q: "Does an iPhone ring?", a: "There's no iOS app yet. An iPhone with the web app open in Safari can take calls while the page is active." },
          { q: "Is there an extra charge?", a: "No. Ringing several devices doesn't change the price of the call." },
        ],
      },
    ],
    related: ["/product/call-routing/sequential-ring", "/product/calling/call-from-browser", "/blog/ring-multiple-phones-one-number"],
  },

  {
    path: "/product/call-routing/sequential-ring",
    title: "Sequential Ring: App, Then Cellphone | DIGIRINGO",
    description:
      "Sequential ring tries the DIGIRINGO app first, then forwards to your cellphone if nobody answers in about 30 seconds. One number, two chances to pick up.",
    crumbs: crumbs(ROUTING, { label: "Sequential ring", href: "/product/call-routing/sequential-ring" }),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Call routing",
        h1: "Try the app first, then your phone",
        sub: "Sequential ring gives each call a running order. Your signed-in devices ring first. If no one answers, the call moves on to your cellphone.",
        bullets: [
          "Step 1: web app and Android app",
          "Step 2: your cellphone after about 30 seconds",
          "Step 3: voicemail if still unanswered",
        ],
        shot: "calls",
        primary: GET_NUMBER,
      },
      {
        type: "definition",
        title: "What is sequential ring?",
        paragraphs: [
          "Sequential ring, also known as hunt or follow-me, tries destinations one after another instead of all at once. It's useful when you want to answer on the app when possible, but not miss the call when you're away from it.",
          "DIGIRINGO's sequence is fixed for now: app devices, then your cellphone, then voicemail. Custom orders with more steps are planned with our call flow builder.",
        ],
        tone: "tint",
      },
      {
        type: "table",
        title: "The order a call follows",
        head: ["Step", "Who rings", "For how long"],
        rows: [
          ["1", "Every device signed in to DIGIRINGO", "About 30 seconds"],
          ["2", "The cellphone you set as fallback", "Until answered or it rings out"],
          ["3", "Voicemail", "Caller leaves a message"],
        ],
        note: "Custom ring times and extra steps are coming soon.",
      },
      {
        type: "cards",
        title: "Sequential or simultaneous?",
        cols: 2,
        items: [
          { title: "Choose simultaneous", body: "When you're usually near a computer or the Android app, and want every device to ring at once.", icon: "bell", href: "/product/call-routing/simultaneous-ring" },
          { title: "Add sequential", body: "When you also want a plain cellphone to catch what the app missed. Both work together.", icon: "list" },
        ],
      },
      {
        type: "steps",
        title: "How to set up sequential ring",
        tone: "tint",
        items: [
          { title: "Open the number's routing", body: "Choose ring in the app." },
          { title: "Add a fallback cellphone", body: "Enter the number that should ring if the app doesn't answer." },
          { title: "Try it", body: "Call your number and let the app ring out. Your cell should ring next." },
        ],
      },
      {
        type: "cta",
        title: "Never let the app be the last stop.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I add more than one cellphone to the sequence?", a: "Not yet. One fallback number per business number today." },
          { q: "Is the cellphone leg billed?", a: "Yes, as a forwarded call at the destination's per-minute rate, $0.015 per minute in the US and Canada." },
          { q: "Can I change the 30-second wait?", a: "Not yet. Adjustable timing is planned." },
          { q: "What does the caller hear while it switches?", a: "They keep hearing ringing. There's no announcement." },
        ],
      },
    ],
    related: ["/product/call-routing/simultaneous-ring", "/product/call-forwarding/busy-call-forwarding", "/product/call-management/never-miss-a-call"],
  },

  {
    path: "/product/call-routing/business-hours-call-routing",
    title: "Business Hours Call Routing (Soon) | DIGIRINGO",
    description:
      "Business-hours routing will send calls one way when you're open and another when you're closed. Coming soon to DIGIRINGO. See the plan and what works today.",
    crumbs: crumbs(ROUTING, { label: "Business hours", href: "/product/call-routing/business-hours-call-routing" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call routing",
        h1: "Open hours one way, closed hours another",
        sub: "Set your opening hours once and let DIGIRINGO handle the rest: ring the team during the day, go to voicemail or an on-call phone at night.",
        bullets: [
          "Weekly schedule per number",
          "Separate open and closed destinations",
          "Coming soon, not available yet",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is business-hours call routing?",
        paragraphs: [
          "Business-hours routing checks the clock before deciding where a call goes. Inside your hours, it follows your normal route. Outside them, it follows a different one.",
          "It means customers who call at 10pm get a consistent experience, and you don't have to remember to change settings every evening.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What we're planning",
        cols: 3,
        items: [
          { title: "Weekly hours", body: "Different hours for each day of the week.", icon: "calendar", status: "soon" },
          { title: "Closed-hours route", body: "Voicemail, a cellphone, or your AI agent.", icon: "route", status: "soon" },
          { title: "Time zone aware", body: "Hours follow the time zone you set for the number.", icon: "globe", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Switch routing by hand", body: "Change a number's routing at closing time and back in the morning." },
          { title: "Use your own webhook", body: "If you're technical, point the number at your webhook. Your server can check the time and return different TeXML." },
          { title: "Lean on voicemail", body: "Unanswered after-hours calls can leave a message." },
        ],
      },
      {
        type: "callout",
        title: "Ready-made recipe",
        body: "Our business hours with voicemail template describes the flow step by step, which parts work in DIGIRINGO today, and which are coming.",
        tone: "tint",
      },
      {
        type: "cta",
        title: "See the template.",
        button: { label: "Business hours template", href: "/templates/business-hours-with-voicemail" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is business-hours routing available now?", a: "No, it's coming soon. The webhook option is the only automatic way to route by time today." },
          { q: "Will it handle holidays?", a: "Holiday exceptions are on our list for this feature." },
          { q: "Will texts follow the same hours?", a: "After-hours text replies are a separate feature, the SMS autoresponder, also coming soon." },
          { q: "Will it work with an AI agent at night?", a: "Yes, that's one of the planned closed-hours options. Routing a number to your own AI or SIP agent already works today, just without the schedule." },
        ],
      },
    ],
    related: ["/product/call-routing/time-of-day-routing", "/product/messaging/sms-autoresponder", "/product/call-forwarding/do-not-disturb"],
  },

  {
    path: "/product/call-routing/time-of-day-routing",
    title: "Time-of-Day Call Routing (Coming Soon) | DIGIRINGO",
    description:
      "Time-of-day routing will send calls to different people or phones depending on the hour and day. It's coming soon to DIGIRINGO. Here's how it will work.",
    crumbs: crumbs(ROUTING, { label: "Time-of-day routing", href: "/product/call-routing/time-of-day-routing" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call routing",
        h1: "Morning calls to one place, evening calls to another",
        sub: "Time-of-day routing will split the day into slots, each with its own destination. Perfect for shifts, split teams and lunch cover.",
        bullets: [
          "Multiple time slots per day",
          "A destination for each slot",
          "Coming soon, not available yet",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is time-of-day routing?",
        paragraphs: [
          "Where business-hours routing has two states, open and closed, time-of-day routing can have many. 8 to 12 rings the front desk, 12 to 1 goes to the owner's cell, 1 to 6 rings the office again, and nights go to voicemail.",
          "It's useful for any business where the person on duty changes during the day.",
        ],
        tone: "tint",
      },
      {
        type: "table",
        title: "Example schedule (how it will work)",
        head: ["Time", "Destination"],
        rows: [
          ["8:00 – 12:00", "Ring in the app"],
          ["12:00 – 13:00", "Forward to the owner's cellphone"],
          ["13:00 – 18:00", "Ring in the app"],
          ["18:00 – 8:00", "Voicemail"],
          ["Saturday", "On-call technician's phone"],
        ],
        note: "Illustration of a planned feature. Not available yet.",
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Build it with a webhook", body: "Route the number to your own webhook. It can read the current time and reply with TeXML that dials the right phone." },
          { title: "Use separate numbers", body: "Give an on-call line its own number, forwarded to whoever is on duty." },
          { title: "Change routing between shifts", body: "Updating a number's routing takes a few seconds in the app." },
        ],
      },
      {
        type: "cards",
        title: "Who it's for",
        cols: 3,
        items: [
          { title: "Shift teams", body: "Hand the line to whoever is on the next shift.", icon: "clock" },
          { title: "Owner-operators", body: "Cover lunch or school pickup without missing calls.", icon: "user" },
          { title: "On-call services", body: "Send night and weekend calls to the person on call.", icon: "wrench" },
        ],
      },
      {
        type: "cta",
        title: "Need it now? Developers can build time rules with webhooks.",
        button: { label: "For developers", href: "/developers" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "How is this different from business-hours routing?", a: "Business-hours routing is open versus closed. Time-of-day routing allows any number of time slots, each with its own destination." },
          { q: "When will it launch?", a: "There's no date yet. Use Get notified and we'll email you." },
          { q: "Will it work with ring groups?", a: "Ring groups are planned too. Our goal is for any slot to point at any destination." },
          { q: "Can my webhook handle this today?", a: "Yes. Per-number webhook routing works now, so your own code can apply any time logic you like." },
        ],
      },
    ],
    related: ["/product/call-routing/business-hours-call-routing", "/product/call-routing/call-flow-software", "/developers"],
  },

  {
    path: "/product/call-routing/call-flow-software",
    title: "Call Flow Builder (Coming Soon) | DIGIRINGO",
    description:
      "DIGIRINGO's call flow builder will let you design how calls move, from greeting to menu to ring order, on one visual canvas. Coming soon. See what works today.",
    crumbs: crumbs(ROUTING, { label: "Call flow builder", href: "/product/call-routing/call-flow-software" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call routing",
        h1: "Draw the path every call should take",
        sub: "We're building a visual call flow editor: drag in a greeting, a menu, a schedule and a ring order, and see exactly what callers will experience.",
        bullets: [
          "Visual editor, no code",
          "Combine hours, menus and ring steps",
          "Coming soon, not available yet",
        ],
        shot: "settings",
      },
      {
        type: "definition",
        title: "What is call flow software?",
        paragraphs: [
          "A call flow is the full journey of an incoming call: the greeting, any menu options, who rings and in what order, and where the call ends up if nobody answers. Call flow software lets you design that journey without writing code.",
          "In DIGIRINGO, the builder will tie together features that are coming separately, such as phone menus, business hours and ring groups, into one picture.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Building blocks we plan to include",
        cols: 4,
        items: [
          { title: "Greeting", body: "Play a message when the call connects.", icon: "volume", status: "soon" },
          { title: "Menu", body: "Press 1 for sales, 2 for support.", icon: "hash", status: "soon" },
          { title: "Schedule", body: "Branch on business hours.", icon: "clock", status: "soon" },
          { title: "Ring step", body: "App, cellphone, agent or voicemail.", icon: "phone", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Use the built-in routes", body: "App with cellphone fallback, forward to phone, or SIP agent, set per number." },
          { title: "Write your own flow", body: "The webhook option lets developers return TeXML with greetings, gathers and dials. It's a code-first call flow." },
          { title: "Start from a template", body: "Our call-flow templates describe common setups and which parts work today." },
        ],
      },
      {
        type: "chips",
        title: "Call-flow templates",
        links: [
          { label: "Smart voicemail", href: "/templates/smart-voicemail" },
          { label: "Front desk", href: "/templates/front-desk" },
          { label: "Emergency plumber", href: "/templates/emergency-plumber" },
          { label: "All templates", href: "/templates" },
        ],
      },
      {
        type: "cta",
        title: "Get notified when the builder launches.",
        button: { label: "See call routing today", href: "/product/call-routing" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is the call flow builder available?", a: "No. It's coming soon, along with phone menus and business-hours routing." },
          { q: "Can I design a phone menu today?", a: "Only with your own webhook and TeXML. A no-code menu is part of the builder and auto-attendant work." },
          { q: "Will it cost extra?", a: "We haven't set pricing. We'll publish it before launch." },
          { q: "Can I preview a flow before it goes live?", a: "That's one of our goals for the editor." },
        ],
      },
    ],
    related: ["/product/menu-routing", "/product/auto-attendant", "/product/call-routing/automatic-call-distribution", "/templates"],
  },

  {
    path: "/product/call-routing/automatic-call-distribution",
    title: "Automatic Call Distribution (Soon) | DIGIRINGO",
    description:
      "Automatic call distribution will spread incoming DIGIRINGO calls evenly across your team. It's coming soon. Learn how ACD works and what you can do today.",
    crumbs: crumbs(ROUTING, { label: "Automatic call distribution", href: "/product/call-routing/automatic-call-distribution" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call routing",
        h1: "Share the calls fairly across your team",
        sub: "Automatic call distribution (ACD) will send each call to the next available teammate, so no one is buried while someone else sits idle.",
        bullets: [
          "Round-robin and longest-idle options",
          "Skips people who are already on a call",
          "Coming soon with team seats",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is automatic call distribution?",
        paragraphs: [
          "ACD is a routing method that picks one person out of a group for each incoming call, based on a rule. Common rules are round-robin (take turns), longest idle (whoever has waited longest) and fixed order (always try Alex first).",
          "It's the backbone of most support and sales lines, and it needs individual team logins to work. That's why it's arriving after DIGIRINGO's team seats.",
        ],
        tone: "tint",
      },
      {
        type: "table",
        title: "Distribution methods we're planning",
        head: ["Method", "How it picks", "Status"],
        rows: [
          ["Round-robin", "Takes turns through the group", "soon"],
          ["Longest idle", "Whoever has gone longest without a call", "soon"],
          ["Fixed order", "Always tries the same person first", "soon"],
          ["Ring all", "Everyone at once, first to answer wins", "soon"],
        ],
        note: "Ringing all devices on one account already works today. See simultaneous ring.",
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Ring every device on one account", body: "Simultaneous ring covers small teams sharing a login." },
          { title: "Route to your own system", body: "Send a number's calls to a SIP contact center or your webhook, and distribute them there." },
          { title: "Use one number per person", body: "Give each teammate their own line until shared numbers arrive." },
        ],
      },
      {
        type: "callout",
        title: "Honest status",
        body: "Automatic call distribution is not part of DIGIRINGO yet. It depends on team seats, which are also coming soon.",
      },
      {
        type: "cta",
        title: "Have your own contact center? Connect it by SIP today.",
        button: { label: "Call routing options", href: "/product/call-routing" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Does DIGIRINGO have ACD now?", a: "No. It's coming soon, after team seats and shared numbers." },
          { q: "What will happen if everyone is busy?", a: "Our plan is for the call to fall back to voicemail or another destination you pick." },
          { q: "Will there be call queues with hold music?", a: "Hold music is also on the roadmap. Queues will be considered alongside ACD." },
          { q: "Can I see who answered what?", a: "Call history per user works today. Team-wide call analytics are coming soon." },
        ],
      },
    ],
    related: ["/product/call-routing/call-flow-software", "/product/shared-numbers", "/product/calling/shared-calling"],
  },

  /* ───────────────────────── CALL MANAGEMENT ───────────────────────── */
  {
    path: "/product/call-management",
    title: "Call Management for Small Business | DIGIRINGO",
    description:
      "Manage business calls with DIGIRINGO: ring every device, forward to your cell, take voicemail and review call history. Screening and delegation are coming soon.",
    crumbs: crumbs(MANAGEMENT),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Call management",
        h1: "Stay on top of every call without living on the phone",
        sub: "DIGIRINGO gives you the controls to decide what rings, when it forwards, where it ends up, and a full record of what happened afterwards.",
        bullets: [
          "Ring all your devices, then your cellphone",
          "Voicemail when nobody can answer",
          "Call history for every inbound and outbound call",
        ],
        shot: "activity",
        primary: GET_NUMBER,
        secondary: PRICING,
      },
      {
        type: "definition",
        title: "What is call management?",
        paragraphs: [
          "Call management is everything that happens around a call besides the talking: how it reaches you, what you do when you can't take it, and how you keep track of it later.",
          "For a small business, good call management means fewer missed opportunities and fewer interruptions at the wrong moment. DIGIRINGO covers the essentials today and is adding team-focused tools next.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        eyebrow: "Everything in Call management",
        title: "Call management features, one page each",
        cols: 2,
        items: [
          { title: "Never miss a call", body: "Simultaneous ring, cellphone fallback and voicemail working together.", icon: "phone-incoming", href: "/product/call-management/never-miss-a-call", status: "live" },
          { title: "Call screening", body: "Know who's calling, and why, before you pick up.", icon: "shield", href: "/product/call-management/call-screening", status: "soon" },
          { title: "Call delegation", body: "Let an assistant answer and place calls on your behalf.", icon: "user", href: "/product/call-management/call-delegation", status: "soon" },
          { title: "Shared line appearance", body: "See a shared line's activity on every teammate's device.", icon: "users", href: "/product/call-management/shared-line-appearance", status: "soon" },
        ],
      },
      {
        type: "flex",
        title: "The pieces that work today",
        rows: [
          {
            title: "Calls reach you",
            body: "Every device you're signed in on rings together, with push alerts for background tabs. Unanswered calls move to your cellphone after about 30 seconds.",
            shot: "calls",
          },
          {
            title: "Missed calls leave a trace",
            body: "If nobody answers anywhere, callers can leave a voicemail with a standard greeting.",
            shot: "home",
          },
          {
            title: "A full call log",
            body: "Your call history lists each call's number, direction, time and length, so callbacks are one tap away.",
            shot: "activity",
          },
        ],
      },
      {
        type: "steps",
        title: "How to set up call management in DIGIRINGO",
        tone: "tint",
        items: [
          { title: "Get your number", body: "Local, toll-free or international." },
          { title: "Install the Android app and allow notifications", body: "So calls reach you away from your computer." },
          { title: "Add a fallback cellphone", body: "In the number's routing, so the app is never the last stop." },
          { title: "Check your history daily", body: "Return missed calls from the log." },
        ],
      },
      {
        type: "cta",
        title: "How much are missed calls costing you? Try the calculator.",
        button: { label: "Missed-call calculator", href: "/tools/missed-call-cost-calculator" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I record calls?", a: "Not yet. Call recording is coming soon." },
          { q: "Can I block a caller?", a: "Number blocking and call screening are planned. They aren't available today." },
          { q: "Is voicemail transcribed?", a: "No. Voicemail is recorded with a standard greeting. Transcription is coming soon." },
          { q: "Can I see analytics for my calls?", a: "Call history is available now. Analytics dashboards are coming soon." },
        ],
      },
    ],
    related: ["/product/call-routing", "/product/call-forwarding", "/product/call-analytics/call-logs", "/product/voicemail"],
  },

  {
    path: "/product/call-management/never-miss-a-call",
    title: "Never Miss a Business Call | DIGIRINGO",
    description:
      "DIGIRINGO rings every device you use, forwards unanswered calls to your cellphone and takes a voicemail if you still can't pick up. Fewer lost customers.",
    crumbs: crumbs(MANAGEMENT, { label: "Never miss a call", href: "/product/call-management/never-miss-a-call" }),
    status: "live",
    sections: [
      {
        type: "hero",
        eyebrow: "Call management",
        h1: "Three safety nets for every incoming call",
        sub: "A call to your DIGIRINGO number rings all your devices, then your cellphone, then goes to voicemail. It has to get past all three before it's truly missed.",
        bullets: [
          "Browser and Android ring together",
          "Cellphone fallback after about 30 seconds",
          "Voicemail as the final catch",
        ],
        shot: "calls",
        primary: GET_NUMBER,
      },
      {
        type: "definition",
        title: "Why missed calls matter",
        paragraphs: [
          "For many small businesses a phone call is the moment someone decides to hire you. If it rings out, the caller often moves on to the next search result. They rarely leave a message, and they almost never call twice.",
          "You can't answer every call live. But you can make sure each one has several chances to reach a person, and leaves a trail when it doesn't.",
        ],
        tone: "tint",
      },
      {
        type: "steps",
        title: "What happens when someone calls",
        items: [
          { title: "Every signed-in device rings", body: "Your browser tabs and Android phone ring together. A push notification appears if the tab is in the background." },
          { title: "Your cellphone rings next", body: "After about 30 seconds without an answer, the call forwards to the cellphone you set." },
          { title: "Voicemail takes a message", body: "If the cellphone doesn't answer either, the caller can leave a voicemail on your DIGIRINGO number." },
          { title: "The call is logged", body: "Missed calls appear in your call history with the caller's number, ready for a callback." },
        ],
      },
      {
        type: "cards",
        title: "Small habits that help",
        cols: 3,
        tone: "tint",
        items: [
          { title: "Allow notifications everywhere", body: "On each browser and on Android. It's the single biggest fix.", icon: "bell" },
          { title: "Call back quickly", body: "The sooner you return a missed call, the more likely they're still looking.", icon: "clock" },
          { title: "Text if they don't pick up", body: "A short SMS from your business number gives them an easy way to reply.", icon: "message" },
        ],
      },
      {
        type: "table",
        title: "Safety nets: today and next",
        head: ["Feature", "Status"],
        rows: [
          ["Ring all signed-in devices", "yes"],
          ["Cellphone fallback", "yes"],
          ["Voicemail with standard greeting", "yes"],
          ["Call history", "yes"],
          ["Route to your own AI or SIP agent", "yes"],
          ["Automatic missed-call text back", "soon"],
          ["Voicemail transcription", "soon"],
          ["Built-in AI receptionist", "soon"],
        ],
      },
      {
        type: "chips",
        title: "Keep reading",
        links: [
          { label: "The cost of missed calls", href: "/blog/cost-of-missed-calls" },
          { label: "Voicemail greeting examples", href: "/blog/business-voicemail-greeting-examples" },
          { label: "Answering service options", href: "/answering-service" },
        ],
      },
      {
        type: "cta",
        title: "Put three safety nets under your business line.",
        body: "Numbers from $2.50 a month. No contract.",
        button: GET_NUMBER,
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Do I need the app open to receive calls?", a: "You need to be signed in. On the web, push notifications reach you when the tab is in the background. On Android, the app notifies you like a normal phone call." },
          { q: "Can I change the voicemail greeting?", a: "A standard greeting is used today. Custom greetings are coming soon." },
          { q: "Can an AI answer my overflow calls?", a: "If you have your own AI voice agent, you can route a number to it today by SIP or webhook. A built-in DIGIRINGO receptionist is coming soon." },
          { q: "What does this cost?", a: "Nothing extra. You pay for your number and the minutes used, including any forwarded leg at $0.015 per minute in the US and Canada." },
        ],
      },
    ],
    related: ["/product/call-routing/sequential-ring", "/product/voicemail", "/features/missed-call-service", "/product/ai/voice-agent"],
  },

  {
    path: "/product/call-management/call-screening",
    title: "Call Screening (Coming Soon) | DIGIRINGO",
    description:
      "Call screening in DIGIRINGO will help you see who's calling and filter unwanted calls before you answer. Coming soon. See what's planned and today's options.",
    crumbs: crumbs(MANAGEMENT, { label: "Call screening", href: "/product/call-management/call-screening" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call management",
        h1: "Decide before you pick up",
        sub: "We're building call screening so you can filter spam, block repeat nuisance callers and hear why someone is calling before you take the call.",
        bullets: [
          "Block specific numbers",
          "Ask unknown callers to say their name",
          "Coming soon, not available yet",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is call screening?",
        paragraphs: [
          "Call screening is a filter between an incoming call and you. At its simplest, it shows the caller's number so you can choose whether to answer. More advanced screening asks the caller to state their name or reason, and lets you accept, decline or send them to voicemail.",
          "It's especially useful for a public business number that appears on your website, signage and vehicles, where spam calls are part of life.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned screening tools",
        cols: 3,
        items: [
          { title: "Block list", body: "Stop calls from numbers you never want to hear from.", icon: "shield", status: "soon" },
          { title: "Announce the caller", body: "Unknown callers record their name before you answer.", icon: "mic", status: "soon" },
          { title: "Send to voicemail", body: "One tap to move a call you don't want to take.", icon: "voicemail", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Check the incoming number", body: "DIGIRINGO shows the caller's number on every incoming call." },
          { title: "Let it ring", body: "Unanswered calls can still leave a voicemail, so you can listen first and call back." },
          { title: "Use an AI or SIP front door", body: "Route a number to your own AI agent or SIP system if it can screen calls for you." },
        ],
      },
      {
        type: "callout",
        title: "Spam on your own outbound calls?",
        body: "Screening is about incoming calls. If people see your number labeled as spam when you call them, read our guide to fixing a Spam Likely label.",
      },
      {
        type: "cta",
        title: "Read the Spam Likely guide.",
        button: { label: "Read the guide", href: "/blog/business-number-spam-likely-fix" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Can I block numbers in DIGIRINGO now?", a: "Not yet. A block list is part of the planned call screening feature." },
          { q: "Will screening slow down calls from known customers?", a: "Our plan is to let contacts you've talked with before skip screening." },
          { q: "Does DIGIRINGO filter spam automatically?", a: "Not today. Automatic spam filtering is something we're exploring for this feature." },
          { q: "Will it work on Android and web?", a: "Yes, that's the plan. There's no iOS app yet." },
        ],
      },
    ],
    related: ["/product/call-management", "/product/call-management/call-delegation", "/product/virtual-receptionist"],
  },

  {
    path: "/product/call-management/call-delegation",
    title: "Call Delegation (Coming Soon) | DIGIRINGO",
    description:
      "Call delegation in DIGIRINGO will let an assistant answer and make calls for you on your own number. Coming soon. See the plan and how to share call duty today.",
    crumbs: crumbs(MANAGEMENT, { label: "Call delegation", href: "/product/call-management/call-delegation" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call management",
        h1: "Let someone you trust take calls for you",
        sub: "Call delegation will give an assistant or office manager access to your line, so they can answer, call back and keep things moving while you focus.",
        bullets: [
          "Assistant answers on your number",
          "Callbacks show your caller ID",
          "Coming soon, with team seats",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is call delegation?",
        paragraphs: [
          "Call delegation means granting another person permission to handle calls on your behalf. A busy owner might let an assistant answer all calls and only pass on the important ones, or let them return calls using the owner's number.",
          "Unlike sharing a password, delegation keeps each person's login separate and lets you take access away at any time. That's why it depends on DIGIRINGO's upcoming team seats.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "What we're planning",
        cols: 3,
        items: [
          { title: "Grant access", body: "Choose a teammate who can use your number.", icon: "user", status: "soon" },
          { title: "Answer and call out", body: "They can pick up and place calls as your line.", icon: "phone", status: "soon" },
          { title: "Revoke anytime", body: "Remove access in one step.", icon: "lock", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Forward to your assistant", body: "Set your number to forward directly to your assistant's phone." },
          { title: "Fallback to them instead of you", body: "Use the assistant's cellphone as the no-answer fallback." },
          { title: "Give them their own number", body: "A second DIGIRINGO number lets an assistant call customers without using yours." },
        ],
      },
      {
        type: "callout",
        title: "Why not just share the login?",
        body: "It works, but your assistant would see your whole account, including your wallet. Delegation will limit what they can do. Until then, forwarding is the safer option.",
      },
      {
        type: "cta",
        title: "Set up forwarding to an assistant today.",
        button: { label: "Call forwarding", href: "/product/call-forwarding" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is call delegation available now?", a: "No. It's coming soon, after team seats and roles." },
          { q: "Will my assistant see my texts?", a: "We plan to let you choose whether delegation covers calls only or texts too." },
          { q: "Will I be charged for my assistant's seat?", a: "DIGIRINGO doesn't have per-user fees today. Any team pricing will be published before launch." },
          { q: "Can my assistant transfer calls to me?", a: "Call transfer is also coming soon. It would pair well with delegation." },
        ],
      },
    ],
    related: ["/product/call-management/shared-line-appearance", "/product/call-forwarding/call-transfer", "/product/calling/shared-calling"],
  },

  {
    path: "/product/call-management/shared-line-appearance",
    title: "Shared Line Appearance (Coming Soon) | DIGIRINGO",
    description:
      "Shared line appearance in DIGIRINGO will show a shared number's live status on every teammate's device, so anyone can answer or pick up held calls. Coming soon.",
    crumbs: crumbs(MANAGEMENT, { label: "Shared line appearance", href: "/product/call-management/shared-line-appearance" }),
    status: "soon",
    sections: [
      {
        type: "hero",
        eyebrow: "Call management",
        h1: "See the line's status from any desk",
        sub: "Shared line appearance will show who's on a shared number, which calls are on hold, and let any teammate pick up where someone else left off.",
        bullets: [
          "Live busy, ringing and on-hold status",
          "Pick up a held call from another device",
          "Coming soon with shared numbers",
        ],
        shot: "calls",
      },
      {
        type: "definition",
        title: "What is shared line appearance?",
        paragraphs: [
          "Shared line appearance (SLA) comes from office phone systems, where a row of buttons on every desk phone lit up for each shared line. You could see at a glance that line 1 was busy and line 2 was on hold, and pick up line 2 from your own desk.",
          "In DIGIRINGO it will be the modern version: the status of a shared number shown in the app for everyone on the team.",
        ],
        tone: "tint",
      },
      {
        type: "cards",
        title: "Planned capabilities",
        cols: 3,
        items: [
          { title: "Line status", body: "Idle, ringing, busy or on hold, shown live.", icon: "monitor", status: "soon" },
          { title: "Pick up held calls", body: "Resume a call someone else put on hold.", icon: "pause", status: "soon" },
          { title: "Avoid double-answering", body: "Everyone sees when a call is already taken.", icon: "check", status: "soon" },
        ],
      },
      {
        type: "steps",
        title: "What you can do today",
        tone: "tint",
        items: [
          { title: "Ring every device", body: "Simultaneous ring rings all devices on one account, and the ringing stops once someone answers." },
          { title: "Hold and resume on one device", body: "Hold works today on the device that took the call." },
          { title: "Check call history", body: "See afterwards which calls came in and which were missed." },
        ],
      },
      {
        type: "table",
        title: "Where this fits",
        head: ["Feature", "Status"],
        rows: [
          ["Simultaneous ring on one account", "yes"],
          ["Hold and mute", "yes"],
          ["Team seats", "soon"],
          ["Shared numbers", "soon"],
          ["Shared line appearance", "soon"],
          ["Call transfer", "soon"],
        ],
      },
      {
        type: "cta",
        title: "Start with simultaneous ring today.",
        button: { label: "Simultaneous ring", href: "/product/call-routing/simultaneous-ring" },
        tone: "dark",
      },
      {
        type: "faq",
        items: [
          { q: "Is shared line appearance available?", a: "No. It's coming soon, after shared numbers and team seats." },
          { q: "Do I need desk phones for it?", a: "No. It's planned for the web app and Android app." },
          { q: "How is it different from shared calling?", a: "Shared calling lets several people use one number. Shared line appearance adds live status so they can coordinate in real time." },
          { q: "Will it work across locations?", a: "Yes. Because it runs over the internet, teammates can be anywhere." },
        ],
      },
    ],
    related: ["/product/shared-numbers", "/product/calling/shared-calling", "/product/call-management/call-delegation"],
  },
];
