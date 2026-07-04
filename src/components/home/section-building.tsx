import { RailBox } from "@/components/home/rail-box";
import { Photo } from "@/components/home/photo";

/**
 * SectionBuilding: Prometheus-forward narrative beat (D-03/D-05/D-07).
 * Returns beat CONTENT only (div.wrap > div.beat-grid).
 * The orchestrator (Plan 08) supplies the outer .band.dark section + id="building".
 * Server Component only; no client directive.
 * D-03: token classes only auto-invert when the dark band is applied.
 * D-05: RailBox index 01, label Building.
 * D-07: wide slide-in dark photo (from-left, aspect 16/6.5).
 * D-13: no em dashes; any Prometheus external link keeps rel="noopener noreferrer".
 */
export function SectionBuilding() {
  return (
    <div className="wrap">
      <div className="beat-grid">
        {/* Left rail */}
        <div className="reveal">
          <RailBox num="01" label="Building" />
        </div>

        {/* Right column: headline, body with woven inline link, wide slide-in photo */}
        <div>
          <h2 className="reveal">
            Prometheus: AI integrations and education for people who refuse to be left behind.
          </h2>

          <p className="body reveal">
            The center of my attention right now. If you care about real leverage from AI and not
            the hype,{" "}
            <a className="inline" href="#writing">
              let&apos;s talk
            </a>
            .
          </p>

          {/* Wide dark slide-in photo. Drop-shadow settles as .in is added by ScrollReveals. */}
          <div className="shadowed slide from-left" style={{ marginTop: 44 }}>
            <Photo dark aspectRatio="16/6.5" caption="Wide Prometheus shot" />
          </div>
        </div>
      </div>
    </div>
  );
}
