---
created: 2026-05-21T15:41:39.531Z
title: Newsletter page — make issues display more prominently
area: ui
phase_target: 12
kind: ui-feedback
files:
  - src/app/newsletter/page.tsx:22-72
  - src/components/newsletter/newsletter-carousel.tsx:1-74
---

## Problem

The `/newsletter` (Monty Monthly) page hides the issue archive behind a narrow, polite carousel. Concretely:

- Article container is `max-w-[66ch]` (~660px) — a reading column, not a gallery container
- `NewsletterCarousel` renders cards at `w-80 sm:w-96` (320px → 384px) with `rounded-lg`, `border`, `shadow-sm` — small, friendly, not editorial
- Horizontal scroll with snap + arrow buttons — only ~2 cards visible at a time
- The result feels reserved/promotional rather than "here is a body of work"

Operator feedback (2026-05-21 after Vercel preview smoke):
> "The Monty Monthly page should display the issues more prominently. Currently it's a small carousel with rounded edges. The issues should be larger, take up more of the page. Make it feel **full** of all the different Monty Monthlys."

This is the only outstanding visual note from the Phase 8–11 Vercel preview UAT session. `/newsletter` is already in scope for Phase 12 (Sub-page Restyle Sweep — one of the 6 sub-page restyles per `.planning/ROADMAP.md`).

## Solution

TBD — but the design direction calls for:

1. **Break the issue gallery out of the 66ch reading column.** The intro copy + Subscribe CTA can stay in the narrow column; the issue section should expand to full editorial page width (`md:px-40` like the Phase 11 archive pages, or whatever the Phase 12 restyle recipe lands on).

2. **Replace the carousel with a denser layout that shows everything at once.** A multi-row grid (e.g., 2-col mobile / 3-col desktop, or a magazine-style staggered grid) so the visitor immediately sees the *volume* of past issues. The current "scroll right to see more" hides it.

3. **Drop v1.0 chrome from the cards** — `rounded-lg`, `shadow-sm`, `border-[var(--border)]`, `bg-[var(--bg)]` are the v1.0 friendly-card vocabulary. Replace with Phase 9 editorial tokens (flat, paper-bg, `border-rule` hairlines, no shadow) so the section matches the rest of the v2.0 design.

4. **Bigger thumbnails.** Current `aspect-[16/9]` at 384px wide → ~216px tall. Increase to feel poster-like. The Substack RSS already returns thumbnails (`MontyMonthlyIssue.thumbnail`).

5. **Consider showing more than 10 issues.** Page currently calls `fetchMontyMonthlyIssues(10)` — bump it once the gallery layout can absorb the volume.

Anti-patterns to avoid:
- Don't introduce another component file — fold this into the Phase 12 newsletter restyle plan; the carousel component can either be repurposed or deleted in favor of a server-rendered grid (no client interactivity needed if we drop the scroll buttons).
- Don't change the data fetcher (`src/lib/rss/substack.ts`) unless the limit change requires it.
- Don't touch the breadcrumb / SEO metadata — those are correct.

## Phase 12 planner hook

When `/gsd:plan-phase 12` runs, the restyle-recipe plan should land first (per ROADMAP note), then a `/newsletter` restyle plan that picks up this todo. The plan should reference this file at @context and mark the todo complete via `.planning/todos/completed/` when the work ships.
