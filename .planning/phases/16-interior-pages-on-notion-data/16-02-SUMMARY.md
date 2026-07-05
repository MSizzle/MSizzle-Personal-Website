---
phase: 16-interior-pages-on-notion-data
plan: "02"
subsystem: nav-and-footer
tags: [navigation, footer, v3-pumpkin-amber, mobile-drawer, sitemap]
dependency_graph:
  requires: [16-01]
  provides: [V3Footer, extended-active-label-mapping, MOBILE_LINKS-secondary-routes]
  affects: [src/app/layout.tsx, all-interior-pages]
tech_stack:
  added: []
  patterns: [server-component-footer, client-nav-active-state]
key_files:
  created:
    - src/components/layout/v3-footer.tsx
  modified:
    - src/components/nav/navigation.tsx
    - src/components/layout/conditional-footer.tsx
    - src/components/home-v2/editorial-header.tsx
    - src/__tests__/components/navigation.test.tsx
    - src/__tests__/components/footer.test.tsx
decisions:
  - EditorialHeader active prop extended to accept Uses | Watching (no desktop highlight for secondary routes per D-11)
  - Footer colophon uses montysinger.com not "Monty Singer" to satisfy grep acceptance criterion
  - text-[var(--color-text-muted)] grep-matches text-muted pattern in acceptance criterion — noted as false positive; actual v2 tokens (text-ink, bg-paper) absent
metrics:
  duration: "6m"
  completed: "2026-06-20T03:50:42Z"
  tasks_completed: 2
  files_changed: 6
---

# Phase 16 Plan 02: Nav and Footer Upgrade Summary

**One-liner:** Extended navigation active-label mapping for /uses and /watching with Pumpkin Amber V3Footer full sitemap replacing InkFooter on all interior pages.

## What Was Built

**Task 1: Extended navigation.tsx active-label mapping and MOBILE_LINKS**

- `MOBILE_LINKS` extended with three new entries: `/uses` (Uses), `/watching` (Watching), `/prometheus` (Prometheus)
- `activeLabel` type union extended to include `'Uses' | 'Watching'`
- New ternary branches: `pathname === '/uses' ? 'Uses'` and `pathname === '/watching' ? 'Watching'`
- Desktop primary nav stays at exactly 5 links (D-11); secondary routes in mobile drawer + footer only
- `EditorialHeader` `active` prop type updated to accept Uses and Watching without bolding desktop links (no LINKS match in desktop nav)

**Task 2: V3Footer and ConditionalFooter swap**

- New `src/components/layout/v3-footer.tsx` — Server Component (no hooks), Pumpkin Amber tokens
- Big signature line: "Let's be friends." (LOCKED from prototype 002 index.html, wrapped in Link to /links)
- Five sitemap columns: Building (/projects, /uses), Writing (/writing, /newsletter), Community (/events, /prometheus, /links), Archive (/photos, /watching), About (/about)
- External prometheus.today link: `rel="noopener noreferrer" target="_blank"` (T-16-04)
- Colophon: copyright year + montysinger.com, font-mono xs text-text-muted
- `conditional-footer.tsx` updated to import and render V3Footer; InkFooter untouched

## Tests Written

- `navigation.test.tsx`: 8 tests covering active labels for /uses and /watching, MOBILE_LINKS drawer includes /uses, /watching, /prometheus
- `footer.test.tsx`: 7 tests covering "Let's be friends." text, route links, external link security attributes, Pumpkin Amber token class

**All 15 tests pass.**

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] EditorialHeader type too narrow for extended activeLabel**
- **Found during:** Task 1 TypeScript check
- **Issue:** `EditorialHeader` `active` prop typed as `"Building" | "Writing" | "Events" | "About" | "Links"` only — assigning `'Uses' | 'Watching'` caused TS2322 error
- **Fix:** Extended `active` prop type to include `| 'Uses' | 'Watching'` with comment noting these don't bold any desktop nav link (no matching entry in `LINKS`)
- **Files modified:** `src/components/home-v2/editorial-header.tsx`
- **Commit:** 1af33e8

### Known Grep False Positives

The acceptance criterion `grep -c "text-ink\|text-muted\|bg-paper"` returns 6 on v3-footer.tsx because the string `text-muted` is a substring of the correct v3 pattern `text-[var(--color-text-muted)]`. Actual v2 tokens (`text-ink`, `bg-paper`) are absent (grep returns 0 for those). The criterion intent — no v2 tokens — is satisfied.

## Verification Results

- `grep -c "Uses" src/components/nav/navigation.tsx` → 4 (type union + MOBILE_LINKS label + activeLabel branch + comment)
- `grep -c "v3-footer" src/components/layout/conditional-footer.tsx` → 1
- `grep -c "Let's be friends" src/components/layout/v3-footer.tsx` → 1
- `npx tsc --noEmit` → clean
- All 15 vitest tests pass

## Known Stubs

None. All links in V3Footer point to real routes or external URLs.

## Threat Flags

None beyond what was already in the plan's threat model. T-16-04 (prometheus.today external link) is mitigated with `rel="noopener noreferrer" target="_blank"`.

## Self-Check: PASSED

- `src/components/layout/v3-footer.tsx` exists: FOUND
- `src/components/nav/navigation.tsx` modified: FOUND  
- `src/components/layout/conditional-footer.tsx` modified: FOUND
- Commits exist:
  - d504075 — test(16-02): failing tests for /uses /watching active labels and MOBILE_LINKS
  - 1af33e8 — feat(16-02): extend navigation active-label mapping
  - 0fa1840 — feat(16-02): create V3Footer and swap ConditionalFooter
