/**
 * Social sign-in (Google / Apple) — client half of the server OAuth flow.
 *
 * The server does the whole authorization-code dance (see server/oauth.mjs) and
 * hands a DIGIRINGO session token back to us:
 *   • WEB:    the callback redirects to `/app#token=…` — we read it from the hash.
 *   • NATIVE: the callback redirects to `com.digiringo.app://oauth?token=…`, which
 *             re-opens the app; @capacitor/app's `appUrlOpen` delivers the URL.
 *
 * Google refuses OAuth inside an embedded WebView ("disallowed_useragent"), so on
 * native we MUST open the system browser (@capacitor/browser = a Chrome Custom
 * Tab), not the app's own WebView.
 */
import { API_ORIGIN } from "./origin";

export type OAuthProvider = "google" | "apple";
export type OAuthProviders = { google: boolean; apple: boolean };
type OAuthResult = { token?: string; error?: string };

const subs = new Set<(r: OAuthResult) => void>();
/** Subscribe to sign-in results (a token to log in with, or an error to show). */
export function onOAuthResult(cb: (r: OAuthResult) => void): () => void {
  subs.add(cb);
  return () => subs.delete(cb);
}
function emit(r: OAuthResult) { subs.forEach((cb) => cb(r)); }

type Cap = { isNativePlatform?: () => boolean };
const isNative = (): boolean => {
  try { return !!(window as unknown as { Capacitor?: Cap }).Capacitor?.isNativePlatform?.(); }
  catch { return false; }
};

function startUrl(provider: OAuthProvider): string {
  const flow = isNative() ? "native" : "web";
  return `${API_ORIGIN}/api/auth/${provider}/start?flow=${flow}`;
}

/** Which providers are configured on the server (a button shows only for these). */
export async function fetchOAuthProviders(): Promise<OAuthProviders> {
  try {
    const r = await fetch(`${API_ORIGIN}/api/auth/providers`);
    if (!r.ok) return { google: false, apple: false };
    const j = await r.json();
    return { google: !!j.google, apple: !!j.apple };
  } catch { return { google: false, apple: false }; }
}

/** Begin sign-in: native → system browser; web → full-page redirect. */
export async function startOAuth(provider: OAuthProvider): Promise<void> {
  const url = startUrl(provider);
  if (isNative()) {
    try {
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({ url });
      return;
    } catch { /* fall through to a plain navigation */ }
  }
  window.location.href = url;
}

/** Web: pull `#token=…` / `#error=…` off the URL the callback redirected us to. */
function captureWebHash() {
  if (typeof window === "undefined") return;
  const h = window.location.hash || "";
  if (!/(?:^|[#&])(token|error)=/.test(h)) return;
  const q = new URLSearchParams(h.replace(/^#/, ""));
  const token = q.get("token") || undefined;
  const error = q.get("error") || undefined;
  if (!token && !error) return;
  // Strip the hash so a refresh can't replay it.
  try { history.replaceState(null, "", window.location.pathname + window.location.search); } catch { /* ignore */ }
  emit({ token, error: error ? decodeURIComponent(error) : undefined });
}

/** Native: catch the `com.digiringo.app://oauth?token=…` deep link. */
async function registerNativeDeepLink() {
  if (!isNative()) return;
  try {
    const { App } = await import("@capacitor/app");
    App.addListener("appUrlOpen", async ({ url }: { url: string }) => {
      if (!url || !url.includes("oauth")) return;
      const q = new URLSearchParams(url.split("?")[1] || "");
      const token = q.get("token") || undefined;
      const error = q.get("error") || undefined;
      try { const { Browser } = await import("@capacitor/browser"); await Browser.close(); } catch { /* ignore */ }
      if (token || error) emit({ token, error: error ? decodeURIComponent(error) : undefined });
    });
  } catch { /* @capacitor/app unavailable (web) */ }
}

let started = false;
/** Wire up token capture once, at app start. Safe to call on web and native. */
export function initOAuthCapture() {
  if (started) return;
  started = true;
  captureWebHash();
  void registerNativeDeepLink();
}
