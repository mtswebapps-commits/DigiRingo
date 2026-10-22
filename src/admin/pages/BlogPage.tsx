import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { Plus, ArrowLeft, Trash2, Edit3, Eye, EyeOff, FileText, Send, Save } from "lucide-react";
import { A, font, gradients, Card, Badge, Button, Table, Td, PageHeader, Modal, Input } from "../ui";
import {
  adminGetBlogPosts, adminCreateBlogPost, adminUpdateBlogPost, adminDeleteBlogPost,
  type BlogPost,
} from "../api";

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const fmtDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return iso; }
};

const labelStyle: CSSProperties = {
  color: A.muted, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase",
  letterSpacing: 0.6, marginBottom: 7,
};

const inputStyle: CSSProperties = {
  width: "100%", padding: "11px 14px", background: A.panelAlt,
  border: `1px solid ${A.line}`, borderRadius: 11, color: A.text,
  fontSize: 14, outline: "none", fontFamily: font.sans,
};

const EMPTY: Omit<BlogPost, "id" | "created_at" | "updated_at"> = {
  title: "", slug: "", excerpt: "", body: "", cover_url: "",
  author: "DIGIRINGO", tags: "", status: "draft",
};

export function BlogPage({ toast }: { toast: (m: string) => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminGetBlogPosts()
      .then((r) => setPosts(r.posts))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const startNew = () => {
    setEditing({ ...EMPTY, id: 0, created_at: "", updated_at: "" });
    setIsNew(true);
    setSlugManual(false);
    setPreview(false);
  };

  const startEdit = (p: BlogPost) => {
    setEditing({ ...p });
    setIsNew(false);
    setSlugManual(true);
    setPreview(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { toast("Title is required"); return; }
    setSaving(true);
    try {
      const payload = { ...editing, slug: editing.slug || toSlug(editing.title) };
      if (isNew) {
        await adminCreateBlogPost(payload);
        toast("Post created");
      } else {
        await adminUpdateBlogPost(payload);
        toast("Post updated");
      }
      setEditing(null);
      load();
    } catch (e: unknown) {
      toast((e as Error).message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      await adminDeleteBlogPost(deleteId);
      toast("Post deleted");
      setDeleteId(null);
      if (editing?.id === deleteId) setEditing(null);
      load();
    } catch (e: unknown) {
      toast((e as Error).message || "Delete failed");
    }
  };

  const patch = (fields: Partial<BlogPost>) => {
    if (!editing) return;
    const next = { ...editing, ...fields };
    if ("title" in fields && !slugManual) next.slug = toSlug(fields.title || "");
    setEditing(next);
  };

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  /* ---------------------------------------------------------------- EDITOR */
  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: A.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font.sans, marginBottom: 18,
        }}>
          <ArrowLeft size={15} /> Back to posts
        </button>

        <h1 style={{ color: A.text, fontSize: 22, fontWeight: 800, marginBottom: 20 }}>
          {isNew ? "New Post" : "Edit Post"}
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
          {/* Main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <div style={{ marginBottom: 16 }}>
                <p style={labelStyle}>Title</p>
                <input value={editing.title} onChange={(e) => patch({ title: e.target.value })}
                  placeholder="Post title..."
                  style={{ ...inputStyle, fontSize: 18, fontWeight: 700, padding: "14px 16px" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={labelStyle}>Slug</p>
                <input value={editing.slug}
                  onChange={(e) => { setSlugManual(true); patch({ slug: e.target.value }); }}
                  placeholder="post-url-slug"
                  style={{ ...inputStyle, fontFamily: font.mono, fontSize: 13 }} />
              </div>
              <div>
                <p style={labelStyle}>Excerpt</p>
                <textarea value={editing.excerpt} onChange={(e) => patch({ excerpt: e.target.value })}
                  placeholder="A short summary for cards and SEO..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </Card>

            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ ...labelStyle, marginBottom: 0 }}>Body (HTML)</p>
                <button onClick={() => setPreview(!preview)} style={{
                  display: "inline-flex", alignItems: "center", gap: 5, background: A.panelAlt,
                  border: `1px solid ${A.line}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer",
                  color: preview ? A.blue : A.muted, fontSize: 12, fontWeight: 600, fontFamily: font.sans,
                }}>
                  {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                  {preview ? "Edit" : "Preview"}
                </button>
              </div>
              {preview ? (
                <div style={{
                  background: A.panelAlt, border: `1px solid ${A.line}`, borderRadius: 11, padding: 20,
                  color: A.text, fontSize: 14, lineHeight: 1.7, minHeight: 300, overflow: "auto",
                }} dangerouslySetInnerHTML={{ __html: editing.body }} />
              ) : (
                <textarea value={editing.body} onChange={(e) => patch({ body: e.target.value })}
                  placeholder="Write your post content in HTML...&#10;&#10;Tip: Use <h2>, <p>, <ul>, <img>, etc."
                  rows={16}
                  style={{ ...inputStyle, fontFamily: font.mono, fontSize: 13, resize: "vertical", lineHeight: 1.6 }} />
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <p style={{ ...labelStyle, marginBottom: 10 }}>Status</p>
              <select value={editing.status} onChange={(e) => patch({ status: e.target.value as BlogPost["status"] })}
                style={{ ...inputStyle, cursor: "pointer", appearance: "auto" }}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={handleSave} disabled={saving} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "11px 16px", border: "none", borderRadius: 11, cursor: "pointer",
                  background: editing.status === "published" ? gradients.brand : A.panelAlt,
                  color: editing.status === "published" ? "#fff" : A.text,
                  fontSize: 13.5, fontWeight: 700, fontFamily: font.sans,
                  opacity: saving ? 0.6 : 1,
                  ...(editing.status !== "published" ? { border: `1px solid ${A.line}` } : {}),
                }}>
                  {editing.status === "published" ? <Send size={14} /> : <Save size={14} />}
                  {saving ? "Saving..." : editing.status === "published" ? "Publish" : "Save Draft"}
                </button>
              </div>
              {!isNew && (
                <button onClick={() => setDeleteId(editing.id)} style={{
                  width: "100%", marginTop: 8, padding: "9px 14px", borderRadius: 11, cursor: "pointer",
                  background: "rgba(239,68,68,0.08)", border: `1px solid rgba(239,68,68,0.2)`,
                  color: A.red, fontSize: 12.5, fontWeight: 700, fontFamily: font.sans,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <Trash2 size={13} /> Delete post
                </button>
              )}
            </Card>

            <Card>
              <Input label="Cover image URL" value={editing.cover_url} onChange={(v) => patch({ cover_url: v })} placeholder="https://..." />
              {editing.cover_url && (
                <div style={{ marginTop: 4, borderRadius: 10, overflow: "hidden", border: `1px solid ${A.line}` }}>
                  <img src={editing.cover_url} alt="Cover" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </Card>

            <Card>
              <Input label="Tags" value={editing.tags} onChange={(v) => patch({ tags: v })} placeholder="news, updates, product" />
              <Input label="Author" value={editing.author} onChange={(v) => patch({ author: v })} placeholder="DIGIRINGO" />
            </Card>
          </div>
        </div>

        {/* Delete confirm */}
        {deleteId != null && (
          <Modal title="Delete post?" onClose={() => setDeleteId(null)}>
            <p style={{ color: A.muted, fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
              This will permanently remove the post. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}><Trash2 size={14} /> Delete</Button>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  /* ---------------------------------------------------------------- LIST VIEW */
  return (
    <div>
      <PageHeader title="Blog" subtitle="Manage blog posts"
        action={<Button onClick={startNew}><Plus size={15} /> New Post</Button>} />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total posts", value: String(posts.length), accent: A.blue },
          { label: "Published", value: String(published), accent: A.green },
          { label: "Drafts", value: String(drafts), accent: A.amber },
        ].map((s) => (
          <Card key={s.label}>
            <p style={{ color: s.accent, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{s.value}</p>
            <p style={{ color: A.muted, fontSize: 12.5, marginTop: 6 }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {loading ? (
        <Card><p style={{ color: A.muted, fontSize: 13.5, textAlign: "center", padding: 20 }}>Loading posts...</p></Card>
      ) : posts.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <FileText size={40} color={A.muted} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p style={{ color: A.text, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>No posts yet</p>
            <p style={{ color: A.muted, fontSize: 13.5, marginBottom: 18 }}>Create your first blog post to get started.</p>
            <Button onClick={startNew}><Plus size={15} /> New Post</Button>
          </div>
        </Card>
      ) : (
        <Card pad={0}>
          <Table head={["Title", "Status", "Tags", "Date", "Actions"]}>
            {posts.map((p) => (
              <tr key={p.id}>
                <Td>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13.5 }}>{p.title}</p>
                    {p.excerpt && <p style={{ color: A.muted, fontSize: 12, marginTop: 3, maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.excerpt}</p>}
                  </div>
                </Td>
                <Td><Badge tone={p.status === "published" ? "green" : "amber"}>{p.status}</Badge></Td>
                <Td style={{ color: A.muted, fontSize: 12.5 }}>{p.tags || "—"}</Td>
                <Td style={{ color: A.muted, fontSize: 12.5, whiteSpace: "nowrap" }}>{fmtDate(p.updated_at || p.created_at)}</Td>
                <Td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => startEdit(p)} style={{
                      display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8,
                      border: `1px solid ${A.line}`, background: A.panelAlt, cursor: "pointer",
                      color: A.text, fontSize: 12, fontWeight: 600, fontFamily: font.sans,
                    }}><Edit3 size={12} /> Edit</button>
                    <button onClick={() => setDeleteId(p.id)} style={{
                      display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8,
                      border: `1px solid rgba(239,68,68,0.2)`, background: "rgba(239,68,68,0.06)", cursor: "pointer",
                      color: A.red, fontSize: 12, fontWeight: 600, fontFamily: font.sans,
                    }}><Trash2 size={12} /> Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Delete confirm */}
      {deleteId != null && (
        <Modal title="Delete post?" onClose={() => setDeleteId(null)}>
          <p style={{ color: A.muted, fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
            This will permanently remove the post. This action cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}><Trash2 size={14} /> Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
