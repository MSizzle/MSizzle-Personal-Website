# Phase 14: Branch & Crimson Poster Foundation - Pattern Map

**Mapped:** 2026-06-18
**Files analyzed:** 18 (2 modified config/foundation, ~14 new primitives, 1 new showcase route, 1 cleanup)
**Analogs found:** 17 / 18 (1 no-analog: marquee)

> **Source of truth:** The committed prototype is the UI contract — no research phase was run.
> Port styling **exactly** from `.planning/sketches/002-full-site-model/assets/site.css`
> and tokens from `.planning/sketches/themes/default.css`. The live-codebase analogs below
> are **structural** references (component shape, prop typing, `cn` usage, `next/font` idiom,
> `@theme inline` token idiom) — NOT styling references. Styling comes from the prototype.

---

## Critical Corrections to Upstream Context

CONTEXT.md (lines 35, 94, 97) references a `ThemeProvider` / `next-themes` usage and a
"ThemeProvider > LenisProvider > MotionProvider" hierarchy. **This is stale.** The live
codebase has NO `ThemeProvider`, and `next-themes` is imported nowhere in `src/` (confirmed
via grep). It is only listed as a dependency in `package.json` line 22.

**Implications for the planner:**
- The D-05 "drop light/dark mode" work is almost entirely inside `src/app/globals.css`:
  remove the second `:root` block (lines 90-99), the `.section-inverted` block (lines 152-164),
  and the v1/v2 dual-palette tokens in `@theme inline`. There is **no provider to unwire**.
- `src/app/layout.tsx` provider tree is `LenisProvider > MotionProvider` only (lines 63-69).
  No ThemeProvider import/JSX exists to remove.
- D-09's "Whether to keep `next-themes` installed (unused) or remove the dependency" is purely
  a `package.json` decision — there is no code coupling to break.
- The ONLY `dark:` Tailwind classes in the codebase live in
  `src/components/notion/notion-renderer.tsx` (24 occurrences, lines 28-543). These render
  Notion content colors and are **out of scope** for this presentation-foundation phase
  (Phase 16 content migration). Do NOT touch notion-renderer in Phase 14.

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/app/globals.css` (modify) | config (theme tokens) | n/a (static) | itself — existing `@theme inline` block | exact (self) |
| `src/app/layout.tsx` (modify) | config (font wiring) | n/a (static) | itself — existing Inter `next/font` block | exact (self) |
| v3 `Rule` primitive | component | static | `src/components/editorial/rule.tsx` | exact |
| v3 `RuleStrong` primitive | component | static | `src/components/editorial/rule-strong.tsx` | exact |
| v3 `SectionLabel` (slabel/shead) | component | static | `src/components/editorial/section-label.tsx` | exact |
| v3 `ListRow` (clickable hover-invert) | component | request-response (link) | `src/components/editorial/list-row.tsx` | exact |
| v3 `BigList` (big-type stacked links) | component | request-response (link) | `src/components/editorial/list-row.tsx` | role-match |
| v3 `Button` / `ButtonAccent` | component | request-response (link/click) | `src/components/editorial/all-link.tsx` | role-match |
| v3 `PageHero` (page-title hero) | component | static | `src/components/home-v2/editorial-header.tsx` | role-match |
| v3 `Card` (essay/works grid) | component | static | `src/components/editorial/list-row.tsx` | role-match |
| v3 `VideoCard` | component | static | `src/components/editorial/list-row.tsx` | role-match |
| v3 `Chip` | component | static | `src/components/editorial/section-label.tsx` | role-match |
| v3 `NewsletterCarousel` (issues) | component | static | `src/components/editorial/footer-col.tsx` (list map) | partial |
| v3 `UsesList` | component | static | `src/components/editorial/footer-col.tsx` (dl/list map) | partial |
| v3 `Marquee` | component | static (CSS anim) | — none — | no analog |
| v3 `Reveal` (reveal-on-scroll) | component | event-driven (IntersectionObserver) | `src/components/home-v2/manifesto-reveal.tsx` | role-match |
| v3 primitives showcase | route (page.tsx) | static | `src/app/specimen/page.tsx` | exact |
| Sig-type utility (`.grad-text` equiv) | config (CSS utility) | static | `globals.css` `.prose`/`.section-inverted` custom CSS blocks | role-match |

---

## Pattern Assignments

### `src/app/globals.css` (config — theme tokens, MODIFY)

**Analog:** itself. The existing `@theme inline` block IS the token-definition idiom to reuse —
just swap the warm-paper palette for Crimson Poster values and the Inter scale for Space Grotesk.

**Token-as-utility idiom (the load-bearing pattern), existing lines 25-30:**
```css
@theme inline {
  --text-display: 124px;
  --text-display--line-height: 0.96;
  --text-display--letter-spacing: -0.045em;
  --text-display--font-weight: 700;
}
```
**GOTCHA (Tailwind v4):** Tokens declared inside `@theme inline` auto-generate utility classes
(`--color-bg` → `bg-bg`/`text-bg`; `--text-display` → `text-display` which ALSO applies the
`--line-height`/`--letter-spacing`/`--font-weight` sub-properties). The existing primitives
consume tokens THIS way (`className="text-display"`, `text-ink`, `bg-paper`, `border-rule`).
The prototype's `themes/default.css` instead declares plain `:root` vars (`--text-3xl: 3.2rem`)
consumed via raw `var(--text-3xl)`. **The planner must translate the prototype's `:root` token
names into `@theme inline` token names** so v3 components can use Tailwind utilities like the
existing ones — do NOT just paste the prototype's `:root` block (that would lose utility-class
generation and break the established consumption convention).

**Font token wiring, existing lines 85-87 (the binding to next/font):**
```css
  --font-sans: var(--font-inter);
  --font-mono: ui-monospace, SFMono-Regular, ...;
