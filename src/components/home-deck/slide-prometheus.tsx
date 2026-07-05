import { Button } from "@/components/v3/button";
import { SectionLabel } from "@/components/v3/section-label";

/**
 * Slide 3 — Prometheus
 * Editorial editorial grid with Prometheus content.
 * Server Component — no "use client".
 * Uses v3 token classes (text-text, text-text-dim, border-border) — not v2 tokens.
 * D-10: static copy; sole professional identity is "Founder of Prometheus".
 */
export function SlidePrometheus() {
  return (
    <section className="deck-slide deck-slide--prometheus flex flex-col justify-center min-h-dvh px-[8vw]">
      <div className="hero-grid grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
        <div>
          <SectionLabel numeral="03">Prometheus</SectionLabel>

          {/* Display headline */}
          <h2
            className="font-display font-bold uppercase text-text leading-[0.94] tracking-[-0.03em] mt-4"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.4rem)" }}
          >
            AI Integrations
            <br />
            &amp; Education
          </h2>

          {/* Body copy */}
          <p className="text-text-dim mt-5 max-w-[46ch] leading-relaxed">
            Custom automation pipelines, AI tool implementation, and hands-on
            training. Bridging what AI can do and what businesses actually need.
          </p>

          {/* CTA */}
          <div className="mt-6">
            <Button href="https://prometheus.today">prometheus.today →</Button>
          </div>
        </div>

        {/* Right — object stage placeholder */}
        <div aria-hidden="true" />
      </div>
    </section>
  );
}
