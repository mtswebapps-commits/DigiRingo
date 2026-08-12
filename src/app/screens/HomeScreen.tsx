import { RefreshCw, Plus, Send, Wallet2, MessageSquare, ShieldCheck, ChevronRight, Gift } from "lucide-react";
import { useState, type ReactNode, type CSSProperties } from "react";
import { C, gradients, font, radius } from "../core/theme";
import { useApp } from "../store/AppStore";
import { getBundle } from "../core/plans";
import { BillingReceipt } from "../components/BillingReceipt";

interface Props {
  onBuyNumber: () => void;
  onOpenInbox: () => void;
  onOpenTrust: () => void;
  onTopUp: () => void;
  onOpenPlans: () => void;
}

/**
 * Home — Quo-style layout. No analytics "insights" grid (removed per request);
 * instead a verification banner + Chats / Wallet summary cards + recent feed.
 */
export function HomeScreen({ onBuyNumber, onOpenInbox, onOpenTrust, onTopUp, onOpenPlans }: Props) {
  const { state } = useApp();
  const [spinning, setSpinning] = useState(false);
  const refresh = () => { setSpinning(true); setTimeout(() => setSpinning(false), 900); };

  const unread = state.conversations.reduce((s, c) => s + c.unread, 0);
  const unverified = state.numbers.filter((n) => n.verification !== "verified").length;
  const recent = [...state.conversations].sort((a, b) => b.unread - a.unread).slice(0, 5);
  const first = state.user?.name?.split(" ")[0] ?? "there";
  const sub = state.subscription;
  const bundle = sub ? getBundle(sub.tier) : undefined;

  return (
    <div style={{ background: C.bg, minHeight: "100%", paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: C.muted, fontSize: 12, fontWeight: 500, letterSpacing: 0.3 }}>{state.user?.workspace}</p>
          <h1 style={{ color: C.text, fontSize: 23, fontWeight: 800, marginTop: 3, lineHeight: 1.2 }}>Good morning, {first} 👋</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            You have <span style={{ color: C.blue, fontWeight: 600 }}>{unread} unread</span> messages
          </p>
        </div>
        <button onClick={refresh} style={{
          width: 38, height: 38, borderRadius: 12, background: C.card,
          border: `1px solid ${C.line}`, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer",
        }}>
          <RefreshCw size={15} color={C.muted} className={spinning ? "spin" : ""} />
        </button>
      </div>

      {/* Verification banner (Trust center entry) */}
      {unverified > 0 && (
        <div style={{ padding: "0 20px 14px" }}>
          <button onClick={onOpenTrust} style={{
            width: "100%", textAlign: "left", cursor: "pointer",
            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: radius.lg, padding: 14, display: "flex", alignItems: "center", gap: 12,
            fontFamily: font.sans,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, background: "rgba(245,158,11,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}><ShieldCheck size={19} color={C.amber} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>Register your numbers</p>
              <p style={{ color: C.muted, fontSize: 11.5, marginTop: 2 }}>
                {unverified} number{unverified > 1 ? "s" : ""} need verification to send SMS
              </p>
            </div>
            <ChevronRight size={18} color={C.amber} />
          </button>
        </div>
      )}

      {/* Summary cards (Quo-style) */}
      <div style={{ padding: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <SummaryCard
          icon={<MessageSquare size={18} color={C.blue} />} iconBg="rgba(124,92,255,0.14)"
          value={`${unread}`} label="Unread chats" onClick={onOpenInbox}
        />
        <SummaryCard
          icon={<Wallet2 size={18} color={C.green} />} iconBg="rgba(34,197,94,0.14)"
          value={`$${state.wallet.balance.toFixed(2)}`} label="Wallet balance" onClick={onTopUp}
        />
      </div>

      {/* Quick actions */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Buy Number", Icon: Plus,    grad: gradients.brand,    fn: onBuyNumber },
            { label: "Send SMS",   Icon: Send,    grad: gradients.brandRev, fn: onOpenInbox },
            { label: "Top Up",     Icon: Wallet2, grad: gradients.green,    fn: onTopUp },
          ].map(({ label, Icon, grad, fn }) => (
            <button key={label} onClick={fn} style={{
              flex: 1, padding: "12px 0", background: grad, borderRadius: radius.md, border: "none",
              color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 6, cursor: "pointer", letterSpacing: 0.2, fontFamily: font.sans,
            }}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Plan usage */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>Plan usage</p>
            <button onClick={onOpenPlans} style={{ background: C.input, border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 12px", color: C.text, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font.sans }}>Manage plan</button>
          </div>
          {sub && bundle ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {([["Minutes", sub.minutesUsed, sub.minutesIncluded], ["SMS", sub.smsUsed, sub.smsIncluded]] as const).map(([label, u, t]) => (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: C.muted, fontSize: 12, fontWeight: 600 }}>{label}</span>
                      <span style={{ color: C.text, fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{u.toLocaleString()} / {t.toLocaleString()}</span>
                    </div>
                    <Bar used={u} total={t} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={chip}><Gift size={12} color={C.green} /> {sub.numbersUsed}/{sub.numbersMax} numbers</span>
                <span style={chip}>{sub.autoRenew ? "🔄 Auto-renew on" : "⏸ Auto-renew off"}</span>
                {sub.status === "past_due" && <span style={{ ...chip, color: C.red }}>⚠ Past due</span>}
              </div>
              <BillingReceipt sub={sub} />
            </div>
          ) : (
            <div style={{ marginTop: 12 }}>
              <p style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.5 }}>You're on <b style={{ color: C.text }}>pay-as-you-go</b>. Pick a plan for included minutes &amp; SMS.</p>
              <button onClick={onOpenPlans} style={{ marginTop: 12, width: "100%", padding: "11px 0", background: gradients.brand, border: "none", borderRadius: radius.md, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font.sans }}>Choose a plan</button>
            </div>
          )}
        </div>
      </div>

      {/* Recent messages */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Recent Messages</p>
          <button onClick={onOpenInbox} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>See all</button>
        </div>
        <div style={{ background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, overflow: "hidden" }}>
          {recent.map((m, i) => (
            <div key={m.id} onClick={onOpenInbox} style={{
              padding: "13px 16px", borderBottom: i < recent.length - 1 ? `1px solid ${C.lineSoft}` : "none",
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{m.contactFlag}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.text, fontSize: 13, fontWeight: 600, fontFamily: font.mono }}>{m.contact}</p>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.preview}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                <span style={{ color: C.muted, fontSize: 11 }}>{m.time}</span>
                {m.unread > 0 && (
                  <span style={{ background: C.blue, color: "#fff", fontSize: 9, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{m.unread}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const chip: CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 999,
  background: C.input, border: `1px solid ${C.line}`, color: C.muted, fontSize: 11.5, fontWeight: 600, fontFamily: font.sans,
};

function Bar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  return (
    <div style={{ height: 6, borderRadius: 999, background: C.input, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: gradients.brand, borderRadius: 999 }} />
    </div>
  );
}

function SummaryCard({ icon, iconBg, value, label, onClick }: {
  icon: ReactNode; iconBg: string; value: string; label: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      background: C.card, borderRadius: radius.lg, padding: 16, border: `1px solid ${C.lineSoft}`,
      textAlign: "left", cursor: "pointer", fontFamily: font.sans,
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{icon}</div>
      <p style={{ color: C.text, fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{value}</p>
      <p style={{ color: C.muted, fontSize: 11, marginTop: 5, fontWeight: 500 }}>{label}</p>
    </button>
  );
}
