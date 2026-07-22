/* ── Hero: type-only Swiss hero (HP-01, MS-01) ───────────────────────────
   Server Component: static render only, no client directives. Renders a mono
   eyebrow, H1, subtitle, and a 3-cell meta row.
   No photo, no marker-block highlight, no pulsing status dot, no link
   marquee — those are deleted outright, not paused or reduced-motion-gated.

   The two brand marks in the meta row are a deliberate, Monty-approved
   exception to the pure-mono lock: they render in their real brand colors.
   HP-01's "no photograph in the hero" rule still holds — these are logos,
   not photography.

   Consumed by the orchestrator (explorative-homepage.tsx) as the first band.
   ────────────────────────────────────────────────────────────────────────── */

import Image from "next/image";

export function Hero() {
  return (
    <section className="wrap pt-24 pb-16 md:pt-52 md:pb-32">
      <div className="reveal font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
        Monty Singer
      </div>

      <h1 className="reveal font-display text-2xl md:text-3xl font-extrabold leading-[0.95] tracking-[-0.03em] max-w-[19ch] mt-6">
        Blessed are those who create order from chaos.
      </h1>

      <p className="reveal font-sans font-light text-base leading-[1.6] text-text-dim max-w-[46ch] mt-6">
        Founder of Prometheus, an applied AI company. I love technology,
        biology, and self-improvement. If you like these as well, we&rsquo;ll
        get along.
      </p>

      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-6 mt-24 md:mt-32">
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
    </section>
  );
}
