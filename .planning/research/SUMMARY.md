# Project Research Summary

**Project:** MSizzle Personal Website
**Domain:** Personal website/portfolio with Notion CMS
**Researched:** 2026-03-31
**Confidence:** HIGH

---

## Executive Summary

This is a custom personal platform replacing a Notion Super site — covering portfolio, blog, about/resume, and social links — with rich visitor analytics and a design that prioritizes animation, interactivity, and unique layouts over generic templates. The primary motivations for the rebuild are design freedom (Super is too constrained), analytics depth (Super provides almost none), and cost (Super charges for what Vercel + free tooling can do better). Content stays in Notion; only the presentation layer is being rebuilt from scratch.

The recommended approach is Next.js 15 App Router with ISR, Tailwind v4, Notion as a headless CMS via the official `@notionhq/client` + `notion-to-md` pipeline, and self-hosted Umami analytics on a separate Vercel project backed by Neon Postgres. Animation is handled by a layered stack: Motion (formerly Framer Motion) for component-level transitions and gestures, GSAP + ScrollTrigger for scroll-driven sequences, and Lenis for smooth scroll. The stack is well-documented, AI-friendly, and fits entirely within the Vercel free tier.

The key risks are all known and solvable: Notion image URLs expire every hour and must be proxied or downloaded at build time (the single most dangerous gotcha); the Notion API has a 3 req/s rate limit that will bite build pipelines without throttling; and Framer Motion's App Router exit animations are fragile, requiring use of `template.tsx` rather than `layout.tsx` and short transition durations. None of these are blockers — they are well-understood integration problems with documented solutions that must be addressed in the right phases.

---

## Key Findings

### Recommended Stack

**Core framework:** Next.js 15.2.x (App Router, ISR, Turbopack in dev) + React 19 + TypeScript 5.x

**Styling:** Tailwind CSS v4 (CSS-first config, no tailwind.config.js) + shadcn/ui (copy-owned components, Radix UI primitives) + next-themes 0.4.6 for dark mode

**Notion CMS pipeline:** `@notionhq/client` 5.x (server-only) → `notion-to-md` 3.x → `markdown-to-jsx` + `@tailwindcss/typography` for rendered prose. Do NOT use `react-notion-x` — it has documented App Router breakage.

**Animation stack (layered):**
- Motion 12.x (`motion/react`) — component transitions, gestures, scroll-triggered reveals (`whileInView`)
- GSAP 3.x + ScrollTrigger — complex scroll-driven timelines, parallax, staggered sequences
- Lenis — smooth scroll engine, synced to GSAP's RAF ticker
- `react-intersection-observer` — lightweight viewport detection when GSAP is overkill

**Analytics:** Umami v3 self-hosted as a separate Vercel project, backed by Neon serverless Postgres (free tier, never hard-pauses — unlike Supabase which pauses after 7 days of inactivity)

**Hosting:** Vercel Hobby plan — all expected usage is well within free tier limits (100 GB bandwidth, 1M edge requests/month)

**Supporting libraries:** `date-fns` 3.x, `sonner` 1.x, `clsx` + `tailwind-merge`, `sharp`, `@vercel/og`, Prettier + `prettier-plugin-tailwindcss`

---

### Expected Features

**Must Have — v1 Launch (non-negotiable for the site to beat Super):**
- Homepage with scroll-driven narrative (hero, about snapshot, featured work, writing teaser, contact CTA)
- About/resume page (bio, experience, Georgetown + NYC context, skills in prose — no bar charts)
- Projects page — 3–5 cards with hover-reveal interaction
- Blog/writing section — Notion CMS-powered, readable typography, estimated read time, tag filtering
- Visitor analytics (private Umami dashboard) — real-time visitors, traffic sources, geo, device breakdown
- Dark mode — system-aware + manual toggle, no FOUC
- Core animations — page transitions, scroll reveals, Lenis smooth scroll
- SEO — `og:` meta tags, sitemap (`app/sitemap.ts`), Person structured data, `robots.txt`
- Mobile responsive — tested at 375px / iPhone SE
- Social links hub — footer + dedicated `/links` page
- Custom domain pointed to Vercel

