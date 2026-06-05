---
phase: 13
phase_slug: v2-0-qa-go-no-go
created: 2026-05-21
status: ready
source: 13-RESEARCH.md §"Validation Architecture"
---

# Phase 13 Validation Strategy

**Source:** `.planning/phases/13-v2-0-qa-go-no-go/13-RESEARCH.md` §"Validation Architecture"

This is a QA / verification phase. Each requirement maps directly to a test category and verification command. Plans MUST address each row before the phase can be marked complete.

| Requirement | Test Category | Verification Command / Method | Pass Threshold |
|-------------|---------------|-------------------------------|----------------|
| QA-V2-01 | Build / type-check | `vercel build --prod` exit code | `$? == 0`; zero TS/ESLint/429 errors |
| QA-V2-02 | Lighthouse (desktop) | `npx lighthouse {url} --preset=desktop --output=json`, median of 3 runs | ≥ 90/95/95/100 on home/about/prometheus/blog-index/blog-post |
| QA-V2-03 | PSI (mobile) | https://pagespeed.web.dev/?url={preview_url} | ≥ 75 score on homepage |
| QA-V2-04 | Visual QA (375px) | Human inspection of `/`, `/writing`, `/events`, `/photos` at 375px viewport | No horizontal overflow; editorial layout reads correctly |
| QA-V2-05 | Dark-mode FOUC | Light-only ship decision recorded in 13-GO-NO-GO.md (per D-05) | Decision documented; no FOUC test needed |
| QA-V2-06 | Secret scan | `rg "(secret_|NOTION_TOKEN)" .next/static/chunks .vercel/output/static/_next/static/chunks` | Zero matches in client chunks |
| QA-V2-07 | GO sign-off | `13-GO-NO-GO.md` with explicit GO verdict + `/gsd:complete-milestone v2.0` invocation | Signed doc + milestone closed |

## Nyquist Dimensions

| Dimension | Phase 13 Coverage |
|-----------|-------------------|
| 1. Build | `vercel build --prod` (QA-V2-01) |
| 2. Golden path | Lighthouse desktop on 5 representative routes (QA-V2-02) |
| 3. Lifecycle | Preview deploy → Lighthouse/PSI → secret scan → GO → promote |
| 4. Boundary | 375px viewport (QA-V2-04); PSI mobile lower-bound 75 (QA-V2-03) |
| 5. Regression | Phase 12 routes covered indirectly via Lighthouse + secret scan |
| 6. State | n/a (no schema/DB changes in this phase) |
| 7. Concurrency | n/a (verification phase, no concurrent writes) |
| 8. Validation requirement | This file (`13-VALIDATION.md`) |

No vitest unit-test execution required — Phase 13's gates use external measurement tools (Lighthouse, PSI, rg secret-scan), not the project's vitest suite (which has a known rolldown-binding infra issue out of scope per D-10).
