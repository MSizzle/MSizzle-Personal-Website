import { MontyMonthlyCarousel, type CarouselIssue } from "@/components/home/monty-monthly-carousel";

/**
 * SectionNewsletter: Writing beat (D-09 Monty Monthly carousel, D-13 velvet-rope).
 * Server Component (RSC only, no client boundary).
 * Renders the MontyMonthly carousel with 4 issues; no email capture (D-09 link-out only).
 * Substack link-out lives inside MontyMonthlyCarousel subscribe card.
 * Keep export name SectionNewsletter (orchestrator imports it under this name).
 * The band wrapper (section.beat#writing) is supplied by the orchestrator (Plan 08).
 */

const ISSUES: CarouselIssue[] = [
  {
    num: "12",
    date: "Jun 2026",
    title: "Why most AI adoption fails before it starts",
    excerpt:
      "The failure is almost never the model. It is the org that cannot absorb it.",
  },
  {
    num: "11",
    date: "May 2026",
    title: "The org chart is the product",
    excerpt: "How the shape of a team leaks into the shape of what it ships.",
  },
  {
    num: "10",
    date: "Apr 2026",
    title: "What I learned shipping Prometheus v1",
    excerpt:
      "Six weeks, one hard pivot, and the feature nobody asked for that mattered most.",
  },
  {
    num: "09",
    date: "Mar 2026",
    title: "Taste is a competitive advantage",
    excerpt: "Why I hire for it and how I try to keep mine sharp.",
  },
];

export function SectionNewsletter() {
  return (
    <div className="wrap">
      <div className="mm-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Monty Monthly</div>
          <h2 className="reveal">Notes on building, one issue at a time.</h2>
        </div>
      </div>
      <MontyMonthlyCarousel issues={ISSUES} />
    </div>
  );
}
