import { useState, type CSSProperties } from "react";
import { MailWarning } from "lucide-react";
import { C, font } from "../core/theme";
import { useApp } from "../store/AppStore";

/**
 * Sticky reminder for accounts whose email isn't verified yet. The app stays open,
 * but buying a number or topping up is blocked until the link is opened.
 * Renders nothing once verified.
 */
export function VerifyEmailBar() {
  const { state, resendVerification, refreshUser, showToast } = useApp();
  const [busy, setBusy] = useState<"resend" | "check" | null>(null);
  if (state.user?.emailVerified !== false) return null;

  const resend = async () => {
    setBusy("resend");
    await resendVerification();
    setBusy(null);
  };
  const check = async () => {
    setBusy("check");
    const ok = await refreshUser();
    setBusy(null);
    showToast(ok ? "Email verified ✓" : "Not verified yet. Open the link in your email first.", ok ? "success" : "error");
  };

  return (
    <div role="status" style={{
      flexShrink: 0, padding: "10px 14px", background: "rgba(245,158,11,0.14)",
      borderBottom: "1px solid rgba(245,158,11,0.4)", display: "flex", alignItems: "center", gap: 10,
      fontFamily: font.sans,
    }}>
      <MailWarning size={20} color="#d97706" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: C.text, fontSize: 13, fontWeight: 800 }}>Verify your email</p>
        <p style={{ color: C.muted, fontSize: 11.5, marginTop: 2, lineHeight: 1.35 }}>
          You can't buy a number or top up until you do. We sent a link to {state.user.email}.
        </p>
        <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
          <button onClick={resend} disabled={!!busy} style={linkBtn}>{busy === "resend" ? "Sending…" : "Resend email"}</button>
          <button onClick={check} disabled={!!busy} style={linkBtn}>{busy === "check" ? "Checking…" : "I've verified"}</button>
        </div>
      </div>
    </div>
  );
}

const linkBtn: CSSProperties = {
  background: "none", border: "none", padding: 0, color: C.blue, fontSize: 12.5,
  fontWeight: 800, cursor: "pointer", fontFamily: font.sans,
};
