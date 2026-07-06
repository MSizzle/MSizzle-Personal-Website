import Link from "next/link";
import { RailBox } from "@/components/home/rail-box";
import { Photo } from "@/components/home/photo";
import type { Project } from "@/lib/notion-projects";

/**
 * SectionWork: Selected work beat (D-03/D-05/D-07).
 * Returns beat CONTENT only (div.wrap > div.beat-grid).
 * The orchestrator (Plan 08) supplies the outer .band section + id="work".
 * Server Component only; no client directive.
 * D-03: token classes only auto-invert with the enclosing band variant.
 * D-05: RailBox index 02, label "Selected work".
 * D-07: 2x2 work-grid of slide-in photos alternating from-left/from-right.
 * D-13 (Phase-17.3 invariants preserved):
 *   - /portfolio link present with "SELECTED" kicker
 *   - no link to the projects page
 *   - Prometheus external anchor keeps rel="noopener noreferrer"
 *
 * `projects` is fetched by the async parent (page.tsx) so this stays a sync
 * component: the first four Featured Notion projects fill the 2x2 grid with
 * their real cover images (via the /api/notion-cover proxy). Missing covers or
 * an empty list fall back to the styled placeholder blocks (Notion-down safe).
 */
type Props = { projects?: Project[] };

function captionFor(project: Project | undefined, index: number): string {
  if (!project) return `Selected work · 0${index + 1}`;
  const year = project.lastEdited
    ? new Date(project.lastEdited).getUTCFullYear()
    : undefined;
  const tag = project.tags?.[0];
  return [project.title, tag, year].filter(Boolean).join(" · ");
}

export function SectionWork({ projects = [] }: Props) {
  // Always render a 2x2 grid; fill empty cells with placeholders.
  const cells = Array.from({ length: 4 }, (_, i) => projects[i]);

  return (
    <div className="wrap">
      <div className="beat-grid">
        {/* Left rail */}
        <div className="reveal">
          <RailBox num="02" label="Selected work" />
        </div>

        {/* Right column: headline, 2x2 work grid, portfolio link */}
        <div>
          <h2 className="reveal">Some of the work I am proudest of.</h2>

          {/* 2x2 grid of slide-in photos alternating from-left / from-right */}
          <div className="work-grid">
            {cells.map((project, i) => (
              <div
                key={project?.id ?? `placeholder-${i}`}
                className={`shadowed slide ${i % 2 === 0 ? "from-left" : "from-right"}`}
              >
                <Photo
                  aspectRatio="3/2.2"
                  src={
                    project?.cover
                      ? `/api/notion-cover?pageId=${project.id}`
                      : undefined
                  }
                  alt={project?.cover ? project.title : undefined}
                  caption={captionFor(project, i)}
                />
              </div>
            ))}
          </div>

          {/* Projects affordance: consolidated from /portfolio (issue 7) */}
          <Link href="/projects" className="mt-8 inline-flex items-center gap-2 text-text">
            <span>Projects</span>
            <span className="font-mono text-xs tracking-widest text-text-muted">SELECTED</span>
          </Link>

          {/* External Prometheus link: T-17.1-02 invariant (rel=noopener noreferrer preserved) */}
          <p className="body mt-4 text-text-dim">
            There is more of it over at{" "}
            <a
              href="https://prometheus.today"
              target="_blank"
              rel="noopener noreferrer"
              className="inline"
            >
              Prometheus
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
