/**
 * Client side of the Control Hub's monitoring (see server/monitor.mjs).
 *
 * While the app is visible it sends a small heartbeat every 30s: who is online,
 * on which platform and version, on which screen, plus any queued events. Errors
 * go out straight away. Nothing here may ever break the app, so every path swallows
 * its own failures.
 *
 * Never sent: message text, passwords, tokens, what the user types.
 *
 * When support asks for logs from a user, the beat's reply says `debug: true` and
 * the app also forwards its console output until support's window ends.
 */
import { Capacitor } from "@capacitor/core";
import { API_ORIGIN } from "./origin";
import { getToken } from "./api";

declare const __BUILD_ID__: string;

type Level = "info" | "warn" | "error";
type Kind = "screen" | "action" | "call" | "network" | "ui_error" | "js_error" | "debug";
interface QueuedEvent { k: Kind; l: Level; n: string; d?: string; t: number }

const BEAT_MS = 30_000;
const MAX_QUEUE = 100;
const MAX_DEBUG_PER_BEAT = 40;

let started = false;
let queue: QueuedEvent[] = [];
let screen = "";
let version = "";
let debugOn = false;
let sending = false;
let timer: ReturnType<typeof setTimeout> | null = null;
const rawConsole = { info: console.info, warn: console.warn, error: console.error };

function sessionId(): string {
  const make = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  try {
    let id = sessionStorage.getItem("dg-mon-sid");
    if (!id) { id = make(); sessionStorage.setItem("dg-mon-sid", id); }
    return id;
  } catch { return make(); }
}
const sid = sessionId();

function platform(): string {
  try {
    if (Capacitor.isNativePlatform()) return Capacitor.getPlatform();
    if (window.matchMedia("(display-mode: standalone)").matches) return "pwa";
  } catch { /* fall through */ }
  return "web";
}
const form = () => (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? "mobile" : "desktop");

function enqueue(e: QueuedEvent) {
  if (queue.length >= MAX_QUEUE) queue.shift();
  queue.push(e);
}

/** Sends the heartbeat and everything queued. Failed events stay queued for the next try. */
async function send(ended = false) {
  if (sending) return;
  sending = true;
  const events = queue.slice(0, 60);
  queue = queue.slice(events.length);
  try {
    const token = getToken();
    const r = await fetch(`${API_ORIGIN}/api/monitor/beat`, {
      method: "POST",
      keepalive: true, // lets the last beat survive the tab closing
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ sid, platform: platform(), form: form(), version, screen, ended, events }),
    });
    const j = await r.json().catch(() => ({})) as { debug?: boolean };
    setDebug(!!j.debug);
  } catch {
    queue = events.concat(queue).slice(-MAX_QUEUE);
  } finally { sending = false; }
}

function schedule(ms = BEAT_MS) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    if (!document.hidden) void send();
    schedule();
  }, ms);
}

/** Forward console output while support has asked for this user's logs. */
function setDebug(on: boolean) {
  if (on === debugOn) return;
  debugOn = on;
  if (!on) {
    console.info = rawConsole.info; console.warn = rawConsole.warn; console.error = rawConsole.error;
    return;
  }
  let sent = 0, windowAt = Date.now();
  const wrap = (fn: (...a: unknown[]) => void, l: Level) => (...args: unknown[]) => {
    fn.apply(console, args);
    if (Date.now() - windowAt > BEAT_MS) { sent = 0; windowAt = Date.now(); }
    if (sent++ >= MAX_DEBUG_PER_BEAT) return;
    const text = args.map((a) => { try { return typeof a === "string" ? a : JSON.stringify(a); } catch { return String(a); } }).join(" ");
    enqueue({ k: "debug", l, n: text.slice(0, 190), d: text.length > 190 ? text.slice(0, 1500) : undefined, t: Date.now() });
  };
  console.info = wrap(rawConsole.info, "info");
  console.warn = wrap(rawConsole.warn, "warn");
  console.error = wrap(rawConsole.error, "error");
}

/** Records something that happened; errors are sent right away. */
export function monitorEvent(k: Kind, name: string, detail?: string, level: Level = "info"): void {
  try {
    enqueue({ k, l: level, n: String(name).slice(0, 190), d: detail ? String(detail).slice(0, 1800) : undefined, t: Date.now() });
    if (level === "error" && started) schedule(1500);
  } catch { /* never break the app */ }
}

/** The screen the user is looking on now (Home, Inbox, Wallet…). */
export function monitorScreen(name: string): void {
  if (!name || name === screen) return;
  screen = name;
  monitorEvent("screen", `Opened ${name}`);
}

export function monitorError(error: unknown, where?: string): void {
  const e = error as { message?: string; stack?: string } | null;
  const name = (where ? `${where}: ` : "") + (e?.message || String(error) || "Unknown error");
  monitorEvent("js_error", name, e?.stack, "error");
}

export function startMonitor(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  version = (() => { try { return `web ${__BUILD_ID__}`; } catch { return "web"; } })();
  if (Capacitor.isNativePlatform()) {
    void import("@capacitor/app")
      .then(({ App }) => App.getInfo())
      .then((i) => { version = `${i.version} (${i.build})`; })
      .catch(() => {});
  }
  window.addEventListener("error", (e) => monitorError(e.error ?? e.message));
  window.addEventListener("unhandledrejection", (e) => monitorError(e.reason, "Unhandled"));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) void send(true);       // left the app: not "online" any more
    else { void send(); schedule(); }           // back again
  });
  window.addEventListener("pagehide", () => { void send(true); });
  void send();
  schedule();
}
