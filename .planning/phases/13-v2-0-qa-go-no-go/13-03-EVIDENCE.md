# 13-03 Evidence: PSI Mobile Gate

## Gate: QA-V2-03

**Requirement:** PSI mobile Performance score >= 75 on homepage (v1.0 PSI 77 baseline)

---

## Result: ✅ PASS — Manual PSI Run (Operator, 2026-05-21)

**Update:** Operator ran PSI manually at https://pagespeed.web.dev/?url=https%3A%2F%2Fmontysinger.com after the autonomous API call hit the daily quota.

### Final Result

| Metric | Desktop | Mobile |
|--------|---------|--------|
| **Performance** | **100** | **82** |
| Threshold | n/a (QA-V2-02 covers desktop) | ≥ 75 (QA-V2-03) |
| v1.0 baseline | 100 | 77 |
| Verdict | n/a | **PASS** (+5 vs v1.0 baseline; +7 over threshold) |

**QA-V2-03: ✅ PASS** — Mobile homepage score 82 clears the 75 floor with margin and beats the v1.0 PSI baseline of 77.

### Observation: 18-Point Desktop-vs-Mobile Gap

Desktop = 100, mobile = 82. Typical sources of this gap on Vercel:
- PSI mobile throttles CPU 4× and applies a Fast 3G network profile, so JS hydration cost weighs heavier
- Same image bytes consume relatively more of the mobile budget
- ManifestoReveal (motion/react) hydration likely accounts for a chunk

Not a regression — same site, just different measurement floor. The gap can be narrowed in a follow-up perf phase if desired, but the gate is met.

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
