import { lazy, Suspense } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { RouterProvider, useRouter } from "./router";
import { Nav } from "./components/Nav";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ResetPage } from "./pages/ResetPage";
import { VerifyPage } from "./pages/VerifyPage";
import { NotFound } from "./pages/NotFound";
import { hasDocFamily } from "./content/registry";
import "./pages.css";

// Everything below the home page loads on demand.
const PricingPage = lazy(() => import("./pages/PricingPage").then((m) => ({ default: m.PricingPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import("./pages/BlogPage").then((m) => ({ default: m.BlogPage })));
const DocPage = lazy(() => import("./pages/DocPage").then((m) => ({ default: m.DocPage })));
const SitemapPage = lazy(() => import("./pages/SitemapPage").then((m) => ({ default: m.SitemapPage })));
const LlmInfoPage = lazy(() => import("./pages/SitemapPage").then((m) => ({ default: m.LlmInfoPage })));
const TermsPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.PrivacyPage })));
const AboutPage = lazy(() => import("./pages/CompanyPages").then((m) => ({ default: m.AboutPage })));
const CareersPage = lazy(() => import("./pages/CompanyPages").then((m) => ({ default: m.CareersPage })));
const StatusPage = lazy(() => import("./pages/CompanyPages").then((m) => ({ default: m.StatusPage })));

/** Routes that render the bare auth layout (no marketing nav/footer chrome). */
const AUTH_ROUTES = new Set(["/login", "/signup"]);

/** Old routes that moved — keep inbound links working. */
const MOVED: Record<string, string> = { "/api": "/developers" };

function Pages() {
  const { route } = useRouter();
  const path = MOVED[route] ?? route;

  switch (path) {
    case "/": return <HomePage />;
    case "/pricing": return <PricingPage />;
    case "/contact": return <ContactPage />;
    case "/sales": return <ContactPage sales />;
    case "/terms": return <TermsPage />;
    case "/privacy": return <PrivacyPage />;
    case "/about": return <AboutPage />;
    case "/careers": return <CareersPage />;
    case "/status": return <StatusPage />;
    case "/sitemap": return <SitemapPage />;
    case "/llm-info": return <LlmInfoPage />;
    case "/login": return <LoginPage />;
    case "/signup": return <SignupPage />;
  }
  if (path === "/blog" || path.startsWith("/blog/")) return <BlogPage />;
  if (hasDocFamily(path)) return <DocPage path={path} />;
  return <NotFound />;
}

function Frame() {
  const { route } = useRouter();
  // Password-reset email links land here (digiringo.com/?reset=TOKEN) — render the
  // reset screen bare, regardless of the route.
  const params = (() => { try { return new URLSearchParams(window.location.search); } catch { return new URLSearchParams(); } })();
  if (params.has("reset")) return <ResetPage />;
  if (params.has("verify")) return <VerifyPage />;
  const isAuth = AUTH_ROUTES.has(route);

  if (isAuth) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key={route} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <Pages />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="dg-shell">
      <AnnouncementBar />
      <Nav />
      <main>
        <Suspense fallback={<div className="dg-page-loading" />}>
          <motion.div key={route} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            <Pages />
          </motion.div>
        </Suspense>
      </main>
      <Footer route={route} />
    </div>
  );
}

export function SiteApp() {
  return (
    <RouterProvider>
      <MotionConfig reducedMotion="user">
        <Frame />
      </MotionConfig>
    </RouterProvider>
  );
}
