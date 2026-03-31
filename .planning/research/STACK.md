# Stack Research

**Domain:** Personal website/portfolio with Notion CMS
**Researched:** 2026-03-31
**Confidence:** HIGH

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.2.x (stable) | Framework, routing, SSG/ISR | App Router is mature, React 19 support, Vercel-native, Turbopack in dev. v16.1 exists but v15.x is the battle-tested choice. |
| React | 19.2.x | UI runtime | Ships with Next.js 15; useActionState, server actions, improved hydration |
| TypeScript | 5.x (latest 5.x) | Type safety | Standard for all serious Next.js projects; excellent AI tooling support |
| Tailwind CSS | v4.x | Styling | CSS-first config (no tailwind.config.js needed), 5x faster builds, auto-scans project, zero postcss.config.js. Ships with shadcn/ui v4. |
| @notionhq/client | 5.x (5.15.0) | Official Notion API client | Official SDK, actively maintained, TypeScript-first, handles auth and pagination |
| notion-to-md | 3.x (3.1.9) | Convert Notion blocks → Markdown | Best-in-class for App Router; react-notion-x has known App Router breakage. v4 alpha exists but not production-ready. |
| Motion (ex Framer Motion) | 12.x (12.38.0) | UI animations, page transitions, scroll triggers | Rebranded from framer-motion; import path is now `motion/react`. React 19 compatible. Best DX for declarative animations in React. |
| Umami | v3.x (v3.0.3) | Self-hosted analytics | Open source, GDPR-friendly, real-time visitors, traffic sources, geo, devices, page views. Deploys to Vercel free. No recurring cost. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | latest (CLI-based) | Accessible UI component primitives | Buttons, dialogs, toggles, navigation — copy-owns your components, no vendor lock-in. Built on Radix UI + Tailwind v4. |
| next-themes | 0.4.6 | Light/dark mode with no flicker | Standard for Tailwind dark mode in App Router; add `suppressHydrationWarning` to `<html>` |
| Lenis | latest | Smooth scroll | Lightweight (~3KB), syncs perfectly with GSAP ScrollTrigger via RAF ticker; gives buttery scroll feel |
| GSAP (GreenSock) | 3.x | Complex timeline animations, ScrollTrigger | Use alongside Motion for sophisticated scroll-driven sequences, parallax, staggered reveals that need frame-perfect control. Free tier covers all needs here. |
| react-intersection-observer | 9.x | Viewport detection for scroll triggers | Lightweight wrapper around IntersectionObserver API; use for lazy loading and triggering Motion/GSAP animations on scroll when full ScrollTrigger is overkill |
| @tailwindcss/typography | 0.5.x | Prose styling for blog content | Renders Notion-sourced markdown beautifully with `.prose` class |
| react-markdown / markdown-to-jsx | latest | Render Notion markdown content | Converts notion-to-md output to React components; markdown-to-jsx allows custom component mapping |
| sonner | 1.x | Toast notifications | shadcn/ui's official toast; used for copy-link, form feedback, etc. |
| clsx + tailwind-merge | latest | Conditional className merging | Standard utility pair for dynamic Tailwind classes; replaces classnames |
| date-fns | 3.x | Date formatting | Lightweight, tree-shakeable; for blog post dates, "time ago" etc. |
| sharp | 0.33.x | Image optimization (build-time) | Required by Next.js Image component for local image processing |
| @vercel/og | latest | OG image generation | Dynamic Open Graph images per blog post/project page using Edge Runtime |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vercel CLI | Deploy, preview, env management | `npx vercel` — essential for local preview of ISR and Edge behavior |
| ESLint + eslint-config-next | Linting | Ships with `create-next-app`; catches App Router pitfalls |
| Prettier | Code formatting | Add `prettier-plugin-tailwindcss` to auto-sort class names |
| Turbopack | Fast dev server | Enabled via `next dev --turbo`; stable in Next.js 15 |
| Neon (PostgreSQL) | Database for Umami | Serverless Postgres free tier: 0.5GB storage, never expires, no auto-pause (scales to zero but wakes on request). Better than Supabase free tier which pauses after 7 days of inactivity. |

---

## Installation

