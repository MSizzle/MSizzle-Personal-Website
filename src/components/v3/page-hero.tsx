/* ── v3 PageHero ──
   site.css lines 38-45:
     .page-hero { padding: clamp(90px,16vh,180px) 0 }
     .crumb { mono xs uppercase muted mb-26px }
     h1 { display 700 uppercase leading-[0.86] tracking-[-0.03em] clamp(2.8rem,11vw,8rem); sig }
     h1 .out { -webkit-text-stroke:2px invert; transparent; no shadow }
     .sub { mt-24px max-w-54ch text-dim text-lg }
*/
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  title: ReactNode;
  /** Optional breadcrumb line above the title */
  crumb?: ReactNode;
  /** Optional subtitle below the title */
  sub?: ReactNode;
  /** Outline stroke variant for the h1 (sig-out) instead of filled sig */
  outline?: boolean;
  /**
   * Drops the top padding entirely. Use when a cover image sits directly above
   * the hero: the standing padding exists to give the title air below the nav,
   * and under a cover it just opens a dead gap. Flush lets the cover meet the
   * title box.
   */
  flush?: boolean;
};

/**
 * The breadcrumb line above a page title. Exported so pages that need to place
 * the crumb somewhere other than inside PageHero (above a cover image, say)
 * reuse the same type treatment instead of redeclaring it and drifting.
 */
export function PageCrumb({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted mb-[26px]">
      {children}
    </div>
  );
}

export function PageHero({ title, crumb, sub, outline = false, flush = false }: Props) {
  return (
    <div
      className="pb-12"
      style={{ paddingTop: flush ? "0px" : "clamp(90px,16vh,180px)" }}
    >
      {crumb && <PageCrumb>{crumb}</PageCrumb>}

      <h1
        className={cn(
          "font-display font-bold uppercase leading-[0.86] tracking-[-0.03em]",
          "text-[clamp(2.8rem,11vw,8rem)]",
          // sig treatment
          outline ? "sig-out" : "sig"
        )}
      >
        {title}
      </h1>

      {sub && (
        <div className="mt-6 max-w-[54ch] text-text-dim text-lg">
          {sub}
        </div>
      )}
    </div>
  );
}
