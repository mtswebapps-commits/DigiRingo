import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Menu as MenuIcon, X, Sun, Moon } from "lucide-react";
import { Link, useRouter } from "../router";
import { Logo } from "./ui";
import { MENUS } from "../content/nav";
import { useTheme } from "../theme";
import { Icon } from "./Icon";
import { StatusBadge } from "./blocks";

/** Frosted top bar with Product / Solutions / Resources mega-menus. */
export function Nav() {
  const { route } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<number | null>(null);
  const closeTimer = useRef<number>();
  const [theme, toggleTheme] = useTheme();

  const ThemeToggle = (
    <button
      className="dg-icon-btn"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Close menus whenever the page changes.
  useEffect(() => { setMenu(null); setOpen(false); }, [route]);

  const enter = (i: number) => { window.clearTimeout(closeTimer.current); setMenu(i); };
  const leave = () => { closeTimer.current = window.setTimeout(() => setMenu(null), 160); };

  return (
    <>
      <motion.nav
        className={`dg-nav ${scrolled || menu !== null ? "scrolled" : ""}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onKeyDown={(e) => e.key === "Escape" && setMenu(null)}
      >
        <div className="dg-nav-inner">
          <Logo />
          <div className="dg-nav-links">
            {MENUS.map((m, i) => (
              <div key={m.label} className={`dg-mega-item${menu === i ? " open" : ""}`} onMouseEnter={() => enter(i)} onMouseLeave={leave}>
                <button className="dg-nav-link dg-mega-trigger" aria-expanded={menu === i} onClick={() => setMenu(menu === i ? null : i)}>
                  {m.label} <ChevronDown size={15} />
                </button>
                {menu === i && (
                  <div className="dg-mega" onMouseEnter={() => enter(i)} onMouseLeave={leave}>
                    <div className="dg-mega-cols">
                      {m.cols.map((c) => (
                        <div key={c.title}>
                          <h6>{c.title}</h6>
                          {c.links.map((l) => (
                            <Link key={l.href} to={l.href} className="dg-mega-link">
                              {l.icon && <span className="ic"><Icon name={l.icon} size={16} /></span>}
                              <span>
                                <b>{l.label} <StatusBadge status={l.status} /></b>
                                {l.hint && <small>{l.hint}</small>}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="dg-mega-feature">
                      <h5>{m.feature.title}</h5>
                      <p>{m.feature.body}</p>
                      <Link to={m.feature.href} className="dg-btn dg-btn-primary dg-btn-sm">{m.feature.cta}</Link>
                    </div>
                    {m.foot && (
                      <div className="dg-mega-foot">
                        <span>{m.foot.text}</span>
                        <Link to={m.foot.href}>{m.foot.cta}</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <Link to="/pricing" className={`dg-nav-link ${route === "/pricing" ? "active" : ""}`}>Pricing</Link>
          </div>
          <div className="dg-nav-cta">
            {ThemeToggle}
            {/* Sign-in lives ONLY in the app (digiringo.com/app) — one login, not two. */}
            <a href="/app" className="dg-nav-link dg-hide-sm">Log in</a>
            <Link to="/sales" className="dg-btn dg-btn-ghost dg-btn-sm dg-hide-sm">Talk to us</Link>
            <a href="/app" className="dg-btn dg-btn-primary dg-btn-sm">Get started</a>
            <button className="dg-burger" onClick={() => setOpen(true)} aria-label="Open menu">
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      <div className={`dg-drawer ${open ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {ThemeToggle}
            <button className="dg-burger" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
        </div>
        {MENUS.map((m) => (
          <details key={m.label}>
            <summary>{m.label} <ChevronDown size={20} /></summary>
            {m.cols.flatMap((c) => c.links).map((l) => (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
          </details>
        ))}
        <Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
        <Link to="/sales" onClick={() => setOpen(false)}>Talk to us</Link>
        <a href="/app" onClick={() => setOpen(false)}>Log in</a>
        <div style={{ marginTop: 24 }}>
          <a href="/app" className="dg-btn dg-btn-primary dg-btn-lg" style={{ width: "100%" }}>Get started</a>
        </div>
      </div>
    </>
  );
}
