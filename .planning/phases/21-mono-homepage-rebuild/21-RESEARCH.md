# Phase 21: Mono Homepage Rebuild - Research

**Researched:** 2026-07-21
**Domain:** Repo-internal Next.js App Router refactor (no new external dependencies)
**Confidence:** HIGH — this is a codebase-heavy phase; every claim below is [VERIFIED] by direct
file read or grep against the live `v4-mono` branch, not training-data guesswork.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

All decisions below are LOCKED by Monty's sketch-015 sign-off on 2026-07-20 (variant E, three
recorded revisions). They are not open for reinterpretation during planning or execution.

**Register — three bands, three registers, one page**

| Band | Register | Source |
|------|----------|--------|
| Hero + `01 Building` | Swiss editorial (variant A) | numbered rows, tracked-out mono labels, hover inverts full row to a solid black block |
| `02 Writing` | Terminal (variant B) | `~/writing`, dates flush left, read time flush right, mono type |
| `03 Things I Love` | Pinboard (sketches 012/013) | shipped `pinboard.tsx`, untouched this phase |

**Hero (HP-01):** Type only, no photograph above the fold. The 44%-width rotating portrait
carousel is deleted, not hidden. The Vermilion marker block is gone (accent is dead as of Phase
20). Hanken Grotesk 800 display survives from v3; JetBrains Mono carries mono labels and the
terminal band, both already loading via `next/font`.

**Building index (HP-02):** Swiss numbered index `001`/`002`/`003` (zero-padded three digits).
Rows sit on hairline rules. Hover inverts the **entire row** to a solid black block (white type
on black) — the site's only hover language. Full-row invert, not tight-row.

**Writing list (HP-03):** Terminal format `~/writing` header, title, date flush left, read time
flush right, mono type throughout (the only mono-type surface on the page). **No frame** — no 2px
box, no blinking cursor (a static `_` glyph is acceptable if used at all).

**Continuous ground (HP-04):** One continuous `#ffffff` ground for the whole page — the
alternating light/dark band rhythm is removed entirely. Depth from hairlines, whitespace, type
weight only. No gradients, hard corners (`radius: 0`).

**Subscribe demotion (HP-05):** A visitor must reach work and essays without meeting a subscribe
CTA above the footer. Monty Monthly becomes a quiet footer-level line.
`section-newsletter.tsx`/`monty-monthly-carousel.tsx` do not survive as promotional surfaces.
`sticky-nav.tsx` loses its subscribe button (already true — see Deletion Blast Radius).

**Motion subtraction (MS-01, MS-02):** Removed outright: hero link marquee (`photo-marquee.tsx`),
pulsing status dot, photo ken-burns (`photo.tsx`), slide-in-from-side reveals
(`scroll-reveals.tsx`), the light/dark band slam. Surviving motion: **one slow opacity fade-up on
scroll, and nothing else.**

**Content:** Real content where known (Prometheus, Monty Monthly, CULTIVATE, real essay
titles/dates from Notion at build time). Omit unknowns rather than guess (e.g. no location).

### Claude's Discretion
- Exact spacing scale, type ramp, grid column counts — extract from the sketch's `index.html` /
  `../themes/mono.css` rather than inventing; precise Tailwind token mapping is an implementer call.
- Whether deleted components are removed from the repo or reduced to unused files (**prefer
  deletion**; leave no dead homepage components behind).
- Component decomposition and file boundaries within `src/components/home/`.
- Test structure for the new sections.

### Deferred Ideas (OUT OF SCOPE)
- Pinboard mono translation (greyscale `SWATCHES`, `.pb-frame--cream`, note panel Vermilion→black,
  category-by-fill-weight) — **Phase 22** (TL-01/02/03, MS-03).
- OG images still hardcoding `#e5411f` — **Phase 23**.
- Interior route sweep (`/building`, `/writing`, `/contact`) — **Phase 23**.
- Dark mode / true inversion — **Phase 24**.

### Hard scope fence
`src/components/home/pinboard.tsx` is **not edited** in this phase under any circumstance. If a
homepage change appears to require a pinboard edit, stop and flag it.

