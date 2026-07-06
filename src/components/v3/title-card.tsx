/**
 * TitleCard - Phase 19 typographic card face (SC-1).
 *
 * Renders a pure text-based card face: mono kicker chip on vermilion,
 * Hanken Grotesk 800 clamped title, optional dek, on a paper (#faf9f7) or
 * ink (#17171a) field. Hard corners, no gradients, no images.
 *
 * Design DNA: inherits the hero "Create Order" block treatment at card scale.
 *
 * FIELD ALTERNATION: field color (paper vs ink) MUST be driven by the caller
 * from list index (e.g. index % 2 === 0 ? "paper" : "ink"). Never random at
 * render time -- SSG/ISR requires deterministic output per CONTEXT decision
 * "Variation between adjacent title-cards must be deterministic".
 *
 * COPY RULE: No em dashes in any user-visible string this component renders.
 */
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  /** Card headline text (required). */
  title: ReactNode;
  /** Mono kicker chip rendered on vermilion above the title. Optional. */
  kicker?: string;
  /** One-line descriptor rendered below the title. Optional. */
  dek?: string;
  /**
   * Field color for the card face.
   * "paper" (default) = #faf9f7 background, #171717 text.
   * "ink" = #17171a background, #faf9f7 text.
   * Must be driven deterministically by callers (e.g. by list index).
   */
  field?: "paper" | "ink";
  /**
   * CSS aspect-ratio value (e.g. "4/3", "3/2.2").
   * When provided, sets the inline aspect-ratio on the root element so
   * the card face fills its grid cell at the correct proportions.
   */
  aspectRatio?: string;
  /** Additional CSS class names for the root element. */
  className?: string;
};

/**
 * Pure typographic card face. No img, no next/image, no "use client".
 * Safe for server components and ISR.
 */
export function TitleCard({
  title,
  kicker,
  dek,
  field = "paper",
  aspectRatio,
  className,
}: Props) {
  return (
    <div
      className={cn("title-card", field === "ink" && "title-card--ink", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {kicker && (
        <span className="title-card-kicker">{kicker}</span>
      )}
      <div>
        <div className="title-card-title">{title}</div>
        {dek && <p className="title-card-dek">{dek}</p>}
      </div>
    </div>
  );
}
