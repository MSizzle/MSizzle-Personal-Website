# Phase 18: v3.0 QA, Perf Gate & Alias Swap — Pattern Map

**Mapped:** 2026-06-20
**Files analyzed:** 6 artifact files (EVIDENCE + GO-NO-GO)
**Analogs found:** 6 / 6 (100% — Phase 13 is the canonical precedent)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `18-01-EVIDENCE.md` | qa-evidence | report | `13-01-EVIDENCE.md` | exact |
| `18-02-EVIDENCE.md` | qa-evidence | report | `13-02-EVIDENCE.md` | exact |
| `18-03-EVIDENCE.md` | qa-evidence | report | `13-03-EVIDENCE.md` | exact |
| `18-04-EVIDENCE.md` | qa-evidence | report | `13-04-EVIDENCE.md` | exact |
| `18-05-EVIDENCE.md` | qa-evidence | report | `13-05-EVIDENCE.md` | exact |
| `18-GO-NO-GO.md` | qa-verdict | report | `13-GO-NO-GO.md` | exact |

---

## Pattern Assignments

### `18-01-EVIDENCE.md` (qa-evidence: `vercel build --prod` gate)

**Analog:** `.planning/phases/13-v2-0-qa-go-no-go/13-01-EVIDENCE.md`

**Document structure** (lines 1-50):
```markdown
# 13-01 Evidence: vercel build --prod Production Gate

## Gate: QA-V2-01

**Requirement:** `vercel build --prod` exits 0 with zero TS / ESLint / 429 errors

---

## Result: PASS

| Metric | Value |
|--------|-------|
| **Exit Code** | 0 (success) |
| **Build Date** | 2026-05-21T19:26:38Z–19:38:21Z |
| **Git Commit (HEAD at build time)** | `b11afb6` |
| **Next.js Version** | 16.2.1 (Turbopack) |
| **Pages Generated** | 40 static pages |
| **TypeScript Errors** | 0 |
| **ESLint Errors** | 0 |
| **429 (Notion rate-limit) Errors** | 0 |
| **.vercel/output/ Created** | YES — confirmed (see below) |

---

## Error Summary

- TypeScript errors (`Type error:`): **0**
- ESLint errors (`ESLint error`, `@`): **0**
- Notion rate-limit errors (429): **0**
- Build warnings (non-blocking):
  - `[DEP0205]` — `module.register()` deprecated (Node.js deprecation, not a build error)
```

**Verdict section** (lines 130-135):
```markdown
## QA-V2-01 Verdict

**PASS** — `vercel build --prod` exits 0. Zero TS errors, zero ESLint errors, zero 429 errors. 40 pages generated. `.vercel/output/` confirmed for secret scan.
```

**For Phase 18-01, adapt as:**
- Gate ID: `DQ-02` (from CONTEXT.md D-01)
- Requirement: `vercel build --prod` at HEAD of `v3` branch
- Verdict: PASS/FAIL per build exit code
- Record: exit code, TS/ESLint/429 counts, page count, `.vercel/output/` confirmation for secret scan (18-05)

---

### `18-02-EVIDENCE.md` (qa-evidence: Lighthouse desktop gate)

**Analog:** `.planning/phases/13-v2-0-qa-go-no-go/13-02-EVIDENCE.md` (lines 1-70)

**Document structure:**
```markdown
# 13-02 Evidence: Vercel Preview + Lighthouse Desktop

## Gate: QA-V2-02

**Requirement:** Lighthouse desktop ≥ 90/95/95/100 (Performance/Accessibility/Best Practices/SEO) on home / about / prometheus / blog index / blog post

---

## Result: ✅ PASS — All 5 Routes Clear Thresholds

**Update [DATE]:** [status]

### Final Median Scores (after [any] polish)

| Route | Perf | A11y | BP | SEO | Verdict | Δ vs initial |
|-------|------|------|----|----|---------|--------------|
| `/` | **99** | **96** | 100 | 100 | ✓ PASS | [delta] |
| `/about` | 100 | 96 | 100 | 100 | ✓ PASS | [delta] |
| ... | ... | ... | ... | ... | ... | ... |

**Thresholds:** Performance ≥ 90 / Accessibility ≥ 95 / Best Practices ≥ 95 / SEO = 100.

## Raw Per-Run Scores

| Route | Perf runs | A11y runs | BP runs | SEO runs |
|-------|-----------|-----------|---------|----------|
| `/` | [run1] / [run2] / [run3] | [run1] / [run2] / [run3] | 100 / 100 / 100 | 100 / 100 / 100 |
```

