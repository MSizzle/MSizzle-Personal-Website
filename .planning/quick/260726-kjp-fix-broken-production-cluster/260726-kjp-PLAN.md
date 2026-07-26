---
phase: quick-260726-kjp
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/seo/project-metadata.ts
  - src/lib/seo/og-shared.tsx
  - src/app/opengraph-image.tsx
  - src/app/blog/[slug]/opengraph-image.tsx
  - src/app/building/[slug]/opengraph-image.tsx
  - src/app/writing/opengraph-image.tsx
  - src/app/building/opengraph-image.tsx
  - src/app/prometheus/opengraph-image.tsx
  - src/app/contact/opengraph-image.tsx
  - src/app/globals.css
  - src/components/home/pinboard.tsx
  - next.config.ts
  - src/app/robots.ts
  - src/__tests__/seo/project-metadata.test.ts
  - src/__tests__/pages/og-image.test.tsx
  - src/__tests__/home/pinboard.test.tsx
  - src/__tests__/seo/redirects.test.ts
  - src/__tests__/seo/robots.test.ts
  - src/__tests__/styles/focus-reveal.test.ts
autonomous: true
requirements: [QUICK-260726-kjp]

must_haves:
  truths:
    - "Every project page's OG preview shows the branded title-card image (not a stale/expired presigned S3 URL); no resolved metadata anywhere contains an amazonaws.com URL"
    - "/writing, /building, /prometheus, /contact each emit a real og:image (a live opengraph-image route that returns a 200 image/png), styled in pure mono, not silently missing"
    - "All OG generators (root, blog/[slug], building/[slug], and the four new routes) render pure black/white with zero accent hue -- no #e5411f or any other hardcoded hue survives"
    - "Every pinboard Book/Movie title is legible regardless of the poster's own colors, because the title/author sit on a solid ink caption bar rather than directly on the image"
    - "Keyboard-only users can reveal and reach the sticky nav (desktop) and mobile header (mobile) via :focus-within before any scroll happens, not only via the scroll-triggered .show class"
    - "/watching redirects to a live destination (the homepage Things I Love anchor), not into a 404 via the deleted /uses route"
    - "robots.ts no longer disallows /specimen, a route that does not exist"
  artifacts:
    - path: "src/lib/seo/project-metadata.ts"
      provides: "buildProjectMetadata() with no openGraph.images override, so the building/[slug] file-convention opengraph-image.tsx resolves instead of a presigned S3 URL"
    - path: "src/lib/seo/og-shared.tsx"
      provides: "OG_INK, OG_PAPER, OG_SIZE, OG_CONTENT_TYPE, ogFonts(), truncateOg(), and the shared OgCard layout component reused by 6 of the 7 OG route generators"
    - path: "src/app/writing/opengraph-image.tsx"
      provides: "OG image for /writing (previously none)"
    - path: "src/app/building/opengraph-image.tsx"
      provides: "OG image for /building index (previously none)"
    - path: "src/app/prometheus/opengraph-image.tsx"
      provides: "OG image for /prometheus (previously none)"
    - path: "src/app/contact/opengraph-image.tsx"
      provides: "OG image for /contact (previously none)"
    - path: "src/app/globals.css"
      provides: ".pb-book-caption solid-ink backing bar; .stickynav/.mobile-header-gate :focus-within reveal rules"
    - path: "next.config.ts"
      provides: "/watching redirect repointed to /#loves"
    - path: "src/app/robots.ts"
      provides: "disallow list with /specimen removed"
  key_links:
    - from: "src/lib/seo/project-metadata.ts buildProjectMetadata()"
      to: "src/app/building/[slug]/opengraph-image.tsx (Next file-convention resolution)"
      via: "absence of openGraph.images in the returned Metadata object"
      pattern: "openGraph:\\s*\\{[^}]*\\}"
    - from: "src/app/writing|building|prometheus|contact/opengraph-image.tsx"
      to: "src/lib/seo/og-shared.tsx OgCard"
      via: "direct import and JSX usage"
      pattern: "OgCard"
    - from: "src/components/home/pinboard.tsx CardFace (Book/Movie branch)"
      to: "src/app/globals.css .pb-book-caption"
      via: "className=\"pb-book-caption\" wrapper around title+author"
      pattern: "pb-book-caption"
    - from: "next.config.ts /watching redirect"
      to: "src/components/home/explorative-homepage.tsx id=\"loves\""
      via: "destination: '/#loves'"
      pattern: "#loves"
---

<objective>
Fix six confirmed-live production defects, in four independently committable tasks. Do not
re-diagnose any of them -- the orchestrator already verified all six live (curl, browser,
grep/audit).

