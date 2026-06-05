# 13-03 Evidence: PSI Mobile Gate

## Gate: QA-V2-03

**Requirement:** PSI mobile Performance score >= 75 on homepage (v1.0 PSI 77 baseline)

---

## Result: ✅ PASS — Manual PSI Run (Operator, 2026-05-21)

**Update:** Operator ran PSI manually at https://pagespeed.web.dev/?url=https%3A%2F%2Fmontysinger.com after the autonomous API call hit the daily quota.

### Final Result (operator's manual PSI run, 2026-05-21 6:05 PM EDT)

| Metric | Desktop | Mobile | Threshold | v1.0 baseline |
|--------|---------|--------|-----------|---------------|
| **Performance** | **100** | **82** | ≥ 75 (mobile) | 100 / 77 |
| **Accessibility** | — | 94 | — | — |
| **Best Practices** | — | 100 | — | — |
| **SEO** | — | 100 | — | — |

### Core Web Vitals (Mobile)

| Metric | Value | Status |
|--------|-------|--------|
| First Contentful Paint | 2.6s | orange |
| Largest Contentful Paint | 3.9s | orange |
| Total Blocking Time | 50ms | green ✓ |
| Cumulative Layout Shift | **0** | green ✓ |
| Speed Index | 4.6s | orange |

**Test conditions:** Emulated Moto G Power, Slow 4G throttling, Lighthouse 13.0.1, HeadlessChromium 146.0.7680.177.

### Verdict

**QA-V2-03: ✅ PASS** — Mobile homepage Performance 82 clears the 75 floor with 7-point margin and beats v1.0 PSI baseline of 77.

### Notable Observations

1. **Production was tested, not the local build.** This PSI run hit `https://montysinger.com` — i.e., the production deploy at the time of measurement (which does NOT include today's polish pass: CLS fix, color-contrast token, heading-order, watermark `aria-hidden`, and the still-pending mobile nav fix). Mobile scores will likely improve after the polish pass deploys.

2. **Mobile A11y 94 vs desktop A11y 96** — same 2-point gap pattern as `/` and `/blog/[slug]` showed locally before the polish pass. Root cause is the same: muted-color contrast at `#9A9690` (now fixed locally to `#6E6A65`). Mobile A11y should rise to 96+ once polish pass deploys.

3. **CLS = 0 on production homepage** — confirms the homepage was never the CLS culprit; that was `/blog`. Homepage CLS was already clean.

4. **18-point Desktop-vs-Mobile Performance gap (100 → 82)** — typical of PSI's heavier mobile budget:
   - PSI mobile throttles CPU 4× and applies a Slow 4G network profile, so JS hydration cost weighs heavier
   - LCP 3.9s on mobile is the dominant lever; manifesto-reveal + hero photo on slow network
   - Not a regression — same site, different measurement floor
   - The gate is met; further optimization would be a follow-up perf phase if desired

### PSI Report Screenshot

Captured by operator and saved to `screenshots/` alongside this file (if applicable).
The PSI rendered-page preview at https://pagespeed.web.dev also confirms the **mobile navigation issue** reported in QA-V2-04 — both `Navigation` and `EditorialHeader` are visible on production homepage (the v2.0-route suppression gate is not effective in production, separate from the polish pass). Addressed by upcoming mobile nav fix plan.

---

## Original Result (pre-manual-run, kept for record): PARTIAL — RATE LIMIT EXCEEDED (Autonomous Path Blocked)

| Metric | Value |
|--------|-------|
| **Target URL** | https://montysinger.com |
| **Strategy** | mobile |
| **Run Date** | 2026-05-21T19:55:42Z |
| **Status** | 429 RESOURCE_EXHAUSTED |
| **Score** | not captured (gate blocked at API call) |
| **Verdict** | **PENDING** — requires manual run |

## API Response

```
HTTP 429 RATE_LIMIT_EXCEEDED
quota_metric: pagespeedonline.googleapis.com/default
quota_limit: defaultPerDayPerProject
quota_limit_value: 0
reason: RATE_LIMIT_EXCEEDED
```

Full error payload saved at `/tmp/psi-mobile.json` at run-time. The unauthenticated PSI v5 API endpoint at `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` has a daily query quota that is currently exhausted for our originating IP / project.

## Why This Is a Real Block

The plan (13-03) assumed PSI was always available via unauthenticated curl. In practice, Google's quota for the public-default key is hit quickly. Two real paths forward:

1. **Manual run (recommended for v2.0 ship)** — Open https://pagespeed.web.dev/?url=https%3A%2F%2Fmontysinger.com&form_factor=mobile in a browser. The interactive UI bypasses the API quota. Capture the score and Core Web Vitals manually and paste into this EVIDENCE.md.
2. **Authenticated API run** — Create a Google Cloud project, enable the PageSpeed Insights API, generate an API key, and re-run with `&key=YOUR_KEY` appended. The authenticated quota is 25,000 queries/day.

## Action Required (Manual Step for Operator)

Run this in a browser:

```
https://pagespeed.web.dev/?url=https%3A%2F%2Fmontysinger.com&form_factor=mobile
```

Then update this EVIDENCE.md with:
- Performance score (must be >= 75 to PASS)
- Accessibility / Best Practices / SEO scores
- Core Web Vitals (LCP, CLS, FCP, TTI/INP)
- Screenshot or URL to the report (PSI shares give a permalink)

A reference threshold for comparison (v1.0 Phase 6 result):
- v1.0 PSI mobile homepage: **77** (PASS at the 75 floor)
- v2.0 target: **>= 75** (per QA-V2-03)

## Note on Production vs Preview

Plan called for measurement against a Vercel preview URL. Since 13-02 (preview deploy) has not yet run, the production URL `montysinger.com` is the target here. The current production deploy reflects whatever state was last pushed; v2.0 Phases 8-12 may or may not be live depending on Vercel auto-deploy state. Confirm by inspecting the live site:

- Open https://montysinger.com — if you see the editorial-homepage manifesto ("BRING FIRE / TO HUMANITY."), the v2.0 build is live and this PSI score represents v2.0.
- If you see the old v1.0 carousel/animation homepage, v2.0 hasn't promoted yet and this gate should re-run against the Vercel preview URL produced by 13-02.

## Verdict Path

- If manual PSI run shows mobile performance >= 75: **QA-V2-03 PASS** — record the score here and mark this gate green in 13-GO-NO-GO.md.
- If < 75: **QA-V2-03 FAIL** — document the regression vs v1.0 baseline of 77 and decide whether to ship anyway (per D-09-style risk acceptance) or remediate.

---

**This gate is PENDING manual completion. 13-03-SUMMARY.md records this state.**
