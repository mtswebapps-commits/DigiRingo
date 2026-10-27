import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { X, ShieldCheck, Building2, Megaphone, FileUp, Check, Loader2 } from "lucide-react";
import { C, gradients, font, radius } from "../core/theme";
import type { BrandRegistration, CampaignRegistration } from "../core/types";
import { useApp } from "../store/AppStore";
import { DIAL_CODES, countryName } from "../core/countries";
import { apiGetRequirements, apiSubmitRequirements, apiTenDlcCost, type ApiAddressInput, type ApiRequirement, type ApiRequirementValue, type ApiRequirements } from "../services/api";

/* ============================================================================
   Verification forms — the real KYC/registration flows that gate SMS sending.
   - BrandForm:        10DLC business profile (A2P "KYC"; no document upload).
   - CampaignForm:     use case + sample messages + consent (opt-in) flow.
   - RegulatoryDocsForm: document upload for numbers whose country requires it.
   All run inside the app (no Telnyx popup); they submit to Telnyx via the store.
   ========================================================================== */

const ENTITY_TYPES = [
  { v: "PRIVATE_PROFIT", l: "Private company" },
  { v: "PUBLIC_PROFIT", l: "Public company" },
  { v: "NON_PROFIT", l: "Non-profit" },
  { v: "GOVERNMENT", l: "Government" },
  { v: "SOLE_PROPRIETOR", l: "Sole proprietor" },
];
// Full TCR industry list (Telnyx `vertical` enum).
const VERTICALS = ["PROFESSIONAL", "REAL_ESTATE", "HEALTHCARE", "HUMAN_RESOURCES", "ENERGY", "ENTERTAINMENT", "RETAIL", "TRANSPORTATION", "AGRICULTURE", "INSURANCE", "POSTAL", "EDUCATION", "HOSPITALITY", "FINANCIAL", "POLITICAL", "GAMBLING", "LEGAL", "CONSTRUCTION", "NGO", "MANUFACTURING", "GOVERNMENT", "TECHNOLOGY", "COMMUNICATION"];
// 10DLC brands are US/Canada only (TCR); EIN issuers can be either.
const COUNTRIES = ["US", "CA"];
// TCR stock-exchange enum (shown only for publicly-traded brands).
const STOCK_EXCHANGES = ["NASDAQ", "NYSE", "AMEX", "AMX", "ASX", "B3", "BME", "BSE", "FRA", "ICEX", "JPX", "JSE", "KRX", "LON", "NSE", "OMX", "SEHK", "SGX", "SSE", "STO", "SWX", "SZSE", "TSX", "TWSE", "VSE"];
const USECASES = [
  { v: "2FA", l: "2FA / OTP codes" },
  { v: "ACCOUNT_NOTIFICATION", l: "Account notifications" },
  { v: "CUSTOMER_CARE", l: "Customer care" },
  { v: "DELIVERY_NOTIFICATION", l: "Delivery notifications" },
  { v: "SECURITY_ALERT", l: "Security alert" },
  { v: "MARKETING", l: "Marketing (needs 2 samples)" },
  { v: "MIXED", l: "Mixed (multiple)" },
  { v: "LOW_VOLUME", l: "Low volume mixed (cheapest, < 2,000 texts/month)" },
];

/* ----------------------------------------------------------------- modal shell */
/* On the phone shell this is a bottom sheet; on the desktop dashboard it becomes
   a centered, max-width dialog (otherwise the fields stretch the full viewport). */
