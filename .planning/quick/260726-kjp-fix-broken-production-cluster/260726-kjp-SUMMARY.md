---
phase: quick-260726-kjp
plan: 01
subsystem: seo, homepage-pinboard, nav-accessibility
tags: [og-images, mono-palette, accessibility, redirects, robots]
dependency-graph:
  requires: []
  provides:
    - src/lib/seo/og-shared.tsx (OgCard, OG_INK, OG_PAPER, OG_SIZE, OG_CONTENT_TYPE, ogFonts, truncateOg)
    - src/app/writing/opengraph-image.tsx
    - src/app/building/opengraph-image.tsx
    - src/app/prometheus/opengraph-image.tsx
    - src/app/contact/opengraph-image.tsx
  affects:
    - src/lib/seo/project-metadata.ts
    - src/app/opengraph-image.tsx
    - src/app/blog/[slug]/opengraph-image.tsx
    - src/app/building/[slug]/opengraph-image.tsx
    - src/components/home/pinboard.tsx
    - src/app/globals.css
    - next.config.ts
    - src/app/robots.ts
tech-stack:
  added: []
  patterns:
    - "Shared OG layout module (og-shared.tsx) reused across 6 of 7 route generators, fonts read once at module scope"
    - ":focus-within reveal paired with scroll-triggered .show class for keyboard-accessible scroll-gated nav bars"
key-files:
  created:
    - src/lib/seo/og-shared.tsx
    - src/app/writing/opengraph-image.tsx
    - src/app/building/opengraph-image.tsx
    - src/app/prometheus/opengraph-image.tsx
    - src/app/contact/opengraph-image.tsx
    - src/__tests__/seo/project-metadata.test.ts
    - src/__tests__/styles/focus-reveal.test.ts
    - src/__tests__/seo/redirects.test.ts
  modified:
    - src/lib/seo/project-metadata.ts
    - src/app/opengraph-image.tsx
    - src/app/blog/[slug]/opengraph-image.tsx
    - src/app/building/[slug]/opengraph-image.tsx
    - src/components/home/pinboard.tsx
    - src/app/globals.css
    - next.config.ts
    - src/app/robots.ts
    - src/__tests__/pages/og-image.test.tsx
    - src/__tests__/home/pinboard.test.tsx
    - src/__tests__/seo/robots.test.ts
decisions:
  - "Followed the plan's exact instruction to delete project-metadata.ts's openGraph.images spread entirely rather than fixing expiry, mirroring the already-correct buildBlogPostMetadata pattern"
  - "Playwright MCP browser tools were not exposed in this execution session despite being listed as available in the task context; substituted a rigorous non-browser verification chain (live curl on the running dev server, served-CSS-chunk grep, served-HTML DOM grep, and manual WCAG contrast-ratio computation from the actual served CSS custom-property values) documented below"
metrics:
  duration: "~55 minutes"
  completed: "2026-07-26"
---

# Phase quick-260726-kjp Plan 01: Fix Broken Production Cluster Summary

Fixed six confirmed-live production defects (broken/missing OG images, vermilion palette
survivors, invisible pinboard titles, a keyboard focus trap on the sticky/mobile nav, and a
dead `/watching` redirect plus stale `robots.ts` rule) across four independently committed
tasks, closing STATE.md's explicitly scheduled Phase 23 OG-mono survivor list early.

## What Was Built

**Task 1 — OG generator foundation (commit `9f1a30b`):**
- `src/lib/seo/project-metadata.ts`: deleted the `...(project.image ? { images: [{ url: project.image }] } : {})` spread from `buildProjectMetadata()`'s `openGraph` object. This was overriding the file-convention `building/[slug]/opengraph-image.tsx` generator with a presigned `amazonaws.com` URL that expires in an hour. The function now mirrors `buildBlogPostMetadata()`'s already-correct pattern.
- New `src/lib/seo/og-shared.tsx`: exports `OG_INK` (`#000000`), `OG_PAPER` (`#ffffff`), `OG_SIZE`, `OG_CONTENT_TYPE`, `truncateOg()`, `ogFonts()` (reads both woff files once at module scope), and the `OgCard` layout component now reused by 6 of the 7 route generators.
- Rewrote the three existing generators (root, `blog/[slug]`, `building/[slug]`) to import from `og-shared` instead of hardcoding `#e5411f` / `#faf9f7` / `#171717` — all now pure mono.

**Task 2 — four new OG routes (commit `bd6b6a2`):**
- `/writing`, `/building`, `/prometheus`, `/contact` previously emitted zero `og:image`. Each new segment-level `opengraph-image.tsx` builds on `OgCard`/`og-shared`, reusing the page's existing static title/description copy verbatim. Prometheus's 152-char description is truncated to 140 via `truncateOg`.

**Task 3 — pinboard caption bar (commit `69572d0`):**
- `src/components/home/pinboard.tsx`: wrapped the Book/Movie branch's title/author spans in a new `<span className="pb-book-caption">`.
- `globals.css`: `.pb-book-caption` now carries the absolute positioning and a solid `background: var(--color-invert)` (pure black) backing bar; `.pb-book-title`/`.pb-book-author` became pure typography rules layered on top. Fixes 8 of 24 cards (The Prestige, 12 Rules for Life, $100M Offers, How to Get Filthy Rich in Rising Asia, Facebook Book, Fight Club, Midnight in Paris, The Fish That Ate The Whale) whose white text previously floated directly over light poster art with no backing.

