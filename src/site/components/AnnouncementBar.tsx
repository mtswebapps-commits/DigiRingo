import { Link } from "../router";

/**
 * Slim promo strip pinned above the nav — shaded blue→pink to match the brand.
 * Fixed to the top of the viewport; the nav sits just below it (see --ann-h /
 * .dg-nav top offset in styles.css) and the shell pads its content to clear both.
 * Edit the copy below to change the announcement.
 */
export function AnnouncementBar() {
  return (
    <Link to="/pricing" className="dg-announce">
      <span className="dg-announce-dot" aria-hidden />
      <span className="dg-announce-text">
        Now live — your business calls &amp; texts in one app.
      </span>
      <span className="dg-announce-cta">See plans →</span>
    </Link>
  );
}
