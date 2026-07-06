import Link from "next/link";
import { cn } from "@/utils/cn";

type Props = {
  /**
   * Bolds the matching nav link. Falsy = no link bolded (homepage default).
   * Per quick task 260706-tx6: 4-item nav (Prometheus, Building, Writing, Contact).
   * Contact is an in-page anchor and never receives the active/bold treatment.
   */
  active?: "Prometheus" | "Building" | "Writing";
};

// Four nav destinations per quick task 260706-tx6 (reverses D-08).
// Order: Prometheus, Building, Writing, Contact.
const LINKS = [
  { label: "Prometheus", href: "/prometheus" },
  { label: "Building",   href: "/building"   },
  { label: "Writing",    href: "/writing"    },
  { label: "Contact",    href: "#contact"    },
] as const;

/**
 * Editorial header — shared across all routes.
 *
 * Updated in quick task 260706-tx6 (2026-07-06): nav reworked to Prometheus,
 * Building, Writing, Contact per Monty's new direction. This reverses D-08's
 * About/Projects/Writing/Uses set. Contact is a same-page anchor to the
 * footer contact block, not a route, and is never bolded as active.
 *
 * Server Component — pure presentational, imports `Link` only. Nav links use
 * the shared `.nav-cell` segmented style (globals.css): broad, full-height
 * cells split by vertical dividers that invert on hover (ink fill, vermilion
 * label). The active route uses `.nav-cell--active` (full-ink + bold at rest).
 */
export function EditorialHeader({ active }: Props) {
  return (
    <header className="hidden items-stretch justify-between border-b border-[color:var(--color-text)] bg-bg px-6 md:flex md:px-40">
      <Link
        href="/"
        className="flex items-center py-3.5 text-[22px] font-bold tracking-tight text-text"
      >
        Monty Singer
      </Link>
      <nav className="flex items-stretch">
        <ul className="flex list-none items-stretch text-[15px]">
          {LINKS.map((link) => {
            if (link.href.startsWith("#")) {
              return (
                <li key={link.label} className="flex">
                  <a href={link.href} className="nav-cell">
                    {link.label}
                  </a>
                </li>
              );
            }

            const isActive = active === link.label;
            return (
              <li key={link.label} className="flex">
                <Link
                  href={link.href}
                  className={cn("nav-cell", isActive && "nav-cell--active")}
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
