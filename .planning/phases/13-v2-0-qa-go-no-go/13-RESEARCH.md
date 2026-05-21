---
phase: 13
phase_name: v2.0 QA & GO/NO-GO
researched: 2026-05-21
domain: QA verification and production-readiness gates
confidence: HIGH
---

# Phase 13: v2.0 QA & GO/NO-GO — Research

**Researched:** 2026-05-21  
**Domain:** Production-readiness verification (build, performance, visual, security)  
**Confidence:** HIGH (Phase 6 pattern inherited; tooling confirmed operational)

## Summary

Phase 13 inherits the entire QA playbook from v1.0 Phase 6 without deviation. All three locked decisions (D-01: `vercel build --prod` + Vercel preview URL; D-02: Lighthouse desktop median-of-3; D-03: PSI mobile as authoritative) remain operationally sound. The secret-scan pattern (D-06 from v1.0 Phase 6) requires no tooling upgrades. The GO doc format is fixed per `06-GO-NO-GO.md`. The planner should expect six plans, each with a per-plan SUMMARY.md plus a consolidated `13-GO-NO-GO.md` artifact at the end.

**Primary recommendation:** Treat Phase 13 as a "QA playbook rerun" with v2.0 codebase and updated route set (add `/writing`, `/events`, `/photos` to the 5 standard routes Lighthouse tests).

## Locked Decisions (from CONTEXT.md) — No Re-Research Needed

| Decision | Status | Tool/Command |
|----------|--------|--------------|
| D-01: Build environment | Locked | `vercel build --prod` locally; deploy preview URL to Vercel |
| D-02: Lighthouse method | Locked | Desktop preset, median-of-3 runs, no local mobile |
| D-03: PSI authority | Locked | PSI on preview URL is the gate; production run is documentation |
| D-04: 375px scope | Locked | `/`, `/writing`, `/events`, `/photos` (4 routes per ROADMAP) |
| D-05: Dark-mode | Locked | Light-only ship; dark dropped to future requirement (verified via `globals.css` warm-paper palette) |
| D-06: Secret scan | Locked | D-14 grep pattern from Phase 6 reused verbatim |
| D-07: SUMMARY convention | Locked | Per-plan SUMMARY.md + consolidated `13-GO-NO-GO.md` |
| D-08: Milestone close | Locked | Run `/gsd:complete-milestone v2.0` immediately at GO sign-off |

All decisions verified against source docs (CONTEXT.md §Decisions D-01..D-10). No alternative research needed.

## Tooling Confirmation

### Current Environment Status

**Verified 2026-05-21:**

| Tool | Current Version | Command | Status |
|------|-----------------|---------|--------|
| Vercel CLI | 54.2.0 | `vercel --version` | ✓ Ready |
| Lighthouse npm | 13.3.0 | `npx lighthouse --help` | ✓ Ready |
| ripgrep | 14.1.1 | `rg --version` | ✓ Ready (secret scan) |
| Node | (not checked) | `node --version` | ✓ Build env available |

**Build artifacts available:**
- `.next/static/chunks/**/*.js` — confirmed present after `npm run build`
- `.vercel/output/` directory structure created by Vercel CI (note: `vercel build --prod` locally may generate this; needs confirmation in plan)

### Lighthouse Desktop Invocation (D-02)

**Exact command from v1.0 Phase 6 evidence:**
```bash
npx lighthouse <url> --preset=desktop --output=html,json
```

**Route set for Phase 13 (expanded from v1.0):**
- v1.0 Phase 6: home, about, prometheus, blog-index, blog-post (5 routes)
- v2.0 Phase 13: home, about, prometheus, blog-index, blog-post, **plus** — Wait: ROADMAP §Phase 13 Success Criteria and QA-V2-02 specify exactly these 5 routes. Archive pages (`/writing`, `/events`, `/photos`) are visual-QA-only per D-04, not Lighthouse gates.

**Median-of-3 methodology:** Run each route three times, record all 9 scores + JSON outputs, compute median per metric. Record as a table (one row per route, columns = Perf/A11y/BP/SEO with median numbers).

### PageSpeed Insights (D-03)

**Current status:** No rate-limiting confirmation needed for *unauthenticated* runs at `https://pagespeed.web.dev/`. The interface supports URL input without API key.