### Test baseline (from CONTEXT.md, re-verified this session)
The only pre-existing suite failure is `src/__tests__/pages/projects.test.tsx:188` ("renders a
title-card face instead of a cover image when project.image is non-null"). It belongs to the
projects page, not the homepage, and must not be logged as a regression introduced here. Re-ran
`npx vitest run` this session: **182 passed, 16 todo, 1 failed** (that same test) — baseline
confirmed unchanged.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HP-01 | Type-only hero, no photograph above the fold | Current-State Map (Hero), Deletion Blast Radius, UI-SPEC Hero contract already locks exact markup/copy — see 21-UI-SPEC.md §1 |
| HP-02 | Swiss numbered Building index with full-row hover invert | Current-State Map (SectionBuilding/SectionWork), Data Flow (`getFeaturedProjects` shape), UI-SPEC §2 |
| HP-03 | Terminal Writing list, no frame | Data Flow (merge of `fetchMontyMonthlyIssues` + `getPublishedPosts`, reading-time reality check), UI-SPEC §3 |
| HP-04 | One continuous ground, no band alternation | Current-State Map (`.band-dark` mechanism), Motion/CSS Teardown Mechanics |
| HP-05 | No subscribe CTA above the footer | Deletion Blast Radius (`sticky-nav.tsx` already has no CTA — grep-verified), Current-State Map |
| MS-01 | Remove hero marquee, pulsing dot, ken-burns, slide-in reveals | Motion Teardown Mechanics (exact keyframe/class inventory with current line numbers) |
| MS-02 | Only surviving motion is a slow opacity fade-up | Motion Teardown Mechanics (`.reveal` retune spec, `scroll-reveals.tsx` selector narrowing) |
</phase_requirements>

## Summary

Phase 21 is a pure repo-internal refactor: no new npm packages, no new Notion databases, no new
API routes. Everything needed already exists in the codebase — `getFeaturedProjects()`,
`fetchMontyMonthlyIssues()`, and `getPublishedPosts()` are all live, tested, ISR-cached functions;
`estimateReadingTime()` is a defined-but-currently-unused utility ready to be wired up for the
terminal Writing band. The `21-CONTEXT.md` and `21-UI-SPEC.md` documents already resolved every
visual and copy decision in unusual depth (down to exact grid-template-columns, hex-equivalent
token names, and hover-timing values) — this research's job was to verify the *implementation*
surface underneath that spec: what currently exists, what it's wired to, and what breaks if it's
touched.

The blast-radius audit (grep-verified, every `home/` component checked against the full `src/`
tree) confirms the UI-SPEC's Component Disposition table is accurate: `RailBox`,
`MontyMonthlyCarousel`, `SectionWork`, `SectionNewsletter`, and the hero's ken-burns/breathe/
marquee CSS have **zero consumers outside `src/components/home/`** and its own test files. Nothing
in `src/app/**` (interior routes) imports any homepage component. `sticky-nav.tsx` already has no
subscribe button — grep-confirmed against its actual source, not just the UI-SPEC's claim.

One correction to the UI-SPEC surfaced during this research: its reading-time discretion note
claims `/writing`'s own page "already uses [`estimateReadingTime`]... to satisfy D-09 without
extra API calls." That is not what `writing/page.tsx` currently does — it calls
`calculateReadingTime(await getBlocks(post.id))`, a real per-post Notion API fetch. `estimateReadingTime()`
is defined in `src/utils/reading-time.ts` but has **zero call sites anywhere in the repo today**.
This doesn't block Phase 21 — `estimateReadingTime(post.description)` is still the right,
cheap choice for a 5-row terminal list that must not add 5+ extra Notion API calls to the
homepage's render path — but the planner should not assume there's an established pattern to
"reuse"; it's greenfield wiring of an already-written, already-unit-testable pure function.

**Primary recommendation:** Follow the UI-SPEC's Component Disposition table exactly (it is
correct and grep-verified). Sequence the rebuild as: (1) rebuild `hero.tsx` + delete its CSS,
(2) rebuild `section-building.tsx` to absorb `section-work.tsx`'s data role and delete
`section-work.tsx`, (3) build the new terminal Writing band (new component or repurpose
`section-newsletter.tsx`'s file, fed by the two-source merge below) and delete
`monty-monthly-carousel.tsx`, (4) modify `section-loves.tsx`'s header only, (5) delete
`rail-box.tsx` once its three consumers are gone, (6) retune `scroll-reveals.tsx` + `.reveal` CSS,
(7) rewrite `explorative-homepage.tsx` as the new band orchestrator, (8) full rewrite of
`src/__tests__/home/explorative-homepage.test.tsx` (its band-dark assertions are inverted by this
phase's own success criteria) plus every other home test file whose subject component changes
shape.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Homepage layout/markup (hero, index, terminal list) | Frontend Server (RSC) | — | All homepage components are Server Components (`section-building.tsx`, `hero.tsx`, `explorative-homepage.tsx` carry no `"use client"`); only `sticky-nav.tsx`, `photo-marquee.tsx`, `monty-monthly-carousel.tsx`, `pinboard.tsx`, `scroll-reveals.tsx` are client islands |
| Notion/RSS data fetch (projects, posts, Monty Monthly issues, loves) | API/Backend (server-side fetch in RSC) | — | `page.tsx` is an `async` Server Component; all three/four fetches happen at request/build time inside it, never in the browser |
| Scroll-triggered fade animation | Browser/Client | — | `scroll-reveals.tsx` is a headless `"use client"` `IntersectionObserver` island; must stay client-side (no `IntersectionObserver` on the server) |
| Row hover-invert (Building/Writing) | Browser/Client (CSS only) | — | Pure `:hover`/`:focus-visible` CSS — no JS required, can live entirely in Server Component markup + CSS |
| Sticky nav show/hide on scroll | Browser/Client | — | Already `"use client"`, uses `window.scrollY` in a `useEffect` — unaffected by this phase beyond a CSS cleanup |
| Reading-time computation for terminal band | API/Backend (build-time, in RSC) | — | `estimateReadingTime()` is a pure sync function; call it inside `page.tsx`'s async body against already-fetched `post.description`/`issue.description`, no extra network round-trip |
| Notion image proxying (project/post covers) | API/Backend (existing `/api/notion-cover` route) | CDN/Static (Vercel Image Optimization) | Unaffected by this phase — Building rows in this phase's design carry no cover images (Swiss index is type-only per row) |

## Current-State Map — `src/components/home/`

All 13 files, verified by direct read on 2026-07-21 against the `v4-mono` branch (post–Phase 20).

| File | Type | Renders | Data in | Consumers outside its own test file |
|------|------|---------|---------|---------------------------------------|
| `explorative-homepage.tsx` | Server Component (sync) | Orchestrator: mounts `StickyNav`, `ScrollReveals`, then `Hero` → `.band.band-dark#building > SectionBuilding` → `.band#work > SectionWork` → `.band.band-dark#writing > SectionNewsletter` → `.band#loves > SectionLoves` | `projects`, `montyIssues`, `loves`, `loveCategories` props (all from `page.tsx`) | `src/app/page.tsx` (only real consumer) |
| `hero.tsx` | Server Component (sync) | Marker-block headline "Create Order from Chaos" + 3-photo crossfade carousel (`<Photo>` ×3) + woven "Join Monty Monthly" link + `.statustag` pulsing dot + full-bleed `.hero-ticker` marquee (5 section links ×2 for seamless loop) | none (static) | `explorative-homepage.tsx` only |
| `section-building.tsx` | Server Component (sync) | `RailBox num="01" label="Building"` + Prometheus headline/body + one wide slide-in `<Photo>` of prometheus.jpg | none (static; all copy hardcoded) | `explorative-homepage.tsx` only |
| `section-work.tsx` | Server Component (sync) | `RailBox num="02" label="Selected work"` + 2×2 `TitleCard` grid (from `@/components/v3/title-card`, a **shared** component that survives) + `/building` "Projects · SELECTED" link + Prometheus link-out paragraph | `projects: Project[]` prop | `explorative-homepage.tsx` only |
| `section-newsletter.tsx` | Server Component (sync) | Monty Monthly eyebrow/heading + `<MontyMonthlyCarousel>` | `issues: MontyMonthlyIssue[]` prop, mapped to `CarouselIssue[]` via internal `issuesToCards()` | `explorative-homepage.tsx` only |
| `monty-monthly-carousel.tsx` | Client Component (`"use client"`) | Horizontal scroll-snap carousel: issue cards (each with `<Photo dark>` cover, issue meta, excerpt, "Read issue →") + trailing Substack subscribe card + prev/next + dot indicators | `issues: CarouselIssue[]` prop | `section-newsletter.tsx` only |
| `section-loves.tsx` | Server Component (sync) | `RailBox num="03" label="Things I love"` + heading + (`<Pinboard>` if `items.length > 0`, else `<PhotoMarquee>` fallback with 4 hardcoded photo items) | `items: LoveItem[]`, `categoryOrder: string[]` props | `explorative-homepage.tsx` only |
| `photo.tsx` | Server Component (sync) | `next/image` fill or placeholder block; `.img.kenburns` wrapper always applied; `breathe`/`dark`/`aspectRatio`/`objectPosition`/`caption` props | props only | `hero.tsx`, `photo-marquee.tsx`, `monty-monthly-carousel.tsx`, `section-building.tsx` (4 consumers, all inside `home/`) |
| `photo-marquee.tsx` | Client Component (`"use client"`) | Doubled, looping `.marquee .track` row of `<Photo>` cards; `useReducedMotion()` pauses via inline style (belt-and-suspenders with the CSS `@media` guard) | `items: MarqueeItem[]` prop | `section-loves.tsx` only (Notion-empty fallback) |
| `rail-box.tsx` | Server Component (sync) | Auto-inverting `.rail > .rail-box > .num + .lbl` index/label block | `num`, `label` props | `section-work.tsx`, `section-loves.tsx`, `section-building.tsx` (3 consumers, all inside `home/`) |
| `scroll-reveals.tsx` | Client Component (`"use client"`, headless — returns `null`) | Nothing in DOM. Wires one `IntersectionObserver` over `.reveal, .slide, .shadowed` on mount; adds `.in` on intersect (fire-once); immediate `.in` for all targets under `prefers-reduced-motion: reduce` | none | `explorative-homepage.tsx` only |
| `sticky-nav.tsx` | Client Component (`"use client"`) | Fixed top bar, slides in past 82% viewport scroll. Brand mark `Link href="/"` + `LINKS` array (Prometheus external / Building / Writing / Contact). **`LINKS` has 4 entries, no subscribe/CTA entry — grep-confirmed, no `.cta` markup rendered anywhere in this file.** | none | `explorative-homepage.tsx` only |
| `pinboard.tsx` | Client Component (`"use client"`, 749 lines) | **OUT OF SCOPE — do not modify.** Draggable/scatter card board fed by `LoveItem[]`. See Pinboard Boundary section below. | `items: LoveItem[]`, `categoryOrder: string[]` props | `section-loves.tsx` only |

## Deletion Blast Radius

Every file the UI-SPEC/CONTEXT.md name for deletion or gutting, checked against the **entire**
`src` tree (not just `home/`) via `grep -rn` for each import path. Confirmed 2026-07-21.

| Component | UI-SPEC fate | Importers found (excluding self + own test) | Verdict |
|---|---|---|---|
| `photo-marquee.tsx` | Modified (strip animation, keep as fallback) | `section-loves.tsx` (real import) + `src/__tests__/home/section-loves.test.tsx` (mocked) | Safe — single consumer, staying alive per UI-SPEC |
| `photo.tsx` | Modified (strip `.kenburns`/`breathe`) | `hero.tsx`, `photo-marquee.tsx`, `monty-monthly-carousel.tsx`, `section-building.tsx` (all 4 in `home/`, all 4 themselves rebuilt/deleted this phase) + `src/__tests__/home/section-building.test.tsx` (mocked) | Safe — `Photo`'s only non-`home/` reference is zero; it is fine to modify its API (drop `breathe` prop) since every consumer is being touched this same phase |
| `monty-monthly-carousel.tsx` | **Deleted** | `section-newsletter.tsx` only | Safe — sole consumer is itself being deleted |
| `section-newsletter.tsx` | **Deleted** | `explorative-homepage.tsx` (real) + `src/__tests__/home/explorative-homepage.test.tsx` (mocked) | Safe — sole consumer is the orchestrator being rewritten |
| `rail-box.tsx` | **Deleted** | `section-work.tsx`, `section-loves.tsx`, `section-building.tsx` + 3 test files (all mocked) | Safe once all 3 real consumers stop importing it (`section-work.tsx` deleted, other two rebuilt to use the new `.lbl` label pattern per UI-SPEC) |
| `explorative-homepage.tsx` | Rebuilt | `src/app/page.tsx` (real, single call site) + its own test file | Safe to rebuild in place — `page.tsx`'s import path/name doesn't change |
| `sticky-nav.tsx` | Modified (verify-only) | `explorative-homepage.tsx` (real) + its own test file | **Already has no subscribe button** — `LINKS` array is 4 plain nav entries, confirmed by direct source read. HP-05's job here is CSS cleanup only (`.stickynav .cta` rule, `globals.css:1005-1015`, is dead — zero `.cta` class usage found anywhere in `sticky-nav.tsx`) |
| `scroll-reveals.tsx` | Modified (selector narrow + retune) | `explorative-homepage.tsx` (real) + its own mock in the orchestrator test | Safe — no direct unit test exists for this file's `IntersectionObserver` logic today (Wave 0 gap, see Test Surface) |
| `section-work.tsx` | **Deleted** (data role absorbed into `section-building.tsx`) | `explorative-homepage.tsx` (real, one import) + `src/__tests__/home/section-work.test.tsx` (9 tests, direct import, not mocked) | Safe to delete the component; its dedicated test file (`section-work.test.tsx`) must be deleted too or it will fail to resolve the module. `TitleCard` (`@/components/v3/title-card`), the shared component `SectionWork` used, is **not** deleted — it has other consumers (`writing/page.tsx` via `Card`, `building` interior routes) confirmed unaffected since this phase only removes `section-work.tsx`'s *usage* of it |
| `hero.tsx`'s `.hero-ticker`/`.statustag`/`.pcarousel` CSS | Removed via rebuild | No selector collision: `src/components/v3/marquee.tsx` (a **separate**, unrelated global marquee component) uses Tailwind arbitrary-value `[animation:scroll_30s_linear_infinite]` and utility classes, never the literal `.marquee`/`.track` class names that `globals.css`'s home-specific `.marquee .track { animation: slide ... }` rule targets — confirmed by reading `v3/marquee.tsx` source. Safe: stripping `.hero-ticker`, `.statustag`, `.pcarousel`/`.pslide` CSS cannot affect any interior route |

**Net verdict:** the UI-SPEC's Component Disposition table is accurate. No homepage component
slated for deletion or gutting is imported by any interior route (`/building`, `/writing`,
`/blog/[slug]`, `/building/[slug]`, `/contact`, `/prometheus`) or by any shared layout file
(`app/layout.tsx`, `site-footer.tsx`, `site-header`/navigation). The only genuinely cross-cutting
element is the `id="loves"` anchor and the internal `#writing`/`#building` fragment links — see
Fragment-Link Contract below.

### Fragment-Link Contract (not called out explicitly in UI-SPEC — verify during planning)

`grep -rn '"#building"\|"#writing"\|"#loves"\|/#loves'` across `src/` found:

- `hero.tsx` internal links to `#writing`/`#building`/`#loves` (all inside the deleted `.hero-ticker`
  and the deleted `.wayin` "Join Monty Monthly" link — dies with the hero rebuild, no external
  contract)
- `section-building.tsx`'s own `#writing` link (dies with that component's rebuild)
- **`src/components/layout/site-footer.tsx:19`** — `{ label: "Things I Love", href: "/#loves" }`
  in the site-wide `EXPLORE` array, rendered on **every page**, not just the homepage
- **`src/__tests__/components/footer.test.tsx:50`** — asserts
  `document.querySelector('a[href="/#loves"]')` is not null

**Action required:** whatever element wraps the "Things I Love" band in the rebuilt
`explorative-homepage.tsx` must keep `id="loves"` (or the footer's fragment link silently breaks
site-wide, and `footer.test.tsx` — not a homepage test, easy to overlook — starts failing). `id`
on `#building`/`#writing` bands is not externally load-bearing (no consumer outside this phase's
own doomed files) and may be kept, renamed, or dropped at the planner's discretion — but keeping
consistent `id` anchors on all three new bands is good practice for a11y landmark navigation
regardless (UI-SPEC's Accessibility Contract point 5 already requires real heading/landmark
semantics on each section).

## Data Flow

### Current fetches (`src/app/page.tsx`, `revalidate = 1800`)

```ts
// All three are defensive: try/catch → [] on failure, matching site-wide convention.
projects = await getFeaturedProjects();        // src/lib/notion-projects.ts
montyIssues = await fetchMontyMonthlyIssues(4); // src/lib/rss/substack.ts
const lovesData = await getLovesData();          // src/lib/notion-loves.ts
loves = lovesData.items; loveCategories = lovesData.categoryOrder;
```

**New fetch required by HP-03:** `getPublishedPosts()` from `src/lib/notion.ts`, the same call
`/writing` already makes. Add it to `page.tsx` with the same `try {} catch {}` → `[]` pattern:

```ts
let posts: BlogPost[] = [];
try {
  posts = await getPublishedPosts();
} catch {}
```

### Shape verification (both [VERIFIED] by direct source read)

```ts
// src/lib/notion.ts
export interface BlogPost {
  id: string; slug: string; title: string; description: string;
  published: boolean; date: string; tags: string[];
  cover: string | null; emoji: string | null; lastEdited: string;
}
```
`date` is the Notion "Date" property's ISO string, or `""` if unset (writing/page.tsx's own
`groupPostsByYear()` defensively skips falsy dates — the same defensive skip is needed here when
sorting the merged terminal list).

