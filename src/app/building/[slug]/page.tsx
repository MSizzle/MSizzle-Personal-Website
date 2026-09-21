import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { getPublishedProjects, getProjectBySlug } from "@/lib/notion-projects";
import { getBlocks } from "@/lib/notion";
import { NotionRenderer } from "@/components/notion/notion-renderer";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero, PageCrumb } from "@/components/v3/page-hero";
import { buildProjectMetadata } from "@/lib/seo/project-metadata";
import { buildProjectSchema } from "@/lib/seo/schemas";
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

  // One project, one URL. Notion's slug filter is case-insensitive, so
  // /building/Gene-own used to render the same page as /building/gene-own and
  // both could be indexed. Send the mixed-case form to the canonical one
  // before spending a Notion call on it (260921-ed0).
  if (slug !== slug.toLowerCase()) {
    permanentRedirect(`/building/${slug.toLowerCase()}`);
  }

  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const blocks = await getBlocks(project.id);

  return (
    <>
      {/* CreativeWork markup: name, description, author, cover, tags, and the
          project's own URL. Project pages previously emitted only the
          breadcrumb below (260921-ed0). */}
      <JsonLd
        data={buildProjectSchema({
          title: project.title,
          slug: project.slug,
          description: project.description,
          coverPageId: project.cover ? project.id : null,
          lastEdited: project.lastEdited,
          tags: project.tags,
          externalUrl: project.externalUrl,
        })}
      />

      {/* With a cover the crumb leads, then the cover, then the title sits
          flush against the cover's bottom edge. Without one the crumb stays
          inside PageHero and keeps the standing top padding. */}
      {project.cover && (
        <div className="px-6 pt-10 md:px-40 md:pt-16">
          <PageCrumb>Home / Building</PageCrumb>
        </div>
      )}

      {/* Inset cover image (D-02) — only when project.cover (Notion cover) exists */}
      {project.cover && (
        <div className="relative mx-6 h-[400px] border border-[var(--color-border-strong)] md:mx-40 md:h-[600px]">
          {/* unoptimized (260723-g2q Task 4, see card-cover.tsx for the full
              reasoning): /api/notion-cover already resizes/webp-encodes
              server-side, so Next's optimizer would just do that work again. */}
          <Image
            src={`/api/notion-cover?pageId=${project.id}`}
            alt={`${project.title} cover`}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Semantic breadcrumb nav + JSON-LD (sr-only); Building points to /building */}
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Building", href: "/building" },
          { name: project.title },
        ]}
      />

      {/* PageHero: breadcrumb line + title */}
      <div className="px-6 md:px-40">
        <PageHero
          title={project.title}
          crumb={project.cover ? undefined : "Home / Building"}
          sub={project.description ?? ""}
          flush={Boolean(project.cover)}
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
            className="inline-block mt-4 px-0 text-text underline"
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
