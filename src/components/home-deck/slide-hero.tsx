import { Button } from "@/components/v3/button";

/**
 * Slide 1 — Hero
 * Oversized filled + outline name, sub-roles, CTAs, scroll cue.
 * Server Component — no "use client".
 * D-10: static editorial copy (not Notion).
 */
export function SlideHero() {
  return (
    <section className="deck-slide deck-slide--hero flex items-center relative overflow-hidden min-h-dvh px-[8vw]">
      <div className="hero-grid w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
        {/* Left — name + sub-roles + CTAs */}
        <div>
          {/* Portfolio header line */}
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted mb-6">
            Portfolio © 2026 — montysinger.com
          </p>

          {/* Oversized name block — filled sig layer */}
          <div
            className="font-display font-bold uppercase leading-[0.9] sig"
            style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}
            aria-hidden="true"
          >
            Monty
          </div>
          <div
            className="font-display font-bold uppercase leading-[0.9] sig"
            style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}
            aria-hidden="true"
          >
            Singer.
          </div>

          {/* Outline sig-out layer (decorative, visually stacked via mt spacing) */}
          <div
            className="font-display font-bold uppercase leading-[0.9] sig-out mt-2"
            style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}
          >
            <span className="sr-only">Monty Singer</span>
            <span aria-hidden="true">Monty</span>
            <br />
            <span aria-hidden="true">Singer.</span>
          </div>

          {/* Sub-roles */}
          <div className="flex flex-col gap-1 mt-8">
            <span className="font-mono text-sm uppercase tracking-[0.1em] text-text-muted">
              Founder of Prometheus
            </span>
            <span className="font-mono text-sm uppercase tracking-[0.1em] text-text-muted">
              Writer, Monty Monthly
            </span>
            <span className="font-mono text-sm uppercase tracking-[0.1em] text-text-muted">
              Builder
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-9">
            <Button href="/projects" accent>
              Works →
            </Button>
            <Button href="/writing">Writing →</Button>
          </div>

          {/* Scroll cue */}
          <div className="mt-12 font-mono text-xs uppercase tracking-[0.15em] text-text-muted">
            ↓ Scroll
          </div>
        </div>

        {/* Right — object stage placeholder (R3F canvas / poster rendered by deck-homepage.tsx) */}
        <div aria-hidden="true" />
      </div>
    </section>
  );
}
