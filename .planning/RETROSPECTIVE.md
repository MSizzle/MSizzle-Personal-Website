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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Plans | Phases | Key Change |
|-----------|-------|--------|------------|
| v1.0 | 28 | 7 | First milestone; established GSD workflow, atomic-commit-per-plan rhythm, evidence-backed QA phase |

### Cumulative Quality

| Milestone | Tests | Lighthouse Desktop | Lighthouse Mobile (PSI) | Bundle Secrets |
|-----------|-------|--------------------|-----------------------|----------------|
| v1.0 | vitest suite (all green) | 100/96/96/100 | 77 (home) | Zero leaks |

### Top Lessons (Verified Across Milestones)

*To be populated as more milestones complete.*