1. Project OG images broken: `buildProjectMetadata()`'s `openGraph.images` override replaces the
   file-convention `building/[slug]/opengraph-image.tsx` generator with a presigned Notion S3 URL
   that expires in an hour.
2. Four routes (`/writing`, `/building`, `/prometheus`, `/contact`) emit zero `og:image` at all --
   no local `opengraph-image.tsx` exists for any of them.
3. All three existing OG generators (root, `blog/[slug]`, `building/[slug]`) hardcode the retired
   vermilion `#e5411f` on a warm-paper `#faf9f7` background -- superseded 2026-07-20 by the v4 mono
   lock (pure black/white, zero accent). This is also STATE.md's explicitly scheduled Phase 23
   survivor list, being closed here early via quick task.
4. 8 of 24 pinboard Book/Movie cards render an invisible white title directly over light-bottomed
   poster art, with no solid backing behind the text.
5. The scroll-gated `.stickynav` / `.mobile-header-gate` reveal only via a `.show` class set by a
   scroll listener, so keyboard-tabbing users land on real but off-screen links (WCAG 2.4.7).
6. `/watching` redirects to the deleted `/uses` route (a live 404), and `robots.ts` disallows the
   also-deleted `/specimen` route.

Purpose: stop production from serving broken social previews, invisible copy, a keyboard trap, and
a dead redirect -- all currently live on montysinger.com.

Output: four commits -- (1) OG generator foundation: merge-bug fix + shared mono helper + repalette
of the 3 existing generators, (2) four new OG routes built on that foundation, (3) pinboard title
legibility fix, (4) keyboard-focus nav reveal + dead redirect + robots cleanup.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md

Baseline test state, measured live before this plan: `npx vitest run` = 219 passed, 0 failed, 16
todo. Any NEW failure after this plan's tasks is a regression from THIS work.

`npx tsc --noEmit` currently reports exactly 3 pre-existing errors, all in
`src/__tests__/seo/robots.test.ts` (lines 7-9, `TS2339` on `result.rules.allow` /
`result.rules.disallow` -- `MetadataRoute.Robots['rules']` is a union type TS can't narrow without a
guard). These are OUT OF SCOPE per the orchestrator: do not fix them, do not let them block a task,
and do not expect the count to change after Task 4 edits that same file (the property-access shape
is unchanged, only the literal string values inside `disallow` change).

Brand rules that apply to every task: pure black/white (`#000000`/`#ffffff`), zero accent hue, no
gradients, hard corners, no em dashes in any user-visible string or comment.

Next.js 16.2.1 / React 19.2.4 / vitest 4.1.2, jsdom environment (`vitest.config.ts`). `globals.css`
is NOT loaded into the jsdom test environment (confirmed live: `pinboard.test.tsx`'s existing
opacity assertions pass via an inline React `style` prop, not the stylesheet) -- so CSS-only fixes
(Task 4's `:focus-within` rules) get a source-text regression test (read `globals.css` via `fs` and
assert the selector exists), not a `getComputedStyle` assertion. Real cascade/contrast verification
happens in a live browser via the Playwright MCP tools available to you, documented in
`<verification>` below.

<interfaces>
Confirmed exact current source (read live before this plan; do not re-read):

`src/lib/seo/project-metadata.ts` (32 lines) -- the bug, line 28:
`...(project.image ? { images: [{ url: project.image }] } : {})` spread inside `openGraph`. Compare
`src/lib/seo/blog-metadata.ts`'s `buildBlogPostMetadata()`, which never sets `openGraph.images` at
all and is the correct reference pattern -- its `blog/[slug]/opengraph-image.tsx` file-convention
generator resolves correctly today.

`Project` type (`src/lib/notion-projects.ts`): `{ id: string; slug: string; title: string;
description: string; cover: string | null; image: string | null; emoji: string | null; externalUrl:
string; tags: string[]; featured: boolean; published: boolean; lastEdited: string; }`.

Three existing OG generators, all Node-runtime (no `runtime` export), all read fonts via `fs` at
module scope from `src/app/og-fonts/hanken-grotesk-800.woff` and `jetbrains-mono-400.woff`:
- `src/app/opengraph-image.tsx` (86 lines): bespoke big-hero layout (108px title, tagline, no
  footer row, no description). Hardcodes `background: '#faf9f7'`, kicker `background: '#e5411f'`,
  title `color: '#171717'` + `boxShadow: '16px 16px 0 #171717'`, tagline `color: '#171717'`.
- `src/app/blog/[slug]/opengraph-image.tsx` (116 lines): kicker "ESSAY" + title block + footer row
  (`montysinger.com` left, formatted date right). Same hardcoded hex values.
- `src/app/building/[slug]/opengraph-image.tsx` (127 lines): kicker "PROJECT" + title block +
  optional description block + footer row (`montysinger.com` only, no right side). Same hex values.