```ts
// src/lib/rss/substack.ts
export type MontyMonthlyIssue = {
  title: string; link: string; pubDate: string; // RFC-822 string, e.g. "Wed, 02 Jul 2026 12:00:00 GMT"
  description: string; // hand-written issue subtitle, HTML-stripped/entity-decoded
  thumbnail: string | null;
};
```

**Both shapes carry a comparable date** — `BlogPost.date` (ISO 8601) and
`MontyMonthlyIssue.pubDate` (RFC-822) both parse cleanly via `new Date(...)`, exactly as
`writing/page.tsx`'s `formatIssueDate()` and `groupPostsByYear()` already do independently for
each source. **Neither shape carries a read-time field** — both require a derived value.

### Read-time: use `estimateReadingTime`, but know what it actually is

```ts
// src/utils/reading-time.ts — [VERIFIED] both functions read in full
export function calculateReadingTime(blocks: BlockObjectResponse[]): number { /* real Notion-block word count */ }
export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
```

`grep -rn "estimateReadingTime(" src` returns **only its own definition line** — zero call sites
anywhere in the repo. The UI-SPEC's claim that `writing/page.tsx` "already uses" this pattern is
incorrect: that page calls `calculateReadingTime(await getBlocks(post.id))` (a real per-post
Notion API round-trip, `writing/page.tsx:96-107`), which the homepage must **not** replicate for
Phase 21 — fetching `getBlocks()` for 5 merged rows would add up to 5 extra Notion API calls to
every homepage render (mitigated by ISR, but still the wrong call for a "quiet index" page).
`estimateReadingTime(post.description)` / `estimateReadingTime(issue.description)` is the correct,
already-`REQUIREMENTS.md`-sanctioned choice ("Future Requirements (deferred): a real reading-time
value from Notion... rather than a computed estimate" — i.e. the estimate is the explicitly
accepted interim state, not a gap this phase must close).

