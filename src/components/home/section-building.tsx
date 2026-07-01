import { BigList } from "@/components/v3/big-list";
import { SectionLabel } from "@/components/v3/section-label";

/**
 * SectionBuilding — Prometheus-forward narrative section (D-04, D-08)
 * "What I'm Building" — currently building Prometheus + writing/projects links.
 * Server Component — no "use client".
 * D-10: copy hardcoded JSX, no Notion fetch.
 * D-07: no Contact CTA button; connection is woven into prose.
 * D-11: sole identity "Founder of Prometheus"; no em dashes.
 * T-17.1-04: Prometheus external link uses rel="noopener noreferrer" (BigList
 *   does not support target/rel, so a standalone <a> is used for this item).
 */
export function SectionBuilding() {
  return (
    <section className="min-h-dvh flex flex-col justify-center px-[8vw] py-[15vh]">
      <SectionLabel numeral="01">What I&apos;m Building</SectionLabel>

      <p
        className="mt-4 mb-8 max-w-[52ch] text-text-dim font-display"
        style={{ fontSize: "clamp(1rem,1.8vw,1.3rem)" }}
      >
        I am currently building Prometheus, a company helping founders think more
        clearly about the businesses they are creating. I write about this, too.
      </p>

      {/* Prometheus: standalone external link matching BigList visual treatment.
          BigList does not support target/rel — using native <a> for noopener
          noreferrer per T-17.1-04 threat mitigation. */}
      <a
        href="https://prometheus.today"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-6 border-t border-border py-[1.4vh] font-display font-bold uppercase text-[clamp(2rem,9.5vw,8rem)] leading-[1.02] tracking-[-0.03em] sig-out transition-[color,text-shadow] duration-150 hover:text-accent hover:[text-shadow:none] hover:[-webkit-text-stroke-color:var(--accent)]"
      >
        <span>Prometheus</span>
        <span className="font-mono font-normal text-xs tracking-[0.12em] text-text-muted whitespace-nowrap hidden md:inline">
          BUILDING
        </span>
      </a>

      <BigList
        items={[
          { label: "Writing", href: "/writing", tag: "ESSAYS" },
          { label: "Projects", href: "/projects", tag: "WORKS" },
        ]}
      />
    </section>
  );
}
