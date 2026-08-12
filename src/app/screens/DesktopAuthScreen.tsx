import { useState, useEffect, type ReactNode, type CSSProperties } from "react";
import { Mail, Lock, User as UserIcon, ArrowRight, ArrowUpRight } from "lucide-react";
import { useApp } from "../store/AppStore";
import { apiForgotPassword } from "../services/api";
import { fetchOAuthProviders, startOAuth, type OAuthProviders } from "../services/oauth";
import { DgrMark } from "../components/DgrMark";

/**
 * Desktop / laptop web sign-in — a two-panel layout (branded visual on the left,
 * the auth form on the right), the classic "product login" look. Real phones and
 * the native app keep the single-column AuthScreen; this renders only for wide
 * web (see App.tsx). Same store login + social sign-in as everywhere else.
 */
export function DesktopAuthScreen() {
  const { login, showToast } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);
  const [providers, setProviders] = useState<OAuthProviders>({ google: false, apple: false });

  useEffect(() => { fetchOAuthProviders().then(setProviders); }, []);

  const submit = async () => {
    if (busy) return;
    if (!email.trim() || !pw.trim() || (mode === "signup" && !name.trim())) {
      showToast("Please fill in all fields", "error"); return;
    }
    setBusy(true);
    const res = await login(email.trim(), pw, mode === "signup" ? name.trim() : undefined);
    setBusy(false);
    if (res.ok) showToast(mode === "signup" ? "Account created 🎉" : "Welcome back!");
    else showToast(res.error || "Something went wrong", "error");
  };

  const forgotSubmit = async () => {
    if (busy) return;
    if (!email.trim()) { showToast("Enter your email", "error"); return; }
    setBusy(true);
    try { await apiForgotPassword(email.trim()); } catch { /* generic message regardless */ }
    setSent(true); setBusy(false);
  };

  const hasSocial = providers.google || providers.apple;

  return (
    <div style={outer}>
      <style>{CSS}</style>
      <div className="dgauth-card">
        {/* Right — branded visual (row-reverse puts it on the right) */}
        <div className="dgauth-visual">
          <a href="/" className="dgauth-domain">digiringo.com <ArrowUpRight size={13} /></a>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg,#7c5cff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 44px rgba(124,92,255,0.5)" }}>
              <DgrMark w={40} />
            </div>
            <h2 className="dgauth-hero">Borderless.<br /><span className="dgauth-grad">Effortless.</span></h2>
            <p className="dgauth-sub">
              One app for every number — call, text and manage real local lines in 8+
              countries. No SIM, no contract, no second phone.
            </p>
          </div>
          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 7 }}>
            <span className="dgauth-dot" style={{ width: 26, background: "rgba(255,255,255,0.9)" }} />
            <span className="dgauth-dot" />
            <span className="dgauth-dot" />
          </div>
        </div>

        {/* Left — form */}
        <div className="dgauth-form">
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 30 }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#7c5cff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}><DgrMark w={20} /></span>
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em", color: "#0b1226" }}>DIGIRINGO</span>
          </div>

          {forgot ? (
            sent ? (
              <>
                <h1 className="dgauth-title">Check your email 📧</h1>
                <p className="dgauth-lead">If an account exists for <b>{email.trim()}</b>, we've sent a link to reset your password. It expires in 1 hour.</p>
                <button className="dgauth-btn" onClick={() => { setForgot(false); setSent(false); }} style={{ marginTop: 22 }}>Back to log in</button>
              </>
            ) : (
              <>
                <h1 className="dgauth-title">Reset your password</h1>
                <p className="dgauth-lead">Enter your account email and we'll send you a link to reset your password.</p>
                <div style={{ marginTop: 22 }}>
                  <Field label="Email" icon={<Mail size={16} />} value={email} onChange={setEmail} type="email" placeholder="you@example.com" onEnter={forgotSubmit} />
                </div>
                <button className="dgauth-btn" onClick={forgotSubmit} disabled={busy} style={{ marginTop: 20 }}>{busy ? "Sending…" : "Send reset link"}</button>
                <button className="dgauth-textbtn" onClick={() => setForgot(false)} style={{ marginTop: 16 }}>← Back to log in</button>
              </>
            )
          ) : (
            <>
              <h1 className="dgauth-title">{mode === "signup" ? "Create an account" : "Welcome back"}</h1>
              <p className="dgauth-lead">{mode === "signup" ? "Get your first local number in under a minute." : "Log in to manage your numbers, inbox and wallet."}</p>

              {hasSocial && (
                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                  {providers.google && (
                    <button type="button" className="dgauth-social" onClick={() => startOAuth("google")}><GoogleIcon /> Continue with Google</button>
                  )}
                  {providers.apple && (
                    <button type="button" className="dgauth-social" onClick={() => startOAuth("apple")}><AppleIcon /> Continue with Apple</button>
                  )}
                </div>
              )}

              {hasSocial && <div className="dgauth-or" style={{ marginTop: 22 }}><span>or</span></div>}

              <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
                {mode === "signup" && (
                  <Field label="Full name" icon={<UserIcon size={16} />} value={name} onChange={setName} placeholder="Jane Doe" name="name" autoComplete="name" />
                )}
                <Field label="Email" icon={<Mail size={16} />} value={email} onChange={setEmail} type="email" placeholder="you@example.com" name="email" autoComplete="email" />
                <Field
                  label="Password" icon={<Lock size={16} />} value={pw} onChange={setPw} type="password"
                  placeholder={mode === "signup" ? "Create a password" : "••••••••"}
                  name="password" autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  hint={mode === "login" ? <button type="button" className="dgauth-textlink" onClick={() => { setForgot(true); setSent(false); }}>Forgot?</button> : undefined}
                />
                <button type="submit" className="dgauth-btn" disabled={busy}>
                  {busy ? "Please wait…" : (mode === "signup" ? "Create account" : "Log in")} {!busy && <ArrowRight size={16} />}
                </button>
              </form>

              <p className="dgauth-terms">By continuing you agree to DIGIRINGO's Terms of Service and Privacy Policy.</p>
              <p className="dgauth-switch">
                {mode === "signup" ? "Already have an account? " : "New to DIGIRINGO? "}
                <button type="button" className="dgauth-textlink" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
                  {mode === "signup" ? "Log in" : "Create one"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, value, onChange, type = "text", placeholder, name, autoComplete, hint, onEnter }: {
  label: string; icon: ReactNode; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; name?: string; autoComplete?: string; hint?: ReactNode; onEnter?: () => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <label className="dgauth-label">{label}</label>
        {hint}
      </div>
      <div className="dgauth-inwrap">
        <span className="dgauth-icon">{icon}</span>
        <input
          className="dgauth-input" value={value} onChange={(e) => onChange(e.target.value)}
          type={type} placeholder={placeholder} name={name} autoComplete={autoComplete}
          onKeyDown={(e) => e.key === "Enter" && onEnter && (e.preventDefault(), onEnter())}
        />
      </div>
    </div>
  );
}

const outer: CSSProperties = {
  minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
  padding: 24, background: "radial-gradient(1200px 600px at 50% -10%, #efe9e1, #e7ddd0)", fontFamily: "'Inter', sans-serif",
};

const CSS = `
.dgauth-card { display: flex; flex-direction: row-reverse; width: 100%; max-width: 1000px; min-height: 620px; background: #fff; border-radius: 26px; overflow: hidden; box-shadow: 0 40px 120px rgba(20,16,40,0.28); }
.dgauth-visual { position: relative; flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(160deg,#0b1020 0%,#1a1040 55%,#0a1330 100%); overflow: hidden; }
.dgauth-visual::before { content: ""; position: absolute; width: 520px; height: 520px; right: -160px; top: -120px; background: radial-gradient(circle, rgba(124,92,255,0.45), transparent 65%); }
.dgauth-domain { position: absolute; top: 22px; right: 22px; z-index: 2; display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.16); color: rgba(255,255,255,0.85); font-size: 12px; font-weight: 600; text-decoration: none; }
.dgauth-hero { margin: 34px 0 0; color: #fff; font-size: 52px; line-height: 1.0; font-weight: 800; letter-spacing: -0.04em; }
.dgauth-grad { background: linear-gradient(120deg,#a78bfa,#7c5cff 60%,#c084fc); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.dgauth-sub { margin: 20px 0 0; max-width: 380px; color: rgba(255,255,255,0.72); font-size: 15px; line-height: 1.6; }
.dgauth-dot { width: 10px; height: 10px; border-radius: 999px; background: rgba(255,255,255,0.28); }
.dgauth-form { width: 440px; flex-shrink: 0; padding: 44px 46px; overflow-y: auto; display: flex; flex-direction: column; }
.dgauth-title { color: #0b1226; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
.dgauth-lead { color: #6b7280; font-size: 14px; line-height: 1.55; margin: 10px 0 0; }
.dgauth-social { width: 100%; height: 48px; border-radius: 12px; border: 1px solid #e3e3e8; background: #fff; color: #0b1226; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background 0.15s, border-color 0.15s; font-family: inherit; }
.dgauth-social:hover { background: #f7f7f9; border-color: #d5d5dd; }
.dgauth-or { display: flex; align-items: center; text-align: center; color: #9aa0ad; font-size: 12.5px; }
.dgauth-or::before, .dgauth-or::after { content: ""; flex: 1; height: 1px; background: #ececf1; }
.dgauth-or span { padding: 0 14px; }
.dgauth-label { color: #374151; font-size: 12.5px; font-weight: 600; }
.dgauth-inwrap { position: relative; }
.dgauth-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #9aa0ad; display: flex; }
.dgauth-input { width: 100%; height: 48px; padding: 0 14px 0 40px; border-radius: 12px; border: 1px solid #e3e3e8; background: #fafafb; color: #0b1226; font-size: 14px; outline: none; font-family: inherit; transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; }
.dgauth-input::placeholder { color: #aab0bb; }
.dgauth-input:focus { border-color: #7c5cff; background: #fff; box-shadow: 0 0 0 3px rgba(124,92,255,0.14); }
.dgauth-btn { width: 100%; height: 50px; border-radius: 12px; border: none; background: #0b1226; color: #fff; font-size: 14.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.15s, opacity 0.15s; font-family: inherit; }
.dgauth-btn:hover { transform: translateY(-1px); }
.dgauth-btn:disabled { opacity: 0.65; cursor: default; transform: none; }
.dgauth-textbtn { background: none; border: none; color: #6b7280; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; align-self: center; }
.dgauth-textlink { background: none; border: none; color: #7c5cff; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; padding: 0; }
.dgauth-terms { color: #9aa0ad; font-size: 11.5px; line-height: 1.6; margin: 18px 0 0; }
.dgauth-switch { color: #6b7280; font-size: 13.5px; margin: 16px 0 0; text-align: center; }
@media (max-width: 900px) {
  .dgauth-visual { display: none; }
  .dgauth-form { width: 100%; }
  .dgauth-card { max-width: 480px; min-height: 0; }
}
`;

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
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#0b1226" aria-hidden focusable="false">
      <path d="M17.05 12.54c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.15-.47 7.82 1.3 10.38.86 1.25 1.89 2.66 3.24 2.61 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.29-1.28 3.15-2.54.99-1.46 1.4-2.87 1.42-2.94-.03-.01-2.72-1.05-2.75-4.16zM14.6 4.84c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z" />
    </svg>
  );
}
