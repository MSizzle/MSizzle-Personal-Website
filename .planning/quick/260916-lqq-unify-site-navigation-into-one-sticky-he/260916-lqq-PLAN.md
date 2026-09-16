---
id: 260916-lqq
type: quick
status: planned
date: 2026-09-16
description: Unify four divergent nav behaviours into one sticky SiteHeader rendered from the root layout, collapse the triplicated link list to a single module, convert homepage internal anchors to next/link, add anchor scroll padding, and fix a conditional hook plus a stale-closure effect
must_haves:
  truths:
    - One header component renders on every route, including the homepage, and is visible and clickable at scrollY 0 at both 1440x900 and 390x844.
    - The header stays visible after scrolling any distance on /, /writing, and a /blog/{slug} post.
    - The mobile hamburger is never translated offscreen, on any route, at any scroll position.
    - The four nav destinations are declared in exactly one module and imported by every consumer.
    - No blank 64px offset gap remains above the hero now that the header occupies layout space.
    - Homepage Building and Writing rows navigate client-side, without a full document reload that re-initialises Lenis and GSAP.
    - In-page anchors land below the sticky bar, not underneath it.
    - eslint reports zero errors and zero warnings for notion-renderer.tsx and visit-survey.tsx.
    - The visit survey arms its 45s timer when the user client-side navigates to /.
    - npx vitest run is fully green with zero failures.
  artifacts:
    - src/components/nav/nav-links.ts
    - src/components/nav/site-header.tsx
    - src/__tests__/components/site-header.test.tsx
    - src/__tests__/styles/nav-reachability.test.ts
  key_links:
    - src/app/layout.tsx imports and renders SiteHeader as a direct child of body (pattern: "<SiteHeader")
    - src/components/nav/site-header.tsx imports NAV_LINKS from src/components/nav/nav-links.ts
    - src/app/globals.css declares .site-header with position: sticky and top: 0
    - src/app/globals.css declares html scroll-padding-top referencing --header-h
    - src/components/home/section-building.tsx and section-writing.tsx import Link from next/link
---

# Quick Task 260916-lqq: one sticky header, plus four code bugs

Seven fixes, verified live against `npm run dev` on 2026-09-16 at 1440x900 and
390x844. Grouped into three atomic commits.

## Context

### What is actually broken

Four different nav behaviours coexist today:

1. **Desktop homepage has no nav at all until 80% of the viewport has scrolled.**
   `navigation.tsx:83` suppresses `EditorialHeader` when `pathname === '/'`, and
   `StickyNav` only gets `.show` past `useScrolledPast(24, 0.8)`. Measured: hidden
   at scrollY 719, shown at 721 on a 900px viewport. The `24` argument is dead —
   `use-scrolled-past.ts:26-27` ignores `threshold` entirely whenever a fraction is
   passed, and a fraction is passed at both call sites.
2. **Mobile homepage hamburger is offscreen and untappable at scrollY 0.**
   `.mobile-header-gate` (globals.css 530-545) translates the whole 64px bar to
   `translateY(-100%)`. Measured: button rect `bottom = -10px`, header `top = -64px`.
3. **Every non-home route renders `EditorialHeader` at `position: static`,** so the
   nav scrolls away permanently and never returns. Measured: header rect
   `top = -900` after scrolling to 900 on /writing. Reading a blog post means no
   nav at all for the entire article.
4. **One hard threshold, no hysteresis,** so the bar flickers when scrubbing near
   the cut. Lenis runs `lerp: 0.1` (`lenis-provider.tsx:30`), so the scroll
   position lags the input and repeatedly crosses the line.

The same four links are declared three times: `navigation.tsx:13` (`MOBILE_LINKS`),
`editorial-header.tsx:15` (`LINKS`), `sticky-nav.tsx:10` (`LINKS`).

### The load-bearing sticky gotcha (read this before writing any CSS)

`globals.css:56-63` sets `body { overflow-x: hidden }`. Per CSS Overflow 3 viewport
propagation: `html` has `overflow-x: hidden` so it is *not* `visible` in both axes,
which means html's values propagate to the viewport and html's own used overflow
becomes `visible`. Body does **not** propagate — it keeps `overflow-x: hidden`,
which forces its `overflow-y` to compute to `auto`, which makes **body its own
scroll container**. A `position: sticky` header inside body would then stick to
body's scrollport, which never scrolls, so it would silently do nothing.

