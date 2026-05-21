import type { Metadata } from "next";
import { Rule } from "@/components/editorial/rule";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { SectionLabel } from "@/components/editorial/section-label";
import { ListRow } from "@/components/editorial/list-row";
import { AllLink } from "@/components/editorial/all-link";
import { IntroLink } from "@/components/editorial/intro-link";
import { FooterCol } from "@/components/editorial/footer-col";

// D-14 layer 1: metadata-level noindex/nofollow
// (Layer 2 = sitemap exclusion; Layer 3 = robots.ts Disallow — both shipped in Task 1.)
export const metadata: Metadata = {
  title: "Specimen — Design Tokens",
  description: "Internal design-QA page for Phase 9 tokens and editorial primitives.",
  robots: { index: false, follow: false },
};

// 10 palette swatches per D-01 / globals.css @theme block.
const swatches = [
  { name: "paper", hex: "#F4F2EC", bg: "bg-paper", fg: "text-ink", role: "Page background; warm off-white" },
  { name: "ink", hex: "#0E0E0C", bg: "bg-ink", fg: "text-paper", role: "Body text & primary type; near-black, warm tint" },
  { name: "muted", hex: "#9A9690", bg: "bg-muted", fg: "text-paper", role: "Metadata, captions, secondary nav, blurbs" },
  { name: "faint", hex: "#C7C3BA", bg: "bg-faint", fg: "text-ink", role: "Tertiary text, rare" },
  { name: "rule", hex: "#E5E2D9", bg: "bg-rule", fg: "text-ink", role: "Hairline horizontal dividers (1px)" },
  { name: "rule-strong", hex: "#1A1A18", bg: "bg-rule-strong", fg: "text-paper", role: "Bold horizontal section dividers (1px)" },
  { name: "footer-bg", hex: "#0E0E0C", bg: "bg-footer-bg", fg: "text-footer-fg", role: "Footer inverts to Ink" },
  { name: "footer-fg", hex: "#F4F2EC", bg: "bg-footer-fg", fg: "text-ink", role: "Footer text on Ink" },
  { name: "footer-mute", hex: "#7A7770", bg: "bg-footer-mute", fg: "text-paper", role: "Footer secondary text" },
  { name: "footer-rule", hex: "rgba(244,242,236,0.18)", bg: "bg-footer-rule", fg: "text-paper", role: "Hairline divider on Ink (rgba)" },
] as const;

// 12 type-scale specimens per D-06 + D-14a / globals.css @theme block.
const typeSpecimens = [
  { utility: "text-display", sample: "BRING FIRE", note: "124px / 0.96 / -0.045em / 700 — manifesto" },
  { utility: "text-page-title", sample: "Writing.", note: "120px / 0.95 / -0.045em / 700 — archive titles" },
  { utility: "text-feature", sample: "Selected Works", note: "44px / 1.05 / -0.03em / 700 — building rows" },
  { utility: "text-event-title", sample: "AI for Small Biz, Vol. II", note: "36px / 1.1 / -0.02em / 700 — featured event" },
  { utility: "text-section-feature", sample: "Selected Works", note: "28px / 1.15 / -0.025em / 700 — sub-features" },
  { utility: "text-list-title", sample: "The Pursuit of Happier-ness", note: "28px / 1.2 / -0.01em / 400 — archive rows" },
  { utility: "text-list-title-home", sample: "Defiant Optimism", note: "20px / 1.4 / -0.005em / 400 — homepage rows" },
  { utility: "text-body-lead", sample: "The quick brown fox jumps.", note: "22px / 1.55 / -0.005em / 400 — letter-style intro" },
  { utility: "text-caption", sample: "The quick brown fox jumps.", note: "13px / 1.5 / 400 — figcaptions, extras" },
  { utility: "text-nav", sample: "The quick brown fox jumps.", note: "13px / 1.4 / 0.02em / 400 — header nav links" },
  { utility: "text-label", sample: "BUILDING — 01", note: "11px / 1 / 0.2em / 700 uppercase — section labels" },
  { utility: "text-meta", sample: "MAY 2026", note: "11px / 1 / 0.16em / 400 uppercase — dates, tags" },
] as const;

