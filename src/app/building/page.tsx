import { Fragment } from "react";
import type { Metadata } from "next";
import { getPublishedProjects, type Project } from "@/lib/notion-projects";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { YearBlock } from "@/components/editorial/year-block";
import { PageHeroBand } from "@/components/v3/page-hero-band";
import { Card } from "@/components/v3/card";

/** Deterministic badge-field rotation for the emoji-badge card faces. Cycled
 *  by list index so adjacent cards alternate ink / cream / vermilion / gray. */
const BADGE_FIELDS = ["ink", "cream", "vermilion", "gray"] as const;

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Building",
  description:
    "Projects, products, and AI systems Monty Singer is building or has built through Prometheus and independent work.",
  alternates: { canonical: "/building" },
  openGraph: {
    title: "Building",
    description:
      "Projects, products, and AI systems Monty Singer is building or has built through Prometheus and independent work.",
    url: "/building",
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
 * /building -- Works index page (ARCH-01).
 *
 * Layout (D-01 restyle over Phase 19 SC-2/SC-3):
 *   1. PageHeroBand (v3) -- full-bleed vermilion band, white headline + ink
 *      offset-shadow. Replaces the pale white-card-on-paper PageHero.
 *   2. Year-grouped projects -- YearBlock heading above a card-grid of Cards (D-03)
 *      Each card face is an EmojiBadge: the project's Notion emoji on an
 *      alternating colored field (ink/cream/vermilion/gray), title once below.
 *      Notion covers stay logo-lockups (retired as card faces in Phase 19); the
 *      emoji is the consistent per-project icon that every project carries.
 *      project.image remains in the data layer for the detail page (D-02).
 *      Grid uses Phase 19 card-grid offset-shadow treatment (SC-3).
 *   3. <RuleStrong />
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
      {/* Full-bleed vermilion hero band (D-01 restyle) -- replaces the pale
          white-card-on-paper PageHero with a high-contrast solid field. */}
      <PageHeroBand
        title="Building"
        crumb="Home / Building"
        sub="Projects, products, and AI systems I'm building or have built through Prometheus and independent work."
      />

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
                  {/* Offset-shadow card grid with vermilion hover. Cards show the
                      project's real Notion cover when it has one; projects with no
                      cover fall back to the emoji badge, then the typographic
                      TitleCard face (Card precedence: coverSrc -> badge -> title). */}
                  <div className="card-grid">
                    {yearProjects.map((project, i) => (
                      <Card
                        key={project.id}
                        href={`/building/${project.slug}`}
                        title={project.title}
                        blurb={project.description}
                        kicker={project.tags?.[0] ?? "Project"}
                        coverSrc={
                          project.cover
                            ? `/api/notion-cover?pageId=${project.id}`
                            : undefined
                        }
                        coverAlt={project.cover ? project.title : undefined}
                        badgeEmoji={project.emoji ?? undefined}
                        badgeField={BADGE_FIELDS[i % BADGE_FIELDS.length]}
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
