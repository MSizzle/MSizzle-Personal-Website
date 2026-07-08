import type { ReactNode } from "react";

/**
 * PageHeroBand - full-bleed colored subpage hero (D-01 restyle).
 *
 * Replaces the pale white-card-on-paper PageHero at the top of index pages
 * with a high-contrast full-width band. "vermilion" (default) renders the
 * headline in white with a hard ink offset-shadow (brutalist DNA); "ink" is
 * the near-black variant. No photo -- contrast comes from the solid field.
 *
 * Full-bleed: this component IS the section, so callers must NOT wrap it in a
 * padded container. Inner padding matches the site gutter (px-6 / md:px-40).
 *
 * Server component -- pure presentation, safe under ISR.
 */
type Props = {
  title: ReactNode;
  /** Optional breadcrumb line above the title. */
  crumb?: ReactNode;
  /** Optional subtitle below the title. */
  sub?: ReactNode;
  /** Field color for the band. "vermilion" (default) or "ink". */
  tone?: "vermilion" | "ink";
};

export function PageHeroBand({ title, crumb, sub, tone = "vermilion" }: Props) {
  return (
    <section className={tone === "ink" ? "hero-band hero-band--ink" : "hero-band"}>
      <div
        className="px-6 md:px-40"
        style={{ paddingTop: "clamp(80px,15vh,150px)", paddingBottom: "clamp(56px,9vh,96px)" }}
      >
        {crumb && <div className="hero-band-crumb">{crumb}</div>}
        <h1 className="hero-band-title">{title}</h1>
        {sub && <p className="hero-band-sub">{sub}</p>}
      </div>
    </section>
  );
}
