import "server-only";
import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "posts");

export interface PostMeta {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  coverImage?: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => {
      const raw = fs.readFileSync(path.join(postsDir, f), "utf-8");
      return JSON.parse(raw) as PostMeta;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getPostBySlug(slug: string): { meta: PostMeta; html: string } | null {
  const jsonPath = path.join(postsDir, `${slug}.json`);
  const htmlPath = path.join(postsDir, `${slug}.html`);
  if (!fs.existsSync(jsonPath) || !fs.existsSync(htmlPath)) return null;
  const meta = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as PostMeta;
  const html = fs.readFileSync(htmlPath, "utf-8");
  return { meta, html };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
