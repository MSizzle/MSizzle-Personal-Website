---
phase: 9
slug: design-tokens-editorial-primitives
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-05-21
---

# Phase 9 — Validation Strategy

> Foundation phase. Validation = build exits 0 + specimen page renders all tokens + 7 primitives type-check. Existing Vitest infrastructure covers preservation guards (Lenis + template + scroll-reveal still pass from Phase 8). No Wave 0 work required.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + @testing-library/react 16.3.2 + jsdom 29.0.1 |
| **Config file** | `vitest.config.ts` (verified in repo root) |
| **Quick run command** | `npm run build` (Next.js Turbopack — fastest signal for type + Tailwind utility validity) |
| **Test command** | `npx vitest run` (preservation guards from Phase 8 still apply) |
| **Production build** | `npm run build` per task + `vercel build --prod` at phase gate (via Vercel preview from branch push, same pattern Phase 8 used to discharge D-11) |
| **Estimated runtime** | ~10–30s `npm run build`; ~60–120s `vercel build --prod` |

---

## Sampling Rate

- **After every task commit:** `npm run build` exits 0 (D-18 — TypeScript catches missing tokens, missing imports, prop interface drift)
- **After Wave 1 merge:** `npm run build` + manual open of `/specimen` in `npm run dev` to confirm tokens render visually
- **Phase gate (after Plan 09-09):** `vercel build --prod` exit 0 via Vercel preview on branch push (D-19)
- **Preservation regression:** `npx vitest run src/__tests__/animations/template.test.tsx src/__tests__/animations/scroll-reveal.test.tsx src/__tests__/providers/lenis-provider.test.tsx` — these three tests still pass (Phase 8 D-12 preservation guards still hold; Phase 9 doesn't touch the files)
- **Max feedback latency:** ~30s per-task build, ~120s phase-gate

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 9-01-V | 01 | 1 | TOKEN-01, TOKEN-02, TOKEN-03 | — | `@theme` block contains all 10 color tokens + 10 typography roles (incl. `--text-caption`); `.dark` block removed; v1.0 alias bridge in place; ThemeProvider unwired; theme-toggle + theme-provider files deleted; `next-themes` package still installed | grep + build | `rg "@theme inline" src/app/globals.css` returns 1 hit AND `rg "\\.dark \\{" src/app/globals.css` returns 0 hits AND `rg "ThemeProvider" src/` returns 0 hits AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 9-02-V | 02 | 1 | PRIM-01 (Rule) | — | `src/components/editorial/rule.tsx` exports `Rule`; uses `border-rule` token; no arbitrary values | type-check + grep | `test -f src/components/editorial/rule.tsx` AND `rg "border-rule" src/components/editorial/rule.tsx` returns ≥1 hit AND `rg "border-\\[" src/components/editorial/rule.tsx` returns 0 hits AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 9-03-V | 03 | 1 | PRIM-02 (RuleStrong) | — | `src/components/editorial/rule-strong.tsx` exports `RuleStrong`; uses `border-rule-strong` token | type-check + grep | `test -f src/components/editorial/rule-strong.tsx` AND `rg "border-rule-strong" src/components/editorial/rule-strong.tsx` returns ≥1 hit AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 9-04-V | 04 | 1 | PRIM-03 (SectionLabel) | — | `src/components/editorial/section-label.tsx` exports `SectionLabel`; uses `text-label` + `text-ink` + optional right-aligned numeral | type-check + grep | `test -f src/components/editorial/section-label.tsx` AND `rg "text-label" src/components/editorial/section-label.tsx` returns ≥1 hit AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 9-05-V | 05 | 1 | PRIM-04 (ListRow + big variant) | — | `src/components/editorial/list-row.tsx` exports `ListRow` with `big?: boolean` prop; uses `cn` from `@/utils/cn`; uses `text-list-title-home`/`text-list-title` per variant | type-check + grep | `test -f src/components/editorial/list-row.tsx` AND `rg "big\\?: boolean\\|big: boolean" src/components/editorial/list-row.tsx` returns ≥1 hit AND `rg 'from "@/utils/cn"' src/components/editorial/list-row.tsx` returns ≥1 hit AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 9-06-V | 06 | 1 | PRIM-05 (AllLink) | — | `src/components/editorial/all-link.tsx` exports `AllLink`; uses `text-label` + 1px ink bottom-border + tracked uppercase | type-check + grep | `test -f src/components/editorial/all-link.tsx` AND `rg "border-ink\|border-b" src/components/editorial/all-link.tsx` returns ≥1 hit AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 9-07-V | 07 | 1 | PRIM-06 (IntroLink) | — | `src/components/editorial/intro-link.tsx` exports `IntroLink`; inline 1px ink bottom-border, no color shift on hover | type-check + grep | `test -f src/components/editorial/intro-link.tsx` AND `rg "border-b" src/components/editorial/intro-link.tsx` returns ≥1 hit AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 9-08-V | 08 | 1 | PRIM-07 (FooterCol) | — | `src/components/editorial/footer-col.tsx` exports `FooterCol`; tracked uppercase title + grey sub-line links | type-check + grep | `test -f src/components/editorial/footer-col.tsx` AND `rg "text-label\|footer-mute" src/components/editorial/footer-col.tsx` returns ≥1 hit AND `npm run build` exits 0 | ✅ | ⬜ pending |
| 9-09-V | 09 | 2 | SC1 (specimen route) | — | `src/app/specimen/page.tsx` exists (NO underscore prefix); `export const metadata = { robots: { index: false, follow: false } }`; renders all 10 swatches + all type-scale specimens + all 7 primitives; `robots.ts` disallows `/specimen`; `vercel build --prod` exits 0 | file + smoke + production build | `test -f src/app/specimen/page.tsx` AND `rg "index: false" src/app/specimen/page.tsx` returns ≥1 hit AND `rg "/specimen" src/app/robots.ts` returns ≥1 hit AND `vercel build --prod` exits 0 | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

**None.** Phase 9 is foundation creation. No new test files required because:
- Token utilities are visually verified via the specimen page (Plan 09-09)
- Primitive components are presentational and exercised by the specimen page renders
- TypeScript catches prop interface errors at build time
- Phase 8's preservation tests (template, scroll-reveal, lenis-provider) still cover the motion budget

Optional Wave 0 enhancement (deferred to Phase 10 unless plan-check requires it): Vitest unit tests for each primitive that import + render via React Testing Library, asserting on prop interface stability. The specimen page covers the integration-test layer adequately for Phase 9.

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual confirmation of palette + type scale at spec | SC1 | Specimen renders all classes; perception confirms warm-paper feel + Inter at 124px reads correctly. Automation confirms classes compile, not aesthetics. | `npm run dev`, load `http://localhost:3000/specimen` in Chrome at 1440px. Confirm: `paper` background is warm off-white (not pure white); `ink` is near-black (not pure black); muted is a warm gray; rule hairlines are visible but not heavy; 124px display text renders without font flash. |
| Inter at 124px renders without FOUT/FOIT | SC2 | Browser font-loading behavior can't be fully asserted from build logs. | Same specimen page. Open Chrome DevTools Network tab, hard-reload (Ctrl+Shift+R). Confirm Inter font request returns 200 and the 124px display sample doesn't flash from a system font to Inter. |
| Dark mode dropped — no FOUC on system-theme switch | Phase 13 QA-V2-05 carryforward | Specimen page should render the light palette regardless of OS dark mode preference. | Toggle macOS System Settings → Appearance → Dark. Reload `/specimen`. Page should still show warm-paper light palette (no system-driven dark switch). |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (grep + `npm run build` covers every TOKEN/PRIM req)
- [ ] Sampling continuity: every plan has both file-existence + build assertions
- [ ] Wave 0 covers all MISSING references (none — existing infrastructure suffices)
- [ ] No watch-mode flags (uses `vitest run`, not `vitest`)
- [ ] Feedback latency < 120s (per-task build < 30s, phase vercel build < 120s)
- [ ] `nyquist_compliant: true` set in frontmatter (set after planner finalizes plans)

**Approval:** pending