### Merge algorithm for the terminal Writing band (HP-03, 5-row cap)

1. Map `posts: BlogPost[]` → `{ date: post.date, title: post.title, readTime: estimateReadingTime(post.description), href: /blog/${post.slug} }`, skipping entries with falsy `date`.
2. Map `montyIssues: MontyMonthlyIssue[]` → `{ date: issue.pubDate, title: issue.title, readTime: estimateReadingTime(issue.description), href: issue.link }`.
3. Concatenate, sort descending by `new Date(date).getTime()`, `slice(0, 5)`.
4. Format each row's date as `YYYY-MM` per UI-SPEC §3 (not the `/writing` page's own "July 2, 2026"
   long format — that's a different component's convention).

### ISR / caching

`page.tsx` already sets `export const revalidate = 1800;` (30 min), matching `/writing` and
`/building`. Adding `getPublishedPosts()` to the same async function body does not change this —
it's one more `await` inside the same server-rendered, ISR-cached function. No new caching
configuration needed.

## Test Surface

`src/__tests__/home/` currently contains 5 files; `src/__tests__/pages/home.test.tsx` is
`it.todo`-only (2 stubs, no real assertions — safe, needs no action).

| Test file | Subject | Fate this phase | Notes |
|---|---|---|---|
| `explorative-homepage.test.tsx` | `explorative-homepage.tsx` (orchestrator) | **Full rewrite required** | Currently asserts `#building`/`#writing` carry `.band-dark` className and `#work`/`#loves` do **not** — this is the *exact inverse* of HP-04's success criterion (one continuous ground, zero `.band-dark` anywhere). Every one of its 6 `it()` blocks needs new assertions for the post-rebuild band structure |
| `section-building.test.tsx` | `section-building.tsx` | **Full rewrite required** | Mocks `RailBox` (deleted) and asserts a `.shadowed.slide.from-left` photo container (deleted per MS-01) — none of its assumptions survive the rebuild |
| `section-work.test.tsx` | `section-work.tsx` | **Delete the file** | `section-work.tsx` itself is deleted; this test imports it directly (not mocked) and will fail module resolution if left in place |
| `section-loves.test.tsx` | `section-loves.tsx` | **Partial edit** | Mocks `RailBox` (needs updating to the new `.lbl` label pattern or a header assertion instead), but its core branching logic (Pinboard-vs-PhotoMarquee) is unchanged by this phase and should be preserved |
| `pinboard.test.tsx` | `pinboard.tsx` | **Do not touch** | Out of scope per the hard fence |
| `src/__tests__/pages/home.test.tsx` | (stub) | No action needed | Both cases are `it.todo` — zero real assertions to break or fix; a good Wave 0 candidate to fill in with real Playwright/RTL coverage once the new sections exist |
| `src/__tests__/pages/projects.test.tsx:188` | `/projects` page (unrelated route) | **Do not touch, do not fix** | Confirmed still the sole pre-existing failure this session (`182 passed, 16 todo, 1 failed`) — belongs to Phase 19, not this phase |
| `src/__tests__/components/footer.test.tsx:50` | `site-footer.tsx` | **Watch, don't necessarily edit** | Asserts `a[href="/#loves"]` exists on the footer (a site-wide component, not touched this phase) — this test doesn't render the homepage, so it stays green regardless of what this phase does, but it's the reason `id="loves"` must survive on the homepage's own Things I Love band (see Fragment-Link Contract) |

