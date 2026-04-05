import Link from "next/link";
import type { Project } from "@/lib/notion-projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 transition-all duration-200 hover:border-[var(--accent)]/40 hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="text-sm font-semibold tracking-tight group-hover:text-[var(--accent)]">
        {project.emoji && <span className="mr-1.5">{project.emoji}</span>}
        {project.title}
      </h3>
      {project.description && (
        <p className="mt-1 text-xs text-[var(--fg-muted)] line-clamp-2">
          {project.description}
        </p>
      )}
    </Link>
  );
}
