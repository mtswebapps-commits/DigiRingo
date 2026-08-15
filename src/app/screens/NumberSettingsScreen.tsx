import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { ArrowLeft, ChevronRight, ShieldCheck, Trash2, Smartphone, PhoneForwarded, Bot, Webhook, Loader2 } from "lucide-react";
import { C, gradients, font, radius } from "../core/theme";
import { useApp } from "../store/AppStore";
import { telnyx } from "../services/telnyx";
import { apiGetNumberRouting, apiSetNumberRouting, type RouteKind } from "../services/api";
import type { NumberSettings } from "../core/types";

interface Props { numberId: string; onBack: () => void; onOpenTrust: () => void; }

type DestKind = Exclude<RouteKind, "app">;
const ROUTE_OPTIONS: { kind: RouteKind; title: string; sub: string; Icon: typeof Smartphone }[] = [
  { kind: "app",     title: "Ring my app",               sub: "Calls ring your DIGIRINGO app (default)",  Icon: Smartphone },
  { kind: "number",  title: "Forward to a number",       sub: "Send calls to another phone number",        Icon: PhoneForwarded },
  { kind: "sip",     title: "Connect to my agent (SIP)", sub: "Dial a SIP endpoint / AI voice agent",      Icon: Bot },
  { kind: "webhook", title: "Send to my app (webhook)",  sub: "Hand the call to your own TeXML URL",       Icon: Webhook },
];
const DEST_PLACEHOLDER: Record<DestKind, string> = {
  number: "+1 555 123 4567",
  sip: "sip:agent@your-domain.com",
  webhook: "https://your-app.com/voice",
};
const DEST_HINT: Record<DestKind, string> = {
  number: "Incoming calls to this number are forwarded here. Standard call minutes apply.",
  sip: "Calls are dialed to this SIP URI (e.g. your AI voice agent). Falls to voicemail if it doesn't answer.",
  webhook: "Telnyx POSTs the call to this HTTPS URL, which must return TeXML — your caller agent then controls the call.",
};

