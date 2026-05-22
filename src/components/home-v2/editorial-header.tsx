import Link from "next/link";
import { cn } from "@/utils/cn";

type Props = {
  /**
   * Bolds the matching nav link. Falsy = no link bolded (homepage default).
   * Per handoff §3/§4: each archive route bolds its own nav label.
   */
  active?: "Building" | "Writing" | "Events" | "About" | "Links";
};

// Five nav destinations per D-05 (homepage flips /blog → /writing in this plan).
// Order matches the Phase 10 inline header verbatim.
const LINKS = [
  { label: "Building", href: "/projects" },
  { label: "Writing",  href: "/writing"  },
  { label: "Events",   href: "/events"   },
  { label: "About",    href: "/about"    },
  { label: "Links",    href: "/links"    },
] as const;

/**
 * Editorial header — shared across /, /writing, /events, /photos per D-25
 * (Option A — co-located with manifesto-reveal.tsx in home-v2/).
 *
 * Extracted from src/app/page.tsx lines 60-94 (Phase 10 inline header) so
 * Plan 11-03 can ship /writing + reuse for /events (Plan 11-04) + /photos
 * (Plan 11-05). The optional `active` prop bolds the matching nav link per
 * handoff §3 ("Writing bolded vs other nav links muted" on /writing) and
 * handoff §4 ("Events bolded" on /events).
 *
 * Server Component — pure presentational, imports `Link` only. Preserves
 * the 44px tap target (`min-h-11`) and hover opacity transitions from the
 * original Phase 10 markup (HOME-V2-12 carryforward).
 *
 * References: D-05 (writing destination flip), D-25 (home-v2/ path).
 */
export function EditorialHeader({ active }: Props) {
  return (
    <header className="hidden md:flex items-baseline justify-between px-6 pt-7 md:px-40 md:pt-9">
      <Link href="/" className="text-[22px] font-bold tracking-tight text-ink">
        Monty Singer
      </Link>
      <nav>
        <ul className="flex list-none flex-wrap items-baseline gap-x-6 gap-y-2 text-nav md:gap-x-8">
          {LINKS.map((link) => {
            const isActive = active === link.label;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex min-h-11 items-center transition-opacity hover:opacity-60",
                    isActive ? "font-bold text-ink" : "text-muted"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
