import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, User, Tag, Clock } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionIntro } from "../components/ui";
import { useRouter } from "../router";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string | null;
  author: string;
  tags: string[];
  published: boolean;
  created_at: string;
}

const API = "";

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
};

const readTime = (html: string) => {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const GRAD_PLACEHOLDERS = [
  "linear-gradient(135deg, #7c5cff 0%, #a78bfa 50%, #60a5fa 100%)",
  "linear-gradient(135deg, #f472b6 0%, #a78bfa 50%, #7c5cff 100%)",
  "linear-gradient(135deg, #34d399 0%, #60a5fa 50%, #a78bfa 100%)",
  "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #7c5cff 100%)",
];

function Skeleton({ height = 200, radius = 16 }: { height?: number; radius?: number }) {
  return (
    <div
      style={{
        height,
        borderRadius: radius,
        background: "var(--line)",
        animation: "blogPulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const { navigate } = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={index * 80}>
      <article
        onClick={() => navigate(`/blog/${post.slug}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "var(--card-bg, rgba(255,255,255,0.03))",
          border: "1px solid var(--line)",
          borderRadius: 18,
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 20px 40px rgba(0,0,0,0.3)"
            : "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Cover */}
        <div
          style={{
            height: 200,
            background: post.cover
              ? `url(${post.cover}) center/cover no-repeat`
              : GRAD_PLACEHOLDERS[index % GRAD_PLACEHOLDERS.length],
            position: "relative",
          }}
        >
          {post.tags.length > 0 && (
            <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 20,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px 24px" }}>
          <h3
            style={{
              color: "var(--text)",
              fontSize: 18,
              fontWeight: 800,
              lineHeight: 1.35,
              marginBottom: 10,
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 16,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.excerpt}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "var(--muted)",
              fontSize: 12.5,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Calendar size={13} />
              {fmtDate(post.created_at)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={13} />
              {readTime(post.body)}
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function BlogListing() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/blog`)
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d) => setPosts(d.posts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section
        className="dg-section"
        style={{
          paddingTop: "calc(var(--nav-h) + clamp(40px,8vw,90px))",
          paddingBottom: 30,
        }}
      >
        <div className="dg-wrap dg-center">
          <Reveal>
            <span className="dg-eyebrow">Blog</span>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="dg-h1"
              style={{ marginTop: 22, fontSize: "clamp(36px,6vw,72px)" }}
            >
              News &amp; <span className="dg-grad-text">insights</span>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p
              className="dg-lead"
              style={{ marginTop: 22, maxWidth: 560, margin: "22px auto 0" }}
            >
              Tips, updates and stories from the DIGIRINGO team — everything you
              need to make the most of your virtual numbers.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="dg-section" style={{ paddingTop: 10 }}>
        <div className="dg-wrap">
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                gap: 24,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <Skeleton height={200} />
                  <div style={{ padding: "20px 0" }}>
                    <Skeleton height={22} radius={8} />
                    <div style={{ marginTop: 10 }}>
                      <Skeleton height={48} radius={8} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Reveal>
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px 80px",
                  color: "var(--muted)",
                }}
              >
                <p style={{ fontSize: 48, marginBottom: 16 }}>&#x1F4DD;</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
                  No posts yet
                </p>
                <p style={{ fontSize: 14, marginTop: 8 }}>
                  Check back soon — we're writing something great.
                </p>
              </div>
            </Reveal>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                gap: 24,
              }}
            >
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function SinglePost({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`${API}/api/blog/${encodeURIComponent(slug)}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => { if (d?.post) setPost(d.post); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section
        className="dg-section"
        style={{
          paddingTop: "calc(var(--nav-h) + clamp(40px,8vw,60px))",
          paddingBottom: 60,
        }}
      >
        <div className="dg-wrap" style={{ maxWidth: 820, margin: "0 auto" }}>
          <Skeleton height={24} radius={8} />
          <div style={{ marginTop: 32 }}>
            <Skeleton height={380} />
          </div>
          <div style={{ marginTop: 24 }}>
            <Skeleton height={36} radius={8} />
          </div>
          <div style={{ marginTop: 16 }}>
            <Skeleton height={200} radius={8} />
          </div>
        </div>
      </section>
    );
  }

  if (notFound || !post) {
    return (
      <section
        className="dg-section"
        style={{
          paddingTop: "calc(var(--nav-h) + clamp(40px,8vw,90px))",
          paddingBottom: 60,
        }}
      >
        <div className="dg-wrap dg-center">
          <p style={{ fontSize: 48, marginBottom: 16 }}>&#x1F50D;</p>
          <h2 className="dg-h2">Post not found</h2>
          <p className="dg-muted" style={{ marginTop: 12 }}>
            This article may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="dg-btn dg-btn-primary"
            style={{ marginTop: 24 }}
          >
            Back to blog
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        @keyframes blogPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .dg-blog-body { max-width: 720px; margin: 0 auto; color: var(--text); font-size: 16.5px; line-height: 1.8; }
        .dg-blog-body h1 { font-size: 28px; font-weight: 800; margin: 40px 0 16px; line-height: 1.3; }
        .dg-blog-body h2 { font-size: 24px; font-weight: 800; margin: 36px 0 14px; line-height: 1.3; }
        .dg-blog-body h3 { font-size: 20px; font-weight: 700; margin: 28px 0 12px; line-height: 1.35; }
        .dg-blog-body h4 { font-size: 17px; font-weight: 700; margin: 24px 0 10px; }
        .dg-blog-body p { margin: 0 0 18px; }
        .dg-blog-body a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
        .dg-blog-body a:hover { opacity: 0.8; }
        .dg-blog-body ul, .dg-blog-body ol { margin: 0 0 18px; padding-left: 24px; }
        .dg-blog-body li { margin-bottom: 8px; }
        .dg-blog-body blockquote {
          border-left: 3px solid var(--accent);
          margin: 24px 0;
          padding: 16px 20px;
          background: rgba(124,92,255,0.06);
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: var(--muted);
        }
        .dg-blog-body blockquote p { margin-bottom: 0; }
        .dg-blog-body code {
          background: rgba(124,92,255,0.1);
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 14px;
          font-family: 'JetBrains Mono', monospace;
        }
        .dg-blog-body pre {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 18px 22px;
          overflow-x: auto;
          margin: 24px 0;
          font-size: 14px;
          line-height: 1.6;
        }
        .dg-blog-body pre code { background: none; padding: 0; font-size: inherit; }
        .dg-blog-body img { max-width: 100%; border-radius: 14px; margin: 24px 0; }
        .dg-blog-body hr { border: none; border-top: 1px solid var(--line); margin: 32px 0; }
        .dg-blog-body table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14.5px; }
        .dg-blog-body th, .dg-blog-body td { padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--line); }
        .dg-blog-body th { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); }
      `}</style>

      <section
        className="dg-section"
        style={{
          paddingTop: "calc(var(--nav-h) + clamp(30px,6vw,50px))",
          paddingBottom: 60,
        }}
      >
        <div className="dg-wrap" style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <button
              onClick={() => navigate("/blog")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--muted)",
                fontSize: 14,
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginBottom: 28,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--muted)")}
            >
              <ArrowLeft size={16} /> Back to blog
            </button>
          </Reveal>

          {/* Cover */}
          {post.cover && (
            <Reveal>
              <div
                style={{
                  width: "100%",
                  maxHeight: 400,
                  borderRadius: 20,
                  overflow: "hidden",
                  marginBottom: 32,
                }}
              >
                <img
                  src={post.cover}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: 400,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </Reveal>
          )}

          {/* Header */}
          <Reveal delay={80}>
            <div style={{ marginBottom: 32 }}>
              {post.tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: "rgba(124,92,255,0.12)",
                        color: "var(--accent)",
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "5px 12px",
                        borderRadius: 20,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      <Tag size={11} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1
                className="dg-h1"
                style={{
                  fontSize: "clamp(28px,5vw,48px)",
                  lineHeight: 1.2,
                  marginBottom: 16,
                }}
              >
                {post.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  color: "var(--muted)",
                  fontSize: 14,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <User size={15} /> {post.author}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={15} /> {fmtDate(post.created_at)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={15} /> {readTime(post.body)}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Article body */}
          <Reveal delay={150}>
            <div
              className="dg-blog-body"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </Reveal>

          {/* Footer nav */}
          <Reveal delay={200}>
            <div
              style={{
                marginTop: 48,
                paddingTop: 28,
                borderTop: "1px solid var(--line)",
                textAlign: "center",
              }}
            >
              <button
                onClick={() => navigate("/blog")}
                className="dg-btn dg-btn-primary"
              >
                <ArrowLeft size={15} /> All posts
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function BlogPage() {
  const { route } = useRouter();
  const match = route.match(/^\/blog\/(.+)$/);
  const slug = match?.[1] ?? null;

  return (
    <>
      <style>{`
        @keyframes blogPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
      {slug ? <SinglePost slug={slug} /> : <BlogListing />}
    </>
  );
}
