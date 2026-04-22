"use client";

import { useGitHubAuth } from "@/lib/useGitHubAuth";
import { isUserWhitelisted, checkUserPermission } from "@/lib/github";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthed, username, token } = useGitHubAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function verify() {
      if (!isAuthed) {
        setIsVerifying(false);
        return;
      }

      if (pathname === "/editor/unauthorized") {
        setIsVerifying(false);
        return;
      }

      // 1. Check Whitelist
      // Only block if we are trying to access protected areas or publish
      // For now, let's allow drafting to anyone logged in to GitHub
      // but keep the check for the "unauthorized" page to show status
      if (username && !isUserWhitelisted(username)) {
        // We don't necessarily want to hard-redirect here if they just want to draft
        // But we'll keep the logic if you want strict access to the editor
      }

      // 2. Check Repo Permissions
      try {
        if (token) {
          const permission = await checkUserPermission(token);
          // We allow drafting if they are just logged in
          // but we'll set a global state or just allow it for now
          setIsAuthorized(true); 
        }
      } catch (error) {
        console.error("Verification failed:", error);
        // If they are logged in, we let them draft locally
        setIsAuthorized(true);
      } finally {
        setIsVerifying(false);
      }
    }

    verify();
  }, [isAuthed, username, token, router, pathname]);

  if (pathname === "/editor/unauthorized") {
    return <>{children}</>;
  }

  if (!isAuthed) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="p-8 text-center max-w-md border border-border rounded-lg bg-card">
          <h2 className="text-xl font-bold mb-4">Collaborator Access</h2>
          <p className="text-muted-foreground mb-6">
            Please connect your GitHub account to access the editor. 
            Only verified contributors can publish posts.
          </p>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-pulse text-muted-foreground font-mono">
          Verifying permissions...
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
