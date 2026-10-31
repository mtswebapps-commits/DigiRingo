import { useEffect, useState } from "react";
import type { PageDoc } from "../content/types";
import { loadDoc, loadSummaries } from "../content/registry";
import { BlockView, Breadcrumbs, ReadyBand, StatusBadge } from "../components/blocks";
import { Link } from "../router";
import { usePageMeta } from "../lib/seo";
import { NotFound } from "./NotFound";

/** Renders any data-driven page (src/site/content/pages/*) for `path`. */
export function DocPage({ path }: { path: string }) {
  const [doc, setDoc] = useState<PageDoc | null | undefined>(undefined);
  const [related, setRelated] = useState<PageDoc[]>([]);

  useEffect(() => {
    let live = true;
    setDoc(undefined);
    setRelated([]);
    loadDoc(path).then((d) => {
      if (!live) return;
      setDoc(d);
      if (d?.related?.length) loadSummaries(d.related).then((r) => live && setRelated(r));
    });
    return () => { live = false; };
  }, [path]);

  usePageMeta(doc?.title, doc?.description);

  if (doc === undefined) return <div className="dg-page-loading" />;
  if (doc === null) return <NotFound />;

  return (
    <div className="dg-doc">
      {doc.crumbs && doc.crumbs.length > 0 && <div className="dg-wrap dg-crumbs-wrap"><Breadcrumbs crumbs={doc.crumbs} /></div>}
      {doc.sections.map((b, i) => <BlockView key={i} block={b} pageStatus={doc.status} />)}
      {related.length > 0 && (
        <section className="dg-block dg-tone-tint">
          <div className="dg-wrap">
            <h2 className="dg-h2b center">Related</h2>
            <div className="dg-grid dg-grid-3" style={{ marginTop: 36 }}>
              {related.map((r) => (
                <Link key={r.path} to={r.path} className="dg-card dg-card-b link">
                  <h3 className="dg-item-title">{r.title.replace(/\s*\|\s*DIGIRINGO$/, "")} <StatusBadge status={r.status} /></h3>
                  <p className="dg-item-body">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <ReadyBand />
    </div>
  );
}
