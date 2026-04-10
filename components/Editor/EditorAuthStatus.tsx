"use client";

import { useGitHubAuth } from "@/lib/useGitHubAuth";
import { Button } from "@/components/ui/button";

export function EditorAuthStatus() {
  const { isAuthed, username, login, logout } = useGitHubAuth();

  if (!isAuthed) {
    return (
      <Button variant="outline" size="sm" onClick={login}>
        Connect GitHub
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{username}</span>
      <Button variant="ghost" size="sm" onClick={logout} className="text-xs">
        Disconnect
      </Button>
    </div>
  );
}