```
v3 equivalent: `--font-display: var(--font-space-grotesk)`, `--font-mono: var(--font-jetbrains-mono)`,
plus `--font-sans` pointing at the display var (prototype uses Space Grotesk for both sans and display).

**Crimson Poster values to port (from `themes/default.css` lines 9-43):**
canvas `--color-bg:#d93c1e`, `--color-bg-2:#c8341a`, `--color-surface:#cc3719`;
accent `--accent:#0a0503`; borders `rgba(10,5,3,0.26)` / `rgba(10,5,3,0.5)`;
ink `--color-text:#120604`, dim `rgba(10,5,3,0.74)`, muted `rgba(10,5,3,0.52)`;
type scale `--text-xs:0.72rem` … `--text-3xl:3.2rem`, `--text-mega:clamp(3.5rem,16vw,16rem)`.

**Signature treatment (D-06), from `themes/default.css` lines 26-27 + `site.css` line 15:**
```css
--sig:        var(--color-bg);            /* fill = canvas crimson */
--sig-shadow: 0.055em 0.055em 0 #0a0503;  /* hard black drop shadow */
/* utility: */ .grad-text{color:var(--sig);text-shadow:var(--sig-shadow)}
```
Express as a reusable utility/class so every display heading is consistent (see "Sig-type utility" below).

**Blocks to DELETE (D-04/D-05):** the v1 compat aliases (lines 16-23), the second `:root` block
(lines 90-99), and `.section-inverted` (lines 152-164). Keep the `html`/`body`/`a`/`.prose`
structure but reskin `.prose` to crimson per `site.css` lines 82-90.

---

### `src/app/layout.tsx` (config — font wiring, MODIFY)

**Analog:** itself, lines 13-17 + 59. The Inter `next/font/google` wiring is the exact template.

**Existing pattern (lines 13-17, 59):**
```tsx
import { Inter } from "next/font/google";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});
// ...
<html lang="en" className={inter.variable} suppressHydrationWarning>
```

**v3 swap (D-09):** import `Space_Grotesk` and `JetBrains_Mono` from `next/font/google`, assign
`variable: "--font-space-grotesk"` and `variable: "--font-jetbrains-mono"`, weights `["400","500","700"]`
(prototype uses 400/500/700 — note the existing Inter only loads 400/700; 500 is needed for
`.row .ti`/`.card h3` medium weight). Compose both vars on `<html className={...}>`
(e.g. `` `${spaceGrotesk.variable} ${jetbrainsMono.variable}` `` or via `cn`). Remove Inter entirely.
Body currently uses `bg-background text-foreground` (line 62) — those v1-alias utilities go away
with D-05; replace with the crimson equivalents (`bg-bg text-text` per new token names).

