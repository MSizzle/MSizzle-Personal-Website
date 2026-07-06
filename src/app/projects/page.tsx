import { Fragment } from "react";
import type { Metadata } from "next";
import { getPublishedProjects, type Project } from "@/lib/notion-projects";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { YearBlock } from "@/components/editorial/year-block";
import { PageHero } from "@/components/v3/page-hero";
import { Card } from "@/components/v3/card";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Building",
  description:
    "Projects, products, and AI systems Monty Singer is building or has built through Prometheus and independent work.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Building",
    description:
      "Projects, products, and AI systems Monty Singer is building or has built through Prometheus and independent work.",
    url: "/projects",
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
 * /projects -- Works index page (ARCH-01).
 *
 * Layout per D-01..D-04 (16-04) + Phase 19 SC-2/SC-3:
 *   1. PageHero (v3) -- replaces old two-column atmosphere-photo title block
 *   2. <RuleStrong />
 *   3. Year-grouped projects -- YearBlock heading above a card-grid of Cards (D-03)
 *      Every card face is the Card's automatic TitleCard fallback (Phase 19 decision):
 *      logo-lockup Notion covers are retired as card faces; every /projects card is
 *      always a typographic title-card. Deterministic paper/ink alternation by index.
 *      project.image remains in the data layer for the detail page (D-02).
 *      Grid uses Phase 19 card-grid offset-shadow treatment (SC-3).
 *   4. <RuleStrong />
 *
 * Defensive Notion fetch -- Notion API failure renders empty-state, no crash. (T-16-07)
 */
export default async function BuildingPage() {
  let projects: Project[] = [];
  try {
    projects = await getPublishedProjects();
  } catch {}

  const projectsByYear = groupProjectsByYear(projects);
  const yearEntries = [...projectsByYear.entries()];

  return (
    <>
      {/* PageHero -- v3 title block (replaces atmosphere-photo two-column grid) */}
      <section className="px-6 md:px-40">
        <PageHero
          title="Building"
          crumb="Home / Building"
          sub="Projects, products, and AI systems I'm building or have built through Prometheus and independent work."
        />
      </section>

      <RuleStrong />

      {/* Year-grouped card grid of projects (D-03, Phase 19 SC-2/SC-3) */}
      <section className="px-6 md:px-40">
        {yearEntries.length === 0 ? (
          <p className="text-center py-12 text-[var(--color-text-muted)]">
            No projects yet. Check back soon.
          </p>
        ) : (
          <div className="-mx-6 md:-mx-40">
            {yearEntries.map(([year, yearProjects], i, arr) => (
              <Fragment key={year}>
                <YearBlock year={year}>
                  {/* Phase 19 SC-3: offset-shadow card grid with vermilion hover.
                      Phase 19 SC-2: always-title-card faces (no cover props passed)
                      so every project card is the typographic TitleCard face. */}
                  <div className="card-grid">
                    {yearProjects.map((project, i) => (
                      <Card
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        title={project.title}
                        blurb={project.description}
                        kicker={project.tags?.[0] ?? "Project"}
                        titleCardField={i % 2 === 0 ? "paper" : "ink"}
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
