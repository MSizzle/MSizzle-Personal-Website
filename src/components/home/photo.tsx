/* ── Photo ──
   Placeholder photo block with light / dark variants (D-07).
   Ken-burns / breathe ambient-drift hooks are CSS classes gated by
   reduced-motion in Plan 01 — no JS required here.
   Hard corners (D-04) — radius 0 via CSS; no extra rounded classes added.
   Server Component — no "use client".

   Props:
     caption?     — optional overlay label (bottom-left .cap)
     dark?        — dark variant (.photo.dark) for dark-band placement
     aspectRatio? — CSS aspect-ratio value (e.g. "16/6.5", "3/2.2")
     breathe?     — enable the ambient-breathe keyframe on the container
     className?   — additional class names (e.g. slide, reveal wrappers) */

import { cn } from "@/utils/cn";

type Props = {
  caption?: string;
  dark?: boolean;
  aspectRatio?: string;
  breathe?: boolean;
  className?: string;
};

export function Photo({
  caption,
  dark = false,
  aspectRatio,
  breathe = false,
  className,
}: Props) {
  return (
    <div
      className={cn("photo", dark && "dark", breathe && "breathe", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <div className="img kenburns" />
      <span className="icon">◲</span>
      {caption && <span className="cap">{caption}</span>}
    </div>
  );
}
