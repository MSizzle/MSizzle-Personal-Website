# Phase 12: Sub-page Restyle Sweep — Research

**Researched:** 2026-05-21
**Domain:** UI redesign (palette + typography swap on 6 sub-pages + /newsletter structural redesign)
**Confidence:** HIGH

## Summary

Phase 12 applies the v2.0 warm-paper editorial design language (Phase 9 tokens + Phase 11 layout patterns) to six sub-pages that escaped the Phase 10/11 sweep. The phase is **tightly scoped** — no layout changes, no new tokens, no component additions — with one exception: `/newsletter` is permitted a structural redesign per D-NEWSLETTER-REDESIGN operator feedback.

Current state: all 6 routes use v1.0 vocabulary (`rounded-lg`, `shadow-*`, `bg-[var(--bg)]`, `text-[var(--accent)]`, scaled text with weight overrides). The restyle recipe lands first as Plan 12-01, then 6 per-route plans follow in Wave 2, each touching only its own files. `/newsletter` is the heaviest lift due to the carousel → grid redesign.

**Primary recommendation:** Restyle recipe lands as a **markdown document** (12-RECIPE.md) that subsequent plans cite and verify against. This decouples recipe authorship from route-specific implementation and provides a single source of truth for token mappings planner and each route team reference.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01 — Restyle Recipe lands first.** Recipe plan ships before all route plans. Non-negotiable per ROADMAP risk note.
- **D-02 — Use Phase 9 tokens, period.** No new tokens. Arbitrary values forbidden unless flagged as explicit gap.
- **D-03 — v1.0 vocabulary to delete on every route:** `rounded-*`, `shadow-*`, `bg-[var(--bg)]`, `border-[var(--border)]`, `text-[var(--accent)]`, `bg-gradient-*`, `backdrop-blur-*`, `hover:scale-*`, `font-bold` on body text.
- **D-04 — Preserve URL structure.** No href changes.
- **D-05 — v1.0 chrome (Nav + Footer + MainOffset) stays visible on all 6 routes.** Out of scope per D-26 chrome gate (only /, /writing, /events, /photos suppress chrome).
- **D-06 — Breadcrumbs preserved.** `/about` and `/newsletter` use `<Breadcrumbs>`; component stays; if visual alignment needed, recipe handles it.
- **D-07 — Photo treatment matches Phase 10/11.** `saturate-[0.92]` filter on any photos.
- **D-08 — Inter is the font.** No Helvetica Neue swap. Already wired via Phase 9.
- **D-NEWSLETTER-REDESIGN — `/newsletter` gets structural redesign.** Operator feedback (2026-05-21): "Issues should feel **full**, larger, take up more of the page." Breaks issue gallery out of 66ch reading column, replaces carousel with multi-row grid, adopts Phase 9 editorial tokens.

### Claude's Discretion
- **Plan slicing.** Planner decides: one plan per route (7 plans total) or grouped (e.g., 4 plans for prose-heavy pages). Per-route recommended for isolation.
- **Recipe format.** Markdown document (12-RECIPE.md) OR small component wrapper. Markdown recommended for extensibility and planner flexibility.
- **Wave structure.** Recipe in Wave 1, then all per-route plans in parallel Wave 2 (files disjoint). `/newsletter` may need own wave if research/sketching overhead high.

### Deferred Ideas
- Dark-mode editorial palette (Phase 13 GO/NO-GO decision)
- /blog → /writing redirect or merge
- OG image redesign
- Header/footer restyle

---

## Current Visual State Inventory

### v1.0 Vocabulary Per Route