Static metadata for the four routes needing a new OG image (exact current title/description
strings, reuse verbatim as the OG card copy):
- `src/app/writing/page.tsx`: title "Writing", description "Long-form essays on philosophy,
  technology, and the texture of an attentive life."
- `src/app/building/page.tsx`: title "Building", description "Projects, products, and AI systems
  Monty Singer is building or has built through Prometheus and independent work."
- `src/app/prometheus/page.tsx`: title "Prometheus | AI Integrations and Education", description
  "Prometheus is an AI integrations and education company founded by Monty Singer. Custom
  automation, AI implementation, and training for businesses." (152 chars -- needs truncation for
  the OG card's description slot; use the shared `truncateOg` helper, max 140).
- `src/app/contact/page.tsx`: title "Contact", description (its `DESCRIPTION` const) "Get in touch
  with Monty Singer: email, X, LinkedIn, and the Monty Monthly newsletter." (87 chars, no
  truncation needed).

`src/components/home/pinboard.tsx` Book/Movie branch (lines ~208-224): renders
`<div className="pb-frame"><div className="pb-media pb-media--book">{media}<span
className="pb-tag">{tag}</span><span className="pb-book-title">{item.title}</span>{item.subtitle ?
<span className="pb-book-author">{item.subtitle}</span> : null}</div>...`. `pb-frame--cream` (the
name referenced in the audit) is actually applied to the unrelated "Thing" branch, not Book/Movie --
confirmed live by reading the component. The real bug: `pb-book-title`/`pb-book-author` are
absolutely positioned directly over the poster `<img>` with no backing element, colored
`var(--color-text-inverse)` (white) and `rgba(255,255,255,0.82)`. Fix must not depend on frame
background at all (robust to any future variant), per the audit's explicit instruction.

`src/app/globals.css` current rules (verbatim, do not re-derive):
- Lines 1104-1111: `.pb-card--book .pb-frame, .pb-card--movie .pb-frame { width: 150px; }`
  `.pb-media--book { width: 100%; height: 210px; }` `.pb-book-title { position: absolute; left:
  14px; right: 14px; bottom: 34px; font-size: 16px; font-weight: 800; line-height: 1.05; color:
  var(--color-text-inverse); }` `.pb-book-author { position: absolute; left: 14px; right: 14px;
  bottom: 14px; font-size: 11px; color: rgba(255, 255, 255, 0.82); }`
- Line 22: `--color-text-inverse-dim: rgba(255,255,255,0.66);` (existing token -- reuse this
  instead of the ad hoc `rgba(255,255,255,0.82)` for the author line).
- Lines 462-477: `.stickynav { ...; transform: translateY(-100%); transition: transform 0.28s
  ease; }` `.stickynav.show { transform: translateY(0); }` followed by a
  `@media (prefers-reduced-motion: reduce)` block on `.stickynav` only (transition: none) -- leave
  that block untouched.
- Lines 526-537: `.mobile-header-gate { transform: translateY(-100%); transition: transform 0.28s
  ease; }` `.mobile-header-gate.show { transform: translateY(0); }` followed by its own
  `prefers-reduced-motion` block -- leave untouched.

`next.config.ts` line 24: `{ source: '/watching', destination: '/uses', permanent: true },` --
`/uses` was deleted (STATE.md nav note). `src/components/home/explorative-homepage.tsx` line ~63:
`<section className="band pt-40 md:pt-64" id="loves">` wrapping `<SectionLoves />`, with an
explicit code comment stating "the site-wide footer's /#loves link depends on it" -- `/#loves` is
already a live, established anchor elsewhere in the codebase, making it the correct redirect target.

`src/app/robots.ts` (8 lines): `rules: { userAgent: '*', allow: '/', disallow: ['/specimen',
'/api/'] }` -- `/specimen` no longer exists as a route.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: OG generator foundation -- fix project merge bug, extract shared mono helper, repalette the 3 existing generators</name>
  <files>src/lib/seo/project-metadata.ts, src/lib/seo/og-shared.tsx, src/app/opengraph-image.tsx, src/app/blog/[slug]/opengraph-image.tsx, src/app/building/[slug]/opengraph-image.tsx, src/__tests__/seo/project-metadata.test.ts, src/__tests__/pages/og-image.test.tsx</files>
  <behavior>
    - `buildProjectMetadata()` on a project whose `image` is a presigned `amazonaws.com` URL never
      sets `openGraph.images`, and no key in the JSON-stringified result contains "amazonaws.com".
    - `buildProjectMetadata()` still returns the correct `title`, canonical alternate, and
      `openGraph.type === 'website'`.
    - `src/lib/seo/og-shared` exports `OG_INK === '#000000'` and `OG_PAPER === '#ffffff'`.
    - None of the three existing `opengraph-image.tsx` route files (root, `blog/[slug]`,
      `building/[slug]`) contain the string `#e5411f` (case-insensitive) anywhere in their source.
  </behavior>
  <action>
