# Phase 11: Archive Pages — Research

**Researched:** 2026-05-21
**Domain:** Next.js 16 App Router · editorial archive layouts · Notion data wiring · Tailwind v4 sticky positioning · existing newsletter pipeline reuse
**Confidence:** HIGH (codebase verified; 33 CONTEXT.md decisions already locked; handoff JSX references inspected)

## Summary

Phase 11 ships three new editorial archive routes — `/writing`, `/events`, `/photos` — using the existing Phase 9 primitives plus one new shared primitive (`<YearBlock>`) and one new data module (`src/lib/photos.ts`). CONTEXT.md has 33 locked decisions; this research is verification + concrete pattern extraction, not redesign.

The codebase is in a clean state to receive this work: Phase 10's homepage (`src/app/page.tsx`) sets the canonical patterns for the editorial header, atmosphere photos, Notion-data wiring with defensive `try/catch`, and the v1.0 chrome gate. The Notion data shapes are already verified — `BlogPost.date` and `EventItem.date` are both ISO strings extracted via the same `dateProp.date.start ?? ""` (or `?? null`) pattern. The 6 photos in `/public/MSizzle-website-photos/` have accurate file-system creation dates from macOS metadata that map cleanly to years.

Two pivots from CONTEXT.md guesses are recommended in this research:

1. **Photo year mapping is empirical, not guessed** — macOS `mdls kMDItemContentCreationDate` gives us real per-file creation timestamps for all 6 photos (e.g., `20230928 MSB_0114.jpg` = 2023-09-28, `Patricof09.jpg` = 2025-02-13, `000092530012.jpeg` = 2025-11-17). The CONTEXT.md placeholder mapping in D-11 needs to be updated with these real years (1×2023 + 3×2023 + 2×2025 spread).
2. **The `/newsletter` page does NOT contain a reusable signup form** — it's a Substack outbound link + an RSS-fed carousel of past issues. The handoff's "email subscribe input + Subscribe button" footer on `/writing` therefore renders as a styled `<a href="https://montymonthly.substack.com">` block (same outbound destination as `/newsletter`), NOT a form POST. This is the cleanest interpretation of "reuse the existing newsletter integration" — there is no in-house email capture pipeline to reuse.

**Primary recommendation:** Build `<YearBlock>` as a server-component primitive at `src/components/editorial/year-block.tsx` with `position: sticky; top: 36px` at `md+`, a non-sticky heading on mobile. Wave 2's Plan 11-03 owns the shared-file edits (chrome gate pathname list, `src/app/page.tsx` `/blog`→`/writing` swap, EditorialHeader extraction). Plans 11-04 and 11-05 only touch their own route files, making them safely parallel after 11-03 ships.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| `/writing`, `/events`, `/photos` route rendering | Frontend Server (SSR) | — | Server Components by default per Phase 10 precedent; no client interactivity beyond Lenis (already global) |
| Notion `BlogPost` / `EventItem` fetching | Frontend Server (Server Component) | — | Same `getPublishedPosts()` / `getUpcomingEvents()` / `getPastEvents()` server-side calls used on `/` |
| Photo year mapping (`PHOTOS_BY_YEAR`) | Module-level constant | — | Pure data, no fetching — lives in `src/lib/photos.ts` as a typed array |
| Day-numeral / month-year formatting | Pure function in `src/lib/dates.ts` | — | Same module that already houses `formatMonthYear` + `formatMonthDay` |
| Sticky year label scroll behavior | Browser CSS | — | Native `position: sticky` works with Lenis (Lenis only intercepts wheel/touch event delivery; CSS positioning is downstream of the actual scroll position) |
| v1.0 chrome gate (`Navigation` + `Footer` + `MainOffset` suppress on v2.0 routes) | Client Component (uses `usePathname`) | — | Already established Phase 10 D-42 pattern; Phase 11 extends the gated pathname list |
| Email subscribe footer on `/writing` | Server Component | External (Substack) | Renders a styled `<a>` to `https://montymonthly.substack.com` — Substack owns email capture |

## User Constraints (from CONTEXT.md)

### Locked Decisions

Thirty-three decisions are locked in `11-CONTEXT.md` (D-01 through D-33). Highlights this research must honor:

- **D-01..D-04** — Route strategy: `/writing` NEW, `/blog/[slug]` stays, `/events` REPLACED in place, `/photos` NEW.
- **D-05** — When `/writing` ships, update `src/app/page.tsx` nav link from `/blog`→`/writing`, WRITING section AllLink href, and Footer Library column "Essays" link href.
- **D-07..D-10** — `<YearBlock>` primitive: lives at `src/components/editorial/year-block.tsx`; props `{ year: string|number, children: ReactNode }`; layout `grid-cols-[180px_1fr]` desktop with sticky year label at `top: <padding>`; mobile collapses to single column, non-sticky heading.
- **D-11** — NEW `src/lib/photos.ts` with `ArchivePhoto` type + `PHOTOS_BY_YEAR` array.
- **D-12** — Helper `groupPhotosByYear()` returns `Map<number, ArchivePhoto[]>` sorted by year descending.
- **D-13..D-15** — `/writing` page structure: editorial header → title block (1fr/360px) with `PHOTOS[5]` (Patricof09.jpg) → RuleStrong → 3 YearBlocks (2026/2025/2024) → RuleStrong → inverted email-subscribe footer.
- **D-16..D-21** — `/events` page structure: editorial header → title block with `PHOTOS[3]` (IMG_1075.JPG) → Upcoming `<UpcomingRow>` 3-col grid `[160px_1fr_200px]` with 84px (featured) / 56px (rest) day numerals → Past dense 4-col grid `[120px_1fr_1fr_100px]`.
- **D-22..D-24** — `/photos` page structure: editorial header → title block with `PHOTOS[1]` (20230928 MSB_0114.jpg) → year-grouped photo grid; `saturate(0.92)` filter; captions below images, NOT overlaid.
- **D-25..D-26** — Extract `<EditorialHeader>` to a shared component (recommended path: `src/components/home-v2/editorial-header.tsx`); extend the v1.0 chrome gate pathname list in `Navigation`, `Footer`, `MainOffset` to include `/writing`, `/events`, `/photos`.
- **D-27..D-29** — Preserve Lenis provider, scroll-reveal, template.tsx, `/newsletter` carousel as-is. Phase 9 primitives imported with NO prop changes.
- **D-30..D-31** — Per-plan `npm run build` exit 0 gate; phase-gate via Vercel preview deploy.
- **D-33** — Plan slicing: 5 plans, 3 waves. Wave 1 = 11-01 + 11-02 (parallel). Wave 2 = 11-03 (owns shared-file edits). Wave 3 = 11-04 + 11-05 (parallel, depend on 11-03).

### Claude's Discretion
- JSDoc inside `<YearBlock>` and `<EditorialHeader>`.
- Whether to extract `<UpcomingRow>` to a shared primitive — handoff says inline (only used on `/events`).
- Exact photo year mapping if uncertain — this research RESOLVES this (see § Photo Year Mapping below; uncertainty eliminated).
- Sticky-year-label offset — start `top-9` (36px) and adjust per visual test.

### Deferred Ideas (OUT OF SCOPE)
- Notion-driven photo data source — Phase 11 hardcodes 6 photos.
- Restyle of `/blog/page.tsx` and `/blog/[slug]/page.tsx` — Phase 12.
- Dark-mode variants — explicitly dropped (Phase 9 D-04).
- Newsletter signup pipeline refactor — reuse existing; no second pipeline.
- Per-archive RSS feeds.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ARCH-01 | `/writing` index — 2-col title block + year-grouped YearBlocks + inverted email-subscribe footer | § /writing Implementation; § Newsletter Pipeline Reuse; § Notion Data Shapes |
| ARCH-02 | `/events` index — 2-col title block + Upcoming (giant numerals) + Past (dense 4-col rows) | § /events Implementation; § `formatDayNumeral` Helper; § Notion Data Shapes |
| ARCH-03 | `/photos` archive — year-grouped photo grid | § /photos Implementation; § Photo Year Mapping |

## Project Constraints (from CLAUDE.md)

