/* ── v3 SectionLabel ──
   site.css lines 51-52:
     .slabel { font-family:var(--font-mono); font-size:var(--text-sm); text-transform:uppercase;
               letter-spacing:0.12em; color:var(--accent); display:block; margin-bottom:var(--space-8) }
     .shead  { display:flex; justify-content:space-between; align-items:baseline; ... }
*/
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Optional counter or section numeral shown at the trailing edge (baseline-aligned) */
  numeral?: string;
};

export function SectionLabel({ children, numeral }: Props) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-mono text-sm uppercase tracking-[0.12em] text-accent block mb-8">
        {children}
      </span>
      {numeral && (
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted">
          {numeral}
        </span>
      )}
    </div>
  );
}
