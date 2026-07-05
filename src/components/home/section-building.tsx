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
            <a
              className="prometheus-link"
              href="https://prometheus.today"
              target="_blank"
              rel="noopener noreferrer"
            >
              Prometheus
            </a>
            : AI integrations and education.
          </h2>

          <p className="body reveal">
            It is where most of my attention goes these days. If you care about
            getting real, practical leverage out of AI, and not just the hype
            around it, that is what I{" "}
            <a className="inline" href="#writing">
              write about each month
            </a>
            .
          </p>

          {/* Wide slide-in shot of the Prometheus site, itself a link out to
              prometheus.today. Drop-shadow settles as .in is added by ScrollReveals. */}
          <div className="shadowed slide from-left" style={{ marginTop: 44 }}>
            <a
              href="https://prometheus.today"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit the Prometheus website"
              style={{ display: "block" }}
            >
              <Photo
                aspectRatio="16/6.5"
                src="/home/prometheus.jpg"
                alt="The Prometheus homepage: an AI integration and automation consultancy"
                objectPosition="center 38%"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
