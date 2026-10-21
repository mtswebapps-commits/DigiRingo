/**
 * Marketing content for the DIGIRINGO site. Kept in one place so copy/pricing can
 * be tuned without touching layout. `shot` paths point at /public/shots/*.png —
 * real app captures (see scripts that screenshot the running app).
 */
import { retailPrice } from "../app/core/pricing";

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

export const COUNTRIES = [
  { flag: "🇺🇸", name: "United States" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇧🇷", name: "Brazil" },
  { flag: "🇯🇵", name: "Japan" },
];

export const STATS = [
  { num: "8+", label: "Countries with local numbers" },
  { num: "60s", label: "From sign-up to your first number" },
  { num: `$${retailPrice(1.0).toFixed(2)}`, label: "Local numbers per month" },
  { num: "100%", label: "App-based — no SIM, no contract" },
];

export const FEATURES = [
  {
    icon: "Hash",
    title: "Real local numbers",
    body: "Get genuine local phone numbers in 8+ countries. They look and ring exactly like a native line — because they are one.",
  },
  {
    icon: "MessageSquare",
    title: "SMS that just works",
    body: "Send and receive texts with delivery receipts, per-number inboxes and threaded conversations — all from one screen.",
  },
  {
    icon: "PhoneCall",
    title: "Crystal-clear calls",
    body: "Place and take HD calls over the internet. Pick which of your numbers you call from with a single tap.",
  },
  {
    icon: "Wallet",
    title: "Prepaid wallet",
    body: "Top up once and spend as you go. No surprise invoices — see every charge in a clean, itemised history.",
  },
  {
    icon: "ShieldCheck",
    title: "Trust center",
    body: "Register your numbers for business messaging and stay compliant with 10DLC and carrier requirements, guided step by step.",
  },
  {
    icon: "Globe",
    title: "Borderless by design",
    body: "Keep a US line for work, a UK line for family and more — all in one app, no extra device or SIM required.",
  },
];

export const STEPS = [
  { n: "01", title: "Create your account", body: "Sign up in under a minute. No paperwork, no store visit." },
  { n: "02", title: "Pick a number", body: "Browse live local & mobile numbers and choose the one you like." },
  { n: "03", title: "Top up your wallet", body: "Add credit securely by card — pay only for what you use." },
  { n: "04", title: "Call & text away", body: "Your new number is live instantly. Start messaging and calling." },
];

/** Flat monthly rental per number. */
export const NUMBER_RENTAL = [
  { type: "Local number", price: `$${retailPrice(1.0).toFixed(2)}`, unit: "/mo" },
  { type: "Toll-free number", price: `$${retailPrice(2.0).toFixed(2)}`, unit: "/mo" },
];

/** Pay-as-you-go usage rates — pooled across every number on the account. */
export const USAGE_RATES = [
  { item: "Voice — in & out", price: `$${retailPrice(0.006, 3).toFixed(3)}`, unit: "/min" },
  { item: "Local SMS", price: `$${retailPrice(0.006, 3).toFixed(3)}`, unit: "/msg" },
  { item: "Toll-free SMS", price: `$${retailPrice(0.008, 3).toFixed(3)}`, unit: "/msg" },
  { item: "Short-code SMS", price: `$${retailPrice(0.01, 3).toFixed(3)}`, unit: "/msg" },
  { item: "MMS — outbound", price: `$${retailPrice(0.018, 3).toFixed(3)}`, unit: "/msg" },
  { item: "MMS — inbound", price: `$${retailPrice(0.006, 3).toFixed(3)}`, unit: "/msg" },
];

export const FAQS = [
  {
    q: "What exactly is DIGIRINGO?",
    a: "DIGIRINGO is an app that gives you real local phone numbers in multiple countries. You can call and text from them just like a normal SIM line — but everything lives in one simple app, with no physical SIM or contract.",
  },
  {
    q: "Do I need a SIM card or a second phone?",
    a: "No. DIGIRINGO works entirely over the internet on the phone you already own. Add as many numbers as you like without swapping SIMs or carrying another device.",
  },
  {
    q: "Which countries are available?",
    a: "You can get local numbers in the US, UK, Canada, Australia, Germany, France, Brazil and more — with new countries added regularly. Some countries offer mobile numbers for full SMS support.",
  },
  {
    q: "How does billing work?",
    a: `DIGIRINGO is pure pay-as-you-go. Top up your wallet, rent a number ($${retailPrice(1.0).toFixed(2)}/mo local, $${retailPrice(2.0).toFixed(2)}/mo toll-free) and pay only for what you use — voice from $${retailPrice(0.006, 3).toFixed(3)}/min, SMS from $${retailPrice(0.006, 3).toFixed(3)}/msg, all drawn from your prepaid wallet. No plans, no commitments, no surprise bills.`,
  },
  {
    q: "How do I add credit?",
    a: "Open your wallet and pick a top-up pack ($5, $10, $20 or $50). Payment is processed securely by card — your balance updates instantly and every charge is itemised in your transaction history.",
  },
  {
    q: "Can I send business SMS?",
    a: "Yes. The built-in Trust Center walks you through registering your numbers (10DLC and carrier requirements) so your business messages are delivered reliably and stay compliant.",
  },
  {
    q: "Is it available on iPhone and Android?",
    a: "DIGIRINGO is built cross-platform and ships to both iOS and Android, with the same clean experience on every device.",
  },
];

/** Real app captures — see /public/shots. PhoneFrame falls back gracefully. */
export const SHOTS = {
  home: "/shots/home.png",
  numbers: "/shots/numbers.png",
  buy: "/shots/buy.png",
  inbox: "/shots/inbox.png",
  chat: "/shots/chat.png",
  calls: "/shots/calls.png",
  dialer: "/shots/dialer.png",
  wallet: "/shots/wallet.png",
  settings: "/shots/settings.png",
  activity: "/shots/activity.png",
};
