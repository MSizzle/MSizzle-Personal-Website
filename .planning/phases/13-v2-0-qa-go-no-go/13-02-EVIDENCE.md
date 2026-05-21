# 13-02 Evidence: Vercel Preview + Lighthouse Desktop

## Gate: QA-V2-02

**Requirement:** Lighthouse desktop ≥ 90/95/95/100 (Performance/Accessibility/Best Practices/SEO) on home / about / prometheus / blog index / blog post

---

## Result: PARTIAL — Preview Deployed, Lighthouse Runs Pending

| Step | Status |
|------|--------|
| `vercel build --prod` in main tree | ✓ DONE (HEAD `ef05f24`, exit 0, 40 pages) |
| `vercel deploy` to preview | ✓ DONE |
| Preview URL captured | ✓ DONE |
| Preview URL publicly accessible | ✗ **401 Authentication Required** (Vercel Deployment Protection enabled) |
| Lighthouse CLI installed | ✗ not installed |
| 15 Lighthouse runs (5 routes × 3) | **NOT RUN** |
| Median calculation | **NOT COMPUTED** |
| QA-V2-02 verdict | **PENDING** |

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
