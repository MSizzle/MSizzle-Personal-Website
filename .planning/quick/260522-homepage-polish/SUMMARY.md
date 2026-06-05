---
type: quick-summary
slug: homepage-polish
date: 2026-05-22
status: complete
commits:
  - d0dae48
  - e744657
  - 930271d
  - 8b7b3a1
  - fe05368
  - 52a886d
branch: claude/phase-8-resume
---

# Homepage Polish — Summary

User-driven post-v2.0 polish pass: six edits bundled into one quick task. Reported issues were a duplicate nav + duplicate footer on the desktop home page, plus several copy/markup tweaks. Investigation revealed the duplicates were the v1.0 chrome (Navigation desktop block + Footer component) still rendering alongside the v2.0 chrome (EditorialHeader + inline ink footer) — Path 2 (full v2.0 chrome rollout) chosen to eliminate the dead-code design system rather than just gate it. A mobile-perf finding from PageSpeed Insights (LCP 3.8s on mobile, 611 KiB image-delivery savings) was folded in as Task F.

## Commits

| # | SHA | Description |
|---|-----|-------------|
| A | d0dae48 | refactor(chrome): unify nav + footer across all routes — EditorialHeader + InkFooter global, extract WritingSubscribeCTA, delete v1.0 Navigation desktop block + Footer |
| B | e744657 | fix(home): trim hero figcaption to 'A year in motion · 2025–26' |
| C | 930271d | feat(home): rewrite intro paragraph; add IntroLink external prop for outbound links |
| D | 8b7b3a1 | fix(home): remove No.NN overlay from photo grid; key by src |
| E | fe05368 | fix(home): Building row 1 meta — 'AI Studio' → 'AI Startup' |
| F | 52a886d | perf(cycling-photo): render only active photo on mobile — kills 5 unused image requests, drops mobile LCP |

## Files

**Created:**
- `src/components/home-v2/ink-footer.tsx`
- `src/components/home-v2/writing-subscribe-cta.tsx`

**Modified:**
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/writing/page.tsx`, `src/app/events/page.tsx`, `src/app/photos/page.tsx`
- `src/components/nav/navigation.tsx`, `src/components/main-offset.tsx`, `src/components/editorial/intro-link.tsx`
- `src/components/home-v2/cycling-photo.tsx`

**Deleted:**
- `src/components/footer.tsx`, `src/__tests__/components/footer.test.tsx`

## Verification

- `npm run build` — PASSES (43 routes, clean).
- `npm run lint` — exits 1, but all errors are pre-existing on unchanged code (cycling-photo.tsx:48 useEffect, manifesto-reveal.tsx, notion-renderer.tsx, lenis-provider.tsx, test files, about/page.tsx). No new lint errors introduced.
- All acceptance grep gates pass (see PLAN.md acceptance criteria).

## Decisions

- **Q1 (planning):** A vs. B for nav/footer cleanup → user chose A (delete v1.0 chrome, extract InkFooter to shared component).
- **Q2 (planning):** Discovered Path 2 implication during planning — v1.0 desktop nav was the only desktop nav for `/about`, `/blog/*`, `/links`, `/newsletter`, `/projects`. User chose Path 2 (full v2.0 chrome rollout) over Path 1 (just harden the home gate).
- **Q3 (mid-execution):** Mobile-perf fix folded into this quick task (Task F) rather than splitting into a separate one.
- **Q4 (mid-execution):** `/writing` Substack subscribe CTA preserved via extraction to its own component (`WritingSubscribeCTA`) — rendered inline on `/writing` above the global InkFooter.

## Post-deploy verification needed

After Vercel deploys these commits, run PageSpeed Insights (mobile) against the deployed homepage:
- Expect LCP to drop from 3.8s toward ~2.0s.
- Expect "Improve image delivery" audit to no longer flag the 5 unused hero photos (~611 KiB).
- If LCP stays >2.5s, file a follow-up to investigate font loading or JS hydration cost.

## Open follow-ups (not done in this task)

- **Hero epigraph numbering.** The `No. NN` overlay was removed from the Section 04 photo grid (Task D). The `CyclingPhoto` component still consumes `photos[idx].no` for an `aria-label` and a (default-off) badge. Optional follow-up: decide whether the hero epigraph should also lose its numbering for consistency. Not done here because the original instruction referenced only the grid.
- **Source image compression.** Hero source JPEGs are 139–338 KB each. Already reasonable; could halve via squoosh/sharp if more LCP headroom is needed post-Task-F.