| Route | File | v1.0 Classes Found | Notes |
|-------|------|-------------------|-------|
| `/about` | `src/app/about/page.tsx` | `text-sm font-normal uppercase tracking-widest` (h1), `.prose` | Simple prose page; breadcrumbs present but styled inline as `sr-only` semantic HTML (no visual restyle needed) |
| `/projects` | `src/app/projects/page.tsx` | `text-sm font-normal uppercase tracking-widest` (h1) on index | Uses `ProjectCard` which has `border-b border-[var(--border)]` + `hover:opacity-60` |
| `/projects/[slug]` | `src/app/projects/[slug]/page.tsx` | `rounded-lg` on hero image, `text-2xl sm:text-3xl` (h1), `.prose` | Hero image has `rounded-lg` wrapper; Notion blocks render via `.prose` |
| `/blog` | `src/app/blog/page.tsx` | `text-sm font-normal uppercase tracking-widest` (h1), `max-w-3xl` container | Tag filter component lives here (preserved structurally); ScrollReveal animations present |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | `text-2xl sm:text-3xl` (h1), `.prose`, `NewsletterCta` + `RelatedEssays` components | Post body renders via `.prose`; footer has newsletter CTA + related essays |
| `/links` | `src/app/links/page.tsx` | `text-sm font-normal uppercase tracking-widest` (h1), `text-3xl sm:text-lg` links | Link list uses large text on mobile, scaled down on desktop; `hover:opacity-60` transitions |
| `/prometheus` | `src/app/prometheus/page.tsx` | `text-2xl sm:text-3xl` (h1), `text-sm uppercase tracking-widest` (subtitle), `.prose` with `<ul>` + FAQ data | Prose-heavy FAQ page; static FAQS array rendered via list semantics |
| `/newsletter` | `src/app/newsletter/page.tsx` | `text-2xl sm:text-3xl` (h1), `text-sm uppercase tracking-widest` (section label), `rounded-lg shadow-md` on Subscribe button, `NewsletterCarousel` component | **HEAVIEST:** Carousel has `rounded-lg`, `border`, `shadow-sm`, `bg-[var(--bg)]`, `hover:shadow-md`, `group-hover:scale-105` |

### Specific Touchpoints to Restyle

**All routes:**
- h1: `text-2xl font-normal tracking-tight sm:text-3xl` → `text-section-feature text-ink uppercase` (28px, bold, tracked — per recipe decision)
- Section labels: `text-sm font-normal uppercase tracking-widest` → `text-label uppercase text-muted` (11px, tracked)
- `.prose` blocks: keep prose plugin, but add `prose-headings:text-ink prose-p:text-ink prose-strong:text-ink` overrides (see `.prose` pattern below)
- Body links: `underline transition-opacity hover:opacity-60` → keep this pattern; replace any `text-[var(--accent)]` with `text-ink`

**Route-specific:**
- `/projects/[slug]` hero image: `rounded-lg bg-[var(--muted)]` → `bg-paper` (no rounded)
- `/newsletter` carousel: delete or repurpose; replace with grid (`grid grid-cols-2 md:grid-cols-3 gap-4` or similar)
- `/newsletter` Subscribe button: `rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-white` → `border border-ink px-7 py-3 text-label uppercase` (flat, matching /writing Substack footer button at line 167)

---

## Restyle Recipe Shape — Recommendation

**Recommendation: Markdown document** (`12-RECIPE.md`) that subsequent plans cite via `@context`.

### Why Markdown over Component Wrapper

| Approach | Pros | Cons |
|----------|------|------|
| **Markdown (RECOMMENDED)** | Single source of truth; planner can reference line numbers; easy to extend with per-route notes; no code coupling; auditable git diff | Requires planner discipline to follow; no runtime validation |
| **Component wrapper (`<EditorialPage>`)** | Runtime validation; auto-applied styles; less manual work per route | Creates new component dependency; tightly couples UI logic to recipe; harder to customize per route |
| **Tailwind `@layer` component blocks** | DRY for repeated patterns | Hard to document context; unclear scoping; mixes recipe definition with implementation |

**Implementation:** Recipe markdown includes:
1. Token mapping table (v1.0 class → v2.0 token)
2. Per-route decisions (h1 size: `text-section-feature` or `text-page-title`?)
3. `.prose` override pattern (exact class string)
4. Validation gates (rg patterns each plan uses to verify completeness)
5. Special cases (breadcrumbs, `/newsletter` grid spec)

---

## `.prose` Token Override Pattern

**Status:** `@tailwindcss/typography@^0.5.19` is installed and configured in Tailwind v4.

**Current state** (from `src/app/globals.css` lines 118–150):
```css
.prose {
  --tw-prose-body: var(--fg);
  --tw-prose-headings: var(--fg);
  --tw-prose-links: var(--fg);
  /* ... all set to var(--fg) which is #0E0E0C (v2.0 ink) */
}

.prose h2 {
  font-weight: 400;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 0.05em;
  margin-top: 3rem;
}

.prose h3 {
  font-weight: 400;
  font-size: 1rem;
}

.prose code {
  background: rgba(45, 23, 36, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.125rem;
  font-weight: 400;
}
```

**Issue:** h2 and h3 still have `border-radius: 0.125rem` on code blocks (v1.0 legacy). Also, h2/h3 use hardcoded `1rem` instead of tied to Phase 9 type scale.

