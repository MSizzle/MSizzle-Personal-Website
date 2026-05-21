# Phase 5: Analytics - Research

**Researched:** 2026-04-03
**Domain:** Umami self-hosted analytics — deployment, tracking script integration, custom event attributes
**Confidence:** HIGH

## Summary

Phase 5 installs self-hosted Umami v3.0.3 as a **separate Vercel project** backed by a Neon Postgres database, then wires the tracker script into the existing Next.js main site. The main site requires zero new npm packages — Umami is a standalone Next.js app deployed independently, and tracking is a single `<Script>` tag plus declarative HTML data attributes.

All six ANLY requirements (pageviews, real-time, traffic sources, page popularity, geo/device, geo map) are satisfied out-of-the-box by Umami's built-in dashboard. The only custom code on the main site is: (1) a production-only `<UmamiAnalytics>` component added to `layout.tsx`, and (2) `data-umami-event` attributes on outbound links in `footer.tsx`, `project-card.tsx`, and `src/app/links/page.tsx`.

**Primary recommendation:** Fork umami-software/umami → deploy to its own Vercel project with Neon Postgres → add tracking script component to main site layout → apply data attributes to outbound links → verify in clean browser.

## Project Constraints (from CLAUDE.md)

- CMS: Notion (no analytics impact)
- Hosting: Vercel free tier — Umami must be a **separate** Vercel project to avoid consuming the main site's free-tier limits
- Analytics: Self-hosted or free solution — no recurring cost; Umami + Neon satisfies this
- Design: No UI changes required for this phase
- Web UI Branding: Umami dashboard is a separate app — the "Prometheus" watermark rule applies only to web UIs built in this project; no change needed

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Umami deployed as a separate Vercel project (not embedded in the main site)
- D-02: Fork umami-software/umami to Monty's GitHub, deploy from the fork
- D-03: Database: Neon Postgres free tier (never hard-pauses, 0.5GB, wakes in <1s)
- D-04: Dashboard accessible at custom subdomain (e.g., analytics.msizzle.com); requires one CNAME DNS record pointing to Vercel
- D-05: Default admin credentials must be changed immediately after first deployment
- D-06: Outbound click tracking only for custom events — track clicks on external project links, social links, and CTAs; no scroll depth, theme toggle, or tag filter tracking
- D-07: UTM handling via Umami built-in — Umami automatically captures UTM params; no custom code needed
- D-08: Standard pageview tracking, real-time visitors, traffic source, page popularity, and geo/device come from Umami built-in — no custom instrumentation needed
- D-09: Tracking script loads production only — environment variable check conditionally renders the script; no tracking in development or preview deploys
- D-10: Script added via Next.js `<Script>` component in `layout.tsx`, after the existing provider hierarchy
- D-11: Outbound click tracking via Umami data attributes (`data-umami-event`) on link elements; declarative, no custom JS handlers
- D-12: Geo map visualization lives in the Umami dashboard only — uses Umami v3's built-in world map; no custom map component on the main site

### Claude's Discretion
- Exact Umami version to deploy (latest v3.x stable)
- Script tag configuration details (async, defer, data-website-id)
- Which specific link elements get data-umami-event attributes (all outbound, or curated list)
- Neon Postgres region selection
- Umami dashboard customization (which widgets/reports to pin)

### Deferred Ideas (OUT OF SCOPE)
- ANLY-V2-01: Public read-only analytics page
- ANLY-V2-02: Real-time reader count widget on blog posts
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ANLY-01 | Self-hosted Umami analytics with private dashboard | Umami v3.0.3 deployed as separate Vercel project with Neon Postgres; login protected by credentials |
| ANLY-02 | Real-time visitor tracking | Umami v3 built-in real-time dashboard — enabled automatically once tracking script fires |
| ANLY-03 | Traffic source tracking (referrers, UTM, direct) | Umami built-in: auto-captures Referer header and UTM params (source/medium/campaign) from URL |
| ANLY-04 | Page popularity tracking (views per page/post) | Umami built-in: every pageview is logged with the full URL path; "Pages" report aggregates per-path |
| ANLY-05 | Geographic and device/browser breakdown | Umami built-in: resolves IP → country/region via MaxMind GeoLite2; UA parsing for device/browser |
| ANLY-06 | Geo map visualization of visitor locations | Umami v3 built-in world map widget in the dashboard — no extra code required |
</phase_requirements>

## Standard Stack

