import { loadAllDocs } from "./registry";
import { generatedPaths } from "./generated";
import { STATIC_POSTS } from "./posts";

/** Hand-built pages (not in a data file). Shared by /sitemap and sitemap.xml. */
export const CORE = [
  { path: "/", title: "Home" }, { path: "/pricing", title: "Pricing" }, { path: "/rates", title: "International rates" },
  { path: "/local-numbers", title: "Local numbers" }, { path: "/toll-free-numbers", title: "Toll-free numbers" },
  { path: "/tools", title: "Free tools" }, { path: "/blog", title: "Blog" }, { path: "/about", title: "About" },
  { path: "/careers", title: "Careers" }, { path: "/contact", title: "Contact" }, { path: "/sales", title: "Talk to us" },
  { path: "/status", title: "System status" }, { path: "/terms", title: "Terms" }, { path: "/privacy", title: "Privacy" },
];

/** Every public URL path on the site, de-duplicated (feeds dist/sitemap.xml at build time). */
export async function allSitePaths(): Promise<string[]> {
  const docs = await loadAllDocs();
  const paths = [
    ...CORE.map((c) => c.path),
    "/sitemap",
    ...docs.map((d) => d.path),
    ...generatedPaths().map((g) => g.path),
    ...STATIC_POSTS.map((p) => `/blog/${p.slug}`),
  ];
  return [...new Set(paths)];
}
