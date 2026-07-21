---
phase: 21-mono-homepage-rebuild
verified: 2026-07-21T15:35:00Z
status: human_needed
score: 6/6 must-haves verified + 3 human claims pending
re_verification: false
human_verification:
  - test: "Fade timing feel"
    expected: "The opacity fade-up motion reads as deliberate (intentional design choice), not as a slow page load"
    why_human: "Subjective UI perception; requires viewing in real browser and comparing against designer intent"
  - test: "375px responsive collapse"
    expected: "Building and Writing rows genuinely collapse gracefully at 375px viewport width, not just fitting within the space"
    why_human: "Visual responsive behavior; requires real browser resize test or viewport simulation"
  - test: "Mono system reads as intentional"
    expected: "The finished homepage reads as an intentional, designed mono aesthetic rather than an unstyled fallback"
    why_human: "Overall design aesthetic judgment; requires human eye to confirm against sketch 015 variant E and compare against 'accidentally unstyled' baseline"
---

# Phase 21: Mono Homepage Rebuild Verification Report

**Phase Goal:** The homepage is a quiet editorial index built to sketch 015 variant E — a visitor lands on type, scans work and writing, and meets no pitch.

**Verified:** 2026-07-21T15:35:00Z  
**Status:** human_needed  
**Re-verification:** No (initial verification)

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Above the fold a visitor sees type only: no rotating portrait carousel, no photograph appears in the hero | ✓ VERIFIED | `src/components/home/hero.tsx` renders only type (eyebrow, H1, subtitle, meta row). No `<Image>` or `<img>` nodes anywhere in the component. Test `hero.test.tsx` line 40 asserts `expect(container.querySelectorAll('img, [class*="image"]').length).toBe(0)`. Commit 790e50d confirmed type-only hero structure. |
| 2 | Building renders as a Swiss numbered index (001, 002, 003) whose rows invert to a solid black block on hover | ✓ VERIFIED | `src/components/home/section-building.tsx` lines 51-64 render `<a className="a-row">` with `<span className="num">{String(i + 1).padStart(3, "0")}</span>` for zero-padded numbering. CSS rule `src/app/globals.css` lines 659-673 defines `.a-row::before` creating the black `background: var(--color-invert)` block, triggered by `.a-row:hover::before { opacity: 1; }` and `.a-row:focus-visible::before { opacity: 1; }`. Test `section-building.test.tsx` (7 tests) verifies row structure and hover classes. |
| 3 | Writing renders in terminal format (~/writing, dates left, read time right) with no frame around it | ✓ VERIFIED | `src/components/home/section-writing.tsx` lines 61-89 render `.e-term` wrapper with `.hd` header containing `~/writing` text (line 66) and `border-bottom` rule (CSS line 790). Rows use `.e-post` with 3-column grid: `grid-template-columns: 104px 1fr 92px` (date / title / read-time). `.dt` class for dates, `.rd` class for read time. CSS rule `.e-term .hd { border-bottom: 1px solid var(--color-border); }` provides the only frame. Test `section-writing.test.tsx` verifies merged post/issue rendering and terminal format. |
| 4 | Scrolling the homepage moves across one continuous white ground with no alternating light/dark band slam | ✓ VERIFIED | `src/components/home/explorative-homepage.tsx` line 50 renders outer `<div className="min-h-screen bg-bg">` (white background via `--color-bg: #ffffff` in `globals.css` line 8). Band order: Hero (no class), SectionBuilding (`.a-sec` section), SectionWriting (`.a-sec` section), Loves (`.band` section). Zero `band-dark` classes anywhere in home components (verified via grep). Build output confirms `/` prerender as static with light ground applied. |
| 5 | A visitor can reach work and essays without passing a subscribe CTA; Monty Monthly appears only as a quiet footer-level line | ✓ VERIFIED | `src/components/home/explorative-homepage.tsx` has no imports of `section-newsletter.tsx`, `section-work.tsx`, `monty-monthly-carousel.tsx`, or subscribe components. Hero meta-row (line 32-39 in `hero.tsx`) shows "Building Prometheus" as plain text (no link, no CTA button). Deleted components confirmed gone: `section-newsletter.tsx`, `section-work.tsx`, `monty-monthly-carousel.tsx` are missing from `src/components/home/` directory. Footer (verified in `src/components/layout/site-footer.tsx` line 27) contains `{ label: "Monty Monthly", href: "https://montymonthly.substack.com" }` as a quiet footer link. Test `explorative-homepage.test.tsx` line asserts `expect(queryByText(/subscribe/i)).toBeNull()`. |
| 6 | The only motion left on the page is a slow opacity fade-up on scroll; hero marquee, pulsing dot, photo ken-burns, and slide-in reveals are gone | ✓ VERIFIED | `src/components/home/scroll-reveals.tsx` observes only `.reveal` class (line 24: `const selector = ".reveal"`). No CSS animation classes for `pcarousel`, `pslide`, `statustag`, `hero-ticker`, `kenburns`, `breathe`, `slide`, `shadowed` anywhere in rendered homepage tree. Motion-audit test (line 49-55 in `motion-audit.test.tsx`) renders real unmocked homepage tree and asserts `querySelectorAll(".kenburns, .breathe, .slide, .shadowed, .hero-ticker, .statustag").length === 0`. Commit f1823ab confirms motion-audit gate passing. Hero component has zero photo/motion classes. PhotoMarquee component (lines 28-52 in `photo-marquee.tsx`) is static with no `.slide` animation. |

