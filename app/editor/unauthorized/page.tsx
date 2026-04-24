"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGitHubAuth } from "@/lib/useGitHubAuth";

export default function UnauthorizedPage() {
  const { username } = useGitHubAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 text-center border border-border rounded-lg bg-card">
        <h1 className="text-2xl font-bold mb-4 text-primary">Access Denied</h1>
        <p className="mb-2 text-muted-foreground">
          It looks like you're logged in as <span className="font-bold text-foreground">@{username || "unknown"}</span>, 
          but you haven't been verified as a contributor yet.
        </p>
        <p className="mb-6 text-sm text-muted-foreground italic">
          (If this is not your intended account, please sign out and try again)
        </p>
        
        <div className="space-y-4 mb-8 text-left bg-muted/50 p-4 rounded-lg">
          <h2 className="font-semibold">How to become a contributor:</h2>
          <ol className="list-decimal ml-4 space-y-2 text-sm">
            <li>
              Open a new <strong>Discussion</strong> or <strong>Issue</strong> on our GitHub repository.
            </li>
            <li>
              Introduce yourself and share what topics you'd like to write about.
            </li>
            <li>
              Once approved, we'll add your GitHub username to the verified list!
            </li>
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild>
            <a 
              href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_REPO}/issues/new`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request Access on GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