function Sheet({ title, icon, onClose, children, desktop = false }: { title: string; icon: ReactNode; onClose: () => void; children: ReactNode; desktop?: boolean }) {
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position: desktop ? "fixed" : "absolute", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.74)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: desktop ? "center" : "flex-end", justifyContent: "center", padding: desktop ? 24 : 0,
    }}>
      <div style={{
        width: desktop ? "min(600px, 96vw)" : "100%", maxHeight: desktop ? "90vh" : "92%",
        background: C.card, borderRadius: desktop ? 22 : "26px 26px 0 0", border: `1px solid ${C.line}`,
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: desktop ? "0 30px 90px rgba(0,0,0,0.65)" : "0 -12px 60px rgba(0,0,0,0.6)",
      }}>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 11, borderBottom: `1px solid ${C.lineSoft}`, flexShrink: 0 }}>
          <span style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(124,92,255,0.14)", display: "grid", placeItems: "center", color: C.blue }}>{icon}</span>
          <h2 style={{ flex: 1, color: C.text, fontSize: 17, fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, background: C.input, border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}><X size={15} color={C.muted} /></button>
        </div>
        <div style={{ padding: "18px 20px 24px", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

const labelStyle: CSSProperties = { display: "block", color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 6 };
const inputStyle: CSSProperties = { width: "100%", padding: "12px 13px", background: C.input, border: `1px solid ${C.line}`, borderRadius: radius.md, color: C.text, fontSize: 14, outline: "none", fontFamily: font.sans };

function Text({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} style={inputStyle} />
    </div>
  );
}
function Area({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={labelStyle}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
        {options.map((o) => <option key={o.v} value={o.v} style={{ background: C.card, color: C.text }}>{o.l}</option>)}
      </select>
    </div>
  );
}
/** A yes/no attribute row (used for the campaign's content flags). */
function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: "100%", marginBottom: 10, padding: "11px 13px", borderRadius: radius.md, textAlign: "left",
      background: C.input, border: `1px solid ${value ? "rgba(124,92,255,0.5)" : C.line}`, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 11, fontFamily: font.sans,
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: "grid", placeItems: "center",
        background: value ? gradients.brand : "transparent", border: `1.5px solid ${value ? "transparent" : C.line}`,
      }}>{value && <Check size={13} color="#fff" />}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", color: C.text, fontSize: 13.5, fontWeight: 600 }}>{label}</span>
        {hint && <span style={{ display: "block", color: C.muted, fontSize: 11.5, marginTop: 1 }}>{hint}</span>}
      </span>
    </button>
  );
}

/** Two-column layout helper that collapses to one column on the phone. */
function Row({ children, desktop }: { children: ReactNode; desktop: boolean }) {
  return <div style={{ display: "grid", gridTemplateColumns: desktop ? "1fr 1fr" : "1fr", gap: 10 }}>{children}</div>;
}

function SubmitBtn({ busy, label, onClick, disabled }: { busy: boolean; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={busy || disabled} style={{
      width: "100%", marginTop: 6, padding: "14px", borderRadius: radius.md, border: "none",
      background: disabled ? C.input : gradients.brand, color: disabled ? C.muted : "#fff",
      fontSize: 15, fontWeight: 800, cursor: busy ? "wait" : disabled ? "not-allowed" : "pointer",
      fontFamily: font.sans, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: busy ? 0.75 : 1,
    }}>
      {busy ? <><Loader2 size={16} className="dg-spin" /> Submitting…</> : label}
    </button>
  );
}

