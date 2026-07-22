---
phase: quick-260722-wov
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/home/hero.tsx
  - src/__tests__/home/hero.test.tsx
  - src/components/v3/contact-row.tsx
  - src/__tests__/components/contact-row.test.tsx
  - src/components/home/section-writing.tsx
  - src/__tests__/home/section-writing.test.tsx
  - src/app/page.tsx
  - src/components/home/explorative-homepage.tsx
  - src/components/editorial/essay-grid.tsx
  - src/__tests__/components/essay-grid.test.tsx
  - src/app/writing/page.tsx
  - src/components/v3/newsletter-carousel.tsx
  - src/components/home/sticky-nav.tsx
  - src/__tests__/components/sticky-nav.test.tsx
  - src/app/globals.css
  - .planning/STATE.md
autonomous: true
requirements: [QUICK-260722-wov]

must_haves:
  truths:
    - "On /, at scrollY 0 the sticky nav has no .show class and is not visible; after the visitor scrolls past a small threshold it gains .show and curls into view"
    - "The hero section fills at least one full viewport height and its content is vertically centered, not top-pinned"
    - "The homepage Writing log (SectionWriting) renders only blog posts; Monty Monthly issues never appear there"
    - "On /contact, hovering (or keyboard-focusing) a row inverts the numeral, title, handle, and action word together, matching the row's own bg/text invert"
    - "In the hero paragraph, exactly one link exists with the text \"we'll get along.\" pointing to /contact; the words \"If you like these as well, \" immediately before it are plain text, not part of the link"
    - "On /writing, at most 6 essay cards render initially (regardless of year); when more than 6 posts exist, a visible control reveals the rest grouped by year exactly as before"
    - "On /writing, the Monty Monthly section renders with a section-scale heading, a subtitle, and enlarged carousel cards, not a small h3 footnote"
    - ".planning/STATE.md Accumulated Context records that Phase 21's MS-02 (motion stripped to one opacity fade) is intentionally amended to allow the new nav wave-curl motion"
  artifacts:
    - path: "src/components/home/hero.tsx"
      provides: "Vertically centered hero section; three-line subtitle paragraph with a next/link contact link scoped to \"we'll get along.\" only"
    - path: "src/components/v3/contact-row.tsx"
      provides: "Title div carries group-hover:text-bg, matching the numeral/handle/action siblings"
    - path: "src/components/home/section-writing.tsx"
      provides: "Posts-only Writing log; montyIssues prop and merge logic removed"
    - path: "src/components/editorial/essay-grid.tsx"
      provides: "Client island: capped flat grid (<=6 posts) with a show-all control that reveals the full year-grouped view"
    - path: "src/app/writing/page.tsx"
      provides: "Delegates essay rendering to EssayGrid; Monty Monthly section enlarged to section scale"
    - path: "src/components/home/sticky-nav.tsx"
      provides: "Low, fixed first-scroll reveal threshold (not the old 82%-of-viewport gate)"
    - path: "src/app/globals.css"
      provides: ".stickynav wave-curl transform (perspective + rotateX + back-ease) with a prefers-reduced-motion guard that degrades to instant appearance"
  key_links:
    - from: "src/components/home/hero.tsx paragraph"
      to: "/contact"
      via: "next/link Link wrapping only the phrase we'll get along."
      pattern: "href=\"/contact\""
    - from: "src/components/home/sticky-nav.tsx scroll handler"
      to: "src/app/globals.css .stickynav.show rule"
      via: "setShow(window.scrollY > threshold) toggling the show class"
      pattern: "stickynav\\.show"
    - from: "src/app/writing/page.tsx"
      to: "src/components/editorial/essay-grid.tsx"
      via: "<EssayGrid posts={...} /> replacing the inline year-grouped card-grid JSX"
      pattern: "EssayGrid"
    - from: "src/components/v3/contact-row.tsx title div"
      to: "the row's .group wrapper"
      via: "group-hover:text-bg utility, identical mechanism to the numeral/handle/action spans"
      pattern: "group-hover:text-bg"
---