Fix: drop `overflow-x: hidden` from `body` and keep it on `html`. html's rule is
the one that actually clips at viewport level — the existing comment at
globals.css:46-50 already says body alone was insufficient, so body's copy is
redundant. Do **not** reach for `overflow-x: clip`: this repo's browserslist
targets `Safari >= 15.4` / `iOS >= 15.4` and `clip` only landed in Safari 16.

### Sticky, not fixed

A sticky header occupies layout space; a fixed one does not. So `MainOffset`'s
`pt-16` becomes a 64px blank gap and must go. `MainOffset` has exactly two
references (`layout.tsx:7` and `:80`) and no tests, so delete the component and
inline `<main>`.

Because the header is now in flow above a `min-h-screen` hero, the hero would push
the page 64px taller than the viewport at rest. Retarget the hero to
`calc(100svh - var(--header-h))`. No test asserts the hero's height classes
(checked).

### Transparent-over-hero means the border, not the background

The site ground is `#ffffff` everywhere (mono lock, `--color-bg`), so "transparent
over the hero" is visually identical to white. The observable part of the
transition is the 1px bottom border appearing. Do not try to make the header
overlay the hero to manufacture a contrast effect — that reintroduces the fixed
positioning this task is removing. **No colour changes in this batch.** The bone
`#F5F2EB` / `#111` / rotating-hover-accent direction is a separate locked phase.

### Test baseline and expected delta

Baseline: **256 pass, 16 todo, 3 files skipped, 0 failing.** Command: `npx vitest run`.

This task deliberately changes the count. Removed: `sticky-nav.test.tsx` (4),
`navigation.test.tsx` (10), the "mounts StickyNav island" case in
`explorative-homepage.test.tsx` (1), `focus-reveal.test.ts` (2) = 17 removed,
leaving 239. Added: `site-header.test.tsx` (10 or more) and
`nav-reachability.test.ts` (3 or more), landing at 252 or higher.

**The gate is `0 failed`, `16 todo`, and `3 skipped files` — not the literal 256.**

Also run `npm run lint`. Items 5 and 6 each remove a real diagnostic (confirmed:
`react-hooks/rules-of-hooks` error at notion-renderer.tsx:524,
`react-hooks/exhaustive-deps` warning at visit-survey.tsx:44). Do **not** touch the
roughly 200 pre-existing `any` errors in test files; they are out of scope.

### Conventions this repo already established

- Un-layered CSS beats layered Tailwind utilities in v4. `.nav-cell--active` is
  written as plain CSS for exactly that reason (globals.css:582-588). Keep the new
  `.site-header` rules as plain un-layered CSS too, in the same neighbourhood.
- Tests that render `next/link` usually mock it (11 files do), but unmocked `Link`
  renders fine in this jsdom setup — `hero.test.tsx` and `motion-audit.test.tsx`
  both render real `Link`s and are green today. So Task 2 needs no new mocks. If
  that turns out wrong, copy the `vi.mock("next/link")` block from
  `footer.test.tsx:17-28`.
- Next 16 App Router. `dynamic({ ssr: false })` must live inside a `"use client"`
  loader. Not needed here, but do not introduce one.
- No em dashes in user-visible copy. Nav labels are unchanged: Prometheus,
  Building, Writing, Contact.

## Tasks

### T-1: One sticky SiteHeader, one link module, no scroll gating

Covers scope items 1, 2, 3.

**files:**
create `src/components/nav/nav-links.ts`,
create `src/components/nav/site-header.tsx`,
create `src/__tests__/components/site-header.test.tsx`,
create `src/__tests__/styles/nav-reachability.test.ts`,
delete `src/components/home/sticky-nav.tsx`,
delete `src/components/home-v2/editorial-header.tsx` (and the now-empty `home-v2/` dir),
delete `src/components/nav/navigation.tsx`,
delete `src/components/main-offset.tsx`,
delete `src/__tests__/components/sticky-nav.test.tsx`,
delete `src/__tests__/components/navigation.test.tsx`,
delete `src/__tests__/styles/focus-reveal.test.ts`,
modify `src/app/layout.tsx`,
modify `src/app/globals.css`,
modify `src/hooks/use-scrolled-past.ts`,
modify `src/components/home/explorative-homepage.tsx`,
modify `src/components/home/hero.tsx`,
modify `src/__tests__/home/explorative-homepage.test.tsx`

