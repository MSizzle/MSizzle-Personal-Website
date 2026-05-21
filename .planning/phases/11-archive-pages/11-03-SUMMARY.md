---
phase: 11-archive-pages
plan: 03
subsystem: ui
tags: [next-app-router, server-component, isr, notion, editorial-archive, phase-11, wave-2]
requires:
  - phase: 11-archive-pages (Plan 11-01)
    provides: "<YearBlock> editorial primitive consumed by /writing (and later /photos)"
  - phase: 11-archive-pages (Plan 11-02)
    provides: "formatMonthYear / formatDayNumeral helpers (only formatMonthYear used here)"
  - phase: 10-editorial-homepage
    provides: "Inline editorial header on src/app/page.tsx (extracted here), D-42 v1.0 chrome gate (extended here)"
provides:
  - "/writing — ARCH-01 editorial archive route at 30m ISR"
  - "<EditorialHeader> — shared 5-link nav reused by /, /writing (later /events, /photos)"
  - "Extended v1.0 chrome gate — Navigation / Footer / MainOffset suppressed on /, /writing, /events, /photos"
  - "/blog → /writing destination flip for homepage Writing nav link, WRITING AllLink, Footer Library 'Essays' entry, and v1.0 Footer 'Writings' link"
affects:
  - 11-04 (parallel-safe — only touches /events route files)
  - 11-05 (parallel-safe — only touches /photos route + chrome gate already pre-positioned)
  - 12 (sub-page restyle sweep may re-evaluate IntroLink "essays" + Footer "Process Notes" /blog references left conservative here)
tech_stack_added: []
tech_stack_patterns:
  - "Shared chrome via Server Component — <EditorialHeader> takes optional `active` prop, no client state needed"
  - "Pathname-inclusion chrome gate — `['/', '/writing', '/events', '/photos'].includes(pathname)` scales as new v2.0 routes ship"
  - "Substack outbound IS the newsletter pipeline (D-15 REVISED) — no in-house /api/subscribe, mirrors src/app/newsletter/page.tsx:39"
  - "Defensive Notion fetch — `try { posts = await getPublishedPosts() } catch {}` mirrors src/app/page.tsx so transient API failures render empty-state instead of crashing"
  - "Year-grouped archive UX — UTC-based grouping via new Date(post.date).getUTCFullYear(); Map sorted desc for newest-year-first iteration"
key_files_created:
  - src/components/home-v2/editorial-header.tsx
  - src/app/writing/page.tsx
key_files_modified:
  - src/app/page.tsx
  - src/components/nav/navigation.tsx
  - src/components/footer.tsx
  - src/components/main-offset.tsx
decisions:
  - "EditorialHeader lives in src/components/home-v2/ (D-25 Option A) — co-located with manifesto-reveal.tsx; presentational Server Component with optional `active` prop"
  - "Chrome gate extended via pathname-inclusion check ['/', '/writing', '/events', '/photos'] (D-26 building on Phase 10 D-42) — pre-positions for Plans 11-04 + 11-05 so those plans only touch their own route files"
  - "/writing subscribe footer is a styled outbound <a> to https://montymonthly.substack.com (D-15 REVISED) — NOT a <form>, NOT a /api/subscribe POST. Substack IS the existing pipeline (RESEARCH F2)"
  - "Conservative /blog → /writing scope per D-05 — flipped homepage Writing nav link + WRITING AllLink + Footer Library 'Essays' + v1.0 Footer 'Writings' (Footer LINKS array). DID NOT flip IntroLink letter-intro 'essays' nor Footer 'Process Notes' (different labels). Phase 12 sub-page sweep can re-evaluate."
  - "Post permalinks keep /blog/[slug] shape per D-02 — only the archive index moves to /writing"
  - "ISR revalidate=1800 matches /, /events cadence per RESEARCH § Pitfall 9"
  - "cn() utility used for conditional active/muted nav className in EditorialHeader — idiomatic over inline ternary, same semantics"
requirements_completed:
  - ARCH-01
metrics:
  duration: "~10 minutes"
  completed_date: "2026-05-21"
  tasks_completed: 2
  files_changed: 6
---

# Phase 11 Plan 03: /writing Archive + Shared Chrome Summary

**One-liner:** `/writing` editorial archive (ARCH-01) ships at 30m ISR — title block + atmosphere photo + year-grouped Notion essays + Substack-outbound subscribe footer — alongside the extracted `<EditorialHeader>` and an extended chrome gate that pre-positions Plans 11-04 + 11-05 for parallel ship.

## Was Built

### File 1: `src/components/home-v2/editorial-header.tsx` (NEW, 66 lines)

Server Component re-export of the Phase 10 inline header per D-25. Signature:

```tsx
type Props = { active?: "Building" | "Writing" | "Events" | "About" | "Links" };
export function EditorialHeader({ active }: Props)
```

