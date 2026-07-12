import { Hero } from "./hero";
import { StickyNav } from "./sticky-nav";
import { ScrollReveals } from "./scroll-reveals";
import { SectionBuilding } from "./section-building";
import { SectionWork } from "./section-work";
import { SectionLoves } from "./section-loves";
import { SectionNewsletter } from "./section-newsletter";
import type { Project } from "@/lib/notion-projects";
import type { MontyMonthlyIssue } from "@/lib/rss/substack";
import type { LoveItem } from "@/lib/notion-loves";

/**
 * ExplorativeHomepage: sketch-010 band-sequence orchestrator (Server Component).
 *
 * Band order per D-03:
 *   hero (light) -> Building (dark) -> Work (light)
 *   -> Writing / Monty Monthly (dark) -> Things I Love (light)
 * The site-wide SiteFooter (app/layout.tsx) closes the page.
 *
 * Islands mounted here:
 *   StickyNav (D-10): fixed island, z-9000, Subscribe CTA past hero fold.
 *   ScrollReveals (D-08): headless IO island toggling .in on .reveal/.slide/.shadowed.
 *
 * Motion is scroll-triggered + ambient only; no GL or heavy scroll stack (D-08).
 * page.tsx fetches the Notion data (Featured projects + latest essays) and passes
 * it down; this orchestrator stays a sync Server Component and forwards it to the
 * Work grid and Monty Monthly carousel. Both default to placeholders/fallback copy
 * when the data is absent, so the tree renders fine with no props (and in tests).
 */
type Props = {
  projects?: Project[];
  /** Latest Monty Monthly issues from the Substack RSS feed (carousel cards). */
  montyIssues?: MontyMonthlyIssue[];
  loves?: LoveItem[];
  /** Type-select option order from Notion; drives Organize-by-topic bands. */
  loveCategories?: string[];
};

export function ExplorativeHomepage({
  projects = [],
  montyIssues = [],
  loves = [],
  loveCategories = [],
}: Props) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Fixed islands: mounted first so they overlay all bands */}
      <StickyNav />
      <ScrollReveals />

      {/* Band 1: Hero (light) - Hero component owns its own section.band wrapper */}
      <Hero />

      {/* Band 2: Building (dark) */}
      <section className="band band-dark beat" id="building">
        <SectionBuilding />
      </section>

      {/* Band 4: Work (light) */}
      <section className="band beat" id="work">
        <SectionWork projects={projects} />
      </section>

      {/* Band 5: Writing / Monty Monthly (dark) */}
      <section className="band band-dark beat" id="writing">
        <SectionNewsletter issues={montyIssues} />
      </section>

      {/* Band 6: Things I Love (light) */}
      <section className="band beat" id="loves">
        <SectionLoves items={loves} categoryOrder={loveCategories} />
      </section>

      {/* Footer is the single site-wide SiteFooter, rendered by app/layout.tsx. */}
    </div>
  );
}
