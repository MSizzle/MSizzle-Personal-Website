# Phase 9: Design Tokens & Editorial Primitives - Research

**Researched:** 2026-05-21
**Domain:** Tailwind v4 `@theme` token authoring, Next.js 16 App Router routing semantics, presentational React Server Components, Inter typography at extreme sizes
**Confidence:** HIGH (verified against current official Next.js 16 + Tailwind v4 docs and the existing codebase; one blocking conflict surfaced between CONTEXT.md D-12 and Next.js routing rules)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

CONTEXT.md decisions D-01 through D-21 are locked. Highlights the planner MUST honor verbatim:

- **D-01:** Replace the `@theme inline` block contents in `src/app/globals.css` with the 10 role-named warm-paper tokens at the exact hex values listed below. Token list (verbatim):
  - `--color-paper: #F4F2EC;` (page background; warm off-white)
  - `--color-ink: #0E0E0C;` (body text & primary type)
  - `--color-muted: #9A9690;` (metadata, captions, secondary nav, blurbs)
  - `--color-faint: #C7C3BA;` (tertiary text, rare)
  - `--color-rule: #E5E2D9;` (hairline horizontal dividers, 1px)
  - `--color-rule-strong: #1A1A18;` (bold horizontal section dividers, 1px)
  - `--color-footer-bg: #0E0E0C;` (footer inverts to Ink)
  - `--color-footer-fg: #F4F2EC;` (footer text on Ink)
  - `--color-footer-mute: #7A7770;` (footer secondary text, warm gray on Ink)
  - `--color-footer-rule: rgba(244, 242, 236, 0.18);` (hairline divider on Ink)
- **D-02:** Keep v1.0 token names (`--bg`, `--fg`, `--bg-secondary`, `--fg-muted`, `--border`, `--accent`, `--accent-warm`, `--gold`) as compat aliases — each aliases to a new token. Phase 12's restyle sweep removes the aliases.
- **D-03:** `@theme inline` keyword stays — required to preserve `var()` indirection for the alias bridge.
- **D-04:** **Drop dark mode for v2.0.** Remove `.dark` block from `globals.css`, remove `<ThemeProvider>` wrap from `layout.tsx`, remove `<ThemeToggle>` UI, delete `theme-provider.tsx` + `theme-toggle.tsx`, keep `next-themes` installed in package.json.
- **D-05:** `suppressHydrationWarning` on `<html>` stays (harmless without theme switching).
- **D-06:** Tailwind v4 `@theme` typography extensions — exact `--text-{name}` + `--text-{name}--line-height` + `--text-{name}--letter-spacing` + `--text-{name}--font-weight` block per CONTEXT.md.
- **D-07:** Label tracking = 0.2em; meta tracking = 0.16em (middle of the handoff ranges).
- **D-08:** All 7 primitives live in `src/components/editorial/` — kebab-case filenames, PascalCase named exports.
- **D-09:** Token-driven, zero arbitrary values. No `border-[1px]`, no `text-[11px]`, no `tracking-[0.2em]`.
- **D-10:** `ListRow` `big` variant is a single component with `big?: boolean` prop, not two components.
- **D-11:** Primitives are Server Components by default (no `'use client'` directive — hover handled via CSS `hover:` Tailwind variants).
- **D-12:** ⚠️ Route `/_specimen` at `src/app/_specimen/page.tsx`. **SEE BLOCKING CONFLICT in `## Open Questions` — Next.js 16 App Router treats `_`-prefixed folders as private/non-routable; this decision needs adjustment.**
- **D-13:** Specimen content order: palette swatches → type-scale specimens → 7 primitive renders → "no animations" note.
- **D-14:** Specimen metadata: `robots: { index: false, follow: false }` + sitemap exclusion.
- **D-15:** Preserve from Phase 8 — `scroll-reveal.tsx`, `lenis-provider.tsx`, `template.tsx`. DO NOT touch in Phase 9.
- **D-16:** Preserve from Phase 8 — `/newsletter` route + carousel.
- **D-17:** Inter is the typeface. Already loaded at `layout.tsx:13–17` with `weight: ["400", "700"]`. Phase 9 verifies + does not change.
- **D-18:** Per-plan `npm run build` MUST exit 0 before commit.
- **D-19:** Phase gate `vercel build --prod` exits 0 (Plan 09-09 natural site).
- **D-20:** 9 plans, two waves — Wave 1: `09-01` tokens + `09-02..09-08` primitives (parallelizable); Wave 2: `09-09` specimen route.
- **D-21:** Wave 1 plans are parallel-safe — each plan touches a unique file set.

### Claude's Discretion

- JSDoc comments inside each primitive — minimal, WHY-not-obvious only (per CLAUDE.md no-comments default).
- Exact `cn(...)` helper import path — **verified at `@/utils/cn`** (see Existing Code Insights below).
- Specimen page section ordering — palette → type scale → primitives (matches D-13).
- Skip a `_dev` index linking to specimen — overkill for one-page resource.

### Deferred Ideas (OUT OF SCOPE)

- Dark-mode editorial palette — explicitly dropped (D-04). Reintroduction is a future milestone.
- Storybook integration — defer to future tooling milestone.
- Animated specimen page — violates motion budget. Defer.
- Token contrast accessibility audit — Phase 9 doesn't enforce a contrast gate; Phase 13 QA flags if needed. (Noted: muted/paper combo `#9A9690` on `#F4F2EC` is ~3.2:1 — WCAG AA large-text only.)
- CSS Custom Properties polyfill — modern browsers support all CSS used.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TOKEN-01 | Tailwind v4 `@theme` block defines warm-paper palette as named tokens (10 colors) | F1: Tailwind v4 `--color-*` namespace auto-generates `bg-*`, `text-*`, `border-*`, etc. utilities; D-01 hex values are verbatim from the handoff. |
| TOKEN-02 | Custom Tailwind utilities for editorial type scale (display 124px through meta 11px) — each bundles font-size + line-height + letter-spacing + weight | F2: Tailwind v4 `@theme { --text-{name}: ...; --text-{name}--line-height: ...; --text-{name}--letter-spacing: ...; --text-{name}--font-weight: ...; }` is the official documented pattern. Modifier syntax verified against official docs. |
| TOKEN-03 | Inter (next/font/google weights 400/700) is the typeface; no font swap | F3: Already satisfied in current codebase (`src/app/layout.tsx:13–17`). Inter on Google Fonts supports `weight: ['400', '700']` directly. Phase 9 is verification + preservation only. |
| PRIM-01 | `Rule` — 1px hairline horizontal divider (`border-rule`) | F8: `border-t border-rule h-px` pattern; Server Component. |
| PRIM-02 | `RuleStrong` — 1px bold horizontal section divider (`border-rule-strong`) | F8: same pattern with stronger token. |
| PRIM-03 | `SectionLabel` — 11px tracked uppercase section heading with optional right-aligned numeral | F8: `text-label` + `uppercase` + flex justify-between, optional `num` prop. |
| PRIM-04 | `ListRow` — linked row with title + optional `extra` blurb + right-aligned tracked meta; `big` variant | F8 + D-10: single component, `big?: boolean` switches padding 20px→28px and title size from `text-list-title-home` (20px) → `text-list-title` (28px). |
| PRIM-05 | `AllLink` — tracked uppercase "All X →" link with 1px ink bottom-border | F8: `inline-block`, `text-nav` (or `text-label` if uppercase tracked), `border-b border-ink`. |
| PRIM-06 | `IntroLink` — inline link with 1px ink bottom-border (used in letter-style intro) | F8: thin presentational wrapper around `next/link`. |
| PRIM-07 | `FooterCol` — footer column with tracked uppercase title + list of links with grey sub-line | F8: title in `text-footer-mute` 11px tracked; items are `[label, sub]` tuples or `{ label, sub, href }` objects. |

