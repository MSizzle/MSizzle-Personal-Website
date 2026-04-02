---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [nextjs, tailwind-v4, next-themes, lenis, motion, app-router, typescript]

# Dependency graph
requires: []
provides:
  - Next.js 16.2.1 App Router project scaffold
  - Tailwind CSS v4 styling pipeline
  - Dark/light theme system (next-themes, attribute="class", suppressHydrationWarning)
  - Lenis smooth scroll provider (RAF-driven)
  - Motion (LazyMotion + domAnimation) animation provider
  - AnimatePresence page transition scaffold (template.tsx)
  - Placeholder homepage with hero + scroll sections
  - Theme toggle component (sun/moon icons, system-aware)
affects: [core-pages, animation-polish, analytics, pre-launch-qa]

# Tech tracking
tech-stack:
  added: [next@16.2.1, react@19.2.4, tailwindcss@4, next-themes@0.4.6, lenis, motion@12.38.0, @tailwindcss/typography, @tailwindcss/postcss]
  patterns: [provider-wrapper architecture, LazyMotion strict mode, template.tsx for exit animations, useSyncExternalStore for hydration-safe mounting]

key-files:
  created:
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/template.tsx
    - src/app/globals.css
    - src/components/providers/theme-provider.tsx
    - src/components/providers/lenis-provider.tsx
    - src/components/providers/motion-provider.tsx
    - src/components/theme-toggle.tsx
    - next.config.ts
    - tsconfig.json
    - eslint.config.mjs
    - postcss.config.mjs
    - package.json
  modified: []

key-decisions:
  - "Next.js 16.2.1 instead of 15.2.x — works fine, newer stable"
  - "Provider hierarchy: ThemeProvider > LenisProvider > MotionProvider"
  - "LazyMotion strict mode + domAnimation feature set to prevent bundle bloat"
  - "template.tsx with AnimatePresence for page transitions (not layout.tsx)"
  - "useSyncExternalStore pattern for hydration-safe theme toggle mounting"
  - "Geist + Geist Mono fonts via next/font/google"

patterns-established:
  - "Provider wrapping: each concern gets its own client provider component in src/components/providers/"
  - "Dark mode: Tailwind class strategy via next-themes attribute='class'"
  - "Page transitions: template.tsx with motion/react AnimatePresence + m.div fade"

requirements-completed: [DSGN-01, HOME-04]

# Metrics
duration: ~30min
completed: 2026-03-31
---

# Phase 1: Foundation Summary

**Next.js 16 App Router scaffold with Tailwind v4, dark mode (next-themes), Lenis smooth scroll, and Motion page transition framework**

## Performance

- **Duration:** ~30 min (retroactive estimate)
- **Started:** 2026-03-31
- **Completed:** 2026-03-31
- **Tasks:** 1 (single commit)
- **Files modified:** 24

## Accomplishments
- Full Next.js 16.2.1 project with App Router, TypeScript, ESLint, Tailwind CSS v4
- Dark/light theme system with system detection, manual toggle, and `suppressHydrationWarning` to prevent FOUC
- Lenis smooth scroll provider with RAF loop for buttery scrolling
- LazyMotion provider (strict + domAnimation) preventing animation bundle bloat
- AnimatePresence page transition scaffold in `template.tsx` (ready for Phase 4 polish)
- Placeholder homepage with hero section and scroll test sections proving Lenis works

## Task Commits

1. **Foundation scaffold** - `4327235` (feat: scaffold Phase 1 foundation)

## Files Created/Modified
- `src/app/layout.tsx` - Root layout with provider hierarchy and font setup
- `src/app/page.tsx` - Placeholder homepage with hero + scroll test sections
- `src/app/template.tsx` - AnimatePresence wrapper for page transitions
- `src/components/providers/theme-provider.tsx` - next-themes wrapper (class strategy)
- `src/components/providers/lenis-provider.tsx` - Lenis smooth scroll with RAF
- `src/components/providers/motion-provider.tsx` - LazyMotion strict + domAnimation
- `src/components/theme-toggle.tsx` - Sun/moon toggle with hydration-safe mounting
- `src/app/globals.css` - Tailwind v4 base styles
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript paths (@/ alias)
- `eslint.config.mjs` - ESLint + Next.js rules
- `postcss.config.mjs` - PostCSS with Tailwind v4
- `package.json` - Dependencies and scripts

## Decisions Made
- Used Next.js 16.2.1 (newer than CLAUDE.md's recommended 15.2.x) — works correctly
- Provider hierarchy order: Theme > Lenis > Motion (theme must be outermost for class application)
- `useSyncExternalStore` for hydration-safe theme toggle instead of `useEffect` + `useState`
- Geist font family for both sans and mono

## Deviations from Plan
None — executed outside GSD workflow, retroactively documented.

## Issues Encountered
None documented.

## User Setup Required
- Custom domain (DSGN-06) not yet configured — requires Vercel deployment + DNS setup
- Vercel deployment not yet done

## Next Phase Readiness
- Project scaffold complete and working locally
- Provider architecture in place for Phase 2 (Notion CMS) and Phase 4 (animations)
- DSGN-06 (custom domain) deferred — needs Vercel deployment

---
*Phase: 01-foundation*
*Completed: 2026-03-31*
