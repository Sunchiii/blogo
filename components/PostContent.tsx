"use client";

import { useEffect, useRef, useState } from "react";
import "highlight.js/styles/github-dark-dimmed.css";

export function PostContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [safeHtml, setSafeHtml] = useState("");

  // Sanitize with DOMPurify (client-only — window required)
  useEffect(() => {
    import("dompurify").then(({ default: DOMPurify }) => {
      setSafeHtml(DOMPurify.sanitize(html));
    });
  }, [html]);

  // Syntax highlight after sanitized HTML is injected
  useEffect(() => {
    if (!safeHtml || !ref.current) return;
    import("highlight.js").then(({ default: hljs }) => {
      ref.current!.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    });
  }, [safeHtml]);

  return (
    <div
      ref={ref}
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