**behavior** (write `site-header.test.tsx` from this list before wiring the layout):

- Renders a `<header class="site-header">` on `/`, on `/writing`, and on
  `/blog/some-post`. No route gates it, and no class ever translates it offscreen.
- At scrollY 0 the header has no `is-solid` class.
- After a scroll event at scrollY 40 it has `is-solid`.
- Hysteresis: from the solid state, a scroll event at scrollY 20 keeps `is-solid`
  (above the 8px exit), and a scroll event at scrollY 0 drops it.
- Desktop nav renders exactly 4 links with hrefs `https://prometheus.today`,
  `/building`, `/writing`, `/contact`, in that order.
- The Prometheus link carries `target="_blank"` and a `rel` containing `noopener`.
  No nav link points at the internal `/prometheus` path.
- Active label: `/building` gives the Building link `nav-cell--active`;
  `/writing` and `/blog/anything` give it to Writing; `/contact` gives it to
  Contact; `/` gives it to none.
- The hamburger button exposes `aria-label` "Open navigation menu" at rest and
  "Close navigation menu" when open, with a matching `aria-expanded`.
- Clicking the hamburger opens a drawer containing an `a[href="/building"]`.

**action:**

1. **`src/components/nav/nav-links.ts`** — the single source of truth. Export
   `type NavLabel = "Prometheus" | "Building" | "Writing" | "Contact"`, a
   `NAV_LINKS` const array of `{ label, href, external }` in the order Prometheus
   (`https://prometheus.today`, external), `/building`, `/writing`, `/contact`,
   and `activeNavLabel(pathname: string): NavLabel | undefined` preserving the
   existing derivation exactly: `/building` gives Building, `/writing` or any
   `pathname.startsWith('/blog')` gives Writing, `/contact` gives Contact,
   anything else gives `undefined`. Never return Prometheus as active. Carry over
   the provenance comments from `navigation.tsx:9-12` and `:27-31` (260706-tx6
   reversed D-08, 260708-lqc made Contact a route) so the history is not lost with
   the deleted files.

2. **`src/hooks/use-scrolled-past.ts`** — simplify to
   `useScrolledPast(enterAt: number, exitAt: number = enterAt): boolean` with
   hysteresis. Delete the `viewportFraction` parameter outright: it was the dead
   argument's cause and there is now a single call site. Track the current side in
   a ref or effect-local variable, and only `setState` when the side flips, so
   Lenis's lagging scroll position cannot flicker the class. Keep the SSR-safe
   shape: `window` touched only inside `useEffect`, initial render returns false.
   Drop the `resize` listener (the threshold is no longer viewport-relative); keep
   `{ passive: true }` on `scroll` and the cleanup. Update the doc comment: it now
   describes a background/border swap on an always-visible bar, not a reveal.

