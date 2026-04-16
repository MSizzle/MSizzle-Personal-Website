import { notFound } from "next/navigation";
import { getPublishedProjects, getProjectBySlug } from "@/lib/notion-projects";
import { getBlocks } from "@/lib/notion";
import { NotionRenderer } from "@/components/notion/notion-renderer";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildProjectMetadata } from "@/lib/seo/project-metadata";
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
  if (!project) return { title: "Project Not Found | Monty Singer" };
  return buildProjectMetadata(project);
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const blocks = await getBlocks(project.id);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Works", href: "/projects" },
          { name: project.title },
        ]}
      />
      {/* Hero image — full width, above content */}
      {project.image && (
        <div className="mx-auto max-w-[66ch] px-6 pt-8 md:px-0">
          <div className="w-full overflow-hidden rounded-lg bg-[var(--muted)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/notion-cover?pageId=${project.id}`}
              alt={project.title}
              className="w-full object-contain"
            />
          </div>
        </div>
      )}

      <article className="mx-auto max-w-[66ch] px-6 pb-16 pt-8 md:px-0">
        <header className="mb-10">
        <h1 className="text-2xl font-normal tracking-tight sm:text-3xl">
          {project.emoji && <span className="mr-2">{project.emoji}</span>}
          {project.title}
        </h1>

        {project.description && (
          <p className="mt-3 opacity-80">
            {project.description}
          </p>
        )}

        {(project.tags.length > 0 || project.externalUrl) && (
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-sm opacity-75">
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
                data-umami-event="project-external-link"
                data-umami-event-title={project.title}
                className="underline transition-opacity hover:opacity-60"
              >
                View on GitHub &rarr;
              </a>
            )}
          </div>
        )}
      </header>

        <div className="prose mt-12 max-w-none">
          <NotionRenderer
            blocks={
              blocks as (BlockObjectResponse & {
                children?: BlockObjectResponse[];
              })[]
            }
          />
        </div>
      </article>
    </>
  );
}
