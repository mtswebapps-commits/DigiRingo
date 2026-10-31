import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { Link, useRouter } from "../router";
import { FaqList } from "../components/blocks";
import { STATIC_POSTS } from "../content/posts";
import { extractFaq, renderMarkdown, slugify } from "../lib/md";
import { usePageMeta } from "../lib/seo";
import { NotFound } from "./NotFound";

/** One shape for the site's own Markdown posts and posts written in the admin panel. */
interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  minutes: number;
  md?: string;    // Markdown body (site posts)
  html?: string;  // HTML body (admin posts)
  cover?: string | null;
}

const GRADS = [
  "linear-gradient(135deg, #5b3df5 0%, #8b6cf7 55%, #4fb7ff 100%)",
  "linear-gradient(135deg, #2f6bff 0%, #7c5cff 60%, #c06cf0 100%)",
  "linear-gradient(135deg, #0ea5a4 0%, #3b82f6 60%, #7c5cff 100%)",
  "linear-gradient(135deg, #7c5cff 0%, #ec4f9c 100%)",
  "linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)",
];
const gradFor = (s: string) => GRADS[[...s].reduce((n, c) => n + c.charCodeAt(0), 0) % GRADS.length];

const fmtDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); } catch { return iso; }
};

const fromStatic: Post[] = STATIC_POSTS.map((p) => ({
  slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, date: p.date, author: p.author,
  minutes: Math.max(1, Math.round(p.words / 230)), md: p.body,
}));

/** Admin-panel posts from /api/blog, merged with the bundled ones (bundled slugs win). */
function usePosts(): Post[] {
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetch("/api/blog")
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d) => setDbPosts((d.posts ?? []).map((p: Record<string, string>) => ({
        slug: p.slug, title: p.title, excerpt: p.excerpt || "", author: p.author || "DIGIRINGO Team",
        category: String(p.tags || "").split(",")[0]?.trim() || "News", date: p.created_at, minutes: 4, cover: p.cover_url || null,
      }))))
      .catch(() => {});
  }, []);
  return useMemo(() => {
    const seen = new Set(fromStatic.map((p) => p.slug));
    return [...fromStatic, ...dbPosts.filter((p) => !seen.has(p.slug))].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [dbPosts]);
}

function Cover({ post, big = false }: { post: Post; big?: boolean }) {
  return post.cover
    ? <div className="dg-post-cover" style={{ background: `url(${post.cover}) center/cover` }} />
    : <div className="dg-post-cover" style={{ background: gradFor(post.slug), fontSize: big ? undefined : 17 }}><span style={{ position: "relative", zIndex: 1, maxWidth: "85%" }}>{post.category}</span></div>;
}

function PostCard({ post, i = 0 }: { post: Post; i?: number }) {
  return (
    <Reveal delay={(i % 3) * 60}>
      <Link to={`/blog/${post.slug}`} className="dg-post-card">
        <Cover post={post} />
        <div className="body">
          <span className="dg-post-tag">{post.category}</span>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <div className="dg-post-meta"><span>{fmtDate(post.date)}</span><span>{post.minutes} min read</span></div>
        </div>
      </Link>
    </Reveal>
  );
}

