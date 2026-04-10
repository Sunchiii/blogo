"use client";

import { useState } from "react";
import Link from "next/link";
import { publishFile } from "@/lib/github";
import { db } from "@/lib/db";
import { useGitHubAuth } from "@/lib/useGitHubAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PublishDraft {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  editorData: object;
}

type PublishStatus = "idle" | "converting" | "pushing" | "done" | "error";

export function PublishModal({
  open,
  onClose,
  draft,
}: {
  open: boolean;
  onClose: () => void;
  draft: PublishDraft;
}) {
  const { token, isAuthed, login } = useGitHubAuth();
  const [status, setStatus] = useState<PublishStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handlePublish() {
    if (!token) return;

    try {
      setStatus("converting");

      // Dynamically import to avoid SSR issues
      const edjsHTML = (await import("editorjs-html")).default;
      const parser = edjsHTML();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parseResult = parser.parse(draft.editorData as any);
      const htmlBlocks: string[] = Array.isArray(parseResult) ? parseResult : [parseResult as string];
      const html = htmlBlocks.join("\n");

      const meta = {
        title: draft.title,
        slug: draft.slug,
        description: draft.description,
        tags: draft.tags,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setStatus("pushing");

      await publishFile(
        `posts/${draft.slug}.html`,
        html,
        `post: publish ${draft.slug}`,
        token
      );
      await publishFile(
        `posts/${draft.slug}.json`,
        JSON.stringify(meta, null, 2),
        `post: metadata ${draft.slug}`,
        token
      );

      // Update local draft status
      await db.drafts.update(draft.id, { status: "published", updatedAt: new Date() });

      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function handleClose() {
    setStatus("idle");
    setErrorMsg("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish to GitHub</DialogTitle>
          <DialogDescription>
            This will push your post as HTML and JSON to your GitHub repository.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Post summary */}
          <div className="rounded-lg border border-border p-4 space-y-2">
            <p className="font-medium">{draft.title || "Untitled"}</p>
            <p className="text-sm text-muted-foreground">{draft.description}</p>
            <div className="flex flex-wrap gap-1">
              {draft.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              posts/{draft.slug}.html
            </p>
          </div>

          {/* Auth state */}
          {!isAuthed && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">
                You need to connect GitHub first.
              </p>
              <Button size="sm" onClick={login}>
                Connect GitHub
              </Button>
            </div>
          )}

          {/* Status messages */}
          {status === "converting" && (
            <p className="text-sm text-muted-foreground">Converting to HTML...</p>
          )}
          {status === "pushing" && (
            <p className="text-sm text-muted-foreground">Pushing to GitHub...</p>
          )}
          {status === "done" && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
              <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                Published successfully!
              </p>
              <Link href={`/blog/${draft.slug}`} target="_blank">
                <Button size="sm" variant="outline">
                  View post →
                </Button>
              </Link>
            </div>
          )}
          {status === "error" && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 space-y-2">
              {errorMsg.includes("Resource not accessible by integration") ? (
                <>
                  <p className="text-sm font-medium text-destructive">
                    GitHub OAuth App blocked by organization
                  </p>
                  <p className="text-sm text-destructive/80">
                    If your repository belongs to a GitHub organization, an admin must
                    approve this OAuth App before it can write to org repos.
                  </p>
                  <ol className="text-sm text-destructive/80 list-decimal list-inside space-y-1">
                    <li>Go to your org → Settings → Third-party Access → OAuth Apps</li>
                    <li>Find and approve this app, or ask an org admin to do so</li>
                    <li>Re-authenticate and try again</li>
                  </ol>
                  <p className="text-sm text-destructive/80">
                    Alternatively, point{" "}
                    <code className="font-mono text-xs">NEXT_PUBLIC_GITHUB_REPO</code>{" "}
                    at a personal repository you own.
                  </p>
                </>
              ) : (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {status === "done" ? "Close" : "Cancel"}
          </Button>
          {status !== "done" && (
            <Button
              onClick={handlePublish}
              disabled={!isAuthed || status === "converting" || status === "pushing"}
            >
              {status === "converting" || status === "pushing"
                ? "Publishing..."
                : "Publish to GitHub"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