export default function SpecimenPage() {
  return (
    <main className="bg-paper text-ink min-h-screen px-8 py-16 md:px-16">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-page-title uppercase text-ink">Design Specimen</h1>
          <p className="text-caption text-muted">
            Phase 9 — Design Tokens &amp; Editorial Primitives. Internal QA page (noindex / nofollow).
          </p>
          <RuleStrong />
        </header>

        {/* 01 — Palette */}
        <section className="space-y-8">
          <SectionLabel numeral="01">Palette</SectionLabel>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {swatches.map((s) => (
              <div key={s.name} className="flex flex-col gap-3">
                {s.name === "footer-rule" ? (
                  // rgba on transparent — render over ink so hairline is visible
                  <div className="bg-ink h-24 w-24 flex items-center justify-center">
                    <div className="w-full border-t border-footer-rule" />
                  </div>
                ) : (
                  <div className={`${s.bg} ${s.fg} h-24 w-24 flex items-center justify-center text-meta uppercase`}>
                    {s.name}
                  </div>
                )}
                <div className="text-caption text-muted">
                  <div className="text-ink">{s.name}</div>
                  <div>{s.hex}</div>
                  <div className="opacity-80">{s.role}</div>
                </div>
              </div>
            ))}
          </div>
          <Rule />
        </section>

        {/* 02 — Type Scale */}
        <section className="space-y-8">
          <SectionLabel numeral="02">Type Scale</SectionLabel>
          <div className="space-y-10">
            {typeSpecimens.map((t) => (
              <div key={t.utility} className="space-y-2">
                {t.utility === "text-display" ? (
                  <div className="text-display whitespace-nowrap">{t.sample}</div>
                ) : (
                  <div className={t.utility}>{t.sample}</div>
                )}
                <div className="text-caption text-muted">
                  {t.utility} — {t.note}
                </div>
              </div>
            ))}
          </div>
          <Rule />
        </section>

        {/* 03 — Primitives */}
        <section className="space-y-8">
          <SectionLabel numeral="03">Primitives</SectionLabel>

          <div className="space-y-10">
            {/* PRIM-01 */}
            <div className="space-y-3">
              <div className="text-label uppercase text-muted">PRIM-01 — Rule</div>
              <Rule />
            </div>

            {/* PRIM-02 */}
            <div className="space-y-3">
              <div className="text-label uppercase text-muted">PRIM-02 — RuleStrong</div>
              <RuleStrong />
            </div>

            {/* PRIM-03 */}
            <div className="space-y-3">
              <div className="text-label uppercase text-muted">PRIM-03 — SectionLabel</div>
              <SectionLabel numeral="03">Building</SectionLabel>
            </div>

            {/* PRIM-04 default */}
            <div className="space-y-3">
              <div className="text-label uppercase text-muted">PRIM-04 — ListRow (default, homepage size)</div>
              <div>
                <ListRow
                  href="#"
                  title="Notes on long-form thinking"
                  extra="An essay on what it takes to read deeply in 2026."
                  meta="MAY 2026"
                />
                <ListRow
                  href="#"
                  title="Why I left Notion"
                  meta="APR 2026"
                />
              </div>
            </div>

            {/* PRIM-04 big variant */}
            <div className="space-y-3">
              <div className="text-label uppercase text-muted">PRIM-04 — ListRow (big variant, archive size)</div>
              <div>
                <ListRow
                  big
                  href="#"
                  title="The architecture of attention"
                  extra="2026 essay on cognitive infrastructure."
                  meta="2026"
                />
                <ListRow
                  big
                  href="#"
                  title="Reading the world through software"
                  meta="2025"
                />
              </div>
            </div>

            {/* PRIM-05 */}
            <div className="space-y-3">
              <div className="text-label uppercase text-muted">PRIM-05 — AllLink</div>
              <AllLink href="/blog">All writing →</AllLink>
            </div>

            {/* PRIM-06 */}
            <div className="space-y-3">
              <div className="text-label uppercase text-muted">PRIM-06 — IntroLink</div>
              <p className="text-body-lead text-ink max-w-xl">
                Read more about <IntroLink href="/prometheus">Prometheus</IntroLink>, the AI
                integrations company I founded.
              </p>
            </div>

            {/* PRIM-07 (rendered on ink for context) */}
            <div className="space-y-3">
              <div className="text-label uppercase text-muted">
                PRIM-07 — FooterCol (rendered on ink background for context)
              </div>
              <div className="bg-footer-bg p-8">
                <FooterCol
                  title="Library"
                  links={[
                    { label: "Writing", href: "/blog", sub: "Quarterly essays" },
                    { label: "Events", href: "/events" },
                    { label: "Photographs", href: "/links" },
                  ]}
                />
              </div>
            </div>
          </div>
          <Rule />
        </section>

        {/* Motion-budget fingerprint (D-15) */}
        <footer className="space-y-2">
          <p className="text-caption text-muted">
            No animations on this page. Phase 8 motion budget enforced (D-15).
          </p>
        </footer>
      </div>
    </main>
  );
}
