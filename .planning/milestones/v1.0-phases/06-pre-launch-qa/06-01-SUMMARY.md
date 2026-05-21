---
phase: 06-pre-launch-qa
plan: 01
subsystem: qa
tags: [doc-reconcile, vercel-build, security, bundle-scan, notion, edge-runtime]

requires:
  - phase: 01-05 (all prior phases shipped)
    provides: The site under audit
  - phase: 07-seo-overhaul
    provides: 11/11 SEO plans shipped, reflected in reconciled Phase Overview row
provides:
  - Reconciled REQUIREMENTS.md Traceability table (30 rows, all 28 v1 IDs `complete`)
  - Reconciled ROADMAP.md Phase Overview table (7 data rows, consistent columns)
  - vercel pull + vercel build evidence under production env (exit 0, no TS/ESLint/429 errors)
  - Client-bundle secret-scan evidence across both chunk trees (.next/ and .vercel/output/) — zero LEAKs
  - Reproducible scan.sh audit-trail script for D-14 re-runs
affects:
  - 06-02-lighthouse (can now rely on clean build artifacts in .vercel/output/)
  - 06-03-UAT (28 requirement IDs now trustworthy as the UAT walk-through list)
  - 06-06-GO-NO-GO (ROADMAP Phase Overview now aggregatable against STATE)

tech-stack:
  added: []
  patterns:
    - Doc reconciliation gates all QA work — audit against truth, not stale tables
    - Evidence-first gating: every blocking claim lands in .planning/phases/06-pre-launch-qa/evidence/build/
    - scan.sh committed alongside bundle-secret-grep.txt so D-14 is reproducible on any future build
    - Distinguish variable-NAME references (INFO) from literal secret VALUES (LEAK) in server function bundles

key-files:
  created:
    - .planning/phases/06-pre-launch-qa/evidence/build/env-check.txt
    - .planning/phases/06-pre-launch-qa/evidence/build/vercel-build.log
    - .planning/phases/06-pre-launch-qa/evidence/build/bundle-secret-grep.txt
    - .planning/phases/06-pre-launch-qa/evidence/build/scan.sh
    - .planning/phases/06-pre-launch-qa/evidence/ (lighthouse/, requirements/, notion-longtail/, dark-mode/, cross-browser/, seo/ — empty directories for downstream plans)
  modified:
    - .planning/REQUIREMENTS.md
    - .planning/ROADMAP.md

key-decisions:
  - Broader .vercel/output/ NOTION_TOKEN hits classified INFO (not LEAK) when they are process.env variable-NAME references in server Edge functions; D-14 gating applies to literal secret values and to ANY hit in client chunks
  - scan.sh committed as audit trail so reruns (Phase-6-FIX sub-plans or future audits) reproduce the evidence with identical semantics
  - Vitest invoked via `npx vitest run` (project has no `npm test` script); logged as minor plan deviation

patterns-established:
  - "QA-evidence directory layout: .planning/phases/06-pre-launch-qa/evidence/{build,lighthouse,requirements,notion-longtail,dark-mode,cross-browser,seo}/"
  - "Per-task atomic commits within a single plan: 06-01 shipped across 3 commits (6aeb05d, fe87055, caefa5d)"

requirements-completed: []

duration: ~20min
completed: 2026-04-16
metrics:
  tasks_completed: 3
  files_created: 4
  files_modified: 2
  commits: 3
  build_exit_code: 0
  notion_rate_limit_errors: 0
  typescript_errors: 0
  eslint_errors: 0
  client_chunk_leaks: 0
  server_bundle_value_leaks: 0
---

# Phase 06 Plan 01: Pre-Launch QA — Doc Reconcile + Build Gate + Bundle Secret Scan Summary

**Reconciled the REQUIREMENTS.md Traceability table (28 v1 IDs, DSGN-06 `complete` per D-15) and ROADMAP.md Phase Overview (7 consistent rows, Phases 1-5 Complete, Phase 6 In Progress, Phase 7 Complete 11/11), then ran `vercel pull` + `vercel build --prod` to exit 0 with zero TS/ESLint/429 errors and grepped both `.next/static/chunks/` and `.vercel/output/static/_next/static/chunks/` plus a broader `.vercel/output/` sweep per D-14 — zero client-chunk leaks and zero literal-value leaks in server bundles.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-04-16T19:26:46Z
- **Completed:** 2026-04-16T19:46:47Z
- **Tasks:** 3/3
- **Commits:** 3 (one per task)
- **Files changed:** 4 created, 2 modified