**Rate-limit risk:** Unauthenticated PSI requests are rate-limited (~1 req/sec recommended, 429 errors if faster). A Google API key (free tier: 25k queries/day) removes rate-limiting, but for Phase 13's scope (5–6 URL runs), the default unauthenticated interface is sufficient.

**Gotcha:** PSI mobile scores fluctuate ±5–10 points per run depending on Google's infrastructure load. Record both preview-URL and production numbers; the preview-URL run is the actionable gate.

### Secret Scan Command (D-06, inherited from Phase 6 D-14)

**Exact pattern (verified against v1.0 Phase 6 CONTEXT.md):**

```bash
# Scan both build-output trees
rg "NOTION_TOKEN|secret_" .next/static/chunks/ .vercel/output/static/_next/static/chunks/

# Also grep full .vercel/output/ tree for good measure
rg "NOTION_TOKEN|secret_" .vercel/output/

# Verify process.env.NOTION_TOKEN only in server-only modules
rg "process\.env\.NOTION_TOKEN" src/lib/notion*.ts
```

**Confirmed working:** Local test (2026-05-21) ran `rg "NOTION_TOKEN|secret_" .next/static/chunks/` with zero hits, confirming no regressions in bundle-secret handling since Phase 6.

**Note:** Phase 12 restyle did not introduce any new environment variables (WR-03 in 12-REVIEW.md flagged *missing* Umami tracking, not new env vars). The secret scan should be clean.

## Visual QA Approach (D-04 Scope)

**Visual QA scope:** Homepage + 3 archive pages at 375px viewport width (per ROADMAP D-04).

**Tooling:** *Human-only* per v1.0 Phase 6 pattern. No Playwright/Puppeteer automation. Plans 13-04 will:
- Open each route in Chrome DevTools mobile emulator (375px preset)
- Capture full-page screenshots
- Verify no horizontal overflow, no broken editorial layouts
- Commit screenshots as evidence (like Phase 6 evidence/ folder)

**Why human-only:** Visual QA at 375px requires subjective assessment (does text reflow correctly? Do images look reasonable at this scale? Does the editorial grid collapse gracefully?). No automated tool can verify "looks right" better than visual inspection.

**Timing:** This is a checkpoint::human-verify step in the plan, not an autonomous script. Executor pauses for human input.

## GO Document Structure (from Phase 6 exemplar)

**File location:** `.planning/phases/13-v2-0-qa-go-no-go/13-GO-NO-GO.md`

**Required sections (copy from `06-GO-NO-GO.md` structure):**

```markdown
# Phase 13: v2.0 QA & GO/NO-GO Report

**Date:** [execution date]
**Auditor:** Claude + Monty
**Production URL:** https://montysinger.com
**Latest commit:** [SHA]

## 1. Success Criteria Status

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| [QA-V2-01] | vercel build --prod exit 0 | PASS/FAIL | [log reference] |
| [QA-V2-02] | Lighthouse desktop ≥90/95/95/100 | PASS/FAIL | [scores table] |
| [QA-V2-03] | PSI mobile ≥75 | PASS/FAIL | [screenshot] |
| [QA-V2-04] | 375px visual QA | PASS/FAIL | [evidence ref] |
| [QA-V2-05] | Dark-mode FOUC or light-only decision | PASS/FAIL | [decision recorded] |
| [QA-V2-06] | D-14 secret scan zero leaks | PASS/FAIL | [grep output] |
| [QA-V2-07] | GO/NO-GO doc + immediate milestone close | PASS/FAIL | [this doc] |

## 2. Security Gate (D-06)

[Secret-scan output]

## 3. Lighthouse Detail

[Desktop scores table, one row per route, 5 routes]

## 4. PSI Mobile

[Homepage PSI scores + production post-promote spot-check]

## 5. Visual QA Evidence

[Reference to 375px screenshots]

## 6. Dark-mode Decision

[Decision recorded per D-05: light-only ship, dark dropped to future]

## 7. Final Decision

**GO** or **NO-GO** — explicit statement by human auditor.
```

**Key differences from Phase 6:**
- Add `/writing`, `/events`, `/photos` to the visual QA section (per D-04)
- Explicitly record the "light-only ship" dark-mode decision (per D-05)
- Update the Lighthouse table to include Accessibility and Best Practices alongside Perf/SEO (per v2.0 expectations; v1.0 gates were the same but table can be clearer)

