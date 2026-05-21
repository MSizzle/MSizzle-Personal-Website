---
phase: 09-design-tokens-editorial-primitives
plan: 01
subsystem: design-tokens
tags: [tailwind-v4, design-tokens, typography, theme-provider, warm-paper-palette]
dependency_graph:
  requires: []
  provides:
    - "v2.0 warm-paper palette (10 colors) as Tailwind utilities (bg-paper, text-ink, border-rule, etc.)"
    - "v2.0 editorial type scale (11 typography roles) as Tailwind utilities (text-display, text-page-title, text-label, etc.)"
    - "v1.0 → v2.0 alias bridge keeping bg-background/text-foreground/bg-accent utilities painting v2.0 colors until Phase 12 cutover"
  affects:
    - "All downstream Phase 9 primitive plans (09-02..09-08) — every primitive composes against these tokens"
    - "All Phase 10/11/12 routes — entire site now renders with warm-paper palette (#F4F2EC) instead of v1.0 cream (#fffbfc)"
tech_stack:
  added: []
  patterns:
    - "@theme inline keyword (D-03) preserves var() indirection so :root values flow through to utilities"
    - "v1.0 alias bridge via @theme aliases (D-02) — old `bg-background` utility now resolves to --color-paper"
key_files:
  created: []
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
  deleted:
    - src/components/providers/theme-provider.tsx
    - src/components/theme-toggle.tsx
decisions:
  - "Adopted v2.0 warm-paper palette (#F4F2EC paper / #0E0E0C ink) and dropped dark-mode entirely per D-04"
  - "v1.0 alias bridge installed (D-02): existing `bg-background`/`text-foreground`/`bg-accent` utilities now resolve to v2.0 tokens, no migration sweep needed yet — Phase 12 removes the aliases"
  - "next-themes package retained in package.json (D-04 zero-cost retention) even though both consumer files deleted"
  - "`.section-inverted` CSS class kept (used by existing v1.0 pages) but hex pair flipped to v2.0 ink/paper (#0E0E0C / #F4F2EC)"
metrics:
  duration_sec: 136
  completed_date: "2026-05-21"
  task_count: 3
  files_modified_count: 2
  files_deleted_count: 2
---

# Phase 9 Plan 01: Design Tokens & Theme Unwire Summary

**One-liner:** Established v2.0 warm-paper palette + 11-role editorial type scale in Tailwind v4 `@theme inline`, dropped dark-mode wiring (`<ThemeProvider>` + 2 component files), and installed a v1.0→v2.0 alias bridge so the whole site renders with the new palette immediately.

## What Shipped

### Task 1 — Rewrite globals.css (`refactor(09-01)`, commit `1b41d7d`)
- Replaced the 8-line `@theme inline` block with a 70-line block containing:
  - 10 v2.0 palette tokens (paper, ink, muted, faint, rule, rule-strong, footer-bg/fg/mute/rule) per D-01
  - 11 typography roles with bundled `--text-X` / `--text-X--line-height` / `--text-X--letter-spacing` / `--text-X--font-weight` modifiers per D-06 + D-14a (display, page-title, feature, event-title, section-feature, list-title, list-title-home, body-lead, caption, nav, label, meta)
  - 7 v1.0 compat aliases (`--color-background` → `--color-paper`, etc.) for the cutover bridge per D-02
  - Preserved `--font-sans: var(--font-inter)` and `--font-mono: var(--font-geist-mono)`
- Updated `:root` so v1.0 names (`--bg`, `--fg`, `--border`, `--accent`, `--accent-warm`, `--gold`, `--bg-secondary`, `--fg-muted`) all hold v2.0 hex values directly — so any v1.0 CSS that still reads `var(--bg)` now paints `#F4F2EC` warm paper
- Deleted `.dark { ... }` block and `.dark .section-inverted { ... }` rule entirely (D-04)
- Updated `.section-inverted` hex values from `#2d1724`/`#fffbfc` to v2.0 `#0E0E0C`/`#F4F2EC` so any v1.0 page using the inverted band still gets the v2.0 ink/paper pair
- Preserved unchanged: `html { scroll-behavior: auto; }`, `body { font-family: var(--font-sans), … }`, `a { … }`, all `.prose` rules

### Task 2 — Unwire ThemeProvider from layout.tsx (`refactor(09-01)`, commit `6b048a5`)
- Removed `import { ThemeProvider } from "@/components/providers/theme-provider";`
- Removed the `<ThemeProvider>` wrap inside `<body>`; re-indented `<LenisProvider>` one level shallower
- Preserved Inter font loader at `weight: ["400", "700"]` (D-17 / TOKEN-03)
- Preserved `suppressHydrationWarning` on `<html>` (D-05)
- Preserved every other provider/import/metadata structure exactly