**Wave 0 gap:** No test file today directly unit-tests `hero.tsx`, `sticky-nav.tsx`,
`scroll-reveals.tsx`, `photo.tsx`, `photo-marquee.tsx`, `monty-monthly-carousel.tsx`, or
`rail-box.tsx` in isolation — all prior coverage of these came only via the orchestrator test's
mocks. Since `hero.tsx`, the new Building index, and the new terminal Writing list are the
phase's primary deliverables (HP-01/02/03), each needs a **new**, dedicated test file — there is
no existing test to "update," only orchestrator-level mocks to replace.

## Motion Teardown Mechanics

### Wiring mechanism (confirmed, not GSAP/Motion for scroll — plain IO)

`scroll-reveals.tsx` is a headless `"use client"` component (`useEffect`, returns `null`). It is
**not** built on `motion/react` or GSAP — it's a hand-rolled `IntersectionObserver`:

```ts
// current selector — src/components/home/scroll-reveals.tsx:22
const selector = ".reveal, .slide, .shadowed";
// current IO config — line 46
{ threshold: 0, rootMargin: "0px 0px -38% 0px" }
```

Two `prefers-reduced-motion` paths exist today (belt-and-suspenders, both must be updated
together, both already scoped correctly):
1. **JS guard** inside `scroll-reveals.tsx`: `window.matchMedia("(prefers-reduced-motion: reduce)")`
   → marks every target `.in` immediately, skips the observer entirely.
