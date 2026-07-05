---
phase: 14-branch-crimson-poster-foundation
plan: "04"
subsystem: v3-showcase
tags: [showcase, build-gate, crimson-poster, DS-01, DS-02, DS-03, DS-04, DS-05, DQ-01]
dependency_graph:
  requires: ["14-01", "14-02", "14-03"]
  provides: ["DQ-01", "v3-specimen route"]
  affects: ["15-*", "16-*"]
tech_stack:
  added: []
  patterns:
    - "Next.js App Router static page with metadata robots noindex/nofollow"
    - "Server component page importing client components (Marquee, Reveal) directly"
    - "1px-gap grid container for Card cells (gap-px bg-border)"
key_files:
  created:
    - src/app/v3-specimen/page.tsx
  modified: []
decisions:
  - "Showcase is a server component page that imports client components (Marquee, Reveal) directly -- App Router permits this; the client boundary is contained in those leaf components"
  - "No vercel deploy --prod executed -- build gate is local next build only (T-14-07 mitigation, D-02)"
  - "Task 2 produced no file changes -- verification was the deliverable; build exit 0 and route presence confirmed"
metrics:
  duration: "15 minutes"
  completed: "2026-06-18"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 0
---

# Phase 14 Plan 04: v3 Showcase + Build Gate Summary

Crimson Poster showcase route `/v3-specimen` rendering all 14 primitives + tokens + type scale, plus a clean `next build` proving DQ-01 foundation readiness.

## What Was Built

### /v3-specimen Route

`src/app/v3-specimen/page.tsx` -- server component page with three sections:

**01 — Palette:** 9 swatches for every Crimson Poster token (bg #d93c1e, bg-2 #c8341a, surface #cc3719, accent #0a0503, text #120604, text-dim, text-muted, border, border-strong) with hex and role captions.

**02 — Type Scale:** text-xs through text-mega rendered in `font-display font-bold uppercase`, each labeled with its CSS size value. DS-02 demonstrated with an explicit `.sig` sample ("Monty Singer" crimson fill + drop shadow) and a `.sig-out` sample (outline stroke, transparent fill).

**03 — Primitives (PRIM-01..PRIM-14):**

| PRIM | Component | Notes |
|------|-----------|-------|
| 01 | Rule | hairline divider |
| 02 | RuleStrong | 2px bold separator |
| 03 | SectionLabel | mono uppercase with numeral |
| 04 | Chip | four variants |
| 05 | ListRow | default + big variant |
| 06 | Button | default + accent variant |
| 07 | BigList | three items, one with outline: true |
| 08 | PageHero | normal + outline variant (DS-02) |
| 09 | Marquee | DS-05 reduced-motion honored |
| 10 | Card | three cards in 1px-gap grid container |
| 11 | VideoCard | two cards in auto-fill grid |
| 12 | NewsletterCarousel | four issues (mix of href/no-href) |
| 13 | UsesList | two groups (Computer, Software) |
| 14 | Reveal | wraps sample block, delay=0.1 |

All 14 primitives imported from `@/components/v3/*`.

### Build Gate (DQ-01)

`npm run build` (Next.js 16.2.1, Turbopack) exited 0.

`/v3-specimen` appears in the build output as a static route:

```
├ ○ /v3-specimen
```

43 pages generated successfully with no errors.

### Reduced-Motion Contract (DS-05)

Both animated components confirmed to contain `useReducedMotion`:
- `src/components/v3/marquee.tsx` -- `useReducedMotion()` omits animation class; content remains visible
- `src/components/v3/reveal.tsx` -- `useReducedMotion()` returns static `<div>` with no initial hidden state

### Preview Deploy Command

The developer can publish the v3 branch to a Vercel preview URL with:

```bash
vercel deploy
```

Run from the repo root while authenticated (`vercel whoami`). This creates a preview URL (e.g. `https://msizzle-website-git-v3-montysinger.vercel.app`) without touching the production alias. Do NOT use `vercel deploy --prod` or `vercel --prebuilt --prod` -- production alias remains on the v2 build until Phase 18 (D-02).

---

## Deviations from Plan

None -- plan executed exactly as written. The build gate passed on the first run with no errors in the foundation or primitives.

---

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. The `/v3-specimen` route is a static page with `robots: { index: false, follow: false }` metadata (T-14-08 mitigated). No `vercel deploy --prod` executed (T-14-07 mitigated). Build failures would block phase completion (T-14-09 -- build passed cleanly).

---

## Self-Check: PASSED

Files created:
- [x] `src/app/v3-specimen/page.tsx` -- exists

Commits:
- 06a7981 -- feat(14-04): add /v3-specimen showcase route (noindex)

Verification gates passed:
- [x] 14 v3 primitive imports confirmed (`grep -c '@/components/v3/'` = 14)
- [x] robots metadata present in page.tsx
- [x] `npx tsc --noEmit` exits 0
- [x] `npm run build` exits 0
- [x] `/v3-specimen` present in build route output as static (○)
- [x] `useReducedMotion` confirmed in both marquee.tsx and reveal.tsx
- [x] No `vercel deploy --prod` executed
