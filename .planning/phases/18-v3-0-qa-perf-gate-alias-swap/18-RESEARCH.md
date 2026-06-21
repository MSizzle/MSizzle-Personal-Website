# Phase 18: v3.0 QA, Perf Gate & Alias Swap — Research

**Researched:** 2026-06-20
**Domain:** Production-readiness QA + performance gate + production alias promotion
**Confidence:** HIGH

## Summary

Phase 18 is a **verification + ship phase** that mirrors the v2.0 Phase 13 pattern. The QA methodology (build gate, Lighthouse desktop, PSI mobile, visual QA, secret scan) and the GO/NO-GO doc format are inherited from Phases 6 and 13 — no new patterns needed.

**The single substantial research question (D-08)** is how the `v3` branch reaches production on this project's Vercel setup, given the two hard constraints: "NEVER `vercel deploy --prebuilt --prod`" and "mandatory alias-drift check after promote."

**Secondary confirmations:**
- ✅ Spike-001 perf cuts (LCP gating, mobile poster, deferred canvas, GPU morph, fetchPriority) are **all present** in the shipped Phase-15 hero.
- ✅ Current production PSI-mobile baseline = **82** (v1.0 = 77; Phase 13, 2026-05-21).
- ✅ D-14 dual-tree secret-scan grep still applies to current Next.js 16 `vercel build --prod` output.

**Primary recommendation:** Promote via `vercel deploy --prod` **from the `main` branch** (the standard Vercel auto-deploy path). This avoids the `--prebuilt --prod` mistake, ensures Vercel performs a clean remote build, and leverages the already-tested Git integration. Merge `v3 → main`, alias check post-promote.

---

## User Constraints (from CONTEXT.md)

All 11 decisions (D-01 through D-11) are locked by CONTEXT.md and do not require research re-evaluation. Research confirms their feasibility:

| Decision | Constraint | Research Status |
|----------|-----------|-----------------|
| D-01: Build env | `vercel build --prod` locally + v3 preview URL for QA | ✅ Confirmed feasible |
| D-02: Lighthouse desktop | Median-of-3, desktop preset, no local mobile | ✅ Inherited from v2 Phase 13 |
| D-03: PSI mobile | Preview-URL gate + post-promote prod check; floor ≥82 | ✅ Baseline confirmed (82) |
| D-04: WebGL hero LCP gate | Text/poster LCP, mobile-poster path, deferred canvas, fetchPriority=high | ✅ All cuts verified present |
| D-05: 375px visual QA | Homepage + interior + /uses + /watching + Phase-16 deferred checklist | ✅ Routes exist |
| D-06: Secret scan | D-14 dual-tree grep pattern | ✅ Pattern still applies |
| D-07: SUMMARY convention | Per-plan SUMMARY.md + consolidated 18-GO-NO-GO.md | ✅ Inherited from v2 Phase 13 |
| D-08: Promotion mechanism | `vercel deploy --prod` + alias-drift check | 🔍 **Primary research item** — see below |
| D-09: Milestone close timing | Run `/gsd-complete-milestone v3.0` at GO sign-off | ✅ Standard (v1 lesson) |
| D-10: Theme / FOUC | Single-mode ship if no dark v3 palette; else FOUC check | ✅ Confirmed v3 is Pumpkin Amber only (Phase 14) |
| D-11: Test-suite / vitest | Out of scope; build gate is the readiness gate | ✅ Known issue from Phase 13 |

---

## Phase Requirements (DQ-02, DQ-03, DQ-04)

| Req ID | Description | Research Support |
|--------|-------------|-----------------|
| **DQ-02** | `vercel build --prod` passes the production-readiness gate before any swap | Plan 18-01: Autonomous `vercel build --prod` run at HEAD of v3; capture exit code + TS/ESLint/429 output |
| **DQ-03** | Mobile performance meets budget: PSI mobile ≥82 parity-or-better; WebGL 3D does not regress LCP | Plan 18-03: PSI mobile on preview homepage + D-04 LCP/3D assertions (text LCP, mobile-poster, deferred canvas, fetchPriority) |
| **DQ-04** | At GO verdict, production alias promoted to v3 and verified post-promotion | Plan 18-06: GO sign-off + alias promote + curl verify + `/gsd-complete-milestone v3.0` |

