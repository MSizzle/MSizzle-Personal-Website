# Phase 6: Pre-Launch QA — Context

**Gathered:** 2026-04-15
**Status:** Ready for planning
**Mode:** `/gsd-discuss-phase 6 --auto` — all gray areas resolved to recommended defaults and logged inline below.

<domain>
## Phase Boundary

Systematic validation that the MSizzle Personal Website is production-ready before the `montysinger.com` DNS switch from Super to Vercel. Phase 6 does **not** ship new features — it verifies what Phases 1–5 (and the 07 SEO overhaul) delivered, catches regressions, confirms the Notion pipeline holds under long-tail image expiry, and produces a go/no-go decision for cutover.

**In scope:**
- Validate all 28 v1 requirements against the live Vercel production URL
- Run Lighthouse (Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100)
- Run `vercel build` locally (not `next build`) to catch env-var mismatches
- Dark-mode first-visit FOUC test in incognito
- Cross-browser check: Safari (page transitions, `backdrop-filter`) + Chrome
- Security check: confirm `NOTION_TOKEN` is not present in any client-side bundle
- Verify Notion-pipeline "2+ hour image" (signed URL refresh holds)
- Reconcile the stale `REQUIREMENTS.md` Traceability table AND the stale `ROADMAP.md` Phase Overview table against real shipped state (see D-08)

**Out of scope:**
- Custom domain DNS cutover — **already complete** pre-Phase-6 (Super disconnected; `montysinger.com` live on Vercel via Namecheap). See D-15. No post-Phase-6 follow-up needed.
- Any new feature work — scope-creep deferred to backlog

</domain>

<decisions>
## Implementation Decisions

### QA Target Environment
- **D-01:** QA runs against the **live Vercel production URL** (current Vercel default domain), not local `npm run dev` and not preview deployments. Success criteria 2 and 5 both require this. [auto-selected: live-production]
- **D-02:** Before each QA run, redeploy latest `main` to Vercel production so the URL reflects the commit being audited. Record the deployment URL + commit SHA at the top of the verification report.