/** Per-number settings — the "number action" screen (Quo-style). */
export function NumberSettingsScreen({ numberId, onBack, onOpenTrust }: Props) {
  const { state, updateSettings, showToast, releaseNumber } = useApp();
  const [confirmRelease, setConfirmRelease] = useState(false);
  const [releasing, setReleasing] = useState(false);

  // Per-number incoming-call routing (server-backed, unlike the local-only
  // toggles above). Loaded from /api/numbers/routing; only editable on the live
  // backend (the mock demo has no server to store it).
  const live = telnyx.mode === "live";
  const [routeKind, setRouteKind] = useState<RouteKind>("app");
  const [routeDest, setRouteDest] = useState("");
  const [savedRoute, setSavedRoute] = useState<{ kind: RouteKind; dest: string }>({ kind: "app", dest: "" });
  const [savingRoute, setSavingRoute] = useState(false);

  const n = state.numbers.find((x) => x.id === numberId);

  useEffect(() => {
    if (!live || !n) return;
    let alive = true;
    apiGetNumberRouting(n.number)
      .then((r) => { if (!alive) return; setRouteKind(r.routeKind); setRouteDest(r.routeDest); setSavedRoute({ kind: r.routeKind, dest: r.routeDest }); })
      .catch(() => { /* keep defaults (route not set yet / offline) */ });
    return () => { alive = false; };
  }, [live, n?.number]);

  if (!n) return null;

  const routeDirty = routeKind !== savedRoute.kind || routeDest.trim() !== savedRoute.dest;
  const saveRouting = async () => {
    setSavingRoute(true);
    try {
      const r = await apiSetNumberRouting(n.number, { routeKind, routeDest: routeDest.trim() });
      setSavedRoute({ kind: r.routeKind, dest: r.routeDest });
      setRouteKind(r.routeKind); setRouteDest(r.routeDest);
      showToast("Call routing saved ✓");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Couldn't save routing", "error");
    } finally { setSavingRoute(false); }
  };

  const toggle = (key: keyof NumberSettings) =>
    updateSettings(n.id, { [key]: !n.settings[key] } as Partial<NumberSettings>);

  const verified = n.verification === "verified";

  return (
    <div style={{ background: C.bg, minHeight: "100%", paddingBottom: 28 }}>
      {/* Top bar */}
      <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={iconBtn}><ArrowLeft size={17} color={C.text} /></button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <p style={{ color: C.text, fontSize: 14, fontWeight: 800 }}>{n.settings.icon} {n.settings.label}</p>
          <p style={{ color: C.muted, fontSize: 12, fontFamily: font.mono, marginTop: 1 }}>{n.number}</p>
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Verification status / CTA */}
      <div style={{ padding: "4px 20px 16px" }}>
        <div style={{
          background: verified ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
          border: `1px solid ${verified ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
          borderRadius: radius.lg, padding: 14, display: "flex", alignItems: "center", gap: 12,
        }}>
          <ShieldCheck size={20} color={verified ? C.green : C.amber} />
          <div style={{ flex: 1 }}>
            <p style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{verified ? "Number registered" : "Registration required"}</p>
            <p style={{ color: C.muted, fontSize: 11.5, marginTop: 2 }}>{verified ? "This number can send SMS." : "Register to send SMS to US/Canada."}</p>
          </div>
          {!verified && (
            <button onClick={onOpenTrust} style={{ padding: "8px 14px", borderRadius: 11, background: gradients.amber, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Register</button>
          )}
        </div>
      </div>

      {/* Editable label */}
      <Group title="Identity">
        <Row label="Name">
          <input value={n.settings.label} onChange={(e) => updateSettings(n.id, { label: e.target.value })}
            style={{ background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, textAlign: "right", width: 150, fontFamily: font.sans }} />
        </Row>
      </Group>

      {/* Toggles */}
      <Group title="Call & message handling">
        <ToggleRow label="Business hours"            on={n.settings.businessHours} onClick={() => toggle("businessHours")} />
        <ToggleRow label="Auto record calls"         on={n.settings.autoRecord}    onClick={() => toggle("autoRecord")} />
        <ToggleRow label="Call transcripts"          on={n.settings.transcripts}   onClick={() => toggle("transcripts")} sub="Powered by DIGIRINGO AI ✨" />
        <ToggleRow label="Forward all calls"         on={n.settings.forwardAll}    onClick={() => toggle("forwardAll")} />
      </Group>

      {/* Incoming call routing — where calls to THIS number go: the app, another
          number, a SIP agent, or the user's own webhook (their caller agent). */}
      <Group title="When someone calls this number">
        {ROUTE_OPTIONS.map((opt) => {
          const active = routeKind === opt.kind;
          return (
            <div key={opt.kind} onClick={() => live && setRouteKind(opt.kind)} style={{
              padding: "13px 16px", display: "flex", alignItems: "center", gap: 12,
              borderBottom: `1px solid ${C.lineSoft}`, cursor: live ? "pointer" : "default", opacity: live ? 1 : 0.55,
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: active ? gradients.brand : C.input }}>
                <opt.Icon size={16} color={active ? "#fff" : C.muted} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{opt.title}</p>
                <p style={{ color: C.muted, fontSize: 11.5, marginTop: 2 }}>{opt.sub}</p>
              </div>
              <span style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: `2px solid ${active ? C.blue : C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {active && <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.blue }} />}
              </span>
            </div>
          );
        })}
        {routeKind !== "app" && (
          <div style={{ padding: "12px 16px" }}>
            <input value={routeDest} onChange={(e) => setRouteDest(e.target.value)} disabled={!live}
              placeholder={DEST_PLACEHOLDER[routeKind as DestKind]} autoCapitalize="none" autoCorrect="off" spellCheck={false}
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", background: C.input, border: `1.5px solid ${C.line}`, borderRadius: radius.md, color: C.text, fontSize: 13.5, fontFamily: font.mono, outline: "none" }} />
            <p style={{ color: C.muted, fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>{DEST_HINT[routeKind as DestKind]}</p>
          </div>
        )}
      </Group>
      {live ? (
        routeDirty && (
          <div style={{ padding: "0 20px 16px" }}>
            <button onClick={saveRouting} disabled={savingRoute} style={{
              width: "100%", padding: "13px", borderRadius: radius.md, background: gradients.brand, border: "none",
              color: "#fff", fontSize: 14, fontWeight: 800, cursor: savingRoute ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: savingRoute ? 0.7 : 1, fontFamily: font.sans,
            }}>
              {savingRoute && <Loader2 size={16} className="dg-spin" />} Save call routing
            </button>
          </div>
        )
      ) : (
        <div style={{ padding: "0 20px 16px", marginTop: -8 }}>
          <p style={{ color: C.faint, fontSize: 11.5 }}>Call routing is configurable on the live app.</p>
        </div>
      )}

      <Group title="Preferences">
        <Row label="Ringtone" onClick={() => showToast("Ringtone picker coming soon")}>
          <span style={{ color: C.muted, fontSize: 13 }}>{n.settings.ringtone}</span>
          <ChevronRight size={16} color={C.faint} />
        </Row>
        <ToggleRow label="Mute phone number"   on={n.settings.muted}        onClick={() => toggle("muted")} />
        <ToggleRow label="Show calls in recent" on={n.settings.showInRecent} onClick={() => toggle("showInRecent")} />
      </Group>

      <div style={{ padding: "8px 20px 0" }}>
        {!confirmRelease ? (
          <button onClick={() => setConfirmRelease(true)} style={{
            width: "100%", padding: "14px", borderRadius: radius.md, background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)", color: C.red, fontSize: 14, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: font.sans,
          }}>
            <Trash2 size={16} /> Release this number
          </button>
        ) : (
          <div style={{ background: C.card, border: "1px solid rgba(239,68,68,0.3)", borderRadius: radius.lg, padding: 16 }}>
            <p style={{ color: C.text, fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>Release {n.number}?</p>
            <p style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.5, marginBottom: 14 }}>
              This gives the number back to Telnyx and stops its monthly rental. You'll lose any texts &amp; call history on it, and it can't be recovered — you'd have to buy a new number.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={releasing} onClick={() => setConfirmRelease(false)} style={{ flex: 1, padding: "12px", borderRadius: radius.md, background: C.input, border: `1px solid ${C.line}`, color: C.text, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: font.sans }}>Keep number</button>
              <button disabled={releasing} onClick={async () => { setReleasing(true); const ok = await releaseNumber(n.id); setReleasing(false); if (ok) onBack(); else setConfirmRelease(false); }} style={{ flex: 1, padding: "12px", borderRadius: radius.md, background: C.red, border: "none", color: "#fff", fontSize: 13.5, fontWeight: 800, cursor: "pointer", fontFamily: font.sans, opacity: releasing ? 0.7 : 1 }}>{releasing ? "Releasing…" : "Release"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "0 20px 16px" }}>
      <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>{title}</p>
      <div style={{ background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function Row({ label, sub, children, onClick }: { label: string; sub?: string; children?: ReactNode; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderBottom: `1px solid ${C.lineSoft}`, cursor: onClick ? "pointer" : "default" }}>
      <div>
        <p style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{label}</p>
        {sub && <p style={{ color: C.purple, fontSize: 11, marginTop: 2 }}>{sub}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{children}</div>
    </div>
  );
}

function ToggleRow({ label, sub, on, onClick }: { label: string; sub?: string; on: boolean; onClick: () => void }) {
  return (
    <Row label={label} sub={sub}>
      <button onClick={onClick} style={{
        width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer", position: "relative",
        background: on ? gradients.brand : "rgba(120,130,150,0.35)", transition: "background 0.2s",
      }}>
        <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
      </button>
    </Row>
  );
}

const iconBtn: CSSProperties = { width: 36, height: 36, borderRadius: 11, background: C.input, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 };
