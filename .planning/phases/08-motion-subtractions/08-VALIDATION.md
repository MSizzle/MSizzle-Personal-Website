---
phase: 8
slug: motion-subtractions
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-05-20
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Pure-subtraction phase — every requirement validates via grep-absence + production build, with file-hash + unit-test preservation guards for MOTION-08.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 (jsdom env; setupFiles `./src/__tests__/setup.ts`; `@` → `./src`) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run` (project has no quick vs. full split) |
| **Production build** | `npm run build` (per-plan gate) + `vercel build --prod` (phase gate, D-11) |
| **Estimated runtime** | ~15s vitest · ~30–60s next build · ~60–120s vercel build |

> Note: `package.json` currently has no `"test"` script. The canonical command is `npx vitest run`. Adding `"test": "vitest run"` is OPTIONAL; do NOT change it in Phase 8 unless a task explicitly requires it (out of scope — would be a tooling change, not a motion subtraction).

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (D-10 — production-mode build catches missing-import/missing-prop TS errors)
- **After every plan wave:** Run `npm run build` + `npx vitest run` (confirms preservation-target tests still green)
- **Before `/gsd:verify-work`:** Full suite green + `vercel build --prod` exit 0
- **Max feedback latency:** ~60s per-task (build), ~120s phase-gate (vercel build)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 8-01-V | 01 | 1 | MOTION-01 | — | PhotoCarousel + getCarouselPhotos + fs/path imports fully removed; build passes | grep-absence + build | `rg "PhotoCarousel\|photo-carousel\|getCarouselPhotos" -g '!.claude/**' -g '!node_modules/**'` returns 0 hits AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 8-02-V | 02 | 1 | MOTION-02 | — | RotatingTagline + all imports removed; build passes | grep-absence + build | `rg "RotatingTagline\|rotating-tagline" -g '!.claude/**' -g '!node_modules/**'` returns 0 hits AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 8-03-V | 03 | 1 | MOTION-03 | — | WorksCarousel + all imports removed; build passes | grep-absence + build | `rg "WorksCarousel\|works-carousel" -g '!.claude/**' -g '!node_modules/**'` returns 0 hits AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 8-04-V | 04 | 1 | MOTION-04 | — | WritingsCarousel + all imports removed; orphan `@keyframes scroll-left` + utility classes purged from `src/app/globals.css`; build passes | grep-absence + build | `rg "WritingsCarousel\|writings-carousel\|@keyframes scroll-left\|animate-scroll-left" -g '!.claude/**' -g '!node_modules/**'` returns 0 hits AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 8-05-V | 05 | 1 | MOTION-05 | — | No always-on Tailwind animation classes anywhere in src/; `FeaturedUpcoming` renders without pulsing ring | grep-absence + DOM test | `rg "animate-(ping\|pulse\|bounce\|spin)" -g '!.claude/**' -g '!node_modules/**' src/` returns 0 hits | ✅ | ⬜ pending |
| 8-06-V | 06 | 1 | MOTION-06 | — | All accumulator-style `delay=` arguments removed from `src/app/page.tsx`, `src/app/events/page.tsx`, and from `UpcomingMini` / `PastEventCard` prop signatures in `src/components/events/event-cards.tsx`; build passes | grep-absence + TS build | `rg "delay=\{?\d?\.\d+\s*\+\s*i\s*\*" -g '!.claude/**' -g '!node_modules/**' src/` returns 0 hits AND `npm run build` exits 0 (TS catches stale prop usage) | ✅ | ⬜ pending |
| 8-07-V | 07 | 2 | MOTION-08 | — | Lenis provider, `src/app/template.tsx`, and `src/components/animations/scroll-reveal.tsx` are byte-identical to pre-phase HEAD; their existing tests still green | file-hash + unit tests | `git diff main -- src/components/providers/lenis-provider.tsx src/app/template.tsx src/components/animations/scroll-reveal.tsx` reports no changes AND `npx vitest run src/__tests__/animations/template.test.tsx src/__tests__/animations/scroll-reveal.test.tsx src/__tests__/providers/lenis-provider.test.tsx` passes | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

**None.** Existing test infrastructure covers every preservation guard:
- `src/__tests__/animations/template.test.tsx` — covers MOTION-08 page-fade preservation
- `src/__tests__/animations/scroll-reveal.test.tsx` — covers `ScrollReveal` (the no-op `<div>` wrapper that survives this phase)
- `src/__tests__/providers/lenis-provider.test.tsx` — covers MOTION-08 Lenis preservation

No new test files need to be authored. No fixture work needed.

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual confirmation of clean homepage | All MOTION-XX | Production-rendered DOM is the canonical signal — automated checks confirm absence of class strings, not perceived motion. Cheap to eyeball after build. | After `npm run dev`, load `/` in Chrome incognito at 1440px and 390px viewports. Assert: no auto-scrolling photo strip, no rotating tagline text, no hover-scroll on Writings/Works headings, no pulsing red dot beside "Upcoming" on the featured event card. Page-load fade and Lenis-smoothed scroll both feel intact. |
| `vercel build --prod` exits 0 (D-11) | Phase gate | Vercel's production build can differ from local `next build` in chunk splitting and env handling — must run the real production gate before claiming the phase done. | `vercel build --prod` from project root. Exit code 0 with no errors. Save output to phase verification log. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (grep-absence + `npm run build` covers every MOTION-XX)
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (every plan has both)
- [ ] Wave 0 covers all MISSING references (none — existing tests cover preservation)
- [ ] No watch-mode flags (uses `vitest run`, not `vitest`)
- [ ] Feedback latency < 120s (per-task build < 60s, phase vercel build < 120s)
- [ ] `nyquist_compliant: true` set in frontmatter (set after planner finalizes plans)

**Approval:** pending
