import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Blogo</span>
        <div className="flex items-center gap-4">
          <Link href="/api/rss" className="hover:text-foreground transition-colors">
            RSS
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
