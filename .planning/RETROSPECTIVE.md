# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Build & Launch

**Shipped:** 2026-04-16 (GO verdict, Phase 6)
**Archived:** 2026-05-20
**Phases:** 7 | **Plans:** 28 | **Commits:** 196 | **Timeline:** 16 days

### What Was Built

- Next.js 16 + Tailwind v4 + React 19 personal site live at https://montysinger.com, fully replacing Notion Super
- Notion CMS pipeline with rate-limited client, 17-block-type renderer, image proxy solving signed-URL expiry, ISR
- 11 routes: home, about, projects + per-project, blog + per-post + feed, events, links, newsletter, prometheus, uses
- Animation system (Motion + GSAP + Lenis) with parallax, scroll-reveal, page transitions, hover overlays
- Self-hosted Umami analytics on Neon Postgres at analytics.montysinger.com (subdomain via Namecheap CNAME)
- Full SEO infrastructure: JSON-LD (Person/FAQ/Breadcrumb), sitemap, robots, RSS, per-page metadata, dynamic OG images

### What Worked

- **Phase 6 D-14 bundle secret scan caught nothing because Phase 2 designed `notion.ts` as server-only from day one.** Locking the server/client boundary in the data-layer phase paid off — zero secret leaks at production audit.
- **Image proxy beat build-time download as the Notion-image solution.** Phase 6 long-tail test confirmed posts ≥2h old still return 200s indefinitely. The decision to defer the choice until Phase 2's evidence was in saved a rewrite.
- **Phase 7 (SEO Overhaul) inserted mid-flight.** Wasn't in the original roadmap; added when the launch-readiness review surfaced thin homepage copy and missing canonical infra. The phase shipped 11 plans in 3 days and rewrote enough copy to be substantive without delaying launch.
- **GSAP ticker driving Lenis prevented the entire class of ScrollTrigger desync bugs** that would have otherwise plagued Phase 4. Worth the up-front decision cost.
- **`vercel build --prod` as the production-readiness gate** caught env-var mismatches that `next build` misses. Phase 6 plan 06-01 made this a hard gate; recommended for every future milestone close.

### What Was Inefficient

- **Bookkeeping drift between actual ship state and STATE.md.** Phase 6 shipped 2026-04-16 with a GO verdict signed off by the user, but STATE.md still read `Phase 6: planned` a month later. We discovered this during v2.0 prep and had to reconcile retroactively. Future fix: `/gsd:complete-milestone` should be run *at* the GO verdict, not weeks later.
- **Phase 6 had 6 plans but only 1 SUMMARY.md.** The actual evidence (06-04-EVIDENCE.md, 06-05-EVIDENCE.md, 06-GO-NO-GO.md, etc.) was richer than any SUMMARY.md, but the per-plan SUMMARY pattern was inconsistently followed in QA-style phases. Future fix: QA phases should either emit per-plan SUMMARYs or explicitly opt out at plan creation.
- **Phase numbering wasn't strictly chronological.** Phase 7 (SEO) shipped before Phase 6 (QA) because the SEO work was scoped as additive while QA had to verify the SEO-shipped state. The non-sequential ordering confused tooling (ROADMAP overview rows mismatched) until reconciled in 06-01.
- **`react-notion-x` evaluation cost time.** Documentation suggested it worked with App Router; in practice the breakage was severe enough to require migration to `notion-to-md` + custom block renderer. CLAUDE.md now codifies "avoid `react-notion-x` for App Router" as a constraint.
- **CLI accomplishments extraction had a parsing bug.** `gsd-sdk query milestone.complete` populated MILESTONES.md with "One-liner:" placeholder lines for ~8 of the 22 SUMMARY files. Manual cleanup required. Worth filing upstream.

### Patterns Established