</phase_requirements>

## Summary

Phase 9 is a foundation phase with 21 user-locked decisions covering every meaningful "what to build" question. The research surface is narrow: verify Tailwind v4 token-authoring syntax against current docs, audit the existing codebase for the four moving pieces touched by Plan 09-01 (globals.css, layout.tsx, theme-provider, theme-toggle), and confirm the seven primitives can ship as Server Components.

Three notable findings:

1. **`<ThemeToggle>` is defined but has ZERO call sites.** The grep `rg -n "ThemeToggle|theme-toggle" src/` returns one hit — its own definition in `src/components/theme-toggle.tsx`. Plan 09-01 simply deletes the file; no nav sweep is required. CONTEXT.md D-04 hints at "remove `<ThemeToggle>` UI from the nav" — that work is already a no-op.
2. **The `cn` helper lives at `src/utils/cn.ts` (alias `@/utils/cn`), not `src/lib/utils.ts`.** Confirmed import in `src/components/nav/navigation.tsx` + `src/components/blog/tag-filter.tsx`. The planner must use `import { cn } from '@/utils/cn'` in any primitive that needs conditional className merging (only `ListRow` and possibly `SectionLabel`).
3. **D-12 `/_specimen` route conflicts with Next.js 16 App Router routing semantics.** Per the official Next.js 16 docs (lastUpdated 2026-05-19), `_`-prefixed folders are *private* — they are opted out of routing entirely. `src/app/_specimen/page.tsx` will 404. The planner must change the route to `/specimen` (no underscore) or to a URL-encoded `%5Fspecimen` form, with `robots.ts` + `noindex` metadata + `sitemap.ts` exclusion handling discoverability. The "underscore prefix excludes from sitemap by convention" reasoning in D-12 conflates two different mechanisms.

**Primary recommendation:** Plan 09-01 stays single-plan and edits exactly four files (`globals.css`, `layout.tsx`, `theme-provider.tsx` delete, `theme-toggle.tsx` delete). Plans 09-02..09-08 each create one new file under `src/components/editorial/` and import `cn` from `@/utils/cn` if needed. Plan 09-09 creates `src/app/specimen/page.tsx` (NOT `_specimen` — see Open Questions) with `noindex` metadata and adds `/specimen` to the `app/sitemap.ts` exclusion list.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Design token authoring (palette + type scale) | CSS / Tailwind config (build-time) | — | Tokens are CSS custom properties consumed by Tailwind's utility generator. No runtime tier owns them. |
| Compat alias bridge (v1.0 → v2.0) | CSS (`@theme inline` + `:root`) | — | Build-time CSS variable indirection; no JavaScript runtime. |
| Editorial primitives rendering | Frontend Server (RSC) | Browser (hover via CSS) | Default to Server Components per D-11; hover is CSS-only `hover:` variants which work in RSC. |
| Theme switching (DROPPED in v2.0) | — (none) | — | D-04 explicitly drops dark mode. No tier owns theme switching after Phase 9. |
| Specimen page rendering | Frontend Server (RSC) | — | Static dev-resource page; no client interactivity required. |
| Font loading (Inter 400/700) | Frontend Server (next/font/google build-time) | Browser (CSS font-face) | Already wired in `layout.tsx`; build-time download + CSS variable injection. |
| Specimen route discoverability suppression | Frontend Server (metadata API + `robots.ts` + `sitemap.ts`) | — | Three layers: page-level `robots: { index: false, follow: false }`, route entry in `sitemap.ts` exclusion, optional `robots.ts` Disallow. |

## Standard Stack