## Accomplishments

- Wiped 29 stale `not_started` rows out of the Traceability table; every v1 ID now reflects shipped reality per STATE.md source of truth.
- Fixed the per-row "Phase 3 — Core Pages" em-dash formatting to commas per Phase-07 D-01 copy rules that Phase 6 re-audits.
- Collapsed the ROADMAP Phase Overview from two incompatible column schemas into one consistent `# | Phase | Plans | Status | Completed` grid; added the Phase 7 row that was previously only visible as a trailing section.
- `vercel pull --yes --environment=production` succeeded against the linked `msizzles-projects/m-sizzle-personal-website` scope; no interactive-auth prompt.
- `vercel build --prod` produced 40 static/SSG pages + 4 dynamic functions in a clean exit-0 run; zero TypeScript errors, zero ESLint errors, zero Notion 429 rate-limit errors.
- D-14 bundle scan surfaced **zero LEAK lines** across both chunk trees and zero secret-value leaks across the broader `.vercel/output/` sweep; the only `NOTION_TOKEN` references are `process.env.NOTION_TOKEN` variable-name reads in the server-only Edge OG-image functions.
- Server-only spot-check confirmed `src/lib/notion.ts` and `src/lib/notion-projects.ts` carry no `'use client'` directive.
- Reproducible `scan.sh` committed alongside the evidence file so any future FIX sub-plan or re-audit reproduces identical results.

## Task Commits

1. **Task 1: Doc reconciliation (REQUIREMENTS + ROADMAP)** — `6aeb05d` (docs)
2. **Task 2: vercel pull + vercel build evidence** — `fe87055` (feat)
3. **Task 3: D-14 client-bundle secret scan** — `caefa5d` (feat)

## Files Created/Modified

### Created
- `.planning/phases/06-pre-launch-qa/evidence/build/env-check.txt` — Commit SHA (`fe87055`), branch `main`, working-tree clean flag, plus the output of `vercel env ls production`. All 6 env vars (NOTION_TOKEN, NOTION_DATABASE_ID, NOTION_PROJECTS_DATABASE_ID, NOTION_EVENTS_DB_ID, NEXT_PUBLIC_UMAMI_URL, NEXT_PUBLIC_UMAMI_WEBSITE_ID) present as `Encrypted`; no values captured (T-06-01-1 mitigated).
- `.planning/phases/06-pre-launch-qa/evidence/build/vercel-build.log` — Full stdout+stderr of `vercel pull` + two `vercel build --prod` runs. Ends with `vercel build exit: 0`. Safety grep confirmed no `secret_`/`ntn_` literals in the log (T-06-01-2 mitigated).
- `.planning/phases/06-pre-launch-qa/evidence/build/bundle-secret-grep.txt` — D-14 evidence: 18 JS files scanned in each chunk tree, 4 `INFO:` lines in broader `.vercel/output/` sweep (server Edge-function variable-name references), zero `LEAK:` lines anywhere, server-only spot-check `OK`.
- `.planning/phases/06-pre-launch-qa/evidence/build/scan.sh` — Reproducible D-14 scan script. Reads `NOTION_DATABASE_ID` from `.vercel/.env.production.local` without echoing the value. Committed executable alongside the evidence so re-runs remain deterministic.
- `.planning/phases/06-pre-launch-qa/evidence/{lighthouse,requirements,notion-longtail,dark-mode,cross-browser,seo}/` — Empty directories pre-staged for 06-02..06-05 evidence.

### Modified
- `.planning/REQUIREMENTS.md` — Traceability table rebuilt: all 30 rows (28 v1 IDs + header + separator), every ID `complete`, DSGN-06 explicitly `complete` per D-15, em-dashes in the Phase column replaced with commas, reconciliation comment prepended.
- `.planning/ROADMAP.md` — Phase Overview table rebuilt: 7 data rows (Phases 1-7) under consistent `# | Phase | Plans | Status | Completed` columns. Phase 5 flipped from `0/2 Planned` to `2/2 Complete 2026-04-03`. Phase 7 added as `11/11 Complete 2026-04-14`. Per-phase detail sections below the overview left untouched per plan scope.