**Task 4 — keyboard focus, redirect, robots (commit `a213595`):**
- `.stickynav.show` and `.mobile-header-gate.show` selectors extended to `.stickynav.show, .stickynav:focus-within` / `.mobile-header-gate.show, .mobile-header-gate:focus-within`, so keyboard-tabbing users reveal the bar before any scroll event fires (WCAG 2.4.7).
- `next.config.ts`: `/watching` now redirects to `/#loves` instead of the deleted `/uses` route.
- `src/app/robots.ts`: `disallow` list no longer includes `/specimen` (a route that does not exist).

## Deviations from Plan

### Auto-fixed Issues

None — all four tasks matched the plan's `<action>` blocks exactly; no Rule 1/2/3 fixes were needed.

### Tooling Limitation (documented, not a code defect)

**Playwright MCP browser tools were not available in this execution session.** The task
context stated `mcp__playwright__*` tools were available (load via ToolSearch if needed), but
attempting to invoke one (`mcp__playwright__browser_navigate`) returned `Error: No such tool
available`, and no `ToolSearch` tool was present in this session's tool schema either. This
blocked the two browser-only verification items in the plan's `<verification>` section (item 7,
pinboard contrast; item 8, keyboard focus reveal) from being performed exactly as specified
(via `browser_evaluate` + `getComputedStyle`).

**Substitute verification performed instead**, against the live `npm run dev` server already
running on localhost:3000, without starting a second server:

1. Fetched `/_next/static/chunks/[root-of-the-server]__0s0yfd5._.css` (the actual served CSS
   chunk — ruling out the documented Turbopack stale-chunk trap) and confirmed by direct
   `grep`/Python string search that it contains the exact new rules: `.stickynav.show,
   .stickynav:focus-within {...}`, `.mobile-header-gate.show, .mobile-header-gate:focus-within
   {...}`, and `.pb-book-caption { background: var(--color-invert); ... position: absolute; ...
   }` — byte-identical to the source edits, confirming no stale chunk.
2. Fetched `/` (raw SSR HTML) and confirmed by DOM string search: the `.stickynav` element
   contains real `<a class="nav-cell">` links (Prometheus, Building, Writing, Contact); the
   mobile `<header>` carries the `mobile-header-gate` class and contains a focusable hamburger
   `<button>`; and one of the 8 previously-broken cards ("The Prestige") now renders
   `<span class="pb-book-caption"><span class="pb-book-title">The Prestige</span><span
   class="pb-book-author">Christopher Nolan, 2006</span></span>` — confirming the markup change
   reached the live page.
3. Fetched the served `--color-invert`, `--color-text-inverse`, `--color-text-inverse-dim`
   custom-property values (`#000`, `#fff`, `#ffffffa8`) and computed WCAG contrast ratios by
   hand from those exact values: white title text on the black caption bar is 21:1 (the
   maximum possible); the `#ffffffa8` (alpha ≈0.66) author text composited over the opaque
   black bar resolves to an effective luminance of ≈0.39, giving a contrast ratio of ≈8.8:1 —
   both comfortably clear the 4.5:1 WCAG AA threshold, and because the caption bar's background
   is a fixed opaque color rather than the poster art, this ratio is identical for all 24
   cards regardless of the underlying image (the entire point of the fix).
4. Because `:focus-within` is a standard, unconditional CSS pseudo-class and the confirmed live
   markup shows both bars contain real focusable descendants (anchor links / a button), the
   rule's functional behavior (revealing the bar the instant any descendant receives keyboard
   focus, with no scroll listener involved) is deterministic from the confirmed CSS + DOM,
   though it was not walked with an actual Tab key press in a real browser viewport.

This is disclosed as a tooling-availability gap in the execution environment, not a shortcut
taken by choice — the plan's automated test suite (`focus-reveal.test.ts`,
`pinboard.test.tsx`'s new `pb-book-caption` assertion) and the above live-server checks are the
strongest verification available without the missing browser-automation tool.

## Verification

**Automated (as specified in plan `<verification>` items 1-3):**
- `npx vitest run`: 232 passed, 16 todo, 0 failed (baseline was 219 passed/0 failed/16 todo;
  this plan added 13 new test assertions across the four tasks, all passing).
- `npx tsc --noEmit`: exactly the same 3 pre-existing `robots.test.ts` errors as the baseline,
  no more, no fewer.
- `npm run build`: succeeded. All 4 new `opengraph-image.tsx` routes plus the 3 edited existing
  ones appear in the build's route table (`○ /building/opengraph-image`, `○
  /prometheus/opengraph-image`, `○ /contact/opengraph-image`, `○ /writing/opengraph-image`, `○
  /opengraph-image`, `ƒ /blog/-/opengraph-image`, `ƒ /building/-/opengraph-image`).

**Live checks against the already-running dev server (plan `<verification>` items 4-6, real curl):**
- `curl -sI http://localhost:3000/writing/opengraph-image` (and `/building`, `/prometheus`,
  `/contact` variants): all returned `200` with `content-type: image/png`.
- `curl -s http://localhost:3000/building/goaltender | grep -o 'og:image[^>]*'`: resolved to
  `http://localhost:3000/building/goaltender/opengraph-image?...` — the local file-convention
  route, no `amazonaws.com` anywhere in the response.
- `curl -sI http://localhost:3000/watching`: `308 Permanent Redirect`, `location: /#loves`.
- `curl -s http://localhost:3000/robots.txt`: contains `Disallow: /api/`, no longer contains
  `/specimen`.

**Live checks for the two browser-only items (plan `<verification>` items 7-8):** performed via
the substitute method described above under Deviations (served-CSS-chunk fetch, served-HTML DOM
fetch, and manual contrast-ratio computation from the live custom-property values), since
Playwright MCP tools were unavailable in this session.

## Self-Check: PASSED

All 8 created files verified present on disk; all 4 task commit hashes (`9f1a30b`, `bd6b6a2`,
`69572d0`, `a213595`) verified present in `git log`.

