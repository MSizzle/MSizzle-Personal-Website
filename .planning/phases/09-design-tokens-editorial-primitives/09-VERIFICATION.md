---
phase: 09-design-tokens-editorial-primitives
verified: 2026-05-21T05:00:00Z
status: human_needed
score: 3/4 success criteria verified (1 deferred to human via Vercel preview deploy; 0 failed)
overrides_applied: 0
re_verification:
  previous_status: null
  previous_score: null
  note: "Initial verification"
human_verification:
  - test: "vercel build --prod (SC4 phase gate, D-19)"
    expected: "exit 0; Build Completed success line on the Vercel preview deploy"
    why_human: "Sandbox node_modules environmentally corrupted (rolldown native binding missing; vercel-installer Next.js module corruption). Same issue Phase 8 hit. Discharged via Vercel preview deploy on branch push — bit-for-bit `vercel build --prod` semantically. Local `npm run build` exits 0 (verified at end of Phase 9; 41 routes generated, /specimen as ○ Static)."
  - test: "Visual confirmation of palette + Inter 124px manifesto rendering at /specimen"
    expected: "Warm-paper (#F4F2EC) background, near-black (#0E0E0C) ink, hairlines visible but not heavy. Inter 124px display text renders without FOUT/FOIT. No system-driven dark switch."
    why_human: "Perceptual verification — automated build confirms classes compile + page renders statically; only a human in a real browser can observe the warm-paper aesthetic + font-loading absence-of-flash + visible hairlines. Defined in 09-VALIDATION.md §Manual-Only Verifications."
---

# Phase 9: Design Tokens & Editorial Primitives — Verification Report

**Phase Goal:** Establish the warm-paper palette, editorial type scale on Inter, and the 7 shared primitive components that every subsequent phase will compose with.
**Verified:** 2026-05-21T05:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
| - | ----- | ------ | -------- |
| 1 | Specimen page renders every palette token and type-scale utility at spec values | VERIFIED | `src/app/specimen/page.tsx` exists (NOT `_specimen`), renders 10 swatches (`name:` count = 10) + 12 type-scale specimens (`utility: "text-` count = 12) + all 7 primitives. Build output shows `/specimen` registered as `○ (Static)` in the route manifest (41 total routes). |
| 2 | Inter at weights 400/700 renders the 124px manifesto with letter-spacing -0.045em and line-height 0.96 — no Helvetica Neue swap, no font-loading flash | VERIFIED (static) + PENDING_HUMAN (perceptual) | **Static:** `src/app/layout.tsx:12–16` loads Inter via `next/font/google` with `weight: ["400", "700"]`. `globals.css:26–29` defines `--text-display: 124px; --text-display--line-height: 0.96; --text-display--letter-spacing: -0.045em; --text-display--font-weight: 700`. `body { font-family: var(--font-sans), sans-serif; }` where `--font-sans = var(--font-inter)`. **Perceptual** (no font-flash on hard reload) deferred to human_verification item 2. |
| 3 | Each of the 7 primitive components renders in isolation with documented props and Tailwind-token-driven styling — zero arbitrary color or size values | VERIFIED | All 7 files exist in `src/components/editorial/`: `rule.tsx`, `rule-strong.tsx`, `section-label.tsx`, `list-row.tsx`, `all-link.tsx`, `intro-link.tsx`, `footer-col.tsx`. `grep -rE 'border-\[\|text-\[[0-9]\|tracking-\[\|bg-\[\|h-\[\|w-\[\|p-\[\|m-\[\|leading-\[\|font-\[' src/components/editorial/` returns **0 hits**. Every primitive uses token-driven classes only (`border-rule`, `border-rule-strong`, `text-ink`, `text-muted`, `text-label`, `text-meta`, `text-caption`, `text-list-title`, `text-list-title-home`, `text-footer-fg`, `text-footer-mute`, `bg-footer-bg`, `border-ink`). |
| 4 | `vercel build --prod` exits 0 and the primitives type-check with zero TS errors | VERIFIED (npm run build) + PENDING_HUMAN (vercel build --prod) | **Local D-18 gate:** `npm run build` exits 0 — compiled in 1735ms, TS finished in 1358ms, 41/41 static pages generated, `/specimen` registered as `○ (Static)`. No type errors. Robots.txt body contains `Disallow: /specimen` AND `Disallow: /api/`. Sitemap.xml output: 0 hits for "specimen". **Production D-19 gate** deferred to Vercel preview deploy on branch push per Phase 8 precedent — sandbox node_modules corruption (rolldown native binding missing) blocks `npx vercel build --prod` locally. |