**For Phase 18-02, adapt as:**
- Gate ID: D-02 (Lighthouse desktop methodology)
- Routes: v3 homepage `/`, plus interior pages (finalized by planner vs Phases 15–16 shipped routes)
- Thresholds: ≥90 Performance / ≥95 Accessibility / ≥95 Best Practices / 100 SEO
- Methodology: median-of-3 per route, desktop preset, desktop preset only (no local mobile gate per D-02)
- Target URL: v3 Vercel preview URL (from 18-02 deployment step)

---

### `18-03-EVIDENCE.md` (qa-evidence: PSI mobile + WebGL hero LCP gate)

**Analog:** `.planning/phases/13-v2-0-qa-go-no-go/13-03-EVIDENCE.md` (lines 1-56)

**Document structure:**
```markdown
# 13-03 Evidence: PSI Mobile Gate

## Gate: QA-V2-03

**Requirement:** PSI mobile Performance score >= 75 on homepage (v1.0 PSI 77 baseline)

---

## Result: ✅ PASS — Manual PSI Run (Operator, [DATE])

### Final Result (operator's manual PSI run, [DATE])

| Metric | Desktop | Mobile | Threshold | v2.0 baseline |
|--------|---------|--------|-----------|---------------|
| **Performance** | **100** | **82** | ≥ 75 (mobile) | 100 / 77 |
| **Accessibility** | — | 94 | — | — |
| **Best Practices** | — | 100 | — | — |
| **SEO** | — | 100 | — | — |

### Core Web Vitals (Mobile)

| Metric | Value | Status |
|--------|-------|--------|
| First Contentful Paint | 2.6s | orange |
| Largest Contentful Paint | 3.9s | orange |
| Total Blocking Time | 50ms | green ✓ |
| Cumulative Layout Shift | **0** | green ✓ |
| Speed Index | 4.6s | orange |

**Test conditions:** Emulated Moto G Power, Slow 4G throttling, Lighthouse 13.0.1, HeadlessChromium 146.0.7680.177.

### Verdict

**QA-V2-03: ✅ PASS** — Mobile homepage Performance 82 clears the 75 floor.
```

**D-04 LCP verification block (CRITICAL for v3)** — Add after Core Web Vitals section:
```markdown
## WebGL Hero LCP Verification (D-04)

Per the spike-001 GO-WITH-CUTS requirements, explicitly verify:

### 1. LCP Element is Text/Poster, NOT Canvas
- **Verified:** PSI Lighthouse diagnostic reports LCP element = `<h1>` (or fallback poster `<img>`) ✓ / ✗
- **Evidence:** LCP element snapshot from PSI/Lighthouse report
- **Requirement:** Canvas must never be the LCP element

### 2. Mobile Serves Poster, Not WebGL Bundle
- **Verified:** Network tab shows no three.js chunks (885 KB) on mobile ✓ / ✗
- **Evidence:** PSI Mobile-emulated network trace
- **Requirement:** Mobile gate `(pointer:coarse) || innerWidth<760` routes to FallbackPoster

### 3. Canvas Mounts After LCP
- **Verified:** Canvas script does not execute during LCP paint window ✓ / ✗
- **Evidence:** Lighthouse timing waterfall; canvas entry after FCP + LCP
- **Requirement:** CanvasLoader uses requestIdleCallback deferred mount

### 4. fetchPriority="high" on LCP Image/Poster
- **Verified:** Poster/image has `fetchPriority="high"` attribute (Next.js 16 quirk) ✓ / ✗
- **Evidence:** DevTools element inspector on rendered poster
- **Requirement:** Next.js 16 does not auto-emit this; must be explicit

### LCP Verdict
**All 4 assertions verified** ✅ / **Regressions found** ✗ — PSI mobile LCP within budget
```

