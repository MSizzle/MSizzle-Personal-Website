# Phase 17: Infrastructure Preservation & SEO Extension - Context

**Gathered:** 2026-06-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify that all preserved infrastructure — the Notion CMS pipeline, image-proxy
routes, SEO scaffolding (`sitemap`, `robots`, blog feed, `src/lib/seo`, JSON-LD,
per-page metadata), and Umami analytics — is intact on the `v3` branch, and
extend SEO coverage to the two new pages `/uses` and `/watching`.

Satisfies **IN-03** (SEO infra preserved + extended to the new pages) and
**IN-04** (Umami continues to load/track on every page).

**This phase does NOT:** build new JSON-LD or OG-image infrastructure, run the
full perf/PSI budget, or perform the production alias swap — those are Phase 18.

</domain>

<decisions>
## Implementation Decisions

### Structured Data (JSON-LD)
- **D-01:** Keep `/uses` and `/watching` on **breadcrumb-only** JSON-LD. Both
  pages already render `<Breadcrumbs>` (`src/components/seo/breadcrumbs.tsx`),
  which emits a `BreadcrumbList` schema via `buildBreadcrumbListSchema`. Do NOT
  add VideoObject/ItemList builders this phase. Rationale: `/watching`'s video
  IDs in `src/lib/watching.ts` are still placeholders, so VideoObject schema
  would be premature and risk malformed/empty rich data.

### OpenGraph / Social Images
- **D-02:** `/uses` and `/watching` use the **site-wide default OG** (inherit
  whatever the root `layout.tsx` metadata provides). No per-page dynamic
  `@vercel/og` images. The planner should confirm the new pages' OG behavior is
  consistent with the other v3 static pages (`/about`, `/links`, `/events`);
  if those carry no per-page OG image either, parity = leave as text-only OG,
  which is the accepted outcome.

### Verification Rigor
- **D-03:** Prove IN-03/IN-04 with **automated regression assertions**, not a
  one-time smoke check. Follow the Phase 16 automated-gate pattern
  (`16-09-PLAN.md` — vitest + build). Assertions should cover at minimum:
  - `sitemap.ts` output includes every static route **including `/uses` and
    `/watching`** (the concrete gap today), plus dynamic blog/project routes.
  - `robots.ts` resolves and still disallows `/specimen` and `/api/`.
  - The blog feed route (`src/app/blog/feed.xml/route.ts`) returns valid RSS.
  - Every page route exports `metadata` (or `generateMetadata`).
  - `UmamiAnalytics` is rendered in `layout.tsx` and emits the script tag when
    `NEXT_PUBLIC_UMAMI_WEBSITE_ID` / `NEXT_PUBLIC_UMAMI_URL` are set (env-gated).
  - Keep the gate scoped to *preservation + the two new pages*; do NOT duplicate
    Phase 18's PSI/perf budget here.

### Sitemap Entries
- **D-04:** Add `/uses` and `/watching` to `sitemap.ts` `staticRoutes` at
  `priority: 0.6`, `changeFrequency: 'monthly'` — matching the existing
  `/photos` entry (stable secondary pages).

### Claude's Discretion
- Exact test file location/naming and whether assertions live in a new vitest
  file vs. extending the Phase 16 gate — planner/executor decide, following the
  existing test layout.
- Whether the Umami "tracks on every page" check is a unit assertion on the
  layout component vs. a preview smoke note — automated assertion preferred, but
  an env-gated component render test is acceptable proof.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase definition & requirements
- `.planning/ROADMAP.md` §"Phase 17" — goal + 3 success criteria.
- `.planning/REQUIREMENTS.md` — **IN-03**, **IN-04** (the two requirements this
  phase closes).

### SEO infrastructure to preserve & extend
- `src/app/sitemap.ts` — static + dynamic routes; **missing `/uses` + `/watching`** (D-04).
- `src/app/robots.ts` — allow `/`, disallow `/specimen`, `/api/`.
- `src/app/blog/feed.xml/route.ts` + `src/lib/rss/blog-feed.ts` — RSS feed.
- `src/lib/seo/site.ts` — `SITE_URL`, `canonical()`.
- `src/lib/seo/schemas.ts` — `buildPersonSchema`, `buildFaqPageSchema`,
  `buildBreadcrumbListSchema` (no Video/ItemList builder — intentionally, per D-01).
- `src/components/seo/breadcrumbs.tsx` + `src/components/seo/json-ld.tsx` —
  how BreadcrumbList JSON-LD is emitted on the new pages.

### New pages already wired (verify, don't rebuild)
- `src/app/uses/page.tsx` — already has metadata (title/desc/canonical/OG) + Breadcrumbs.
- `src/app/watching/page.tsx` — same; video IDs in `src/lib/watching.ts` are placeholders.

### Analytics (IN-04)
- `src/app/layout.tsx` — renders `<UmamiAnalytics />`.
- `src/components/analytics/umami-analytics.tsx` — env-gated script loader
  (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_URL`).

### Reference pattern
- `.planning/phases/16-interior-pages-on-notion-data/16-09-PLAN.md` — the
  automated-gate (vitest + build + audit) pattern to mirror for D-03.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `<Breadcrumbs>` / `buildBreadcrumbListSchema`: already supplies the only
  JSON-LD the new pages need (D-01) — nothing to add.
- `JsonLd` component (`src/components/seo/json-ld.tsx`): generic `<script type="application/ld+json">` emitter, reused if any schema work is ever needed.
- Phase 16 automated gate: the vitest + build harness to extend for D-03.

### Established Patterns
- `sitemap.ts` lists static routes inline as an array of
  `{ url, lastModified, changeFrequency, priority }`; new entries follow the
  `/photos` shape (D-04).
- Per-page `export const metadata` is the universal convention (15+ routes
  already do it) — the regression test can assert it broadly.
- Umami is env-gated: the loader returns `null` when env vars are absent, so the
  preservation test must account for the env-gated path.

### Integration Points
- `sitemap.ts` — two new array entries (the only production-code change required
  to *extend* SEO; everything else is verification).
- New vitest assertions wire into the existing test/build gate, not new infra.

</code_context>

<specifics>
## Specific Ideas

- The phase is deliberately light: one real code change (sitemap entries) plus a
  durable automated gate. The bulk of value is *proving* nothing regressed on
  `v3` versus production, captured as re-runnable assertions rather than a
  throwaway manual pass.

</specifics>

<deferred>
## Deferred Ideas

- **VideoObject / ItemList structured data for `/watching`** — revisit once real
  YouTube video IDs replace the placeholders in `src/lib/watching.ts`. Could be
  a small future SEO enhancement; out of scope now (D-01).
- **Per-page dynamic `@vercel/og` images for `/uses` + `/watching`** — social-share
  polish; belongs in a polish/SEO-enhancement pass, not infra preservation (D-02).
- **Full PSI / mobile perf budget + alias swap** — Phase 18.

</deferred>

---

*Phase: 17-Infrastructure Preservation & SEO Extension*
*Context gathered: 2026-06-20*