### Lighthouse Execution
- **D-03:** Use the **Lighthouse CLI** for the canonical desktop numbers captured in the QA report (`npx lighthouse <url> --preset=desktop --output=html,json`). Rationale: reproducible, scriptable, produces the JSON blob we can commit as evidence.
- **D-04:** **Triple coverage** on mobile:
  1. `npx lighthouse <url> --preset=mobile --output=html,json` — reproducible local mobile number, independent of Google infra and insulated against PSI flakiness.
  2. **PageSpeed Insights (https://pagespeed.web.dev/)** mobile run — authoritative for "what Google sees"; pulls CrUX field data if available.
  3. Both sets of mobile scores get recorded in the verification report alongside the desktop CLI numbers.
- **D-05:** Score thresholds are **hard gates** on every profile (desktop CLI, mobile CLI, PSI mobile): Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO = 100. Any score below threshold blocks launch and produces a sub-plan (`06-0X-FIX-lighthouse-<metric>.md`).

### Requirement Verification Method
- **D-06:** **Eyeball + screenshot** each of the 28 v1 requirements on the live URL. Capture one screenshot per requirement (desktop + mobile) and commit the set under `.planning/phases/06-pre-launch-qa/evidence/`. No Playwright/E2E automation in Phase 6 — that's deferred to post-launch.
- **D-07:** Write results into a **single `06-UAT.md` file** using the standard GSD UAT format (`pass` / `fail` / `skipped` / `blocked` per requirement). The UAT file is the primary audit artifact for Phase 6 completion.
- **D-08:** Two planning docs are stale and reconciled in **Plan 06-01 before any QA work runs**:
  1. `.planning/REQUIREMENTS.md` Traceability table (many `not_started` rows that have shipped).
  2. `.planning/ROADMAP.md` overview table (lines ~13-18) — phase-status + success-criteria columns lag reality, including Phase 7 which already shipped.
  Both get updated to reflect actual state so Phase 6 audits against truth, not fiction.

### Failure Handling
- **D-09:** Two failure tiers:
  - **Blocking (stop launch):** `vercel build` failure, Lighthouse below threshold, broken Notion images, `NOTION_TOKEN` leaked client-side, dark-mode FOUC, Safari page-transition breakage, any v1 requirement failing.
  - **Non-blocking (file a deferred idea or a post-launch follow-up):** cosmetic nits, minor copy polish, optional animations, non-critical DX warnings.
- **D-10:** Blocking failures auto-generate a fix sub-plan inside Phase 6 (`06-0X-FIX-*.md`). Non-blocking goes to `.planning/todos/` via `/gsd-add-todo`.

### Notion Pipeline Long-Tail
- **D-11:** Verify success criterion 1 by **re-fetching a post that was built ≥ 2 hours ago** and confirming all Notion-hosted images still render (not 403). The signed-URL refresh layer must hold. If it fails, treat as blocking and loop in the Notion proxy-images work from Phase 2.

### Cross-Browser
- **D-12:** Test matrix is **Chrome (desktop + mobile emulator), Safari (desktop + iOS Simulator if available), Firefox (desktop only)**. No Edge-specific testing. Record per-browser results in 06-UAT.md.
- **D-13:** Specific Safari checks: (a) Lenis smooth scroll behaves, (b) `backdrop-filter` on nav/overlays renders, (c) page transitions between routes don't flicker.

### Security Check
- **D-14:** Grep for `secret_` and `NOTION_TOKEN` literals in **both** build-output trees, since the QA gate runs `vercel build` (not `next build`): `.next/static/chunks/**/*.js` **and** `.vercel/output/static/_next/static/chunks/**/*.js`. Also grep the full `.vercel/output/` tree for good measure. Confirm `process.env.NOTION_TOKEN` only appears in server-only modules (`src/lib/notion*.ts` and similar). Any hit in a client chunk = blocking fail.

### Domain Cutover (scope-boundary reminder)
- **D-15:** `montysinger.com` is **already fully live on Vercel via Namecheap DNS** — Super is disconnected. DSGN-06 is therefore **complete**, not "partial." No post-Phase-6 DNS cutover todo is needed. Phase 6 validates against `https://montysinger.com` directly (or whichever Vercel apex domain is configured as primary).

### Claude's Discretion
- Choice of exact Lighthouse CLI flags (desktop vs mobile preset, throttling mode) within the constraint that scores are reported for both.
- Evidence-file format (PNG vs WebP, naming convention), as long as one image per requirement is committed.
- Whether to run builds on a clean `vercel pull && vercel build` sequence or reuse existing env — recommend clean pull each run.
- Order of requirements audited within 06-UAT.md (group by route vs group by category).

</decisions>

<specifics>
## Specific Ideas

- The ROADMAP's own **Pitfall 1** ("Notion images in a post built 2+ hours ago still load") is the single most load-bearing QA case. If only one QA item were run, it would be this.
- Lighthouse 100 SEO is non-negotiable — the Phase 07 SEO overhaul exists specifically to satisfy this in Phase 6.
- Dark-mode FOUC has historically been a Next.js App Router pain point with `next-themes`. Success criterion 4 is explicitly calling this out because it's easy to regress.
- The REQUIREMENTS.md Traceability table was last updated 2026-03-31. Phases 3/4/5 have all shipped since. First order of business in planning: mark the table as reality.
- "QA evidence" committed into `.planning/phases/06-pre-launch-qa/evidence/` doubles as a historical snapshot of v1 launch quality, useful later when comparing against v2.

</specifics>

<canonical_refs>
## Canonical References

Downstream agents MUST read these before planning or implementing Phase 6.

### Phase scope and success criteria
- `.planning/ROADMAP.md` §Phase 6 — goal, 5 success criteria, dependencies, risks, and the full Requirement Coverage table.
- `.planning/REQUIREMENTS.md` — all 28 v1 requirement IDs + the stale Traceability table that Phase 6 will reconcile.
- `.planning/PROJECT.md` — core value statement, constraints (Vercel free tier, Notion CMS, self-hosted analytics).

### Prior phase context (carry-forward decisions)
- `.planning/phases/03-core-pages/03-CONTEXT.md` — homepage, portfolio, blog-index, about structural decisions.
- `.planning/phases/04-animation-polish/04-CONTEXT.md` — GSAP/Lenis decisions, reduced-motion policy, dark-mode approach.
- `.planning/phases/05-analytics/05-CONTEXT.md` — Umami deployment, event naming, D-11 outbound-tracking contract.
- `.planning/phases/07-seo-overhaul/07-CONTEXT.md` — D-01 through D-45 SEO decisions; every check that Phase 6 re-audits is defined here.

### Known-good verification patterns from prior work
- `.planning/phases/04-animation-polish/04-VERIFICATION.md` — example QA report format worth mirroring.
- `.planning/phases/07-seo-overhaul/07-VALIDATION.md` — format for decision-compliance audits; reuse for the Phase 07 SEO re-check in Phase 6.

### External specs / references
- Lighthouse scoring rubric: https://developer.chrome.com/docs/lighthouse/overview/
- Web Vitals thresholds: https://web.dev/articles/vitals
- Vercel free-tier fit check (from `CLAUDE.md`) — bandwidth, build minutes, function duration budgets.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/notion.ts` — Notion-hosted image proxy path; re-hit for the 2-hour staleness test.
- `src/lib/analytics/*` — Umami tracking confirmed working in Phase 5; verify events still fire end-to-end.
- `src/__tests__/` — vitest suite; `npm run test` is the first CI gate for every Phase 6 re-run.
- `next.config.ts` — `remotePatterns` for Notion + Substack; Phase 6 confirms no new host needed.

### Established Patterns
- Phases 1–5 validated against local dev; Phase 6 is the first time everything runs against Vercel production.
- Every Phase 07 plan already has per-plan acceptance-criteria greps — Phase 6 can aggregate them into a single sweep.

### Integration Points
- Umami dashboard is the source-of-truth for analytics events — Phase 6 confirms events land in Umami, not just that they're fired client-side.
- Vercel deployment URL is the audit surface — Phase 6 never audits localhost.

### Anti-patterns to avoid
- Don't run Lighthouse against `next dev` — numbers are garbage (no CSS/JS minification, no ISR caching). CLI against the live URL only.
- Don't treat the REQUIREMENTS.md Traceability table as authoritative until Plan 06-01 reconciles it.

</code_context>

<deferred>
## Deferred Ideas / Out of Scope

- Playwright / E2E automation of the full requirement matrix — valuable but a post-launch v1.1 improvement. Captured for roadmap backlog.
- Automated bundle-size regression budget (e.g., `size-limit`) — useful later, not a Phase 6 blocker.
- Public status/perf page (ANLY-V2-01 in REQUIREMENTS.md) — already in the v2 backlog.
- ~~Custom-domain DNS cutover~~ — already complete (Namecheap → Vercel live; Super disconnected). Per revised D-15.

</deferred>

<auto_log>
## --auto Mode Selections (audit trail)

Each of the gray areas below was auto-selected to its recommended option because `/gsd-discuss-phase 6 --auto` was invoked. If any of these feels wrong, run `/gsd-discuss-phase 6` without `--auto` or edit this CONTEXT.md directly before `/gsd-plan-phase 6`.

1. **QA target environment** → live Vercel production URL (recommended; required by success criteria 2 & 5).
2. **Lighthouse runner** → Lighthouse CLI desktop (canonical) + CLI mobile (reproducible mobile) + PSI mobile (Google-authoritative) — triple coverage (user-directed; protects against both local-CPU noise and PSI infra weirdness).
3. **Requirement verification method** → eyeball + screenshot committed as evidence (recommended; defer Playwright to v1.1).
4. **Failure handling** → two-tier (blocking vs non-blocking) with auto-generated FIX sub-plans for blocking items (recommended; scales cleanly into execute-phase).
5. **Cross-browser matrix** → Chrome + Safari + Firefox (desktop), Chrome + Safari (mobile) (recommended; matches ROADMAP risk callouts).
6. **Stale-doc refresh** → first task of Plan 06-01 reconciles **both** `REQUIREMENTS.md` Traceability table AND `ROADMAP.md` overview table (user-directed; avoids auditing against fiction on either surface).
7. **Domain cutover** → **already complete** — `montysinger.com` on Vercel via Namecheap, Super disconnected. DSGN-06 marks as complete in the reconciled Traceability table; no post-Phase-6 DNS todo needed (user-confirmed 2026-04-16).

</auto_log>
