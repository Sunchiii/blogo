"use client";

import { useGitHubAuth } from "@/lib/useGitHubAuth";
import { isUserWhitelisted, checkUserPermission } from "@/lib/github";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthed, username, token, login } = useGitHubAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function verify() {
      // Allow these paths to bypass the "isAuthed" check during the flow
      const isCallbackPath = pathname === "/editor/auth/callback";
      const isUnauthorizedPath = pathname === "/editor/unauthorized";

      if (!isAuthed && !isCallbackPath) {
        setIsVerifying(false);
        return;
      }

      if (isCallbackPath || isUnauthorizedPath) {
        setIsVerifying(false);
        setIsAuthorized(true);
        return;
      }

      try {
        const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
        console.log(`[AuthGuard] Verifying user: ${username} for repo: ${repo}`);
        
        // 1. Check Whitelist first (fast)
        if (username && !isUserWhitelisted(username)) {
          console.warn(`[AuthGuard] User ${username} not in whitelist. Allowed: ${process.env.NEXT_PUBLIC_ALLOWED_USERS}`);
          setIsAuthorized(false);
          router.replace("/editor/unauthorized");
          return;
        }

        // 2. Check Repo Permissions
        if (token) {
          const permission = await checkUserPermission(token);
          console.log(`[AuthGuard] Permission for ${username}: ${permission}`);
          
          if (permission === "admin" || permission === "write") {
            setIsAuthorized(true);
          } else {
            console.warn(`[AuthGuard] User ${username} has insufficient permission: ${permission}`);
            setIsAuthorized(false);
            router.replace("/editor/unauthorized");
          }
        }
      } catch (error) {
        console.error("Verification failed:", error);
        // Fallback: allow access if check fails but logged in (to allow drafting)
        // or stay strict depending on requirements.
        // For now, let's be strict if the check actually fails.
        setIsAuthorized(false);
        router.replace("/editor/unauthorized");
      } finally {
        setIsVerifying(false);
      }
    }

    verify();
  }, [isAuthed, username, token, router, pathname]);

  if (pathname === "/editor/unauthorized" || pathname === "/editor/auth/callback") {
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
          <Button onClick={login} className="gap-2">
            <svg height="18" viewBox="0 0 16 16" width="18" className="fill-current">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            Connect GitHub
          </Button>
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
    return null; // Redirecting...
  }

  return <>{children}</>;
}
