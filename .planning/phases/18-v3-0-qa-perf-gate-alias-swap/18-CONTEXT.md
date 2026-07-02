---
phase: 18
phase_name: v3.0 QA, Perf Gate & Alias Swap
created: 2026-06-20
updated: 2026-07-02
mode: auto
discuss_passes: 2
---

# Phase 18 Context

> **⚠ READ FIRST — Post-17.3 Reconciliation (2026-07-02) supersedes conflicting
> auto-decisions below.** This CONTEXT.md was auto-generated 2026-06-20, before Phases
> 17.1/17.2/17.3 shipped. Several original decisions (D-03, D-04, D-05, D-08) are now stale.
> The reconciliation section immediately below is authoritative where it conflicts with the
> `## Decisions (auto-resolved)` section.

## Post-17.3 Reconciliation (2026-07-02) — AUTHORITATIVE

Four decisions locked with Monty on 2026-07-02, plus corrections for what actually shipped in
Phases 17.1 (homepage rebuild), 17.2 (IA restructure), and 17.3 (portfolio). Where these
conflict with the older D-01..D-11 below, **these win.**

### R-1 — Homepage is now STATIC; the WebGL-hero LCP gate (D-04) is largely obsolete
- Phase 17.1 **removed the WebGL blob from the home path**. `explorative-homepage.tsx` is a
  static Server Component (no `<canvas>`, no three.js, no client hooks) rendering a
  six-section personal-brand arc.
- Therefore **D-04's premise ("LCP is the WebGL canvas", "mobile-poster path", "deferred
  canvas mount", "~885 kB three.js chunk") no longer applies to `/`.** The perf gate treats
  the homepage as a plain Server Component and checks standard LCP (the SSR'd `<h1>`).
- Planner action (18-03): confirm-in-code that no WebGL/canvas/three import remains on the
  `/` render path. If confirmed, mark the WebGL-LCP sub-checks **satisfied-by-absence** — do
  NOT run a bespoke 3D LCP probe or hunt for a poster fallback on home. If any WebGL is still
  on a perf-critical route, escalate. (`nextjs16-fetchpriority-quirk` still applies to
  whatever the real LCP image is.)

### R-2 — PSI mobile baseline is 95, not 82 (corrects D-03)
- D-03 cites v2.0 prod PSI mobile = 82. That is **stale**: PROJECT.md records **v2.0 shipped
  PSI mobile = 95** (up from 82). Bar = **PSI mobile (authoritative) ≥ current production
  (~95), parity-or-better.** A drop below current prod blocks GO unless explicitly
  risk-accepted. Ignore the 82/77 numbers in D-03.

### R-3 — Route list changed in 17.2 (corrects D-02 and D-05)
- `/watching` and `/newsletter` no longer exist as standalone routes (17.2 folded `/watching`
  into `/uses` "Things I Love" and `/newsletter` into `/writing`; both are 301 redirects).
  `/events`, `/photos`, `/links` also 301-redirect; `/specimen`, `/v3-specimen` are 404.
- **Do NOT Lighthouse/visual-walk `/watching` as a page.** The live v3 route set is:
  `/`, `/about`, `/projects` (+`/projects/[slug]`), **`/portfolio`** (new, 17.3),
  `/writing` (+`/blog/[slug]`, `/blog/feed.xml`), `/uses`, `/prometheus`.
- The Phase-16 deferred visual items about `/watching` (D-05 item 4) now apply to the
  **Watching section inside `/uses`**, and the redirects themselves should be spot-checked
  (each 301 resolves correctly).

### R-4 — `/portfolio` content gate before promotion (NEW, from 17.3)
- `/portfolio` (shipped 17.3) renders a graceful empty-state until Notion projects are marked
  `Featured: true`. **Monty marks a few proud-of projects `Featured: true` in Notion before
  the alias flip** so prod `/portfolio` is not empty at launch.
- Pre-GO checklist item in the visual walk: verify `/portfolio` shows real featured Cards on
  the preview deploy (not the empty-state), and the homepage "Selected Work" link reaches it.

### R-5 — Alias flip is HUMAN-RUN, agent-prepared (refines D-08)
- The agent compiles `18-GO-NO-GO.md`, verifies every gate, and hands Monty the **exact
  `vercel` alias-promotion command + rollback steps**. **Monty runs the production flip
  himself.** The agent does NOT execute the swap. After the flip, the agent runs
  post-promotion parity verification (SC-4 / curl + route walk + alias-drift check).
- D-08's hard constraints still hold: **never `--prebuilt --prod`**, mandatory alias-drift
  check. The branch→prod path (direct `--prod` from `v3` vs merge→main vs promote-preview)
  remains the one genuine research item.

### R-6 — Execution checkpoints (confirms/tightens D-A4)
- Mechanical gates run **autonomously**: 18-01 build, 18-02 preview+Lighthouse, 18-03 PSI,
  18-04 375px/route walk, 18-05 secret scan + theme decision.
- **Human checkpoints (mark `autonomous: false`): (1) the GO/NO-GO sign-off (18-06), and
  (2) immediately before the alias flip** (hand-off of the command per R-5). An `--auto`
  chain must pause at both.

## Domain

**Goal (from ROADMAP.md):** v3 passes the production-readiness gate and mobile-perf
budget, earns a signed GO/NO-GO verdict, and the production alias (`montysinger.com`)
is promoted to the v3 build and verified post-promotion. Run
`/gsd-complete-milestone v3.0` AT the GO verdict, not weeks later.

**What this phase delivers:**
1. `vercel build --prod` exit-0 evidence at HEAD of `v3` (DQ-02).
2. Lighthouse desktop scores on the v3 named routes (median-of-3).
3. PSI mobile homepage score — **parity-or-better vs current production**, and explicit
   confirmation the WebGL 3D hero does **not** regress LCP (DQ-03).
4. 375px visual QA on the v3 homepage + interior pages + the two new pages
   (`/uses`, `/watching`) — this **absorbs the human visual checkpoint deferred from
   Phase 16** (`16-09-SUMMARY.md`).
5. D-14 client-bundle secret scan re-run against the v3 build.
6. Theme/FOUC decision recorded (single-mode ship if no dark v3 palette exists).
7. Signed `18-GO-NO-GO.md` + alias promotion + post-promote verification + immediate
   `/gsd-complete-milestone v3.0` (DQ-04).

Phase 18 is a **verification + ship** phase. No new product features are built. Risk
surface = the WebGL hero's effect on LCP/PSI (the highest-risk item of the whole v3
rebuild), score variance, alias drift on promotion, and missed regressions from
Phases 14–17.

