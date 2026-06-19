---
phase: 14-branch-crimson-poster-foundation
plan: "02"
subsystem: v3-primitives
tags: [components, v3, brutalist, crimson-poster, animation, accessibility]
dependency_graph:
  requires: ["14-01"]
  provides: ["14-03", "14-04", "15-*", "16-*"]
  affects: ["src/components/v3/"]
tech_stack:
  added: []
  patterns:
    - "group/group-hover Tailwind pattern for hover-invert rows"
    - "useReducedMotion from motion/react for CSS animation accessibility gate (DS-05)"
    - "duplicated-track marquee pattern for seamless -50% translateX loop"
    - "sig/sig-out CSS utility classes for crimson display treatment (D-06)"
    - "-webkit-text-stroke arbitrary class for outline display variant"
key_files:
  created:
    - src/components/v3/rule.tsx
    - src/components/v3/rule-strong.tsx
    - src/components/v3/section-label.tsx
    - src/components/v3/chip.tsx
    - src/components/v3/list-row.tsx
    - src/components/v3/button.tsx
    - src/components/v3/big-list.tsx
    - src/components/v3/page-hero.tsx
    - src/components/v3/marquee.tsx
  modified: []
decisions:
  - "Button marked use-client (onClick handler prop requires it); all other components remain server components"
  - "ListRow uses hover:bg-text/hover:text-bg on the Link parent for inversion; group + group-hover:text-bg on children for recoloring -- same effect as prototype's descendant selectors"
  - "BigList outline variant uses cn('sig-out') class directly -- Tailwind v4 @layer utility, no arbitrary CSS needed"
  - "Marquee arbitrary class [animation:scroll_30s_linear_infinite] references @keyframes scroll from globals.css (Plan 01)"
metrics:
  duration: "3m"
  completed_date: "2026-06-18"
  tasks_completed: 3
  tasks_total: 3
  files_created: 9
  files_modified: 0
---

# Phase 14 Plan 02: v3 Brutalist Primitives Summary

Nine static server-component primitives ported pixel-faithfully from the prototype's `assets/site.css`, consuming Crimson Poster tokens as Tailwind utilities, with a client-side marquee honoring `prefers-reduced-motion`.

## Primitive Inventory

### Task 1: Static Atoms (server components)

**`Rule`** -- `src/components/v3/rule.tsx`
- Props: none
- Export: `export function Rule()`
- Renders: `<hr className="border-0 border-t border-border my-12" aria-hidden="true" />`
- Prototype: `site.css` line 48

**`RuleStrong`** -- `src/components/v3/rule-strong.tsx`
- Props: none
- Export: `export function RuleStrong()`
- Renders: `<div className="h-[2px] bg-text opacity-85 my-8" role="separator" aria-hidden="true" />`
- Prototype: `site.css` line 49

**`SectionLabel`** -- `src/components/v3/section-label.tsx`
- Props: `{ children: ReactNode; numeral?: string }`
- Export: `export function SectionLabel({ children, numeral }: Props)`
- Renders: flex baseline-between; label in `font-mono text-sm uppercase tracking-[0.12em] text-accent`; numeral in `font-mono text-xs text-text-muted`
- Prototype: `site.css` lines 51-52

**`Chip`** -- `src/components/v3/chip.tsx`
- Props: `{ children: ReactNode; className?: string }`
- Export: `export function Chip({ children, className }: Props)`
- Renders: `<span>` with `font-mono text-xs uppercase tracking-[0.08em] border border-border rounded-full px-3 py-[7px] text-text-dim`
- Prototype: `site.css` line 102

### Task 2: Interactive Rows and Button

**`ListRow`** -- `src/components/v3/list-row.tsx`
- Props: `{ numeral?: string; title: ReactNode; href: string; excerpt?: ReactNode; meta?: ReactNode; big?: boolean }`
- Export: `export function ListRow({ numeral, title, href, excerpt, meta, big }: Props)`
- Renders: `<Link>` with `group` class; `[grid-template-columns:60px_1fr_auto]` grid; `hover:bg-text hover:text-bg` inversion; reveal arrow `opacity-0 group-hover:opacity-100`; excerpt `group-hover:opacity-75`; meta `group-hover:text-bg`
- Prototype: `site.css` lines 55-66

