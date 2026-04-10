import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { PostContent } from "@/components/PostContent";
import { GiscusComments } from "@/components/GiscusComments";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const ogImageUrl = `/og?title=${encodeURIComponent(post.meta.title)}&description=${encodeURIComponent(post.meta.description)}`;

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.publishedAt,
      modifiedTime: post.meta.updatedAt,
      tags: post.meta.tags,
      images: [ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      images: [ogImageUrl],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, html } = post;

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold leading-tight">{meta.title}</h1>
        <p className="text-lg text-muted-foreground">{meta.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
          <time dateTime={meta.publishedAt}>
            Published {formatDate(meta.publishedAt)}
          </time>
          {meta.updatedAt !== meta.publishedAt && (
            <span>· Updated {formatDate(meta.updatedAt)}</span>
          )}
        </div>
      </header>

      <PostContent html={html} />

      <GiscusComments />
    </article>
  );
}