## Requirements (locked by REQUIREMENTS.md)

- **DQ-02** — `vercel build --prod` passes the production-readiness gate before any swap.
- **DQ-03** — Mobile performance meets the budget: PSI mobile authoritative,
  parity-or-better vs current; the 3D object does not regress LCP.
- **DQ-04** — At a QA GO verdict, the production alias is promoted to v3 and verified
  post-promotion.

## Decisions (auto-resolved)

### D-01: Build environment for QA
**Decision:** Run `vercel build --prod` locally at HEAD of the `v3` branch (mirrors v1.0
Phase 6 / v2.0 Phase 13 precedent), then deploy a Vercel **preview** of `v3` for
Lighthouse + PSI runs. Production `montysinger.com` is the final post-promote spot-check.
**Reason:** `vercel build --prod` catches env-var mismatches that `next build` misses
(v1.0 retro); a clean preview URL gives unauthenticated Lighthouse/PSI without polluting
prod and allows rollback before promote.
**Auto-selection log:** `[auto] Build env → vercel build --prod + v3 preview URL for Lighthouse/PSI`

### D-02: Lighthouse desktop methodology
**Decision:** Headless Chrome Lighthouse, **desktop preset only**, median-of-3 per route
against the v3 preview URL. Record raw numbers + medians in `18-GO-NO-GO.md`. Mobile
Lighthouse is NOT a gate — PSI is the only mobile gate per DQ-03 (v1.0 retro lesson #3:
local mobile Lighthouse variance ±15pt).
**Routes:** the v3 homepage `/` plus a representative spread of the rebuilt pages
(`/about`, a Notion-backed index, a Notion-backed detail page, `/uses`, `/watching`).
Planner finalizes the exact route list against what shipped in Phases 15–16.
**Auto-selection log:** `[auto] Lighthouse → desktop preset, median-of-3, preview URL, no local mobile gate`