**Score:** 3/4 fully verified static + 1 pending human acceptance (SC4 vercel build --prod perceptual confirmation on Vercel preview). Truth #2 has a perceptual portion also pending human (font-flash absence on real browser). No FAILED truths.

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/app/globals.css` | @theme inline with 10 palette + 12 type roles + alias bridge; no .dark block | VERIFIED | 10 `--color-*` palette tokens present (paper, ink, muted, faint, rule, rule-strong, footer-bg, footer-fg, footer-mute, footer-rule). 12 `--text-*` type roles present (display, page-title, feature, event-title, section-feature, list-title, list-title-home, body-lead, caption, nav, label, meta). All have `--line-height`/`--letter-spacing` (where applicable)/`--font-weight` modifiers. 7 v1.0 compat aliases present (`--color-background → var(--color-paper)` etc.). `.dark` block absent. `@theme inline` keyword preserved. `.section-inverted` hex pair flipped to v2.0 ink/paper. |
| `src/app/layout.tsx` | Inter 400/700 loader present; ThemeProvider unwired; suppressHydrationWarning preserved | VERIFIED | Line 12–16 loads Inter with `weight: ["400", "700"]` and `variable: "--font-inter"`. Line 64 has `suppressHydrationWarning` on `<html>`. No ThemeProvider import, no `<ThemeProvider>` wrap (LenisProvider wraps MotionProvider wraps Navigation+main+Footer). |
| `src/components/editorial/rule.tsx` | Rule named export — 1px hairline | VERIFIED | Exports `function Rule()` returning `<hr className="border-0 border-t border-rule" aria-hidden="true" />`. 3 lines. |
| `src/components/editorial/rule-strong.tsx` | RuleStrong named export — 1px bold | VERIFIED | Exports `function RuleStrong()` returning `<hr className="border-0 border-t border-rule-strong" aria-hidden="true" />`. 3 lines. |
| `src/components/editorial/section-label.tsx` | SectionLabel with optional numeral | VERIFIED | Exports `function SectionLabel({ children, numeral })` using `text-label uppercase text-ink`; optional right-aligned `<span className="text-muted">{numeral}</span>`. |
| `src/components/editorial/list-row.tsx` | ListRow with big variant via boolean prop | VERIFIED | Exports `function ListRow({ title, href, extra, meta, big = false })`. Uses `cn` from `@/utils/cn` (project-correct path). `big` switches title font (`text-list-title-home` ↔ `text-list-title`) AND padding (`py-5` ↔ `py-7`). `first:border-t-0` removes leading border per implementation note. |
| `src/components/editorial/all-link.tsx` | AllLink — tracked uppercase with ink underline | VERIFIED | Exports `function AllLink({ children, href })` using `inline-block border-b border-ink pb-1 text-label uppercase text-ink`. |
| `src/components/editorial/intro-link.tsx` | IntroLink — inline ink bottom-border | VERIFIED | Exports `function IntroLink({ children, href })` using `border-b border-ink`. |
| `src/components/editorial/footer-col.tsx` | FooterCol — title + links with optional sub-line | VERIFIED | Exports `function FooterCol({ title, links })`. Uses `text-label uppercase text-footer-mute` for title; `text-footer-fg hover:text-footer-fg/70` for links; `text-caption text-footer-mute` for sub-line. |
| `src/app/specimen/page.tsx` | Server Component rendering all tokens + primitives with noindex metadata | VERIFIED | Renders 3 sections (Palette / Type Scale / Primitives). Exports `metadata = { robots: { index: false, follow: false } }`. No `'use client'` directive. Imports all 7 primitives. PRIM-04 rendered twice (default + big variant). PRIM-07 wrapped in `bg-footer-bg` container for inverted context. Final motion-budget note ("No animations on this page. Phase 8 motion budget enforced (D-15).") present. |
| `src/app/robots.ts` | Disallow /specimen | VERIFIED | Returns `{ rules: { userAgent: '*', allow: '/', disallow: ['/specimen', '/api/'] }, sitemap: ... }`. Generated `.next/server/app/robots.txt` contains `Disallow: /specimen` + `Disallow: /api/`. |
| `src/app/sitemap.ts` | /specimen NOT listed | VERIFIED | Reviewed file — only `/`, `/about`, `/prometheus`, `/newsletter`, `/projects`, `/blog`, `/events` + Notion-sourced posts/projects. Build output: 0 hits for "specimen" in sitemap.xml. |
| `src/components/providers/theme-provider.tsx` | DELETED (D-04) | VERIFIED | File absent from `src/components/providers/`. Only `lenis-provider.tsx` + `motion-provider.tsx` remain. |
| `src/components/theme-toggle.tsx` | DELETED (D-04) | VERIFIED | File absent from `src/components/`. |
| `src/app/_specimen/` | DOES NOT EXIST (D-12 REVISED) | VERIFIED | Folder absent. Next.js 16 would treat `_`-prefixed folders as private and return 404. Correct route is `src/app/specimen/` (no underscore). |

### Preserved Artifacts (Phase 8 carryforward — D-15, D-16, D-17)

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/components/animations/scroll-reveal.tsx` | Byte-identical to origin/main | VERIFIED | `git diff origin/main -- <file>` returns empty. |
| `src/components/providers/lenis-provider.tsx` | Byte-identical to origin/main | VERIFIED | `git diff origin/main -- <file>` returns empty. |
| `src/app/template.tsx` | Byte-identical to origin/main | VERIFIED | `git diff origin/main -- <file>` returns empty. |
| `src/app/newsletter/page.tsx` | Untouched (D-16) | VERIFIED | File present, no modification in Phase 9 commit range. |
| `next-themes` in package.json | Retained (D-04 zero-cost retention) | VERIFIED | `"next-themes": "^0.4.6"` still listed. |
| Inter loader at weights 400/700 | Preserved (D-17 / TOKEN-03) | VERIFIED | `src/app/layout.tsx:15` — `weight: ["400", "700"]`. |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `src/app/layout.tsx` body | Tailwind utilities | `@theme` tokens generate utilities | WIRED | `bg-background text-foreground` on `<body>` — resolves through v1.0 alias bridge (`--color-background → var(--color-paper)`) to v2.0 warm-paper palette. |
| `src/app/globals.css :root` | `--bg`, `--fg`, etc. | v1.0 token name → v2.0 hex value bridge (D-02) | WIRED | `:root { --bg: #F4F2EC; --fg: #0E0E0C; ... }` — v1.0 consumers paint v2.0 colors. |
| `src/app/globals.css @theme inline aliases` | `--color-paper`, `--color-ink`, etc. | Tailwind v4 alias bridge (D-02) | WIRED | `--color-background: var(--color-paper);` etc. for cutover bridge. |
| `src/app/specimen/page.tsx` | 7 editorial primitives | Named imports from `@/components/editorial/*` | WIRED | All 7 primitives imported (lines 2–8) and rendered. |
| `src/components/editorial/list-row.tsx` | `cn` helper | Import from `@/utils/cn` | WIRED | Line 3 — `import { cn } from "@/utils/cn"`. |
| `src/components/editorial/list-row.tsx` | Next.js Link | Import from `next/link` | WIRED | Line 1. Used at line 15 to wrap the row. |
| `src/components/editorial/all-link.tsx` | Next.js Link | Import from `next/link` | WIRED | Line 1. Used at line 11. |
| `src/components/editorial/intro-link.tsx` | Next.js Link | Import from `next/link` | WIRED | Line 1. Used at line 11. |
| `src/components/editorial/footer-col.tsx` | Next.js Link | Import from `next/link` | WIRED | Line 1. Used at line 21 inside `.map`. |
| `src/app/robots.ts` | Generated `/robots.txt` | Next.js MetadataRoute.Robots | WIRED | Build output `.next/server/app/robots.txt` contains `Disallow: /specimen` exactly as configured. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `src/app/specimen/page.tsx` `swatches` | Module-scope const array of 10 palette swatch objects | Hardcoded D-01 palette per design contract | YES — by intent (specimen is a static design-QA page) | FLOWING |
| `src/app/specimen/page.tsx` `typeSpecimens` | Module-scope const array of 12 type-scale specimens | Hardcoded D-06 + D-14a typography spec | YES — by intent | FLOWING |
| Primitive components | Props (`children`, `href`, `title`, `links`, `big`, `numeral`, `extra`, `meta`) | Passed at call site (specimen page + future Phases 10/11) | YES — primitives are presentational; data flows in via props at composition time | FLOWING |

