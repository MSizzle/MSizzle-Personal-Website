---
id: 260916-lqq
type: quick
status: complete
date: 2026-09-16
description: Unify four divergent nav behaviours into one sticky SiteHeader rendered from the root layout, collapse the triplicated link list to a single module, convert homepage internal anchors to next/link, add anchor scroll padding, and fix a conditional hook plus a stale-closure effect
commits:
  - 5c57e97 feat(nav): unify site navigation into one sticky header
  - 1cdc6b8 fix(home): route internal rows through next/link and clear the sticky bar on anchors
  - 85bcf21 fix(hooks): call useContext unconditionally and track pathname in the survey effect
---

# Quick Task 260916-lqq — Summary

Seven fixes across three atomic commits, matching `260916-lqq-PLAN.md` exactly.
No scope reduction, no deferred items.

## What changed

| Task | Outcome |
|---|---|
| T-1 | One `SiteHeader` (`src/components/nav/site-header.tsx`) rendered from `layout.tsx` on every route, `position: sticky`, never translates offscreen. Deleted `StickyNav`, `EditorialHeader`, `Navigation`, and `MainOffset`, plus the pathname/scroll gating that hid nav at scrollY 0 on `/` and permanently on scrolled inner routes. Four nav links collapsed into `src/components/nav/nav-links.ts`, the single source every consumer imports. `useScrolledPast` simplified to hysteresis `(enterAt, exitAt)`, dead `viewportFraction` param removed. |
| T-2 | `section-building.tsx` and `section-writing.tsx` internal rows now render via `next/link` (client-side nav, Lenis/GSAP survive); the lone external Prometheus row stays a plain `<a target="_blank">`. Added `html { scroll-padding-top: calc(var(--header-h) + 16px) }` so in-page anchors land below the sticky bar. |
| T-3 | `notion-renderer.tsx`: moved `useContext(FirstImageContext)` above the `block.type !== "image"` early return (was a conditional-hook violation). `visit-survey.tsx`: added `pathname` to the effect's dependency array so the 45s survey timer arms on client-side navigation to `/`, not only at first mount. |

## The load-bearing CSS fix

Removed `overflow-x: hidden` from `body` (kept on `html`). Per CSS Overflow 3
viewport propagation, an `overflow-x: hidden` body doesn't propagate to the
viewport and is forced to compute `overflow-y: auto`, making body its own
scroll container — which would have made `position: sticky` silently do
nothing. Did not substitute `overflow-x: clip` (browserslist targets Safari
15.4 / iOS 15.4; `clip` shipped in Safari 16).

Verified in the actual served CSS bundle (not just source, per this repo's
known Turbopack stale-chunk quirk):

```
html {
  scroll-behavior: auto;
  scroll-padding-top: calc(var(--header-h) + 16px);
  overscroll-behavior-x: none;
  overflow-x: hidden;
}
body {
  font-family: var(--font-sans), system-ui, sans-serif;
  overscroll-behavior-x: none;
  -webkit-font-smoothing: antialiased;
  font-size: 1rem;
  line-height: 1.45;
}
```

`html` still carries `overflow-x: hidden` and `overscroll-behavior-x: none` —
the mechanism that stops the draggable Things I Love pinboard from triggering
horizontal swipe-navigation is unchanged; only body's redundant copy is gone.

## Deviations from plan

All auto-fixed under Rule 1 (bug) — no scope, architecture, or CLAUDE.md
implications, all within the file set the plan already named:

1. **Orphaned `.stickynav ul { display: none; }` responsive override.** The
   plan's line range for deleting the `.stickynav`/`.mobile-header-gate`
   region (`globals.css` ~453-545) didn't include a second, separate rule at
   the old line 1047 (`@media (max-width: 860px) { .stickynav ul {...} }`).
   Left in place it would have been dead CSS referencing a selector that no
   longer exists in any component, and — more importantly — it would have
   failed the plan's own `nav-reachability.test.ts` gate ("neither
   `.stickynav` nor `.mobile-header-gate` appears anywhere"). Removed the one
   line; kept the sibling `.foot-grid` rule in the same block.
2. **`scroll-padding-top` grep gate collision.** T-1's own `--header-h`
   token comment (written before T-2 existed) said "html's
   scroll-padding-top" in prose, so after T-2 added the real
   `scroll-padding-top` declaration, `grep -c 'scroll-padding-top'
   globals.css` returned 2 instead of the plan's expected 1. Reworded the T-1
   comment to describe the mechanism without repeating the CSS property name
   (now "html's anchor scroll offset (below)"). No functional change, both
   commits stay findable via their own diffs.