**Score:** 6/6 observable truths verified

### Required Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/components/home/hero.tsx` | ✓ VERIFIED | Type-only hero: eyebrow, H1, subtitle, 3-cell meta row. No photos, no motion classes. 68 lines. Test coverage: `hero.test.tsx` (7 tests). Commit 790e50d. |
| `src/components/home/section-building.tsx` | ✓ VERIFIED | Swiss numbered index with `projects` prop. Row rendering with .a-row CSS class. Accepts `projects?: Project[]` array, row 001 hardcoded Prometheus, remaining rows from Notion data. Commit ef9933d. |
| `src/components/home/section-writing.tsx` | ✓ VERIFIED | Terminal Writing log merging blog posts + Monty Monthly issues. `section-writing.tsx` (92 lines) with `.e-term` wrapper and `.e-post` rows. Accepts `posts?: BlogPost[]` and `montyIssues?: MontyMonthlyIssue[]` props. Uses `estimateReadingTime()` utility. Newest-first sort, capped at 5 rows. Commit: created in Plan 21-03. |
| `src/components/home/explorative-homepage.tsx` | ✓ VERIFIED | Rebuilt orchestrator: Hero → Building → Writing → Loves on one white ground. Zero `band-dark` classes. `id="loves"` preserved on Loves wrapper for footer's `/#loves` link. All four data props with defaults to `[]`. Commit ef9933d. |
| `src/app/page.tsx` | ✓ VERIFIED | Fetches `getPublishedPosts()` (new in this phase) defensively with `try {} catch {} → []` pattern. Forwards `posts` prop to orchestrator alongside existing `projects`, `montyIssues`, `loves`, `loveCategories`. `revalidate = 1800` matches /building and /writing ISR cycle. Commit ef9933d. |
| `src/components/home/scroll-reveals.tsx` | ✓ VERIFIED | IntersectionObserver narrowed to `.reveal` selector only (line 24). Threshold 0.05, rootMargin `-8%` (line 48). Respects `prefers-reduced-motion` (lines 32-35). Doc comment updated noting `.slide`/`.shadowed` retirement. Commit 48737e2. |
| `.a-row` CSS family (`src/app/globals.css`) | ✓ VERIFIED | Full-row grid layout (lines 624-649). Hover/focus inversion via `.a-row::before { background: var(--color-invert); }` and `::before { opacity: 1; }` on `:hover` and `:focus-visible` (lines 642-673). Responsive collapse at 860px (lines 838-850): columns reduce from 4 to 2. No `.a-row` use outside homepage confirmed (grep shows only section-building.tsx). |
| `.e-term` / `.e-post` CSS family (`src/app/globals.css`) | ✓ VERIFIED | `.e-term` mono font wrapper with `.hd` header + border-bottom (lines 788-809). `.e-post` grid layout (3-column: 104px date / 1fr title / 92px read-time; lines 810-847). Same full-row invert mechanism as `.a-row` via `.e-post::before`. Responsive hide at 860px: read-time `.rd` hidden (line 842). |
| Motion CSS retuned | ✓ VERIFIED | `.reveal { transform: translateY(14px); transition: opacity 0.7s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1); }` (lines 819-822). Matches sketch's exact 700ms timing and easing. `.reveal.in { opacity: 1; transform: none; }` (lines 823-826). Reduced-motion blocks narrowed to `.reveal` only (lines 827-831, 895-898). Commit 48737e2. |
| Deleted components | ✓ VERIFIED | `section-work.tsx`, `section-newsletter.tsx`, `monty-monthly-carousel.tsx`, `rail-box.tsx` confirmed deleted from `src/components/home/`. Test file `section-work.test.tsx` deleted. Suite runs clean (191 passed, no import errors for deleted modules). Commit 1b1ea04. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `page.tsx` | `getPublishedPosts()` | Fetch import | ✓ WIRED | Line 7: `import { getPublishedPosts, type BlogPost } from "@/lib/notion"`. Line 41: `posts = await getPublishedPosts()`. Real data fetched from Notion, defensive try/catch. Forwards to orchestrator prop. |
| `page.tsx` | `ExplorativeHomepage` | `posts` prop | ✓ WIRED | Line 47: `<ExplorativeHomepage ... posts={posts} />`. Four data sources (projects, montyIssues, loves, posts) all forwarded to orchestrator with defaults. |
| `explorative-homepage.tsx` | `Hero` | Mount | ✓ WIRED | Line 55: `<Hero />`. Hero is a no-prop Server Component (exported as function in `hero.tsx` line 10). Renders type-only content. |
| `explorative-homepage.tsx` | `SectionBuilding` | `projects` prop | ✓ WIRED | Line 57: `<SectionBuilding projects={projects} />`. Prop forwarded from page.tsx. Component maps `projects` array starting with hardcoded Prometheus row, then real Notion projects. |
| `explorative-homepage.tsx` | `SectionWriting` | `posts`, `montyIssues` props | ✓ WIRED | Line 59: `<SectionWriting posts={posts} montyIssues={montyIssues} />`. Both arrays accepted, merged by `SectionWriting`, sorted newest-first, capped at 5. |
| `SectionBuilding` | `section-building.test.tsx` | Test coverage | ✓ VERIFIED | 7 tests: renders all rows, checks .a-row class, verifies numbering (001, 002...), checks href structure (external for Prometheus, internal for others). Test file exists and passes. |
| `SectionWriting` | `section-writing.test.tsx` | Test coverage | ✓ VERIFIED | 6 tests: merged post/issue list, date filtering, newest-first sort, 5-row cap, all posts link. Test file exists and passes. |
| `motion-audit.test.tsx` | Real homepage tree | Unmocked render | ✓ VERIFIED | Test renders `<ExplorativeHomepage />` without mocks (real Hero, Building, Writing, Loves, Photo fallback, ScrollReveals). Asserts zero motion classes. Passes (commit f1823ab). |
| `scroll-reveals.tsx` | `.reveal` class | IntersectionObserver selector | ✓ WIRED | Line 24: `const selector = ".reveal"`. Every top-level hero/building/writing element carries `className="reveal"` (verified in source: hero.tsx lines 13, 17, 21, 27; section-building.tsx line 54; section-writing.tsx line 65). CSS transition fires on `.reveal.in`. |
| Footer `/#loves` link | Loves section | `id="loves"` | ✓ WIRED | `explorative-homepage.tsx` line 61: `<section className="band" id="loves">`. Verified in `site-footer.tsx` that footer contains a link with `href="/#loves"` (test `footer.test.tsx` asserts this). Anchor resolves correctly. |

