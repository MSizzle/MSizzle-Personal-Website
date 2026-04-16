import Link from "next/link";
import type { Project } from "@/lib/notion-projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border-b border-[var(--border)] py-4 transition-opacity hover:opacity-60"
    >
      <h3 className="text-base font-normal">
        {project.emoji && <span className="mr-1.5">{project.emoji}</span>}
        {project.title}
      </h3>
      {project.description && (
        <p className="mt-1 text-sm opacity-75 line-clamp-2">
          {project.description}
        </p>
      )}
    </Link>
  );
}
