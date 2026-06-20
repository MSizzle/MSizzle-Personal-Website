import type { Metadata } from "next";
import { WATCHING_ITEMS } from "@/lib/watching";
import { PageHero } from "@/components/v3/page-hero";
import { VideoCard } from "@/components/v3/video-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

/**
 * /watching — Hardcoded YouTube video grid page (D-07, D-08, D-09, D-10, PG-03).
 *
 * Data source: src/lib/watching.ts — static typed array, no Notion dependency.
 * 6 placeholder entries — Monty to swap in real YouTube video IDs before v3 launch.
 *
 * YouTube thumbnail URL pattern (D-08): https://img.youtube.com/vi/{id}/hqdefault.jpg
 * Requires img.youtube.com in next.config.ts remotePatterns (done in Plan 01).
 *
 * All VideoCard links open YouTube in a new tab (D-09):
 *   target="_blank" rel="noopener noreferrer" (tabnapping mitigation, T-16-09)
 *
 * Server Component — no "use client".
 * ISR cadence: 30 minutes (matches /, /writing, /events, /photos).
 */

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Watching | Monty Singer",
  description: "Favorite videos and talks.",
  alternates: { canonical: "/watching" },
  openGraph: {
    title: "Watching | Monty Singer",
    description: "Favorite videos and talks.",
    url: "/watching",
    type: "website",
  },
};

export default function WatchingPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Watching" },
        ]}
      />

      <div className="px-6 md:px-40">
        <PageHero
          title="Watching"
          crumb="Home / Watching"
          sub="Favorite videos and talks."
        />

        <section className="py-16">
          <div className="grid [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] gap-[22px]">
            {WATCHING_ITEMS.map((item) => (
              <VideoCard
                key={item.id}
                title={item.title}
                channel={item.channel}
                href={item.url}
                thumbnail={`https://img.youtube.com/vi/${item.id}/hqdefault.jpg`}
                target="_blank"
                rel="noopener noreferrer"
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
