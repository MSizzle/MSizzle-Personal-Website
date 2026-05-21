# Phase 3: Core Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 03-core-pages
**Areas discussed:** Homepage layout, Navigation, Projects presentation, Blog enhancements, Links page, OG images, About page
**Mode:** Auto — all recommended defaults selected per user request

---

## Homepage Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Scroll-driven narrative | Full-viewport sections for about, work, writing, contact — aligns with Lenis | ✓ |
| Bento grid | Modular grid layout, trendy but harder to make responsive | |
| Single hero + cards | Minimal hero with card grid below — simpler but less distinctive | |

**User's choice:** Scroll-driven narrative (auto-selected recommended)
**Notes:** Aligns with existing Lenis smooth scroll scaffold and HOME-02 requirement for scroll-driven sections.

---

## Navigation Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed top nav | Standard nav bar, collapses to hamburger on mobile — already partially scaffolded | ✓ |
| Sidebar nav | Vertical sidebar, collapses to overlay on mobile — unusual for personal sites | |
| Hamburger-only | Hidden nav behind hamburger on all viewports — minimal but less discoverable | |

**User's choice:** Fixed top nav (auto-selected recommended)
**Notes:** Already partially exists in page.tsx header. Standard and accessible pattern.

---

## Projects Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Card grid | 2-3 column grid with image, title, description — standard portfolio pattern | ✓ |
| List layout | Vertical list with thumbnails — simpler, less visual impact | |
| Masonry grid | Pinterest-style irregular grid — visually interesting but complex | |

**User's choice:** Card grid (auto-selected recommended)
**Notes:** Works well with Phase 4 hover-reveal interactions (PORT-02).

---

## Blog Enhancements

| Option | Description | Selected |
|--------|-------------|----------|
| Client-side tag filtering | No page reload, instant filter — meets success criteria | ✓ |
| URL-based filtering | Filter via query params, supports sharing filtered views | |

**User's choice:** Client-side tag filtering (auto-selected recommended)
**Notes:** ROADMAP.md success criteria explicitly says "filters without page reload".

---

## Links Page Style

| Option | Description | Selected |
|--------|-------------|----------|
| Vertical card list | Linktree-inspired, mobile-first, proven pattern | ✓ |
| Icon grid | Grid of icon buttons — compact but less descriptive | |
| Creative layout | Unique/artistic arrangement — distinctive but harder to maintain | |

**User's choice:** Vertical card list (auto-selected recommended)
**Notes:** Proven pattern for social links pages, mobile-friendly.

---

## OG Image Design

| Option | Description | Selected |
|--------|-------------|----------|
| Text-on-gradient | Clean gradient background with page title and site branding | ✓ |
| Rich card with avatar | Photo + title + description — more visual but requires photo asset | |
| Minimal text only | Plain background with just the title — simplest but least branded | |

**User's choice:** Text-on-gradient with site branding (auto-selected recommended)
**Notes:** @vercel/og makes this straightforward. Consistent branding across all page types.

---

## About Page Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Prose narrative with sections | Natural flowing text with headings — matches ABOUT-01 "skills as prose" | ✓ |
| Timeline | Chronological career/education layout — explicitly deferred to v2 (DSGN-V2-01) | |
| Card-based sections | Each topic in a card — modular but can feel disconnected | |

**User's choice:** Prose narrative with section headings (auto-selected recommended)
**Notes:** ABOUT-01 explicitly says "skills as prose, not skill bars". Timeline is v2.

---

## Claude's Discretion

- Exact spacing, color shades, and sizing within Tailwind's scale
- Component file organization approach
- Newsletter CTA implementation details
- Footer exact layout and content

## Deferred Ideas

None — all discussion stayed within Phase 3 scope.
