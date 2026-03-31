# Pitfalls Research

**Domain:** Personal website with Notion CMS and rich animations
**Researched:** 2026-03-31
**Confidence:** HIGH

---

## Critical Pitfalls

### Pitfall 1: Notion Image URLs Expire After ~1 Hour

**What goes wrong:**
Notion serves images (cover photos, inline images, file uploads) as AWS S3 pre-signed URLs that expire approximately 1 hour after the API call. Pages built with ISR continue serving cached HTML with dead `<img src>` values long after the URLs expire. Visitors see broken images.

**Why it happens:**
Notion does not host images on a stable CDN. Every API call returns a fresh signed URL, but that URL is baked into the static HTML at build time. ISR revalidates the page logic but the HTML cache continues serving the old, now-expired S3 URL until the full regeneration completes and a new visitor triggers it.

**How to avoid:**
- **At build time**: Download all Notion images to your own storage (Cloudflare R2, Vercel Blob, S3, or even `/public`) and replace URLs in your data layer before rendering. Run this as part of the build script.
- **Proxy approach**: Build a Next.js API route (`/api/notion-image?id=...`) that fetches a fresh Notion URL on every request and streams the image. This adds latency but stays fresh automatically.
- **Cloudflare Worker approach**: Intercept image requests at the edge and re-fetch the current Notion URL, serving from cache until the worker cache expires.
- Never pass raw Notion image URLs directly to `next/image` for any page using ISR.

**Warning signs:**
- Images work on first deploy but break after 1-2 hours
- `next/image` caches an optimized version of the expired URL, then reports upstream errors
- Error logs show 403 responses from `prod-files-secure.s3.us-east-1.amazonaws.com`

**Phase to address:** Before any content goes live — embed the image-download step into the build pipeline from day one. Retrofitting is painful.

---

### Pitfall 2: Notion API Rate Limit (3 Requests/Second) Hits Build Time

**What goes wrong:**
The Notion API enforces a hard limit of 3 requests per second per integration. A typical blog or portfolio site with 20+ pages, each requiring multiple API calls (page metadata + block children + nested blocks), can easily trigger 429 errors during full builds or revalidations.

**Why it happens:**
The Notion API does not batch block fetches. Each page requires: 1 call for page properties, 1+ calls for block children, and potentially more for nested blocks (synced blocks, sub-pages, databases). Running `getStaticPaths` + `getStaticProps` in parallel across many pages will burst over the limit instantly.

**How to avoid:**
- Add a rate limiter with retry and backoff in your Notion SDK wrapper (e.g., `p-limit` or `bottleneck`): throttle to 2-3 requests/second with exponential backoff on 429.
- Cache API responses aggressively (Redis, Vercel KV, or simple filesystem cache) so ISR revalidation only hits the API when content actually changes.
- Use on-demand ISR via a webhook from Notion (or a cron job) rather than time-based revalidation. This drastically reduces build-time API calls.
- Keep page count reasonable — Notion is not suitable as a CMS for thousands of pages.

**Warning signs:**
- Build fails intermittently with 429 or timeout errors
- Some pages build fine, others throw `APIResponseError: rate_limited`
- Builds work locally (slow) but fail on Vercel (parallel)

**Phase to address:** During initial Notion integration setup. Add the rate limiter before any multi-page build, not after you hit 429 in production.

---

### Pitfall 3: Dark Mode Flash (FOUC) on First Load

**What goes wrong:**
The page renders in light mode for a visible split-second on first load, even if the user's OS is set to dark mode or they previously selected dark mode. This is especially jarring on animation-heavy sites because it triggers a full visual reset mid-entrance animation.

**Why it happens:**
Next.js (App Router) server-renders HTML without knowing the user's theme preference — that information only exists on the client (via `localStorage` or `prefers-color-scheme`). The HTML is delivered in default (light) styles, React hydrates, then the theme is applied. The gap between delivery and hydration is the flash.

**How to avoid:**
- Use `next-themes` — it solves this with a blocking inline script injected into `<head>` that reads `localStorage` and applies the theme class before any paint.
- Set `attribute="class"` on ThemeProvider and use Tailwind's `darkMode: 'class'` strategy.
- Do not use CSS `prefers-color-scheme` alone — it cannot be overridden by a user toggle without a script-based solution.
- Wrap any component that reads the current theme in a hydration guard to avoid SSR mismatches: render a neutral placeholder server-side, swap in the real component after mount.
- Never render theme-dependent values in RSCs (React Server Components) — they will always render the server default.

