---
phase: 10
slug: editorial-homepage
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-05-21
---

# Phase 10 — Validation Strategy

> The editorial homepage rebuild. 7 chained-serial plans + 1 manifesto interaction. Validation = build exits 0 after each plan + visual confirmation that each section renders + Notion getters resolve. Manifesto interaction discharged via HUMAN-UAT (perceptual). Phase 8/9 preservation tests still cover Lenis/template/scroll-reveal.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + @testing-library/react 16.3.2 + jsdom 29.0.1 |
| **Config file** | `vitest.config.ts` |
| **Per-task build gate** | `npm run build` (Next.js Turbopack — exit 0 catches TS + Tailwind utility errors + missing imports) |
| **Phase production gate** | `vercel build --prod` via Vercel preview deploy on branch push (Phase 8/9 precedent — sandbox node_modules corruption documented) |
| **Estimated runtime** | ~30–60s `npm run build`; ~120s Vercel preview |

---

## Sampling Rate

- **After every task commit:** `npm run build` exits 0 (D-39)
- **After every plan:** visual smoke at `/` via `npm run dev` to confirm the section just added renders correctly
- **After Plan 10-01:** explicit check that `/` does NOT double-render nav or footer (D-42 gate verification)
- **Phase gate (after Plan 10-07):** Vercel preview deploy must show `● Ready` (D-40)
- **Preservation regression:** Phase 8 + 9 preservation tests (`template.test.tsx`, `scroll-reveal.test.tsx`, `lenis-provider.test.tsx`) still pass — Phase 10 doesn't touch those files

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 10-01-V0 | 01 | 1 | D-42 chrome gate | grep + visual | `rg "usePathname" src/components/nav/navigation.tsx src/components/footer.tsx` returns ≥2 hits AND visiting `/` shows no v1.0 chrome | ⬜ |
| 10-01-V1 | 01 | 1 | HOME-V2-01..04 | build + grep + visual | `npm run build` exit 0 AND `rg "text-display" src/app/page.tsx` ≥1 hit AND `rg "BRING FIRE" src/app/page.tsx` ≥1 hit AND `rg "Photographed on film" src/app/page.tsx` ≥1 hit | ⬜ |
| 10-02-V | 02 | 2 | HOME-V2-05, HOME-V2-06 | build + grep | `npm run build` exit 0 AND `rg "IntroLink" src/app/page.tsx` ≥3 hits AND `rg "Prometheus" src/app/page.tsx` ≥1 hit (the BUILDING row title) | ⬜ |
| 10-03-V | 03 | 3 | HOME-V2-07, HOME-V2-08 | build + grep + file | `npm run build` exit 0 AND `rg "ListRow" src/app/page.tsx` ≥3 hits AND `test -f src/lib/dates.ts` AND `rg "post.description" src/app/page.tsx` ≥1 hit AND `rg "event.name" src/app/page.tsx` ≥1 hit | ⬜ |
| 10-04-V | 04 | 4 | HOME-V2-09 | build + grep | `npm run build` exit 0 AND `rg "col-span-7" src/app/page.tsx` ≥2 hits AND `rg "mix-blend-difference" src/app/page.tsx` ≥1 hit AND `rg "000092530012" src/app/page.tsx` ≥1 hit | ⬜ |
| 10-05-V | 05 | 5 | HOME-V2-10, HOME-V2-11 | build + grep | `npm run build` exit 0 AND `rg "FooterCol" src/app/page.tsx` ≥3 hits AND `rg "A calling card, not a billboard" src/app/page.tsx` ≥1 hit AND `rg "bg-footer-bg" src/app/page.tsx` ≥1 hit | ⬜ |
| 10-06-V | 06 | 6 | HOME-V2-12 | build + grep + visual | `npm run build` exit 0 AND `rg "md:" src/app/page.tsx` ≥10 hits (mobile-first breakpoint usage) AND visual smoke at 390px width confirms single-column + 2×2 photo grid + tap targets ≥44px | ⬜ |
| 10-07-V | 07 | 7 | MOTION-07 | build + file + grep + human | `npm run build` exit 0 AND `test -f src/components/home-v2/manifesto-reveal.tsx` AND `rg "from \"motion/react\"" src/components/home-v2/manifesto-reveal.tsx` ≥1 hit AND `rg "useReducedMotion" src/components/home-v2/manifesto-reveal.tsx` ≥1 hit AND HUMAN-UAT smoke test PASS | ⬜ |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

**None.** Phase 10 is a homepage rebuild composing existing Phase 9 primitives + existing Notion data sources. No new test infrastructure needed. Preservation regression tests from Phase 8/9 cover the untouched motion budget components.

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications (HUMAN-UAT items expected at phase end)

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Manifesto letter-stagger fires once on first paint of `/` | MOTION-07 | Perceptual + browser sessionStorage semantics | First load: hard-reload `/` in incognito Chrome. Observe each letter of "BRING FIRE / TO HUMANITY." slide up from below + fade in over ~500-700ms with 18ms per-letter offset. Internal nav back to `/` after visiting another page: animation should NOT replay. New incognito tab: animation should replay (sessionStorage scoped to tab). |
| Reduced-motion fallback | MOTION-07 | OS-level setting | macOS System Settings → Accessibility → Display → "Reduce motion" ON. Hard-reload `/`. Manifesto should fade in over 300ms as full lines, no per-letter stagger. |
| Vercel build --prod | SC4 + D-40 | Sandbox node_modules corrupted (Phase 8/9 precedent) | Push branch; verify Vercel preview deploy `● Ready` status |
| Full editorial homepage visual QA | SC1, SC2, SC3, SC4 | Perceptual confirmation that all 9 sections render in handoff fidelity | Open `/` in incognito Chrome at 1440px width. Confirm: header / manifesto / meta row / epigraph photo / letter-style intro / BUILDING / WRITING / EVENTS / PHOTOGRAPHS / PERSONAL / inverted ink footer all render in handoff order. Then resize to 390px — confirm mobile parity. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (build + grep + file existence covers every HOME-V2-XX + MOTION-07)
- [ ] Sampling continuity: every plan has both grep + build assertions
- [ ] Wave 0 covers all MISSING references (none — existing infrastructure suffices)
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s (per-task build < 60s; phase Vercel build < 120s)
- [ ] `nyquist_compliant: true` set in frontmatter (set after planner finalizes plans)

**Approval:** pending
