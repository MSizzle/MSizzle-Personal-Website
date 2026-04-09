---
phase: quick
plan: 260409-lle
subsystem: events
tags: [notion, events, navigation, isr]
dependency_graph:
  requires: [notion-projects.ts pattern]
  provides: [notion-events.ts, /events page, events nav link]
  affects: [navigation, site structure]
tech_stack:
  added: []
  patterns: [notion-fetcher with pLimit+withRetry, ISR revalidate 1800, Promise.all parallel fetch, graceful env guard]
key_files:
  created:
    - src/lib/notion-events.ts
    - src/app/events/page.tsx
  modified:
    - src/components/nav/navigation.tsx
decisions:
  - Replaced existing static EVENTS data file with Notion-powered fetcher — static file kept (harmless, empty)
  - Promise.all for parallel getUpcomingEvents + getPastEvents to avoid waterfall
  - EventCard as inline function component — no separate file needed for this scope
metrics:
  duration: ~10min
  completed: "2026-04-09"
  tasks_completed: 2
  files_changed: 3
---

# Quick Task 260409-lle: Notion-Powered Events Feature Summary

**One-liner:** Notion-driven events page with upcoming/past split, ISR, rate-limited fetcher, and nav link — mirrors notion-projects.ts patterns exactly.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create Notion events fetcher module | 361663d | src/lib/notion-events.ts |
| 2 | Create /events page and add nav link | 7207e6a | src/app/events/page.tsx, src/components/nav/navigation.tsx |

## What Was Built

**src/lib/notion-events.ts** — Self-contained Notion fetcher module:
- `EventItem` interface: id, name, date, endDate, location, link, description, emoji, published
- `extractEventProperties` with defensive fallback property names (Name/Title/title, Date/date, etc.)
- `getPublishedEvents` — all published events, sorted date ascending
- `getUpcomingEvents` — Published=true AND Date on_or_after today, ascending
- `getPastEvents` — Published=true AND Date before today, descending (most recent first)
- Rate limiter: pLimit(2), withRetry with exponential backoff (identical to notion-projects.ts)
- Env guard: returns [] gracefully when NOTION_TOKEN or NOTION_EVENTS_DB_ID not set

**src/app/events/page.tsx** — Async Server Component with ISR:
- `revalidate = 1800` for 30-minute ISR
- Promise.all parallel fetch of upcoming + past events
- Upcoming section (h2, staggered EventCard list) shown only when non-empty
- Past section (h2, staggered EventCard list) shown only when non-empty
- Empty state: "No events yet." when both arrays empty or env vars missing
- EventCard: emoji + name, formatted date (TBD if null), location separator, description, RSVP link (new tab)

**src/components/nav/navigation.tsx** — Events link added:
- Added `{ href: '/events', label: 'Events' }` between About and Contact in NAV_LINKS
- Appears on both desktop nav and mobile drawer (single array drives both)

## Verification

- `npx tsc --noEmit` passes clean (no new errors)
- `npm run build` succeeds — /events builds as `○ (Static)` with 30m ISR revalidation
- Without NOTION_EVENTS_DB_ID, env guard returns [] and page shows "No events yet." (no crash)
- Navigation shows Events link between About and Contact

## Deviations from Plan

**1. [Rule 1 - Bug] Pre-existing events page replaced rather than created from scratch**
- Found during: Task 2
- Issue: `src/app/events/page.tsx` already existed using a static `EVENTS` data array from `src/data/events.ts`
- Fix: Replaced file content with Notion-powered version per plan spec; kept `src/data/events.ts` (harmless empty file)
- Files modified: src/app/events/page.tsx
- Commit: 7207e6a

Otherwise — plan executed exactly as written.

## Known Stubs

None — env var guard returns [] gracefully, empty state is intentional UX (not a stub).

## Threat Flags

None — all threat model mitigations applied:
- T-quick-02: Published=true filter in all three query functions — unpublished events never fetched
- T-quick-03: pLimit(2) + withRetry exponential backoff present in notion-events.ts

## Self-Check: PASSED

- src/lib/notion-events.ts: FOUND
- src/app/events/page.tsx: FOUND (verified contains `revalidate = 1800` and `/events` pattern)
- src/components/nav/navigation.tsx: FOUND (verified contains `/events`)
- Commit 361663d: FOUND
- Commit 7207e6a: FOUND
- Build output: /events appears as static ISR with 30m revalidation
