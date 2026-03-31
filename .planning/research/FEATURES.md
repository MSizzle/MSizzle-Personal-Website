# Feature Research

**Domain:** Personal website/portfolio
**Researched:** 2026-03-31
**Confidence:** HIGH (table stakes, anti-features), MEDIUM (differentiators — taste-dependent)

---

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| About/bio page | Visitors need to orient — who is this person? | Low | Short, punchy. Not a full resume wall of text. |
| Work/project showcase | "What have you done?" is the first real question | Medium | Cards or case-study format; context > bullet lists |
| Contact vector | Every visitor needs a way to reach out | Low | Single CTA is enough — email or LinkedIn link |
| Mobile responsive layout | 60%+ traffic is mobile; broken mobile = ignored | Medium | Design mobile-first, not mobile-last |
| Fast load times | Sub-2s expected; slow = bounce before impression | Medium | Static generation (Next.js + ISR) handles this |
| Readable typography | Long-form content lives or dies on type choices | Low | One serif + one sans pairing goes a long way |
| Dark mode | Expected by 2025 — absence is noticed | Low | CSS variables + `prefers-color-scheme` + manual toggle |
| Custom domain | `montysinger.com` signals seriousness vs. `.vercel.app` | Low | Already owned — just DNS config |
| Social/link hub | Centralizes all presence; replaces Linktree | Low | Should be on every page, not buried |
| SEO basics | Name must be Googleable — it's a credibility signal | Low | `og:` tags, sitemap, structured data for Person schema |

---

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Scroll-driven narrative homepage | Transforms a static about page into an experience; visitors feel pulled through the story | High | GSAP ScrollTrigger or Framer Motion `useScroll`. Pin sections, parallax text reveals, staggered entrances. The "wow" that makes people send the link to friends. |
| Bento grid / mosaic layout | Breaks the top-to-bottom column that every template uses; creates visual hierarchy that rewards exploration | Medium | CSS Grid with intentional asymmetry. Each cell has a distinct micro-interaction. |
| Cursor/pointer effects | Subtle custom cursor (e.g., a trailing blob, magnetic hover on nav links) signals craft without being obnoxious | Medium | Canvas or CSS `mix-blend-mode`. Must be desktop-only — never break mobile tap targets. |
| Page transitions | Makes the site feel like an app, not a document; reinforces premium quality | Medium | Framer Motion `AnimatePresence` or View Transitions API (native, ~95% support by 2026). |
| Visitor analytics dashboard (private) | Actual data on who reads what — which projects/posts get traction, where traffic comes from, what devices | Medium | Self-hosted Umami on Railway free tier or Vercel Postgres. Gives real signal for what to write more of. |
| Real-time visitor count (public "live" widget) | Subtle social proof — "2 people reading now" on a post feels alive | Low | Umami live API or Vercel Edge KV. Optional — use only if numbers are real. |
| Writing section with genuine POV | Blog content with an investing/markets/ideas angle differentiates from generic "I made a React app" portfolios | Low (content) / Medium (UI) | Long-form cards with estimated read time, publish date, tag filtering. Notion CMS makes publishing frictionless. |
| Ambient background effects | Gradient mesh, noise texture, or subtle particle field sets a visual tone without competing with content | Medium | CSS `@property` animated gradients or Three.js r3f fog — keep it tasteful, not 2011 Flash site. |
| Typed/kinetic text headline | Animated intro text ("Investor. Builder. etc.") creates immediate persona without needing a wall of bio | Low | `react-type-animation` or a simple CSS keyframe typewriter. One use only — overuse kills it. |
| "Now" page | Transparent, low-friction signal of current focus — very popular in the indie-maker/VC-adjacent community | Low | Single markdown page: what I'm reading, working on, thinking about. Updated monthly. |
| Hover-reveal project detail | Mousing over a project card reveals a teaser (screenshot, stack, outcome) without a full page load | Medium | CSS clip-path reveal or Framer Motion layout animations. Keeps the grid clean while rewarding exploration. |
| Notion-powered blog with proper styling | Notion's default export is ugly. A custom renderer makes writing look intentional. | High | `notion-to-md` or `react-notion-x` with custom components for callouts, code blocks, embeds, etc. This is the single biggest quality delta vs. Super. |
| Micro-interactions on UI elements | Button press feedback, link hover animations, card tilts — the 1% details that add up to a 10% feel premium | Medium | CSS transforms + Framer Motion. Apply consistently. |
| Geographic visitor map (analytics) | Seeing "someone in Singapore read my piece on rate cycles" is genuinely useful AND shareable as a screenshot | Medium | Umami geo data + a small D3 or Leaflet map on the analytics dashboard. |
| Smooth scroll with momentum | Lenis or native smooth scroll — the "butter" effect that makes the site feel expensive | Low | Lenis is trivial to add; pairs perfectly with GSAP ScrollTrigger. |
| Theme that reflects personal brand | Not just light/dark — a color palette and typographic system that is distinctly Monty's, not a Vercel or Tailwind starter | Low (decision) / Medium (execution) | Pick 1 accent color, 2 fonts, stick to it. NYC finance + Georgetown = understated confidence, not neon. |

