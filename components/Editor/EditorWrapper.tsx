"use client";

import { useEffect, useRef } from "react";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (data: any) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export default function EditorWrapper({
  initialData,
  onChange,
  readOnly = false,
  placeholder = "Start writing your post...",
}: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  // Use a ref for onChange to avoid stale closure issues
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!holderRef.current) return;

    let destroyed = false;
    let editor: { destroy?: () => void } | null = null;

    const init = async () => {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const { EDITOR_TOOLS } = await import("./tools");

      if (destroyed) return;

      editor = new EditorJS({
        holder: holderRef.current!,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: EDITOR_TOOLS as any,
        data: initialData,
        readOnly,
        placeholder,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange: async (api: any) => {
          const data = await api.saver.save();
          onChangeRef.current(data);
        },
      });
    };

    init();

    return () => {
      destroyed = true;
      editor?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={holderRef}
      className="min-h-[400px] prose prose-neutral dark:prose-invert max-w-none [&_.ce-block]:py-0.5 [&_.codex-editor]:outline-none"
    />
  );
}