### Core (all already installed — Phase 9 adds zero dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 [VERIFIED: package.json] | App Router framework | Project baseline. Phase 9 uses `app/sitemap.ts` Metadata API, page-level `metadata` exports, and the file-conventions routing system. |
| React | 19.2.4 [VERIFIED: package.json] | Component runtime | Server Components by default per D-11. |
| TypeScript | ^5 [VERIFIED: package.json] | Type safety | Primitive prop interfaces. |
| Tailwind CSS | 4.2.2 (installed) / 4.3.0 (latest) [VERIFIED: npm view tailwindcss version] | Utility CSS with `@theme` token authoring | `@theme inline` keyword preserves `var()` indirection — verified in [Tailwind v4 docs](https://tailwindcss.com/docs/theme). `--color-*` namespace auto-generates `bg-*`/`text-*`/`border-*` utilities. `--text-{name}` + `--text-{name}--line-height` + `--text-{name}--letter-spacing` + `--text-{name}--font-weight` modifier syntax bundles font properties into a single `text-{name}` utility. |
| @tailwindcss/postcss | 4.2.2 [VERIFIED: package.json] | PostCSS plugin | Configured in `postcss.config.mjs`. Auto-scans from CWD; `src/` is picked up without explicit `@source` directive. |
| next/font/google (Inter) | bundled with Next.js 16 | Font loading | Already wired at `layout.tsx:13–17` with `weight: ['400', '700']`. Default `display: swap` prevents FOIT. `adjustFontFallback: true` (default for Google Fonts) minimizes layout shift. |
| clsx | 2.1.1 [VERIFIED: package.json] | Conditional class composition | Used inside `@/utils/cn`. |
| tailwind-merge | 3.5.0 [VERIFIED: package.json] | Tailwind class conflict resolution | Used inside `@/utils/cn`. |
| next-themes | 0.4.6 [VERIFIED: package.json] | (Kept installed but unwired) | Per D-04 — package stays in dependencies for potential future dark-mode reintroduction; consumers deleted by Plan 09-01. |

### Supporting (referenced for context — no new install)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/link | bundled | Client-side navigation | Used by `ListRow`, `AllLink`, `IntroLink`, `FooterCol`. Standard `<Link href="..." className="...">{children}</Link>` pattern (see existing `src/components/nav/navigation.tsx`). |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@theme inline` | `@theme` (no inline) | Without `inline`, Tailwind freezes the `var()` reference at build time, breaking the v1.0→v2.0 alias bridge. D-03 locks `inline` for this reason. |
| Server Components for primitives | `'use client'` directives | Adds bundle weight unnecessarily. D-11 keeps RSC default — hover is CSS-only. |
| Custom `cn` helper | Hand-rolled `[a, b].filter(Boolean).join(' ')` | Project already has `@/utils/cn` (clsx + tailwind-merge). No reason to reinvent. |
| `<Rule strong />` single-component with boolean | Two separate components (`Rule`, `RuleStrong`) | D-08 lists them as two distinct files (`rule.tsx`, `rule-strong.tsx`) — locked for explicitness. The handoff `shared.jsx` reference also splits them in usage despite a single combined definition; following D-08 keeps PRIM-01 and PRIM-02 each cleanly addressable. |

**Installation:** None. All dependencies present.

**Version verification:**
```bash
# Verified 2026-05-21
npm view tailwindcss version          # 4.3.0 (project on 4.2.2 — compatible)
npm view next version                 # (project on 16.2.1; not re-verified — preserved as-is)
npm view motion version               # 12.39.0 (project on 12.38.0 — compatible)
npm view next-themes version          # 0.4.6 (project matches; per D-04 kept but unwired)
```

## Package Legitimacy Audit

> Phase 9 installs **zero** new packages. All dependencies in scope are pre-existing project deps verified against `package.json` + `package-lock.json`. Slopcheck not run because no new packages are being added; the dependencies referenced (clsx, tailwind-merge, next-themes, motion, next, react, tailwindcss) are all long-established mainstream npm packages already in the repo's lockfile.

| Package | Registry | Already in lockfile? | Disposition |
|---------|----------|---------------------|-------------|
| tailwindcss | npm | ✓ (4.2.2) | Already installed; Phase 9 uses `@theme` syntax only |
| @tailwindcss/postcss | npm | ✓ (4.2.2) | Already installed |
| next | npm | ✓ (16.2.1) | Already installed |
| react | npm | ✓ (19.2.4) | Already installed |
| clsx | npm | ✓ (2.1.1) | Already installed; consumed via `@/utils/cn` |
| tailwind-merge | npm | ✓ (3.5.0) | Already installed; consumed via `@/utils/cn` |
| next-themes | npm | ✓ (0.4.6) | Kept per D-04 but no new consumer in Phase 9 |
| motion | npm | ✓ (12.38.0) | Not used in Phase 9 (signature stagger is Phase 10) |

**Packages removed due to slopcheck verdict:** none (no new packages added)
**Packages flagged as suspicious:** none

## Architecture Patterns

### System Architecture Diagram

```
                          PHASE 9 FOUNDATION
                          ==================

  ┌─────────────────────────────────────────────────────────────┐
  │  src/app/globals.css  (Plan 09-01)                          │
  │  ──────────────────────                                     │
  │  @import "tailwindcss";                                     │
  │  @theme inline {                                            │
  │    --color-paper, --color-ink, ... (10 palette tokens)      │
  │    --text-display, --text-page-title, ... (9 type scales)   │
  │    --font-sans, --font-mono                                 │
  │    --bg, --fg, ... (compat aliases via var() → new tokens)  │
  │  }                                                          │
  │  :root { ... compat aliases hold v1.0 hex values ... }      │
  │  /* .dark block removed */                                  │
  │  body { ... preserved }                                     │
  │  .prose { ... preserved (legacy v1.0 prose styling) }       │
  │  .section-inverted { ... preserved }                        │
  └────────────┬────────────────────────────────────────────────┘
               │
               ▼
        Tailwind v4 generates utilities:
        bg-paper, text-ink, border-rule,
        text-display, text-label, etc.
               │
               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  src/components/editorial/  (Plans 09-02..09-08)            │
  │  ──────────────────────                                     │
  │  rule.tsx          → <Rule />                  (PRIM-01)    │
  │  rule-strong.tsx   → <RuleStrong />            (PRIM-02)    │
  │  section-label.tsx → <SectionLabel num="01">   (PRIM-03)    │
  │  list-row.tsx      → <ListRow big href="...">  (PRIM-04)    │
  │  all-link.tsx      → <AllLink href="...">      (PRIM-05)    │
  │  intro-link.tsx    → <IntroLink href="...">    (PRIM-06)    │
  │  footer-col.tsx    → <FooterCol items={...}>   (PRIM-07)    │
  │                                                             │
  │  All Server Components. Hover via CSS hover: variants.      │
  │  Token-driven classes only — zero arbitrary values.         │
  │  4 of 7 import next/link (ListRow, AllLink, IntroLink,      │
  │   FooterCol). 2 of 7 import cn from @/utils/cn              │
  │   (ListRow for big-variant, SectionLabel for optional num). │
  └────────────┬────────────────────────────────────────────────┘
               │
               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  src/app/specimen/page.tsx  (Plan 09-09 — Wave 2)           │
  │  ──────────────────────                                     │
  │  Imports all 7 primitives + renders all 10 palette swatches │
  │  + 9 type-scale specimens + 7 primitive demos               │
  │  + "no animations" note                                     │
  │                                                             │
  │  export const metadata = { robots: { index: false,          │
  │                                       follow: false } }     │
  │  + sitemap.ts exclusion + robots.ts Disallow (defense-in-   │
  │    depth)                                                   │
  └─────────────────────────────────────────────────────────────┘

  Layout removal sweep (Plan 09-01, same atomic commit):
  ┌─────────────────────────────────────────────────────────────┐
  │  src/app/layout.tsx                                         │
  │    Line 3:   - import { ThemeProvider } from "@/components/ │
  │                providers/theme-provider";                   │
  │    Line 68:  - <ThemeProvider>                              │
  │    Line 76:  - </ThemeProvider>                             │
  │  src/components/providers/theme-provider.tsx  → DELETED     │
  │  src/components/theme-toggle.tsx              → DELETED     │
  │  (No nav sweep needed — ThemeToggle has zero call sites.)   │
  └─────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── app/
│   ├── globals.css                  # Plan 09-01 rewrites @theme block
│   ├── layout.tsx                   # Plan 09-01 removes ThemeProvider wrap
│   ├── sitemap.ts                   # Plan 09-09 adds /specimen exclusion
│   ├── robots.ts                    # Plan 09-09 adds Disallow: /specimen (defense-in-depth)
│   └── specimen/                    # Plan 09-09 NEW (no underscore — see Open Questions)
│       └── page.tsx                 # Server Component, robots: noindex
├── components/
│   ├── editorial/                   # NEW directory
│   │   ├── rule.tsx                 # Plan 09-02 (PRIM-01)
│   │   ├── rule-strong.tsx          # Plan 09-03 (PRIM-02)
│   │   ├── section-label.tsx        # Plan 09-04 (PRIM-03)
│   │   ├── list-row.tsx             # Plan 09-05 (PRIM-04, with big variant)
│   │   ├── all-link.tsx             # Plan 09-06 (PRIM-05)
│   │   ├── intro-link.tsx           # Plan 09-07 (PRIM-06)
│   │   └── footer-col.tsx           # Plan 09-08 (PRIM-07)
│   ├── providers/
│   │   └── theme-provider.tsx       # Plan 09-01 DELETES
│   └── theme-toggle.tsx             # Plan 09-01 DELETES
└── utils/
    └── cn.ts                        # Pre-existing — imported as @/utils/cn
```

### Pattern 1: Tailwind v4 `@theme inline` with var() indirection

**What:** Use `@theme inline` (not `@theme`) when token values reference other CSS variables via `var()`. This is what allows the v1.0→v2.0 alias bridge (D-02) to work.

**When to use:** Always for this project — the existing globals.css already uses `@theme inline { --color-background: var(--bg); ... }`, and Plan 09-01 extends the same pattern.

**Example:**
```css
/* Source: https://tailwindcss.com/docs/theme + existing globals.css */
@import "tailwindcss";

@theme inline {
  /* New v2.0 palette */
  --color-paper: #F4F2EC;
  --color-ink: #0E0E0C;
  --color-muted: #9A9690;
  --color-faint: #C7C3BA;
  --color-rule: #E5E2D9;
  --color-rule-strong: #1A1A18;
  --color-footer-bg: #0E0E0C;
  --color-footer-fg: #F4F2EC;
  --color-footer-mute: #7A7770;
  --color-footer-rule: rgba(244, 242, 236, 0.18);

  /* Type scale — each utility bundles size + line-height + tracking + weight */
  --text-display: 124px;
  --text-display--line-height: 0.96;
  --text-display--letter-spacing: -0.045em;
  --text-display--font-weight: 700;

  --text-page-title: 120px;
  --text-page-title--line-height: 0.95;
  --text-page-title--letter-spacing: -0.045em;
  --text-page-title--font-weight: 700;

  /* ...feature, event-title, section-feature, list-title, list-title-home,
        body-lead, nav, label, meta per CONTEXT.md D-06 ... */

  /* Font family — preserved from current file */
  --font-sans: var(--font-inter);
  --font-mono: var(--font-geist-mono);

  /* v1.0 compat aliases — bridge into Phase 12 sweep */
  --color-background: var(--color-paper);
  --color-foreground: var(--color-ink);
  --color-bg-secondary: var(--color-paper);
  --color-fg-muted: var(--color-muted);
  --color-border: var(--color-rule-strong);
  --color-accent: var(--color-ink);
  --color-accent-warm: var(--color-ink);
}

:root {
  /* v1.0 aliases — values now point to v2.0 palette via the above */
  --bg: #F4F2EC;
  --fg: #0E0E0C;
  --bg-secondary: #F4F2EC;
  --fg-muted: #9A9690;
  --border: #1A1A18;
  --accent: #0E0E0C;
  --accent-warm: #0E0E0C;
  --gold: #0E0E0C;
}

/* .dark block REMOVED (D-04) */
/* .section-inverted preserved — but rewrite values to new palette */
```

**Why `inline` matters here:** Without `inline`, the generated CSS for `.bg-background` would emit `background-color: var(--color-background)`, and `--color-background` itself would be a CSS variable whose value is `var(--bg)`. The two-hop var() chain still works in browsers, but `inline` collapses it at build time so `.bg-background` emits `background-color: var(--bg)` directly — one variable indirection, cheaper at runtime and matching the existing file's intent.

### Pattern 2: Tailwind v4 typography utility with bundled properties

**What:** A single `--text-{name}: <size>` declaration plus three optional modifiers (`--text-{name}--line-height`, `--text-{name}--letter-spacing`, `--text-{name}--font-weight`) generates a single `text-{name}` utility that applies all four properties.

**When to use:** Every editorial type scale entry — manifesto 124px, page title 120px, feature 44px, etc.

**Example:**
```css
/* Source: https://tailwindcss.com/docs/font-size + Tailwind v4 docs */
@theme inline {
  --text-display: 124px;
  --text-display--line-height: 0.96;
  --text-display--letter-spacing: -0.045em;
  --text-display--font-weight: 700;
}

/* Generates: */
/* .text-display {
     font-size: 124px;
     line-height: 0.96;
     letter-spacing: -0.045em;
     font-weight: 700;
   }                                                                                    */
```

**Caveats:**
- The base `--text-{name}` declaration is **required** (holds font-size). All three modifiers are optional.
- Modifier syntax uses **double dash** (`--`) between base name and modifier: `--text-display--line-height`, not `--text-display-line-height`.
- The `@theme` block must come **after** `@import "tailwindcss"` at the top level (already correct in current file).
- Theme variables must be top-level — not nested under selectors or media queries.

### Pattern 3: Server Component primitive with hover via CSS variant

**What:** A presentational React Server Component that uses Tailwind `hover:` variants for interactivity. No `'use client'` directive needed.

**When to use:** All 7 Phase 9 primitives (D-11).

**Example:**
```tsx
// src/components/editorial/all-link.tsx — PRIM-05
import Link from 'next/link'

type Props = {
  href: string
  children: React.ReactNode
}

export function AllLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="inline-block border-b border-ink pb-[3px] text-nav font-bold uppercase text-ink transition-opacity duration-100 hover:opacity-70"
    >
      {children}
    </Link>
  )
}
```

**Note on D-09 (zero arbitrary values):** The handoff specifies "paddingBottom: 3" for AllLink. This is 3px — not a value in the standard Tailwind spacing scale and not a token Phase 9 introduces. Two options:
1. Use `pb-[3px]` (the literal handoff value) — but this violates D-09.
2. Add a `--spacing-px` token or use `pb-0.5` (2px) / `pb-1` (4px) as the closest standard increment.

**Recommended for Plan 09-06:** Use `pb-1` (4px) as the cleanest token-respecting choice; if visual diff vs. handoff is unacceptable on the specimen page, the planner adds a `--spacing-3px: 3px;` token to `@theme` and uses `pb-3px`. This is a Claude's-discretion call within D-09.

### Pattern 4: `ListRow` with `big` variant via `cn`

**What:** Single component, `big?: boolean` prop, conditional class composition via `cn()`.

**Example:**
```tsx
// src/components/editorial/list-row.tsx — PRIM-04
import Link from 'next/link'
import { cn } from '@/utils/cn'

type Props = {
  title: string
  href: string
  meta: string
  extra?: string
  big?: boolean
  last?: boolean    // suppresses trailing border-bottom
}

export function ListRow({ title, href, meta, extra, big = false, last = false }: Props) {
  return (
    <div className={cn(!last && 'border-b border-rule')}>
      <Link
        href={href}
        className={cn(
          'grid grid-cols-[1fr_auto] items-baseline gap-6 text-ink no-underline',
          big ? 'py-7' : 'py-5'      // 28px : 20px
        )}
      >
        <div>
          <div className={cn(big ? 'text-list-title' : 'text-list-title-home')}>
            {title}
          </div>
          {extra && (
            <div className="mt-1.5 text-[13px] leading-snug text-muted">
              {extra}
            </div>
          )}
        </div>
        <div className="whitespace-nowrap text-meta uppercase text-muted">
          {meta}
        </div>
      </Link>
    </div>
  )
}
```

**Note:** `mt-1.5` = 6px and `text-[13px]` would technically violate D-09. The cleanest fix is to either rely on `text-meta` (11px) for the extra blurb (visual diff — handoff says 13px) or add a `--text-caption: 13px; --text-caption--line-height: 1.4;` token to `@theme` if Phase 10 needs it anyway. Surface to planner.

### Anti-Patterns to Avoid

- **`'use client'` on primitives without event handlers** — wastes bundle size; hover is CSS-only. (D-11.)
- **Arbitrary values like `border-[1px]`, `text-[11px]`, `tracking-[0.2em]`** — defeats the token system. Add a token instead. (D-09.)
- **Adding a `cn` helper to a primitive that doesn't conditionally compose classes** — `Rule` and `RuleStrong` and `IntroLink` are static; only `ListRow` and (optionally) `SectionLabel` need `cn`.
- **Placing `@theme` before `@import "tailwindcss"`** — Tailwind v4 needs the import first to register the directive parser.
- **Nesting `@theme` inside a media query or selector** — theme variables must be top-level. (Verified in [Tailwind v4 docs](https://tailwindcss.com/docs/theme).)
- **Wiring primitives to existing v1.0 palette tokens (`var(--fg)`, `var(--bg)`)** — primitives must use the new v2.0 tokens (`text-ink`, `bg-paper`, `border-rule`) so Phase 12's alias removal doesn't break them.
- **Underscore-prefixed routable folders** — `src/app/_specimen/page.tsx` returns 404 in Next.js 16 App Router. Use `src/app/specimen/page.tsx` and rely on `noindex` + `robots.ts` for discoverability suppression.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conditional className composition | Template-string ternary or array filter+join | `cn()` from `@/utils/cn` | Already exists; handles class-conflict resolution via `tailwind-merge`; consistent with `navigation.tsx` and `tag-filter.tsx` patterns. |
| CSS variable indirection layer for theme | Two `:root` blocks + manual `var()` chains | `@theme inline { --x: var(--y) }` | Tailwind v4 collapses the var() chain at build time; one source of truth. |
| Font loading optimization | Custom `<link rel="preload">` tag in `<head>` | `next/font/google` (already wired) | Build-time download + automatic font-display + size-adjust fallback to prevent CLS. |
| Sitemap exclusion logic | Manual rewrite or middleware | Native `app/sitemap.ts` exclusion + page-level `metadata.robots` | Two complementary mechanisms; Phase 9 uses both for defense-in-depth (D-14). |
| Theme persistence across sessions | Hand-roll localStorage/sessionStorage with hydration guards | `next-themes` (kept installed but unwired per D-04) | If dark mode is later reintroduced, the package is already there. Phase 9 doesn't need it. |
| Class-conflict resolution (e.g., `cn('py-5', big && 'py-7')`) | Custom regex stripping duplicate utility roots | `tailwind-merge` (transitively via `cn`) | Handles all Tailwind utility conflict groups correctly. |

**Key insight:** Phase 9 is foundation-only — every "hand-rolling" temptation is solved by an existing tool already in the project. The discipline is **using what's there** rather than inventing parallel systems.

## Runtime State Inventory

> This phase involves file rewrites and deletions (theme-provider, theme-toggle). State inventory checked below.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — Phase 9 introduces no databases, no localStorage writes, no cookies. The deleted `theme-provider.tsx` wrote `document.documentElement.classList` and `colorScheme` style but did not persist. The deleted `theme-toggle.tsx` consumed `useTheme()` from `next-themes`, which would have read from a localStorage key (`theme` by default) — but since `<ThemeToggle>` has zero call sites, this never fired in production. No user state at risk. | None |
| Live service config | None — Phase 9 is local file changes only. No Vercel env vars, no Notion content, no Umami dashboards touched. | None |
| OS-registered state | None — no scheduled tasks, no systemd units, no Docker containers, no launchd plists. | None |
| Secrets/env vars | None — Phase 9 reads no secrets and writes no env vars. `next-themes` localStorage key is consumed by no code post-Phase-9. | None |
| Build artifacts / installed packages | `next-themes` remains in `node_modules/` after Plan 09-01 deletes its only consumer (`theme-toggle.tsx`). Per D-04 this is intentional. No `.next/` cache invalidation required beyond what `npm run build` does naturally. | None — D-04 explicitly keeps the package installed |

**Canonical answer:** After every file in the repo is updated, what runtime systems still have the old palette cached? **None.** The v1.0 palette compat aliases (D-02) are intentionally kept in `globals.css` itself so v1.0-styled pages keep working. There is no external runtime cache (Vercel CDN may serve stale CSS for ~minutes after deploy, but that's normal HTTP caching, not a state migration concern).

## Common Pitfalls

### Pitfall 1: `_specimen` folder not routable (CRITICAL — affects D-12)

**What goes wrong:** `src/app/_specimen/page.tsx` returns a 404. The route is silently dead.
**Why it happens:** Next.js 16 App Router treats `_`-prefixed folders as **private folders** explicitly opted out of routing. From the official docs (lastUpdated 2026-05-19): "Private folders can be created by prefixing a folder with an underscore: `_folderName`. This indicates the folder is a private implementation detail and should not be considered by the routing system, thereby opting the folder and all its subfolders out of routing."
**How to avoid:** Use `src/app/specimen/page.tsx` (no underscore) and suppress discoverability via three layers:
1. Page-level `export const metadata = { robots: { index: false, follow: false } }`
2. Exclude `/specimen` from `app/sitemap.ts` (already excludes by omission — just don't add it)
3. Add `Disallow: /specimen` to `app/robots.ts` for defense-in-depth
**Warning signs:** Navigating to `/_specimen` in dev returns 404 instead of the page; `next build` does not list `_specimen` in the route manifest.
**Reference:** [Next.js project-structure docs](https://nextjs.org/docs/app/getting-started/project-structure#private-folders) — see Open Questions section for the planner-facing resolution.

### Pitfall 2: `@theme` placement breaks token generation

**What goes wrong:** Defining `@theme` blocks before `@import "tailwindcss"` or nesting them inside selectors/media queries → tokens silently fail to generate utility classes; `bg-paper` becomes an unknown class and is stripped from the build.
**Why it happens:** Tailwind's directive parser registers `@theme` only after the `@import` has been processed. Theme variables also require top-level placement.
**How to avoid:** Always: `@import "tailwindcss"` first, then `@theme inline { ... }` at the top level — never inside `:root`, never inside `@layer base`, never inside a media query.
**Warning signs:** `npm run build` succeeds, but the specimen page renders unstyled. `text-display` shows as plain inherited body text. Inspect element shows the class name applied but no matching CSS rule emitted.
**Reference:** [Tailwind v4 theme docs](https://tailwindcss.com/docs/theme): "Theme variables are also required to be defined top-level and not nested under other selectors or media queries."

### Pitfall 3: Forgetting `inline` keyword breaks alias bridge

**What goes wrong:** `@theme { --color-background: var(--bg); }` (no `inline`) generates `.bg-background { background-color: var(--color-background); }` — the utility points at the theme variable, not at `--bg`. If `--bg` later changes, the indirection still works in this simple case BUT in cases where the alias is *removed* in Phase 12, the utility breaks because `--color-background` itself is gone.
**Why it happens:** Without `inline`, Tailwind v4 generates a global CSS variable that holds the var() expression. With `inline`, Tailwind inlines the *value* of the var() at build time so the utility refers to the underlying variable directly.
**How to avoid:** D-03 locks `@theme inline`. Plan 09-01's verification checklist should explicitly grep that `inline` is present on the `@theme` block.
**Warning signs:** Phase 12's alias removal causes mysterious "color appears black" regressions on pages that still use `bg-background` instead of `bg-paper`.
**Reference:** [Tailwind v4 GitHub discussion #18560 — "@theme vs. @theme inline"](https://github.com/tailwindlabs/tailwindcss/discussions/18560).

### Pitfall 4: Inter at 124px renders differently than Helvetica Neue

**What goes wrong:** The handoff specifies Helvetica Neue spec values applied to Inter (TOKEN-03). Inter at 124px has slightly different x-height, glyph proportions, and letter-spacing tolerances than Helvetica Neue, so the manifesto may not feel identical to the mockup.
**Why it happens:** Different typefaces have different intrinsic metrics. Inter is optimized for UI (slightly wider, taller x-height) while Helvetica Neue is a print/display face.
**How to avoid:** Accept the difference — D-17 + the handoff explicitly accept Inter as the v2.0 baseline. The specimen page renders the manifesto so design QA can inspect it before Phase 10 builds the homepage. If the variance is unacceptable to Monty at specimen review, the planner has options: (a) tune letter-spacing slightly (e.g., -0.04em instead of -0.045em), (b) introduce a webfont swap, or (c) accept the Inter aesthetic. Plan 09-09 includes specimen visual review as part of the phase gate.
**Warning signs:** Specimen page review feedback "manifesto looks weird at 124px."

### Pitfall 5: Arbitrary values slip into primitives despite D-09

**What goes wrong:** Mid-implementation, a primitive author needs a value that isn't in the token system (e.g., `pb-3px` for AllLink underline-distance, `mt-1.5` for ListRow extra-blurb gap, `text-[13px]` for caption text in ListRow extra) and reaches for `pb-[3px]` / `text-[13px]` / `tracking-[0.16em]`. D-09 forbids this.
**Why it happens:** Tailwind's standard scale doesn't always match handoff pixel values. The "right" answer is to add a token, but that pulls Plan 09-02..09-08 back into Plan 09-01's globals.css scope, breaking parallelism.
**How to avoid:**
- Plan 09-01's `@theme` block includes a small `caption` text size (`--text-caption: 13px; --text-caption--line-height: 1.4`) if any primitive needs it — adds 5 minutes to Plan 09-01.
- `pb-1` (4px) is a 33% miss vs. handoff 3px — accept the miss for AllLink underline. If unacceptable, add `--spacing-px-3: 3px` to `@theme`.
- For `mt-1.5` (6px) on ListRow extra blurb: this is Tailwind's standard `1.5` increment and is already in the default scale — NOT an arbitrary value. Allowed.
**Warning signs:** plan-checker flags `border-[1px]`, `text-[...]`, `tracking-[...]` in the primitive code.

### Pitfall 6: Compat aliases lose the v1.0 color values silently

**What goes wrong:** Plan 09-01 rewrites `:root` from the v1.0 colors (e.g., `--bg: #fffbfc; --fg: #2d1724;`) to the v2.0 colors (`--bg: #F4F2EC; --fg: #0E0E0C;`). Any v1.0 page that depends on the exact `#fffbfc` cream or `#2d1724` aubergine color visually shifts to the warm-paper palette immediately. This is the *intent* of D-02 — the site progressively gets the v2.0 palette without breaking — but the magnitude of the visual change should be acknowledged.
**Why it happens:** D-02 says aliases bridge into Phase 12. Once `--bg` points to `#F4F2EC`, every consumer of `var(--bg)` (which includes the current homepage Hero, the entire `body { background-color: var(--bg) }` rule, and every existing route) flips to warm paper.
**How to avoid:** Acknowledged design intent. Plan 09-01's SUMMARY should mention the visual shift. Phase 8 already shipped, so the homepage is currently the v1.0 layout — it will pick up the v2.0 palette automatically once Plan 09-01 ships. Phase 12's restyle sweep removes the aliases and any remaining v1.0 hex code.
**Warning signs:** None — this is intended behavior, not a bug. Just communicate it in commit message + plan SUMMARY.

### Pitfall 7: `notion-renderer.tsx` carries 30 `dark:` Tailwind variants

**What goes wrong:** Phase 9 removes the `.dark { ... }` block from globals.css, but `dark:` Tailwind variant utilities in `src/components/notion/notion-renderer.tsx` (e.g., `dark:text-gray-400`, `dark:bg-gray-800`) keep emitting CSS into the bundle.
**Why it happens:** Tailwind v4's `dark:` variant is configured via the `prefers-color-scheme` media query by default OR via a class-based strategy (`.dark` parent selector). With `.dark` block removed, the class-based strategy never matches (no parent has `.dark`), but if the user's system is in dark mode and Tailwind defaults to media-query mode, the `dark:` styles fire unconditionally.
**How to avoid:** Phase 9 does NOT auto-remove `dark:` utilities — that's Phase 12's restyle sweep job (and the Notion renderer is the natural Phase 12 RESTYLE-03 / `/blog` work). Phase 9 only documents the inventory. After Plan 09-01, the `dark:` variants are dead code that doesn't fire (no `.dark` ancestor exists) — they don't cause visual bugs, just bundle bloat.
**Warning signs:** Visual QA in Chrome dev tools with `prefers-color-scheme: dark` shows alternate styles on blog content. Resolution: Phase 12 sweeps `dark:` from `notion-renderer.tsx` as part of the blog restyle.

## Code Examples

Verified patterns from official sources + handoff reference:

### Tailwind v4 `@theme inline` declaration

```css
/* Source: https://tailwindcss.com/docs/theme (verified 2026-05-21) */
@import "tailwindcss";

@theme inline {
  --color-paper: #F4F2EC;
  --color-ink: #0E0E0C;
  /* ... */
  --text-display: 124px;
  --text-display--line-height: 0.96;
  --text-display--letter-spacing: -0.045em;
  --text-display--font-weight: 700;
  /* ... */
  --font-sans: var(--font-inter);
}
```

### Next.js 16 `next/font/google` Inter loader (already in `layout.tsx`)

```tsx
// Source: src/app/layout.tsx:13-17 (already correct per TOKEN-03)
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});
```

### Server Component primitive (Rule — PRIM-01)

```tsx
// src/components/editorial/rule.tsx
// No 'use client' directive — static presentational component
export function Rule() {
  return <hr className="h-px w-full border-0 bg-rule" aria-hidden="true" />
}
```

Note: `<hr>` over `<div>` because `<hr>` is semantically a thematic break. CSS resets the default `border` and uses `bg-rule` for the 1px line via height. `aria-hidden="true"` because the divider is purely decorative.

### Server Component primitive with optional prop (SectionLabel — PRIM-03)

```tsx
// src/components/editorial/section-label.tsx
type Props = {
  children: React.ReactNode
  num?: string                  // optional right-aligned numeral like "01" or "02 — Library"
}

export function SectionLabel({ children, num }: Props) {
  return (
    <div className="flex items-baseline justify-between text-label uppercase text-ink">
      <span>{children}</span>
      {num && <span className="font-normal text-muted">{num}</span>}
    </div>
  )
}
```

### `app/sitemap.ts` exclusion of `/specimen` (defense-in-depth for Plan 09-09)

```tsx
// app/sitemap.ts — Plan 09-09 modification
// /specimen is intentionally NOT included in this list.
// Defense-in-depth: page also has robots: { index: false, follow: false }
// AND robots.ts disallows /specimen.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ... existing staticRoutes (no /specimen entry) ...
  return [...staticRoutes, ...postRoutes, ...projectRoutes]
}
```

### `app/robots.ts` Disallow (defense-in-depth)

```tsx
// app/robots.ts — Plan 09-09 modification (file may not exist yet — check)
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: ['/specimen', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

(Verify whether `src/app/robots.ts` already exists; if so, the Plan 09-09 modification is just adding `/specimen` to an existing `disallow` array.)

### `next/link` usage pattern (consistent with existing project)

```tsx
// Verified pattern from src/components/nav/navigation.tsx (existing code)
import Link from 'next/link'

<Link
  href={href}
  className={cn(
    'text-sm uppercase tracking-wide transition-opacity hover:opacity-80',
    pathname === href ? 'opacity-100' : 'opacity-75'
  )}
>
  {label}
</Link>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with `theme.extend.colors` and `fontSize` | `@theme { --color-*: ...; --text-*: ...; }` in CSS | Tailwind v4 GA (Jan 2025) | No more JS config file; tokens live with the stylesheet. |
| `dark:` class strategy via `darkMode: 'class'` config | Native CSS `prefers-color-scheme` or class strategy via `@variant dark (&:where(.dark, .dark *));` directive in v4 | Tailwind v4 | For Phase 9 — moot. D-04 drops dark mode entirely. |
| `'use client'` everywhere | Server Components by default; opt into client only for interactivity | Next.js 13 App Router → present | Phase 9 primitives are all RSC. |
| `framer-motion` package | Rebranded to `motion`; import `motion/react` | Motion 10/11 → 12 (current 12.39.0) | Not used in Phase 9. Phase 10's manifesto stagger uses it. |
| Plain `text-2xl` + separate `leading-tight` + `tracking-tighter` utilities | `text-display` etc. single utility bundles size + line-height + tracking + weight | Tailwind v4 `--text-{name}--{modifier}` syntax | Phase 9's TOKEN-02 leverages this — fewer classes per element, atomic typography utilities. |

**Deprecated/outdated:**
- `tailwind.config.js` — gone in v4; project already migrated.
- `framer-motion` (npm package name) — renamed to `motion`; project uses `motion@12.38.0`.
- Pages Router — long deprecated for new code; project is App Router.
- `react-notion-x` for App Router — known broken; project uses `notion-to-md` (per CLAUDE.md "What NOT to Use").

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `pb-1` (4px) on `AllLink` is acceptable substitution for the handoff's `paddingBottom: 3` (3px) | Pattern 3, Pitfall 5 | Specimen visual review may flag the 1px diff. Fallback: add `--spacing-3px: 3px` token to `@theme` and use `pb-3px`. |
| A2 | `mt-1.5` (6px standard) is not an arbitrary value under D-09 | Pattern 4 | If plan-checker reads D-09 strictly ("zero arbitrary values"), this could be flagged. Tailwind's standard scale includes `1.5` = 6px, so it's standard. Verify with planner. |
| A3 | `text-[13px]` for ListRow extra blurb is required (handoff spec) | Pattern 4, Pitfall 5 | If Plan 09-01 adds `--text-caption: 13px; --text-caption--line-height: 1.4`, this is solved cleanly. Recommend adding the caption token to Plan 09-01. |
| A4 | Adding `--text-caption: 13px` to Plan 09-01 is within the spirit of D-09 (add tokens before using arbitrary values) | Pitfall 5 | If user disagrees, ListRow extra blurb must use `text-meta` (11px) — visually different from handoff but token-compliant. |
| A5 | The handoff's "Body" 16-18px range is satisfied by Tailwind's default `text-base` (16px) — no new token needed | TOKEN-02 mapping | If the homepage actually needs 17px or 18px specifically, Phase 10 may need to add a `--text-body: 18px` token. Not a Phase 9 problem unless plan-checker disagrees. |
| A6 | Body and Caption type sizes (per the requirement text "body 16-18px, caption 13-15px") are mostly satisfied by existing Tailwind defaults + the new tokens; explicit tokens for these may not be required in Phase 9 | TOKEN-02 mapping | CONTEXT.md D-06 does not define `--text-body` or `--text-caption` tokens. Either the planner accepts default `text-base`/`text-sm` for these or adds tokens. Surface for planner/discuss-phase. |

## Open Questions

1. **🔥 CRITICAL: D-12 `/_specimen` route is not routable in Next.js 16.**
   - What we know: Per the official Next.js 16 docs ([project-structure, lastUpdated 2026-05-19](https://nextjs.org/docs/app/getting-started/project-structure#private-folders)), `_`-prefixed folders are private and opted out of routing entirely. `src/app/_specimen/page.tsx` returns 404.
   - What's unclear: How should the route name and exclusion strategy be adjusted while preserving D-12's intent (a dev resource that is not user-discoverable)?
   - Recommendation: **Change the route to `src/app/specimen/page.tsx` (no underscore).** Suppress discoverability via three independent mechanisms:
     1. Page-level `metadata.robots = { index: false, follow: false }`
     2. Sitemap exclusion (already excluded — just don't add to `app/sitemap.ts`)
     3. `app/robots.ts` Disallow: `/specimen` (defense-in-depth; create the file if missing)
   - Alternate name suggestions (if `/specimen` feels too prominent): `/dev/specimen` (route group `(dev)/specimen/page.tsx` keeps URL clean as `/specimen` but groups dev-only routes), or `/__specimen` (double underscore not reserved — works, but visually odd).
   - **The planner MUST address this before Plan 09-09. The discuss-phase agent should surface this as a user-facing decision since D-12 was explicitly locked in CONTEXT.md.**

2. **Caption-size token (`--text-caption: 13px`) — add to Plan 09-01 or defer?**
   - What we know: Handoff specifies 13-15px for captions and ListRow's `extra` blurb. CONTEXT.md D-06 does not include a caption token.
   - What's unclear: Whether to add `--text-caption: 13px; --text-caption--line-height: 1.4;` to Plan 09-01 (proactive) or let Plan 09-05 (`ListRow`) use `text-meta` (11px, visually small) or `text-[13px]` (D-09 violation).
   - Recommendation: **Add `--text-caption: 13px; --text-caption--line-height: 1.4; --text-caption--letter-spacing: normal;` to Plan 09-01's `@theme` block.** This is the cleanest path and stays within the spirit of D-09 ("add tokens before reaching for arbitrary values"). Cost: 4 extra lines in globals.css.

3. **Body-size token (`--text-body: 18px`) — add now or in Phase 10?**
   - What we know: Handoff says body is "16-18px"; the letter-style intro paragraph (HOME-V2-05) uses 22px (`text-body-lead`); regular body text is unspecified between 16 and 18px.
   - What's unclear: Whether Tailwind's default `text-base` (16px) is the project body or if a specific token is needed.
   - Recommendation: **Defer to Phase 10.** Phase 9 doesn't have a body-text consumer (primitives don't render running paragraphs). If Phase 10 needs an explicit `text-body`, it adds the token then.

4. **`AllLink` underline distance: 3px (handoff) vs. 4px (`pb-1`) — acceptable diff?**
   - What we know: Handoff says `paddingBottom: 3`. D-09 forbids arbitrary `pb-[3px]`.
   - What's unclear: Whether the 1px visual delta is acceptable.
   - Recommendation: **Use `pb-1` (4px) as default. If specimen review flags the diff, add `--spacing-3px: 3px;` to `@theme` and switch to `pb-3px`.** Surface in Plan 09-06 SUMMARY.

5. **`section-inverted` legacy rule in globals.css — preserve or rewrite values?**
   - What we know: `globals.css:88-113` has `.section-inverted` and `.dark .section-inverted` blocks using v1.0 hex values directly (`#2d1724` etc.). These are referenced from v1.0 pages.
   - What's unclear: Plan 09-01 already removes `.dark` block (D-04), which will delete `.dark .section-inverted` (lines 102-113). Should `.section-inverted` (lines 88-101) be rewritten to use new v2.0 hex codes, or preserved exactly?
   - Recommendation: **Preserve `.section-inverted` exactly through Phase 9; rewrite values in Phase 12 as part of restyle sweep.** Delete the `.dark .section-inverted` sub-block as part of the `.dark` removal. The `.section-inverted` styling is currently consumed only by sections that Phase 12 will sweep anyway.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js + npm | All builds | ✓ (assumed) | per package.json `engines` (not pinned) | — |
| Next.js | Build + dev server | ✓ | 16.2.1 [VERIFIED: package.json] | — |
| Tailwind CSS | Build pipeline | ✓ | 4.2.2 (latest 4.3.0) [VERIFIED: package.json + npm] | — |
| Vercel CLI | Phase gate `vercel build --prod` | ✓ (per Phase 8 D-11 carryforward — Monty's local Mac has it) | not pinned | If missing locally, the gate falls back to `npm run build` (TypeScript correctness check); user runs Vercel CLI on Mac. |

**Missing dependencies with no fallback:** none

**Missing dependencies with fallback:** Vercel CLI — Phase 8's HUMAN-UAT pattern showed `vercel build --prod` runs locally on Monty's Mac, with sandbox `npm run build` as the per-plan gate.

## Validation Architecture

> Per `.planning/config.json` workflow.nyquist_validation (not explicitly disabled → enabled by default). Phase 9 validation maps the 4 ROADMAP success criteria to verifiable signals.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + @testing-library/react 16.3.2 + jsdom 29.0.1 [VERIFIED: package.json devDeps] |
| Config file | (none detected at root — Vitest uses default config or one of `vitest.config.ts` / `vite.config.ts` — verify and surface if a config file is missing) |
| Quick run command | `npm run build` (Next.js Turbopack — fast TypeScript + Tailwind verification) |
| Full suite command | `npm run build && npx vercel build --prod` (production build gate per D-19, mirrors Phase 8 D-11) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Existing? |
|--------|----------|-----------|-------------------|-----------|
| TOKEN-01 | `bg-paper`, `text-ink`, `border-rule`, etc. utilities generate correct CSS | smoke (specimen page render) | `npm run build` (utility class must compile) + manual specimen render | Plan 09-09 specimen renders all 10 swatches with explicit `bg-paper`, `text-ink` etc. classes; build failure if any token misnamed |
| TOKEN-02 | `text-display`, `text-page-title`, ... `text-meta` utilities bundle size+line-height+letter-spacing+weight | smoke (specimen page render) | `npm run build` + visual inspect specimen | Plan 09-09 specimen renders each `text-*` utility with sample text; visual inspection confirms size/leading/tracking |
| TOKEN-03 | Inter 400/700 loads, manifesto at 124px doesn't FOUT/FOIT | smoke | `npm run build` + manual specimen render in Chrome | Plan 09-09 specimen renders 124px manifesto-sample text; Network tab in Chrome shows Inter font request returning 200 with no flash |
| PRIM-01..07 | Each primitive renders in isolation with documented props | type-check + smoke | `npx tsc --noEmit` + Plan 09-09 specimen page renders all 7 | Build catches type errors; specimen catches visual regression |

### Sampling Rate
- **Per task commit (Plans 09-01..09-08):** `npm run build` exits 0 (D-18)
- **Per wave merge (Wave 1 → Wave 2):** `npm run build` + open `/specimen` in dev server, visual smoke
- **Phase gate (Plan 09-09):** `vercel build --prod` exits 0 (D-19) — production-ready bundle
- **TypeScript:** `npx tsc --noEmit` zero errors in `src/components/editorial/*` + `src/app/specimen/page.tsx`

### Wave 0 Gaps
- [ ] None — Phase 9 is foundation creation. No new test files required because:
  - Token utilities are visually verified via the specimen page (Plan 09-09)
  - Primitive components are presentational and exercised by the specimen page renders
  - TypeScript catches prop interface errors at build time
- [ ] Optional consideration: Add a Vitest test that imports each primitive and renders it via React Testing Library to catch breakage when a primitive's prop interface drifts. Defer to Phase 10 (when consumers exist) unless plan-check requires it.

## Project Constraints (from CLAUDE.md)

These CLAUDE.md directives are project-level rules. Phase 9 plans MUST honor them:

- **Required tools:** Tailwind v4, shadcn/ui (CLI-based; not used in Phase 9 per CONTEXT.md), Inter via `next/font/google` weights 400/700.
- **Forbidden libraries (`What NOT to Use` list):** `react-notion-x`, `framer-motion` (old package name — use `motion`), Google Analytics, Supabase free tier for Umami, Pages Router, CSS Modules, `next-sitemap`, Contentlayer. **None of these are added by Phase 9 — verified.**
- **No new dependencies:** Per CONTEXT.md `<domain>` block + CLAUDE.md "Recommended Stack". Phase 9's primitives are simple enough that hand-rolled components are appropriate; shadcn/ui CLI not invoked.
- **GSD workflow enforcement:** Phase 9 work happens via `/gsd:plan-phase` → `/gsd:execute-phase`. No direct repo edits outside a GSD workflow.
- **No comments by default (project convention from `prose` editing patterns):** Primitive files should be minimal — file-level JSDoc allowed only when WHY-not-obvious.
- **Tailwind v4 CSS-first config:** No `tailwind.config.js`; all tokens via `@theme` in `globals.css`. Confirmed.
- **App Router (not Pages Router):** Phase 9's specimen route uses `src/app/...` conventions; layout.tsx, sitemap.ts, robots.ts are all App Router.

## Security Domain

> Phase 9 introduces no new external surfaces, no auth changes, no new API routes, no new env var reads, no new user input handling. Security risk surface is minimal.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | n/a — no auth in Phase 9 |
| V3 Session Management | no | n/a — `<ThemeProvider>` removal eliminates the only session-state writer (`next-themes` localStorage); `next-themes` package stays installed but unwired |
| V4 Access Control | minimal | `/specimen` route discoverability suppression — handled via `metadata.robots`, `sitemap.ts` exclusion, `robots.ts` Disallow. Defense-in-depth, not a security gate per se. |
| V5 Input Validation | no | n/a — primitives accept React `children` (rendered, not eval'd) and string props (titles, hrefs). No user input. |
| V6 Cryptography | no | n/a |
| V14 Configuration | minimal | `@theme` block placement validated by build; misplacement is silent-fail not exploit |

### Known Threat Patterns for Tailwind v4 + Next.js 16 App Router

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Specimen route leaks unintended content | Information disclosure | Triple-defense: `robots: noindex`, sitemap exclusion, `robots.ts` Disallow. Specimen page contains only design tokens — no secrets, no Notion content, no user data. |
| `<a href={dynamic}>` in IntroLink injecting `javascript:` URI | Tampering / XSS | `next/link` rejects `javascript:` URIs by default (Next.js 13.4+ guard). Phase 9 primitives that accept `href` should type as `string` not `unknown`; planner may add runtime validation or rely on React/Next defaults. |
| `dangerouslySetInnerHTML` in any primitive | XSS | NONE OF THE 7 PRIMITIVES USE THIS. Verified — they only render typed `children: React.ReactNode` and string props. |
| `--font-inter` variable spoofing via untrusted CSS | Tampering | n/a — only `layout.tsx` writes the CSS variable, server-rendered. No client-side font injection. |

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 — Theme variables docs](https://tailwindcss.com/docs/theme) — `@theme inline` vs `@theme` semantics, namespace-to-utility mapping, top-level placement requirement. Verified 2026-05-21.
- [Tailwind CSS v4 — font-size docs](https://tailwindcss.com/docs/font-size) — `--text-{name}` + modifier syntax (`--text-{name}--line-height`, `--text-{name}--letter-spacing`, `--text-{name}--font-weight`). Verified 2026-05-21.
- [Tailwind CSS v4 — Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files) — automatic content detection from CWD. Verified 2026-05-21.
- [Next.js 16 — Project structure and organization](https://nextjs.org/docs/app/getting-started/project-structure) — private folders (`_folderName`) are non-routable. **CRITICAL — drives Open Question #1.** Verified 2026-05-21, lastUpdated 2026-05-19.
- `.planning/research/editorial-redesign-handoff/README.md` (sections "Design Tokens", "Typography", "Components Catalog", "Implementation Notes for the Developer") — canonical handoff for all token values and primitive specs. Hex values + type-scale spec verified verbatim against CONTEXT.md D-01 + D-06.
- `.planning/research/editorial-redesign-handoff/src/shared.jsx` — reference implementations for `Rule`, `SectionLabel`, `ListRow`, `AllLink`. Used to verify primitive prop shapes.
- `.planning/research/editorial-redesign-handoff/src/home-desktop.jsx` (lines 373-380, 438-459) — reference implementations for `IntroLink` and `FooterCol`.

### Secondary (MEDIUM confidence)
- [Tailwind CSS v4 GitHub Discussion #18560 — @theme vs @theme inline](https://github.com/tailwindlabs/tailwindcss/discussions/18560) — community confirmation of `inline` keyword semantics; aligns with official docs.
- [Tailwind CSS v4 release blog](https://tailwindcss.com/blog/tailwindcss-v4) — automatic content detection introduced in v4.0; configuration-free for standard layouts.
- [Next.js 16 — next/font/google docs](https://nextjs.org/docs/app/api-reference/components/font) — Inter weight `'700'` is a documented valid value (also `'100'..'900'` and `'variable'`).
- Existing project codebase (`src/app/layout.tsx`, `src/app/globals.css`, `src/components/nav/navigation.tsx`, `src/utils/cn.ts`, `package.json`) — verified at research time for actual installed versions and existing patterns.

### Tertiary (LOW confidence)
- None — every critical claim is verified against either official docs or the existing codebase.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every package version verified against `package.json` + npm registry; Tailwind v4 syntax verified against official current docs.
- Architecture: HIGH — patterns verified against existing project code (`navigation.tsx`, `cn.ts`) + handoff `shared.jsx` reference.
- Pitfalls: HIGH — `_specimen` routing pitfall verified against official Next.js 16 docs (lastUpdated 2026-05-19); `@theme inline` pitfall verified against Tailwind docs + GitHub discussion.
- Validation strategy: MEDIUM — sampling rates and gate commands match Phase 8's working pattern, but no Vitest config file was located at the repo root (only listed in devDeps). Surface to planner if test infrastructure setup is required.

**Research date:** 2026-05-21
**Valid until:** 2026-06-20 (30 days — Tailwind v4 and Next.js 16 are stable mainstream releases; no fast-moving APIs in scope)
