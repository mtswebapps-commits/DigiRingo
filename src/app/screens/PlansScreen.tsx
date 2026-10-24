import { type CSSProperties } from "react";
import { ArrowLeft, Check, DollarSign, Phone, MessageSquare, PhoneOutgoing } from "lucide-react";
import { C, gradients, font, radius } from "../core/theme";
import { USAGE_RATES, NUMBER_RENTAL } from "../core/plans";
import { liveUsageRates, liveNumberRental } from "../core/rates";

interface Props { onBack: () => void; onTopUp: () => void; }

export function PlansScreen({ onBack, onTopUp }: Props) {
  const rates = liveUsageRates();
  const rental = liveNumberRental();
  return (
    <div style={{ background: C.bg, minHeight: "100%", paddingBottom: 28 }}>
      <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={iconBtn}><ArrowLeft size={17} color={C.text} /></button>
        <h1 style={{ color: C.text, fontSize: 23, fontWeight: 800 }}>Pricing</h1>
      </div>

      <p style={{ color: C.muted, fontSize: 13, padding: "0 18px 16px", lineHeight: 1.5 }}>
        No contracts, no bundles — just <b style={{ color: C.text }}>pay as you go</b>. Top up your wallet, buy a number, and pay only for what you use.
      </p>

      {/* Number rental */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Phone size={16} color={C.blue} />
            <span style={{ color: C.text, fontSize: 15, fontWeight: 800 }}>Number rental</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.muted, fontSize: 13 }}>Local number</span>
              <span style={{ color: C.text, fontSize: 14, fontWeight: 800 }}>${rental.local.toFixed(2)}<span style={{ color: C.muted, fontSize: 11, fontWeight: 600 }}>/mo</span></span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.muted, fontSize: 13 }}>Toll-free number</span>
              <span style={{ color: C.text, fontSize: 14, fontWeight: 800 }}>${rental.tollfree.toFixed(2)}<span style={{ color: C.muted, fontSize: 11, fontWeight: 600 }}>/mo</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage rates */}
      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <DollarSign size={16} color={C.green} />
            <span style={{ color: C.text, fontSize: 15, fontWeight: 800 }}>Usage rates</span>
          </div>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
            Charged per use from your wallet balance. US &amp; Canada rates below; international calls and texts
            are billed at the carrier's actual rate + 150%.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {rates.map((r, i) => (
              <div key={r.key} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 0",
                borderTop: i > 0 ? `1px solid ${C.lineSoft}` : "none",
              }}>
                <span style={{ color: C.text, fontSize: 13 }}>{r.label}</span>
                <span style={{ color: C.text, fontSize: 13, fontWeight: 700, fontFamily: font.mono }}>
                  ${r.price.toFixed(3)}<span style={{ color: C.muted, fontSize: 11, fontWeight: 600 }}>{r.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
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
