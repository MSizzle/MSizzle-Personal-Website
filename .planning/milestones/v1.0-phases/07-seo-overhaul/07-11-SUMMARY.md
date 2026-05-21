---
phase: 07-seo-overhaul
plan: 11
subsystem: seo
tags: [rss, feed, xml, 404, regression-sweep, tdd]

requires:
  - phase: 07-seo-overhaul
    provides: SITE_URL + canonical helper (Plan 01); getPublishedPosts (Plan 03 / pre-Phase 07)
provides:
  - buildRssXml helper with XML special-char escaping + 3 vitest cases
  - /blog/feed.xml route handler returning application/rss+xml with ISR 1800
  - Styled 404 page (src/app/not-found.tsx) with robots noindex
  - Codebase-wide regression sweep — em dashes, NYC/New York/based in, investor/investing/Leerink, msizzle.com all return zero hits across src/
affects: []

tech-stack:
  added: []
  patterns:
    - "All XML emissions go through escapeXml() — never interpolate raw text into XML tags"
    - "Route handlers for content feeds use Next.js 16 App Router (route.ts), revalidate exported, plain Response with Cache-Control"
    - "Deprecated UI components are stubbed (returns null / empty array) rather than left with stale dead code that violates D-01/D-03/D-05"

key-files:
  created:
    - src/lib/rss/blog-feed.ts
    - src/__tests__/seo/blog-feed.test.ts
    - src/app/blog/feed.xml/route.ts
    - src/__tests__/seo/feed-route.test.ts
    - src/app/not-found.tsx
  modified:
    - src/app/opengraph-image.tsx
    - src/app/blog/page.tsx
    - src/app/globals.css
    - src/utils/reading-time.ts
    - src/components/providers/theme-provider.tsx
    - src/components/about/horizontal-timeline.tsx
    - src/components/notion/notion-renderer.tsx
    - src/components/visit-survey.tsx
    - src/__tests__/pages/links.test.tsx
    - src/lib/notion-projects.ts
    - src/lib/notion.ts
    - src/lib/notion-events.ts
    - src/data/timeline.ts
    - src/data/timeline-visuals.ts
    - src/data/events.ts

key-decisions:
  - "Channel <title> uses pipe separator ('Monty Singer | Writings') so the deny-list grep for em dashes stays clean across the entire src/ tree, including XML output."
  - "OG image alt + visible copy rewritten to founder-of-Prometheus framing (D-12), removing the legacy 'investor, builder, lifelong learner based in NYC' tagline."
  - "Dead timeline files (data/timeline.ts, data/timeline-visuals.ts, components/about/horizontal-timeline.tsx) stubbed to empty exports rather than deleted, because rm was sandboxed. Each carries a deprecation comment and is safe to delete in a follow-up commit."
  - "Pre-existing test failures in links/footer/project-card NOT fixed: they fail on baseline main and are out of scope per the executor scope-boundary rule."

requirements-completed: []

duration: ~10min
completed: 2026-04-15
---

# Phase 07 Plan 11: RSS Feed, 404, Regression Sweep Summary

**Blog RSS feed at `/blog/feed.xml` with XML-safe escaping and tests, styled 404 page with noindex, and a sweep that takes the entire `src/` tree to zero deny-list hits (em dashes, NYC, investor, msizzle.com, Leerink).**

## Accomplishments

### Task 1 — RSS XML builder
- Shipped `src/lib/rss/blog-feed.ts` with `buildRssXml(posts)` and `escapeXml(s)` covering all five XML special chars (`& < > " '`).
- 3 vitest suites in `src/__tests__/seo/blog-feed.test.ts`: empty-array envelope shape, escape behavior, item-shape with link + pubDate. All passing.
- Channel `<title>` uses pipe separator (`Monty Singer | Writings`) — keeps the codebase deny-list clean even in XML output.

### Task 2 — Feed route handler
- Shipped `src/app/blog/feed.xml/route.ts` with `revalidate = 1800`, env-guarded Notion fetch with try/catch, returns `Response` with `Content-Type: application/rss+xml; charset=utf-8` and `Cache-Control: public, max-age=0, s-maxage=1800`.
- 1 vitest case in `src/__tests__/seo/feed-route.test.ts` confirming content-type and RSS body. Passing.

### Task 3 — Styled 404
- Shipped `src/app/not-found.tsx` — H1 `404`, recovery copy, links to home and /blog. `metadata.robots: { index: false, follow: false }` so search engines don't index the not-found page.

### Task 4 — Regression sweep
Replaced or stubbed every deny-list hit across `src/`:

