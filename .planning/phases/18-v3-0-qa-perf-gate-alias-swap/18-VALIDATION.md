---
phase: 18
slug: v3-0-qa-perf-gate-alias-swap
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-20
---

# Phase 18 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Phase 18 is a VERIFICATION + SHIP phase — its "tests" are gate measurements
> (build exit code, Lighthouse/PSI scores, LCP-element diagnostic, secret-scan
> grep, post-promote curl), not a unit-test suite. The validation map below is
> framed in those terms.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (gate measurements via CLI/browser, not a unit runner). vitest is known-broken (`@rolldown/binding-darwin-arm64`) and explicitly out of scope per CONTEXT.md D-11. |
| **Config file** | none — gates run ad-hoc per plan |
| **Quick run command** | `vercel build --prod` (the production-readiness gate, DQ-02) |
| **Full suite command** | `vercel build --prod` + Lighthouse desktop median-of-3 + PSI mobile (browser) + D-14 secret-scan grep |
| **Estimated runtime** | build ~2 min; Lighthouse ~3 min; PSI manual; secret-scan <10 s |

---

## Sampling Rate

- **After every task commit:** Re-confirm the relevant gate artifact exists and records a value (build log / Lighthouse JSON / PSI screenshot / EVIDENCE.md row).
- **After every plan wave:** Confirm the consolidated `18-GO-NO-GO.md` table reflects the latest gate verdicts.
- **Before `/gsd:verify-work`:** Build gate green, PSI mobile ≥ 82 (hard floor 77), LCP confirmed = text/poster (not canvas), secret-scan 0 client leaks.
- **Max feedback latency:** ~5 min (a single `vercel build --prod` run).

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 18-01-01 | 01 | 1 | DQ-02 | — | N/A | gate | `vercel build --prod` exits 0; 0 TS/ESLint/429 errors | ❌ W0 | ⬜ pending |
| 18-02-01 | 02 | 1 | DQ-03 | — | N/A | gate | Lighthouse desktop median-of-3 ≥ thresholds on named routes (preview URL) | ❌ W0 | ⬜ pending |
| 18-03-01 | 03 | 2 | DQ-03 | — | N/A | gate | PSI mobile homepage ≥ 82 (hard ≥ 77) on preview URL | ❌ W0 | ⬜ pending |
| 18-03-02 | 03 | 2 | DQ-03 | — | LCP element = SSR'd `<h1>`/poster, NEVER `<canvas>`; mobile served poster; `fetchPriority="high"` set | gate | PSI/Lighthouse LCP-element diagnostic + source assertion on hero loader | ❌ W0 | ⬜ pending |
| 18-04-01 | 04 | 2 | DQ-03 | — | N/A | manual | 375px walk: homepage poster path + interior + /uses + /watching; Phase-16 4-item checklist | N/A | ⬜ pending |
| 18-05-01 | 05 | 2 | DQ-02 | — | No `secret_`/`NOTION_TOKEN` in client chunks (dual-tree) | gate | D-14 grep over `.next/static/chunks/` AND `.vercel/output/static/_next/static/chunks/` → 0 hits | ❌ W0 | ⬜ pending |
| 18-06-01 | 06 | 3 | DQ-04 | — | Production alias serves v3 at parity; no alias drift | gate | post-promote `curl -I montysinger.com` → HTTP 200 + v3 markers; alias points at new deployment | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- No test-file scaffolding required — this phase produces EVIDENCE.md gate artifacts and a signed `18-GO-NO-GO.md`, not unit tests.
- Wave 0 dependency for measurement: a deployable `v3` Vercel preview URL must exist (produced by plan 18-02) before Lighthouse/PSI/visual gates (18-02..18-04) can run.

*Existing infrastructure (Vercel CLI, Lighthouse, browser PSI, grep) covers all phase gates.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 375px visual QA across homepage + interior + /uses + /watching (folds Phase-16 deferred 4-item checklist) | DQ-03 | Visual layout/overflow + Pumpkin Amber palette correctness cannot be asserted programmatically | Chrome DevTools 375×667 walk on the v3 preview; PASS/FAIL per route; screenshots to `screenshots/` |
| PSI mobile score capture | DQ-03 | Unauthenticated PSI API hits a daily quota (HTTP 429); browser run is reliable | Open `https://pagespeed.web.dev/?url=<preview>&form_factor=mobile`; record Performance + CWV |
| GO/NO-GO sign-off + alias promotion | DQ-04 | Promotion to production is an irreversible outward-facing action requiring operator sign-off | Sign `18-GO-NO-GO.md`; merge `v3 → main` (Vercel auto-deploy, per D-08 research) → verify alias → run `/gsd-complete-milestone v3.0` |

---

## Validation Sign-Off

- [ ] Every gate task has a concrete measurement command or manual instruction
- [ ] Sampling continuity: each gate writes an EVIDENCE.md artifact
- [ ] Wave 0 (preview URL) precedes all measurement gates
- [ ] No watch-mode flags
- [ ] Feedback latency < 300s (one `vercel build --prod`)
- [ ] `nyquist_compliant: true` set in frontmatter (after planner finalizes task IDs)

**Approval:** pending
