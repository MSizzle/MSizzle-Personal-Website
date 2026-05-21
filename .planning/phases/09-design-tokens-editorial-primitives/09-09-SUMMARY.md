---
phase: 09-design-tokens-editorial-primitives
plan: 09-09
subsystem: design-system-specimen
tags: [specimen, design-system, discoverability, vercel-build-gate]
requires: [09-01, 09-02, 09-03, 09-04, 09-05, 09-06, 09-07, 09-08]
provides: [SC1, /specimen route, triple-defense discoverability]
affects:
  - src/app/specimen/
  - src/app/robots.ts
tech-stack:
  added: []
  patterns: [server-component, metadata-noindex, robots-disallow, sitemap-exclusion]
key-files:
  created:
    - src/app/specimen/page.tsx
    - .planning/phases/09-design-tokens-editorial-primitives/09-09-SUMMARY.md
  modified:
    - src/app/robots.ts
decisions:
  - D-12 (REVISED): route is /specimen, NOT /_specimen — Next.js 16 treats underscore-prefixed folders as private and 404s them
  - D-13: specimen is a dev resource (token + primitive inventory), not user-facing
  - D-14 (REVISED): triple-defense discoverability suppression — metadata noindex + sitemap exclusion + robots Disallow
  - D-14a: include all 12 type-scale utilities, including text-meta which was easy to forget
  - D-18: npm run build is the local correctness gate
  - D-19: vercel build --prod is the production-readiness gate (executed via Vercel preview deploy, Phase 8 precedent)
  - D-20: 2-wave plan slicing; this plan is Wave 2 (integration)
  - D-21: Wave 1 plans (09-01..09-08) shipped first with no files_modified overlap; Wave 2 (this plan) consumes their artifacts
metrics:
  duration: ~6 min
  tasks_completed: 3
  files_created: 1
  files_modified: 1
  completed: 2026-05-21
---

# Phase 9 Plan 09: Specimen Route, Robots, and Build Gate Summary

Integration plan for Phase 9. Renders the entire Phase 9 design system (10 palette swatches + 12 type-scale specimens + 7 editorial primitives) on a single `/specimen` route protected by triple-defense discoverability suppression, and discharges the local production build gate. With this plan, Phase 9 is code-complete — Phase 10 (Editorial Homepage) can now consume tokens + primitives directly.

## What Shipped

| File | Purpose | Commit |
| ---- | ------- | ------ |
| `src/app/specimen/page.tsx` | Server Component rendering all palette + type-scale + primitives + motion-budget note | `f2f66e1` |
| `src/app/robots.ts` | Added `disallow: ['/specimen', '/api/']` to rules object | `ca34ecb` |
| `src/app/sitemap.ts` | Verified clean of `/specimen` (no edit required) | n/a (verification only) |

## Implementation Notes

### Triple-defense discoverability (D-14 REVISED)

All three layers are in place and confirmed at build time:

- **Layer 1 — metadata noindex:** `page.tsx` exports `metadata = { robots: { index: false, follow: false } }`. Confirmed via `rg "index: false"` and `rg "follow: false"`.
- **Layer 2 — sitemap exclusion:** Generated `.next/server/app/sitemap.xml.body` contains **0 hits** for "specimen". Source `src/app/sitemap.ts` was already clean — no edit required.
- **Layer 3 — robots.ts Disallow:** Generated `.next/server/app/robots.txt` contains `Disallow: /specimen` AND `Disallow: /api/` (the latter is defense-in-depth per RESEARCH.md §"app/robots.ts Disallow").

### Specimen page contents (D-13)

Rendered in three numbered sections per the planner spec:

1. **01 — Palette** — 5-col grid (2-col mobile) of all 10 palette tokens. Each swatch is a 96px square (`h-24 w-24`) with role name + hex code + role description. `footer-rule` (rgba on transparent) is rendered over an ink-tinted backdrop so the hairline is visible. Closed with `<Rule />`.
2. **02 — Type Scale** — One block per type-scale utility (12 total) at canonical sample lines. `text-display` is wrapped in `whitespace-nowrap` so the 124px line doesn't wrap. Each specimen has a `text-caption text-muted` annotation listing utility + size + weight + tracking. Closed with `<Rule />`.
3. **03 — Primitives** — One block per primitive (7 total). PRIM-04 ListRow is rendered twice (default + big variant). PRIM-07 FooterCol is wrapped in a `bg-footer-bg p-8` container to demonstrate the inverted-surface context. Closed with `<Rule />`.

Final footer paragraph (`text-caption text-muted`): "No animations on this page. Phase 8 motion budget enforced (D-15)." — D-13 fingerprint confirming Phase 8 motion-budget continuity.

### Server-only by design (D-11)

Zero `'use client'` directives. The page is a pure Server Component and the route compiles as `○ (Static)` in the Next.js route manifest. No client JS shipped for this route beyond what Next.js itself adds.

### Path correctness (D-12 REVISED)

Route lives at `src/app/specimen/page.tsx` (NO underscore prefix). Per Next.js 16, underscore-prefixed folders are **private folders opted out of routing entirely** — `src/app/_specimen/page.tsx` would return 404. This was the dominant pitfall flagged in RESEARCH.md and verified absent at build time (`test ! -d src/app/_specimen`).

### Component prop name correction

Planner used `<SectionLabel num="01">` in pseudocode, but the actual `SectionLabel` interface (shipped in Plan 09-03) uses prop name `numeral`. Implementation uses the correct prop name `numeral="01"` etc. — no shim, no rename.

## Build Verification

### Local D-18 gate

```
$ npm run build
✓ Compiled successfully in 1621ms
  Running TypeScript ...
  Finished TypeScript in 1409ms ...
✓ Generating static pages using 9 workers (41/41) in 5.7s
└ ○ /specimen
EXIT_CODE=0
```