2. **CSS guard** in `globals.css` (two copies — a `body.no-motion` JS-togglable escape hatch at
   lines 1152-1168, and a `@media (prefers-reduced-motion: reduce)` block at lines 1170-1188) —
   both currently reference `.reveal, .slide` and `.kenburns, .breathe, .blob, .pslide,
   .marquee .track, .hero-ticker .track`.

### Where each killed animation lives (current line numbers, `globals.css`, verified this session)

| Animation | Selector / keyframe | Current lines |
|---|---|---|
| Hero link marquee | `.hero-ticker`, `.hero-ticker .track` (uses `@keyframes slide`) | 491-529 (rule block); `@keyframes slide` at 478-481 |
| Pulsing status dot | `.statustag .dot { animation: pulse 2s ... }` | 446-466 (`.statustag` block); `@keyframes pulse` at 473-476 |
| Photo ken-burns | `.kenburns { animation: kb 22s ... }` | 1141-1143; `@keyframes kb` at 482-485 |
| Photo breathe | `.breathe { animation: breathe 7s ... }` | 1144-1146; `@keyframes breathe` at 486-489 |
| Hero portrait crossfade (not named in MS-01 but dies with the hero rebuild) | `.pslide`, `.pcarousel`, `@keyframes pfade` | 291-355 |
| Slide-in-from-side reveals | `.slide`, `.slide.from-right`, `.slide.in` | 1117-1128 |
| Shadow-settle pairing | `.shadowed .photo/.title-card`, `.shadowed.in ...` | 1132-1140 |
| Light/dark band slam | `.band.band-dark, .band-dark { background: #000000; ... }` | 203-212 |
| PhotoMarquee's own loop (stays as a component, loses its animation per UI-SPEC) | `.marquee .track { animation: slide 30s ... }` | 735-739 |

**No selector collision risk:** `@keyframes slide` is shared by `.hero-ticker .track` (deleted) and
`.marquee .track` (kept, but UI-SPEC strips its `animation` property so the shared keyframe becomes
fully unreferenced once both are done — safe to delete `@keyframes slide` too, or leave it dormant).
`@keyframes scroll` (line 125) is a **different**, unrelated keyframe consumed only by
`src/components/v3/marquee.tsx` via an inline Tailwind arbitrary value — confirmed zero overlap.

### The one survivor — retune spec (sketch's reference values, not the current shipped values)

| Property | Current (`globals.css:1107-1111`) | Target (sketch `.fade`) |
|---|---|---|
| `transform` | `translateY(30px)` | `translateY(14px)` |
| `transition` duration | `0.8s` | `0.7s` |
| easing | `var(--ease-out)` = `cubic-bezier(0.22, 1, 0.36, 1)` | `cubic-bezier(0.22, 0.61, 0.36, 1)` |
| IO `threshold` | `0` | `0.05` |
| IO `rootMargin` | `-38%` bottom | `-8%` bottom |

This is a **deliberate correction**, not preservation — UI-SPEC explicitly calls out the sketch's
reference implementation as authoritative over the currently-shipped `.reveal` values.

### Reduced-motion after teardown

`.reveal`'s reduced-motion guard (both the `body.no-motion` and `@media` paths) stays exactly as
architected — narrow the selector list from `.reveal, .slide` down to `.reveal` alone, and the
animation-kill list from `.kenburns, .breathe, .blob, .pslide, .marquee .track, .hero-ticker .track`
down to whatever of those classes still exist post-teardown (likely just `.blob`, if that's used
elsewhere — grep before pruning the full list, since some entries like `.blob` were not found as
consumed anywhere in `home/` during this research and may already be dead from an earlier phase).
Row-invert hover/focus (150ms `background-color`/`color` transitions per UI-SPEC) are **not**
ambient motion and correctly need no reduced-motion guard — UI-SPEC's Accessibility Contract point
3 already states this explicitly.

## Pinboard Boundary (read-only reconnaissance, not a design task)

`pinboard.tsx` (749 lines, `"use client"`) is fed exactly two props by `section-loves.tsx`:
`items: LoveItem[]` and `categoryOrder: string[]`. `section-loves.tsx`'s only in-scope obligation
is to keep passing these two props unchanged and keep rendering `<Pinboard items={items}
categoryOrder={categoryOrder} />` when `items.length > 0` (else the `<PhotoMarquee>` fallback).
The band's surrounding chrome (the `RailBox`/`.lbl` header, the `<h2>` heading text) is in scope
and safe to restyle to the new mono `.lbl` pattern — it lives in `section-loves.tsx`, not
`pinboard.tsx`. Every one of `pinboard.tsx`'s own CSS rules (`.pb-*`, `.pinboard*`, `SWATCHES`)
is out of scope; Phase 20 already converted the pinboard's *structural* colors to mono tokens
(`--color-invert` etc.) — only the `SWATCHES` array and `.pb-frame--cream`/note-panel color remain
Vermilion-shaped placeholders, reserved for Phase 22.

## Common Pitfalls

### Pitfall 1: Deleting `section-work.tsx` without deleting its test file
**What goes wrong:** `section-work.test.tsx` does `await import("@/components/home/section-work")`
directly (not mocked) in 9 separate `it()` blocks — if the source file is deleted but the test
file isn't, the entire suite fails to resolve the module.
**How to avoid:** delete `src/__tests__/home/section-work.test.tsx` in the same task/commit as
`section-work.tsx`.

