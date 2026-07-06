import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedProjects, getProjectBySlug } from "@/lib/notion-projects";
import { getBlocks } from "@/lib/notion";
import { NotionRenderer } from "@/components/notion/notion-renderer";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHero } from "@/components/v3/page-hero";
import { buildProjectMetadata } from "@/lib/seo/project-metadata";
import type { Metadata } from "next";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const revalidate = 1800; // 30 minutes

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_PROJECTS_DATABASE_ID) {
    return [];
  }
  try {
    const projects = await getPublishedProjects();
    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return buildProjectMetadata(project);
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const blocks = await getBlocks(project.id);

  return (
    <>
      {/* Full-bleed cover image (D-02) — only when project.cover (Notion cover) exists */}
      {project.cover && (
        <div className="relative w-full h-[400px] md:h-[600px]">
          <Image
            src={`/api/notion-cover?pageId=${project.id}`}
            alt={`${project.title} cover`}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Semantic breadcrumb nav + JSON-LD (sr-only); Building points to /projects */}
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Building", href: "/projects" },
          { name: project.title },
        ]}
      />

      {/* PageHero: breadcrumb line + title */}
      <div className="px-6 md:px-40">
        <PageHero
          title={project.title}
          crumb="Home / Building"
          sub={project.description ?? ""}
        />
      </div>

      {/* Optional external project link */}
      {project.externalUrl && (
        <div className="px-6 md:px-40">
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="project-external-link"
            data-umami-event-title={project.title}
            className="inline-block mt-4 px-0 text-[var(--accent)] underline hover:text-[var(--accent-hover)]"
          >
            View Project ↗
          </a>
        </div>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="px-6 md:px-40 mt-4 flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <span key={tag} className="text-sm text-[var(--color-text-muted)]">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Prose section (IN-01/IN-02) — NotionRenderer is UNCHANGED */}
      <article className="mx-auto max-w-[68ch] px-6 pb-16 pt-8 md:px-0">
        <div className="prose max-w-none">
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