In `src/lib/seo/project-metadata.ts`, delete the `...(project.image ? { images: [{ url:
project.image }] } : {})` spread from the returned `openGraph` object entirely (mirror
`buildBlogPostMetadata()` in the sibling `blog-metadata.ts`, which never sets `openGraph.images`).
The `openGraph` object should end up with exactly `title`, `description`, `url`, `type: 'website'`
and nothing else. This lets `building/[slug]/opengraph-image.tsx`'s file-convention generator
resolve as the page's `og:image` instead of the presigned, hour-expiring S3 URL. `project.image` is
otherwise no longer read anywhere in this function; leave the `Project` type and every other field
untouched.

Create `src/lib/seo/og-shared.tsx` (note the `.tsx` extension -- it exports JSX). Contents:
a doc comment explaining this is the shared foundation for every route's OG generator (root,
`blog/[slug]`, `building/[slug]`, plus the four new route-level generators added in Task 2), pure
mono per the v4 lock (zero accent hue, no gradients), and that font files are read once here at
module scope (not duplicated per route file) so every generator's static prerender shares the same
buffers. Export: `OG_INK = '#000000'`; `OG_PAPER = '#ffffff'`; `OG_SIZE = { width: 1200, height:
630 }`; `OG_CONTENT_TYPE = 'image/png'`; a `truncateOg(text: string, max = 140): string` helper that
returns `text` unchanged when `text.length <= max`, else `text.slice(0, max - 3).trimEnd() + '…'`
(mirrors the truncation already inline in `building/[slug]/opengraph-image.tsx`, now shared); a
`ogFonts()` function that reads `hanken-grotesk-800.woff` and `jetbrains-mono-400.woff` from
`src/app/og-fonts/` via `readFileSync(join(process.cwd(), ...))` at module scope (once, outside the
function) and returns a fresh array each call: `[{ name: 'Hanken Grotesk', data: hankenFont, weight:
800 as const, style: 'normal' as const }, { name: 'JetBrains Mono', data: monoFont, weight: 400 as
const, style: 'normal' as const }]` -- the `as const` on `weight`/`style` only (not the whole array)
keeps the return type structurally assignable to `next/og`'s expected `FontOptions[]` without a
readonly-array mismatch (verified live against this repo's next/vercel-og types before writing this
plan -- do not import any type from `next/dist/...`, it is an unsupported deep path); and an
`OgCard` component accepting `{ kicker: string; title: string; description?: string; footerLeft?:
string; footerRight?: string }` that renders the existing brutalist card shape (paper field padding
64, kicker chip top-left with `background: OG_INK, color: OG_PAPER`, title block bottom-anchored
with `background: OG_PAPER, color: OG_INK, boxShadow: \`14px 14px 0 ${OG_INK}\`, maxWidth: 1000`,
an optional description row when `description` is truthy, and an optional footer row (`justify-content:
space-between`) when either `footerLeft` or `footerRight` is set, `footerLeft` at 0.75 opacity) --
copy the exact layout numbers (fontSize/padding/lineHeight/letterSpacing) from
`building/[slug]/opengraph-image.tsx`'s current JSX, just swap the hardcoded hex values for
`OG_INK`/`OG_PAPER`.

Rewrite `src/app/opengraph-image.tsx`: keep its bespoke big-hero layout exactly (108px title,
tagline, no footer, no description -- this file does NOT use `OgCard`, it has a genuinely different
shape), but import `OG_INK, OG_PAPER, OG_SIZE, OG_CONTENT_TYPE, ogFonts` from `@/lib/seo/og-shared`
and delete this file's own `readFileSync`/`join`/font-buffer lines. Replace `background: '#faf9f7'`
with `background: OG_PAPER`; kicker `background: '#e5411f'` with `background: OG_INK` (keep `color:
'#ffffff'` as `color: OG_PAPER`); title block `color: '#171717'` with `color: OG_INK` and
`boxShadow: '16px 16px 0 #171717'` with `` boxShadow: `16px 16px 0 ${OG_INK}` ``; tagline `color:
'#171717'` with `color: OG_INK`. Replace `export const size = { width: 1200, height: 630 }` with
`export const size = OG_SIZE`, `export const contentType = 'image/png'` with `export const
contentType = OG_CONTENT_TYPE`, and the inline `fonts: [...]` array in the `ImageResponse` call with
`fonts: ogFonts()`. Leave `alt` and the rest of the JSX structure/text untouched.

