import Link from "next/link";

/**
 * V3Footer — full-sitemap footer for the Pumpkin Amber v3 system.
 *
 * Replaces InkFooter on all non-homepage routes via ConditionalFooter.
 *
 * Server Component — pure markup, no hooks.
 *
 * Phase 17.2 update (D-09, D-10):
 *  - "Let's be friends." signature is a mailto link (quick task 260706-tx6; About page removed)
 *  - /uses label renamed from "Stack" to "Things I Love"
 *  - /newsletter link removed from Writing column (folded into /writing)
 *  - /events and /links links removed from Community column
 *  - Archive column (/photos, /watching) removed entirely
 *  - Prometheus column added (/prometheus internal link)
 *  - Woven socials row added (email, GitHub, X/Twitter, LinkedIn)
 *
 * Copy rules (CLAUDE.md): no em dashes, no location.
 * Professional identity: Founder of Prometheus.
 */
export function V3Footer() {
  return (
    <footer className="border-t border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-inverse)] px-7 py-14 md:px-40 md:py-20">
      {/* Big signature line — LOCKED copy from prototype 002 index.html */}
      <a
        href="mailto:monty@prometheus.today?subject=Saying%20hi&body=Hi%20Monty%2C%0A%0A"
        className="block font-display font-bold text-[clamp(2.4rem,9vw,7rem)] leading-[0.9] text-[var(--color-text-inverse)] mb-16 hover:text-[var(--accent)] transition-colors"
      >
        {"Let's be friends."}
      </a>

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
                href="/building"
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
                Things I Love
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
          </ul>
        </div>

        {/* Community */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-4">
            Community
          </h3>
          <ul className="space-y-0">
            <li>
              <a
                href="https://prometheus.today"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                prometheus.today
              </a>
            </li>
          </ul>
        </div>

        {/* Prometheus */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-4">
            Founder
          </h3>
          <ul className="space-y-0">
            <li>
              <Link
                href="/prometheus"
                className="block font-display text-sm text-[var(--color-text-inverse)] hover:text-[var(--accent)] transition-colors py-1"
              >
                Prometheus
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Woven socials row — replaces /links page function per D-09 */}
      <div className="mt-12 pt-6 border-t border-[var(--color-border-strong)] flex flex-wrap gap-x-6 gap-y-2 font-display text-sm text-[var(--color-text-inverse)]">
        <a
          href="mailto:monty@prometheus.today"
          className="hover:text-[var(--accent)] transition-colors"
        >
          Email
        </a>
        <a
          href="https://github.com/MSizzle"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)] transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://x.com/thefullmonty0"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)] transition-colors"
        >
          X / Twitter
        </a>
        <a
          href="https://linkedin.com/in/monty-singer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)] transition-colors"
        >
          LinkedIn
        </a>
      </div>

      {/* Colophon */}
      <div className="mt-8 pt-6 border-t border-[var(--color-border-strong)] flex flex-col gap-3 md:flex-row md:items-center md:justify-between font-mono text-xs text-[var(--color-text-muted)]">
        <span>{"© "}{new Date().getFullYear()}{" montysinger.com"}</span>
        <span>{"Built with Next.js · Hosted on Vercel"}</span>
      </div>
    </footer>
  );
}