---

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full-screen video/reel background | "Cinematic, impressive" | Kills load time, auto-play blocked on mobile, distracts from content, often ages badly within 6 months | Ambient gradient or a single high-quality still image with subtle motion overlay |
| Interactive 3D globe showing connections | "Looks technical and impressive" | 3+ MB WebGL bundle, GPU-intensive on low-end devices, says nothing specific about you, widely overused after being popularized by one viral portfolio | A bento cell with a clean static map image with hover tooltips |
| Overbuilt contact form | "Easier than sharing email" | Requires serverless function, spam filtering, and ongoing maintenance. Most people just send the form to `/dev/null` mentally | Mailto link styled as a CTA button, or a Calendly embed for meeting requests |
| Real-time chatbot/"Ask me anything" | "Engaging and novel" | LLM API costs, rate limits, hallucinations about your bio, weird conversations with bots/scrapers, ongoing prompt maintenance | A well-written FAQ section or a curated Q&A in the About page |
| Skill bar charts (% proficiency) | "Shows breadth" | Nobody knows what 87% proficiency in Excel means. Actively signals junior thinking. Looks like a 2015 resume template. | Named skill clusters in prose, or project-based evidence ("built X using Y") |
| Heavy particle/canvas background on every page | "Adds life" | CPU drain, accessibility issues, competes with every piece of content on the page | One tasteful ambient effect on the hero — clean backgrounds everywhere else |
| Visitor counter (public raw number) | "Social proof" | If numbers are low, it actively undermines credibility. If numbers are high, people don't believe it. | Real-time "X reading now" (only live, not cumulative) or no public counter at all |
| Dark/light mode animated logo swap | "Polished detail" | High dev time, tiny user impact, breaks easily during refactors | Single logo that works on both themes via `currentColor` SVG |
| Newsletter with MailChimp/Beehiiv pop-up | "Grow an audience" | Exit-intent pop-ups destroy UX. Unearned email capture before the reader has read anything is obnoxious. | Inline subscribe CTA at the bottom of each post, after the reader has already seen the value |
| Auto-playing music/sound | "Sets a vibe" | Universally hated. Violates browser defaults. Signals bad judgment. | If audio is relevant (e.g., podcast), make it an explicit play button — never auto-play |

---

## Feature Dependencies

```
Notion CMS
  └── Blog/writing section (react-notion-x renders Notion blocks)
  └── Projects content (titles, descriptions, links come from Notion)
  └── ISR/webhook revalidation (site rebuilds when Notion changes)

Analytics (Umami)
  └── Needs a Postgres database (Vercel Postgres or Railway free tier)
  └── Real-time widget depends on Umami live API being enabled
  └── Geo map depends on Umami geo tracking (enable in config)

Scroll animations (GSAP / Framer Motion)
  └── Depends on Lenis smooth scroll being initialized first (scroll position sync)
  └── Page transitions (AnimatePresence) must wrap layout, not individual pages

Dark mode
  └── CSS custom properties must be the single source of truth — no hardcoded colors
  └── All images/SVGs need dark-mode variants or use currentColor

Static generation (Next.js)
  └── Notion content fetched at build time + ISR for updates
  └── Analytics dashboard is a separate route (can be dynamic/client-only)
```

---

## MVP Definition

### Launch With (v1)

These are the minimum features that make the site worth having over the existing Super site.

- **Homepage** — scroll-driven narrative with animated sections (hero, about snapshot, featured work, writing teaser, contact CTA)
- **About/Resume page** — bio, experience timeline, Georgetown + NYC context, skills in prose form
- **Projects page** — 3–5 cards with hover-reveal, linking to case studies or external work
- **Blog/Writing** — Notion CMS-powered, readable typography, tag filtering, estimated read time
- **Analytics (private)** — Umami self-hosted: page views, traffic sources, real-time visitors, device breakdown
- **Dark mode** — system-aware + manual toggle
- **Core animations** — page transitions, scroll reveals, Lenis smooth scroll
- **SEO** — `og:` tags, sitemap, Person structured data, `robots.txt`
- **Mobile responsive** — tested on iPhone SE (smallest real viewport) and 375px width
- **Social links** — footer + dedicated Links/Connect page
- **Custom domain** — `montysinger.com` pointed to Vercel

### Add After Validation (v1.x)

These add signal value but require real visitor data to prioritize correctly.

