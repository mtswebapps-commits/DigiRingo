import { useEffect } from "react";

/**
 * Sign-in lives ONLY in the app (digiringo.com/app) — one login, not two. The old
 * marketing login form just handed off to the app anyway, so desktop users ended up
 * logging in twice. This route now redirects straight to the app's real login.
 */
export function LoginPage() {
  useEffect(() => { window.location.replace("/app"); }, []);
  return <Redirecting />;
}

function Redirecting() {
  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 15 }}>
      Taking you to sign in…
    </div>
  );
}
