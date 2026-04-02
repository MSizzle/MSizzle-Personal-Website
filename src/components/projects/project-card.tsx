import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/notion-projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-colors duration-200 hover:border-[var(--accent)]/50">
      {/* Thumbnail */}
      {project.image ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video w-full rounded-lg bg-[var(--border)]" />
      )}

      {/* Title — links to case study */}
      <Link
        href={`/projects/${project.slug}`}
        className="mt-4 block text-xl font-semibold tracking-tight hover:underline"
      >
        {project.title}
      </Link>

      {/* Description */}
      <p className="mt-2 text-sm text-[var(--fg-muted)] line-clamp-3">
        {project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* External link — only if externalUrl exists */}
      {project.externalUrl && (
        <a
          href={project.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
        >
          Check out more information <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
}