**GOTCHA:** Use `next/font` (NOT the prototype's `@import url(...fonts.googleapis...)` at
`themes/default.css` line 7 and `site.css` — D-09 explicitly chooses next/font for performance).
Do not copy the `@import` line into globals.css.

---

### `src/components/editorial/rule.tsx` → v3 `Rule` (component, static)

**Analog:** `src/components/editorial/rule.tsx` (full file):
```tsx
export function Rule() {
  return <hr className="border-0 border-t border-rule" aria-hidden="true" />;
}
```
v3: same shape; restyle to `site.css` line 48 (`.rule{height:1px;background:var(--color-border)}`).
`RuleStrong` analog is `rule-strong.tsx` → port `site.css` line 49
(`height:2px;background:var(--color-text);opacity:0.85`).

---

### v3 `SectionLabel` (slabel + shead) (component, static)

**Analog:** `src/components/editorial/section-label.tsx` (full file) — flex-baseline-between + label
type + optional numeral. Prop convention `{ children, numeral }`.
Port styling from `site.css` lines 51-53 (`.slabel` mono uppercase accent; `.shead` flex space-between baseline).

---

### v3 `ListRow` (clickable hover-invert row) (component, request-response)

**Analog:** `src/components/editorial/list-row.tsx` (full file) — the closest exact structural match.

**Prop + `cn` convention to copy (lines 1-21):**
```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = { title: ReactNode; href: string; extra?: ReactNode; meta?: ReactNode; big?: boolean };

export function ListRow({ title, href, extra, meta, big = false }: Props) {
  return (
    <Link href={href} className={cn("...base...", big && "...variant...")}>
```
v3 restyle from `site.css` lines 55-66: grid `60px 1fr auto`, hover-invert
(`.row:hover{background:var(--color-text);color:var(--color-bg)}`), the `.n` numeral, `.ti` title
with reveal arrow `.ar`, `.ex` excerpt, `.m` meta. Keep the `big` prop pattern; map it to the
display vs home sizing. Note hover-invert needs hover variants on child text colors — express via
Tailwind `group`/`group-hover:` (the prototype uses descendant `.row:hover .n` selectors).

---

### v3 `BigList` (big-type stacked clickable links) (component, request-response)

**Analog:** `src/components/editorial/list-row.tsx` (prop/`cn`/Link convention) — role-match.
Styling: `site.css` lines 154-167 (`.big-list a` huge `clamp(2rem,9.5vw,8rem)` sig-shadow display
links, `.out` outline variant via `-webkit-text-stroke`, optional `.tag` mono label).
**GOTCHA:** the `.out` outline variant uses `-webkit-text-stroke` + `color:transparent` — no
Tailwind utility exists; needs an arbitrary-value class or a custom utility in globals.css.
Provide an `outline?: boolean` prop following the `big?: boolean` convention.

---

### v3 `Button` / `ButtonAccent` (component, request-response)

**Analog:** `src/components/editorial/all-link.tsx` (Link + className convention) — role-match.
Styling: `site.css` lines 68-73 (`.btn` bordered mono uppercase with hover-invert;
`.btn-accent` filled black, hover → transparent/accent). Follow `all-link.tsx`'s simple
`{ children, href }` shape; add an `accent?: boolean` variant via `cn`. Support both `<Link>`
(internal) and `<button>` (action) — mirror `intro-link.tsx`'s `external`-style branching
(lines 18-35) if a non-link button is needed.

---

### v3 `PageHero` (page-title hero) (component, static)

**Analog:** `src/components/home-v2/editorial-header.tsx` (role-match — large heading block with
crumb/sub). Styling from `site.css` lines 38-45: `.page-hero` padding, `.crumb` breadcrumb,
`h1` sig-type `clamp(2.8rem,11vw,8rem)` with `--sig`/`--sig-shadow`, `.out` stroke variant, `.sub`.
Apply the sig-type utility here.

---

### v3 `Card` / `VideoCard` / `Chip` / `NewsletterCarousel` / `UsesList` (components, static)

