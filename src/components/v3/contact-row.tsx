/* ── v3 ContactRow ──
   External-aware sibling of ListRow (src/components/v3/list-row.tsx).

   ListRow renders a next/link, which cannot carry mailto: hrefs or the
   target/rel attributes external links need. ContactRow renders a plain <a>
   so the /contact page can point rows at mailto: and off-site profiles while
   keeping the exact same brutalist DNA: 60px numeral | title + reveal-arrow +
   handle | action-word meta, with the hover-invert (bg flips to ink, text to
   paper). Rows use the `big` sizing so they read large on the contact page.

   Server component — pure presentation, no client hooks.
   External links get target="_blank" rel="noopener noreferrer"; mailto: opens
   in place (no target/rel). No gradients, no em dashes (brand rules).
*/
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  /** Ordinal shown in the first grid column, e.g. "01" */
  numeral?: string;
  /** Link label, e.g. "Email" */
  title: ReactNode;
  /** Destination: mailto:, https://, etc. */
  href: string;
  /** Handle rendered below the title, e.g. "@themontysinger" */
  handle?: ReactNode;
  /** Trailing action word in the third column, e.g. "Follow" */
  action?: ReactNode;
  /** Off-site link: adds target="_blank" rel="noopener noreferrer". */
  external?: boolean;
};

export function ContactRow({ numeral, title, href, handle, action, external = false }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        // layout — matches ListRow (big variant)
        "group grid gap-[18px] items-center",
        "border-b border-border",
        "py-7 px-[18px] -mx-[18px]",
        // hover-invert: bg and text flip
        "transition-[background,color] duration-150",
        "hover:bg-text hover:text-bg",
        // grid columns: 60px numeral | 1fr content | auto meta
        "[grid-template-columns:60px_1fr_auto]"
      )}
    >
      {/* Numeral (.n) */}
      <span className={cn("font-mono text-sm text-text-muted", "group-hover:text-bg")}>
        {numeral}
      </span>

      {/* Title + handle (.ti / .ex) */}
      <div>
        <div className="font-display font-medium uppercase tracking-[-0.01em] flex items-center gap-[14px] text-2xl">
          {title}
          {/* Reveal arrow (.ar) */}
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            aria-hidden="true"
          >
            &rarr;
          </span>
        </div>
        {handle && (
          <span
            className={cn(
              "block font-sans text-sm text-text-muted normal-case tracking-normal mt-[6px] font-normal",
              "group-hover:text-bg group-hover:opacity-75"
            )}
          >
            {handle}
          </span>
        )}
      </div>

      {/* Action meta (.m) */}
      {action && (
        <span
          className={cn(
            "font-mono text-xs uppercase text-text-muted whitespace-nowrap",
            "group-hover:text-bg"
          )}
        >
          {action}
        </span>
      )}
    </a>
  );
}
