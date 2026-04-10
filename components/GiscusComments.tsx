"use client";

import { useEffect, useRef } from "react";

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);

  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;

  useEffect(() => {
    if (!ref.current || !repoId || !categoryId || !repo) return;
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "en");
    ref.current.appendChild(script);
  }, [repo, repoId, categoryId]);

  if (!repoId || !categoryId || !repo) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      <div ref={ref} />
    </div>
  );
}
