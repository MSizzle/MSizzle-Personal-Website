import Link from "next/link";
import type { Project } from "@/lib/notion-projects";
import { buildingRows } from "@/lib/homepage-rows";
import { accentStyle } from "@/lib/accent-rotation";
import { CardCover } from "@/components/v3/card-cover";

/**
 * SectionBuilding: Swiss numbered index for the Building band (HP-02).
 * Row 001 is always the hardcoded Prometheus row. Rows 002+ map one-to-one
 * from the `projects` prop (real, already-fetched Notion Featured Projects,
 * forwarded by the orchestrator in Plan 21-05) — this absorbs
 * section-work.tsx's Notion data role so that component can be deleted.
 * Server Component only; no client directive (CardCover is a small client
 * island for its own onError fallback, same pattern /building already uses).
 * Full-row hover/focus inversion is the site's only hover language (HP-02),
 * implemented via the .a-row CSS family in globals.css.
 *
 * Each row leads with a compact cover thumbnail (quick task 260917) next to
 * its numeral -- reuses the same CardCover component and /api/notion-cover
 * proxy /building already renders covers through, rather than a new one.
 * A row with no cover (row 001, Prometheus, isn't a Notion page; or a
 * Featured Project with no Notion cover set) renders an invisible spacer of
 * the same dimensions instead of a bordered/tinted box (quick task
 * 260917-hf4) -- no image means no visible box, but the numeral column still
 * lines up across every row since the spacer reserves the same space a real
 * thumbnail would.
 *
 * Row derivation lives in `@/lib/homepage-rows` (21.5-02) so the accent
 * rotation offset math and the rendered rows can never drift apart.
 */
export function SectionBuilding({
  projects = [],
  accentStart = 0,
}: {
  projects?: Project[];
  /**
   * Document-order accent index this section's first row should carry.
   * `nth-child` cannot count across sibling `<section>` elements, so the
   * running counter is lifted to the common parent (explorative-homepage.tsx)
   * and handed down here as a start offset (D-V5-05, D-V5-07).
   */
  accentStart?: number;
}) {
  const rows = buildingRows(projects);

  return (
    <section className="wrap a-sec" id="building">
      <h2 className="reveal font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
        01 · Building
      </h2>
      {rows.map((row, i) => {
        // No border/background: an invisible spacer, not a visible empty
        // box (quick task 260917-hf4). Same dimensions as a real thumbnail
        // so the numeral column still aligns row to row.
        const emptyThumb = (
          <span
            className="block w-8 h-8 md:w-10 md:h-10 shrink-0"
            aria-hidden="true"
          />
        );

        const children = (
          <>
            <span className="row-lead">
              {row.coverSrc ? (
                <CardCover
                  src={row.coverSrc}
                  alt=""
                  sizes="40px"
                  padded={false}
                  aspectRatio="1 / 1"
                  className="w-8 h-8 md:w-10 md:h-10 shrink-0"
                  fallback={emptyThumb}
                />
              ) : (
                emptyThumb
              )}
              <span className="num">{String(i + 1).padStart(3, "0")}</span>
            </span>
            <span className="ttl">{row.title}</span>
            <span className="dsc">{row.description}</span>
            <span className="status">{row.status}</span>
          </>
        );

        return row.external ? (
          <a
            key={row.href}
            className="a-row reveal"
            href={row.href}
            target="_blank"
            rel="noopener noreferrer"
            style={accentStyle(accentStart + i)}
          >
            {children}
          </a>
        ) : (
          <Link
            key={row.href}
            className="a-row reveal"
            href={row.href}
            style={accentStyle(accentStart + i)}
          >
            {children}
          </Link>
        );
      })}
      <Link className="more reveal" href="/building">
        all projects →
      </Link>
    </section>
  );
}