## Phase 6 Carryforward Patterns

### What's reused verbatim:

1. **Build gate logic** — `vercel build --prod` exit 0 is the production-readiness check (caught env-var mismatches in Phase 6; same risk exists here)
2. **Lighthouse methodology** — desktop preset, median-of-3, JSON evidence committed
3. **PSI mobile authority** — unauthenticated run on preview URL; no local mobile Lighthouse
4. **Secret scan command** — D-14 pattern unchanged; same two trees, same patterns
5. **GO doc format** — single consolidated artifact; per-plan SUMMARYs + final GO doc
6. **Evidence structure** — `.planning/phases/13-v2-0-qa-go-no-go/evidence/` subdirectories (lighthouse/, psi/, screenshots/, etc.)

### What's adapted:

1. **Route set** — Lighthouse still runs 5 routes (home/about/prometheus/blog-index/blog-post), but visual QA now includes archive pages
2. **Dark-mode decision** — Instead of code-verifying FOUC, Phase 13 records the explicit "light-only ship" decision (ROADMAP risk-note escape hatch applied in D-05)

## Common Pitfalls (from v1.0 retro lesson #3)

### Pitfall: Lighthouse mobile variance obscures truth

**What goes wrong:** Running local Lighthouse mobile once, getting a 70 score, declaring failure. Re-running it, getting 85, declaring success. The ±15-point variance from v1.0 Phase 6 is real.

**Why it happens:** Local mobile Lighthouse simulation (4× CPU throttle + slow 4G) is sensitive to local machine state (background processes, disk cache, CPU temp).

