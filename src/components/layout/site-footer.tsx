import Link from "next/link";

/**
 * SiteFooter — the single footer for every page (sketch 014, concept 01:
 * "editorial ledger"). Replaces both the inner-page V3Footer ("Let's be
 * friends.") and the homepage SectionFooter, so the whole site shares one
 * consistent footer.
 *
 * Light paper field with a solid Vermilion top rule (no gradient, per the
 * brand rule), a big signature, and Explore / Elsewhere link columns.
 *
 * id="contact" is preserved so the nav "Contact" anchor still targets it.
 * Copy rules (CLAUDE.md): no em dashes, no location. Identity: Founder of Prometheus.
 * External anchors carry rel="noopener noreferrer".
 */
const EXPLORE = [
  { label: "Building", href: "/building" },
  { label: "Writing", href: "/writing" },
  { label: "Things I Love", href: "/#loves" },
  { label: "Prometheus", href: "/prometheus" },
];

const ELSEWHERE: { label: string; href: string; external: boolean }[] = [
  { label: "Email", href: "mailto:monty@prometheus.today", external: false },
  { label: "X / Twitter", href: "https://x.com/themontysinger", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/monty-singer", external: true },
  { label: "Monty Monthly", href: "https://montymonthly.substack.com", external: true },
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      {/* Invert offset rule — solid offset shape, no gradient */}
      <div className="h-2 bg-[var(--color-invert)]" aria-hidden="true" />

      <div className="grid grid-cols-1 gap-10 px-7 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8 md:px-40 md:py-20">
        {/* Identity */}
        <div>
          <div className="font-display text-[clamp(2rem,5vw,2.75rem)] font-extrabold leading-[0.95] tracking-[-0.02em]">
            Monty Singer
          </div>
          <p className="mt-3 max-w-[32ch] text-sm text-[var(--color-text-muted)]">
            Founder of Prometheus. Builder, writer, doer.
          </p>
          <p className="mt-7 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            {"© "}
            {new Date().getFullYear()}
            {" Monty Singer · montysinger.com"}
          </p>
        </div>

        {/* Explore */}
        <nav aria-label="Explore">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Explore
          </h2>
          <ul className="space-y-1">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-display text-[15px] font-bold transition-colors hover:underline hover:underline-offset-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Elsewhere */}
        <nav aria-label="Elsewhere">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Elsewhere
          </h2>
          <ul className="space-y-1">
            {ELSEWHERE.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  {...(l.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="font-display text-[15px] font-bold transition-colors hover:underline hover:underline-offset-4"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
