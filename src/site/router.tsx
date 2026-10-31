import { createContext, useContext, useEffect, useState, type MouseEvent, type ReactNode } from "react";

/**
 * Tiny History-API router. The server falls back to site.html for any unknown
 * path, so clean URLs (/pricing, /local-numbers/texas) work on a hard load and
 * can be indexed. Old hash links (/#/pricing) are rewritten on first load.
 */
export type Route = string;

const RouteCtx = createContext<{ route: Route; navigate: (to: Route) => void }>({
  route: "/",
  navigate: () => {},
});

function currentPath(): Route {
  const p = window.location.pathname.replace(/\/+$/, "");
  return p || "/";
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => {
    const h = window.location.hash.replace(/^#/, "");
    if (h.startsWith("/")) window.history.replaceState(null, "", h + window.location.search);
    return currentPath();
  });

  useEffect(() => {
    const onPop = () => setRoute(currentPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: Route) => {
    const [path, anchor] = to.split("#");
    if (path && path !== currentPath()) {
      window.history.pushState(null, "", to);
      setRoute(currentPath());
    }
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }));
    else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  return <RouteCtx.Provider value={{ route, navigate }}>{children}</RouteCtx.Provider>;
}

export const useRouter = () => useContext(RouteCtx);

/** Anchor that drives the router (plain click) and still opens in a new tab on ctrl/middle-click. */
export function Link({
  to,
  className,
  children,
  onClick,
}: {
  to: Route;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { navigate } = useRouter();
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!to.startsWith("/")) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} className={className} onClick={go}>
      {children}
    </a>
  );
}