### Task 3 — Delete theme-provider.tsx + theme-toggle.tsx (`chore(09-01)`, commit `82c4166`)
- Pre-deletion verification (per CONTEXT.md "ZERO consumer call sites" claim): `rg "ThemeToggle|theme-toggle" src/` returned only the definition file; `rg "from .*theme-provider|next-themes" src/` returned only the two files being deleted. Safe to proceed.
- Deleted `src/components/providers/theme-provider.tsx`
- Deleted `src/components/theme-toggle.tsx`
- Retained `next-themes` in `package.json` per D-04 (zero cost to keep in case a future milestone restores dark mode)

## Acceptance Verification

| Check | Expected | Actual |
|-------|----------|--------|
| `rg "@theme inline" src/app/globals.css` | 1 hit | 1 |
| `rg "\.dark \{" src/app/globals.css` | 0 hits | 0 |
| `rg "--color-paper:\s*#F4F2EC" src/app/globals.css` | ≥1 | 1 |
| `rg "--color-ink:\s*#0E0E0C" src/app/globals.css` | ≥1 | 1 |
| `rg "--color-rule-strong:\s*#1A1A18" src/app/globals.css` | ≥1 | 1 |
| `rg "--text-display:\s*124px" src/app/globals.css` | ≥1 | 1 |
| `rg "--text-label" src/app/globals.css` | ≥4 | 4 |
| `rg "--text-caption:\s*13px" src/app/globals.css` (D-14a) | ≥1 | 1 |
| `rg "var\(--color-paper\)" src/app/globals.css` (alias bridge) | ≥1 | 2 |
| `rg "^\s*--bg:\s*#F4F2EC" src/app/globals.css` | ≥1 | 1 |
| `rg "ThemeProvider" src/app/layout.tsx` | 0 | 0 |
| `rg 'weight:\s*\["400",\s*"700"\]' src/app/layout.tsx` | 1 | 1 |
| `rg "suppressHydrationWarning" src/app/layout.tsx` | 1 | 1 |
| `rg "LenisProvider" src/app/layout.tsx` | ≥2 | 3 |
| `rg "MotionProvider" src/app/layout.tsx` | ≥2 | 3 |
| `test -f src/components/providers/theme-provider.tsx` | not exists | confirmed deleted |
| `test -f src/components/theme-toggle.tsx` | not exists | confirmed deleted |
| `rg "ThemeProvider\|ThemeToggle" src/` | 0 hits | 0 |
| `rg '"next-themes"' package.json` | ≥1 | 1 |
| `npm run build` | exit 0 | exit 0 (all 3 tasks) |

## Requirements Closed

- **TOKEN-01** — 10 warm-paper palette tokens defined in `@theme inline` of globals.css with the exact D-01 hex values
- **TOKEN-02** — 11 typography roles defined as Tailwind v4 utilities with bundled size/line-height/letter-spacing/weight per D-06 + D-14a
- **TOKEN-03** — Inter at weights 400/700 verified loaded in `src/app/layout.tsx` (no change required; preservation gate held)

## Deviations from Plan

None — plan executed exactly as written. All three task `<action>` blocks landed verbatim, all acceptance criteria green on first build attempt, no Rule 1/2/3 auto-fixes required.

## Alias Bridge Note (D-02)

The v1.0 alias bridge is in place in two layers:
1. **Tailwind utility layer** (`@theme inline` aliases): `--color-background`, `--color-foreground`, `--color-bg-secondary`, `--color-fg-muted`, `--color-border`, `--color-accent`, `--color-accent-warm` now point at v2.0 tokens via `var()`. So `bg-background`/`text-foreground`/`bg-accent` Tailwind utilities still resolve, painting v2.0 colors.
2. **Raw CSS variable layer** (`:root` block): `--bg`, `--fg`, `--bg-secondary`, `--fg-muted`, `--border`, `--accent`, `--accent-warm`, `--gold` now hold v2.0 hex values directly. So any inline CSS or `.prose` rule still reading `var(--bg)` paints v2.0.

The entire site now renders with the warm-paper palette (`#F4F2EC` paper / `#0E0E0C` ink) starting from commit `1b41d7d`. Phase 12 (Sub-page Restyle Sweep) is responsible for sweeping consumers off the v1.0 token names and removing both layers of the alias bridge.

## Threat Flags

None — no new network/auth/file/schema surface introduced. Foundation-only CSS + layout edits. Build gate covered V14 Configuration threats (`T-09-01-01` mitigated, `T-09-01-02` accepted per zero-consumer verification).

## Self-Check: PASSED

- File: `src/app/globals.css` — FOUND (modified, 161 lines)
- File: `src/app/layout.tsx` — FOUND (modified, 83 lines)
- File: `src/components/providers/theme-provider.tsx` — CONFIRMED DELETED
- File: `src/components/theme-toggle.tsx` — CONFIRMED DELETED
- Commit `1b41d7d` (Task 1) — FOUND in `git log`
- Commit `6b048a5` (Task 2) — FOUND in `git log`
- Commit `82c4166` (Task 3) — FOUND in `git log`
- `npm run build` — exit 0 (verified after all three tasks)