### Data-Flow Trace (Level 4)

| Component | Data Variable | Source | Produces Real Data | Status |
|-----------|-------------|--------|-------------------|--------|
| SectionBuilding | `projects` array | `page.tsx` → `getFeaturedProjects()` | Yes - queries Notion Featured Projects | ✓ FLOWING |
| SectionWriting posts | `posts` array | `page.tsx` → `getPublishedPosts()` | Yes - queries Notion published blog posts | ✓ FLOWING |
| SectionWriting issues | `montyIssues` array | `page.tsx` → `fetchMontyMonthlyIssues()` | Yes - fetches from Substack RSS | ✓ FLOWING |
| SectionLoves items | `loves` array | `page.tsx` → `getLovesData()` | Yes - queries Notion Things I Love database | ✓ FLOWING |
| Hero meta-row | Static text | `hero.tsx` hardcoded | N/A - intentional static content | Static (correct) |
| Building rows | Notion data (title, description, year) | `projects[].title`, `.description`, `.lastEdited` | Yes - Notion fields flowing through | ✓ FLOWING |
| Writing merged list | Mixed Notion + RSS | `posts` + `montyIssues` merged | Yes - real blog + real Substack issues | ✓ FLOWING |
| Fade-up motion | Viewport intersection | `IntersectionObserver` on `.reveal` | Real scroll events trigger | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All homepage tests pass | `npx vitest run src/__tests__/home/` | 40 tests passed, 0 failed | ✓ PASS |
| Motion-audit gate passes | `npx vitest run src/__tests__/home/motion-audit.test.tsx` | 1 test passed | ✓ PASS |
| Build is clean | `npx next build` | `✓ Compiled successfully`, routes prerender | ✓ PASS |
| Homepage renders as static | Build output | Route (/) marked `○ (Static) prerendered`, revalidate 30m | ✓ PASS |
| Zero motion classes in tree | `npm run motion-audit` (test) | `querySelectorAll(".kenburns, .breathe, .slide, .shadowed, .hero-ticker, .statustag").length === 0` | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| HP-01 | Plan 21-01 | Type-only hero, no photos above fold | ✓ SATISFIED | Hero component renders text only (eyebrow, H1, subtitle, meta row). No Image/img nodes. Test `hero.test.tsx` 40 asserts zero image nodes. Commit 790e50d. |
| HP-02 | Plan 21-02 | Swiss numbered Building index, row inversion on hover | ✓ SATISFIED | `section-building.tsx` renders 001/002/003 rows with `.a-row` class. CSS `.a-row::before { background: var(--color-invert); opacity: 1 on :hover/:focus-visible`. Test `section-building.test.tsx` verifies structure. Commit ef9933d. |
| HP-03 | Plan 21-03 | Terminal Writing log (~writing, dates left, read time right) | ✓ SATISFIED | `section-writing.tsx` renders `.e-term` with `~/writing` header, `.e-post` rows with date/title/read-time grid. CSS `.e-term .hd { border-bottom }` provides only frame. Test `section-writing.test.tsx` verifies format. Commit: created in Plan 21-03. |
| HP-04 | Plan 21-05 | One continuous white ground, no band-dark | ✓ SATISFIED | `explorative-homepage.tsx` renders all bands on `bg-bg` (white). Zero `band-dark` classes in home components. Orchestrator test asserts `querySelectorAll('[class*="band-dark"]').length === 0`. Commit ef9933d. |
| HP-05 | Plan 21-05 | No subscribe CTA above footer, Monty Monthly in footer only | ✓ SATISFIED | Deleted `section-newsletter.tsx`, `section-work.tsx`, `monty-monthly-carousel.tsx`. Hero has no CTA button. Footer contains Monty Monthly link (verified in `site-footer.tsx` line 27). Test `explorative-homepage.test.tsx` asserts `queryByText(/subscribe/i) === null`. Commit 1b1ea04. |
| MS-01 | Plan 21-01 & 21-04 | Hero marquee, pulsing dot, photo ken-burns, slide-in reveals deleted | ✓ SATISFIED | Deleted hero marquee/pulsing-dot CSS (`.pcarousel`, `.pslide`, `.statustag`, `.hero-ticker`). Photo component has no `.kenburns` class. PhotoMarquee is static (no `.slide` animation). Motion-audit test confirms zero motion classes. Commits 790e50d, 48737e2. |
| MS-02 | Plan 21-06 | Only slow opacity fade-up survives | ✓ SATISFIED | `.reveal` retuned to 700ms, 14px translateY, cubic-bezier(0.22, 0.61, 0.36, 1). ScrollReveals observes only `.reveal`. CSS `.reveal.in { opacity: 1; transform: none; }` applies fade-up. All other motion classes deleted. Motion-audit gate confirms. Commit 48737e2. |

