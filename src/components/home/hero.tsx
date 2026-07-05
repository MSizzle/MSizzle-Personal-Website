/* ── Hero: Sketch-010 marker-block hero (D-06, D-08, D-13) ──────────────────
   Server Component: static render only, no client directives or GL imports.
   Renders the Vermilion marker headline, ~44% portrait column, status tag,
   and a full-bleed black section-link marquee pinned to the base of the
   hero viewport. Engagement is a single woven Monty Monthly way-in (D-13).
   All motion (blob drift, portrait breathe/ken-burns, marquee slide) is
   ambient CSS, killed under prefers-reduced-motion in Plan-01 globals.css (D-08).

   Consumed by the orchestrator (Plan 08) as the first light band.
   ────────────────────────────────────────────────────────────────────────── */

import { Photo } from "./photo";

export function Hero() {
  return (
    <section className="band hero-band min-h-[86dvh] flex flex-col">
      {/* Content: flex-1 so hero grid fills viewport above the ticker */}
      <div className="wrap flex-1 flex flex-col">
        <div className="hero">
          {/* Copy column */}
          <div className="col-copy">
            <div className="eyebrow">Founder of Prometheus</div>

            {/* Marker-block headline: "Create Order" in solid Vermilion, "from Chaos" in ink */}
            <h1 className="sig">
              <span className="hl">
                <span className="hw">Create Order</span>
              </span>
              <span className="hl">from Chaos</span>
            </h1>

            <p className="subtitle">
              I build companies and write about what I am learning. A record of
              what I am making and the few things I am proud of.
            </p>

            {/* Single way-in (D-13): woven prose link, no CTA button, no contact link */}
            <p className="wayin">
              I write about building monthly.{" "}
              <a href="#writing">Join Monty Monthly &#x2192;</a>
            </p>

            {/* Black status tag with pulsing Vermilion dot */}
            <div className="statustag">
              <span className="dot" />
              Currently: building Prometheus
            </div>
          </div>

          {/* Photo column: crossfading portrait carousel (D-07). Slides stack and
              fade every ~6s via CSS only; the whole frame breathes ambiently.
              Reduced-motion settles to the first slide (globals.css guard). */}
          <div className="col-photo">
            <div className="pcarousel">
              <Photo
                className="pslide"
                src="/home/monty-mushrooms.jpg"
                alt="Monty Singer holding mushroom-grow blocks from an early dorm-room project"
                caption="Where it started"
                priority
                objectPosition="68% 32%"
              />
              <Photo
                className="pslide"
                src="/home/monty-stage.jpg"
                alt="Monty Singer presenting the CULTIVATE pitch on stage"
                caption="On stage"
                objectPosition="38% 60%"
              />
              <Photo
                className="pslide"
                src="/home/monty-patricof.jpg"
                alt="Monty Singer interviewing investor Alan Patricof in a fireside chat"
                caption="In conversation"
                objectPosition="28% 40%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pinned hero marquee strip: black, full-bleed, section-link anchors.
          Two identical groups so the CSS slide loop is seamless (translateX -50%). */}
      <div className="hero-ticker">
        <div className="track">
          {/* Group 1 */}
          <a className="tick-link" href="#building">Building</a>
          <span className="tick-sep">·</span>
          <a className="tick-link" href="#work">Work</a>
          <span className="tick-sep">·</span>
          <a className="tick-link" href="#writing">Writing</a>
          <span className="tick-sep">·</span>
          <a className="tick-link" href="#loves">Things I Love</a>
          <span className="tick-sep">·</span>
          <a className="tick-link" href="/uses">Uses</a>
          <span className="tick-sep">·</span>
          {/* Group 2: exact duplicate for seamless animation loop */}
          <a className="tick-link" href="#building">Building</a>
          <span className="tick-sep">·</span>
          <a className="tick-link" href="#work">Work</a>
          <span className="tick-sep">·</span>
          <a className="tick-link" href="#writing">Writing</a>
          <span className="tick-sep">·</span>
          <a className="tick-link" href="#loves">Things I Love</a>
          <span className="tick-sep">·</span>
          <a className="tick-link" href="/uses">Uses</a>
          <span className="tick-sep">·</span>
        </div>
      </div>
    </section>
  );
}