/* ----------------------------------------------------------------- BRAND form */
export function BrandForm({ onClose, desktop = false }: { onClose: () => void; desktop?: boolean }) {
  const { registerBrand, refreshTenDlc, state, showToast, telnyxMode } = useApp();
  const [busy, setBusy] = useState(false);
  // Wallet charge for a NEW brand (resubmitting a rejected one is free).
  const resubmit = !!state.brand;
  const [fee, setFee] = useState<number | null>(state.brand?.brandFee ?? null);
  useEffect(() => { if (telnyxMode === "live" && !resubmit) refreshTenDlc().then((t) => t && setFee(t.fees.brand)); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [first, ...rest] = (state.user?.name || "").split(" ");
  const [f, setF] = useState<BrandRegistration>({
    firstName: first || "", lastName: rest.join(" "), mobilePhone: "",
    entityType: "PRIVATE_PROFIT",
    displayName: state.user?.workspace?.replace(/'s Workspace$/, "") || "",
    companyName: state.user?.company || "",
    ein: "", einIssuingCountry: "US", vertical: "TECHNOLOGY",
    email: state.user?.email || "", phone: "", website: "",
    street: "", city: "", state: "", postalCode: "", country: "US",
    stockSymbol: "", stockExchange: "NASDAQ",
  });
  const set = (k: keyof BrandRegistration) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const sole = f.entityType === "SOLE_PROPRIETOR";
  const isPublic = f.entityType === "PUBLIC_PROFIT";

  const submit = async () => {
    const need: [string, string][] = [["Display name", f.displayName], ["Contact email", f.email], ["Contact phone", f.phone], ["Street", f.street], ["City", f.city], ["State", f.state], ["Postal code", f.postalCode]];
    if (sole) need.push(["First name", f.firstName ?? ""], ["Last name", f.lastName ?? ""], ["Mobile number", f.mobilePhone ?? ""]);
    else need.push(["Legal business name", f.companyName], ["EIN / Tax ID", f.ein]);
    if (isPublic) need.push(["Stock symbol", f.stockSymbol]);
    const missing = need.find(([, v]) => !v.trim());
    if (missing) { showToast(`${missing[0]} is required`, "error"); return; }
    setBusy(true);
    const res = await registerBrand(f);
    setBusy(false);
    if (res.ok) onClose();
    else if (res.error) showToast(res.error, "error");
  };

  return (
    <Sheet title="Register your business" icon={<Building2 size={17} />} onClose={onClose} desktop={desktop}>
      <p style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.55, marginBottom: 12 }}>
        Carriers (10DLC) require your business identity before you can send SMS to US/Canada. There are
        <b style={{ color: C.text }}> no documents to upload</b> — instead Telnyx checks these details against
        official IRS/business records.
      </p>
      <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.32)", borderRadius: radius.md, padding: "10px 12px", marginBottom: 16, display: "flex", gap: 8 }}>
        <ShieldCheck size={15} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ color: C.text, fontSize: 11.5, lineHeight: 1.5 }}>
          Enter your <b>legal name, EIN and address exactly</b> as they appear on your EIN letter (IRS CP-575).
          Even a small mismatch (e.g. "St" vs "Street") makes carriers reject the brand.
        </p>
      </div>
      <Select label="Business type" value={f.entityType} onChange={(v) => set("entityType")(v)} options={ENTITY_TYPES} />
      {sole ? (
        <>
          <Row desktop={desktop}>
            <Text label="First name" value={f.firstName ?? ""} onChange={set("firstName")} />
            <Text label="Last name" value={f.lastName ?? ""} onChange={set("lastName")} />
          </Row>
          <Text label="Your US / Canada mobile number" value={f.mobilePhone ?? ""} onChange={set("mobilePhone")} placeholder="+1 555 123 4567" />
          <p style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.5, margin: "-6px 0 13px" }}>
            Carriers text a 6-digit code to this mobile to confirm it's you. It must be a real US/Canada mobile, not a VoIP number.
            Sole proprietors can register one number for texting.
          </p>
        </>
      ) : (
        <Text label="Legal business name" value={f.companyName} onChange={set("companyName")} placeholder="DIGIRINGO LLC" />
      )}
      <Text label="Brand / display name" value={f.displayName} onChange={set("displayName")} placeholder="DIGIRINGO" />
      {!sole && (
        <Row desktop={desktop}>
          <Text label="EIN / Tax ID" value={f.ein} onChange={set("ein")} placeholder="12-3456789" />
          <Select label="EIN issuing country" value={f.einIssuingCountry} onChange={(v) => set("einIssuingCountry")(v)} options={COUNTRIES.map((v) => ({ v, l: v }))} />
        </Row>
      )}
      {isPublic && (
        <Row desktop={desktop}>
          <Text label="Stock symbol" value={f.stockSymbol} onChange={set("stockSymbol")} placeholder="AAPL" />
          <Select label="Stock exchange" value={f.stockExchange} onChange={(v) => set("stockExchange")(v)} options={STOCK_EXCHANGES.map((v) => ({ v, l: v }))} />
        </Row>
      )}
      <Select label="Industry" value={f.vertical} onChange={(v) => set("vertical")(v)} options={VERTICALS.map((v) => ({ v, l: v.charAt(0) + v.slice(1).toLowerCase().replace(/_/g, " ") }))} />
      <Row desktop={desktop}>
        <Text label="Contact email" value={f.email} onChange={set("email")} placeholder="you@business.com" type="email" />
        <Text label="Contact phone" value={f.phone} onChange={set("phone")} placeholder="+1 555 123 4567" />
      </Row>
      <Text label="Website (optional)" value={f.website} onChange={set("website")} placeholder="https://…" />
      <Text label="Street address" value={f.street} onChange={set("street")} placeholder="123 Market St" />
      <Row desktop={desktop}>
        <Text label="City" value={f.city} onChange={set("city")} placeholder="San Francisco" />
        <Text label="State / region" value={f.state} onChange={set("state")} placeholder="CA" />
      </Row>
      <Row desktop={desktop}>
        <Text label="Postal code" value={f.postalCode} onChange={set("postalCode")} placeholder="94103" />
        <Select label="Country" value={f.country} onChange={(v) => set("country")(v)} options={COUNTRIES.map((v) => ({ v, l: v }))} />
      </Row>
      <p style={{ color: C.faint, fontSize: 11, lineHeight: 1.5, margin: "4px 0 14px" }}>
        {resubmit
          ? "Resubmitting corrected details is free. The carrier registry re-checks them, usually within minutes to a few business days."
          : fee ? `A one-time $${fee.toFixed(2)} carrier registration fee is charged from your wallet (refunded if the registry rejects the request). Verification usually completes within minutes to a few business days.`
          : "Verification usually completes within minutes to a few business days."}
      </p>
      <SubmitBtn busy={busy} label={resubmit ? "Resubmit details" : fee ? `Submit — $${fee.toFixed(2)}` : "Submit for verification"} onClick={submit} />
    </Sheet>
  );
}

