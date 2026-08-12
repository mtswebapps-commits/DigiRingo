import { useState } from "react";
import { PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Grid3x3, Phone, MessageSquare, ChevronDown, Check } from "lucide-react";
import { C, gradients, font, radius } from "../core/theme";
import { useApp, useActiveNumber } from "../store/AppStore";
import type { CallDirection } from "../core/types";

interface Props { onOpenDialer: () => void; onMessage: (number: string) => void; }

const DIR: Record<CallDirection, { Icon: typeof PhoneCall; color: string }> = {
  incoming: { Icon: PhoneIncoming, color: C.blue },
  outgoing: { Icon: PhoneOutgoing, color: C.green },
  missed:   { Icon: PhoneMissed,   color: C.red },
};

/** Calls — call history log, with a keypad FAB to open the dialer. */
export function CallsScreen({ onOpenDialer, onMessage }: Props) {
  const { state, placeCall, selectNumber } = useApp();
  const active = useActiveNumber();
  const [showPicker, setShowPicker] = useState(false);
  const missed = state.calls.filter((c) => c.direction === "missed").length;

  return (
    <div style={{ background: C.bg, minHeight: "100%", paddingBottom: 100, position: "relative" }}>
      <div style={{ padding: "16px 20px 14px" }}>
        <h1 style={{ color: C.text, fontSize: 23, fontWeight: 800 }}>Calls</h1>
        <p style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
          {missed > 0 ? <><span style={{ color: C.red, fontWeight: 600 }}>{missed}</span> missed</> : `${state.calls.length} recent calls`}
        </p>
        {/* Choose which of your numbers call-backs & texts go out from. */}
        <button onClick={() => setShowPicker(true)} style={{
          marginTop: 10, width: "100%", background: C.card, border: `1px solid ${C.line}`,
          borderRadius: radius.md, padding: "10px 14px", display: "flex", alignItems: "center",
          gap: 12, cursor: "pointer", fontFamily: font.sans,
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{active?.settings.icon || "📱"}</div>
          <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <p style={{ color: C.faint, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>Call / text from</p>
            <p style={{ color: C.text, fontSize: 13, fontWeight: 700, fontFamily: font.mono, marginTop: 1 }}>{active?.flag} {active?.number || "Select a number"}</p>
          </div>
          <ChevronDown size={18} color={C.muted} />
        </button>
      </div>

      <div style={{ padding: "0 20px" }}>
        {state.calls.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 70 }}>
            <div style={{ fontSize: 46, marginBottom: 12 }}>📞</div>
            <p style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>No calls yet</p>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>Tap the keypad to make a call</p>
          </div>
        ) : (
          <div style={{ background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, overflow: "hidden" }}>
            {state.calls.map((call, i) => {
              const { Icon, color } = DIR[call.direction];
              const num = state.numbers.find((n) => n.id === call.numberId);
              const isMissed = call.direction === "missed";
              return (
                <div key={call.id} style={{ padding: "13px 16px", borderBottom: i < state.calls.length - 1 ? `1px solid ${C.lineSoft}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{call.contactFlag}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: isMissed ? C.red : C.text, fontSize: 13, fontWeight: 700, fontFamily: font.mono }}>{call.contact}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                      <Icon size={13} color={color} />
                      <span style={{ color: C.muted, fontSize: 12 }}>{call.status}{call.duration ? ` · ${call.duration}` : ""}</span>
                    </div>
                    <p style={{ color: C.faint, fontSize: 10.5, marginTop: 2 }}>via {num?.settings.label ?? num?.number}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7, flexShrink: 0 }}>
                    <span style={{ color: C.muted, fontSize: 11 }}>{call.time}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <button onClick={() => onMessage(call.contact)} title="Message" style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(124,92,255,0.14)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <MessageSquare size={15} color={C.blue} />
                      </button>
                      <button onClick={() => placeCall(call.contact)} title="Call back" style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(34,197,94,0.14)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Phone size={15} color={C.green} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* "Call / text from" number picker */}
      {showPicker && (
        <div onClick={(e) => e.target === e.currentTarget && setShowPicker(false)} style={{ position: "absolute", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: "100%", background: C.card, borderRadius: "26px 26px 0 0", border: `1px solid ${C.line}`, maxHeight: "72%", overflowY: "auto", padding: "8px 0 24px" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 6px" }}>
              <div style={{ width: 38, height: 4, borderRadius: 2, background: C.line }} />
            </div>
            <p style={{ color: C.text, fontSize: 16, fontWeight: 800, padding: "8px 20px 12px" }}>Call / text from</p>
            {state.numbers.map((n) => {
              const sel = n.id === active?.id;
              return (
                <button key={n.id} onClick={() => { selectNumber(n.id); setShowPicker(false); }} style={{
                  width: "100%", padding: "13px 20px", background: sel ? "rgba(124,92,255,0.12)" : "transparent",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: font.sans,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{n.settings.icon}</div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <p style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{n.settings.label}</p>
                    <p style={{ color: C.muted, fontSize: 12, fontFamily: font.mono, marginTop: 2 }}>{n.number}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {n.voice && <Phone size={13} color={C.faint} />}
                    {n.sms && <MessageSquare size={13} color={C.faint} />}
                    {sel && <Check size={18} color={C.blue} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Keypad / dialer FAB */}
      <button onClick={onOpenDialer} title="Open dialer" style={{
        position: "fixed", bottom: 98, right: "calc(50% - 195px + 16px)", width: 58, height: 58, borderRadius: "50%",
        background: gradients.green, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 6px 24px rgba(34,197,94,0.45)", zIndex: 20,
      }}>
        <Grid3x3 size={24} color="#fff" />
      </button>
    </div>
  );
}
