import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { A, Badge, Button, Card, PageHeader, Table, Td, font } from "../ui";
import { fullTime, monIssue, monIssues, monSetIssueStatus, timeAgo, usePolling, type IssueDetail } from "../monitorApi";
import { UserDiagnostics, levelTone } from "./UserDiagnostics";

const SOURCES: Record<string, string> = { server: "Server", client: "App", telephony: "Calls & SMS", account: "Account", admin: "Control Hub" };
const STATUSES = [{ id: "open", label: "Open" }, { id: "resolved", label: "Resolved" }, { id: "ignored", label: "Ignored" }];

/** Errors grouped by what went wrong, with how many people each one hit. */
export function IssuesPage({ toast }: { toast: (m: string) => void }) {
  const [status, setStatus] = useState("open");
  const [source, setSource] = useState("");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const { data, error, refresh } = usePolling(
    () => monIssues({ status, ...(source ? { source } : {}), ...(q.trim() ? { q: q.trim() } : {}) }), 15_000, [status, source, q]);

  return (
    <div>
      <PageHeader title="Issues" subtitle={error ?? "Everything going wrong, grouped. A resolved issue reopens by itself if it happens again."} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
        {STATUSES.map((s) => <Chip key={s.id} on={status === s.id} onClick={() => setStatus(s.id)}>{s.label}</Chip>)}
        <select value={source} onChange={(e) => setSource(e.target.value)} style={selectStyle}>
          <option value="">All sources</option>
          {Object.entries(SOURCES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 340 }}>
          <Search size={14} color={A.muted} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search issues" style={{ width: "100%", padding: "8px 12px 8px 32px", background: A.panelAlt, border: `1px solid ${A.line}`, borderRadius: 10, color: A.text, fontSize: 13, outline: "none" }} />
        </div>
      </div>
      <Card pad={0}>
        <Table head={["Severity", "Problem", "From", "Times", "Users", "First seen", "Last seen"]}>
          {!data ? <tr><td colSpan={7} style={emptyStyle}>Loading…</td></tr>
            : data.issues.length === 0 ? <tr><td colSpan={7} style={emptyStyle}>{status === "open" ? "No open issues." : "Nothing here."}</td></tr>
            : data.issues.map((i) => (
              <tr key={i.id} onClick={() => setOpenId(i.id)} style={{ cursor: "pointer" }}>
                <Td><Badge tone={levelTone(i.level)}>{i.level}</Badge></Td>
                <Td style={{ maxWidth: 460, wordBreak: "break-word", fontWeight: 600 }}>{i.title}</Td>
                <Td style={{ color: A.muted }}>{SOURCES[i.source] ?? i.source}</Td>
                <Td style={{ fontWeight: 700 }}>{i.hits}</Td>
                <Td>{i.users}</Td>
                <Td style={{ color: A.muted, whiteSpace: "nowrap" }}>{timeAgo(i.firstSeen)}</Td>
                <Td style={{ color: A.muted, whiteSpace: "nowrap" }}>{timeAgo(i.lastSeen)}</Td>
              </tr>
            ))}
        </Table>
      </Card>
      {openId != null && <IssueDrawer id={openId} toast={toast} onClose={() => setOpenId(null)} onChanged={refresh} />}
    </div>
  );
}

function IssueDrawer({ id, toast, onClose, onChanged }: { id: number; toast: (m: string) => void; onClose: () => void; onChanged: () => void }) {
  const [d, setD] = useState<IssueDetail | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  useEffect(() => { monIssue(id).then(setD).catch((e) => toast(e instanceof Error ? e.message : "Could not load")); }, [id, toast]);

  const setStatus = async (status: "open" | "resolved" | "ignored") => {
    try { await monSetIssueStatus(id, status); toast(`Marked as ${status}`); onChanged(); onClose(); }
    catch (e) { toast(e instanceof Error ? e.message : "Could not update"); }
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "flex-end" }}>
      <div style={{ width: "100%", maxWidth: 680, height: "100%", overflowY: "auto", background: A.shell, borderLeft: `1px solid ${A.line}`, padding: 24, fontFamily: font.sans }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <p style={{ color: A.text, fontSize: 17, fontWeight: 800, wordBreak: "break-word" }}>{d?.issue.title ?? "Loading…"}</p>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", height: 24 }}><X size={20} color={A.muted} /></button>
        </div>
        {d && (
          <>
            <p style={{ color: A.muted, fontSize: 13, marginBottom: 14 }}>{d.issue.hits} times · {d.users.length} users · first {fullTime(d.issue.firstSeen)} · last {fullTime(d.issue.lastSeen)}</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {d.issue.status !== "resolved" && <Button size="sm" onClick={() => setStatus("resolved")}>Mark resolved</Button>}
              {d.issue.status !== "ignored" && <Button size="sm" variant="ghost" onClick={() => setStatus("ignored")}>Ignore</Button>}
              {d.issue.status !== "open" && <Button size="sm" variant="ghost" onClick={() => setStatus("open")}>Reopen</Button>}
            </div>
            {d.issue.sample && (
              <Card style={{ marginBottom: 14 }}>
                <p style={{ color: A.text, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Details</p>
                <pre style={{ color: A.muted, fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "monospace" }}>{d.issue.sample}</pre>
              </Card>
            )}
            <Card style={{ marginBottom: 14 }}>
              <p style={{ color: A.text, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Who it happened to</p>
              {d.users.length === 0 ? <p style={{ color: A.muted, fontSize: 13 }}>Not tied to a signed-in user.</p> : d.users.map((u) => (
                <div key={u.userId} onClick={() => setUserId(u.userId)} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "7px 0", borderBottom: `1px solid ${A.lineSoft}`, cursor: "pointer", fontSize: 13 }}>
                  <span style={{ color: A.text, fontWeight: 600 }}>{u.name} <span style={{ color: A.muted, fontWeight: 400 }}>{u.email}</span></span>
                  <span style={{ color: A.muted, whiteSpace: "nowrap" }}>{u.n}× · {timeAgo(u.lastAt)}</span>
                </div>
              ))}
            </Card>
            <Card>
              <p style={{ color: A.text, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Latest occurrences</p>
              {d.recent.map((r) => (
                <div key={r.id} style={{ padding: "7px 0", borderBottom: `1px solid ${A.lineSoft}`, fontSize: 12.5 }}>
                  <span style={{ color: A.faint }}>{fullTime(r.at)}</span> <span style={{ color: A.text }}>{r.name ?? ""}</span> <span style={{ color: A.muted }}>{r.platform} {r.route}</span>
                </div>
              ))}
            </Card>
          </>
        )}
      </div>
      {userId != null && <UserDiagnostics userId={userId} toast={toast} onClose={() => setUserId(null)} />}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return <button onClick={onClick} style={{ padding: "8px 13px", borderRadius: 10, border: `1px solid ${A.line}`, cursor: "pointer", background: on ? "rgba(124,92,255,0.18)" : A.panelAlt, color: on ? A.blue : A.muted, fontSize: 13, fontWeight: 600 }}>{children}</button>;
}
const selectStyle = { padding: "8px 10px", background: A.panelAlt, color: A.text, border: `1px solid ${A.line}`, borderRadius: 10, fontSize: 13 };
const emptyStyle = { color: A.muted, textAlign: "center" as const, padding: "28px 0", fontSize: 13.5 };
