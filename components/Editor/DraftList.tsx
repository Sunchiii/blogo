"use client";

import { useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { formatDistanceToNow } from "date-fns";
import { db, deleteDraft } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DraftList() {
  const drafts = useLiveQuery(() => db.drafts.orderBy("updatedAt").reverse().toArray());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleDelete() {
    if (deleteId == null) return;
    await deleteDraft(deleteId);
    setDeleteId(null);
  }

  if (!drafts) {
    return <p className="text-muted-foreground">Loading drafts...</p>;
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">No drafts yet.</p>
        <Link href="/editor/new">
          <Button>Write your first post</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium truncate">
                  {draft.title || "Untitled"}
                </span>
                <Badge
                  variant={draft.status === "published" ? "default" : "secondary"}
                  className="text-xs shrink-0"
                >
                  {draft.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Saved {formatDistanceToNow(draft.updatedAt, { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Link href={`/editor/edit/${draft.slug || draft.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteId(draft.id!)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete draft?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The draft will be permanently removed
              from your local storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