Rewrite `src/app/blog/[slug]/opengraph-image.tsx`: keep all existing data-fetching logic
(`getPostBySlug`, `displayTitle`, `date` formatting) untouched. Replace the returned JSX with
`<OgCard kicker="ESSAY" title={displayTitle} footerLeft="montysinger.com" footerRight={date ||
undefined} />` imported from `@/lib/seo/og-shared`. Import `OG_SIZE, OG_CONTENT_TYPE, ogFonts` from
the same module, delete this file's own font-buffer/`readFileSync` lines, and update `size`,
`contentType`, and the `ImageResponse` call's `fonts` the same way as the root file above.

Rewrite `src/app/building/[slug]/opengraph-image.tsx`: keep all existing data-fetching logic
(`getProjectBySlug`, `displayTitle`, `displayDescription`) untouched. Replace the returned JSX with
`<OgCard kicker="PROJECT" title={displayTitle} description={displayDescription || undefined}
footerLeft="montysinger.com" />`. Same `OG_SIZE`/`OG_CONTENT_TYPE`/`ogFonts()` swap as above. You may
now delete this file's own inline truncation logic for `displayDescription` and instead call the
shared `truncateOg(description, 140)` from `og-shared` if you prefer, but it is not required --
leave it inline if that is simpler, since the 90/140-char truncation values already match.

Create `src/__tests__/seo/project-metadata.test.ts` mirroring the existing
`src/__tests__/seo/metadata.test.ts` pattern for `buildBlogPostMetadata`: a `fakeProject: Project`
fixture with `image: 'https://prod-files-secure.s3.us-east-1.amazonaws.com/abc/def.png?X-Amz-Expires=3600&X-Amz-Signature=xyz'`
and all other required `Project` fields filled in (see the exact type shape in `<interfaces>`
above); one test asserting `buildProjectMetadata(fakeProject).openGraph` has no `images` key and
`JSON.stringify(meta)` does not match `/amazonaws\.com/`; one test asserting `title`,
`alternates.canonical`, and `openGraph.type` are still correct.

In `src/__tests__/pages/og-image.test.tsx`, add `import { readFileSync } from 'node:fs'` and
`import { join } from 'node:path'` at the top. Add one new `it` block importing `@/lib/seo/og-shared`
and asserting `OG_INK === '#000000'` and `OG_PAPER === '#ffffff'`. Add a second new `it` block that
loops over `['src/app/opengraph-image.tsx', 'src/app/blog/[slug]/opengraph-image.tsx',
'src/app/building/[slug]/opengraph-image.tsx']`, reads each file's source via `readFileSync(join(
process.cwd(), f), 'utf-8')`, and asserts `!src.toLowerCase().includes('#e5411f')` for each --
this is the regression guard for issue 3. Leave every existing `it` block in this file unchanged.
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/seo/project-metadata.test.ts src/__tests__/pages/og-image.test.tsx && npx tsc --noEmit</automated>
  </verify>
  <done>project-metadata.test.ts and the expanded og-image.test.tsx both pass. `npx tsc --noEmit` reports only the same 3 pre-existing robots.test.ts errors (not more, not fewer). Root, blog/[slug], and building/[slug] OG generators render pure mono; buildProjectMetadata no longer overrides openGraph.images.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Add OG images to /writing, /building, /prometheus, /contact using the shared foundation</name>
  <files>src/app/writing/opengraph-image.tsx, src/app/building/opengraph-image.tsx, src/app/prometheus/opengraph-image.tsx, src/app/contact/opengraph-image.tsx, src/__tests__/pages/og-image.test.tsx</files>
  <behavior>
    - Each of the four new modules exports `size = { width: 1200, height: 630 }`, `contentType =
      'image/png'`, a non-empty `alt` string with no em dash, and a `default` function component.
    - None of the four new files contain the string `#e5411f`.
  </behavior>
  <action>
Create four new files, each following the exact same shape: import `OgCard, OG_SIZE,
OG_CONTENT_TYPE, ogFonts` (and `truncateOg` where noted) from `@/lib/seo/og-shared`; export `const
size = OG_SIZE`; export `const contentType = OG_CONTENT_TYPE`; export a plain-string `alt` (no em
dash, no en dash); export `default function Image()` returning `new ImageResponse(<OgCard ... />, {
...size, fonts: ogFonts() })`. None of these four routes fetch from Notion (their pages use static
metadata), so none need to be `async`.

`src/app/writing/opengraph-image.tsx`: `alt = 'Writing, essays by Monty Singer'`; `<OgCard
kicker="WRITING" title="Writing" description="Long-form essays on philosophy, technology, and the
texture of an attentive life." footerLeft="montysinger.com" />` (this string is under 140 chars,
`truncateOg` is not needed here).