/* -------------------------------------------------------------- CAMPAIGN form */
export function CampaignForm({ numberId, onClose, desktop = false }: { numberId: string; onClose: () => void; desktop?: boolean }) {
  const { registerNumber, showToast, state, telnyxMode } = useApp();
  const [busy, setBusy] = useState(false);
  // Sole-proprietor brands can only run the SOLE_PROPRIETOR use case.
  const sole = state.brand?.entityType === "SOLE_PROPRIETOR";
  const [f, setF] = useState<CampaignRegistration>({
    usecase: sole ? "SOLE_PROPRIETOR" : "LOW_VOLUME",
    description: "Transactional and customer-service messages to people who opted in through our app.",
    messageFlow: "Users opt in by creating an account in the DIGIRINGO app and confirming their number.",
    sample1: "Your DIGIRINGO verification code is 123456.",
    sample2: "Hi! Your number is active. Reply STOP to unsubscribe.",
    optinKeywords: "START, YES",
    optinMessage: "You're subscribed to DIGIRINGO alerts. Reply HELP for help, STOP to cancel.",
    optoutKeywords: "STOP, UNSUBSCRIBE, CANCEL",
    optoutMessage: "You've been unsubscribed and won't receive more messages. Reply START to opt back in.",
    helpKeywords: "HELP, INFO",
    helpMessage: "DIGIRINGO support: reply STOP to unsubscribe. Msg&data rates may apply.",
    embeddedLink: false, embeddedPhone: false, ageGated: false, directLending: false, affiliateMarketing: false,
  });
  const set = (k: keyof CampaignRegistration) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const setBool = (k: keyof CampaignRegistration) => (v: boolean) => setF((p) => ({ ...p, [k]: v }));
  const needsTwoSamples = f.usecase === "MARKETING" || f.usecase === "MIXED";
  // The carrier's fee for this use case (first 3 months upfront, then monthly).
  const [cost, setCost] = useState<{ upfront: number; monthly: number } | null>(null);
  useEffect(() => {
    if (telnyxMode !== "live") return;
    setCost(null);
    apiTenDlcCost(f.usecase).then(setCost).catch(() => setCost(null));
  }, [f.usecase, telnyxMode]);

  const submit = async () => {
    if (!f.description.trim() || !f.sample1.trim() || !f.messageFlow.trim()) { showToast("Fill the description, sample 1 and the opt-in flow", "error"); return; }
    if (needsTwoSamples && !f.sample2.trim()) { showToast("This use case needs 2 sample messages", "error"); return; }
    if (!f.optoutKeywords.trim() || !f.helpKeywords.trim()) { showToast("Opt-out and HELP keywords are required by carriers", "error"); return; }
    setBusy(true);
    const res = await registerNumber(numberId, f);
    setBusy(false);
    if (res.ok) onClose();
    else if (res.error) showToast(res.error, "error");
  };

  const sectionLabel: CSSProperties = { color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", margin: "6px 0 10px" };

  return (
    <Sheet title="Messaging campaign" icon={<Megaphone size={17} />} onClose={onClose} desktop={desktop}>
      <p style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.55, marginBottom: 16 }}>
        Tell carriers how you'll use SMS. You create this once — every US number you register afterwards attaches to it for free.
        Carriers review it in 1–7 business days.
      </p>
      {cost && cost.upfront > 0 && (
        <div style={{ background: "rgba(124,92,255,0.1)", border: "1px solid rgba(124,92,255,0.3)", borderRadius: radius.md, padding: "10px 12px", marginBottom: 14 }}>
          <p style={{ color: C.text, fontSize: 12.5, lineHeight: 1.5 }}>
            Carrier fee: <b>${cost.upfront.toFixed(2)}</b> now (covers the first 3 months), then <b>${cost.monthly.toFixed(2)}/month</b> from your wallet.
            Refunded if the carrier rejects the request when it's submitted.
          </p>
        </div>
      )}
      {sole
        ? <p style={{ color: C.muted, fontSize: 12, marginBottom: 13 }}>Use case: <b style={{ color: C.text }}>Sole proprietor</b> (one number)</p>
        : <Select label="Use case" value={f.usecase} onChange={(v) => set("usecase")(v)} options={USECASES} />}
      <Area label="What you'll send" value={f.description} onChange={set("description")} />
      <Text label="Sample message 1" value={f.sample1} onChange={set("sample1")} />
      <Text label={needsTwoSamples ? "Sample message 2" : "Sample message 2 (optional)"} value={f.sample2} onChange={set("sample2")} />
      <Area label="How people opt in (consent flow)" value={f.messageFlow} onChange={set("messageFlow")} />

      <p style={sectionLabel}>Consent keywords</p>
      <Row desktop={desktop}>
        <Text label="Opt-in keywords" value={f.optinKeywords} onChange={set("optinKeywords")} placeholder="START, YES" />
        <Text label="Opt-out keywords" value={f.optoutKeywords} onChange={set("optoutKeywords")} placeholder="STOP, CANCEL" />
      </Row>
      <Text label="Help keywords" value={f.helpKeywords} onChange={set("helpKeywords")} placeholder="HELP, INFO" />
      <Area label="Opt-out auto-reply" value={f.optoutMessage} onChange={set("optoutMessage")} />
      <Area label="HELP auto-reply" value={f.helpMessage} onChange={set("helpMessage")} />

      <p style={sectionLabel}>Message content</p>
      <Toggle label="Messages contain links (URLs)" value={f.embeddedLink} onChange={setBool("embeddedLink")} />
      <Toggle label="Messages contain phone numbers" value={f.embeddedPhone} onChange={setBool("embeddedPhone")} />
      <Toggle label="Age-gated content" hint="Alcohol, tobacco, gambling, etc." value={f.ageGated} onChange={setBool("ageGated")} />
      <Toggle label="Direct lending / loan arrangement" value={f.directLending} onChange={setBool("directLending")} />
      <Toggle label="Affiliate marketing" value={f.affiliateMarketing} onChange={setBool("affiliateMarketing")} />

      <SubmitBtn busy={busy} label={cost && cost.upfront > 0 ? `Create campaign & register — $${cost.upfront.toFixed(2)}` : "Create campaign & register number"} onClick={submit} />
    </Sheet>
  );
}

