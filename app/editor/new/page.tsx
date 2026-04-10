"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/lib/useAutoSave";
import { db } from "@/lib/db";
import { PublishModal } from "@/components/Editor/PublishModal";

const EditorWrapper = dynamic(() => import("@/components/Editor/EditorWrapper"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
      Loading editor...
    </div>
  ),
});

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [editorData, setEditorData] = useState<object | null>(null);
  const [draftId, setDraftId] = useState<number | undefined>();
  const [publishOpen, setPublishOpen] = useState(false);
  const slugManuallyEdited = useRef(false);

  const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
  const meta = { slug: slug || slugify(title), title, description, tags };

  const { status } = useAutoSave(draftId, editorData, meta);

  const handleEditorChange = useCallback(
    async (data: object) => {
      setEditorData(data);
      // Create draft in DB on first change
      if (draftId === undefined) {
        const id = await db.drafts.add({
          slug: meta.slug || "untitled",
          title,
          description,
          tags,
          editorData: data,
          status: "draft",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setDraftId(id);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draftId]
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited.current) {
      setSlug(slugify(val));
    }
  };

  const draft = draftId
    ? { id: draftId, slug: meta.slug, title, description, tags, editorData: editorData ?? {} }
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
      {/* Editor area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">New Post</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : ""}
            </span>
            <Button
              size="sm"
              disabled={!draft}
              onClick={() => setPublishOpen(true)}
            >
              Publish
            </Button>
          </div>
        </div>
        <div className="border border-border rounded-lg p-6 min-h-[500px]">
          <EditorWrapper onChange={handleEditorChange} />
        </div>
      </div>

      {/* Metadata sidebar */}
      <div className="space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Post Details
        </h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="My awesome post"
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                slugManuallyEdited.current = true;
                setSlug(e.target.value);
              }}
              placeholder="my-awesome-post"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short summary of the post..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="nextjs, typescript, webdev"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Comma-separated
            </p>
          </div>
        </div>
      </div>

      {draft && (
        <PublishModal
          open={publishOpen}
          onClose={() => setPublishOpen(false)}
          draft={draft as Parameters<typeof PublishModal>[0]["draft"]}
        />
      )}
    </div>
  );
}
