import type { Project } from "@/lib/notion-projects";

/**
 * SectionBuilding: Swiss numbered index for the Building band (HP-02).
 * Row 001 is always the hardcoded Prometheus row. Rows 002+ map one-to-one
 * from the `projects` prop (real, already-fetched Notion Featured Projects,
 * forwarded by the orchestrator in Plan 21-05) — this absorbs
 * section-work.tsx's Notion data role so that component can be deleted.
 * Server Component only; no client directive.
 * Full-row hover/focus inversion is the site's only hover language (HP-02),
 * implemented via the .a-row CSS family in globals.css.
 */
type Row = {
  title: string;
  description: string;
  status: string;
  href: string;
  external: boolean;
};

export function SectionBuilding({
  projects = [],
}: {
  projects?: Project[];
}) {
  const rows: Row[] = [
    {
      title: "Prometheus",
      description:
        "AI integrations and education. Practical leverage, not hype.",
      status: "Current",
      href: "https://prometheus.today",
      external: true,
    },
    ...projects.map((project) => ({
      title: project.title,
      description: project.description,
      status:
        project.tags?.[0] ||
        String(new Date(project.lastEdited).getUTCFullYear()),
      href: `/building/${project.slug}`,
      external: false,
    })),
  ].slice(0, 3);

  return (
    <section className="wrap a-sec" id="building">
      <h2 className="reveal font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
        01 · Building
      </h2>
      {rows.map((row, i) => (
        <a
          key={row.href}
          className="a-row reveal"
          href={row.href}
          {...(row.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          <span className="num">{String(i + 1).padStart(3, "0")}</span>
          <span className="ttl">{row.title}</span>
          <span className="dsc">{row.description}</span>
          <span className="status">{row.status}</span>
        </a>
      ))}
      <a className="more reveal" href="/building">
        all projects →
      </a>
    </section>
  );
}
