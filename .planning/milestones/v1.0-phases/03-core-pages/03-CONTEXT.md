# Phase 3: Core Pages - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all six routes of the site to functional completion: `/` (homepage), `/about`, `/projects`, `/blog` (enhance listing), `/blog/[slug]` (enhance detail), `/links`. Plus OG images, sitemap, SEO metadata, mobile responsiveness, and consistent design tokens. No animations beyond basic CSS/Tailwind transitions — those come in Phase 4.

**Routes to build/enhance:**
1. `/` — Homepage with hero, scroll-driven narrative sections (about snapshot, featured work, writing teaser, contact CTA)
2. `/about` — Bio page with background, education (Georgetown), career (investing, NYC), skills as prose
3. `/projects` — Project cards with title, description, image, external links + case study deep-dive pages
4. `/blog` — Enhance with tag filtering (client-side), reading time display
5. `/blog/[slug]` — Enhance with reading time, better metadata
6. `/links` — Social links hub (email, Twitter/X, LinkedIn, newsletter)

**Also includes:**
- Dynamic OG images per page via @vercel/og
- Sitemap via `app/sitemap.ts`
- robots.txt and JSON-LD structured data
- Footer with social links
- Mobile responsive at 375px (iPhone SE)
- Consistent design tokens via Tailwind v4

</domain>

<decisions>
## Implementation Decisions

### Homepage Layout
- **D-01:** Scroll-driven narrative layout — hero section followed by full-viewport sections for about snapshot, featured work, writing teaser, and contact CTA. Aligns with Lenis smooth scroll (Phase 1) and HOME-02 requirement.
- **D-02:** Keep existing hero ("Hey, I'm Monty.") as base — enhance with profile photo, tagline, and CTA button per HOME-01.

### Navigation
- **D-03:** Fixed top navigation bar with site name left, nav links center/right, theme toggle right. Collapses to hamburger menu on mobile.
- **D-04:** Nav links: Home, Projects, Blog, About, Links. Highlight active route.

### Projects Presentation
- **D-05:** Card grid layout (2-3 columns on desktop, 1 on mobile). Each card shows title, description, thumbnail image, and external link.
- **D-06:** Project data sourced from a Notion database (same pattern as blog — reuse the Notion data layer from Phase 2).
- **D-07:** Case study pages at `/projects/[slug]` using Notion page content + NotionRenderer.

### Blog Enhancements
- **D-08:** Client-side tag filtering on `/blog` — no page reload. Tags rendered as clickable pills, active tag highlighted, "All" option to clear filter.
- **D-09:** Reading time calculated from word count (~200 wpm), displayed on both listing and detail pages.

### Links Page
- **D-10:** Vertical card list style (Linktree-inspired). Each link is a card with icon, label, and external URL. Mobile-first layout.
- **D-11:** Links: Email, Twitter/X, LinkedIn, GitHub, Newsletter signup CTA.

### About Page
- **D-12:** Prose narrative with section headings. Not a timeline (timeline is v2 per DSGN-V2-01). Sections: intro/background, education (Georgetown), career (investing, NYC), skills and interests.
- **D-13:** Content can be hardcoded initially — no Notion dependency needed for about page.

### OG Images
- **D-14:** Dynamic OG images via @vercel/og using Edge Runtime. Text-on-gradient design with site branding (name, page title). Different variants per page type (blog post shows title + date, project shows title + description).

### SEO & Meta
- **D-15:** `app/sitemap.ts` generating XML sitemap listing all public routes (static + dynamic blog/project slugs).
- **D-16:** `app/robots.ts` with standard allow-all + sitemap reference.
- **D-17:** JSON-LD Person structured data on homepage/about page.
- **D-18:** Per-page metadata via `generateMetadata` (already established in Phase 2 for blog).

### Footer
- **D-19:** Consistent footer across all pages with social links, copyright, and optional tagline. Same link set as the /links page.

### Design Tokens
- **D-20:** Use Tailwind v4 CSS variables for color tokens, spacing scale, and typography. Establish a consistent neutral palette that works in both light and dark mode.

### Claude's Discretion
- Exact spacing and sizing values within Tailwind's scale
- Component file organization (co-located vs centralized)
- Specific Tailwind color shades (as long as they're consistent and work in dark mode)
- Newsletter CTA implementation approach (form service vs mailto vs placeholder)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Artifacts
- `.planning/REQUIREMENTS.md` — Full requirement definitions (HOME-01 through SOC-05)
- `.planning/ROADMAP.md` §Phase 3 — Success criteria and risk notes
- `.planning/phases/01-foundation/01-01-SUMMARY.md` — Foundation patterns and provider architecture
- `.planning/phases/02-notion-cms-integration/02-01-SUMMARY.md` — Notion data layer, block renderer, image proxy patterns

### Project Context
- `.planning/PROJECT.md` — Core value, constraints, existing site context
- `.planning/research/FEATURES.md` — Feature research and patterns
- `.planning/research/ARCHITECTURE.md` — Architecture decisions
- `.planning/research/PITFALLS.md` — Known pitfalls to avoid

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/notion.ts` — Notion client with rate limiting, `getPublishedPosts()`, `getPostBySlug()`, `getBlocks()`. Reuse for projects database.
- `src/components/notion/notion-renderer.tsx` — 17-block-type renderer. Reuse for project case study pages.
- `src/components/theme-toggle.tsx` — Theme toggle button. Include in navigation.
- `src/components/providers/*` — Provider hierarchy already set up in layout.tsx.

### Established Patterns
- **Data fetching:** Server components with `async` functions calling Notion API. ISR via `export const revalidate = 1800`.
- **Styling:** Tailwind v4 utility classes, dark mode via `dark:` variant, `@tailwindcss/typography` prose class for content.
- **Dynamic routes:** `[slug]` pattern with `generateStaticParams()` and `generateMetadata()` (blog already does this).
- **Image handling:** Notion images via `/api/notion-image?blockId=X` proxy route.

### Integration Points
- `src/app/layout.tsx` — Add navigation component here (wraps all pages).
- `src/app/page.tsx` — Replace placeholder homepage with real content.
- `next.config.ts` — May need additional image remote patterns for project thumbnails.

</code_context>

<specifics>
## Specific Ideas

- Monty is in NYC, Georgetown background, investing career — about page should reflect this
- Current Super site has: Home, Projects, Passions, Principles/Beliefs, Highlights — the new site restructures this into a cleaner hierarchy
- Design should feel "cool" — even without Phase 4 animations, the layout and typography should be distinctive, not generic
- Newsletter CTA required at end of blog posts (SOC-05) — inline, not popup

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-core-pages*
*Context gathered: 2026-04-02*
