import { parsePost, type PostMeta } from "../lib/md";

/**
 * The site's own articles: one Markdown file per post in ./blog, with front
 * matter (title, slug, category, excerpt, date, author). Bundled into the blog
 * page's lazy chunk, so the rest of the site doesn't pay for them.
 */
const files = import.meta.glob("./blog/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export interface StaticPost extends PostMeta { body: string; words: number }

export const STATIC_POSTS: StaticPost[] = Object.values(files)
  .map((raw) => {
    const { meta, body } = parsePost(raw);
    return { ...meta, body, words: body.split(/\s+/).filter(Boolean).length };
  })
  .filter((p) => p.slug && p.title)
  .sort((a, b) => b.date.localeCompare(a.date));

export const POST_CATEGORIES = [...new Set(STATIC_POSTS.map((p) => p.category))].sort();
