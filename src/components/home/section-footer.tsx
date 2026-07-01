import Link from "next/link";

/**
 * SectionFooter — footer beat for the homepage scroll-story.
 * Server Component — no "use client".
 *
 * IMPORTANT: This component is the ONLY footer on the homepage.
 * conditional-footer.tsx already returns null on pathname==="/" so the global
 * InkFooter is suppressed. On all other routes, InkFooter renders as normal.
 *
 * Carries all content from slide-footer.tsx; deck-slide / deck-foot classes stripped.
 * Uses v3 token classes: text-text, text-text-muted, border-border (palette-aware).
 */
export function SectionFooter() {
  return (
    <section className="flex flex-col justify-end min-h-[40vh] px-[8vw] pb-14 pt-[12vh]">
      {/* Big greeting link */}
      <div className="mb-12 border-t border-border pt-8">
        <Link
          href="/links"
          className="font-display font-bold uppercase sig text-[clamp(2rem,6vw,4rem)] leading-[0.9] transition-[color] duration-150 hover:text-accent"
        >
          {"Let's be friends."}
        </Link>
      </div>

      {/* Nav columns */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12 mb-12">
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

        {/* More */}
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            More
          </h4>
          <nav className="flex flex-col gap-2">
            <Link href="/newsletter" className="text-text hover:text-accent transition-colors duration-150 text-sm">
              Monty Monthly
            </Link>
            <Link href="/events" className="text-text hover:text-accent transition-colors duration-150 text-sm">
              Events
            </Link>
            <Link href="/links" className="text-text hover:text-accent transition-colors duration-150 text-sm">
              Links
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

        {/* Connect — D-07: no "Contact" heading; email + link woven in */}
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            Connect
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