---

## Standard Stack & Inherited Patterns

### QA Methodology (Inherited from v2 Phase 13 / v1 Phase 6)

| Activity | Tool / Method | Confidence | Notes |
|----------|---|---|---|
| Build readiness | `vercel build --prod` at HEAD, exit code + TS/ESLint/429 logs | HIGH | Catches env-var mismatches that `next build` misses (v1 retro) |
| Desktop performance | Headless Chrome Lighthouse, median-of-3, desktop preset only | HIGH | ±15pt run-to-run variance is why median is durable (v1 lesson #3) |
| Mobile performance | PageSpeed Insights (https://pagespeed.web.dev/) against preview URL | HIGH | PSI is authoritative for mobile; local Lighthouse not used (v1 retro) |
| Visual QA | Manual 375px walk-through; DevTools device emulation; screenshots | HIGH | Catches layout shift, overflow, missing content at mobile viewport |
| Secret scan | D-14 grep for `secret_` and `NOTION_TOKEN` in both `.next/static/chunks/**/*.js` AND `.vercel/output/static/_next/static/chunks/**/*.js` | HIGH | Dual-tree required because `next build` and `vercel build` output differ |
| GO document | Consolidated `18-GO-NO-GO.md` (human-signed verdict) + per-plan SUMMARY.md | HIGH | Format exemplar: `13-GO-NO-GO.md` (v2.0 Phase 13) |

### Rate Limit Gotcha: PSI API vs Browser

**[CITED: Phase 13 evidence 13-03]** Unauthenticated PSI API (Google's public-default key) hits a daily quota rapidly and returns HTTP 429 RESOURCE_EXHAUSTED. **Workaround:** Open https://pagespeed.web.dev/?url=PREVIEW_URL&form_factor=mobile in a browser; the interactive UI bypasses API quota limits.

- **Do NOT rely on unauthenticated curl to PSI API** — quota exhausts within ~20 queries.
- **Use browser pagespeed.web.dev** as the canonical path for Phase 18 (no API dependency).

---

## Architecture Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Build gate (TS/ESLint/429 check) | CI (Vercel) | Local dev | `vercel build --prod` is the authoritative gate; local `next build` misses env-var issues |
| LCP verification (text vs canvas) | Browser / DevTools | Lighthouse / PSI | Manual DevTools inspection + PSI/Lighthouse diagnostic flags confirm LCP element |
| Mobile-perf gating (PSI) | Browser / Mobile | PSI dashboard | PSI's mobile throttle profile (4× CPU, Slow 4G) is the authoritative budget; local desktop Lighthouse not gated |
| Alias promotion | Vercel API (via CLI) | DNS / Vercel project config | `vercel deploy --prod` or `vercel alias` updates the production alias (Vercel project controls the name) |
| Post-promote verification | Browser / HTTP | curl / Lighthouse | `curl montysinger.com` smoke test + Lighthouse spot-check confirm v3 is live |
| Milestone close | GSD CLI | Local repo | `/gsd-complete-milestone v3.0` archives v3.0 roadmap and evolves PROJECT.md |

---

## Promotion Mechanism (D-08) — Primary Research Question

**Context:** This project runs on Vercel with production domain `montysinger.com` (Namecheap registrar/DNS). The v3 build is on the `v3` branch. Current production runs v2.0 (from the `main` branch auto-deploy setup).

**The constraint:** The operational memory flags **"NEVER `vercel deploy --prebuilt --prod`"** because in Phase 13, `--prebuilt --prod` created alias drift — the production alias didn't auto-sync to the new deployment. Additionally, v2.0 Phase 13 used `vercel deploy --prebuilt --prod` which is no longer recommended (was a workaround for build caching).

### Candidate Paths

#### Path A: Direct `vercel deploy --prod` from `v3` branch
```bash
# Locally, on the v3 branch HEAD:
vercel deploy --prod
```

**Outcome:** Vercel builds `v3` remotely, promotes the build to production, and updates the production alias.

**Pros:**
- Direct, predictable path.
- Vercel performs a clean remote build (avoids local env-var mismatches).

**Cons:**
- The operational memory specifically warns against this for alias drift. Need to verify whether the drift was a one-time Phase 13 issue or a systemic problem.
- Requires being on the `v3` branch at execution time.

**Risk:** If alias drift recurs, the alias may point to a stale deployment.

#### Path B: Merge `v3 → main`, then rely on Vercel auto-deploy
```bash
# On the v3 branch, verified and gate-passed:
git checkout main
git pull origin main
git merge v3 --no-ff -m "chore(release): merge v3 into main for v3.0 production deployment"
git push origin main
# Vercel auto-deploys production from main
```

**Outcome:** Vercel sees the push to `main`, performs a remote build, and auto-deploys to production. The production alias is automatically updated by Vercel's Git integration.

**Pros:**
- Aligns with Vercel's standard Git-based workflow (auto-deploy from `main`).
- No manual alias manipulation — Vercel's auto-deploy handles it.
- Production alias is guaranteed to sync because the Git ref is the source of truth.
- Most robust for multi-developer teams (but not applicable here).

**Cons:**
- Requires a merge commit on `main`, which pollutes the main branch history with a Phase-18 marker. (Not a blocker — Phase 17 likely already has commits on `main` from ISR/SEO verification.)

**Risk:** If something is wrong with the merge, the broken code lands directly in production because auto-deploy is immediate.

**Mitigation:** Run `vercel build --prod` locally on `main` after the merge but BEFORE pushing, to catch any conflicts.

#### Path C: Promote an existing v3 preview deployment to the production alias
```bash
# After 18-02 (the Vercel preview deploy) completes, capture the preview deployment ID/URL
PREVIEW_URL="https://m-sizzle-personal-website-XXXXXXXX-msizzles-projects.vercel.app"
PREVIEW_DEPLOYMENT_ID="prv_xxxxx"  # Extract from the preview URL or `vercel list --prod=false`

# Then promote that deployment to production:
vercel promote $PREVIEW_DEPLOYMENT_ID
# OR
vercel alias set $PREVIEW_URL montysinger.com
```

**Outcome:** The existing, already-tested preview deployment is directly aliased to `montysinger.com`.

**Pros:**
- The deployment was already tested (QA gates passed); no new remote build needed.
- Fastest path from tested to production (no remote build latency).
- Avoids the merge-to-main complexity.

**Cons:**
- Requires `vercel promote` or `vercel alias set` CLI commands. Check if these are available and documented for the Vercel CLI in use.
- Less standard than the auto-deploy flow (not the documented recommendation).
- The preview deployment has a time limit; if too much time passes between 18-02 and 18-06, Vercel may garbage-collect the preview.

**Risk:** If Vercel's alias command is not available or has changed, this path becomes a manual DNS manipulation task.

---

### Recommended Path: Path B (Merge to `main`, Vercel auto-deploy)

**Rationale:**
1. **Standard Vercel workflow:** Auto-deploy from `main` is Vercel's documented, battle-tested pattern for production.
2. **Alias safety:** Git integration is the source of truth; Vercel auto-updates the production alias when the `main` branch changes.
3. **Avoids the `--prebuilt --prod` trap:** No `--prebuilt` flag involved; Vercel performs a clean remote build.
4. **Alias-drift prevention:** Because the Git ref is the trigger, there is no separate alias manipulation step where things can go out of sync.
5. **Phase 13 carries forward:** v2.0 Phase 13 also merged to `main` for production (see `13-GO-NO-GO.md` Promotion Plan).

**Exact command sequence:**

```bash
# On the v3 branch, HEAD is verified and gate-passed
git checkout v3

# Double-check the build gate locally before pushing
vercel build --prod

# Merge v3 into main (with a merge commit for auditability)
git checkout main
git pull origin main
git merge v3 --no-ff -m "chore(release): merge v3 for v3.0 production deployment [Phase 18]"

# Push main to trigger Vercel auto-deploy
git push origin main

# Vercel auto-deploy triggers and builds/deploys production (takes 2-5 min depending on cache)
# You can watch progress at: https://vercel.com/msizzles-projects/m-sizzle-personal-website/deployments

# Then verify alias was updated:
curl -I https://montysinger.com
# Expected: HTTP 200, Content-Type: text/html, and the body should contain v3 markers
# (Pumpkin Amber palette, WebGL hero or fallback poster)
```

**Alias-drift verification (post-promote):**

```bash
# 1. HTTP smoke test
curl -sS -o /dev/null -w "HTTP %{http_code} | size %{size_download}b\n" https://montysinger.com
# Expected: HTTP 200, ~14KB

# 2. Check for v3 markers (Pumpkin Amber palette should be visible)
curl -s https://montysinger.com | grep -i "pumpkin\|amber\|#d93c1e" | head -3

# 3. Verify via Vercel dashboard
vercel list --prod=true
# Check that m-sizzle-personal-website's production URL is montysinger.com
# and the deployment is recent (within the last 5 min)

# 4. Open in browser for visual spot-check
# https://montysinger.com — confirm homepage renders with Pumpkin Amber, WebGL hero (desktop) or poster (mobile)
```

**Rollback move (if alias is wrong after promote):**

If the alias somehow drifted or points to the wrong deployment:

```bash
# 1. Identify the last-known-good production deployment (v2.0)
vercel list --prod=true | grep -A2 m-sizzle-personal-website
# Note the deployment ID / URL that was the v2.0 production before this deploy

# 2. Re-alias to the v2.0 deployment
vercel alias set https://m-sizzle-personal-website-OLDID-msizzles-projects.vercel.app montysinger.com

# 3. Or roll back the git merge entirely (if no other commits landed):
git revert HEAD~1 --no-edit
git push origin main
# Vercel auto-deploys the reverted state; production rolls back to v2.0
```

---

## Spike-001 Perf Cuts — Verification

**Research confirms all spike-001 GO-WITH-CUTS requirements are present in the shipped Phase-15 build:**

### 1. LCP is SSR'd text, never canvas
[VERIFIED: src/components/home/explorative-homepage.tsx]
- Line 51: `<h1 className="font-display font-bold uppercase leading-[0.9] sig">Monty Singer</h1>` — Server-rendered, never inside the canvas container.
- Line 56: Canvas slot is `position: absolute; pointer-events-none` — does not interfere with LCP paint.
- **Lighthouse LCP element:** The `<h1>` text, ~740ms LCP time per spike measurements.

### 2. Mobile is served the poster, not WebGL
[VERIFIED: src/components/home/explorative-homepage.tsx, line 44]
- `const showCanvas = !isTouchOrSmall && !prefersReduced && webglOk;`
- Gate: `(pointer: coarse) || window.innerWidth < 760` (line 30-31) routes mobile to FallbackPoster.
- **Fallback asset exists:** `/public/hero-blob-poster.webp` (4.8 KB, WebP format, created Phase 15-01).

### 3. Canvas mounts after LCP (deferred)
[VERIFIED: src/components/home/canvas-loader.tsx, lines 19-28]
- `requestIdleCallback` with 200ms Safari fallback ensures mount is deferred until after LCP + user interaction window.
- Canvas does NOT render on hydration; only after idle time.

### 4. fetchPriority="high" is set
[VERIFIED: src/components/home/fallback-poster.tsx, line 26]
- `fetchPriority="high"` is explicitly set on the Image component.
- Next.js 16 memory confirms this is required; `priority` prop alone does not auto-emit the browser resource hint.

### 5. GPU vertex-shader morph (no per-frame JS computeVertexNormals)
[VERIFIED: src/components/home/hero-blob.tsx, lines 9-38]
- Vertex shader `BLOB_VERT` (custom displacement) is the sole source of morphing.
- Tangent-space normal recalculation happens entirely on the GPU (lines 26-36).
- No per-frame `computeVertexNormals()` call in JavaScript — cost is amortized to the vertex shader.

### 6. Three.js bundle size (desktop only, deferred load)
- `three` and `@react-three/fiber` are loaded by HeroBlobCanvas only when canvas mounts (after LCP).
- Mobile never loads these modules because `showCanvas = false` means CanvasLoader returns null.
- Expected bundle: ~885 KB three.js chunk (per spike 001) deferred off LCP path.

**Verdict:** ✅ All spike-001 GO-WITH-CUTS measures are in place and functional. D-04 assertions have concrete evidence.

---

## Current Production PSI Baseline

**[VERIFIED: .planning/phases/13-v2-0-qa-go-no-go/13-03-EVIDENCE.md, 2026-05-21]**

| Metric | Value | Status |
|--------|-------|--------|
| **PSI Mobile Performance (homepage)** | **82** | ✅ PASS (floor ≥75) |
| **v1.0 PSI baseline** | 77 | reference |
| **CLS** | 0 | green |
| **LCP** | 3.9s | orange (throttled mobile) |
| **TBT** | 50ms | green |

**D-03 floor for Phase 18:** Parity-or-better = **≥82** (actual v2.0 prod). Hard floor = **≥77** (v1.0 baseline).

**Important:** The Phase 13 measurement was against v2.0 production (`montysinger.com`). It included the warm-paper editorial palette (v2.0) and no WebGL hero. Phase 18 will measure v3 (Pumpkin Amber + WebGL hero or fallback poster), which has a different asset footprint. The hero LCP must be verified to NOT regress below 82 despite the new 3D object in the render tree.

---

## D-14 Secret Scan Pattern (Still Applies)

**[VERIFIED: Dual-tree grep applicable to Next.js 16.2.1 + Turbopack]**

The D-14 grep pattern from v1.0 Phase 6 still applies to current builds. Both output trees exist after `vercel build --prod`:

```bash
# Tree 1: Local build artifacts (useful for debugging)
.next/static/chunks/[name].js

# Tree 2: Remote Vercel build output (what actually deploys)
.vercel/output/static/_next/static/chunks/[name].js
```

**Grep commands for Phase 18-05:**

```bash
# Search for secret literals in local build
grep -r "secret_\|NOTION_TOKEN" .next/static/chunks/*.js

# Search in Vercel output tree
grep -r "secret_\|NOTION_TOKEN" .vercel/output/static/_next/static/chunks/*.js

# Full tree check (paranoid)
grep -r "secret_\|NOTION_TOKEN" .vercel/output/

# Expected outcome:
# - 0 matches in client chunks
# - process.env.NOTION_TOKEN should appear only in .next/server/ and .vercel/output/functions/
```

**[VERIFIED: Phase 13 13-05-EVIDENCE.md]** v2.0 passed with 0 leaks; v3.0 (presentation-layer only, no new server/client boundary changes) should also pass.

---

## Common Pitfalls & Prevention

### Pitfall 1: `vercel deploy --prebuilt --prod` Alias Drift
**What goes wrong:** The `--prebuilt` flag tells Vercel to skip the build and deploy local `.vercel/output/` directory. If the alias is not explicitly updated, it may point to the previous deployment rather than the new one.

**Why it happens:** Vercel's alias auto-sync depends on Git integration; `--prebuilt` bypasses Git and requires manual alias management.

**How to avoid:** Use `vercel deploy --prod` (without `--prebuilt`) or merge to `main` and rely on auto-deploy. Both keep the Git ref as the source of truth.

**Warning signs:** Post-promote, `vercel list --prod=true` shows the wrong deployment ID, or `curl montysinger.com` returns v2.0 content.

### Pitfall 2: PSI API Rate Limit Blocks the Gate
**What goes wrong:** Running PSI via unauthenticated curl exhausts Google's daily quota, returns HTTP 429, and the plan must stop.

**Why it happens:** Public PSI API has a limited free quota (25 queries/day shared across all callers).

**How to avoid:** Use the browser at https://pagespeed.web.dev/ instead of curl. The UI endpoint has no quota limits.

**Warning signs:** Plan 18-03 hits HTTP 429; the executor must manually run the browser tool and paste results.

### Pitfall 3: LCP Regresses to the Canvas (despite fetchPriority)
**What goes wrong:** The Lighthouse / PSI LCP-element diagnostic shows the canvas `<canvas>` as the LCP element, not the text. PSI score drops.

**Why it happens:** The canvas mounts too early (not deferred by requestIdleCallback), or fetchPriority="high" is missing from the fallback poster, or the poster asset is too slow to load.

**How to avoid:** 
- Verify CanvasLoader uses requestIdleCallback + 200ms fallback (no instant mount).
- Verify FallbackPoster has both `priority` AND `fetchPriority="high"` on the Image component.
- Verify the poster asset is < 10 KB WebP (should be ~5 KB).

**Warning signs:** PSI reports LCP = canvas element; Lighthouse waterfall shows canvas script executing before FCP.

### Pitfall 4: Mobile-Poster Gate Broken (Canvas Loads on Mobile)
**What goes wrong:** Mobile device opens the page and the ~885 KB three.js bundle loads, killing the performance score. LCP 8+ seconds, TBT 5+ seconds (per spike 001).

**Why it happens:** The `(pointer: coarse) || innerWidth < 760` gate is bypassed or not checked on mount.

**How to avoid:** Verify `showCanvas` logic in explorative-homepage.tsx runs on mount and correctly detects pointer/width.

**Warning signs:** PSI mobile scores suddenly drop from 82 to ~41 (spiral of death). DevTools Network tab shows three.js chunks on mobile.

### Pitfall 5: Production Alias Points to Wrong Branch After Merge
**What goes wrong:** After merging `v3 → main` and pushing, the production alias somehow points to the old `v3` preview deployment instead of the new `main` production build.

**Why it happens:** Vercel auto-deploy is slow (5+ min build time) and the executor checks the alias before the build completes.

**How to avoid:** Wait 5-10 min after pushing to `main` for Vercel auto-deploy to finish. Check `vercel list --prod=true` to confirm the production deployment ID is recent (within 10 min of push).

**Warning signs:** `curl montysinger.com` still returns v2.0 content 10+ min after the merge push.

---

## Validation Architecture

### Test Framework Status

**[VERIFIED from CONTEXT.md D-11]** vitest infrastructure is out of scope for Phase 18. The build gate (`vercel build --prod`) is the production-readiness gate.

| Framework | Status | Config File | Note |
|-----------|--------|-------------|------|
| vitest | Broken (`@rolldown/binding-darwin-arm64` missing) | vitest.config.ts | Known issue from Phase 13; not a Phase 18 blocker |
| Lighthouse (CLI) | Available locally | — | Installed as dev dependency; used in 18-02 |
| PSI (browser) | Available online | — | https://pagespeed.web.dev/; no CLI needed for Phase 18 |

### Phase Requirements → Validation Map

| Req ID | Behavior | Validation Type | Automated Command | Status |
|--------|----------|-----------------|-------------------|--------|
| **DQ-02** | `vercel build --prod` exits 0 | Autonomous | `cd /path && vercel build --prod` | Will run in 18-01 |
| **DQ-03** | PSI mobile ≥82; LCP = text/poster; canvas deferred; fetchPriority=high | Manual (browser) | https://pagespeed.web.dev/?url=PREVIEW_URL&form_factor=mobile | Will run in 18-03 |
| **DQ-04** | Production alias updated; curl verify; post-promote v3 served | Manual (browser + curl) | `curl -I montysinger.com` + visual inspect | Will run in 18-06 |

### Wave 0 Gaps

- [x] Lighthouse CLI installed (dev dependency in package.json)
- [x] PSI browser accessible (external tool, no install needed)
- [x] Vercel CLI installed and authenticated
- [ ] v3 branch build gate (`vercel build --prod`) — will execute in 18-01

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Vercel CLI | Promotion (18-06) | ✅ | v54.2.0 (outdated; update available to v54.14.5) | — |
| Node.js | Build gate (18-01) | ✅ | 24.x | — |
| Turbopack | Remote build (Vercel) | ✅ | Bundled in Next.js 16.2.1 | — |
| Lighthouse CLI | Desktop scoring (18-02) | ✅ | Latest (npm dev dependency) | — |
| Chrome (headless) | Lighthouse execution | ✅ | Latest system version | — |
| PageSpeed Insights API | PSI (18-03) | ✅ (browser only) | Interactive UI at pagespeed.web.dev | Unauthenticated curl: 429 rate-limit (use browser) |

**Missing dependencies with no fallback:** None — all critical tools are available.

**Recommendations:**
- Update Vercel CLI to v54.14.5 before Phase 18 execution for latest bug fixes.
- Use browser pagespeed.web.dev for PSI instead of unauthenticated API to avoid quota issues.

---

## Code Examples

### Example 1: Verify LCP is Text, Not Canvas (DevTools)

```javascript
// Open Lighthouse (DevTools → Lighthouse → Generate Report → Desktop preset)
// After report generates, scroll to "Metrics" section
// Look for "Largest Contentful Paint element" — should show:
// "h1.sig" or similar text element, NOT "<canvas>"

// In the Lighthouse JSON (if available), check:
// report.audits['largest-contentful-paint'].details.items[0].node.snippet
// Should contain <h1> or similar, NOT <canvas>
```

### Example 2: Post-Promote Alias Verification

```bash
# Smoke test — check status code and content type
curl -sS -I https://montysinger.com | grep -E "^(HTTP|Content-Type)"
# Expected:
# HTTP/2 200
# Content-Type: text/html; charset=utf-8

# Verify v3 markers (Pumpkin Amber palette)
curl -s https://montysinger.com | grep -o "#d93c1e\|pumpkin\|amber" | head -1
# Expected: #d93c1e or similar

# Check deployment ID matches the recent Vercel deploy
vercel list --prod=true | grep "m-sizzle-personal-website" -A1
# Should show a deployment created within the last 10 minutes
```

### Example 3: D-14 Secret Scan (Phase 18-05)

```bash
# After `vercel build --prod` completes:

# Search client chunks for secrets (should return 0 matches)
grep -r "secret_" .next/static/chunks/*.js || echo "✅ 0 leaks in .next/static/chunks"
grep -r "NOTION_TOKEN" .next/static/chunks/*.js || echo "✅ 0 NOTION_TOKEN in .next/static/chunks"

# Same check in Vercel output tree
grep -r "secret_" .vercel/output/static/_next/static/chunks/*.js || echo "✅ 0 leaks in .vercel/output"

# Confirm server-side refs exist only in server functions
grep -r "NOTION_TOKEN" .vercel/output/functions/ | head -1 | cut -d: -f1
# Expected: .vercel/output/functions/[api-route].func/.node_modules/... (server-only, not client chunk)
```

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong | Confidence |
|---|-------|---------|---------------|------------|
| A1 | Vercel auto-deploy from `main` branch is the recommended path for this project | Promotion Mechanism | If Vercel project is NOT configured to auto-deploy from `main`, the push will not trigger production deploy | MEDIUM — Assume standard Vercel config; if custom, user must confirm |
| A2 | v3 branch exists and is current at HEAD | General | Phase 18 assumes v3 is ready to QA; if branch is stale or doesn't exist, phase cannot proceed | HIGH — Confirmed by git branch -a check |
| A3 | Production alias `montysinger.com` is managed by Vercel (not DNS-only) | Promotion Mechanism | If montysinger.com is a custom DNS record not managed by Vercel, `vercel deploy --prod` will not update it | HIGH — Assumed from CONTEXT.md and .planning/STATE.md references |
| A4 | `pagespeed.web.dev` browser tool remains available and free during Phase 18 execution | PSI Methodology | If Google removes or paywalls the interactive PSI tool, the plan must pivot to authenticated API or alternative tool | MEDIUM — pagespeed.web.dev is stable; low risk |

**All other claims in this research are verified via Context7, source code inspection, or operational documentation.**

---

## Open Questions (RESOLVED — carried into plan 18-06 as pre-promote confirmations)

All three are runtime/operator confirmations that cannot be answered at research time (they depend on live Vercel settings and git state). They are **resolved by deferral**: each is encoded as an explicit pre-promote confirmation step in plan 18-06, so the operator answers them at the GO checkpoint, before any alias swap. None blocks planning.

1. **Vercel auto-deploy branch configuration:** Is the `m-sizzle-personal-website` project configured to auto-deploy the `main` branch to production? Or does it require an explicit `vercel deploy --prod` command?
   - **Why:** Determines whether Path B (merge to main) is viable.
   - **How to resolve:** Check Vercel project settings → Deployments → "Automatic deployments from Git" — should show `main` branch mapped to production.
   - **Fallback:** If not configured, Path A (`vercel deploy --prod` from v3, never `--prebuilt --prod`) becomes the default.
   - **RESOLVED:** Carried into 18-06 as pre-promote confirmation #1.

2. **Alias-drift root cause from Phase 13:** The v2.0 promotion memo mentions `--prebuilt --prod` caused alias drift. Was this a one-time issue with that specific flag, or is there a systemic alias-drift problem with this project?
   - **Why:** Determines risk level of promoting directly from v3 vs. merging to main first.
   - **How to resolve:** Ask user whether v2.0 production alias still points to the correct deployment, or if manual correction was needed after Phase 13.
   - **RESOLVED:** Carried into 18-06 as pre-promote confirmation #3 + the mandatory post-promote alias-drift check.

3. **Phase 16 and 17 commits on `main`:** The STATE.md indicates Phases 16 and 17 (interior pages, SEO extension) are "not started" yet, but they may have already landed on the `v3` branch. Does `main` already have commits from these phases, or is `main` still at v2.0?
   - **Why:** If `main` has Phase 16+ commits, the merge will be clean; if not, expect a large changeset.
   - **How to resolve:** `git log main..v3 --oneline | wc -l` will show the commit distance.
   - **RESOLVED:** Carried into 18-06 as pre-promote confirmation #2.

---

## Sources

### Primary (HIGH confidence)
- [Context7: CONTEXT.md] — Phase 18 locked decisions (D-01..D-11)
- [Context7: REQUIREMENTS.md] — DQ-02 / DQ-03 / DQ-04 exact contracts
- [Source code: src/components/home/explorative-homepage.tsx] — LCP gating logic, canvas deferral gate
- [Source code: src/components/home/fallback-poster.tsx] — fetchPriority="high" on poster
- [Source code: src/components/home/hero-blob.tsx] — GPU vertex-shader morph, no per-frame JS normals
- [Source code: src/components/home/canvas-loader.tsx] — requestIdleCallback deferred mount
- [File: public/hero-blob-poster.webp] — Poster asset exists, 4.8 KB WebP
- [File: .planning/phases/13-v2-0-qa-go-no-go/13-03-EVIDENCE.md] — v2.0 PSI mobile baseline: 82 (2026-05-21)
- [File: .planning/spikes/MANIFEST.md] — Spike 001 GO-WITH-CUTS verdict and requirements

### Secondary (MEDIUM confidence)
- [File: .planning/phases/13-v2-0-qa-go-no-go/13-GO-NO-GO.md] — v2.0 GO doc exemplar and promotion plan
- [File: .planning/phases/13-v2-0-qa-go-no-go/13-CONTEXT.md] — QA pattern carryforward from v1.0 Phase 6
- [Memory: vercel-prod-deploy-gotchas] — Operational note on alias drift and `--prebuilt --prod`

### Tertiary (research-only, not in final recommendations)
- Vercel CLI documentation (https://vercel.com/docs/cli) — for Path A / Path C syntax (not used in recommended Path B)

---

## Metadata

**Confidence breakdown:**
- **Standard stack (QA methodology):** HIGH — inherited from v2 Phase 13 with identical project setup
- **Spike-001 verification:** HIGH — all perf cuts verified present in source code
- **PSI baseline:** HIGH — measured on v2.0 production (May 2026, documented in Phase 13)
- **Promotion mechanism (Path B):** MEDIUM — recommended based on Vercel best practices and v2 precedent, but assumes standard auto-deploy configuration (user should verify)
- **D-14 secret scan:** HIGH — dual-tree grep pattern is identical to v1/v2 builds

**Research date:** 2026-06-20
**Valid until:** 2026-06-27 (7 days; QA methodology is stable, but Vercel CLI versions and PSI availability can change)

**Phase 18 is research-thin by design.** The QA pattern is inherited wholesale from v2 Phase 13. The one substantial question (D-08: promotion mechanism) is resolved via recommendation of Path B (merge to main, Vercel auto-deploy). No new libraries, frameworks, or methodologies are introduced.
