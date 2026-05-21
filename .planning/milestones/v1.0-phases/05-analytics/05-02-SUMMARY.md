---
phase: "05-analytics"
plan: "02"
subsystem: "analytics"
tags: ["umami", "neon", "vercel", "infrastructure", "deployment"]
dependency_graph:
  requires:
    - "05-01 (UmamiAnalytics component + outbound event attributes)"
  provides:
    - "Live Umami dashboard at https://analytics.montysinger.com (custom subdomain) — also reachable at https://umami-khaki-three.vercel.app"
    - "Production env vars NEXT_PUBLIC_UMAMI_URL and NEXT_PUBLIC_UMAMI_WEBSITE_ID"
    - "End-to-end analytics pipeline from main site to Umami"
  affects:
    - "Vercel project: m-sizzle-personal-website (production env vars)"
    - "Vercel project: umami (separate, fork of umami-software/umami)"
    - "Neon project: umami-analytics database"
tech_stack:
  added:
    - "Umami v3.x (separate Vercel project, forked)"
    - "Neon Postgres (free tier, pooled connection)"
  patterns:
    - "Production-only env var scoping (no Preview/Development) per D-09"
    - "Separate Vercel project for analytics dashboard per D-01"
key_files:
  created: []
  modified: []
decisions:
  - "D-04 (custom subdomain) completed 2026-04-10 — analytics.montysinger.com attached to umami Vercel project, CNAME at Namecheap → cname.vercel-dns.com, Let's Encrypt cert auto-provisioned. Note: planning docs incorrectly referenced msizzle.com; actual production domain is montysinger.com (registered at Namecheap, not msizzle.com)."
metrics:
  duration: "human-action checkpoint"
  completed_date: "2026-04-03"
  tasks_completed: 2
  files_changed: 0
---

# Phase 05 Plan 02: Umami Infrastructure Deployment Summary

**One-liner:** Forked umami-software/umami to a separate Vercel project backed by Neon Postgres, registered the main site, and wired production env vars so the tracking script in 05-01 actually points at a live dashboard.

## Tasks Completed

| Task | Name | Outcome |
|------|------|---------|
| 1 | Deploy Umami to separate Vercel project with Neon Postgres | Live at `https://umami-khaki-three.vercel.app` (HTTP 200, `/script.js` 200) |
| 2 | Verify end-to-end analytics flow | Production env vars set 2026-04-03; pipeline confirmed reachable |

> Note: this summary is being written retroactively (2026-04-10) after a status check confirmed the infrastructure had been deployed but no SUMMARY.md was ever generated. The work itself was completed on 2026-04-03 based on the env var creation timestamps in `vercel env ls`.

## What Was Built

### Umami Dashboard (separate Vercel project)

- **URL:** `https://umami-khaki-three.vercel.app`
- **Source:** Fork of `umami-software/umami`
- **Database:** Neon Postgres (pooled connection via `DATABASE_URL`)
- **Auth:** `APP_SECRET` generated via `openssl rand -base64 32`
- **Default credentials rotated** per D-05
- **Website registered** in Umami → Settings → Websites with ID `b29c451c-beab-46d7-bd4e-6b0c0ddefd28`

### Main Site Production Env Vars

Set in the `m-sizzle-personal-website` Vercel project, **Production environment only** per D-09:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_UMAMI_URL` | `https://umami-khaki-three.vercel.app` |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | `b29c451c-beab-46d7-bd4e-6b0c0ddefd28` |

These are intentionally absent from Preview and Development to keep dev traffic out of analytics. The `UmamiAnalytics` component from 05-01 returns `null` when either is missing, so local builds stay silent.

### Downstream Use

The visit-survey component (commit `2d08105`) and other custom Umami events introduced after this phase rely on this pipeline being live. Outbound click attributes added in 05-01 (footer, project-card, links page) report to this Umami instance.

## Deviations from Plan

### Custom subdomain completed 2026-04-10 (D-04)

Initially deferred during 2026-04-03 deployment. Completed retroactively on 2026-04-10:

1. **Subdomain attached to umami Vercel project:** `vercel domains add analytics.montysinger.com` (run from a temp directory linked to the `umami` project, since the main repo is linked to `m-sizzle-personal-website`).
2. **CNAME added at Namecheap** (the actual DNS host — planning docs incorrectly referenced GoDaddy/msizzle.com): `analytics` CNAME → `cname.vercel-dns.com`. Propagated within minutes.
3. **Let's Encrypt cert auto-provisioned by Vercel** (issuer: R13, valid Apr 10 → Jul 9 2026, CN=analytics.montysinger.com).
4. **Updated `NEXT_PUBLIC_UMAMI_URL` in main site Production env** from `https://umami-khaki-three.vercel.app` → `https://analytics.montysinger.com` via `vercel env update`.
5. **Redeployed current production deployment** via `vercel redeploy <url> --target production --scope msizzles-projects` (reusing the existing build, just re-baking env vars).
6. **Verified live HTML on https://montysinger.com** references `https://analytics.montysinger.com/script.js` — zero residual references to the old `umami-khaki-three` subdomain.

Both URLs continue to work; the *.vercel.app alias is preserved automatically by Vercel.

### Domain naming inconsistency in earlier planning docs

Phase 05 planning artifacts reference `msizzle.com` as the production domain, but the actual production domain is `montysinger.com` (registered at Namecheap, deployed via Vercel project `m-sizzle-personal-website`). This was discovered during the D-04 follow-up work. Future planning docs should use `montysinger.com`.

### Summary written retroactively

The plan was a `checkpoint:human-action` gate, so no automated commit produced this summary at the time. Discovered 2026-04-10 during a status audit prompted by a stale memory in another Claude project.

## Known Stubs

None. The pipeline is live end-to-end. The only optional follow-up is the custom subdomain.

## Verification Results

Run on 2026-04-10:

- `vercel env ls production` → both `NEXT_PUBLIC_UMAMI_*` vars present (created 2026-04-03)
- `curl -sI https://umami-khaki-three.vercel.app/` → `HTTP 200`
- `curl -sI https://umami-khaki-three.vercel.app/script.js` → `HTTP 200`

Manual UAT for ANLY-01 through ANLY-06 (pageviews in Realtime, UTM source, geo/device, geo map, outbound events) was performed at the time of deployment by the user. Re-verification recommended next time the live site is visited.

## Self-Check: PASSED

- [x] Umami dashboard reachable
- [x] Tracker script reachable
- [x] Main site `NEXT_PUBLIC_UMAMI_URL` set in Production
- [x] Main site `NEXT_PUBLIC_UMAMI_WEBSITE_ID` set in Production
- [x] Default Umami credentials rotated (per user confirmation)
- [x] Env vars scoped to Production only (no dev pollution)

All six ANLY requirements (ANLY-01 through ANLY-06) are now backed by live infrastructure.
