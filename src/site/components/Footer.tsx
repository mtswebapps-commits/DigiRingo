import { ArrowRight } from "lucide-react";
import { Link } from "../router";
import { Logo } from "./ui";
import { FOOTER_COLS } from "../content/nav";

/** Pre-footer CTA pair + link columns. The headline changes with the page family. */
export function Footer({ route = "/" }: { route?: string }) {
  const headline = route.startsWith("/tools") || route.startsWith("/compare")
    ? "Never miss a call or a customer"
    : route.startsWith("/blog")
      ? "Put these ideas to work today"
      : "Your business line, ready in a minute";

  return (
    <>
      <section className="dg-prefoot">
        <div className="dg-wrap">
          <h2 className="dg-h2b">{headline}</h2>
          <div className="dg-prefoot-grid">
            <a href="/app" className="dg-prefoot-card a">
              <h3>Get started</h3>
              <p>Pick a number, top up as little as $5 and start calling and texting.</p>
              <span className="go">Create your account <ArrowRight size={18} /></span>
            </a>
            <Link to="/sales" className="dg-prefoot-card b">
              <h3>Talk to us</h3>
              <p>Questions about numbers, countries or setting up your team? We'll help.</p>
              <span className="go">Contact our team <ArrowRight size={18} /></span>
            </Link>
          </div>
        </div>
      </section>
      <footer className="dg-footer">
        <div className="dg-wrap">
          <div className="dg-footer-grid wide">
            <div>
              <Logo />
              <p className="dg-muted" style={{ fontSize: 14.5, lineHeight: 1.6, marginTop: 16, maxWidth: 300 }}>
                Business phone numbers for calls and texts — local, toll-free and international — in one app on the web and Android.
              </p>
            </div>
            {FOOTER_COLS.map((c) => (
              <div key={c.title}>
                <h5>{c.title}</h5>
                {c.links.map((l) => (
                  <Link key={l.href} to={l.href}>{l.label}</Link>
                ))}
              </div>
            ))}
          </div>

          <div className="dg-footer-bottom">
            <span>© 2026 DIGIRINGO. All rights reserved. · 14 Hughes Ste B200, Irvine, CA 92618, USA</span>
            <span className="links">
              <Link to="/llm-info">For AI assistants</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/fair-use">Fair use</Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
