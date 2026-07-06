# Phase 19: Project Cards & Covers Redesign - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning
**Source:** Live-site audit 2026-07-05 (full-page review of montysinger.com) + locked v3 design system. Decisions below were approved by Monty in conversation; treat as locked.

<domain>
## Phase Boundary

Fix the weakest visual surface on the site: project/essay card faces. Today the "Some of the work I am proudest of" homepage grid and the /projects grid render Notion covers that are logo wordmarks cropped mid-letter, one broken-image placeholder, and no visible titles. /writing cards are plain white boxes that carry none of the homepage's brutalist energy. All three opengraph-image.tsx routes still use an off-brand navy scheme (#1a1a2e/#0a0a0a) predating the vermilion identity.

This phase delivers: (1) a typographic title-card system as the default/fallback card face, (2) titles + deks on cards everywhere, (3) the offset-shadow brutalist treatment carried into interior grids, (4) reading time + one-line deks on /writing, (5) all OG images rebuilt in the same title-card style.

</domain>

<decisions>
## Implementation Decisions

### Title-card cover system
- Card faces for projects default to a GENERATED TYPOGRAPHIC TITLE-CARD rendered in JSX/CSS (not a generated image file): project title in Hanken Grotesk 800, mono kicker (e.g. year or category), on paper `#faf9f7` or ink `#17171a` field with vermilion `#e5411f` accent. Logo-lockup Notion covers crop badly and must no longer be the default card face for projects.
- Essays (/writing, homepage carousel) KEEP real Notion cover images when present; the title-card is the fallback when the cover is missing or fails to load. The current gray broken-image placeholder is retired everywhere.
- Variation between adjacent title-cards must be deterministic (e.g. alternate field color by index), never random at render time (SSG/ISR safety).

### Card content
- Homepage Work cards get a visible project title (and one-line dek if available). Bare cropped-logo tiles with no text are gone.
- /writing index cards get reading time and a one-line dek. Source the dek from the Notion post's excerpt/description property if one exists; otherwise fall back gracefully (omit the dek rather than fabricate text). Reading time computed from content length (a util may already exist from the blog detail page; reuse it).

### Grid treatment
- /writing and /projects card grids adopt the site's brutalist offset-solid treatment: hard offset solid shadow (as on the hero `h1.sig` card), radius 0, vermilion hover state (e.g. shadow or underline warms to vermilion). Match the homepage's energy so interior pages stop feeling like a different site.
- No gradients anywhere (site-wide rule). Depth via hard offset solids only.

### OG images
- Rebuild all three opengraph-image.tsx routes (root, blog/[slug], projects/[slug]) as vermilion/ink/paper title-cards using the same visual language: Hanken-style heavy title, mono kicker, offset solid block. The navy #1a1a2e scheme is retired. The old "OG images are the deferred gradient exception" note is void: no gradients in OG images either.

### Copy rules
- No em dashes in any user-visible string this phase introduces (deks, kickers, alt text). No "--" either; use colon, comma, or restructure.

### Claude's Discretion
- Exact title-card composition (kicker placement, field-color alternation pattern, title clamp/overflow behavior for long titles)
- Whether the title-card is one shared component or per-surface variants (shared preferred)
- Hover state details within the offset-solid + vermilion constraint
- How to detect "cover missing" vs "cover unusable" for essays (missing/error is enough; no image-content analysis)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design system
- `src/app/globals.css` (the `@theme` block is the only token source: paper/ink/vermilion, `--sig-weight: 800`, radius 0, offset-shadow pattern on `h1.sig`)
- `.planning/sketches/010-structured-bands-carousel/` (locked visual direction for v3)

### Surfaces being changed
- `src/components/home/section-work.tsx` (homepage Work grid, links to /projects since quick 260706-gbu)
- `src/components/v3/card.tsx` (essay/works grid card used by /writing and /projects)
- `src/app/writing/page.tsx`, `src/app/projects/page.tsx` (index pages, year-grouped grids)
- `src/app/opengraph-image.tsx`, `src/app/blog/[slug]/opengraph-image.tsx`, `src/app/projects/[slug]/opengraph-image.tsx` (off-brand navy, to be rebuilt)
- `src/components/notion/*` and `src/app/api/notion-cover/` (cover fetch/proxy pipeline; placeholder fallback behavior lives here)

### History
- Phase 17.3 artifacts (`.planning/phases/17.3-*/`) built the now-deleted /portfolio surface; its Featured-projects Notion query (`getFeaturedProjects`) still powers the homepage Work grid and remains in use.
- Quick task 260706-gbu deleted /portfolio (308 redirect to /projects) and removed dead components; do not resurrect anything from it.

</canonical_refs>

<specifics>
## Specific Ideas

- The audit's exact failure images: cards reading "MAHea Scann", "Goalter", "Insider Tra", "Web C" (logos cropped mid-word), one gray broken-image card on the homepage, one empty gray cell on /projects. Any of these still rendering after this phase means the phase failed.
- Title-card aesthetic anchor: the hero "Create Order" block (solid vermilion field, Hanken 800, hard 12px offset shadow) is the DNA the cards should inherit at smaller scale.
- OG images are a first-impression surface on X/LinkedIn: title + "Monty Singer" or "montysinger.com" mark, kicker for the content type (Essay / Project).

</specifics>

<deferred>
## Deferred Ideas

- Real per-project cover art / screenshots (content work, Monty's side; title-cards are the durable default until then)
- /now page, /colophon, Umami live-data touches (separate site-vitality phase)
- About page rebuild (blocked on Monty's copy)
- Essay cover image quality upgrades (the upscaled quokka)

</deferred>

---

*Phase: 19-project-cards-covers-redesign*
*Context gathered: 2026-07-06 from live-site audit + conversation approvals*
