import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

export const metadata = {
  title: "Blog",
  description: "All posts about software engineering, self-hosting, and building things.",
};

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const allPosts = getAllPosts();
  const allTags = getAllTags();
  const posts = tag ? allPosts.filter((p) => p.tags.includes(tag)) : allPosts;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground">
          {allPosts.length} post{allPosts.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link href="/blog">
            <Badge variant={!tag ? "default" : "secondary"} className="cursor-pointer">
              All
            </Badge>
          </Link>
          {allTags.map((t) => (
            <Link key={t} href={`/blog?tag=${t}`}>
              <Badge variant={tag === t ? "default" : "secondary"} className="cursor-pointer">
                {t}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts found{tag ? ` for tag "${tag}"` : ""}.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
