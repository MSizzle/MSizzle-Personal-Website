/* ── v3 BigList ──
   site.css lines 154-167:
     .big-list a { flex justify-between; border-top; clamp(2rem,9.5vw,8rem); sig + shadow }
     .big-list a.out { -webkit-text-stroke:2px invert; transparent fill }
     .big-list a .tag { mono xs muted; hidden <760px }
     hover → color:invert, text-shadow:none
*/
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Item = {
  label: ReactNode;
  href: string;
  /** Optional short mono label hidden below md breakpoint */
  tag?: string;
  /** Outline stroke variant (sig-out) instead of filled sig */
  outline?: boolean;
};

type Props = {
  items: Item[];
};

export function BigList({ items }: Props) {
  return (
    <div className="big-list">
      {items.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          className={cn(
            // layout
            "flex items-center justify-between gap-6",
            "border-t border-border py-[1.4vh]",
            // last item gets border-bottom too
            i === items.length - 1 && "border-b border-border",
            // type
            "font-display font-bold uppercase",
            "text-[clamp(2rem,9.5vw,8rem)] leading-[1.02] tracking-[-0.03em]",
            // sig treatment: filled by default, outline variant
            item.outline ? "sig-out" : "sig",
            // hover: invert color, no shadow
            "transition-[color,text-shadow] duration-150",
            "hover:text-invert hover:[text-shadow:none]",
            item.outline && "hover:[-webkit-text-stroke-color:var(--color-invert)]"
          )}
        >
          <span>{item.label}</span>
          {item.tag && (
            <span
              className={cn(
                "font-mono font-normal text-xs tracking-[0.12em] text-text-muted whitespace-nowrap",
                "transition-[color] duration-150",
                "group-hover:text-invert",
                // hidden below 760px (md = 768px, close enough; use max-md for <768)
                "hidden md:inline"
              )}
            >
              {item.tag}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
