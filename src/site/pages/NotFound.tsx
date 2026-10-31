import { Link } from "../router";
import { usePageMeta } from "../lib/seo";

export function NotFound() {
  usePageMeta("Page not found | DIGIRINGO");
  return (
    <section className="dg-hero-b center">
      <div className="dg-wrap dg-hero-b-center">
        <span className="dg-eyebrow">404</span>
        <h1 className="dg-h1b">We couldn't find that page</h1>
        <p className="dg-lead-b hero">The link may be old or mistyped. Try one of these instead.</p>
        <div className="dg-hero-b-cta">
          <Link to="/" className="dg-btn dg-btn-primary dg-btn-lg">Home</Link>
          <Link to="/sitemap" className="dg-btn dg-btn-ghost dg-btn-lg">All pages</Link>
        </div>
      </div>
    </section>
  );
}