Note: Hardcoded swatch/type-specimen arrays in `specimen/page.tsx` are NOT stubs — the specimen page is by-design a static catalog of the design system. Phase 10 (Editorial Homepage) and Phase 11 (Archive Pages) will compose these primitives with live Notion-sourced data; that wiring is correctly out of scope for Phase 9.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| `npm run build` exits 0 | `npm run build` | exit 0; "Compiled successfully in 1735ms"; "Generating static pages using 9 workers (41/41) in 421ms"; route manifest includes `/specimen ○ (Static)` | PASS |
| All 10 palette tokens defined | `grep -cE "^\s*--color-(paper\|ink\|muted\|faint\|rule\|rule-strong\|footer-bg\|footer-fg\|footer-mute\|footer-rule):" src/app/globals.css` | 10 | PASS |
| All 12 type roles defined | `grep -cE "^\s*--text-(display\|page-title\|feature\|event-title\|section-feature\|list-title\|list-title-home\|body-lead\|caption\|nav\|label\|meta):\s*[0-9]" src/app/globals.css` | 12 | PASS |
| All 7 primitive files exist | `ls src/components/editorial/*.tsx \| wc -l` | 7 | PASS |
| All 7 primitives imported in specimen | `grep -c "from \"@/components/editorial" src/app/specimen/page.tsx` | 7 | PASS |
| Zero arbitrary values in primitives | `grep -rE 'border-\[\|text-\[[0-9]\|tracking-\[\|bg-\[\|h-\[\|w-\[\|p-\[\|m-\[\|leading-\[\|font-\[' src/components/editorial/` | 0 hits | PASS |
| Zero arbitrary values in specimen | `grep -rE 'border-\[\|text-\[[0-9]\|tracking-\[' src/app/specimen/page.tsx` | 0 hits | PASS |
| Zero `'use client'` in primitives + specimen | `grep -rn "'use client'" src/components/editorial/ src/app/specimen/page.tsx` | 0 hits | PASS |
| `.dark` block absent from globals.css | `grep -E "^\s*\.dark\s*\{" src/app/globals.css` | 0 hits | PASS |
| `ThemeProvider`/`ThemeToggle` references gone from src/ | `grep -rE "ThemeProvider\|ThemeToggle" src/` | 0 hits | PASS |
| theme-provider.tsx deleted | `test -f src/components/providers/theme-provider.tsx` | absent | PASS |
| theme-toggle.tsx deleted | `test -f src/components/theme-toggle.tsx` | absent | PASS |
| `_specimen/` folder absent (D-12 REVISED) | `test -d src/app/_specimen` | absent | PASS |
| 10 palette swatches in specimen | `grep -cE 'name:\s*"' src/app/specimen/page.tsx` | 10 | PASS |
| 12 type specimens in specimen | `grep -cE 'utility:\s*"text-' src/app/specimen/page.tsx` | 12 | PASS |
| Robots.txt build artifact contains `Disallow: /specimen` | `.next/server/app/robots.txt` | "Disallow: /specimen" present | PASS |
| Sitemap.xml build artifact does NOT contain `/specimen` | `grep -c specimen .next/server/app/sitemap.xml.body` | 0 | PASS |
| `next-themes` still in package.json | `grep next-themes package.json` | "next-themes": "^0.4.6" | PASS |
| Phase 8 preservation guards untouched | `git diff origin/main -- src/components/animations/scroll-reveal.tsx src/components/providers/lenis-provider.tsx src/app/template.tsx` | empty diff | PASS |
| `vercel build --prod` exit 0 | `npx vercel build --prod` | (deferred — env-corrupted node_modules) | SKIP → human_verification Item 1 |