**Should Have — v1.x (add after launch with real visitor signal):**
- "Now" page (once there's a publishing rhythm)
- Real-time visitor widget on posts (only after traffic is non-trivial, >50 daily)
- Geo analytics map (visual layer on Umami geo data)
- Newsletter inline subscribe CTA (at post end, after writing section gets traction)
- Case study deep-dives (after knowing which projects get click-through)
- RSS feed (auto-generated, 1 hour of work)
- Blog search via Pagefind (once post count exceeds ~20)

**Defer to v2+ (revisit at 6 months with real data):**
- Public read-only analytics page
- Bento grid homepage redesign (if scroll narrative feels stale)
- Ambient interactive background (Three.js/Canvas — only if it serves the brand)
- Speaking/appearances section
- Reading list pulled from Notion

**Explicitly avoid (anti-features):**
- Full-screen video backgrounds (load cost, mobile auto-play)
- Interactive 3D globe (3+ MB WebGL, widely overused)
- Overbuilt contact form (serverless + spam not worth it for a personal site)
- AI chatbot (API costs, hallucination risk, maintenance)
- Skill bar charts (signals junior thinking)
- Public raw visitor counters (credibility backfires at low numbers)
- Auto-playing audio

**Design tone:** Understated confidence — charcoal/slate dark mode, one reserved accent color, one serif + one sans pairing. Reference: Rauno Figueiredo, Paco Courty, Anthony Fu, Linear marketing site.

---

### Architecture Approach

**Two separate Vercel projects:** main Next.js site (Vercel project 1) + Umami analytics instance (Vercel project 2, forked repo with its own Neon Postgres DB). This isolation ensures analytics never affect main site performance or free tier limits.

**Content data flow:**
```
Notion → @notionhq/client (server-only) → notion-to-md → markdown-to-jsx → ISR page → Vercel Edge CDN
```

**Revalidation strategy:** `revalidate: 3600` (1h) as safety net on blog/portfolio pages; `revalidate: 86400` (24h) on slow-changing pages like /about; on-demand `revalidatePath()` via a protected `/api/revalidate` webhook for instant updates on publish.

**Server/Client component split:**
- Server Components: page shells, Notion data fetching, SEO metadata, static content
- Client Components: all animations (Motion, GSAP), theme toggle, interactive project cards, mobile nav

**Animation architecture:**
- Motion for component-level transitions and `whileInView` scroll reveals
- GSAP + ScrollTrigger for sophisticated scroll-driven sequences
- Lenis initialized globally in root layout, synced to GSAP ticker
- Use `LazyMotion` + `m` components (not `motion`) to reduce initial bundle from 34KB to ~4.6KB

**Separate Notion databases** for Blog Posts and Projects (not a single mixed DB) — cleaner queries and typing.

**Project structure root:** `src/app/` (App Router) with `lib/notion/` for the data layer, `components/animations/` for reusable Motion wrappers, and `components/notion/` for the Notion block renderer.

---

### Critical Pitfalls

**Pitfall 1 — Notion image URLs expire after ~1 hour (CRITICAL)**
Raw Notion image URLs are AWS S3 pre-signed URLs with a ~1-hour TTL. ISR pages will serve broken images within hours of build. Solution: download all Notion images to Vercel Blob / Cloudflare R2 / `/public` at build time, or proxy via a Next.js API route (`/api/notion-image`). Never pass raw Notion S3 URLs to `next/image` on ISR pages. Address this before any content goes live — retrofitting is painful.

**Pitfall 2 — Notion API rate limit (3 req/s) breaks builds**
Sites with 20+ pages trigger 429 errors during parallel `generateStaticParams` calls. Solution: wrap the Notion SDK in a rate limiter (`p-limit` or `bottleneck`) throttled to 2–3 req/s with exponential backoff. Add this before the first multi-page build, not after hitting 429 in production.

**Pitfall 3 — Dark mode FOUC on first load**
Server renders light-mode HTML; client corrects to dark after hydration — visible flash. Solution: use `next-themes` (it injects a blocking inline script to read `localStorage` before first paint). Set `attribute="class"` + Tailwind `darkMode: 'class'`. Guard any theme-reading components with a hydration check. Do not roll your own solution.

**Pitfall 4 — Framer Motion bundle bloat**
Full `motion` package is ~34KB gzipped, hurting FCP/LCP. Solution: use `LazyMotion` + `m` components with `domAnimation` feature set (~15KB). Use `dynamic(() => import(...), { ssr: false })` for below-the-fold animation components. Establish this pattern before writing any animation code.

**Pitfall 5 — AnimatePresence exit animations broken in App Router**
The App Router unmounts outgoing pages before exit animations can play. Solution: use `template.tsx` (not `layout.tsx`) to wrap page content — it re-creates on every navigation, giving `AnimatePresence` a detectable key change. Keep all transitions under 400ms total. Always give `AnimatePresence` children a stable `key` prop.

**Additional pitfalls to watch:**
- ISR `revalidate` must be ≤1800s if using raw Notion image URLs (ideally solve image expiry separately and this becomes moot)
- Mobile animation jank: only animate `transform` and `opacity` — never `width`, `height`, `padding`, `margin`
- Umami must be deployed as a separate Vercel project (not embedded in the main site)
- Change default Umami credentials immediately after first deployment
- Secure `/api/revalidate` with a secret token
- Add Notion CDN domains to `next.config.js` `remotePatterns` (`prod-files-secure.s3.us-east-1.amazonaws.com`, `www.notion.so`)

---

## Implications for Roadmap

### Phase Ordering Rationale

The phase order is dictated by two constraints: (1) pitfalls that are expensive to retrofit (image pipeline, rate limiting, LazyMotion pattern, dark mode architecture) must be solved before building on top of them, and (2) the site needs to be "better than Super" to justify the rebuild — which means the Notion CMS pipeline, core pages, and analytics must all land in v1 before the project delivers real value.

The recommended phases are:

---

**Phase 0 — Foundation (1–2 days)**
*Deliver: a working Next.js project wired to Vercel, with the architectural patterns locked in place.*

- Bootstrap `create-next-app` with TypeScript, Tailwind v4, App Router
- Configure `next-themes` with `attribute="class"` — dark mode architecture from day one (addresses **Pitfall 3**)
- Install and configure Motion with `LazyMotion` + `domAnimation` — establish the bundle pattern before any animation is written (addresses **Pitfall 4**)
- Set up `template.tsx` for page transition wrapper (addresses **Pitfall 5**)
- Deploy to Vercel, connect custom domain
- Set up environment variables (Notion secret, revalidate secret)
- Install and wire Lenis in root layout

*Why first:* These are the hardest decisions to change later. Dark mode, animation bundle strategy, and router/transition architecture must be locked before any feature work begins.

---

**Phase 1 — Notion CMS Integration (2–3 days)**
*Deliver: content can be authored in Notion and rendered on the site.*

- Build `lib/notion/` data layer: `client.ts` (server-only singleton), `api.ts` (getDatabase, getPage, getBlocks), `transforms.ts` (Notion DTOs)
- Add rate limiter (`p-limit`) wrapping all Notion API calls (addresses **Pitfall 2**)
- Build the image pipeline: download Notion images at build time or proxy via `/api/notion-image` (addresses **Pitfall 1** and **Pitfall 6**)
- Configure `next.config.js` `remotePatterns` with Notion CDN domains
- Set up ISR with `revalidate: 3600` on blog/portfolio pages, `revalidate: 86400` on /about
- Build and secure `/api/revalidate` webhook endpoint with secret token
- Build `NotionRenderer.tsx` + `RichText.tsx` with graceful fallback for `unsupported` block types
- Wire up Notion Blog Posts DB and Projects DB schemas (separate databases, not one combined DB)

*Why second:* Everything else depends on content. The image pipeline and rate limiter are in this phase because they must exist before the first multi-page build — retrofitting either is painful.

---

**Phase 2 — Core Pages (3–4 days)**
*Deliver: the site has all the pages that beat Super — functionally complete.*

- Homepage — scroll-driven narrative structure (hero, about snapshot, featured work, writing teaser, contact CTA); GSAP ScrollTrigger sequences
- About page — bio, experience timeline, skills in prose form (no bar charts); ISR from Notion
- Projects page — grid with hover-reveal cards (`clip-path` reveal or Motion layout animations)
- Blog index + post pages — Notion-powered, `@tailwindcss/typography` prose styling, estimated read time, tag filtering
- Links page — social hub with all externals
- Header (sticky, theme toggle, mobile nav via shadcn Sheet), Footer
- SEO — `og:` tags per page, `app/sitemap.ts`, Person structured data, `robots.txt`
- Mobile responsive pass — test at 375px

*Why third:* This is the v1 deliverable — the minimum that makes the site worth having over Super. Foundation and CMS must exist first. Animation polish comes in the next phase so pages are testable before animations are layered on.

---

**Phase 3 — Animation & Polish (2–3 days)**
*Deliver: the site feels "alive and memorable" — the core value proposition.*

- Page transitions via `AnimatePresence` in `template.tsx` (respects **Pitfall 5** — keep under 400ms total)
- Scroll-triggered section reveals using `FadeIn.tsx` and `StaggerChildren.tsx` wrappers (Motion `whileInView`, `once: true`)
- GSAP ScrollTrigger sequences on homepage (pinned sections, parallax text)
- Lenis smooth scroll synced to GSAP ticker
- Kinetic headline / typewriter on hero
- Hover states on project cards and nav links
- Ambient background effect on hero (CSS `@property` animated gradient — no JS overhead)
- Add `useReducedMotion()` guard to all animation components (accessibility + UX)
- Performance pass: only `transform`/`opacity` animations (addresses **Pitfall 7**), test with Chrome CPU 6x throttle on real mobile device
- OG image generation via `/api/og` for blog posts

*Why fourth:* Animations require pages to exist first. Separating this phase prevents animation complexity from blocking content and CMS work.

---

**Phase 4 — Analytics (1–2 days)**
*Deliver: real visitor data — the other core reason this rebuild exists.*

- Fork Umami repo, deploy as separate Vercel project (isolated from main site)
- Provision Neon Postgres free tier, connect to Umami
- Change default Umami admin credentials immediately
- Embed Umami tracking script in `app/layout.tsx` via `next/image` Script component (`strategy="afterInteractive"`)
- Add CSP header to allow Umami tracking script domain
- Build `lib/analytics.ts` thin wrapper for custom events (`track()`)
- Instrument key interactions: project card clicks, blog post reads, outbound links
- Verify tracking is not blocked by ad blockers (test in a clean browser profile)

*Why fifth:* Analytics is important but not a blocker for the site going live. Deploying it as a separate phase keeps the main site launch independent of Umami setup complexity.

---

**Phase 5 — Pre-Launch QA (1 day)**
*Deliver: confidence the site is production-ready.*

Work through the full "Looks Done But Isn't" checklist from PITFALLS.md:
- Images persist after 1+ hours (image pipeline validation)
- Dark mode correct on first visit in incognito (no FOUC)
- Page transitions tested in Safari (backdrop-filter differences)
- `vercel build` run locally to catch env var and Node version mismatches
- All Notion block types render gracefully (toggle, callout, code, table, synced block)
- Umami tracking confirmed not blocked (test in different browser)
- ISR revalidation confirmed with a real Notion edit
- Animations tested with 6x CPU throttle and on real mobile device
- Lighthouse run against Vercel production URL (not dev mode)
- Rate limiting confirmed via full rebuild with no 429 errors in build log
- `prefers-reduced-motion` tested via macOS Accessibility settings
- Security review: no `NOTION_TOKEN` in client-side code or repo

---

### Research Flags

These are open questions or decisions that should be made explicitly before or during Phase 1:

1. **Image pipeline strategy:** Build-time download vs. API route proxy. Download is more performant but adds build complexity; proxy is simpler but adds latency per image. Decide before building `NotionRenderer.tsx`.

2. **Umami hosting platform:** STACK.md recommends Railway free tier (500 hrs/month) over Render (spins down after 15 min inactivity). Render's cold start is acceptable for a personal site but will cause the first daily analytics hit to lag. Choose before Phase 4.

3. **Page transition depth:** PITFALLS.md makes clear exit animations are fragile in App Router. The decision is: accept entrance-only transitions (reliable) or invest in the `template.tsx` workaround for both (fragile, more impressive). This must be decided in Phase 3 before writing transition code.

4. **Notion block type coverage:** Before Phase 1 build, inventory every block type actually used in Monty's Notion content (toggle, callout, table, synced blocks, embeds) and confirm `notion-to-md` handles each. Build a graceful fallback for `unsupported` types from the start.

5. **On-demand revalidation trigger:** A manual "Deploy" button (simple cURL/fetch call to `/api/revalidate`) is sufficient for v1. A Notion automation webhook is more powerful but requires additional setup. Decide at Phase 1 — either works, but picking one determines how the endpoint is documented and used.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack selection | HIGH | All choices are battle-tested; alternatives considered and ruled out with documented reasons |
| Notion CMS integration pattern | HIGH | Well-documented pitfalls with known solutions; `notion-to-md` + App Router is the validated path |
| Animation architecture | HIGH | LazyMotion + GSAP + Lenis combination is established; App Router transition limitation is known and workaroundable |
| Analytics setup (Umami) | HIGH | Self-hosting on Vercel + Neon is well-documented; Railway/Render as Umami host is a standard pattern |
| Vercel free tier fit | HIGH | Expected usage is an order of magnitude below free limits for a personal site |
| Notion image expiry handling | MEDIUM | The problem is well-understood; the right solution (download vs. proxy) depends on build pipeline preferences — needs a decision |
| Feature prioritization | MEDIUM | Table stakes and anti-features are HIGH confidence; differentiator ordering is taste-dependent and should be validated against real visitor data post-launch |
| Design direction | MEDIUM | "Understated confidence" aesthetic is well-defined; specific typography and color palette choices are pending — these are creative decisions, not research questions |
| Timeline estimates | MEDIUM | Phase estimates assume focused work with AI assistance; first-pass UI/design work is the main uncertainty |

---

## Sources

- STACK.md research (2026-03-31) — stack selection, version research, Vercel fit check
- FEATURES.md research (2026-03-31) — feature landscape, MVP definition, prioritization matrix, design principles
- ARCHITECTURE.md research (2026-03-31) — system design, data flow, component patterns, anti-patterns
- PITFALLS.md research (2026-03-31) — 7 critical pitfalls with phase mapping, technical debt patterns, UX pitfalls, security mistakes
- PROJECT.md — requirements, constraints, out-of-scope decisions, context
