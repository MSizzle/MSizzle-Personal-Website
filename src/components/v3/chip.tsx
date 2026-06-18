/* ── v3 Chip ──
   site.css line 102:
     .chip { font-family:var(--font-mono); font-size:var(--text-xs); text-transform:uppercase;
             letter-spacing:0.08em; border:1px solid var(--color-border); padding:7px 12px;
             border-radius:var(--radius-full); color:var(--color-text-dim) }
*/
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Chip({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-xs uppercase tracking-[0.08em]",
        "border border-border rounded-full px-3 py-[7px] text-text-dim",
        className
      )}
    >
      {children}
    </span>
  );
}
