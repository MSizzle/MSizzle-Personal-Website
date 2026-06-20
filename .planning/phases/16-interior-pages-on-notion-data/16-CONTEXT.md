# Phase 16: Interior Pages on Notion Data - Context

**Gathered:** 2026-06-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Rebuild every **interior** page in the v3 Pumpkin Amber system, sourced from the existing Notion pipeline, with a shared nav + footer, plus two new pages (`/uses`, `/watching`).

**In scope:** Writing index, Essay reading view (`/blog/[slug]`), Works index (`/projects`), Project detail (`/projects/[slug]`), About, Prometheus, Newsletter, Events, Links — all repainted/rebuilt in v3 — plus new `/uses` and `/watching`, and a shared nav + footer.

**Out of scope:** The homepage (shipped in Phase 15 as the WebGL scroll-story); SEO extension to the new pages + Umami verification (Phase 17); QA/perf gate/alias swap (Phase 18); migrating `/photos` or `/uses`/`/watching` content into Notion (stays hardcoded this phase).

</domain>

<decisions>
## Implementation Decisions

### Page feel & big photos
- **D-01:** Interior pages are **calm + reading-first with big photographic moments** — native scroll, subtle scroll-reveal fades, type-led, but punctuated by large/full-bleed imagery. The homepage carries the kinetic spectacle; interior pages do NOT add marquees/animated oversized type. This honors the locked "large-photo direction" while keeping content legible. (Resolves the prototype-002-calm vs recent-large-photo-note tension.)
- **D-02:** Large/full-bleed photos land on **all four surfaces**: (1) Project detail hero (full-bleed Notion cover via `/api/notion-cover`), (2) Essay reading view hero (Notion post cover when present, type-only fallback when absent), (3) Works & Writing indexes (photo-forward), (4) About + the existing `/photos` archive get the v3 large-photo treatment.
- **D-03:** Writing and Works indexes use a **photo grid of cards** — each card = cover image + title + excerpt — in a responsive grid (departure from the current v2 list rows).
- **D-04:** Keep **year-grouping** as section headers within the card grid (consistent with the v2 archive rhythm). *(auto-selected default)*

### /uses (new page)
- **D-05:** `/uses` content lives in a **hardcoded typed TS file** (e.g. `src/lib/uses.ts`), mirroring how `src/lib/photos.ts` works today. No Notion DB this phase — content changes rarely and stays version-controlled. *(auto-selected; "New Notion DB" deferred — see Deferred.)*
- **D-06:** Keep the prototype's **four groups**: AI & Development, Productivity, Communication, Hardware. The Hardware entries are **TODO placeholders** (laptop/phone) for Monty to fill with real values — do not block the build on them. *(auto-selected default)*

### /watching (new page)
- **D-07:** `/watching` content lives in a **hardcoded typed TS file** (e.g. `src/lib/watching.ts`), consistent with D-05 and `photos.ts`. *(auto-selected default)*
- **D-08:** Thumbnails are **auto-derived from the YouTube video ID** (e.g. `https://img.youtube.com/vi/{id}/hqdefault.jpg`) — no manual thumbnail assets. *(auto-selected default)*
- **D-09:** Layout is a **card grid** (thumbnail + title + channel label); each card links out to YouTube and **opens in a new tab**. *(auto-selected default)*
- **D-10:** Seed with the prototype's **6 titles as placeholders**; Monty swaps in real video IDs/URLs. *(auto-selected default)*

### Shared nav & footer
- **D-11:** Keep the **focused primary desktop nav** (current 5: Work, Writing, Events, About, Links). Secondary/new routes go to the footer, not the top nav. *(auto-selected default)*
- **D-12:** The **footer is the full sitemap** — includes Uses, Watching, Prometheus, Newsletter, Photos in addition to the primary routes. *(auto-selected default)*
- **D-13:** **Active states** are pathname-based (bold/underline current section — reuse the existing `navigation.tsx` mapping). **Breadcrumbs** (Home / Section / Title) appear on detail views (`/blog/[slug]`, `/projects/[slug]`) and the new `/uses` + `/watching` pages. **Mobile** keeps the existing hamburger drawer with the full link set. *(auto-selected default)*

### Essay reading view
- **D-14:** Essay view shows breadcrumb, reading time, publish date, prose (via `NotionRenderer`), and related essays. **Related essays** keep the existing `RelatedEssays` component logic: shared tags first, recency fallback. *(auto-selected default)*

