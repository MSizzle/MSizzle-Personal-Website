# Phase 5: Analytics - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deploy self-hosted Umami analytics as a separate Vercel project backed by Neon Postgres, wire the tracking script into the main Next.js site, and confirm real visitor data is flowing to a private dashboard. Covers pageviews, real-time tracking, traffic sources (UTM built-in), page popularity, geo/device breakdown, and geo map visualization — all within the Umami dashboard.

**Requirements covered:** ANLY-01, ANLY-02, ANLY-03, ANLY-04, ANLY-05, ANLY-06

</domain>

<decisions>
## Implementation Decisions

### Umami Deployment
- **D-01:** Umami deployed as a **separate Vercel project** (not embedded in the main site) to avoid consuming main site free-tier limits.
- **D-02:** **Fork umami-software/umami** to Monty's GitHub, deploy from the fork. Full control over updates and customization.
- **D-03:** Database: **Neon Postgres** free tier. Never hard-pauses (unlike Supabase which auto-pauses after 7 days inactivity). 0.5GB storage, scales to zero, wakes in <1s.
- **D-04:** Dashboard accessible at **custom subdomain** (e.g., analytics.msizzle.com). Requires one CNAME DNS record pointing to Vercel.
- **D-05:** Default admin credentials must be changed immediately after first deployment — do not leave admin/umami as credentials.

### Tracking Scope
- **D-06:** **Outbound click tracking only** for custom events — track clicks on external project links, social links, and CTAs. No scroll depth, no theme toggle, no tag filter tracking.
- **D-07:** **UTM handling via Umami built-in** — Umami automatically captures UTM params (source, medium, campaign) from URLs. No custom code needed.
- **D-08:** Standard pageview tracking, real-time visitors, traffic source breakdown, page popularity, and geo/device data all come from Umami's built-in capabilities — no custom instrumentation needed.

### Script Integration
- **D-09:** Tracking script loads **production only** — use environment variable check to conditionally render. No tracking in development or preview deploys.
- **D-10:** Script added via Next.js `<Script>` component in `layout.tsx`, after the existing provider hierarchy.
- **D-11:** Outbound click tracking via **Umami data attributes** (`data-umami-event`) on link elements. Declarative, no custom JS handlers needed.

### Geo Map (ANLY-06)
- **D-12:** Geo map visualization lives in the **Umami dashboard only** — uses Umami v3's built-in world map. No custom map component on the main site.

### Claude's Discretion
- Exact Umami version to deploy (latest v3.x stable)
- Script tag configuration details (async, defer, data-website-id)
- Which specific link elements get data-umami-event attributes (all outbound, or curated list)
- Neon Postgres region selection
- Umami dashboard customization (which widgets/reports to pin)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Artifacts
- `.planning/REQUIREMENTS.md` — ANLY-01 through ANLY-06 definitions
- `.planning/ROADMAP.md` §Phase 5 — Success criteria (real-time tracking, traffic sources, geo data, custom events) and risk notes (separate Vercel project, default credentials, ad blockers, Neon vs Supabase)
- `.planning/PROJECT.md` — Core value, constraints (zero hosting cost, self-hosted analytics)

### Tech Stack Reference
- `CLAUDE.md` §Technology Stack — Umami v3.x, Neon serverless Postgres, recommended stack details
- `CLAUDE.md` §Architecture Notes — Umami deployment pattern

### Prior Phase Context
- `.planning/phases/03-core-pages/03-CONTEXT.md` — Page routes and link components that need data-umami-event attributes
- `.planning/phases/04-animation-polish/04-CONTEXT.md` — Provider hierarchy context (layout.tsx integration point)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/layout.tsx` — Root layout with provider hierarchy (ThemeProvider > LenisProvider > MotionProvider). Umami `<Script>` component goes here, conditionally rendered.
- `src/components/footer.tsx` — Contains social links that need `data-umami-event` attributes for outbound click tracking.
- `src/components/projects/project-card.tsx` — Contains external project links that need `data-umami-event` attributes.
- `src/app/links/page.tsx` — Links page with all social/external links — needs `data-umami-event` attributes.

### Established Patterns
- **Provider/script hierarchy:** layout.tsx is the central integration point. Tracking script slots in after existing providers.
- **Environment handling:** Next.js environment variables (NEXT_PUBLIC_*) already used. Same pattern for Umami website ID and URL.

### Integration Points
- `src/app/layout.tsx` — Add Umami `<Script>` component with production-only conditional
- Outbound link components across footer, project cards, links page, blog post CTAs — add data attributes
- `package.json` — No new dependencies needed (Umami is a separate project; tracking is via script tag)

</code_context>

<specifics>
## Specific Ideas

- Analytics is "the second core reason this rebuild exists" (per ROADMAP.md) — getting real visitor data that Super couldn't provide
- Custom subdomain (analytics.msizzle.com) keeps it professional and memorable
- Fork approach gives full control — can customize Umami dashboard or update on own schedule
- Minimal custom event tracking (outbound clicks only) keeps analytics focused on what matters: who visits, from where, and what they click

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

Note: ANLY-V2-01 (public read-only analytics page) and ANLY-V2-02 (real-time reader count widget) are already tracked as v2 requirements in REQUIREMENTS.md.

</deferred>

---

*Phase: 05-analytics*
*Context gathered: 2026-04-02*