**Warning signs:**
- White flash visible on page load in dark mode
- Console hydration warnings: `Warning: Prop className did not match`
- Toggle button shows wrong initial icon/state

**Phase to address:** When implementing light/dark mode — do not defer. FOUC is invisible in dev (fast HMR) but always present in production static builds.

---

### Pitfall 4: Framer Motion Bundle Bloat Killing Core Web Vitals

**What goes wrong:**
The full `framer-motion` package is ~34kb gzipped. On a personal site where animations are used on most pages, this lands in the initial JS bundle, directly hurting First Contentful Paint and Largest Contentful Paint scores — the metrics that determine how "fast" the site feels and ranks.

**Why it happens:**
Importing `motion` from `framer-motion` prevents tree-shaking. The entire library, including features you don't use (layout animations, drag, 3D), gets bundled.

**How to avoid:**
- Use `LazyMotion` + `m` component pattern instead of `motion`. This defers the Framer Motion feature bundle and brings initial cost down to ~4.6kb.
- Load only the feature set you need: `domAnimation` (~15kb) for most cases, `domMax` only if you need layout animations or drag.
- Use dynamic imports with `ssr: false` for animation-heavy components that are below the fold.
- For scroll-triggered entrance animations, consider plain CSS `@keyframes` + Intersection Observer — zero JS cost, GPU-accelerated natively.

**Warning signs:**
- Lighthouse performance score drops significantly vs. a static page
- Bundle analyzer shows `framer-motion` as one of the top 3 largest chunks
- FCP/LCP metrics regress after adding animations

**Phase to address:** Architecture phase — establish the LazyMotion pattern before writing a single animation component.

---

### Pitfall 5: AnimatePresence Page Transitions Broken in Next.js App Router

**What goes wrong:**
`AnimatePresence` exit animations don't fire during navigation when using the Next.js App Router. The outgoing page unmounts before the exit animation can play, resulting in instant cuts instead of transitions.

**Why it happens:**
The App Router's navigation model updates context frequently and unmounts the outgoing page component abruptly, before Framer Motion can observe the change in `AnimatePresence` children. The workaround requires hooking into internal Next.js router state, which is not a public API and can break on Next.js upgrades.

**How to avoid:**
- Use `template.tsx` (not `layout.tsx`) to wrap page content — `template.tsx` is re-created on every navigation, giving `AnimatePresence` a detectable key change.
- Keep exit animations short (under 300ms) and accept that App Router exit transitions are fragile — entrance animations are reliable, exit animations are not without workarounds.
- If true exit animations are essential, evaluate using the Pages Router for this project (it has full `AnimatePresence` support via `_app.tsx`).
- Always give direct children of `AnimatePresence` a stable `key` prop — without it, exit animations never fire regardless of router version.

**Warning signs:**
- Exit animations work in dev but not in production builds
- Transitions work on soft navigations but break on hard refresh
- `AnimatePresence` mode="wait" causes blank screens between routes

**Phase to address:** Architecture phase, before committing to a router strategy. The choice between App Router and Pages Router has animation implications.

---

### Pitfall 6: ISR Revalidation Window Mismatch with Notion Image Expiry

**What goes wrong:**
If ISR `revalidate` is set higher than 3600 seconds (1 hour), the cached HTML will contain expired Notion image URLs for longer than the URLs are valid. Even at exactly 3600 seconds, a page could be served just before revalidation with images that expire seconds later.

**Why it happens:**
ISR's stale-while-revalidate model serves the cached version while regenerating in the background. The regeneration is triggered by a request after the revalidation window expires — meaning the actual refresh can lag by seconds to minutes after the nominal window.

**How to avoid:**
- Never rely on time-based ISR if your content includes raw Notion image URLs. Use the image download-at-build-time approach (see Pitfall 1) to make images independent of URL expiry.
- If using time-based ISR: set `revalidate` to no more than 1800 seconds (30 minutes) as a safety margin.
- Prefer on-demand ISR via `revalidatePath` triggered by a webhook, so revalidation happens in sync with actual content changes, not on a timer.
- Note: with on-demand ISR you still need to ensure Notion's webhook or your cron trigger fires before images expire (within the first hour after a Notion edit).

**Warning signs:**
- Images work immediately after deployment but break gradually over hours
- ISR revalidation logs show successful rebuilds but broken images persist

**Phase to address:** During CMS integration, before setting any `revalidate` values.

---

### Pitfall 7: Mobile Animation Performance Degradation

