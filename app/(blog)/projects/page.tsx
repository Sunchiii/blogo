import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built.",
};

const projects = [
  {
    name: "Blogo",
    description:
      "A local-first, GitHub-powered dev blog with an in-browser Editor.js CMS. No backend, no database.",
    tags: ["nextjs", "pwa", "editor.js"],
    url: "https://github.com",
    status: "active",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground">Things I&apos;ve built.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="h-full transition-colors hover:border-foreground/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold group-hover:text-primary transition-colors">
                    {project.name}
                  </h2>
                  <Badge variant={project.status === "active" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
