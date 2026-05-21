---
phase: 07-seo-overhaul
plan: 02
subsystem: shared-seo-helpers
tags: [seo, notion, rss, content-helpers, wave-1]
one_liner: "Shared content helpers (notion-text excerpt extractor, Substack RSS fetcher, RELATED_ESSAYS map) that unblock Plans 07-06 and 07-08"
depends_on: []

requires:
  - "@notionhq/client types (BlockObjectResponse)"
  - "rss-parser@^3.13.0 (newly added runtime dep)"
provides:
  - "@/utils/notion-text exports extractTextFromBlock + extractExcerpt"
  - "@/lib/rss/substack exports fetchMontyMonthlyIssues, SUBSTACK_FEED_URL, MontyMonthlyIssue type"
  - "@/data/related-essays exports RELATED_ESSAYS (15-slug map)"
affects:
  - "src/utils/reading-time.ts (now imports extractTextFromBlock from ./notion-text)"
  - "Plan 07-06 (newsletter carousel will consume fetchMontyMonthlyIssues)"
  - "Plan 07-08 (blog index excerpt + related-essays block will consume extractExcerpt and RELATED_ESSAYS)"

tech_stack:
  added:
    - rss-parser@^3.13.0
  patterns:
    - "Extractor helper module (notion-text.ts) as single source of truth for plain-text extraction from Notion blocks"
    - "Fail-closed RSS fetcher — any parser/network error returns [] so downstream render a fallback CTA instead of breaking the build"
    - "Static slug map for manual topic groupings (no Notion tagging dependency)"

key_files:
  created:
    - src/utils/notion-text.ts
    - src/lib/rss/substack.ts
    - src/data/related-essays.ts
    - src/__tests__/seo/excerpt.test.ts
    - src/__tests__/seo/rss-parser.test.ts
  modified:
    - src/utils/reading-time.ts
    - package.json
    - package-lock.json

decisions:
  - "D-25: RSS fetched server-side via rss-parser (not client-side). Feed URL constant exported for reuse."
  - "D-26: fetchMontyMonthlyIssues(limit=10) caps items at 10; caller (Plan 06) can slice further."
  - "D-27: Parser failure returns [] (empty array) instead of throwing — Plan 06 renders subscribe CTA fallback."
  - "D-40: extractExcerpt truncates on word boundary, appends '…' only when body exceeded maxChars."
  - "D-41: Slugs in RELATED_ESSAYS use kebab-case fallback from D-41 titles; Plan 08 will add a resolver to handle drift vs live Notion slugs."

metrics:
  duration_seconds: 344
  completed: "2026-04-15"
  tasks_completed: 3
  files_created: 5
  files_modified: 3
  tests_added: 6
  tests_passing: 6
---

# Phase 7 Plan 02: Shared Content Helpers Summary

Ship the shared content helpers that Plans 07-06 (newsletter carousel) and 07-08 (blog index excerpts + related-essays block) depend on, in one wave-1 foundation plan. Three helpers landed: (1) a `notion-text.ts` module that promotes the private `extractTextFromBlock` out of `reading-time.ts` and adds an `extractExcerpt` helper with word-boundary truncation and ellipsis; (2) an `rss-parser`-based Substack fetcher at `src/lib/rss/substack.ts` with a graceful empty-array fallback per D-27; (3) a static `RELATED_ESSAYS` map keyed by the 15 essay slugs grouped per D-41.

## Tasks Completed

| # | Task | Files | Commit |
|---|------|-------|--------|
| 1 | Extract notion-text.ts + excerpt helper (TDD) | src/utils/notion-text.ts, src/utils/reading-time.ts, src/__tests__/seo/excerpt.test.ts | `0547bf6` (RED), `de55b29` (GREEN) |
| 2 | Install rss-parser + Substack fetcher (TDD) | package.json, package-lock.json, src/lib/rss/substack.ts, src/__tests__/seo/rss-parser.test.ts | `f005827` |
| 3 | Build RELATED_ESSAYS map | src/data/related-essays.ts | `fad32a2` |

## Decisions Made

- **RSS parser choice:** Stayed with `rss-parser@^3.13.0` as recommended in the plan. Mature, TypeScript-friendly, supports `customFields` for `media:thumbnail` / `enclosure` / `content:encoded` extraction.
- **Thumbnail extraction order:** `enclosure.url` → `media:thumbnail[url]` → first `<img>` in `content:encoded`. Returns `null` when none match so the carousel component can render a placeholder.
- **Error handling posture:** Single top-level try/catch inside `fetchMontyMonthlyIssues`; any thrown error collapses to `[]` so the build never fails because of an upstream Substack outage.
- **Slug format for RELATED_ESSAYS:** Kebab-case fallback from D-41 titles. A drift-tolerant resolver will be added in Plan 07-08 so missing slugs degrade to "fewer items" rather than throwing.

