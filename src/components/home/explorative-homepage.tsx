import { Hero } from "./hero";
import { StickyNav } from "./sticky-nav";
import { ScrollReveals } from "./scroll-reveals";
import { SectionBuilding } from "./section-building";
import { SectionWork } from "./section-work";
import { SectionLoves } from "./section-loves";
import { SectionNewsletter } from "./section-newsletter";
import { SectionFooter } from "./section-footer";
import type { Project } from "@/lib/notion-projects";
import type { BlogPost } from "@/lib/notion";

/**
 * ExplorativeHomepage: sketch-010 band-sequence orchestrator (Server Component).
 *
 * Band order per D-03:
 *   hero (light) -> Building (dark) -> Work (light)
 *   -> Things I Love (dark) -> Writing (light) -> footer (dark)
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
type Props = { projects?: Project[]; posts?: BlogPost[] };

export function ExplorativeHomepage({ projects = [], posts = [] }: Props) {
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

      {/* Band 5: Things I Love (dark) */}
      <section className="band band-dark beat" id="loves">
        <SectionLoves />
      </section>

      {/* Band 6: Writing / Monty Monthly (light) */}
      <section className="band beat" id="writing">
        <SectionNewsletter posts={posts} />
      </section>

      {/* Band 7: Footer (dark) */}
      <section className="band band-dark">
        <SectionFooter />
      </section>
    </div>
  );
}
