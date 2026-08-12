import type { CSSProperties } from "react";
import { C, font, radius } from "../core/theme";
import type { OAuthProvider, OAuthProviders } from "../services/oauth";

/**
 * Google / Apple sign-in buttons. Renders a button only for providers the server
 * has configured (so Apple stays hidden until its keys are added), and nothing at
 * all when none are live — keeping the auth screen clean before setup.
 */
export function SocialButtons({ providers, onPick, label = "Continue with" }: {
  providers: OAuthProviders;
  onPick: (p: OAuthProvider) => void;
  label?: string;
}) {
  if (!providers.google && !providers.apple) return null;
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 16px" }}>
        <span style={{ flex: 1, height: 1, background: C.line }} />
        <span style={{ color: C.faint, fontSize: 11.5, fontWeight: 600 }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: C.line }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {providers.google && (
          <button type="button" onClick={() => onPick("google")} style={btn}>
            <GoogleIcon /> Google
          </button>
        )}
        {providers.apple && (
          <button type="button" onClick={() => onPick("apple")} style={btn}>
            <AppleIcon /> Apple
          </button>
        )}
      </div>
    </div>
  );
}

const btn: CSSProperties = {
  width: "100%", padding: "13px", borderRadius: radius.md, cursor: "pointer",
  background: C.input, border: `1px solid ${C.line}`, color: C.text,
  fontSize: 14, fontWeight: 700, fontFamily: font.sans,
  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden focusable="false">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 4.5 29.4 2.5 24 2.5 12.1 2.5 2.5 12.1 2.5 24S12.1 45.5 24 45.5 45.5 35.9 45.5 24c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M4.8 14.7l6.6 4.8C13.2 15.2 18.2 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 4.5 29.4 2.5 24 2.5 16.3 2.5 9.6 6.9 6.3 13.3l-1.5 1.4z" />
      <path fill="#4CAF50" d="M24 45.5c5.3 0 10.1-2 13.7-5.3l-6.3-5.2c-2 1.5-4.6 2.5-7.4 2.5-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.5 41 16.2 45.5 24 45.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.3 5.2c-.4.4 6.5-4.7 6.5-14.7 0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={C.text} aria-hidden focusable="false">
      <path d="M17.05 12.54c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.15-.47 7.82 1.3 10.38.86 1.25 1.89 2.66 3.24 2.61 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.29-1.28 3.15-2.54.99-1.46 1.4-2.87 1.42-2.94-.03-.01-2.72-1.05-2.75-4.16zM14.6 4.84c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z" />
    </svg>
  );
}
