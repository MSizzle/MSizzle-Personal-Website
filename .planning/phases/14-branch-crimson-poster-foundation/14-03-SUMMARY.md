---
phase: 14-branch-crimson-poster-foundation
plan: "03"
subsystem: v3-components
tags: [components, animation, brutalist, crimson-poster, DS-04, DS-05]
dependency_graph:
  requires: ["14-01"]
  provides: ["Card", "VideoCard", "NewsletterCarousel", "UsesList", "Reveal"]
  affects: ["14-04"]
tech_stack:
  added: []
  patterns:
    - "whileInView reveal pattern via m component (LazyMotion strict)"
    - "useReducedMotion() branch (static fallback, DS-05)"
    - "CSS border-trick triangle in JSX (no ::after)"
    - "React.Fragment keyed rows for dl/dt/dd pairs"
key_files:
  created:
    - src/components/v3/card.tsx
    - src/components/v3/video-card.tsx
    - src/components/v3/newsletter-carousel.tsx
    - src/components/v3/uses-list.tsx
    - src/components/v3/reveal.tsx
  modified: []
decisions:
  - "Card uses optional href to branch Link vs div render path (no 'use client' needed)"
  - "VideoCard play-triangle is an explicit <span> with border-trick instead of CSS ::after — avoids Tailwind arbitrary-property hacks"
  - "NewsletterCarousel issues without href fall back to a plain div (optional href); key is issue.title when no href"
  - "UsesList uses React.Fragment with key to correctly key dt/dd pairs in the dl grid"
  - "Reveal delay prop defaults to 0 to support staggered reveal without requiring the prop"
metrics:
  duration: "20 minutes"
  completed: "2026-06-18"
  tasks_completed: 3
  tasks_total: 3
  files_created: 5
  files_modified: 0
---

# Phase 14 Plan 03: Composite Primitives + Reveal Summary

Five composite/animated primitives completing the DS-04 brutalist set and delivering the DS-05 scroll-reveal pattern.

## What Was Built

### Components and Prop Signatures

**`Card`** — `src/components/v3/card.tsx`
```tsx
type Props = { kicker?: string; title: ReactNode; blurb?: ReactNode; href?: string }
export function Card({ kicker, title, blurb, href }: Props)
```
- Server component (no "use client")
- When `href` is set: renders a `<Link>` wrapping the inner content
- When `href` is unset: renders a `<div>`
- Styling: `bg-bg p-[26px] hover:bg-bg-2 transition-colors`
- Kicker: `font-mono text-xs text-accent block mb-[14px]`
- Title (h3): `font-display font-medium text-lg uppercase mb-2`
- Blurb (p): `text-sm text-text-dim`

**`VideoCard`** — `src/components/v3/video-card.tsx`
```tsx
type Props = { title: ReactNode; channel?: string; href: string }
export function VideoCard({ title, channel, href }: Props)
```
- Server component (no "use client")
- Always renders a `<Link>` with `group` class for hover coordination
- Lifts on hover: `hover:-translate-y-1 transition-transform`
- Thumb: `aspect-video bg-surface border-b border-border group-hover:bg-accent transition-colors`
- Play triangle: explicit `<span>` with CSS border-trick; inverts: `group-hover:border-l-bg`
- Body: `p-4 flex justify-between gap-3 items-baseline`
- Channel: `font-mono text-xs text-text-muted whitespace-nowrap`

**`NewsletterCarousel`** — `src/components/v3/newsletter-carousel.tsx`
```tsx
type Issue = { title: string; date: string; href?: string }
type Props = { issues: Issue[] }
export function NewsletterCarousel({ issues }: Props)
```
- Server component (no "use client")
- Container: `flex gap-[18px] overflow-x-auto [scroll-snap-type:x_mandatory] pb-[18px] [scrollbar-width:thin]`
- Each issue card: `flex-[0_0_300px] [scroll-snap-align:start] border border-border bg-bg-2`
- Thumb: `aspect-[3/2] bg-surface border-b-2 border-accent flex items-center justify-center`
- Placeholder glyph: `<span>MM</span>` styled `font-display font-bold text-2xl text-text-muted`
- Optional href renders `<Link>`, else `<div>`

**`UsesList`** — `src/components/v3/uses-list.tsx`
```tsx
type UsesItem = { term: string; detail: string }
type UsesGroup = { heading: string; items: UsesItem[] }
type Props = { groups: UsesGroup[] }
export function UsesList({ groups }: Props)
```
- Server component (no "use client")
- Each group heading: `font-mono text-sm uppercase tracking-[0.12em] text-accent mb-[18px]`
- dl grid: `grid grid-cols-[200px_1fr] gap-x-6 gap-y-[14px] max-[600px]:grid-cols-1`
- dt: `font-display font-medium`
- dd: `text-text-dim text-sm max-[600px]:mb-[10px]`
- dt/dd pairs keyed via `<Fragment key={item.term}>`

**`Reveal`** — `src/components/v3/reveal.tsx`
```tsx
type Props = { children: ReactNode; className?: string; delay?: number }
export function Reveal({ children, className, delay = 0 }: Props)
```
- Client component ("use client")
- Imports `m` and `useReducedMotion` from `"motion/react"` (MUST be `m` — LazyMotion strict)
- **DS-05 short-circuit:** when `useReducedMotion()` is true, returns `<div className={className}>{children}</div>` — no animation, fully visible
- Animated branch: `<m.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease: [0.25,0.1,0.25,1], delay }}`
- No hand-rolled IntersectionObserver

---

## Cards Container Classes (for Plan 04 showcase)

Plan 04 must wrap `Card` cells in this container to reproduce the 1px-gap grid from site.css:

```html
<div class="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-px bg-border border border-border">
  <Card ... />
  <Card ... />
</div>
```

VideoCard cells:
```html
<div class="grid [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] gap-[22px]">
  <VideoCard ... />
</div>
```

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed UsesList dt/dd React Fragment keying**
- **Found during:** Task 2
- **Issue:** Using `<>...</>` shorthand inside `.map()` cannot accept a `key` prop, which would produce React key warnings at runtime
- **Fix:** Imported `Fragment` from `"react"` and used `<Fragment key={item.term}>` so dt/dd pairs have stable keys in the dl grid
- **Files modified:** `src/components/v3/uses-list.tsx`
- **Commit:** 1a19b77

---

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. All components are purely presentational (server components or a single client wrapper). The Reveal component mirrors the established `manifesto-reveal.tsx` pattern exactly.

---

## Self-Check: PASSED

Files created:
- [x] `src/components/v3/card.tsx` — exists
- [x] `src/components/v3/video-card.tsx` — exists
- [x] `src/components/v3/newsletter-carousel.tsx` — exists
- [x] `src/components/v3/uses-list.tsx` — exists
- [x] `src/components/v3/reveal.tsx` — exists

Commits:
- 6e9a3b9 — feat(14-03): add v3 Card and VideoCard primitives
- 1a19b77 — feat(14-03): add v3 NewsletterCarousel and UsesList primitives
- 4374152 — feat(14-03): add v3 Reveal scroll-reveal wrapper honoring reduced motion (DS-05)

Verification gates passed:
- [x] All 5 components compile under `npx tsc --noEmit`
- [x] Reveal grep gate: "use client", useReducedMotion, `m` import, whileInView all confirmed
- [x] Card/VideoCard/Carousel/UsesList match prototype styling
