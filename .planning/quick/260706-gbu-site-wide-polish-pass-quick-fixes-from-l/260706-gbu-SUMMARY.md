---
phase: quick-260706-gbu
plan: 01
subsystem: seo, navigation, routing, content, dead-code
tags: [seo, metadata, nav, routing, survey, newsletter, dead-code, copy]
dependency_graph:
  requires: []
  provides: [clean-page-titles, filtered-uses-data, unified-email, portfolio-redirect, homepage-only-survey, fake-issues-removed, dead-code-purge]
  affects: [all-pages, footer, nav, sitemap, homepage]
tech_stack:
  added: []
  patterns: [localStorage-for-survey-persistence, usePathname-for-route-gating, USES_DATA_FILTERED-export-pattern]
key_files:
  created: []
  modified:
    - src/app/writing/page.tsx
    - src/app/about/page.tsx
    - src/app/prometheus/page.tsx
    - src/app/uses/page.tsx
    - src/app/projects/page.tsx
    - src/app/blog/[slug]/page.tsx
    - src/app/projects/[slug]/page.tsx
    - src/lib/seo/blog-metadata.ts
    - src/lib/seo/project-metadata.ts
    - src/lib/uses.ts
    - src/components/home/section-newsletter.tsx
    - src/components/layout/v3-footer.tsx
    - src/components/nav/navigation.tsx
    - next.config.ts
    - src/components/home/section-work.tsx
    - src/app/sitemap.ts
    - src/components/visit-survey.tsx
    - src/app/globals.css
    - package.json
    - package-lock.json
decisions:
  - "USES_DATA_FILTERED export pattern: filter at data layer, not render layer, keeps UsesList dumb"
  - "Deleted portfolio.test.tsx along with portfolio/page.tsx; port tests would test a deleted page"
  - "transpilePackages: ['three'] removed in routing commit (accidentally removed early, acceptable since both committed)"
metrics:
  duration: "approx 60 minutes"
  completed: "2026-07-06T04:11:00Z"
  tasks_completed: 3
  files_changed: 25
---

# Phase quick-260706-gbu Plan 01: Site-Wide Polish Pass Summary

Ten live-site audit findings fixed across three logical clusters: content/SEO, nav/routing/behavior, dead code + build gate.

## One-Liner

Ten surgical fixes covering title duplication, TODO leaks, email unification, /portfolio redirect, mobile nav parity, homepage-only survey with localStorage, fake newsletter removal, and complete three.js/home-deck purge.

## Tasks Completed

| # | Task | Commits |
|---|------|---------|
| 1 | Content and copy fixes (issues 1, 2, 6, 9) | 7639bba, 440d07c, 44a9219, a02f90a |
| 2 | Nav, footer, routing, and behavior (issues 3, 4, 5, 7, 10) | 9a00be5, badb6cb, 9a24c8f, 4ad6351, a625f47 |
| 3 | Dead code purge and build gate (issue 8) | b761cbc |
| - | Test fixes (regressions from changes above — Rule 1 auto-fix) | 11cb5d2 |

## Commits

| Hash | Message |
|------|---------|
| 7639bba | fix(seo): strip duplicate '| Monty Singer' suffix from per-page titles |
| 440d07c | fix(uses): hide hardware rows with TODO descriptions from /uses page |
| 44a9219 | fix(copy): replace double hyphens with em dashes in about + projects |
| a02f90a | fix(newsletter): remove fabricated Monty Monthly fallback issues |
| 9a00be5 | fix(footer): unify contact email to monty@prometheus.today |
| badb6cb | fix(footer): distinguish external prometheus.today from internal /prometheus link |
| 9a24c8f | fix(nav): drop Prometheus from mobile drawer to match desktop 4-item nav |
| 4ad6351 | fix(routing): consolidate /portfolio into /projects with permanent redirect |
| a625f47 | fix(survey): homepage-only render + localStorage persistence for visit survey |
| b761cbc | chore(dead-code): remove home-deck, unused components, three.js deps, and dead CSS tokens |
| 11cb5d2 | test: update test assertions to match title/nav/sitemap/routing changes |

## Issue-by-Issue Summary

