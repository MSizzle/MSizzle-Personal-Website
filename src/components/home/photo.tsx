/* ── Photo ──
   Photo frame with light / dark variants (D-07). Renders a real next/Image
   when `src` is provided, otherwise a solid placeholder block (D-04 hard
   corners via CSS). Ken-burns / breathe ambient-drift hooks are CSS classes
   gated by reduced-motion in Plan 01.

   Drop real photos in /public (e.g. /home/portrait-1.jpg) and pass the path
   as `src`. The homepage photo slots are:
     - Hero portrait carousel (hero.tsx) x3
     - Building wide shot (section-building.tsx) x1
     - Work grid (section-work.tsx) x4
     - Things I Love marquee (section-loves.tsx / photo-marquee.tsx) x4
     - Monty Monthly issue covers (section-newsletter.tsx ISSUES[].cover) x4

   Props:
     src?         - image path; when set, renders next/Image (cover) over the frame
     alt?         - alt text (falls back to caption, then "")
     caption?     - optional overlay label (bottom-left .cap)
     dark?        - dark variant (.photo.dark) for dark-band placement
     aspectRatio? - CSS aspect-ratio value (e.g. "16/6.5", "3/2.2")
     breathe?     - enable the ambient-breathe keyframe on the container
     priority?    - next/Image priority (use for above-the-fold hero images)
     sizes?       - next/Image sizes hint (responsive)
     className?   - additional class names (e.g. slide, reveal wrappers) */

import Image from "next/image";
import { cn } from "@/utils/cn";

type Props = {
  src?: string;
  alt?: string;
  caption?: string;
  dark?: boolean;
  aspectRatio?: string;
  breathe?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function Photo({
  src,
  alt,
  caption,
  dark = false,
  aspectRatio,
  breathe = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
}: Props) {
  return (
    <div
      className={cn("photo", dark && "dark", breathe && "breathe", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <div className="img kenburns">
        {src && (
          <Image
            src={src}
            alt={alt ?? caption ?? ""}
            fill
            sizes={sizes}
            priority={priority}
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
      {/* Placeholder marker only when there is no real image */}
      {!src && <span className="icon">◲</span>}
      {caption && <span className="cap">{caption}</span>}
    </div>
  );
}
