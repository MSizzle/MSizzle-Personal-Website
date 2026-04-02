---
phase: 03-core-pages
plan: 01
subsystem: shared-layout
tags: [navigation, footer, design-tokens, vitest, cn-utility]
dependency_graph:
  requires: []
  provides: [shared-nav-footer, design-tokens, cn-utility, vitest-infrastructure, wave-0-test-stubs]
  affects: [03-02, 03-03, 03-04, 03-05, 03-06]
tech_stack:
  added: [clsx, tailwind-merge, lucide-react, vitest, @vitejs/plugin-react, jsdom, @testing-library/react, @testing-library/dom, @testing-library/jest-dom]
  patterns: [shared-layout-shell, design-token-system, wave-0-test-stubs]
key_files:
  created:
    - src/utils/cn.ts
    - src/components/nav/navigation.tsx
    - src/components/footer.tsx
    - vitest.config.ts
    - src/__tests__/setup.ts
    - src/__tests__/pages/home.test.tsx
    - src/__tests__/pages/projects.test.tsx
    - src/__tests__/pages/blog.test.tsx
    - src/__tests__/pages/about.test.tsx
    - src/__tests__/pages/links.test.tsx
    - src/__tests__/pages/og-image.test.tsx
    - .env.example
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/blog/page.tsx
    - src/app/blog/[slug]/page.tsx
    - package.json
decisions:
  - "Used inline SVGs for brand icons (X/Twitter, LinkedIn, GitHub) because lucide-react v4 removed brand icons — Mail kept from lucide-react as it is a generic icon"
  - "Used X as CloseIcon alias in Navigation to avoid naming conflict with footer X (Twitter) icon"
  - "Added Notion API guard (env var check + try-catch) to blog pages — pre-existing missing error handling fixed as Rule 2 deviation"
metrics:
  duration_seconds: 236
  completed_date: "2026-04-02"
  tasks_completed: 2
  tasks_total: 2
  files_created: 13
  files_modified: 5
---

# Phase 03 Plan 01: Shared Layout Shell, Design Tokens, Vitest Infrastructure Summary

**One-liner:** Fixed navigation with mobile hamburger and theme toggle, footer with social links, extended design token system, cn() utility, and vitest wave-0 test stubs — all wired into root layout.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Install deps, design tokens, cn() utility, vitest, Wave 0 test stubs | fb87e76 | src/utils/cn.ts, src/app/globals.css, vitest.config.ts, src/__tests__/setup.ts, 6 test stubs |
| 2 | Create Navigation and Footer, wire into root layout | 71ce198 | src/components/nav/navigation.tsx, src/components/footer.tsx, src/app/layout.tsx |

## What Was Built

**Navigation component** (`src/components/nav/navigation.tsx`):
- Fixed top header with z-50, backdrop blur, border
- 5 nav links: Home, Projects, Blog, About, Links
- Active route highlighting via `usePathname()` + accent color underline
- ThemeToggle integrated in right side
- WCAG-compliant hamburger button (44x44px touch target)
- Full-screen mobile drawer with 48px-min-height link rows
- `aria-label` toggling between "Open navigation menu" and "Close navigation menu"

**Footer component** (`src/components/footer.tsx`):
- Social links: Email (lucide Mail), Twitter/X (inline SVG), LinkedIn (inline SVG), GitHub (inline SVG)
- `aria-label` on every icon link for accessibility
- Copyright with dynamic year
- `bg-[var(--bg-secondary)]` background for visual separation

**Design tokens** (`src/app/globals.css`):
- Added `--bg-secondary`, `--fg-muted`, `--border`, `--accent` to both `:root` and `.dark`
- Extended `@theme inline` block to expose all 6 tokens to Tailwind
- Added `overflow-x: hidden` to body (prevents horizontal overflow, per DSGN-02)

**cn() utility** (`src/utils/cn.ts`): clsx + tailwind-merge merger, importable from `@/utils/cn`.

**Vitest infrastructure** (`vitest.config.ts`, `src/__tests__/setup.ts`): jsdom environment, jest-dom matchers, `@` alias to `./src`.

**Wave 0 test stubs**: 6 files under `src/__tests__/pages/` with `.todo` stubs — all pass as skipped (0 failures).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] lucide-react v4 removed brand icons (Twitter, GitHub, LinkedIn)**
- **Found during:** Task 2 build verification
- **Issue:** lucide-react no longer exports `Twitter`, `Linkedin`, or `Github` icons — build failed with "Export Twitter doesn't exist"
- **Fix:** Used inline SVGs for brand icons (X/Twitter, LinkedIn, GitHub); kept `Mail` from lucide-react as it's generic
- **Files modified:** `src/components/footer.tsx`
- **Commit:** 71ce198

**2. [Rule 2 - Missing Error Handling] Blog pages crash at build time without Notion env vars**
- **Found during:** Task 2 build verification — `npx next build` failed on `/blog/[slug]`
- **Issue:** `generateStaticParams()` called `getPublishedPosts()` unconditionally, which throws when `NOTION_TOKEN`/`NOTION_DATABASE_ID` are absent
- **Fix:** Added env var guard + try-catch to `generateStaticParams()` (returns `[]`); added same guard to `BlogPage` component
- **Files modified:** `src/app/blog/[slug]/page.tsx`, `src/app/blog/page.tsx`
- **Commit:** 71ce198

## Known Stubs

None — all components are fully wired. Test stubs are intentional Wave 0 placeholders per plan.

## Self-Check: PASSED

Files verified:
- FOUND: src/utils/cn.ts
- FOUND: src/components/nav/navigation.tsx
- FOUND: src/components/footer.tsx
- FOUND: vitest.config.ts
- FOUND: src/__tests__/setup.ts
- FOUND: src/__tests__/pages/home.test.tsx
- FOUND: src/__tests__/pages/blog.test.tsx
- FOUND: src/__tests__/pages/about.test.tsx
- FOUND: src/__tests__/pages/links.test.tsx
- FOUND: src/__tests__/pages/og-image.test.tsx
- FOUND: .env.example

Commits verified:
- fb87e76: feat(03-01): install deps, add design tokens, cn() utility, vitest, Wave 0 test stubs
- 71ce198: feat(03-01): add Navigation and Footer components, wire into root layout
