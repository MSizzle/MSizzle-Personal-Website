# 13-02 Evidence: Vercel Preview + Lighthouse Desktop

## Gate: QA-V2-02

**Requirement:** Lighthouse desktop ≥ 90/95/95/100 (Performance/Accessibility/Best Practices/SEO) on home / about / prometheus / blog index / blog post

---

## Result: ✅ PASS — All 5 Routes Clear Thresholds (after polish fixes)

**Update 2026-05-21 (post-fix run):** Operator approved a polish pass; 4 fixes applied (CLS removal, color-contrast token darken, two heading-order fixes, watermark `aria-hidden`). Re-ran Lighthouse on the 3 previously-failing routes — all now PASS.

### Final Median Scores (after polish)

| Route | Perf | A11y | BP | SEO | Verdict | Δ vs initial |
|-------|------|------|----|----|---------|--------------|
| `/` | **99** | **96** | 100 | 100 | ✓ PASS | A11y +2 (94→96) |
| `/about` | 100 | 96 | 100 | 100 | ✓ PASS | (unchanged — was already passing) |
| `/prometheus` | 100 | 96 | 100 | 100 | ✓ PASS | (unchanged) |
| `/blog` | **96** | 96 | 100 | 100 | ✓ PASS | Perf **+27** (69→96), CLS **0.685→0.000** |
| `/blog/[slug]` | 99 | **96** | 100 | 100 | ✓ PASS | A11y +2 (94→96) |