### Probe Execution

No `scripts/*/tests/probe-*.sh` exist in this project and Phase 9 PLAN/SUMMARY files do not declare probe-based verification. Step 7c not applicable.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| TOKEN-01 | 09-01 | Tailwind v4 `@theme` block defines the warm-paper palette as named tokens | SATISFIED | All 10 `--color-*` tokens present in `globals.css:5–14` at exact D-01 hex values. |
| TOKEN-02 | 09-01 | Custom Tailwind utilities for the editorial type scale | SATISFIED | All 12 type roles present (D-06 + D-14a additional `--text-caption`) at lines 26–83. Each bundles `font-size + line-height + letter-spacing (where applicable) + font-weight`. |
| TOKEN-03 | 09-01 | Existing Inter font is the typeface — Helvetica Neue spec values applied to Inter; no font swap | SATISFIED | `src/app/layout.tsx:12–16` loads Inter via `next/font/google` with `weight: ["400", "700"]`. No swap; spec values applied via `--text-*` tokens. |
| PRIM-01 | 09-02 | `Rule` — 1px hairline horizontal divider | SATISFIED | `src/components/editorial/rule.tsx` exports `Rule()` with `border-rule` token. |
| PRIM-02 | 09-03 | `RuleStrong` — 1px bold horizontal section divider | SATISFIED | `src/components/editorial/rule-strong.tsx` exports `RuleStrong()` with `border-rule-strong` token. |
| PRIM-03 | 09-04 | `SectionLabel` — 11px tracked uppercase with optional right-aligned numeral | SATISFIED | `src/components/editorial/section-label.tsx` exports `SectionLabel({ children, numeral })` with `text-label uppercase text-ink` + optional numeral. |
| PRIM-04 | 09-05 | `ListRow` — linked row with title + extra blurb + tracked meta; `big` variant | SATISFIED | `src/components/editorial/list-row.tsx` exports `ListRow({ title, href, extra, meta, big })`. `big` switches title size + padding. |
| PRIM-05 | 09-06 | `AllLink` — tracked uppercase "All X →" with 1px ink bottom-border | SATISFIED | `src/components/editorial/all-link.tsx` exports `AllLink({ children, href })` with `text-label uppercase text-ink` + `border-b border-ink`. |
| PRIM-06 | 09-07 | `IntroLink` — inline link with 1px ink bottom-border | SATISFIED | `src/components/editorial/intro-link.tsx` exports `IntroLink({ children, href })` with `border-b border-ink`. |
| PRIM-07 | 09-08 | `FooterCol` — footer column with tracked uppercase title + links with grey sub-line | SATISFIED | `src/components/editorial/footer-col.tsx` exports `FooterCol({ title, links })` with `text-label uppercase text-footer-mute` + `text-footer-fg` links + optional `text-caption text-footer-mute` sub-line. |

