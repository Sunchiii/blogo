import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/lib/posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className="transition-colors hover:border-foreground/20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-semibold text-lg group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h2>
            <time
              dateTime={post.publishedAt}
              className="text-xs text-muted-foreground whitespace-nowrap pt-1"
            >
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