### Pitfall 2: Losing the `id="loves"` anchor
**What goes wrong:** `site-footer.tsx` (rendered on every route) links to `/#loves`; a rebuilt
Things I Love band without that exact `id` silently breaks a site-wide footer link with no build
error — only a runtime "jumps to top of page" symptom a human might not notice in a quick preview
pass.
**How to avoid:** carry `id="loves"` onto whatever element wraps the rebuilt Things I Love band.
`footer.test.tsx` does not catch this (it doesn't render the homepage), so it must be caught by
either a homepage-side test asserting the id, or manual QA.

### Pitfall 3: Assuming `estimateReadingTime` has a proven call pattern to copy
**What goes wrong:** the UI-SPEC's own text ("matching writing/page.tsx's own documented D-09
pattern") points at a call site that doesn't exist. A planner or executor grepping for "how does
the codebase currently call estimateReadingTime" will find nothing and may either invent a
different (more expensive) reading-time strategy or waste time looking for a nonexistent
reference implementation.
**How to avoid:** treat `estimateReadingTime(text: string): number` as a pure, already-correct,
already-typed utility to call directly — `estimateReadingTime(post.description)` /
`estimateReadingTime(issue.description)` — no further research needed, it just has never been
wired to a call site before this phase.

### Pitfall 4: Orphaning CSS classes with no cleanup path
**What goes wrong:** `.beat`, `.beat-grid`, `.work-grid`, `.prometheus-shot`, `.rail`,
`.rail-box*`, `.mm-*` (carousel classes), `.hero-ticker*`, `.statustag*`, `.pcarousel`/`.pslide*`
are all confirmed (grep-verified) to have **zero consumers outside `src/components/home/`** once
this phase's rebuilt files stop referencing them — CONTEXT.md's "leave no dead homepage components
behind" discretion applies equally to CSS, not just `.tsx` files, or `globals.css` accumulates
~150+ lines of unreachable rules.
**How to avoid:** treat CSS pruning as part of each component's own task, not a separate cleanup
pass at the end — easy to lose track of which classes became orphaned by which specific edit if
deferred.

### Pitfall 5: `BlogPost.date` can be an empty string
**What goes wrong:** `date: dateProp?.type === "date" ? (dateProp.date?.start ?? "") : ""` in
`src/lib/notion.ts` — a post with no Notion "Date" property set yields `date: ""`, and
`new Date("")` is `Invalid Date` (`getTime()` → `NaN`). Sorting the merged terminal list by
`new Date(date).getTime()` without filtering these out will silently mis-sort or throw depending
on the sort comparator.
**How to avoid:** filter posts with falsy `date` before merging, exactly as
`writing/page.tsx`'s own `groupPostsByYear()` already does (`if (!post.date) continue;`).

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + `@testing-library/react` + `jsdom` |
| Config file | `vitest.config.ts` (repo root) — `include: ['src/**/*.test.{ts,tsx}']`, alias `@` → `src/` |
| Quick run command | `npx vitest run src/__tests__/home/` (homepage-scoped, fast) |
| Full suite command | `npx vitest run` |

No `"test"` script exists in `package.json` — invoke `npx vitest run` directly (confirmed working,
verified this session: 5.78s wall clock for the full 199-test suite).

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HP-01 | No `<Image>`/`<img>`/photo carousel renders within the hero subtree | unit (DOM query) | `npx vitest run src/__tests__/home/hero.test.tsx` | ❌ Wave 0 — new file |
| HP-01 | Hero copy matches locked UI-SPEC text exactly (H1, subtitle, meta row) | unit (`screen.getByText`) | same file as above | ❌ Wave 0 |
| HP-02 | Building rows render zero-padded 3-digit numerals (`001`, `002`...) | unit (regex on rendered text, e.g. `/^\d{3}$/`) | `npx vitest run src/__tests__/home/section-building.test.tsx` | ⚠️ exists but fully invalidated — rewrite |
| HP-02 | Row hover/focus applies the full-row invert class/style (not tight-row) | unit (assert `::before`-bearing wrapper class present, or jsdom `getComputedStyle` on the invert overlay element) | same file | ⚠️ rewrite |
| HP-03 | Terminal list renders exactly ≤5 rows, sorted newest-first, merged from both sources | unit (mock both fetch functions, assert row count + order) | `npx vitest run src/__tests__/home/section-writing.test.tsx` (new component name TBD by planner) | ❌ Wave 0 — new file |
| HP-03 | No `border` / box wrapper around the terminal block (only the header `border-bottom`) | unit (`container.querySelector` for an absence — assert no element with a 2px box-style class exists) | same file | ❌ Wave 0 |
| HP-04 | Zero elements anywhere in the rendered homepage carry `band-dark` (or equivalent dark-ground) class | unit (`container.querySelectorAll('[class*="band-dark"]')` length === 0) on `explorative-homepage.tsx` | `npx vitest run src/__tests__/home/explorative-homepage.test.tsx` | ⚠️ exists, assertions currently assert the *opposite* — full rewrite |
| HP-05 | No element with subscribe/CTA semantics (button, `.cta` class, or link containing "Subscribe") renders above the footer | unit (`screen.queryByText(/subscribe/i)` returns null on the homepage render tree, excluding `<SiteFooter>` which isn't rendered by the homepage component itself) | `explorative-homepage.test.tsx` | ⚠️ rewrite |
| MS-01 | `globals.css` no longer defines `.hero-ticker`, `.statustag .dot { animation: pulse`, `.kenburns { animation: kb`, `.slide { ` (source-level, not DOM) | grep on source | `grep -c "hero-ticker\|animation: pulse\|animation: kb\|^\.slide {" src/app/globals.css` — expect 0 for each pattern once cleanup is complete | N/A — grep-based, not a test file |
| MS-01 | `scroll-reveals.tsx`'s `IntersectionObserver` selector no longer includes `.slide` or `.shadowed` | unit or grep | `grep -n 'querySelectorAll' src/components/home/scroll-reveals.tsx` should show only `.reveal` | ❌ Wave 0 — no direct test exists for this file; grep is an acceptable interim gate, but a dedicated `scroll-reveals.test.tsx` mocking `IntersectionObserver` would be stronger |
| MS-02 | `.reveal`'s CSS matches the sketch's retuned values (700ms, translateY(14px), the sketch's cubic-bezier, threshold 0.05, rootMargin -8%) | grep / manual diff against `globals.css:1107-1111` and `scroll-reveals.tsx:46` | source grep, not a runtime test (jsdom cannot assert computed CSS transition timing meaningfully) | N/A |
| MS-02 | After teardown, no element in the homepage subtree carries `.kenburns`, `.breathe`, `.slide`, or `.shadowed` classes | unit (`container.querySelectorAll('.kenburns, .breathe, .slide, .shadowed')` length === 0) | new/updated test on `explorative-homepage.tsx` or a dedicated `motion-audit.test.tsx` | ❌ Wave 0 — recommend a small dedicated audit test, since this is the single most mechanically-checkable MS-01/02 gate |

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/home/` (fast, homepage-scoped)
- **Per wave merge:** `npx vitest run` (full suite — must stay at `182 passed, 16 todo, 1 failed`
  with the 1 failure being *only* `projects.test.tsx:188`; any other failure is a real regression)
- **Phase gate:** full suite green (modulo the known pre-existing failure) before
  `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/home/hero.test.tsx` — new file, covers HP-01 (no photo above fold, exact copy)
- [ ] `src/__tests__/home/section-writing.test.tsx` (or planner's chosen filename) — new file,
      covers HP-03 (merge/sort/cap logic, no-frame assertion)
- [ ] Full rewrite of `src/__tests__/home/explorative-homepage.test.tsx` — covers HP-04/HP-05
      (band structure, absence of `.band-dark`, absence of subscribe CTA)
- [ ] Full rewrite of `src/__tests__/home/section-building.test.tsx` — covers HP-02 (numeral
      format, row content, hover-invert markup)
- [ ] Deletion of `src/__tests__/home/section-work.test.tsx` (its subject is deleted)
- [ ] Recommended: a small dedicated `src/__tests__/home/motion-audit.test.tsx` asserting the
      full rendered homepage tree contains none of `.kenburns`/`.breathe`/`.slide`/`.shadowed`/
      `.hero-ticker`/`.statustag` — cheapest possible mechanical MS-01 gate, avoids relying on
      grep alone
- [ ] Partial edit of `src/__tests__/home/section-loves.test.tsx` — update the `RailBox` mock to
      match whatever header pattern replaces it; core Pinboard/PhotoMarquee branching assertions
      can be kept as-is

## Package Legitimacy Audit

Not applicable — this phase installs no new npm packages. Every function/component used (`next/image`,
`next/link`, `motion/react`'s `useReducedMotion`, the existing Notion/RSS libs) is already a
declared dependency, already in use elsewhere in the codebase, and unaffected by this phase's
scope.

## Sources

### Primary (HIGH confidence — direct file reads and greps against the live `v4-mono` branch, 2026-07-21)
- `src/app/page.tsx`, all 13 files in `src/components/home/`, `src/app/globals.css` (full 1496
  lines, targeted ranges read in full)
- `src/lib/notion.ts` (`BlogPost`, `getPublishedPosts`), `src/lib/notion-projects.ts` (`Project`,
  `getFeaturedProjects`), `src/lib/rss/substack.ts` (`MontyMonthlyIssue`,
  `fetchMontyMonthlyIssues`), `src/utils/reading-time.ts`
- `src/app/writing/page.tsx` (reading-time call pattern verification), `src/components/layout/site-footer.tsx`
  (`ELSEWHERE`/`EXPLORE` arrays), `src/components/v3/marquee.tsx` (collision-risk check)
- All 5 files in `src/__tests__/home/`, `src/__tests__/pages/home.test.tsx`,
  `src/__tests__/animations/scroll-reveal.test.tsx`
- `vitest.config.ts`, `.planning/config.json`, live `npx vitest run` execution (182 passed, 16
  todo, 1 failed — matches STATE.md's documented baseline exactly)
- `.planning/phases/21-mono-homepage-rebuild/21-CONTEXT.md`,
  `.planning/phases/21-mono-homepage-rebuild/21-UI-SPEC.md` (locked design contract, read in full)
- `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`,
  `.planning/phases/20-mono-token-foundation/20-PATTERNS.md` (Phase 20's pre-rebuild line-number
  map — cross-referenced against this session's own post-Phase-20 line reads to produce the
  current, accurate line numbers used throughout this document)

### Secondary / Tertiary
None used — no web research was needed for this phase; every question was answerable from the
repo itself.

## Metadata

**Confidence breakdown:**
- Current-state map / blast radius: HIGH — every claim grep-verified against the actual `v4-mono`
  branch this session, not inferred from documentation
- Data flow: HIGH — all three/four data shapes read directly from source; the one UI-SPEC
  discrepancy (reading-time call pattern) was caught and corrected by direct verification
- Motion teardown line numbers: HIGH for the current (this-session) line numbers; the UI-SPEC's
  own line numbers are pre-Phase-20 and were superseded during this research — planner should use
  this document's line numbers, not the UI-SPEC's
- Test surface: HIGH — every test file in `src/__tests__/home/` and the two adjacent files
  (`pages/home.test.tsx`, `pages/projects.test.tsx`) read in full

**Research date:** 2026-07-21
**Valid until:** Until the next commit to `src/components/home/`, `src/app/globals.css`, or
`src/__tests__/home/` on the `v4-mono` branch — this document describes exact current-state line
numbers and file contents, which this phase itself will change. Re-verify line numbers if
significant time passes between this research and plan execution.
