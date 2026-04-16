import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="font-bold text-xl tracking-tighter transition-colors group-hover:text-primary">
            blogo
          </span>
          <span className="w-2 h-2 bg-primary rounded-sm mt-1 animate-pulse" />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/blog"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/projects"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/editor"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Editor
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
