import type { Metadata } from "next";
import { Rule } from "@/components/v3/rule";
import { RuleStrong } from "@/components/v3/rule-strong";
import { SectionLabel } from "@/components/v3/section-label";
import { Chip } from "@/components/v3/chip";
import { ListRow } from "@/components/v3/list-row";
import { Button } from "@/components/v3/button";
import { BigList } from "@/components/v3/big-list";
import { PageHero } from "@/components/v3/page-hero";
import { Marquee } from "@/components/v3/marquee";
import { Card } from "@/components/v3/card";
import { VideoCard } from "@/components/v3/video-card";
import { NewsletterCarousel } from "@/components/v3/newsletter-carousel";
import { UsesList } from "@/components/v3/uses-list";
import { Reveal } from "@/components/v3/reveal";

// T-14-08: noindex/nofollow prevents search engine indexing of this internal QA page
export const metadata: Metadata = {
  title: "v3 Specimen — Crimson Poster Tokens + Primitives",
  description:
    "Internal design-QA page for Phase 14 v3 Crimson Poster tokens and brutalist primitives.",
  robots: { index: false, follow: false },
};

// Crimson Poster palette swatches (DS-01 — single fixed palette)
const swatches = [
  { name: "bg", hex: "#d93c1e", bg: "bg-bg", fg: "text-text", role: "Canvas — crimson" },
  { name: "bg-2", hex: "#c8341a", bg: "bg-bg-2", fg: "text-text", role: "Hover surface — deeper crimson" },
  { name: "surface", hex: "#cc3719", bg: "bg-surface", fg: "text-text", role: "Card thumb / chip fill" },
  { name: "accent", hex: "#0a0503", bg: "bg-accent", fg: "text-bg", role: "Black — primary accent" },
  { name: "text", hex: "#120604", bg: "bg-text", fg: "text-bg", role: "Near-black ink on crimson" },
  { name: "text-dim", hex: "rgba(10,5,3,0.74)", bg: "bg-surface", fg: "text-text-dim", role: "Secondary text" },
  { name: "text-muted", hex: "rgba(10,5,3,0.52)", bg: "bg-surface", fg: "text-text-muted", role: "Captions, metadata" },
  { name: "border", hex: "rgba(10,5,3,0.26)", bg: "bg-bg-2", fg: "text-text", role: "Hairline dividers" },
  { name: "border-strong", hex: "rgba(10,5,3,0.5)", bg: "bg-bg-2", fg: "text-text", role: "Bold borders" },
] as const;

// v3 type scale (DS-03)
const typeSpecimens = [
  { size: "text-xs", label: "text-xs (0.72rem)", sample: "BUILDING — 01" },
  { size: "text-sm", label: "text-sm (0.85rem)", sample: "MAY 2026 · AI TOOLS" },
  { size: "text-base", label: "text-base (1rem)", sample: "The quick brown fox jumps." },
  { size: "text-lg", label: "text-lg (1.2rem)", sample: "Notes on long-form thinking." },
  { size: "text-xl", label: "text-xl (1.6rem)", sample: "Selected Works" },
  { size: "text-2xl", label: "text-2xl (2.2rem)", sample: "Defiant Optimism" },
  { size: "text-3xl", label: "text-3xl (3.2rem)", sample: "Writing" },
  { size: "text-mega", label: "text-mega (clamp 3.5–16rem)", sample: "MSZ" },
] as const;

