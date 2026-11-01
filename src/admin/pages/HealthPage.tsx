import { useEffect, useState, type ReactNode } from "react";
import { A, Badge, Button, Card, Input, PageHeader, Table, Td } from "../ui";
import { duration, gb, monHealth, monSaveSettings, timeAgo, usePolling } from "../monitorApi";

/** Is everything we depend on working? Refreshes every 20s. */
export function HealthPage({ toast }: { toast: (m: string) => void }) {
  const { data: d, error } = usePolling(monHealth, 20_000);
  const [email, setEmail] = useState("");
  useEffect(() => { if (d && !email) setEmail(d.alertEmail); }, [d, email]);

  const save = async () => {
    try { await monSaveSettings(email); toast("Alert email saved"); }
    catch (e) { toast(e instanceof Error ? e.message : "Could not save"); }
  };

  if (!d) return <div><PageHeader title="System health" subtitle={error ?? "Checking…"} /></div>;
  const memUsed = 1 - d.system.freeMem / d.system.totalMem;
  const diskUsed = d.system.disk ? 1 - d.system.disk.free / d.system.disk.total : 0;
  const lowBalance = d.telnyx.ok && (d.telnyx.balance ?? 0) < 10;

  return (
    <div>
      <PageHeader title="System health" subtitle={error ?? `Server up for ${duration(d.uptimeSec)} (last restart ${timeAgo(d.bootAt, d.now)}). Request numbers below count from that restart.`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 18 }}>
        <Card>
          <Title>Services</Title>
          <Status label="Database" ok={d.db.ok} note={d.db.ok ? `${d.db.ms} ms` : "Not responding"} />
          <Status label="Telnyx API" ok={d.telnyx.ok} warn={lowBalance} note={d.telnyx.ok ? `$${(d.telnyx.balance ?? 0).toFixed(2)} balance${lowBalance ? ", running low" : ""}` : d.telnyx.detail ?? "Not responding"} />
          <Status label="Email (SMTP)" ok={d.smtp.ok} note={d.smtp.ok ? "Connected" : d.smtp.detail ?? "Not working"} />
        </Card>
        <Card>
          <Title>Background jobs</Title>
          {d.jobs.map((j) => <Status key={j.k} label={j.label} ok={j.ok} warn={j.stale} note={j.at ? `${timeAgo(j.at, d.now)}${j.detail ? `: ${j.detail}` : ""}` : "Not run yet"} />)}
        </Card>
        <Card>
          <Title>Webhooks, last received</Title>
          {d.webhooks.map((w) => <Status key={w.k} label={w.label} ok={w.ok !== false} idle={w.ok === null} note={w.at ? `${timeAgo(w.at, d.now)}${w.detail ? `: ${w.detail}` : ""}` : "None received yet"} />)}
        </Card>
        <Card>
          <Title>Server</Title>
          <Meter label="Memory" pct={memUsed} note={`${gb(d.system.totalMem - d.system.freeMem)} of ${gb(d.system.totalMem)}`} />
          {d.system.disk && <Meter label="Disk" pct={diskUsed} note={`${gb(d.system.disk.total - d.system.disk.free)} of ${gb(d.system.disk.total)}`} />}
          <Meter label="CPU load" pct={Math.min(1, d.system.load[0] / d.system.cpus)} note={`${d.system.load[0].toFixed(2)} on ${d.system.cpus} cores`} />
        </Card>
        <Card>
          <Title>Requests, last hour</Title>
          <Fact label="Requests" value={d.requests.n.toLocaleString()} />
          <Fact label="Server errors (5xx)" value={String(d.requests.e5)} bad={d.requests.e5 > 0} />
          <Fact label="Refused (4xx)" value={String(d.requests.e4)} />
          <Fact label="Typical response time" value={`${d.requests.p50} ms`} />
          <Fact label="Slowest 5% take over" value={`${d.requests.p95} ms`} />
        </Card>
        <Card>
          <Title>Email alerts</Title>
          <p style={{ color: A.muted, fontSize: 12.5, marginBottom: 12 }}>New errors are emailed here, at most once every 5 minutes.</p>
          <Input label="Send alerts to" value={email} onChange={setEmail} placeholder="you@company.com" />
          <Button size="sm" onClick={save}>Save</Button>
        </Card>
      </div>

      <Card pad={0}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${A.line}` }}><Title>Slowest API routes since restart</Title></div>
        <Table head={["Route", "Calls", "Average", "Slowest", "Errors"]}>
          {d.routes.length === 0 ? <tr><td colSpan={5} style={{ color: A.muted, textAlign: "center", padding: "24px 0", fontSize: 13.5 }}>No requests yet.</td></tr> : d.routes.map((r) => (
            <tr key={r.route}>
              <Td style={{ fontFamily: "monospace", fontSize: 12.5 }}>{r.route}</Td>
              <Td>{r.n}</Td><Td>{r.avg} ms</Td><Td>{r.max} ms</Td>
              <Td style={{ color: r.errors ? A.red : A.muted, fontWeight: r.errors ? 700 : 400 }}>{r.errors}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

const Title = ({ children }: { children: ReactNode }) => <p style={{ color: A.text, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{children}</p>;

function Status({ label, ok, warn, idle, note }: { label: string; ok: boolean; warn?: boolean; idle?: boolean; note: string }) {
  const tone = !ok ? "red" : warn ? "amber" : idle ? "muted" : "green";
  const word = !ok ? "Problem" : warn ? "Check" : idle ? "Idle" : "OK";
  return (
    <div style={{ padding: "8px 0", borderBottom: `1px solid ${A.lineSoft}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <span style={{ color: A.text, fontSize: 13.5 }}>{label}</span><Badge tone={tone}>{word}</Badge>
      </div>
      <p style={{ color: A.muted, fontSize: 12, marginTop: 2 }}>{note}</p>
    </div>
  );
}

function Fact({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${A.lineSoft}`, fontSize: 13.5 }}>
      <span style={{ color: A.muted }}>{label}</span><span style={{ color: bad ? A.red : A.text, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function Meter({ label, pct, note }: { label: string; pct: number; note: string }) {
  const color = pct > 0.9 ? A.red : pct > 0.75 ? A.amber : A.green;
  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
        <span style={{ color: A.text }}>{label}</span><span style={{ color: A.muted }}>{note}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: A.lineSoft, overflow: "hidden" }}>
        <div style={{ width: `${Math.round(pct * 100)}%`, height: "100%", background: color }} />
      </div>
    </div>
  );
}
