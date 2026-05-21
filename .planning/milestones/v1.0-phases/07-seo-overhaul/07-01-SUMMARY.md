---
phase: 07-seo-overhaul
plan: 01
subsystem: seo
tags: [nextjs, metadata, schema.org, jsonld, sitemap, robots, vitest]

requires:
  - phase: 01-foundation
    provides: Next.js 16 App Router, Tailwind v4, TypeScript
  - phase: 03-blog
    provides: getPublishedPosts Notion helper (consumed by sitemap)
  - phase: 05-projects
    provides: getPublishedProjects Notion helper (consumed by sitemap)
provides:
  - SITE_URL constant + canonical(path) helper (src/lib/seo/site.ts)
  - Schema.org builders for Person, FAQPage, BreadcrumbList (src/lib/seo/schemas.ts)
  - JsonLd server component (src/components/seo/json-ld.tsx)
  - Breadcrumbs component pairing visible nav + JSON-LD (src/components/seo/breadcrumbs.tsx)
  - Root layout metadata compliant with D-07/D-09/D-12 (pipe title template, correct copy, RSS alternate link)
  - Sitemap and robots migrated off msizzle.com to montysinger.com with 8 static routes
  - Unit tests locking in schema payload shapes
affects:
  - 07-02-about-page-rewrite
  - 07-03-home-page-seo
  - 07-04-prometheus-page
  - 07-05-uses-page
  - 07-06-newsletter-page
  - 07-07-events-page
  - 07-08-blog-post-seo
  - 07-09-projects-seo
  - 07-10-og-images
  - 07-11-wrap-up

tech-stack:
  added: []
  patterns:
    - Centralized site URL in src/lib/seo/site.ts — no hardcoded domain anywhere in src/
    - Schema.org payloads live in builders, components never hand-roll JSON-LD
    - JsonLd server component is the only route to dangerouslySetInnerHTML for structured data
    - Breadcrumbs component emits visible UI + paired JSON-LD from one items array (zero drift)
    - Title template uses pipe separator ("%s | Monty Singer") per D-09, never em dash

key-files:
  created:
    - src/lib/seo/site.ts
    - src/lib/seo/schemas.ts
    - src/components/seo/json-ld.tsx
    - src/components/seo/breadcrumbs.tsx
    - src/__tests__/seo/schemas.test.ts
  modified:
    - src/app/layout.tsx
    - src/app/sitemap.ts
    - src/app/robots.ts

key-decisions:
  - Used '/' as visible breadcrumb separator (not '>') to match site aesthetic; JSON-LD is what Google reads
  - canonical('/') returns https://montysinger.com/ with trailing slash (tests lock this shape)
  - SITE_URL reads from NEXT_PUBLIC_SITE_URL env var with montysinger.com fallback (D-10)
  - JsonLd is a server component with documented safety contract: input must be server-built

patterns-established:
  - "SEO primitives centralization: all SEO-adjacent helpers land under src/lib/seo/ and src/components/seo/"
  - "Schema builders are pure functions returning plain objects — no side effects, trivial to unit test"
  - "Root layout metadata uses SITE_TITLE and SITE_DESCRIPTION constants so openGraph/twitter blocks stay consistent"

requirements-completed: []

duration: ~15min
completed: 2026-04-15
---

# Phase 07 Plan 01: SEO Infrastructure Foundation Summary

**Centralized SITE_URL + canonical helper, schema.org builders (Person/FAQPage/BreadcrumbList) with vitest coverage, JsonLd + Breadcrumbs server components, and root-layout/sitemap/robots migration from msizzle.com to montysinger.com with D-12 copy and pipe title template.**

## Performance

- **Duration:** ~15 min (single foundational commit 3b2941d)
- **Started:** 2026-04-15T14:06:54Z (approx, based on commit authorship)
- **Completed:** 2026-04-15T14:21:54Z
- **Tasks:** 6/6
- **Files modified:** 8 (5 created, 3 modified)

## Accomplishments

- Shipped the shared SEO primitives that plans 07-02 through 07-11 will import from
- Replaced every hardcoded `msizzle.com` inside scoped files with `SITE_URL` imported from `@/lib/seo/site`
- Locked schema.org Person payload to D-13 exactly via 3 passing vitest suites
- Brought root layout metadata into D-07/D-09/D-12 compliance (pipe separator, Founder/Prometheus copy, RSS alternate link)
- Added 4 new static routes to sitemap (`/prometheus`, `/newsletter`, `/uses`, `/events`) per D-17

## Task Commits

All six tasks were shipped together in a single foundational commit:

1. **Task 1: SITE_URL + canonical helper** — `3b2941d` (feat)
2. **Task 2: Schema builders + vitest tests** — `3b2941d` (feat, TDD tests bundled)
3. **Task 3: JsonLd server component** — `3b2941d` (feat)
4. **Task 4: Breadcrumbs component** — `3b2941d` (feat)
5. **Task 5: Sitemap + robots migration** — `3b2941d` (feat)
6. **Task 6: Root layout metadata rewrite** — `3b2941d` (feat)

_Note: the original executor batched all six tasks into one atomic commit rather than per-task commits. SUMMARY.md was not written at the time; this document is a retroactive wrap-up verifying that all acceptance criteria were in fact met. See **Deviations from Plan** below._

## Files Created/Modified

