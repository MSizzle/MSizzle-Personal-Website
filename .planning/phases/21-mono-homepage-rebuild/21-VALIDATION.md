---
phase: 21
slug: mono-homepage-rebuild
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-21
---

# Phase 21 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `21-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + `@testing-library/react` + `jsdom` |
| **Config file** | `vitest.config.ts` (repo root) — `include: ['src/**/*.test.{ts,tsx}']`, alias `@` → `src/` |
| **Quick run command** | `npx vitest run src/__tests__/home/` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~6 seconds (full suite, 199 tests, measured 2026-07-21) |

There is no `"test"` script in `package.json` — invoke `npx vitest run` directly.

**Baseline (measured on `v4-mono` 2026-07-21, before any Phase 21 work):**
`182 passed, 16 todo, 1 failed`. The single failure is
`src/__tests__/pages/projects.test.tsx:188` ("renders a title-card face instead of a cover image
when project.image is non-null"), pre-existing on `main`, out of scope for this phase. Any other
red test during Phase 21 is a real regression.

---

## Sampling Rate

- **After every task commit:** `npx vitest run src/__tests__/home/`
- **After every plan wave:** `npx vitest run` (must be baseline-equivalent: only
  `projects.test.tsx:188` red)
- **Before `/gsd-verify-work`:** Full suite green modulo the known pre-existing failure
- **Max feedback latency:** ~6 seconds

---

## Per-Task Verification Map

Task IDs are assigned by the planner. Rows below are requirement-level contracts every plan must
map its tasks onto; the planner fills `Task ID` / `Plan` / `Wave` when PLAN.md files are written.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | TBD | 0 | — | — | N/A | unit | `npx vitest run src/__tests__/home/` | ✅ | ⬜ pending |
| TBD | TBD | 1+ | HP-01 | — | N/A | unit (DOM query) | `npx vitest run src/__tests__/home/hero.test.tsx` — assert zero `img`/`Image` nodes in the hero subtree | ❌ W0 | ⬜ pending |
| TBD | TBD | 1+ | HP-01 | — | N/A | unit (`getByText`) | `npx vitest run src/__tests__/home/hero.test.tsx` — hero H1 / subtitle / meta row match UI-SPEC copy exactly | ❌ W0 | ⬜ pending |
| TBD | TBD | 1+ | HP-02 | — | N/A | unit (regex on text) | `npx vitest run src/__tests__/home/section-building.test.tsx` — every index numeral matches `/^\d{3}$/` | ⚠️ rewrite | ⬜ pending |
| TBD | TBD | 1+ | HP-02 | — | N/A | unit (markup assert) | same file — full-row invert wrapper present on each row, and reachable via `:focus-visible`, not `:hover` only | ⚠️ rewrite | ⬜ pending |
| TBD | TBD | 1+ | HP-03 | — | N/A | unit (mocked fetches) | `npx vitest run src/__tests__/home/section-writing.test.tsx` — ≤5 rows, newest-first, merged from posts + Monty Monthly | ❌ W0 | ⬜ pending |
| TBD | TBD | 1+ | HP-03 | — | N/A | unit (absence assert) | same file — no box/frame wrapper element; only the header carries a `border-bottom` | ❌ W0 | ⬜ pending |
| TBD | TBD | 1+ | HP-04 | — | N/A | unit (absence assert) | `npx vitest run src/__tests__/home/explorative-homepage.test.tsx` — `querySelectorAll('[class*="band-dark"]').length === 0` | ⚠️ rewrite (currently asserts the inverse) | ⬜ pending |
| TBD | TBD | 1+ | HP-05 | — | N/A | unit (absence assert) | same file — `queryByText(/subscribe/i)` is null in the homepage render tree (footer is not rendered by it) | ⚠️ rewrite | ⬜ pending |
| TBD | TBD | 1+ | MS-01 | — | N/A | grep (source) | `grep -c "hero-ticker\|animation: pulse\|animation: kb" src/app/globals.css` → 0 for each | N/A | ⬜ pending |
| TBD | TBD | 1+ | MS-01 | — | N/A | grep (source) | `grep -n 'querySelectorAll' src/components/home/scroll-reveals.tsx` → `.reveal` only, no `.slide` / `.shadowed` | N/A | ⬜ pending |
| TBD | TBD | 1+ | MS-01 / MS-02 | — | N/A | unit (audit) | `npx vitest run src/__tests__/home/motion-audit.test.tsx` — rendered homepage tree carries none of `.kenburns`, `.breathe`, `.slide`, `.shadowed`, `.hero-ticker`, `.statustag` | ❌ W0 | ⬜ pending |
| TBD | TBD | 1+ | MS-02 | — | N/A | grep (source) | `.reveal` in `globals.css` matches the retuned sketch values (700ms, `translateY(14px)`, sketch cubic-bezier) and `scroll-reveals.tsx` uses threshold `0.05` / rootMargin `-8%` | N/A | ⬜ pending |
| TBD | TBD | 1+ | HP-04 (regression) | — | N/A | unit | `npx vitest run src/__tests__/components/footer.test.tsx` — the site footer's `/#loves` anchor still resolves; the rebuilt Things I Love band must keep `id="loves"` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**No-accent guard (cross-cutting, MO-02 carryforward):** any homepage task may also be gated by
`grep -ri "e5411f\|--color-accent" src/components/home/ src/app/page.tsx` → 0 hits.

---

## Wave 0 Requirements

- [ ] `src/__tests__/home/hero.test.tsx` — new file; stubs for HP-01
- [ ] `src/__tests__/home/section-writing.test.tsx` — new file (final name planner's call); stubs for HP-03
- [ ] `src/__tests__/home/motion-audit.test.tsx` — new file; stubs for MS-01 / MS-02
- [ ] Rewrite `src/__tests__/home/explorative-homepage.test.tsx` — HP-04 / HP-05. **Full rewrite, not an edit:** it currently asserts that `#building` and `#writing` DO carry `.band-dark`, the exact inverse of HP-04.
- [ ] Rewrite `src/__tests__/home/section-building.test.tsx` — HP-02 (numeral format, row anatomy, invert markup)
- [ ] Delete `src/__tests__/home/section-work.test.tsx` — it imports `section-work.tsx` unmocked; leaving it behind after the component is deleted breaks module resolution for the whole suite
- [ ] Update the `RailBox` mock inside `src/__tests__/home/section-loves.test.tsx` to match the replacement header; keep the existing Pinboard / PhotoMarquee branching assertions

Framework install: not needed — Vitest, Testing Library, and jsdom are already configured.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| The fade-up reads as deliberate, not as a slow-loading page | MS-02 | Perceptual timing judgement; jsdom cannot meaningfully assert computed CSS transition timing | Load `/` in a real browser, scroll at normal reading speed, confirm each band settles before it is read |
| Swiss multi-column rows collapse gracefully at 375px rather than merely fitting | HP-02, UI-SPEC §responsive | Layout quality judgement; the sketch flags this explicitly as verify-don't-assume | Chrome DevTools at 375px, walk the full page, confirm no horizontal overflow and no orphaned column stubs |
| Mono reads as intentional rather than as a stylesheet that failed to load | HP-04 | The sketch's own stated main risk; aesthetic, not mechanical | Side-by-side against `preview-a-swiss.png` and the sketch's variant E |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all ❌ MISSING references above — the planner embedded them task-level via `tdd="true"` alongside each component rebuild rather than as a separate wave; `gsd-plan-checker` confirmed all six are present and correctly ordered
- [x] No watch-mode flags (`npx vitest run`, never bare `npx vitest`)
- [x] Feedback latency < 10s (~6s measured full suite)
- [x] `nyquist_compliant: true` set in frontmatter

`wave_0_complete` stays `false` until the Wave-0 test files actually exist on disk — that is an
execution-time flip, not a planning-time one.

**Approval:** approved 2026-07-21 (gsd-plan-checker, Nyquist checks 8a-8e all green)
