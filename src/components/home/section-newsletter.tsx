import { MontyMonthlyCarousel, type CarouselIssue } from "@/components/home/monty-monthly-carousel";
import type { BlogPost } from "@/lib/notion";

/**
 * SectionNewsletter: Writing beat (D-09 Monty Monthly carousel, D-13 velvet-rope).
 * Server Component (RSC only, no client boundary).
 * Renders the MontyMonthly carousel with 4 issues; no email capture (D-09 link-out only).
 * Substack link-out lives inside MontyMonthlyCarousel subscribe card.
 * Keep export name SectionNewsletter (orchestrator imports it under this name).
 * The band wrapper (section.beat#writing) is supplied by the orchestrator (Plan 08).
 *
 * `posts` (the latest published essays) is fetched by the async parent
 * (page.tsx) so this stays sync. Each essay becomes an issue card carrying its
 * real Notion cover (via /api/notion-cover), title, date, description, and a
 * link to /blog/[slug]. When Notion is empty/down, the hardcoded ISSUES below
 * are used as a graceful fallback so the carousel is never blank.
 */
type Props = { posts?: BlogPost[] };

function formatIssueDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Map the latest essays to carousel issue cards (newest = highest issue number). */
function postsToIssues(posts: BlogPost[]): CarouselIssue[] {
  const top = posts.slice(0, 4);
  return top.map((post, i) => ({
    num: String(top.length - i).padStart(2, "0"),
    date: formatIssueDate(post.date || post.lastEdited),
    title: post.title,
    excerpt: post.description,
    href: `/blog/${post.slug}`,
    cover: post.cover ? `/api/notion-cover?pageId=${post.id}` : undefined,
  }));
}

export function SectionNewsletter({ posts = [] }: Props) {
  const issues = postsToIssues(posts);

  return (
    <div className="wrap">
      <div className="mm-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Monty Monthly</div>
          <h2 className="reveal">Notes on building, one issue at a time.</h2>
        </div>
      </div>
      <MontyMonthlyCarousel issues={issues} />
    </div>
  );
}
