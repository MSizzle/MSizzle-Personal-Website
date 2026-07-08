import { cn } from "@/utils/cn";

/**
 * EmojiBadge - Building index card face (icon-badge-on-color).
 *
 * Renders the project's Notion emoji large and centered on a solid colored
 * field. Used as the card cover when no real cover image is passed: every
 * project carries an emoji, so this is a consistent, colorful thumbnail with
 * zero image processing and no cropping fragility. The project name is NOT
 * repeated on the badge -- it lives once in the card's text block below.
 *
 * FIELD ALTERNATION: `field` MUST be driven by the caller from list index
 * (deterministic for SSG/ISR), never random at render time.
 *
 * Design DNA: hard corners, solid fields (no gradients), same 4/3 face
 * proportion as CardCover so the text block below aligns across a mixed grid.
 * Server component -- no "use client", safe under ISR.
 */
type Props = {
  /** Emoji glyph to render (e.g. "🧬"). */
  emoji: string;
  /** Field color for the badge tile. Deterministic by caller index. */
  field?: "ink" | "cream" | "vermilion" | "gray";
};

export function EmojiBadge({ emoji, field = "cream" }: Props) {
  return (
    <div className={cn("emoji-badge", `emoji-badge--${field}`)}>
      <span className="glyph" role="img" aria-hidden="true">
        {emoji}
      </span>
    </div>
  );
}