<objective>
Five independent, user-approved revisions to the homepage, /contact, and /writing surfaces,
captured verbatim in `.planning/todos/pending/260722-homepage-writing-contact-revisions.md`.
Each item commits atomically; none is scope-reduced.

1. Hero paragraph: three sentences, one per line; only "we'll get along." links to /contact.
2. /contact: row titles must invert on hover along with the numeral/handle/action (real CSS
   cascade bug, already diagnosed live in a browser — this plan implements the fix, not a
   re-diagnosis).
3. Homepage Writing section: blog posts only, Monty Monthly issues dropped.
4. /writing: essay grid capped to roughly two rows with a click-to-expand control that reveals
   the rest grouped by year (unchanged grouping in the expanded view); Monty Monthly becomes a
   full dedicated section, not a small h3 footnote.
5. Homepage: nav hidden at load, hero vertically centered, nav curls into view like a wave on
   first scroll. This is an intentional, Monty-approved amendment to Phase 21's closed MS-02
   requirement ("the only surviving scroll motion is a slow opacity fade-up") — recorded as such,
   not silently contradicted.

Purpose: ship Monty's post-Phase-21 spoken revisions before they're lost to another context
clear (the first round already was).

Output: five atomic commits, one per item, each with its own test coverage. Global verify at
the end confirms no regressions beyond this session's own changes.

Task order is cheapest-and-most-contained first: hero copy -> contact hover -> homepage writing
filter -> /writing expand + bigger newsletter -> nav/hero/curl (touches the most files, carries
the roadmap-amendment bookkeeping, done last).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md

Baseline test state, measured live before this plan (not the stale "one pre-existing failure"
note some older docs still repeat): `npx vitest run` = 198 passed, 0 failed, 16 todo. Any new
failure after this plan's tasks is a regression from THIS work, full stop.

Brand rules that apply to every task below: pure black/white, zero accent hue, no gradients,
hard corners (radius 0), no em dashes in any user-visible string.

Already-diagnosed root cause for item 2 (do not re-diagnose, just fix): `src/app/globals.css`
has zero `@layer` blocks, so the `a { color: inherit }` rule at line 66 is unlayered CSS and
beats every Tailwind utility (which lives in `@layer utilities`) regardless of specificity, in
Tailwind v4's cascade-layer model. That is why `hover:text-bg` on the `<a>` in
`contact-row.tsx` never actually recolors the `<a>` itself or anything that merely inherits from
it — but it's also why the numeral/handle/action `<span>` elements already work: they carry
their OWN direct `group-hover:text-bg` utility, which has no competing unlayered rule targeting
a `<span>` anywhere in the stylesheet, so it wins normally. The title `<div>` at
contact-row.tsx:57 is the one element in the row missing that same direct treatment.
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Hero paragraph — line-per-sentence + scoped contact link (item 5 of the todo, "hero copy")</name>
  <files>src/components/home/hero.tsx, src/__tests__/home/hero.test.tsx</files>
  <behavior>
    - The hero subtitle renders exactly three visually distinct lines, each starting a new line:
      "Founder of Prometheus, an applied AI company." / "I love technology, biology, and
      self-improvement." / "If you like these as well, we'll get along." (rendered apostrophe is
      the typographic ’, matching the existing &rsquo; already in the file).
    - Exactly one link exists with accessible name "we'll get along." (typographic apostrophe),
      href="/contact", and it is an internal next/link (no target/rel attributes).
    - The text "If you like these as well, " (with trailing space) is NOT inside that link's `a`
      element — only "we'll get along." is inside the `<a>`; the preceding words remain outside it.
    - The first two sentences render with no link anywhere inside them.
  </behavior>
  <action>
