# Roadmap: MSizzle Personal Website

**Created:** 2026-03-31
**Phases:** 6
**Requirements covered:** 28/28

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation | Lock architectural patterns and deploy a live skeleton | DSGN-01, DSGN-06, HOME-04 | 4 |
| 2 | Notion CMS Integration | Content authored in Notion renders on the site without broken images | BLOG-01, BLOG-02, BLOG-05 | 4 |
| 3 | Core Pages | 3/6 | In Progress|  |
| 4 | Animation & Polish | 3/3 | Complete   | 2026-04-03 |
| 5 | Analytics | Real visitor data is flowing to a private dashboard | ANLY-01, ANLY-02, ANLY-03, ANLY-04, ANLY-05, ANLY-06 | 4 |
| 6 | Pre-Launch QA | Confidence the site is production-ready | All requirements validated end-to-end | 5 |

---

## Phase 1: Foundation

**Goal:** Bootstrap the project with architectural patterns locked in place and deploy a live (but empty) site to Vercel with the custom domain active.

**Requirements:** DSGN-01, DSGN-06, HOME-04

**UI hint:** yes — dark mode toggle and Lenis scroll behavior are visible from day one

**Success Criteria:**
1. Visiting the live Vercel URL in incognito (fresh browser, no cached theme) renders in the correct system-preferred color scheme with no flash of the wrong theme.
2. The manual dark/light toggle switches the site instantly and the preference survives a page reload.
3. The custom domain resolves to the deployed Next.js app with a valid HTTPS certificate.
4. Lenis smooth scroll is active on the placeholder page (inertia visible when scrolling a tall placeholder section).

**Dependencies:** None — this is the starting point.

**Risks:**
- Dark mode FOUC (Pitfall 3): `next-themes` with `attribute="class"` and a blocking inline script must be used. Do not roll a custom solution.
- Motion bundle bloat (Pitfall 4): `LazyMotion` + `domAnimation` feature set must be configured before any animation component is written — retrofitting is annoying.
- App Router exit animation breakage (Pitfall 5): `template.tsx` wrapper must be scaffolded now so the pattern is in place before page transitions are wired in Phase 4.

---

## Phase 2: Notion CMS Integration

**Goal:** Build a robust Notion data layer where content authored in Notion renders correctly on the site — including images that do not expire.

**Requirements:** BLOG-01, BLOG-02, BLOG-05

**UI hint:** yes — the Notion block renderer and typography prose styles are visible output

**Success Criteria:**
1. A blog post edited in Notion appears on the site (within ISR revalidation window) without any manual deployment.
2. Images embedded in a Notion post still render correctly 2+ hours after the build (proving the image pipeline solves the expiry problem).
3. All Notion block types present in Monty's actual content (callouts, toggles, code blocks, embeds) render without a crash or blank fallback.
4. Running a full `vercel build` with 20+ Notion pages does not produce any 429 rate-limit errors in the build log.

**Dependencies:** Phase 1 complete (Next.js project on Vercel, env vars configured).

**Risks:**
- Notion image URL expiry (Pitfall 1): The single most dangerous gotcha. Must choose between build-time download or `/api/notion-image` proxy route before building `NotionRenderer.tsx`. Retrofitting the image pipeline after pages are built is painful.
- Notion API rate limit (Pitfall 2): `p-limit` or `bottleneck` wrapping all SDK calls (throttled to ≤3 req/s with exponential backoff) must be added before the first multi-page build.
- `react-notion-x` is explicitly excluded — it has documented App Router breakage. Use `@notionhq/client` + `notion-to-md` only.

---

## Phase 3: Core Pages

**Goal:** Every page of the site exists and is functionally complete — the site beats Super on content and structure even before animations are layered on.

**Requirements:** HOME-01, HOME-02, PORT-01, PORT-03, BLOG-03, BLOG-04, ABOUT-01, SOC-01, SOC-02, SOC-03, SOC-04, SOC-05, DSGN-02, DSGN-05

**Plans:** 6/6 plans executed