## Decisions Made

- **Broader-sweep NOTION_TOKEN hits classified INFO, not LEAK.** The D-14 rule "Any hit in a client chunk = blocking fail" applies to the two chunk-directory scans; those scans returned zero hits. The broader `.vercel/output/` sweep found 4 hits, all in Edge-runtime OG-image function bundles and source maps — these are `process.env.NOTION_TOKEN` *variable-name* references, which is exactly what server-only code is supposed to look like. Treating them as LEAK would guarantee a false positive on every future build. The evidence file documents this semantic explicitly so the decision is auditable.
- **Reproducibility via scan.sh.** Rather than a one-shot inline shell pipeline, committed a `scan.sh` script that any future FIX sub-plan (per D-10) or post-launch re-audit can run verbatim to reproduce identical output. The script reads the DB-ID value from `.vercel/.env.production.local` without ever echoing it.
- **Per-task commits, not batched.** Unlike Plan 07-01 which shipped as one atomic commit, 06-01 landed three commits (one per task) to match the standard GSD flow. Task 1 is a docs commit; Tasks 2 and 3 are feat commits because they create new evidence surface used by later plans.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] First vercel-build run lost its exit-code capture**
- **Found during:** Task 2
- **Issue:** The plan's step 3 bash-command-with-tee-and-${PIPESTATUS} did not persist the PIPESTATUS value when the shell exited between commands (cross-call-reset). The first build log ended with `vercel build exit:` (empty value) instead of `vercel build exit: 0`.
- **Fix:** Re-ran the `vercel build --prod` inside a single `bash -c '...'` subshell so PIPESTATUS[0] survived until the `echo`. Second run exited 0 and the log now ends with `vercel build exit: 0`.
- **Files modified:** `.planning/phases/06-pre-launch-qa/evidence/build/vercel-build.log` (now contains two full build runs + correct exit line).
- **Commit:** `fe87055`

**2. [Rule 1 - Bug] Initial Task 3 server-only spot-check pipeline produced false FAIL**
- **Found during:** Task 3 first run
- **Issue:** The plan's inline grep + pipe + xargs check for `'use client'` in `src/lib/notion*.ts` had over-nested quoting that always emitted `FAIL:` regardless of actual file contents. Manual `grep -c "use client" src/lib/notion*.ts` confirmed both files have zero matches (i.e., correctly server-only).
- **Fix:** Rewrote the spot-check as a single `grep -El "^[[:space:]]*[\"']use client[\"'];?" src/lib/notion*.ts` anchored to beginning-of-line + optional whitespace + quoted directive, which matches Next.js's actual `'use client'` syntax without quoting gymnastics. Also re-classified broader-sweep NOTION_TOKEN variable-name hits as INFO instead of LEAK (see Decisions Made).
- **Files modified:** `.planning/phases/06-pre-launch-qa/evidence/build/bundle-secret-grep.txt` (rewritten under new semantics), `.planning/phases/06-pre-launch-qa/evidence/build/scan.sh` (committed as reproducible script).
- **Commit:** `caefa5d`

**3. [Rule 3 - Blocking] Plan referenced `npm run test` but project has no `test` script**
- **Found during:** Final verification sweep
- **Issue:** Plan's `<verification>` block asked for `npm run test`. `package.json` exposes only `dev`, `build`, `lint`, `start` — no `test` script. The vitest binary is installed (used for Phase 07 suite), just not exposed via npm run.
- **Fix:** Invoked `npx vitest run` directly. Result: 14 test files passed, 5 skipped, 30 tests passed, 14 todo, zero failing. Plan verification intent is satisfied; the missing npm script is noted here for a future quick-fix todo (add `"test": "vitest"` to `package.json` scripts).
- **Files modified:** None
- **Commit:** n/a (pure verification)

