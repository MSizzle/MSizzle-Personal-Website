---
phase: "08-motion-subtractions"
status: "pending_human"
created: "2026-05-21"
pending_items: 2
plan_origins:
  - 08-07
deferred_from: "08-07 Task 1 step 3 (D-11 phase gate) + 08-07 Task 2 (manual smoke test, autonomous: false)"
---

# Phase 08 — Human UAT (Manual Verification Items)

This file captures the two acceptance items from Plan 07 that require Monty's local environment / human perception and could not be discharged from the resume sandbox. Both must PASS before Phase 8 is formally closed and the milestone advances.

## Item 1 — Phase Gate: `vercel build --prod` (CONTEXT.md D-11)

**Why human-only:** The phase gate is meant to run in Monty's actual development environment per CONTEXT.md D-11 + v1.0 retrospective lesson #2 ("production-build-as-truth, not local dev/lint"). The resume sandbox's `node_modules` is partially corrupted (Turbopack ENFILE + webpack framer-motion ESM + vercel-installer re-corruption of Next.js modules — see 08-06-SUMMARY.md and 08-07-SUMMARY.md for diagnostics). None of these are caused by Plan 06's or Plan 07's changes; they are environmental.

**How to verify:**

```bash
cd "/Users/Montster/MSizzle Personal Website"
git status                         # confirm clean working tree (the 12 Phase 8 commits already on main)
git log --oneline origin/main..HEAD | wc -l   # expect 20 (commits ahead of origin/main: 18 from earlier + 2 from this session)
npx vercel build --prod            # expect: exit 0; "Build Completed" success line
echo "EXIT=$?"                     # expect: EXIT=0
```

**On PASS:** Append to this file under `## Resolution` with the exit code and "PASS — vercel build exit 0 on <date>".

**On FAIL:** Record the error output verbatim and reopen Phase 8 as a regression — this would mean Plans 01-06 introduced a production-only build break that local TS + tests didn't catch (which the v1.0 retrospective explicitly warns about).

## Item 2 — Manual Smoke Test: Lenis Smooth Scroll + Page-Load Fade (Plan 07 Task 2)

**Why human-only:** The plan explicitly marks this task as `<task type="checkpoint:human-verify" gate="blocking">` — perceptual verification of motion-quality that no automated check can observe. An executor agent cannot view a rendered browser.

**How to verify (9-step script from 08-07-PLAN.md Task 2):**

1. In a fresh terminal at the project root: `npm run dev`
2. Wait for Next.js to report "Ready" at `http://localhost:3000`
3. Open Chrome (or Chromium) in a **normal (not incognito) window**. Disable any reduced-motion OS setting for this test.
4. Visit `http://localhost:3000/`
5. Use the mouse wheel and the trackpad two-finger gesture to scroll the homepage top → bottom and back. **Confirm scrolling feels smoothed (Lenis interpolated)** — not the OS default "snappy" wheel scroll.
6. Click the **"More About Me"** link in the Hero section (navigates to `/about`). **Confirm that during the route change, the new page fades in over ~200–300ms with a slight upward translate.** **Confirm there is NO visible carousel, NO rotating tagline, NO pulsing dot anywhere.**
7. Click the **browser back button** to return to `/`. **Confirm the fade fires again on `/`.**
8. Open **Chrome DevTools console**. **Confirm no red errors** mentioning `lenis`, `motion`, `template`, `provider`, or `framer`.
9. (Optional but recommended) Repeat steps 4–7 at a **390px viewport** via DevTools device toolbar to confirm mobile-pass parity.
10. Stop the dev server (Ctrl+C).

**On PASS:** Update this file under `## Resolution` with verdict + observations. Recommended note format:

```markdown
- Step 5 (Lenis smooth scroll): <PASS/FAIL — describe felt smoothness vs OS default>
- Step 6 (fade on / → /about): <PASS/FAIL — describe fade timing + absence of deleted elements>
- Step 7 (fade on /about → /): <PASS/FAIL — describe fade firing on return navigation>
- Step 8 (DevTools console): <PASS/FAIL — list any errors or "clean">
- Step 9 (mobile 390px viewport, optional): <PASS/FAIL/SKIPPED>
- Overall verdict: PASS | FAIL: <description>
```

**On FAIL:** The verifier will treat MOTION-08 as a gap and trigger gap-closure planning (a new plan to investigate which deletion regressed Lenis or the fade). Specifically:
- Scroll feels native (snappy, not smoothed) → Lenis got unwired somewhere; check `src/app/layout.tsx` provider hierarchy and `src/components/providers/lenis-provider.tsx` mount path
- Fade doesn't fire on route change → `src/app/template.tsx` got unmounted or broke; check `<AnimatePresence>` + `<m.div>` chain
- Console errors mentioning Lenis/Motion/Provider → import broke somewhere; check imports against pre-phase HEAD

## Resolution

> *To be filled in by Monty after running both items.*
>
> Once both PASS, run `gsd-sdk query phase.complete 08` (or `/gsd:phase-complete 08`) to formally close Phase 8 in ROADMAP + STATE. The 08-HUMAN-UAT.md `status: pending_human` should flip to `status: verified_human` at that point.

## Cross-References

- 08-07-PLAN.md — original plan defining both items
- 08-07-SUMMARY.md — automated portion of Plan 07 (preservation diff + Vitest pass log)
- 08-VERIFICATION.md (created by gsd-verifier) — phase verification rollup, should reference this file
- 08-CONTEXT.md D-11, D-12 — decisions this UAT discharges
- .planning/RETROSPECTIVE.md (v1.0) lesson #2 — production-build-as-truth (Why D-11 lives in Monty's environment, not the sandbox)
