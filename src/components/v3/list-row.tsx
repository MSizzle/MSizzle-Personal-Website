/* ── v3 ListRow ──
   site.css lines 55-66:
     .row { grid 60px 1fr auto; gap 18px; py 22px; border-bottom; hover → bg-text color-bg }
     .n numeral (mono sm muted) | .ti title (display 500 xl uppercase) + .ar arrow (opacity-0)
     .ex excerpt (sans sm muted) | .m meta (mono xs uppercase muted nowrap)
*/
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  /** Ordinal or section numeral shown in the first grid column */
  numeral?: string;
  title: ReactNode;
  href: string;
  /** Short excerpt rendered below the title */
  excerpt?: ReactNode;
  /** Trailing meta (date, tag, etc.) in the third grid column */
  meta?: ReactNode;
  /** Larger display sizing variant */
  big?: boolean;
};

export function ListRow({ numeral, title, href, excerpt, meta, big = false }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        // layout
        "group grid gap-[18px] items-center",
        "border-b border-border",
        "py-[22px] px-[18px] -mx-[18px]",
        // hover-invert: bg and text flip
        "transition-[background,color] duration-150",
        "hover:bg-text hover:text-bg",
        // grid columns: 60px numeral | 1fr content | auto meta
        "[grid-template-columns:60px_1fr_auto]",
        big && "py-7"
      )}
    >
      {/* Numeral (.n) */}
      <span
        className={cn(
          "font-mono text-sm text-text-muted",
          "group-hover:text-bg"
        )}
      >
        {numeral}
      </span>

      {/* Title + excerpt (.ti / .ex) */}
      <div>
        <div
          className={cn(
            "font-display font-medium uppercase tracking-[-0.01em] flex items-center gap-[14px]",
            big ? "text-2xl" : "text-xl"
          )}
        >
          {title}
          {/* Reveal arrow (.ar) */}
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            aria-hidden="true"
          >
            &rarr;
          </span>
        </div>
        {excerpt && (
          <span
            className={cn(
              "block font-sans text-sm text-text-muted normal-case tracking-normal mt-[6px] font-normal max-w-[62ch]",
              "group-hover:text-bg group-hover:opacity-75"
            )}
          >
            {excerpt}
          </span>
        )}
      </div>

      {/* Meta (.m) */}
      {meta && (
        <span
          className={cn(
            "font-mono text-xs uppercase text-text-muted whitespace-nowrap",
            "group-hover:text-bg"
          )}
        >
          {meta}
        </span>
      )}
    </Link>
  );
}