**`Button`** -- `src/components/v3/button.tsx`
- Props: `{ children: ReactNode; href?: string; onClick?: () => void; accent?: boolean; className?: string }`
- Export: `export function Button({ children, href, onClick, accent, className }: Props)`
- Directive: `"use client"` (onClick support)
- Renders: `<Link href>` when href provided; `<button type="button">` when onClick provided. Default: `border-border-strong hover:bg-text hover:text-bg`. Accent: `bg-accent border-accent text-bg hover:bg-transparent hover:text-accent`
- Prototype: `site.css` lines 68-73

### Task 3: Display Components

**`BigList`** -- `src/components/v3/big-list.tsx`
- Props: `{ items: { label: ReactNode; href: string; tag?: string; outline?: boolean }[] }`
- Export: `export function BigList({ items }: Props)`
- Renders: flex justify-between rows with `text-[clamp(2rem,9.5vw,8rem)]`; `.sig` by default; `.sig-out` when `outline: true`; `hidden md:inline` tag; hover `text-accent [text-shadow:none]`
- Prototype: `site.css` lines 154-167

**`PageHero`** -- `src/components/v3/page-hero.tsx`
- Props: `{ title: ReactNode; crumb?: ReactNode; sub?: ReactNode; outline?: boolean }`
- Export: `export function PageHero({ title, crumb, sub, outline }: Props)`
- Renders: `padding-top:clamp(90px,16vh,180px)`; crumb in `font-mono text-xs uppercase tracking-[0.12em] text-text-muted`; `<h1>` in `font-display font-bold uppercase leading-[0.86] tracking-[-0.03em] text-[clamp(2.8rem,11vw,8rem)]` + `.sig` (or `.sig-out` when outline); sub in `text-text-dim text-lg max-w-[54ch] mt-6`
- Prototype: `site.css` lines 38-45

**`Marquee`** -- `src/components/v3/marquee.tsx`
- Props: `{ items: { text: string; hot?: boolean }[] }`
- Export: `export function Marquee({ items }: Props)`
- Directive: `"use client"` (useReducedMotion)
- Renders: `overflow-hidden border-y py-4`; inner track `inline-block [animation:scroll_30s_linear_infinite]` (references `@keyframes scroll` from `globals.css`); items duplicated for seamless loop; `hot` items: `[color:transparent] [-webkit-text-stroke:1.5px_var(--accent)]`; when `useReducedMotion()` is true, animation class omitted but content remains fully visible (DS-05)
- Prototype: `site.css` lines 75-80

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 227cae1 | feat(14-02): add v3 static atom primitives (Rule, RuleStrong, SectionLabel, Chip) |
| 2 | 7893aac | feat(14-02): add v3 ListRow (hover-invert) and Button (default/accent) |
| 3 | e17f4f2 | feat(14-02): add v3 BigList, PageHero, Marquee primitives |

## Deviations from Plan

### Auto-fixed Issues

None.

### Intentional Implementation Notes

**1. Button marked `"use client"`**

The plan noted "if lint flags the handler, mark Button `use client`". Since Button accepts an `onClick` prop (a function, which is not serializable for RSC), it must be a client component. This is correct per React/Next.js App Router semantics.

**2. ListRow hover pattern**

The plan specifies `group-hover:bg-text group-hover:text-bg`. The implementation puts `hover:bg-text hover:text-bg` on the Link root (which IS the group root) and `group-hover:text-bg` on inner elements. The result is identical to the prototype's `.row:hover { background: ...; color: ... }` + `.row:hover .n, .row:hover .m { color: ... }` descendant selectors. Both patterns achieve the same visual result.

**3. BigList last-item border**

The prototype shows `a:last-child { border-bottom }`. Implemented via `i === items.length - 1 && "border-b border-border"` conditional in the index loop.

## Threat Flags

No new security-relevant surface introduced. All hrefs in this plan are static author-provided values (no user input), consistent with the threat model in T-14-03.

## Self-Check: PASSED

- [x] `src/components/v3/rule.tsx` -- exists
- [x] `src/components/v3/rule-strong.tsx` -- exists
- [x] `src/components/v3/section-label.tsx` -- exists
- [x] `src/components/v3/chip.tsx` -- exists
- [x] `src/components/v3/list-row.tsx` -- exists
- [x] `src/components/v3/button.tsx` -- exists
- [x] `src/components/v3/big-list.tsx` -- exists
- [x] `src/components/v3/page-hero.tsx` -- exists
- [x] `src/components/v3/marquee.tsx` -- exists
- [x] Commits 227cae1, 7893aac, e17f4f2 all exist
- [x] `npx tsc --noEmit` clean (no errors)
- [x] `useReducedMotion` present in marquee.tsx
- [x] `"use client"` present in marquee.tsx
