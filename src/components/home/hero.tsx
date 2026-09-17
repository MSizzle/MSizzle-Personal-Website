/* ── Hero: type-only Swiss hero (HP-01, MS-01) ───────────────────────────
   Server Component: static render only, no client directives. Renders a mono
   eyebrow, H1, a mono kicker (the former headline, now a small attribution
   line under the new headline), a 3-line lede, and a 3-cell meta column.
   No photo, no marker-block highlight, no pulsing status dot, no link
   marquee — those are deleted outright, not paused or reduced-motion-gated.
   Monty ruled out a hero photo outright (v4 no-photos-in-hero lock stands),
   so the empty right side is filled by moving the meta column up beside the
   lede instead (quick task 260917) rather than by any imagery.

   Two-column on md+: type on the left; the meta column sits on the right,
   explicitly grid-row-aligned to the lede paragraph (both share row 4 and
   both carry the same mt-6 top offset) so its top edge lines up with the
   lede's, not the headline's. Collapses to the original single-column
   stacked order on mobile via plain DOM order (no grid overrides below md).

   The two brand marks in the meta row are a deliberate, Monty-approved
   exception to the pure-mono lock: they render in their real brand colors.
   HP-01's "no photograph in the hero" rule still holds — these are logos,
   not photography.

   Consumed by the orchestrator (explorative-homepage.tsx) as the first band.
   ────────────────────────────────────────────────────────────────────────── */

import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="wrap min-h-[calc(100svh-var(--header-h))] flex flex-col justify-center py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] md:grid-rows-[auto_auto_auto_auto] gap-x-12 lg:gap-x-16">
        <div className="reveal font-mono text-xs uppercase tracking-[0.12em] text-text-muted md:col-start-1 md:row-start-1">
          Monty Singer
        </div>

        <h1 className="reveal font-display text-2xl md:text-3xl font-extrabold leading-[0.95] tracking-[-0.03em] max-w-[24ch] mt-6 md:col-start-1 md:row-start-2">
          Most of what I do is turning a mess into something that runs
          itself.
        </h1>

        <p className="reveal font-mono text-xs text-text-muted max-w-[34ch] mt-3 md:mt-4 md:col-start-1 md:row-start-3">
          &ldquo;Blessed are those who create order from chaos.&rdquo;
        </p>

        <p className="reveal font-sans font-light text-base leading-[1.6] text-text-dim max-w-[46ch] mt-6 md:col-start-1 md:row-start-4">
          <span className="block">
            That is Prometheus, my AI consultancy for small and midsize
            businesses.
          </span>
          <span className="block">
            It is also beekeeping, growing mushrooms, and too much military
            history.
          </span>
          <span className="block">
            Same instinct either way. If it is yours too,{" "}
            <Link href="/contact" className="prometheus-link">
              we&rsquo;ll get along.
            </Link>
          </span>
        </p>

        <div className="reveal grid grid-cols-1 gap-8 border-t border-border pt-6 mt-10 md:mt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10 md:col-start-2 md:row-start-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.12em] text-text-muted">
              Currently
            </div>
            <div className="drop mt-2">
              <span className="drop-label">Building Prometheus</span>
              <div className="drop-bay">
                <a
                  className="drop-logo"
                  href="https://prometheus.today"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Prometheus"
                >
                  <Image
                    src="/logos/prometheus-orb.svg"
                    alt="Prometheus"
                    width={240}
                    height={240}
                  />
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.12em] text-text-muted">
              Writes
            </div>
            <div className="drop mt-2">
              <span className="drop-label">Monty Monthly</span>
              <div className="drop-bay">
                <a
                  className="drop-logo"
                  href="https://montymonthly.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Monty Monthly"
                >
                  <Image
                    src="/logos/monty-monthly.png"
                    alt="Monty Monthly"
                    width={180}
                    height={180}
                  />
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.12em] text-text-muted">
              Elsewhere
            </div>
            <div className="text-sm mt-2">
              <a
                href="https://x.com/themontysinger"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              {" · "}
              <a
                href="https://linkedin.com/in/monty-singer"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              {" · "}
              <a href="mailto:monty@prometheus.today">Email</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
