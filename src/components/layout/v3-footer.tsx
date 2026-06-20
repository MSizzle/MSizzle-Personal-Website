import Link from "next/link";

/**
 * V3Footer — full-sitemap footer for the Pumpkin Amber v3 system.
 *
 * Replaces InkFooter on all non-homepage routes via ConditionalFooter.
 * InkFooter is preserved as a reference until Phase 17 confirms the swap.
 *
 * Server Component — pure markup, no hooks.
 *
 * Design contract (16-UI-SPEC.md Footer section):
 *  - Big signature line: LOCKED from prototype 002 index.html — see rendered JSX below
 *  - Five columns: Building, Writing, Community, Archive, About
 *  - Pumpkin Amber tokens: bg-[var(--color-surface)], text-[var(--color-text-inverse)]
 *  - External links (prometheus.today) get rel="noopener noreferrer" target="_blank"
 *
 * Copy rules (CLAUDE.md): no em dashes, no location.
 * Professional identity: Founder of Prometheus.
 */
export function V3Footer() {
  return (
    <footer className="border-t border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-inverse)] px-7 py-14 md:px-40 md:py-20">
      {/* Big signature line — LOCKED copy from prototype 002 index.html */}
      <Link
        href="/links"
        className="block font-display font-bold text-[clamp(2.4rem,9vw,7rem)] leading-[0.9] text-[var(--color-text-inverse)] mb-16 hover:text-[var(--accent)] transition-colors"
      >
        {"Let's be friends."}
      </Link>

      {/* Sitemap columns */}
      <div className="grid grid-cols-2 gap-10 md:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] md:gap-6">
        {/* Building */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-4">
            Building
          </h3>
          <ul className="space-y-0">
            <li>
              <Link
                href="/projects"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Works
              </Link>
            </li>
            <li>
              <Link
                href="/uses"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Stack
              </Link>
            </li>
          </ul>
        </div>

        {/* Writing */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-4">
            Writing
          </h3>
          <ul className="space-y-0">
            <li>
              <Link
                href="/writing"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Essays
              </Link>
            </li>
            <li>
              <Link
                href="/newsletter"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Newsletter
              </Link>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-4">
            Community
          </h3>
          <ul className="space-y-0">
            <li>
              <Link
                href="/events"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Events
              </Link>
            </li>
            <li>
              <a
                href="https://prometheus.today"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Prometheus
              </a>
            </li>
            <li>
              <Link
                href="/links"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Links
              </Link>
            </li>
          </ul>
        </div>

        {/* Archive */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-4">
            Archive
          </h3>
          <ul className="space-y-0">
            <li>
              <Link
                href="/photos"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Photos
              </Link>
            </li>
            <li>
              <Link
                href="/watching"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Watching
              </Link>
            </li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-4">
            About
          </h3>
          <ul className="space-y-0">
            <li>
              <Link
                href="/about"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Colophon */}
      <div className="mt-16 pt-6 border-t border-[var(--color-border-strong)] flex flex-col gap-3 md:flex-row md:items-center md:justify-between font-mono text-xs text-[var(--color-text-muted)]">
        <span>{"© "}{new Date().getFullYear()}{" montysinger.com"}</span>
        <span>{"Built with Next.js · Hosted on Vercel"}</span>
      </div>
    </footer>
  );
}