/* --------------------------------------------------------- REGULATORY DOCS form */
// Every country, by name — the address can be anywhere in the world.
const ADDRESS_COUNTRIES = Object.keys(DIAL_CODES)
  .map((v) => ({ v, l: countryName(v) }))
  .sort((a, b) => a.l.localeCompare(b.l));

const US_STATES = "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY PR".split(" ");
const CA_PROVINCES = "AB BC MB NB NL NS NT NU ON PE QC SK YT".split(" ");

/** How an address looks in each country: region field, postcode label/format, examples. */
function addressShape(cc: string) {
  if (cc === "US") return {
    region: { label: "State", options: US_STATES, required: true }, postal: "ZIP code", postalEx: "10001",
    postalRe: /^\d{5}(-\d{4})?$/, postalHint: "5 digits, e.g. 10001", street: "350 5th Ave", city: "New York",
  };
  if (cc === "CA") return {
    region: { label: "Province", options: CA_PROVINCES, required: true }, postal: "Postal code", postalEx: "M5V 2T6",
    postalRe: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i, postalHint: "letter-digit format, e.g. M5V 2T6", street: "290 Bremner Blvd", city: "Toronto",
  };
  if (cc === "GB") return {
    region: { label: "County (optional)", options: null, required: false }, postal: "Postcode", postalEx: "EC1A 2FD",
    postalRe: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, postalHint: "letters and digits, e.g. EC1A 2FD", street: "60 Holborn Viaduct", city: "London",
  };
  return {
    region: { label: "State / province / region", options: null, required: false }, postal: "Postal code", postalEx: "",
    postalRe: null as RegExp | null, postalHint: "", street: "Street and house number", city: "",
  };
}

const MAX_FILE_MB = 8;
const emptyAddress = (country = "GB"): ApiAddressInput => ({ firstName: "", lastName: "", businessName: "", street: "", street2: "", city: "", region: "", postalCode: "", country });

const fileToBase64 = (f: File) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(",")[1] || "");
  r.onerror = () => reject(new Error(`Couldn't read ${f.name}`));
  r.readAsDataURL(f);
});

function textPrefill(name: string, user: { name?: string; email?: string } | null) {
  if (/contact information/i.test(name) && user?.name) return `Contact: ${user.name} | Business: N/A | Phone: `;
  return "";
}

