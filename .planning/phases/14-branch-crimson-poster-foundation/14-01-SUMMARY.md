---
phase: 14-branch-crimson-poster-foundation
plan: "01"
subsystem: design-foundation
tags: [v3, crimson-poster, theme-tokens, fonts, globals-css, layout]
dependency_graph:
  requires: []
  provides:
    - Crimson Poster @theme inline tokens (bg/accent/text/border palette)
    - .sig / .sig-out display shadow utilities
    - @keyframes scroll for Marquee component
    - Space Grotesk + JetBrains Mono via next/font as CSS variables
    - v3 branch verified with main as ancestor
    - Production alias baseline documented for Phase 18 swap
  affects:
    - All routes (body bg/text color changed from bg-background to bg-bg/text-text)
    - Any component consuming the old warm-paper tokens (bg-paper, text-ink, border-rule)
tech_stack:
  added: []
  removed: [next-themes@0.4.6]
  patterns:
    - "@theme inline token-as-utility (Tailwind v4)"
    - "next/font/google for Space_Grotesk + JetBrains_Mono"
    - ".sig/.sig-out CSS utility classes in globals.css"
key_files:
  created:
    - .planning/phases/14-branch-crimson-poster-foundation/14-DEPLOY-BASELINE.md
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - package.json
    - package-lock.json
decisions:
  - "Retain v2 editorial type-scale token names (--text-label, --text-meta, --text-nav, etc.) were NOT kept -- entire v2 @theme type-scale block replaced with v3 simplified scale (xs/sm/base/lg/xl/2xl/3xl/mega)"
  - "Sig vars (--sig, --sig-shadow) declared in :root block outside @theme inline to avoid @theme resolution order issues; uses literal hex #0a0503 for shadow to sidestep any token-reference lag"
  - "next-themes dependency removed from package.json -- confirmed not imported anywhere in src/ (PATTERNS.md correction to stale context)"
  - "Production alias target captured via CLI: montysinger.com -> m-sizzle-personal-website-557xchofb-msizzles-projects.vercel.app (dpl_hYFx6kswh3iGuNb5iWFxuM9QByyW, 2026-06-05)"
metrics:
  duration: "~15 minutes"
  completed: "2026-06-18T23:52:09Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 1
  files_modified: 4
---

# Phase 14 Plan 01: v3 Branch + Crimson Poster Foundation Summary

**One-liner:** v3 branch verified, production alias captured, globals.css fully reskinned to Crimson Poster (#d93c1e canvas, #0a0503 black accent), Space Grotesk + JetBrains Mono wired via next/font, .sig/.sig-out display utilities added, next-themes dependency removed.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create v3 branch and record deploy baseline | a612e4b | .planning/.../14-DEPLOY-BASELINE.md |
| 2 | Replace globals.css with Crimson Poster theme + sig utility | 8b52cdb | src/app/globals.css |
| 3 | Swap fonts to Space Grotesk + JetBrains Mono and recolor body | a66c69b | src/app/layout.tsx, package.json |

## Must-Have Truths Verification

- [x] A long-lived v3 git branch exists, created from claude/phase-8-resume, with main as a verified ancestor (`git merge-base --is-ancestor main v3` exits 0)
- [x] The current production alias target is recorded: `montysinger.com` -> `m-sizzle-personal-website-557xchofb-msizzles-projects.vercel.app` (Phase 18 swap target is unambiguous)
- [x] globals.css renders the Crimson Poster palette: canvas #d93c1e, accent black #0a0503, ink #120604, no gradients
- [x] Display headings can be lifted by a hard black drop shadow via reusable `.sig` utility; `.sig-out` outline variant exists
- [x] Space Grotesk (display) and JetBrains Mono (mono) load via next/font/google as CSS variables on a defined @theme type scale
- [x] The v2 warm-paper palette, second :root block, .section-inverted block, and v1 compat aliases are gone

## Artifacts Verification

| Artifact | Check | Status |
|----------|-------|--------|
| src/app/globals.css | Contains `--color-bg: #d93c1e` | PASS |
| src/app/globals.css | Contains `.sig` with `text-shadow: var(--sig-shadow)` | PASS |
| src/app/globals.css | Contains `.sig-out` with `-webkit-text-stroke` | PASS |
| src/app/globals.css | Contains `@keyframes scroll` | PASS |
| src/app/globals.css | Contains `--font-display: var(--font-space-grotesk)` | PASS |
| src/app/globals.css | Contains `--font-mono: var(--font-jetbrains-mono)` | PASS |
| src/app/globals.css | No `section-inverted` (removed) | PASS |
| src/app/globals.css | No `--color-paper` (removed) | PASS |
| src/app/globals.css | No `color-background\|color-foreground` aliases (removed) | PASS |
| src/app/globals.css | No `@import url(` fonts.googleapis (not present) | PASS |
| src/app/globals.css | No gradient syntax | PASS |
| src/app/layout.tsx | Imports `Space_Grotesk` and `JetBrains_Mono` | PASS |
| src/app/layout.tsx | Does not import or reference `Inter` | PASS |
| src/app/layout.tsx | Space Grotesk config: `weight: ["400", "500", "700"]` | PASS |
| src/app/layout.tsx | Composes both font variables on `<html>` | PASS |
| src/app/layout.tsx | Body uses `bg-bg text-text` | PASS |
| package.json | `next-themes` not present | PASS |
| 14-DEPLOY-BASELINE.md | Contains "NEVER use --prebuilt --prod" | PASS |
| 14-DEPLOY-BASELINE.md | Records montysinger.com alias target | PASS |

## Production Alias Baseline

**Captured 2026-06-18 via `npx vercel inspect`:**
- `montysinger.com` -> `https://m-sizzle-personal-website-557xchofb-msizzles-projects.vercel.app`
- Vercel deployment ID: `dpl_hYFx6kswh3iGuNb5iWFxuM9QByyW` (deployed 2026-06-05)
- To re-confirm before Phase 18 swap: `npx vercel alias ls | grep montysinger`

No production deploy was performed in this plan. Production remains on the v2 editorial site until Phase 18 QA GO.

## Deviations from Plan

None -- plan executed exactly as written.

The following observations are worth noting (not deviations, just clarifications):

1. **v2 editorial type scale dropped entirely:** The plan called for removing the v2 type scale and adding the v3 scale. The v2 scale included tokens like `--text-display`, `--text-page-title`, `--text-feature`, `--text-caption`, `--text-nav`, `--text-label`, `--text-meta`, `--text-list-title`, etc. These are consumed by v2 components that remain in place until Phase 16. The v3 type scale (xs/sm/base/lg/xl/2xl/3xl/mega) replaces them. This is expected breakage that Plan 04 (build gate) will confirm does not crash the build.

2. **--sig-shadow uses literal hex:** Per the plan's guidance, the `--sig-shadow` value uses literal `#0a0503` rather than `var(--accent)` to avoid `@theme`/:root resolution-order issues. The `--sig` and `--sig-shadow` vars are declared in a `:root` block outside `@theme inline`.

## Known Stubs

None -- all tokens and utilities are complete and functional.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. All changes are static CSS/font configuration. No threat flags.

## Self-Check

- [x] `.planning/phases/14-branch-crimson-poster-foundation/14-DEPLOY-BASELINE.md` exists
- [x] `src/app/globals.css` modified (100 insertions, 132 deletions)
- [x] `src/app/layout.tsx` modified (14 insertions, 18 deletions)
- [x] `package.json` modified (next-themes removed)
- [x] Commits exist: a612e4b, 8b52cdb, a66c69b

## Self-Check: PASSED
