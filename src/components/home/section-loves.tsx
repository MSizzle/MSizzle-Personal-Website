import Link from "next/link";
import { SectionLabel } from "@/components/v3/section-label";
import { Button } from "@/components/v3/button";

/**
 * SectionLoves — Things I Love teaser (D-06 section 4).
 * Server Component — no "use client".
 * D-10: copy is fully hardcoded JSX, no Notion fetch, no async/await.
 * D-11: no em dashes in copy.
 * Links to /uses (the existing route — /uses reframe is Phase 17.2, not this plan).
 */

const LOVES_ITEMS = [
  { name: "Tools and stack", tag: "USES", href: "/uses" },
  { name: "What I am reading", tag: "BOOKS", href: "/uses" },
  { name: "Things I recommend", tag: "ALL", href: "/uses" },
] as const;

export function SectionLoves() {
  return (
    <section className="min-h-dvh flex flex-col justify-center px-[8vw] py-[15vh]">
      <SectionLabel numeral="04">Things I Love</SectionLabel>

      <p
        className="mt-4 mb-8 max-w-[52ch] text-text-dim font-display"
        style={{ fontSize: "clamp(1rem,1.8vw,1.3rem)" }}
      >
        The tools, books, and ideas I keep coming back to.
      </p>

      {LOVES_ITEMS.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex justify-between border-t border-border py-[1.4vh] text-text hover:text-accent transition-colors duration-150"
        >
          <span className="font-display font-bold text-xl">{item.name}</span>
          <span className="font-mono text-xs text-text-muted self-center">{item.tag}</span>
        </Link>
      ))}

      <div className="mt-8 border-t border-border pt-6">
        <Button href="/uses">See the full list</Button>
      </div>
    </section>
  );
}
