import Link from "next/link";
import { SectionLabel } from "@/components/v3/section-label";
import { Button } from "@/components/v3/button";

/**
 * SectionWriting - static curated essay links (HD-04 / D-13).
 * Server Component - no "use client".
 * D-13: static/curated in v1. Notion-wiring deferred to Phase 16.
 */

type Essay = { title: string; href: string; date: string };

const FEATURED_ESSAYS: Essay[] = [
  {
    title: "On Building Things That Matter",
    href: "/blog/on-building-things-that-matter",
    date: "Jun 2026",
  },
  {
    title: "The Quiet Compounders",
    href: "/blog/the-quiet-compounders",
    date: "Apr 2026",
  },
  {
    title: "First Principles Thinking for Builders",
    href: "/blog/first-principles-thinking-for-builders",
    date: "Feb 2026",
  },
];

export function SectionWriting() {
  return (
    <section className="min-h-dvh flex flex-col justify-center px-[8vw] py-[15vh]">
      <SectionLabel numeral="02">Writing</SectionLabel>

      {/* Essay list */}
      {FEATURED_ESSAYS.map((essay) => (
        <Link
          key={essay.href}
          href={essay.href}
          className="flex justify-between border-t border-border py-[1.4vh] text-text hover:text-accent transition-colors duration-150"
        >
          <span className="font-display font-bold text-xl">{essay.title}</span>
          <span className="font-mono text-xs text-text-muted self-center">{essay.date}</span>
        </Link>
      ))}

      <div className="mt-8 border-t border-border pt-6">
        <Button href="/writing">All essays</Button>
      </div>
    </section>
  );
}
