import type { PageDoc } from "./types";

/**
 * Which data file holds which route family. Files are lazy chunks, so a visit
 * to /product/calling only downloads product-a.ts.
 */
const loaders = import.meta.glob("./pages/*.ts") as Record<string, () => Promise<{ PAGES: PageDoc[] }>>;

const FAMILIES: [RegExp, string][] = [
  [/^\/product\/(calling|messaging|call-forwarding|call-routing|call-management)(\/|$)/, "product-a"],
  [/^\/(product|ai-agent)(\/|$)/, "product-b"],
  [/^\/(features|phone-numbers|vanity-number|porting|developers|downloads|demo|security|fair-use|partners|press|webinars|podcast|community|customers|templates|skills)(\/|$)/, "features"],
  [/^\/(solutions|answering-service)(\/|$)/, "solutions"],
  [/^\/compare(\/|$)/, "compare"],
  [/^\/(integrations|es|fr)(\/|$)/, "integrations"],
];

const cache = new Map<string, PageDoc[]>();

async function loadFile(name: string): Promise<PageDoc[]> {
  if (cache.has(name)) return cache.get(name)!;
  const load = loaders[`./pages/${name}.ts`];
  const pages = load ? (await load()).PAGES : [];
  cache.set(name, pages);
  return pages;
}

/** Families built in code from data (local numbers, toll-free, rates, tools). */
const GENERATED = /^\/(local-numbers|toll-free-numbers|rates|tools)(\/|$)/;

export const hasDocFamily = (path: string) => GENERATED.test(path) || FAMILIES.some(([re]) => re.test(path));

/** The page for `path`, or null when no data file defines it. */
export async function loadDoc(path: string): Promise<PageDoc | null> {
  if (GENERATED.test(path)) return (await import("./generated")).generatedDoc(path);
  const fam = FAMILIES.find(([re]) => re.test(path));
  if (!fam) return null;
  return (await loadFile(fam[1])).find((p) => p.path === path) ?? null;
}

/** Title/status/path of several pages (for "related" cards), across files. */
export async function loadSummaries(paths: string[]): Promise<PageDoc[]> {
  const out: PageDoc[] = [];
  for (const p of paths) {
    const d = await loadDoc(p);
    if (d) out.push(d);
  }
  return out;
}

/** Every data-driven page (used by the sitemap page). */
export async function loadAllDocs(): Promise<PageDoc[]> {
  const names = [...new Set(FAMILIES.map(([, n]) => n))];
  return (await Promise.all(names.map(loadFile))).flat();
}
