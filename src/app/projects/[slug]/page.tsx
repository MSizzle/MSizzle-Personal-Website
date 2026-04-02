import { notFound } from "next/navigation";
import { getPublishedProjects, getProjectBySlug } from "@/lib/notion-projects";
import { getBlocks } from "@/lib/notion";
import { NotionRenderer } from "@/components/notion/notion-renderer";
import type { Metadata } from "next";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const revalidate = 1800; // 30 minutes

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — Monty Singer`,
    description: project.description || undefined,
    openGraph: {
      title: project.title,
      description: project.description || undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const blocks = await getBlocks(project.id);

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {project.title}
        </h1>

        {project.description && (
          <p className="mt-4 text-lg text-[var(--fg-muted)]">
            {project.description}
          </p>
        )}

        {(project.tags.length > 0 || project.externalUrl) && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
              >
                Visit project &rarr;
              </a>
            )}
          </div>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
        <NotionRenderer
          blocks={
            blocks as (BlockObjectResponse & {
              children?: BlockObjectResponse[];
            })[]
          }
        />
      </div>
    </article>
  );
}