export function RegulatoryDocsForm({ phoneNumber, onClose, onStatus, desktop = false }: { numberId: string; phoneNumber: string; onClose: () => void; onStatus?: (status: string | null) => void; desktop?: boolean }) {
  const { state, showToast } = useApp();
  const e164 = phoneNumber.replace(/[^\d+]/g, "");
  const [info, setInfo] = useState<ApiRequirements | null>(null);
  const [loadError, setLoadError] = useState("");
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [addr, setAddr] = useState<ApiAddressInput>(emptyAddress);
  const [busy, setBusy] = useState(false);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    apiGetRequirements(e164).then((r) => {
      setInfo(r);
      onStatus?.(r.status);
      setTexts(Object.fromEntries(r.requirements.filter((q) => q.type === "textual").map((q) => [q.id, textPrefill(q.name, state.user)])));
      // Start the address in the number's own country (some countries require a local address).
      if (r.country) setAddr((a) => ({ ...a, country: String(r.country).toUpperCase() }));
      if (state.user?.name) {
        const [first, ...rest] = state.user.name.split(" ");
        setAddr((a) => ({ ...a, firstName: first, lastName: rest.join(" ") }));
      }
    }).catch((e) => setLoadError(e instanceof Error ? e.message : "Couldn't load requirements"));
  }, [e164]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (info?.requirements ?? []).filter((q) => !q.submitted);
  const unsupported = open.filter((q) => !["textual", "document", "address"].includes(q.type));
  const setA = (k: keyof ApiAddressInput) => (v: string) => setAddr((p) => ({ ...p, [k]: v }));
  // Changing the country resets the fields whose format depends on it.
  const setCountry = (country: string) => setAddr((p) => ({ ...p, country, region: "", postalCode: "" }));
  const shape = addressShape(addr.country);
  const postal = addr.postalCode.trim();
  const postalBad = !!postal && !!shape.postalRe && !shape.postalRe.test(postal);
  const addrOk = !!(addr.firstName.trim() && addr.lastName.trim() && addr.street.trim() && addr.city.trim() && addr.country
    && (!shape.region.required || addr.region) && (!shape.postalRe || (postal && !postalBad)));
  const filled = (q: ApiRequirement) =>
    q.type === "textual" ? !!texts[q.id]?.trim() : q.type === "document" ? !!files[q.id] : q.type === "address" ? addrOk : true;
  const ready = open.length > 0 && unsupported.length === 0 && open.every(filled);

  const pickFile = (id: string, f?: File) => {
    if (!f) return;
    if (f.size > MAX_FILE_MB * 1024 * 1024) { showToast(`File must be under ${MAX_FILE_MB} MB`, "error"); return; }
    setFiles((p) => ({ ...p, [id]: f }));
  };

  const submit = async () => {
    const missing = open.find((q) => !filled(q));
    if (missing) {
      const why = missing.type === "address" && postalBad ? `Check the ${shape.postal.toLowerCase()} — ${shape.postalHint}`
        : missing.type === "address" && shape.region.required && !addr.region ? `Pick a ${shape.region.label.toLowerCase()} for the address`
        : `${missing.name} is required`;
      showToast(why, "error"); return;
    }
    setBusy(true);
    try {
      const values: Record<string, ApiRequirementValue> = {};
      for (const q of open) {
        if (q.type === "textual") values[q.id] = texts[q.id].trim();
        else if (q.type === "document") { const f = files[q.id]; values[q.id] = { file: { name: f.name, type: f.type, data: await fileToBase64(f) } }; }
        else if (q.type === "address") values[q.id] = { address: addr };
      }
      const r = await apiSubmitRequirements(e164, values);
      setInfo(r);
      // Telnyx flips the number to under-review a moment after the PATCH; reflect
      // that right away so the Trust Center list doesn't still say "needed".
      onStatus?.(r.status === "requirement-info-pending" || r.status === "requirement-info-exception" ? "requirement-info-under-review" : r.status);
      showToast("Submitted — the number activates once the carrier approves it");
    } catch (e) { showToast(e instanceof Error ? e.message : "Submission failed — try again", "error"); }
    setBusy(false);
  };

  const card = (ok: boolean): CSSProperties => ({ background: C.card, border: `1px solid ${ok ? "rgba(34,197,94,0.4)" : C.line}`, borderRadius: radius.md, padding: 14, marginBottom: 12 });
  const hint = (q: ApiRequirement) => (
    <>
      <p style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{q.name}</p>
      {q.rejected && <p style={{ color: C.red, fontSize: 12, marginTop: 3, fontWeight: 700 }}>Rejected by the carrier — please correct and resubmit.</p>}
      <p style={{ color: C.muted, fontSize: 12, marginTop: 3, lineHeight: 1.45 }}>{q.description.length > 260 ? `${q.description.slice(0, 260)}…` : q.description}</p>
    </>
  );

  const active = info?.status === "active";
  const allSent = !!info && info.requirements.length > 0 && open.length === 0;

  return (
    <Sheet title="Activate your number" icon={<FileUp size={17} />} onClose={onClose} desktop={desktop}>
      <p style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.55, marginBottom: 16 }}>
        By law, {info?.country === "GB" ? "UK" : "this country's"} numbers need the owner's identity and address before
        the carrier switches them on. Calls and texts on <b style={{ color: C.text }}>{phoneNumber}</b> start working once these are approved.
      </p>

      {loadError ? (
        <p style={{ color: C.red, fontSize: 13, textAlign: "center", padding: 20 }}>{loadError}</p>
      ) : !info ? (
        <p style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: 20, display: "flex", gap: 8, justifyContent: "center" }}><Loader2 size={15} className="dg-spin" /> Checking requirements…</p>
      ) : active || info.requirements.length === 0 ? (
        <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: radius.md, padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={20} color={C.green} />
          <p style={{ color: C.text, fontSize: 13.5, fontWeight: 600 }}>{active ? "This number is active — nothing else needed." : "No documents needed for this number."}</p>
        </div>
      ) : allSent ? (
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.32)", borderRadius: radius.md, padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={20} color={C.amber} />
          <p style={{ color: C.text, fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}>Everything is submitted and under review by the carrier. This usually takes 1–3 business days.</p>
        </div>
      ) : (
        <>
          {open.map((q) => {
            if (q.type === "textual") return (
              <div key={q.id} style={card(!!texts[q.id]?.trim())}>
                {hint(q)}
                <textarea value={texts[q.id] ?? ""} onChange={(e) => setTexts((p) => ({ ...p, [q.id]: e.target.value }))}
                  placeholder={q.example ? `e.g. ${q.example.slice(0, 160)}` : ""} rows={3}
                  style={{ ...inputStyle, marginTop: 10, resize: "vertical", lineHeight: 1.5 }} />
              </div>
            );
            if (q.type === "document") return (
              <div key={q.id} style={card(!!files[q.id])}>
                {hint(q)}
                <input ref={(el) => { inputs.current[q.id] = el; }} type="file" accept="image/*,application/pdf" style={{ display: "none" }}
                  onChange={(e) => pickFile(q.id, e.target.files?.[0])} />
                <button onClick={() => inputs.current[q.id]?.click()} style={{
                  marginTop: 11, width: "100%", padding: "11px", borderRadius: radius.md,
                  background: files[q.id] ? "rgba(34,197,94,0.12)" : C.input, border: `1px solid ${files[q.id] ? "rgba(34,197,94,0.4)" : C.line}`,
                  color: files[q.id] ? C.green : C.text, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font.sans,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  {files[q.id] ? <><Check size={15} /> {files[q.id].name}</> : <><FileUp size={15} /> Upload PDF or photo (max {MAX_FILE_MB} MB)</>}
                </button>
              </div>
            );
            if (q.type === "address") return (
              <div key={q.id} style={card(addrOk)}>
                {hint(q)}
                <div style={{ marginTop: 12 }}>
                  <Row desktop={desktop}>
                    <Text label="First name" value={addr.firstName} onChange={setA("firstName")} />
                    <Text label="Last name" value={addr.lastName} onChange={setA("lastName")} />
                  </Row>
                  <Text label="Business name (or leave blank)" value={addr.businessName} onChange={setA("businessName")} />
                  <Select label="Country" value={addr.country} onChange={setCountry} options={ADDRESS_COUNTRIES} />
                  <Text label="Street address" value={addr.street} onChange={setA("street")} placeholder={shape.street} />
                  <Text label="Apartment / suite (optional)" value={addr.street2} onChange={setA("street2")} />
                  <Row desktop={desktop}>
                    <Text label="City" value={addr.city} onChange={setA("city")} placeholder={shape.city} />
                    {shape.region.options
                      ? <Select label={shape.region.label} value={addr.region} onChange={setA("region")}
                          options={[{ v: "", l: "Select…" }, ...shape.region.options.map((v) => ({ v, l: v }))]} />
                      : <Text label={shape.region.label} value={addr.region} onChange={setA("region")} />}
                  </Row>
                  <Text label={shape.postal} value={addr.postalCode} onChange={setA("postalCode")} placeholder={shape.postalEx} />
                  {postalBad && <p style={{ color: C.red, fontSize: 12, marginTop: -6, marginBottom: 10 }}>{`That doesn't look like a ${countryName(addr.country)} ${shape.postal.toLowerCase()} — ${shape.postalHint}.`}</p>}
                </div>
              </div>
            );
            return (
              <div key={q.id} style={card(false)}>
                {hint(q)}
                <p style={{ color: C.amber, fontSize: 12, marginTop: 8, fontWeight: 600 }}>This step can't be completed in the app yet — please contact support.</p>
              </div>
            );
          })}
          <SubmitBtn busy={busy} label="Submit for approval" onClick={submit} disabled={!ready} />
        </>
      )}
    </Sheet>
  );
}