`src/app/building/opengraph-image.tsx`: `alt = 'Building, projects by Monty Singer'`; `<OgCard
kicker="BUILDING" title="Building" description="Projects, products, and AI systems Monty Singer is
building or has built through Prometheus and independent work." footerLeft="montysinger.com" />`
(119 chars, no truncation needed). This file lives at `src/app/building/opengraph-image.tsx`
(segment-level, for the `/building` index route) -- it does not conflict with the existing
`src/app/building/[slug]/opengraph-image.tsx` (dynamic-segment level, for `/building/:slug`); Next
resolves each independently per route segment.

`src/app/prometheus/opengraph-image.tsx`: `alt = 'Prometheus, AI integrations and education by
Monty Singer'`; import `truncateOg` too; `<OgCard kicker="PROMETHEUS" title="Prometheus"
description={truncateOg("Prometheus is an AI integrations and education company founded by Monty
Singer. Custom automation, AI implementation, and training for businesses.")}
footerLeft="montysinger.com" />` (the raw string is 152 chars, over the 140 default, so it must go
through `truncateOg`).

`src/app/contact/opengraph-image.tsx`: `alt = 'Contact Monty Singer'`; `<OgCard kicker="CONTACT"
title="Contact" description="Get in touch with Monty Singer: email, X, LinkedIn, and the Monty
Monthly newsletter." footerLeft="montysinger.com" />` (87 chars, no truncation needed; reuse this
exact string, it is the page's existing `DESCRIPTION` const).

In `src/__tests__/pages/og-image.test.tsx`, add four new `it` blocks mirroring the existing
root/blog/project pattern exactly (import the module dynamically, assert `size`, `contentType`,
non-empty `alt` with no em/en dash) for `@/app/writing/opengraph-image`,
`@/app/building/opengraph-image`, `@/app/prometheus/opengraph-image`, and
`@/app/contact/opengraph-image`. Extend the Task 1 "no #e5411f" file-list loop to include these four
new file paths as well, so the regression guard covers all seven generators.
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/pages/og-image.test.tsx && npx tsc --noEmit</automated>
  </verify>
  <done>og-image.test.tsx passes with 7 module-shape assertions (3 existing + 4 new) plus the "no vermilion in any of the 7 generators" regression check. tsc clean beyond the 3 known pre-existing robots.test.ts errors.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 3: Fix invisible pinboard Book/Movie titles with a solid caption bar</name>
  <files>src/components/home/pinboard.tsx, src/app/globals.css, src/__tests__/home/pinboard.test.tsx</files>
  <behavior>
    - The rendered Movie card's title/author sit inside an element with class `pb-book-caption`,
      itself inside `.pb-media--book`.
    - `globals.css` defines `.pb-book-caption` with a solid, non-transparent `background`.
  </behavior>
  <action>
In `src/components/home/pinboard.tsx`'s Book/Movie branch (the block returning `<div
className="pb-frame">` for `item.type === "Book" || item.type === "Movie"`), wrap the existing
`<span className="pb-book-title">{item.title}</span>` and the conditional `<span
className="pb-book-author">{item.subtitle}</span>` in a new `<span
className="pb-book-caption">...</span>` element, nested inside `.pb-media--book` exactly where the
two spans currently sit (after `<span className="pb-tag">{tag}</span>`). Do not change anything
else in this branch or elsewhere in the component (TL-01 preservation) -- this is a markup-only
change plus the CSS below.

In `src/app/globals.css`, replace the two rules `.pb-book-title { position: absolute; left: 14px;
right: 14px; bottom: 34px; font-size: 16px; font-weight: 800; line-height: 1.05; color:
var(--color-text-inverse); }` and `.pb-book-author { position: absolute; left: 14px; right: 14px;
bottom: 14px; font-size: 11px; color: rgba(255, 255, 255, 0.82); }` with three rules: a new
`.pb-book-caption` carrying the absolute positioning and a solid backing (`position: absolute; left:
0; right: 0; bottom: 0; background: var(--color-invert); padding: 10px 14px 12px; display: flex;
flex-direction: column; gap: 2px;`), plus simplified `.pb-book-title { font-size: 16px; font-weight:
800; line-height: 1.05; color: var(--color-text-inverse); }` and `.pb-book-author { font-size: 11px;
color: var(--color-text-inverse-dim); }` (now pure typography, no positioning of their own -- reuse
the existing `--color-text-inverse-dim` token instead of the old ad hoc `rgba(255,255,255,0.82)`).
Add a comment above `.pb-book-caption` explaining the fix: title/author previously floated as plain
white text directly over the poster image with no backing, invisible whenever a cover's bottom
region was light (8 of 24 cards: The Prestige, 12 Rules for Life, $100M Offers, How to Get Filthy
Rich in Rising Asia, Facebook Book, Fight Club, Midnight in Paris, The Fish That Ate The Whale); a
solid ink bar behind the text guarantees legibility on ANY poster art and is not tied to any
specific frame variant (`pb-frame--cream` is unrelated -- it only applies to the "Thing" card type,
confirmed live) -- robust to whatever frame variants get added in the future.

In `src/__tests__/home/pinboard.test.tsx`, add one new test: render `<Pinboard items={ITEMS} />`,
select `.pb-card--movie` (the `ITEMS` fixture already has a Movie item titled "Fight Club"), assert
its `.pb-book-caption` child is not null, that `.pb-book-caption .pb-book-title` is not null, and
that the caption's `textContent` contains "Fight Club".
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/home/pinboard.test.tsx</automated>
  </verify>
  <done>pinboard.test.tsx passes including the new pb-book-caption structural assertion. Every existing pinboard test (drag/shuffle/draw/organize/mobile-stack) still passes unmodified.</done>
</task>

<task type="auto">
  <name>Task 4: Keyboard-focus nav reveal, dead /watching redirect, stale robots rule</name>
  <files>src/app/globals.css, next.config.ts, src/app/robots.ts, src/__tests__/styles/focus-reveal.test.ts, src/__tests__/seo/redirects.test.ts, src/__tests__/seo/robots.test.ts</files>
  <action>
In `src/app/globals.css`, change `.stickynav.show { transform: translateY(0); }` to a
comma-grouped selector: `.stickynav.show,\n.stickynav:focus-within {\n  transform: translateY(0);\n}`.
Add a one-line comment directly above noting this satisfies WCAG 2.4.7 (keyboard focus visible) --
a tabbing user must be able to reveal the bar before any scroll happens, not only via the
scroll-triggered `.show` class (quick task 260726-kjp). Leave the adjacent
`@media (prefers-reduced-motion: reduce)` block on `.stickynav` completely untouched. Make the
identical change to `.mobile-header-gate.show { transform: translateY(0); }`, becoming
`.mobile-header-gate.show,\n.mobile-header-gate:focus-within {\n  transform: translateY(0);\n}`
with the same style of comment, again leaving its own `prefers-reduced-motion` block untouched.

In `next.config.ts`, change line 24 from `{ source: '/watching', destination: '/uses', permanent:
true },` to `{ source: '/watching', destination: '/#loves', permanent: true }, // '/uses' was
deleted; the Things I Love section is the successor content (quick task 260726-kjp)`. Do not touch
any other redirect entry.

In `src/app/robots.ts`, change `disallow: ['/specimen', '/api/']` to `disallow: ['/api/']` --
`/specimen` is a route that no longer exists.

Create `src/__tests__/styles/focus-reveal.test.ts` (new directory): read `src/app/globals.css` once
via `readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf-8')` at module scope. One test
asserts the source matches a whitespace-tolerant regex requiring `.stickynav.show` and
`.stickynav:focus-within` to appear together ahead of a rule body containing `transform:
translateY(0)` (e.g. `/\.stickynav\.show\s*,\s*\.stickynav:focus-within\s*\{\s*transform:\s*
translateY\(0\)/`). A second test asserts the equivalent for `.mobile-header-gate.show` /
`.mobile-header-gate:focus-within`.

Create `src/__tests__/seo/redirects.test.ts`: `import nextConfig from '../../../next.config'`
(confirmed live: this relative path resolves correctly from `src/__tests__/seo/` under this repo's
`vitest.config.ts`). One test calls `await nextConfig.redirects!()`, finds the entry with `source
=== '/watching'`, and asserts its `destination === '/#loves'` and `permanent === true`. A second
test asserts no redirect entry in the array has `destination === '/uses'`.

Update `src/__tests__/seo/robots.test.ts`'s first test: change its assertions so `disallow`
contains `/api/` and does NOT contain `/specimen` (currently asserts both are present -- update the
`/specimen` assertion to a `.not.toContain('/specimen')`, keep the `/api/` assertion, update the
test's own description string accordingly). Leave the sitemap test untouched. Note: this file has 3
pre-existing `tsc --noEmit` errors (TS2339 on `result.rules.allow`/`.disallow`, a pre-existing union-type
narrowing issue) -- your edit keeps the same property-access shape, so the same 3 errors will still
be present afterward; this is expected and out of scope, do not attempt to fix them.
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/styles/focus-reveal.test.ts src/__tests__/seo/redirects.test.ts src/__tests__/seo/robots.test.ts</automated>
  </verify>
  <done>All three test files pass. globals.css reveals both scroll-gated bars on :focus-within in addition to .show. /watching redirects to /#loves. robots.ts no longer disallows /specimen.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|--------------|
| Notion-sourced title/description -> OG image JSX | Project/post title and description strings (already public, already rendered on the page itself) now also flow into the shared `OgCard` component as plain text nodes. |
| `next.config.ts` redirect destinations | Static, hardcoded strings only (`/#loves`) -- not derived from any request input. |
| `robots.ts` disallow list | Public crawl-control metadata; removing a stale rule reduces surface, does not add any. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-260726kjp-01 | Information Disclosure | `OgCard` rendering project/post title+description | accept | Identical trust level to the existing production generators this replaces -- same public, already-page-rendered strings, just fewer duplicated JSX blocks. No new data enters the render path. |
| T-260726kjp-02 | Tampering | Notion-sourced strings rendered inside `OgCard`/satori JSX | accept | Rendered as plain React text children (no `dangerouslySetInnerHTML`, no HTML string interpolation) -- satori escapes text nodes the same way React does; unchanged from the pre-existing generators. |
| T-260726kjp-03 | Spoofing (open redirect) | `next.config.ts` `/watching` rule | accept | `destination: '/#loves'` is a hardcoded internal path, not derived from any request parameter -- no open-redirect surface. |
| T-260726kjp-04 | Denial of Service | New `opengraph-image.tsx` routes (4 added) | accept | Static, non-async generators with no external fetch and no user-controlled input -- same resource profile as the existing root generator already in production. |
| T-260726kjp-SC | Tampering (supply chain) | npm/pip/cargo installs | accept | No new package is installed by this plan (every fix is first-party file edits plus one new first-party helper module); the Package Legitimacy Gate does not apply. |
</threat_model>

<verification>
Automated (run after all four tasks, in this repo):
1. `npx vitest run` -- expect 219 (pre-existing baseline) + this plan's new/updated tests, 0 failed.
2. `npx tsc --noEmit` -- expect exactly the same 3 pre-existing `robots.test.ts` errors, nothing new.
3. `npm run build` -- succeeds; confirms all 4 new `opengraph-image.tsx` routes and the edited
   existing 3 compile and statically prerender without a runtime error.

Live checks (run these against `npm run dev` on localhost:3000; Playwright MCP browser tools are
available to you for the browser-based ones):
4. OG images, real fetch: `curl -sI http://localhost:3000/writing/opengraph-image`,
   `.../building/opengraph-image`, `.../prometheus/opengraph-image`, `.../contact/opengraph-image`
   each return `200` with `content-type: image/png`. For a real project slug, `curl -s
   http://localhost:3000/building/<slug> | grep -o 'og:image[^>]*'` must NOT contain
   `amazonaws.com`.
5. Redirect, real fetch: `curl -sI http://localhost:3000/watching` returns a `308` (or configured
   redirect status) with `location: /#loves` (or an absolute URL ending in `/#loves`), not `/uses`.
6. Robots, real fetch: `curl -s http://localhost:3000/robots.txt` does not contain `/specimen` and
   does contain `/api/`.
7. Pinboard contrast, real browser: navigate to `http://localhost:3000/`, scroll to the Things I
   Love pinboard, use `browser_evaluate` to query every `.pb-book-caption` element, read
   `getComputedStyle` background-color of the caption and color of its `.pb-book-title` child,
   compute a WCAG contrast ratio, and assert every ratio is comfortably >= 4.5 (an opaque
   `var(--color-invert)` bar behind white text should read close to the ~21:1 maximum) -- spot-check
   at least the Fight Club and 12 Rules for Life cards by name.
8. Keyboard focus, real browser: at a desktop viewport (>=768px), navigate to `/`, press Tab
   repeatedly (or `browser_evaluate` a direct `.focus()` call on a `.stickynav a.nav-cell`), then
   read `getComputedStyle(document.querySelector('.stickynav')).transform` and confirm it reflects
   `translateY(0)` (not the offscreen `-100%` matrix) while an inner link holds focus, with no prior
   scroll event fired. Repeat at a mobile viewport (<768px) focusing a link inside the mobile
   header, confirming `.mobile-header-gate`'s bounding rect `top >= 0`.
</verification>

<success_criteria>
- All six confirmed-live defects fixed exactly as scoped; no scope reduction (project OG images
  genuinely restored, all 4 missing OG routes genuinely added, all 7 generators genuinely mono, all
  8 pinboard titles genuinely legible, both scroll-gated bars genuinely keyboard-focusable, the
  redirect and robots rule genuinely corrected).
- Four commits land, one per task, in the order above.
- `npx vitest run` passes with zero failures beyond the pre-existing 219-passed/0-failed baseline
  plus this plan's new/updated tests.
- `npx tsc --noEmit` shows exactly the same 3 pre-existing `robots.test.ts` errors, no more, no
  fewer.
- Live curl/browser checks in `<verification>` all pass.
</success_criteria>

<output>
Create `.planning/quick/260726-kjp-fix-broken-production-cluster/260726-kjp-SUMMARY.md` when done.
</output>