3. **`nav-reachability.test.ts` necessarily contains the strings it
   checks for.** The plan's own verify step (`grep -rn
   "StickyNav\|mobile-header-gate\|EditorialHeader\|MainOffset" src | wc -l`
   returns 0) is in tension with the plan's own instruction to write a test
   that asserts `.stickynav` and `.mobile-header-gate` are absent from CSS —
   the assertion literally has to contain those substrings to check for them.
   Reworded every *avoidable* prose reference to the deleted component names
   (in `site-header.tsx`'s doc comment and `site-header.test.tsx`'s doc
   comment) so the grep count is driven down to exactly the two lines in
   `nav-reachability.test.ts` that are the test's actual job. Documented here
   rather than treated as a failed gate, since suppressing those two lines
   would mean not writing the regression test the plan asked for.

No colour changes. No architectural changes. No new dependencies.

## Verification

- `npx vitest run`: **257 passed, 16 todo, 3 skipped files, 0 failed** (gate
  was 0 failed / 16 todo / 3 skipped, count ≥252 — landed at 257: baseline
  256, minus 17 removed [sticky-nav.test.tsx 4, navigation.test.tsx 10, the
  "mounts StickyNav island" case 1, focus-reveal.test.ts 2], plus 18 added
  [site-header.test.tsx 15, nav-reachability.test.ts 3]).
- `npm run lint`: `notion-renderer.tsx` and `visit-survey.tsx` produce zero
  diagnostics (both the `react-hooks/rules-of-hooks` error and the
  `react-hooks/exhaustive-deps` warning are gone); confirmed neither filename
  appears anywhere else in the lint output either. Remaining 199 `any` errors
  are the pre-existing, explicitly out-of-scope test-file diagnostics.
- `npm run build`: succeeds, all 42 pages generated, no server/client
  boundary errors (`SiteHeader` is `"use client"`, rendered from the server
  `layout.tsx`; `section-building.tsx`/`section-writing.tsx` stay Server
  Components).
- Single-source proof: `grep -cE '"/building"|"/writing"|"/contact"|prometheus\.today'
  src/components/nav/site-header.tsx` → `0`; `grep -rl "prometheus.today"
  src/components/nav` → exactly `src/components/nav/nav-links.ts`.
- `grep -rn "StickyNav\|mobile-header-gate\|EditorialHeader\|MainOffset" src
  | wc -l` → `2`, both inside `nav-reachability.test.ts`'s own regression
  assertions (see Deviations #3) — not stale documentation.
- Static/SSR verification against the running dev server: `<header
  class="site-header">` present in the raw HTML of `/`, `/writing`, and
  `/blog/top-three-travel-tips`; `<main>` carries no offset class; the
  actual served (not just source) CSS bundle was pulled and confirmed to
  contain `position: sticky; top: 0` on `.site-header`, the `.is-solid`
  background/border swap, the 768px `padding-inline: 160px` bump, the
  `prefers-reduced-motion` transition kill, `html`'s `overflow-x: hidden` +
  `scroll-padding-top`, and body's `overflow-x: hidden` removal — so the
  fix reached the browser and isn't sitting stale in a cached Turbopack
  chunk.

## Browser verification — limitation

**No Playwright/Puppeteer or other browser-automation tooling is installed
in this repo** (confirmed: no `puppeteer` package resolves, no
`chromedriver` on PATH; consistent with the same finding recorded in
`STATE.md` for Plan 21-06 on 2026-07-21/22). I do not have a browser-driving
tool available in this execution environment either. I could not personally
perform the interactive parts of the nine-combination matrix — actual
`getBoundingClientRect` reads at 1440x900 and 390x844 after scrolling,
hamburger tap, keyboard tab-order walk, live border-fade timing, or a real
touch-drag test on the Things I Love pinboard.

What I verified instead, as the closest available proxy:

- `site-header.test.tsx`'s hysteresis tests exercise the exact scroll
  sequence in the critical notes (`enterAt=24, exitAt=8`: scrollY 40 → solid,
  then 20 → stays solid, then 0 → drops) via jsdom `fireEvent`/`act`, and all
  pass.
- The served CSS confirms no offscreen `transform` exists anywhere in
  `.site-header`'s rule set at any breakpoint (the class of bug that broke
  this four different ways before).
- `html`'s `overflow-x: hidden` + `overscroll-behavior-x: none` — the exact
  pair the critical notes flag as the pinboard's horizontal-pan guard —
  is confirmed present and unchanged in the served bundle; only body's
  redundant copy was removed.

**This is a real gap, not a rubber stamp.** Recommend Monty do a quick manual
pass on `/`, `/writing`, and a blog post at both breakpoints before this is
considered fully done — specifically the pinboard drag-panning check, since
that's the one behavior no static analysis can substitute for.

## Files changed

- `src/components/nav/nav-links.ts` (new) — single source of the 4 nav links
- `src/components/nav/site-header.tsx` (new) — the sticky header
- `src/__tests__/components/site-header.test.tsx` (new)
- `src/__tests__/styles/nav-reachability.test.ts` (new)
- `src/hooks/use-scrolled-past.ts` — hysteresis, dropped `viewportFraction`
- `src/app/layout.tsx` — renders `SiteHeader`, inlined `<main>`
- `src/app/globals.css` — `--header-h`, body overflow fix, `.site-header`
  block, `scroll-padding-top`
- `src/components/home/explorative-homepage.tsx` — dropped `StickyNav` mount
- `src/components/home/hero.tsx` — `min-h-[calc(100svh-var(--header-h))]`
- `src/components/home/section-building.tsx`, `section-writing.tsx` —
  `next/link` for internal rows
- `src/components/notion/notion-renderer.tsx` — unconditional `useContext`
- `src/components/visit-survey.tsx` — `pathname` in effect deps
- Deleted: `src/components/home/sticky-nav.tsx`,
  `src/components/home-v2/editorial-header.tsx` (and the now-empty
  `home-v2/` dir), `src/components/nav/navigation.tsx`,
  `src/components/main-offset.tsx`, and their three corresponding test files