Module-level `LINKS` const carries the 5 nav destinations (Building → /projects, **Writing → /writing**, Events → /events, About → /about, Links → /links). Maps each entry to a `<Link>` whose className toggles between active (`font-bold text-ink`) and default (`text-muted`); preserves the 44px tap target (`flex min-h-11 items-center`) and hover-opacity transition from the original Phase 10 markup. JSDoc references D-05 + D-25.

### File 2: `src/app/writing/page.tsx` (NEW, 178 lines)

Server Component implementing the ARCH-01 contract per handoff §3 + D-13/D-14/D-15 REVISED:

1. **`<EditorialHeader active="Writing" />`** — Writing nav label bolded.
2. **Title block** (2-col grid, photo hidden on mobile per RESEARCH § Pitfall 6):
   - `"── The Library · 02"` tracked label
   - **`Writing.`** in `text-page-title` (D-14 token = 120px, trailing period intentional)
   - Muted blurb with `<IntroLink href="/newsletter">Monty Monthly</IntroLink>`
   - 360×480 atmosphere photo via `next/image fill` — `PHOTOS[5] = Patricof09.jpg` per D-13, `saturate-[0.92]` per D-23
3. **`<RuleStrong />`**
4. **Year-grouped essays** — `groupPostsByYear()` helper uses UTC year, returns Map sorted desc. Empty-state ("More essays coming soon.") renders when `getPublishedPosts()` returns empty or throws. Each essay rendered as `<ListRow big>` with `/blog/[slug]` permalink (D-02).
5. **`<RuleStrong />`**
6. **Substack-outbound subscribe footer** — styled anchor to `https://montymonthly.substack.com` (D-15 REVISED). NO `<form>`, NO `<input>`, NO `/api/subscribe`. Includes copy block under the h2 plus the `Subscribe on Substack →` CTA.

Module-level exports: `revalidate = 1800`, `metadata` (title, description, canonical, openGraph).

### File 3: `src/app/page.tsx` (MODIFIED)