**What goes wrong:**
Scroll-triggered animations that work smoothly on desktop drop to choppy, janky motion on mid-range Android devices. Heavy entrance animations on page load block the main thread during the critical first interaction window.

**Why it happens:**
Animating CSS properties that trigger layout (width, height, padding, margin, top, left) forces the browser to recalculate the entire page layout on each frame. On mobile, this drops below 60fps. Even GPU-composited animations can cause issues if too many layers are promoted simultaneously (GPU memory pressure).

**How to avoid:**
- Only animate `transform` and `opacity` — these are compositor-only properties and never trigger layout or paint.
- Never animate `width`, `height`, `top`, `left`, `padding`, or `margin` directly. Use `scaleX`/`scaleY` transforms to simulate size changes.
- Use Intersection Observer (not scroll event listeners) to trigger entrance animations — Framer Motion's `whileInView` uses this under the hood.
- Limit simultaneous animated elements on any single screen — stagger entrances so only 3-5 elements animate at once.
- Test on a real mid-range Android device or use Chrome DevTools with CPU throttling (6x slowdown) early in development, not after launch.
- Use `will-change: transform` sparingly — excessive use creates too many GPU layers.

**Warning signs:**
- Chrome DevTools shows red frames in the Performance timeline during scroll
- "Layout" tasks appear in the flame chart during animation
- FPS drops below 30 on mid-range mobile devices

**Phase to address:** During animation implementation — establish a "transform/opacity only" rule from the start.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Passing raw Notion image URLs directly to `<img>` | Works immediately, no build pipeline needed | Images break after 1 hour, hard to debug in production | Never — always proxy or download |
| No rate limiting on Notion API calls | Simpler code, faster initial setup | Build failures in production when page count grows | Never on multi-page sites |
| Using `motion` from framer-motion directly everywhere | Simpler imports, faster to write | Full 34kb bundle on every page, hurts Core Web Vitals | Acceptable on prototype/MVP only |
| `revalidate: 86400` (daily ISR) | Content stays stable, fewer rebuilds | Stale content for up to 24hrs, guaranteed broken Notion images | Only if you've solved image expiry separately |
| Skipping `next-themes`, rolling your own theme toggle | Avoids dependency | FOUC on every visit, hydration warnings | Never — next-themes is the standard solution |
| Animating `width`/`height` instead of `transform: scale` | More intuitive CSS | Layout thrashing, mobile jank | Never for scroll/entrance animations |
| Using Supabase direct connection URL (port 5432) for Umami at runtime | Simpler setup | "too many connections" errors under serverless concurrency | Only for migrations, not runtime |
| Committing Notion `NOTION_TOKEN` to repo | Immediate convenience | Full read access to all your Notion workspaces exposed | Never |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Notion + next/image | Using the raw S3 URL directly as `src` | Download image at build time OR proxy through an API route |
| Notion + ISR | Setting `revalidate` > 3600 | Use on-demand ISR via webhook, or set to ≤1800 and solve image expiry separately |
| Notion API + parallel builds | Calling API in parallel for all pages during `generateStaticParams` | Throttle with `p-limit` to max 3 concurrent requests |
| Notion blocks + rendering | Assuming all block types render | Handle `unsupported` type gracefully; Notion returns `type: "unsupported"` for forms, buttons, AI blocks, some embeds |
| Notion nested blocks | Fetching top-level blocks only | Notion's API requires separate calls for nested block children; only 2 levels deep per call |
| Framer Motion + App Router | Wrapping pages in `layout.tsx` for AnimatePresence | Use `template.tsx` instead — it re-renders on every navigation |
| Umami + Vercel + Supabase | Using the direct connection string (port 5432) for runtime | Use the pooler connection (port 6543, pgBouncer) for runtime; direct only for migrations |
| Umami + Vercel | Hosting Umami on the same Vercel project as the main site | Deploy Umami as a separate Vercel project to isolate bandwidth and function invocation limits |
| next/image + Notion CDN domains | Forgetting to whitelist Notion's CDN in `remotePatterns` | Add `prod-files-secure.s3.us-east-1.amazonaws.com` and `www.notion.so` to `images.remotePatterns` in `next.config.js` |
| Dark mode + SSR | Reading `localStorage` or `window` in a component body | Use `next-themes` ThemeProvider; guard client-only reads with `useEffect` or hydration checks |
| Framer Motion + SSR | Using `motion` components without `"use client"` | All Framer Motion components require Client Components in App Router |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Animating layout-triggering CSS properties | Jank on scroll, red frames in DevTools | Animate only `transform` and `opacity` | Immediately visible on mid-range mobile |
| Full Framer Motion bundle in initial JS | High FCP/LCP, low Lighthouse score | Use `LazyMotion` + `m` components | On any page with Framer Motion imported |
| Too many simultaneous animated elements | Visual chaos, frame drops | Stagger animations; max 3-5 concurrent | When multiple sections enter viewport simultaneously |
| Unoptimized Notion images served raw | LCP failure (multi-MB images) | Use `next/image` with downloaded/proxied images | On first meaningful paint for image-heavy pages |
| Scroll event listeners for animation triggers | Main thread jank, battery drain on mobile | Use Intersection Observer / Framer Motion `whileInView` | Immediately on low-power devices |
| Large `will-change: transform` surface area | GPU memory pressure, mobile crashes | Apply `will-change` only to actively animating elements, remove after animation | On mobile devices with limited VRAM |
| Blocking animations before page is interactive | Poor TTI (Time to Interactive) | Delay non-critical animations until after hydration | On slow connections or low-end devices |
| ISR rebuilding every Notion API call with no cache | Redundant API calls, rate limit exhaustion | Cache Notion responses (Vercel KV, Redis, or build-time snapshot) | As page count and traffic both grow |

