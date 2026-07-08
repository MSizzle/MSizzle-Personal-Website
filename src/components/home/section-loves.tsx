import { RailBox } from "@/components/home/rail-box";
import { PhotoMarquee } from "@/components/home/photo-marquee";
import { Pinboard } from "@/components/home/pinboard";
import type { LoveItem } from "@/lib/notion-loves";

/**
 * SectionLoves: Things I Love beat (D-03 dark band, D-05 rail 03).
 * Server Component (RSC only, no client boundary of its own).
 *
 * When the Notion "Things I Love" DB has published items, renders the draggable
 * Pinboard (sketch 012) fed by that data. With no items (DB not configured yet,
 * empty, or Notion down) it falls back to the original full-bleed PhotoMarquee,
 * so the band always renders something on-brand — the pinboard simply switches
 * on once NOTION_LOVES_DB_ID is set and items are published.
 *
 * Both the Pinboard and the marquee live outside .wrap so they span full-band
 * width. The band wrapper (section.band beat#loves) is supplied by the
 * orchestrator (explorative-homepage.tsx).
 */
export function SectionLoves({
  items = [],
  categoryOrder = [],
}: {
  items?: LoveItem[];
  categoryOrder?: string[];
}) {
  return (
    <>
      <div className="wrap">
        <div className="beat-grid">
          <div className="reveal">
            <RailBox num="03" label="Things I love" />
          </div>
          <div>
            <h2 className="reveal">Things I love outside of work.</h2>
          </div>
        </div>
      </div>

      {items.length > 0 ? (
        <Pinboard items={items} categoryOrder={categoryOrder} />
      ) : (
        /* Fallback marquee, outside .wrap intentionally, until the Notion
           "Things I Love" DB is populated. */
        <PhotoMarquee
          items={[
            { label: "A place I go", src: "/home/bigsur.jpg", alt: "Pfeiffer Beach keyhole rock at sunset, Big Sur" },
            { label: "Off the clock", src: "/home/tetons.jpg", alt: "Monty hiking a ridgeline in the Tetons" },
            { label: "Good company", src: "/home/friends.jpg", alt: "Monty with friends at an evening event" },
            { label: "A project I loved", src: "/home/monty-mushrooms.jpg", alt: "Monty with an early dorm-room mushroom-growing project" },
          ]}
        />
      )}
    </>
  );
}
