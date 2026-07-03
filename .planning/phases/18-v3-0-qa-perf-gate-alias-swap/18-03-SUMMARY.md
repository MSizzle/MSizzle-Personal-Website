---
phase: 18-v3-0-qa-perf-gate-alias-swap
plan: "03"
subsystem: qa
tags: [lighthouse, psi, mobile-perf, webgl, lcp, dq-03]

requires:
  - phase: 18-02
    provides: Vercel preview URL and Lighthouse desktop results

provides:
  - "DQ-03 gate evidence: R-1 code inspection, D-04 satisfied-by-absence, PSI mobile proxy at 95"
  - "18-03-EVIDENCE.md with full measurement record and PASS-with-caveat verdict"

affects: [18-06-GO-NO-GO, 18-07-post-promote-verify]

tech-stack:
  added: []
  patterns:
    - "D-04 satisfied-by-absence: when homepage has no WebGL at all, the 4-point LCP gate passes vacuously"
    - "PSI 429 fallback: local Lighthouse mobile against npm run start is an acceptable proxy with ±15pt variance caveat"

key-files:
  created:
    - .planning/phases/18-v3-0-qa-perf-gate-alias-swap/18-03-EVIDENCE.md
  modified: []

key-decisions:
  - "R-1 confirmed-in-code: ExplorativeHomepage has zero WebGL/canvas/three imports; D-04 block passes satisfied-by-absence"
  - "PSI API 429 (daily quota exhausted); local Lighthouse mobile = 95 accepted as proxy at the >=95 floor"
  - "DQ-03 verdict: PASS-with-caveat; PSI-mobile deferred to 18-07 post-promote (same pattern as Phase 13)"
  - "LCP element confirmed as h1 text CREATE ORDER FROM CHAOS in both Lighthouse runs; nextjs16-fetchpriority-quirk is N/A for text LCP"

patterns-established:
  - "satisfied-by-absence documentation: when the WebGL gate premise is false (no canvas exists), document each D-04 sub-check as N/A with rationale"

requirements-completed:
  - DQ-03

duration: 35min
completed: 2026-07-03
---

# Phase 18 Plan 03: PSI Mobile Gate + WebGL LCP Verification Summary

**R-1 confirmed: homepage is a plain static Server Component with no WebGL; D-04 4-point block satisfied-by-absence; mobile Lighthouse proxy = 95 at the >=95 floor (PSI API 429 deferred to 18-07)**

## Performance

- **Duration:** 35 min
- **Started:** 2026-07-03T03:01:00Z
- **Completed:** 2026-07-03T03:36:27Z
- **Tasks:** 3 (Tasks 1-3 committed together as single evidence file)
- **Files modified:** 1

## Accomplishments

- R-1 code inspection confirmed: `explorative-homepage.tsx` has zero WebGL/canvas/three.js imports; it is a plain Server Component (no `"use client"`) rendering SSR text. `canvas-loader.tsx`, `hero-blob.tsx`, and `hero-blob-canvas.tsx` exist as orphaned dead code but are not on the `/` render path.
- D-04 4-point LCP block documented as satisfied-by-absence: homepage has no canvas, no poster, no blob gate — all four assertions pass vacuously; `nextjs16-fetchpriority-quirk` is N/A since LCP is text.
- LCP element confirmed as `<h1>` "CREATE ORDER FROM CHAOS" in both mobile Lighthouse runs (`lcp-breakdown-insight` node data, `lhId: page-0-H1`). `lcp-discovery-insight` returned `notApplicable` in both runs — correct for a text LCP element.
- PSI API returned 429 (same quota pattern as Phase 13). Fallback: mobile Lighthouse on localhost prod server = **95** (exactly at floor). Vercel preview score = 83, explained entirely by bypass URL 307 redirect +1,210ms LCP penalty — not a real performance regression.
- DQ-03 verdict: **PASS-with-caveat**. PSI deferred to 18-07 post-promote check against production `montysinger.com` (no redirect, CDN-served).

## Task Commits

1. **Tasks 1-3: R-1 inspection + PSI gate + evidence file** — `6de50be` (docs)

## Files Created/Modified

- `.planning/phases/18-v3-0-qa-perf-gate-alias-swap/18-03-EVIDENCE.md` — DQ-03 gate evidence: R-1 code inspection result, D-04 satisfied-by-absence block, dual Lighthouse mobile measurements (localhost=95, preview=83 with redirect artifact), PSI 429 record, PASS-with-caveat verdict

## Decisions Made

- **D-04 satisfied-by-absence:** Phase 17.1 removed the WebGL blob entirely. The spike-001 D-04 premise ("LCP is the WebGL canvas", "mobile serves poster", "canvas mounts deferred") is now vacuously false — the homepage is plain SSR. All four sub-checks documented as N/A with rationale.
- **PSI 429 fallback accepted:** Local Lighthouse mobile against `npm run start` (same compiled code) is the standard Phase 13 fallback pattern. Score = 95 is accepted as proxy evidence meeting the >=95 floor.
- **Bypass URL redirect artifact documented:** The 307 redirect from the `?_vercel_share` token adds 1,210ms to LCP on the Vercel preview measurement. This is a test-methodology artifact, not a real performance issue. Production will not have this redirect.
- **PSI deferred to 18-07:** Post-promote PSI against montysinger.com will give the authoritative number. Operator should run `https://pagespeed.web.dev/?url=https%3A%2F%2Fmontysinger.com&form_factor=mobile` after alias promotion.

## Deviations from Plan

None - plan executed exactly as written. The PSI 429 fallback path was documented in the plan's operational notes as the expected alternative. The local Lighthouse mobile measurement and PSI deferral were both specified in the operational notes.

## Issues Encountered

- PSI API 429 (daily quota exhausted for anonymous key): expected from Phase 13 precedent; handled via local Lighthouse fallback.
- Vercel preview deployment protection (SSO-gated): bypass URL (`?_vercel_share` token) was tested; Lighthouse ran against it and confirmed the 307 redirect is responsible for the 12-point score gap (83 vs 95).

## User Setup Required

None for this plan. Post-promote PSI check (18-07) requires the operator to run PSI manually at pagespeed.web.dev against `montysinger.com` after the alias is promoted.

## Next Phase Readiness

- DQ-03 is provisionally PASS (local measurement at floor). No blocking issues.
- 18-04 (375px visual QA, human-gated) and 18-05 (secret scan + theme, already complete) are both unblocked.
- 18-06 GO sign-off can proceed; the PSI-mobile caveat is documented for the operator to accept or defer.
- The orphaned WebGL files (`hero-blob.tsx`, `hero-blob-canvas.tsx`, `canvas-loader.tsx`) should be cleaned up in a future maintenance pass — they are dead code but not a blocker.

---
*Phase: 18-v3-0-qa-perf-gate-alias-swap*
*Completed: 2026-07-03*
