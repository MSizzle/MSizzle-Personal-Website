import Link from "next/link";
import { RailBox } from "@/components/home/rail-box";
import { PhotoMarquee } from "@/components/home/photo-marquee";

/**
 * SectionLoves: Things I Love beat (D-03 dark band, D-05 rail 03, D-07 photo marquee).
 * Server Component (RSC only, no client boundary).
 * Band-agnostic token classes; dark-band auto-inversion via CSS custom props (Plan 01).
 * Full-bleed PhotoMarquee lives outside .wrap so it spans the full band width.
 * The band wrapper (section.band-dark.beat#loves) is supplied by the orchestrator (Plan 08).
 */
export function SectionLoves() {
  return (
    <>
      <div className="wrap">
        <div className="beat-grid">
          <div className="reveal">
            <RailBox num="03" label="Things I love" />
          </div>
          <div>
            <h2 className="reveal">
              The stuff that keeps me curious. Always running.
            </h2>
            {/* Subtle /uses affordance, velvet-rope: link not a prominent CTA (D-13) */}
            <Link
              href="/uses"
              className="inline-block mt-5 text-sm text-text-muted hover:text-accent transition-colors duration-150"
            >
              See what I use
            </Link>
          </div>
        </div>
      </div>
      {/* Full-bleed marquee, outside .wrap intentionally.
          Add `src: "/home/loves-*.jpg"` to a card to swap in a real photo. */}
      <PhotoMarquee
        items={[
          { label: "A place I go", src: "/home/bigsur.jpg", alt: "Pfeiffer Beach keyhole rock at sunset, Big Sur" },
          { label: "Off the clock", src: "/home/tetons.jpg", alt: "Monty hiking a ridgeline in the Tetons" },
          { label: "Good company", src: "/home/friends.jpg", alt: "Monty with friends at an evening event" },
          { label: "A project I loved", src: "/home/monty-mushrooms.jpg", alt: "Monty with an early dorm-room mushroom-growing project" },
        ]}
      />
    </>
  );
}
