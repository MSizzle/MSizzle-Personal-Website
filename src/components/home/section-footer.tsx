import Link from "next/link";

/**
 * SectionFooter: Footer beat (D-12 three columns, D-13 velvet-rope).
 * Server Component (RSC only, no client boundary).
 *
 * Velvet-rope preserved (D-13): no "Contact" heading, no contact CTA button,
 * no availability / reach-out line. Email is only a plain link in Elsewhere.
 * External anchors carry rel="noopener noreferrer" (threat T-17.4-07).
 *
 * This component stays the ONLY footer on /. conditional-footer.tsx returns
 * null on pathname==="/" so the global footer is suppressed on the homepage.
 *
 * The band wrapper (section.band-dark#footer) is supplied by the orchestrator (Plan 08).
 */
export function SectionFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        {/* Three-column footer grid (D-12) */}
        <div className="foot-grid">
          {/* Colophon */}
          <div className="foot-col">
            <h4>Colophon</h4>
            <p className="colophon">
              Designed and built by Monty. Type set in Hanken Grotesk. Content managed in Notion,
              deployed on Vercel.
            </p>
            <div className="footmark">© 2026 Monty Singer</div>
          </div>

          {/* Navigate */}
          <div className="foot-col">
            <h4>Navigate</h4>
            <Link href="#building">Building</Link>
            <Link href="#work">Work</Link>
            <Link href="#writing">Writing</Link>
            <Link href="#loves">Things I love</Link>
            <Link href="/uses">Uses</Link>
          </div>

          {/* Elsewhere: external links carry rel=noopener noreferrer (T-17.4-07) */}
          <div className="foot-col">
            <h4>Elsewhere</h4>
            <a
              href="mailto:monty@prometheus.today"
              rel="noopener noreferrer"
            >
              Email
            </a>
            <a
              href="https://x.com/thefullmonty0"
              target="_blank"
              rel="noopener noreferrer"
            >
              X / Twitter
            </a>
            <a
              href="https://linkedin.com/in/monty-singer"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://montymonthly.substack.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Monty Monthly
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