3. **`src/components/nav/site-header.tsx`** — `"use client"`. One `<header>`
   carrying `site-header`, plus `is-solid` from `useScrolledPast(24, 8)`. Inside,
   in order:
   - Brand `Link href="/"` reading "Monty Singer", closing the drawer on click.
     Keep both existing looks with responsive classes rather than picking one:
     `text-base font-normal uppercase tracking-widest md:text-[22px] md:font-bold
     md:normal-case md:tracking-tight`.
   - Desktop `<nav aria-label="Primary" className="hidden items-stretch md:flex">`
     wrapping `<ul className="flex list-none items-stretch text-[15px]">`. Map
     `NAV_LINKS`: external entries render `<a class="nav-cell" target="_blank"
     rel="noopener noreferrer">`, internal entries render `<Link>` with
     `cn("nav-cell", isActive && "nav-cell--active")`. The label must stay wrapped
     in a `<span>` — the `.nav-cell::before` fill wipe rides underneath it.
   - Hamburger `<button className="... md:hidden">` with the existing 44px minimum
     hit box, `aria-label`, `aria-expanded`, and the two inline SVGs lifted
     verbatim from `navigation.tsx:65-74`.
   Return the drawer and backdrop as siblings after `</header>` (same shape as
   today's fragment), both `md:hidden`, positioned `top-[var(--header-h)]` instead
   of the hardcoded `top-16`. Raise their z-indexes to sit under the header's 9000
   but above page content: backdrop `z-[8980]`, drawer `z-[8990]`. Drawer items
   map `NAV_LINKS` with the same external/internal branch and close the drawer on
   click. Use `bg-[var(--color-bg)]` and `border-[var(--color-border)]`, not the
   old `var(--bg)` shorthand that `navigation.tsx` used.

4. **`src/app/layout.tsx`** — import `SiteHeader` from `@/components/nav/site-header`,
   drop the `Navigation` and `MainOffset` imports, and render
   `<SiteHeader />` followed by `<main>{children}</main>` inside `MotionProvider`.
   Do not add any padding class to `<main>`.

5. **`src/components/home/explorative-homepage.tsx`** — delete the `StickyNav`
   import (line 2) and its mount (line 51), and update the "Islands mounted here"
   doc block so it lists only `ScrollReveals`.

6. **`src/app/globals.css`**:
   - In the existing `:root` block (around line 117, beside `--sig`), add
     `--header-h: 64px;` with a comment noting that `.site-header`'s height, the
     drawer offset, and `scroll-padding-top` all read it, so the three cannot drift.
   - In `body` (line 56-63) remove `overflow-x: hidden;`. Keep `overscroll-behavior-x`.
     Extend the comment above it (46-50) to record *why*: body must not become a
     scroll container or the sticky header silently stops sticking; html's copy is
     the one that clips at viewport level.
   - Replace the whole `.stickynav` region **and** the `.mobile-header-gate` region
     (roughly lines 453 through 545, comments included) with a `.site-header` block:
     `position: sticky; top: 0; z-index: 9000; height: var(--header-h); display: flex;
     align-items: stretch; justify-content: space-between; padding-inline: 24px;
     background-color: transparent; border-bottom: 1px solid transparent;`
     and `transition: background-color 0.24s ease, border-color 0.24s ease;`.
     Then `.site-header.is-solid { background-color: var(--color-bg);
     border-bottom-color: var(--color-text); }`, a `@media (min-width: 768px)`
     bumping `padding-inline` to 160px (matching the old EditorialHeader `md:px-40`
     and StickyNav's 160px gutters), and a `prefers-reduced-motion` rule killing the
     transition. Use `background-color`, not the `background` shorthand, or the
     transition will not run. Remove every leftover comment mentioning `.stickynav`
     or `.mobile-header-gate` — Task 1's CSS test greps for those names and a stale
     comment would self-invalidate the gate.
   - **Keep the entire `.nav-cell` family (roughly 547-600) intact**, including
     `.nav-cell--active` as plain un-layered CSS and both `:focus-visible` rules.
     Only update its header comment to say SiteHeader instead of
     "EditorialHeader + StickyNav".

7. **`src/components/home/hero.tsx`** — change the section's `min-h-screen` to
   `min-h-[calc(100svh-var(--header-h))]` so hero plus header equals one viewport.
   Nothing else in the file changes.

8. **Tests.** Delete `sticky-nav.test.tsx`, `navigation.test.tsx`, and
   `focus-reveal.test.ts`. Write `src/__tests__/components/site-header.test.tsx`
   covering the `behavior` list above, reusing `navigation.test.tsx`'s proven
   harness: `vi.mock("next/link")`, the module-level `mockUsePathname` factory for
   `next/navigation`, and the `setScrollY` helper plus `act(() => window.dispatchEvent(new Event("scroll")))`.
   Write `src/__tests__/styles/nav-reachability.test.ts` as the replacement CSS
   regression guard: read `globals.css`, **strip comments first**
   (`css.replace(/\/\*[\s\S]*?\*\//g, "")`) so prose cannot satisfy or break a
   match, then assert (a) `.site-header` declares `position: sticky` and `top: 0`,
   (b) neither `.stickynav` nor `.mobile-header-gate` appears anywhere, so no
   future change can translate the nav offscreen again, and (c) the
   `.nav-cell:hover::before, .nav-cell:focus-visible::before` reveal survives, which
   is what actually preserves keyboard parity now that the bar is never hidden
   (supersedes the `:focus-within` reveal from 260726-kjp: an always-visible header
   is strictly better for WCAG 2.4.7, there is nothing left to reveal).
   In `explorative-homepage.test.tsx`, delete the StickyNav `vi.mock` (lines 15-20)
   and the "mounts StickyNav island" case.

**verify:**

- `grep -rn "StickyNav\|mobile-header-gate\|EditorialHeader\|MainOffset" src | wc -l`
  returns `0`. Every reference, including the comments inside `globals.css`, must be
  gone; a stale comment naming a deleted component is itself a defect here, because
  the CSS regression test greps for those names.
- Single-source proof, two halves:
  `grep -cE '"/building"|"/writing"|"/contact"|prometheus\.today' src/components/nav/site-header.tsx`
  returns `0` (the header declares no hrefs of its own, it only maps `NAV_LINKS`),
  and `grep -rl "prometheus.today" src/components/nav` lists exactly
  `src/components/nav/nav-links.ts`. Note `grep -c` exits 1 when the count is 0;
  that is the passing case here, so read the printed number, not the exit code.
- `npx vitest run src/__tests__/components/site-header.test.tsx src/__tests__/styles/nav-reachability.test.ts src/__tests__/home/explorative-homepage.test.tsx src/__tests__/home/motion-audit.test.tsx` passes.
- `npx vitest run` reports 0 failed, 16 todo, 3 skipped files.
- `npm run build` succeeds.
- `<human-check>` with `npm run dev`, at 1440x900 and at 390x844, on `/`,
  `/writing`, and any `/blog/{slug}`: the header is present and its links are
  clickable at scrollY 0 **and** after scrolling 1500px; the bottom border fades in
  once past ~24px and does not flicker while scrubbing slowly across that point;
  the mobile hamburger opens the drawer at scrollY 0; there is no blank gap between
  the header and the hero; and the Things I Love pinboard still cannot be panned
  sideways (the body overflow change is the risk here).

**done:** One header, every route, every scroll position, both breakpoints. Four
links declared once. No offscreen translation anywhere in the CSS. No 64px gap.

**commit:** `feat(nav): unify site navigation into one sticky header`

---

### T-2: next/link for internal homepage rows, plus anchor scroll padding

Covers scope items 4 and 7.

**files:** `src/components/home/section-building.tsx`,
`src/components/home/section-writing.tsx`, `src/app/globals.css`

**action:**

1. **`section-building.tsx`** — import `Link from "next/link"`. The `rows` array
   mixes the hardcoded external Prometheus row with internal `/building/{slug}`
   rows and already carries a per-row `external` boolean, so branch on `row.external`,
   not on a string sniff. Extract the four `<span>` children into a shared
   fragment so both branches render identical markup, then return either the
   existing `<a className="a-row reveal" target="_blank" rel="noopener noreferrer">`
   for external rows or `<Link className="a-row reveal">` for internal ones. Also
   convert the trailing `<a className="more reveal" href="/building">` (line 66) to
   `<Link>`. Class names, key (`row.href`), and the `→` glyph are unchanged —
   `section-building.test.tsx` filters links by the `.a-row` class and asserts
   `target`/`rel` on the Prometheus row only.

2. **`section-writing.tsx`** — import `Link`. Every href here is internal, so
   convert both unconditionally: the per-row `<a className="e-post" href={row.href}>`
   (line 64) and the trailing `<a className="more" href="/writing">` (line 71).
   `section-writing.test.tsx` queries by the `.e-post` class, which `Link` preserves.

3. **`globals.css`** — extend the existing `html { scroll-behavior: auto; }` rule
   (line 42-44) with `scroll-padding-top: calc(var(--header-h) + 16px);`. The 16px
   is breathing room so an anchored heading does not kiss the bar's bottom edge.
   Comment it as the counterpart to the sticky header. Lenis is constructed without
   `anchors`, so anchor jumps stay native and both native hash navigation and the
   App Router's `scrollIntoView` honour scroll-padding.

Do not add `vi.mock("next/link")` to either test file unless they actually fail:
`hero.test.tsx` and `motion-audit.test.tsx` already render unmocked `Link`s green.

**verify:**

- `npx vitest run src/__tests__/home/section-building.test.tsx src/__tests__/home/section-writing.test.tsx src/__tests__/home/motion-audit.test.tsx src/__tests__/home/explorative-homepage.test.tsx` passes.
- `grep -c 'from "next/link"' src/components/home/section-building.tsx` and the same
  against `section-writing.tsx` each return `1`.
- `grep -cE '<a([ >]|$)' src/components/home/section-writing.tsx` prints `0` (every
  anchor in that file is now a `Link`; grep exits 1 on zero matches, which is the
  passing case).
- `grep -cE '<a([ >]|$)' src/components/home/section-building.tsx` prints `1`, and
  `grep -c 'target="_blank"' src/components/home/section-building.tsx` prints `1` —
  the single external Prometheus row, still carrying its `rel`.
- `grep -c 'scroll-padding-top' src/app/globals.css` returns `1`.
- `npx vitest run` still reports 0 failed.
- `<human-check>` with `npm run dev` on `/`: clicking a Building row and a Writing
  row navigates without a full reload (no white flash, no network document request
  in DevTools, smooth scroll still works immediately on the destination because
  Lenis was never torn down); clicking the footer's "Things I Love" from `/writing`
  lands on `/#loves` with the section heading fully below the bar, not hidden
  under it.

**done:** Homepage internal navigation is client-side; anchors clear the bar.

**commit:** `fix(home): route internal rows through next/link and clear the sticky bar on anchors`

---

### T-3: Conditional hook and stale-closure effect

Covers scope items 5 and 6.

**files:** `src/components/notion/notion-renderer.tsx`, `src/components/visit-survey.tsx`

**action:**

1. **`notion-renderer.tsx:522-525`** — `NotionImageBlock` calls
   `useContext(FirstImageContext)` at line 524, *after* the early
   `if (block.type !== "image") return null;` guard at 523. Move the `useContext`
   call to be the first statement in the component body, above the guard, so it
   runs on every render. Everything downstream (`isFirst`, the `priority` /
   `fetchPriority` / `loading` props) is unchanged. Do not delete the guard and do
   not convert it to a ternary wrapper. Note the standing repo quirk while you are
   in here: Next 16's `Image` does not auto-emit `fetchPriority` from `priority`,
   which is why line 544 sets it explicitly. Leave that alone.

2. **`visit-survey.tsx:24-44`** — the effect reads `pathname` at line 25 but
   declares `[]` deps, so it only ever evaluates the pathname from first mount. A
   user who lands on `/writing` and then client-side navigates to `/` never arms
   the survey. Add `pathname` to the dependency array. Confirm the resulting
   behaviour: on a non-`/` route the effect returns immediately after the
   `localStorage` check is skipped; on entering `/` it starts a fresh 45s timer;
   navigating away runs the cleanup and clears both `timer` and `openTimer`, so no
   orphaned timer fires. Add a one-line comment recording that `pathname` is a real
   dependency and the timer intentionally restarts per visit to `/`.

**verify:**

- `npx eslint src/components/notion/notion-renderer.tsx src/components/visit-survey.tsx`
  exits 0 with no output beyond the browserslist notice. Both diagnostics that
  exist today must be gone: `524:24 error react-hooks/rules-of-hooks` and
  `44:6 warning react-hooks/exhaustive-deps`.
- `npx vitest run src/__tests__/pages/blog-slug.test.tsx src/__tests__/pages/projects.test.tsx` passes
  (both exercise the Notion renderer).
- `npx vitest run` reports 0 failed, 16 todo, 3 skipped files.
- `<human-check>` with `npm run dev`: open a blog post containing at least two
  images and confirm the first still renders eager with `fetchpriority="high"` in
  the DOM and the rest lazy; then load `/writing`, click through to `/`, wait 45s,
  and confirm the survey bubble arrives (clear `localStorage` key
  `visit-survey-done` first).

**done:** `npm run lint` is two diagnostics lighter, and the survey arms on
client-side navigation.

**commit:** `fix(hooks): call useContext unconditionally and track pathname in the survey effect`

---

## Verification

Run after all three commits:

1. `npx vitest run` — 0 failed, 16 todo, 3 skipped files. Count will be 252 or
   higher, not 256; see the delta arithmetic in Context.
2. `npm run lint` — exactly two fewer diagnostics than baseline. The roughly 200
   pre-existing `any` errors in test files are out of scope and must still be there.
3. `npm run build` — succeeds. This is the Next 16 server/client boundary gate:
   `SiteHeader` is `"use client"` and is rendered from a server layout, and
   `section-building.tsx` / `section-writing.tsx` stay Server Components that merely
   render `Link`.
4. Browser matrix with `npm run dev`, at **1440x900** and **390x844**, on **`/`**,
   **`/writing`**, and **a `/blog/{slug}` post** — nine combinations:
   - Nav present and links clickable at scrollY 0.
   - Nav present and links clickable after scrolling 1500px.
   - Bottom border fades in past ~24px and does not flicker when scrubbing slowly
     back and forth across the threshold.
   - No blank gap above the hero (`/`) or above the page content (inner routes).
   - Mobile: hamburger tappable at scrollY 0, drawer opens under the bar.
   - Keyboard: Tab from the address bar reaches the brand link then all four nav
     links, each with a visible focus ring.

## Commits

Three atomic commits, one per task, in order. Every message body ends with:

```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

## Source coverage audit

| # | Scope item | Task | Status |
|---|-----------|------|--------|
| 1 | Nav unification into one sticky SiteHeader in layout, delete StickyNav + pathname suppression, recheck MainOffset | T-1 | COVERED |
| 2 | Single source of nav links replacing three duplicates | T-1 | COVERED |
| 3 | Mobile bar always reachable, remove `.mobile-header-gate` | T-1 | COVERED |
| 4 | Raw anchors to internal routes converted to next/link | T-2 | COVERED |
| 5 | Conditional `useContext` in notion-renderer | T-3 | COVERED |
| 6 | Stale closure in visit-survey effect | T-3 | COVERED |
| 7 | `scroll-padding-top` for in-page anchors | T-2 | COVERED |
| C-1 | `useScrolledPast` dead `threshold` argument simplified | T-1 step 2 | COVERED |
| C-2 | `.nav-cell` hover/focus and keyboard access preserved | T-1 steps 6, 8 | COVERED |
| C-3 | Tailwind v4 un-layered specificity pattern preserved | T-1 step 6 | COVERED |
| C-4 | Test updates for deleted components | T-1 step 8 | COVERED |
| C-5 | No colour changes | all | COVERED (none planned) |
| C-6 | Atomic commits with the required trailer | all | COVERED |

No item is deferred. No item was reduced in scope.

## Threat model

No package installs in this batch, so the package legitimacy gate does not apply.
No new trust boundary is introduced: this is a client-side navigation refactor
against already-trusted Notion content.

| Threat ID | Category | Component | Disposition | Mitigation |
|-----------|----------|-----------|-------------|------------|
| T-lqq-01 | Tampering | External nav links opened with `target="_blank"` | mitigate | `nav-links.ts` carries an `external` flag and every consumer renders `rel="noopener noreferrer"`; `site-header.test.tsx` asserts the `rel` on the Prometheus link, so a regression fails the suite |
| T-lqq-02 | Elevation of privilege | `Link href={\`/building/${slug}\`}` and `/blog/${slug}` built from Notion slugs | accept | Slugs are interpolated into a leading-slash path template, so a hostile slug cannot produce a `javascript:` or absolute-origin href; Notion is an authenticated, owner-only source |
| T-lqq-03 | Information disclosure | Drawer and header render on every route including error pages | accept | Static link labels only, no user or request data crosses the component |
| T-lqq-SC | Tampering | npm installs | n/a | No dependency is added, removed, or upgraded |

## Output

Create `.planning/quick/260916-lqq-unify-site-navigation-into-one-sticky-he/260916-lqq-SUMMARY.md` when done.