All 10 Phase-9 requirements (TOKEN-01..03 + PRIM-01..07) declared in REQUIREMENTS.md are satisfied. No orphans. Plan-to-requirement coverage is 1:1 (Plan 09-01 covers all 3 TOKEN reqs; Plans 09-02..09-08 cover one PRIM each; Plan 09-09 covers SC1 integration).

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
| ---- | ------- | -------- | ------ |
| (none) | TBD / FIXME / XXX / HACK | — | Zero debt markers introduced in any modified file (globals.css, layout.tsx, robots.ts, specimen/page.tsx, all 7 editorial primitives). |
| (none) | TODO / PLACEHOLDER / placeholder / coming soon / not yet implemented | — | Zero stub-language anti-patterns. |
| (none) | Empty returns / hollow JSX | — | All primitives return real JSX with token-driven classes; no `return null` / `return <></>` / `return {}` patterns. |
| (none) | Arbitrary Tailwind values (`border-[`, `text-[N`, `tracking-[`, `bg-[`, etc.) | — | D-09 honored: zero arbitrary values in primitives + specimen page. All styling flows through `@theme` tokens. |
| (none) | `'use client'` directives in presentational primitives | — | D-11 honored: all 7 primitives and the specimen page are Server Components. |

### Locked Decision Honoring Audit (CONTEXT.md D-01..D-21)

