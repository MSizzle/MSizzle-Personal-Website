import type { BlogPost } from "@/lib/notion";
import { estimateReadingTime } from "@/utils/reading-time";

/**
 * SectionWriting: terminal-format Writing log (HP-03). Renders real blog
 * posts only -- newest-first, capped at 5 rows -- as a mono `~/writing` log
 * with no box around it, only the header carrying a visible rule. Reuses
 * the .e-term/.e-post CSS family (identical full-row hover/focus-invert
 * mechanism as .a-row in Plan 21-02). Server Component only; no client
 * directive.
 *
 * Quick task 260722-wov (item 2) intentionally removed the prior
 * posts+Monty-Monthly merge: this homepage log is posts-only now. Monty
 * Monthly issues still appear on /writing, in their own dedicated section
 * (enlarged as part of the same quick task).
 */
type Row = {
  date: string;
  title: string;
  readTime: number;
  href: string;
};

function formatYYYYMM(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function SectionWriting({
  posts = [],
  readingTimes = {},
}: {
  posts?: BlogPost[];
  /**
   * Exact reading times by post id, computed from real page blocks upstream.
   * Absent entries fall back to the description estimate, which is only ever
   * a rough floor -- a description is one line, so it rounds to "1 min".
   */
  readingTimes?: Record<string, number>;
}) {
  const rows: Row[] = posts
    .filter((post) => post.date)
    .map((post) => ({
      date: post.date,
      title: post.title,
      readTime: readingTimes[post.id] ?? estimateReadingTime(post.description),
      href: `/blog/${post.slug}`,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <section className="wrap a-sec" id="writing">
      <h2 className="reveal font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
        02 · Writing
      </h2>
      <div className="e-term reveal">
        <div className="hd">~/writing</div>
        {rows.length === 0 ? (
          <p>Nothing here yet. Check back soon.</p>
        ) : (
          rows.map((row) => (
            <a key={row.href} className="e-post" href={row.href}>
              <span className="dt">{formatYYYYMM(row.date)}</span>
              <span>{row.title}</span>
              <span className="rd">{row.readTime} min</span>
            </a>
          ))
        )}
        <a className="more" href="/writing">
          all posts →
        </a>
      </div>
    </section>
  );
}