**Recipe solution:** No additional prose overrides needed — the existing rules already paint headings/body/links with `var(--fg)` (which is `#0E0E0C` ink). Per-route prose blocks (`/about`, `/blog/[slug]`, `/prometheus`, `/projects/[slug]`) should already render correctly. Verify via manual smoke test on dev server.

**Validation:** Each route plan checks `rg "prose" src/app/<route>/` returns ≥1 hit (prose block exists and renders).

---

## /newsletter Redesign Specifics

### Current State

- `fetchMontyMonthlyIssues(10)` returns array of 10 `MontyMonthlyIssue` objects:
  ```typescript
  {
    title: string         // "Issue #42: Building in the Void"
    link: string          // "https://montymonthly.substack.com/p/42-..."
    pubDate: string       // RFC822 date from RSS
    thumbnail: string | null  // extracted from RSS enclosure or img tag
  }
  ```
  [VERIFIED: src/lib/rss/substack.ts lines 30–48]

- `<NewsletterCarousel>` renders as horizontal-scroll carousel with arrow buttons (`scrollBy(-400)` / `scrollBy(400)`), snap-scrolling, `w-80 sm:w-96` card width (320px mobile, 384px desktop).

- Card chrome: `rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-sm` + `hover:shadow-md hover:border-[var(--accent)] group-hover:scale-105` (line 43).

### Operator Feedback (D-NEWSLETTER-REDESIGN)

> "The issues should be larger, take up more of the page. Make it feel **full** of all the different Monty Monthlys."

- Intro + Subscribe CTA stay in `max-w-[66ch]` reading column.
- Issue gallery **breaks out to full width** (like /writing at `md:px-40`).
- Replace carousel with **multi-row grid showing all issues at once** (no scroll arrows).
- **Bigger thumbnails** for "poster feel" — recipe recommends grid at 2-col mobile / 3-col desktop, each card ~200px wide on mobile / ~300px on desktop.
- **Consider bumping limit from 10 → 20 or higher** once grid absorbs it.

### Proposed Grid Layout

**Mobile (390px):** 2 columns, gap-4, each card `aspect-[4/5]` (portrait-ish, feels "full")
**Desktop (1440px):** 3 columns, gap-6, each card `aspect-[16/9]` (wider landscape, shows more at once)

**Card structure:**
```tsx
<a href={issue.link} className="group block bg-paper border border-rule">
  <div className="relative aspect-[4/5] md:aspect-[16/9] overflow-hidden bg-muted">
    <Image src={issue.thumbnail} ... className="object-cover" />
  </div>
  <div className="p-4">
    <h3 className="text-list-title text-ink">{issue.title}</h3>
    <time className="text-meta uppercase text-muted">{formatted date}</time>
  </div>
</a>
```

**Implementation note:** No client-side scrolling needed; page `scroll-smooth` via Lenis; delete `NewsletterCarousel` component entirely in favor of server-rendered grid in `/newsletter` page component.

**Substack CTA button:** Matches `/writing` footer button (line 167 of `src/app/writing/page.tsx`):
```tsx
<a href="https://montymonthly.substack.com"
   className="inline-block border border-ink px-7 py-3 text-label uppercase"
```

---

## Plan Slicing Recommendation

**Recommendation: 7 plans (recipe + 6 routes), shipped in 2 waves, with `/newsletter` potentially isolated in Wave 2b.**

| Plan | Route | Complexity | Recommendation |
|------|-------|------------|-----------------|
| **12-01 (Wave 1)** | Recipe | Medium | Markdown document (`12-RECIPE.md`); establishes token mapping, validation gates, per-route decisions. **Must ship first.** |
| **12-02 (Wave 2)** | `/about` | Low | Prose page; no structure changes; restyle to tokens per recipe. ~30 min. |
| **12-03 (Wave 2)** | `/projects` + `/projects/[slug]` | Low-Medium | Index uses ProjectCard (drop `border-[var(--border)]` → `border-rule`); [slug] drops `rounded-lg` on hero. ~45 min. |
| **12-04 (Wave 2)** | `/blog` + `/blog/[slug]` | Medium | Index page simplest; [slug] has `.prose` + `NewsletterCta` + `RelatedEssays` — ensure prose overrides render cleanly. ~1 hour. |
| **12-05 (Wave 2)** | `/links` | Low | Simple link list; swap large text to type scale roles if needed. ~20 min. |
| **12-06 (Wave 2)** | `/prometheus` | Medium | Prose-heavy FAQ page; `.prose` overrides are the lever. ~45 min. |
| **12-07 (Wave 2b — optional isolation)** | `/newsletter` | HIGH | Carousel deletion + grid implementation + section layout change. Structural work beyond pure restyle. **Consider isolated wave if planning/research overhead high.** ~2 hours. |