export default function V3SpecimenPage() {
  return (
    <main className="bg-bg text-text min-h-screen px-8 py-16 md:px-16">
      <div className="mx-auto max-w-6xl space-y-20">
        {/* Header */}
        <header className="space-y-4">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted mb-4">
            Phase 14 — Crimson Poster Foundation · Internal QA (noindex / nofollow)
          </div>
          <h1
            className="font-display font-bold uppercase leading-[0.86] tracking-[-0.03em] text-[clamp(2.8rem,8vw,6rem)] sig"
          >
            v3 Specimen
          </h1>
          <RuleStrong />
        </header>

        {/* 01 — Palette */}
        <section className="space-y-8">
          <SectionLabel numeral="01">Palette</SectionLabel>
          <div className="grid grid-cols-3 gap-6 md:grid-cols-5">
            {swatches.map((s) => (
              <div key={s.name} className="flex flex-col gap-3">
                <div
                  className={`${s.bg} ${s.fg} h-20 w-full flex items-center justify-center font-mono text-xs uppercase border border-border`}
                >
                  {s.name}
                </div>
                <div className="font-mono text-xs text-text-muted space-y-1">
                  <div className="text-text font-medium">{s.name}</div>
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
          <div className="space-y-8">
            {typeSpecimens.map((t) => (
              <div key={t.size} className="space-y-2">
                <div className={`${t.size} font-display font-bold uppercase`}>{t.sample}</div>
                <div className="font-mono text-xs text-text-muted">{t.label}</div>
              </div>
            ))}
          </div>

          {/* DS-02: .sig and .sig-out display treatment demonstrations */}
          <div className="space-y-6 pt-6 border-t border-border">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
              DS-02 — Signature Display Treatment
            </div>
            <div className="space-y-3">
              <div className="font-mono text-xs text-text-muted">.sig — crimson fill + drop shadow</div>
              <div className="font-display font-bold uppercase text-[clamp(2rem,7vw,5rem)] leading-[0.9] sig">
                Monty Singer
              </div>
            </div>
            <div className="space-y-3">
              <div className="font-mono text-xs text-text-muted">.sig-out — outline stroke, transparent fill</div>
              <div className="font-display font-bold uppercase text-[clamp(2rem,7vw,5rem)] leading-[0.9] sig-out">
                Monty Singer
              </div>
            </div>
          </div>
          <Rule />
        </section>

        {/* 03 — Primitives */}
        <section className="space-y-12">
          <SectionLabel numeral="03">Primitives</SectionLabel>

          <div className="space-y-12">
            {/* PRIM-01 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-01 — Rule</div>
              <Rule />
            </div>

            {/* PRIM-02 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-02 — RuleStrong</div>
              <RuleStrong />
            </div>

            {/* PRIM-03 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-03 — SectionLabel</div>
              <SectionLabel numeral="01">Building</SectionLabel>
            </div>

            {/* PRIM-04 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-04 — Chip</div>
              <div className="flex flex-wrap gap-3">
                <Chip>AI Tools</Chip>
                <Chip>2026</Chip>
                <Chip>Founder</Chip>
                <Chip>Writing</Chip>
              </div>
            </div>

            {/* PRIM-05 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-05 — ListRow (default)</div>
              <div>
                <ListRow
                  href="#"
                  title="Notes on long-form thinking"
                  excerpt="An essay on what it takes to read deeply in 2026."
                  meta="MAY 2026"
                />
                <ListRow
                  href="#"
                  numeral="02"
                  title="Why I left Notion"
                  meta="APR 2026"
                />
              </div>
            </div>

            {/* PRIM-05 big variant */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-05 — ListRow (big variant)</div>
              <div>
                <ListRow
                  big
                  href="#"
                  title="The architecture of attention"
                  excerpt="Essay on cognitive infrastructure, 2026."
                  meta="2026"
                />
                <ListRow
                  big
                  href="#"
                  numeral="02"
                  title="Reading the world through software"
                  meta="2025"
                />
              </div>
            </div>

            {/* PRIM-06 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-06 — Button (default + accent)</div>
              <div className="flex flex-wrap gap-4">
                <Button href="#">View all writing</Button>
                <Button href="#" accent>Get in touch</Button>
              </div>
            </div>

            {/* PRIM-07 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-07 — BigList (filled + outline item)</div>
              <BigList
                items={[
                  { label: "Writing", href: "#", tag: "ESSAYS" },
                  { label: "Projects", href: "#", tag: "WORK" },
                  { label: "Prometheus", href: "#", tag: "COMPANY", outline: true },
                ]}
              />
            </div>

            {/* PRIM-08 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-08 — PageHero (normal)</div>
              <PageHero
                title="Writing"
                crumb="MSizzle / Writing"
                sub="Essays, notes, and long-form thinking on AI, building, and the examined life."
              />
            </div>

            {/* PRIM-08 outline variant */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-08 — PageHero (outline variant, DS-02)</div>
              <PageHero
                title="Projects"
                crumb="MSizzle / Projects"
                outline
              />
            </div>

            {/* PRIM-09 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-09 — Marquee (DS-05 reduced-motion honored)</div>
              <Marquee
                items={[
                  { text: "Monty Singer" },
                  { text: "Founder", hot: true },
                  { text: "Prometheus" },
                  { text: "AI Tools", hot: true },
                  { text: "Writing" },
                  { text: "Georgetown", hot: true },
                ]}
              />
            </div>

            {/* PRIM-10 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-10 — Card (in .cards grid container per Plan 03 spec)</div>
              <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-px bg-border border border-border">
                <Card
                  kicker="Essay / May 2026"
                  title="Notes on long-form thinking"
                  blurb="What it takes to read deeply in an era of infinite distraction."
                  href="#"
                />
                <Card
                  kicker="Essay / Apr 2026"
                  title="Why I left Notion"
                  blurb="A technical and philosophical migration story."
                  href="#"
                />
                <Card
                  kicker="Essay / Mar 2026"
                  title="Defiant optimism"
                  blurb="On building with conviction when the signals are noisy."
                />
              </div>
            </div>

            {/* PRIM-11 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-11 — VideoCard (in grid container)</div>
              <div className="grid [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] gap-[22px]">
                <VideoCard
                  title="How we built Prometheus in 90 days"
                  channel="@montysinger"
                  href="#"
                />
                <VideoCard
                  title="AI tools for small business founders"
                  channel="@montysinger"
                  href="#"
                />
              </div>
            </div>

            {/* PRIM-12 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-12 — NewsletterCarousel</div>
              <NewsletterCarousel
                issues={[
                  { title: "Vol. 4 — The Quiet Builders", date: "May 2026", href: "#" },
                  { title: "Vol. 3 — AI for Everyone", date: "Apr 2026", href: "#" },
                  { title: "Vol. 2 — First Principles", date: "Mar 2026" },
                  { title: "Vol. 1 — Why I Started Writing", date: "Feb 2026", href: "#" },
                ]}
              />
            </div>

            {/* PRIM-13 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-13 — UsesList</div>
              <UsesList
                groups={[
                  {
                    heading: "Computer",
                    items: [
                      { term: "MacBook Pro 14\"", detail: "M3 Pro, 18 GB — primary machine" },
                      { term: "LG UltraFine 27\"", detail: "5K USB-C display" },
                    ],
                  },
                  {
                    heading: "Software",
                    items: [
                      { term: "Cursor", detail: "AI-native code editor — daily driver" },
                      { term: "Notion", detail: "Notes, CMS, and thinking environment" },
                      { term: "Linear", detail: "Project tracking across Prometheus teams" },
                    ],
                  },
                ]}
              />
            </div>

            {/* PRIM-14 */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">PRIM-14 — Reveal (DS-05 scroll reveal; wraps a sample block)</div>
              <Reveal delay={0.1}>
                <div className="border border-border p-8 space-y-3">
                  <div className="font-display font-bold text-2xl uppercase sig">Revealed</div>
                  <p className="text-text-muted text-sm">
                    This block fades and translates up when scrolled into view.
                    When reduced motion is preferred, it is fully visible immediately with no animation.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <Rule />
        </section>

        {/* Footer */}
        <footer className="space-y-2 pb-16">
          <p className="font-mono text-xs text-text-muted">
            Crimson Poster v3 Foundation — Phase 14 internal QA (noindex / nofollow). DS-01..DS-05 demonstrated.
          </p>
        </footer>
      </div>
    </main>
  );
}