**Issue 1 — Title deduplication:** All per-page `metadata.title` strings stripped of trailing `| Monty Singer`. The root layout template handles the suffix automatically. Affected: writing, about, prometheus, uses, projects, blog/[slug], projects/[slug], blog-metadata.ts, project-metadata.ts.

**Issue 2 — /uses TODO leak:** Added `USES_DATA_FILTERED` export to `src/lib/uses.ts` that filters items where `detail` starts with "TODO" or "placeholder". The Hardware group had 3 TODO items; after filtering the group is dropped entirely. `uses/page.tsx` imports the filtered export.

**Issue 3 — Email unification:** `v3-footer.tsx` socials row changed from `montydsinger@gmail.com` to `monty@prometheus.today`.

**Issue 4 — Prometheus link disambiguation:** Community column external link label changed from "Prometheus" to "prometheus.today" so it's visually distinct from the Founder column internal "/prometheus" link.

**Issue 5 — Mobile nav parity:** Removed `{ href: '/prometheus', label: 'Prometheus' }` from `MOBILE_LINKS` in `navigation.tsx`. Mobile drawer now has exactly 4 items matching desktop.

**Issue 6 — Em dash:** Fixed double-hyphens in about/page.tsx (description metadata + body prose) and projects/page.tsx (metadata description + PageHero sub prop).

**Issue 7 — /portfolio consolidation:** Added `{ source: '/portfolio', destination: '/projects', permanent: true }` to next.config.ts redirects. Deleted src/app/portfolio/page.tsx. Updated section-work.tsx link from `/portfolio` → `/projects` with label "Projects". Removed /portfolio from sitemap.ts. Updated section-work.test.tsx assertions.

**Issue 8 — Dead code purge:** Deleted src/components/home-deck/ (10 files), src/__tests__/home-deck/ (6 files), credibility-strip.tsx, hero-cinematic.tsx, section-writing.tsx, ink-footer.tsx, cycling-photo.tsx, manifesto-reveal.tsx. Removed three.js and @react-three packages from package.json. Removed transpilePackages: ['three'] from next.config.ts. Removed --accent-glow, --blob-core, --blob-rim CSS tokens and stale .photo .cap blue-palette rules from globals.css.

**Issue 9 — Newsletter fake fallback:** Deleted `ISSUES` constant (4 fabricated Monty Monthly issues) from section-newsletter.tsx. Now always uses `postsToIssues(posts)` — empty posts renders only the Subscribe card.

**Issue 10 — VisitSurvey:** Added `usePathname` import. Added `if (pathname !== '/') return` guard at top of useEffect. Changed `sessionStorage` → `localStorage` for the `visit-survey-done` flag. Changed timer delay from 30000ms to 45000ms.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Test regressions from content changes**
- **Found during:** Post-Task-3 verification
- **Issue:** 9 test failures appeared after our changes: 5 new failures in portfolio.test.tsx, navigation.test.tsx, uses.test.tsx, metadata.test.ts, sitemap.test.ts — all testing behavior we intentionally changed
- **Fix:** Updated test assertions to match new behavior; deleted portfolio.test.tsx alongside deleted portfolio/page.tsx
- **Files modified:** src/__tests__/pages/portfolio.test.tsx (deleted), src/__tests__/components/navigation.test.tsx, src/__tests__/pages/uses.test.tsx, src/__tests__/seo/metadata.test.ts, src/__tests__/seo/sitemap.test.ts
- **Commit:** 11cb5d2

**2. [Rule 1 - Bug] transpilePackages removed early**
- **Found during:** Task 2 next.config.ts editing
- **Issue:** `transpilePackages: ['three']` was accidentally removed while adding the /portfolio redirect in Task 2 instead of Task 3
- **Fix:** Kept the removal (it's the same net result, both tasks targeted the same file); documented in dead-code commit message
- **Impact:** None — both tasks intended this removal; order of removal within the same overall session is immaterial

## Build Verification

- `npm run build`: exits 0, 17 routes compiled cleanly, no TypeScript or import errors
- `npx vitest run`: 3 failures (all pre-existing: HD-04, HD-05 × 2) — no new failures

## Known Stubs

None — all content stubs are filtered (USES_DATA_FILTERED) or removed (ISSUES constant).

## Threat Flags

None — changes are surgical UI/copy fixes with no new network endpoints, auth paths, or trust boundary crossings.

## Self-Check: PASSED
