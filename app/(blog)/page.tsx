import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { PixelPanel } from "@/components/PixelPanel";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="space-y-12">
      <PixelPanel />

      <section className="py-4">
        <h1 className="text-3xl font-bold mb-2">Hi, I&apos;m a dev blogger</h1>
        <p className="text-muted-foreground text-lg">
          I write about software engineering, self-hosting, and building things.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Latest Posts</h2>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