function BlogIndex({ category }: { category?: string }) {
  const posts = usePosts();
  const cats = useMemo(() => [...new Set(posts.map((p) => p.category))].sort(), [posts]);
  const active = category ? cats.find((c) => slugify(c) === category) : undefined;
  usePageMeta(
    active ? `${active} Articles | DIGIRINGO Blog` : "Blog: Business Phone Guides & Tips | DIGIRINGO",
    "Practical guides on business phone numbers, VoIP, call forwarding, business texting and 10DLC, written for small businesses and remote teams.",
  );
  const list = active ? posts.filter((p) => p.category === active) : posts;
  const [featured, ...rest] = list;

  return (
    <>
      <section className="dg-hero-b center" style={{ paddingBottom: 24 }}>
        <div className="dg-wrap dg-hero-b-center">
          <span className="dg-eyebrow">Blog</span>
          <h1 className="dg-h1b">{active ?? "Guides for running your business line"}</h1>
          <p className="dg-lead-b hero">How-tos and explainers on phone numbers, calling, texting and staying reachable — no jargon.</p>
          <div className="dg-blog-cats">
            <Link to="/blog" className={`dg-blog-cat${!active ? " on" : ""}`}>All</Link>
            {cats.map((c) => <Link key={c} to={`/blog/category/${slugify(c)}`} className={`dg-blog-cat${active === c ? " on" : ""}`}>{c}</Link>)}
          </div>
        </div>
      </section>

      <section className="dg-block" style={{ paddingTop: 24 }}>
        <div className="dg-wrap">
          {!featured ? (
            <p className="dg-center dg-muted">No posts here yet.</p>
          ) : (
            <>
              <Reveal>
                <Link to={`/blog/${featured.slug}`} className="dg-featured-post">
                  <Cover post={featured} big />
                  <div className="body">
                    <span className="dg-post-tag">{featured.category}</span>
                    <h2>{featured.title}</h2>
                    <p className="dg-item-body">{featured.excerpt}</p>
                    <div className="dg-post-meta"><span>{fmtDate(featured.date)}</span><span>{featured.minutes} min read</span><span>{featured.author}</span></div>
                  </div>
                </Link>
              </Reveal>

              {active ? (
                <div className="dg-grid dg-grid-3" style={{ marginTop: 28 }}>{rest.map((p, i) => <PostCard key={p.slug} post={p} i={i} />)}</div>
              ) : (
                <>
                  <div className="dg-row-head"><h2>The latest</h2></div>
                  <div className="dg-grid dg-grid-3">{rest.slice(0, 6).map((p, i) => <PostCard key={p.slug} post={p} i={i} />)}</div>
                  {cats.map((c) => {
                    const inCat = posts.filter((p) => p.category === c).slice(0, 3);
                    if (!inCat.length) return null;
                    return (
                      <div key={c}>
                        <div className="dg-row-head"><h2>{c}</h2><Link to={`/blog/category/${slugify(c)}`}>View all →</Link></div>
                        <div className="dg-grid dg-grid-3">{inCat.map((p, i) => <PostCard key={p.slug} post={p} i={i} />)}</div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Article({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const posts = usePosts();
  const local = fromStatic.find((p) => p.slug === slug);
  const [remote, setRemote] = useState<Post | null | undefined>(local ? null : undefined);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (local) return;
    fetch(`/api/blog/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setRemote(d?.post ? {
        slug, title: d.post.title, excerpt: d.post.excerpt || "", author: d.post.author || "DIGIRINGO Team",
        category: String(d.post.tags || "").split(",")[0]?.trim() || "News", date: d.post.created_at, minutes: 4, html: d.post.body, cover: d.post.cover_url,
      } : null))
      .catch(() => setRemote(null));
  }, [slug, local]);

  const post = local ?? remote ?? undefined;
  const rendered = useMemo(() => (post?.md ? renderMarkdown(post.md) : null), [post?.md]);
  const faqs = useMemo(() => (post?.md ? extractFaq(post.md) : []), [post?.md]);
  usePageMeta(post ? `${post.title} | DIGIRINGO` : undefined, post?.excerpt);

  // FAQ + Article structured data for search engines.
  useEffect(() => {
    if (!post) return;
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify([
      { "@context": "https://schema.org", "@type": "Article", headline: post.title, datePublished: post.date, author: { "@type": "Organization", name: post.author }, publisher: { "@type": "Organization", name: "DIGIRINGO" }, description: post.excerpt },
      ...(faqs.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []),
    ]);
    document.head.appendChild(ld);
    return () => ld.remove();
  }, [post, faqs]);

  // Highlight the section being read in the table of contents.
  useEffect(() => {
    if (!rendered) return;
    const els = rendered.headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActiveId(vis.target.id);
    }, { rootMargin: "-120px 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rendered]);

  if (post === undefined && remote === undefined) return <div className="dg-page-loading" />;
  if (!post) return <NotFound />;

  // Drop the FAQ section from the body — it renders as an accordion below.
  const bodyHtml = rendered ? rendered.html.split(/<h2 id="frequently-asked-questions">/)[0] : post.html ?? "";
  const related = posts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const more = related.length < 3 ? posts.filter((p) => p.slug !== post.slug && !related.includes(p)).slice(0, 3 - related.length) : [];

  return (
    <>
      <section className="dg-block" style={{ paddingTop: "calc(var(--nav-h) + clamp(30px,5vw,56px))", paddingBottom: 40 }}>
        <div className="dg-wrap" style={{ maxWidth: 1120 }}>
          <button onClick={() => navigate("/blog")} className="dg-more" style={{ background: "none", border: "none", padding: 0, marginBottom: 22, cursor: "pointer" }}>
            <ArrowLeft size={15} /> Blog
          </button>
          <div style={{ maxWidth: 820 }}>
            <Link to={`/blog/category/${slugify(post.category)}`} className="dg-post-tag">{post.category}</Link>
            <h1 className="dg-h1b" style={{ fontSize: "clamp(32px,4.6vw,52px)", marginTop: 12 }}>{post.title}</h1>
            <p className="dg-lead-b">{post.excerpt}</p>
            <div className="dg-post-meta" style={{ marginTop: 20, fontSize: 14 }}>
              <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><User size={15} /> {post.author}</span>
              <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Calendar size={15} /> {fmtDate(post.date)}</span>
              <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Clock size={15} /> {post.minutes} min read</span>
            </div>
          </div>
          {post.cover && <div style={{ marginTop: 34, borderRadius: 24, overflow: "hidden" }}><Cover post={post} big /></div>}

          <div className="dg-article" style={{ marginTop: 44 }}>
            <article
              className="dg-md"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
              onClick={(e) => {
                // Internal links inside the article body go through the router (no full reload).
                const a = (e.target as HTMLElement).closest("a");
                const href = a?.getAttribute("href") || "";
                if (!a || !href.startsWith("/") || href.startsWith("/app") || e.metaKey || e.ctrlKey) return;
                e.preventDefault();
                navigate(href);
              }}
            />
            <aside className="dg-article-side">
              {rendered && rendered.headings.length > 1 && (
                <nav className="dg-toc" aria-label="Table of contents">
                  <h6>On this page</h6>
                  {rendered.headings.filter((h) => h.id !== "frequently-asked-questions").map((h) => (
                    <a key={h.id} href={`#${h.id}`} className={activeId === h.id ? "on" : ""}>{h.text}</a>
                  ))}
                </nav>
              )}
              <div className="dg-side-cta">
                <h6>Get a business number</h6>
                <p>Local, toll-free or international. Live in a minute, from $2.50/month.</p>
                <a href="/app">Get started</a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {faqs.length > 0 && <section className="dg-block dg-tone-tint" style={{ paddingTop: 64 }}><div className="dg-wrap"><FaqList items={faqs} /></div></section>}

      <section className="dg-block">
        <div className="dg-wrap">
          <div className="dg-row-head" style={{ marginTop: 0 }}><h2>Keep reading</h2><Link to="/blog">All posts →</Link></div>
          <div className="dg-grid dg-grid-3">{[...related, ...more].map((p, i) => <PostCard key={p.slug} post={p} i={i} />)}</div>
        </div>
      </section>
    </>
  );
}

export function BlogPage() {
  const { route } = useRouter();
  const cat = route.match(/^\/blog\/category\/([a-z0-9-]+)$/);
  if (cat) return <BlogIndex category={cat[1]} />;
  const m = route.match(/^\/blog\/([a-z0-9-]+)$/);
  return m ? <Article key={m[1]} slug={m[1]} /> : <BlogIndex />;
}
