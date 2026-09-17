import { Hero } from "./hero";
import { ScrollReveals } from "./scroll-reveals";
import { LovesTeaser } from "./loves-teaser";
import { SectionBuilding } from "./section-building";
import { SectionWriting } from "./section-writing";
import { SectionLoves } from "./section-loves";
import type { Project } from "@/lib/notion-projects";
import type { BlogPost } from "@/lib/notion";
import type { LoveItem } from "@/lib/notion-loves";
import { homepageAccentOffsets } from "@/lib/homepage-rows";

/**
 * ExplorativeHomepage: mono homepage orchestrator (Server Component).
 *
 * Band order (HP-04): Hero -> 01 Building -> 02 Writing -> 03 Things I Love,
 * all on one continuous bone ground -- no dark-ground class anywhere. Building
 * and Writing each render their own <section> wrapper internally; only Things
 * I Love needs an orchestrator-level wrapper (it doesn't self-wrap), and that
 * wrapper is the sole element on the page that MUST carry id="loves" verbatim
 * (site-wide footer's /#loves link depends on it).
 *
 * Islands mounted here:
 *   ScrollReveals: headless IO island toggling .in on .reveal.
 *
 * page.tsx fetches the Notion/RSS data (Featured projects, published posts,
 * Monty Monthly issues, Things I Love items) and passes it down; this
 * orchestrator stays a sync Server Component and forwards it to each band.
 * Every prop defaults to [] so the tree renders fine with no props (and in
 * tests).
 */
type Props = {
  projects?: Project[];
  posts?: BlogPost[];
  loves?: LoveItem[];
  /** Type-select option order from Notion; drives Organize-by-topic bands. */
  loveCategories?: string[];
  /** Exact post reading times by post id; falls back to an estimate when absent. */
  readingTimes?: Record<string, number>;
};

export function ExplorativeHomepage({
  projects = [],
  posts = [],
  loves = [],
  loveCategories = [],
  readingTimes = {},
}: Props) {
  // The accent rotation counter runs continuously in document order across
  // Building and Writing (D-V5-05). CSS `nth-child` cannot count across
  // sibling <section> elements, so the counter has to be lifted to this
  // common parent and handed down as each band's start offset. Not
  // destructuring `loves` here -- Phase 22 will, and an unused binding is a
  // lint error today.
  const { building: buildingAccentStart, writing: writingAccentStart } =
    homepageAccentOffsets(projects, posts);

  return (
    <div className="min-h-screen bg-bg">
      {/* Fixed islands: mounted first so they overlay all bands */}
      <ScrollReveals />

      <Hero />

      {/* Things I Love is the warmest content on the site but sits ~2100px
          down; this compact teaser strip surfaces a handful of tiles early
          and links down to the real #loves band (quick task 260917). */}
      <LovesTeaser items={loves} />

      <SectionBuilding projects={projects} accentStart={buildingAccentStart} />

      <SectionWriting
        posts={posts}
        readingTimes={readingTimes}
        accentStart={writingAccentStart}
      />

      {/* Shares the same tightened .a-sec rhythm as Building/Writing (quick
          task 260917) instead of a bespoke pt-40/pt-64 on top of it -- that
          extra padding was genuine double spacing once the page carried v5
          color, and read as unfinished rather than deliberate. */}
      <section className="band a-sec" id="loves">
        <SectionLoves items={loves} categoryOrder={loveCategories} />
      </section>

      {/* Footer is the single site-wide SiteFooter, rendered by app/layout.tsx. */}
    </div>
  );
}