- **Image expiry decisions belong in the data-layer phase, not the design phase.** Decoupling content pipeline risk from visual work is what made Phase 4 + 5 unblocked.
- **Bundle secret grep across BOTH `.next/static/chunks/` AND `.vercel/output/static/_next/static/chunks/`** is the durable D-14 pattern. Single-tree scans miss `next build` artifacts left by local dev.
- **One typeface, two weights, system fallback chain.** Inter with `next/font/google` weights 400/700 carried both v1.0 and the planned v2.0 design language. No font sprawl.
- **Custom subdomain for analytics via Namecheap CNAME → cname.vercel-dns.com** — clean DNS pattern that decouples analytics availability from main-site deployments.
- **"GO/NO-GO" doc as the canonical phase-close artifact for QA phases** beat per-plan SUMMARYs for legibility. Future QA phases should default to this format.

### Key Lessons

1. **Run `/gsd:complete-milestone` at the GO verdict, not weeks later.** A month of bookkeeping drift makes milestone close harder than the close itself. The 2026-05-20 reconcile spent more time on artifact archaeology than the original Phase 6 paperwork would have.
2. **The "scariest gotcha" in CLAUDE.md (Notion image expiry) was real but solved before it bit.** Pitfalls documented up-front and decided in the relevant phase are cheaper than pitfalls discovered in production.
3. **Lighthouse mobile is too noisy to gate on.** Run-to-run variance was ±15 points on the same code. PSI (Google's servers) is the authoritative number per D-04. Future milestones should not use local Lighthouse mobile as a blocking gate.
4. **Inserting a phase mid-milestone (Phase 7 SEO) works if the inserted phase has its own success criteria and doesn't block downstream phases.** Phase 7 inserted before Phase 6's QA and shipped clean.
5. **"Subtraction" milestones are valid.** v2.0 explicitly removes things v1.0 added (auto-loops, pulsing dots, stacked carousels). The first milestone over-built; the second tunes. Plan future milestones with this rhythm in mind rather than always-additive.

### Cost Observations

- Model mix: heavy Opus via Claude Code over the milestone duration
- Sessions: many short sessions (typical Claude Code workflow), one long QA session for Phase 6 visual fixes
- Notable: Phase 7 (11 plans in 3 days) was the highest-throughput phase. Likely because the work was tightly scoped (each plan was one route or one metadata change) with little planning ambiguity.

---

## Milestone: v2.0 — Editorial Redesign

**Shipped:** 2026-05-21
**Phases:** 6 | **Plans:** 41 (Phase 8: 7, Phase 9: 9, Phase 10: 7, Phase 11: 5, Phase 12: 7, Phase 13: 6) | **Timeline:** 1 day of focused execution (Phases 8-13 all completed 2026-05-21)

### What Was Built

- Editorial homepage anchored on "BRING FIRE / TO HUMANITY." manifesto with letter-stagger reveal (one signature interaction per page)
- Warm-paper monochrome palette (#F4F2EC paper / #0E0E0C ink / #6E6A65 muted — darkened post-QA for WCAG AA) as Tailwind v4 `@theme` tokens
- 7 shared editorial component primitives (Rule, RuleStrong, SectionLabel, ListRow, AllLink, IntroLink, FooterCol) + YearBlock for archive pages
- 3 new archive routes (`/writing`, `/events`, `/photos`) with year-grouped layouts
- Lightweight palette+typography restyle across all 6 v1.0 sub-pages (`/about`, `/projects`+slug, `/blog`+slug, `/links`, `/prometheus`, `/newsletter` — the newsletter carousel replaced with a full-width issue grid)
- Mobile nav restructure (hamburger-only header on `<768px`, EditorialHeader desktop-only on `≥768px`, content-height drawer with tap-outside-to-close backdrop, Monty Singer brand link)
- Cycling first photo on the homepage Photographs section (10s auto-timer + click-to-advance, 400ms cross-fade)
- Visit-survey component made mobile-responsive (pixel-art Monty visible on mobile, popup width `w-64` vs desktop `w-80`)
- v2.0 GO/NO-GO signed: build PASS, Lighthouse desktop 99/96/100/100 median across 5 routes, PSI mobile 95 (up from 82 after browserslist target moved to Chrome 92+/Safari 15.4+), zero secret leaks, dark-mode dropped to v2.1+ as explicit decision

### What Worked

- **Auto-chain (`/gsd:execute-phase --auto`)** carried 6 phases through discuss → plan → execute → verify without operator handholding. Phase 13 was the only checkpoint that needed human gates (PSI manual run, visual QA, GO sign-off) and the chain pause-and-resume was clean.
- **Parallel worktree executors** in Phase 12 — 6 routes restyled simultaneously in isolated worktrees, merged cleanly with the cleanup-wave helper. Wall time was ~12 minutes for what would have been 60+ minutes sequential.
- **PSI as authoritative mobile gate** (v1.0 retro lesson #3 carryforward) — local mobile Lighthouse variance is too noisy to gate on. Confirmed again this milestone: PSI on production is the durable number; local Lighthouse desktop is fine for desktop QA.
- **Polish-pass-then-PSI iteration** in Phase 13 — first PSI run identified concrete polyfill waste (Array.prototype.at, flat, Object.hasOwn, etc.) in the Insights tab. Adding browserslist targeting modern browsers eliminated ~14 KiB of legacy polyfills and lifted mobile perf from 82 → 95 in one config change.
- **D-14 dual-tree secret scan** (Phase 6 carryforward) — `rg "secret_|NOTION_TOKEN"` across both `.next/static/chunks/` AND `.vercel/output/static/_next/static/chunks/`. Zero leaks, server/client boundary intact from v1.0 Phase 2's design.
- **Component primitive extraction in Phase 9 before composition in Phase 10** — having the 7 primitives ready meant the editorial homepage build was assembly, not invention.

### What Was Inefficient

- **Worktree subagents stalled on long-running infra operations** in Phase 13 (e.g., npm install in a fresh worktree took 11 minutes; subagent stream timed out before completion). Switched to inline execution for QA-style plans that need real-world tools (vercel deploy, Lighthouse, PSI). Worktree isolation is great for parallel code edits, wrong tool for serial measurement work.
- **PSI API quota** was exhausted by the time we tried autonomous measurement. Manual run via pagespeed.web.dev UI bypasses the quota but requires operator action. For future QA phases, plan for manual PSI or set up an authenticated Google API key in advance.
- **Vercel Deployment Protection on preview URL** blocked autonomous Lighthouse runs against the preview. Fell back to `localhost:3000` (Path C). Working but means CDN delta isn't measured.
- **v2.0-route-suppression gates in production were stale** — Navigation and Footer both correctly returned null on `/`/`/writing`/`/events`/`/photos` in local code (gates added in Phase 11) but production had an older deploy. User saw duplicate "Monty Singer" headers + duplicate footers on mobile. Promoting today's build fixes it. Lesson: deploy-as-you-ship; long gaps between local fixes and production promote create visible bug regressions.
- **`HOME_PHOTOS` cycling photo pool overlaps with static grid slots** — clicking Photo 1 cycles through the same 6 photos that are already in slots 2-6, so ~17% of the time you see a duplicate. Accepted as a known limitation pending more photo assets. Lesson: when introducing cycling/rotation, plan asset inventory before behavior.
- **`vercel deploy --prebuilt --prod` shipped HTML and assets with mismatched hashes** — the first promote uploaded the local `.vercel/output/` tree, but the deployed HTML referenced CSS/JS chunks that didn't exist in the tree. Production rendered unstyled (HTML 200, CSS 404 — site "looked gone"). Recovered by running `vercel deploy --prod` (no `--prebuilt`), letting Vercel do a fresh internally-consistent build server-side. Lesson: with Next.js 16 + Turbopack, the prebuilt artifact's internal hash consistency isn't guaranteed across all chunk types — for production promotes, prefer the no-`--prebuilt` path unless you have a specific reason to use the local output.
- **Vitest infrastructure broken** the entire milestone (`@rolldown/binding-darwin-arm64` missing) — never blocked execution because build gate (`vercel build --prod`) caught the things that matter, but means no regression test coverage was actually verifying behavior. Tech debt for v2.1.

### Patterns Established

- **Browserslist as a perf lever** — explicitly target modern browsers in package.json to drop legacy polyfills. Single config change can lift mobile PSI 10-15 points.
- **Mobile chrome via CSS breakpoint switching, not pathname-only gating** — the right pattern is `md:hidden` (mobile) + `hidden md:block` (desktop) inside the same component, with route-conditional desktop rendering as a separate concern. Pathname-only gating is fragile across deploys.
- **Tap-outside-to-close drawer** — a backdrop `<div className="fixed inset-0 top-16 z-30 bg-black/20 ..." onClick={close}>` + content-height drawer above it (`z-40`) is the minimal pattern. ~10 lines of JSX.
- **`md:auto-rows-[N]` for CSS Grid implicit rows** — if you have a multi-row grid with row-spanning items but only declare `grid-rows-[N]` explicitly, implicit rows collapse to 0 and content gets clipped. Always pair explicit + auto rows.
- **`<Suspense fallback="...">` around server-fetched data is a CLS trap** — React 19 streaming paints the fallback first then swaps in the resolved content. If sizes differ, that's CLS even for revalidate-1800 ISR. Remove the boundary when data is server-rendered before HTML emits.
- **Cross-fade via stacked `<Image>` with opacity transitions** — N images all `fill` the same container, only one has `opacity-100`, rest `opacity-0`, CSS transitions for the fade. Single state variable. No Motion library needed.

### Key Lessons

1. **Ship the polish pass with the milestone close, not separately.** When v2.0 QA flagged the `/blog` CLS regression and color-contrast misses, fixing them inline + re-running Lighthouse + committing as a polish pass before sign-off kept the GO doc accurate and made promotion atomic. v1.0 retro lesson #1 ("close at GO, not weeks later") generalizes — also "fix QA-found issues before signing GO, not in a v2.1 cleanup".
2. **The PSI Insights tab is a treasure map.** Rather than guessing what's slow on mobile, open the Insights tab and read the named audits. Phase 13's PSI 82 → 95 win came directly from one Insight (Legacy JavaScript) that named the exact polyfills wasting bytes. Saved an hour of profiling guesswork.
3. **Visual QA at the design floor (375px) finds bugs no automated gate catches.** The duplicate-header + duplicate-footer + broken-hamburger discovery only happened because the operator manually loaded the site at 375px and looked. Lighthouse can flag horizontal overflow but can't tell you "the editorial chrome is rendering twice."
4. **`<Suspense>` is for client data fetch boundaries, not server-fetched route data.** App Router server components await on the server before HTML emits — there's no Suspense boundary needed for the resolved data. Removing it removed 0.685 CLS on `/blog`.
5. **Pre-existing infra failures (like the rolldown binding issue) shouldn't block ship.** Phase 13 explicitly scoped vitest-out-of-scope via D-10. The build gate (`vercel build --prod`) catches the things that matter for production; the test suite is supplementary. Acknowledge gaps in the GO doc instead of pausing to fix orthogonal infra.

### Cost Observations

- Model mix: Sonnet for executors, Opus for orchestration (this conversation), Haiku for verifier + plan-checker
- Sessions: One continuous session for the entire milestone (Phases 8-13) including the auto-chain → polish iteration → milestone close → promote
- Notable: The `/blog` perf 69 → 96 fix took ~5 minutes (remove Suspense + add priority + rebuild), while the autonomous Lighthouse measurement that found the regression took ~12 minutes. Diagnostic time > fix time was a clear signal the issue was a known anti-pattern, not novel.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Plans | Phases | Key Change |
|-----------|-------|--------|------------|
| v1.0 | 28 | 7 | First milestone; established GSD workflow, atomic-commit-per-plan rhythm, evidence-backed QA phase |
| v2.0 | 41 | 6 | Auto-chain (`--auto`) + parallel worktree executors validated; design-system-first (Phase 9 primitives before homepage in Phase 10); polish-pass-before-GO pattern formalized |

### Cumulative Quality

| Milestone | Tests | Lighthouse Desktop | Lighthouse Mobile (PSI) | Bundle Secrets |
|-----------|-------|--------------------|-----------------------|----------------|
| v1.0 | vitest suite (all green) | 100/96/96/100 | 77 (home) | Zero leaks |
| v2.0 | vitest broken (rolldown infra issue — out of scope per D-10) | 99/96/100/100 (median, 5 routes) | 95 (home, post-browserslist fix; was 82 pre-fix) | Zero leaks |

### Top Lessons (Verified Across Milestones)

*To be populated as more milestones complete.*