### Core (Umami Project — separate repo)
| Library/Service | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Umami | v3.0.3 (Dec 2025) | Self-hosted analytics platform | Official stable release; Next.js-based, Vercel-native |
| Neon Postgres | Free tier (0.5GB) | Database for Umami event storage | Never hard-pauses (unlike Supabase), serverless, wakes <1s |
| Vercel (Umami project) | Free tier | Hosting for separate Umami app | Natural fit since Umami is Next.js; separate project = separate free-tier limits |

### Main Site (no new npm packages needed)
| Component | Details | Purpose |
|-----------|---------|---------|
| `next/script` `<Script>` | Built into Next.js 16.2.1 | Loads Umami tracker with `afterInteractive` strategy |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | env var (UUID) | Identifies the website in Umami; used as `data-website-id` on script |
| `NEXT_PUBLIC_UMAMI_URL` | env var (URL) | Points to the Umami instance; used as `src` on script |
| HTML data attributes | `data-umami-event="..."` | Declarative outbound click tracking — no JS handlers needed |

### No New npm Dependencies Required
Umami tracking on the main site requires **zero new packages**. The `next/script` component is built into Next.js.

**Installation for Umami project (separate repo, after fork):**
```bash
# No manual install needed — Vercel builds from package.json in the fork
# For local development of the Umami project:
npm install
```

**Version verification (Umami):**
```bash
# Check latest release tag on GitHub
# Verified: v3.0.3 released 2026-12-12 (most recent stable as of 2026-04-03)
```

## Architecture Patterns

### Recommended Project Structure (Main Site Changes Only)

```
src/
├── components/
│   └── analytics/
│       └── umami-analytics.tsx   # NEW: production-only Script wrapper
├── app/
│   └── layout.tsx                # MODIFY: add <UmamiAnalytics /> after providers
├── components/
│   └── footer.tsx                # MODIFY: add data-umami-event to social links
│   └── projects/
│       └── project-card.tsx      # MODIFY: add data-umami-event to externalUrl link
└── app/
    └── links/
        └── page.tsx              # MODIFY: add data-umami-event to link items
```

### Pattern 1: Production-Only Umami Script Component

**What:** A React component that conditionally renders the Umami `<Script>` tag only when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is defined. The variable is only set in the production Vercel environment, so it's automatically absent in dev/preview.

**When to use:** Root layout — renders once for the entire app.

**Example:**
```typescript
// src/components/analytics/umami-analytics.tsx
// Source: https://fabian-rosenthal.com/blog/integrate-umami-analytics-into-nextjs-app-router
import Script from 'next/script'

export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL

  if (!websiteId || !umamiUrl) {
    return null
  }

  return (
    <Script
      async
      src={`${umamiUrl}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  )
}
```

**Layout integration — after existing provider hierarchy:**
```typescript
// src/app/layout.tsx (after existing providers)
import { UmamiAnalytics } from '@/components/analytics/umami-analytics'

