---
phase: "08-motion-subtractions"
plan: "07"
subsystem: "verification"
tags: ["motion", "preservation", "verification", "lenis", "template-fade", "scroll-reveal", "motion-budget", "editorial", "human-verify"]
dependency_graph:
  requires:
    - "08-01 (PhotoCarousel deletion)"
    - "08-02 (RotatingTagline deletion)"
    - "08-03 (WorksCarousel deletion + Link fallback)"
    - "08-04 (WritingsCarousel deletion + globals.css purge)"
    - "08-05 (animate-ping deletion from FeaturedUpcoming)"
    - "08-06 (cascading-delay-prop deletion from event-cards consumers + signatures)"
  provides:
    - "MOTION-08 preservation evidence: git-diff byte-equality on the three preserved primitives vs origin/main"
    - "Preservation Vitest pass log (3 test files, 5 tests total)"
    - "Phase-closing artifact 08-07-SUMMARY.md (combined with 08-VERIFICATION.md after verify-phase-goal)"
    - "08-HUMAN-UAT.md surfacing the two deferred items: production-build phase gate (D-11) + manual Lenis/fade smoke test"
  affects: []
tech_stack:
  added: []
  patterns:
    - "Preservation-by-byte-equality (D-12): `git diff origin/main -- <file>` empty-diff is the canonical D-12 contract, not a fuzzy 'looks right' check"
    - "Phase-gate-as-truth (D-11 + v1.0 retrospective lesson #2): `vercel build --prod` runs in Monty's actual environment because local `next build` variance can mask production-only regressions (also matches Phase 13 QA gate pattern)"
    - "autonomous: false defer protocol: human-verify tasks under `--auto` execution mode are surfaced via 08-HUMAN-UAT.md rather than blocking the phase verification chain"
key_files:
  created:
    - ".planning/phases/08-motion-subtractions/08-07-SUMMARY.md"
  modified: []
  deleted: []
decisions:
  - "Verified preservation via `git diff origin/main -- src/components/providers/lenis-provider.tsx src/app/template.tsx src/components/animations/scroll-reveal.tsx` (empty diff) per D-12. The phase commits 01-06 are all ahead of origin/main, and none of them touch any preserved file (verified via `git log ced6df2^..HEAD -- <files>` = empty)."
  - "Ran the three preservation test files in single-file-parallelism mode (`npx vitest run --no-file-parallelism`) to work around a sandbox ENFILE kernel-file-table limit unrelated to the test code. All 5 tests passed."
  - "Marked the `vercel build --prod` phase gate (D-11) as DEFERRED to Monty's Mac environment — sandbox node_modules has a corrupted Next.js install (`Cannot find module './static-paths/app'`) caused by vercel's own pre-build `npm install` step. The HANDOFF anticipated this substitution; the user pre-approved at session resume time. The deferred command goes to 08-HUMAN-UAT.md."
  - "Marked Task 2 (manual Lenis + page-load-fade smoke test) as DEFERRED to Monty per the plan's `autonomous: false` contract — surfaced via 08-HUMAN-UAT.md."
  - "Did NOT modify ANY source file (the plan is verification-only; `files_modified: []` in frontmatter)."
metrics:
  duration: "<5 minutes (automated checks)"
  completed_date: "2026-05-21"
  tasks_completed: 1
  files_changed: 0
requirements_completed: []
requirements_deferred:
  - MOTION-08
validation_task: "8-07-V"
---

# Phase 08 Plan 07: MOTION-08 Preservation Verification Summary

