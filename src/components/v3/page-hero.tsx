/* ── v3 PageHero ──
   site.css lines 38-45:
     .page-hero { padding: clamp(90px,16vh,180px) 0 }
     .crumb { mono xs uppercase muted mb-26px }
     h1 { display 700 uppercase leading-[0.86] tracking-[-0.03em] clamp(2.8rem,11vw,8rem); sig }
     h1 .out { -webkit-text-stroke:2px accent; transparent; no shadow }
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
};

export function PageHero({ title, crumb, sub, outline = false }: Props) {
  return (
    <div
      className="pb-12"
      style={{ paddingTop: "clamp(90px,16vh,180px)" }}
    >
      {crumb && (
        <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted mb-[26px]">
          {crumb}
        </div>
      )}

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