- **`npm run build` exit code: 0** (D-18 satisfied)
- **Page count: 41** (was 40 before this plan — exactly one new route added)
- **`/specimen` registered as `○ (Static)`** in the route manifest
- **Generated `sitemap.xml.body`: 0 hits for "specimen"** (D-14 layer 2 verified at build time)
- **Generated `robots.txt` body:**
  ```
  User-Agent: *
  Allow: /
  Disallow: /specimen
  Disallow: /api/

  Sitemap: https://montysinger.com/sitemap.xml
  ```

### D-19 production gate (vercel build --prod) — DEFERRED to Vercel preview deploy

Per CONTEXT.md D-19 + Phase 8 precedent (08-HUMAN-UAT.md) — `npx vercel build --prod` is known to corrupt sandbox node_modules in this environment. D-19 is therefore discharged via the **Vercel preview deploy triggered by the next branch push**, which executes `vercel build --prod` semantically against the same commit. This is the same pattern Phase 8 used to discharge D-11 successfully.

**Operator action to close D-19:**

1. Push the current branch (`claude/phase-8-resume`) to remote.
2. Wait for Vercel preview deploy to build (typically <2 min).
3. Confirm:
   - Vercel dashboard shows green check / "Build Completed" for the preview deploy
   - Preview URL serves `/specimen` correctly (renders palette + type scale + primitives)
   - Preview URL `/robots.txt` contains `Disallow: /specimen`
   - Preview URL `/sitemap.xml` does NOT contain `/specimen`
4. Record the preview URL in this SUMMARY (or in 09-HUMAN-UAT.md if one is created).

The Vercel preview build is bit-for-bit `vercel build --prod` semantically — production-mode bundling, full TS check, full lint, full route manifest. If it returns 0, D-19 is satisfied.

## Acceptance Checks (VALIDATION.md task 9-09-V)

| Check | Result |
| ----- | ------ |
| `test -f src/app/specimen/page.tsx` | PASS |
| `test ! -d src/app/_specimen` | PASS (no underscore folder created) |
| `rg "index: false" src/app/specimen/page.tsx` ≥ 1 hit | PASS (2 hits) |
| `rg "follow: false" src/app/specimen/page.tsx` ≥ 1 hit | PASS (2 hits) |
| All 7 primitive imports resolve | PASS |
| `rg "bg-paper\|bg-ink\|bg-muted\|bg-rule" src/app/specimen/page.tsx` ≥ 4 hits | PASS |
| `rg "text-display\|text-page-title\|text-label\|text-meta\|text-caption" src/app/specimen/page.tsx` ≥ 5 hits | PASS |
| `rg "use client" src/app/specimen/page.tsx` returns 0 hits | PASS |
| `rg "disallow" src/app/robots.ts` ≥ 1 hit | PASS |
| `rg "'/specimen'" src/app/robots.ts` ≥ 1 hit | PASS |
| `rg "/specimen" src/app/sitemap.ts` returns 0 hits | PASS |
| `npm run build` exits 0 | PASS |
| `vercel build --prod` exits 0 | DEFERRED → Vercel preview deploy on branch push |
| Route manifest includes `/specimen` | PASS (○ Static) |
| Generated `sitemap.xml.body` does NOT contain `/specimen` | PASS (grep -c = 0) |

## Phase 9 Status

With this plan, Phase 9 is code-complete:

- **SC1** (specimen renders every palette + type-scale + primitive): satisfied
- **SC2** (10 palette tokens shipped in globals.css): satisfied by Plan 09-01
- **SC3** (12 type-scale utilities shipped): satisfied by Plan 09-01
- **SC4** (vercel build --prod exits 0): local `npm run build` exits 0; full `vercel build --prod` deferred to Vercel preview deploy on branch push (Phase 8 precedent)
- **SC5** (7 primitives shipped): satisfied by Plans 09-02 through 09-08

Phase 10 (Editorial Homepage) can now consume tokens (`bg-paper`, `text-ink`, `text-display`, etc.) and primitives (`Rule`, `RuleStrong`, `SectionLabel`, `ListRow`, `AllLink`, `IntroLink`, `FooterCol`) directly. No further design-system work needed before Phase 10.

## Preservation Guards

Confirmed untouched (preservation guards per the plan):

- `src/components/motion/scroll-reveal.tsx` — Phase 8 motion budget primitive, not modified.
- `src/components/motion/lenis-provider.tsx` — global smooth scroll, not modified.
- `src/app/template.tsx` — page-load fade, not modified.
- `src/app/newsletter/` — protected route, not modified.

## Deviations from Plan

None — plan executed exactly as written. One minor prop-name correction (planner pseudocode used `num="01"` but actual SectionLabel prop is `numeral="01"`); this was a planner shorthand, not a deviation requiring a Rule classification — implementation used the correct prop name from the shipped Plan 09-03 source.

## Commits

| Task | Description | Commit |
| ---- | ----------- | ------ |
| 1 | robots.ts disallow + sitemap verification | `ca34ecb` |
| 2 | /specimen page (Server Component, 213 lines) | `f2f66e1` |
| 3 | npm run build gate (verification-only, no file changes) | n/a |

## Self-Check: PASSED

- File `src/app/specimen/page.tsx`: FOUND
- File `src/app/robots.ts` (modified): FOUND with `Disallow: /specimen`
- Commit `ca34ecb`: FOUND in git log
- Commit `f2f66e1`: FOUND in git log
- Build artifact `.next/server/app/sitemap.xml.body`: FOUND, contains 0 hits for "specimen"
- Build artifact `.next/server/app/robots.txt`: FOUND, contains `Disallow: /specimen`
- Route manifest entry `/specimen`: FOUND (○ Static)
