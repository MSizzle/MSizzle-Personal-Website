# Phase 12 Restyle Recipe

**Status:** Canonical — Wave 2 plans (12-02 through 12-07) MUST cite this document as the single source of truth for token mappings, per-route decisions, and validation gates. Do NOT derive restyle decisions from 12-CONTEXT.md or 12-RESEARCH.md directly — this recipe has already synthesized them.

**Author:** Phase 12, Plan 01 (12-01)
**Date:** 2026-05-21

---

## Section 1 — v1.0 → v2.0 Token Mapping Table

Apply mechanically. Every v1.0 pattern listed here must be replaced in each touched file. The rg validation gates in Section 9 confirm none survived.

| v1.0 Pattern | v2.0 Replacement | Notes |
|---|---|---|
| `bg-[var(--bg)]` | `bg-paper` | From globals.css `--color-paper: #F4F2EC` |
| `text-[var(--foreground)]` or `text-[var(--fg)]` | `text-ink` | `--color-ink: #0E0E0C` |
| `text-[var(--muted)]` | `text-muted` | `--color-muted: #9A9690` |
| `border-[var(--border)]` | `border-rule` | `--color-rule: #E5E2D9` (hairline); use `border-rule-strong` for bold dividers |
| `text-[var(--accent)]` | `text-ink` — drop accent entirely; use IntroLink for emphasis links | v1.0 accent maps to ink per globals.css `:root` |
| `bg-[var(--accent)]` (button fill) | flat `border border-ink px-7 py-3 text-label uppercase` | No filled buttons in v2.0 |
| `bg-[var(--muted)]` (placeholder bg) | `bg-muted` | Image placeholders, fallback tiles |
| `rounded-lg`, `rounded-xl`, `rounded-2xl` | DELETE — no rounded corners | Exception: `rounded-full` only for explicit pill/button shapes where design requires it |
| `shadow-sm`, `shadow-md`, `shadow-lg` | DELETE — no shadows | v2.0 uses hairline borders only |
| `hover:shadow-*`, `hover:brightness-*` | DELETE | Replace with `hover:opacity-60` or `hover:opacity-80` |
| `hover:scale-*`, `group-hover:scale-*` | DELETE | Phase 8 motion budget; replace with `group-hover:opacity-80` if hover state needed |
| `text-2xl font-normal tracking-tight sm:text-3xl` (h1) | See per-route decisions in Section 2 below | Do not use arbitrary size + weight combos |
| `text-sm font-normal uppercase tracking-widest` (label/h1) | `text-label uppercase text-muted` | `--text-label: 11px` tracked 0.2em |
| `font-bold` on body text | DELETE — use type-scale roles instead | v2.0 uses weight as part of scale role, not ad-hoc |
| `opacity-75` on body/description text | `text-muted` | Prefer explicit token over opacity hack |
| `backdrop-blur-*`, `bg-gradient-*` | DELETE | No glass effects in v2.0 |

**Type-scale roles available (Phase 9):**

| Role | Size | Weight | Use case |
|---|---|---|---|
| `text-page-title` | 120px | 700 | Archive index pages ONLY (/writing, /events, /photos) |
| `text-section-feature` | 28px | 700 | Prominent h1 on sub-pages; project/blog/about detail pages |
| `text-list-title` | 28px | 400 | Card/row titles (already weighted by surrounding context) |
| `text-list-title-home` | 20px | 400 | Compact row titles on homepage |
| `text-body-lead` | 22px | 400 | Intro paragraph / lead body text |
| `text-caption` | 13px | 400 | Captions, footnotes |
| `text-label` | 11px | 700 | Labels, h1 on functional pages, section headers |
| `text-meta` | 11px | 400 | Dates, metadata, secondary labels |
| `text-nav` | 13px | 400 | Navigation links |

---

## Section 2 — Per-Route h1 Size Decisions

**Rule:** `text-page-title` (120px) is reserved for archive index pages with Phase 11 title-block treatment (/writing, /events, /photos). The 6 Phase 12 sub-pages use `text-section-feature` for prominent h1s or `text-label` for functional labels.

