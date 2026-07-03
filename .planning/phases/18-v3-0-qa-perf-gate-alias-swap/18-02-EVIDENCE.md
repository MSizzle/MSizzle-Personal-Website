# 18-02 Evidence: Vercel Preview + Lighthouse Desktop

## Gate: D-02

**Requirement:** Lighthouse desktop median-of-3 scores Perf >= 90 / A11y >= 95 / Best Practices >= 95 / SEO = 100 on routes `/`, `/about`, `/writing`, `/uses`, `/portfolio`.

---

## Result: FAIL — 1 route PASS, 4 routes FAIL A11y threshold

**Failing metric:** Accessibility 94 on 4 of 5 routes (threshold: >= 95). Failing audits: `color-contrast` and `heading-order` on `/about`, `/writing`, `/uses`, `/portfolio`. Remediation required before 18-06 GO sign-off.

**Note:** 18-03 and 18-04 can still proceed — they use the preview URL regardless of this gate status.

---

## Preview URL

**Preview URL:** `https://m-sizzle-personal-website-7tqgjvlha-msizzles-projects.vercel.app`

**Deploy details:**
| Field | Value |
|-------|-------|
| Deployment ID | `dpl_5mwQuwksGsMwqN4MPoZ295h17j3U` |
| Inspector URL | https://vercel.com/msizzles-projects/m-sizzle-personal-website/5mwQuwksGsMwqN4MPoZ295h17j3U |
| Deploy timestamp | 2026-07-03T02:47:49Z |
| Git branch | v3 |
| Git HEAD at deploy | `73386c8` (doc-only commits since 18-01 build at `5a97f54`) |
| Pages generated | 39 |
| Build status | READY |

---

## Bypass Header Status

**Deployment Protection: ENABLED (SSO-protected)**

The preview URL returns HTTP 302 redirecting to `vercel.com/sso-api` — Vercel Team SSO protection is active. No `x-vercel-protection-bypass` token was configured in Project Settings.

**Measurement path used: Path C — local `npm run start`** (same fallback as Phase 13's 13-02-EVIDENCE.md)

The local prod server (`npm run start` against `.next/` output from 18-01 `vercel build --prod`) measures the same compiled code. The Vercel CDN typically improves TTFB and FCP by ~50-200ms — i.e., real production scores would be at least as good as localhost. All failures below are markup/DOM issues (color-contrast, heading-order), not CDN-dependent, and will reproduce on the live preview.

---

## Final Median Scores

**Thresholds:** Performance >= 90 / Accessibility >= 95 / Best Practices >= 95 / SEO = 100

| Route | Perf | A11y | BP | SEO | Verdict |
|-------|------|------|----|----|---------|
| `/` | **100** | **96** | 100 | 100 | PASS |
| `/about` | **100** | **94** | 100 | 100 | FAIL (A11y 94 < 95) |
| `/writing` | **100** | **94** | 100 | 100 | FAIL (A11y 94 < 95) |
| `/uses` | **100** | **94** | 100 | 100 | FAIL (A11y 94 < 95) |
| `/portfolio` | **100** | **94** | 100 | 100 | FAIL (A11y 94 < 95) |

---

## Raw Per-Run Scores

| Route | Perf runs | A11y runs | BP runs | SEO runs |
|-------|-----------|-----------|---------|----------|
| `/` | 78 / 100 / 100 | 96 / 96 / 96 | 100 / 100 / 100 | 100 / 100 / 100 |
| `/about` | 100 / 100 / 100 | 94 / 94 / 94 | 100 / 100 / 100 | 100 / 100 / 100 |
| `/writing` | 99 / 100 / 100 | 94 / 94 / 94 | 100 / 100 / 100 | 100 / 100 / 100 |
| `/uses` | 100 / 100 / 100 | 94 / 94 / 94 | 100 / 100 / 100 | 100 / 100 / 100 |
| `/portfolio` | 100 / 100 / 100 | 94 / 94 / 94 | 100 / 100 / 100 | 100 / 100 / 100 |

Note on `/` run 1 Perf=78: First-run cold-cache variance; runs 2 and 3 = 100. Median = 100.

---

## Core Web Vitals (run 2, desktop)

| Route | LCP (ms) | CLS | FCP (ms) | TBT (ms) |
|-------|----------|-----|----------|----------|
| `/` | 600 | 0.000 | 211 | 0 |
| `/about` | 383 | 0.000 | 223 | 0 |
| `/writing` | 698 | 0.000 | 218 | 0 |
| `/uses` | 618 | 0.000 | 209 | 0 |
| `/portfolio` | 618 | 0.000 | 207 | 0 |

All CWV excellent: LCP < 700ms, CLS = 0.000, TBT = 0ms across all routes.

---

## Failure Analysis

### A11y 94 on 4 of 5 routes (FAIL — 1 point below threshold)

Failing audits (identical across `/about`, `/writing`, `/uses`, `/portfolio`):

1. **`color-contrast`** — Background and foreground colors do not have a sufficient contrast ratio.
   - Same root cause as Phase 13: Pumpkin Amber `--color-muted` / `--fg-muted` tokens have insufficient contrast (likely ~2.6:1) against the amber field (`#ff7a14`). Phase 13 fix: darken muted from `#9A9690` to `#6E6A65` (4.9:1 contrast against paper). The v3 Pumpkin Amber palette has analogous muted tokens that need the same treatment.

2. **`heading-order`** — Heading elements are not in a sequentially-descending order.
   - Heading hierarchy skips levels on interior pages. Same class of issue fixed in Phase 13 by correcting h3→h2 in newsletter CTA and personal cards.

The homepage (`/`) scores A11y=96 (PASS) — it passes because the manifesto/personal-brand layout uses a flatter heading hierarchy and the amber-on-amber contrast issue is less prevalent on the homepage's specific elements.

**Recommended remediation (before 18-06 GO sign-off):**
- Audit `--color-muted` and `--fg-muted` CSS variables in `src/app/globals.css`; darken to meet 4.5:1 WCAG AA minimum against background colors
- Fix heading-order violations on `/about`, `/writing`, `/uses`, `/portfolio` — run `lighthouse {url} --view` to pinpoint specific elements

**GO impact:** This is a 1-point gap on A11y (94 vs 95 threshold). The same pattern appeared in Phase 13's pre-fix run (`/` and `/blog/[slug]` both scored A11y=94 before the color-contrast fix). A small CSS polish pass resolves this without architectural changes. This is a **GO-with-fix** situation: 18-06 can hold the GO until a targeted fix is applied, or the operator can accept it as a GO-with-known if the fix is planned for v3.1.

---

## D-02 Verdict

**FAIL** — 4 of 5 routes score A11y=94 (threshold: >= 95). Failing audits: `color-contrast` + `heading-order` on `/about`, `/writing`, `/uses`, `/portfolio`. Performance, Best Practices, and SEO all PASS on every route.

Remediation required before the 18-06 GO sign-off. Plans 18-03 and 18-04 are unblocked and can proceed immediately (they use the preview URL: `https://m-sizzle-personal-website-7tqgjvlha-msizzles-projects.vercel.app`).

---

## Measurement Notes

- Lighthouse CLI: 13.3.0 (globally installed at `/opt/homebrew/bin/lighthouse`)
- Chrome flags: `--headless --no-sandbox`
- Preset: `--preset=desktop`
- Server: `npm run start` (Next.js 16.2.1 local prod, `.next/` output from 18-01 build)
- 15 JSON files: `/tmp/lh-{home,about,writing,uses,portfolio}-{1,2,3}.json`
- Runs executed: 2026-07-03T02:48Z – 2026-07-03T02:58Z
