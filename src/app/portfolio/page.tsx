// /portfolio -- Curated portfolio of Featured projects (Phase 17.3 SC-1).
// Mirrors /projects but filters by Featured flag via getFeaturedProjects().
import { Fragment } from "react";
import type { Metadata } from "next";
import { getFeaturedProjects, type Project } from "@/lib/notion-projects";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { YearBlock } from "@/components/editorial/year-block";
import { PageHero } from "@/components/v3/page-hero";
import { Card } from "@/components/v3/card";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Portfolio | Monty Singer",
  description:
    "A selection of projects and products Monty Singer is proud of -- built through Prometheus and independent work.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio | Monty Singer",
    description:
      "A selection of projects and products Monty Singer is proud of -- built through Prometheus and independent work.",
    url: "/portfolio",
    type: "website",
  },
};

function groupProjectsByYear(projects: Project[]): Map<number, Project[]> {
  const groups = new Map<number, Project[]>();
  for (const project of projects) {
    if (!project.lastEdited) continue;
    const year = new Date(project.lastEdited).getUTCFullYear();
    if (Number.isNaN(year)) continue;
    const bucket = groups.get(year) ?? [];
    bucket.push(project);
    groups.set(year, bucket);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}

/**
 * /portfolio -- Curated portfolio of Featured projects (Phase 17.3 SC-1).
 *
 * Defensive Notion fetch -- Notion API failure renders empty-state, no crash.
 */
export default async function PortfolioPage() {
  let projects: Project[] = [];
  try {
    projects = await getFeaturedProjects();
  } catch {}

  const projectsByYear = groupProjectsByYear(projects);
  const yearEntries = [...projectsByYear.entries()];

  return (
    <>
      {/* PageHero -- v3 title block */}
      <section className="px-6 md:px-40">
        <PageHero
          title="Portfolio"
          crumb="Home / Portfolio"
          sub="A selection of projects I'm proud of -- built through Prometheus and independent work."
        />
      </section>

      <RuleStrong />

      {/* Year-grouped photo grid of cards */}
      <section className="px-6 md:px-40">
        {yearEntries.length === 0 ? (
          <p className="text-center py-12 text-[var(--color-text-muted)]">
            No featured projects yet. Check back soon.
          </p>
        ) : (
          <div className="-mx-6 md:-mx-40">
            {yearEntries.map(([year, yearProjects], i, arr) => (
              <Fragment key={year}>
                <YearBlock year={year}>
                  {/* Photo grid of Cards -- auto-fill minmax 260px */}
                  <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
                    {yearProjects.map((project) => (
                      <Card
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        title={project.title}
                        blurb={project.description}
                        kicker={project.tags?.[0]}
                        coverSrc={
                          project.image
                            ? `/api/notion-cover?pageId=${project.id}`
                            : undefined
                        }
                        coverAlt={project.image ? project.title : undefined}
                      />
                    ))}
                  </div>
                </YearBlock>
                {i < arr.length - 1 && <RuleStrong />}
              </Fragment>
            ))}
          </div>
        )}
      </section>

      <RuleStrong />
    </>
  );
}
