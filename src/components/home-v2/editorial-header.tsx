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
 * Server Component — pure presentational, imports `Link` only. Preserves
 * the 44px tap target (`min-h-11`) and hover opacity transitions from the
 * original Phase 10 markup.
 */
export function EditorialHeader({ active }: Props) {
  return (
    <header className="hidden items-center justify-between border-b border-[color:var(--color-text)] bg-bg px-6 py-3 md:flex md:px-40">
      <Link href="/" className="text-[22px] font-bold tracking-tight text-text">
        Monty Singer
      </Link>
      <nav>
        <ul className="flex list-none flex-wrap items-center gap-x-6 gap-y-2 text-[15px] md:gap-x-8">
          {LINKS.map((link) => {
            if (link.href.startsWith("#")) {
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex min-h-9 items-center text-text-muted transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </a>
                </li>
              );
            }

            const isActive = active === link.label;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex min-h-9 items-center transition-opacity hover:opacity-60",
                    isActive ? "font-bold text-text" : "text-text-muted"
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
