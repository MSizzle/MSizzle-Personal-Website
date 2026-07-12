import { MontyMonthlyCarousel, type CarouselIssue } from "@/components/home/monty-monthly-carousel";
import type { MontyMonthlyIssue } from "@/lib/rss/substack";

/**
 * SectionNewsletter: Writing beat (D-09 Monty Monthly carousel, D-13 velvet-rope).
 * Server Component (RSC only, no client boundary).
 *
 * Cards are the real Monty Monthly issues pulled from the Substack RSS feed
 * (fetched by the async parent, page.tsx, and passed down so this stays sync) —
 * the same source the /writing page uses. Each issue carries its real title,
 * publish date, feed thumbnail, an excerpt from the body, and a link out to the
 * Substack post. When the feed is empty/down, `issues` is [] and the carousel
 * still renders its trailing Substack subscribe card, so the beat is never blank.
 *
 * Substack link-out lives inside MontyMonthlyCarousel subscribe card.
 * Keep export name SectionNewsletter (orchestrator imports it under this name).
 * The band wrapper (section.beat#writing) is supplied by the orchestrator (Plan 08).
 */
type Props = { issues?: MontyMonthlyIssue[] };

function formatIssueDate(pubDate: string): string {
  if (!pubDate) return "";
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Map the latest Substack issues to carousel cards (newest = highest issue number). */
function issuesToCards(issues: MontyMonthlyIssue[]): CarouselIssue[] {
  const top = issues.slice(0, 4);
  return top.map((issue, i) => ({
    num: String(top.length - i).padStart(2, "0"),
    date: formatIssueDate(issue.pubDate),
    title: issue.title,
    excerpt: issue.description,
    href: issue.link || undefined,
    external: true,
    cover: issue.thumbnail ?? undefined,
  }));
}

export function SectionNewsletter({ issues = [] }: Props) {
  const cards = issuesToCards(issues);

  return (
    <div className="wrap">
      <div className="mm-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Monty Monthly</div>
          <h2 className="reveal">Notes on building, one issue at a time.</h2>
        </div>
      </div>
      <MontyMonthlyCarousel issues={cards} />
    </div>
  );
}
