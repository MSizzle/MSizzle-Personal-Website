---
phase: "05-analytics"
plan: "01"
subsystem: "analytics"
tags: ["umami", "analytics", "tracking", "outbound-clicks", "tdd"]
dependency_graph:
  requires: []
  provides:
    - "UmamiAnalytics component (conditional script injection)"
    - "Root layout analytics integration"
    - "Outbound click tracking attributes on footer, project-card, links page"
  affects:
    - "src/app/layout.tsx"
    - "src/components/footer.tsx"
    - "src/components/projects/project-card.tsx"
    - "src/app/links/page.tsx"
tech_stack:
  added: []
  patterns:
    - "next/script with strategy=afterInteractive for analytics injection"
    - "data-umami-event declarative click tracking pattern"
    - "vi.doMock after vi.resetModules for per-test env var isolation"
key_files:
  created:
    - "src/components/analytics/umami-analytics.tsx"
    - "src/__tests__/components/umami-analytics.test.tsx"
    - "src/__tests__/components/footer.test.tsx"
  modified:
    - "src/app/layout.tsx"
    - "src/components/footer.tsx"
    - "src/components/projects/project-card.tsx"
    - "src/app/links/page.tsx"
    - "src/__tests__/components/project-card.test.tsx"
    - "src/__tests__/pages/links.test.tsx"
decisions:
  - "Used vi.doMock (not vi.mock) inside each test after vi.resetModules() to allow per-test env var isolation for NEXT_PUBLIC_* vars"
  - "Mocked next/script as a span with data attributes instead of a script tag to avoid jsdom script-tag stripping behavior"
metrics:
  duration: "4 minutes"
  completed_date: "2026-04-03"
  tasks_completed: 2
  files_changed: 9
---

# Phase 05 Plan 01: Umami Analytics Integration Summary

**One-liner:** Umami tracking script injected via next/script wrapper with data-umami-event declarative click tracking on all outbound links across footer, project cards, and links page.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create UmamiAnalytics component with tests and integrate into layout | ce140fd | umami-analytics.tsx, umami-analytics.test.tsx, layout.tsx |
| 2 | Add data-umami-event attributes to all outbound links | c4c1dc2 | footer.tsx, project-card.tsx, links/page.tsx, footer.test.tsx, project-card.test.tsx, links.test.tsx |

## What Was Built

### UmamiAnalytics Component

`src/components/analytics/umami-analytics.tsx` — A minimal wrapper around `next/script` that:
- Reads `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_URL` from env
- Returns `null` if either is absent (safe in build/dev without env vars)
- Renders `<Script src="{url}/script.js" data-website-id="{id}" strategy="afterInteractive" />` when both are present

### Root Layout Integration

`src/app/layout.tsx` — UmamiAnalytics placed after `</ThemeProvider>`, before `</body>`. Sits outside the provider tree (it's a script tag, not a React provider).

### Declarative Outbound Click Tracking

All external links now have `data-umami-event` attributes that Umami reads automatically:

| Component | Event Pattern | Links Tracked |
|-----------|---------------|---------------|
| Footer | `social-click-{label}` | email, twitter-/-x, linkedin, github (4 total) |
| ProjectCard | `project-external-link` + `data-umami-event-title` | external project URLs |
| Links Page | `links-click-{label}` | twitter, linkedin, github only (3 external http:// links) |

No JavaScript click handlers needed — Umami's script reads the data attributes automatically.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Adjusted test mock strategy for env var isolation**
- **Found during:** Task 1
- **Issue:** Using `vi.mock` at module level combined with `vi.resetModules()` in `beforeEach` caused the mock to not re-register for dynamically imported modules. The first test (render with env vars set) was returning null because `next/script` was no longer mocked after module reset.
- **Fix:** Replaced top-level `vi.mock` with `vi.doMock` inside each test (called after `vi.resetModules()`), which explicitly re-registers the mock for each fresh module import.
- **Files modified:** `src/__tests__/components/umami-analytics.test.tsx`
- **Commit:** ce140fd

**2. [Rule 1 - Bug] Used span instead of script element in test mock**
- **Found during:** Task 1
- **Issue:** Mocking `next/script` to return `<script {...props} />` caused jsdom to strip the script element from the container, making `container.querySelector('script')` return null even when the component rendered correctly.
- **Fix:** Changed mock to return `<span data-testid="umami-script" data-src={src} data-website-id={websiteId} />` and updated assertions to query `[data-testid="umami-script"]` instead of `script`.
- **Files modified:** `src/__tests__/components/umami-analytics.test.tsx`
- **Commit:** ce140fd

## Known Stubs

None — all tracking attributes are wired to real data. The component gracefully returns null without env vars (intentional production-only behavior, not a stub).

## Verification Results

- `npx vitest run` — 9 test files passed, 5 skipped (todo stubs from prior phases), 17 tests passed
- `npx next build` — Build completed without errors; UmamiAnalytics renders null in build (env vars absent, expected)
- `grep -r 'data-umami-event' src/` — Confirmed in footer.tsx, project-card.tsx, links/page.tsx
- `grep 'UmamiAnalytics' src/app/layout.tsx` — Confirmed import and `<UmamiAnalytics />` usage

## Self-Check: PASSED

Files exist:
- [x] src/components/analytics/umami-analytics.tsx
- [x] src/__tests__/components/umami-analytics.test.tsx
- [x] src/__tests__/components/footer.test.tsx
- [x] src/app/layout.tsx (contains UmamiAnalytics)
- [x] src/components/footer.tsx (contains data-umami-event)
- [x] src/components/projects/project-card.tsx (contains data-umami-event)
- [x] src/app/links/page.tsx (contains data-umami-event)

Commits verified:
- [x] ce140fd — Task 1 commit
- [x] c4c1dc2 — Task 2 commit