Plans:
- [x] 03-01-PLAN.md — Infrastructure, design tokens, navigation, footer, vitest setup
- [x] 03-02-PLAN.md — Homepage with hero and scroll-driven narrative sections
- [x] 03-03-PLAN.md — Projects data layer, listing page, and case study pages
- [x] 03-04-PLAN.md — Blog enhancements: tag filtering, reading time, newsletter CTA
- [x] 03-05-PLAN.md — About page and Links page
- [x] 03-06-PLAN.md — OG images, sitemap, robots.txt, SEO meta

**UI hint:** yes — this phase is almost entirely UI and page-level layout work

**Success Criteria:**
1. All six routes are reachable and return content: `/` (homepage), `/about`, `/projects`, `/blog`, `/blog/[slug]`, `/links`.
2. The blog listing page filters posts by tag without a page reload.
3. Every page passes a mobile layout check at 375px viewport width (iPhone SE) with no horizontal overflow or overlapping elements.
4. Dynamic OG images are returned for blog post URLs when previewed in a social card debugger (e.g., Twitter Card Validator).
5. `curl https://msizzle.com/sitemap.xml` returns a valid XML sitemap listing all public routes.

**Dependencies:** Phase 2 complete (Notion data layer, image pipeline, rate limiter, block renderer all working).

**Risks:**
- Animation complexity in this phase: keep all interactive components (hover states, mobile nav) as simple CSS/Tailwind — do not introduce GSAP or Motion sequences here. Those come in Phase 4 so pages remain testable.
- ISR revalidation window: `/api/revalidate` webhook must be secured with a secret token before any Notion content is connected to production routes.

---

## Phase 4: Animation & Polish

**Goal:** Layer on all animations so the site feels "alive and memorable" — the core design value proposition.

**Requirements:** HOME-03, HOME-04 (Lenis full integration), PORT-02, DSGN-03, DSGN-04

**Plans:** 3/3 plans complete

Plans:
- [x] 04-01-PLAN.md — GSAP install, Lenis+GSAP ticker sync, page transition upgrade, MotionConfig reducedMotion, Wave 0 tests
- [x] 04-02-PLAN.md — ScrollReveal + ParallaxLayer components, homepage cinematic animations
- [x] 04-03-PLAN.md — Project card hover-reveal overlay, site-wide scroll reveals on all pages

**UI hint:** yes — this phase is entirely visual/interaction layer

**Success Criteria:**
1. Navigating between any two routes produces a smooth entrance transition with no layout shift or flash of unstyled content (tested in Chrome and Safari).
2. Scrolling through the homepage on a mobile device at 6x CPU throttle produces no jank (no frames below 30fps in Chrome DevTools Performance panel).
3. All scroll-triggered animations respect `prefers-reduced-motion` — verified via macOS Accessibility settings (animations are suppressed, not broken).
4. Project cards display the hover-reveal interaction on desktop and a tap-reveal fallback on mobile.

**Dependencies:** Phase 3 complete (all pages exist and are testable — animations require pages to animate).

**Risks:**
- AnimatePresence exit animations (Pitfall 5): `template.tsx` wrapper (scaffolded in Phase 1) must be used — not `layout.tsx`. Keep all transitions under 400ms total. Stable `key` props required on all `AnimatePresence` children.
- Mobile animation jank (Pitfall 7): Only animate `transform` and `opacity` — never `width`, `height`, `padding`, or `margin`. Test on a real device, not just desktop DevTools.
- GSAP + Lenis sync: Lenis must be initialized in root layout and its RAF ticker synced to GSAP's before any ScrollTrigger sequences are authored.

---

## Phase 5: Analytics

**Goal:** Real visitor data is flowing into a private Umami dashboard — the second core reason this rebuild exists.

**Requirements:** ANLY-01, ANLY-02, ANLY-03, ANLY-04, ANLY-05, ANLY-06

**Plans:** 2 plans

Plans:
- [ ] 05-01-PLAN.md — UmamiAnalytics component, layout integration, outbound click tracking attributes
- [ ] 05-02-PLAN.md — Deploy Umami infrastructure (Neon + Vercel), verify end-to-end analytics flow

