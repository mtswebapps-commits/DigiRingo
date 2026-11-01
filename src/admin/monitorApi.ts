/** Control Hub monitoring API (server/monitor.mjs) and small shared helpers. */
import { useEffect, useRef, useState } from "react";
import { getAdminToken } from "./adminAuth";

async function mreq<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const r = await fetch(`/api/admin/monitor/${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j as { error?: string }).error || "Request failed");
  return j as T;
}

export type Level = "info" | "warn" | "error";
export interface OnlineSession { sid: string; userId: number | null; name: string | null; email: string | null; platform: string; form: string; version: string; device: string; ip: string; screen: string; startedAt: number; lastSeen: number; }
export interface FeedEvent { id: number; at: number; userId: number | null; name: string | null; email?: string | null; platform: string; source: string; kind: string; level: Level; title: string; detail?: string | null; route?: string; status: number; ms?: number; }
export interface ProblemUser { userId: number; name: string; email: string; n: number; errors: number; lastAt: number; lastProblem: string; }
export interface LiveData {
  now: number; online: OnlineSession[]; onlineUsers: number;
  active: { dau: number; wau: number; mau: number };
  platforms: { platform: string; n: number }[];
  versions: { platform: string; version: string; n: number }[];
  series: { hour: number; n: number }[];
  errors24h: number; warnings24h: number; affected24h: number; openIssues: number; openErrors: number; signups24h: number;
  problems: ProblemUser[]; feed: FeedEvent[]; requestsHour: number; errors5xxHour: number;
}
export interface IssueRow { id: number; source: string; level: Level; title: string; hits: number; status: string; firstSeen: number; lastSeen: number; users: number; }
export interface IssueDetail {
  issue: Omit<IssueRow, "users"> & { sample: string | null };
  users: { userId: number; name: string; email: string; n: number; lastAt: number }[];
  recent: { id: number; at: number; userId: number | null; name: string | null; platform: string; detail: string | null; route: string; status: number }[];
}
export interface UserReport {
  user: { id: number; name: string; email: string; status: string };
  hours: number; online: boolean; findings: string[];
  problems: { title: string; level: Level; n: number; lastAt: number; detail: string | null }[];
  sessions: { sid: string; platform: string; form: string; version: string; device: string; ip: string; screen: string; ended: number; startedAt: number; lastSeen: number }[];
  calls: { contact: string; direction: string; status: string; duration: string; via: string; at: number }[];
  timeline: FeedEvent[]; truncated: boolean; debugUntil: number | null; text: string;
}
export interface HealthData {
  now: number; bootAt: number; uptimeSec: number; node: string;
  process: { rss: number; heap: number };
  system: { totalMem: number; freeMem: number; load: number[]; cpus: number; disk: { total: number; free: number } | null };
  db: { ok: boolean; ms: number };
  telnyx: { ok: boolean; ms?: number; balance?: number; currency?: string; detail?: string };
  smtp: { ok: boolean; detail?: string };
  jobs: { k: string; label: string; everyMs: number; at: number | null; ok: boolean; detail: string; stale: boolean }[];
  webhooks: { k: string; label: string; at: number | null; ok: boolean | null; detail: string }[];
  requests: { n: number; e5: number; e4: number; p50: number; p95: number; series: { at: number; n: number; errors: number }[] };
  routes: { route: string; n: number; avg: number; max: number; errors: number }[];
  queue: number; alertEmail: string;
}

export const monLive = () => mreq<LiveData>("live");
export const monEvents = (params: Record<string, string>) => mreq<{ events: FeedEvent[] }>(`events?${new URLSearchParams(params)}`);
export const monIssues = (params: Record<string, string>) => mreq<{ issues: IssueRow[] }>(`issues?${new URLSearchParams(params)}`);
export const monIssue = (id: number) => mreq<IssueDetail>(`issue?id=${id}`);
export const monSetIssueStatus = (id: number, status: "open" | "resolved" | "ignored") =>
  mreq<{ ok: boolean }>("issue/status", { method: "POST", body: JSON.stringify({ id, status }) });
export const monUserReport = (id: number, hours: number) => mreq<UserReport>(`user/report?id=${id}&hours=${hours}`);
export const monSetDebug = (userId: number, hours: number) =>
  mreq<{ debugUntil: number | null }>("user/debug", { method: "POST", body: JSON.stringify({ userId, hours }) });
export const monHealth = () => mreq<HealthData>("health");
export const monSaveSettings = (alertEmail: string) =>
  mreq<{ ok: boolean }>("settings", { method: "POST", body: JSON.stringify({ alertEmail }) });

export function timeAgo(ms: number | null | undefined, now = Date.now()): string {
  if (!ms) return "never";
  const s = Math.max(0, Math.round((now - Number(ms)) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
export const fullTime = (ms: number) => new Date(Number(ms)).toLocaleString();
export function duration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  return `${Math.floor(sec / 86400)}d ${Math.floor((sec % 86400) / 3600)}h`;
}
export const gb = (b: number) => `${(b / 1024 ** 3).toFixed(1)} GB`;
export const PLATFORM_LABEL: Record<string, string> = { web: "Web", pwa: "Web app (PWA)", android: "Android", ios: "iOS" };

/** Calls `load` now and every `ms` while the tab is visible. */
export function usePolling<T>(load: () => Promise<T>, ms: number, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadRef = useRef(load);
  loadRef.current = load;
  const tick = useRef(() => {});
  tick.current = () => { loadRef.current().then((d) => { setData(d); setError(null); }).catch((e) => setError(e instanceof Error ? e.message : "Could not load")); };
  useEffect(() => {
    tick.current();
    const t = setInterval(() => { if (!document.hidden) tick.current(); }, ms);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, ...deps]);
  return { data, error, refresh: () => tick.current() };
}