## Verification Results

- `npx vitest run src/__tests__/seo/` → **6/6 passing** (3 excerpt tests, 3 rss-parser tests).
- `npm ls rss-parser` → `rss-parser@3.13.0` installed.
- `npx tsc --noEmit` against plan files → no type errors introduced (pre-existing failures in `project-card.test.tsx` are out of scope).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Self-contradictory excerpt test assertion**
- **Found during:** Task 1 GREEN verification
- **Issue:** Plan's test `expect(out).not.toMatch(/\S$/)` checks output does not end on a non-whitespace char, but `expect(out.endsWith('…'))` expects it to end on `…` — which IS non-whitespace. Assertion was unreachable.
- **Fix:** Replaced the assertion with a substantive word-boundary check: slice off the trailing `…` and assert the body matches `^(?:word)(?: word)*$`. This proves no partial-word end while being internally consistent.
- **Files modified:** `src/__tests__/seo/excerpt.test.ts`
- **Commit:** `de55b29`

**2. [Rule 1 - Bug] vitest 4.x rejects arrow-fn mockImplementation for constructors**
- **Found during:** Task 2 GREEN verification
- **Issue:** Plan's `Parser.mockImplementation(() => ({ parseURL: ... }))` uses an arrow function. vitest 4 emits `The vi.fn() mock did not use 'function' or 'class' in its implementation` and `new Parser()` returned an empty object, making the fetcher see zero items and return `[]` via the catch path.
- **Fix:** Rewrote all three `mockImplementation` calls as `function () { return { parseURL: ... } }` so `new Parser()` correctly returns the mocked instance.
- **Files modified:** `src/__tests__/seo/rss-parser.test.ts`
- **Commit:** `f005827`

### Worktree Reset Incident (recovered)

At start, I followed the literal worktree_branch_check script which called `git reset --soft 3b2941d` because `merge-base HEAD 3b2941d != 3b2941d`. The worktree HEAD was `962aeb8` on a different branch lineage entirely (phase 05 OG work), not an ancestor relationship to `3b2941d`. The soft reset caused an unintended commit `ae7864d` that wiped phase 07-01 files and planning docs from this worktree's lineage. Recovered via `git reset --hard 962aeb8` and proceeded cleanly. All 4 commits below are clean.

## Commits

| Commit | Type | Summary |
|--------|------|---------|
| `0547bf6` | test | Failing excerpt tests (RED) |
| `de55b29` | feat | Promote extractTextFromBlock + add extractExcerpt (GREEN, Rule 1 fix) |
| `f005827` | feat | Substack RSS fetcher + install rss-parser@^3.13.0 (Rule 1 fix) |
| `fad32a2` | feat | RELATED_ESSAYS 15-slug map per D-41 |

## Threat Model Verification

- **T-07-02-1 Supply Chain:** `rss-parser@3.13.0` pinned via caret range; `package-lock.json` committed with integrity hashes. npm reports 2 high-severity vulnerabilities in the broader tree (pre-existing, not introduced by this install per npm audit output) — orchestrator may wish to run `npm audit` at phase close.
- **T-07-02-2 External Data Trust:** Fetcher only returns typed `MontyMonthlyIssue` objects; no raw HTML leaks. Consumer (Plan 06) is expected to render `title` as text node and `thumbnail` via `<Image>` with allowlist. Flagged for Plan 06 verification.
- **T-07-02-3 Network/Timeout:** Verified by `rss-parser.test.ts` — third test asserts `fetchMontyMonthlyIssues()` returns `[]` when the mocked parser throws.

## Known Stubs

None. All deliverables are wired; no placeholder empty arrays flow to UI from this plan.

## Self-Check: PASSED

**Files exist:**
- FOUND: src/utils/notion-text.ts
- FOUND: src/lib/rss/substack.ts
- FOUND: src/data/related-essays.ts
- FOUND: src/__tests__/seo/excerpt.test.ts
- FOUND: src/__tests__/seo/rss-parser.test.ts
- FOUND: src/utils/reading-time.ts (modified)

**Commits exist:**
- FOUND: 0547bf6 (test RED)
- FOUND: de55b29 (feat notion-text + excerpt)
- FOUND: f005827 (feat Substack fetcher)
- FOUND: fad32a2 (feat RELATED_ESSAYS)

**Tests:** 6/6 passing (2 test files).