**Why per-route plans:** Each route's files are disjoint (no shared state, imports clean per route). Parallelism is safe. Error isolation is clear — if `/blog` breaks, it doesn't affect `/links`.

**Why `/newsletter` might be Wave 2b:** It's not a pure restyle; it's a structural redesign. If the recipe takes 1 hour and all 5 simple routes take 3 hours, `/newsletter` can ship in Wave 3 without blocking. Or group it into Wave 2 if execution confidence is high and grid spec is unambiguous.

---

## Validation Gate Inventory

Each restyle plan must verify completion using `rg` patterns. The recipe markdown should list these gates per route for planner reference.

### Recipe Plan (12-01) Verification
- `rg "@theme inline" src/app/globals.css` → 1+ hits (tokens defined)
- `rg "bg-paper\|text-ink\|border-rule" src/` → should see usage in existing Phase 10/11 pages (/writing, /events)
- `npm run build` exits 0

### Per-Route Verification Template

**Example: /about**
```
rg -c "rounded-" src/app/about/page.tsx              // expect 0
rg -c "shadow-" src/app/about/page.tsx              // expect 0
rg "bg-\[var\(--bg\)\]\|border-\[var\(--border\)\]" src/app/about/page.tsx  // expect 0
rg "text-\[var\(--accent\)\]" src/app/about/page.tsx          // expect 0
rg "text-ink\|text-label\|text-muted" src/app/about/page.tsx  // expect ≥1 (positive gate)
npm run build                                        // expect exit 0
npm run lint src/app/about/page.tsx                  // expect exit 0
```

**Example: /newsletter**
```
rg -c "NewsletterCarousel" src/app/newsletter/page.tsx          // expect 0 (deleted or replaced)
rg -c "rounded-lg" src/app/newsletter/page.tsx                  // expect 0
rg -c "shadow-" src/components/newsletter/                      // expect 0 (component repurposed/deleted)
rg "grid grid-cols" src/app/newsletter/page.tsx                 // expect ≥1 (grid is present)
rg "text-list-title\|text-meta" src/app/newsletter/page.tsx     // expect ≥2 (card typography)
rg "border-rule\|border-ink" src/app/newsletter/page.tsx        // expect ≥1 (hairline borders)
npm run build                                        // expect exit 0
```

---

## Common Pitfalls

### Pitfall 1: `.prose` Plugin Version Mismatch with Tailwind v4

**What goes wrong:** Tailwind v4 CSS-first config changes how prose plugin applies. If prose overrides conflict with v4 `@layer` semantics, text color doesn't propagate or specificity wars occur.

**Why it happens:** `@tailwindcss/typography` v0.5.19 was built for Tailwind v3. Tailwind v4's lighter weight means less CSS pollution but stricter override rules.