**UI hint:** no — the output is a separate Umami dashboard, not changes to the main site UI

**Success Criteria:**
1. Visiting any page on the live site registers a pageview in the Umami dashboard within 30 seconds (real-time tracking confirmed).
2. The Umami dashboard shows traffic source breakdown (direct, referrer, UTM params) for at least two distinct visit sources in a test session.
3. Geographic location and device/browser data appear in the Umami dashboard for at least one test visit.
4. Clicking an outbound project link or external social link registers a custom `track()` event in the Umami events log.

**Dependencies:** Phase 3 complete (all pages deployed with real routes to track). Phase 4 is not required — analytics is independent of animation work.

**Risks:**
- Umami must be a separate Vercel project (not embedded in the main site) to prevent analytics infrastructure from consuming main site free-tier limits.
- Default Umami credentials must be changed immediately after first deployment — do not leave admin/umami as credentials.
- Ad blocker interference: test tracking in a clean browser profile (no extensions). Umami's self-hosted domain avoids most blockers but verify before declaring success.
- Neon Postgres is preferred over Supabase for the Umami DB — Supabase free tier pauses after 7 days of inactivity; Neon does not.

---

## Phase 6: Pre-Launch QA

**Goal:** Systematic validation that all requirements are met and the site is production-ready before the domain is fully switched over from Super.

**Requirements:** All 28 v1 requirements validated end-to-end.

**UI hint:** no — QA pass, no new features

**Success Criteria:**
1. Notion images in a post that was built 2+ hours ago still load (image pipeline validation, Pitfall 1).
2. Lighthouse run against the Vercel production URL (not dev) scores ≥90 Performance, ≥95 Accessibility, ≥95 Best Practices, 100 SEO.
3. Full `vercel build` completes with no 429 errors and no TypeScript or ESLint errors.
4. Dark mode first-visit test in incognito passes: system dark → renders dark, system light → renders light, no FOUC in either case.
5. All 28 v1 requirements have been manually confirmed against the live production URL and checked off in REQUIREMENTS.md.

**Dependencies:** Phases 1-5 all complete.

**Risks:**
- Environment variable mismatches between local and Vercel production — run `vercel build` locally (not `next build`) to catch these.
- Safari-specific issues: page transitions and `backdrop-filter` have known differences — must test in Safari, not just Chrome.
- Security check: confirm `NOTION_TOKEN` is not present in any client-side bundle (use Next.js bundle analyzer or browser DevTools network tab).

---

## Requirement Coverage

| Requirement | Phase |
|-------------|-------|
| HOME-01 | Phase 3 |
| HOME-02 | Phase 3 |
| HOME-03 | Phase 4 |
| HOME-04 | Phase 1 (scaffold) / Phase 4 (full integration) |
| PORT-01 | Phase 3 |
| PORT-02 | Phase 4 |
| PORT-03 | Phase 3 |
| BLOG-01 | Phase 2 |
| BLOG-02 | Phase 2 |
| BLOG-03 | Phase 3 |
| BLOG-04 | Phase 3 |
| BLOG-05 | Phase 2 |
| ABOUT-01 | Phase 3 |
| ANLY-01 | Phase 5 |
| ANLY-02 | Phase 5 |
| ANLY-03 | Phase 5 |
| ANLY-04 | Phase 5 |
| ANLY-05 | Phase 5 |
| ANLY-06 | Phase 5 |
| DSGN-01 | Phase 1 |
| DSGN-02 | Phase 3 |
| DSGN-03 | Phase 4 |
| DSGN-04 | Phase 4 |
| DSGN-05 | Phase 3 |
| DSGN-06 | Phase 1 |
| SOC-01 | Phase 3 |
| SOC-02 | Phase 3 |
| SOC-03 | Phase 3 |
| SOC-04 | Phase 3 |
| SOC-05 | Phase 3 |

Every v1 requirement maps to exactly one phase. Coverage: 28/28 (100%).

---

*Roadmap created: 2026-03-31*
