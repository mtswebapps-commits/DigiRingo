import { useState } from "react";
import { Activity, AlertTriangle, Globe, Smartphone, UserPlus, Users } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { A, Badge, Card, PageHeader, StatCard, Table, Td } from "../ui";
import { monLive, timeAgo, usePolling, PLATFORM_LABEL, duration } from "../monitorApi";
import { UserDiagnostics, levelTone } from "./UserDiagnostics";

/** Right now: who is online, on what, and who is having trouble. Refreshes every 10s. */
export function LivePage({ toast, onOpenIssues }: { toast: (m: string) => void; onOpenIssues: () => void }) {
  const { data, error } = usePolling(monLive, 10_000);
  const [userId, setUserId] = useState<number | null>(null);
  const d = data;

  const onlineBy = (p: string) => d?.online.filter((o) => o.platform === p).length ?? 0;
  const webNow = onlineBy("web") + onlineBy("pwa");
  const appNow = onlineBy("android") + onlineBy("ios");
  const series = (d?.series ?? []).map((s) => ({ t: new Date(s.hour).toLocaleTimeString([], { hour: "2-digit" }), users: s.n }));
  const link = { color: A.text, cursor: "pointer", fontWeight: 600 };

  return (
    <div>
      <PageHeader title="Live" subtitle={error ? `Could not refresh: ${error}` : "Who is using DIGIRINGO right now. Refreshes every 10 seconds."} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 18 }}>
        <StatCard label={d ? `Online now (${d.onlineUsers} signed in)` : "Online now"} value={d ? String(d.online.length) : "…"} accent={A.green} icon={<Activity size={20} color={A.green} />} />
        <StatCard label="On web now" value={d ? String(webNow) : "…"} accent={A.blue} icon={<Globe size={20} color={A.blue} />} />
        <StatCard label="In mobile app now" value={d ? String(appNow) : "…"} accent={A.purple} icon={<Smartphone size={20} color={A.purple} />} />
        <StatCard label="Active users today / 7d / 30d" value={d ? `${d.active.dau} / ${d.active.wau} / ${d.active.mau}` : "…"} accent={A.blue} icon={<Users size={20} color={A.blue} />} />
        <StatCard label="New signups (24h)" value={d ? String(d.signups24h) : "…"} accent={A.green} icon={<UserPlus size={20} color={A.green} />} />
        <div onClick={onOpenIssues} style={{ cursor: "pointer" }}>
          <StatCard label="Open issues · click to view" value={d ? String(d.openIssues) : "…"} accent={A.red} icon={<AlertTriangle size={20} color={A.red} />} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: 14, marginBottom: 18 }}>
        <Card>
          <p style={{ color: A.text, fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Active users per hour, last 24 hours</p>
          {series.length === 0 ? <div style={{ height: 200, display: "grid", placeItems: "center", color: A.muted, fontSize: 13 }}>Starts filling in as people use the app.</div> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={series} margin={{ left: -22, right: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={A.lineSoft} vertical={false} />
                <XAxis dataKey="t" stroke={A.faint} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={A.faint} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: A.panelAlt, border: `1px solid ${A.line}`, borderRadius: 10, color: A.text, fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke={A.blue} fill={A.blue} fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card>
          <p style={{ color: A.text, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Last 24 hours</p>
          <Row label="Errors" value={d?.errors24h ?? 0} bad />
          <Row label="Warnings" value={d?.warnings24h ?? 0} />
          <Row label="Users who hit a problem" value={d?.affected24h ?? 0} />
          <p style={{ color: A.muted, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, margin: "14px 0 6px" }}>Versions in use (7 days)</p>
          {(d?.versions ?? []).length === 0 ? <p style={{ color: A.muted, fontSize: 13 }}>No data yet.</p> : d!.versions.slice(0, 5).map((v) => (
            <div key={`${v.platform}${v.version}`} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "3px 0" }}>
              <span style={{ color: A.muted }}>{PLATFORM_LABEL[v.platform] ?? v.platform} {v.version}</span><span style={{ color: A.text, fontWeight: 700 }}>{v.n}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card pad={0} style={{ marginBottom: 18 }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${A.line}` }}>
          <p style={{ color: A.text, fontSize: 15, fontWeight: 700 }}>Who is having problems (24h)</p>
        </div>
        <Table head={["User", "Problems", "Latest problem", "When"]}>
          {(d?.problems ?? []).length === 0 ? (
            <tr><td colSpan={4} style={{ color: A.muted, textAlign: "center", padding: "24px 0", fontSize: 13.5 }}>No user has hit a problem in the last 24 hours.</td></tr>
          ) : d!.problems.map((p) => (
            <tr key={p.userId}>
              <Td><span onClick={() => setUserId(p.userId)} style={link}>{p.name}</span><div style={{ color: A.muted, fontSize: 12 }}>{p.email}</div></Td>
              <Td><Badge tone={p.errors ? "red" : "amber"}>{p.errors ? `${p.errors} errors` : `${p.n} warnings`}</Badge></Td>
              <Td style={{ color: A.muted, maxWidth: 420, wordBreak: "break-word" }}>{p.lastProblem}</Td>
              <Td style={{ color: A.muted, whiteSpace: "nowrap" }}>{timeAgo(p.lastAt, d!.now)}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card pad={0} style={{ marginBottom: 18 }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${A.line}` }}>
          <p style={{ color: A.text, fontSize: 15, fontWeight: 700 }}>Online now ({d?.online.length ?? 0})</p>
        </div>
        <Table head={["User", "On", "Device", "Screen", "Version", "IP", "For"]}>
          {(d?.online ?? []).length === 0 ? (
            <tr><td colSpan={7} style={{ color: A.muted, textAlign: "center", padding: "24px 0", fontSize: 13.5 }}>Nobody has the app open right now.</td></tr>
          ) : d!.online.map((o) => (
            <tr key={o.sid}>
              <Td>{o.userId ? <><span onClick={() => setUserId(o.userId)} style={link}>{o.name}</span><div style={{ color: A.muted, fontSize: 12 }}>{o.email}</div></> : <span style={{ color: A.muted }}>Not signed in</span>}</Td>
              <Td><Badge tone={o.platform === "android" || o.platform === "ios" ? "purple" : "blue"}>{PLATFORM_LABEL[o.platform] ?? o.platform}</Badge></Td>
              <Td style={{ color: A.muted, fontSize: 12.5 }}>{o.device}</Td>
              <Td style={{ textTransform: "capitalize" }}>{o.screen || "—"}</Td>
              <Td style={{ color: A.muted, fontSize: 12.5 }}>{o.version}</Td>
              <Td style={{ color: A.muted, fontFamily: "monospace", fontSize: 12 }}>{o.ip}</Td>
              <Td style={{ color: A.muted, whiteSpace: "nowrap" }}>{duration(Math.round((d!.now - o.startedAt) / 1000))}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card pad={0}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${A.line}` }}>
          <p style={{ color: A.text, fontSize: 15, fontWeight: 700 }}>Happening now</p>
        </div>
        <div style={{ padding: "6px 20px 14px" }}>
          {(d?.feed ?? []).length === 0 ? <p style={{ color: A.muted, fontSize: 13, padding: "16px 0" }}>Nothing recorded yet.</p> : d!.feed.map((e) => (
            <div key={e.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${A.lineSoft}`, fontSize: 13 }}>
              <span style={{ color: A.faint, fontSize: 11.5, width: 62, flexShrink: 0 }}>{timeAgo(e.at, d!.now)}</span>
              {e.level !== "info" && <Badge tone={levelTone(e.level)}>{e.level}</Badge>}
              {e.userId ? <span onClick={() => setUserId(e.userId)} style={link}>{e.name || `User ${e.userId}`}</span> : <span style={{ color: A.muted }}>{e.source === "server" ? "Server" : "Visitor"}</span>}
              <span style={{ color: A.muted, wordBreak: "break-word" }}>{e.title}</span>
            </div>
          ))}
        </div>
      </Card>

      {userId != null && <UserDiagnostics userId={userId} toast={toast} onClose={() => setUserId(null)} />}
    </div>
  );
}

function Row({ label, value, bad }: { label: string; value: number; bad?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${A.lineSoft}`, fontSize: 13.5 }}>
      <span style={{ color: A.muted }}>{label}</span>
      <span style={{ color: bad && value ? A.red : A.text, fontWeight: 700 }}>{value}</span>
    </div>
  );
}
