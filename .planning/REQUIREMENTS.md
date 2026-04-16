# Requirements: MSizzle Personal Website

**Defined:** 2026-03-31
**Core Value:** A personal site that feels alive and memorable — not another template blog — while giving Monty real data about who's visiting and what resonates.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Homepage

- [x] **HOME-01**: Hero section with profile photo, name, tagline, and CTA
- [x] **HOME-02**: Scroll-driven narrative sections (about snapshot, featured work, writing teaser, contact CTA)
- [x] **HOME-03**: GSAP scroll-triggered animations and parallax effects
- [x] **HOME-04**: Lenis smooth scrolling across the entire site

### Portfolio

- [x] **PORT-01**: Project cards with title, description, image, and external links
- [x] **PORT-02**: Hover-reveal interactions on project cards
- [x] **PORT-03**: Case study deep-dive pages with rich media for key projects

### Blog

- [ ] **BLOG-01**: Blog posts powered by Notion CMS with custom rendering
- [ ] **BLOG-02**: Readable typography using @tailwindcss/typography
- [x] **BLOG-03**: Estimated reading time displayed on each post
- [x] **BLOG-04**: Tag/category filtering on blog listing page
- [ ] **BLOG-05**: Rich Notion block rendering (callouts, toggles, code blocks, embeds)

### About

- [x] **ABOUT-01**: Bio page with background, education (Georgetown), career (investing, NYC), skills as prose

### Analytics

- [x] **ANLY-01**: Self-hosted Umami analytics with private dashboard
- [x] **ANLY-02**: Real-time visitor tracking
- [x] **ANLY-03**: Traffic source tracking (referrers, UTM, direct)
- [x] **ANLY-04**: Page popularity tracking (views per page/post)
- [x] **ANLY-05**: Geographic and device/browser breakdown
- [x] **ANLY-06**: Geo map visualization of visitor locations

### Design System

- [ ] **DSGN-01**: Dark/light mode with system detection + manual toggle, no FOUC
- [x] **DSGN-02**: Mobile responsive design tested at 375px / iPhone SE
- [x] **DSGN-03**: Animated page transitions between routes
- [x] **DSGN-04**: Scroll reveal animations (elements animate in on scroll)
- [x] **DSGN-05**: Consistent design tokens (colors, spacing, typography) via Tailwind v4
- [ ] **DSGN-06**: Custom domain pointed to Vercel

### Social & SEO

- [x] **SOC-01**: Social links hub in footer + dedicated /links page
- [x] **SOC-02**: OG meta tags with dynamic OG images per page
- [x] **SOC-03**: Auto-generated sitemap via app/sitemap.ts
- [x] **SOC-04**: robots.txt and Person structured data (JSON-LD)
- [x] **SOC-05**: Newsletter subscribe CTA (inline at end of blog posts)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Design Enhancements

- **DSGN-V2-01**: Interactive timeline on about page
- **DSGN-V2-02**: Ambient/interactive canvas background (Three.js)
- **DSGN-V2-03**: Bento grid homepage redesign (if scroll narrative feels stale)
- **DSGN-V2-04**: Cursor effects and custom cursor

### Content

- **CONT-V2-01**: "Now" page (once publishing rhythm established)
- **CONT-V2-02**: Reading list pulled from Notion
- **CONT-V2-03**: Speaking/appearances section

### Analytics

- **ANLY-V2-01**: Public read-only analytics page
- **ANLY-V2-02**: Real-time reader count widget on blog posts

### Social

- **SOC-V2-01**: RSS feed (auto-generated)
- **SOC-V2-02**: Blog search via Pagefind (once post count > 20)
- **SOC-V2-03**: Downloadable PDF resume

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Full-screen video backgrounds | Huge load cost, mobile auto-play issues |
| Interactive 3D globe | 3+ MB WebGL, widely overused, doesn't serve the brand |
| Overbuilt contact form | Serverless + spam filtering not worth it for personal site — email link is sufficient |
| AI chatbot | API costs, hallucination risk, ongoing maintenance |
| Skill bar charts | "87% Excel" signals junior thinking — skills in prose instead |
| User accounts / authentication | Public-facing site only |
| E-commerce / payments | Personal site, not a store |
| Pop-up newsletter capture | Annoying before reader has seen value — inline CTA only |

## Traceability

<!-- Reconciled 2026-04-15 as Phase 6 plan 06-01 Task 1. Status reflects pre-UAT shipped state; 06-UAT.md re-stamps each row as pass | fail | skipped | blocked. DSGN-06 is `complete` per D-15 (montysinger.com live via Namecheap→Vercel, Super disconnected). -->

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-01 | Phase 3, Core Pages | complete |
| HOME-02 | Phase 3, Core Pages | complete |
| HOME-03 | Phase 4, Animation & Polish | complete |
| HOME-04 | Phase 1 (scaffold) / Phase 4 (full integration) | complete |
| PORT-01 | Phase 3, Core Pages | complete |
| PORT-02 | Phase 4, Animation & Polish | complete |
| PORT-03 | Phase 3, Core Pages | complete |
| BLOG-01 | Phase 2, Notion CMS Integration | complete |
| BLOG-02 | Phase 2, Notion CMS Integration | complete |
| BLOG-03 | Phase 3, Core Pages | complete |
| BLOG-04 | Phase 3, Core Pages | complete |
| BLOG-05 | Phase 2, Notion CMS Integration | complete |
| ABOUT-01 | Phase 3, Core Pages | complete |
| ANLY-01 | Phase 5, Analytics | complete |
| ANLY-02 | Phase 5, Analytics | complete |
| ANLY-03 | Phase 5, Analytics | complete |
| ANLY-04 | Phase 5, Analytics | complete |
| ANLY-05 | Phase 5, Analytics | complete |
| ANLY-06 | Phase 5, Analytics | complete |
| DSGN-01 | Phase 1, Foundation | complete |
| DSGN-02 | Phase 3, Core Pages | complete |
| DSGN-03 | Phase 4, Animation & Polish | complete |
| DSGN-04 | Phase 4, Animation & Polish | complete |
| DSGN-05 | Phase 3, Core Pages | complete |
| DSGN-06 | Phase 1, Foundation | complete |
| SOC-01 | Phase 3, Core Pages | complete |
| SOC-02 | Phase 3, Core Pages | complete |
| SOC-03 | Phase 3, Core Pages | complete |
| SOC-04 | Phase 3, Core Pages | complete |
| SOC-05 | Phase 3, Core Pages | complete |

---
*Requirements defined: 2026-03-31*