// Inside <body>, after </ThemeProvider>:
<UmamiAnalytics />
```

### Pattern 2: Declarative Outbound Click Tracking via Data Attributes

**What:** Umami's tracker script auto-listens for clicks on any element with `data-umami-event`. No JavaScript event handlers needed.

**When to use:** Any `<a>` element pointing to an external URL (target="_blank").

**Example — footer social links:**
```typescript
// src/components/footer.tsx
// Source: https://docs.umami.is/docs/track-events
<a
  href={link.href}
  target="_blank"
  rel="noopener noreferrer"
  data-umami-event={`social-click-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
  aria-label={link.label}
  className="..."
>
  {link.icon}
</a>
```

**Example — project external link:**
```typescript
// src/components/projects/project-card.tsx
{project.externalUrl && (
  <a
    href={project.externalUrl}
    target="_blank"
    rel="noopener noreferrer"
    data-umami-event="project-external-link"
    data-umami-event-title={project.title}
    className="..."
  >
    Check out more information <ExternalLink size={16} />
  </a>
)}
```

**Note:** Event names max 50 characters. `data-umami-event-*` properties are always stored as strings.

### Pattern 3: Umami Deployment — Separate Vercel Project

**What:** Fork → Import to new Vercel project → Connect Neon Postgres → Set env vars → Deploy → Change default credentials.

**Required env vars for the Umami Vercel project:**
```
DATABASE_URL=postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/umami?sslmode=require
APP_SECRET=<random-string-min-32-chars>
```

**Required env vars for the main site (production only):**
```
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<uuid-from-umami-dashboard>
NEXT_PUBLIC_UMAMI_URL=https://analytics.msizzle.com
```

**Neon connection string format:**
```
postgresql://<user>:<password>@ep-<compute-id>-pooler.<region>.aws.neon.tech/<dbname>?sslmode=require
```
Use the pooled connection string (contains `-pooler` in hostname) for Vercel serverless deployments.

### Anti-Patterns to Avoid

- **Tracking in dev/preview:** Never define `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in `.env.local` or Vercel preview environment — pollutes analytics with dev traffic.
- **Same Vercel project as main site:** Umami must be its own Vercel project to avoid consuming main site free-tier limits.
- **`defer` without `async`:** Umami docs recommend `async` (or `strategy="afterInteractive"` in Next.js which handles the defer behavior). Using `defer` alone can delay script load.
- **Using Supabase:** Free tier auto-pauses after 7 days inactivity — analytics DB goes offline. Use Neon instead.
- **Leaving default credentials:** Default admin/umami must be changed immediately after first login.
- **Long event names:** Umami truncates at 50 characters. Keep `data-umami-event` values short.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pageview counting | Custom API route + DB | Umami built-in | Edge cases: bots, deduplication, referrer parsing, session attribution |
| Real-time visitor count | WebSocket + Redis | Umami built-in | Complex infrastructure; Umami solves it in its dashboard |
| UTM parameter capture | URL parsing middleware | Umami built-in | Umami auto-captures utm_source/medium/campaign on every event |
| Geo resolution | IP → country lookup service | Umami built-in (MaxMind GeoLite2) | Requires maintaining IP geolocation DB; Umami ships with it |
| Device/browser parsing | UA string parser | Umami built-in | UA-Parser integrated into Umami's event pipeline |
| Geo map visualization | Custom map component (Leaflet/Mapbox) | Umami v3 dashboard world map | Out of scope per D-12; Umami's built-in is sufficient |

**Key insight:** Every ANLY requirement is served by Umami's built-in dashboard with zero custom code beyond the tracking script and event attributes.

## Common Pitfalls

### Pitfall 1: Ad Blocker Interference
**What goes wrong:** Popular ad blockers (uBlock Origin, Brave's built-in) block requests to `/api/send` endpoint even on self-hosted domains — especially if the hostname pattern matches block lists.
**Why it happens:** Some blocklists include generic analytics patterns, not just known tracker domains.
**How to avoid:** Test tracking in a clean browser profile with zero extensions. Also, Umami allows customizing the collect endpoint via `COLLECT_API_ENDPOINT` env var, or proxying via `vercel.json` rewrites to disguise the endpoint.
**Warning signs:** Console shows blocked network request to `<umami-domain>/api/send`; Umami dashboard shows no events despite page visits.

### Pitfall 2: Missing `NEXT_PUBLIC_` Prefix
**What goes wrong:** Environment variable is not exposed to the browser; `process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID` is undefined even in production; script never renders.
**Why it happens:** Next.js only exposes env vars with `NEXT_PUBLIC_` prefix to the client bundle.
**How to avoid:** Always prefix both `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_URL`. Set them in Vercel project settings under the main site project (production environment only).
**Warning signs:** Component renders null; no script tag in page source on production.

### Pitfall 3: Wrong `src` URL for the Tracking Script
**What goes wrong:** Script 404s or points to Umami Cloud instead of the self-hosted instance.
**Why it happens:** Umami Cloud uses `https://cloud.umami.is/script.js`; self-hosted instances serve it at `<your-domain>/script.js`. These are different.
**How to avoid:** Set `NEXT_PUBLIC_UMAMI_URL` to the self-hosted domain (e.g., `https://analytics.msizzle.com`) and construct `src` as `${umamiUrl}/script.js`.
**Warning signs:** Network tab shows 404 for `/script.js` or requests going to `cloud.umami.is`.

### Pitfall 4: Custom Domain DNS Propagation Delay
**What goes wrong:** `analytics.msizzle.com` resolves to old record or doesn't resolve at all after adding CNAME.
**Why it happens:** DNS TTL can take 5 minutes to 48 hours to propagate globally.
**How to avoid:** Verify with `https://analytics.msizzle.com` after propagation — don't declare success until the custom domain is confirmed. Use `nslookup analytics.msizzle.com` or `dig analytics.msizzle.com` to check.
**Warning signs:** Browser shows connection error; `dig` still returns old value.

### Pitfall 5: Umami Database Schema Not Initialized
**What goes wrong:** First deploy succeeds but visiting Umami shows a database error because Prisma migrations haven't run.
**Why it happens:** Umami runs Prisma migrations at startup on first deploy. If `DATABASE_URL` is not set before the first deploy, migrations don't run.
**How to avoid:** Set `DATABASE_URL` env var in Vercel **before** the first deployment. If the first deploy failed, redeploy after setting the variable.
**Warning signs:** Umami app loads but shows a 500 error or blank dashboard; Vercel function logs show Prisma connection errors.

## Code Examples

### Outbound Links Inventory (what needs data attributes)

From the code audit:

**`src/components/footer.tsx`** — `SOCIAL_LINKS` array, 4 external links (Twitter, LinkedIn, GitHub, mailto). All rendered as `<a>` with `target="_blank"`. Add `data-umami-event` to each.

**`src/components/projects/project-card.tsx`** — `project.externalUrl` anchor at line 120. Single `<a>` element. Add `data-umami-event="project-external-link"` and `data-umami-event-title={project.title}`.

**`src/app/links/page.tsx`** — `LINKS` array, 5 items, rendered at line 85. External links detected by `link.href.startsWith('http')`. Add `data-umami-event` to the external ones.

### Minimal Script Component
```typescript
// src/components/analytics/umami-analytics.tsx
import Script from 'next/script'

export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL
  if (!websiteId || !umamiUrl) return null
  return (
    <Script
      async
      src={`${umamiUrl}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  )
}
```

### Layout.tsx Integration Point
```typescript
// After existing </ThemeProvider>, inside <body>:
<UmamiAnalytics />
```
The existing provider hierarchy is `ThemeProvider > LenisProvider > MotionProvider`. The analytics script sits outside this tree (it's a script tag, not a React provider) so it goes just before `</body>`.

### Recommended Event Name Conventions
```
social-click-twitter
social-click-linkedin
social-click-github
social-click-email
project-external-link         (+ data-umami-event-title)
links-click-twitter
links-click-linkedin
links-click-github
links-click-email
```
All under 50 characters. Consistent kebab-case pattern.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Analytics | Self-hosted Umami | Ongoing | No cookie consent, GDPR-friendly, no sampling on free tier |
| Umami v2 (MySQL support) | Umami v3 (Postgres-only) | v3.0.0 (2024) | MySQL is no longer supported in v3; Postgres required |
| `@vercel/analytics` | Umami self-hosted | — | Umami gives full data ownership and richer event model |
| Supabase for Umami DB | Neon for Umami DB | Neon GA 2024 | Supabase free tier pauses after 7 days; Neon does not |

**Deprecated/outdated:**
- Supabase free tier for Umami: Hard-pauses after 7 days inactivity — analytics DB goes offline. Neon is the current recommendation.
- react-umami (npm): Third-party wrapper package, not needed. Use data attributes or `window.umami` directly.

## Open Questions

1. **Is `analytics.msizzle.com` domain already registered?**
   - What we know: DSGN-06 (custom domain on Vercel) is not yet configured per STATE.md.
   - What's unclear: Whether msizzle.com DNS is managed and accessible for adding CNAME records.
   - Recommendation: Plan should flag this as a manual prerequisite step — executor must confirm DNS access before starting.

2. **Umami APP_SECRET generation method**
   - What we know: Must be a unique random string.
   - What's unclear: No minimum length specified in docs, but security best practice is 32+ characters.
   - Recommendation: Use `openssl rand -base64 32` to generate; document this in the plan.

3. **COLLECT_API_ENDPOINT customization for ad blocker resistance**
   - What we know: Optional env var that renames the `/api/send` endpoint.
   - What's unclear: Whether this is worth setting proactively vs. only if blocking is observed.
   - Recommendation: Skip for initial setup; add to pitfall verification checklist.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Main site build | ✓ | (via Next.js) | — |
| Vercel CLI | Deploy Umami project | ✓ (Vercel cloud, not local CLI required) | — | Use Vercel web UI |
| GitHub account | Fork umami repo | ✓ (assumed, existing main site on GitHub) | — | — |
| Neon account | Umami database | Requires signup at neon.tech (free) | — | No fallback — required |
| DNS access for msizzle.com | Custom subdomain D-04 | Unknown — not verified | — | Use default Vercel domain (*.vercel.app) as fallback until DNS configured |
| Browser without ad blocker | Verification testing | ✓ (can use incognito or separate profile) | — | — |

**Missing dependencies with no fallback:**
- Neon account: Must be created at neon.tech before starting Umami deployment. Free, no credit card required.

**Missing dependencies with fallback:**
- DNS access for msizzle.com: If DNS can't be configured yet, use the `<project>.vercel.app` domain for Umami and skip the custom subdomain step — analytics will still work.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + React Testing Library |
| Config file | `/Users/Montster/MSizzle Personal Website/vitest.config.ts` |
| Quick run command | `npx vitest run src/__tests__` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANLY-01 | UmamiAnalytics component renders Script when env vars present | unit | `npx vitest run src/__tests__/components/umami-analytics.test.tsx` | ❌ Wave 0 |
| ANLY-01 | UmamiAnalytics renders null when env vars absent | unit | `npx vitest run src/__tests__/components/umami-analytics.test.tsx` | ❌ Wave 0 |
| ANLY-02 | Real-time tracking confirmed (Umami dashboard) | manual-only | — | manual verification |
| ANLY-03 | Traffic source breakdown in dashboard | manual-only | — | manual verification |
| ANLY-04 | Page popularity visible in dashboard | manual-only | — | manual verification |
| ANLY-05 | Geo/device data in dashboard | manual-only | — | manual verification |
| ANLY-06 | Geo map renders in Umami dashboard | manual-only | — | manual verification |
| D-11 | footer.tsx outbound links have data-umami-event attributes | unit | `npx vitest run src/__tests__/components/footer.test.tsx` | ❌ Wave 0 |
| D-11 | links/page.tsx outbound links have data-umami-event attributes | unit | `npx vitest run src/__tests__/pages/links.test.tsx` | ✅ (stub only — needs implementation) |
| D-11 | project-card.tsx external link has data-umami-event attribute | unit | `npx vitest run src/__tests__/components/project-card.test.tsx` | ✅ (exists — add assertion) |
| D-09 | Script not rendered when NEXT_PUBLIC_UMAMI_WEBSITE_ID is unset | unit | `npx vitest run src/__tests__/components/umami-analytics.test.tsx` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/components/umami-analytics.test.tsx`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/components/umami-analytics.test.tsx` — covers ANLY-01 component render + production guard (D-09)
- [ ] `src/__tests__/components/footer.test.tsx` — covers D-11 for social link data attributes

*(Existing stubs: `links.test.tsx` needs assertions added; `project-card.test.tsx` needs data-attribute assertion added to existing test)*

## Sources

### Primary (HIGH confidence)
- [Umami v3.0.3 GitHub release](https://github.com/umami-software/umami/releases/tag/v3.0.3) — version confirmed, released 2025-12-12
- [docs.umami.is/docs/track-events](https://docs.umami.is/docs/track-events) — data-umami-event attribute syntax, data-umami-event-* properties, 50 char limit
- [docs.umami.is/docs/tracker-configuration](https://docs.umami.is/docs/tracker-configuration) — script attributes (data-website-id, data-domains, async/defer)
- [docs.umami.is/docs/environment-variables](https://docs.umami.is/docs/environment-variables) — DATABASE_URL (required), APP_SECRET, COLLECT_API_ENDPOINT
- [docs.umami.is/docs/guides/running-on-vercel](https://docs.umami.is/docs/guides/running-on-vercel) — Vercel deployment steps, DATABASE_URL env var setup

### Secondary (MEDIUM confidence)
- [fabian-rosenthal.com — Umami + Next.js App Router](https://fabian-rosenthal.com/blog/integrate-umami-analytics-into-nextjs-app-router) — UmamiAnalytics component pattern, production-only env var approach; verified against Next.js Script docs
- [theserverless.dev — Umami + Vercel + Neon guide](https://theserverless.dev/guides/umami-guide) — Neon Postgres connection string format and Vercel integration steps
- [neon.com/docs/connect/connect-from-any-app](https://neon.com/docs/connect/connect-from-any-app) — Neon DATABASE_URL format (pooled vs. unpooled); verified against Neon official docs

### Tertiary (LOW confidence)
- WebSearch: Ad blocker interference with Umami self-hosted — multiple community sources report this; not verifiable without live environment test. Flag for manual verification.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Umami v3.0.3 confirmed via GitHub; Neon free tier confirmed via official docs; no new npm packages needed
- Architecture: HIGH — Script component pattern verified against Next.js docs and community guide; data attribute syntax verified from official Umami docs
- Pitfalls: MEDIUM-HIGH — Ad blocker pitfall is community-sourced (LOW for specific behavior), all others verified against official docs

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable domain — Umami v3.x, Neon, Vercel are all stable)
