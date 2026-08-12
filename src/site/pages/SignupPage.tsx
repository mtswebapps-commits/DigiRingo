import { useEffect } from "react";

/**
 * Account creation lives ONLY in the app (digiringo.com/app) — one place to sign
 * up, not two. This marketing route now redirects straight to the app so desktop
 * users don't fill in a form here and then sign up again in the app.
 */
export function SignupPage() {
  useEffect(() => { window.location.replace("/app"); }, []);
  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 15 }}>
      Taking you to get started…
    </div>
  );
}
