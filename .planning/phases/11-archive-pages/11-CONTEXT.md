# Phase 11: Archive Pages - Context

**Gathered:** 2026-05-21
**Status:** Ready for planning
**Mode:** `--auto` (Claude Design editorial-redesign handoff is the canonical context per Monty's standing instruction from Phases 8, 9, 10)

<domain>
## Phase Boundary

Phase 11 ships three new editorial archive pages: `/writing`, `/events`, `/photos`. Each follows the same skeleton — 2-column title block with atmosphere photo, then year-grouped content via a NEW shared `<YearBlock>` primitive — and each has a signature treatment (writing: email-subscribe footer; events: 84px giant day numerals; photos: year-grouped photo grid).

**In scope (3 requirements):** ARCH-01 (/writing index), ARCH-02 (/events index), ARCH-03 (/photos archive).

**Implicit work (not separate REQ-IDs, but required to complete the in-scope reqs):**
- New `<YearBlock>` primitive
- New `src/lib/photos.ts` data module (year + filename mapping for the 6 existing photos)
- `formatDayNumeral()` helper added to `src/lib/dates.ts`
- Homepage navigation + AllLink targets updated from `/blog` → `/writing` when `/writing` ships

**Out of scope:**
- `/blog/page.tsx` restyle (Phase 12 sub-page restyle sweep owns this)
- `/blog/[slug]` permalink restyle (Phase 12)
- New newsletter signup pipeline (reuse the existing `/newsletter` integration — handoff explicitly forbids a second pipeline)
- Notion-driven photo data source (Phase 11 hardcodes 6 photos; future milestone introduces general data source)
- Dark-mode variants (Phase 9 D-04 dropped)
- `/newsletter` carousel (Phase 8 D-13 preserved as-is)

</domain>

<decisions>
## Implementation Decisions

### Route Strategy
- **D-01:** **`/writing` is a NEW route** at `src/app/writing/page.tsx`. Editorial archive page per handoff §"3. /writing — Index".
- **D-02:** **`/blog/[slug]` permalink stays.** Post URLs remain `/blog/${slug}` (the existing detail route is untouched in Phase 11). `/blog/page.tsx` (the listing) stays but is no longer the canonical archive — Phase 12's restyle sweep can decide whether to delete it or restyle it as a redirect.
- **D-03:** **`/events` is REPLACED in place** at `src/app/events/page.tsx`. The existing v1.0 events listing is rewritten with the editorial 2-column title block + Upcoming (giant numerals) + Past (4-column dense) layout per handoff §"4. /events — Index".
- **D-04:** **`/photos` is a NEW route** at `src/app/photos/page.tsx`. Year-grouped photo grid per handoff §"Open Questions / Decisions Deferred" — handoff explicitly says "a simple year-grouped grid (mirroring `/writing`'s `YearBlock` pattern) is a safe default."

### Nav + AllLink Updates (Phase 10 carryforward)
- **D-05:** **When `/writing` ships in Plan 11-03,** update `src/app/page.tsx`:
  - Header nav link "Writing" → change `href` from `/blog` to `/writing`
  - WRITING section `<AllLink href="/blog">All writing →</AllLink>` → change `href` to `/writing`
  - Footer column "Library" → "Essays" link `href` from `/blog` → `/writing`
- **D-06:** **When `/photos` ships in Plan 11-05,** the PHOTOGRAPHS section's `<AllLink href="/photos">Photo Archive →</AllLink>` finally becomes a live link (currently 404). No code change required — the link already exists. Also: PERSONAL card "Photo Archive" already targets `/photos` (also currently 404, also becomes live).

### NEW Primitive: `<YearBlock>` (shared across all 3 archives)
- **D-07:** **`<YearBlock>` lives at `src/components/editorial/year-block.tsx`** — extends Phase 9 primitives directory.
- **D-08:** **Props:** `{ year: string | number, children: ReactNode }`. The year renders as a tracked-uppercase 14px sticky label on the LEFT (`text-label` token, or close to it — confirm during research). Children render on the RIGHT.
- **D-09:** **Layout:** 2-column grid `grid-cols-[180px_1fr]` desktop. Year label sticky (`position: sticky; top: <padding>`) so it stays in view while the user scrolls through that year's entries. Mobile collapses to single column with year label as a non-sticky heading above the entries.
- **D-10 (REVISED post-research):** **Sticky behavior with `md:self-start` requirement** — `position: sticky` on the year column with `top: 36px` (or `top-9`) so the year stays visible during scroll. **CRITICAL implementation detail (RESEARCH F4):** A grid child defaults to `align-self: stretch` and a stretched element CANNOT stick. The year-label `<span>` must include `md:self-start` (or equivalent `align-self: start`) for sticky to work. Lenis smooth-scroll from Phase 8 D-12 mutates native `scrollTop` (not body transform), so native CSS sticky cooperates. Desktop only — mobile gets a non-sticky heading via `md:sticky md:top-9 md:self-start` (sticky activates only at md+).

### NEW Data Module: `src/lib/photos.ts`
- **D-11 (REVISED post-research):** **NEW file `src/lib/photos.ts`** exports the 6 existing photos. **Empirical year mapping via `mdls kMDItemContentCreationDate` (RESEARCH-verified, not guessed): 3×2023 + 3×2025, NO 2024 photos exist.** Plan 11-02 reads the exact dates from RESEARCH.md and assigns:
  ```ts
  export type ArchivePhoto = {
    filename: string;
    year: number;
    alt: string;
    caption?: string;
  };

  // Years derived from macOS kMDItemContentCreationDate (RESEARCH F1).
  export const PHOTOS_BY_YEAR: ArchivePhoto[] = [
    // Plan 11-02 fills in exact years per RESEARCH.md table:
    // 3 photos in 2023 + 3 photos in 2025 (no 2024 entries)
    { filename: "000092530012.jpeg",      year: 2025, alt: "Film plate — A year in motion", caption: "2025" },
    { filename: "20230928 MSB_0114.jpg",  year: 2023, alt: "...", caption: "Sep 2023" },
    { filename: "IMG_0028.jpeg",          year: /* per mdls */ 2023, alt: "..." },
    { filename: "IMG_1075.JPG",           year: /* per mdls */ 2023, alt: "..." },
    { filename: "IMG_2129.jpeg",          year: /* per mdls */ 2025, alt: "..." },
    { filename: "Patricof09.jpg",         year: /* per mdls */ 2025, alt: "..." },
  ];
  ```
  Plan 11-02 reads RESEARCH.md to get the exact per-file dates and fills the year fields verbatim. `/photos` renders TWO `<YearBlock>` groups (2025, 2023), not three. Update handoff expectations accordingly.
- **D-12:** **Helper function** `groupPhotosByYear(): Map<number, ArchivePhoto[]>` returning entries sorted by year descending.

### `/writing` (ARCH-01)
- **D-13:** **Page structure** per handoff §"3. /writing — Index":
  1. Editorial header (use the SAME 5-link nav as Phase 10 homepage — extract to shared `<EditorialHeader>` component if convenient, or duplicate inline; recommended: extract during Plan 11-03 to `src/components/home-v2/editorial-header.tsx`)
  2. Title block (`padding: 160px 160px 100px` desktop / `64px 24px 60px` mobile): 2-column grid (1fr left + 360px right). Left: tracked label "── The Library · 02" → 120px `Writing.` page title → 18px muted description with `IntroLink` to Monty Monthly. Right: 360×480 atmosphere photo using `PHOTOS[5]` (`Patricof09.jpg`) via `next/image`.
  3. `<RuleStrong />`
  4. Three `<YearBlock>` groups (2026, 2025, 2024) — each contains `<ListRow big>` rows for posts in that year. Posts come from `getPublishedPosts()` and are grouped client-side by year of `post.date`.
  5. `<Rule />` between YearBlocks (or rely on each YearBlock's own divider)
  6. `<RuleStrong />` before the footer
  7. Inverted email-subscribe footer (D-15 below)
- **D-14:** **Page title typography** — `Writing.` uses `text-page-title` token (120px / 0.95 / -0.045em / 700, per Phase 9 D-06). Trailing period is intentional (handoff: "every page title ends in one").
- **D-15 (REVISED post-research):** **Email-subscribe footer renders as a styled Substack outbound link, NOT a form.** RESEARCH F2: there is no in-house newsletter signup pipeline — `/newsletter/page.tsx` is a Substack outbound link + RSS carousel of past issues. There is no `/api/subscribe` route. Plan 11-03's footer:
  - Visual style: inverted ink block per handoff. Padding `py-16 px-40` desktop / `py-12 px-7` mobile.
  - Heading: "Receive new essays the morning they're published." in 28px (`text-section-feature` token, `text-footer-fg` color).
  - **CTA: a single styled `<a href="https://montymonthly.substack.com" target="_blank" rel="noopener noreferrer">` rendered as a button-styled `<AllLink>`-like element** (e.g., 11px tracked uppercase with 1px footer-fg bottom border, or a small `<button>`-styled CTA). NO email input. NO form. This is the canonical interpretation of "reuse existing pipeline" per the handoff (the existing pipeline IS Substack outbound).
  - Plan 11-03 reads `src/app/newsletter/page.tsx` to confirm the exact Substack URL used by the v1.0 newsletter page and mirrors it.

### `/events` (ARCH-02)
- **D-16:** **Page structure** per handoff §"4. /events — Index":
  1. Editorial header (`Events` bolded vs other nav links being muted)
  2. Title block matching `/writing`: "── The Calendar · 03" + `Events.` 120px + 18px muted blurb + 360×480 atmosphere photo `PHOTOS[3]` (`IMG_1075.JPG`).
  3. `<RuleStrong />`
  4. **Upcoming section** — label "Upcoming / 03 — Upcoming" via `<SectionLabel>`. Three `<UpcomingRow>` entries in a 3-column grid `grid-cols-[160px_1fr_200px]` desktop. Date column has the **month + year tracked above + GIANT 84px (or 56px for non-featured) bold day numeral below** — that's the page's signature visual. Right column: seat count + RSVP CTA.
  5. `<RuleStrong />`
  6. **Past section** — label "Past / 03 — Past" via `<SectionLabel>`. Denser 4-column grid `grid-cols-[120px_1fr_1fr_100px]` rows (date / title / blurb / status). Tight 20px row padding, hairlines between, much denser than Upcoming.
- **D-17:** **Day numeral helper** — add `formatDayNumeral(iso: string): string` to `src/lib/dates.ts` returning just the day number as a string ("12" for June 12). Plan 11-04 adds this alongside writing /events giant numeral rendering.
- **D-18:** **Featured upcoming event** is the FIRST event in `upcomingEvents` — gets the 84px numeral. Subsequent upcoming events get 56px.
- **D-19:** **NEW `<UpcomingRow>` inline component in `/events/page.tsx`** — not extracted as a shared primitive unless `/writing` or `/photos` also need it (they don't). Inline-then-extract pattern.
- **D-20 (REVISED post-research):** **Past events use a denser 4-column inline row layout (NOT `<ListRow>`).** RESEARCH F3: `EventItem` has no `status` field, so the handoff's 4-col grid `[120px_1fr_1fr_100px]` (date / title / blurb / status) has no source for the 4th column. Drop the status column → use a 3-column dense layout `grid-cols-[120px_1fr_1fr]` (date / title / blurb), 20px row padding, hairlines between rows. OR keep `<ListRow>` for consistency and let it render in non-big variant. **Recommended: inline 3-column dense rows** for the Past section since `<ListRow>` doesn't support the 3-col layout precisely. Plan 11-04 writes the inline JSX.
- **D-21:** **Notion field names** (Phase 10 carryforward — D-19/D-21 REVISED from Phase 10): `event.name` (not `title`), `event.link` (not `rsvpUrl`), `event.date` (ISO), `event.description`, `event.location`.

### `/photos` (ARCH-03)
- **D-22:** **Page structure** per handoff §"Open Questions" "year-grouped grid mirroring `/writing`'s `YearBlock` pattern":
  1. Editorial header (`Photographs` bolded; or no specific nav highlight — TBD)
  2. Title block: "── The Archive · 04" + `Photographs.` 120px + blurb + 360×480 atmosphere photo `PHOTOS[1]` (`20230928 MSB_0114.jpg`).
  3. `<RuleStrong />`
  4. Year-grouped `<YearBlock>` entries from `PHOTOS_BY_YEAR` data. Each year's children = a grid of `next/image` plates with captions.
  5. Within each year: 3-column or 4-column grid of photo plates (single column on mobile). Each plate has `aspect-square` or `aspect-[4/3]` + `next/image` + optional caption text below.
- **D-23:** **Photo display style** — uses the same `saturate(0.92)` filter as Phase 10 homepage photographs. NO `mix-blend-difference` captions on /photos — captions are below the images (not overlaid).
- **D-24:** **Photo count grouping** — for the 6 existing photos, distribute by year (per D-11 mapping). With 1×2023 + 4×2024 + 1×2025, the page looks sparse — acceptable for v2.0 ship. Phase 11 ships with these 6 photos; future milestones add more.

### Shared Editorial Header
- **D-25:** **Editorial header** appears on `/` (Phase 10), `/writing`, `/events`, `/photos` — same 5-link nav. To avoid duplication:
  - **Option A:** Extract `<EditorialHeader>` to `src/components/home-v2/editorial-header.tsx` (path RESEARCH-recommended; matches `manifesto-reveal.tsx` already in `home-v2/`). Each archive page imports + renders it.
  - **Option B:** Move into `src/app/layout.tsx` and gate via `usePathname()` for the v2.0 routes (`/`, `/writing`, `/events`, `/photos`).
  - **Recommended: Option A** at `src/components/home-v2/editorial-header.tsx` (RESEARCH F5 confirmation). The `editorial/` directory is reserved for PRIM-01..07 primitives; `home-v2/` is for page-chrome / interaction components. Extract in Plan 11-03. Phase 12's sub-page restyle sweep can later move it to the layout if all sub-pages adopt the editorial header.
- **D-26:** **The v1.0 `<Navigation>` gate from Phase 10 D-42** stays. As we add `/writing`, `/events` (rewritten), `/photos`, the gate needs to skip the v1.0 nav on ALL FOUR routes, not just `/`. Plan 11-03 updates the pathname gate in `src/components/nav/navigation.tsx` to: `if (['/', '/writing', '/events', '/photos'].includes(pathname)) return null;` — same for `src/components/footer.tsx` and `MainOffset`.

### Preservation (Phase 8/9/10 carryforward)
- **D-27:** **Preserve from Phase 8 D-12 + Phase 9 D-15:** `src/components/animations/scroll-reveal.tsx`, `src/components/providers/lenis-provider.tsx`, `src/app/template.tsx`. Phase 11 doesn't touch them.
- **D-28:** **Preserve from Phase 8 D-13:** `/newsletter` route + its clickable carousel. Phase 11 REUSES the newsletter signup pipeline for /writing's footer — does not modify `/newsletter/page.tsx`.
- **D-29:** **Phase 9 primitives are imported as-is** — no new prop changes. `<RuleStrong>`, `<Rule>`, `<SectionLabel>`, `<ListRow>` (+ big), `<AllLink>`, `<IntroLink>`. NEW primitive `<YearBlock>` added in Plan 11-01.

### Build & Verification Gates (Phase 8/9/10 precedent)
- **D-30:** **Per-plan `npm run build` exit 0 before commit.**
- **D-31:** **Phase gate `vercel build --prod` deferred to Vercel preview deploy** on branch push (same pattern Phase 8/9/10 used).
- **D-32:** **HUMAN-UAT items:** visual confirmation of editorial fidelity on the 3 new archive pages at desktop + mobile. Vercel build green.

### Plan Slicing
- **D-33:** **5 plans, 2 waves:**
  - **Wave 1 (2 plans, parallelizable — different new files):**
    - **11-01-prim-year-block** — NEW `src/components/editorial/year-block.tsx`. `<YearBlock>` primitive with sticky-left-year layout (D-07..D-10).
    - **11-02-photos-data** — NEW `src/lib/photos.ts` with `PHOTOS_BY_YEAR` array + `groupPhotosByYear()` helper (D-11, D-12). Also adds `formatDayNumeral()` to `src/lib/dates.ts` (D-17).
  - **Wave 2 (3 plans, can parallelize since each creates/edits a different route):**
    - **11-03-writing-archive** — `src/app/writing/page.tsx` (NEW). `<EditorialHeader>` extraction + /writing layout. Updates `src/app/page.tsx` nav + AllLink targets to `/writing` (D-05). Updates `src/components/nav/navigation.tsx` + footer.tsx + MainOffset pathname gate to include `/writing` (D-26).
    - **11-04-events-archive** — `src/app/events/page.tsx` (REWRITE). /events layout with giant numerals + Past dense 3-col rows (D-20 REVISED). Plus: **delete `src/components/events/event-cards.tsx`** (RESEARCH F6 — orphan after rewrite; verify with `rg "event-cards"` first; safe to delete since Phase 10 homepage doesn't import it). Updates the v1.0 nav gate (if not already extended by 11-03 — first plan to ship in Wave 2 owns this).
    - **11-05-photos-archive** — `src/app/photos/page.tsx` (NEW). /photos year-grouped grid using `PHOTOS_BY_YEAR`. Updates v1.0 nav gate to include `/photos`.
  - **Wave 2 ordering:** Plans 11-03, 11-04, 11-05 each touch `src/app/page.tsx` for nav-link updates AND each touches the v1.0 chrome gate. To avoid conflict, EITHER serialize them via depends_on OR extract the nav-link-update + chrome-gate-update into Plan 11-03 first, then 11-04/05 don't touch those shared files. **Recommended:** Plan 11-03 owns the shared file edits (chrome gate update + page.tsx nav-link swap). Plans 11-04 and 11-05 only touch their respective route files. This makes Wave 2 parallel-safe IF 11-03 has shipped first — serialize 11-03 before 11-04 + 11-05.
  - **Final wave structure:**
    - Wave 1: 11-01, 11-02 (parallel)
    - Wave 2: 11-03 (depends on Wave 1)
    - Wave 3: 11-04, 11-05 (parallel; depend on 11-03 for the chrome gate)

### Claude's Discretion
- Exact JSDoc inside `<YearBlock>` and `<EditorialHeader>`.
- Whether to extract `<UpcomingRow>` (events) to a shared primitive — defer; inline.
- Exact photo year mapping if uncertain — default all 6 to 2025 with a SUMMARY note for Monty to correct.
- Sticky-year-label offset — start with `top-9` (36px to clear the editorial header padding) and adjust per visual test.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Contract (v2.0 source of truth)
- `.planning/research/editorial-redesign-handoff/README.md` §"3. /writing — Index" — canonical /writing layout spec.
- `.planning/research/editorial-redesign-handoff/README.md` §"4. /events — Index" — canonical /events layout with giant-numeral signature.
- `.planning/research/editorial-redesign-handoff/README.md` §"Open Questions / Decisions Deferred" — confirms `/photos` follows the `/writing` YearBlock pattern (safe default).
- `.planning/research/editorial-redesign-handoff/README.md` §"Components Catalog" — `YearBlock`, `UpcomingRow`, `ListRow` references.
- `.planning/research/editorial-redesign-handoff/README.md` §"Assets" — PHOTOS[3] (events hero) + PHOTOS[5] (writing hero) + PHOTOS[1] (/photos title block hero) mapping.

### Milestone & Phase Context
- `.planning/ROADMAP.md` §"Phase 11: Archive Pages" — 3 reqs + success criteria + risks (notably: "/photos has no Notion source; year grouping must be derived from photo metadata or filename convention — decide and document the source-of-truth at plan-check.").
- `.planning/REQUIREMENTS.md` §"Archive Pages" — ARCH-01..03 exact contracts.
- `.planning/RETROSPECTIVE.md` (v1.0) — lesson #2 (production-build-as-truth → D-30, D-31).

### Phase 8/9/10 Carryforward
- `.planning/phases/08-motion-subtractions/08-CONTEXT.md` D-12 + D-13 (preservation).
- `.planning/phases/09-design-tokens-editorial-primitives/09-CONTEXT.md` (tokens + primitive directory location).
- `.planning/phases/10-editorial-homepage/10-CONTEXT.md` D-42 (v1.0 chrome gate — Phase 11 extends to additional routes).
- `.planning/phases/10-editorial-homepage/10-CONTEXT.md` D-17, D-19, D-21 REVISED (Notion field names — `post.description`, `event.name`, `event.link`, `event.date`).
- `.planning/phases/10-editorial-homepage/10-VERIFICATION.md` (Phase 10's HUMAN-UAT precedent).

### Codebase Targets (verified at context-gather time)
- `src/app/page.tsx` — Phase 10 homepage; Plan 11-03 updates nav + AllLink hrefs.
- `src/app/blog/page.tsx` — v1.0 blog index; STAYS (Phase 12 owns).
- `src/app/blog/[slug]/page.tsx` — post permalink; UNTOUCHED.
- `src/app/events/page.tsx` — v1.0 events listing; REPLACED in place by Plan 11-04.
- `src/app/newsletter/page.tsx` — v1.0 newsletter signup; READ-ONLY for /writing's footer reuse.
- `src/components/nav/navigation.tsx` + `src/components/footer.tsx` + `src/components/main-offset.tsx` — Plan 11-03 extends the pathname gate to include `/writing`, `/events`, `/photos`.
- `src/components/editorial/*` — Phase 9 primitives, imported as-is. Plan 11-01 ADDS `year-block.tsx`.
- `src/lib/dates.ts` — Plan 11-02 adds `formatDayNumeral()`.
- `public/MSizzle-website-photos/` — 6 photos (verified). Plan 11-02 maps them to years.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **All 7 Phase 9 primitives** + Phase 10's `<ManifestoReveal>` are available. NEW primitives in Phase 11: `<YearBlock>` (D-07) and possibly `<EditorialHeader>` extraction (D-25).
- **`src/lib/dates.ts`** with `formatMonthYear` + `formatMonthDay` from Phase 10 — Plan 11-02 adds `formatDayNumeral`.
- **Phase 9 tokens** — all 10 palette + 12 typography utilities available.
- **`getPublishedPosts()`** for /writing; `getUpcomingEvents()` + `getPastEvents()` for /events; (no Notion source for /photos — Plan 11-02 hardcodes data module).
- **Existing `/newsletter` signup integration** — reused for /writing's footer (D-15).

### Established Patterns
- App Router + Server Components for all 3 archive pages (no client interactivity needed except the manifesto on `/`).
- Mobile-first Tailwind with `md:` overrides at 768px.
- Atomic per-task commits; `npm run build` exit 0 gate; phase-gate via Vercel preview.
- Inline-then-extract: components used in one place stay inline (e.g., `<UpcomingRow>` for events); only extract when ≥2 consumers exist (e.g., `<EditorialHeader>` for /, /writing, /events, /photos).

### Integration Points
- Phase 12 (sub-page restyle sweep) follows Phase 11. Once all 4 v2.0 routes ship (/ + /writing + /events + /photos), Phase 12 brings the v1.0 sub-pages (/about, /blog, /projects, /links, /prometheus, /newsletter) onto the warm-paper palette.
- Phase 13 QA: archive pages run through Lighthouse, mobile PSI, dark-mode FOUC, visual QA at 375px.

### Verified Clean
- `/photos` does NOT exist; Plan 11-05 creates it.
- `/writing` does NOT exist; Plan 11-03 creates it.
- `/events` exists at `src/app/events/page.tsx` (v1.0); Plan 11-04 replaces in place.
- 6 photos verified in `/public/MSizzle-website-photos/`.

</code_context>

<specifics>
## Specific Ideas

- **Page titles end in periods** per handoff: `Writing.`, `Events.`, `Photographs.` — the trailing period is part of the design language.
- **Atmosphere photo placement** (360×480) on each archive title block: writing = PHOTOS[5] (Patricof09.jpg), events = PHOTOS[3] (IMG_1075.JPG), photos = PHOTOS[1] (20230928 MSB_0114.jpg).
- **Giant day numerals on /events Upcoming** — 84px for featured, 56px for non-featured. This is the page's signature visual per handoff. Implementation: split month abbrev + year from day digit; render the digit large.
- **Sticky year labels** on /writing — desktop-only behavior per handoff. CSS `position: sticky; top: 36px` should cooperate with Lenis (Phase 8 D-12).

</specifics>

<deferred>
## Deferred Ideas

- **Notion-driven photo data source** — Phase 11 hardcodes 6 photos in `src/lib/photos.ts`. Future milestone introduces a Notion DB for photo metadata.
- **Restyle of `/blog/page.tsx`** — Phase 12 sub-page restyle sweep.
- **Restyle of `/blog/[slug]/page.tsx`** post permalinks — Phase 12.
- **Dark-mode variants** — explicitly dropped (Phase 9 D-04).
- **Newsletter signup pipeline refactor** — reuse existing; no second pipeline.
- **More photos** — 6 is sparse; future content addition (out of Phase 11 scope).
- **Per-archive RSS feeds** — `/writing/feed.xml`, `/events/feed.xml`. The existing `/blog/feed.xml` may still serve. Phase 12 or later.

</deferred>

---

*Phase: 11-Archive Pages*
*Context gathered: 2026-05-21*