---

## Security Mistakes

**Notion Token Exposure**
Store `NOTION_TOKEN` only in Vercel environment variables. Never expose it client-side (`NEXT_PUBLIC_` prefix). A leaked token gives read access to your entire Notion workspace.

**Umami Admin Panel Publicly Accessible**
If you deploy Umami on a public URL without changing the default credentials (`admin` / `umami`), your analytics dashboard is open to anyone. Change the password immediately after first deployment.

**Missing `remotePatterns` in next.config.js**
Without explicit domain whitelisting, `next/image` will throw errors and refuse to optimize images from external domains. Always configure `remotePatterns` rather than the deprecated `domains` array (deprecated since Next.js 14).

**Content Security Policy Gaps**
When adding Umami's tracking script, the CSP `script-src` directive must include the Umami domain, or the script will be blocked by browser security policy. Same applies to any inline `<Script>` tags for theme initialization.

**ISR On-Demand Revalidation Endpoint Without Auth**
The `/api/revalidate` route must validate a secret token in the request before calling `revalidatePath`. Without this, anyone can trigger mass cache invalidation and cause excessive Notion API calls (and potentially a bill on Vercel Pro).

---

## UX Pitfalls

**Animation Respects `prefers-reduced-motion` — Yours Might Not**
Users who enable reduced motion in their OS settings expect animations to be disabled or minimized. Framer Motion respects this automatically via `useReducedMotion()`, but only if you wire it up. Ignoring it is both a UX failure and an accessibility issue.

**Page Transitions Make Navigation Feel Slow**
A 600ms page exit + entrance animation means every click feels slow, even if the page loads instantly. Keep total transition time under 400ms and bias toward entrance animations (which can overlap with load time) rather than exit animations.

**Scroll-Triggered Animations Obscure Content**
Content that starts invisible (opacity: 0) and animates in only when scrolled to can be permanently invisible for users who disable JS, use RSS readers, or have accessibility tools. Always set a CSS fallback that shows content by default.

**Dark Mode Toggle Requires Hydration Before It's Usable**
If the dark mode toggle button doesn't match the actual active theme on first render (server shows "light" icon, client corrects to "dark"), users clicking immediately after load get the wrong result. Use a hydration guard that renders the toggle only after mount.

**Mobile Tap Targets on Interactive Animation Elements**
Animated elements that move or scale can temporarily reduce their effective tap target size mid-animation. Ensure minimum 44x44px touch targets even during animation states.

---

## "Looks Done But Isn't" Checklist