/* ── Registration guide (the Trust Center "Learn more" button) ───────────── */

const GUIDE: Record<"us" | "intl", { intro: string; steps: [string, string][]; tips: string[] }> = {
  us: {
    intro: "US carriers require every business texting from a local (10DLC) number to be registered. Calls work right away — registration only unlocks outbound SMS.",
    steps: [
      ["Register your brand", "Your legal business name, EIN/tax ID, address and contact. The carrier checks these against official records, so they must match exactly."],
      ["Create a campaign", "Describe what you'll text (e.g. customer support, appointment reminders) and give 2 sample messages, including how people opt in and how they can reply STOP."],
      ["Attach your numbers", "Once the campaign is approved, every US number on your account is linked to it with one tap."],
    ],
    tips: [
      "Brand review is usually minutes to 1 day; campaign review 1–7 business days.",
      "Carrier fees come from your wallet and are shown before you submit: a one-time brand fee, then the campaign fee (Low volume is cheapest). Extra numbers attach free.",
      "Sole proprietors without an EIN can still register with their own name — carriers text a code to your US/Canada mobile, and one number can be registered.",
      "Fake or mismatched business details are always rejected by the carrier.",
    ],
  },
  intl: {
    intro: "By law, numbers in the UK and many other countries must be linked to a real, identified owner before the carrier switches them on. Until approved, calls and texts on the number don't work.",
    steps: [
      ["Tap “Submit documents”", "The form asks exactly what the carrier needs for that country — usually your contact details, a short description of how you'll use the number, and your address."],
      ["Upload two documents", "A photo ID (passport, national ID or driving licence) and a proof of address dated within the last 3 months (utility bill, bank statement). Clear photo or PDF, under 8 MB."],
      ["Wait for approval", "The carrier reviews it, usually in 1–3 business days. The number then activates automatically — nothing else to do."],
      ["If something is rejected", "The number shows “Fix & resubmit”. Open it — only the rejected fields need to be filled again."],
    ],
    tips: [
      "The name and address must be the same on your ID, your proof of address and the form.",
      "For personal use write e.g. “Personal use: calls and SMS with friends and family. The number is not resold or shared with third parties.”",
      "No business? Write “N/A” for the company website.",
      "UK landline numbers (01…/02…) are voice only — they can't receive SMS or OTP codes. Pick a mobile (07…) number for texts.",
    ],
  },
};

