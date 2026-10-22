import { useState, type CSSProperties } from "react";
import { ArrowLeft, ShieldCheck, Info } from "lucide-react";
import { C, gradients, font, radius } from "../core/theme";
import { useApp } from "../store/AppStore";
import type { PhoneNumber } from "../core/types";
import { BrandForm, CampaignForm, RegulatoryDocsForm } from "./VerificationForms";

interface Props { onBack: () => void; desktop?: boolean; }

type Form =
  | { kind: "brand" }
  | { kind: "campaign"; numberId: string }
  | { kind: "docs"; numberId: string; phoneNumber: string };

/**
 * Trust center — the verification flow. Carriers require VoIP numbers to be
 * registered before they can send SMS; unregistered numbers are gated from
 * sending (enforced in the store's sendMessage).
 *
 * Two verification paths, chosen by the number's country:
 *  • US/Canada (+1) → 10DLC: register a business BRAND, then a CAMPAIGN, then
 *    attach the number. No documents — Telnyx validates the EIN automatically.
 *  • Other countries → REGULATORY documents: upload proof of ID / address.
 * Everything happens in-app (no Telnyx popup); the store submits to Telnyx.
 */
export function TrustCenterScreen({ onBack, desktop = false }: Props) {
  const { state, registerNumber, showToast } = useApp();
  const [form, setForm] = useState<Form | null>(null);
  const pending = state.numbers.filter((n) => n.verification !== "verified");
  const verified = state.numbers.filter((n) => n.verification === "verified");
  const brand = state.brand;
  const brandOk = brand?.status === "VERIFIED";

  // Latest regulatory status seen in the docs form (fresher than state.numbers,
  // which only reloads on refresh) — keyed by number id.
  const [regSeen, setRegSeen] = useState<Record<string, string>>({});

  const isNanp = (n: PhoneNumber) => n.number.replace(/\D/g, "").startsWith("1");

  // Status line + button for a non-US number, from its carrier regulatory state.
  const regView = (n: PhoneNumber): { text: string; color: string; button: string; primary: boolean } => {
    const s = regSeen[n.id] ?? n.regStatus;
    if (s === "requirement-info-under-review") return { text: "Documents under review by the carrier · usually 1–3 business days", color: C.amber, button: "View submission", primary: false };
    if (s === "requirement-info-exception") return { text: "Some documents were rejected — fix and resubmit", color: C.red, button: "Fix & resubmit", primary: true };
    return { text: "ID & address needed to activate calls and SMS", color: C.amber, button: "Submit documents", primary: true };
  };

  // Pick the right flow for a number when "Register now" is tapped.
  const onRegister = (n: PhoneNumber) => {
    if (isNanp(n)) {
      if (!brandOk) { showToast("Register your business brand first", "error"); return; }
      if (brand?.campaignId) registerNumber(n.id);            // campaign exists → just attach
      else setForm({ kind: "campaign", numberId: n.id });     // first number → campaign form
    } else {
      setForm({ kind: "docs", numberId: n.id, phoneNumber: n.number });
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100%", paddingBottom: 28 }}>
      <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={iconBtn}><ArrowLeft size={17} color={C.text} /></button>
        <p style={{ flex: 1, textAlign: "center", color: C.text, fontSize: 15, fontWeight: 800 }}>Trust center</p>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: "8px 20px 0" }}>
        <h1 style={{ color: C.text, fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>Register your numbers</h1>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
          US and Canadian numbers need 10DLC registration (brand + campaign) before sending texts. Numbers in other countries (e.g. UK) instead need the owner's ID and address before they switch on.
        </p>
      </div>

      {/* Step 1 — account 10DLC brand */}
      <div style={{ padding: "18px 20px 0" }}>
        <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Step 1 · 10DLC Brand</p>
        <div style={{ background: C.card, border: `1px solid ${brandOk ? "rgba(34,197,94,0.3)" : C.line}`, borderRadius: radius.lg, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <ShieldCheck size={22} color={brandOk ? C.green : C.amber} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{brand ? brand.displayName : "Brand not registered"}</p>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{brand ? `Status: ${brand.status}` : "Register your business brand to start"}</p>
          </div>
          {!brandOk && <button onClick={() => setForm({ kind: "brand" })} style={{ padding: "9px 14px", borderRadius: 11, background: gradients.brand, border: "none", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>{brand ? "Continue" : "Register brand"}</button>}
        </div>
      </div>

      <div style={{ padding: "14px 20px 0" }}>
        <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Step 2 · Register numbers</p>
      </div>

      {/* Pending registrations */}
      <div style={{ padding: "0 20px 0" }}>
        {pending.length === 0 ? (
          <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: radius.lg, padding: 18, display: "flex", alignItems: "center", gap: 12 }}>
            <ShieldCheck size={22} color={C.green} />
            <p style={{ color: C.text, fontSize: 13.5, fontWeight: 600 }}>All your numbers are registered 🎉</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pending.map((n) => { const rv = isNanp(n) ? null : regView(n); return (
              <div key={n.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: radius.lg, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21 }}>{n.flag}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: C.text, fontSize: 14, fontWeight: 700, fontFamily: font.mono }}>{n.number}</p>
                    <p style={{ color: rv ? rv.color : n.verification === "pending" ? C.amber : C.red, fontSize: 12, marginTop: 2, fontWeight: 600 }}>
                      {rv ? rv.text : n.verification === "pending" ? "Verification pending" : "Local numbers registration"}
                    </p>
                  </div>
                </div>
                <button onClick={() => onRegister(n)} style={{
                  width: "100%", padding: "13px", borderRadius: radius.md,
                  background: !rv || rv.primary ? gradients.brand : C.input,
                  border: !rv || rv.primary ? "none" : `1px solid ${C.line}`,
                  color: !rv || rv.primary ? "#fff" : C.text, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: font.sans,
                  marginBottom: 8,
                }}>{rv ? rv.button : "Register now"}</button>
                <button onClick={() => showToast("Opening registration guide…")} style={{
                  width: "100%", padding: "12px", borderRadius: radius.md, background: C.input,
                  border: `1px solid ${C.line}`, color: C.text, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: font.sans,
                }}>Learn more</button>
              </div>
            ); })}
          </div>
        )}
      </div>

      {/* Verified */}
      {verified.length > 0 && (
        <div style={{ padding: "22px 20px 0" }}>
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Registered</p>
          <div style={{ background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, overflow: "hidden" }}>
            {verified.map((n, i) => (
              <div key={n.id} style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: i < verified.length - 1 ? `1px solid ${C.lineSoft}` : "none" }}>
                <span style={{ fontSize: 20 }}>{n.flag}</span>
                <p style={{ flex: 1, color: C.text, fontSize: 13.5, fontWeight: 600, fontFamily: font.mono }}>{n.number}</p>
                <ShieldCheck size={17} color={C.green} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: "20px 20px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Info size={15} color={C.faint} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ color: C.faint, fontSize: 11.5, lineHeight: 1.5 }}>
          Registration is a one-time carrier requirement (10DLC). Until a number is registered, outbound SMS on that number is blocked.
        </p>
      </div>

      {/* Verification forms (in-app — no Telnyx popup) */}
      {form?.kind === "brand" && <BrandForm onClose={() => setForm(null)} desktop={desktop} />}
      {form?.kind === "campaign" && <CampaignForm numberId={form.numberId} onClose={() => setForm(null)} desktop={desktop} />}
      {form?.kind === "docs" && <RegulatoryDocsForm numberId={form.numberId} phoneNumber={form.phoneNumber} onClose={() => setForm(null)} onStatus={(s) => { const id = form.numberId; if (s) setRegSeen((p) => ({ ...p, [id]: s })); }} desktop={desktop} />}
    </div>
  );
}

const iconBtn: CSSProperties = { width: 36, height: 36, borderRadius: 11, background: C.input, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 };