- [ ] Images display in development but have you tested they persist after 1+ hours?
- [ ] Dark mode looks correct in the browser but have you tested on first visit (cleared localStorage) in an incognito window?
- [ ] Page transitions animate in Chrome — have you tested in Safari (different rendering behavior, especially for backdrop-filter)?
- [ ] Build succeeds locally — have you tested a Vercel production build (`vercel build`) to catch environment variable and Node version differences?
- [ ] Notion content renders — have you added blocks of every type you plan to use (toggle, callout, code block, table, synced block) and confirmed they render gracefully?
- [ ] Umami is tracking pageviews — have you confirmed it's not blocked by your own browser's ad blocker (test in a different browser)?
- [ ] ISR is revalidating — have you made a Notion edit and confirmed the site updated within the expected window (not just on redeploy)?
- [ ] Animations feel smooth on desktop — have you tested with CPU 6x throttle in Chrome DevTools and on an actual mobile device?
- [ ] Lighthouse score looks good in dev — have you run it against the Vercel production URL (dev mode inflates scores)?
- [ ] Analytics data is visible in Umami — have you checked that the tracking script loads on every page, including dynamically navigated ones?
- [ ] Rate limiting is working — have you triggered a full rebuild and confirmed no 429 errors from Notion in the build logs?
- [ ] `prefers-reduced-motion` is respected — test by enabling "Reduce Motion" in macOS Accessibility settings?

---

## Pitfall-to-Phase Mapping

| Phase | Pitfalls to Address |
|-------|---------------------|
| Architecture & Setup | Pitfall 4 (LazyMotion pattern), Pitfall 5 (App Router vs Pages Router for transitions), dark mode approach, Umami deployment architecture |
| Notion Integration | Pitfall 1 (image expiry — solve at pipeline design time), Pitfall 2 (rate limiting — add before first multi-page build), Pitfall 3 (ISR window), Pitfall 6 (ISR + image expiry interaction) |
| Animation Implementation | Pitfall 4 (bundle size), Pitfall 5 (AnimatePresence), Pitfall 7 (mobile performance) |
| Analytics Setup | Umami default credentials, CSP for tracking script, connection pooling for Supabase |
| Pre-Launch | All "Looks Done But Isn't" items, Vercel limits check, security review |
| Post-Launch | Monitor Vercel bandwidth (100GB/month free), monitor Notion API 429s in logs |

---

## Sources

- [Notion API Request Limits — Official Docs](https://developers.notion.com/reference/request-limits)
- [How to Handle Notion API Request Limits — Thomas Frank](https://thomasjfrank.com/how-to-handle-notion-api-request-limits/)
- [Can You Use Notion as a Website Backend? — OpenReplay](https://blog.openreplay.com/notion-website-backend/)
- [How to render images from the Notion API with Next.js — Guillermo DL](https://guillermodlpa.com/blog/how-to-render-images-from-the-notion-api-with-next-js-image-optimization)
- [Notion image URLs — vercel/next.js Discussion #36503](https://github.com/vercel/next.js/discussions/36503)
- [Serving Notion Presigned Images with Cloudflare Workers — Alex MacArthur](https://macarthur.me/posts/serving-notion-presigned-images-with-cloudflare/)
- [Next.js ISR Guide — Next.js Docs](https://nextjs.org/docs/pages/guides/incremental-static-regeneration)
- [Reduce bundle size of Framer Motion — Motion.dev Docs](https://motion.dev/docs/react-reduce-bundle-size)
- [LazyMotion — Motion.dev Docs](https://motion.dev/docs/react-lazy-motion)
- [App router issue with Framer Motion — vercel/next.js Issue #49279](https://github.com/vercel/next.js/issues/49279)
- [Solving Framer Motion Page Transitions in Next.js App Router — imcorfitz](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router)
- [Fixing Dark Mode Flickering (FOUC) in React and Next.js — Not A Number](https://notanumber.in/blog/fixing-react-dark-mode-flickering)
- [Understanding & Fixing FOUC in Next.js App Router — DEV Community](https://dev.to/amritapadhy/understanding-fixing-fouc-in-nextjs-app-router-2025-guide-ojk)
- [Animation performance guide — Motion.dev](https://motion.dev/docs/performance)
- [CSS and JavaScript animation performance — MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)
- [Your Complete Guide to Self-Hosting Umami Analytics with Vercel and Supabase — HackerNoon](https://hackernoon.com/your-complete-guide-to-self-hosting-umami-analytics-with-vercel-and-supabase)
- [Setting up Umami with Vercel and Supabase — DEV Community](https://dev.to/jakobbouchard/setting-up-umami-with-vercel-and-supabase-3a73)
- [Vercel Hobby Plan Docs](https://vercel.com/docs/plans/hobby)
- [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
- [Vercel Pricing Hidden Costs 2026 — Flexprice](https://flexprice.io/blog/vercel-pricing-breakdown)
- [Building a blog with Notion's public API — Samuel Kraft](https://samuelkraft.com/blog/building-a-notion-blog-with-public-api)
- [Next.js remotePatterns / images configuration — Next.js Docs](https://nextjs.org/docs/app/api-reference/components/image)