export function RegistrationGuide({ kind, onClose, desktop = false }: { kind: "us" | "intl"; onClose: () => void; desktop?: boolean }) {
  const g = GUIDE[kind];
  return (
    <Sheet title={kind === "us" ? "US number registration (10DLC)" : "Activating an international number"} icon={<ShieldCheck size={17} />} onClose={onClose} desktop={desktop}>
      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.55, marginBottom: 18 }}>{g.intro}</p>
      {g.steps.map(([title, body], i) => (
        <div key={title} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <span style={{ width: 26, height: 26, borderRadius: 13, background: gradients.brand, color: "#fff", fontSize: 12.5, fontWeight: 800, display: "grid", placeItems: "center", flexShrink: 0 }}>{i + 1}</span>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{title}</p>
            <p style={{ color: C.muted, fontSize: 12.5, marginTop: 3, lineHeight: 1.5 }}>{body}</p>
          </div>
        </div>
      ))}
      <div style={{ background: C.input, border: `1px solid ${C.line}`, borderRadius: radius.md, padding: 14, marginTop: 6 }}>
        <p style={{ color: C.text, fontSize: 12.5, fontWeight: 800, marginBottom: 8 }}>Tips</p>
        {g.tips.map((t) => (
          <div key={t} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
            <Check size={14} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.5 }}>{t}</p>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{ width: "100%", marginTop: 18, padding: 13, borderRadius: radius.md, background: gradients.brand, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: font.sans }}>Got it</button>
    </Sheet>
  );
}
