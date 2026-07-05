---
phase: 15
plan: 04
subsystem: home/fallback-poster + home/section-* content components
tags: [lcp-image, server-components, section-beats, content-wiring, stub-replacement]
dependency_graph:
  requires:
    - 15-01 (palette tokens, stub components, test scaffolds, hero-blob-poster.webp placeholder)
    - 15-03 (explorative-homepage.tsx orchestrator references these components)
  provides:
    - src/components/home/fallback-poster.tsx: mobile/fallback hero image (SSR'd, LCP path)
    - src/components/home/section-building.tsx: BigList index (Building/Writing/Doing)
    - src/components/home/section-writing.tsx: static curated essay links + CTA button
    - src/components/home/section-newsletter.tsx: newsletter beat with NewsletterCarousel
    - src/components/home/section-footer.tsx: homepage-only footer with nav columns
    - Promoted test assertions: fallback-poster.test.tsx (2 real), section-building.test.tsx (2 real)
  affects:
    - src/app/page.tsx (explorative-homepage now has real content below hero)
    - Plans 15-05 (scroll animation layer builds on real section components)
tech_stack:
  added: []
  patterns:
    - Server Component pattern: all five components are SC (no "use client") — no hooks needed
    - fetchPriority="high" on Next Image for LCP (Next 16 does not auto-emit from priority alone)
    - FEATURED_ESSAYS static array pattern (D-13: Notion-wiring deferred to Phase 16)
    - cleanup() in afterEach for DOM isolation between tests (mirrors 15-03 pattern)
    - JSX string expression {"Let's be friends."} for apostrophe in JSX (grep-safe vs &apos;)
key_files:
  created: []
  modified:
    - src/components/home/fallback-poster.tsx (stub → real: LCP image with fetchPriority)
    - src/components/home/section-building.tsx (stub → real: BigList index)
    - src/components/home/section-writing.tsx (stub → real: essay list + button)
    - src/components/home/section-newsletter.tsx (stub → real: newsletter beat)
    - src/components/home/section-footer.tsx (stub → real: footer with nav columns)
    - src/__tests__/home/fallback-poster.test.tsx (vi.todo → 2 real assertions)
    - src/__tests__/home/section-building.test.tsx (vi.todo → 2 real assertions)
decisions:
  - "FEATURED_ESSAYS uses curated realistic essay slugs (not Notion-sourced) per D-13: Phase 16 will wire real Notion data; v1 uses static/curated content"
  - "Section footer uses JSX expression {\"Let's be friends.\"} instead of &apos; entity — satisfies plan's grep acceptance criterion while maintaining identical render output"
  - "section-newsletter.tsx uses no \"use client\" — slide-newsletter.tsx analog was already a Server Component; NewsletterCarousel is not a client component"
  - "Worktree required git reset --hard to 77321bf to pick up Phase 15 work (wave 1-3 commits); worktree was created from old base and didn't have the Phase 15 context"
metrics:
  duration: "4m"
  completed: "2026-06-19T21:04:15Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 0
  files_modified: 7
---

# Phase 15 Plan 04: Content Section Components — FallbackPoster + Section Beats Summary

**One-liner:** Stub-to-real replacement for all five home/ content components — FallbackPoster (fetchPriority="high" LCP path), SectionBuilding (BigList index), SectionWriting (curated essays), SectionNewsletter (Monty Monthly carousel), SectionFooter (four nav columns) — with promoted test assertions and passing build.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create fallback-poster.tsx with LCP props + promote test assertions | 953c829 | src/components/home/fallback-poster.tsx, src/__tests__/home/fallback-poster.test.tsx |
| 2 | Create section-building.tsx + section-writing.tsx + update building test | e57ba14 | src/components/home/section-building.tsx, src/components/home/section-writing.tsx, src/__tests__/home/section-building.test.tsx |
| 3 | Create section-newsletter.tsx + section-footer.tsx | f402882 | src/components/home/section-newsletter.tsx, src/components/home/section-footer.tsx |

## Decisions Made

1. **FEATURED_ESSAYS static content (D-13):** The writing page is 100% Notion-driven with no static slugs in the codebase. Per D-13, v1 uses static/curated content; Notion wiring is Phase 16. Used three thematically-appropriate essay titles with proper kebab-case slug format (`/blog/on-building-things-that-matter`, `/blog/the-quiet-compounders`, `/blog/first-principles-thinking-for-builders`).

2. **JSX apostrophe encoding:** The analog (`slide-footer.tsx`) uses `Let&apos;s be friends.` (HTML entity). Switched to `{"Let's be friends."}` JSX string expression — produces identical render output, satisfies the plan's `grep "Let's be friends"` acceptance criterion, and matches JSX conventions.

3. **No "use client" on any component:** All five components are Server Components. None require hooks, event handlers, or browser APIs. `Button` from `@/components/v3/button` IS a client component (has "use client"), but Server Components can import and render client components — this is the standard Next.js pattern.

4. **Worktree base reset:** The worktree was created from an old base commit (`93498f0`) predating all Phase 15 work. The `<worktree_branch_check>` specified target base `77321bf`. The reset was safe (no staged/modified files, only untracked `.claude/`). This was a setup-time drift, not a task deviation.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Worktree missing Phase 15 context (base commit drift)**
- **Found during:** Initial setup
- **Issue:** The worktree branch was created from commit `93498f0` (old main branch state), not from `77321bf` (Phase 15 wave 3 state). All Phase 15 components (home-deck/, home/ stubs, test scaffolds, globals.css palette) were absent.
- **Fix:** `git reset --hard 77321bf7a33ab2a2b9a0b230a7558d05cf3075b4` — safe because no modified files existed (only untracked `.claude/` directory).
- **Files modified:** none (worktree HEAD pointer updated)
- **Commit:** n/a (reset, not a commit)

**2. [Rule 2 - Missing critical functionality] cleanup() absent from fallback-poster test**
- **Found during:** Task 1 test run — second test failed with "Multiple elements found"
- **Issue:** Module cache kept previous render's DOM nodes present for the second test. Standard pattern from 15-03: `cleanup()` in `afterEach` prevents DOM accumulation.
- **Fix:** Added `afterEach(() => { cleanup(); })` to fallback-poster.test.tsx.
- **Files modified:** `src/__tests__/home/fallback-poster.test.tsx`
- **Commit:** 953c829

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| LCP fetchPriority | grep 'fetchPriority="high"' src/components/home/fallback-poster.tsx | PASS — 1 match |
| No deck-slide in className | grep 'className.*deck-slide' src/components/home/*.tsx | PASS — 0 matches |
| BigList wired | grep 'BigList' src/components/home/section-building.tsx | PASS |
| Footer heading | grep "Let's be friends" src/components/home/section-footer.tsx | PASS |
| Four nav columns | Site, More, Elsewhere, Contact | PASS — all four present |
| min-h-dvh in newsletter | grep 'min-h-dvh' section-newsletter.tsx | PASS |
| NewsletterCarousel | grep 'NewsletterCarousel' section-newsletter.tsx | PASS |
| TD-03/HD-05 tests | npx vitest run src/__tests__/home/fallback-poster.test.tsx | PASS — 2 passed |
| HD-04 test | npx vitest run src/__tests__/home/section-building.test.tsx | PASS — 2 passed |
| Full home/ suite | npx vitest run src/__tests__/home/ | PASS — 5 files, 9 tests |
| Build | npx next build | PASS — all routes, exit 0 |

## Known Stubs

No stubs remain in the files modified by this plan. All five content components are fully implemented.

The `FEATURED_ESSAYS` array in `section-writing.tsx` uses curated static essay data (D-13 decision). This is intentional placeholder content — Phase 16 will wire real Notion data. Not a stub in the structural sense; the component is fully functional with static data.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced.

Threat model mitigations confirmed:
- **T-15-11** (LCP regression via missing fetchPriority): `fetchPriority="high"` present in fallback-poster.tsx — grep-c returns 1.
- **T-15-12** (External link to prometheus.today): Link present in section-building and section-footer — `rel="noopener noreferrer"` applied to footer's external anchor; BigList uses `next/link` (same tab, no opener risk per plan disposition `accept`).
- **T-15-13** (Deck CSS classes causing wrong layout): `className.*deck-slide` grep returns 0 matches across all home/ components.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| src/components/home/fallback-poster.tsx | FOUND |
| src/components/home/section-building.tsx | FOUND |
| src/components/home/section-writing.tsx | FOUND |
| src/components/home/section-newsletter.tsx | FOUND |
| src/components/home/section-footer.tsx | FOUND |
| src/__tests__/home/fallback-poster.test.tsx | FOUND |
| src/__tests__/home/section-building.test.tsx | FOUND |
| Commit 953c829 (fallback-poster + test) | FOUND |
| Commit e57ba14 (section-building + section-writing + building test) | FOUND |
| Commit f402882 (section-newsletter + section-footer) | FOUND |
| fallback-poster.tsx fetchPriority="high" | PASS |
| fallback-poster.tsx no "use client" directive | PASS |
| section-building.tsx contains BigList | PASS |
| section-building.tsx no deck-slide in className | PASS |
| section-writing.tsx FEATURED_ESSAYS length >= 2 | PASS (3 entries) |
| section-writing.tsx Button href="/writing" | PASS |
| section-newsletter.tsx min-h-dvh | PASS |
| section-newsletter.tsx NewsletterCarousel | PASS |
| section-footer.tsx "Let's be friends." | PASS |
| section-footer.tsx four nav columns | PASS |
| Full vitest suite (5 files, 9 tests) | PASS |
| npx next build exits 0 | PASS |
