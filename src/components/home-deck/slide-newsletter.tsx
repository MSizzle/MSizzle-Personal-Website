import { NewsletterCarousel } from "@/components/v3/newsletter-carousel";
import { Button } from "@/components/v3/button";
import { SectionLabel } from "@/components/v3/section-label";

/**
 * Slide 4 — Monty Monthly newsletter
 * Static placeholder issues; real issues live on Substack.
 * Server Component — no "use client".
 * D-10: hardcoded JSX using v3 primitives.
 */
export function SlideNewsletter() {
  return (
    <section className="deck-slide deck-slide--newsletter flex flex-col justify-center min-h-dvh px-[8vw]">
      <SectionLabel numeral="04">Newsletter</SectionLabel>

      {/* Display heading */}
      <h2
        className="font-display font-bold uppercase text-text leading-[0.94] tracking-[-0.03em] sig mt-4 mb-4"
        style={{ fontSize: "clamp(2.2rem, 6vw, 4.4rem)" }}
      >
        Monty Monthly
      </h2>

      <p className="font-display text-text-dim mb-6" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", maxWidth: "30ch" }}>
        A monthly dispatch on building, AI, and life.
      </p>

      {/* Newsletter issue carousel */}
      <NewsletterCarousel
        issues={[
          {
            title: "Vol. 1 — Builders, Breakers, Believers",
            date: "Jun 2026",
            href: "#",
          },
          {
            title: "Vol. 2 — The Quiet Builders",
            date: "May 2026",
            href: "#",
          },
          {
            title: "Vol. 3 — First Principles",
            date: "Apr 2026",
            href: "#",
          },
        ]}
      />

      {/* CTA */}
      <div className="mt-8">
        <Button href="https://montymonthly.substack.com" accent>
          See the issues →
        </Button>
      </div>
    </section>
  );
}