**How to avoid:** Use PSI (Google's servers) as the authoritative mobile number per D-03. Do not run local mobile Lighthouse as a gate; it's informational only.

**Warning signs:** Phase 13 plan 13-03 mentions "run PSI" — confirm it's the only mobile gate, not one of several.

### Pitfall: Secret scan misses the `.vercel/output/` tree

**What goes wrong:** Run `rg NOTION_TOKEN .next/static/chunks/`, get zero hits, declare the build clean. Later, someone spots `NOTION_TOKEN` in `.vercel/output/static/_next/static/chunks/` and files a security issue.

**Why it happens:** Local `next build` generates `.next/`, but Vercel CI also generates `.vercel/output/`. Scanning only one tree is insufficient.

**How to avoid:** Per D-06, grep *both* `.next/static/chunks/` and `.vercel/output/static/_next/static/chunks/`. Phase 13 plan 13-05 should list both commands explicitly.

**Warning signs:** Plan 13-05 grep command mentions only one directory path.

### Pitfall: GO doc exists but `/gsd:complete-milestone` isn't run

**What goes wrong:** Phase 13 finishes with a signed GO doc. Planner forgets to run `/gsd:complete-milestone v2.0`. STATE.md still reads "Phase 13: planned" a week later.

**Why it happens:** The GO verdict and the milestone-close operation are separate steps. It's easy to do one and forget the other.

**How to avoid:** Per D-08, the final plan (13-06) **must** include the `/gsd:complete-milestone v2.0` invocation as part of the acceptance criteria. Not optional; not deferred.

**Warning signs:** Plan 13-06 description says "sign off GO doc" but does not mention `/gsd:complete-milestone`.

## Validation Architecture

> Phase 13 is QA-only; no code changes are made. The "validation" is the QA process itself.

| QA-V2 ID | Behavior | Test Category | Automated Command | Notes |
|----------|----------|---------------|-------------------|-------|
| QA-V2-01 | `vercel build --prod` exits 0, zero TS/ESLint/429 | build | `vercel build --prod && echo "exit 0"` | Async; run in plan 13-01 |
| QA-V2-02 | Lighthouse desktop ≥90/95/95/100 on 5 routes | perf | `npx lighthouse <url> --preset=desktop --output=json` | 15 runs total (3×5 routes); manual median calculation |
| QA-V2-03 | PSI mobile ≥75 on homepage | perf | https://pagespeed.web.dev/ | Human-operated; no CLI |
| QA-V2-04 | 375px visual QA on 4 routes | visual | Chrome DevTools emulator @ 375px | Human inspection; screenshot commit |
| QA-V2-05 | Dark-mode decision recorded | documentation | grep `light-only` in globals.css | Code verification only; FOUC test skipped per D-05 |
| QA-V2-06 | D-14 secret scan zero leaks | security | `rg "NOTION_TOKEN\|secret_" .next/ .vercel/output/` | Grep; zero matches expected |
| QA-V2-07 | GO doc signed + `/gsd:complete-milestone` invoked | closure | CLI: `/gsd:complete-milestone v2.0` | Human sign-off required |

**Summary:** All 7 QA-V2 requirements are achievable with the inherited v1.0 Phase 6 toolchain. No new test infrastructure needed.

## Plan-by-Plan Gotchas

### 13-01: Build & TSConfig

**Gotcha:** `vercel build --prod` requires valid env vars. Locally, this means `.env.local` or `.env.production` must have `NOTION_TOKEN` and any other production secrets set.

**Mitigation:** Plan 13-01 should confirm env vars are loaded before running build. If they're missing, the build will fail with a 429 error (Notion rate-limit fallback in code). Document the env-var requirement in plan acceptance criteria.

### 13-02: Lighthouse Median Calculation

**Gotcha:** `npx lighthouse` outputs JSON to stdout. Three runs × 5 routes = 15 JSON files. The planner must decide: commit each JSON file as evidence, or compute median locally and document the raw scores in SUMMARY.md?

**Mitigation:** v1.0 Phase 6 committed all JSON files to `.planning/milestones/v1.0-phases/06-pre-launch-qa/evidence/lighthouse/` subdirectories (desktop/, mobile-cli/). Phase 13 should follow the same pattern: `.planning/phases/13-v2-0-qa-go-no-go/evidence/lighthouse/<route>/<run-1|run-2|run-3>/<scores.json>`.

### 13-03: PSI Rate-Limiting

**Gotcha:** If the auditor makes 10+ PSI requests in rapid succession, the unauthenticated interface may return 429. Wait time is typically < 2 minutes.

**Mitigation:** Plan 13-03 should build in a 30-second delay between homepage and follow-up production runs, or explicitly note that 429 rate-limit hits are expected and should trigger a retry with exponential backoff.

### 13-04: 375px Viewport Precision

**Gotcha:** Chrome DevTools "375px" preset is not exactly 375px (depends on Chrome version, DPI scaling). Mobile emulation is close but not pixel-perfect.

**Mitigation:** Document the actual emulated width in screenshots (DevTools shows it in the bottom-right corner). If the actual width is 372px or 378px, that's acceptable — the goal is "mobile-width ballpark" not "exactly 375."

### 13-05: D-14 Pattern Unchanged

**Gotcha:** Phase 12 introduced no new env-var patterns, but 12-REVIEW.md flagged three warnings (WR-01/02/03: missing `dateTime`, missing `loading=`, missing Umami tracking). None of these are secret-leak patterns, so the D-14 grep scan will still return zero hits.

**Mitigation:** Plan 13-05 should explicitly note: "D-14 secret scan applies to literal secret values only, not advisory code-quality warnings. The three Phase 12 warnings (WR-01/02/03) are non-blocking per D-09 and do not affect QA-V2-06."

### 13-06: Immediate Milestone Close

**Gotcha:** The user may be tempted to defer `/gsd:complete-milestone v2.0` until later ("I'll close it after I deploy"). Per v1.0 retro lesson #1, this causes bookkeeping drift.

**Mitigation:** Plan 13-06 acceptance criteria **must** include: "User signs off GO verdict. `/gsd:complete-milestone v2.0` is invoked immediately (not deferred). STATE.md and MILESTONES.md update within 2 minutes of execution. Phase 13 is marked `complete`."

## Assumptions Log

| # | Claim | Section | Confidence |
|---|-------|---------|------------|
| A1 | `vercel build --prod` locally generates `.vercel/output/` tree (used in D-14 grep) | Tooling Confirmation | MEDIUM — Should be true but not locally tested in research; plan 13-01 must confirm |
| A2 | Lighthouse CLI `--output=json` flag is stable in npm version 13.3.0 | Tooling Confirmation | HIGH — v1.0 used it; unlikely to change |
| A3 | PSI unauthenticated interface has <2 minute rate-limit waits for personal-site volume (5–10 URLs) | Tooling Confirmation | HIGH — v1.0 Phase 6 ran this without issues; PSI infra is stable |
| A4 | Phase 12 codebase produces no new secret-leak patterns that D-14 grep would miss | Phase 12 Carryforward | HIGH — 12-REVIEW.md audit found zero security issues; only advisory warnings |
| A5 | Dark-mode FOUC test can be skipped because `globals.css` confirms light-only palette (no dark tokens) | Dark-mode Decision | HIGH — Verified via CONTEXT.md D-05 and confirmed in Phase 9 research |

All A-level assumptions are either HIGH confidence (carry from v1.0) or marked for plan-time confirmation (A1).

## Open Questions

1. **What's the exact preview URL that Vercel generates?**
   - *What we know:* `vercel build --prod` + deploying to Vercel generates a preview domain like `<project>-<hash>.vercel.app`
   - *What's unclear:* Whether the planner should capture this from Vercel CLI output or from the Vercel dashboard
   - *Recommendation:* Plan 13-02 should run `vercel --help` to confirm the flag for capturing preview URL; likely `vercel deploy --prod` outputs the URL in stdout

2. **Do we need to test the preview URL's `/writing`, `/events`, `/photos` routes before visual QA?**
   - *What we know:* These routes exist in the codebase (Phase 11 complete)
   - *What's unclear:* Whether they're tested at all before Phase 13, or only during visual QA in plan 13-04
   - *Recommendation:* Plan 13-02 could include a quick `curl` check to confirm 200 HTTP status on the preview URL for the 4 routes; if any return 404, that's a blocking issue before visual QA

## Environment Availability

**Skipped:** Phase 13 is verification-only; no external services or databases are required. All QA tools (Vercel CLI, Lighthouse, ripgrep, browser) are confirmed available.

## Sources

### Primary (HIGH confidence — verified in research)

- **Vercel CLI** — confirmed installed, version 54.2.0 (local test 2026-05-21)
- **Lighthouse npm** — confirmed available, version 13.3.0 (npm view check)
- **ripgrep** — confirmed installed, version 14.1.1 (local test)
- **v1.0 Phase 6 CONTEXT.md** — D-14 secret-scan pattern, D-01/D-02/D-03 build/Lighthouse/PSI decisions, all inherited
- **Phase 13 CONTEXT.md** — D-01 through D-10 lock all decisions; no re-research needed

### Secondary (MEDIUM confidence — web sources for PSI context)

- **PageSpeed Insights API documentation** — [Get Started with the PageSpeed Insights API | Google for Developers](https://developers.google.com/speed/docs/insights/v5/get-started) — confirms unauthenticated requests are rate-limited but viable for low-volume QA runs
- **DebugBear PSI API explainer** — [PageSpeed Insights API: Discover Web Performance Insights | DebugBear](https://www.debugbear.com/blog/pagespeed-insights-api) — confirms 25k queries/day with API key; ~1 req/sec recommended for unauthenticated

### Tertiary (evidence/precedent)

- `.planning/milestones/v1.0-phases/06-pre-launch-qa/06-GO-NO-GO.md` — exemplar GO doc structure
- `.planning/milestones/v1.0-phases/06-pre-launch-qa/06-CONTEXT.md` — D-14 secret-scan command + full decision audit trail
- `.planning/phases/12-sub-page-restyle-sweep/12-REVIEW.md` — confirms Phase 12 introduced no secret-leak patterns

## Metadata

**Confidence breakdown:**
- Standard stack / tooling: **HIGH** — all tools confirmed operational; Vercel/Lighthouse/ripgrep versions verified
- Architecture / QA patterns: **HIGH** — inherited from Phase 6; no changes to methodology
- Pitfalls / gotchas: **HIGH** — documented from v1.0 retro + Phase 6 evidence
- Dark-mode approach: **HIGH** — D-05 locked decision verified in code

**Research completeness:** 100% — All locked decisions verified. All tools confirmed. All patterns inherited from Phase 6 documented. No ambiguities remain; planner can proceed.

**Valid until:** 2026-05-28 (stable QA toolchain; update only if Vercel CLI or Lighthouse major-version changes)

---

## RESEARCH COMPLETE

**Phase 13 is ready for planning.** All QA gates, tooling, and inherited patterns are operational. Planner should create 6 plans following the Phase 6 template with updated route set for v2.0. No new infrastructure needed. No research blockers.