## Code Quality

### Anti-Patterns Found

#### Files Scanned
- `src/components/home/hero.tsx` (68 lines)
- `src/components/home/section-building.tsx` (69 lines)
- `src/components/home/section-writing.tsx` (92 lines)
- `src/components/home/explorative-homepage.tsx` (69 lines)
- `src/app/page.tsx` (57 lines)
- `src/components/home/scroll-reveals.tsx` (61 lines)
- `src/components/home/photo.tsx` (77 lines)
- `src/components/home/photo-marquee.tsx` (53 lines)
- `src/app/globals.css` (1500+ lines scanned for phase 21 changes)
- Test files: 6 files, 40 tests, all passing

#### Issues Found

**Severity: ℹ️ Info**

1. **Dead `.avail` CSS reference** (`src/app/globals.css` line 598)
   - `.avail .dot { animation: pulse 2s; }` references `@keyframes pulse`, which was deleted in Plan 21-01
   - No JSX consumer for `.avail` found anywhere in codebase
   - Not a phase-21 regression (dead since Plan 21-01), already noted in code review

2. **Stale doc comments** (`src/components/home/explorative-homepage.tsx` line 24)
   - Comment reads "ScrollReveals: headless IO island toggling .in on .reveal/.slide/.shadowed"
   - But Plan 21-06 retired `.slide` and `.shadowed`; should read ".reveal" only
   - Code review finding WR-02; code behavior is correct, only documentation is stale

