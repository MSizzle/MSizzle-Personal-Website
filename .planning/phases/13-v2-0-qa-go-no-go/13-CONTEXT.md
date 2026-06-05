---
phase: 13
phase_name: v2.0 QA & GO/NO-GO
created: 2026-05-21
mode: auto
discuss_passes: 1
---

# Phase 13 Context

## Domain

**Goal (from ROADMAP.md):** Verify the redesigned site against production-readiness gates and deliver a signed GO/NO-GO verdict that can ship to `montysinger.com`. Run `/gsd:complete-milestone` AT the GO verdict, not weeks later.

**What this phase delivers:**
1. `vercel build --prod` exit-0 evidence
2. Lighthouse desktop scores on 5 named routes (home / about / prometheus / blog index / blog post)
3. PSI mobile homepage score (PSI is authoritative — local mobile Lighthouse explicitly NOT a gate per v1.0 retro lesson #3)
4. 375px visual QA on homepage + 3 archive pages
5. Dark-mode FOUC check (or explicit "light-only ship" decision recorded)
6. D-14 client-bundle secret scan re-run
7. Signed `13-GO-NO-GO.md` artifact + immediate `/gsd:complete-milestone` invocation

Phase 13 is a **verification** phase. No new product features are built. Risk surface = bookkeeping drift, score variance, and missed regressions from Phases 8–12.

## Requirements (locked by REQUIREMENTS.md)

- **QA-V2-01** — `vercel build --prod` exit 0, zero TS / ESLint / 429 errors
- **QA-V2-02** — Lighthouse desktop ≥ 90/95/95/100 on home / about / prometheus / blog index / blog post
- **QA-V2-03** — PSI mobile ≥ 75 on homepage (matches v1.0 PSI 77 baseline)
- **QA-V2-04** — Visual QA at 375px: homepage + `/writing` + `/events` + `/photos` render with no horizontal overflow / no broken editorial layout
- **QA-V2-05** — Dark-mode FOUC test passes incognito Chrome (system theme controls first paint with no flash) OR light-only ship is explicitly recorded with dark dropped to a future requirement
- **QA-V2-06** — D-14 client-bundle secret scan re-run against new build, zero leaks
- **QA-V2-07** — Signed `13-GO-NO-GO.md` exists with explicit GO verdict; `/gsd:complete-milestone` runs AT the GO verdict (carryforward from v1.0 retro lesson #1)

## Decisions (auto-resolved)

### D-01: Build environment for QA
**Decision:** Run `vercel build --prod` locally (mirrors v1.0 Phase 6 precedent), then deploy a preview to a Vercel preview URL for Lighthouse + PSI runs. Production `montysinger.com` is the final post-promote spot-check.
**Reason:** v1.0 retro confirmed `vercel build --prod` catches env-var mismatches that `next build` misses; Vercel preview URLs give a clean unauthenticated environment for Lighthouse without polluting prod.
**Auto-selection log:** `[auto] Build env → vercel build --prod + Vercel preview URL for Lighthouse/PSI`

### D-02: Lighthouse measurement methodology
**Decision:** Headless Chrome Lighthouse against the Vercel preview URL, desktop preset only. Three runs per route, take the **median** score. Record raw numbers + medians in `13-GO-NO-GO.md`. Mobile Lighthouse is NOT run locally — PSI is the only mobile gate per QA-V2-03.
**Reason:** Run-to-run variance was ±15 points in v1.0 (retro lesson #3). Median-of-3 is the durable pattern.
**Auto-selection log:** `[auto] Lighthouse method → desktop preset, median of 3 runs against preview URL, no local mobile`

### D-03: PSI methodology
**Decision:** Run PageSpeed Insights (https://pagespeed.web.dev/) against the **Vercel preview URL** during pre-ship validation. Final check post-promote runs against `https://montysinger.com`. Both numbers recorded in `13-GO-NO-GO.md`; the preview-URL run is the gate, the production run is documentation.
**Reason:** Preview-URL run is the actionable gate (allows rollback before promote). Production run is for the GO record.
**Auto-selection log:** `[auto] PSI → preview URL gate + post-promote prod check, both recorded`

### D-04: 375px visual QA scope
**Decision:** Strictly the 4 routes named in QA-V2-04 — `/` (homepage), `/writing`, `/events`, `/photos`. Phase 12's 6 restyled sub-pages are **out of scope** for this gate — they were build-verified at the end of Phase 12 and ROADMAP success criterion 4 names only the 4 above.
**Reason:** No scope creep. Phase 12 already passed verification; Phase 13's visual QA is targeted at the new editorial layouts that ship in v2.0, not the restyle pass.
**Auto-selection log:** `[auto] 375px QA scope → /, /writing, /events, /photos (4 routes, ROADMAP-defined)`

### D-05: Dark-mode FOUC decision (PRE-RESOLVED — light-only ship)
**Decision:** **v2.0 ships light-only.** No dark editorial palette was built in Phases 8–12 (warm-paper is light-only by design — verified in `src/app/globals.css` and Phase 9 `09-01-SUMMARY.md`). Dark mode is explicitly **dropped to a future requirement** per the ROADMAP risk note: "Dark-mode decision: if no dark-mode editorial palette has been built by this phase, the GO doc must explicitly record 'light-only ship, dark dropped to future requirement' rather than silently fail the FOUC test."
**Reason:** No dark editorial tokens defined; building them would expand v2.0 scope. v1.0 had a `next-themes` toggle but the v2.0 warm-paper palette is single-mode. Future requirement: design a dark variant of the warm-paper palette.
**Auto-selection log:** `[auto] Dark-mode → light-only ship; record decision in 13-GO-NO-GO.md per ROADMAP risk-note escape hatch`
**Verification:** QA-V2-05 satisfied by explicit recording of this decision; no FOUC test required.

### D-06: D-14 client-bundle secret scan implementation
**Decision:** Reuse v1.0 Phase 6 D-14 pattern verbatim. Grep for `secret_` and `NOTION_TOKEN` literals in **both** `.next/static/chunks/**/*.js` AND `.vercel/output/static/_next/static/chunks/**/*.js`. Also grep the full `.vercel/output/` tree for good measure. Confirm `process.env.NOTION_TOKEN` only appears in server-only modules. Any hit in a client chunk = blocking fail.
**Reason:** v1.0 retro lesson: "Bundle secret grep across BOTH `.next/static/chunks/` AND `.vercel/output/static/_next/static/chunks/` is the durable D-14 pattern. Single-tree scans miss `next build` artifacts left by local dev."
**Auto-selection log:** `[auto] Secret scan → reuse v1.0 D-14 grep pattern across both build-output trees`

### D-07: Per-plan SUMMARY.md convention
**Decision:** Phase 13 emits **per-plan SUMMARY.md files** AND a final consolidated `13-GO-NO-GO.md` document. SUMMARY.md captures execution evidence per plan (build logs, Lighthouse outputs, PSI screenshots); `13-GO-NO-GO.md` is the human-signed verdict document.
**Reason:** v1.0 retro inefficiency #2: "Phase 6 had 6 plans but only 1 SUMMARY.md. Future fix: QA phases should either emit per-plan SUMMARYs or explicitly opt out at plan creation." Emitting both gives tool compatibility (SUMMARY tracking) + human legibility (consolidated GO doc).
**Auto-selection log:** `[auto] SUMMARY convention → per-plan SUMMARY.md + consolidated 13-GO-NO-GO.md`

### D-08: `/gsd:complete-milestone` timing
**Decision:** Run `/gsd:complete-milestone v2.0` immediately upon GO sign-off in the final Phase 13 plan. Do not defer.
**Reason:** v1.0 retro lesson #1: "Run `/gsd:complete-milestone` at the GO verdict, not weeks later. A month of bookkeeping drift makes milestone close harder than the close itself." This is the carryforward — encoded as QA-V2-07.
**Auto-selection log:** `[auto] Milestone close → invoke /gsd:complete-milestone immediately at GO`

### D-09: Phase 12 code review carryforward
**Decision:** The 3 Warning-severity findings from `12-REVIEW.md` (newsletter `<time>` `dateTime`, projects hero `<img>` dimensions, newsletter Umami `data-umami-event`) are **acknowledged but non-blocking** for Phase 13. Track them as deferred polish items; do not gate the GO on them. Phase 13 verifies what's in the codebase as-of-execution-start.
**Reason:** Phase 12 was verified passed (8/8 must-haves). The warnings are advisory and don't affect the v2.0 GO criteria (build success, Lighthouse, PSI, visual layout, secrets). Folding them into Phase 13 would add scope creep.
**Auto-selection log:** `[auto] Code review warnings → defer to post-v2.0 polish; do not gate GO`

### D-10: Pre-existing vitest infrastructure failure
**Decision:** The known `@rolldown/binding-darwin-arm64` missing-binding issue (vitest startup blocked) is **out of scope** for Phase 13. Phase 13 does NOT require running the vitest suite — its gates are build + Lighthouse + PSI + visual + secret-scan. If the user wants test execution restored, that's a separate maintenance task: `rm -rf node_modules package-lock.json && npm i` (per npm error message), tracked as a deferred TODO.
**Reason:** Phase 13's success criteria don't include the vitest suite. The build gate (`vercel build --prod`) catches the things that matter for ship readiness (TS, ESLint, build errors). Test suite is supplementary regression coverage and isn't a v2.0 GO blocker.
**Auto-selection log:** `[auto] vitest infra → out of scope; track as deferred TODO`

## Plan Outline (auto-suggested, finalized by planner)

Targeted 6-plan breakdown (each with its own SUMMARY.md per D-07):

1. **13-01** — Run `vercel build --prod`, capture exit code + TS/ESLint/429 output. Satisfies QA-V2-01.
2. **13-02** — Deploy Vercel preview, capture preview URL. Run Lighthouse desktop median-of-3 on 5 routes. Satisfies QA-V2-02.
3. **13-03** — Run PSI mobile on preview URL homepage; capture scores + screenshots. Satisfies QA-V2-03.
4. **13-04** — Human 375px visual QA on 4 routes; capture screenshots + per-route pass/fail. Satisfies QA-V2-04. *(Human-gated step.)*
5. **13-05** — Execute D-14 secret scan + record dark-mode light-only decision. Satisfies QA-V2-05 + QA-V2-06.
6. **13-06** — Compile `13-GO-NO-GO.md`, get human sign-off, run `/gsd:complete-milestone v2.0`. Satisfies QA-V2-07.

Planner has discretion to merge plans 13-03/13-04 or split 13-06 if dependencies suggest it.

## Canonical References

**Downstream agents (researcher, planner, executor, verifier) MUST read these.**

### Phase contracts
- `.planning/REQUIREMENTS.md` — QA-V2-01..07 exact contracts
- `.planning/ROADMAP.md` §"Phase 13: v2.0 QA & GO/NO-GO" — goal, success criteria, risks, dependencies on Phases 8–12

### v1.0 retrospective (carryforward source)
- `.planning/RETROSPECTIVE.md` §"Milestone: v1.0" — patterns, lessons, top inefficiencies. D-01..D-08 are direct carryforwards from here.

### v1.0 Phase 6 precedent (QA template)
- `.planning/milestones/v1.0-phases/06-pre-launch-qa/06-CONTEXT.md` — original D-14 secret scan pattern, GO doc structure
- `.planning/milestones/v1.0-phases/06-pre-launch-qa/06-GO-NO-GO.md` — exemplar of the GO doc format
- `.planning/milestones/v1.0-phases/06-pre-launch-qa/06-04-EVIDENCE.md` — exemplar of evidence-style plan output
- `.planning/milestones/v1.0-phases/06-pre-launch-qa/06-05-EVIDENCE.md` — exemplar

### Phase 8–12 evidence (subject of QA)
- `.planning/phases/08-motion-subtractions/08-VERIFICATION.md`
- `.planning/phases/09-design-tokens-editorial-primitives/09-VERIFICATION.md`
- `.planning/phases/10-editorial-homepage/10-VERIFICATION.md`
- `.planning/phases/11-archive-pages/11-VERIFICATION.md`
- `.planning/phases/12-sub-page-restyle-sweep/12-VERIFICATION.md`
- `.planning/phases/12-sub-page-restyle-sweep/12-REVIEW.md` (D-09 source — non-blocking warnings)

### Design system source-of-truth
- `src/app/globals.css` — live token definitions (warm-paper palette is light-only, confirming D-05)
- `.planning/research/editorial-redesign-handoff/README.md` — design contract reference

### Live site
- `https://montysinger.com` — production target for the final post-promote spot-check
- Vercel project — preview-URL generation environment

## Deferred Ideas (NOT for Phase 13)

- **Dark-mode warm-paper variant** — design a dark version of the editorial palette + retest FOUC. Future post-v2.0 phase or v2.1 milestone.
- **Phase 12 code review warning fixes** (WR-01 `<time>` `dateTime`, WR-02 hero `<img>` dimensions, WR-03 newsletter Umami tracking) — bundle as a post-v2.0 polish phase.
- **vitest infrastructure restoration** (`@rolldown/binding-darwin-arm64` reinstall) — maintenance TODO; not a v2.0 ship blocker.
- **Lighthouse mobile gate** — explicitly NOT used per v1.0 retro lesson #3; PSI is authoritative.

## Notes for Downstream Agents

- **Research phase:** can be very thin. The QA pattern, secret-scan command, and GO doc format are all directly inherited from Phase 6. Researcher should confirm the Phase 6 D-14 grep pattern still applies to the current `vercel build --prod` output (it should — same toolchain), and check whether `pagespeed.web.dev` has any current rate-limiting affecting the workflow.
- **Plan phase:** the 6-plan outline above is a starting point. Plans 13-04 and 13-06 involve human gates (visual QA + GO sign-off) — mark them `autonomous: false` so the executor pauses for checkpoints.
- **Execute phase:** plans 13-01 / 13-02 / 13-03 / 13-05 are autonomous; 13-04 and 13-06 require human interaction. The `--auto` chain should pause naturally at those checkpoints.
- **Verifier:** the must_haves are the 7 QA-V2-* requirements + the GO doc + the `/gsd:complete-milestone` invocation. Phase passes only when all 7 are satisfied AND the milestone close ran.
