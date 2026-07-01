import Link from "next/link";
import { SectionBuilding } from "./section-building";
import { SectionWork } from "./section-work";
import { SectionLoves } from "./section-loves";
import { SectionNewsletter } from "./section-newsletter";
import { SectionFooter } from "./section-footer";

/**
 * ExplorativeHomepage — personal-brand narrative arc orchestrator (Server Component).
 *
 * Renders a text-forward hero anchored on "Founder of Prometheus", followed by
 * the six-section narrative arc. No WebGL gate, no device detection, no client hooks.
 *
 * Phase 17.1 (Plan 01): blob gate removed; hero replaced with hardcoded JSX copy.
 * Phase 17.1 (Plan 02): SectionWork + SectionLoves added; writing section retired;
 *   final D-06 arc order: hero -> Building -> Work -> Loves -> Newsletter -> Footer.
 *
 * D-10: homepage copy is fully hardcoded JSX (revalidate=false in page.tsx).
 */
export function ExplorativeHomepage() {
  return (
    <div className="personal-homepage min-h-screen bg-bg">
      {/* Hero section — full viewport height, text-forward */}
      <section className="min-h-dvh flex flex-col justify-center px-[8vw]">
        {/* Primary identity — D-11: sole professional identity, no em dashes */}
        <h1 className="font-display font-bold uppercase sig text-[clamp(2.8rem,11vw,8rem)] leading-[0.9] tracking-[-0.03em]">
          Founder of Prometheus
        </h1>

        {/* One-liner subtitle */}
        <p
          className="mt-6 max-w-[54ch] text-text-dim font-display"
          style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}
        >
          Building a company. Writing about what I am learning.
        </p>

        {/* Woven engagement — D-07/D-09: prose invitation, not a button */}
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
          I write about building monthly.{" "}
          <Link
            href="https://montymonthly.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-150"
          >
            Join Monty Monthly
          </Link>
        </p>
      </section>

      {/* D-06 narrative arc: who (hero) -> what I'm building -> selected work -> things I love -> newsletter -> footer */}
      <SectionBuilding />
      <SectionWork />
      <SectionLoves />
      <SectionNewsletter />
      <SectionFooter />
    </div>
  );
}
