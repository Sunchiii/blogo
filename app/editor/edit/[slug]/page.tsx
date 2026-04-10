"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, use } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/lib/useAutoSave";
import { getDraftBySlug, type Draft } from "@/lib/db";
import { PublishModal } from "@/components/Editor/PublishModal";

const EditorWrapper = dynamic(() => import("@/components/Editor/EditorWrapper"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
      Loading editor...
    </div>
  ),
});

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [editorData, setEditorData] = useState<object | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDraftBySlug(slug).then((d) => {
      if (d) {
        setDraft(d);
        setTitle(d.title);
        setDescription(d.description);
        setTagsInput(d.tags.join(", "));
        setEditorData(d.editorData);
      }
      setLoading(false);
    });
  }, [slug]);

  const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
  const meta = { slug, title, description, tags };

  const { status } = useAutoSave(draft?.id, editorData, meta);

  const handleEditorChange = useCallback((data: object) => {
    setEditorData(data);
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading draft...</p>;
  }

  if (!draft) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Draft not found.</p>
      </div>
    );
  }

  const publishDraft = {
    id: draft.id!,
    slug,
    title,
    description,
    tags,
    editorData: editorData ?? draft.editorData,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Edit Post</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : ""}
            </span>
            <Button size="sm" onClick={() => setPublishOpen(true)}>
              Publish
            </Button>
          </div>
        </div>
        <div className="border border-border rounded-lg p-6 min-h-[500px]">
          {editorData !== null && (
            <EditorWrapper
              initialData={editorData as { blocks: object[] }}
              onChange={handleEditorChange}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Post Details
        </h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={slug} disabled className="text-muted-foreground" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="nextjs, typescript"
            />
            <p className="text-xs text-muted-foreground mt-1">Comma-separated</p>
          </div>
        </div>
      </div>

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        draft={publishDraft}
      />
    </div>
  );
}