| Route | h1 token | Rationale |
|---|---|---|
| `/about` | `text-section-feature text-ink` (28px) | Profile page, not archive index — does not need 120px page-title treatment |
| `/projects` (index) | `text-label uppercase text-muted` | Keep existing small label style; page title is functional, not monumental |
| `/projects/[slug]` | `text-section-feature text-ink` (28px) | Project detail page — needs visual weight for the project name |
| `/blog` (index) | `text-label uppercase text-muted` | Matches /projects index — tag-filterable archive is functional, not monumental |
| `/blog/[slug]` | `text-section-feature text-ink` (28px) | Essay detail — needs title weight |
| `/links` | `text-label uppercase text-muted` | Simple utility page; the links themselves carry the visual weight |
| `/prometheus` | `text-section-feature text-ink` (28px) | Company/product page — prominent but not archive-level |
| `/newsletter` | `text-section-feature text-ink` (28px) | Matches other prose pages; intro column is narrow |

---

## Section 3 — .prose Override Pattern

The global `.prose` block in `src/app/globals.css` (lines 118–130) already sets `--tw-prose-body`, `--tw-prose-headings`, `--tw-prose-links` etc. to `var(--fg)` which resolves to `#0E0E0C` (ink). This means:

- Prose blocks on all routes already render in ink color — no per-route prose class changes needed.
- Keep existing `className="prose mt-8 max-w-none"` pattern on prose pages.
- Do NOT add redundant `prose-headings:text-ink prose-p:text-ink` overrides — they are already handled globally.
- Manual verify required: open dev server and confirm `/about` prose h2 + paragraph render in `#0E0E0C`, not lightened or accent color.

Known legacy in globals.css: `.prose code { border-radius: 0.125rem }` — this is a v1.0 residue but is NOT in scope for Phase 12 (touching globals.css is outside the route-file restyle scope). Note for Phase 13.

---

## Section 4 — Subscribe CTA Button Spec

All Substack CTA buttons on Phase 12 pages use this exact pattern (matches `src/app/writing/page.tsx` line 167):

```
className="inline-block border border-ink px-7 py-3 text-label uppercase text-ink transition-opacity hover:opacity-80"
```

With these attributes:
```
href="https://montymonthly.substack.com"
target="_blank"
rel="noopener noreferrer"
```

This replaces the v1.0 `/newsletter` Subscribe button: `rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-base font-normal text-white no-underline shadow-md transition-all hover:shadow-lg hover:brightness-110`.

On the `/newsletter` page, apply this spec to BOTH the intro-column Subscribe CTA and any footer-section Subscribe CTA — both must match (Pitfall 6 from RESEARCH.md).

**Note on /writing footer button:** The /writing page uses `border-footer-fg/40` and `text-footer-fg` because it's inside an inverted-ink (`bg-footer-bg`) section. Phase 12 pages are NOT in an inverted section — use `border-ink` and `text-ink` instead.

---

## Section 5 — /newsletter Grid Spec

Per D-NEWSLETTER-REDESIGN: the issue gallery breaks out of the 66ch reading column.

**Layout:**
- Intro copy + Subscribe CTA: stay in `max-w-[66ch]` reading column (`mx-auto max-w-[66ch] px-6 md:px-0`)
- Section label "Recent Issues": `text-label uppercase text-muted` (replaces `text-sm font-normal uppercase tracking-widest`)
- Issue gallery: full editorial width — use `w-full` section outside the 66ch article wrapper, with `px-6 md:px-40` padding matching Phase 11 archive pages
- Grid: `grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6`
- Fetch limit: bump from 10 → 20 (`fetchMontyMonthlyIssues(20)`)
- Delete `NewsletterCarousel` component — replace with server-rendered grid in `newsletter/page.tsx`; verify no other file imports it before deleting

**Issue card structure:**
```tsx
<a href={issue.link} target="_blank" rel="noopener noreferrer"
   className="group block bg-paper border border-rule">
  <div className="relative aspect-[4/5] md:aspect-[16/9] overflow-hidden bg-muted">
    <Image src={issue.thumbnail} alt={issue.title} fill className="object-cover saturate-[0.92]" />
  </div>
  <div className="p-4">
    <h3 className="text-list-title text-ink">{issue.title}</h3>
    <time className="mt-2 block text-meta uppercase text-muted">{formatted date}</time>
  </div>
</a>
```

**No-thumbnail fallback:** `<div className="aspect-[4/5] md:aspect-[16/9] bg-muted" aria-hidden />`