Replace the single flowed `<p>` at hero.tsx:28-32 with a `<p>` containing three inline `<span
className="block">` children (a `span` with `display:block` is valid inside a `p` and keeps this
a single semantic paragraph while forcing each sentence onto its own line, avoiding a `<br/>`
hack): span 1 = "Founder of Prometheus, an applied AI company.", span 2 = "I love technology,
biology, and self-improvement.", span 3 = "If you like these as well, " followed by a next/link
`Link` (add `import Link from "next/link";` — the existing `Image` import stays) with
`href="/contact"` and className `"prometheus-link"`. Reuse `prometheus-link` verbatim: it is
already defined in globals.css (an orphaned, zero-consumer class from the pre-Phase-21 hero) and
does exactly what's needed here — `color: inherit` + `text-decoration: none` at rest,
`text-decoration: underline` on hover only, keyed off ordinary CSS specificity (`.prometheus-link:hover`
beats the unlayered `a{color:inherit}` element rule because a class+pseudo-class selector has
higher specificity than a bare element selector, so this is unaffected by the item-2 cascade
bug). Do NOT use a Tailwind `hover:` utility class for this link's styling — that would hit the
exact same unlayered-CSS bug being fixed in Task 2, independently of task execution order. The
link's text content is exactly "we&rsquo;ll get along." (period inside the link). Keep the
existing `reveal` class and all outer `<p>` typography classes (font-sans font-light text-base
leading-[1.6] text-text-dim max-w-[46ch] mt-6) on the outer `<p>`, not on the spans.

