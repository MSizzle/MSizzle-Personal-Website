# 13-06 Evidence: GO/NO-GO Sign-Off + Milestone Close

## Gate: QA-V2-07

**Requirement:** A signed `13-GO-NO-GO.md` exists with an explicit GO verdict, and `/gsd:complete-milestone v2.0` is run AT that verdict (carryforward from v1.0 retro lesson #1).

---

## Status

| Item | Status |
|------|--------|
| `13-GO-NO-GO.md` drafted | ✓ DONE — auto-populated with 3 PASS gates and 3 PENDING gates |
| 3 PENDING gates filled in | ⏳ awaiting operator completion of 13-02 / 13-03 / 13-04 |
| Verdict frontmatter set | ⏳ pending operator decision |
| `signed_by` / `signed_date` filled | ⏳ pending operator signature |
| `/gsd:complete-milestone v2.0` invoked | ⏳ pending GO sign-off |

## What the Operator Must Do

1. **Complete the 3 pending gates** by following the explicit instructions in each EVIDENCE.md:
   - `13-02-EVIDENCE.md` (Lighthouse desktop) — Path A/B/C, your pick
   - `13-03-EVIDENCE.md` (PSI mobile) — manual run at pagespeed.web.dev
   - `13-04-EVIDENCE.md` (375px visual QA) — Chrome DevTools inspection on 4 routes

2. **Update each EVIDENCE.md** with the captured measurements (Lighthouse medians, PSI score + CWV, 375px PASS/FAIL per route + screenshots)

3. **Re-open `13-GO-NO-GO.md`** and:
   - Update the Success Criteria Status table verdicts (PASS / FAIL per row)
   - Set frontmatter `verdict:` to one of `GO`, `NO-GO`, or `GO-with-knowns`
   - Set frontmatter `signed_by:` and `signed_date:`
   - Commit: `git add .planning/phases/13-v2-0-qa-go-no-go/13-GO-NO-GO.md && git commit -m "feat(13-06): sign v2.0 GO verdict"`

4. **If verdict == GO:** immediately run

   ```bash
   /gsd:complete-milestone v2.0
   ```

   Do not defer. v1.0 retro lesson #1 is the carryforward: bookkeeping drift after a GO verdict makes milestone close much harder than the close itself.

5. **If verdict == GO and you want to promote to production:**

   ```bash
   vercel deploy --prebuilt --prod
   ```

   The prebuilt output at `.vercel/output/` (built 2026-05-21 at HEAD `ef05f24`) is ready to promote.

## Evidence Chain

| Evidence Source | What It Shows | Status |
|-----------------|---------------|--------|
| `13-01-EVIDENCE.md` | Build gate PASS | ✓ |
| `13-02-EVIDENCE.md` | Preview deploy + Lighthouse path | partial |
| `13-03-EVIDENCE.md` | PSI manual-run instructions | partial |
| `13-04-EVIDENCE.md` | 375px visual QA checklist | partial |
| `13-05-EVIDENCE.md` | Secret scan + dark-mode PASS | ✓ |
| `13-GO-NO-GO.md` | Aggregated verdict (this gate) | draft |

## Verdict

**QA-V2-07: PENDING** — GO doc drafted; operator must complete the 3 pending gates, sign the verdict, and run `/gsd:complete-milestone v2.0` immediately.
