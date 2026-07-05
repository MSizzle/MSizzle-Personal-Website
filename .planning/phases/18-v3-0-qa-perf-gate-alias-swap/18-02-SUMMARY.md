---
phase: 18-v3-0-qa-perf-gate-alias-swap
plan: "02"
subsystem: infra
tags: [lighthouse, vercel, performance, accessibility, qa]

requires:
  - phase: 18-01
    provides: vercel build --prod PASS (DQ-02), .next/ build output for local server

provides:
  - "v3 Vercel preview URL: https://m-sizzle-personal-website-7tqgjvlha-msizzles-projects.vercel.app"
  - "Lighthouse desktop median-of-3 for /, /about, /writing, /uses, /portfolio"
  - "18-02-EVIDENCE.md with D-02 verdict and raw per-run data"

affects:
  - 18-03 (PSI mobile — uses preview URL)
  - 18-04 (visual QA — uses preview URL)
  - 18-06 (GO/NO-GO — D-02 A11y failures must be remediated before sign-off)

tech-stack:
  added: []
  patterns:
    - "Lighthouse CLI 13.3.0, desktop preset, median-of-3, local prod server (Path C)"

key-files:
  created:
    - .planning/phases/18-v3-0-qa-perf-gate-alias-swap/18-02-EVIDENCE.md
  modified: []

key-decisions:
  - "Path C (local npm run start) used for Lighthouse — preview is SSO-protected with no bypass token configured"
  - "D-02 gate: FAIL — A11y 94 on 4 of 5 routes; color-contrast + heading-order audits failing (same root cause as Phase 13 pre-fix)"
  - "Preview URL captured for downstream plans 18-03 and 18-04 regardless of D-02 gate status"
  - "Remediation needed before 18-06: darken muted CSS tokens + fix heading hierarchy on interior pages"

patterns-established:
  - "Measurement-only plan: no source changes; failures documented faithfully for GO-NO-GO consideration"

requirements-completed: []

duration: 14min
completed: 2026-07-03
---

# Phase 18 Plan 02: Vercel Preview + Lighthouse Desktop Summary

**v3 preview deployed and Lighthouse desktop median-of-3 recorded; Performance=100 and CWV excellent across all 5 routes but A11y=94 (threshold 95) on 4 routes due to color-contrast and heading-order violations requiring a CSS polish pass before GO sign-off**

## Performance

- **Duration:** 14 min
- **Started:** 2026-07-03T02:44:27Z
- **Completed:** 2026-07-03T02:59:02Z
- **Tasks:** 3 (all complete)
- **Files modified:** 1

## Accomplishments

- Deployed v3 Vercel preview (`dpl_5mwQuwksGsMwqN4MPoZ295h17j3U`) from current HEAD; 39 pages built, all v3 routes present
- Ran 15 Lighthouse desktop runs (5 routes x 3) capturing median scores and raw data in 18-02-EVIDENCE.md
- Homepage (`/`) fully passes: Perf=100, A11y=96, BP=100, SEO=100; CWV excellent (LCP 600ms, CLS=0.000, TBT=0ms)
- Identified A11y=94 on 4 interior routes — `color-contrast` and `heading-order` audits — with clear remediation path before GO

## Task Commits

Each task was committed atomically:

1. **Task 1: Confirm or create v3 Vercel preview; capture URL and bypass token** — included in `bbeb295`
2. **Task 2: Lighthouse desktop median-of-3 on 5 routes** — included in `bbeb295`
3. **Task 3: Write 18-02-EVIDENCE.md** — `bbeb295` (feat: capture v3 Vercel preview and run Lighthouse desktop median-of-3)

## Files Created/Modified

- `.planning/phases/18-v3-0-qa-perf-gate-alias-swap/18-02-EVIDENCE.md` — Preview URL, D-02 verdict, per-route median table, raw 3-run scores, CWV, failure analysis

## Decisions Made

1. **Path C (local server) for Lighthouse**: The Vercel preview (`7tqgjvlha`) is SSO-protected (302 → vercel.com/sso-api). No bypass token was configured in Project Settings. Path C (local `npm run start`) matches Phase 13's fallback and is a faithful lower-bound — DOM-based failures (color-contrast, heading-order) reproduce identically; CDN-dependent metrics (TTFB) would only improve on the live preview.

2. **D-02 verdict: FAIL (GO-with-fix)**: A11y=94 on 4 of 5 routes, 1 point below the 95 threshold. Identical root cause to Phase 13 pre-fix: `color-contrast` (Pumpkin Amber muted tokens at ~2.6:1 contrast ratio) and `heading-order` (hierarchy skips levels). Phase 13 fixed this by darkening `--color-muted`/`--fg-muted` and correcting heading levels. Same fix applies to v3. This is addressable before 18-06 without architectural changes.

3. **18-03 and 18-04 unblocked**: Per plan spec, downstream plans proceed regardless of D-02 gate status — they only need the preview URL.

## Deviations from Plan

None — plan executed exactly as written. The Deployment Protection/SSO scenario and local-server fallback were explicitly anticipated in the plan context (per Phase 13 pattern). D-02 FAIL was faithfully recorded; no source modifications made (measurement-only plan).

## Issues Encountered

- **Deployment Protection SSO**: Preview URL returned 302 → `vercel.com/sso-api` (not 401). No `x-vercel-protection-bypass` token was available from CLI. Fell back to Path C (local prod server), same as Phase 13. All Lighthouse failures are markup-level and CDN-independent.
- **First Lighthouse run cold-cache variance on `/`**: Run 1 scored Perf=78 (cold cache); runs 2 and 3 = 100. Median = 100. Normal pattern on localhost — documented in raw scores table.

## Next Phase Readiness

- **18-03 (PSI mobile):** Ready to proceed. Preview URL: `https://m-sizzle-personal-website-7tqgjvlha-msizzles-projects.vercel.app`
- **18-04 (375px visual QA):** Ready to proceed. Uses same preview URL.
- **18-06 (GO/NO-GO):** Blocked on A11y remediation — color-contrast + heading-order fix needed on interior pages before sign-off. Fix is small (CSS token darkening + heading level corrections; ~30 min).

---
*Phase: 18-v3-0-qa-perf-gate-alias-swap*
*Completed: 2026-07-03*