### Claude's Discretion
- Whether to repaint the existing v2 editorial primitives (`Rule`, `YearBlock`, `ListRow`, etc.) to Pumpkin Amber tokens vs. adopt the unused `src/components/v3/*` components vs. build fresh photo-forward components — planner/executor's call. Goal: one consistent v3 system across all interior pages.
- Exact card grid breakpoints, image aspect ratios, and scroll-reveal timings (keep within the perf budget; respect `reducedMotion`).
- Excerpt source per index: Writing uses `getPostExcerpt`; Works uses the `description` field (existing patterns).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` — Phase 16 goal, success criteria (writing/essay/works/project/about/prometheus/newsletter/events/links + `/uses` + `/watching` + shared nav/footer).
- `.planning/REQUIREMENTS.md` — PG-01..PG-05 (pages), IN-01/IN-02 (Notion pipeline + image proxy preserved). IN-03/IN-04 (SEO + Umami) are Phase 17, not here.

### Design prototype (interior pages)
- `.planning/sketches/002-full-site-model/` — clickable full-site prototype; per-page mockups for writing, essay, works, project, about, prometheus, newsletter, events, links, **uses.html**, **watching.html**. NOTE: prototype is type-led; D-01/D-02 deliberately deviate toward large photos.
- `.planning/sketches/002-full-site-model/README.md` — page list + "interior pages stay on native scroll, reading-friendly" note.
- `.planning/sketches/MANIFEST.md` — design direction, locked decisions, palette history (Crimson Poster → crimson-line → Pumpkin Amber).

### v3 design system (palette — already in code)
- `src/app/globals.css` — Pumpkin Amber `@theme` tokens (`--color-bg` #ff7a14, `--color-text` #2a1808, `--accent` #0c6b74, etc.). Interior pages must move OFF the v2 editorial tokens onto these.

### Existing code to reuse / preserve (verified during scout)
- `src/lib/notion.ts` — blog loader: `getPublishedPosts`, `getPostBySlug`, `getBlocks`, `getPostExcerpt`, `getFreshImageUrl`; `BlogPost` shape.
- `src/lib/notion-projects.ts` — `getPublishedProjects`, `getProjectBySlug`, `getFeaturedProjects`; `Project` shape (incl `image`, `externalUrl`, `tags`).
- `src/lib/notion-events.ts` — `getUpcomingEvents`, `getPastEvents`; `EventItem` shape.
- `src/lib/photos.ts` — hardcoded `PHOTOS_BY_YEAR` + `groupPhotosByYear()` (the model for `uses.ts` / `watching.ts`).
- `src/components/notion/notion-renderer.tsx` — 20-block renderer (preserve; do not rewrite).
- `src/app/api/notion-image/route.ts` + `src/app/api/notion-cover/route.ts` — image proxies (preserve; covers feed D-02 heroes).
- `src/components/nav/navigation.tsx` + `src/components/home-v2/editorial-header.tsx` — current shared nav (active-state mapping to reuse for D-13).
- `src/components/layout/conditional-footer.tsx` + `src/components/home-v2/ink-footer.tsx` — current footer (rebuild for D-12 full sitemap).
- `src/lib/seo/` — `blog-metadata.ts`, `project-metadata.ts`, `schemas.ts`, `site.ts` (metadata preserved; extension to new pages is Phase 17).
- `src/components/blog` `RelatedEssays` + `NewsletterCta` — reuse for D-14.

### Agent memory (background, verify before relying)
- Memory `v3-pumpkin-amber-palette` — palette is locked + now in code; large-photo interior direction.
- Memory `homepage-webgl-direction` — confirms homepage is out of scope here.
- Memory `nextjs16-dynamic-ssr-false` / `nextjs16-fetchpriority-quirk` — relevant if any interior page adds client-only/3D or an LCP image (set `fetchPriority="high"`).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Notion loaders (`notion.ts`, `notion-projects.ts`, `notion-events.ts`) already return everything the pages need — no loader changes expected (IN-01).
- `notion-renderer.tsx` renders essay/project bodies; covers come through the existing proxies (IN-02).
- `photos.ts` is the exact template for the new hardcoded `uses.ts` / `watching.ts`.
- `RelatedEssays`, `NewsletterCta`, breadcrumbs, and the nav active-state mapping already exist.
- `src/components/v3/*` (big-list, card, marquee, reveal, button) exist but are currently unused — candidates for the photo-forward card grid.

### Established Patterns
- All interior pages are currently **v2 editorial** (paper/ink tokens). This phase repaints them onto Pumpkin Amber tokens AND adds the photo-forward layouts.
- ISR 30min + `dataSources.query` v5 is the standing data pattern (preserve).
- Static/hardcoded content pattern (photos.ts) is accepted for non-Notion pages.

### Integration Points
- New routes `src/app/uses/page.tsx` and `src/app/watching/page.tsx`.
- New data files `src/lib/uses.ts`, `src/lib/watching.ts`.
- Footer rebuild must add the new + secondary routes (D-12); nav active-state map must cover new pages (D-13).
- LCP watch: large hero images need `fetchPriority="high"` (Next 16 quirk).

</code_context>

<specifics>
## Specific Ideas

- "Calm + big photo moments" — interior pages read first, but show off photography/work via large covers. Homepage stays the only kinetic page.
- Card-grid indexes (writing + works) replace the v2 text list rows.
- `/watching` thumbnails auto-pull from YouTube; cards open the video on YouTube in a new tab.
- `/uses` Hardware group ships with placeholders for Monty to fill (laptop/phone).

</specifics>

<deferred>
## Deferred Ideas

- **Move `/uses` and/or `/watching` into Notion** — a Notion-backed DB + loader so Monty edits them from Notion like blog/projects. Deferred: starting hardcoded (D-05/D-07); revisit if editing friction appears.
- **Move `/photos` into Notion** — still hardcoded (`photos.ts`); pre-existing deferral, unchanged.
- **Real `/uses` Hardware values + real `/watching` video list** — content fill (placeholders ship now), Monty-owned follow-up, not a code blocker.

None of these expand Phase 16 scope — captured so they aren't lost.

</deferred>

---

*Phase: 16-interior-pages-on-notion-data*
*Context gathered: 2026-06-19*