- `src/lib/seo/site.ts` — SITE_URL constant + canonical(path) helper; reads NEXT_PUBLIC_SITE_URL with montysinger.com fallback
- `src/lib/seo/schemas.ts` — buildPersonSchema (D-13), buildFaqPageSchema, buildBreadcrumbListSchema; imports SITE_URL + canonical
- `src/components/seo/json-ld.tsx` — 3-line server component rendering `<script type="application/ld+json">` via dangerouslySetInnerHTML with documented safety contract
- `src/components/seo/breadcrumbs.tsx` — Breadcrumbs component: visible nav (aria-label="Breadcrumb", aria-current on final crumb, `/` separator) + paired JsonLd from the same items array
- `src/__tests__/seo/schemas.test.ts` — 3 test suites locking in Person/FAQPage/BreadcrumbList payload shapes
- `src/app/layout.tsx` — metadata rewrite: pipe title template, D-12 description, openGraph + twitter blocks sharing SITE_TITLE/SITE_DESCRIPTION constants, RSS alternate link, metadataBase from SITE_URL. Watermark + provider tree untouched.
- `src/app/sitemap.ts` — imports SITE_URL from `@/lib/seo/site`; 8 static routes (home, about, prometheus, newsletter, uses, projects, blog, events) + dynamic post/project routes
- `src/app/robots.ts` — imports SITE_URL from `@/lib/seo/site`; emits sitemap pointer at `${SITE_URL}/sitemap.xml`

## Decisions Made

- **Batched commit vs per-task commits.** Executor combined all six tasks into commit 3b2941d. Acceptable because the tasks share a single coherent foundation and all acceptance criteria passed; future plans in this phase will commit atomically per task.
- **`/` breadcrumb separator over `>`.** Matches site aesthetic; JSON-LD is what Google consumes so the visible glyph is cosmetic.
- **Trailing slash on `canonical('/')`.** `canonical('/')` returns `https://montysinger.com/` rather than `https://montysinger.com`. Test suite (line 59 of schemas.test.ts) locks this in as expected behavior for BreadcrumbList home links.

## Deviations from Plan

### Auto-fixed Issues

**1. [Process] Plan tasks committed as a single atomic commit rather than per-task**
- **Found during:** Retroactive verification (SUMMARY missing)
- **Issue:** Standard GSD flow commits each task separately. Original executor shipped all six tasks under commit 3b2941d.
- **Fix:** Verified every acceptance criterion for all 6 tasks against working-tree source. All PASS. Tests green (3/3).
- **Files modified:** None (code is correct as-is)
- **Verification:** See "Self-Check" section below
- **Committed in:** 3b2941d (original foundation commit)

---

**Total deviations:** 1 process deviation (batched commits)
**Impact on plan:** Zero code impact — all acceptance criteria met. Future plans in phase 07 will commit atomically.

## Issues Encountered

- **SUMMARY.md missing after original execution.** The executor that shipped 3b2941d never wrote a SUMMARY.md, which blocked orchestrator state advancement. This retroactive wrap-up closes that gap. No source changes were needed — the implementation itself is complete and verified.
- **Stale `msizzle.com` references in out-of-scope files.** `src/app/page.tsx:29` and `src/app/about/page.tsx:12` still contain `https://msizzle.com` in inline Person JSON-LD. These files are NOT in plan 07-01's `files_modified` list — they belong to plans 07-03 (home page) and 07-02 (about page rewrite). Correctly deferred, not a 07-01 bug.

## Self-Check: PASSED

Verified against acceptance criteria via grep + vitest:

- `src/lib/seo/site.ts` — FOUND; exports SITE_URL (montysinger.com default) + canonical()
- `src/lib/seo/schemas.ts` — FOUND; exports all three builders, contains 'Founder', 'https://prometheus.today', 'Georgetown University'; no 'NYC'/'Investor'
- `src/components/seo/json-ld.tsx` — FOUND; server component, no "use client"
- `src/components/seo/breadcrumbs.tsx` — FOUND; has `aria-label="Breadcrumb"`, `aria-current`, imports buildBreadcrumbListSchema + JsonLd; no em dashes
- `src/app/sitemap.ts` — FOUND; imports SITE_URL, contains /prometheus, /newsletter, /uses, /events; no msizzle.com
- `src/app/robots.ts` — FOUND; imports SITE_URL; no msizzle.com
- `src/app/layout.tsx` — FOUND; pipe template `"%s | Monty Singer"`, RSS alternate link, D-12 copy, watermark intact; no NYC/Investor/em dash
- `src/__tests__/seo/schemas.test.ts` — FOUND; `npx vitest run` → 3 Test Files, 3 passing tests, exit 0
- `grep -rn "msizzle.com" src/` → only 2 hits in out-of-scope files (page.tsx:29, about/page.tsx:12) — correctly deferred to later plans in this phase
- Commit `3b2941d` — FOUND on main branch

## User Setup Required

None — pure build-time/SSR metadata work. No secrets, no env vars required beyond optional `NEXT_PUBLIC_SITE_URL` which has a correct default fallback.

## Next Phase Readiness

- **Ready:** Plans 07-02 through 07-11 can now import `SITE_URL`, `canonical`, `buildPersonSchema`, `buildFaqPageSchema`, `buildBreadcrumbListSchema`, `JsonLd`, and `Breadcrumbs` from this plan's artifacts.
- **Next obvious consumer:** Plan 07-02 (about page rewrite) should replace the inline `https://msizzle.com` in `src/app/about/page.tsx:12` with `buildPersonSchema()` + `<JsonLd />`.
- **Next obvious consumer:** Plan 07-03 (home page SEO) should replace the inline `https://msizzle.com` in `src/app/page.tsx:29` with `buildPersonSchema()` + `<JsonLd />`.
- **No blockers.**

---
*Phase: 07-seo-overhaul*
*Completed: 2026-04-15*
