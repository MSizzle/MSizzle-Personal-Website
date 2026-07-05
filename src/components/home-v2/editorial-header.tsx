import Link from "next/link";
import { cn } from "@/utils/cn";

type Props = {
  /**
   * Bolds the matching nav link. Falsy = no link bolded (homepage default).
   * Per D-08: 4-item lean primary nav (About, Projects, Writing, Uses).
   * Each route bolds its own nav label.
   */
  active?: "About" | "Projects" | "Writing" | "Uses";
};

// Four nav destinations per D-08 (lean primary nav).
// Order: About, Projects, Writing, Uses.
const LINKS = [
  { label: "About",    href: "/about"    },
  { label: "Projects", href: "/projects" },
  { label: "Writing",  href: "/writing"  },
  { label: "Uses",     href: "/uses"     },
] as const;

/**
 * Editorial header — shared across all routes per D-08 (lean 4-item primary nav).
 *
 * Updated in Phase 17.2: nav reduced from 5 items to 4 (About, Projects,
 * Writing, Uses). "Building" renamed to "Projects". /events and /links removed.
 *
 * Server Component — pure presentational, imports `Link` only. Preserves
 * the 44px tap target (`min-h-11`) and hover opacity transitions from the
 * original Phase 10 markup.
 *
 * References: D-08 (lean primary nav), D-10 (remove cut routes).
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
