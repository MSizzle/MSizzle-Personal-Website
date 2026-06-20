import type { Metadata } from "next";
import { USES_DATA } from "@/lib/uses";
import { PageHero } from "@/components/v3/page-hero";
import { UsesList } from "@/components/v3/uses-list";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

/**
 * /uses — Hardcoded tools and software page (D-05, D-06, PG-02).
 *
 * Data source: src/lib/uses.ts — static typed array, no Notion dependency.
 * Four groups: AI & Development, Productivity, Communication, Hardware.
 * Hardware items use TODO placeholder strings — Monty to fill in before v3 launch.
 *
 * Server Component — no "use client".
 * ISR cadence: 30 minutes (matches /, /writing, /events, /photos).
 */

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Uses | Monty Singer",
  description: "The tools and software I use daily.",
  alternates: { canonical: "/uses" },
  openGraph: {
    title: "Uses | Monty Singer",
    description: "The tools and software I use daily.",
    url: "/uses",
    type: "website",
  },
};

export default function UsesPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Uses" },
        ]}
      />

      <div className="px-6 md:px-40">
        <PageHero
          title="Uses"
          crumb="Home / Uses"
          sub="The tools and software I use daily."
        />

        <RuleStrong />

        <section className="pb-16">
          <UsesList groups={USES_DATA} />
        </section>

        <RuleStrong />
      </div>
    </>
  );
}
