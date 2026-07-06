import type { Metadata } from "next";
import { USES_DATA } from "@/lib/uses";
import { WATCHING_ITEMS } from "@/lib/watching";
import { PageHero } from "@/components/v3/page-hero";
import { UsesList } from "@/components/v3/uses-list";
import { VideoCard } from "@/components/v3/video-card";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

/**
 * /uses — "Things I Love" reframe (D-06, D-07).
 *
 * Data sources:
 * - src/lib/uses.ts — USES_DATA: static typed array (AI & Dev, Productivity, Communication, Hardware)
 * - src/lib/watching.ts — WATCHING_ITEMS: YouTube video objects (folded from deleted /watching route)
 *
 * Section order per D-06: existing UsesList groups (Tools/AI/Productivity/etc.) then Watching (VideoCard grid).
 * URL canonical stays /uses per D-03.
 *
 * Server Component — no "use client".
 * ISR cadence: 30 minutes (matches /, /writing).
 */

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Things I Love",
  description: "Tools, books, and ideas I keep coming back to.",
  alternates: { canonical: "/uses" },
  openGraph: {
    title: "Things I Love",
    description: "Tools, books, and ideas I keep coming back to.",
    url: "/uses",
    type: "website",
  },
};

export default function UsesPage() {
  // Only surface fully-populated watching entries. Placeholder rows (fake
  // "PLACEHDR" ids or unfilled "TODO" channels) are held back so the reframed
  // /uses page never ships a broken thumbnail or literal TODO text; they appear
  // automatically once WATCHING_ITEMS is filled in with real data.
  const watchingItems = WATCHING_ITEMS.filter(
    (item) => !item.id.startsWith("PLACEHDR"),
  );

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Things I Love" },
        ]}
      />

      <div className="px-6 md:px-40">
        <PageHero
          title="Things I Love"
          crumb="Home / Things I Love"
          sub="Tools, books, and ideas I keep coming back to."
        />

        <RuleStrong />

        <section className="pb-16">
          <UsesList groups={USES_DATA} />
        </section>

        {/* Watching section — folded from deleted /watching route (D-07) */}
        {watchingItems.length > 0 && (
          <section className="pb-16">
            <h3 className="font-mono text-sm uppercase tracking-[0.12em] text-accent mb-[18px]">
              Watching
            </h3>
            <div className="grid [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {watchingItems.map((item) => (
                <VideoCard
                  key={item.id}
                  title={item.title}
                  channel={item.channel.startsWith("TODO") ? undefined : item.channel}
                  href={item.url}
                  thumbnail={`https://img.youtube.com/vi/${item.id}/hqdefault.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ))}
            </div>
          </section>
        )}

        <RuleStrong />
      </div>
    </>
  );
}