**For Phase 18-03, adapt as:**
- Gate ID: DQ-03 (from REQUIREMENTS.md)
- Target URL: v3 Vercel preview homepage
- Floor: ≥82 (v2.0 parity per Phase 13), hard floor ≥77 (v1.0 baseline)
- Methodology: Use browser https://pagespeed.web.dev/?url=PREVIEW_URL&form_factor=mobile (avoid API rate-limit)
- Post-promote re-run: Same test against production `montysinger.com` (18-06)
- **Critical addition:** The 4-point D-04 WebGL hero LCP verification (verifies text/poster LCP, mobile poster path, deferred canvas, fetchPriority=high)

---

### `18-04-EVIDENCE.md` (qa-evidence: 375px visual QA)

**Analog:** `.planning/phases/13-v2-0-qa-go-no-go/13-04-EVIDENCE.md` (structure pattern)

**Document structure:**
```markdown
# 18-04 Evidence: Mobile 375px Visual QA

## Gate: D-05 (375px Visual QA Checkpoint)

**Requirement:** Visual QA at 375×667 across homepage + interior pages + `/uses` + `/watching`; fold Phase 16 deferred 4-item checklist.

---

## Result: [PASS / FAIL]

**Date:** [DATE]
**Device emulation:** Chrome DevTools, 375×667, touch simulation
**URL:** v3 Vercel preview

### Checklist

#### Homepage `/`
- [ ] Renders in Pumpkin Amber (orange field, amber/cocoa palette)
- [ ] No v2 paper/ink color visible
- [ ] No horizontal overflow at 375px
- [ ] Mobile poster loads (not WebGL hero) ✓ / ✗
- [ ] Screenshot: `.../screenshots/homepage-375px.png`
- **Verdict:** [PASS / FAIL]

#### Interior Pages (e.g. `/about`, `/blog`, `/projects`, `/writing`)
- [ ] Renders in Pumpkin Amber palette
- [ ] No v2 paper/ink visible
- [ ] No horizontal overflow
- [ ] Screenshot(s): `.../screenshots/[page]-375px.png`
- **Verdict:** [PASS / FAIL]

#### New Pages: `/uses`
- [ ] Page exists and renders ✓ / ✗
- [ ] Pumpkin Amber palette
- [ ] Content loads correctly
- [ ] No horizontal overflow
- [ ] Screenshot: `.../screenshots/uses-375px.png`
- **Verdict:** [PASS / FAIL]

#### New Pages: `/watching`
- [ ] Page exists and renders ✓ / ✗
- [ ] Pumpkin Amber palette
- [ ] YouTube thumbnails load ✓ / ✗
- [ ] Cards open YouTube in new tab ✓ / ✗
- [ ] No horizontal overflow
- [ ] Screenshot: `.../screenshots/watching-375px.png`
- **Verdict:** [PASS / FAIL]

### Phase 16 Deferred 4-Item Checklist (folded into this gate)

Per Phase 16-09-SUMMARY.md:

- [ ] **Item 1:** Notion covers load via `/api/notion-cover` on photo-grid indexes (Writing, Works)
- [ ] **Item 2:** Essay + project detail full-bleed covers load via proxy; type-only fallback when no cover
- [ ] **Item 3:** YouTube thumbnails on `/watching` load and cards open YouTube in new tab
- [ ] **Item 4:** All interior pages render in Pumpkin Amber (amber field, roasted-cocoa ink, teal accent); no v2 palette visible

**All 4 items verified as PASS** ✅ / **Issues found** ✗

### Visual Regression Analysis

Any layout shift, color bleed, or content truncation observed? Describe:

[Description]

### 18-04 Verdict

**PASS** — All routes render correctly at 375px, Pumpkin Amber palette in place, no v2 palette visible, Phase 16 deferred checklist complete.

**FAIL** — [List specific failures and remediation needed]
```