3. **Unused CSS custom property** (`src/app/globals.css` line 641)
   - `.a-sec { padding: var(--space-32, 128px) 0 0; }` — `--space-32` is never declared
   - Fallback value 128px always applies; behavior correct but variable reference is dead weight
   - Code review finding IN-01

4. **Unused stagger hook** (`src/app/globals.css` line 819)
   - `.reveal { transition-delay: var(--d, 0s); }` implies stagger capability
   - No component ever sets inline `style={{ "--d": ... }}` for staggering
   - All `.reveal` elements fade simultaneously; not a regression, predates phase 21
   - Code review finding IN-02

5. **Potential NaN in Building status** (`src/components/home/section-building.tsx` line 39-40)
   - `status: project.tags?.[0] || String(new Date(project.lastEdited).getUTCFullYear())`
   - If `project.lastEdited` is malformed/missing, `getUTCFullYear()` returns NaN
   - Would display literal text "NaN" in status column
   - Low risk (Notion reliably supplies `last_edited_time`); code review finding IN-04

6. **Swallowed fetch errors** (`src/app/page.tsx` lines 29-42)
   - All four data fetches use empty `catch {}` blocks with no logging
   - Silent failures in production (bad Notion token, DB drift, RSS down) would be indistinguishable from "no content"
   - Matches pre-existing project convention (found in `/building`, `/writing` pages), not a phase-21 regression
   - Code review finding WR-01

**Severity: 🛑 Blocker** (if present) — **None**

All critical issues identified in code review (stale `@ts-expect-error` in motion-audit.test.tsx) were already fixed by the executor. TypeScript compilation passes with only pre-existing unrelated errors in `robots.test.ts`.

## Human Verification Required

**Three manual checks that cannot be mechanically verified:**