**Date formatting:** `new Date(issue.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })`

---

## Section 6 — Breadcrumb Rule

`<Breadcrumbs>` component (`src/components/seo/breadcrumbs.tsx`) is rendered as `sr-only` (screen-reader only, no visible output). Per D-06 + RESEARCH Pitfall 3: breadcrumbs remain `sr-only` on all Phase 12 routes. Do NOT add className styling to the `<Breadcrumbs>` component itself (it is out of scope per D-05 scope fence).

---

## Section 7 — Photo Treatment

Any images on these pages use `saturate-[0.92]` filter (D-07), matching Phase 10/11 photo treatment.

---

## Section 8 — ScrollReveal Preservation

Several routes use `<ScrollReveal delay={N}>` wrapper. Per RESEARCH Pitfall 5: keep ScrollReveal wrapping unchanged. Only swap classes inside the wrapper, do not restructure the DOM.

---

## Section 9 — rg Validation Gate Templates

Each Wave 2 plan uses these rg patterns. Substitute `<FILE>` with the specific file path(s).

**Negative gates (must return 0 — v1.0 vocabulary is gone):**
```
rg -c 'rounded-(?!full)' <FILE>
rg -c 'shadow-' <FILE>
rg -c 'var\(--bg\)\|var\(--border\)\|var\(--accent\)\|var\(--foreground\)' <FILE>
rg -c 'bg-gradient-\|backdrop-blur-\|hover:scale-\|group-hover:scale-' <FILE>
```

**Positive gates (must return >= 1 — v2.0 vocabulary is present):**
```
rg -c 'bg-paper\|text-ink\|text-muted\|border-rule' <FILE>
```

**Build gate (every plan):**
```
npm run build
```

**Route-specific additional gates:**

For `/newsletter` (12-07):
```
rg -c 'NewsletterCarousel' src/app/newsletter/page.tsx   # expect 0
rg -c 'grid grid-cols' src/app/newsletter/page.tsx        # expect >= 1
rg -c 'text-list-title\|text-meta' src/app/newsletter/page.tsx  # expect >= 2
```

Before deleting `NewsletterCarousel`:
```
rg 'NewsletterCarousel' src/                              # expect only newsletter/page.tsx hit
```

---

## Section 10 — Out of Scope (do not touch)

The following files are explicitly out of scope for ALL Phase 12 plans. If a plan discovers it must touch any of these to complete a task, stop and surface as a Rule 4 architectural deviation — do not proceed unilaterally.

- `src/components/nav/navigation.tsx` — v1.0 Nav (D-05)
- `src/components/footer.tsx` — v1.0 Footer (D-05)
- `src/components/main-offset.tsx` — v1.0 MainOffset (D-05)
- `src/components/seo/breadcrumbs.tsx` — breadcrumb component (D-06, D-05)
- `src/app/globals.css` — global CSS (Phase 9 territory; .prose residue is Phase 13)
- `src/lib/notion.ts`, `src/lib/notion-events.ts` — Notion fetchers (scope fence)
- `src/lib/rss/substack.ts` — RSS fetcher (scope fence; limit bump on newsletter page only, in the page call)
- Phase 9 primitives: `src/components/editorial/*` — Rule, RuleStrong, SectionLabel, ListRow, AllLink, IntroLink, FooterCol
- Phase 11 primitives: `src/components/home-v2/editorial-header.tsx`, `src/components/editorial/year-block.tsx`
- OG image generation paths, feed.xml, sitemap, URL structures (D-04)

---

## Appendix: Wave 2 Plan → Route Map

| Plan | Route(s) | Files | Complexity |
|---|---|---|---|
| 12-02 | `/about` | `src/app/about/page.tsx` | Low |
| 12-03 | `/projects` + `/projects/[slug]` | `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx` | Low-Medium |
| 12-04 | `/blog` + `/blog/[slug]` | `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx` | Medium |
| 12-05 | `/links` | `src/app/links/page.tsx` | Low |
| 12-06 | `/prometheus` | `src/app/prometheus/page.tsx` | Medium |
| 12-07 | `/newsletter` | `src/app/newsletter/page.tsx`, `src/components/newsletter/newsletter-carousel.tsx` | High |

All Wave 2 plans are **parallelizable** — file sets are disjoint. No plan in Wave 2 blocks another.
