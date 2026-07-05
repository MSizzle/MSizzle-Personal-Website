import Link from "next/link";

/**
 * Slide 5 — Footer-as-last-slide
 * Replicates InkFooter content structure as a deck slide.
 * Server Component — no "use client".
 *
 * IMPORTANT: This component intentionally duplicates footer content because
 * on `/` the global <InkFooter /> is suppressed (handled by Plan 05/deck-homepage).
 * This component is ONLY rendered in the deck. On all other routes, the global
 * InkFooter from layout.tsx renders as normal.
 *
 * Uses v3 token classes: text-text, text-text-muted, border-border (not v2 tokens).
 * Prototype: deck-foot has height:auto, min-height:100%, flex-col, justify-end, pt-[12vh].
 */
export function SlideFooter() {
  return (
    <section className="deck-slide deck-slide--footer deck-foot flex flex-col justify-end h-auto min-h-full pt-[12vh] px-[8vw] pb-14">
      {/* Big greeting link */}
      <div className="mb-12 border-t border-border pt-8">
        <Link
          href="/about"
          className="font-display font-bold uppercase sig text-[clamp(2rem,6vw,4rem)] leading-[0.9] transition-[color] duration-150 hover:text-accent"
        >
          Let&apos;s be friends.
        </Link>
      </div>

      {/* Nav columns — "More" column deleted per D-10 (contained only cut routes) */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-12 mb-12">
        {/* Site */}
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            Site
          </h4>
          <nav className="flex flex-col gap-2">
            <Link href="/writing" className="text-text hover:text-accent transition-colors duration-150 text-sm">
              Writing
            </Link>
            <Link href="/projects" className="text-text hover:text-accent transition-colors duration-150 text-sm">
              Works
            </Link>
            <Link href="https://prometheus.today" className="text-text hover:text-accent transition-colors duration-150 text-sm" target="_blank" rel="noopener noreferrer">
              Prometheus
            </Link>
            <Link href="/about" className="text-text hover:text-accent transition-colors duration-150 text-sm">
              About
            </Link>
          </nav>
        </div>

        {/* Elsewhere */}
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            Elsewhere
          </h4>
          <nav className="flex flex-col gap-2">
            <a
              href="https://montymonthly.substack.com"
              className="text-text hover:text-accent transition-colors duration-150 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Substack ↗
            </a>
            <a
              href="https://github.com/MSizzle"
              className="text-text hover:text-accent transition-colors duration-150 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/monty-singer"
              className="text-text hover:text-accent transition-colors duration-150 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://x.com/thefullmonty0"
              className="text-text hover:text-accent transition-colors duration-150 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              X / Twitter ↗
            </a>
          </nav>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            Contact
          </h4>
          <nav className="flex flex-col gap-2">
            <a
              href="mailto:monty@prometheus.today"
              className="text-text hover:text-accent transition-colors duration-150 text-sm"
            >
              monty@prometheus.today
            </a>
            <a
              href="https://prometheus.today"
              className="text-text hover:text-accent transition-colors duration-150 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Work with Prometheus
            </a>
          </nav>
        </div>
      </div>

      {/* Copyright / colophon */}
      <div className="border-t border-border pt-6 flex flex-col gap-2 md:flex-row md:justify-between md:items-baseline">
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted">
          © 2026 Monty Singer
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted">
          Founder of Prometheus · Builder · Writer
        </span>
      </div>
    </section>
  );
}