Per Plan 21-06's human-verify checkpoint (which was AUTO-APPROVED under --auto mode, NOT actually verified by a human eye):

### 1. Fade Timing Feel

**Test:** Open the homepage (`/` or `v4-mono` Vercel preview URL) in a real browser. Scroll down at normal reading speed (not rapid scroll-thrashing). Observe the opacity fade-up on hero elements, Building rows, Writing rows, and Things I Love section.

**Expected:** The fade motion reads as a deliberate design choice (intentional slow reveal), not as a page-load stutter or jank. The 700ms duration with cubic-bezier(0.22, 0.61, 0.36, 1) easing should feel smooth and deliberate.

**Why human:** Subjective perception of animation timing. Automated tests can verify CSS values and IntersectionObserver wiring, but cannot judge whether the motion "feels right" in a real viewport at human scroll speed.

### 2. 375px Responsive Collapse

**Test:** Resize the browser to 375px viewport width (or use DevTools device emulation for iPhone SE / small phone). Scroll through the Building and Writing sections. Verify that rows collapse gracefully.

**Expected:** 
- At 860px breakpoint, Building rows should collapse from 4-column layout (num / title / description / status) to 2-column (number / title, with description and status wrapping below)
- Writing rows should collapse from 3-column (date / title / read-time) to single-column layout
- No overflow, no horizontal scroll, content remains readable and clickable

**Why human:** Visual responsive behavior; requires actual viewport rendering and human judgment that collapse is "genuine" (not just text fitting) and graceful (no layout shift jank).

### 3. Mono System Reads as Intentional

**Test:** View the finished homepage at normal zoom on both `/` (dev server or preview) and compare the visual aesthetic against `.planning/sketches/015-mono-passive-home/preview-a-swiss.png` (variant E).

**Expected:** The page reads as an intentional, designed mono system (pure black/white, Swiss editorial aesthetic, deliberate minimalism). Does NOT read as an unstyled fallback or "accidentally greyscale."

**Why human:** Overall design aesthetic judgment. Requires human eye to:
- Compare against the designer's original sketch/intent
- Distinguish between "intentionally minimal" and "accidentally broken"
- Assess whether the hierarchy, spacing, typography, and inversion language work together as a coherent whole

---

## Deferred / Out-of-Scope

**Pre-existing test failure (not this phase's responsibility):**
- `src/__tests__/pages/projects.test.tsx:188` ("renders a title-card face instead of a cover image when project.image is non-null") — fails on main branch before Phase 21 began; belongs to `/building` page, not homepage; confirmed byte-identical to pre-phase state.

**Items explicitly deferred to future phases:**
- Phase 22: `prefers-reduced-motion` on the pinboard (MS-03 not in Phase 21 scope)
- Phase 23: Notion inline text color neutralization (MO-04, SW-03 defer to Phase 23)
- Phase 24: Dark mode theme toggle (DM-01/02/03)
- Phase 25: Performance/SEO/QA gates (DQ-02/03/04/05)

---

## Summary

**Automated Verification:** 6/6 observable truths verified. All 40 homepage tests pass. Build is clean. Motion-audit mechanical gate passes. All artifacts present, substantive, and wired. All 7 Phase 21 requirements accounted for and code evidence found.

**Human Verification Pending:** Three subjective claims from Plan 21-06's human-verify checkpoint remain unverified by actual human eye:
1. Fade timing reads as intentional (not stutter)
2. 375px collapse is genuine and graceful
3. Mono aesthetic reads as intentional design, not accident

These three should be verified during Phase 25's QA pass (as recommended in Plan 21-06 summary) or before promoting production, per the strong-signal `gate="blocking"` in the original checkpoint.

**Status Determination:** Phase achieves all structural, behavioral, and automated mechanical goals. Human perception goals require visual confirmation. Marking as `human_needed` per requirement (presence of human-verification section + non-empty list → human_needed status, even with all truths VERIFIED).

---

_Verified: 2026-07-21T15:35:00Z_  
_Verifier: Claude (gsd-verifier)_
