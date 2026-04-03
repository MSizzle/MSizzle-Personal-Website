---
phase: 5
slug: analytics
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification + curl/CLI commands |
| **Config file** | none — no test framework needed for infrastructure deployment |
| **Quick run command** | `curl -s https://analytics.msizzle.com/api/heartbeat` |
| **Full suite command** | `curl -s https://analytics.msizzle.com/api/heartbeat && curl -s -o /dev/null -w '%{http_code}' https://msizzle.com \| grep 200` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick heartbeat check
- **After every plan wave:** Run full suite command
- **Before `/gsd:verify-work`:** Full suite must be green + manual dashboard verification
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | ANLY-01 | manual | Neon DB creation — verify via Neon dashboard | N/A | ⬜ pending |
| 05-01-02 | 01 | 1 | ANLY-01 | manual | Umami fork + Vercel deploy — verify heartbeat endpoint | N/A | ⬜ pending |
| 05-02-01 | 02 | 2 | ANLY-01 | integration | `grep -r 'NEXT_PUBLIC_UMAMI' src/app/layout.tsx` | ✅ | ⬜ pending |
| 05-02-02 | 02 | 2 | ANLY-04 | integration | `grep -r 'data-umami-event' src/` | ✅ | ⬜ pending |
| 05-03-01 | 03 | 3 | ANLY-01,02,03,05,06 | manual | Visit site → check Umami dashboard for pageview + geo + sources | N/A | ⬜ pending |
| 05-03-02 | 03 | 3 | ANLY-04 | manual | Click outbound link → check Umami events log | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — no test framework install needed. Phase 5 is infrastructure deployment (Umami + Neon) plus script integration, verified via HTTP endpoints and dashboard inspection.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Pageview appears in Umami dashboard | ANLY-01 | Requires live deployed site + Umami instance | Visit any page, check dashboard within 30s |
| Real-time visitor count | ANLY-02 | Requires live traffic observation | Open dashboard real-time view while browsing site |
| Traffic source breakdown | ANLY-03 | Requires UTM params in URL | Visit with `?utm_source=test&utm_medium=test`, check sources |
| Custom event tracking | ANLY-04 | Requires click on deployed site | Click outbound link, check events log in Umami |
| Page popularity ranking | ANLY-05 | Requires multiple page visits | Visit several pages, check page ranking in dashboard |
| Geo map visualization | ANLY-06 | Requires geo data from real visit | Check world map widget in Umami dashboard |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
