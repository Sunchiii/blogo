"use client";

import { useGitHubAuth } from "@/lib/useGitHubAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { checkUserPermission, isUserWhitelisted } from "@/lib/github";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function EditorAuthStatus() {
  const { isAuthed, username, token, login, logout } = useGitHubAuth();
  const [status, setStatus] = useState<"verifying" | "authorized" | "unauthorized">("verifying");

  useEffect(() => {
    async function verify() {
      if (!isAuthed) return;
      
      try {
        // Check whitelist first (fast)
        if (username && !isUserWhitelisted(username)) {
          setStatus("unauthorized");
          return;
        }

        // Check repo permissions (requires API call)
        if (token) {
          const permission = await checkUserPermission(token);
          if (permission === "admin" || permission === "write") {
            setStatus("authorized");
          } else {
            setStatus("unauthorized");
          }
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        setStatus("unauthorized");
      }
    }

    verify();
  }, [isAuthed, username, token]);

  if (!isAuthed) {
    return (
      <Button variant="outline" size="sm" onClick={login} className="gap-2">
        <svg height="16" viewBox="0 0 16 16" width="16" className="fill-current">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        Connect GitHub
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-muted/50 px-3 py-1 rounded-full border border-border">
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Logged in as</span>
        <span className="text-xs font-semibold">{username}</span>
      </div>
      
      {status === "verifying" && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
      
      {status === "authorized" && (
        <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 px-2 py-0 h-5 text-[10px]">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      )}

      {status === "unauthorized" && (
        <Badge variant="destructive" className="gap-1 px-2 py-0 h-5 text-[10px]">
          <XCircle className="h-3 w-3" />
          No Access
        </Badge>
      )}

      <div className="h-4 w-[1px] bg-border mx-1" />
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={logout} 
        className="h-6 px-2 text-[10px] hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        Sign Out
      </Button>
    </div>
  );
}