**Analogs (structural):**
- `Card`/`VideoCard` → `list-row.tsx` for the Link+`cn` shape (role-match). Style from
  `site.css` lines 92-98 (`.cards` 1px-gap grid, `.card` hover-bg) and 113-123 (`.video` lift on
  hover, play-triangle `::after`, hover-fill thumb).
- `Chip` → `section-label.tsx` (tiny presentational span). Style `site.css` lines 100-102.
- `NewsletterCarousel` → `footer-col.tsx` (lines 14-32) for the `links.map(...)` list-render
  + typed `Props` convention (partial match). Style `site.css` lines 104-111 (scroll-snap carousel,
  `.issue` cards, `.thumb::after` placeholder glyph).
- `UsesList` → `footer-col.tsx` list-map convention (partial). Style `site.css` lines 125-131
  (`.uses-grp` with `dl`/`dt`/`dd` grid, responsive collapse).

**`footer-col.tsx` list-render convention to copy (lines 14-21):**
```tsx
type Props = { title: string; links: FooterLink[] };
export function FooterCol({ title, links }: Props) {
  return ( ... {links.map((link) => ( <li key={link.href}> ... </li> ))} ... );
}
```

---

### v3 `Marquee` (component, static / CSS animation)

**Analog:** NONE in the live codebase (see "No Analog Found"). Port directly from
`site.css` lines 75-80: `.marquee` overflow-hidden bordered band, `.track` with
`animation:scroll 30s linear infinite` (`@keyframes scroll{to{transform:translateX(-50%)}}`),
`.track span.hot` outline-stroke variant. The keyframes + duplicated-track markup must be
authored fresh. Define `@keyframes scroll` in globals.css; the duplicated span content (for
seamless loop) is the component's responsibility. Follow general primitive conventions
(typed `Props`, presentational, `cn` for variants).

---

### v3 `Reveal` (reveal-on-scroll) (component, event-driven)

**Analog:** `src/components/home-v2/manifesto-reveal.tsx` (role-match — the real motion pattern;
NOTE the stubs in `src/components/animations/scroll-reveal.tsx` and `parallax-layer.tsx` are
empty pass-throughs and are NOT useful references).

**Conventions to copy (manifesto-reveal lines 1-3, 131-147):**
```tsx
"use client";
import { useEffect, useState } from "react";
import { m, useReducedMotion, type Variants } from "motion/react";
// ...
export function ManifestoReveal() {
  const shouldReduceMotion = useReducedMotion();
  // SSR-stable static first paint, then effect-gated animation
  useEffect(() => { /* read flags in effect, never during render */ }, []);
```
**Key idioms:** `"use client"`, import `m` (not `motion`) — REQUIRED because `MotionProvider`
uses `<LazyMotion strict>` (motion-provider.tsx lines 12-14); `useReducedMotion()` branch;
SSR-stable static render before the effect runs (avoids hydration mismatch / CLS).

**Behavior to port:** `site.css` lines 142-144 — `.reveal{opacity:0;transform:translateY(30px)}`
→ `.reveal.in{opacity:1;transform:none}` on scroll-into-view. The prototype's `site.js` uses an
IntersectionObserver to add `.in`. **GOTCHA:** the project tech stack also lists
`react-intersection-observer` and GSAP/Lenis (`LenisProvider`). Prefer motion/react
`whileInView` OR `react-intersection-observer` over hand-rolled IO to match the
established motion-as-`m`-components convention. Reduced-motion must short-circuit to a
static/visible state (see manifesto-reveal Branch A, lines 149-159).

---

### v3 primitives showcase route (route, static)

**Analog:** `src/app/specimen/page.tsx` (EXACT template — this is a v2 primitives/tokens showcase
and is the direct model for the v3 showcase).

**What `specimen/page.tsx` contains (so the planner can mirror its structure):**
- `metadata` with `robots: { index: false, follow: false }` (lines 12-16) — copy this noindex.
- A `swatches` const array driving a palette grid (lines 19-30, 62-86) — rebuild with crimson tokens.
- A `typeSpecimens` const array driving a type-scale section (lines 33-46, 89-106) — rebuild with
  the Space Grotesk scale (`text-xs`…`text-3xl`/`text-mega`).
