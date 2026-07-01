import Link from "next/link";
import { NewsletterCarousel } from "@/components/v3/newsletter-carousel";
import { Button } from "@/components/v3/button";
import { SectionLabel } from "@/components/v3/section-label";

/**
 * SectionNewsletter — Writing + Monty Monthly gate (D-06 section 5, D-09).
 * Server Component — no "use client".
 * D-10: hardcoded JSX using v3 primitives; no Notion fetch.
 * D-06: 1-2 flagship essays shown OPEN as proof-of-thinking above the newsletter gate.
 * D-09: Monty Monthly + Substack CTA is the primary engagement channel (preserved).
 * D-11: no em dashes in copy; no location.
 */

type FeaturedEssay = { title: string; excerpt: string; href: string; date: string };

const FEATURED_ESSAYS: FeaturedEssay[] = [
  {
    title: "On Building Things That Matter",
    excerpt:
      "There is a kind of builder who builds because they cannot imagine not building. The work is not about the outcome. It is about the process of making something real.",
    href: "/blog/on-building-things-that-matter",
    date: "Jun 2026",
  },
  {
    title: "The Quiet Compounders",
    excerpt:
      "Most of the people changing the world are not talking about changing the world. They are building quietly, compounding daily, and letting the work speak.",
    href: "/blog/the-quiet-compounders",
    date: "Apr 2026",
  },
];

export function SectionNewsletter() {
  return (
    <section className="min-h-dvh flex flex-col justify-center px-[8vw] py-[15vh]">
      <SectionLabel numeral="05">Writing &amp; Newsletter</SectionLabel>

      {/* Essay teasers — D-06 section 5: 1-2 flagship essays open as proof-of-thinking */}
      <div className="mb-12 mt-6">
        {FEATURED_ESSAYS.map((essay, i) => (
          <div key={essay.href} className={i > 0 ? "border-t border-border pt-[2vh] mt-[2vh]" : ""}>
            <Link
              href={essay.href}
              className="font-display font-bold text-text hover:text-accent transition-colors duration-150 leading-[1.1] block"
              style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}
            >
              {essay.title}
            </Link>
            <p
              className="mt-2 text-text-dim font-display max-w-[60ch]"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.15rem)" }}
            >
              {essay.excerpt}
            </p>
            <span className="mt-2 block font-mono text-xs uppercase tracking-[0.1em] text-text-muted">
              {essay.date}
            </span>
          </div>
        ))}
      </div>

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
            title: "Vol. 1: Builders, Breakers, Believers",
            date: "Jun 2026",
            href: "#",
          },
          {
            title: "Vol. 2: The Quiet Builders",
            date: "May 2026",
            href: "#",
          },
          {
            title: "Vol. 3: First Principles",
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