**Total deviations:** 3 (two inline-script bugs in the plan itself + one missing npm script)
**Impact on plan:** Zero — all acceptance criteria met; evidence is stronger (reproducible via `scan.sh`) than originally specified.

## Threat-Model Verification

- **T-06-01-1 (env-check leak):** Mitigation verified — `grep -E 'secret_|ntn_|NOTION_TOKEN=[^ $]' evidence/build/env-check.txt` returns zero matches. Values are all `Encrypted`.
- **T-06-01-2 (build-log leak):** Mitigation verified — `grep -E 'secret_|ntn_' evidence/build/vercel-build.log` returns zero matches. Build process never echoed a raw secret.

## Issues Encountered

- **Vercel CLI PIPESTATUS edge-case:** Addressed via subshell wrapping (see Deviation 1).
- **Inline bash spot-check quoting bug:** Addressed by rewriting as single-anchored grep (see Deviation 2).
- **Planning doc references `msizzle.com` in historical copy:** Pre-existing in untouched per-phase detail sections below the Phase Overview table. Flagged in STATE.md "Known Issues" as a future doc-cleanup todo; explicitly out of scope per plan.

## Self-Check: PASSED

Verified against acceptance criteria:

- `.planning/REQUIREMENTS.md` — FOUND; 0 occurrences of `not_started`; 1 reconciliation comment with `Reconciled 2026-04-15`; DSGN-06 row contains `| complete |`; all 28 v1 IDs appear exactly once (HOME-01..04, PORT-01..03, BLOG-01..05, ABOUT-01, ANLY-01..06, DSGN-01..06, SOC-01..05).
- `.planning/ROADMAP.md` — FOUND; reconciliation comment `Overview table reconciled 2026-04-15` present above `## Phase Overview`; 7 data rows; Phase 5 row contains `Complete`; Phase 7 row contains `SEO Overhaul`; Phase 6 row contains `In Progress`.
- `.planning/phases/06-pre-launch-qa/evidence/build/vercel-build.log` — FOUND; 183 lines; contains `vercel build exit: 0`; zero TS errors, zero ESLint errors, zero 429 errors.
- `.planning/phases/06-pre-launch-qa/evidence/build/env-check.txt` — FOUND; 23 lines; contains commit SHA `fe87055acc0e34547cea655ef27a12a4203875d4`; all env-var rows show `Encrypted`; no secret-value leaks.
- `.planning/phases/06-pre-launch-qa/evidence/build/bundle-secret-grep.txt` — FOUND; contains `## Scanning .next/static/chunks`, `## Scanning .vercel/output/static/_next/static/chunks`, `## Broader sweep: .vercel/output/` section headers; zero lines starting with `    LEAK:`; zero lines starting with `FAIL:`; contains `OK: src/lib/notion.ts and src/lib/notion-projects.ts are server-only`.
- `.planning/phases/06-pre-launch-qa/evidence/build/scan.sh` — FOUND; executable mode 100755; reproducibility-ready.
- Commits `6aeb05d`, `fe87055`, `caefa5d` — FOUND on `main` branch via `git log --oneline`.
- `npx vitest run` — PASS (30 passed, 14 todo, 0 failed).

## User Setup Required

None — pure audit plan. No secrets rotated, no env vars added, no new dependencies installed.

## Next Phase Readiness

- **06-02 (Lighthouse triple coverage):** `.vercel/output/` is freshly populated; `vercel deploy --prebuilt` is available if a post-audit re-deploy is required. Evidence directory `.planning/phases/06-pre-launch-qa/evidence/lighthouse/` is pre-created.
- **06-03 (28-req UAT):** Traceability table is now authoritative. Walk the 28 IDs in the reconciled order; no `not_started` ambiguity.
- **06-04 (Notion long-tail + dark-mode + Safari):** No blockers.
- **06-05 (SEO re-audit vs live HTML):** Build artifacts in `.vercel/output/` are the `vercel deploy --prebuilt`-ready source of truth.
- **06-06 (GO/NO-GO aggregation):** ROADMAP Phase Overview table is now machine-parseable against STATE.md Phase Status.
- **No blockers.**

---
*Phase: 06-pre-launch-qa*
*Completed: 2026-04-16*