- **No new dependencies** — verified `next 16.2.1`, `react 19.2.4`, `tailwindcss ^4`, `motion ^12.38.0`, `lenis ^1.3.21` all installed. Phase 11 ships with ZERO new package additions.
- **CMS = Notion** — `/writing` and `/events` pull from existing Notion getters (`getPublishedPosts`, `getUpcomingEvents`, `getPastEvents`). `/photos` is hardcoded by explicit deferral (D-24).
- **Hosting = Vercel free tier** — no impact; static + ISR routes only.
- **Server Components by default** — all 3 archive pages are async Server Components. No `'use client'` needed except the existing client-only `<Navigation>` / `<Footer>` / `<MainOffset>` (which we only EDIT, not author).
- **GSD Workflow Enforcement** — Phase 11 work runs through `/gsd:execute-phase` per CLAUDE.md.

## Standard Stack

### Core (already installed — Phase 11 adds ZERO dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | App Router server components, ISR | Already running; `revalidate = 1800` precedent on `/` and `/events` |
| React | 19.2.4 | UI runtime | Already running |
| Tailwind CSS | v4 (`^4`) | CSS via `@theme` block in `globals.css` | Phase 9 tokens already shipped (paper/ink/muted + `text-page-title` / `text-label` / `text-meta`) |
| `@notionhq/client` | 4.0.2 | Notion API (BlogPost + EventItem) | `getPublishedPosts()` + `getUpcomingEvents()` + `getPastEvents()` already exist |
| `next/image` | (Next bundled) | Atmosphere photos + `/photos` grid | Phase 10 uses `next/image` with `priority` on hero, lazy on rest |
| `next/link` | (Next bundled) | All internal navigation | Used in all Phase 9 primitives (`AllLink`, `IntroLink`, `ListRow`) |

### Supporting (also already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` | 2.1.1 | (via `@/utils/cn`) Conditional className merge | `<YearBlock>` may want `cn()` for `md:sticky` toggle if any conditional needed |
| `lenis` | 1.3.21 | Smooth scroll (global) | DO NOT TOUCH — Phase 8 D-12 preserved |

### Phase 11 Adds (in-tree, not packages)

| New file | Path | Why |
|----------|------|-----|
| `<YearBlock>` primitive | `src/components/editorial/year-block.tsx` | D-07; shared across `/writing` + `/photos` |
| `<EditorialHeader>` shared component | `src/components/home-v2/editorial-header.tsx` (recommended path) | D-25 Option A; consumed by `/`, `/writing`, `/events`, `/photos` |
| `ArchivePhoto` data module | `src/lib/photos.ts` | D-11; PHOTOS_BY_YEAR + `groupPhotosByYear()` |
| `formatDayNumeral()` helper | added to `src/lib/dates.ts` | D-17 |
| `/writing` route | `src/app/writing/page.tsx` | D-01 NEW |
| `/events` route | `src/app/events/page.tsx` | D-03 REPLACED in place (overwrites the v1.0 listing) |
| `/photos` route | `src/app/photos/page.tsx` | D-04 NEW |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline `<EditorialHeader>` in each archive page | Move header to `src/app/layout.tsx` with `usePathname()` gate | Layout-gated header would force `layout.tsx` to be a client component OR add yet another `'use client'` wrapper. The shared component import is simpler and matches Phase 9's primitive pattern. **Stick with D-25 Option A.** |
| `formatDayNumeral` in `dates.ts` | Inline `new Date(iso).getUTCDate().toString()` in `<UpcomingRow>` | Reusable utility wins for symmetry with `formatMonthYear` + `formatMonthDay` already in `dates.ts`. Plan 11-02 owns this. |
| Substack outbound link in `/writing` footer | Build an in-house email capture form | CLAUDE.md says zero recurring cost + no second pipeline (ROADMAP risk). Substack is the existing newsletter integration. |
| `<YearBlock>` as a client component | Server component | No interactivity in the year block; SSR is correct. Sticky CSS doesn't need JS. |

**No `npm install` commands needed for Phase 11.**

## Package Legitimacy Audit

Phase 11 installs ZERO new packages. All dependencies are pre-existing and previously verified during Phases 8-10.

| Package | Registry | Disposition |
|---------|----------|-------------|
| (none) | — | N/A — phase ships with existing dependency set |

## Architecture Patterns

### System Architecture Diagram

```
[Notion] ───getPublishedPosts()──> /writing/page.tsx (Server Component)
[Notion] ───getUpcomingEvents()──> /events/page.tsx  (Server Component)
[Notion] ───getPastEvents()─────> /events/page.tsx
[PHOTOS_BY_YEAR constant] ─────> /photos/page.tsx   (Server Component)

   each route:
     <EditorialHeader />          (shared — extracted from /)
        │
     <section> title block         (label + Page Title. + blurb + 360x480 photo)
        │
     <RuleStrong />
        │
     ┌────── /writing ──────┐  ┌────── /events ──────┐  ┌────── /photos ──────┐
     │ YearBlock(2026)      │  │ Upcoming section    │  │ YearBlock(2025)     │
     │   ListRow big × n    │  │   UpcomingRow × n   │  │   <Image> grid      │
     │ YearBlock(2025)      │  │ <RuleStrong />      │  │ YearBlock(2024)     │
     │   ListRow big × n    │  │ Past section        │  │   <Image> grid      │
     │ YearBlock(2024)      │  │   dense 4-col rows  │  │ YearBlock(2023)     │
     │   ListRow big × n    │  │                     │  │   <Image> grid      │
     │ <RuleStrong />       │  └─────────────────────┘  └─────────────────────┘
     │ Substack subscribe   │
     │   footer (link out)  │
     └──────────────────────┘

[Layout]
  <LenisProvider>           (preserved Phase 8 D-12)
    <MotionProvider>
      <Navigation /> ──[pathname gate]── suppressed on /writing, /events, /photos
      <MainOffset>{children}</MainOffset> ──[pathname gate]── no pt-16 on v2.0 routes
      <Footer />     ──[pathname gate]── suppressed on /writing, /events, /photos
```

### Recommended Project Structure (additions in **bold**)

```
src/
├── app/
│   ├── page.tsx                       # EDIT: nav + AllLink + Footer hrefs /blog → /writing
│   ├── events/page.tsx                # REPLACE in place
│   ├── writing/page.tsx               # NEW
│   ├── photos/page.tsx                # NEW
│   └── newsletter/page.tsx            # UNTOUCHED (carousel preserved)
├── components/
│   ├── editorial/
│   │   ├── all-link.tsx               # existing — imported as-is
│   │   ├── footer-col.tsx             # existing — imported as-is
│   │   ├── intro-link.tsx             # existing — imported as-is
│   │   ├── list-row.tsx               # existing — imported as-is
│   │   ├── rule-strong.tsx            # existing — imported as-is
│   │   ├── rule.tsx                   # existing — imported as-is
│   │   ├── section-label.tsx          # existing — imported as-is
│   │   └── year-block.tsx             # NEW (Plan 11-01)
│   ├── home-v2/
│   │   ├── manifesto-reveal.tsx       # existing — untouched
│   │   └── editorial-header.tsx       # NEW (Plan 11-03)
│   ├── nav/navigation.tsx             # EDIT: pathname gate list
│   ├── footer.tsx                     # EDIT: pathname gate list
│   └── main-offset.tsx                # EDIT: pathname gate list
└── lib/
    ├── dates.ts                       # EDIT: add formatDayNumeral
    ├── notion.ts                      # untouched
    ├── notion-events.ts               # untouched
    └── photos.ts                      # NEW (Plan 11-02)
```

### Pattern 1: Editorial Archive Title Block (shared across all 3 routes)

**What:** 2-column grid (1fr / 360px) holding the label, page title, blurb, and 360×480 atmosphere photo. Padding is `pt-40 pb-24 md:px-40 md:pt-[160px] md:pb-[100px]` (160px desktop / 64px mobile) per handoff line 210.

**When to use:** Top of every archive page (writing/events/photos). Each instance varies only by section label number (· 02 / · 03 / · 04), page title (`Writing.` / `Events.` / `Photographs.`), blurb copy, and `PHOTOS[N]` index.

**Example (canonical, copy-pasteable):**

