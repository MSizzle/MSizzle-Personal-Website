---
phase: 16
slug: interior-pages-on-notion-data
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-19
---

# Phase 16 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts (verify exact path; Wave 0 confirms) |
| **Quick run command** | `npx vitest run --changed` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --changed`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green + `npm run build` passes
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

> Filled by the planner / nyquist auditor as plans are written. One row per task.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 16-01-01 | 01 | 1 | PG-01 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Confirm vitest config path + test dir convention used by existing homepage component tests
- [ ] Component render tests for the new photo-grid index cards (Writing/Works)
- [ ] Render tests for `/uses` (grouped data) and `/watching` (YouTube cards, new-tab links)
- [ ] Nav/footer active-state + breadcrumb tests covering the two new routes

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Notion-sourced content renders on preview (covers via proxy) | IN-01 / IN-02 | Requires live Notion + Vercel preview | Load /writing, /projects, an essay, a project detail on the v3 preview; confirm images + content match production |
| Pumpkin Amber palette reads correctly across all interior pages | PG-01 | Visual judgment | Walk every interior route; confirm amber field + cocoa ink, no leftover v2 paper/ink |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
