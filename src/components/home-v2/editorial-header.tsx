import Link from "next/link";
import { cn } from "@/utils/cn";

type Props = {
  /**
   * Bolds the matching nav link. Falsy = no link bolded (homepage default).
   * Per quick task 260706-tx6: 4-item nav (Prometheus, Building, Writing, Contact).
   * Contact is an in-page anchor and never receives the active/bold treatment.
   */
  active?: "Building" | "Writing";
};

// Four nav destinations. Order: Prometheus, Building, Writing, Contact.
// Prometheus points at the external company site; Contact is an in-page anchor.
const LINKS = [
  { label: "Prometheus", href: "https://prometheus.today" },
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
 * cells split by vertical dividers. On hover a vermilion fill wipes down from
 * the top and the label flips to paper. The label is wrapped in a `<span>` so
 * it rides above the fill. Active route uses `.nav-cell--active`.
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
            const external = link.href.startsWith("http");
            if (link.href.startsWith("#") || external) {
              return (
                <li key={link.label} className="flex">
                  <a
                    href={link.href}
                    className="nav-cell"
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span>{link.label}</span>
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
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