**One-liner:** Verified the three preserved motion primitives — `lenis-provider.tsx`, `template.tsx`, `scroll-reveal.tsx` — are byte-identical to the pre-phase baseline at `origin/main`, and that all three preservation test files pass in Vitest. The two remaining acceptance items (`vercel build --prod` phase gate per D-11, and the manual Lenis/page-load-fade smoke test per the plan's `autonomous: false` Task 2) are deferred to Monty's local environment via `08-HUMAN-UAT.md`. Phase 8 is otherwise ready for `gsd-verifier` rollup.

## Tasks Completed

| Task | Name | Result | Notes |
|------|------|--------|-------|
| 1 | Verify three preserved files have byte-identical state to main, run preservation tests, run production build gate | **PARTIAL** (steps 1-2 PASS; step 3 deferred) | Steps 1 (git diff) and 2 (vitest) completed in this sandbox; step 3 (vercel build --prod) deferred to Monty's Mac, surfaced via 08-HUMAN-UAT.md. |
| 2 | Human smoke test — Lenis + page-load fade on production dev server | **DEFERRED** (autonomous: false) | Surfaced via 08-HUMAN-UAT.md for Monty to execute. |

## Preserved Files (git diff)

Plan-07 acceptance step 1: `git diff origin/main -- <three files>` must produce empty output.

```
$ git diff origin/main -- src/components/providers/lenis-provider.tsx src/app/template.tsx src/components/animations/scroll-reveal.tsx

(empty — exit 0, 0 lines)
```

Cross-check via commit history (every Phase 8 commit, looking for any modification to the three preserved files):

```
$ git log --oneline ced6df2^..HEAD -- src/components/providers/lenis-provider.tsx src/app/template.tsx src/components/animations/scroll-reveal.tsx

(empty — no Phase 8 commit touched any of the three files)
```

**Result: PASS ✓** — D-12 preservation contract satisfied. All three files are byte-identical to the pre-phase baseline at `origin/main`. None of the six Phase 8 deletion plans (Plans 01-06) modified any preserved primitive.

## Preservation Tests (vitest)

Plan-07 acceptance step 2: `npx vitest run` over the three preservation test files must report all-pass.

The sandbox kernel file table is small enough that Vitest's default parallel-fork mode hits ENFILE during module discovery (the same environmental block that affected the build attempts). Running each test file under `--no-file-parallelism` works around this without changing test semantics:

```
$ npx vitest run --no-file-parallelism src/__tests__/animations/template.test.tsx
 Test Files  1 passed (1)
      Tests  2 passed (2)   ← MOTION-08 page-fade preservation

$ npx vitest run --no-file-parallelism src/__tests__/animations/scroll-reveal.test.tsx
 Test Files  1 passed (1)
      Tests  2 passed (2)   ← ScrollReveal no-op wrapper preserved

$ npx vitest run --no-file-parallelism src/__tests__/providers/lenis-provider.test.tsx
 Test Files  1 passed (1)
      Tests  1 passed (1)   ← MOTION-08 Lenis smooth-scroll preservation
```

**Total: 3 test files passed, 5 tests passed, 0 failures.**

**Result: PASS ✓** — all preservation contracts hold at the unit-test level.

## Phase Gate (vercel build --prod)

Plan-07 acceptance step 3: `vercel build --prod` exits 0.

**Result: DEFERRED — see 08-HUMAN-UAT.md.**

Attempted in this resume sandbox with the following diagnostic trail:

```
$ npx vercel build --prod --yes
Installing dependencies...
added 7 packages in 5s
Detected Next.js version: 16.2.1
Running "npm run build"
> next build
unhandledRejection Error: Cannot find module './static-paths/app'
Require stack:
- /workspace/node_modules/next/dist/build/utils.js
...
{ "status": "error", "reason": "build_failed",
  "message": "Command \"npm run build\" exited with 1" }
```

Diagnosis: vercel's own pre-build `npm install` re-corrupted the sandbox's Next.js install (the `./static-paths/app` module is part of the Next.js build pipeline that doesn't appear to exist at this exact version in this exact install layout). This is environmental — the same sandbox issue we documented in 08-06-SUMMARY.md (Turbopack ENFILE / webpack framer-motion ESM resolution). None of the six Phase 8 plans introduced a build regression at the source level (TypeScript verifies clean on the modified files per 08-06-SUMMARY.md).

Per CONTEXT.md D-11 and v1.0 retrospective lesson #2, `vercel build --prod` is a production-environment-as-truth gate, not a local-environment-as-truth gate. Running it in Monty's actual environment (which lacks the sandbox-specific node_modules corruption) is the canonical way to discharge this acceptance item. The exact command + expected outcome are recorded in 08-HUMAN-UAT.md.

## Manual Smoke (human-verify)

Plan-07 Task 2: `autonomous: false` — Lenis smooth-scroll + 200-300ms page-load-fade smoke test in a Chrome browser running against `npm run dev`.

**Result: DEFERRED — see 08-HUMAN-UAT.md.**

The plan explicitly marks this task as a human checkpoint (`<task type="checkpoint:human-verify" gate="blocking">`). Under `--auto` execution mode, the workflow's defer protocol surfaces this via 08-HUMAN-UAT.md rather than blocking phase verification. The full 9-step verification script (load `/`, scroll-test, navigate `/about`, observe fade, return to `/`, observe fade again, mobile viewport check, console-error check) is preserved verbatim in 08-HUMAN-UAT.md.

## Decisions Honored

CONTEXT.md decisions honored as listed in plan frontmatter:

- **D-01** — One plan per requirement; MOTION-08 is in the canonical motion-preservation subset
- **D-11** — `vercel build --prod` is the production-readiness phase gate (deferred to Monty's environment via 08-HUMAN-UAT.md; substitution rationale pre-approved at session resume)
- **D-12** — Preserved files (Lenis, template, ScrollReveal) byte-identical to origin/main; preservation tests green
- **D-13** — `/newsletter` clickable carousel untouched (no preserved-file boundary crossed)

## Threat Flags

None. T-08-07 (Tampering — preserved-file integrity) is mitigated by the empty-diff `git diff origin/main` check, which is the canonical D-12 contract. T-08-07b (Tampering — production build artifacts) is deferred but not failed; the production build will run in Monty's actual environment per 08-HUMAN-UAT.md, which is the v1.0 retrospective-mandated correct execution environment for D-11.

## Known Stubs

None. The deferred items (vercel build + manual smoke) are not stubs — they are explicit human-checkpoint acceptance items per the plan's design. Their completion is tracked in 08-HUMAN-UAT.md.

## Phase 8 Closure Status

After this plan, Phase 8 status is:

- Plans 01-06 (Wave 1 motion-deletion work): all complete ✓
- Plan 07 Task 1 (automated preservation checks for D-12): complete ✓ (preservation diff empty; tests pass)
- Plan 07 Task 1 step 3 (D-11 build gate): **DEFERRED to Monty** — surfaced via 08-HUMAN-UAT.md
- Plan 07 Task 2 (manual smoke test): **DEFERRED to Monty** — surfaced via 08-HUMAN-UAT.md (autonomous: false by plan design)

Phase verification (`gsd-verifier`) will mark Phase 8 as `human_needed` rather than `verified`. ROADMAP + STATE will reflect that the phase code work is complete but two human checkpoints remain before formal phase closure.

Wave 2 closes. All work shipped in 12 commits on `main`:

```
26efeca docs(08-06): complete flatten-cascading-delays plan
0e62122 refactor(08-06): flatten cascading delays from event cards
1e63a91 docs(08-05): complete animate-ping removal from FeaturedUpcoming plan
7c1c942 refactor(08-05): remove animate-ping wrapper from FeaturedUpcoming
0a29f84 docs(08-04): complete WritingsCarousel deletion + CSS purge plan
7486a68 refactor(08-04): delete WritingsCarousel + purge orphan scroll-left CSS
1592e99 docs(08-03): complete delete-works-carousel plan
1670fc9 feat(08-03): delete WorksCarousel, replace with minimal Link list
a8026a7 docs(08-02): complete delete-rotating-tagline plan
31ae6b9 feat(08-02): delete RotatingTagline component and homepage call site
0db0573 docs(08-01): complete PhotoCarousel deletion plan
ced6df2 feat(08-01): delete PhotoCarousel and homepage call site (MOTION-01)
```

(plus 08-07-SUMMARY.md / docs commit follows this file.)

## Self-Check: PASSED (with documented deferrals)

- `git diff origin/main -- <3 preserved files>` returns 0 lines ✓
- `git log ced6df2^..HEAD -- <3 preserved files>` returns 0 commits ✓
- `src/__tests__/animations/template.test.tsx` passes (2/2 tests) ✓
- `src/__tests__/animations/scroll-reveal.test.tsx` passes (2/2 tests) ✓
- `src/__tests__/providers/lenis-provider.test.tsx` passes (1/1 test) ✓
- `vercel build --prod` exit-0: **DEFERRED to 08-HUMAN-UAT.md** (sandbox node_modules corruption documented)
- Manual smoke test (Lenis + fade): **DEFERRED to 08-HUMAN-UAT.md** (plan-design human-verify, not a sandbox limitation)
- 08-07-SUMMARY.md exists with all four required sections populated ✓
- No source files modified ✓ (`files_modified: []` honored)