| Decision | Status | Evidence |
| -------- | ------ | -------- |
| D-01 (10 palette tokens at exact hex values) | HONORED | All 10 tokens present at D-01 hex values. |
| D-02 (v1.0 compat alias bridge) | HONORED | `@theme inline` aliases + `:root` v1.0 names both in place. |
| D-03 (`@theme inline` keyword preserved) | HONORED | `globals.css:3` has `@theme inline {`. |
| D-04 (drop dark mode — `.dark` block, ThemeProvider, theme-toggle, theme-provider all removed; next-themes retained) | HONORED | `.dark` block absent; ThemeProvider+ThemeToggle references = 0; both files deleted; next-themes still in package.json. |
| D-05 (`suppressHydrationWarning` on `<html>` preserved) | HONORED | `layout.tsx:64`. |
| D-06 (Tailwind v4 `@theme` typography extensions for 11 roles + D-14a caption = 12 roles) | HONORED | All 12 type roles present with their bundled modifiers. |
| D-07 (label = 0.2em, meta = 0.16em — middle of ranges) | HONORED | `--text-label--letter-spacing: 0.2em`, `--text-meta--letter-spacing: 0.16em`. |
| D-08 (7 primitives in `src/components/editorial/`, kebab-case files, PascalCase named exports) | HONORED | 7 files: `rule.tsx`, `rule-strong.tsx`, `section-label.tsx`, `list-row.tsx`, `all-link.tsx`, `intro-link.tsx`, `footer-col.tsx`. Each exports a PascalCase named function. |
| D-09 (zero arbitrary values) | HONORED | grep returns 0 hits across all primitives + specimen. |
| D-10 (ListRow `big?: boolean` — single component, not two) | HONORED | `list-row.tsx:13` — `big = false` default; switches padding + title font. |
| D-11 (Server Components — no `'use client'`) | HONORED | 0 `'use client'` hits in primitives + specimen. |
| D-12 REVISED (route is `/specimen`, NOT `/_specimen`) | HONORED | `src/app/specimen/page.tsx` exists; `src/app/_specimen/` absent. |
| D-13 (specimen content: 10 swatches + type specimens + 7 primitives + motion-budget note) | HONORED | All 3 sections present; motion-budget footer confirms continuity. |
| D-14 REVISED (triple-defense discoverability suppression: noindex metadata + sitemap exclusion + robots.ts Disallow) | HONORED | (1) `metadata = { robots: { index: false, follow: false } }` in `specimen/page.tsx:12–16`. (2) `sitemap.ts` lists only canonical routes; build output 0 hits for "specimen". (3) `robots.ts` `disallow: ['/specimen', '/api/']`; generated robots.txt contains `Disallow: /specimen`. |
| D-14a (additional `--text-caption: 13px`) | HONORED | `globals.css:66–68` defines `--text-caption: 13px` with `--line-height: 1.5`. |
| D-15 (preserve Phase 8: scroll-reveal, lenis-provider, template) | HONORED | All 3 byte-identical to origin/main (empty git diff). |
| D-16 (preserve `/newsletter` carousel) | HONORED | `src/app/newsletter/page.tsx` present, untouched. |
| D-17 (Inter typeface at weights 400/700) | HONORED | `layout.tsx:15` — `weight: ["400", "700"]`. |
| D-18 (per-plan `npm run build` exits 0) | HONORED | Each plan SUMMARY records `exit 0`; final verification re-confirms exit 0. |
| D-19 (`vercel build --prod` exits 0 phase gate) | DEFERRED | Discharged via Vercel preview deploy per Phase 8 precedent. Tracked in human_verification Item 1. |
| D-20 (9 plans, 2 waves: 8 Wave-1 parallel + 1 Wave-2 integration) | HONORED | git log shows Plans 09-01..09-08 (Wave 1) shipped before 09-09 (Wave 2). |
| D-21 (Wave 1 parallel-safe — unique file sets) | HONORED | Each Wave 1 plan modifies a unique file; no conflict observed. |

