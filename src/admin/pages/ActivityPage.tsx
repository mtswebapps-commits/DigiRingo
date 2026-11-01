import { useState } from "react";
import { Search } from "lucide-react";
import { A, Badge, Card, PageHeader, Table, Td } from "../ui";
import { fullTime, monEvents, timeAgo, usePolling, PLATFORM_LABEL, type FeedEvent } from "../monitorApi";
import { UserDiagnostics, levelTone } from "./UserDiagnostics";

const KINDS: Record<string, string> = { action: "Actions", account: "Account", call: "Calls", security: "Logins & security", admin: "Team actions", api: "Refused requests", screen: "Screens opened", ui_error: "Errors users saw", js_error: "App crashes", network: "Connection" };

/** Everything people did, searchable, including what the team did in this panel. */
export function ActivityPage({ toast }: { toast: (m: string) => void }) {
  const [kind, setKind] = useState("");
  const [level, setLevel] = useState("");
  const [platform, setPlatform] = useState("");
  const [q, setQ] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const params = { ...(kind ? { kind } : {}), ...(level ? { level } : {}), ...(platform ? { platform } : {}), ...(q.trim() ? { q: q.trim() } : {}) };
  const { data, error } = usePolling(() => monEvents(params), 15_000, [kind, level, platform, q]);

  return (
    <div>
      <PageHeader title="Activity" subtitle={error ?? "Who did what and when. Search by name, email or what happened."} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220, maxWidth: 360 }}>
          <Search size={14} color={A.muted} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email or event" style={{ width: "100%", padding: "8px 12px 8px 32px", background: A.panelAlt, border: `1px solid ${A.line}`, borderRadius: 10, color: A.text, fontSize: 13, outline: "none" }} />
        </div>
        <select value={kind} onChange={(e) => setKind(e.target.value)} style={selectStyle}>
          <option value="">All activity</option>
          {Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} style={selectStyle}>
          <option value="">Any severity</option><option value="error">Errors</option><option value="warn">Warnings</option><option value="info">Normal</option>
        </select>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={selectStyle}>
          <option value="">Any platform</option>
          {Object.entries(PLATFORM_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <Card pad={0}>
        <Table head={["When", "Who", "What", "Where"]}>
          {!data ? <tr><td colSpan={4} style={emptyStyle}>Loading…</td></tr>
            : data.events.length === 0 ? <tr><td colSpan={4} style={emptyStyle}>Nothing matches.</td></tr>
            : data.events.map((e: FeedEvent) => (
              <tr key={e.id} onClick={() => setOpen(open === e.id ? null : e.id)} style={{ cursor: e.detail ? "pointer" : "default" }}>
                <Td style={{ color: A.muted, whiteSpace: "nowrap", fontSize: 12.5 }}><span title={fullTime(e.at)}>{timeAgo(e.at)}</span></Td>
                <Td>{e.userId
                  ? <span onClick={(ev) => { ev.stopPropagation(); setUserId(e.userId); }} style={{ fontWeight: 600, cursor: "pointer" }}>{e.name || `User ${e.userId}`}<div style={{ color: A.muted, fontSize: 12, fontWeight: 400 }}>{e.email}</div></span>
                  : <span style={{ color: A.muted }}>{e.source === "admin" ? "Team" : e.source === "server" ? "Server" : "Visitor"}</span>}</Td>
                <Td style={{ wordBreak: "break-word", maxWidth: 520 }}>
                  {e.level !== "info" && <span style={{ marginRight: 7 }}><Badge tone={levelTone(e.level)}>{e.level}</Badge></span>}
                  {e.title}
                  {open === e.id && e.detail && <pre style={{ color: A.muted, fontSize: 11.5, whiteSpace: "pre-wrap", wordBreak: "break-word", marginTop: 6, fontFamily: "monospace" }}>{e.detail}</pre>}
                </Td>
                <Td style={{ color: A.muted, fontSize: 12.5 }}>{PLATFORM_LABEL[e.platform] ?? e.source}</Td>
              </tr>
            ))}
        </Table>
      </Card>
      {userId != null && <UserDiagnostics userId={userId} toast={toast} onClose={() => setUserId(null)} />}
    </div>
  );
}

const selectStyle = { padding: "8px 10px", background: A.panelAlt, color: A.text, border: `1px solid ${A.line}`, borderRadius: 10, fontSize: 13 };
const emptyStyle = { color: A.muted, textAlign: "center" as const, padding: "28px 0", fontSize: 13.5 };
