import { type CSSProperties } from "react";
import { ArrowLeft } from "lucide-react";
import { C, gradients, font, radius } from "../core/theme";
import { CountryRates } from "../components/CountryRates";

interface Props { onBack: () => void; onTopUp: () => void; }

export function PlansScreen({ onBack, onTopUp }: Props) {
  return (
    <div style={{ background: C.bg, minHeight: "100%", paddingBottom: 28 }}>
      <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={iconBtn}><ArrowLeft size={17} color={C.text} /></button>
        <h1 style={{ color: C.text, fontSize: 23, fontWeight: 800 }}>Pricing</h1>
      </div>

      <p style={{ color: C.muted, fontSize: 13, padding: "0 18px 16px", lineHeight: 1.5 }}>
        No contracts, no bundles — just <b style={{ color: C.text }}>pay as you go</b>. Top up your wallet, buy a number, and pay only for what you use.
      </p>

      <div style={{ padding: "0 16px 20px" }}>
        <CountryRates />
      </div>

      {/* How it works */}
      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, padding: 18 }}>
          <p style={{ color: C.text, fontSize: 15, fontWeight: 800, marginBottom: 14 }}>How it works</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { n: "1", text: "Top up your wallet with $5, $10, $20 or $50" },
              { n: "2", text: "Buy a number — flat monthly rental from your wallet" },
              { n: "3", text: "Make calls & send texts — usage charged per minute/message" },
            ].map(({ n, text }) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(124,92,255,0.14)", color: C.blue,
                  fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
                }}>{n}</span>
                <span style={{ color: C.text, fontSize: 13, lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <button onClick={onTopUp} style={{
          width: "100%", padding: "15px", borderRadius: radius.md,
          background: gradients.brand, border: "none", color: "#fff",
          fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: font.sans,
        }}>
          Top up wallet
        </button>
      </div>
    </div>
  );
}

const iconBtn: CSSProperties = { width: 36, height: 36, borderRadius: 11, background: C.input, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 };
