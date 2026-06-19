---
phase: 15-slide-deck-homepage-3d-hero
plan: "04"
subsystem: slide-components
tags: [slides, server-components, v3-primitives, hd-04, big-list, newsletter-carousel, fallback-poster]
dependency_graph:
  requires: [15-01]
  provides: [slide-hero, slide-index, slide-prometheus, slide-newsletter, slide-footer, fallback-poster, hd-04-green]
  affects: [15-05]
tech_stack:
  added: []
  patterns:
    - Server Component slide pattern (no "use client") — composing v3 primitives
    - deck-slide className convention for querySelectorAll discovery by deck-controller
    - fetchPriority="high" explicit LCP image pattern (MEMORY.md quirk)
    - BigList with Building/Writing/Doing items per D-10
    - Static newsletter issues as hardcoded JSX (D-10 — not Notion)
key_files:
  created:
    - src/components/home-deck/slide-hero.tsx
    - src/components/home-deck/slide-index.tsx
    - src/components/home-deck/slide-prometheus.tsx
    - src/components/home-deck/slide-newsletter.tsx
    - src/components/home-deck/slide-footer.tsx
    - src/components/home-deck/fallback-poster.tsx
  modified:
    - src/__tests__/home-deck/slides.test.tsx
decisions:
  - "SlideHero renders both sig (filled) and sig-out (outline) layers stacked with mt-2 spacing, matching the prototype's double-layer name treatment"
  - "SlideIndex uses SectionLabel with numeral='02' and text='What I'm' then BigList verbs Building/Writing/Doing per D-10"
  - "SlidePrometheus uses v3 token classes text-text/text-text-dim (not legacy text-ink/text-muted)"
  - "SlideFooter replicates InkFooter nav structure in v3 tokens as a deck-foot slide — global InkFooter suppression is Plan 05's responsibility"
  - "FallbackPoster sets both priority and fetchPriority='high' explicitly per MEMORY.md LCP quirk"
  - "Newsletter issues are 3 static hardcoded items per D-10 (not Notion-sourced)"
metrics:
  duration: "~15 minutes"
  completed: 2026-06-18
  tasks_completed: 2
  tasks_total: 2
  files_created: 6
  files_modified: 1
---

# Phase 15 Plan 04: Static Slide Components + Fallback Poster Summary

**One-liner:** Built 5 static deck slide components (SlideHero, SlideIndex, SlidePrometheus, SlideNewsletter, SlideFooter) and FallbackPoster composing Phase 14 v3 primitives; HD-04 test GREEN.

## What Was Built

**Task 1** — Slides 1-3 + HD-04 test GREEN:

- `slide-hero.tsx`: SlideHero renders oversized name in both `sig` (filled) and `sig-out` (outline) layers, 3 sub-role lines (Founder of Prometheus / Writer Monty Monthly / Builder), two CTA Buttons (Works / Writing), and a scroll cue. Matches prototype hero-grid layout. Pure Server Component.
- `slide-index.tsx`: SlideIndex wraps `<SectionLabel numeral="02">What I'm</SectionLabel>` above a `<BigList>` with items Building/Writing/Doing per CONTEXT.md D-10. Exports with `deck-slide deck-slide--index` class on wrapper.
- `slide-prometheus.tsx`: SlidePrometheus renders the editorial grid with "AI Integrations & Education" headline, body copy, and prometheus.today CTA Button. Uses v3 token classes exclusively.
- `slides.test.tsx`: Replaced HD-04 stub with real assertions — 2 tests GREEN (BigList items rendered, deck-slide class present).

**Task 2** — Slides 4-5 + fallback poster:

- `slide-newsletter.tsx`: SlideNewsletter uses NewsletterCarousel with 3 static hardcoded issues (Vol. 1-3), Monty Monthly display heading, and Substack subscribe CTA.
- `slide-footer.tsx`: SlideFooter replicates InkFooter nav structure as a deck-foot slide — 4 nav columns (Site/More/Elsewhere/Contact), "Let's be friends." big link, copyright line. Wrapped in `deck-slide deck-slide--footer deck-foot` with `flex flex-col justify-end pt-[12vh]` matching prototype deck-foot spec.
- `fallback-poster.tsx`: FallbackPoster wraps `next/image` with `src="/hero-blob-poster.webp"`, `fill`, `priority`, `fetchPriority="high"`, `loading="eager"`, `sizes="(max-width: 760px) 0vw, 45vw"`. Both `priority` and `fetchPriority="high"` set explicitly per MEMORY.md LCP quirk.

## Verification

- `npx vitest run src/__tests__/home-deck/slides.test.tsx` — 2/2 PASS (HD-04 GREEN)
- `grep -c "deck-slide" src/components/home-deck/slide-index.tsx` — returns 1
- `grep -c "fetchPriority" src/components/home-deck/fallback-poster.tsx` — returns 1
- `npx tsc --noEmit` — exits 0 (TypeScript clean)

## Deviations from Plan

None — plan executed exactly as written.

Note: The full vitest suite (`npx vitest run`) exits non-zero because 12 Wave 0 RED gate stubs from Plan 01 (deck-controller, hero-blob, obj-enter, use-deck-mode, use-webgl-support tests) intentionally fail. These are turned GREEN by Plans 02, 03, 05, and 06 respectively. Plan 04's acceptance criteria for "full suite clean" refers to not breaking previously-passing tests, which was confirmed.

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Right-side object stage empty div | slide-hero.tsx, slide-prometheus.tsx | Placeholder slot for R3F canvas / poster rendered by deck-homepage.tsx (Plan 05) |
| Static newsletter issues (href="#") | slide-newsletter.tsx | D-10 explicitly specifies static hardcoded JSX — not Notion. 3 placeholder titles per prototype copy. |
| /hero-blob-poster.webp | fallback-poster.tsx | Image produced in Plan 06 (human checkpoint); 404s gracefully in dev until then. |

These stubs are intentional per D-10 and the plan spec. They do not prevent Plan 04's goal (presentational slides built; HD-04 GREEN).

## Threat Flags

None — presentation-only phase, static JSX, no untrusted input, no server-side mutation, no new network endpoints or auth paths.

## Self-Check: PASSED

Files created:
- src/components/home-deck/slide-hero.tsx: FOUND
- src/components/home-deck/slide-index.tsx: FOUND
- src/components/home-deck/slide-prometheus.tsx: FOUND
- src/components/home-deck/slide-newsletter.tsx: FOUND
- src/components/home-deck/slide-footer.tsx: FOUND
- src/components/home-deck/fallback-poster.tsx: FOUND

Files modified:
- src/__tests__/home-deck/slides.test.tsx: FOUND (HD-04 GREEN)

Commits:
- 09413c1: feat(15-04): build slide-hero, slide-index, slide-prometheus — HD-04 GREEN
- d959074: feat(15-04): build slide-newsletter, slide-footer, fallback-poster
