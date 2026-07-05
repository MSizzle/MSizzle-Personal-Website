---
phase: 17
slug: infrastructure-preservation-seo-extension
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-20
---

# Phase 17 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from 17-RESEARCH.md "## Validation Architecture" and CONTEXT.md D-03.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + @testing-library/react |
| **Config file** | `vitest.config.ts` (already exists) |
| **Quick run command** | `npx vitest run src/__tests__/seo/ src/__tests__/pages/uses.test.tsx src/__tests__/pages/watching.test.tsx` |
| **Full suite command** | `npx vitest run && npm run build` |
| **Estimated runtime** | ~15-30 seconds (suite) + build |

---

## Sampling Rate

- **After every task commit:** Run quick command (Phase 17 SEO tests)
- **After every plan wave:** Run full suite command (`npx vitest run && npm run build`)
- **Before `/gsd:verify-work`:** Full suite green + build clean
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 17-sitemap | sitemap | 1 | IN-03 | — | N/A | unit | `npx vitest run src/__tests__/seo/sitemap.test.ts` | ❌ W0 | ⬜ pending |
| 17-robots | gate | 1 | IN-03 | — | N/A | unit | `npx vitest run src/__tests__/seo/robots.test.ts` | ❌ W0 | ⬜ pending |
| 17-feed | gate | 1 | IN-03 | — | N/A | unit | `npx vitest run src/__tests__/seo/feed-route.test.ts` | ⚠️ partial | ⬜ pending |
| 17-uses-meta | gate | 1 | IN-03 | — | N/A | unit | `npx vitest run src/__tests__/pages/uses.test.tsx` | ❌ W0 | ⬜ pending |
| 17-watching-meta | gate | 1 | IN-03 | — | N/A | unit | `npx vitest run src/__tests__/pages/watching.test.tsx` | ❌ W0 | ⬜ pending |
| 17-umami | gate | 1 | IN-04 | — | env-gated render (Script when env set, null when absent) | unit | `npx vitest run src/__tests__/components/analytics.test.tsx` | ❌ W0 | ⬜ pending |
| 17-build | gate | 1 | IN-03 + IN-04 | — | N/A | integration | `npm run build` | ✅ always | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/seo/sitemap.test.ts` — assert `sitemap()` output includes `/uses` + `/watching` (priority 0.6, changeFrequency monthly) plus existing static + dynamic blog/project routes
- [ ] `src/__tests__/seo/robots.test.ts` — assert `robots()` allows `/`, disallows `/specimen` and `/api/`
- [ ] `src/__tests__/pages/uses.test.tsx` — assert `/uses` exports `metadata` (canonical/OG) and renders `<Breadcrumbs>`
- [ ] `src/__tests__/pages/watching.test.tsx` — assert `/watching` exports `metadata` (canonical/OG) and renders `<Breadcrumbs>`
- [ ] `src/__tests__/components/analytics.test.tsx` — assert `UmamiAnalytics` renders `<Script>` when env vars set, returns `null` when absent
- [ ] Extend `src/__tests__/seo/feed-route.test.ts` — assert blog `feed.xml` route returns valid RSS
- [ ] Confirm `package.json` has a vitest test script and `src/__tests__/setup.ts` covers needed utilities

*All gap items are test files only — the sole production-code change is the two sitemap entries (D-04).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Umami actually records hits on the live `v3` preview | IN-04 | Requires real Umami env vars + deployed preview (Phase 18 territory) | After v3 preview deploy with env vars set, load 2-3 pages and confirm events appear in the Umami dashboard |

*Automated assertions prove the env-gated render contract; live tracking confirmation is preview-only.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
