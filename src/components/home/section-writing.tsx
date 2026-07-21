import type { BlogPost } from "@/lib/notion";
import type { MontyMonthlyIssue } from "@/lib/rss/substack";
import { estimateReadingTime } from "@/utils/reading-time";

/**
 * SectionWriting: terminal-format Writing log (HP-03). Merges real blog
 * posts and real Monty Monthly issues into a single newest-first list,
 * capped at 5 rows, rendered as a mono `~/writing` log with no box around
 * it -- only the header carries a visible rule. Reuses the .e-term/.e-post
 * CSS family (identical full-row hover/focus-invert mechanism as .a-row in
 * Plan 21-02). Server Component only; no client directive.
 *
 * `posts`/`montyIssues` are greenfield props -- Plan 21-05 is the plan that
 * fetches real data in page.tsx and wires it through the orchestrator.
 * Until then this component is testable standalone with mocked props.
 */
type Row = {
  date: string;
  title: string;
  readTime: number;
  href: string;
  external: boolean;
};

function formatYYYYMM(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function SectionWriting({
  posts = [],
  montyIssues = [],
}: {
  posts?: BlogPost[];
  montyIssues?: MontyMonthlyIssue[];
}) {
  const postRows: Row[] = posts
    .filter((post) => post.date)
    .map((post) => ({
      date: post.date,
      title: post.title,
      readTime: estimateReadingTime(post.description),
      href: `/blog/${post.slug}`,
      external: false,
    }));

  const issueRows: Row[] = montyIssues.map((issue) => ({
    date: issue.pubDate,
    title: issue.title,
    readTime: estimateReadingTime(issue.description),
    href: issue.link,
    external: true,
  }));

  const rows = [...postRows, ...issueRows]
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
            <a
              key={row.href}
              className="e-post"
              href={row.href}
              {...(row.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
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