```bash
# Bootstrap the project
npx create-next-app@latest msizzle --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Core Notion integration
npm install @notionhq/client notion-to-md markdown-to-jsx

# Animation stack
npm install motion gsap @studio-freight/lenis react-intersection-observer

# UI / theme
npm install next-themes sonner clsx tailwind-merge

# Content rendering
npm install @tailwindcss/typography date-fns

# OG images
npm install @vercel/og

# Dev tooling
npm install -D prettier prettier-plugin-tailwindcss @types/node

# shadcn/ui (interactive CLI — run separately, adds components one by one)
npx shadcn@latest init
npx shadcn@latest add button card badge navigation-menu sheet toggle

# Umami (deploy separately — fork the repo and deploy to its own Vercel project)
# https://github.com/umami-software/umami
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| notion-to-md + markdown-to-jsx | react-notion-x | If you're using Next.js Pages Router (not App Router). react-notion-x has documented App Router compatibility issues. |
| Motion (motion/react) | GSAP only | If you need purely declarative React animations without imperative code. Motion is easier for simple transitions; GSAP for complex timeline sequences. Use both together. |
| Neon (Umami DB) | Supabase (Umami DB) | Supabase is fine but free tier auto-pauses after 7 days inactivity — bad for analytics. Neon scales to zero but never hard-pauses; wakes in <1s on request. |
| Umami (self-hosted) | Plausible Cloud | If you want managed analytics at $9/mo and no ops burden. For zero-cost requirement, Umami wins. |
| Umami (self-hosted) | Google Analytics | Avoid — heavyweight, cookie consent requirements, no real-time on free, privacy concerns |
| Tailwind CSS v4 | Tailwind CSS v3 | Stick with v3 only if you need to support browsers older than Safari 16.4 / Chrome 111 / Firefox 128. Greenfield project → v4. |
| shadcn/ui | Chakra UI / MUI | If you want a fully managed component library with consistent opinionated design. shadcn gives more customization and Tailwind v4 compatibility. |
| Next.js 15 | Astro | Astro is better for purely content-driven sites with minimal interactivity. This project requires rich animations and React component interactivity — Next.js wins. |
| @vercel/og | next-seo | next-seo handles static meta tags; @vercel/og adds dynamic per-page image generation. Use both: next-seo for base SEO metadata, @vercel/og for per-post images. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| react-notion-x | Known breakage with Next.js App Router ("use client" issues, hydration errors, unmaintained for App Router). | notion-to-md + markdown-to-jsx |
| framer-motion (old package) | Rebranded to `motion` on npm. Old package still works but import path `motion/react` is the current standard and future-proofs against deprecation. | `motion` package with `motion/react` imports |
| Google Analytics | Requires cookie consent banner, GDPR complexity, no real-time on free plan, violates self-hosted constraint. | Umami (self-hosted) |
| Supabase free tier for Umami | Projects auto-pause after 7 days inactivity. Your analytics DB goes offline if you don't visit the dashboard. | Neon serverless Postgres (never hard-pauses) |
| Pages Router | Next.js App Router is the current standard. Pages Router is legacy. All docs, libraries, and patterns are moving to App Router. | App Router (`/app` directory) |
| CSS Modules | Tailwind v4 + shadcn/ui covers all styling needs with better DX. Mixing approaches adds complexity. | Tailwind CSS v4 utility classes + CSS variables for custom tokens |
| next-sitemap | Extra dependency with manual config. Next.js 15 App Router has built-in sitemap generation via `app/sitemap.ts`. | Native `app/sitemap.ts` export |
| Contentlayer | Unmaintained since 2024. Was popular for MDX but the project is abandoned. | Direct notion-to-md pipeline |

---

## Architecture Notes

### Notion → Site Data Flow

```
Notion Database
  └─ @notionhq/client (server-side fetch)
       └─ notion-to-md (blocks → Markdown string)
            └─ markdown-to-jsx (Markdown → React JSX)
                 └─ Next.js ISR page (cached + revalidated)
```

**Revalidation strategy:** Use `revalidate = 3600` (1 hour) as a baseline on blog/portfolio pages. For on-demand revalidation when you publish in Notion, set up a simple `/api/revalidate` route protected by a secret token — call it manually or via a Notion automation/Zapier trigger.

### Umami Deployment Pattern

Umami runs as a **separate Vercel project** (not inside the main site). It gets its own deployment, its own Neon Postgres database, and you embed the tracking script in your main site's `layout.tsx`. This separation means analytics never affect main site performance.

```
Main site (Vercel project 1)
  └─ Embeds: <Script src="https://umami.yourdomain.com/script.js" .../>

