---
phase: quick-260706-tx6
plan: 01
subsystem: ui
tags: [nextjs, app-router, nav, redirects, routing]

# Dependency graph
requires:
  - phase: 17.2
    provides: prior D-08 4-item nav (About/Projects/Writing/Uses) that this plan reverses
provides:
  - "/building route (renamed from /projects, git history preserved)"
  - "/about deleted with permanent redirect to /"
  - "/projects, /projects/:slug permanent redirects to /building, /building/:slug"
  - "New 4-item nav (Prometheus, Building, Writing, Contact) across desktop header, homepage sticky nav, and mobile drawer"
  - "#contact anchor target wired on both footer components"
affects: [future nav/IA phases, any phase touching /projects or /about routes]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "In-page anchor nav items (Contact -> #contact) branch on href.startsWith('#') to render a plain <a> instead of next/link Link, kept alongside route-based active-state logic in the same LINKS array"

key-files:
  created: []
  modified:
    - src/app/building/page.tsx (moved from src/app/projects/page.tsx via git mv)
    - src/app/building/[slug]/page.tsx (moved from src/app/projects/[slug]/page.tsx)
    - src/app/building/[slug]/opengraph-image.tsx (moved from src/app/projects/[slug]/opengraph-image.tsx)
    - src/app/about/page.tsx (deleted)
    - src/components/projects/project-card.tsx
    - src/components/home/section-work.tsx
    - src/app/sitemap.ts
    - src/components/layout/v3-footer.tsx
    - src/lib/seo/project-metadata.ts
    - next.config.ts
    - src/components/home-v2/editorial-header.tsx
    - src/components/home/sticky-nav.tsx
    - src/components/nav/navigation.tsx
    - src/components/home/section-footer.tsx

key-decisions:
  - "Reversed locked decision D-08 (About/Projects/Writing/Uses) per Monty's explicit 2026-07-06 direction to a leaner Prometheus/Building/Writing/Contact set"
  - "Contact is a same-page #contact anchor, never a route, and never receives active/bold nav styling"
  - "v3-footer 'Let's be friends.' signature switched from a Link to /about to a plain mailto anchor, reusing the exact Say Hi mailto string from sticky-nav.tsx"
  - "Removed the About footer column from v3-footer.tsx since /about no longer exists"

patterns-established:
  - "Nav link arrays mix route links and anchor links; render loop checks href.startsWith('#') to branch between next/link Link (route, gets active-state styling) and plain <a> (anchor, never active)"

requirements-completed: [QUICK-260706-tx6]

duration: 4min
completed: 2026-07-06
---

# Phase quick-260706-tx6: Rework Site Nav to Prometheus/Building Summary

**Renamed /projects to /building (git history preserved), deleted /about with a redirect to /, and reworked all three nav surfaces to a new Prometheus/Building/Writing/Contact set with Contact as a same-page #contact anchor.**

## Performance

- **Duration:** ~4 min (commit-to-commit)
- **Started:** 2026-07-06T13:44:00Z (approx, first commit ce23850 at 21:44:13+08:00)
- **Completed:** 2026-07-06T13:47:54Z (last commit 93a8146)
- **Tasks:** 4/4 completed
- **Files modified:** 14 (3 moved via git mv, 1 deleted, 10 edited)

## Accomplishments
- `/projects` route renamed to `/building` via `git mv`, history preserved (verified with `git log --follow`-style rename tracking in `git status`)
- `/about` deleted entirely; `/about` and `/projects`(`/:slug`) now permanently redirect to their new destinations
- All three nav surfaces (global desktop header, homepage sticky nav, mobile drawer) rewritten to exactly Prometheus / Building / Writing / Contact, in that order
- `#contact` anchor wired on both footer components (`section-footer.tsx` for homepage, `v3-footer.tsx` for every other route)
- `npm run build` passes with zero errors; both grep gates (`/projects`, `/about` outside `__tests__`) return zero lines

## Task Commits

Each task was committed atomically:

1. **Task 1: Rename /projects to /building, fix every internal link, add redirects** - `ce23850` (refactor(route))
2. **Task 2: Delete /about, add redirect, remove all references** - `f294e4f` (refactor(route))
3. **Task 3: Rework nav in editorial-header, sticky-nav, and mobile drawer** - `b656e52` (feat(nav))
4. **Task 4: Wire the #contact anchor and run final verification** - `93a8146` (feat(nav))

_No TDD tasks in this plan; each commit is a single feat/refactor commit._

## Files Created/Modified
- `src/app/building/page.tsx` - Works index, canonical/OG URLs updated to /building
- `src/app/building/[slug]/page.tsx` - Project detail, breadcrumb href updated to /building
- `src/app/building/[slug]/opengraph-image.tsx` - Moved with the route (no content changes needed, uses @/ aliases)
- `src/app/about/page.tsx` - Deleted (git rm)
- `src/components/projects/project-card.tsx` - Link href updated to /building/${slug}
- `src/components/home/section-work.tsx` - Homepage "Projects" affordance link updated to /building
- `src/app/sitemap.ts` - Static routes list updated (dropped /about, /projects -> /building), project route template updated
- `src/components/layout/v3-footer.tsx` - Works link -> /building; signature link -> mailto anchor; About column removed; id="contact" added
- `src/lib/seo/project-metadata.ts` - canonical/alternates URLs updated to /building/${slug}
- `next.config.ts` - /portfolio destination fixed to /building; added /projects and /projects/:slug redirects; added /about redirect; /links destination fixed to /
- `src/components/home-v2/editorial-header.tsx` - LINKS + active type reworked to Prometheus/Building/Writing/Contact
- `src/components/home/sticky-nav.tsx` - LINKS reworked to same 4-item set; Say Hi CTA untouched
- `src/components/nav/navigation.tsx` - MOBILE_LINKS + activeLabel type/derivation reworked to same 4-item set
- `src/components/home/section-footer.tsx` - id="contact" added to outermost footer element

## Decisions Made
- Reversed D-08 per explicit user direction dated 2026-07-06 (see plan objective) - documented in each nav component's doc comments so future readers understand the D-08 supersession
- Reused the exact sticky-nav "Say Hi" mailto string for the v3-footer signature link rather than inventing new copy, to keep the contact experience consistent site-wide
- Removed the entire About footer column in v3-footer.tsx rather than repointing it, since there is no longer any page for it to point to

## Deviations from Plan

None - plan executed exactly as written. One micro-adjustment: while wording the v3-footer.tsx doc comment update, an initial phrasing accidentally contained the literal substring "/about", which would have failed the grep gate; reworded to "About page removed" before the Task 2 gate check (caught and fixed inline during Task 2 execution, not a separate deviation from the plan's intent).

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All success criteria met: /building and /building/[slug] serve former /projects content with history intact; /projects, /projects/:slug, /about all permanently redirect; all three nav surfaces show exactly Prometheus/Building/Writing/Contact; Contact anchors to id="contact" on both footer components; /uses remains reachable by direct URL and untouched; `npm run build` succeeds.
- No blockers for future work. The /uses page remains on disk and reachable but is now unlinked from all primary nav surfaces, matching the plan's intent.

## Self-Check: PASSED

- FOUND: src/app/building/page.tsx
- FOUND: src/app/building/[slug]/page.tsx
- CONFIRMED ABSENT: src/app/about
- FOUND commit: ce23850 (Task 1)
- FOUND commit: f294e4f (Task 2)
- FOUND commit: b656e52 (Task 3)
- FOUND commit: 93a8146 (Task 4)

---
*Phase: quick-260706-tx6*
*Completed: 2026-07-06*
