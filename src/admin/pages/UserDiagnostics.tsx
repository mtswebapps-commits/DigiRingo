import { useCallback, useEffect, useMemo, useState } from "react";
import { X, Download, Copy, RefreshCw, Radio } from "lucide-react";
import { A, Badge, Button, Card, font } from "../ui";
import { fullTime, monSetDebug, monUserReport, timeAgo, PLATFORM_LABEL, type FeedEvent, type Level, type UserReport } from "../monitorApi";

const RANGES = [{ h: 1, label: "1 hour" }, { h: 6, label: "6 hours" }, { h: 24, label: "24 hours" }, { h: 72, label: "3 days" }, { h: 168, label: "7 days" }];
export const levelTone = (l: Level) => (l === "error" ? "red" : l === "warn" ? "amber" : "muted") as "red" | "amber" | "muted";

/** One user's full picture, for checking a complaint: what really happened and when. */
export function UserDiagnostics({ userId, toast, onClose }: { userId: number; toast: (m: string) => void; onClose: () => void }) {
  const [hours, setHours] = useState(24);
  const [report, setReport] = useState<UserReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [only, setOnly] = useState<"all" | "problems" | "logs">("all");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true); setErr("");
    monUserReport(userId, hours).then(setReport).catch((e) => setErr(e instanceof Error ? e.message : "Could not load")).finally(() => setLoading(false));
  }, [userId, hours]);
  useEffect(load, [load]);

  const events = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (report?.timeline ?? []).filter((e) => {
      if (only === "problems" && (e.level === "info" || e.kind === "debug")) return false;
      if (only === "logs" && e.kind !== "debug") return false;
      return !needle || `${e.title} ${e.detail ?? ""} ${e.route ?? ""}`.toLowerCase().includes(needle);
    });
  }, [report, q, only]);

  const toggleLogs = async () => {
    if (!report) return;
    setBusy(true);
    try {
      const r = await monSetDebug(userId, report.debugUntil ? 0 : 24);
      setReport({ ...report, debugUntil: r.debugUntil });
      toast(r.debugUntil ? "Detailed logs on for 24 hours" : "Detailed logs off");
    } catch (e) { toast(e instanceof Error ? e.message : "Could not change that"); } finally { setBusy(false); }
  };
  const download = () => {
    if (!report) return;
    const url = URL.createObjectURL(new Blob([report.text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `digiringo-logs-user-${userId}-${hours}h.txt`; a.click();
    URL.revokeObjectURL(url);
  };
  const copy = () => { if (report) navigator.clipboard.writeText(report.text).then(() => toast("Report copied"), () => toast("Could not copy")); };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "flex-end" }}>
      <div style={{ width: "100%", maxWidth: 780, height: "100%", overflowY: "auto", background: A.shell, borderLeft: `1px solid ${A.line}`, padding: 24, fontFamily: font.sans }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ color: A.text, fontSize: 19, fontWeight: 800 }}>{report?.user.name ?? "Diagnostics"}</p>
            <p style={{ color: A.muted, fontSize: 13, marginTop: 3 }}>{report?.user.email}{report ? ` · user #${report.user.id}` : ""}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} color={A.muted} /></button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
          <select value={hours} onChange={(e) => setHours(Number(e.target.value))} style={{ padding: "8px 10px", background: A.panelAlt, color: A.text, border: `1px solid ${A.line}`, borderRadius: 10, fontSize: 13 }}>
            {RANGES.map((r) => <option key={r.h} value={r.h}>Last {r.label}</option>)}
          </select>
          <Button size="sm" variant="ghost" onClick={load}><RefreshCw size={13} /> Refresh</Button>
          <Button size="sm" variant="ghost" onClick={download}><Download size={13} /> Download logs</Button>
          <Button size="sm" variant="ghost" onClick={copy}><Copy size={13} /> Copy</Button>
        </div>

        {err && <p style={{ color: A.red, fontSize: 13, marginBottom: 12 }}>{err}</p>}
        {loading && !report && <p style={{ color: A.muted, fontSize: 13 }}>Loading…</p>}

        {report && (
          <>
            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Badge tone={report.online ? "green" : "muted"}>{report.online ? "Online" : "Offline"}</Badge>
                <Badge tone={report.user.status === "active" ? "muted" : "red"}>{report.user.status}</Badge>
              </div>
              {report.findings.map((f) => <p key={f} style={{ color: A.text, fontSize: 13.5, padding: "3px 0" }}>{f}</p>)}
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <p style={{ color: A.text, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}><Radio size={15} color={report.debugUntil ? A.green : A.muted} /> Detailed logs from this user's app</p>
                  <p style={{ color: A.muted, fontSize: 12.5, marginTop: 4 }}>
                    {report.debugUntil
                      ? `On until ${fullTime(report.debugUntil)}. Logs arrive while the user has the app open. Ask them to repeat the problem.`
                      : "Turn on when someone reports a problem you can't see here. The user doesn't need to do anything except use the app."}
                  </p>
                </div>
                <Button size="sm" variant={report.debugUntil ? "danger" : "primary"} onClick={toggleLogs}>{busy ? "…" : report.debugUntil ? "Turn off" : "Request logs (24h)"}</Button>
              </div>
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <p style={{ color: A.text, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Problems ({report.problems.length})</p>
              {report.problems.length === 0 ? <p style={{ color: A.muted, fontSize: 13 }}>Nothing went wrong for this user in this period.</p> : report.problems.map((p) => (
                <div key={p.title} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${A.lineSoft}` }}>
                  <Badge tone={levelTone(p.level)}>{p.n}×</Badge>
                  <span style={{ color: A.text, fontSize: 13, flex: 1, wordBreak: "break-word" }}>{p.title}</span>
                  <span style={{ color: A.faint, fontSize: 11.5, whiteSpace: "nowrap" }}>{timeAgo(p.lastAt)}</span>
                </div>
              ))}
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <p style={{ color: A.text, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Devices ({report.sessions.length})</p>
              {report.sessions.length === 0 ? <p style={{ color: A.muted, fontSize: 13 }}>No app sessions in this period.</p> : report.sessions.map((s) => (
                <div key={s.sid} style={{ padding: "7px 0", borderBottom: `1px solid ${A.lineSoft}` }}>
                  <p style={{ color: A.text, fontSize: 13 }}>{PLATFORM_LABEL[s.platform] ?? s.platform} · {s.device || "Unknown device"}</p>
                  <p style={{ color: A.muted, fontSize: 12, marginTop: 2 }}>Version {s.version || "?"} · IP {s.ip} · last on {s.screen || "?"} · {timeAgo(s.lastSeen)}</p>
                </div>
              ))}
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <p style={{ color: A.text, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Calls ({report.calls.length})</p>
              {report.calls.length === 0 ? <p style={{ color: A.muted, fontSize: 13 }}>No calls in this period.</p> : report.calls.slice(0, 30).map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: `1px solid ${A.lineSoft}`, fontSize: 12.5 }}>
                  <span style={{ color: A.muted, width: 70, textTransform: "capitalize" }}>{c.direction}</span>
                  <span style={{ color: A.text, fontFamily: "monospace", flex: 1 }}>{c.contact}</span>
                  <span style={{ color: A.muted }}>{c.status} {c.duration}</span>
                  <span style={{ color: A.faint, whiteSpace: "nowrap" }}>{timeAgo(c.at)}</span>
                </div>
              ))}
            </Card>

            <Card>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                <p style={{ color: A.text, fontSize: 14, fontWeight: 700, marginRight: "auto" }}>Timeline</p>
                {(["all", "problems", "logs"] as const).map((o) => (
                  <button key={o} onClick={() => setOnly(o)} style={{ padding: "6px 11px", borderRadius: 9, border: `1px solid ${A.line}`, cursor: "pointer", background: only === o ? "rgba(124,92,255,0.18)" : A.panelAlt, color: only === o ? A.blue : A.muted, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{o}</button>
                ))}
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search, e.g. call or payment" style={{ padding: "7px 11px", background: A.panelAlt, border: `1px solid ${A.line}`, borderRadius: 9, color: A.text, fontSize: 12.5, outline: "none", width: 190 }} />
              </div>
              {events.length === 0 ? <p style={{ color: A.muted, fontSize: 13 }}>Nothing matches.</p> : events.map((e) => <TimelineRow key={e.id} e={e} />)}
              {report.truncated && <p style={{ color: A.faint, fontSize: 12, marginTop: 10 }}>Showing the latest 500. The downloaded file has up to 3,000.</p>}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function TimelineRow({ e }: { e: FeedEvent }) {
  const [open, setOpen] = useState(false);
  const color = e.level === "error" ? A.red : e.level === "warn" ? A.amber : A.text;
  return (
    <div onClick={() => e.detail && setOpen(!open)} style={{ padding: "7px 0", borderBottom: `1px solid ${A.lineSoft}`, cursor: e.detail ? "pointer" : "default" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
        <span title={fullTime(e.at)} style={{ color: A.faint, fontSize: 11.5, width: 136, flexShrink: 0, fontFamily: "monospace" }}>{new Date(Number(e.at)).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
        <span style={{ color, fontSize: 13, flex: 1, wordBreak: "break-word" }}>{e.title}{e.status ? <span style={{ color: A.faint }}> [{e.status}]</span> : null}</span>
        <span style={{ color: A.faint, fontSize: 11 }}>{e.platform || e.source}</span>
      </div>
      {open && <pre style={{ color: A.muted, fontSize: 11.5, whiteSpace: "pre-wrap", wordBreak: "break-word", marginTop: 6, marginLeft: 146, fontFamily: "monospace" }}>{e.detail}</pre>}
    </div>
  );
}