### D-03: PSI mobile methodology + perf floor
**Decision:** Run PageSpeed Insights (https://pagespeed.web.dev/) mobile against the **v3
preview URL** as the pre-ship gate; re-run against `montysinger.com` post-promote as the
GO record. The homepage is the **authoritative route** because that is where the WebGL
hero lives.
**Floor:** parity-or-better vs current production. Last measured v2.0 production PSI
mobile = **82** (Phase 13, `13-03-EVIDENCE.md`); v1.0 baseline = 77. Treat **≥ 82** as
the parity target and **≥ 77** as the hard floor — a drop below current production blocks
GO unless explicitly risk-accepted as GO-with-knowns.
**Auto-selection log:** `[auto] PSI → mobile, preview-URL gate + post-promote prod record; floor parity (≥82, hard ≥77)`

### D-04: WebGL hero LCP / 3D-object verification (v3-specific gate)
**Decision:** Beyond the generic PSI score, explicitly verify the perf cuts locked by
**spike 001 (GO-WITH-CUTS)** held in the shipped build:
1. **LCP is the SSR'd `<h1>` text (or static poster), NEVER the WebGL `<canvas>`** —
   confirm via the PSI/Lighthouse LCP-element diagnostic (spike measured text LCP ~740 ms).
2. **Mobile is served the static poster, not WebGL** — confirm the
   `(pointer:coarse) || innerWidth<760` gate routes mobile to `FallbackPoster`
   (`public/hero-blob-poster.webp`), not the ~885 kB three.js chunk (mobile WebGL = perf
   41 / TBT 5 s in the spike).
3. **Canvas mounts after LCP** (requestIdleCallback / IntersectionObserver), not at
   hydration.
4. **`fetchPriority="high"` is set on the LCP image/poster** — Next 16 does not auto-emit
   it (memory `nextjs16-fetchpriority-quirk`); its absence silently fails LCP request
   discovery.
**Reason:** This is the single highest-risk item of the v3 rebuild and the reason Phase 18
exists as its own gate. A passing aggregate PSI score is not sufficient if the LCP element
is the canvas.
**Auto-selection log:** `[auto] LCP gate → assert text/poster LCP, mobile-poster path, deferred canvas, fetchPriority=high per spike 001`

### D-05: 375px visual QA scope (absorbs deferred Phase 16 checkpoint)
**Decision:** Walk the v3 preview at 375×667 across: `/` (homepage — confirm mobile poster
path, no horizontal overflow), the rebuilt interior pages, and the two new pages
`/uses` + `/watching`. This explicitly **completes the human visual checkpoint deferred
from Phase 16** (`16-09-SUMMARY.md` Task 2). The four Phase-16 deferred items are folded in:
1. Every interior page renders in Pumpkin Amber (amber field, roasted-cocoa ink, teal
   accent); no v2 paper/ink visible.
2. Photo-grid Writing/Works indexes show Notion covers via `/api/notion-cover`.
3. Essay + project detail full-bleed covers load via the proxy; type-only fallback when
   no cover.
4. `/watching` YouTube thumbnails load and cards open YouTube in a new tab.
Capture screenshots to `.planning/phases/18-v3-0-qa-perf-gate-alias-swap/screenshots/`.
**Auto-selection log:** `[auto] Visual QA → 375px homepage + interior + /uses + /watching; fold Phase 16 deferred 4-item checklist`

### D-06: Client-bundle secret scan (D-14 pattern)
**Decision:** Reuse the v1.0/v2.0 D-14 grep verbatim. Grep for `secret_` and
`NOTION_TOKEN` literals in **both** `.next/static/chunks/**/*.js` AND
`.vercel/output/static/_next/static/chunks/**/*.js`, plus the full `.vercel/output/` tree.
Confirm `process.env.NOTION_TOKEN` appears only in server-only modules. Any hit in a
client chunk = blocking fail. Phases 14–17 are presentation-layer only on preserved infra,
so a leak is unexpected — but the scan is cheap insurance against a new client component
importing a server util.
**Auto-selection log:** `[auto] Secret scan → reuse D-14 dual-tree grep across both build-output trees`

### D-07: Per-plan SUMMARY.md + consolidated GO doc
**Decision:** Emit per-plan SUMMARY.md files (tool tracking) AND a final consolidated
`18-GO-NO-GO.md` (human-signed verdict). Mirror the Phase 13 artifact shape; reuse
`13-GO-NO-GO.md` as the format exemplar.
**Auto-selection log:** `[auto] SUMMARY convention → per-plan SUMMARY.md + consolidated 18-GO-NO-GO.md`

### D-08: Promotion mechanism + alias-drift guard
**Decision:** On GO, promote via the project's established prod flow — **`vercel deploy
--prod` (Vercel builds; NEVER `--prebuilt --prod`)** — then explicitly check and correct
**alias drift**: confirm `montysinger.com` resolves to the just-promoted v3 deployment
(memory `vercel-prod-deploy-gotchas`). Post-promote verify: `curl -I montysinger.com`
returns HTTP 200 and the page carries v3 markers (Pumpkin Amber, WebGL hero / poster).
**Open for research/plan:** how v3 reaches production — direct `vercel deploy --prod` from
the `v3` branch vs. merge `v3 → main` first (Vercel auto-deploys prod from `main`) vs.
promoting an existing v3 preview deployment to the production alias. The planner/researcher
must resolve the cleanest path for this project's Vercel setup; whichever path, the two
hard constraints hold: **no `--prebuilt --prod`** and **alias-drift check after promote**.
**Auto-selection log:** `[auto] Promote → vercel deploy --prod (never --prebuilt), mandatory alias-drift check + curl verify; branch→prod path is a research question`

### D-09: Milestone close timing
**Decision:** Run `/gsd-complete-milestone v3.0` immediately upon GO sign-off in the final
plan. Do not defer.
**Reason:** v1.0 retro lesson #1 — "Run complete-milestone at the GO verdict, not weeks
later." Carried through v2.0 (D-08). A month of bookkeeping drift makes close harder than
the close itself.
**Auto-selection log:** `[auto] Milestone close → invoke /gsd-complete-milestone v3.0 immediately at GO`

### D-10: Theme / FOUC decision
**Decision:** v3 is the Pumpkin Amber system (Phase 14 tokens). If no dark v3 palette was
built, record **single-mode (light/amber) ship** explicitly in `18-GO-NO-GO.md` rather
than silently failing a FOUC test — same escape hatch used for v2.0 (Phase 13 D-05). If a
theme toggle DID ship in v3, run the incognito FOUC check instead. Planner confirms which
applies by inspecting `src/app/globals.css` + provider tree at execution start.
**Auto-selection log:** `[auto] Theme → record single-mode ship if no dark palette; else FOUC incognito check`

### D-11: Test-suite / vitest infra
**Decision:** Out of scope. The build gate (`vercel build --prod`) is the production-
readiness gate (catches TS/ESLint/build errors). The known `@rolldown/binding-darwin-arm64`
vitest binding issue (Phase 13 D-10) is not a v3.0 GO blocker; restoration stays a deferred
maintenance TODO.
**Auto-selection log:** `[auto] vitest infra → out of scope; build gate is the readiness gate`

## Plan Outline (auto-suggested, finalized by planner)

Targeted breakdown modeled on Phase 13 (each plan emits a SUMMARY.md per D-07):

1. **18-01** — `vercel build --prod` at HEAD of `v3`; capture exit code + TS/ESLint/429
   output. Satisfies DQ-02.
2. **18-02** — Deploy v3 Vercel preview; capture preview URL. Lighthouse desktop
   median-of-3 on the named routes. (D-02)
3. **18-03** — PSI mobile on preview homepage + the D-04 LCP/3D-object assertions (text
   LCP, mobile-poster path, deferred canvas, fetchPriority). Satisfies DQ-03. *(highest-risk)*
4. **18-04** — Human 375px visual QA across homepage + interior + `/uses` + `/watching`,
   folding the Phase 16 deferred 4-item checklist. (D-05) *(human-gated)*
5. **18-05** — D-14 secret scan + theme/FOUC decision record. (D-06, D-10)
6. **18-06** — Compile `18-GO-NO-GO.md`; human sign-off; promote alias (D-08); post-promote
   verify; run `/gsd-complete-milestone v3.0`. Satisfies DQ-04. *(human-gated)*

Planner has discretion to merge/split (e.g. fold 18-05 into 18-03, or split the promote
step out of 18-06). Mark 18-04 and 18-06 `autonomous: false` so the executor pauses at the
human checkpoints.

## Canonical References

**Downstream agents (researcher, planner, executor, verifier) MUST read these.**

### Phase contracts
- `.planning/REQUIREMENTS.md` — DQ-02 / DQ-03 / DQ-04 exact contracts
- `.planning/ROADMAP.md` §"Phase 18: v3.0 QA, Perf Gate & Alias Swap" — goal, success
  criteria, dependency on Phase 17

### QA pattern templates (direct carryforward)
- `.planning/phases/13-v2-0-qa-go-no-go/13-CONTEXT.md` — D-01..D-10 decision pattern this
  phase adapts
- `.planning/phases/13-v2-0-qa-go-no-go/13-GO-NO-GO.md` — exemplar of the GO doc format +
  sign-off block + promotion plan
- `.planning/milestones/v1.0-phases/06-pre-launch-qa/06-GO-NO-GO.md` — original GO doc /
  D-14 secret-scan exemplar
- `.planning/RETROSPECTIVE.md` — v1.0 + v2.0 lessons (PSI authoritative, median-of-3,
  complete-milestone at GO, dual-tree secret scan)

### WebGL perf de-risking (the DQ-03 / D-04 source)
- `.planning/spikes/MANIFEST.md` — spike 001 GO-WITH-CUTS verdict + the non-negotiable cuts
- `.planning/spikes/001-webgl-homepage-perf/` — full spike probes (LCP, bundle, fallback)
- `.planning/phases/15-slide-deck-homepage-3d-hero/15-CONTEXT.md` — WebGL homepage build
  decisions (HeroBlob, FallbackPoster, useWebGLSupport, mobile/reduced-motion → poster)

### v3 subject-of-QA evidence
- `.planning/phases/16-interior-pages-on-notion-data/16-09-SUMMARY.md` — the deferred
  human visual checkpoint Phase 18 absorbs (D-05)
- `.planning/phases/14-*/` … `17-*/` SUMMARY + VERIFICATION files — what shipped on `v3`
- `src/app/globals.css` — v3 Pumpkin Amber token definitions (theme-mode confirmation, D-10)

### Operational memory (MUST honor)
- `nextjs16-fetchpriority-quirk` — set `fetchPriority="high"` explicitly on the LCP image
- `vercel-prod-deploy-gotchas` — alias drift after `vercel deploy --prod`; NEVER
  `--prebuilt --prod`
- `homepage-webgl-direction` — desktop-WebGL / mobile-poster perf recipe

### Live site
- `https://montysinger.com` — production alias target for promotion + post-promote spot-check
- Vercel project (`m-sizzle-personal-website`, `msizzles-projects`) — preview-URL + alias
  environment

## Deferred Ideas (NOT for Phase 18)

- **Real GLB model swap-in** (voxel-Monty + horse) replacing the procedural WebGL hero —
  future homepage phase, asset workstream.
- **Fluid interweaving scroll line (homepage v2)** and **YouTube zoom-through (homepage v3)**
  — future homepage iterations beyond the shipped v1 hero.
- **v2.0 carried tech debt** — `08/09/10-HUMAN-UAT.md` + matching VERIFICATION files +
  the 4 missing v2.0 quick tasks. Acknowledged non-blocking at v2.0 close; remain deferred,
  not folded into the v3.0 GO.
- **Dark / multi-mode v3 palette** — if v3 ships single-mode (D-10), a dark Pumpkin Amber
  variant is a future requirement.
- **vitest infrastructure restoration** (`@rolldown/binding-darwin-arm64` reinstall) —
  maintenance TODO; not a ship blocker.

## Notes for Downstream Agents

- **Research phase:** thin. The QA pattern, secret-scan command, GO doc format, and PSI/
  Lighthouse methodology are inherited from Phases 6 + 13. The ONE genuinely open research
  item is **D-08's branch→production path** for this Vercel project (direct `--prod` deploy
  from `v3` vs. merge to `main` vs. promote-preview-to-alias) — resolve the cleanest path
  that honors "no `--prebuilt --prod`" + alias-drift check. Secondary: confirm the spike-001
  perf cuts are actually present in the shipped Phase-15 build (read the hero component) so
  D-04 has concrete assertions.
- **Plan phase:** the 6-plan outline is a starting point. Mark 18-04 (visual QA) and 18-06
  (GO sign-off + promote) `autonomous: false` so the executor pauses for human checkpoints.
- **Execute phase:** 18-01 / 18-02 / 18-03 / 18-05 are autonomous; 18-04 and 18-06 require
  human interaction. An `--auto` chain should pause naturally at those checkpoints.
- **Verifier:** must_haves are DQ-02 / DQ-03 / DQ-04 + the signed GO doc + the alias
  promotion + the `/gsd-complete-milestone v3.0` invocation. The phase passes only when the
  build gate is green, PSI mobile meets the D-03 floor, the WebGL hero is confirmed NOT the
  LCP element (D-04), the alias serves v3 with no drift, and the milestone close ran.
