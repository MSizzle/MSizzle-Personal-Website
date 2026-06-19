import { BigList } from "@/components/v3/big-list";
import { SectionLabel } from "@/components/v3/section-label";

/**
 * Slide 2 — Big-type index (HD-04)
 * "What I'm Building / Writing / Doing" brutalist index.
 * Server Component — no "use client".
 * D-10: copy locked to "What I'm" header with BigList verbs per CONTEXT.md D-10.
 */
export function SlideIndex() {
  return (
    <section className="deck-slide deck-slide--index flex flex-col justify-center min-h-dvh px-[8vw]">
      <SectionLabel numeral="02">What I&apos;m</SectionLabel>
      <BigList
        items={[
          { label: "Building", href: "/projects", tag: "WORKS" },
          { label: "Writing", href: "/writing", tag: "ESSAYS" },
          {
            label: "Doing",
            href: "https://prometheus.today",
            tag: "PROMETHEUS",
            outline: true,
          },
        ]}
      />
    </section>
  );
}