| Pattern | Files cleaned |
|---------|---------------|
| Em dash (`—`) | opengraph-image.tsx, blog/page.tsx, globals.css, reading-time.ts, theme-provider.tsx, horizontal-timeline.tsx (stubbed), notion-renderer.tsx, visit-survey.tsx, links.test.tsx, notion-projects.ts, notion.ts, notion-events.ts, timeline.ts (stubbed) |
| NYC / New York / based in | opengraph-image.tsx, events.ts (sample comment), timeline.ts (stubbed) |
| investor / investing / Leerink | opengraph-image.tsx, horizontal-timeline.tsx (stubbed), timeline-visuals.ts (stubbed), timeline.ts (stubbed) |
| msizzle.com | none (already clean) |

Final grep sweep: all five deny-list patterns return zero hits across `src/`.

## Verification

- `npx vitest run src/__tests__/seo/blog-feed.test.ts` → 3/3 PASS.
- `npx vitest run src/__tests__/seo/feed-route.test.ts` → 1/1 PASS.
- `npm run build` → exit 0; route table includes `/blog/feed.xml`, `/_not-found`, all phase-07 routes.
- Deny-list sweep: all 5 patterns return empty.
- Pre-existing test failures (links, footer, project-card) confirmed to fail on the same commit hash before this plan's changes — out of scope.

## Decisions Made

- **Channel title pipe separator.** PRD allows em dashes in actual feed reader output, but keeping a single deny-list rule across all of `src/` is simpler than excluding XML files. Pipe reads naturally in RSS too.
- **OG image rewrite.** The static OG card still says "Monty Singer" but its tagline now reads "Founder of Prometheus. Builder, writer, and perpetual tinkerer." matching D-12. The alt text mirrors this.
- **Stub dead timeline files instead of deleting them.** `rm` was sandboxed during this session. Each dead file now has a deprecation header + empty export, preserving the import surface (`TimelineEvent` interface in `components/about/timeline.tsx` is still real, so any future work can re-import safely).
- **Did not fix pre-existing test failures** in links.test.tsx (mailto links DO get the umami-event attribute, comment was wrong), footer.test.tsx, and project-card.test.tsx (x2). These fail on the same baseline commit before this plan's work and belong in their own bug-fix plan.

## Deviations from Plan

### Auto-fixed (Rule 2 — missing critical correctness)

**1. Stale OG image copy violated D-12 / D-03 / D-05**
- **Found during:** Task 4 grep sweep
- **Issue:** `src/app/opengraph-image.tsx` had `alt='Monty Singer — investor, builder, and lifelong learner based in NYC'` and matching visible copy. Em dash, investor, NYC — three deny-list hits in one file, plus the OG image is what shows up when the site is shared.
- **Fix:** Rewrote alt and visible tagline to D-12 founder framing.
- **Files modified:** src/app/opengraph-image.tsx
- **Committed in:** this plan's commit

**2. Dead timeline files retained banned strings**
- **Found during:** Task 4 grep sweep
- **Issue:** Timeline data and components were unreachable from any active route after the Plan 07-04 About rewrite, but still contained `Leerink`, `investor`, `New York`, em-dashed date ranges.
- **Fix:** Stubbed each dead file to an empty export with a deprecation header. Files are now zero-content but preserve the export shape; safe to delete in a follow-up cleanup.
- **Files modified:** src/data/timeline.ts, src/data/timeline-visuals.ts, src/components/about/horizontal-timeline.tsx
- **Committed in:** this plan's commit

### Not fixed (out of scope per scope boundary)

**3. Pre-existing test failures in links / footer / project-card**
- **Found during:** Task 4 verification (`npx vitest run`)
- **Issue:** 4 test failures across 3 files. Confirmed to fail on the same commit before this plan ran — pre-existing.
- **Action:** Logged here and in deferred-items. Not fixed in this plan per scope-boundary rule.
- **Suggestion:** Open a follow-up plan ("07-fix-pre-existing-tests") that:
  - Updates `src/__tests__/pages/links.test.tsx` to expect 4 (mailto IS tracked) or rewrites the LinksPage to exclude mailto from tracking.
  - Investigates footer.test.tsx (expected 4 socials, got 3 — could be SOCIALS array shrunk).
  - Investigates project-card.test.tsx (looking for "View Project" CTA text + external link tracking).

## Self-Check: PASSED

- All 3 task acceptance criteria + Task 4 grep sweep met.
- `npx vitest run src/__tests__/seo/blog-feed.test.ts` and `feed-route.test.ts` both green.
- `npm run build` exits 0.
- Deny-list grep returns empty for all 5 patterns.
- Pre-existing test failures documented as out of scope.