- **"Now" page** — add once there's a publishing rhythm
- **Newsletter subscribe** — inline CTA at post end, only after writing section gets traction
- **Real-time visitor widget** — enable after traffic is non-trivial (>50 daily)
- **Geo analytics map** — visual layer on top of Umami geo data
- **Case study deep-dives** — full project pages once you know which projects get click-through
- **Bento grid redesign** — potential homepage v2 if scroll narrative feels stale
- **Search** — blog search using Pagefind (static, zero cost) once post count exceeds ~20
- **RSS feed** — for readers who use feed readers; auto-generated from blog posts

### Future Consideration (v2+)

Lower priority — revisit at 6 months with real data.

- **Public analytics page** — share a read-only Umami dashboard (some indie makers do this for transparency)
- **Ambient interactive background** — Three.js or Canvas experiment; only if it serves the brand by then
- **Speaking/appearances section** — relevant if Monty starts doing panels, podcasts, etc.
- **Reading list / Book notes** — could pull from Notion reading database; strong signal of intellectual depth
- **Investment thesis / writing behind a soft wall** — if content becomes a credibility differentiator

---

## Feature Prioritization Matrix

Axes: **Impact** (how much it moves the "memorable + credible" needle) vs. **Effort** (dev time + ongoing maintenance)

```
HIGH IMPACT / LOW EFFORT  → Do first (v1)
─────────────────────────────────────────────────────────────────
• Lenis smooth scroll           (2 hours, massive feel improvement)
• Dark mode via CSS variables   (4 hours, expected by visitors)
• og: / SEO meta tags           (2 hours, permanent credibility)
• Inline newsletter CTA         (1 hour, zero backend)
• "Now" page                    (1 hour content, 30min dev)
• Social links hub              (1 hour)
• Typewriter/kinetic headline   (2 hours)


HIGH IMPACT / HIGH EFFORT  → Core investments (v1, plan carefully)
─────────────────────────────────────────────────────────────────
• Scroll-driven homepage narrative     (GSAP + design = 2–3 days)
• Notion CMS blog with custom renderer (react-notion-x tuning = 2 days)
• Umami analytics self-hosted          (1 day setup, Postgres provisioning)
• Page transitions (AnimatePresence)   (1 day — affects every route)
• Project cards with hover reveal      (1 day)
• Custom typography + color system     (1 day — pays dividends everywhere)


LOW IMPACT / LOW EFFORT  → Nice to have, add opportunistically
─────────────────────────────────────────────────────────────────
• RSS feed                    (auto-generated, 1 hour)
• robots.txt / sitemap        (Next.js plugin, 30 min)
• Estimated read time on posts (npm package, 30 min)


LOW IMPACT / HIGH EFFORT  → Avoid or defer to v2+
─────────────────────────────────────────────────────────────────
• Chatbot / "Ask Monty AI"     (API cost + maintenance + weird UX)
• 3D globe / WebGL experiments (bundle weight + low signal)
• Full contact form            (serverless + spam = not worth it)
• Heavy video backgrounds      (load cost > wow factor)
```

---

## Key Design Principles for This Specific Site

Based on the profile (NYC, Georgetown, investing background, learning builder), the tone to aim for:

**Understated confidence.** Not loud. Not neon. Not trying too hard. Think: the aesthetic of a well-designed pitch deck from a Tier 1 fund, not a creative agency portfolio. Dark mode should lean charcoal/slate, not pure black. Accent color should be one bold choice held in reserve.

**Substance > spectacle.** The animations serve the content, not the other way around. Every interactive element should either reveal information or create momentum — not exist as decoration. This is what separates "cool" from "gimmicky."

**Genuine writing wins.** In a world where everyone has a portfolio, the thing that actually builds credibility in the investing/finance-adjacent world is published thinking. The blog should be a first-class citizen, not an afterthought.

**Reference points (sites that nail the vibe):**
- Rauno Figueiredo (rauno.me) — motion craft, minimal, every detail considered
- Paco Courty (pacocourty.com) — bento grid, personality through layout
- Anthony Fu (antfu.me) — clean writing-first, strong identity
- Vercel's own design language — product of theirs that "looks expensive" as a reference for dark mode palette
- Linear's marketing site — the gold standard for "smooth scroll + scroll-triggered reveals done right"

---

## Sources

*This research synthesizes patterns observed across the indie maker, developer portfolio, and design community as of early 2026. Specific reference points:*

- Awwwards / Siteinspire portfolio category winners, 2024–2025
- Buildspace / Luma / YC founders' personal sites as a peer cohort reference
- Web Almanac 2024 (HTTP Archive) — mobile traffic share, performance budgets
- GSAP ScrollTrigger and Framer Motion documentation patterns
- Umami Analytics documentation — self-hosting on Vercel/Railway
- react-notion-x and notion-to-md GitHub issues — common CMS pitfalls
- Next.js App Router + ISR documentation — revalidation patterns for CMS-driven sites
- Community discussion: "personal site that feels alive" — Hacker News "Show HN" threads, 2024–2025
- Linear, Vercel, Liveblocks marketing sites — reference implementations for scroll animation UX
