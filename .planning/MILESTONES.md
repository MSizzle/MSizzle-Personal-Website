# Milestones

## v1.0 Build & Launch

**Shipped:** 2026-04-16 (GO verdict per `phases/06-pre-launch-qa/06-GO-NO-GO.md`)
**Archived:** 2026-05-20
**Site:** https://montysinger.com
**Timeline:** 16 days (2026-03-31 → 2026-04-16)
**Scope:** 7 phases · 28 plans · 196 commits

### Key Accomplishments

1. **Foundation (Phase 1).** Next.js 16 App Router + React 19 + Tailwind v4 + TypeScript scaffold on Vercel with custom domain (montysinger.com), dark mode via `next-themes` with no FOUC, Lenis smooth scroll, and Motion page-transition framework wired before any feature code.

2. **Notion CMS layer (Phase 2).** Rate-limited `@notionhq/client` v5 API wrapper, 17-block-type renderer, image proxy route solving Notion signed-URL expiry, ISR blog pages on a 30-min revalidate. Avoided `react-notion-x` per documented App Router breakage.

3. **Core pages (Phase 3 — 6 plans).** Home, About, Works (projects index + per-project detail), Blog (tag filter + reading time), Links — all live, mobile-responsive, with dynamic OG images via `next/og` and a working sitemap/robots/RSS infrastructure.

4. **Animation system (Phase 4 — 3 plans).** Motion `AnimatePresence` hover-reveal overlays on ProjectCard, ScrollReveal stagger on all non-home pages, GSAP `ScrollTrigger` driving Lenis ticker to prevent desync, parallax layers, page-transition wrapper in `template.tsx`. Reduced motion respected at provider level.

5. **Self-hosted analytics (Phase 5 — 2 plans).** Umami fork deployed to its own Vercel project backed by Neon Postgres, surfaced at https://analytics.montysinger.com via Namecheap CNAME. Declarative `data-umami-event` tracking on footer, project cards, and outbound links — zero recurring cost, full real-time visitor data.

6. **SEO overhaul (Phase 7 — 11 plans).** Centralized `SITE_URL` + canonical helper, schema.org builders (Person / FAQPage / BreadcrumbList) with vitest coverage, new `/prometheus`, `/newsletter`, `/uses` routes, per-blog-post and per-project metadata, RSS feed at `/blog/feed.xml`, styled 404, full `msizzle.com → montysinger.com` swap with deny-list grep gate (em-dashes, NYC, investor copy all swept to zero hits).

7. **Pre-launch QA (Phase 6 — 6 plans).** `vercel build --prod` clean exit + D-14 client-bundle secret scan across both `.next/` and `.vercel/output/` trees (zero leaks), Lighthouse desktop 100/96/96/100, mobile noisy 73-99 (PSI 77 accepted as non-blocking for personal-site traffic), 28-requirement UAT (0 failures), Notion image long-tail re-fetch passed, dark-mode FOUC verified incognito, SEO re-audit against live HTML clean, **GO verdict signed off 2026-04-16**.

### Stats

- **Files:** Next.js App Router project (`src/app`, `src/components`, `src/lib`)
- **Tests:** vitest suite, all green at close
- **Lighthouse desktop:** 100/96/96/100 across home, about, prometheus, blog index, blog post
- **Lighthouse mobile (PSI):** home 77 — accepted non-blocking
- **Build:** `vercel build --prod` exit 0, zero TS / ESLint / 429 errors
- **Security:** Zero secret leaks in client chunks (D-14 gate)
- **SEO compliance:** Zero deny-list hits site-wide

### Known Deferred Items at Close

7 items acknowledged as bookkeeping drift (not real outstanding work) — see STATE.md `## Deferred Items` section. All are either superseded by the v2.0 redesign (Phase 04 animation UAT — animations being deleted) or already-shipped work missing only paperwork closure.

### Key Decisions Validated

- Notion as CMS — workflow preserved, image expiry solved via proxy
- Self-hosted Umami on Vercel free tier — real analytics at zero cost
- Vercel free tier hosting — well under all quotas
- Motion + GSAP + Lenis stack — sophisticated animation without performance cost
- Fresh-start design (not Super recreation) — gave room for personal brand

### What v1.0 Set Up for v2.0

The infrastructure investments (Notion data layer, image pipeline, SEO infrastructure, analytics, Vercel deployment) are all reusable as-is in v2.0. The redesign work is concentrated in: the homepage, design tokens, motion budget, and 3 new archive pages (`/writing`, `/events`, `/photos`).

---
