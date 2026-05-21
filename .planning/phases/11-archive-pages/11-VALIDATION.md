---
phase: 11
slug: archive-pages
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-05-21
---

# Phase 11 — Validation Strategy

> 3 archive pages + 1 new primitive + 1 new data module + 1 date helper extension. Validation = build exits 0 + each route renders + year groupings derive correctly + Substack outbound link present + /events giant numerals visible. Phase 8/9/10 preservation tests still cover Lenis/template/scroll-reveal.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 (preserved from Phase 8/9/10) |
| **Per-task build gate** | `npm run build` exits 0 |
| **Phase production gate** | `vercel build --prod` via Vercel preview deploy (Phase 8/9/10 precedent) |
| **Estimated runtime** | ~30–60s per `npm run build`; ~120s Vercel preview |

---

## Sampling Rate

- **After every task commit:** `npm run build` exits 0 (D-30)
- **After Wave 1 (YearBlock primitive + photos data + dates helper):** import-check + smoke
- **After Plan 11-03:** visual smoke at `/writing` (year-grouped essays + Substack outbound footer)
- **After Plans 11-04 + 11-05:** visual smoke at `/events` (giant numerals) + `/photos` (year-grouped grid)
- **Phase gate:** Vercel preview `● Ready` (D-31)
- **Preservation regression:** Phase 8/9/10 tests still pass — Phase 11 doesn't touch lenis-provider, template, scroll-reveal

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 11-01-V | 01 | 1 | YearBlock primitive | file + grep + build | `test -f src/components/editorial/year-block.tsx` AND `rg "position: sticky\|md:sticky" src/components/editorial/year-block.tsx` ≥1 hit AND `rg "self-start" src/components/editorial/year-block.tsx` ≥1 hit AND `npm run build` exit 0 | ⬜ |
| 11-02-V | 02 | 1 | photos data + day numeral helper | file + grep + build | `test -f src/lib/photos.ts` AND `rg "PHOTOS_BY_YEAR" src/lib/photos.ts` ≥1 hit AND `rg "groupPhotosByYear" src/lib/photos.ts` ≥1 hit AND `rg "formatDayNumeral" src/lib/dates.ts` ≥1 hit AND `npm run build` exit 0 | ⬜ |
| 11-03-V | 03 | 2 | ARCH-01 /writing | route + grep + build | `test -f src/app/writing/page.tsx` AND `rg "Writing\\." src/app/writing/page.tsx` ≥1 hit AND `rg "YearBlock" src/app/writing/page.tsx` ≥1 hit AND `rg "substack.com" src/app/writing/page.tsx` ≥1 hit (D-15 REVISED Substack outbound) AND `rg "href=\"/writing\"" src/app/page.tsx` ≥2 hits (nav + AllLink updates) AND `npm run build` exit 0 | ⬜ |
| 11-04-V | 04 | 3 | ARCH-02 /events | route + grep + build | `rg "Events\\." src/app/events/page.tsx` ≥1 hit AND `rg "formatDayNumeral" src/app/events/page.tsx` ≥1 hit AND `rg "text-\\[84px\\]\|text-feature" src/app/events/page.tsx` ≥1 hit (giant numeral) AND `! test -f src/components/events/event-cards.tsx` (orphan deleted per RESEARCH F6) AND `npm run build` exit 0 | ⬜ |
| 11-05-V | 05 | 3 | ARCH-03 /photos | route + grep + build | `test -f src/app/photos/page.tsx` AND `rg "Photographs\\." src/app/photos/page.tsx` ≥1 hit AND `rg "PHOTOS_BY_YEAR\|groupPhotosByYear" src/app/photos/page.tsx` ≥1 hit AND `rg "YearBlock" src/app/photos/page.tsx` ≥1 hit AND `npm run build` exit 0 | ⬜ |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

**None.** Existing infrastructure covers Phase 11's validation needs.

---

## Manual-Only Verifications (HUMAN-UAT items expected at phase end)

| Behavior | Why Manual | Test Instructions |
|----------|------------|-------------------|
| Vercel build --prod (D-31) | Sandbox node_modules corruption (Phase 8-10 precedent) | Push branch; verify Vercel preview `● Ready` |
| /writing visual: 2-col title block + sticky year labels + 3 YearBlocks + Substack-outbound footer | Perceptual editorial fidelity + sticky positioning behavior | Open `/writing` in Chrome at 1440px. Scroll through year groups; confirm year labels stay sticky on the left until next year scrolls in. Verify Substack CTA opens in new tab. |
| /events visual: 84px featured numeral + 56px non-featured numerals + dense Past 3-col grid | Perceptual signature visual confirmation | Open `/events` at 1440px. First Upcoming row should have a giant 84px day numeral; subsequent rows 56px. Past section is much denser (3-col, 20px row padding). |
| /photos visual: 2 YearBlocks (2025, 2023) + photo plates with captions below | Perceptual confirmation that the empirical year mapping looks right | Open `/photos` at 1440px. Confirm 2 year groupings (2025 first, 2023 below). 6 plates total distributed across them. |
| Mobile parity at 390px on all 3 routes | Perceptual rhythm | DevTools 390px width; confirm year labels non-sticky on mobile; single-column layouts; no horizontal overflow. |

---

## Validation Sign-Off

- [ ] All tasks have automated verify
- [ ] Sampling continuity (grep + build per plan)
- [ ] Wave 0 covers all MISSING (none)
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s

**Approval:** pending
