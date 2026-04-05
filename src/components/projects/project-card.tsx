import Link from "next/link";
import type { Project } from "@/lib/notion-projects";

export function ProjectCard({ project }: { project: Project }) {
  const coverSrc = `/api/notion-cover?pageId=${project.id}`;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-[var(--border)]" />
        )}
      </div>

      {/* Title and description */}
      <div className="p-3">
        <h3 className="text-sm font-semibold tracking-tight group-hover:text-[var(--accent)]">
          {project.emoji && <span className="mr-1">{project.emoji}</span>}{project.title}
        </h3>
        {project.description && (
          <p className="mt-1 text-xs text-[var(--fg-muted)] line-clamp-2">
            {project.description}
          </p>
        )}
        {project.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
