import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EditorAuthStatus } from "@/components/Editor/EditorAuthStatus";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { AuthGuard } from "@/components/Editor/AuthGuard";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Blog
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/editor" className="font-semibold text-sm">
              Editor
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <EditorAuthStatus />
            <Link href="/editor/new">
              <Button size="sm">New Post</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <AuthGuard>
          {children}
        </AuthGuard>
      </main>
      <PWAInstallPrompt />
    </div>
  );
}
