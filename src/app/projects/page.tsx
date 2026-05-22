import Image from "next/image";
import { Fragment } from "react";
import type { Metadata } from "next";
import { getPublishedProjects, type Project } from "@/lib/notion-projects";
import { formatMonthYear } from "@/lib/dates";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { Rule } from "@/components/editorial/rule";
import { IntroLink } from "@/components/editorial/intro-link";
import { ListRow } from "@/components/editorial/list-row";
import { YearBlock } from "@/components/editorial/year-block";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Building | Monty Singer",
  description:
    "Projects, products, and AI systems Monty Singer is building or has built — through Prometheus and independent work.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Building | Monty Singer",
    description:
      "Projects, products, and AI systems Monty Singer is building or has built — through Prometheus and independent work.",
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

export default async function BuildingPage() {
  let projects: Project[] = [];
  try {
    projects = await getPublishedProjects();
  } catch {}

  const projectsByYear = groupProjectsByYear(projects);
  const yearEntries = [...projectsByYear.entries()];

  return (
    <>
      <section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_360px] md:gap-20">
          <div>
            <div className="text-label uppercase text-muted">── The Studio · 01</div>
            <h1 className="mt-6 text-page-title uppercase text-ink">Building.</h1>
            <p className="mt-10 max-w-[35rem] text-body-lead text-muted">
              Projects, products, and AI systems I&rsquo;m building or have built — through{" "}
              <IntroLink href="https://prometheus.today" external>Prometheus</IntroLink>{" "}
              and independent work. The case studies sit beyond the catalog.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative h-[480px] w-[360px] overflow-hidden bg-rule-strong">
              <Image
                src="/MSizzle-website-photos/IMG_2129.jpeg"
                alt=""
                fill
                sizes="360px"
                className="object-cover saturate-[0.92]"
              />
            </div>
          </div>
        </div>
      </section>

      <RuleStrong />

      <section className="px-6 md:px-40">
        {yearEntries.length === 0 ? (
          <div className="py-20 md:py-32">
            <p className="text-caption text-muted">Projects coming soon.</p>
          </div>
        ) : (
          <div className="-mx-6 md:-mx-40">
            {yearEntries.map(([year, yearProjects], i, arr) => (
              <Fragment key={year}>
                <YearBlock year={year}>
                  {yearProjects.map((project) => (
                    <ListRow
                      key={project.id}
                      big
                      href={`/projects/${project.slug}`}
                      title={project.title}
                      extra={project.description}
                      meta={formatMonthYear(project.lastEdited)}
                    />
                  ))}
                </YearBlock>
                {i < arr.length - 1 && (
                  <div className="px-6 md:px-40">
                    <Rule />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </section>

      <RuleStrong />
    </>
  );
}
