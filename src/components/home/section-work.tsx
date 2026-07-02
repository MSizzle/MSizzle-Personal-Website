import Link from "next/link";
import { SectionLabel } from "@/components/v3/section-label";
import { Button } from "@/components/v3/button";
import { cn } from "@/utils/cn";

/**
 * SectionWork — Selected work / portfolio teaser (D-06 section 3).
 * Server Component — no "use client".
 * D-10: copy is fully hardcoded JSX, no Notion fetch, no async/await.
 * D-11: no em dashes; Prometheus link uses rel="noopener noreferrer" per T-17.1-02.
 * D-01 (17.3): big-type Link and Button both target /portfolio (curated portfolio, not the full archive).
 *
 * Note: Items are rendered as direct Link elements (not via BigList) so the external
 * Prometheus link can carry target="_blank" rel="noopener noreferrer" safely.
 */
export function SectionWork() {
  return (
    <section className="min-h-dvh flex flex-col justify-center px-[8vw] py-[15vh]">
      <SectionLabel numeral="03">Selected Work</SectionLabel>

      <p
        className="mt-4 mb-8 max-w-[52ch] text-text-dim font-display"
        style={{ fontSize: "clamp(1rem,1.8vw,1.3rem)" }}
      >
        A handful of things I have built. More lives at Prometheus.
      </p>

      {/* Work items — styled to match BigList visual treatment */}
      <div className="big-list">
        {/* External link rendered directly to support rel="noopener noreferrer" */}
        <Link
          href="https://prometheus.today"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center justify-between gap-6",
            "border-t border-border py-[1.4vh]",
            "font-display font-bold uppercase",
            "text-[clamp(2rem,9.5vw,8rem)] leading-[1.02] tracking-[-0.03em]",
            "sig-out",
            "transition-[color,text-shadow] duration-150",
            "hover:text-accent hover:[text-shadow:none]",
            "hover:[-webkit-text-stroke-color:var(--accent)]"
          )}
        >
          <span>Prometheus</span>
          <span className="font-mono font-normal text-xs tracking-[0.12em] text-text-muted whitespace-nowrap hidden md:inline">
            CURRENT
          </span>
        </Link>

        {/* Internal link to portfolio index — last item gets border-b */}
        <Link
          href="/portfolio"
          className={cn(
            "flex items-center justify-between gap-6",
            "border-t border-b border-border py-[1.4vh]",
            "font-display font-bold uppercase",
            "text-[clamp(2rem,9.5vw,8rem)] leading-[1.02] tracking-[-0.03em]",
            "sig",
            "transition-[color,text-shadow] duration-150",
            "hover:text-accent hover:[text-shadow:none]"
          )}
        >
          <span>Portfolio</span>
          <span className="font-mono font-normal text-xs tracking-[0.12em] text-text-muted whitespace-nowrap hidden md:inline">
            SELECTED
          </span>
        </Link>
      </div>

      <div className="mt-8">
        <Button href="/portfolio">All work</Button>
      </div>
    </section>
  );
}
