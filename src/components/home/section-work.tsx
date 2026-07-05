import Link from "next/link";
import { RailBox } from "@/components/home/rail-box";
import { Photo } from "@/components/home/photo";

/**
 * SectionWork: Selected work beat (D-03/D-05/D-07).
 * Returns beat CONTENT only (div.wrap > div.beat-grid).
 * The orchestrator (Plan 08) supplies the outer .band section + id="work".
 * Server Component only; no client directive.
 * D-03: token classes only auto-invert with the enclosing band variant.
 * D-05: RailBox index 02, label "Selected work".
 * D-07: 2x2 work-grid of slide-in photos alternating from-left/from-right.
 * D-13 (Phase-17.3 invariants preserved):
 *   - /portfolio link present with "SELECTED" kicker
 *   - no link to the projects page
 *   - Prometheus external anchor keeps rel="noopener noreferrer"
 */
export function SectionWork() {
  return (
    <div className="wrap">
      <div className="beat-grid">
        {/* Left rail */}
        <div className="reveal">
          <RailBox num="02" label="Selected work" />
        </div>

        {/* Right column: headline, 2x2 work grid, portfolio link */}
        <div>
          <h2 className="reveal">A few things I am proud of.</h2>

          {/* 2x2 grid of slide-in photos alternating from-left / from-right */}
          <div className="work-grid">
            <div className="shadowed slide from-left">
              <Photo aspectRatio="3/2.2" caption="Project one · Product · 2025" />
            </div>
            <div className="shadowed slide from-right">
              <Photo aspectRatio="3/2.2" caption="Project two · Build · 2025" />
            </div>
            <div className="shadowed slide from-left">
              <Photo aspectRatio="3/2.2" caption="Project three · Writing · 2024" />
            </div>
            <div className="shadowed slide from-right">
              <Photo aspectRatio="3/2.2" caption="Project four · Talk · 2024" />
            </div>
          </div>

          {/* Portfolio affordance: D-13 invariant from Phase 17.3 */}
          <Link href="/portfolio" className="mt-8 inline-flex items-center gap-2 text-text">
            <span>Portfolio</span>
            <span className="font-mono text-xs tracking-widest text-text-muted">SELECTED</span>
          </Link>

          {/* External Prometheus link: T-17.1-02 invariant (rel=noopener noreferrer preserved) */}
          <p className="body mt-4 text-text-dim">
            More lives at{" "}
            <a
              href="https://prometheus.today"
              target="_blank"
              rel="noopener noreferrer"
              className="inline"
            >
              Prometheus
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
