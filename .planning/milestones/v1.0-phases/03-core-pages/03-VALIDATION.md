---
phase: 3
slug: core-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (Wave 0 installs) |
| **Config file** | vitest.config.ts (Wave 0 creates) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 0 | INFRA | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | HOME-01, HOME-02 | integration | `npx vitest run src/__tests__/pages/home.test.tsx` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 1 | PORT-01, PORT-03 | integration | `npx vitest run src/__tests__/pages/projects.test.tsx` | ❌ W0 | ⬜ pending |
| 03-04-01 | 04 | 1 | BLOG-03, BLOG-04 | integration | `npx vitest run src/__tests__/pages/blog.test.tsx` | ❌ W0 | ⬜ pending |
| 03-05-01 | 05 | 1 | ABOUT-01 | integration | `npx vitest run src/__tests__/pages/about.test.tsx` | ❌ W0 | ⬜ pending |
| 03-06-01 | 06 | 1 | SOC-01 thru SOC-05 | integration | `npx vitest run src/__tests__/pages/links.test.tsx` | ❌ W0 | ⬜ pending |
| 03-07-01 | 07 | 2 | DSGN-02 | e2e | `curl -s localhost:3000/sitemap.xml` | ❌ W0 | ⬜ pending |
| 03-08-01 | 08 | 2 | DSGN-05 | visual | `npx vitest run src/__tests__/og-image.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Install vitest, @vitejs/plugin-react, jsdom, @testing-library/react, @testing-library/jest-dom
- [ ] Create `vitest.config.ts` with jsdom environment
- [ ] Create test directory structure: `src/__tests__/pages/`
- [ ] Create test stubs for all page routes
- [ ] Install `clsx` + `tailwind-merge` (only new runtime deps)

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mobile layout at 375px | DSGN-02 | Visual check for overflow/overlap | Open each route in Chrome DevTools at 375px width, verify no horizontal scroll |
| OG image social preview | DSGN-05 | Requires external card validator | Paste blog URL into Twitter Card Validator, verify image renders |
| Tag filtering without reload | BLOG-04 | Client-side interaction | Click tag buttons on /blog, verify URL params update and posts filter without full page reload |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
