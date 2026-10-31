import { useEffect } from "react";

const DEFAULT_TITLE = "DIGIRINGO — Business phone numbers, calls and texts in one app";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Sets <title>, description, canonical and OG tags for the current page. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    const t = title || DEFAULT_TITLE;
    document.title = t;
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }
    setMeta("og:title", t, "property");
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `https://digiringo.com${window.location.pathname.replace(/\/+$/, "") || "/"}`;
  }, [title, description]);
}