Umami instance (Vercel project 2, separate repo fork)
  └─ DATABASE_URL → Neon Postgres (free tier)
  └─ UMAMI_APP_SECRET → random secret
```

### Animation Architecture

Use Motion for component-level UI animations (page transitions, hover states, mount/unmount with AnimatePresence). Use GSAP + ScrollTrigger for scroll-driven sequences (section reveals, parallax, timeline animations). Use Lenis to smooth the scroll itself and sync with GSAP's RAF ticker.

```
Motion (motion/react)   → component transitions, gestures, layout animations
GSAP + ScrollTrigger    → scroll-driven timelines, parallax, staggered reveals
Lenis                   → smooth scroll engine (synced to GSAP ticker)
react-intersection-observer → lightweight viewport triggers (when GSAP is overkill)
```

---

## Vercel Free Tier Fit Check

| Resource | Free Limit | Expected Usage | Safe? |
|----------|-----------|----------------|-------|
| Bandwidth | 100 GB/month | Personal site: ~1-5 GB | Yes |
| Build minutes | 6,000/month | ~2 min per deploy, ~50 deploys = 100 min | Yes |
| Edge requests | 1M/month | Personal site: well under | Yes |
| Serverless invocations | 1M/month | ISR + API routes: well under | Yes |
| Function duration | 60s max | Notion API calls: <5s | Yes |

**Note:** Vercel Hobby plan is restricted to **non-commercial use**. This is a personal portfolio — that's fine.

---

## Sources

- [Notion as a Headless CMS for Next.js 15 in 2025 — Medium](https://ppaanngggg.medium.com/notion-as-a-headless-cms-for-next-js-15-in-2025-f08207280e67)
- [Next.js 15.2.4 — Current Stable (March 2026)](https://www.abhs.in/blog/nextjs-current-version-march-2026-stable-release-whats-new)
- [Next.js 15 Release Blog](https://nextjs.org/blog/next-15)
- [@notionhq/client on npm](https://www.npmjs.com/package/@notionhq/client)
- [notion-to-md on npm](https://www.npmjs.com/package/notion-to-md)
- [Motion (Framer Motion) — motion.dev](https://motion.dev/)
- [GSAP vs Motion comparison — motion.dev](https://motion.dev/docs/gsap-vs-motion)
- [Lenis smooth scroll — GitHub](https://github.com/darkroomengineering/lenis)
- [Best React animation libraries 2026 — LogRocket](https://blog.logrocket.com/best-react-animation-libraries/)
- [Tailwind CSS v4 release — tailwindcss.com](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS v4 with Next.js install guide](https://tailwindcss.com/docs/guides/nextjs)
- [shadcn/ui changelog](https://ui.shadcn.com/docs/changelog)
- [next-themes GitHub](https://github.com/pacocoursey/next-themes)
- [Umami GitHub — v3.0.3](https://github.com/umami-software/umami)
- [Self-hosted Umami on Vercel + Supabase — HackerNoon](https://hackernoon.com/your-complete-guide-to-self-hosting-umami-analytics-with-vercel-and-supabase)
- [Self-hosted analytics at zero cost — Andrea Grandi](https://www.andreagrandi.it/posts/self-hosting-analytics-at-zero-cost/)
- [Neon free tier — Neon docs](https://neon.com/docs/introduction/plans)
- [Top PostgreSQL free tiers 2026 — Koyeb](https://www.koyeb.com/blog/top-postgresql-database-free-tiers-in-2026)
- [Vercel Pricing 2026](https://vercel.com/pricing)
- [Vercel free tier limits](https://vercel.com/docs/limits)
- [ISR with Next.js App Router](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [How to implement smooth scrolling in Next.js with Lenis and GSAP](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap)
- [Sonner toast — shadcn/ui](https://www.shadcn.io/ui/sonner)
- [react-notion-x App Router issues — GitHub](https://github.com/NotionX/react-notion-x/issues/536)