**How to avoid:** Before shipping any route, manually test `/about` and `/prometheus` on dev server (`npm run dev`). Verify prose headings, lists, and links render in ink color (#0E0E0C), not lightened or accent.

**Warning signs:** Prose h2/h3 render in muted color or custom hex instead of token-driven ink; code block has visible rounded corners (v1.0 legacy).

### Pitfall 2: /newsletter Carousel Component Cleanup

**What goes wrong:** Deleting or repurposing `<NewsletterCarousel>` component without verifying no other routes import it. Leaves orphaned import or breaks another page.

**Why it happens:** Component lives in `src/components/newsletter/`, used only by `/newsletter` page (line 3 of `src/app/newsletter/page.tsx`), but `rg` search can be fragile if not specific.

**How to avoid:** Before deleting, run `rg "NewsletterCarousel" src/` — expect ONLY one hit in `/newsletter/page.tsx`. If another route uses it (unlikely but defensive), refactor that import first.

**Warning signs:** Build fails with "Cannot find module 'newsletter-carousel'" from an unexpected route.

### Pitfall 3: Breadcrumbs Visual Alignment

**What goes wrong:** `/about` and `/newsletter` use `<Breadcrumbs>` component (lines 21, 27 respectively). It's rendered as `sr-only` (screen-reader only) per `src/components/seo/breadcrumbs.tsx` line 11: `aria-label="Breadcrumb" className="sr-only"`. This is correct semantically but means breadcrumbs are invisible. If recipe decides breadcrumbs should be visible for Phase 12, the component's className changes, which touches the component itself (out of scope per D-05/scope fence).

**Why it happens:** Phase 11 D-26 chrome gate kept breadcrumbs semantic but hidden. D-06 says "breadcrumbs preserved" but doesn't specify visibility. Plans might assume they should be visible.

**How to avoid:** Recipe explicitly states: "Breadcrumbs remain `sr-only` per Phase 11 scope." If visibility is desired later, that's Phase 13 scope.

**Warning signs:** Plan tries to add styling to `<Breadcrumbs>` and bumps into scope fence (can't edit the component).

### Pitfall 4: /projects and /blog Index vs Detail File Isolation

**What goes wrong:** `/projects` index and `/projects/[slug]` share `ProjectCard` component. Similarly, `/blog` index and `/blog/[slug]` share `TagFilter` + `RelatedEssays` + `NewsletterCta` components. Editing one plan's view of a shared component breaks the other.

**Why it happens:** Component boundaries aren't perfectly aligned with route boundaries.

**How to avoid:** Recipe should note which components are shared. Each plan that touches a shared component must coordinate. For this phase:
  - `ProjectCard` (used by /projects index): simplest; just drop `border-[var(--border)]` → `border-rule`
  - `/blog/[slug]` has `NewsletterCta` + `RelatedEssays` — these are route-local, safe to restyle
  - Treat component changes as isolated if they only affect one route's layout

**Warning signs:** Build succeeds on 12-03 but 12-02 breaks (or vice versa).

### Pitfall 5: ScrollReveal Animation Interactions

**What goes wrong:** Routes use `<ScrollReveal delay={...}>` wrapper (Phase 8 survivor). During restyle, the DOM structure inside the wrapper changes (e.g., moving h1 outside a div). ScrollReveal might not re-measure viewport and causes layout jank or missed animations.

**Why it happens:** ScrollReveal is installed and active site-wide. Restyle plans touch DOM structure inside ScrollReveal divs.

**How to avoid:** Keep ScrollReveal wrapping unchanged. Only swap classes/text inside the wrapper, don't restructure.

**Warning signs:** Animations fire at wrong time or elements flicker during page load post-deploy.

### Pitfall 6: Substack CTA Button Consistency

**What goes wrong:** `/newsletter` has two Substack CTAs — one in the intro prose section (line 39–45, v1.0 style) and one in the grid footer (new, v2.0 style per D-NEWSLETTER-REDESIGN). If the two don't match, the page looks broken (inconsistent affordances).

**Why it happens:** The intro CTA is part of the prose and restyle might not touch it, leaving it in v1.0 style while the footer grid uses v2.0 tokens.

**How to avoid:** Recipe explicitly states: "Subscribe CTA on /newsletter matches /writing footer button spec (line 167 of src/app/writing/page.tsx): `border border-ink px-7 py-3 text-label uppercase`." Apply this style to both intro CTA and grid footer CTA.

**Warning signs:** Subscribe buttons look visually different — one rounded with shadow, one flat with hairline.

---

## Code Examples

### v1.0 → v2.0 Token Mapping (Recipe Reference)

| v1.0 Pattern | v2.0 Replacement | Used By |
|---|---|---|
| `text-2xl font-normal tracking-tight sm:text-3xl` (h1) | `text-section-feature text-ink uppercase` | `/about`, `/projects`, `/blog`, `/prometheus`, `/newsletter` |
| `text-sm font-normal uppercase tracking-widest` (labels) | `text-label uppercase text-muted` | All routes |
| `rounded-lg` | Delete (no rounded corners) | `/projects/[slug]`, `/newsletter` |
| `shadow-sm`, `shadow-md` | Delete (no shadows) | `/newsletter` carousel cards |
| `bg-[var(--bg)]` | `bg-paper` | `/newsletter` cards (if kept) |
| `border-[var(--border)]` | `border-rule` (hairline 1px) | ProjectCard, /newsletter cards |
| `text-[var(--accent)]` | `text-ink` | Links and buttons |
| `hover:opacity-60` | Keep as-is (already v2.0 compliant) | All routes |
| `group-hover:scale-105` | Delete; replace with `group-hover:opacity-80` if needed | `/newsletter` cards |

### `.prose` Validation Check

```tsx
// In /about/page.tsx or /prometheus/page.tsx (prose pages):
<div className="prose mt-8 max-w-none">
  {/* Content renders via Notion markdown */}
</div>

// Recipe confirms: .prose block in globals.css has:
// --tw-prose-body: var(--fg)  [ink color]
// --tw-prose-headings: var(--fg)  [ink color]
// --tw-prose-links: var(--fg)  [ink color]
// .prose h2 uses font-weight: 400 [no bold]
// Manual verify on dev: h2 and p tags render in #0E0E0C (ink)
```

### /newsletter Grid Example

```tsx
// src/app/newsletter/page.tsx

export default async function NewsletterPage() {
  const issues = await fetchMontyMonthlyIssues(20)  // Bump from 10 to 20 once grid can absorb

  return (
    <>
      <Breadcrumbs items={[...]} />

      <article className="mx-auto max-w-[66ch] px-6 pt-8 pb-16 md:px-0">
        <h1 className="text-section-feature text-ink uppercase">Monty Monthly</h1>
        <div className="prose mt-8 max-w-none">
          <p>Monty Monthly is a monthly newsletter covering...</p>
          <a href="https://montymonthly.substack.com"
             className="inline-block border border-ink px-7 py-3 text-label uppercase text-ink mt-6">
            Subscribe on Substack →
          </a>
        </div>

        {issues.length > 0 ? (
          <section className="mt-16 px-6 md:px-0 md:-mx-40 md:px-40">  {/* Break out to full width */}
            <h2 className="text-label uppercase text-muted">Recent Issues</h2>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {issues.map((issue) => (
                <a key={issue.link}
                   href={issue.link}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group block bg-paper border border-rule">
                  {issue.thumbnail ? (
                    <div className="relative aspect-[4/5] md:aspect-[16/9] overflow-hidden bg-muted">
                      <Image src={issue.thumbnail}
                             alt={issue.title}
                             fill
                             className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] md:aspect-[16/9] bg-muted" />
                  )}
                  <div className="p-4">
                    <h3 className="text-list-title text-ink">{issue.title}</h3>
                    <time className="mt-2 block text-meta uppercase text-muted">
                      {new Date(issue.pubDate).toLocaleDateString(...)}
                    </time>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-12">
            <p className="opacity-70">Recent issues coming soon...</p>
          </section>
        )}
      </article>
    </>
  )
}
```

---

## Architecture Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Palette swap (bg-paper, text-ink) | Frontend Server | — | Page renders with new tokens at build/ISR time; no client state |
| Typography scale swap (text-section-feature, text-label) | Frontend Server | — | Type roles applied via Tailwind utilities at markup time |
| .prose overrides (headings, links, code) | Frontend Server (via globals.css) | — | Global CSS layer ensures all Notion-rendered markdown uses tokens |
| Breadcrumb visibility (sr-only preservation) | Frontend Server | SEO (semantic HTML) | Semantic nav structure preserved; visual omission is intentional per D-06 |
| /newsletter grid layout | Frontend Server | CDN (static image optimization via next/image) | Server renders grid; images optimized at build time |
| Substack outbound CTA | Frontend Server (static link) | — | No form, no API; link is static HTML |

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Typography scaling across breakpoints | Custom px/rem math per element | Phase 9 `text-*` utilities (`text-section-feature`, `text-label`, etc.) | DRY, consistent, tokenized, auditable |
| Color palette consistency | Hardcoded hex values or CSS vars in component files | Phase 9 palette tokens (`bg-paper`, `text-ink`, `border-rule`) | Single source of truth in globals.css; global refactor-ability |
| Notion markdown rendering with custom styling | Custom prose CSS per route | Global `.prose` overrides in globals.css + per-route className | One `.prose` block applies everywhere; reduces CSS duplication |
| Newsletter issue gallery layout | DIY grid with calc() and @media queries | Tailwind `grid grid-cols-2 md:grid-cols-3` | Responsive, maintainable, aligns with project conventions |
| Button styles (Subscribe CTA) | Bespoke className per page | Recipe-documented button spec (reuse across /writing footer + /newsletter grid) | Consistency across multiple CTAs; single point of change |

---

## Phase Requirements Map

| Req ID | Description | Research Support |
|--------|-------------|------------------|
| RESTYLE-01 | `/about` adopts warm-paper palette + typography | Prose page with breadcrumbs; recipe token mapping + .prose validation gates |
| RESTYLE-02 | `/projects` (index + [slug]) adopts palette + typography | ProjectCard component drop `border-[var(--border)]` → `border-rule`; hero image drop `rounded-lg` |
| RESTYLE-03 | `/blog` + `/blog/[slug]` adopt palette + typography | Tag filter preserved; [slug] has .prose + newsletter CTA components; recipe handles |
| RESTYLE-04 | `/links` adopts palette + typography | Simple link list; scale large text per recipe decision |
| RESTYLE-05 | `/prometheus` adopts palette + typography | Prose-heavy FAQ; .prose overrides are lever |
| RESTYLE-06 | `/newsletter` adopts palette + typography; carousel replaced with grid per D-NEWSLETTER-REDESIGN | Full structural redesign; grid spec (2-col mobile / 3-col desktop); Substack CTA consistency |

---

## Open Questions

1. **h1 size on /about, /projects, /blog, /prometheus: `text-section-feature` (28px) or `text-page-title` (120px)?**
   - What we know: CONTEXT D-03 suggests route-level decision; Phase 11 /writing uses `text-page-title` because it's an archive index; /about is a profile page (less prominent).
   - What's unclear: Exact visual precedent for "profile pages" in Phase 9 specimen.
   - Recommendation: Recipe should show both options with rationale (section-feature for /about/prometheus/links = sub-pages; page-title only for /writing = archive). Planner confirms per-route preference.

2. **Breadcrumbs styled inline or stay invisible (sr-only)?**
   - What we know: D-06 says "preserved"; current code is sr-only (screen-reader only).
   - What's unclear: Does "preserved" mean "visually visible"? Recipe assumes invisible (per Phase 11 scope), but worth confirming.
   - Recommendation: Recipe states "Breadcrumbs remain sr-only per Phase 11 D-26 chrome gate; visual appearance out of scope."

3. **NewsletterCarousel component — delete entirely or repurpose for future carousels?**
   - What we know: D-NEWSLETTER-REDESIGN calls for grid; carousel deleted from /newsletter.
   - What's unclear: Could it be reused elsewhere? (Unlikely; motion budget dropped carousels in Phase 8.)
   - Recommendation: Delete entirely; if needed later, rebuild as required.

4. **Substack CTA styling — match /writing footer exactly, or evolve for /newsletter context?**
   - What we know: /writing footer CTA is `border border-footer-fg/40 px-7 py-3 text-label uppercase` (line 167).
   - What's unclear: /newsletter uses `text-footer-fg` (inverted ink); /newsletter uses normal ink. Should /newsletter CTA also use inverted colors if inside a dark section, or always use ink?
   - Recommendation: Recipe states both intro CTA and grid CTA use ink color (`text-ink`), matching /newsletter's light-mode background. If dark section added later, color inverts then.

---

## Environment Availability

All dependencies are installed and verified. No external services required for restyle phase (Notion and Substack RSS are Phase 8+ dependencies, already in place).

| Dependency | Required By | Available | Notes |
|------------|------------|-----------|-------|
| Node.js | Build | ✓ | All build scripts work |
| npm | Package management | ✓ | No new packages for Phase 12 |
| Tailwind CSS v4 | Styling | ✓ | Installed; globals.css configured |
| @tailwindcss/typography | `.prose` plugin | ✓ | v0.5.19 installed; compatible with v4 |
| Next.js 15.x | Framework | ✓ | ISR and Image component work |
| TypeScript | Type safety | ✓ | Already strict mode |

---

## Validation Architecture

Phase 12 is a restyling phase (code + config changes, no feature work). Existing test infrastructure covers routes via integration tests if they exist; Phase 12 does NOT add new tests.

**Quick validation per plan:**
- `npm run build` exits 0
- Visual smoke at 1440px + 390px — no horizontal overflow, palette matches reference (/writing)
- `rg` gates per validation inventory above

---

## State of the Art

| Old Approach (v1.0) | Current Approach (v2.0) | When Changed | Impact |
|---|---|---|---|
| Rounded corners (`rounded-lg`) on cards + buttons | Flat, minimal (`no rounded`, max `rounded-full` for rare pills) | Phase 9 design system | Cleaner, editorial feel; less friendly/playful |
| Drop shadows (`shadow-sm`, `shadow-md`) | No shadows (hairline rules only) | Phase 9 | Lighter, more minimal; paper-like |
| CSS-var aliases (`var(--bg)`, `var(--accent)`) | Direct Phase 9 tokens (`bg-paper`, `text-ink`) | Phase 9 + Phase 12 cutover | Tighter coupling to design system; fewer aliases to maintain |
| Arbitrary text sizes + weight overrides | Type-scale utilities (`text-section-feature`, `text-label`) | Phase 9 | Consistency; no more `text-2xl` scattered everywhere |
| Hover effects (scale transforms) | Opacity transitions (`hover:opacity-60/80`) | Phase 8 motion budget | Lighter, less disruptive |
| Carousel pattern (horizontal scroll + arrows) | Grid layout (multi-row, all visible) | D-NEWSLETTER-REDESIGN (operator feedback) | More content visible; "feels full" |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `<Breadcrumbs>` component is sr-only and should remain invisible per Phase 11 scope | Pitfall 3 | If visibility is desired, scope fence violated; need Phase 13 or descope plan |
| A2 | `/newsletter` intro CTA and grid footer CTA should both use ink color (`text-ink`) | /newsletter Redesign Specifics | If intro stays v1.0 style and grid uses v2.0, page looks broken (inconsistent affordances) |
| A3 | `fetchMontyMonthlyIssues(10)` can be bumped to 20–30 without RSS fetch timeout | /newsletter Redesign Specifics | If bump causes slow page load or timeout, revert limit to 10 and note for optimization phase |
| A4 | `.prose` plugin v0.5.19 on Tailwind v4 works without conflicts | Pitfall 1 | If prose styling conflicts with v4 CSS, need prose override fixes or version bump |
| A5 | `<ProjectCard>` component is only used by /projects index (not elsewhere) | Pitfall 4 | If another route imports ProjectCard, changes break that route |
| A6 | `h1` size decision (section-feature vs. page-title) is planner's choice, recipe provides both | Open Questions #1 | If recipe doesn't clarify both options, planner guesses wrong; restyle feels inconsistent with other v2.0 pages |

**All assumptions above tagged [ASSUMED] — planner must confirm before locking decisions.**

---

## Sources

### Primary (HIGH confidence — verified in this session)
- `src/app/globals.css` — v2.0 tokens and .prose overrides live here; verified Phase 9 palette (`--color-paper`, `--color-ink`, etc.) in place
- `src/app/writing/page.tsx` — canonical Phase 11 archive template with /writing footer Substack CTA spec (line 167)
- `src/lib/rss/substack.ts` — `fetchMontyMonthlyIssues(limit)` function verified; returns array of `{ title, link, pubDate, thumbnail }`
- `.planning/phases/12-sub-page-restyle-sweep/12-CONTEXT.md` — locked decisions, discretionary choices, deferred ideas; authoritative phase scope
- `.planning/REQUIREMENTS.md` — RESTYLE-01..06 requirement definitions
- `.planning/todos/pending/2026-05-21-newsletter-page-issues-prominence-redesign.md` — D-NEWSLETTER-REDESIGN operator feedback source

### Secondary (MEDIUM confidence — code inspection + project conventions)
- `package.json` — `@tailwindcss/typography@^0.5.19` confirmed installed; compatible with Tailwind v4
- `src/components/editorial/list-row.tsx` — ListRow primitive; `big` variant renders with `text-list-title` (28px)
- `src/components/seo/breadcrumbs.tsx` — component structure; confirmed sr-only semantic nav; no visual styling present
- `src/app/newsletter/page.tsx` — current /newsletter layout; imports NewsletterCarousel; Subscribe button spec (line 39–45)
- `src/components/newsletter/newsletter-carousel.tsx` — carousel chrome inventory (rounded-lg, shadow-sm, group-hover:scale-105)

---

## Metadata

**Confidence breakdown:**
- **Standard Stack:** HIGH — all v2.0 tokens from Phase 9 verified in globals.css; existing /writing page is canonical reference implementation
- **Recipe approach:** MEDIUM-HIGH — markdown document recommended based on extensibility; no risk because planner makes final call
- **Pitfalls:** HIGH — derived from code inspection and CONTEXT.md scope fence
- **Plan slicing:** MEDIUM — per-route recommendation sound but planner retains discretion

**Research date:** 2026-05-21
**Valid until:** 2026-06-04 (14 days — stable domain, unlikely breaking changes unless Tailwind v4 minor version lands with prose plugin issues)
**Revisit if:** Tailwind v4 minor version lands; @tailwindcss/typography updates; operator changes /newsletter scope post-planning