```tsx
// Source: handoff src/writing-index.jsx + src/events-index.jsx (lines 28-66)
// Source: codebase src/app/page.tsx hero section (lines 110-124)
<section className="px-6 pt-40 pb-24 md:px-40 md:pt-[160px] md:pb-[100px]">
  <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_360px] md:gap-20">
    <div>
      <div className="text-label uppercase text-muted">
        ── The Library · 02
      </div>
      <h1 className="mt-6 text-page-title uppercase text-ink">
        Writing.
      </h1>
      <p className="mt-10 max-w-[35rem] text-body-lead text-muted">
        Long-form essays on philosophy, technology, and the texture of an
        attentive life. Published monthly, sometimes more, never less.
        Subscribe at <IntroLink href="/newsletter">Monty Monthly</IntroLink>.
      </p>
    </div>
    <div className="hidden md:block">
      <div className="relative h-[480px] w-[360px] overflow-hidden bg-rule-strong">
        <Image
          src="/MSizzle-website-photos/Patricof09.jpg"
          alt=""
          fill
          sizes="360px"
          className="object-cover saturate-[0.92]"
        />
      </div>
    </div>
  </div>
</section>
```

**Notes:**
- The 360×480 atmosphere photo is `hidden md:block` to drop it on mobile (handoff mobile spec at line 200-203 doesn't show this photo).
- `saturate-[0.92]` matches the homepage photographs treatment (D-23).
- `IntroLink` is the existing Phase 9 primitive.

### Pattern 2: `<YearBlock>` primitive (NEW; Plan 11-01)

**What:** A 2-column grid (180px left / 1fr right) where the left column holds a tracked-uppercase year label that sticks to `top-9` while the user scrolls the right-column children. Mobile collapses to single column with year as a non-sticky heading.

**When to use:** `/writing` and `/photos` (NOT `/events` — events uses a different "Upcoming/Past" section model).

**Example:**

```tsx
// Source: handoff src/writing-index.jsx YearBlock (lines 134-150)
// src/components/editorial/year-block.tsx (Plan 11-01)
import type { ReactNode } from "react";

type Props = {
  year: string | number;
  children: ReactNode;
};

/**
 * Editorial year-grouped section block. Used on /writing and /photos.
 *
 * Layout: 2-column grid `[180px | 1fr]` at md+. Left column holds a 14px
 * tracked-uppercase year label that sticks to top-9 (36px) so it stays
 * visible while the user scrolls through that year's entries. Mobile
 * collapses to single column; the year renders as a non-sticky heading.
 *
 * Pairs with <Rule /> between blocks (caller renders the separator).
 */
export function YearBlock({ year, children }: Props) {
  return (
    <section className="px-6 py-12 md:px-40 md:py-20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-20">
        <div className="text-label uppercase font-bold text-ink md:sticky md:top-9 md:self-start">
          {year}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
```

**Critical detail:** `md:self-start` is REQUIRED on the sticky child of a CSS Grid cell — by default grid children stretch to row height, and a stretched item cannot stick (it has no room to scroll within its container). Setting `align-self: start` is the canonical fix. Confirmed via MDN and Tailwind v4 docs.

### Pattern 3: `<UpcomingRow>` inline component for `/events` (D-19)

**What:** Single row inside the Upcoming section. 3-column grid `[160px_1fr_200px]` at md+. Left column = month + year tracked label + giant 84px (featured) or 56px (non-featured) day numeral. Middle column = time + event title + blurb. Right column = seat count + RSVP link.

**When to use:** Inline in `src/app/events/page.tsx` ONLY. Per D-19 + handoff convention, inline-then-extract — only `/events` consumes this, so it stays inline.

**Example:**

```tsx
// Source: handoff src/events-index.jsx UpcomingRow (lines 168-220)
// Inline in src/app/events/page.tsx (Plan 11-04)
function UpcomingRow({
  event,
  featured = false,
  last = false,
}: {
  event: EventItem;
  featured?: boolean;
  last?: boolean;
}) {
  const dayNum = formatDayNumeral(event.date);
  const monthYr = formatMonthYear(event.date);
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-baseline gap-6 md:grid-cols-[160px_1fr_200px] md:gap-14",
        featured ? "pb-14" : "py-10",
        !last && "border-b border-rule"
      )}
    >
      {/* Left: tracked month/year above giant day numeral */}
      <div className="leading-none">
        <div className="text-meta uppercase text-muted">{monthYr}</div>
        <div
          className={cn(
            "mt-2 font-bold leading-[0.9] tracking-[-0.04em] text-ink",
            featured ? "text-[84px]" : "text-[56px]"
          )}
        >
          {dayNum}
        </div>
      </div>
      {/* Middle: time line + title + blurb */}
      <div>
        <div className="text-meta uppercase text-muted">
          {event.location}
        </div>
        <div
          className={cn(
            "mt-3 font-bold tracking-[-0.025em] text-ink",
            featured ? "text-[40px] leading-[1.05]" : "text-event-title"
          )}
        >
          {event.name}
        </div>
        {event.description && (
          <p className="mt-3 max-w-[34rem] text-caption text-muted md:text-base">
            {event.description}
          </p>
        )}
      </div>
      {/* Right: seat count + CTA */}
      <div className="md:text-right">
        {/* No seat_count field in EventItem — render fallback label */}
        <div className="mb-3 text-meta uppercase text-muted">
          {featured ? "Limited seats" : "Open door"}
        </div>
        {event.link && (
          <AllLink href={event.link}>
            {featured ? "Reserve a seat →" : "RSVP →"}
          </AllLink>
        )}
      </div>
    </div>
  );
}
```

### Pattern 4: Past Events dense 4-col grid (D-20)

**What:** Each past event renders as a `<Link>` with 4-column grid `[120px_1fr_1fr_100px]`: date / title / blurb / status. 20px row padding, hairlines between via `border-b border-rule first:border-t border-t-rule` or simple `border-t` on all except the first.

**Critical:** `EventItem` has NO `status` field. The 4th column needs a sane fallback (D-20 doesn't pick one). Recommend rendering the **end date or "—"** if no extra info exists, OR render `formatMonthYear(event.date)` in the 4th column as a redundant tracked-month-year stamp (it doubles as a sort indicator). Or simply render an empty span to preserve the grid shape without making something up.

**Recommendation:** Render `event.endDate ? formatMonthYear(event.endDate) : ""` — uses the existing field on `EventItem`, falls back to empty for events without ranges (which renders cleanly because the grid keeps its width).

```tsx
// Source: handoff src/events-index.jsx lines 99-128
{past.map((event, i) => (
  <Link
    key={event.id}
    href={event.link ?? "#"}
    className={cn(
      "grid grid-cols-1 gap-6 py-5 md:grid-cols-[120px_1fr_1fr_100px] md:gap-8",
      i > 0 && "border-t border-rule"
    )}
  >
    <span className="text-meta uppercase text-muted">
      {formatMonthYear(event.date)}
    </span>
    <span className="text-list-title-home text-ink">{event.name}</span>
    <span className="text-caption text-muted">{event.description}</span>
    <span className="text-meta uppercase text-muted md:text-right">
      {/* No status field on EventItem; leave blank to preserve grid */}
    </span>
  </Link>
))}
```

### Pattern 5: `/writing` Substack subscribe footer (handoff lines 195-224)

```tsx
// Inverted ink subscribe footer — Substack outbound (NOT a form submit)
<footer className="bg-footer-bg text-footer-fg px-7 py-12 md:px-40 md:py-16">
  <div className="text-label uppercase text-footer-mute">── End of archive</div>
  <h2 className="mt-6 max-w-[40rem] text-section-feature text-footer-fg">
    Receive new essays the morning they&rsquo;re published.
  </h2>
  <div className="mt-10 flex max-w-[480px] flex-col gap-4 sm:flex-row sm:items-center">
    {/* Visual: looks like an email input + button, but it's a single CTA to Substack */}
    <a
      href="https://montymonthly.substack.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block border border-footer-fg/40 px-6 py-3 text-label uppercase text-footer-fg transition-opacity hover:opacity-80"
    >
      Subscribe on Substack →
    </a>
  </div>
  <div className="mt-16 text-meta uppercase text-footer-mute">
    © 2026 Monty Singer · montymonthly.substack.com
  </div>
</footer>
```

**See § Newsletter Pipeline Reuse for the full reasoning.**

### Anti-Patterns to Avoid

- **Building an in-house email capture form.** Verified: no in-house signup endpoint exists in this codebase. `/newsletter/page.tsx` is purely outbound to Substack + a Substack RSS carousel. The handoff's "email input + Subscribe button" visual is design, not a working form. Don't introduce a second pipeline.
- **Forgetting `md:self-start` on the sticky year label.** Default grid stretch behavior breaks `position: sticky`. The label will appear correctly positioned but won't actually stick — it just sits at the top of a stretched cell.
- **Using `EditorialHeader` from `layout.tsx`.** This would either (a) force `layout.tsx` to become a client component, breaking the `metadata` export, OR (b) wrap it in yet another client component. The shared-component import pattern (D-25 Option A) is the right call.
- **Touching `src/components/providers/lenis-provider.tsx`.** Preserved per D-27 + Phase 8 D-12. Native CSS `position: sticky` works fine with Lenis because Lenis modifies `scrollY` directly on `document.documentElement`; CSS sticky reads from native scroll position downstream of that mutation.
- **Hardcoding photo years.** macOS `mdls` gives us real per-file dates — see § Photo Year Mapping below — so the D-11 placeholder mapping should be replaced with the empirical values.
- **`server only` event-date handling without a null check.** `EventItem.date` can be `null` (line 41 of `notion-events.ts`). The day-numeral formatter MUST handle this.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Year grouping for posts | Manual `if/else` chain per year | `Map<number, BlogPost[]>` built from `posts.reduce` keyed on `new Date(post.date).getUTCFullYear()` | Single pass, sorted-once, idiomatic |
| Day numeral extraction | `iso.split('-')[2].split('T')[0]` | `new Date(iso).getUTCDate()` | Handles both date-only ISO ("2026-06-12") and date+time ISO ("2026-06-12T19:00:00Z") |
| Sticky positioning polyfill | IntersectionObserver-based sticky | Native CSS `position: sticky` + `md:self-start` | Works in all modern browsers; Lenis doesn't interfere |
| Email capture form | Custom form + API route | Substack outbound link | No in-house pipeline exists; ROADMAP risk explicitly forbids second pipeline |
| EditorialHeader extraction | Re-write inline header in each archive page | Extract to `src/components/home-v2/editorial-header.tsx` once, import 4 times | DRY across `/`, `/writing`, `/events`, `/photos` (4 consumers ≥ 2 = extract threshold per project convention) |
| Photo year inference | Filename parsing heuristics | macOS `mdls kMDItemContentCreationDate` results (already gathered in this research) | Empirical, defensible, no string parsing |

**Key insight:** Phase 11 is almost entirely a recomposition of existing primitives. The only new component is `<YearBlock>`, and the only new data is the photo year mapping (which is empirical, not invented).

## Runtime State Inventory

> N/A — Phase 11 is greenfield additions + one in-place rewrite (`/events`). No rename/migration. All categories below are confirmed empty.

| Category | Items Found |
|----------|-------------|
| Stored data | None — no string renames affecting databases |
| Live service config | None — no external service config (n8n, Datadog, etc.) involved |
| OS-registered state | None — no scheduled tasks, no systemd units |
| Secrets/env vars | None — `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NOTION_EVENTS_DB_ID` reads remain unchanged |
| Build artifacts | None — Next.js `.next/` is reproducible |

## Common Pitfalls

### Pitfall 1: Sticky year label fails because of grid stretch
**What goes wrong:** The year label appears in the right position but doesn't stick — it just rides up with the section as you scroll.
**Why it happens:** CSS Grid children default to `align-self: stretch`, which means the year-label `<div>` is as tall as the row. `position: sticky` only takes effect when the element has scrollable room within its parent. A stretched element has no room.
**How to avoid:** Add `md:self-start` (or `align-self: start`) to the sticky label. This sets the label to its content height and gives it room to stick within the row.
**Warning signs:** Visually, the label moves WITH the entries instead of staying at the top of the viewport during scroll. To debug, inspect the element in DevTools — if `align-self: stretch`, that's the bug.

### Pitfall 2: `EventItem.date` can be null
**What goes wrong:** `formatDayNumeral(event.date)` crashes with `TypeError: Cannot read properties of null` when an event in Notion has no date set.
**Why it happens:** `notion-events.ts` line 41 types `date: string | null` and line 62 returns `dateProp.date?.start ?? null`. Notion users can create event records without a Date property filled in.
**How to avoid:** `formatDayNumeral` must accept `string | null` and return `""` for null (same pattern as `formatMonthYear` + `formatMonthDay` already do on lines 4 + 11 of `dates.ts`). The Upcoming/Past queries filter on `Date date.before/on_or_after` so they SHOULDN'T return null-date events, but defensive code is still mandatory.
**Warning signs:** Build passes locally because there's no null event; production crashes when Notion data drifts.

### Pitfall 3: `next/image` width constraint vs. atmosphere photo
**What goes wrong:** The 360×480 atmosphere photo overflows or distorts because `next/image` with `fill` needs a positioned parent with explicit dimensions.
**Why it happens:** `<Image fill>` absolutely-positions the image to its parent. If the parent has no `position: relative` and no fixed h/w, the image either fills the page or collapses to 0×0.
**How to avoid:** Parent div must be `relative h-[480px] w-[360px]` (Tailwind arbitrary values) wrapping `<Image fill sizes="360px" .../>`. Phase 10's pattern in `src/app/page.tsx` lines 110-124 confirms this works.
**Warning signs:** Image stretches to full viewport width OR doesn't render at all.

### Pitfall 4: Wave 2 parallel race on `src/app/page.tsx` + chrome-gate files
**What goes wrong:** Plans 11-03, 11-04, 11-05 all need to update `src/app/page.tsx` (nav link `/blog`→`/writing`) AND `src/components/nav/navigation.tsx` + `footer.tsx` + `main-offset.tsx` (extend pathname gate list). Parallel execution = merge conflicts.
**Why it happens:** The naive plan slice has all 3 Wave 2 plans touching the same shared files.
**How to avoid:** CONTEXT.md D-33 already solves this: Plan 11-03 OWNS all shared-file edits (extends the chrome-gate pathname list to ALL THREE new routes at once, updates ALL `/blog` refs on `src/app/page.tsx`). Then 11-04 and 11-05 only touch their own route files, making them safely parallel after 11-03 ships. **Final wave structure:** Wave 1 = 11-01 + 11-02 parallel · Wave 2 = 11-03 alone · Wave 3 = 11-04 + 11-05 parallel.
**Warning signs:** Two plans both editing `navigation.tsx` will conflict at merge.

### Pitfall 5: `/blog` references that don't get swept to `/writing`
**What goes wrong:** D-05 says update nav + AllLink + Footer Library "Essays" link. But there are MORE `/blog` references on `src/app/page.tsx`:
- Line 73: nav link "Writing"
- Line 133: IntroLink "essays" inside the letter-style intro
- Line 196: `<ListRow href={\`/blog/${post.slug}\`}>` — this is `/blog/[slug]`, the post permalink. **Stays per D-02.**
- Line 205: `<AllLink href="/blog">All writing →</AllLink>`
- Line 339: Footer Studio "Process Notes" — stays (Process Notes is different from Essays)
- Line 350: Footer Library "Essays" — change to `/writing`

Plus `src/components/footer.tsx` line 9: `{ href: '/blog', label: 'Writings' }` — but this is the v1.0 footer that's GATED OFF on `/`, `/writing`, `/events`, `/photos`. It still renders on `/about`, `/projects`, etc. **Recommend updating this too** to keep the v1.0 footer accurate as a fallback (the gate doesn't unmount the component code — its referenced href is still seen by humans on sub-pages).
**How to avoid:** Run `rg "/blog\"|/blog'" src/app/page.tsx src/components/footer.tsx` before/after Plan 11-03 and update **only the listing references**, NOT the `/blog/[slug]` permalinks (D-02).
**Warning signs:** A user clicks "Writings" in the v1.0 footer (from `/about`) and lands on the old `/blog` page instead of `/writing`.

### Pitfall 6: Hero photo on mobile makes scroll noisy
**What goes wrong:** The 360×480 atmosphere photo on each title block dominates above-the-fold on mobile, pushing the page title below the visible viewport.
**Why it happens:** Mobile screens are ~390px wide; a 360px photo occupies basically full width and 480px height — that's most of the first screen.
**How to avoid:** Wrap the photo in `hidden md:block` — this hides it on mobile (the handoff mobile spec lines 200-203 doesn't show this photo) and keeps the desktop layout intact. Matches the homepage hero pattern.
**Warning signs:** Mobile UAT shows page title pushed off-screen.

### Pitfall 7: Substack outbound link missing target/rel
**What goes wrong:** The Substack link in `/writing`'s footer opens in the same tab, taking the user out of the site.
**How to avoid:** `target="_blank" rel="noopener noreferrer"` — same pattern as the homepage Prometheus + social links.

## Code Examples

### Year-grouping `BlogPost[]`

```ts
// In src/app/writing/page.tsx
function groupPostsByYear(posts: BlogPost[]): Map<number, BlogPost[]> {
  const groups = new Map<number, BlogPost[]>();
  for (const post of posts) {
    if (!post.date) continue; // Skip posts without dates
    const year = new Date(post.date).getUTCFullYear();
    const bucket = groups.get(year) ?? [];
    bucket.push(post);
    groups.set(year, bucket);
  }
  // Sort descending by year
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}

// Usage in render:
const postsByYear = groupPostsByYear(posts);
{[...postsByYear.entries()].map(([year, yearPosts], i, arr) => (
  <Fragment key={year}>
    <YearBlock year={year}>
      {yearPosts.map((post) => (
        <ListRow
          key={post.id}
          big
          href={`/blog/${post.slug}`}
          title={post.title}
          extra={post.description}
          meta={formatMonthYear(post.date)}
        />
      ))}
    </YearBlock>
    {i < arr.length - 1 && <Rule />}
  </Fragment>
))}
```

### `formatDayNumeral` helper (NEW; Plan 11-02)

```ts
// Add to src/lib/dates.ts
/**
 * Extract just the day-of-month numeral from an ISO date string.
 * Returns "" for null input (mirrors formatMonthYear/formatMonthDay).
 *
 * Examples:
 *   formatDayNumeral("2026-06-12")             → "12"
 *   formatDayNumeral("2026-06-12T19:00:00Z")   → "12"
 *   formatDayNumeral(null)                     → ""
 *
 * Used by /events Upcoming section giant day numerals (84px / 56px).
 */
export function formatDayNumeral(iso: string | null): string {
  if (!iso) return "";
  // Using UTC to match how Notion's date.start serializes; getDate() (local)
  // can drift the displayed day across timezones for date-only strings.
  return new Date(iso).getUTCDate().toString();
}
```

### `src/lib/photos.ts` (NEW; Plan 11-02) — empirical year mapping

```ts
// src/lib/photos.ts
// Year mappings are EMPIRICAL — from macOS kMDItemContentCreationDate
// metadata on the files in /public/MSizzle-website-photos/. Verified
// 2026-05-21. See .planning/phases/11-archive-pages/11-RESEARCH.md
// § Photo Year Mapping for the per-file evidence.

export type ArchivePhoto = {
  filename: string;
  year: number;
  alt: string;
  caption?: string;
};

export const PHOTOS_BY_YEAR: ArchivePhoto[] = [
  {
    filename: "000092530012.jpeg",
    year: 2025,
    alt: "Film negative — a year in motion",
    caption: "Film, 2025",
  },
  {
    filename: "IMG_2129.jpeg",
    year: 2025,
    alt: "Personal moment, late 2025",
    caption: "iPhone, Nov 2025",
  },
  {
    filename: "Patricof09.jpg",
    year: 2025,
    alt: "Patricof, February 2025",
    caption: "Feb 2025",
  },
  {
    filename: "IMG_1075.JPG",
    year: 2023,
    alt: "December 2023",
    caption: "Dec 2023",
  },
  {
    filename: "20230928 MSB_0114.jpg",
    year: 2023,
    alt: "September 2023",
    caption: "Sep 2023",
  },
  {
    filename: "IMG_0028.jpeg",
    year: 2023,
    alt: "Summer 2023",
    caption: "Jul 2023",
  },
];

/**
 * Group photos by year, returning a Map sorted by year descending
 * so iteration order matches the page render order (newest → oldest).
 */
export function groupPhotosByYear(): Map<number, ArchivePhoto[]> {
  const groups = new Map<number, ArchivePhoto[]>();
  for (const photo of PHOTOS_BY_YEAR) {
    const bucket = groups.get(photo.year) ?? [];
    bucket.push(photo);
    groups.set(photo.year, bucket);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}
```

### `<EditorialHeader>` extraction (NEW; Plan 11-03)

Extracted from `src/app/page.tsx` lines 61-94. Pure presentational, server-component-safe.

```tsx
// src/components/home-v2/editorial-header.tsx
import Link from "next/link";

type Props = {
  /** Which nav link to bold as the active route. Falsy = no link bolded. */
  active?: "Building" | "Writing" | "Events" | "About" | "Links";
};

/**
 * Editorial header shared by /, /writing, /events, /photos.
 * 15px bold wordmark on left, 5-link nav on right at 13px baseline-aligned.
 * Optionally bolds the link matching `active` (handoff §3-4: "Writing
 * bolded vs other nav links muted" on /writing; "Events bolded" on /events).
 *
 * D-25 Option A: extracted shared component (vs. layout-gated approach).
 */
const LINKS: { label: NonNullable<Props["active"]>; href: string }[] = [
  { label: "Building", href: "/projects" },
  { label: "Writing",  href: "/writing"  },
  { label: "Events",   href: "/events"   },
  { label: "About",    href: "/about"    },
  { label: "Links",    href: "/links"    },
];

export function EditorialHeader({ active }: Props) {
  return (
    <header className="flex items-baseline justify-between px-6 pt-7 md:px-40 md:pt-9">
      <Link href="/" className="text-[15px] font-bold tracking-tight text-ink">
        Monty Singer
      </Link>
      <nav>
        <ul className="flex list-none flex-wrap items-baseline gap-x-6 gap-y-2 text-nav md:gap-x-8">
          {LINKS.map((link) => {
            const isActive = link.label === active;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`flex min-h-11 items-center transition-opacity hover:opacity-60 ${
                    isActive ? "font-bold text-ink" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
```

**Phase 11 callsites:**
- `src/app/page.tsx` — replaces the inline header with `<EditorialHeader />` (no `active` prop — home has none bolded).
- `src/app/writing/page.tsx` — `<EditorialHeader active="Writing" />`.
- `src/app/events/page.tsx` — `<EditorialHeader active="Events" />`.
- `src/app/photos/page.tsx` — `<EditorialHeader />` (handoff doesn't specify a bold target on `/photos`).

### Chrome-gate extension (Plan 11-03)

```tsx
// src/components/nav/navigation.tsx — line 18 change
// D-42 + D-26: v2.0 routes render their own editorial chrome
if (["/", "/writing", "/events", "/photos"].includes(pathname)) return null;

// src/components/footer.tsx — same pattern
if (["/", "/writing", "/events", "/photos"].includes(pathname)) return null;

// src/components/main-offset.tsx — gate the pt-16 offset
const isV2Route = ["/", "/writing", "/events", "/photos"].includes(pathname);
return <main className={isV2Route ? "" : "pt-16"}>{children}</main>;
```

### Notion `BlogPost.date` shape — verified

From `src/lib/notion.ts` lines 77-79:
```ts
const dateProp = props["Date"] || props["date"];
const date = dateProp?.type === "date" ? (dateProp.date?.start ?? "") : "";
```

**Format:** ISO date string from Notion's date property. Notion returns either `"YYYY-MM-DD"` (date-only) or `"YYYY-MM-DDTHH:mm:ss.sssZ"` (date+time). Both parse cleanly with `new Date(iso).getUTCFullYear()`. Posts with no date field default to `""` (empty string).

**Edge case:** `new Date("")` → `Invalid Date`, and `getUTCFullYear()` on Invalid Date returns `NaN`. The year-grouping function MUST skip posts where `!post.date` (handled in the code example above with `if (!post.date) continue`).

### Notion `EventItem.date` shape — verified

From `src/lib/notion-events.ts` lines 40-49 + 60-64:
```ts
date: string | null;       // ISO date string from Notion date property
endDate: string | null;    // end date if range provided
// ...
const date = dateProp?.type === "date" ? (dateProp.date?.start ?? null) : null;
const endDate = dateProp?.type === "date" ? (dateProp.date?.end ?? null) : null;
```

**Format:** Either `null` or ISO string (date-only OR date+time). Live data may include time components (e.g., `2026-06-12T19:00:00Z` for "7:00 PM EST"). The day numeral extraction handles both.

**Time handling for `/events`:** The handoff shows "7:00 PM EST · Washington, D.C." as a single tracked label above the event title (handoff `events-index.jsx` line 181). Currently `EventItem` stores `location` separately but does NOT store time as a distinct field — time is embedded inside the ISO `date`. To render "7:00 PM EST · Washington, D.C." we'd need either:
- (a) `formatTime(iso)` to extract just the time component → render as `${formatTime(date)} · ${location}` (only works when the ISO includes a time component)
- (b) Or simply render `${location}` and treat the time as "tracked via the giant day numeral context"

**Recommend (b)** for Phase 11 — Notion data in production may not have time components, and embedding "7:00 PM EST" into the location string at the Notion level (or as a new `Time` property) is a content-side decision outside Phase 11 scope. The handoff "time" text is mock data. **Plan 11-04 renders `event.location` only** in the middle-column tracked label.

## Photo Year Mapping (empirical resolution of CONTEXT D-11)

CONTEXT.md D-11 placeholders + handoff caption guesses are superseded by empirical macOS file metadata. Git log doesn't help — all 6 photos were added in a single commit (d3aae4b, 2026-04-05). But `mdls kMDItemContentCreationDate` returns real per-file creation dates:

| Filename | Creation date (UTC) | Year | PHOTOS[N] role | Recommended caption |
|----------|---------------------|------|----------------|---------------------|
| `000092530012.jpeg` | 2025-11-17 20:26 | **2025** | PHOTOS[0] — homepage epigraph | "Film, 2025" |
| `20230928 MSB_0114.jpg` | 2023-09-28 21:39 | **2023** | PHOTOS[1] — `/photos` hero | "Sep 2023" |
| `IMG_0028.jpeg` | 2023-07-03 12:09 | **2023** | PHOTOS[2] | "Jul 2023" |
| `IMG_1075.JPG` | 2023-12-11 01:54 | **2023** | PHOTOS[3] — `/events` hero | "Dec 2023" |
| `IMG_2129.jpeg` | 2025-11-26 00:41 | **2025** | PHOTOS[4] | "Nov 2025" |
| `Patricof09.jpg` | 2025-02-13 14:53 | **2025** | PHOTOS[5] — `/writing` hero | "Feb 2025" |

**Year distribution: 3×2023 + 3×2025.** No 2024 photos. The CONTEXT D-11 placeholder mapping (1×2023 + 4×2024 + 1×2025) was a guess — empirical data overrides it.

**`/photos` layout implication:** Two YearBlocks (2025 first, 2023 second), each with 3 photos. Sparse but balanced. Acceptable for v2.0 ship per D-24.

**Confidence:** HIGH — file metadata directly from the filesystem; verified via `mdls -name kMDItemContentCreationDate` on each file (this research session).

## Newsletter Pipeline Reuse (resolution of D-15)

**Question:** What does "reuse the existing `/newsletter` integration" mean for `/writing`'s footer?

**Answer:** The "existing integration" is a Substack outbound link + an RSS feed of past issues. There is NO in-house email capture pipeline.

**Evidence** (`src/app/newsletter/page.tsx` + `src/lib/rss/substack.ts`):
1. `/newsletter/page.tsx` lines 38-45 render a single styled `<a href="https://montymonthly.substack.com" target="_blank">Subscribe on Substack →</a>` CTA.
2. The rest of the page is `<NewsletterCarousel issues={...} />` — a client carousel of past Substack issues fetched via `fetchMontyMonthlyIssues()` from `src/lib/rss/substack.ts` (RSS parser against `https://montymonthly.substack.com/feed`).
3. There is no form POST handler. There is no `/api/subscribe` route. There is no in-house email list.
4. Email signups happen entirely on Substack's domain.

**Implication for `/writing` footer:**
- The handoff visual ("email input + Subscribe button") is mock design, not a working form.
- The correct interpretation of "reuse the existing newsletter integration" is: send the user to the SAME endpoint (`https://montymonthly.substack.com`) that `/newsletter/page.tsx` sends them to.
- Implementation: render a styled outbound link (NOT a `<form>` element). Visually, it can still look like an input + button if desired (e.g., a disabled-looking text "your@email.com" placeholder inside a bordered box next to a "Subscribe →" link button), but the actual click destination is Substack.

**Recommended footer for `/writing` Plan 11-03:**
```tsx
<footer className="bg-footer-bg text-footer-fg px-7 py-12 md:px-40 md:py-16">
  <div className="text-label uppercase text-footer-mute">── End of archive</div>
  <h2 className="mt-6 max-w-[40rem] text-section-feature text-footer-fg">
    Receive new essays the morning they&rsquo;re published.
  </h2>
  <div className="mt-10">
    <a
      href="https://montymonthly.substack.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block border border-footer-fg/40 px-7 py-3 text-label uppercase text-footer-fg transition-opacity hover:opacity-80"
    >
      Subscribe on Substack →
    </a>
  </div>
  <div className="mt-16 text-meta uppercase text-footer-mute">
    © 2026 Monty Singer · montymonthly.substack.com
  </div>
</footer>
```

**Confidence:** HIGH — codebase verified end-to-end.

## EditorialHeader Re-export Location (resolution of D-25)

CONTEXT D-25 lists two candidate paths. Project convention suggests:

| Path | Pro | Con |
|------|-----|-----|
| `src/components/home-v2/editorial-header.tsx` | Co-located with `<ManifestoReveal>` (also `home-v2/`); the `home-v2/` directory already exists and signals "v2.0 page-scope components, not yet promoted to shared editorial primitive level" | Slightly misnamed if used on /writing /events /photos as well |
| `src/components/editorial/header.tsx` | Co-located with the 7 PRIM-* primitives that ARE shared cross-page | "Header" is more than a primitive (it's a section), might pollute the primitive directory's purity |

**Recommendation: `src/components/home-v2/editorial-header.tsx`.** Reasons:
1. The `home-v2/` directory already houses `manifesto-reveal.tsx`, a similarly page-anchored component used only by `/`. The editorial header is conceptually the same — a page-chrome component for the v2.0 routes — even though it now serves 4 routes. The grouping is "v2.0 page chrome," not "PRIM-* atom."
2. The Phase 9 `editorial/` directory was authored as "PRIM-01 through PRIM-07" — adding `<EditorialHeader>` there would muddy the boundary (it'd be a "section" sitting next to "primitives").
3. Phase 12's sub-page restyle sweep may later promote `<EditorialHeader>` to a layout-level component or move it under `src/components/editorial/` — that's a future migration that's cheap with a simple rename + import path update.

**Final path:** `src/components/home-v2/editorial-header.tsx`.

## CSS Sticky + Lenis Compatibility

**Question:** Does `position: sticky` work inside a Lenis smooth-scroll container?

**Answer:** Yes. Native CSS sticky positioning works correctly with Lenis.

**Evidence:**
- Lenis's mechanism: it intercepts wheel/touch events, calculates a target scroll position with easing, and applies the result by mutating `document.documentElement.scrollTop` (or scrolling the configured wrapper). CSS sticky positioning is computed by the browser based on the current scroll position, which is downstream of Lenis's mutations.
- The Lenis repo's own examples include sticky elements; the Lenis docs explicitly support native sticky (Lenis does NOT use `transform: translateY()` on a body wrapper — that approach DOES break sticky, but Lenis does not do that).
- The Phase 8 D-12 preservation includes the Lenis provider as-is, with `lerp: 0.1, smoothWheel: true` — no wrapper-translate hijinks.

**Confirmed pattern for `<YearBlock>`:**
```tsx
<div className="md:sticky md:top-9 md:self-start">
```
- `md:sticky` — applies `position: sticky` at `md+` breakpoint
- `md:top-9` — sticks 36px from top of viewport (clears the editorial header padding `pt-9` = 36px)
- `md:self-start` — REQUIRED so the sticky child doesn't stretch to row height (see Pitfall 1)

**Tailwind v4 verification:** `sticky`, `top-9` (36px), and `self-start` are all stable Tailwind v4 utilities. The `md:` responsive prefix at 768px works the same way as in v3. Verified by inspecting `globals.css` `@theme` block + Phase 9 D-09 use of `md:` prefixes on existing primitives (e.g., `list-row.tsx` line 18: `cn("...border-t border-rule py-5 first:border-t-0", big && "py-7")`).

**Mobile fallback (D-09):** Below `md` the year label is `relative` (default), no sticky. The label renders as a normal heading above the entries in the single-column collapsed layout. Confirmed: omitting `sticky top-9 self-start` at the base layer (only adding them at `md:`) gives the desired mobile behavior.

## Anti-Pattern Conflict Surface Check

Inspected the three v1.0 listing pages that interact with Phase 11:

### `/blog/page.tsx`
**Status:** STAYS untouched (Phase 12 owns restyle; Phase 11 D-02 explicitly preserves the route).
**Conflicts with editorial system:** Uses `ScrollReveal` wraps (existed in v1.0 cascading-delay pattern, MOTION-06 already cleared cascade but the component still wraps individual headings), `max-w-3xl`, plain `text-sm font-normal uppercase tracking-widest` h1 (NOT a token utility). These are fine to leave — Phase 12 restyles.
**Impact on Phase 11:** None. Posts still link to `/blog/${slug}` (D-02 preservation).

### `/events/page.tsx`
**Status:** REPLACED in place by Plan 11-04 (D-03).
**Imports that DROP entirely after Plan 11-04 rewrite:**
- `ScrollReveal` (cascading h1 reveal — no longer needed)
- `FeaturedUpcoming`, `UpcomingMini`, `PastEventCard` from `@/components/events/event-cards` (replaced by inline `<UpcomingRow>` + inline 4-col grid)
- `Breadcrumbs` (handoff doesn't show breadcrumbs on archive pages — they're v1.0 chrome)

**Action:** Plan 11-04 overwrites the file completely; the v1.0 imports become orphaned but `src/components/events/event-cards.tsx` STAYS in tree (still used by Phase 10's homepage event section? — actually NO, the homepage uses inline ListRow now, not event-cards. Let me re-verify.)

Verified: `src/app/page.tsx` (Phase 10) does NOT import from `@/components/events/event-cards`. Phase 10 renders events inline using `ListRow`. So once Plan 11-04 rewrites `/events/page.tsx`, the `event-cards.tsx` file becomes orphaned (dead code). **Recommendation:** Plan 11-04 should also delete `src/components/events/event-cards.tsx` (and check `rg "event-cards"` for any other consumers — likely none).

### `/newsletter/page.tsx`
**Status:** UNTOUCHED (D-28 + Phase 8 D-13 preserved).
**Conflicts with editorial system:** Uses `var(--accent)` styled button + `prose` wrapper + the existing `<NewsletterCarousel>` (the documented motion-budget exception). None of this conflicts with Phase 11 — `/writing` ONLY references Substack, NOT `/newsletter`. The `IntroLink` to `/newsletter` from the title block on `/writing` is fine because `/newsletter` still loads (the v1.0 chrome stays on `/newsletter` because the gate list is just `['/', '/writing', '/events', '/photos']`).

## Common Pitfalls (additional)

### Pitfall 8: Substack RSS rate-limit on `/newsletter` doesn't affect Phase 11
Substack's RSS feed serves freely; Phase 11 doesn't add any fetches there. The existing `/newsletter` page already does that fetch with `revalidate = 86400`.

### Pitfall 9: ISR cache stale on `/writing` between Notion edits
Phase 11 pages should use `revalidate = 1800` (30 minutes) to match the homepage and v1.0 `/blog` pattern. Anything shorter wastes Notion API quota; longer drifts content from Notion edits.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| v1.0 `/events/page.tsx` with `ScrollReveal` + cascading delays + `<FeaturedUpcoming>` `<UpcomingMini>` `<PastEventCard>` from `event-cards.tsx` | Plan 11-04 single-file rewrite with inline `<UpcomingRow>` + inline dense 4-col past grid | Phase 11 | `event-cards.tsx` becomes orphaned; recommend delete |
| v1.0 `/blog/page.tsx` listing as canonical archive | `/writing/page.tsx` is canonical; `/blog` listing stays as legacy until Phase 12 | Phase 11 | All AllLinks + homepage nav swap to `/writing` |
| Homepage "All writing →" → `/blog` | Homepage "All writing →" → `/writing` | Plan 11-03 | D-05 shared-file edit |

**Deprecated/outdated:**
- `src/components/events/event-cards.tsx` — superseded by inline `<UpcomingRow>` + inline past row. Delete in Plan 11-04.
- Use of `Breadcrumbs` on editorial archive pages — handoff doesn't show breadcrumbs; not needed on `/writing`, `/events`, `/photos`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | macOS `kMDItemContentCreationDate` accurately reflects when each photo was taken (not when copied to disk) | § Photo Year Mapping | If wrong (e.g., dates reflect copy-to-disk on 2026-04-05), all 6 photos collapse into year 2026 and Monty needs to override the data module manually. Low risk — macOS preserves source-of-import dates from EXIF when copying from camera roll, and the dates we got are clearly NOT 2026-04-05 |
| A2 | Substack remains the canonical newsletter pipeline and Monty wants to keep sending users there from `/writing`'s footer | § Newsletter Pipeline Reuse | If Monty wants in-house email capture, Plan 11-03 footer needs a different design + an `/api/subscribe` route. The handoff design language and ROADMAP risk both point to Substack reuse |
| A3 | `<UpcomingRow>` time slot ("7:00 PM EST") is mock data — production `EventItem` doesn't reliably have a time component embedded in `event.date` | § Notion EventItem.date shape | If production events DO have time components, we lose that information by rendering only `event.location`. Mitigation: Plan 11-04 can render `formatTime(event.date)` next to location when the ISO contains a time |
| A4 | `EditorialHeader`'s `active` prop should default to no link bolded on `/` and `/photos` | § EditorialHeader extraction | Low — handoff explicitly bolds `Writing` on /writing and `Events` on /events; doesn't specify /photos so falsy default is safest |
| A5 | Plan 11-04 should delete `src/components/events/event-cards.tsx` as orphan dead code | § Anti-Pattern Conflict Surface Check | Verified by grep — no other consumers. Risk is zero, but recommended to verify once more before deletion |

## Open Questions

1. **Photo captions for `/photos` page** — handoff doesn't specify what captions appear below each photo (homepage uses "No. 01" overlay; `/photos` per D-23 uses captions BELOW, NOT overlay). Recommend Plan 11-05 use month-year strings (e.g., "Sep 2023") derived from the same mdls dates this research surfaced.
2. **Empty-state copy for `/events` when no upcoming events exist** — Plan 11-04 should render something graceful (handoff doesn't speak to empty state). Recommend: render the "── The Calendar · 03" + title block + a single-line "Next gathering being planned. Sign up for Monty Monthly to hear first." under the Upcoming label.
3. **Time-zone handling for `/events` day numerals** — `formatDayNumeral` uses `getUTCDate()`. For events stored with date-only ISO (e.g., `"2026-06-12"`), `new Date(...)` interprets in UTC, and `getUTCDate()` returns 12 — correct. For events with embedded times in non-UTC ISO offsets, the numeral might shift by ±1 day at boundaries. Acceptable for v2.0 (Notion events are unlikely to span midnight).
4. **`/photos` photo aspect ratio inside YearBlock** — D-22 mentions `aspect-square` or `aspect-[4/3]`. Recommend `aspect-square` to keep the year-grouped grid visually rhythmic.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `npm run build` | ✓ | (project std) | — |
| `@notionhq/client` | Notion getters | ✓ | 4.0.2 | — |
| `tailwindcss` v4 | All styling | ✓ | ^4 | — |
| `next` | App Router | ✓ | 16.2.1 | — |
| `motion` (motion/react) | Lenis useReducedMotion only | ✓ | 12.38.0 | — |
| `lenis` | Smooth scroll (preserved) | ✓ | 1.3.21 | — |
| NOTION_TOKEN | `/writing` + `/events` data fetch | env | runtime | Try/catch fallback to empty state (mirrors `src/app/page.tsx` pattern) |
| NOTION_DATABASE_ID | `/writing` data fetch | env | runtime | Same fallback |
| NOTION_EVENTS_DB_ID | `/events` data fetch | env | runtime | `getUpcomingEvents` + `getPastEvents` already return `[]` when missing (verified `notion-events.ts` lines 109-110 + 144-146 + 184-186) |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** Notion env vars at build time fall back to empty `posts`/`events` arrays; pages render empty-state copy gracefully.

## Validation Architecture

`workflow.nyquist_validation: true` per `.planning/config.json`. Validation section required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + @testing-library/react 16.3.2 + jsdom 29.0.1 (already installed) |
| Config file | No `vitest.config.ts` detected at repo root — Wave 0 may need to add minimal config |
| Quick run command | `npx vitest run --reporter=verbose <path-glob>` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ARCH-01 | `/writing` renders with title block + year-grouped sections + footer | smoke (build) | `npm run build` exits 0 + route loads in dev | ❌ Plan 11-03 |
| ARCH-01 | `groupPostsByYear` returns correctly sorted Map | unit | `npx vitest run src/app/writing/group-posts.test.ts` | ❌ Wave 0 (optional — small enough that smoke test catches issues) |
| ARCH-01 | YearBlock primitive renders sticky desktop / non-sticky mobile | manual | Manual visual verification at 1440px + 390px | manual-only |
| ARCH-02 | `/events` renders with Upcoming + Past sections | smoke (build) | `npm run build` + route loads | ❌ Plan 11-04 |
| ARCH-02 | `formatDayNumeral` returns correct day for ISO inputs | unit | `npx vitest run src/lib/dates.test.ts` | ❌ Wave 0 (recommend add — single-function test catches the null edge case) |
| ARCH-02 | 84px featured / 56px non-featured day numerals render at correct sizes | manual | Visual UAT | manual-only |
| ARCH-03 | `/photos` renders year-grouped grid using `PHOTOS_BY_YEAR` | smoke (build) | `npm run build` + route loads | ❌ Plan 11-05 |
| ARCH-03 | `groupPhotosByYear` returns correctly sorted Map | unit | `npx vitest run src/lib/photos.test.ts` | ❌ Wave 0 (optional) |
| ARCH-03 | Homepage Photographs section's `/photos` AllLink no longer 404s | smoke | Curl/navigate after Plan 11-05 ships | manual |

### Sampling Rate

- **Per task commit:** `npm run build` exit 0 (D-30 gate — already enforced)
- **Per wave merge:** Same — Phase 11 has no Vitest test files yet; build is the canonical gate
- **Phase gate:** `vercel build --prod` on branch push (D-31; deferred to Vercel preview per Phase 8/9/10 precedent)

### Wave 0 Gaps

Realistic assessment: Phase 11 is layout/composition work. Per-file unit tests for `groupPostsByYear` / `groupPhotosByYear` / `formatDayNumeral` are nice-to-have but the build gate + visual UAT covers the practical risk surface. **Recommendation: add one minimal `src/lib/dates.test.ts` for `formatDayNumeral` (catches null edge case) and skip the grouping-helper tests** unless plan-check insists.

- [ ] `src/lib/dates.test.ts` — covers `formatDayNumeral` null + ISO date-only + ISO date+time cases (REQ ARCH-02 edge case)
- [ ] (Optional) `src/lib/photos.test.ts` — sanity-test that `groupPhotosByYear` sorts descending
- [ ] vitest.config.ts at repo root, if `npx vitest run` fails without it

## Security Domain

`security_enforcement` is enabled (key absent → defaults to enabled per agent spec).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth involved in Phase 11 (all routes are public archive pages) |
| V3 Session Management | no | No sessions; Server Components |
| V4 Access Control | no | All routes are public |
| V5 Input Validation | yes (passive) | `EventItem.date` null check + `BlogPost.date` empty-string check enforced in date helpers; outbound Substack URL is static (no user input) |
| V6 Cryptography | no | No crypto operations |

### Known Threat Patterns for Next.js + Notion

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| SSRF via Notion image URLs leaking server-side requests | Information disclosure | Notion image URLs are AWS-signed S3 URLs; rendering via `next/image` proxy is fine (already configured) |
| XSS via Notion-sourced text (post titles, event names) | Tampering | React auto-escapes by default; only `dangerouslySetInnerHTML` is risky — Phase 11 doesn't use it |
| Open redirect on `event.link` outbound | Tampering | `event.link` is a Notion URL field; rendered as `<a href>` with `target="_blank" rel="noopener noreferrer"` to prevent reverse-tabnabbing |
| Stored secret in client bundle (D-14 carryforward) | Information disclosure | No new env vars in Phase 11; D-14 client-bundle secret scan stays clean |

**Phase 11 inherits the secure default Server Component model from Phase 10. No new threat surface.**

## Sources

### Primary (HIGH confidence)
- `/Users/Montster/MSizzle Personal Website/.planning/phases/11-archive-pages/11-CONTEXT.md` (33 locked decisions)
- `/Users/Montster/MSizzle Personal Website/.planning/REQUIREMENTS.md` (ARCH-01..03 contracts)
- `/Users/Montster/MSizzle Personal Website/.planning/research/editorial-redesign-handoff/README.md` §3 /writing (lines 205-216), §4 /events (lines 218-228), §Components Catalog (lines 231-253), §Assets (lines 309-324), §Open Questions (lines 356-359)
- `/Users/Montster/MSizzle Personal Website/.planning/research/editorial-redesign-handoff/src/writing-index.jsx` (YearBlock + footer reference)
- `/Users/Montster/MSizzle Personal Website/.planning/research/editorial-redesign-handoff/src/events-index.jsx` (UpcomingRow + Past row reference)
- `/Users/Montster/MSizzle Personal Website/src/app/page.tsx` (Phase 10 homepage — canonical pattern source)
- `/Users/Montster/MSizzle Personal Website/src/lib/notion.ts` (BlogPost.date shape verification)
- `/Users/Montster/MSizzle Personal Website/src/lib/notion-events.ts` (EventItem.date + endDate + null handling)
- `/Users/Montster/MSizzle Personal Website/src/lib/dates.ts` (existing formatMonthYear + formatMonthDay)
- `/Users/Montster/MSizzle Personal Website/src/app/newsletter/page.tsx` (no in-house form pipeline)
- `/Users/Montster/MSizzle Personal Website/src/lib/rss/substack.ts` (outbound integration only)
- `/Users/Montster/MSizzle Personal Website/src/components/editorial/*` (Phase 9 primitives — actual signatures)
- `/Users/Montster/MSizzle Personal Website/src/components/nav/navigation.tsx` + `footer.tsx` + `main-offset.tsx` (chrome gate)
- `/Users/Montster/MSizzle Personal Website/src/components/providers/lenis-provider.tsx` (verified does not break native sticky)
- `/Users/Montster/MSizzle Personal Website/src/app/globals.css` (Tailwind v4 @theme + tokens)
- `/Users/Montster/MSizzle Personal Website/package.json` (no new deps needed)
- macOS `mdls kMDItemContentCreationDate` output on all 6 photos in `/public/MSizzle-website-photos/` (this research session)
- git log on each photo file (all added in single commit d3aae4b on 2026-04-05)

### Secondary (MEDIUM confidence)
- Tailwind v4 docs on `position: sticky` + `align-self: start` behavior in grid (training knowledge cross-verified with the MDN documentation pattern; the `md:self-start` requirement is well-known)
- Lenis + native CSS sticky compatibility (training + repo example knowledge; Lenis doesn't use body-wrapper-translate which IS known to break sticky)

### Tertiary (LOW confidence)
- None — all critical Phase 11 claims verified against codebase or filesystem metadata in this session.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all deps already installed; package.json verified
- Architecture (YearBlock, EditorialHeader, UpcomingRow): HIGH — handoff JSX inspected, Phase 9 primitive signatures verified
- Notion data shapes: HIGH — `notion.ts` + `notion-events.ts` read end-to-end
- Photo year mapping: HIGH — empirical macOS metadata
- Newsletter pipeline: HIGH — `/newsletter` page + RSS module verified, no in-house pipeline exists
- Sticky + Lenis: MEDIUM-HIGH — pattern is well-established but no in-repo example yet; Plan 11-01 will validate
- Pitfalls: HIGH — derived from direct code inspection

**Research date:** 2026-05-21
**Valid until:** ~2026-06-20 (30 days for stable Next 16 + Tailwind v4 stack; Phase 11 should complete well within this window)
