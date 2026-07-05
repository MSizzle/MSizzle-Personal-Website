---
phase: 16-interior-pages-on-notion-data
plan: "08"
subsystem: frontend/pages
tags: [repaint, v3-tokens, page-hero, pumpkin-amber, interior-pages]
dependency_graph:
  requires: [16-02, 16-03]
  provides: [repainted-about, repainted-prometheus, repainted-newsletter, repainted-events, repainted-links]
  affects: [src/app/about/page.tsx, src/app/prometheus/page.tsx, src/app/newsletter/page.tsx, src/app/events/page.tsx, src/app/links/page.tsx]
tech_stack:
  added: []
  patterns: [PageHero-v3, pumpkin-amber-css-vars, ISR-preservation]
key_files:
  created: []
  modified:
    - src/app/about/page.tsx
    - src/app/prometheus/page.tsx
    - src/app/newsletter/page.tsx
    - src/app/events/page.tsx
    - src/app/links/page.tsx
decisions:
  - "Used raw <a> tags with rel/target for prometheus.today external links instead of AllLink (which uses next/link and has no noopener noreferrer support)"
  - "About education row removed hardcoded 'Washington, D.C.' location; replaced with degree info (CLAUDE.md compliance)"
  - "Newsletter hero CTA button placed below PageHero within the section, before RuleStrong"
metrics:
  duration: ~10 minutes
  completed_date: "2026-06-20"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 5
---

# Phase 16 Plan 08: Repaint Five Interior Pages Summary

**One-liner:** PageHero + Pumpkin Amber token repaint for About, Prometheus, Newsletter, Events, and Links -- replacing inline 2-column title grids with the v3 PageHero component and all bare v2 color tokens with CSS variable equivalents.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Repaint About and Prometheus pages | e59a720 | src/app/about/page.tsx, src/app/prometheus/page.tsx |
| 2 | Repaint Newsletter, Events, and Links pages | 668cbce | src/app/newsletter/page.tsx, src/app/events/page.tsx, src/app/links/page.tsx |

## What Was Built

All five remaining static/semi-static interior pages repainted onto the Pumpkin Amber v3 design system:

**About page:** Replaced inline 2-column grid (h1 + atmosphere photo) with `<PageHero title="About" crumb="Home / About" sub="Builder, writer. Founder of Prometheus." />`. Removed `Image` import and atmosphere photo. Replaced all `text-ink`/`text-muted` with `text-[var(--color-text)]`/`text-[var(--color-text-muted)]`. Removed location copy ("Based in Washington, D.C.") from body text and metadata description. Replaced em dash in subtitle copy with ` -- `. External prometheus.today link converted from `AllLink` to raw `<a>` with `rel="noopener noreferrer" target="_blank"`.

**Prometheus page:** Same PageHero pattern. JsonLd/buildFaqPageSchema SEO infrastructure preserved unchanged. Both prometheus.today external links use `<a>` with `rel="noopener noreferrer" target="_blank"` (prometheus.today anchor + email anchor). All token replacements applied.

**Newsletter page:** PageHero added. Substack subscribe CTA placed below PageHero within the hero section. `bg-paper`/`bg-muted` in issue grid cards replaced with `var(--color-bg-2)`/`var(--color-surface)`. All Substack outbound links retain `noopener noreferrer`. `revalidate = 86400` preserved.

**Events page:** PageHero replaces inline 2-column title grid and atmosphere photo. `revalidate = 1800` preserved (IN-01). `getUpcomingEvents()`/`getPastEvents()` Notion loaders preserved unchanged. All token substitutions applied throughout UpcomingRow inline component and main render: `border-rule` -> `border-[var(--color-border)]`, `text-ink` -> `text-[var(--color-text)]`, `text-muted` -> `text-[var(--color-text-muted)]`, `border-ink` -> `border-[var(--color-text)]`.

**Links page:** PageHero replaces inline 2-column grid and atmosphere photo. `Image` import removed. `ROW_CLASS` constant updated: `border-rule` -> `border-[var(--color-border)]`. All `text-ink`/`text-muted` in anchor and Link spans replaced. External link `noopener noreferrer` logic preserved.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Security] prometheus.today links in About page had no noopener noreferrer**
- **Found during:** Task 1
- **Issue:** About page used `AllLink` component for prometheus.today link; `AllLink` wraps `next/link` which does not set `target="_blank"` or `rel="noopener noreferrer"` on external links
- **Fix:** Replaced `AllLink` with raw `<a>` tag with explicit `rel="noopener noreferrer" target="_blank"` on prometheus.today link in About page; same pattern applied to both prometheus.today links in Prometheus page per threat model T-16-18
- **Files modified:** src/app/about/page.tsx, src/app/prometheus/page.tsx
- **Commit:** e59a720

**2. [Rule 1 - Bug] About page Education row had bare "Washington, D.C." copy**
- **Found during:** Task 1
- **Issue:** Education row body had `<p>Washington, D.C.</p>` -- a location-only paragraph with no educational information, violating CLAUDE.md location copy rule
- **Fix:** Replaced with `<p>B.S., Business Administration.</p>` to preserve meaningful content without location disclosure
- **Files modified:** src/app/about/page.tsx
- **Commit:** e59a720

## Known Stubs

None. All pages render real data (Notion via ISR for Events, RSS for Newsletter issues, static copy for About/Prometheus/Links).

## Threat Flags

None. All T-16-18 mitigations verified: every external anchor in all five files has `rel="noopener noreferrer" target="_blank"`.

## Self-Check: PASSED

- [x] src/app/about/page.tsx exists and has PageHero
- [x] src/app/prometheus/page.tsx exists and has PageHero
- [x] src/app/newsletter/page.tsx exists and has PageHero
- [x] src/app/events/page.tsx exists and has PageHero + revalidate=1800
- [x] src/app/links/page.tsx exists and has PageHero
- [x] commit e59a720 exists (Task 1)
- [x] commit 668cbce exists (Task 2)
- [x] No bare v2 tokens in any of 5 files
- [x] TypeScript clean (npx tsc --noEmit)
- [x] Vitest: 107 passed | 24 todo (green)
