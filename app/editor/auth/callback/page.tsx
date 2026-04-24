"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGitHubAuth } from "@/lib/useGitHubAuth";
import { Suspense } from "react";
import { toast } from "sonner";

function CallbackHandler() {
  console.log("CallbackHandler rendering...");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { saveToken } = useGitHubAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    console.log("Auth Callback: Received code:", code ? "YES" : "NO");

    if (!code) {
      setError("No authorization code received from GitHub.");
      return;
    }

    toast.loading("Verifying with GitHub...", {
      id: "auth-callback",
    });

    fetch(`/api/auth/github/callback?code=${code}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error_description || data.error || "Authentication failed");
        }
        return data;
      })
      .then((data) => {
        saveToken(data.access_token, data.username);
        toast.success(`Welcome back, ${data.username}!`, {
          description: "You have successfully logged in with GitHub.",
        });
        router.replace("/editor");
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Authentication failed";
        setError(message);
        toast.error("Login Failed", {
          description: message,
        });
      });
  }, [searchParams, router, saveToken]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">{error}</p>
        <a href="/editor" className="text-sm underline">
          Back to editor
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Authenticating with GitHub...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
