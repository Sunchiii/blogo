"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OAUTH_STATE_KEY, useGitHubAuth } from "@/lib/useGitHubAuth";
import { Suspense } from "react";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { saveToken } = useGitHubAuth();
  const [error, setError] = useState<string | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const oauthError = searchParams.get("error_description") || searchParams.get("error");
    if (oauthError) {
      setError(oauthError);
      return;
    }

    const code = searchParams.get("code");
    if (!code) {
      setError("No authorization code received.");
      return;
    }

    const returnedState = searchParams.get("state");
    const storedState = sessionStorage.getItem(OAUTH_STATE_KEY);
    if (!returnedState || !storedState || returnedState !== storedState) {
      sessionStorage.removeItem(OAUTH_STATE_KEY);
      setError("GitHub authentication state did not match. Please try again.");
      return;
    }

    fetch(`/api/auth/github/callback?code=${encodeURIComponent(code)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        saveToken(data.access_token, data.username);
        router.replace("/editor");
      })
      .catch(() => setError("Authentication failed. Please try again."));
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