All 21 locked CONTEXT decisions honored. 20 verified static; 1 (D-19) deferred to Vercel preview deploy per Phase 8 precedent.

### Human Verification Required

#### 1. `vercel build --prod` (SC4 / D-19 phase gate)

**Test:** Push the current branch to remote. Vercel triggers a preview deploy. Confirm:
- Vercel dashboard shows green check / "Build Completed" for the preview deploy (semantically equivalent to `vercel build --prod` exit 0)
- Preview URL `/specimen` renders palette + type scale + primitives correctly
- Preview URL `/robots.txt` contains `Disallow: /specimen`
- Preview URL `/sitemap.xml` does NOT contain `/specimen`

**Expected:** Vercel preview build completes exit 0; all 4 surface checks above pass.

**Why human:** Sandbox node_modules is environmentally corrupted (rolldown native binding missing + vercel-installer Next.js module corruption — same issue Phase 8 hit and successfully discharged this way). `npx vercel build --prod` cannot complete locally. Local `npm run build` exits 0 with 41 routes generated, so this is a known-environmental gap, not an implementation defect.

#### 2. Perceptual confirmation of palette + Inter 124px rendering

**Test:** `npm run dev`, load `http://localhost:3000/specimen` (or the Vercel preview URL after Item 1) in Chrome at 1440px. Hard-reload with DevTools Network tab open. Toggle macOS System Settings → Appearance → Dark and reload.

**Expected:**
- Background is warm off-white (`#F4F2EC`, not pure white)
- Ink is near-black (`#0E0E0C`, not pure black)
- Muted text is a warm gray
- Rule hairlines visible but not heavy
- 124px "BRING FIRE" sample renders cleanly without FOUT/FOIT (no flash from system font to Inter)
- Inter font request returns 200 in Network tab
- macOS dark-mode toggle does NOT switch the page palette (D-04: dark mode dropped)

**Why human:** Browser font-loading behavior + warm-paper aesthetic + visible hairline weight are perceptual judgments that grep + build logs cannot validate. Defined explicitly in 09-VALIDATION.md §"Manual-Only Verifications".

### Gaps Summary

**No code-level gaps.** Every code-side success criterion (SC1 specimen page, SC2 token + font wiring, SC3 primitives with zero arbitrary values, SC4 local `npm run build` exits 0) is independently verifiable via grep + ls + build output and passes.

All 10 Phase 9 requirements (TOKEN-01..03 + PRIM-01..07) are satisfied by the 9 shipped plans (09-01 → 09-09). All 21 locked CONTEXT decisions honored or explicitly deferred to Vercel preview deploy per documented precedent.

**Two genuinely pending human acceptance items** — neither caused by implementation defect:
1. `vercel build --prod` perceptual confirmation deferred to Vercel preview deploy on branch push (sandbox env corruption, Phase 8 precedent)
2. Perceptual confirmation of palette + Inter 124px rendering (browser-perceptual; defined as manual-only in 09-VALIDATION.md)

**Recommended next step:** Monty pushes the branch to trigger a Vercel preview deploy and walks through both human_verification items from his Mac in Chrome. Record resolution in a 09-HUMAN-UAT.md (following Phase 8 precedent), then run `gsd-sdk query phase.complete 09` to formally close Phase 9. Phase 10 (Editorial Homepage) can begin consuming Phase 9's tokens + primitives directly — no further design-system work needed.

---

_Verified: 2026-05-21T05:00:00Z_
_Verifier: Claude (gsd-verifier)_
_Carryforward pattern: Phase 8 `human_needed` discharge via Vercel preview deploy (08-VERIFICATION.md + 08-HUMAN-UAT.md)._
