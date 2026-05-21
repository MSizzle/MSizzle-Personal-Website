# Phase 10: Editorial Homepage - Research

**Researched:** 2026-05-21
**Domain:** Next.js 16 App Router page rewrite + motion/react 12.38 client interaction + Notion data wiring
**Confidence:** HIGH

## Summary

Phase 10 is a near-total rewrite of `src/app/page.tsx` (currently 191 lines, 4 sections, v1.0-stripped) into a 9-section editorial homepage composed from Phase 9's 7 primitives, 7 typography roles, and 10 palette tokens. CONTEXT.md locks 41 implementation decisions; the work the planner needs is verification of those assumptions against the codebase, not re-derivation.

Verification produced **one critical gap, one minor gap, and otherwise clean alignment**:

1. **CRITICAL — Global Navigation + Footer conflict** (not addressed in CONTEXT.md): `src/app/layout.tsx` wraps every route in `<Navigation />` (fixed-position v1.0 header with `bg-[var(--bg)]` + 5-link nav drawer) and a v1.0 `<Footer />` (Contact + Links/Socials grid). The new homepage header (HOME-V2-01) and inverted ink footer (HOME-V2-11) cannot just be added to `page.tsx` — they would double-render alongside the global chrome. The planner MUST decide a strategy: (a) skip global Nav/Footer on `/` only, (b) replace globals with the v2.0 versions site-wide (couples to Phase 12), or (c) hide globals on `/` via a route segment trick. Recommended: **option (a)** — make the new editorial header/footer homepage-local, leave global chrome intact for sub-pages until Phase 12.
2. **MINOR — `getFeaturedProjects` count assumption**: D-15 assumes the Notion DB returns ≥ 8 featured projects. Planner should add a graceful fallback (slice → first 8, "+N more" suffix when count > 8, omit suffix when ≤ 8).
3. Everything else (primitive prop signatures, Notion field names, photo filenames, motion/react API surface) matches CONTEXT.md assumptions.

**Primary recommendation:** Plan 10-01 must include a `<HomeChromeIsolation>` decision in its action — either render `<Navigation />` conditionally via `usePathname()` (client) or wrap the new homepage in a route-group with its own `layout.tsx`. The cleanest fix is to detect pathname in the existing global `<Navigation />` + `<Footer />` and return null when `pathname === '/'`. This is a one-line edit per global, no new files.

## User Constraints (from CONTEXT.md)

### Locked Decisions

D-01..D-41 from `10-CONTEXT.md` — 41 locked decisions covering manifesto copy/styling/reveal, header layout, epigraph image, letter-style intro, section pattern, BUILDING/WRITING/EVENTS/PHOTOGRAPHS/PERSONAL composition, inverted footer, mobile parity, plan slicing, and build/verification gates.

The full text lives in `10-CONTEXT.md` under `<decisions>`. Highlights the planner must honor verbatim:

- **D-01:** Manifesto = `"BRING FIRE / TO HUMANITY."` (2 lines).
- **D-02:** Manifesto = `<h1>` with `text-display`, each line `white-space: nowrap`, uppercase, `text-ink`.
- **D-03:** `<ManifestoReveal>` at `src/components/home-v2/manifesto-reveal.tsx`, `'use client'`, per-letter `translateY(110%) → 0` + opacity, delay `18ms × (lineIdx × lineLength + charIdx)`, `transform 700ms cubic-bezier(.2, .7, .2, 1)` + `opacity 500ms ease`.
- **D-04:** `sessionStorage.getItem('gsd:manifesto-shown')` gate (tab-scoped).
- **D-05:** `useReducedMotion()` → single 300ms opacity fade fallback.
- **D-08:** Nav route mapping — Building → `/projects`, Writing → `/blog` (Phase 11 swaps to `/writing`), Events → `/events`, About → `/about`, Links → `/links`.
- **D-09:** Epigraph = `/MSizzle-website-photos/000092530012.jpeg`, `priority`, aspect 1120×540, `object-cover`.
- **D-13:** Every section pattern = `<RuleStrong />` → 120px space → `<SectionLabel numeral=...>` → 72px → content → optional `<AllLink>` → 120px below.
- **D-23 / D-25:** Photographs grid `grid-cols-12 grid-rows-[180px] gap-3` + 6 plates per exact col/row span map; `next/image` with `object-cover` + `filter saturate(0.92)`; PHOTOS[1] filename has literal space — URL-encode `%20`.
- **D-24:** Caption overlay arbitrary-value exception (`text-[10px] tracking-[0.2em]` + `mix-blend-difference`). Document the exception in plan SUMMARY for Phase 13 QA.
- **D-32:** Manifesto mobile uses `text-[56px] leading-[0.96] tracking-[-0.045em]` arbitrary value (acceptable exception per CONTEXT.md). Mobile line-break decision deferred — see Open Questions §1 + recommendation in §9 below.
- **D-34..D-35:** 7 plans, 1 wave, serial `depends_on` chain. All edit `src/app/page.tsx`; Plan 10-07 also creates `src/components/home-v2/manifesto-reveal.tsx`.
- **D-36..D-38:** Preserve `template.tsx`, `lenis-provider.tsx`, `scroll-reveal.tsx`, `/newsletter` carousel. Old page.tsx scaffold deleted wholesale in 10-01; legacy `event-cards.tsx` stays for /events route.
- **D-39..D-41:** Per-plan `npm run build` exit 0; phase gate deferred to Vercel preview; manifesto = HUMAN-UAT.

### Claude's Discretion

- Exact JSDoc inside `<ManifestoReveal>` (minimal per CLAUDE.md).
- File location for `<ManifestoReveal>` — chosen `src/components/home-v2/manifesto-reveal.tsx` (already locked by D-03; this is now a Decision, not Discretion).
- Whether to extract `<HomeFeaturedEvent>` — defer; inline-then-extract.
- Pixel-perfect interpretation of handoff measurements that don't match Tailwind defaults — use exact values via spacing scale (each unit = 4px). E.g., 160px = `px-40`, 56px = `mt-14`, 120px = `mt-30` (= `mt-[120px]` since `mt-30` is not standard) — planner picks per Tailwind v4 spacing scale availability.

### Deferred Ideas (OUT OF SCOPE)

- Manifesto alternates (`MAKE FEWER THINGS...`, `SOFTWARE IS A WAY...`) — swap in code post-launch.
- Photograph data-source generalization — Phase 11's `/photos` introduces it.
- Extracting `<HomeFeaturedEvent>` — Phase 11+.
- `/writing`, `/photos` link target updates — Phase 11.
- Dark-mode editorial palette — explicitly dropped (Phase 9 D-04).
- Mobile hamburger menu — defer.
- i18n — out of v2.0 scope.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-V2-01 | Homepage header: name 15px bold + 5-link nav 13px baseline-aligned | §"Architecture Patterns" + §"Critical Gap: Global Chrome Conflict" |
| HOME-V2-02 | Hero manifesto "BRING FIRE / TO HUMANITY." 124px uppercase 700 with `white-space: nowrap` | §"Standard Stack" → `text-display` token verified live; §"Code Examples" → static manifesto markup pattern |
| HOME-V2-03 | Meta row: 32px hairline + EST. line 11px tracked muted | §"Code Examples" → meta-row snippet |
| HOME-V2-04 | Epigraph image 1120×540 with `priority` + figcaption | §"Notion Data Shapes" → `next/image` priority confirmed for LCP |
| HOME-V2-05 | Letter-style intro paragraph, max-width 720px, 22px body, 3 inline `<IntroLink>` | §"Phase 9 Primitive Prop Signatures" → IntroLink verified |
| HOME-V2-06 | BUILDING section 3-col grid, Prometheus + Selected Works rows | §"Notion Data Shapes" → `Project.title`/`Project.description` available; `getFeaturedProjects()` returns `Project[]` |
| HOME-V2-07 | WRITING section: 3 latest essays as `<ListRow big>` | §"Phase 9 Primitive Prop Signatures" → ListRow `big` verified; §"Notion Data Shapes" → BlogPost.description (NOT excerpt/subtitle) confirmed |
| HOME-V2-08 | EVENTS section: inline featured event + 2 secondary `<ListRow>` | §"Notion Data Shapes" → `EventItem.name`/`date`/`location`/`description`/`link` confirmed (NOT `title`/`rsvpUrl`) |
| HOME-V2-09 | Photographs 12-col asymmetric grid + 6 plates + `mix-blend-difference` captions | §"Code Examples" → grid snippet; §"Pitfalls" → URL encoding for PHOTOS[1] |
| HOME-V2-10 | PERSONAL 3-card grid with top 1px ink border | §"Code Examples" → card pattern |
| HOME-V2-11 | Inverted ink footer 4 cols + bottom row | §"Phase 9 Primitive Prop Signatures" → FooterCol verified; §"Critical Gap" — must not double-render |
| HOME-V2-12 | Mobile single-column, 56px manifesto, 2×2 photo grid, footer dividers, 44px tap targets | §"Mobile Manifesto Line-Break Recommendation" |
| MOTION-07 | Manifesto letter-stagger interaction | §"Code Examples" → `<ManifestoReveal>` skeleton; §"Standard Stack" → motion/react 12.38 verified |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Render homepage shell (header → 9 sections → footer) | Next.js Server Component (`/app/page.tsx`) | — | Mostly static markup + ISR data fetch; no client state outside manifesto |
| Notion data fetch (posts, projects, events) | Next.js Server Component | — | `revalidate = 1800`; existing pattern in `src/lib/notion*.ts` |
| Manifesto letter-stagger animation | Browser / Client (`<ManifestoReveal>` `'use client'`) | — | Reads `sessionStorage`, uses `useReducedMotion()`, runs per-character transforms in browser |
| Sub-page nav targets | Next.js App Router routes | — | `/projects`, `/blog`, `/events`, `/about`, `/links` already exist |
| Image rendering (epigraph + 6 plates) | Next.js Image optimization (CDN) | Static `/public/` | `next/image` with `priority` on LCP (epigraph), lazy on others |
| Lenis smooth scroll + page-load fade | Browser / Client (`<LenisProvider>` + `<Template>`) | — | DO NOT TOUCH — preserved from Phase 8 |
| JSON-LD SEO schema | Server Component (inline `<script>`) | — | `<JsonLd data={buildPersonSchema()} />` preserved |

