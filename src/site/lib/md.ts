/**
 * Minimal Markdown → HTML for the site's own blog posts (src/site/content/blog).
 * Supports exactly the subset those files use: ## / ### headings, paragraphs,
 * - and 1. lists, pipe tables, > callouts, **bold**, *italic*, [links](url).
 * Everything is HTML-escaped first, so post text can't inject markup.
 */
export interface PostMeta {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  date: string;
  author: string;
}

export interface Heading { id: string; text: string }

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const slugify = (s: string) =>
  s.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
      const safe = /^(\/|https?:\/\/|mailto:)/.test(href) ? href : "#";
      const ext = /^https?:/.test(safe) ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${safe}"${ext}>${text}</a>`;
    });
}

const cellsOf = (line: string) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

/** Split `---` front matter from the body. */
export function parsePost(raw: string): { meta: PostMeta; body: string } {
  const m = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  if (m) for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return {
    meta: {
      title: meta.title || "", slug: meta.slug || "", category: meta.category || "Guides",
      excerpt: meta.excerpt || "", date: meta.date || "", author: meta.author || "DIGIRINGO Team",
    },
    body: m ? m[2] : raw,
  };
}

/** Render the body; returns HTML plus the ## headings for a table of contents. */
export function renderMarkdown(md: string): { html: string; headings: Heading[] } {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  const headings: Heading[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length, text = h[2].trim(), id = slugify(text);
      if (level === 2) headings.push({ id, text });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++; continue;
    }
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote><p>${inline(buf.join(" "))}</p></blockquote>`);
      continue;
    }
    if (/^\|/.test(line) && /^\|?\s*:?-{2,}/.test(lines[i + 1] || "")) {
      const head = cellsOf(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(cellsOf(lines[i++]));
      out.push(`<div class="dg-md-table"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    const li = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (li) {
      const ordered = /\d/.test(li[2]);
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*([-*]|\d+\.)\s+(.*)$/);
        if (!m || /\d/.test(m[1]) !== ordered) break;
        items.push(m[2]); i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s/.test(lines[i])) items[items.length - 1] += " " + lines[i++].trim();
      }
      const tag = ordered ? "ol" : "ul";
      const start = ordered ? parseInt(li[2], 10) : 1;
      out.push(`<${tag}${start > 1 ? ` start="${start}"` : ""}>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</${tag}>`);
      continue;
    }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,4}\s|>|\||\s*([-*]|\d+\.)\s)/.test(lines[i])) buf.push(lines[i++].trim());
    if (!buf.length) { buf.push(lines[i++].trim()); }
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return { html: out.join("\n"), headings };
}

/** FAQ pairs from a "Frequently asked questions" section (### question + answer paragraphs). */
export function extractFaq(md: string): { q: string; a: string }[] {
  const at = md.search(/^##\s+Frequently asked questions/im);
  if (at < 0) return [];
  const rest = md.slice(at).split("\n").slice(1);
  const faqs: { q: string; a: string }[] = [];
  for (const line of rest) {
    if (/^##\s/.test(line)) break;
    const q = line.match(/^###\s+(.*)$/);
    if (q) faqs.push({ q: q[1].trim(), a: "" });
    else if (faqs.length && line.trim()) faqs[faqs.length - 1].a += (faqs[faqs.length - 1].a ? " " : "") + line.trim();
  }
  return faqs.map((f) => ({ q: f.q, a: f.a.replace(/\*\*|\*|\[([^\]]+)\]\([^)]+\)/g, "$1") }));
}
