---
phase: 5
slug: analytics
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-02
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (unit tests) + manual verification (infrastructure) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/__tests__/components/umami-analytics.test.tsx` |
| **Full suite command** | `npx vitest run` |
| **Post-deploy check** | `curl -s https://analytics.msizzle.com/api/heartbeat` |
| **Estimated runtime** | ~3 seconds (unit), ~5 seconds (post-deploy curl) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/__tests__/components/umami-analytics.test.tsx`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green + manual dashboard verification
- **Max feedback latency:** 3 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01 T1 | 01 | 1 | ANLY-01 | unit (TDD) | `npx vitest run src/__tests__/components/umami-analytics.test.tsx` | ❌ W0 | ⬜ pending |
| 05-01 T2 | 01 | 1 | ANLY-04, D-11 | unit (TDD) | `npx vitest run src/__tests__/components/footer.test.tsx src/__tests__/components/project-card.test.tsx src/__tests__/pages/links.test.tsx` | ❌ W0 | ⬜ pending |
| 05-02 T1 | 02 | 2 | ANLY-01..06 | checkpoint:human-action | Manual — fork repo, create Neon DB, deploy Umami, set env vars | N/A | ⬜ pending |
| 05-02 T2 | 02 | 2 | ANLY-01..06 | checkpoint:human-verify | Manual — visit site, check dashboard for pageviews, events, geo | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/components/umami-analytics.test.tsx` — test stubs for UmamiAnalytics component (created by Plan 01 Task 1 via TDD)
- [ ] `src/__tests__/components/footer.test.tsx` — test stubs for footer data-umami-event attributes (created by Plan 01 Task 2 via TDD)
- [ ] `src/__tests__/components/project-card.test.tsx` — test stubs for project-card data-umami-event (created by Plan 01 Task 2 via TDD)
- [ ] `src/__tests__/pages/links.test.tsx` — test stubs for links page data-umami-event (created by Plan 01 Task 2 via TDD)

*All test files are created within Plan 01 tasks via TDD pattern (write test first → verify red → implement → verify green). No separate Wave 0 plan needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Pageview appears in Umami dashboard | ANLY-01 | Requires live deployed site + Umami instance | Visit any page, check dashboard within 30s |
| Real-time visitor count | ANLY-02 | Requires live traffic observation | Open dashboard real-time view while browsing site |
| Traffic source breakdown | ANLY-03 | Requires UTM params in URL | Visit with `?utm_source=test&utm_medium=test`, check sources |
| Custom event tracking | ANLY-04 | Requires click on deployed site | Click outbound link, check events log in Umami |
| Page popularity ranking | ANLY-05 | Requires multiple page visits | Visit several pages, check page ranking in dashboard |
| Geo map visualization | ANLY-06 | Requires geo data from real visit | Check world map widget in Umami dashboard |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 3s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