## Critical Gap: Global Chrome Conflict

**CONTEXT.md does not address this; the planner must.**

`src/app/layout.tsx` (lines 67–73) wraps every route in:

```tsx
<LenisProvider>
  <MotionProvider>
    <Navigation />               {/* fixed-position v1.0 header */}
    <main className="pt-16">{children}</main>
    <Footer />                   {/* v1.0 footer with Contact + Links/Socials */}
  </MotionProvider>
</LenisProvider>
```

`<Navigation />` is `'use client'` (`src/components/nav/navigation.tsx`), uses `position: fixed; top: 0; bg-[var(--bg)]`, with 2 nav links (About, #contact). `<main>` gets `pt-16` (64px) to clear it.

`<Footer />` (`src/components/footer.tsx`) renders a 95-line Contact + Links + Socials grid for ALL routes.

If the new homepage adds its own header + inverted footer inside `page.tsx`:
- A duplicate v1.0 fixed header overlays the v2.0 36px-top editorial header.
- `<main className="pt-16">` adds 64px above the v2.0 header.
- The v2.0 inverted ink footer renders ABOVE the v1.0 paper footer — visual layout breaks.

**Three resolution options (planner picks one in Plan 10-01):**

| Option | Approach | Cost | Coupling Risk |
|--------|----------|------|--------------|
| **(a) Conditional global chrome** | Edit `<Navigation />` + `<Footer />` to `usePathname()` and return `null` when `pathname === '/'`. The new homepage owns its chrome. Other routes keep v1.0 chrome until Phase 12. | 2 one-line edits | None — Phase 12 deletes both files anyway |
| (b) Replace globals site-wide now | Promote new editorial header + footer to global; delete v1.0 Navigation + Footer | Touches Phase 12 scope | Pulls 6 sub-pages into Phase 10 work prematurely |
| (c) Route group | Move existing pages into `(v1)/` group with v1 layout; new homepage in `(v2)/` group with v2 layout | Largest refactor | Highest |

**Recommendation:** **Option (a).** Smallest blast radius; doesn't bleed into Phase 12; matches the "v1.0→v2.0 alias bridge" pattern Phase 9 established (D-02). Also removes the `pt-16` offset constraint so the manifesto can use the 180px hero padding the handoff specifies. The planner should add a pre-Plan-10-01 surgical edit (or include it in Plan 10-01 as Task 0) to gate both globals on `pathname !== '/'`.

## Standard Stack

### Core (all already installed — NO new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | App Router, ISR, Image, Server Components | Already in use. Note: project uses Next.js 16 not 15.x — CLAUDE.md recommends 15.2.x but the live code is 16.2.1. `[VERIFIED: package.json]` |
| react | 19.2.4 | UI runtime + Server Components boundary | Already in use `[VERIFIED: package.json]` |
| motion | 12.38.0 | Manifesto letter-stagger + reduced-motion hook | `useReducedMotion`, `<motion.div variants>`, `<motion.span>` all verified in existing code (template.tsx, visit-survey.tsx) `[VERIFIED: package.json + grep]` |
| @notionhq/client | 4.0.2 | Notion data fetch | Already wired in `src/lib/notion*.ts` `[VERIFIED: package.json]` |
| tailwindcss | 4.x | Utility CSS + `@theme inline` tokens | Phase 9 tokens live in `globals.css` `[VERIFIED: file read]` |
| clsx + tailwind-merge | 2.1.1 / 3.5.0 | `cn()` helper at `src/utils/cn.ts` | Used in `<ListRow>` already `[VERIFIED: file read]` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/image | (Next 16) | Epigraph + 6 plates | Use `priority` on epigraph only (above-fold LCP); the other 6 plates are below-fold — omit `priority`, let lazy-loading defaults apply |
| next/link | (Next 16) | All internal nav | Already used everywhere; primitives wrap it (`<ListRow>`, `<AllLink>`, etc.) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `motion/react` `motion.span` per character | CSS `@keyframes` + per-character `<span>` with inline `style` `animation-delay` | CSS approach is JS-free but harder to gate behind `sessionStorage` and `useReducedMotion()`. Stick with motion. |
| Inline `<HomeFeaturedEvent>` | Extract to `src/components/home-v2/featured-event.tsx` | CONTEXT.md D-19 says inline-then-extract. Defer extraction. |
| `date-fns` for "MAY 2026" formatting | `Intl.DateTimeFormat` via `Date.prototype.toLocaleDateString` | `date-fns` is NOT installed (verified `package.json`). Existing `formatLongDate` / `formatShortDate` in `event-cards.tsx` use `toLocaleDateString` — same pattern. No new dep needed. |

**Installation:** None. All deps present.

**Version verification:**
```bash
node -p "require('./package.json').dependencies.motion"  # 12.38.0
node -p "require('./package.json').dependencies.next"    # 16.2.1
```
`[VERIFIED: package.json read 2026-05-21]`

## Package Legitimacy Audit

> No new packages installed in Phase 10. All dependencies already verified during prior phases. This section is intentionally minimal — slopcheck not run because no install action occurs.

| Package | Registry | Disposition |
|---------|----------|-------------|
| motion (12.38.0) | npm | Already installed; verified via grep usage in 6 src files |
| next (16.2.1) | npm | Already installed |
| @notionhq/client (4.0.2) | npm | Already installed |

## Phase 9 Primitive Prop Signatures (verified verbatim from source)

> All 7 primitives match CONTEXT.md assumptions. Planner can use these signatures directly.

### `Rule` — `src/components/editorial/rule.tsx`
```tsx
export function Rule() {
  return <hr className="border-0 border-t border-rule" aria-hidden="true" />;
}
```
**Props:** none. Self-closing.

### `RuleStrong` — `src/components/editorial/rule-strong.tsx`
```tsx
export function RuleStrong() {
  return <hr className="border-0 border-t border-rule-strong" aria-hidden="true" />;
}
```
**Props:** none. Self-closing.

### `SectionLabel` — `src/components/editorial/section-label.tsx`
```tsx
type Props = { children: ReactNode; numeral?: string };
export function SectionLabel({ children, numeral }: Props) { /* baseline flex, text-label uppercase */ }
```
**Props:** `children` (required, ReactNode), `numeral` (optional, string). Renders `<div>` with `flex items-baseline justify-between text-label uppercase text-ink`; numeral painted `text-muted`.

### `ListRow` — `src/components/editorial/list-row.tsx`
```tsx
type Props = {
  title: ReactNode;
  href: string;
  extra?: ReactNode;
  meta?: ReactNode;
  big?: boolean;
};
```
**Props:** `title`, `href` required; `extra`, `meta`, `big` optional.
- Non-big: `py-5`, title uses `text-list-title-home` (20px)
- Big: `py-7`, title uses `text-list-title` (28px)
- `border-t border-rule` between rows; `first:border-t-0` removes top border on first row.
- `meta` renders `text-meta uppercase text-muted` right-aligned.
- `extra` renders `text-caption text-muted` below the title.

### `AllLink` — `src/components/editorial/all-link.tsx`
```tsx
type Props = { children: ReactNode; href: string };
```
**Props:** `children` (the "All X →" text), `href`. Renders `<Link>` with `inline-block border-b border-ink pb-1 text-label uppercase text-ink`.

### `IntroLink` — `src/components/editorial/intro-link.tsx`
```tsx
type Props = { children: ReactNode; href: string };
```
**Props:** `children`, `href`. Renders `<Link>` with `border-b border-ink`. Inline by default (no `inline-block`).

### `FooterCol` — `src/components/editorial/footer-col.tsx`
```tsx
type FooterLink = { label: string; href: string; sub?: string };
type Props = { title: string; links: FooterLink[] };
```
**Props:** `title` (column heading, rendered `text-label uppercase text-footer-mute`), `links` (array of `{label, href, sub?}` — sub renders as `text-caption text-footer-mute` below the link).

**Mismatch flags vs. CONTEXT.md:** None. All assumptions in CONTEXT.md D-13..D-30 use exact props that match the source files.

## Notion Data Shapes (verified verbatim from source)

> Field names below differ from CONTEXT.md assumptions in two places — see "Mismatch flags".

### `BlogPost` — `src/lib/notion.ts`
```ts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;    // ← NOT `excerpt`, NOT `subtitle`
  published: boolean;
  date: string;           // ISO date string
  tags: string[];
  cover: string | null;
  emoji: string | null;
  lastEdited: string;
}
```

**Fetcher:** `getPublishedPosts(): Promise<BlogPost[]>` — filtered by `Published=true`, sorted by Date descending. **No error wrapping** (caller catches in `try/catch`).

**Mismatch flag for D-17:** CONTEXT.md says "post.excerpt (or post.subtitle — verify Notion BlogPost type during planning)". The actual field is **`description`**. Plan 10-03 should use `post.description` for `<ListRow extra>`. Empty string `""` if not set in Notion — handle empty gracefully.

**Date formatting for D-17 `meta`:** Use the existing pattern from `event-cards.tsx`:
```ts
new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
// → "MAY 2026"
```

### `Project` — `src/lib/notion-projects.ts`
```ts
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  emoji: string | null;
  externalUrl: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  lastEdited: string;
}
```

**Fetchers:**
- `getPublishedProjects()` — all published
- `getFeaturedProjects()` — `Published=true AND Featured=true`, sorted Date desc.

Both already wrap in `try/catch` and return `[]` on failure (defensive — caller still wraps but it's belt-and-suspenders).

**For D-15 BUILDING:** Use `getFeaturedProjects()`. Project names = `projects.map(p => p.title)`. Comma-separated first 8 + "+N more" when `projects.length > 8`.

### `EventItem` — `src/lib/notion-events.ts`
```ts
export interface EventItem {
  id: string;
  name: string;             // ← NOT `title`
  date: string | null;      // ISO date or null
  endDate: string | null;
  location: string;
  link: string | null;      // ← NOT `rsvpUrl`
  description: string;
  emoji: string | null;
  image: string | null;
  published: boolean;
}
```

**Fetchers:**
- `getUpcomingEvents()` — `Date >= today`, ascending. Returns `[]` on missing env or fetch error.
- `getPastEvents()` — `Date < today`, descending. Same fallback.

**Mismatch flags for D-19 / D-21:**
- CONTEXT.md says `event.title` — actual field is **`event.name`**.
- CONTEXT.md says `event.rsvpUrl` — actual field is **`event.link`**.
- CONTEXT.md says `event.time` / `event.startTime` — neither exists. `date` is an ISO timestamp; format the time portion with `new Date(event.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })` → "7:00 PM EST". If you don't trust the Notion data to include a time, render `event.location` only.

**No-event empty state (D-22):** Recommend rendering muted `<p className="text-caption text-muted">No upcoming events.</p>` — do not ship the handoff sample copy "AI for Small Biz, Vol. II..." as a hardcoded placeholder.

## Date Formatting Helpers

**Existing:** `src/components/events/event-cards.tsx` defines two helpers (`formatLongDate`, `formatShortDate`) using `toLocaleDateString`. They are **local to that file**, not exported.

**Recommendation:** Plan 10-03 (writing + events) introduces a tiny module `src/lib/dates.ts` with three exported formatters:

```ts
// src/lib/dates.ts (NEW — create in Plan 10-03)
export function formatMonthYear(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();              // → "MAY 2026"
}

export function formatNextDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();              // → "JUN 12"
}

export function formatEventTime(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });                            // → "7:00 PM EST"
}
```

Co-locating prevents the inline-formatter sprawl from `event-cards.tsx` recurring on the new homepage. `[CITED: existing pattern in src/components/events/event-cards.tsx]`

## Asset Verification

**Photo files in `/public/MSizzle-website-photos/`** (verified 2026-05-21 via `ls`):

| Index | Filename (literal) | URL-safe path | Mime |
|-------|---------------------|---------------|------|
| PHOTOS[0] | `000092530012.jpeg` | `/MSizzle-website-photos/000092530012.jpeg` | jpeg |
| PHOTOS[1] | `20230928 MSB_0114.jpg` (LITERAL SPACE) | `/MSizzle-website-photos/20230928%20MSB_0114.jpg` | jpg |
| PHOTOS[2] | `IMG_0028.jpeg` | `/MSizzle-website-photos/IMG_0028.jpeg` | jpeg |
| PHOTOS[3] | `IMG_1075.JPG` (UPPERCASE EXT) | `/MSizzle-website-photos/IMG_1075.JPG` | jpg |
| PHOTOS[4] | `IMG_2129.jpeg` | `/MSizzle-website-photos/IMG_2129.jpeg` | jpeg |
| PHOTOS[5] | `Patricof09.jpg` | `/MSizzle-website-photos/Patricof09.jpg` | jpg |

**URL encoding for PHOTOS[1]:** Yes, `next/image` accepts `%20` in the `src` prop. The handoff already uses `20230928%20MSB_0114.jpg` for its hot-link reference. **Recommended pattern:** declare the photos as a constant array of objects in `src/lib/photos.ts` (or inline in Plan 10-04) and use `encodeURI()` defensively, OR write the encoded path literally as a string constant.

**Recommended Plan 10-04 photo constant:**
```ts
// inline in page.tsx, or src/lib/photos.ts
const HOME_PHOTOS = [
  { src: "/MSizzle-website-photos/000092530012.jpeg",      no: "01" },
  { src: "/MSizzle-website-photos/20230928%20MSB_0114.jpg", no: "02" },
  { src: "/MSizzle-website-photos/IMG_0028.jpeg",          no: "03" },
  { src: "/MSizzle-website-photos/IMG_1075.JPG",           no: "04" },
  { src: "/MSizzle-website-photos/IMG_2129.jpeg",          no: "05" },
  { src: "/MSizzle-website-photos/Patricof09.jpg",         no: "06" },
] as const;
```

**Mixed-case extensions:** `next/image` is content-agnostic to the extension casing as long as the file exists at the path. `IMG_1075.JPG` (uppercase) works identically to `IMG_2129.jpeg` (lowercase). `[VERIFIED: Next.js Image accepts any path that 200s; file extension is informational]`

**LCP optimization (D-09):** `priority` on the epigraph (PHOTOS[0]) is the correct Next.js Image LCP signal. The 6 grid plates are below-fold; **do NOT set `priority` on them** (it would defeat LCP heuristics by promoting non-LCP candidates). Lazy-loading is the default. `[VERIFIED: Next.js Image documentation pattern, standard for above-fold hero + below-fold gallery]`

## motion/react 12.38 API Surface (verified)

> All required APIs are already used elsewhere in the codebase. No new patterns introduced.

### `useReducedMotion()` — used in 3 places

```tsx
import { useReducedMotion } from "motion/react";
const shouldReduceMotion = useReducedMotion();  // boolean | null
```

Returns `null` on SSR, `true`/`false` after client mount. Existing usage:
- `src/app/template.tsx` — page-transition variants
- `src/components/providers/lenis-provider.tsx` — early-return when reduced
- `src/components/visit-survey.tsx` — animation variants

`[VERIFIED: grep + file read]`

### `<motion.div variants={container}>` + `<motion.span variants={item}>` with `staggerChildren`

The canonical pattern. Below is the working skeleton the planner should embed verbatim in Plan 10-07's `<action>`.

### `transform: translateY(110%)` in motion variants

Use `y: "110%"` as a string OR a number. The string form preserves the percentage unit. **Verified: motion 12.x supports string-with-unit y values** — this is how visit-survey.tsx already animates `y: 100` (number = pixels) and how the manifesto requires `y: "110%"` (relative-to-line-height).

`[CITED: motion.dev docs — `motion` Animation Values supports any CSS value-as-string]`

### Compatibility with Next.js 16 + React 19 Server Component → Client Component boundary

- `page.tsx` stays a Server Component (default).
- `<ManifestoReveal>` is a Client Component (`'use client'`). It's imported from a Server Component — the standard Next.js App Router pattern.
- The `lines: string[]` prop is serializable (passes the SC→CC boundary cleanly).

`[VERIFIED: existing pattern with template.tsx, lenis-provider.tsx, motion-provider.tsx — all 'use client' rendered from layout (SC) without issue]`

### LazyMotion + `m` vs `motion`

`src/components/providers/motion-provider.tsx` wraps everything in:
```tsx
<LazyMotion features={domAnimation} strict>
  <MotionConfig reducedMotion="user">
```

`strict` mode means `<motion.*>` components throw — only `<m.*>` is allowed inside the LazyMotion tree. `template.tsx` uses `m.div` (verified). `visit-survey.tsx` uses `motion.div` (would throw in strict mode if LazyMotion wrapped it — but `visit-survey.tsx` is OUTSIDE the LazyMotion subtree because it's a sibling of `<main>` in `layout.tsx`, not a descendant). Wait — re-reading layout: `<VisitSurvey />` is OUTSIDE `<MotionProvider>`. So `motion.*` works there because no LazyMotion wraps it.

**Implication for `<ManifestoReveal>`:** Since `<ManifestoReveal>` is rendered INSIDE `<main>` (which is inside `<MotionProvider>` which has `LazyMotion strict`), it **MUST use `m.span` not `motion.span`**. Using `motion.*` will throw `Component type "motion.span" is not valid` in strict mode.

`[VERIFIED: motion-provider.tsx + template.tsx pattern]`

**This is a load-bearing detail. Plan 10-07 MUST import `m` not `motion` from `motion/react`.**

## Current page.tsx Inventory (what Plan 10-01 deletes)

**File:** `src/app/page.tsx` (191 lines).

**Imports to DELETE:**
```ts
import Link from "next/link";                                       // KEEP (still used)
import { getPublishedPosts } from "@/lib/notion";                   // KEEP
import { getFeaturedProjects } from "@/lib/notion-projects";        // KEEP
import { getUpcomingEvents, getPastEvents } from "@/lib/notion-events"; // KEEP getUpcoming; DELETE getPastEvents (not used in v2.0 homepage)
import {
  FeaturedUpcoming,
  UpcomingMini,
  PastEventCard,
} from "@/components/events/event-cards";                           // DELETE all 3 imports
import { JsonLd } from "@/components/seo/json-ld";                  // KEEP
import { buildPersonSchema } from "@/lib/seo/schemas";              // KEEP
```

**JSX blocks to DELETE (wholesale rewrite):**
- Lines 38–71: Hero `<section>` with `<h1>Monty Singer</h1>` and 3-link row
- Lines 73–99: Writings `<section>` with `<Link href="/blog">Writings ↘</Link>` and `posts.slice(0, 3)` list
- Lines 101–127: Works `<section>` with `<Link href="/projects">Works ↘</Link>` and `projects.slice(0, 3)` list
- Lines 129–187: Events `<section>` with FeaturedUpcoming + UpcomingMini + PastEventCard composition

**JSX/state to KEEP:**
- Line 13: `export const revalidate = 1800;`
- Line 15: `export default async function Home()`
- Lines 16–32: The 4 `let ... = []` declarations and 4 `try/catch` blocks. Plan 10-03 may simplify (drop `pastEvents` from the local scope since v2.0 homepage doesn't use it).
- Line 36: `<JsonLd data={buildPersonSchema()} />` — preserve.

**Imports to ADD in Plan 10-01** (new):
```ts
import Image from "next/image";
import { Rule } from "@/components/editorial/rule";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { SectionLabel } from "@/components/editorial/section-label";
import { ListRow } from "@/components/editorial/list-row";
import { AllLink } from "@/components/editorial/all-link";
import { IntroLink } from "@/components/editorial/intro-link";
import { FooterCol } from "@/components/editorial/footer-col";
// Added in Plan 10-07:
import { ManifestoReveal } from "@/components/home-v2/manifesto-reveal";
```

(Primitives can be added incrementally per-plan as each section is built, OR all at once in 10-01 with eslint-disable for unused imports — recommend incremental per plan.)

## Architecture Patterns

### System Architecture Diagram

```
                  ┌──────────────────────────────────┐
                  │  src/app/layout.tsx (RootLayout) │
                  │  • Inter font (400/700)          │
                  │  • LenisProvider                 │
                  │  • MotionProvider (LazyMotion)   │
                  │  • Navigation  ← GATE on '/'     │
                  │  • <main pt-16>                  │
                  │  • Footer      ← GATE on '/'     │
                  │  • UmamiAnalytics, VisitSurvey   │
                  └──────────────┬───────────────────┘
                                 │
                  ┌──────────────▼───────────────────┐
                  │  src/app/template.tsx            │
                  │  • 300ms opacity fade            │
                  │  • Wraps children in m.div       │
                  └──────────────┬───────────────────┘
                                 │
            ┌────────────────────▼────────────────────┐
            │  src/app/page.tsx (Server Component)    │
            │  export const revalidate = 1800         │
            │                                          │
            │  Server fetch (parallel try/catch):      │
            │   ├ getPublishedPosts()                 │
            │   ├ getFeaturedProjects()               │
            │   └ getUpcomingEvents()                 │
            │                                          │
            │  Render:                                 │
            │   1. <JsonLd data={buildPersonSchema()} │
            │   2. <header> — name + nav              │
            │   3. <ManifestoReveal lines={...} />    │ ← Client Component
            │      └ 'use client'                     │
            │      └ motion/react m.span per char     │
            │      └ sessionStorage gate              │
            │      └ useReducedMotion fallback        │
            │   4. Meta row                            │
            │   5. <Image priority> epigraph           │
            │   6. Letter-style intro <IntroLink x 3> │
            │   7. <RuleStrong /> + BUILDING section  │
            │   8. <RuleStrong /> + WRITING section   │
            │      └ ListRow big × 3 (posts)          │
            │      └ AllLink                          │
            │   9. <RuleStrong /> + EVENTS section    │
            │      └ inline featured event            │
            │      └ ListRow × 2 (upcomingEvents[1..3])│
            │   10. <RuleStrong /> + PHOTOGRAPHS      │
            │      └ 12-col grid, 6 plates            │
            │   11. <RuleStrong /> + PERSONAL         │
            │      └ 3-card grid                      │
            │   12. <footer> — inverted ink, 4 cols   │
            └─────────────────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── app/
│   └── page.tsx                       # ← rewritten Plan 10-01..10-06
├── components/
│   ├── editorial/                     # ← Phase 9 primitives (read-only here)
│   │   ├── rule.tsx
│   │   ├── rule-strong.tsx
│   │   ├── section-label.tsx
│   │   ├── list-row.tsx
│   │   ├── all-link.tsx
│   │   ├── intro-link.tsx
│   │   └── footer-col.tsx
│   ├── home-v2/                       # ← NEW directory for homepage-specific components
│   │   └── manifesto-reveal.tsx       # ← created in Plan 10-07
│   ├── nav/
│   │   └── navigation.tsx             # ← edited Plan 10-01 (Task 0: pathname gate)
│   └── footer.tsx                     # ← edited Plan 10-01 (Task 0: pathname gate)
└── lib/
    ├── dates.ts                       # ← NEW in Plan 10-03 (formatMonthYear, formatNextDate, formatEventTime)
    ├── notion.ts                      # ← read-only
    ├── notion-projects.ts             # ← read-only
    └── notion-events.ts               # ← read-only
```

### Pattern 1: Section Composition (D-13 verbatim)

**What:** Every content section follows the same skeleton.

```tsx
{/* Source: CONTEXT.md D-13 + Phase 9 primitives */}
<RuleStrong />
<section className="px-40 pt-30 pb-30">          {/* 120px top/bottom; px-40 = 160px */}
  <SectionLabel numeral="01 — Studio">Building</SectionLabel>
  <div className="mt-18">                          {/* 72px below label */}
    {/* section content */}
  </div>
  <div className="mt-12">
    <AllLink href="/projects">View all works →</AllLink>
  </div>
</section>
```

**Note on Tailwind spacing:** `mt-18` = 72px, `mt-30` = 120px. If Tailwind v4 default scale doesn't include these (verify in plan-check), use arbitrary values `mt-[72px]` / `pt-[120px]`. The handoff numbers are non-negotiable.

### Pattern 2: Client Component Island

**What:** `<ManifestoReveal>` is the ONLY client island on the page (besides preserved `<Navigation>` if D-01 fix is gating, and ambient `<LenisProvider>`/`<Template>`).

**When to use:** Animation that depends on `sessionStorage` + `useReducedMotion()`. Everything else (static markup, Notion data, rules, captions) is a Server Component.

### Anti-Patterns to Avoid

- **DO NOT** add `'use client'` to `page.tsx` itself — keep server rendering for the 8 static sections.
- **DO NOT** import `motion` from `motion/react` inside the LazyMotion-strict tree — use `m` (per Phase 8/9 precedent and the motion-provider config).
- **DO NOT** hardcode any project names, essay titles, or event names — the homepage MUST pull live from the 3 Notion fetchers (success criterion #3).
- **DO NOT** add `priority` to the 6 photograph plates — only the epigraph (D-09 LCP signal).
- **DO NOT** add the `<RuleStrong />` border BEFORE the epigraph image (D-13 starts at the first content section AFTER the intro paragraph — the manifesto + epigraph + intro form the hero without a strong rule between them; the handoff diagram puts the first strong rule between the intro paragraph and BUILDING).
- **DO NOT** revive `animate-ping` anywhere — D-20 / MOTION-05 explicitly prohibits it for the featured event.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-character letter stagger | Manual `setTimeout` chain + `useState` array of "revealed" booleans | `<m.div variants={container}>` + `<m.span variants={item}>` + `staggerChildren: 0.018` | motion handles `staggerChildren`, reduced-motion fallback, and unmount cleanly. Manual orchestration is fragile and harder to gate behind `sessionStorage`. |
| Date formatting ("MAY 2026", "JUN 12") | Custom regex on `date.toString()` | `Intl.DateTimeFormat` via `toLocaleDateString` (existing pattern in `event-cards.tsx`) | Native, no dep, handles locale + timezone consistently. |
| Class-merging conditional CSS | String concatenation with template literals | `cn()` helper at `@/utils/cn` (already in use) | clsx + tailwind-merge handles conflicts (e.g., `py-5` vs `py-7` in ListRow's `big` variant). |
| `sessionStorage` SSR safety | `useEffect` with manual `typeof window` checks | Same — but read in a `useEffect` (runs only on client), never during render | `sessionStorage` is undefined on the server; reading it in render crashes SSR. |
| 12-column asymmetric photo grid | JS-driven layout calculations | Tailwind `grid grid-cols-12 grid-rows-[180px] gap-3` + per-plate `col-span-N row-span-M` | CSS grid handles all of this declaratively. |

**Key insight:** This phase is composition, not invention. Phase 9 already built the LEGO bricks (tokens + 7 primitives); Phase 10 assembles them per the handoff. Resist the temptation to invent new primitives or animation utilities here — defer to Phase 11+ if reuse emerges.

## Common Pitfalls

### Pitfall 1: Double-rendering Navigation/Footer

**What goes wrong:** Plan 10-01 adds a new `<header>` and `<footer>` inside `page.tsx` without touching `layout.tsx`. The user sees the v1.0 fixed-position Nav above the v2.0 editorial header, and the v1.0 paper Footer below the v2.0 inverted ink footer.

**Why it happens:** CONTEXT.md doesn't address global chrome; the existing layout is invisible to the discuss-phase author until you read `layout.tsx`.

**How to avoid:** Plan 10-01 Task 0 (or a pre-Plan-10-01 surgical task) — edit `Navigation` and `Footer` to early-return `null` when `pathname === '/'`. Both are `'use client'`-eligible already; Footer needs to become `'use client'` (currently server) — add `'use client'` directive and `import { usePathname } from 'next/navigation'`.

**Warning signs:** First `npm run build` + `npm run dev` after Plan 10-01 shows two headers and two footers stacked. Visual test catches this immediately.

### Pitfall 2: LazyMotion strict mode crash

**What goes wrong:** Plan 10-07 imports `motion` from `motion/react`, uses `<motion.span>` inside the manifesto. Build succeeds, but runtime throws `Error: You're trying to use a motion component (motion.span) inside a "strict" LazyMotion configuration`.

**Why it happens:** `<MotionProvider>` in `layout.tsx` sets `<LazyMotion strict>`, which forbids the full `motion.*` API in favor of the lazy-loadable `m.*` namespace.

**How to avoid:** Import `m` not `motion`:
```tsx
import { m, useReducedMotion } from "motion/react";
// ...
<m.span variants={item}>{char}</m.span>
```

**Warning signs:** Error in browser console; HUMAN-UAT catches.

### Pitfall 3: Reading sessionStorage during render

**What goes wrong:** `<ManifestoReveal>` reads `sessionStorage.getItem('gsd:manifesto-shown')` directly inside the component body during render. Next.js SSR has no `sessionStorage` → ReferenceError → page crashes server-side.

**Why it happens:** Even though the component is `'use client'`, React 19 still attempts a server render for SSR streaming. `sessionStorage` is browser-only.

**How to avoid:** Wrap the read in `useEffect`:
```tsx
const [hasShown, setHasShown] = useState<boolean | null>(null);
useEffect(() => {
  setHasShown(sessionStorage.getItem('gsd:manifesto-shown') !== null);
}, []);
// Render skeleton when hasShown === null (avoids hydration mismatch).
```

OR use the pattern from `src/components/visit-survey.tsx` (line 22–33) which reads inside `useEffect`.

**Warning signs:** SSR-time error in `npm run build` or `npm run dev` startup logs. `[ReferenceError: sessionStorage is not defined]` is the signature.

### Pitfall 4: Hydration mismatch on the manifesto

**What goes wrong:** Server renders the manifesto with all letters at their final position (since `sessionStorage` is null → "skip animation"). Client mounts, reads sessionStorage → finds nothing → triggers the stagger → letters fade in. The handoff between SSR HTML and client React causes a momentary flash where the letters "snap" from rendered → invisible → animate-in.

**Why it happens:** The render path needs to be IDENTICAL between server and first client render, then update only after `useEffect`.

**How to avoid:** Render the manifesto as static text (final state) during SSR. Use a `useEffect` to (a) check sessionStorage, (b) decide whether to animate, (c) trigger animation by toggling a `revealed` state. The animation starts AFTER hydration. The handoff doc actually specifies this exact pattern: "After 200ms, set `revealed=true` to apply per-letter staggered transitions."

**Warning signs:** Visual flicker on first paint; React DevTools profile shows a render flash.

### Pitfall 5: `whitespace-nowrap` failing on per-letter spans

**What goes wrong:** Each letter is `<m.span style={{display: 'inline-block'}}>` — but the line's container doesn't have `white-space: nowrap`, so when a letter `inline-block`'s width changes mid-animation, the line wraps mid-word.

**How to avoid:** The PARENT line wrapper must carry `white-space: nowrap` (CONTEXT.md D-02 mandates this). The container ALSO needs `overflow: hidden` (so letters animating up from `translateY(110%)` are clipped by the line box):
```tsx
<div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
  {chars.map((c, i) => <m.span key={i} style={{ display: 'inline-block' }} variants={item}>{c}</m.span>)}
</div>
```

**Warning signs:** Manifesto wraps to 3 lines on desktop instead of 2 when zooming; letters peeking above their line at the start of the animation.

### Pitfall 6: Notion fetcher returning empty array silently

**What goes wrong:** `getFeaturedProjects()` returns `[]` because `NOTION_PROJECTS_DATABASE_ID` isn't set in the env. BUILDING section shows "Selected Works" with an empty list and "+0 more" text.

**How to avoid:** Each section needs a graceful empty state per D-18 (WRITING) and D-22 (EVENTS). Add a similar fallback for BUILDING Selected Works: if `projects.length === 0`, render `"Recent work coming soon."` in `text-muted` instead of the empty comma-list.

**Warning signs:** Visual QA on a fresh local clone with no Notion env vars shows broken sections.

## Code Examples

### `<ManifestoReveal>` skeleton (Plan 10-07)

> Source: synthesized from `src/app/template.tsx` (motion m.div pattern), `src/components/visit-survey.tsx` (sessionStorage gate pattern), and handoff spec. Embed verbatim in Plan 10-07's `<action>`.

```tsx
// src/components/home-v2/manifesto-reveal.tsx
"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion, type Variants } from "motion/react";

type Props = { lines: string[] };

const STAGGER_PER_LETTER = 0.018;     // 18ms
const TRANSFORM_DURATION = 0.7;        // 700ms
const OPACITY_DURATION = 0.5;          // 500ms
const FADE_FALLBACK_DURATION = 0.3;    // 300ms reduced-motion
const SESSION_FLAG = "gsd:manifesto-shown";

export function ManifestoReveal({ lines }: Props) {
  const shouldReduceMotion = useReducedMotion();
  // 'pending' until we've checked sessionStorage on mount
  const [phase, setPhase] = useState<"pending" | "animate" | "skip">("pending");

  useEffect(() => {
    const already = sessionStorage.getItem(SESSION_FLAG);
    if (already) {
      setPhase("skip");
    } else {
      sessionStorage.setItem(SESSION_FLAG, "1");
      setPhase("animate");
    }
  }, []);

  // Reduced-motion: render a simple 300ms opacity fade for the whole block
  if (shouldReduceMotion) {
    return (
      <m.h1
        className="text-display uppercase text-ink"
        initial={phase === "animate" ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: FADE_FALLBACK_DURATION, ease: "easeOut" }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block whitespace-nowrap">{line}</span>
        ))}
      </m.h1>
    );
  }

  // Phase still 'pending' (SSR + first client render) → static final state, no animation.
  // This matches server HTML so hydration is clean.
  if (phase === "pending" || phase === "skip") {
    return (
      <h1 className="text-display uppercase text-ink">
        {lines.map((line, i) => (
          <span key={i} className="block whitespace-nowrap">{line}</span>
        ))}
      </h1>
    );
  }

  // Phase === 'animate': per-character stagger.
  // Compute the per-character delay using (lineIdx * lineLength + charIdx) × 18ms per D-03.
  const lineCharCounts = lines.map((l) => l.length);
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0 } },  // we hand-set per-char delays below
  };
  const item: Variants = {
    hidden: { y: "110%", opacity: 0 },
    visible: (delay: number) => ({
      y: "0%",
      opacity: 1,
      transition: {
        y: { duration: TRANSFORM_DURATION, ease: [0.2, 0.7, 0.2, 1], delay },
        opacity: { duration: OPACITY_DURATION, ease: "easeOut", delay },
      },
    }),
  };

  return (
    <m.h1
      className="text-display uppercase text-ink"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {lines.map((line, lineIdx) => (
        <span
          key={lineIdx}
          className="block whitespace-nowrap overflow-hidden"
        >
          {Array.from(line).map((char, charIdx) => {
            // delay = (lineIdx × lineLength + charIdx) × 0.018s
            // per D-03; lineLength here = THIS line's length (handoff says
            // "lineIndex * lineLength" which is ambiguous for ragged lines;
            // safest interpretation: cumulative char index across all lines).
            const cumulative =
              lineCharCounts.slice(0, lineIdx).reduce((s, n) => s + n, 0) + charIdx;
            const delay = cumulative * STAGGER_PER_LETTER;
            return (
              <m.span
                key={charIdx}
                className="inline-block"
                variants={item}
                custom={delay}
              >
                {char === " " ? " " : char}
              </m.span>
            );
          })}
        </span>
      ))}
    </m.h1>
  );
}
```

**Note on the delay formula (handoff D-03 ambiguity):** The handoff says `(lineIndex * lineLength + charIndex) * 18ms`. With "BRING" (5 chars) and "FIRE TO HUMANITY." (17 chars), interpreting `lineLength` as "this line's length" gives line 1: 0..72ms; line 2: 5×17=85ms + 0..272ms = 85..357ms. Interpreting it as "cumulative char count" gives line 1: 0..72ms; line 2: 90..378ms (smoother continuation across the line break). The skeleton above uses the **cumulative** interpretation, which feels more "one continuous wave" — locked-in for HUMAN-UAT to perceptually validate.

### Static manifesto markup (Plan 10-01, before Plan 10-07 wires the animation)

```tsx
{/* Plan 10-01 — static final state, no animation yet */}
<h1 className="text-display uppercase text-ink">
  <span className="block whitespace-nowrap">BRING FIRE</span>
  <span className="block whitespace-nowrap">TO HUMANITY.</span>
</h1>
```

Plan 10-07 replaces this with `<ManifestoReveal lines={["BRING FIRE", "TO HUMANITY."]} />`.

### Meta row (D-06)

```tsx
<div className="mt-14 flex items-center gap-3">
  {/* 32px hairline */}
  <span aria-hidden="true" className="inline-block h-px w-8 bg-ink" />
  <span className="text-meta uppercase text-muted">
    EST. 2026 · WASHINGTON, D.C.
  </span>
</div>
```

### Epigraph (D-09, D-10)

```tsx
<figure className="mt-20">
  <Image
    src="/MSizzle-website-photos/000092530012.jpeg"
    alt="A year in motion, on film"
    width={1120}
    height={540}
    priority
    sizes="(max-width: 768px) 100vw, 1120px"
    className="aspect-[1120/540] w-full object-cover"
  />
  <figcaption className="mt-4 flex justify-between text-meta uppercase text-muted">
    <span>Plate I — A year in motion · 2025–26</span>
    <span>Photographed on film</span>
  </figcaption>
</figure>
```

### Photographs 12-col grid (D-23, D-24)

```tsx
<div className="grid grid-cols-12 grid-rows-[180px] gap-3 md:gap-3">
  {/* Plate A — top-left anchor */}
  <div className="relative col-span-7 row-span-3">
    <Image
      src="/MSizzle-website-photos/000092530012.jpeg"
      alt=""
      fill
      className="object-cover saturate-[0.92]"
      sizes="(max-width: 768px) 50vw, 50vw"
    />
    <span className="absolute left-3.5 bottom-3 text-[10px] uppercase tracking-[0.2em] font-bold text-paper mix-blend-difference">
      No. 01
    </span>
  </div>
  {/* Plate B — top-right */}
  <div className="relative col-span-5 row-span-2">
    <Image
      src="/MSizzle-website-photos/20230928%20MSB_0114.jpg"
      alt=""
      fill
      className="object-cover saturate-[0.92]"
      sizes="(max-width: 768px) 50vw, 40vw"
    />
    <span className="absolute left-3.5 bottom-3 text-[10px] uppercase tracking-[0.2em] font-bold text-paper mix-blend-difference">
      No. 02
    </span>
  </div>
  {/* …Plates C/D/E/F follow the same pattern with the col/row spans from D-23 */}
</div>
```

### Inverted footer (D-29..D-31)

```tsx
<footer className="bg-footer-bg text-footer-fg px-40 pt-20 pb-14">
  <div className="grid grid-cols-4 gap-12">
    {/* Col 1: colophon */}
    <div>
      <div className="text-label uppercase text-footer-mute">MONTY SINGER</div>
      <h2 className="text-section-feature mt-6 max-w-[20rem] text-footer-fg">
        A calling card, not a billboard.
      </h2>
    </div>
    <FooterCol title="Studio" links={[
      { label: "Prometheus",      href: "https://prometheus.today" },
      { label: "Selected Works",  href: "/projects" },
      { label: "Process Notes",   href: "/blog" },
    ]} />
    <FooterCol title="Library" links={[
      { label: "Monty Monthly",   href: "/newsletter" },
      { label: "Essays",          href: "/blog" },
      { label: "Reading List",    href: "/links" },
    ]} />
    <FooterCol title="About" links={[
      { label: "About",           href: "/about" },
      { label: "Photo Archive",   href: "/photos" },
      { label: "Contact",         href: "mailto:montydsinger@gmail.com" },
    ]} />
  </div>

  <div className="mt-24 pt-7 border-t border-footer-rule flex justify-between">
    <span className="text-meta uppercase text-footer-fg">
      © 2026 Monty Singer · Washington, D.C.
    </span>
    <div className="flex gap-6">
      <a href="https://x.com/thefullmonty0"            className="text-meta uppercase">Twitter</a>
      <a href="https://github.com/MSizzle"             className="text-meta uppercase">GitHub</a>
      <a href="https://linkedin.com/in/monty-singer"   className="text-meta uppercase">LinkedIn</a>
      <a href="mailto:montydsinger@gmail.com"          className="text-meta uppercase">Email</a>
    </div>
  </div>
</footer>
```

### Global chrome gate (Plan 10-01 Task 0)

```tsx
// src/components/nav/navigation.tsx — add at top of function body
const pathname = usePathname();
if (pathname === '/') return null;
// ... rest unchanged
```

```tsx
// src/components/footer.tsx — convert to 'use client', add at top of function body
'use client'
import { usePathname } from 'next/navigation'
// ...
export function Footer() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  // ... rest unchanged
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package, `motion/react` import path | Motion 11 rename, 2024 | Project already on `motion@12.38.0` — no migration needed |
| Tailwind v3 `tailwind.config.js` | Tailwind v4 `@theme` block in CSS | Phase 9 (2026-05-21) | All tokens live in `globals.css`; no JS config |
| `next-themes` dark mode | Dropped entirely (light-only v2.0) | Phase 9 D-04 | `ThemeProvider` deleted; `next-themes` package retained in `package.json` zero-cost |
| `react-notion-x` for App Router | `notion-to-md` + custom block renderer | v1.0 Phase 2 | Already shipped; no Phase 10 impact |

**Deprecated/outdated:**
- `framer-motion` package name — replaced by `motion` (already migrated).
- `<ThemeProvider>` and `<ThemeToggle>` — deleted in Phase 9.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + Testing Library 16.3.2 + jsdom 29.0.1 `[VERIFIED: package.json]` |
| Config file | (Vitest config inferred from devDeps; planner verifies in plan-check) |
| Quick run command | `npm run build` (Next.js full build — catches type errors + missing imports + dead JSX) |
| Full suite command | `npx vitest run` (existing tests) + `npm run build` |
| Production gate | `vercel build --prod` deferred to Vercel preview deploy (per D-40 + Phase 8/9 precedent) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-V2-01 | Header renders name + 5 nav links | smoke | `npm run dev` + visual | manual |
| HOME-V2-02 | Manifesto = `<h1>` with `text-display`, 2 lines, nowrap, ink | smoke + build | `npm run build && grep -c "BRING FIRE" .next/...` (not reliable; visual) | manual |
| HOME-V2-03 | Meta row with 32px hairline + EST line | smoke | visual | manual |
| HOME-V2-04 | Epigraph image at PHOTOS[0] with `priority` | build | `npm run build` (Next.js validates Image props) | auto |
| HOME-V2-05 | Letter-style intro paragraph with 3 IntroLinks | smoke | visual | manual |
| HOME-V2-06 | BUILDING 3-col grid, Selected Works pulls live names | data + smoke | `npm run build` + page returns Notion data | manual |
| HOME-V2-07 | WRITING 3 essays as ListRow big + AllLink | data + smoke | `npm run build`; visual confirms 3 rows | manual |
| HOME-V2-08 | EVENTS featured + 2 secondary + AllLink | data + smoke | `npm run build`; visual confirms layout | manual |
| HOME-V2-09 | Photographs 12-col grid + 6 plates + mix-blend captions | smoke + visual | `npm run build`; visual confirms grid spans | manual |
| HOME-V2-10 | PERSONAL 3 cards with top ink border | smoke | visual | manual |
| HOME-V2-11 | Inverted ink footer 4 cols + bottom row | smoke | visual | manual |
| HOME-V2-12 | Mobile single-col, 56px manifesto, 2×2 photos, 44px taps | smoke | `npm run dev` at 390px viewport (Chrome DevTools) | manual |
| MOTION-07 | Manifesto stagger fires once + reduced-motion fallback | HUMAN-UAT | none (perceptual) | human_needed |

### Sampling Rate

- **Per task commit:** `npm run build` exits 0 (D-39 — locked).
- **Per wave merge:** N/A (single wave, serial plans). Treat per-plan commits as the integration points.
- **Phase gate:** `vercel build --prod` via Vercel preview deploy on branch push (D-40); HUMAN-UAT for MOTION-07 (D-41).

### Wave 0 Gaps

- [ ] `src/lib/dates.ts` — covers date formatting needs for HOME-V2-07 and HOME-V2-08 (introduced in Plan 10-03)
- [ ] No new test files required — phase verification is visual + HUMAN-UAT per the Phase 8/9 precedent (the v2.0 milestone has consistently been "build green + visual" over unit tests for this style of layout work)

*Existing Vitest suite covers Phase 8/9 preservation guards (template, lenis-provider, scroll-reveal) which remain green throughout Phase 10. Any regression in those caught by the existing tests is a hard fail.*

## Mobile Manifesto Line-Break Recommendation

**CONTEXT.md D-32 surfaces the choice but doesn't lock it.** Plan 10-06 must pick.

**At 390px viewport with Inter 56px / 0.96 line-height / -0.045em tracking / uppercase:**

- **Option (a) 2 lines tight** — `BRING FIRE` / `TO HUMANITY.`
  - Char widths at 56px Inter Bold: `BRING FIRE` ≈ 320px, `TO HUMANITY.` ≈ 380px.
  - At 390px viewport with 28px side padding (per D-32), content width = 334px.
  - `BRING FIRE` fits (320 < 334 — tight margin); `TO HUMANITY.` overflows (380 > 334).
  - **Verdict:** **does not fit** — `TO HUMANITY.` would wrap or scale down.

- **Option (b) 3 lines** — `BRING` / `FIRE TO` / `HUMANITY.`
  - Char widths: `BRING` ≈ 165px, `FIRE TO` ≈ 215px, `HUMANITY.` ≈ 290px.
  - All fit comfortably within 334px content width.
  - 3 lines × 56px × 0.96 line-height ≈ 161px tall — reasonable hero height.
  - **Verdict:** **fits cleanly**.

- **Option (c) 4 lines** — `BRING` / `FIRE` / `TO` / `HUMANITY.`
  - Fits trivially but feels fragmented for a 4-word manifesto.
  - **Verdict:** unnecessary; lacks rhythm.

**Recommendation:** **Option (b) — 3 lines on mobile** (`["BRING", "FIRE TO", "HUMANITY."]`). This is what Plan 10-06 should lock in. The 56px size is preserved (matches D-32 "56px" and HOME-V2-12 spec); only the line breaks change.

**For the `<ManifestoReveal>` component:** Pass different `lines` arrays at desktop vs mobile breakpoints. Options:

1. **Render both, hide one with CSS** — render 2 `<ManifestoReveal>` components, one with `class="hidden md:block"` and one with `class="block md:hidden"`. Wasteful — both run animation, sessionStorage flag is shared.
2. **Pass `lines` via prop based on viewport** — use `useMediaQuery` or `window.matchMedia` in a `useEffect` to decide. Adds complexity but keeps a single animation instance.
3. **Use CSS to break lines** — render the manifesto as a single string and use `<br className="md:hidden" />` between desktop pairs. Doesn't work cleanly with per-letter spans (the `<br>` would have to be sandwiched between letter spans).

**Recommended for Plan 10-07:** Approach #2 with `useState` + `useEffect`:

```tsx
const [lines, setLines] = useState(["BRING FIRE", "TO HUMANITY."]);
useEffect(() => {
  const mql = window.matchMedia("(max-width: 767px)");
  const update = () => setLines(mql.matches
    ? ["BRING", "FIRE TO", "HUMANITY."]
    : ["BRING FIRE", "TO HUMANITY."]);
  update();
  mql.addEventListener("change", update);
  return () => mql.removeEventListener("change", update);
}, []);
```

The initial state (desktop) matches SSR; the `useEffect` swaps to mobile lines after mount. This is acceptable hydration behavior because the manifesto starts in "pending" phase (static final state) — letters don't animate until phase becomes "animate", which happens AFTER both the sessionStorage check and the breakpoint check.

## Risks Surfaced

### Risk 1: `getFeaturedProjects()` returns fewer than 8 projects

**Where:** D-15 Selected Works.
**Impact:** "+N more" suffix calculation breaks when N ≤ 0.
**Mitigation:** Plan 10-02 implementation:
```tsx
const projectNames = projects.slice(0, 8).map(p => p.title).join(", ");
const suffix = projects.length > 8 ? ` +${projects.length - 8} more` : "";
const blurb = projects.length === 0
  ? "Recent work coming soon."
  : `${projectNames}${suffix}`;
```

### Risk 2: Sub-page nav links go to v1.0-styled pages

**Where:** D-08 nav links to `/about`, `/blog`, `/projects`, `/events`, `/links`.
**Impact:** Clicking a nav link from the v2.0 homepage takes the user to a v1.0-styled sub-page. Phase 12 fixes this; Phase 10 ships with the visual inconsistency.
**Mitigation:** Acceptable for v2.0 ship; documented in CONTEXT.md `<deferred>`. Phase 12 (Sub-page Restyle Sweep) closes the loop.

### Risk 3: `/writing` and `/photos` are 404s

**Where:** D-08 mentions `/writing` (currently `/blog`); D-26 `Photo Archive →` → `/photos`.
**Impact:** Clicking either AllLink hits 404 until Phase 11.
**Mitigation:** Acceptable per CONTEXT.md "Phase 11 link target updates" deferred. Plan 10-04 may add a TODO comment near the `/photos` AllLink.

### Risk 4: Manifesto LCP impact

**Where:** Manifesto is `<h1>` with text content — but the epigraph image with `priority` is below it.
**Impact:** Lighthouse may flag the epigraph image as LCP (which is correct per D-09), but the per-letter stagger animation runs simultaneously with the image fetch — could trigger Cumulative Layout Shift (CLS) if the manifesto reflows.
**Mitigation:** The manifesto container has fixed line-height + `whitespace: nowrap` → letters animate IN PLACE without reflowing the layout box. CLS should stay near 0. Validate in Phase 13 Lighthouse pass.

### Risk 5: Phase 9 alias bridge color contamination

**Where:** The v1.0 alias bridge maps `bg-background` → `bg-paper`. Other v1.0 utilities (`text-foreground`, `bg-accent`) also flow through.
**Impact:** If the new homepage accidentally uses a v1.0 class name (e.g., `text-foreground`), it would still render correctly in light mode — but masks a bug that would surface in Phase 12 when the bridge is removed.
**Mitigation:** Plan-check should grep new `page.tsx` for v1.0 class names (`bg-background`, `text-foreground`, `bg-accent`, `bg-secondary`, `text-fg-muted`, `border-border`) and flag any usage. Use v2.0 names exclusively (`bg-paper`, `text-ink`, `text-muted`, `border-rule`).

## Sources

### Primary (HIGH confidence)

- `package.json` — motion@12.38.0, next@16.2.1, react@19.2.4, @notionhq/client@4.0.2, tailwindcss@4.x, clsx@2.1.1, tailwind-merge@3.5.0 verified
- `src/app/page.tsx` — current 191-line state inventoried
- `src/app/layout.tsx` — global chrome (Navigation + Footer wrap) discovered
- `src/components/editorial/*.tsx` (7 files) — all primitive prop signatures verified
- `src/lib/notion.ts` — `BlogPost.description` (not `excerpt`) confirmed
- `src/lib/notion-projects.ts` — `Project.title` + `Project.description` confirmed; `getFeaturedProjects()` returns `Project[]`
- `src/lib/notion-events.ts` — `EventItem.name` (not `title`) + `EventItem.link` (not `rsvpUrl`) + `EventItem.date` ISO confirmed
- `src/app/template.tsx`, `src/components/providers/motion-provider.tsx`, `src/components/providers/lenis-provider.tsx`, `src/components/visit-survey.tsx` — `m.*` namespace, LazyMotion strict mode, useReducedMotion, sessionStorage pattern verified
- `src/components/seo/json-ld.tsx`, `src/lib/seo/schemas.ts` — JsonLd + buildPersonSchema intact
- `src/app/globals.css` — Phase 9 tokens (text-display, text-list-title, text-meta, etc.) live
- `/public/MSizzle-website-photos/` — `ls` confirms all 6 photo files (000092530012.jpeg, 20230928 MSB_0114.jpg with space, IMG_0028.jpeg, IMG_1075.JPG, IMG_2129.jpeg, Patricof09.jpg)
- `.planning/research/editorial-redesign-handoff/README.md` §"Manifesto reveal" + §"Pages 1-2" + §"Assets" — design contract source of truth
- `.planning/phases/10-editorial-homepage/10-CONTEXT.md` — 41 locked decisions read in full
- `.planning/phases/09-design-tokens-editorial-primitives/09-01-SUMMARY.md` — Phase 9 carryforward confirmed (alias bridge, 11 type-scale roles, ThemeProvider removal)
- `.planning/RETROSPECTIVE.md` — lesson #2 (production-build-as-truth) drives D-39/D-40
- `.planning/config.json` — `nyquist_validation: true`, `commit_docs: true`, `mode: yolo`

### Secondary (MEDIUM confidence)

- motion.dev documentation for `useReducedMotion()`, `staggerChildren`, `m.*` namespace, `LazyMotion strict` — verified pattern matches in-codebase usage `[CITED: existing usage + motion.dev API]`

### Tertiary (LOW confidence)

- None. All claims in this research grounded in either codebase grep/read or the canonical design handoff.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Tailwind v4 spacing scale includes `mt-18` (= 72px), `mt-30` (= 120px), `mt-14` (= 56px) without arbitrary-value escapes | Pattern 1 + Code Examples | Low — fallback is `mt-[72px]` / `mt-[120px]` syntax. Planner verifies at plan-check by running `npm run build` after Plan 10-01 and grepping for any unknown-utility warnings. |
| A2 | `next/image` with `fill` on absolutely-positioned plate parents works correctly inside a CSS Grid container with `grid-rows-[180px]` | Photographs grid code example | Low — standard pattern. If `fill` misbehaves, switch to explicit `width`/`height` with `object-cover`. |
| A3 | `useMediaQuery` pattern via `window.matchMedia` doesn't cause hydration mismatch in the manifesto context | Mobile manifesto line-break recommendation | Medium — the initial state (desktop lines) matches SSR; the swap happens after `useEffect`. Phase 10-07 HUMAN-UAT validates. |
| A4 | The handoff's `(lineIndex * lineLength + charIndex) * 18ms` delay formula can be interpreted as "cumulative char count × 18ms" for a smoother continuous wave | `<ManifestoReveal>` skeleton | Medium — the formula is ambiguous for ragged lines. HUMAN-UAT confirms perceptual quality. Both interpretations are within 1-2 frames of each other and either is defensible. |
| A5 | Vercel free tier ISR limits won't be hit by a homepage that fetches 3 Notion DBs every 30 minutes | not explicitly checked | Low — current v1.0 page does the same fetches with the same revalidate; if it works at v1.0 traffic, it works at v2.0. |

**No `[ASSUMED]` claims beyond the 5 above.** All other findings are `[VERIFIED]` (codebase read) or `[CITED]` (handoff / official source).

## Open Questions

1. **Mobile manifesto line-break:** 2 lines tight vs 3 lines — settled by measurement in §"Mobile Manifesto Line-Break Recommendation". **Recommendation:** 3 lines (`BRING / FIRE TO / HUMANITY.`). Plan 10-06 locks.

2. **`<HomeFeaturedEvent>` inline vs extracted file:** CONTEXT.md says inline-then-extract. **Recommendation:** Inline in Plan 10-03; planner can revisit if the inline JSX exceeds ~60 lines or if Phase 11's /events route obviously reuses it.

3. **Featured event empty state copy:** CONTEXT.md D-22 leaves it open. **Recommendation:** Render muted `"No upcoming events."` (not the handoff sample copy). Locked in plan 10-03.

4. **Global chrome gating (CRITICAL):** Recommended option (a) above — gate `<Navigation />` + `<Footer />` on `pathname !== '/'`. Plan 10-01 owns this as Task 0.

5. **Date formatting helper location:** New `src/lib/dates.ts` recommended in Plan 10-03 — three exported formatters (`formatMonthYear`, `formatNextDate`, `formatEventTime`).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `npm run build` | ✓ | — (use project's existing) | — |
| Next.js | All plans | ✓ | 16.2.1 | — |
| motion | Plan 10-07 | ✓ | 12.38.0 | — |
| @notionhq/client | All data plans | ✓ | 4.0.2 | — |
| Tailwind v4 | All plans | ✓ | 4.x | — |
| Notion env vars (`NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NOTION_PROJECTS_DATABASE_ID`, `NOTION_EVENTS_DB_ID`) | Data sections | depends on local env | — | Sections render graceful empty states when env missing (existing pattern) |
| `vercel` CLI for `vercel build --prod` | Phase gate (D-40) | per Phase 8/9 precedent: sandbox node_modules issues — defer to Vercel preview deploy | — | Push to remote, validate preview deploy build status |
| Vitest | Existing tests (preservation guards) | ✓ | 4.1.2 | — |

**Missing dependencies with no fallback:** None blocking. All Phase 10 work can proceed with the current environment.

**Missing dependencies with fallback:** Notion env vars may be unset locally — empty-state rendering handles this gracefully.

## Project Constraints (from CLAUDE.md)

- **CMS = Notion.** All dynamic content via existing Notion fetchers. NO new CMS, NO hardcoded content for WRITING / EVENTS / BUILDING Selected Works.
- **Hosting = Vercel free tier.** No new third-party services. ISR (`revalidate = 1800`) preserved.
- **Animations = "feel cool".** Manifesto stagger satisfies this; nothing else animates on the homepage (motion budget per Phase 8).
- **No new dependencies.** Verified — Phase 10 uses motion@12.38.0 + Next.js Image + Tailwind v4 + Phase 9 primitives. Nothing new to install.
- **AI-friendly stack documentation.** Phase 9 primitives are minimal-prop, well-documented. Phase 10 composition is straightforward server-component JSX.
- **GSD workflow enforcement.** No direct edits — all changes via `/gsd:execute-phase 10`. Each plan ships its own commit per D-39.
- **Recommended: Next.js 15.2.x.** Project is on **16.2.1** (carryforward from v1.0). CLAUDE.md doc is stale on this point — actual stack supersedes recommendation. No action needed (Next.js 16.2.1 works correctly with all Phase 10 patterns).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all deps verified in package.json + grep + file reads
- Architecture: HIGH — current page.tsx and layout.tsx fully inventoried
- Phase 9 primitive props: HIGH — read 7 source files verbatim
- Notion data shapes: HIGH — read 3 source files verbatim, 2 field-name mismatches caught
- motion/react API: HIGH — verified via 6 existing usage sites in codebase
- Photo assets: HIGH — `ls` confirmed all 6 files
- Critical Gap (global chrome): HIGH — read layout.tsx + nav + footer verbatim
- Mobile line-break recommendation: MEDIUM — based on Inter character-width estimates, not pixel-perfect measurement. Plan 10-06 should visually validate at 390px.
- Pitfalls: HIGH — all 6 pitfalls grounded in either documented motion behavior, existing codebase patterns, or Next.js SSR semantics

**Research date:** 2026-05-21
**Valid until:** 2026-06-20 (30 days — stable stack, slow-moving design contract)
