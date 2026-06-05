import { FooterCol } from "@/components/editorial/footer-col";

/**
 * Inverted-ink site footer — globalized via `src/app/layout.tsx` per Path 2.
 *
 * Extracted verbatim from the inline footer that used to live in
 * `src/app/page.tsx` (HOME-V2-11 / D-29–D-31). Server Component — pure markup,
 * no client hooks. Renders below every route's `children` from the root layout.
 */
export function InkFooter() {
  return (
    <footer className="bg-footer-bg text-footer-fg px-7 py-14 md:px-40 md:py-20">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12">
        {/* Col 1 — Colophon */}
        <div className="border-b border-footer-rule pb-6 md:border-b-0 md:pb-0">
          <div className="text-label uppercase text-footer-mute">MONTY SINGER</div>
        </div>

        {/* Col 2 — Studio */}
        <div className="border-b border-footer-rule pb-6 md:border-b-0 md:pb-0">
          <FooterCol
            title="Studio"
            links={[
              { label: "Prometheus",     href: "https://prometheus.today" },
              { label: "Selected Works", href: "/projects" },
              { label: "Process Notes",  href: "/writing" },
            ]}
          />
        </div>

        {/* Col 3 — Library */}
        <div className="border-b border-footer-rule pb-6 md:border-b-0 md:pb-0">
          <FooterCol
            title="Library"
            links={[
              { label: "Monty Monthly", href: "/newsletter" },
              { label: "Essays",        href: "/writing" },
              { label: "Links",         href: "/links" },
            ]}
          />
        </div>

        {/* Col 4 — About */}
        <div className="border-b border-footer-rule pb-6 md:border-b-0 md:pb-0">
          <FooterCol
            title="About"
            links={[
              { label: "About",         href: "/about" },
              { label: "Photo Archive", href: "/photos" },
              { label: "Contact",       href: "mailto:monty@prometheus.today" },
            ]}
          />
        </div>
      </div>

      {/* Bottom row — copyright + socials (D-31) */}
      <div className="mt-24 pt-7 border-t border-footer-rule flex flex-col gap-6 md:flex-row md:items-baseline md:justify-between">
        <span className="text-meta uppercase text-footer-fg">
          © 2026 Monty Singer · Washington, D.C.
        </span>
        <div className="flex flex-wrap gap-6">
          <a
            href="https://x.com/thefullmonty0"
            className="flex min-h-11 items-center text-meta uppercase text-footer-fg hover:text-footer-fg/70"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://github.com/MSizzle"
            className="flex min-h-11 items-center text-meta uppercase text-footer-fg hover:text-footer-fg/70"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/monty-singer"
            className="flex min-h-11 items-center text-meta uppercase text-footer-fg hover:text-footer-fg/70"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="mailto:monty@prometheus.today"
            className="flex min-h-11 items-center text-meta uppercase text-footer-fg hover:text-footer-fg/70"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
