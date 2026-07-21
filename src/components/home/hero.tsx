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

      <h1 className="reveal font-display text-2xl md:text-3xl font-extrabold leading-[0.95] tracking-[-0.03em] max-w-[14ch] mt-6">
        I build things and write about it.
      </h1>

      <p className="reveal font-sans font-light text-base leading-[1.6] text-text-dim max-w-[46ch] mt-6">
        Right now that mostly means Prometheus, an AI integrations and
        education company. Everything else here is the residue: past
        projects, monthly essays, and a running list of things I like.
      </p>

      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-6 mt-24 md:mt-32">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.12em] text-text-muted">
            Currently
          </div>
          <div className="text-sm mt-2">Building Prometheus</div>
          <Image
            src="/logos/prometheus-mark.png"
            alt="Prometheus"
            width={180}
            height={180}
            className="mt-5 h-auto w-1/2 max-w-[160px]"
          />
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.12em] text-text-muted">
            Writes
          </div>
          <div className="text-sm mt-2">Monty Monthly</div>
          <Image
            src="/logos/monty-monthly.png"
            alt="Monty Monthly"
            width={180}
            height={180}
            className="mt-5 h-auto w-1/2 max-w-[160px]"
          />
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