**Fixes applied:**
- `src/app/blog/page.tsx` — Removed `<Suspense>` wrapper (data is server-fetched; the streaming fallback was the CLS culprit per Lighthouse's `cls-culprits-insight`).
- `src/components/blog/tag-filter.tsx` — Added `priority={idx < 2}` to first two `<Image>` covers (above-the-fold LCP discoverability).
- `src/app/globals.css` — Darkened `--color-muted` and `--fg-muted` from `#9A9690` (contrast 2.6:1) to `#6E6A65` (contrast 4.9:1 against `#F4F2EC`). Clears WCAG AA color-contrast.
- `src/app/page.tsx` — Personal cards `<h3>` → `<h2>` (manifesto h1 → h2 hierarchy).
- `src/components/blog/newsletter-cta.tsx` — Monty Monthly `<h3>` → `<h2>` (under post `<h1>`).
- `src/app/layout.tsx` — Added `aria-hidden="true"` to the Prometheus corner watermark (decorative branding; was failing color-contrast at 1.55:1 with `opacity-20`).

---

## Original Result (pre-fix, kept for record): FAIL — 2 routes PASS, 3 routes FAIL thresholds

| Step | Status |
|------|--------|
| `vercel build --prod` in main tree | ✓ DONE (HEAD `ef05f24`, exit 0, 40 pages) |
| `vercel deploy` to preview | ✓ DONE |
| Preview URL captured | ✓ DONE |
| Preview URL publicly accessible | ✗ 401 (Vercel Deployment Protection) — fell back to Path C (localhost:3000) |
| Lighthouse CLI installed | ✓ DONE (`lighthouse@13.3.0` global) |
| `npm run start` local prod server | ✓ DONE (HTTP 200) |
| 15 Lighthouse runs (5 routes × 3) | ✓ DONE (all JSONs in `lighthouse/`) |
| Median calculation | ✓ DONE |
| **QA-V2-02 verdict** | **✗ FAIL** (3 of 5 routes below thresholds) |

## Lighthouse Median Results (local prod server, 2026-05-21)

| Route | Perf | A11y | BP | SEO | Verdict |
|-------|------|------|----|----|---------|
| `/` | **98** | **94** | 100 | 100 | ✗ FAIL (A11y 94 < 95) |
| `/about` | **100** | **96** | 100 | 100 | ✓ PASS |
| `/prometheus` | **100** | **96** | 100 | 100 | ✓ PASS |
| `/blog` | **69** | **96** | 100 | 100 | ✗ FAIL (Perf 69 < 90 — major) |
| `/blog/pursuit-of-happierness` | **99** | **94** | 100 | 100 | ✗ FAIL (A11y 94 < 95) |

**Thresholds:** Performance ≥ 90 / Accessibility ≥ 95 / Best Practices ≥ 95 / SEO = 100.

## Raw Per-Run Scores

| Route | Perf runs | A11y runs | BP runs | SEO runs |
|-------|-----------|-----------|---------|----------|
| `/` | 98 / 98 / 98 | 94 / 94 / 94 | 100 / 100 / 100 | 100 / 100 / 100 |
| `/about` | 100 / 100 / 100 | 96 / 96 / 96 | 100 / 100 / 100 | 100 / 100 / 100 |
| `/prometheus` | 100 / 100 / 100 | 96 / 96 / 96 | 100 / 100 / 100 | 100 / 100 / 100 |
| `/blog` | 74 / 69 / 69 | 96 / 96 / 96 | 100 / 100 / 100 | 100 / 100 / 100 |
| `/blog/pursuit-of-happierness` | 99 / 99 / 99 | 94 / 94 / 94 | 100 / 100 / 100 | 100 / 100 / 100 |

## Core Web Vitals (medians, local server)

| Route | LCP (ms) | CLS | FCP (ms) | TBT (ms) |
|-------|----------|-----|----------|----------|
| `/` | 1066 | 0.000 | 209 | 0 |
| `/about` | 620 | 0.000 | 207 | 0 |
| `/prometheus` | 795 | 0.000 | 207 | 0 |
| `/blog` | **1805** | **0.685** | 247 | 0 |
| `/blog/pursuit-of-happierness` | 876 | 0.000 | 208 | 0 |

## Failure Analysis

### 🔴 `/blog` — Performance 69, CLS 0.685 (BLOCKING)

The blog index page exhibits **severe Cumulative Layout Shift** (0.685 vs Google's "good" threshold of 0.1). LCP of 1805ms is acceptable but the CLS dominates the Perf score. Likely cause: the `<TagFilter>` component or related list rendering shifts content after first paint. This is the **only true regression** of the 5 routes — and it traces to Phase 12-04's restyle of `/blog`.

**Reproduction:** `http://localhost:3000/blog` — observe layout shift as the page hydrates.

**Likely fix:** Reserve space for the tag filter before hydration, or load tags server-side and skip the post-mount filter rendering.

### 🟡 `/` and `/blog/[slug]` — Accessibility 94 (1 point below 95)

Both routes score 94 instead of the required 95. The Phase 9 `/about` and `/prometheus` score 96 with the same primitives, suggesting the homepage manifesto and blog post body have one isolated a11y audit failure each (likely a contrast pair, missing aria-label, or a heading-order violation). A 1-point gap is borderline; depending on which audit is failing, this may be a documentation-vs-blocking call.

**Diagnosis:** open the JSON files in the `lighthouse/` directory or run `lighthouse {url} --view` to see exactly which audits failed.

## Specific Failed Audits (per route)

Extracted from the lighthouse JSONs:

### `/` (home) — Accessibility 94
- **`color-contrast`** ✗ — Background/foreground colors lack sufficient contrast.
  - Likely culprit: `text-muted` (#9A9690) on `text-paper` (#F4F2EC) — contrast ratio ~2.5:1, below the 4.5:1 WCAG AA minimum. Editorial palette tradeoff.
- **`heading-order`** ✗ — Heading elements skip a level (e.g., `h1` → `h3`, no `h2`).
  - Likely culprit: editorial homepage's manifesto + 5 vertical sections; the section labels may be using `h3` directly without an `h2` wrapper.

### `/` — Performance 98 (still passes, but worth noting)
- `lcp-discovery-insight`, `unused-javascript`, `network-dependency-tree-insight` are advisory warnings; perf still ≥ 90.

### `/blog` (index) — Performance 69 (BLOCKING)
- **`layout-shifts`** ✗ — 1 large layout shift observed; total CLS 0.685.
- **`cls-culprits-insight`** ✗ — Layout shift culprits identified by Lighthouse.
- **`image-delivery-insight`** ✗ — Est savings 743 KiB. Blog post cover images likely not optimized or not reserving space.
  - Likely fix: explicit `width`/`height` on `<Image>` components for blog post covers (matches Phase 12-04 code review warning WR-02).
- **`unused-javascript`** ✗ — Est savings 50 KiB.
- **`legacy-javascript-insight`** ✗ — Polyfill bytes for older browsers (~13 KiB).

### `/blog` — Accessibility 96 (passes)
- `color-contrast` ✗ — same warm-paper palette issue, but route passes by margin.

### `/blog/[slug]` (post) — Accessibility 94
- **`color-contrast`** ✗ — same palette issue.
- **`heading-order`** ✗ — post body heading hierarchy may skip levels.

## Recommended Fix Plan (for a `12.1` polish phase, post-v2.0 GO)

The findings collectively suggest a focused polish phase:

| Fix | Routes affected | Effort | Impact |
|-----|-----------------|--------|--------|
| Reserve `<Image>` dimensions on blog index covers (closes WR-02 too) | `/blog` | Small | Closes `/blog` CLS 0.685 → likely Perf 95+ |
| Audit `text-muted` color contrast against `text-paper`; consider darkening muted to #8A8680 or similar | `/`, `/blog`, `/blog/[slug]` | Small | Closes color-contrast a11y audits (94→96 on `/` and `/blog/[slug]`) |
| Verify heading hierarchy on `/` (manifesto + section labels) and blog post body | `/`, `/blog/[slug]` | Small | Closes heading-order audits |
| (Optional) modern-browser build target to skip legacy polyfills | all | Medium | -13 KiB JS bundle |

These are all small textual changes; the entire polish phase could ship in a single small PLAN.md.

## Note on Measurement Path

This run used Path C (local `npm run start`) instead of Path A (Vercel preview with bypass token). The Vercel CDN typically improves TTFB and FCP by ~50-200ms — i.e., real production scores would likely be **higher** than localhost. So:

- The PASSES (`/about`, `/prometheus`) are robust — they pass even without the CDN advantage.
- The `/blog` CLS failure is NOT a CDN issue — layout shift is purely client-side rendering. This will reproduce in production.
- The `/` and `/blog/[slug]` a11y misses are also purely client (DOM/markup) issues — not CDN-dependent.

For final certainty before promote, re-run Path A or Path B against the Vercel preview after granting bypass access. The localhost results are a faithful lower-bound estimate.

## What This Means for v2.0 GO

- 2 routes (`/about`, `/prometheus`) cleared all thresholds with margin.
- 1 route (`/blog`) has a **real performance regression** (CLS 0.685) that should be fixed before GO, or explicitly ship-with-known.
- 2 routes (`/`, `/blog/[slug]`) miss accessibility by 1 point — investigate the specific failed audit before deciding.

**Recommendation: GO-with-knowns** if operator accepts the `/blog` CLS regression as a v2.1 fix; otherwise **NO-GO** until CLS is remediated.

---

**Status: COMPLETE (measurement) — verdict is documented for operator GO decision.**

## Preview Deployment

```
Deployment ID:    dpl_AsEAiw9a3S9b5VX4QUS5NjLznLYP
Preview URL:      https://m-sizzle-personal-website-h5zzgtecg-msizzles-projects.vercel.app
Inspector URL:    https://vercel.com/msizzles-projects/m-sizzle-personal-website/AsEAiw9a3S9b5VX4QUS5NjLznLYP
Ready state:      READY
Build time:       51s (Vercel side)
```

## Block: Vercel Deployment Protection

A `curl -L` against the preview URL returns **HTTP 401 Authentication Required** with the page title "Authentication Required". The project has Vercel's deployment-protection feature enabled, which requires login to view preview URLs.

This blocks autonomous Lighthouse runs against the preview URL.

## Three Paths Forward (Operator Choice)

### Path A — Use Vercel "Protection Bypass" token (recommended for repeatability)

1. Open https://vercel.com/msizzles-projects/m-sizzle-personal-website/settings/deployment-protection
2. Under "Protection Bypass for Automation" → generate a bypass secret
3. Re-run Lighthouse passing the secret as a header:

```bash
npm i -g lighthouse@13.3.0   # if not installed
mkdir -p .planning/phases/13-v2-0-qa-go-no-go/lighthouse
PREVIEW=https://m-sizzle-personal-website-h5zzgtecg-msizzles-projects.vercel.app
BYPASS=YOUR_BYPASS_SECRET   # paste from Vercel settings
# Discover a real blog slug from the live preview
BLOG_SLUG=$(curl -sH "x-vercel-protection-bypass: $BYPASS" "$PREVIEW/blog" | grep -oE 'href="/blog/[a-z0-9-]+"' | head -1 | sed 's|href="/blog/||;s|"||')

for route in / /about /prometheus /blog /blog/$BLOG_SLUG; do
  for i in 1 2 3; do
    fname=$(echo "$route" | tr '/' '_' | sed 's/^_//;s/^$/home/')
    npx lighthouse "$PREVIEW$route" \
      --preset=desktop \
      --output=json \
      --output-path=.planning/phases/13-v2-0-qa-go-no-go/lighthouse/${fname}-$i.json \
      --chrome-flags="--headless" \
      --extra-headers='{"x-vercel-protection-bypass":"'"$BYPASS"'"}' \
      --quiet
  done
done
```

### Path B — Disable deployment protection (one-time, less secure)

1. Open https://vercel.com/msizzles-projects/m-sizzle-personal-website/settings/deployment-protection
2. Set "Vercel Authentication" → "Standard Protection" → **Off** (or "Only Production Deployments")
3. Re-fetch the preview URL — should now return 200
4. Run the Lighthouse loop from Path A without the bypass header

### Path C — Lighthouse against local prod server

The simplest no-config path: run `npm run start` of the prebuilt output locally and Lighthouse against `http://localhost:3000`. This measures the same compiled code path; the only delta is the Vercel CDN (which affects TTFB more than rendering metrics like LCP/CLS).

```bash
npm i -g lighthouse@13.3.0
PORT=3000 npm run start &  # serves .next/ in production mode
sleep 5
mkdir -p .planning/phases/13-v2-0-qa-go-no-go/lighthouse
BLOG_SLUG=$(curl -s http://localhost:3000/blog | grep -oE 'href="/blog/[a-z0-9-]+"' | head -1 | sed 's|href="/blog/||;s|"||')

for route in / /about /prometheus /blog /blog/$BLOG_SLUG; do
  for i in 1 2 3; do
    fname=$(echo "$route" | tr '/' '_' | sed 's/^_//;s/^$/home/')
    npx lighthouse "http://localhost:3000$route" \
      --preset=desktop \
      --output=json \
      --output-path=.planning/phases/13-v2-0-qa-go-no-go/lighthouse/${fname}-$i.json \
      --chrome-flags="--headless" \
      --quiet
  done
done
kill %1   # stop the server
```

## Pass Thresholds (per ROADMAP §Phase 13 success criterion 2)

| Category | Threshold |
|----------|-----------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | 100 |

Median of 3 runs per route. All 5 routes must clear all 4 thresholds for QA-V2-02 PASS.

## Median Extraction (post-runs)

After the 15 JSON files exist, compute the median:

```bash
cd .planning/phases/13-v2-0-qa-go-no-go/lighthouse
for fname in home about prometheus blog blog_*; do
  for cat in performance accessibility best-practices seo; do
    scores=$(node -e "
      const fs=require('fs');
      const files=['${fname}-1.json','${fname}-2.json','${fname}-3.json'];
      const s=files.map(f=>{ try{return JSON.parse(fs.readFileSync(f,'utf8')).categories['${cat}'].score*100} catch{return null} }).filter(x=>x!==null).sort((a,b)=>a-b);
      console.log(s[1] ?? 'missing');
    ")
    printf "%-15s %-20s %s\n" "$fname" "$cat" "$scores"
  done
done
```

Paste the median table into this EVIDENCE.md under a new section "Lighthouse Median Results" once collected.

---

**Status: PENDING — operator must run Lighthouse via one of the three paths above, then update this EVIDENCE.md with results.**

The build + deploy half of this plan is DONE. Only the measurement step remains.
