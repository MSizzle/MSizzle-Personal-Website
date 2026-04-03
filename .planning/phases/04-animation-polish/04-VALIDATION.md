---
phase: 4
slug: animation-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `npx vitest run src/__tests__/` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/__tests__/`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 0 | DSGN-03 | unit | `npx vitest run src/__tests__/animations/template.test.tsx -t "page transition"` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 0 | DSGN-04 | unit | `npx vitest run src/__tests__/animations/scroll-reveal.test.tsx` | ❌ W0 | ⬜ pending |
| 04-01-03 | 01 | 0 | PORT-02 | unit | `npx vitest run src/__tests__/components/project-card.test.tsx` | ❌ W0 | ⬜ pending |
| 04-01-04 | 01 | 0 | HOME-03 | smoke | `npx vitest run src/__tests__/animations/gsap-setup.test.tsx` | ❌ W0 | ⬜ pending |
| 04-01-05 | 01 | 0 | HOME-04 | unit | `npx vitest run src/__tests__/providers/lenis-provider.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/animations/template.test.tsx` — stubs for DSGN-03 (page transition rendering)
- [ ] `src/__tests__/animations/scroll-reveal.test.tsx` — stubs for DSGN-04 (scroll reveal + reduced motion)
- [ ] `src/__tests__/components/project-card.test.tsx` — stubs for PORT-02 (hover/tap overlay interaction)
- [ ] `src/__tests__/animations/gsap-setup.test.tsx` — stubs for HOME-03 (GSAP plugin registration)
- [ ] `src/__tests__/providers/lenis-provider.test.tsx` — stubs for HOME-04 (Lenis init + reduced motion)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Page transitions fade+slide under 400ms | DSGN-03 | Requires real browser rendering + timing | Navigate between routes in Chrome + Safari, verify smooth fade+slide |
| Mobile scroll jank at 6x CPU throttle | HOME-03 | Requires Chrome DevTools Performance panel | Enable 6x CPU throttle, scroll homepage, verify no frames below 30fps |
| Reduced motion suppression | DSGN-04 | Requires macOS Accessibility settings toggle | Enable "Reduce Motion" in System Settings > Accessibility, verify all animations suppressed |
| Lenis + GSAP scroll sync | HOME-04 | Requires visual verification of scroll behavior | Scroll homepage with ScrollTrigger sequences, verify no snap/desync |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