- A "Primitives" section rendering each primitive with a labeled `text-label` caption
  (lines 108-202) — extend to every new v3 primitive (Rule, RuleStrong, SectionLabel, ListRow,
  BigList, Button/Accent, PageHero, Card, VideoCard, Chip, Carousel, UsesList, Marquee, Reveal).
- Imports primitives from `@/components/editorial/*` (lines 2-8) — v3 will import from the new
  v3 component directory (planner's discretion on location, e.g. `@/components/v3/*`).

**GOTCHA / DECISION:** specimen lives at `/specimen`. The v3 showcase must NOT collide with it
(keep both until Phase 16). Use a distinct route (planner's discretion, e.g. `/v3-specimen` or
`/specimen/v3`). Keep `robots: { index:false, follow:false }`.

---

## Shared Patterns

### `cn` className merge (clsx + tailwind-merge)
**Source:** `src/utils/cn.ts`
**Apply to:** every primitive with a variant prop (ListRow, BigList, Button, Card, etc.)
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
```
Import as `import { cn } from "@/utils/cn"` (NOT `@/lib/utils` — there is no `lib/utils` here).

### Primitive component shape (server component, typed Props, `next/link`)
**Source:** `src/components/editorial/list-row.tsx`, `all-link.tsx`, `section-label.tsx`
**Apply to:** all non-interactive primitives.
- Plain named function export (no default), `type Props = {...}`, `ReactNode` for slot props.
- `import Link from "next/link"` for navigable rows/cards/buttons; plain `<a target="_blank"
  rel="noopener noreferrer">` for external (see `intro-link.tsx` lines 18-35).
- NO `"use client"` unless the component has interactivity/motion (only `Reveal` and any
  carousel-with-JS need it).

### Token consumption via Tailwind utilities (NOT raw var())
**Source:** existing primitives + `globals.css` `@theme inline`
**Apply to:** all v3 primitives.
Consume crimson tokens as utilities (`bg-bg`, `text-text`, `border-border`, `text-3xl`) generated
by `@theme inline`, mirroring how editorial primitives use `bg-paper`/`text-ink`/`border-rule`.
Reserve raw `var()`/custom CSS for things with no utility equivalent (`-webkit-text-stroke`,
`text-shadow: var(--sig-shadow)`, `@keyframes scroll`).

### Sig-type display utility (D-06)
**Source:** `site.css` line 15 (`.grad-text`) + custom-CSS precedent in `globals.css`
(`.prose`, `.section-inverted` are hand-authored classes already living in globals.css).
**Apply to:** every display heading (PageHero h1, BigList, marquee, footer big, home name).
Author a single utility in globals.css (e.g. `.sig` / `@utility sig`) =
`color: var(--sig); text-shadow: var(--sig-shadow);` plus an outline variant
(`-webkit-text-stroke: 2px var(--accent); color: transparent; text-shadow: none;`).
This keeps the signature treatment consistent and DRY per D-06.

### Motion components must use `m` + reduced-motion (LazyMotion strict)
**Source:** `src/components/providers/motion-provider.tsx` (lines 12-14) + `manifesto-reveal.tsx`
**Apply to:** `Reveal` and any animated primitive.
`MotionProvider` wraps the app in `<LazyMotion features={domAnimation} strict>`. Under `strict`,
you MUST import `m` (not `motion`) or it throws at runtime. Always branch on
`useReducedMotion()` and render an SSR-stable static fallback first.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| v3 `Marquee` | component | static (CSS keyframe) | No marquee/infinite-scroll component exists in the codebase. Port wholesale from `site.css` lines 75-80 (+ `@keyframes scroll`). Follow general primitive conventions for the wrapper. |

---

## Metadata

**Analog search scope:** `src/app/**`, `src/components/{editorial,home-v2,animations,providers,notion,nav,analytics}/`, `src/utils/`, `src/lib/`, `package.json`, prototype `.planning/sketches/002-full-site-model/assets/*` and `.planning/sketches/themes/default.css`.
**Files scanned:** ~20 (8 editorial primitives, 5 home-v2, 2 animation stubs, 2 providers, specimen page, globals.css, layout.tsx, cn util, notion-renderer grep).
**Pattern extraction date:** 2026-06-18