In hero.test.tsx, replace the single "renders the subtitle with the exact copy" test (which does
a whole-string `screen.getByText`) with: (a) a test asserting each of the three sentences renders
as separate text (query each span's text individually, not as one merged string); (b) a test
using `screen.getByRole("link", { name: "we’ll get along." })` asserting
`getAttribute("href") === "/contact"` and `getAttribute("target")` is null; (c) a test asserting
the phrase "If you like these as well," is present in the document but that the link element's
own `textContent` does not include it (i.e. the link's text is only "we’ll get along.").
</action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/home/hero.test.tsx</automated>
  </verify>
  <done>hero.test.tsx passes with the new per-sentence/link assertions; the rendered hero shows three lines and a single scoped /contact link reading "we'll get along."</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: /contact row title hover-invert fix (item 4 of the todo, already diagnosed live)</name>
  <files>src/components/v3/contact-row.tsx, src/__tests__/components/contact-row.test.tsx</files>
  <behavior>
    - The title `<div>` (currently at contact-row.tsx:57) carries a `group-hover:text-bg` utility
      class directly on itself, exactly like the numeral, handle, and action elements already do.
    - No other row element's classes change.
  </behavior>
  <action>
Fix chosen: (a) targeted, not (b) structural. Rationale: the numeral/handle/action spans already
prove the direct-utility approach works today (they don't rely on the `<a>`'s own broken
color-inherit chain); giving the title div the identical treatment is a one-line, zero-blast-radius
fix that requires no sitewide cascade-layer migration or cross-route regression sweep. Residual
risk, recorded here rather than silently left implicit: the underlying bug class (unlayered CSS
in globals.css beating `@layer utilities`, specifically the bare `a { color: inherit }` rule at
line 66) still exists for any FUTURE `hover:text-*`/`focus:text-*` Tailwind utility applied
directly to an `<a>` element anywhere on the site. Task 1 already had to route around it (used
`.prometheus-link`'s own hand-written CSS instead of a Tailwind utility) rather than depend on
this task's fix. A future dedicated task should wrap globals.css's base-element rules in
`@layer base` and regression-sweep every route's hover states in a real browser; that is out of
scope here.

In contact-row.tsx, wrap the title div's className in the file's existing `cn()` helper (already
imported and used by the numeral/handle/action elements) and add `"group-hover:text-bg"` as a
second argument alongside the existing className string, matching the exact pattern already used
on the numeral span, the handle span, and the action span in this same file.

Create src/__tests__/components/contact-row.test.tsx (new — no test file exists for this
component today). Mock nothing (ContactRow is a plain server component with no next/image or
next/link dependency — it renders a raw `<a>`). Assert: (1) the title div's className string
contains `group-hover:text-bg`; (2) at least 3 other elements in the rendered row (numeral,
handle, action) already carry `group-hover:text-bg` as a non-regressing baseline check;
(3) the row's outer `<a>` carries the `group` class the `group-hover:` variants depend on.
</action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/components/contact-row.test.tsx</automated>
  </verify>
  <done>contact-row.test.tsx passes; the title div's rendered className includes group-hover:text-bg alongside the numeral/handle/action. Recommended (not blocking): spot-check /contact in `npm run dev`, hover the Email row, confirm the title text turns white along with the rest of the row.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 3: Homepage Writing section — blog posts only (item 2 of the todo)</name>
  <files>src/components/home/section-writing.tsx, src/__tests__/home/section-writing.test.tsx, src/app/page.tsx, src/components/home/explorative-homepage.tsx</files>
  <behavior>
    - SectionWriting no longer accepts or renders anything derived from Monty Monthly issues.
    - Given a mix of posts, only post-derived rows render (there is no montyIssues prop anymore).
    - Existing posts-only behaviors are unchanged: skip falsy-date posts, YYYY-MM date format,
      real-reading-time-over-estimate preference, capped at 5, "all posts ->" link to /writing,
      no target/rel on the internal /blog/{slug} links.
  </behavior>
  <action>
In section-writing.tsx: remove the `montyIssues` prop entirely from the Props type and the
function signature/destructure; remove the `MontyMonthlyIssue` import; remove the `issueRows`
construction block; remove the `external` field from the `Row` type and from row construction
(every remaining row is an internal blog post). In the JSX, render each row's `<a>` with a plain
`href={row.href}` and no target/rel conditional (delete the `{...(row.external ? {...} : {})}`
spread entirely). Keep the `.sort(...).slice(0, 5)` on the remaining posts-only rows array
(defensive, matches how this component is unit-tested with arbitrary post arrays). Update the
file's top JSDoc comment: it currently describes merging posts and Monty Monthly issues —
rewrite it to describe posts-only behavior and note (one line, referencing quick task
260722-wov item 2) that the merge was intentionally removed; Monty Monthly still appears
elsewhere (the /writing page's own dedicated section, enlarged in Task 4 of this same plan).

In explorative-homepage.tsx: remove `montyIssues` from the `Props` type, remove the
`MontyMonthlyIssue` import, remove the `montyIssues = []` destructure, and stop passing
`montyIssues={montyIssues}` to `<SectionWriting>`. Leave every other prop (`projects`, `posts`,
`loves`, `loveCategories`, `readingTimes`) untouched.

In page.tsx: remove the `montyIssues` fetch (the `fetchMontyMonthlyIssues(4)` call and its
try/catch block), remove the `MontyMonthlyIssue`/`fetchMontyMonthlyIssues` import, and stop
passing `montyIssues={montyIssues}` to `<ExplorativeHomepage>`. Update the file's top doc
comment, which currently says fetches include "the latest Monty Monthly issues from the Substack
RSS feed (carousel cards)" — that fetch no longer exists on the homepage; remove that line from
the comment. Leave the featured-projects, loves, and posts/readingTimes fetches untouched —
/writing has its own independent Substack fetch and is not affected by this change.

In section-writing.test.tsx: delete the "uses each issue's own reading time from the feed body"
test and the "links Monty Monthly rows to issue.link with target=_blank rel=noopener noreferrer"
test (both test removed functionality). Rewrite the "merges posts and issues, sorted newest-first
across sources, capped at 5" test to be posts-only: build 6+ posts with distinct dates, assert
exactly 5 rows render, newest-first, by post title alone (no issues involved). Leave every other
test (empty state, skip-falsy-date, YYYY-MM format, estimate/real reading time, blog-row
href/no-target-rel, "all posts ->" link, no box/frame wrapper) as-is — they only ever exercised
posts and remain valid unchanged.
</action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/home/section-writing.test.tsx src/__tests__/home/explorative-homepage.test.tsx src/__tests__/pages/home.test.tsx</automated>
  </verify>
  <done>All three test files pass. section-writing.tsx has no montyIssues prop, no MontyMonthlyIssue import, and no external-link branch. page.tsx and explorative-homepage.tsx no longer fetch or thread montyIssues on the homepage path.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 4: /writing — capped grid + click-to-expand, bigger Monty Monthly (item 3 of the todo)</name>
  <files>src/components/editorial/essay-grid.tsx, src/app/writing/page.tsx, src/components/v3/newsletter-carousel.tsx, src/__tests__/components/essay-grid.test.tsx</files>
  <behavior>
    EssayGrid (client component), given a flat `posts` array (already sorted newest-first by the
    caller, each carrying a `year` field derived from its date):
    - 6 or fewer posts: renders every post in one flat, ungrouped `.card-grid` (no year headings,
      no expand control) — identical visual output to today's per-year grid collapsed onto one
      list when there just aren't many posts.
    - More than 6 posts: initially renders only the first 6 (newest) in the same flat ungrouped
      grid, plus a "show all essays (N)" button below it, where N is the total post count.
    - Clicking the button switches to the full year-grouped view: a `YearBlock` per distinct year
      (descending), each wrapping a `.card-grid` of that year's posts, with a `RuleStrong`
      divider between consecutive year blocks — this is exactly today's pre-existing
      year-grouped layout, just deferred behind a click. The button disappears once expanded.
    - Zero posts: renders "No essays yet. Check back soon." (same copy as today), no grid at all.
    - Each Card's `coverSrc`, `coverAlt`, `readingTime`, and `kicker` (post.tags?.[0] ?? "Essay")
      derive identically in both the collapsed and expanded views. `titleCardField` alternates
      `i % 2 === 0 ? "paper" : "ink"` using the LOCAL index within whichever list is currently
      rendering that card (the flat list in collapsed view; each year's own sub-list, restarting
      at 0 per year, in the expanded view) — this matches today's existing per-year alternation
      exactly, so no visual alternation pattern changes for posts that were already visible.
  </behavior>
  <action>
Create src/components/editorial/essay-grid.tsx as a new `"use client"` component. Export a type
`EssayGridPost = { id: string; slug: string; title: string; description: string; tags?: string[];
cover: string | null; year: number; readingTime?: number }` and `export function EssayGrid({
posts }: { posts: EssayGridPost[] })`. Internal constant `INITIAL_VISIBLE = 6` — roughly two rows
at the grid's own `repeat(auto-fill, minmax(280px,1fr))` breakpoint on a typical desktop content
width (~3 columns); document in a comment that this is an approximation since auto-fill column
count varies by viewport, matching the todo's own "roughly two rows" wording. Use `useState` for
an `expanded` boolean (default false). Empty-state branch returns the "No essays yet. Check back
soon." paragraph (reuse the exact classes from the current inline empty state in writing/page.tsx:
`text-center py-12 text-[var(--color-text-muted)]`). Collapsed branch: wrap a `.card-grid` (same
className as today) in a `-mx-6 md:-mx-40` bleed div (matching writing/page.tsx's existing
wrapper), render `posts.slice(0, INITIAL_VISIBLE)` as `Card` components (import `Card` from
`@/components/v3/card`) with `href={/blog/${post.slug}}`, `title={post.title}`,
`blurb={post.description}`, `kicker={post.tags?.[0] ?? "Essay"}`,
`coverSrc={post.cover ? /api/notion-cover?pageId=${post.id} : undefined}`,
`coverAlt={post.cover ? post.title : undefined}`, `readingTime={post.readingTime}`,
`titleCardField={i % 2 === 0 ? "paper" : "ink"}`; below the grid, if `posts.length >
INITIAL_VISIBLE`, render a `<button type="button" onClick={() => setExpanded(true)}>` reading
`show all essays ({posts.length}) →` with understated Tailwind classes (this is a `<button>`, not
an `<a>`, so ordinary `hover:` utilities work fine here — the item-2 cascade bug only affects
anchor elements): something like `mt-8 font-mono text-sm uppercase tracking-[0.08em]
text-text-muted hover:text-text underline underline-offset-4 transition-colors`. Expanded branch:
group `posts` by `year` (a small local `groupByYear` helper mirroring the shape of today's
`groupPostsByYear` in writing/page.tsx, sorted descending), then render a `Fragment` per year with
a `YearBlock` (import from `@/components/editorial/year-block`) wrapping a `.card-grid` of that
year's `Card`s (same Card props as above, `i` reset per year), and a `RuleStrong` (import from
`@/components/editorial/rule-strong`) between consecutive years — port this structure directly
from the JSX currently at writing/page.tsx lines ~137-165.

In writing/page.tsx: delete the local `groupPostsByYear` function and the entire "Year-grouped
card grid of essays" JSX block (currently the `<section className="px-6 md:px-40">` containing
the empty-state ternary and the `yearEntries.map` Fragment). Build a flat `gridPosts:
EssayGridPost[]` from `posts` (filtering out posts with a falsy/unparseable date, same guard
`groupPostsByYear` used today) mapped to `{ id, slug, title, description, tags, cover, year:
new Date(post.date).getUTCFullYear(), readingTime: readingTimes.get(post.id) }`. Replace the
deleted section with `<section className="px-6 md:px-40"><EssayGrid posts={gridPosts} /></section>`.
Update the file's top doc comment to describe the new EssayGrid delegation instead of the removed
inline grouping.

Enlarge the Monty Monthly section in writing/page.tsx: replace the current small `<h3
className="font-mono text-sm uppercase tracking-[0.12em] text-text-dim mb-[18px]">Monty
Monthly</h3>` plus its tight `pb-16` section wrapper with a section-scale treatment: change the
section's className to `"px-6 md:px-40 py-24 md:py-32"`; above the heading add a small mono
eyebrow (`<span className="font-mono text-xs uppercase tracking-[0.12em]
text-text-muted">Newsletter</span>`); change the heading to `<h2 className="font-display text-2xl
md:text-4xl font-extrabold uppercase tracking-[-0.02em] mt-3 mb-4">Monty Monthly</h2>`; add a
one-line subtitle paragraph beneath it (`<p className="font-sans text-base text-text-dim
max-w-[52ch] mb-10">Monthly essays on building, technology, and the texture of an attentive life,
sent straight from Substack.</p>` — no em dash, matches brand copy rules) before the existing
`<NewsletterCarousel issues={carouselIssues} />` call, which is unchanged.

In newsletter-carousel.tsx (used only by /writing — verified no other consumer), enlarge the
cards: change the card's flex-basis from `flex-[0_0_300px]` to `flex-[0_0_420px]`, the card body
padding from `p-[18px]` to `p-[28px]`, and the title's `text-base` to `text-xl`. Leave the
`aspect-[3/2]` cover ratio, scroll-snap behavior, and fallback "MM" glyph untouched.

Create src/__tests__/components/essay-grid.test.tsx (new). Mock `next/image` and `next/link` the
same way card.test.tsx does. Cover: (1) 3 posts render 3 Cards in one flat grid, no expand
button, no YearBlock/year heading text anywhere; (2) 8 posts across two years render exactly 6
Cards initially plus a button reading "show all essays (8)"; (3) clicking that button reveals all
8 posts, both years' labels appear as text, and the button is gone; (4) 0 posts renders "No
essays yet. Check back soon." and zero `.card-grid` elements.
</action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/components/essay-grid.test.tsx src/__tests__/pages/writing.test.tsx</automated>
  </verify>
  <done>essay-grid.test.tsx passes covering collapsed/expanded/empty states. writing.test.tsx (pre-existing, all posts in its fixtures are <=6) passes unmodified. /writing shows at most 6 essays initially with a show-all control, and a section-scale Monty Monthly block with a larger carousel.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 5: Homepage nav wave-curl reveal + centered hero (item 1 of the todo; intentional MS-02 amendment)</name>
  <files>src/components/home/hero.tsx, src/components/home/sticky-nav.tsx, src/app/globals.css, src/__tests__/components/sticky-nav.test.tsx, .planning/STATE.md</files>
  <behavior>
    - StickyNav has no `.show` class at `scrollY === 0` (unchanged from today).
    - StickyNav gains `.show` at a small, fixed scroll threshold (24px) — "on first scroll," not
      the old `window.innerHeight * 0.82` (near-full-viewport) gate.
    - Under `prefers-reduced-motion: reduce`, the show/hide gating still works (hidden at 0,
      shown past threshold) but with zero animated transform — it snaps instantly, no curl.
  </behavior>
  <action>
In sticky-nav.tsx: change the scroll handler's condition from `window.scrollY >
window.innerHeight * 0.82` to `window.scrollY > 24`. Update the component's doc comment, which
currently says "once the user has scrolled past ~82% of the initial viewport height" — rewrite to
describe the new low, fixed first-scroll threshold and reference this quick task (260722-wov,
item 1) as the reason for the change. No other logic in this file changes (the `show` state,
effect, and JSX structure are all unchanged).

In globals.css, replace the `.stickynav` / `.stickynav.show` rules (currently lines ~459-474)
with a wave-curl reveal: `.stickynav` gets `transform-origin: top;` and `transform:
perspective(700px) rotateX(-90deg);` (edge-on, invisible — a 3D hinge fold rather than the old
flat `translateY(-100%)` slide) with `transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64,
1);` (a back-ease that overshoots slightly past 0deg before settling, reading as a wave crest
settling flat rather than a mechanical stop — this overshoot IS the "wave" character, no
additional per-cell stagger is needed). `.stickynav.show` becomes `transform: perspective(700px)
rotateX(0deg);`. Keep `display: none` / the `@media (min-width: 768px) { .stickynav { display:
block; } }` gating and every other existing `.stickynav`/`.stickynav .inner`/`.stickynav
.mk`/`.stickynav ul` rule untouched. Immediately after the `.stickynav.show` rule, add a new
`@media (prefers-reduced-motion: reduce)` block (matching the existing local-block convention
already used for `.drop-bay`/`.drop-logo` just below, rather than editing the single global
reduced-motion block further down the file) containing: `.stickynav { transition: none; transform:
translateY(-100%); }` and `.stickynav.show { transform: none; }` — this reuses the ORIGINAL
translateY mechanism (not the new rotateX one) purely as the reduced-motion fallback, so with
`transition: none` the nav still respects the same hidden-at-0/shown-past-threshold gating but
snaps instantly with no animated motion of any kind, satisfying MS-03's "nav simply appearing
with no curl." Add a comment above the whole `.stickynav` block noting this is a wave-curl
reveal introduced by quick task 260722-wov (item 1), an intentional amendment to Phase 21's
closed MS-02 requirement ("the only surviving scroll motion is a slow opacity fade-up") — the nav
curl is now a second, deliberate motion source, approved by Monty; the homepage's `.reveal`
opacity-fade system (MS-02's own subject) is untouched.

In hero.tsx: change the outer `<section>` className from `"wrap pt-24 pb-16 md:pt-52 md:pb-32"`
to `"wrap min-h-screen flex flex-col justify-center py-16 md:py-24"` so the hero fills at least
one full viewport height and its content (eyebrow, H1, paragraph, meta row) sits vertically
centered within it on first paint, rather than top-pinned. Leave every inner element's classes
(the `reveal` fade classes, the meta row's own `mt-24 md:mt-32`, etc.) unchanged — the outer
section's own alignment is the only thing changing; do not touch the paragraph markup from Task 1.

Create src/__tests__/components/sticky-nav.test.tsx (new — no test file exists for this component
today). Set `window.scrollY` via `Object.defineProperty(window, "scrollY", { value, writable:
true, configurable: true })` before each render, then dispatch a scroll event inside
`act(() => window.dispatchEvent(new Event("scroll")))`. Cover: (1) at `scrollY = 0`, no
`.stickynav.show` element exists; (2) at `scrollY = 20` (below the new 24px threshold) after a
scroll event, still no `.show`; (3) at `scrollY = 30` (above the threshold) after a scroll event,
`.stickynav.show` exists — this is the regression guard proving the trigger is a small fixed
pixel value, not viewport-relative (the old 82%-of-viewport gate would never trigger at
scrollY=30 in jsdom's default ~768px innerHeight, so this test would fail against the old code,
proving the change).

Edit .planning/STATE.md: under the "## Accumulated Context" section (in the "### v4.0 Roadmap
Decisions" subsection, alongside the other Phase 21 bullets), add a new bullet recording that
quick task 260722-wov (2026-07-22) intentionally amends Phase 21's closed MS-02 requirement by
reintroducing a second ambient motion source: the StickyNav wave-curl reveal (a `perspective` +
`rotateX` hinge-fold with a back-ease overshoot, gated by `prefers-reduced-motion` exactly like
the surviving `.reveal` fade). Note explicitly that MS-02's own subject — the homepage's single
`.reveal` opacity-fade-up — remains completely unchanged; this is an addition of a second,
separate, Monty-approved motion source, not a reversal of the fade-up work itself. This must be a
prose bullet edit to the existing file, not a wholesale rewrite of STATE.md.
</action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/components/sticky-nav.test.tsx src/__tests__/home/hero.test.tsx src/__tests__/home/motion-audit.test.tsx</automated>
  </verify>
  <done>sticky-nav.test.tsx passes proving the low fixed threshold. Hero fills the viewport and is vertically centered. .stickynav curls into view via rotateX + back-ease on first scroll and respects prefers-reduced-motion. STATE.md records the MS-02 amendment.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|--------------|
| Notion posts / Substack RSS -> EssayGrid / SectionWriting / NewsletterCarousel | Externally-authored content (post titles/descriptions, issue titles/thumbnails) flows into JSX. All rendering is via React's default text/attribute escaping (no `dangerouslySetInnerHTML` introduced anywhere in this plan); image `src` values are either Notion's own proxy route (`/api/notion-cover?pageId=...`, pre-existing, unchanged) or the Substack-provided thumbnail URL (pre-existing, unchanged). |
| Hero / ContactRow anchors -> external destinations | `/contact` is an internal next/link (no new external surface). Existing external links (X, LinkedIn, Substack) are untouched by this plan; ContactRow's `external` target/rel handling is unmodified. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-260722wov-01 | Tampering | EssayGrid rendering Notion post title/description/cover | accept | Pure React JSX interpolation (no `dangerouslySetInnerHTML`), identical trust model to the pre-existing writing/page.tsx code this plan moves into EssayGrid; no new sanitization surface introduced. |
| T-260722wov-02 | Information Disclosure | contact-row.tsx group-hover:text-bg fix | accept | Purely presentational CSS change; carries no data, no new attribute surface. |
| T-260722wov-03 | Tampering (code-quality residual) | globals.css unlayered `a { color: inherit }` vs `@layer utilities` | accept | Documented residual risk from choosing the targeted (option a) fix for item 4 rather than the structural `@layer base` migration (option b); any future `hover:text-*`/`focus:text-*` utility applied directly to an `<a>` element must route around it (as Task 1's hero link does, via hand-written CSS instead of a Tailwind utility) until a dedicated future task performs the full migration + cross-route regression sweep. |
</threat_model>

<verification>
1. `npx vitest run` (full suite) — expect 198+ passed (the pre-existing baseline) plus this
   plan's new tests, 0 failed. Any failure beyond that baseline is a regression from this plan.
2. `npx tsc --noEmit` — clean, no new type errors from the new EssayGrid file or the prop/type
   removals in section-writing.tsx / explorative-homepage.tsx / page.tsx.
3. `npm run build` — succeeds; `/`, `/writing`, and `/contact` all generate cleanly.
4. Manual spot-check (optional, recommended given item 2 and item 5 are real-browser CSS/motion
   behaviors jsdom cannot fully resolve): in `npm run dev`, confirm (a) /contact Email row title
   turns white on hover along with the rest of the row; (b) / loads with no nav bar visible and
   the hero centered in the viewport, and the nav curls down on the very first scroll tick;
   (c) with OS-level "reduce motion" enabled, the nav still appears past the same scroll point
   but with no curl animation, just an instant appearance.
5. No em dashes, no gradients, no rounded corners, and no new accent hue introduced in any copy
   or CSS touched by this plan.
</verification>

<success_criteria>
- All 5 todo items implemented exactly as specified in
  `.planning/todos/pending/260722-homepage-writing-contact-revisions.md`, none scope-reduced.
- Five atomic commits land, one per task/item.
- `npx vitest run` passes with zero failures beyond the pre-existing 198-passed/0-failed baseline
  plus this plan's new test files.
- `npm run build` exits 0.
- `.planning/STATE.md` records the MS-02 amendment; no roadmap requirement is silently
  contradicted.
</success_criteria>

<output>
Create `.planning/quick/260722-wov-homepage-nav-reveal-writing-split-contac/260722-wov-SUMMARY.md` when done.
</output>
