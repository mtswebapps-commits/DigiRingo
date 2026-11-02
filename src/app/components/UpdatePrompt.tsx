import { useCallback, useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { gradients, font } from "../core/theme";
import { currentCall, subscribeCall } from "../services/voice";
import { monitorEvent } from "../services/monitor";

/**
 * Tells Android users when a newer version is live on Google Play.
 *
 * Normal update: "Update now" asks Play once, downloads while the app stays usable,
 * then installs by itself the next time the user leaves the app (or at once from
 * "Restart now"). "Later" snoozes that version for a day.
 *
 * Required update (released with Play priority 4 or 5, see android-release.yml):
 * no "Later", and Play's full-screen updater runs.
 *
 * Play decides what's available, so this works only on installs from Play. Other
 * installs (debug APK, emulator without Play) make the check fail and nothing shows.
 * Nothing interrupts a call: the popup waits and the install is held back until it ends.
 */

const SNOOZE_MS = 24 * 60 * 60 * 1000;
const SNOOZE_KEY = "dg-update-snooze";
const PACKAGE_NAME = "com.digiringo.app";
const REQUIRED_PRIORITY = 4;

// Same numbers as the plugin's enums, which are only loaded on native.
const AVAILABLE = 2, IN_PROGRESS = 3;
const STATUS_DOWNLOADING = 2, STATUS_FAILED = 5, STATUS_CANCELED = 6, STATUS_DOWNLOADED = 11;
const RESULT_OK = 0, RESULT_CANCELED = 1;

type Phase =
  | { name: "idle" }
  | { name: "available"; required: boolean }
  | { name: "downloading"; percent: number | null }
  | { name: "ready" };

const callInProgress = () => { const c = currentCall(); return !!c && c.phase !== "ended" && c.phase !== "failed"; };
const loadPlugin = () => import("@capawesome/capacitor-app-update").then((m) => m.AppUpdate);

function isSnoozed(code: string | undefined): boolean {
  try {
    const s = JSON.parse(localStorage.getItem(SNOOZE_KEY) || "null") as { code?: string; until?: number } | null;
    return !!s && s.code === code && Date.now() < Number(s.until);
  } catch { return false; }
}

export function UpdatePrompt() {
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [dismissedReady, setDismissedReady] = useState(false);
  const [inCall, setInCall] = useState(callInProgress);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const flexibleAllowed = useRef(false);
  const availableCode = useRef<string | undefined>(undefined);

  const openStore = useCallback(async () => {
    try { await (await loadPlugin()).openAppStore({ androidPackageName: PACKAGE_NAME }); }
    catch (e) { monitorEvent("action", "App update: could not open Play", String(e), "warn"); }
  }, []);

  const check = useCallback(async () => {
    const now = phaseRef.current.name;
    if (now === "downloading" || now === "ready") return;
    try {
      const AppUpdate = await loadPlugin();
      const info = await AppUpdate.getAppUpdateInfo();
      if (info.installStatus === STATUS_DOWNLOADED) { setPhase({ name: "ready" }); return; }
      const required = (info.updatePriority ?? 0) >= REQUIRED_PRIORITY && !!info.immediateUpdateAllowed;
      // A required update the user left half-way: "Update now" can't resume it in-app, so it falls through to the Play page.
      if (info.updateAvailability === IN_PROGRESS && required) { setPhase({ name: "available", required }); return; }
      if (info.updateAvailability !== AVAILABLE) { setPhase({ name: "idle" }); return; }
      flexibleAllowed.current = !!info.flexibleUpdateAllowed;
      availableCode.current = info.availableVersionCode;
      if (!required && isSnoozed(info.availableVersionCode)) return;
      if (now !== "available") monitorEvent("action", `App update offered: ${info.currentVersionCode} to ${info.availableVersionCode}${required ? " (required)" : ""}`);
      setPhase({ name: "available", required });
    } catch { /* not installed from Play, or Play can't answer right now */ }
  }, []);

  // Installing restarts the app, which would cut a call, so never do it during one.
  const install = useCallback(async () => {
    if (callInProgress()) return;
    try { await (await loadPlugin()).completeFlexibleUpdate(); }
    catch (e) { monitorEvent("action", "App update: install failed", String(e), "warn"); }
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const handles: Array<{ remove: () => Promise<void> }> = [];
    let gone = false;
    const keep = (h: { remove: () => Promise<void> }) => { if (gone) void h.remove(); else handles.push(h); };

    const first = setTimeout(() => { void check(); }, 2500); // let the app settle first
    void loadPlugin().then((AppUpdate) => AppUpdate.addListener("onFlexibleUpdateStateChange", (s) => {
      if (s.installStatus === STATUS_DOWNLOADING) {
        const percent = s.totalBytesToDownload ? Math.round(((s.bytesDownloaded ?? 0) / s.totalBytesToDownload) * 100) : null;
        setPhase({ name: "downloading", percent });
      } else if (s.installStatus === STATUS_DOWNLOADED) {
        setDismissedReady(false);
        setPhase({ name: "ready" });
        monitorEvent("action", "App update downloaded");
        if (document.hidden) void install();
      } else if (s.installStatus === STATUS_FAILED || s.installStatus === STATUS_CANCELED) {
        setPhase({ name: "idle" });
        if (s.installStatus === STATUS_FAILED) monitorEvent("action", "App update: download failed", undefined, "warn");
      }
    })).then(keep).catch(() => {});
    void import("@capacitor/app").then(({ App }) => App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) void check();
      else if (phaseRef.current.name === "ready") void install(); // Play installs quietly while we're in the background
    })).then(keep).catch(() => {});

    return () => { gone = true; clearTimeout(first); handles.forEach((h) => { void h.remove(); }); };
  }, [check, install]);

  useEffect(() => subscribeCall(() => setInCall(callInProgress())), []);

  const updateNow = async () => {
    const required = phase.name === "available" && phase.required;
    monitorEvent("action", `App update accepted${required ? " (required)" : ""}`);
    try {
      const AppUpdate = await loadPlugin();
      if (required) {
        // Stays on screen if the user backs out, because the popup has no "Later".
        const r = await AppUpdate.performImmediateUpdate();
        if (r.code !== RESULT_OK && r.code !== RESULT_CANCELED) await openStore();
        return;
      }
      if (!flexibleAllowed.current) { await openStore(); return; }
      setPhase({ name: "downloading", percent: null });
      const r = await AppUpdate.startFlexibleUpdate();
      if (r.code === RESULT_CANCELED) setPhase({ name: "available", required: false });
      else if (r.code !== RESULT_OK) { setPhase({ name: "available", required: false }); await openStore(); }
    } catch (e) {
      monitorEvent("action", "App update: could not start", String(e), "warn");
      setPhase({ name: "available", required });
      await openStore();
    }
  };

  const later = () => {
    try { localStorage.setItem(SNOOZE_KEY, JSON.stringify({ code: availableCode.current, until: Date.now() + SNOOZE_MS })); } catch { /* still closes */ }
    setPhase({ name: "idle" });
  };

  if (phase.name === "idle" || inCall) return null;
  if (phase.name === "ready" && dismissedReady) return null;

  const downloading = phase.name === "downloading";
  if (downloading) {
    return (
      <div role="status" style={{ position: "fixed", left: 12, right: 12, bottom: "calc(12px + env(safe-area-inset-bottom))", zIndex: 9999, background: "#141a2e", color: "#fff", borderRadius: 12, padding: "10px 14px", fontFamily: font.sans, fontSize: 13, boxShadow: "0 8px 30px rgba(0,0,0,.35)" }}>
        Downloading update{phase.percent != null ? ` ${phase.percent}%` : "…"} You can keep using the app.
      </div>
    );
  }

  const ready = phase.name === "ready";
  const required = phase.name === "available" && phase.required;
  const title = ready ? "Update ready to install" : required ? "Update required" : "New update available";
  const body = ready
    ? "Restart now to finish, or it will install by itself when you leave the app."
    : required
      ? "This version needs to be updated to keep working properly. It only takes a moment."
      : "A new version of DIGIRINGO is ready, with the latest fixes and improvements.";

  return (
    <div role="dialog" aria-modal="true" aria-label={title} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(5,8,20,.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: font.sans }}>
      <div style={{ width: "100%", maxWidth: 340, background: "#fff", color: "#141a2e", borderRadius: 20, padding: 24, boxShadow: "0 24px 70px rgba(0,0,0,.4)" }}>
        <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 8 }}>{title}</h2>
        <p style={{ fontSize: 14, lineHeight: 1.5, color: "#555b70", marginBottom: 20 }}>{body}</p>
        <button onClick={ready ? () => { void install(); } : () => { void updateNow(); }} style={{ width: "100%", minHeight: 46, border: "none", borderRadius: 12, background: gradients.brand, color: "#fff", fontFamily: font.sans, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          {ready ? "Restart now" : "Update now"}
        </button>
        {!required && (
          <button onClick={ready ? () => setDismissedReady(true) : later} style={{ width: "100%", minHeight: 44, marginTop: 6, border: "none", background: "transparent", color: "#555b70", fontFamily: font.sans, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Later
          </button>
        )}
      </div>
    </div>
  );
}
