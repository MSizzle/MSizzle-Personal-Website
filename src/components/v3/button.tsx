/* ── v3 Button ──
   site.css lines 68-73:
     .btn { inline-flex; font-mono; sm; uppercase; tracking 0.08em; px 24px py 14px;
            border border-border-strong; color-text; hover → bg-text color-bg }
     .btn-invert { bg-invert border-invert color-bg; hover → transparent color-invert }
*/
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  children: ReactNode;
  /** When provided, renders as a next/link */
  href?: string;
  /** When provided (and no href), renders as a button with onClick */
  onClick?: () => void;
  /** Filled invert variant (black fill, black border on hover) */
  invert?: boolean;
  className?: string;
};

const BASE =
  "inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.08em] " +
  "px-6 py-[14px] border transition-[background,color] duration-150 cursor-pointer";

export function Button({ children, href, onClick, invert = false, className }: Props) {
  const classes = cn(
    BASE,
    invert
      ? "bg-invert border-invert text-text-inverse hover:bg-transparent hover:text-invert"
      : "border-border-strong text-text hover:bg-text hover:text-bg",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