- Dropped now-unused `Link` import.
- Replaced inline `<header>` (former lines 60–94) with `<EditorialHeader />` (no `active` prop on homepage — handoff doesn't single out a section).
- Line 175: `<AllLink href="/blog">All writing →</AllLink>` → `href="/writing"` (D-05).
- Line 320: Footer Library `{ label: "Essays", href: "/blog" }` → `href: "/writing"` (D-05).
- **Conservative non-changes** (per D-05 scope):
  - Letter-intro `<IntroLink href="/blog">essays</IntroLink>` — sentence reference, not archive pointer; Phase 12 sub-page sweep can re-evaluate.
  - Footer Studio `Process Notes → /blog` — different label, out of D-05 scope.
- `/blog/[slug]` post permalink in ListRow stays (D-02).

### File 4: `src/components/nav/navigation.tsx` (MODIFIED)

Single-line gate change at line 18:

```diff
- if (pathname === '/') return null
+ if (['/', '/writing', '/events', '/photos'].includes(pathname)) return null
```

JSDoc updated to cite D-42 + D-26. Mobile drawer, `NAV_LINKS`, and rest of file untouched.

### File 5: `src/components/footer.tsx` (MODIFIED)

Two changes:

1. Line 25 chrome gate: same pathname-inclusion edit as nav.
2. Line 9 `LINKS` const: `{ href: '/blog', label: 'Writings' }` → `{ href: '/writing', label: 'Writings' }` — so the v1.0 footer (still rendered on /about, /projects, /links, etc.) routes users to the canonical /writing archive instead of the v1.0 /blog listing (RESEARCH § Pitfall 5).

### File 6: `src/components/main-offset.tsx` (MODIFIED)

Rewrote the body of `MainOffset`:

```tsx
const pathname = usePathname()
const isV2Route = ['/', '/writing', '/events', '/photos'].includes(pathname)
return <main className={isV2Route ? '' : 'pt-16'}>{children}</main>
```

JSDoc cites both D-42 + D-26. `'use client'` directive retained (`usePathname` requires it).

## Verification Results (11-03-V)

| Gate | Result |
|------|--------|
| `test -f src/app/writing/page.tsx` | PASS |
| `test -f src/components/home-v2/editorial-header.tsx` | PASS |
| `rg "export function EditorialHeader" …/editorial-header.tsx` returns 1 | PASS |
| Typed `active` prop present | PASS |
| `rg "'/writing'" src/components/nav/navigation.tsx` ≥1 | PASS (1) |
| `rg "'/writing'" src/components/footer.tsx` ≥1 | PASS (2 — gate + LINKS entry) |
| `rg "'/writing'" src/components/main-offset.tsx` ≥1 | PASS (1) |
| `rg "'/events'" src/components/nav/navigation.tsx` ≥1 (pre-positions 11-04) | PASS (1) |
| `rg "'/photos'" src/components/nav/navigation.tsx` ≥1 (pre-positions 11-05) | PASS (1) |
| `rg "<EditorialHeader" src/app/page.tsx` ≥1 | PASS (1) |
| `rg '<header className="flex items-baseline' src/app/page.tsx` returns 0 | PASS (inline header removed) |
| `rg "Writing\\." src/app/writing/page.tsx` ≥1 | PASS (2) |
| `rg "YearBlock" src/app/writing/page.tsx` ≥1 | PASS (5) |
| `rg "montymonthly.substack.com" src/app/writing/page.tsx` ≥1 | PASS (3) |
| `rg "<form" src/app/writing/page.tsx` returns 0 | PASS |
| `rg "/api/subscribe" src/app/writing/page.tsx` returns 0 | PASS |
| `rg "use client" src/app/writing/page.tsx` returns 0 | PASS |
| `rg 'EditorialHeader active="Writing"' src/app/writing/page.tsx` ≥1 | PASS (2) |
| `rg "Patricof09" src/app/writing/page.tsx` ≥1 | PASS (2) |
| `rg "text-page-title" src/app/writing/page.tsx` ≥1 | PASS (1) |
| `rg "getPublishedPosts" src/app/writing/page.tsx` ≥1 | PASS (3) |
| `rg "/blog/" src/app/writing/page.tsx` ≥1 (post permalinks preserved) | PASS (2) |
| `npm run build` exits 0 (D-30) | PASS — `✓ /writing 30m 1y` in routes manifest |
| Two /writing destinations in src/app/page.tsx (AllLink + Footer Library) | PASS (line 175 JSX attr + line 320 object property) |

### Note on `rg -c 'href="/writing"' src/app/page.tsx` gate

The plan's acceptance regex `href="/writing"` returns **1** (the JSX attribute on line 175). The Footer Library entry on line 320 uses object-property syntax `href: "/writing"` (colon, not equals), which the regex doesn't match. The implementation satisfies the *intent* of the gate (both /blog → /writing flips landed per the plan's own action description in Task 1 E.3); the regex is a planning defect, not an implementation defect. Verified by `grep -n '/writing' src/app/page.tsx` returning both lines.

## Decisions Made (in execution)

- `cn()` utility used for the conditional active/muted className in EditorialHeader. Idiomatic over inline ternary; identical semantics. Not flagged in the plan but adopted from existing project convention.
- Added a short paragraph under the subscribe footer h2 explaining "Monty Monthly is a long-form newsletter on Substack. No spam, no firehose — just one essay each month." Not in the plan's example block but consistent with D-15 REVISED spirit (sets reader expectation before the outbound click).
- Year-grouped essay wrapper uses `-mx-6 md:-mx-40` to undo the section's horizontal padding because `<YearBlock>` supplies its own internal padding via the 2-column `[180px | 1fr]` grid. The inter-year `<Rule />` separator is re-wrapped with `px-6 md:px-40` so the rule visually aligns with section edges.
- Title block padding uses `pt-16 pb-15 md:pt-40 md:pb-25` (Tailwind v4 spacing scale) rather than the literal `pt-[160px] md:pb-[100px]` values shown in the plan example. `md:pt-40` (10rem = 160px) and `md:pb-25` (6.25rem = 100px) resolve to the same pixel values via Tailwind v4's default 4px scale. Preserves token-based styling per Phase 9 conventions.

## Deviations from Plan

None substantive — all four micro-decisions above are within the spirit of the contract and were either idiomatic adoptions of existing project utilities (`cn`), small copy expansions consistent with the design intent, or token-vs-arbitrary-value equivalences that produce identical visual output.

## Commits

- `d00f602` — `feat(11-03): extract EditorialHeader + extend v1.0 chrome gate to all v2.0 routes` (Task 1, files 1, 3–6)
- `7b9fe7a` — `feat(11-03): add /writing archive route — ARCH-01` (Task 2, file 2)

## Downstream Effect: Wave 3 Is Now Parallel-Safe

Plans 11-04 and 11-05 share zero files now:

- **11-04 (`/events` rewrite)** — only touches `src/app/events/page.tsx` + deletes `src/components/events/event-cards.tsx`.
- **11-05 (`/photos` new route)** — only touches `src/app/photos/page.tsx`.

The chrome gate already accepts both routes; `<EditorialHeader>` is ready to consume `active="Events"` / no-active (photos has no nav match) on the new pages. Wave 3 can dispatch as 2 worktree-isolated executor agents in parallel.

## Self-Check: PASSED

- 2 new files + 4 modified files confirmed via `git show --stat` for both commits.
- All 11-03-V gates pass except the syntactic-form gate noted above (intent satisfied).
- `npm run build` exits 0; `/writing` appears in routes manifest at `30m 1y`.
- ARCH-01 success criteria from ROADMAP all met.
