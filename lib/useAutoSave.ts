"use client";

import { useEffect, useRef, useState } from "react";
import { db, type Draft } from "@/lib/db";

type SaveStatus = "idle" | "saving" | "saved";

interface DraftMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

export function useAutoSave(
  draftId: number | undefined,
  editorData: object | null,
  meta: DraftMeta
) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!editorData) return;

    setStatus("saving");

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const now = new Date();
        const draftData: Omit<Draft, "id"> & { id?: number } = {
          ...meta,
          editorData,
          status: "draft",
          createdAt: now,
          updatedAt: now,
        };
        if (draftId !== undefined) {
          draftData.id = draftId;
          // Preserve original createdAt
          const existing = await db.drafts.get(draftId);
          if (existing) draftData.createdAt = existing.createdAt;
        }
        await db.drafts.put(draftData);
        setStatus("saved");
      } catch {
        setStatus("idle");
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [editorData, meta, draftId]);

  return { status };
}