**For Phase 18-04, adapt as:**
- Gate ID: D-05 (Visual QA scope)
- Methodology: Chrome DevTools emulation at 375×667
- Routes: v3 homepage `/`, rebuilt interior pages (inventory from Phases 15–16), plus `/uses` and `/watching`
- Checklist: 4-item Phase 16 deferred items folded in (Notion covers, essay/project covers, YouTube thumbnails, Pumpkin Amber everywhere)
- Capture: Screenshots to `.planning/phases/18-v3-0-qa-perf-gate-alias-swap/screenshots/`
- Verification: Operator walkthrough (human-gated, `autonomous: false` per CONTEXT.md)

---

### `18-05-EVIDENCE.md` (qa-evidence: secret scan + theme decision)

**Analog:** `.planning/phases/13-v2-0-qa-go-no-go/13-05-EVIDENCE.md` (partial — for dual-tree secret scan pattern)

**Document structure (secret scan section):**
```markdown
# 18-05 Evidence: D-14 Secret Scan + D-10 Theme Decision

## Gate 1: D-06 (D-14 Secret Scan)

**Requirement:** Dual-tree grep for `secret_` and `NOTION_TOKEN` returns 0 client leaks.

---

## Result: ✅ PASS — 0 Leaks in Client Bundles

### Command Sequence

After `vercel build --prod` in 18-01, two build trees exist:
- `.next/static/chunks/` (local build artifacts)
- `.vercel/output/static/_next/static/chunks/` (Vercel remote build output)

```bash
# Tree 1: Local build
grep -r "secret_" .next/static/chunks/*.js || echo "✅ 0 secret_ in .next/static/chunks"
grep -r "NOTION_TOKEN" .next/static/chunks/*.js || echo "✅ 0 NOTION_TOKEN in .next/static/chunks"

# Tree 2: Vercel output (what deploys)
grep -r "secret_" .vercel/output/static/_next/static/chunks/*.js || echo "✅ 0 secret_ in .vercel/output"
grep -r "NOTION_TOKEN" .vercel/output/static/_next/static/chunks/*.js || echo "✅ 0 NOTION_TOKEN in .vercel/output"

# Full tree paranoid check
grep -r "secret_" .vercel/output/ || echo "✅ 0 secret_ anywhere in .vercel/output"
```

### Results

| Tree | Search Term | Matches | Status |
|------|---|---|---|
| `.next/static/chunks/` | `secret_` | 0 | ✅ PASS |
| `.next/static/chunks/` | `NOTION_TOKEN` | 0 | ✅ PASS |
| `.vercel/output/static/_next/static/chunks/` | `secret_` | 0 | ✅ PASS |
| `.vercel/output/static/_next/static/chunks/` | `NOTION_TOKEN` | 0 | ✅ PASS |
| `.vercel/output/` (full tree) | `secret_` | 0 | ✅ PASS |
| `.vercel/output/functions/` | `NOTION_TOKEN` (expected) | [N] server-only | ✅ PASS |

**Verdict:** ✅ **D-06 PASS** — 0 client-side secret leaks. Server-only `NOTION_TOKEN` refs appear only in `.vercel/output/functions/` (server-side, expected).

---

## Gate 2: D-10 (Theme / FOUC Decision)

**Requirement:** Record single-mode ship if no dark v3 palette; else FOUC incognito check.

### Decision Path

Check `src/app/globals.css` + provider tree at execution start:

```bash
grep -i "\.dark\|data-theme.*dark" src/app/globals.css
grep -r "next-themes\|ThemeProvider" src/app/
```

**Result from codebase:** [Output from grep above]

### Finding

- **Single-mode (light/Pumpkin Amber only):** 0 dark palette tokens found ✓ / ✗
- **Multi-mode (light + dark shipped):** [N] dark tokens found; proceed to FOUC check ✓ / ✗

### Outcome

**Single-mode v3.0 ship:** Dark-mode Pumpkin Amber variant deferred to v3.1+. v3.0 ships light-only per Phase 14 decisions.

OR

**Multi-mode FOUC test:** Incognito browser → open homepage → verify:
1. System preference light → page renders light (Pumpkin Amber)
2. System preference dark → page renders dark variant
3. No flicker / FOUC between preference change

**Result:** [FOUC test passed / FOUC issues found]

**Verdict:** ✅ **D-10 PASS** — Single-mode ship recorded (or FOUC test clear).
```

**For Phase 18-05, adapt as:**
- Gate 1: D-06 secret scan (dual-tree grep for `secret_` + `NOTION_TOKEN` in client chunks)
- Gate 2: D-10 theme/FOUC (confirm single-mode light ship OR run FOUC incognito check)
- Verdict: PASS/FAIL per both gates
- This is autonomous (no human gating required)

---

### `18-GO-NO-GO.md` (qa-verdict: consolidated sign-off + promotion plan)

**Analog:** `.planning/phases/13-v2-0-qa-go-no-go/13-GO-NO-GO.md`

**Frontmatter structure** (lines 1-12):
```markdown
---
phase: 18-v3-0-qa-perf-gate-alias-swap
type: go-no-go
status: unsigned  [→ signed at execution]
milestone: v3.0
milestone_name: v3.0 Redesign & WebGL Homepage
build_sha: [HEAD of v3 at 18-01]
build_date: [18-01 execution date]
verdict: [GO | NO-GO | GO-with-knowns]
signed_by: [operator]
signed_date: [execution date]
---
```

**Header section** (lines 14-40):
```markdown
# v3.0 Redesign & WebGL Homepage — GO/NO-GO Verdict

**Milestone:** v3.0 (Phases 14–17)
**Build:** `[SHA]` (HEAD at QA gate)
**Production URL:** https://montysinger.com
**Preview URL:** https://m-sizzle-personal-website-[ID]-msizzles-projects.vercel.app

---

## Verdict Summary

**STATUS:** ✅ **[GO | NO-GO | GO-with-knowns] — signed by [operator], [DATE]**

[1–3 sentence summary of gate outcomes]

| Outcome | Description |
|---------|-------------|
| GO | All DQ-* gates PASS → promote to production via `vercel deploy --prod` → run `/gsd-complete-milestone v3.0` immediately |
| NO-GO | Any blocking gate FAIL → remediate before promote |
| GO-with-knowns | Some gates partially deferred with explicit risk acceptance |
```

**Success Criteria Status table** (lines 42–80):
```markdown
## Success Criteria Status

| ID | Requirement | Verdict | Evidence |
|----|-------------|---------|----------|
| **DQ-02** | `vercel build --prod` exits 0, zero TS/ESLint/429 errors | ✅ **PASS** | [18-01-EVIDENCE.md](./18-01-EVIDENCE.md) |
| **DQ-03** | PSI mobile ≥82 parity; WebGL hero NOT LCP element | ✅ **PASS** | [18-03-EVIDENCE.md](./18-03-EVIDENCE.md) — D-04 LCP verification block |
| **DQ-04** | Alias promoted to v3, verified post-promote | ⏳ **THIS DOC** | Executed at sign-off (see Promotion Plan below) |

Plus autonomous gates:
| **D-02** | Lighthouse desktop ≥90/95/95/100 on 5+ routes | ✅ **PASS** | [18-02-EVIDENCE.md](./18-02-EVIDENCE.md) |
| **D-05** | 375px visual QA + Phase 16 deferred checklist | ⏳ **PENDING (human-gated)** | [18-04-EVIDENCE.md](./18-04-EVIDENCE.md) |
| **D-06** | Secret scan: 0 client-side leaks | ✅ **PASS** | [18-05-EVIDENCE.md](./18-05-EVIDENCE.md) |
| **D-10** | Theme decision recorded (single-mode or FOUC clear) | ✅ **PASS** | [18-05-EVIDENCE.md](./18-05-EVIDENCE.md) |

**Score: [N] PASS / [N] PENDING / [N] SIGN-OFF** (as of [DATE])
```

**Promotion Plan block** (lines 120–180):
```markdown
## Promotion Plan (Conditional on GO)

**Recommended path: Merge `v3 → main`, Vercel auto-deploy** (per RESEARCH.md Path B recommendation)

If verdict is GO:

```bash
# 1. Verify final build at HEAD of v3
cd "/Users/Montster/MSizzle Personal Website"
git checkout v3
vercel build --prod

# 2. Merge v3 into main (auditability via merge commit)
git checkout main
git pull origin main
git merge v3 --no-ff -m "chore(release): merge v3 for v3.0 production deployment [Phase 18 GO]"

# 3. Push to trigger Vercel auto-deploy
git push origin main

# Vercel auto-deploy triggers (2–5 min depending on cache state)
# Watch progress: https://vercel.com/msizzles-projects/m-sizzle-personal-website/deployments

# 4. Verify alias was updated (post-promote, wait 5–10 min for deploy to complete)
curl -sS -o /dev/null -w "HTTP %{http_code} | size %{size_download}b\n" https://montysinger.com
# Expected: HTTP 200, ~14KB+ (v3 build)

# 5. Verify v3 markers present (Pumpkin Amber palette)
curl -s https://montysinger.com | grep -i "pumpkin\|amber\|#d93c1e" | head -1

# 6. Dashboard verification
vercel list --prod=true | grep "m-sizzle-personal-website" -A1
# Expected: recent deployment (within 10 min of push)

# 7. Browser spot-check (visual verify Pumpkin Amber, WebGL hero or mobile poster)
# https://montysinger.com — confirm homepage renders with v3 visual markers

# 8. Immediately close milestone (per v1.0 retro lesson #1)
/gsd-complete-milestone v3.0
```

**Rollback move (if alias drifts after promote):**

```bash
# 1. Identify last-known-good v2.0 production deployment
vercel list --prod=true | grep -A2 m-sizzle-personal-website

# 2. Re-alias to v2.0 if needed
vercel alias set https://m-sizzle-personal-website-[OLD_ID]-msizzles-projects.vercel.app montysinger.com

# 3. Or revert the git merge entirely
git revert HEAD~1 --no-edit
git push origin main
# Vercel auto-deploys the reverted state; production rolls back to v2.0
```
```

**Sign-Off block** (lines 200–222):
```markdown
## Sign-Off Block

By signing below, the operator confirms:

- All DQ-* and D-* gates have been evaluated (PASS, FAIL, or explicit risk acceptance)
- The promotion path and alias-drift check are understood
- The `/gsd-complete-milestone v3.0` will be run immediately (v1.0 retro lesson #1)

```
Verdict:    [ GO | NO-GO | GO-with-knowns ]
Signed by:  ____________________  (operator)
Date:       __________
Notes:      ____________________
```
```

**For Phase 18-GO-NO-GO.md, adapt as:**
- Frontmatter: phase=18, type=go-no-go, build_sha=[from 18-01], milestone=v3.0
- Success Criteria: Map DQ-02 / DQ-03 / DQ-04 + D-02 / D-05 / D-06 / D-10 to respective EVIDENCE.md files
- Verdict: Determine GO / NO-GO / GO-with-knowns per gate outcomes
- Promotion Plan: Merge `v3 → main` path (Path B from RESEARCH.md); explicit alias-drift check commands post-promote
- Rollback: Clear procedure if alias drifts
- Sign-Off: Operator confirms gates evaluated + milestone close will run immediately

---

## Shared Patterns

### DQ-03 / D-04: WebGL Hero LCP Verification

**Source:** `.planning/phases/13-v2-0-qa-go-no-go/13-03-EVIDENCE.md` + CONTEXT.md D-04

**Apply to:** `18-03-EVIDENCE.md` (primary gate) + `18-GO-NO-GO.md` (verdict row for DQ-03)

**Concrete pattern (4-point assertion block):**
```markdown
## WebGL Hero LCP Verification (D-04)

Per the spike-001 GO-WITH-CUTS requirements, explicitly verify:

### 1. LCP Element is Text/Poster, NOT Canvas
- **PSI/Lighthouse diagnostic:** LCP-element field should report `<h1>` or fallback poster `<img>`, never `<canvas>`
- **Evidence:** Screenshot of PSI/Lighthouse metrics section showing LCP-element value
- **Requirement:** Text/poster must be the LCP element; canvas deferred to post-LCP paint window

### 2. Mobile Serves Poster, Not WebGL Bundle
- **Detection:** PSI Mobile (Moto G Power, Slow 4G emulation) network trace should show NO three.js chunks (expected ~885 KB if loaded)
- **Fallback asset:** `/public/hero-blob-poster.webp` (~5 KB WebP) should load instead
- **Requirement:** `showCanvas = !isTouchOrSmall && !prefersReduced && webglOk` gate must route mobile to FallbackPoster

### 3. Canvas Mounts After LCP
- **Verification:** Lighthouse timing waterfall or DevTools Performance tab should show canvas script execution AFTER FCP + LCP
- **Expected behavior:** `requestIdleCallback` with 200ms Safari fallback defers canvas mount until post-LCP idle window
- **Requirement:** Canvas cannot execute during the LCP paint; must be deferred

### 4. fetchPriority="high" on LCP Image/Poster
- **Element check:** DevTools element inspector on the rendered poster → Image component should have `fetchPriority="high"` attribute
- **Why it matters:** Next.js 16 does not auto-emit this resource hint; explicit attribute is required for browser LCP request discovery
- **Requirement:** If fetchPriority is missing, LCP element discovery fails and canvas may become LCP by default

**Verdict:** All 4 assertions verified ✅ / Regressions found (describe) ✗
```

**Apply this to:** Every PSI/Lighthouse run in `18-03-EVIDENCE.md` and reference in `18-GO-NO-GO.md` verdict row for DQ-03.

---

### Alias-Drift Prevention (Post-Promote)

**Source:** RESEARCH.md D-08 Path B (merge to main) + CONTEXT.md operational memory

**Apply to:** `18-GO-NO-GO.md` Promotion Plan section

**Concrete pattern (verification commands):**
```bash
# 1. HTTP smoke test (status code + size check)
curl -sS -o /dev/null -w "HTTP %{http_code} | size %{size_download}b\n" https://montysinger.com
# Expected: HTTP 200, ~14KB+ (v3 production size)

# 2. Content marker verification (Pumpkin Amber palette)
curl -s https://montysinger.com | grep -i "pumpkin\|amber\|#d93c1e" | head -1
# Expected: at least one color marker from v3 palette

# 3. Deployment recency check (Vercel dashboard)
vercel list --prod=true | grep "m-sizzle-personal-website" -A1
# Expected: recent timestamp (deploy completed within 10 min of push)

# 4. Browser visual spot-check
# Open https://montysinger.com in fresh browser
# Verify: Pumpkin Amber palette visible, WebGL hero on desktop / fallback poster on mobile
```

**Fallback (if alias is wrong):**
```bash
# Re-alias to last-known-good v2.0 deployment
vercel list --prod=true | grep -A2 m-sizzle-personal-website  # find old deployment ID
vercel alias set https://m-sizzle-personal-website-[OLD_ID]-msizzles-projects.vercel.app montysinger.com

# OR revert the git merge
git revert HEAD~1 --no-edit
git push origin main
```

---

## No Analog Found

All Phase 18 artifacts map directly to Phase 13 analogs. No new patterns discovered.

---

## Metadata

**Analog search scope:** `.planning/phases/13-v2-0-qa-go-no-go/` + `.planning/milestones/v1.0-phases/06-pre-launch-qa/`

**Files scanned:** 6 Phase-13 EVIDENCE.md + GO-NO-GO.md + 1 Phase-6 GO-NO-GO.md

**Pattern extraction date:** 2026-06-20

**Confidence:** HIGH — Phase 18 is a verification+ship phase that mirrors Phase 13 exactly. All QA methodologies (build gate, Lighthouse, PSI, visual QA, secret scan, GO doc) are inherited wholesale. The one novel gate (D-04: WebGL hero LCP verification) is a specialization of the existing PSI/Lighthouse methodology with concrete D-04 assertions added to 18-03-EVIDENCE.md and 18-GO-NO-GO.md DQ-03 row.
