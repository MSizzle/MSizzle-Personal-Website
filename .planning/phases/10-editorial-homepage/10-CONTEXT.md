# Phase 10: Editorial Homepage - Context

**Gathered:** 2026-05-21
**Status:** Ready for planning
**Mode:** `--auto` (Claude auto-selected recommended option for every gray area; Claude Design editorial-redesign handoff used as canonical context per Monty's standing instruction from Phases 8 + 9)

<domain>
## Phase Boundary

Phase 10 is the **centerpiece** of v2.0 — the editorial homepage end-to-end. Rebuilds `src/app/page.tsx` from scratch using the warm-paper tokens (Phase 9) + 7 editorial primitives (Phase 9) + existing Notion data sources. Adds the one signature interaction (manifesto letter-stagger). Ships mobile parity at 390px reference.

**In scope (13 requirements):** HOME-V2-01 (header), HOME-V2-02 (manifesto), HOME-V2-03 (meta row), HOME-V2-04 (epigraph image), HOME-V2-05 (letter-style intro paragraph), HOME-V2-06 (BUILDING section), HOME-V2-07 (WRITING section), HOME-V2-08 (EVENTS section), HOME-V2-09 (PHOTOGRAPHS section), HOME-V2-10 (PERSONAL section), HOME-V2-11 (inverted ink footer), HOME-V2-12 (mobile single-column at 390px), MOTION-07 (manifesto letter-stagger interaction).

**Out of scope:**
- `/writing`, `/events`, `/photos` archive pages — Phase 11
- Sub-page restyle sweep — Phase 12
- `/newsletter` carousel — preserved as-is (Phase 8 D-13, Phase 9 D-16)
- The legacy `FeaturedUpcoming` / `UpcomingMini` / `PastEventCard` components in `src/components/events/event-cards.tsx` — kept available for the /events page until Phase 11 redesigns that route. Phase 10 builds its own homepage-specific featured event treatment.

</domain>

<decisions>
## Implementation Decisions

### Manifesto (HOME-V2-02 + MOTION-07)
- **D-01:** **Manifesto text = "BRING FIRE / TO HUMANITY."** (2 lines). Locked by ROADMAP.md HOME-V2-02. The handoff's default was "I BUILD / MACHINES THAT / THINK CAREFULLY." (3 lines) but Monty chose the Prometheus-themed alternative. Both alternates ("MAKE FEWER THINGS. / MAKE THEM MEAN MORE." and "SOFTWARE IS A WAY / OF READING THE WORLD.") are deferred — change in code if needed.
- **D-02:** **Manifesto styling:** Render as `<h1>` with `text-display` token (124px / 0.96 / -0.045em / 700, per Phase 9 D-06). Each line `white-space: nowrap` to prevent letters wrapping mid-word during stagger. Uppercase. Color `text-ink`.
- **D-03 (REVISED post-research):** **Manifesto reveal — `<ManifestoReveal>` client component.** New file `src/components/home-v2/manifesto-reveal.tsx`. Marked `'use client'`. Takes `lines: string[]` as prop. Splits each line into per-character `<m.span>` elements (NOTE: import `m` from `motion/react`, NOT `motion` — the project's `<MotionProvider>` uses `LazyMotion strict` per RESEARCH F3, which forbids the full `motion` namespace and requires the lightweight `m` component). `display: inline-block` on each `m.span`. Animates `translateY(110%) → 0` + `opacity 0 → 1`, per-letter delay `18ms × cumulative-char-index` (per RESEARCH skeleton — single accumulator across all lines, not per-line reset), transition `transform 700ms cubic-bezier(.2, .7, .2, 1)` + `opacity 500ms ease`. Container has `overflow: hidden` per line so letters slide up from below the visible line.
- **D-04:** **Reveal-once gate (per MOTION-07):** Check `sessionStorage.getItem('gsd:manifesto-shown')` on mount. If present, skip animation and render lines in final state immediately. If absent, run animation AND set the flag. Tab-scoped (sessionStorage, not localStorage) so opening a new tab re-plays the animation — this matches the handoff's intent.
- **D-05:** **Reduced-motion fallback (per MOTION-07):** Use `useReducedMotion()` from `motion/react`. When true, skip per-character stagger entirely and render lines with a single 300ms opacity fade. Set the sessionStorage flag in both branches.
- **D-06:** **Meta row (HOME-V2-03):** 32px wide × 1px tall hairline `<span className="inline-block h-px w-8 bg-ink align-middle">` + " EST. 2026 · WASHINGTON, D.C." in `text-meta` token (11px tracked 0.16em uppercase muted). Spacing: 56px below the manifesto.

### Header (HOME-V2-01)
- **D-07:** **Header layout:** `<header>` with `flex justify-between items-baseline` + padding `36px 160px 0` desktop / `28px 24px 0` mobile. Left: name as `<Link href="/" className="text-[15px] font-bold tracking-tight">Monty Singer</Link>`. Right: 5-link nav with gap-8 spacing using `text-nav` token (13px / 0.02em).
- **D-08:** **Nav links:** Building → `/projects`; Writing → `/blog` (Phase 11 updates to `/writing` when archive ships); Events → `/events`; About → `/about`; Links → `/links`. The "Building" label is `/projects` because that's the existing route — the handoff's "Building" maps to the projects section conceptually.

### Global Chrome Conflict (D-42, post-research patch)
- **D-42 (CRITICAL — post-research):** **`src/app/layout.tsx` currently wraps every route in a v1.0 `<Navigation />` (fixed top) + `<Footer />`.** If Plan 10-01 puts the new editorial header + footer inside `page.tsx`, the homepage double-renders both. **Fix in Plan 10-01 Task 0 (BEFORE the rest of Task 1):** Convert `src/components/nav/navigation.tsx` and `src/components/footer.tsx` to client components if not already, then gate them with `usePathname()`:
  ```tsx
  'use client';
  import { usePathname } from "next/navigation";
  export function Navigation() {
    const pathname = usePathname();
    if (pathname === "/") return null;   // v2.0 homepage renders its own chrome
    return ( /* existing v1.0 nav JSX */ );
  }
  ```
  Same pattern for `Footer`. This is surgical — v1.0 sub-pages (`/about`, `/blog`, etc.) keep their existing chrome until Phase 12 restyles them. The v2.0 homepage renders its own editorial header + ink footer self-contained. Phase 11 archive pages will need the same gate extension (or will be ported into a v2.0 layout group when they ship).
- **D-42a:** Also update `<main className="pt-16">` in `layout.tsx` to remove the v1.0 nav offset when on `/`. Either: (a) gate the className via the same pathname check, or (b) keep `pt-16` on all routes and have the v2.0 homepage account for it by starting its header at `pt-9` instead of `pt-16+pt-9`. **Recommended (a)** for cleaner CSS — homepage starts at `pt-9` (36px) without the v1.0 offset.

### Epigraph Image (HOME-V2-04)
- **D-09:** **Single full-width letterbox photo** using `next/image` with `priority` (above the fold, eligible for LCP optimization). Source: `/MSizzle-website-photos/000092530012.jpeg` (PHOTOS[0] per handoff). Aspect ratio 1120 × 540 (~ 2.07:1). `object-fit: cover` via `className="object-cover"`.
- **D-10:** **Figcaption row:** Below the image, `flex justify-between` with `text-meta uppercase text-muted`. Left: "Plate I — A year in motion · 2025–26". Right: "Photographed on film".

### Letter-Style Intro (HOME-V2-05)
- **D-11:** **Letter-style intro paragraph:** `text-body-lead` token (22px / 1.55 / -0.005em / 400). `max-width: 720px` via `max-w-[45rem]` (45 × 16px = 720px). Three inline `<IntroLink>` components (PRIM-06 from Phase 9):
  - "Prometheus" → "https://prometheus.today"
  - "Monty Monthly" → "/newsletter"
  - "essays" → "/blog"
- **D-12:** **Verbatim copy from handoff:**
  > "I'm Monty — a builder and a writer. I run **Prometheus**, a studio that designs custom AI pipelines for businesses that have outgrown off-the-shelf tools. Outside the studio I publish **Monty Monthly**, a newsletter of long-form **essays** on philosophy, technology, and the texture of an attentive life. Most of what I make is an attempt to slow something down enough to see it clearly."

### Section Pattern (HOME-V2-06..10)
- **D-13:** **Every content section uses this exact pattern:**
  1. `<RuleStrong />` (1px bold ink divider, top of section)
  2. 120px vertical space (`pt-32` or similar)
  3. `<SectionLabel numeral="NN — Topic">Section Title</SectionLabel>` (PRIM-03)
  4. 72px vertical space (`mt-18`)
  5. Section content
  6. Optional `<AllLink href="...">All X →</AllLink>` (PRIM-05)
  7. 120px vertical space below before next `<RuleStrong />`
- **D-14:** **Section labels + numerals (verbatim from handoff):**
  - BUILDING — `Building` / `01 — Studio`
  - WRITING — `Writing` / `02 — Library`
  - EVENTS — `Events` / `03 — Calendar`
  - PHOTOGRAPHS — `Photographs` / `04 — Archive`
  - PERSONAL — `Personal` / `05 — Person`

### BUILDING Section (HOME-V2-06)
- **D-15:** **BUILDING uses a 3-column grid:** `grid-cols-[180px_1fr_1fr]` desktop, single-column mobile. Two rows:
  - **Row 1 — Prometheus:** Tag column = "Active · AI Studio" (text-meta muted). Title column = "Prometheus" using `text-feature` token (44px / 1.05 / -0.03em / 700). Blurb column = handoff copy ("Recent work: orthodontic + hospitality clients...") with inline link `prometheus.today →` styled as `<AllLink>`.
  - **Row 2 — Selected Works:** Tag = `Archive · ${projects.length} projects` (live count from `getFeaturedProjects()`). Title = "Selected Works". Blurb = comma-separated project names from first 8 results of `getFeaturedProjects()` + " +N more" for the remainder; link `View all works →`.
- **D-16:** **Rows separated by `<Rule />` (PRIM-01, 1px hairline).** Each row has `py-9` (36px vertical padding) per handoff.

### WRITING Section (HOME-V2-07)
- **D-17 (REVISED post-research):** **WRITING renders 3 latest essays as `<ListRow big>` (PRIM-04 big variant):** Each row has `title` = `post.title`, `extra` = **`post.description`** (NOT `excerpt` or `subtitle` — RESEARCH verified actual BlogPost field name), `meta` = formatted date (e.g., "MAY 2026") parsed from `post.date`, `href` = `/blog/${post.slug}`. Plus `<AllLink href="/blog">All writing →</AllLink>` below.
- **D-18:** **Use `getPublishedPosts()` from `src/lib/notion.ts`** and `.slice(0, 3)`. Handle empty state: render "More essays coming soon." in `text-muted` if `posts.length === 0`.

### EVENTS Section (HOME-V2-08)
- **D-19 (REVISED post-research):** **Featured upcoming event** rendered via NEW inline component (no extraction to shared file unless planner identifies reuse): 3-column grid `grid-cols-[180px_1fr_auto]` desktop. Date column = `NEXT · ${month abbrev day}` in `text-meta uppercase text-ink` (parsed from `event.date` ISO timestamp via the new `src/lib/dates.ts` helper — RESEARCH-recommended new file) + below in muted: `${formattedTime} / ${event.location}`. Content column = `event.name` (NOT `event.title`) in `text-event-title` (36px / 1.1 / -0.02em / 700) + 16px muted `event.description` (max-w 540px). CTA column = `<AllLink href={event.link || '/events'}>RSVP →</AllLink>` (NOT `event.rsvpUrl` — actual EventItem field is `link` per RESEARCH).
- **D-20:** **No `animate-ping` indicator** anywhere (carryforward from Phase 8 MOTION-05). The featured event uses a static "NEXT" label, not the pulsing red dot.
- **D-21 (REVISED post-research):** **Two secondary events as `<ListRow>` (PRIM-04 non-big variant):** Take next 2 from `upcomingEvents.slice(1, 3)`. Each row: title = `event.name`, extra = `event.description`, meta = formatted date from `event.date` ISO. Plus `<AllLink href="/events">All events →</AllLink>` below.
- **D-21a (post-research):** **Date helper** — Plan 10-03 (writing + events) creates `src/lib/dates.ts` with two pure functions: `formatMonthYear(iso: string): string` returning `"MAY 2026"` style, and `formatMonthDay(iso: string): string` returning `"JUN 12"` style. Both accept ISO timestamps as input. Used by D-17 (writing dates), D-19 (featured event date), D-21 (secondary events dates).
- **D-22:** **Featured event copy fallback when no upcoming events:** Render the handoff's literal sample copy ("AI for Small Biz, Vol. II — A working evening for owner-operators...") as a placeholder OR display "No upcoming events." in `text-muted`. Recommended: muted empty state — don't ship hardcoded sample copy to production.

### PHOTOGRAPHS Section (HOME-V2-09)
- **D-23:** **12-column asymmetric CSS grid** per handoff layout spec:
  ```
  Plate A:  col-span-7  row-span-3   (large anchor, top-left)   → PHOTOS[0] (000092530012.jpeg)
  Plate B:  col-span-5  row-span-2   (top-right)                → PHOTOS[1] (20230928 MSB_0114.jpg)
  Plate C:  col-span-3  row-span-1                              → PHOTOS[2] (IMG_0028.jpeg)
  Plate D:  col-span-2  row-span-1                              → PHOTOS[3] (IMG_1075.JPG)
  Plate E:  col-span-5  row-span-2   (bottom-left)              → PHOTOS[4] (IMG_2129.jpeg)
  Plate F:  col-span-7  row-span-2   (bottom-right)             → PHOTOS[5] (Patricof09.jpg)
  ```
  Grid container: `grid grid-cols-12 grid-rows-[180px] gap-3` (180px auto-rows, 12px gap). NOTE: D-23 uses 12px = `gap-3` (Tailwind default). Per-plate utilities: `col-span-7 row-span-3` etc.
- **D-24:** **Plate caption overlay:** Each plate has an absolutely-positioned `<span>` with class `absolute left-3.5 bottom-3 text-[10px] uppercase tracking-[0.2em] font-bold text-paper mix-blend-difference`. Caption format: `No. 01` through `No. 06`. Note: `text-[10px]` and `tracking-[0.2em]` are arbitrary values used here because no existing token matches exactly (text-meta is 11px / 0.16em, text-label is 11px / 0.2em — neither is 10px). **Acceptable exception to Phase 9 D-09** since this is a one-off image-overlay style that won't be reused. Document the exception in plan SUMMARY for Phase 13 QA audit.
- **D-25:** **Image rendering:** `next/image` with `object-cover` and `filter: saturate(0.92)`. Image filenames in `/public/MSizzle-website-photos/` confirmed at context-gather time. Note: PHOTOS[1] filename `20230928 MSB_0114.jpg` contains a space — must URL-encode as `%20` in the src string.
- **D-26:** **`Photo Archive →` link** below the grid as `<AllLink href="/photos">Photo Archive →</AllLink>` (Phase 11 builds `/photos`; meanwhile this link is a 404 until that ships).

### PERSONAL Section (HOME-V2-10)
- **D-27:** **3-column grid** of cards (single column mobile, 3-col desktop). Cards (no images): top 1px ink border (`border-t border-ink`), padding `pt-8`, contents: 20px bold title (`text-list-title-home` adjusted to 20px), 14px muted description (use `text-caption text-muted` — slightly larger than handoff's 14px but a real token), tracked `Enter →` CTA (`<AllLink>`).
- **D-28:** **Three cards:**
  - Title "Photo Archive" / desc "A film-led survey of the year." / href `/photos`
  - Title "Links & Elsewhere" / desc "Where I show up online." / href `/links`
  - Title "About" / desc "The longer version." / href `/about`

### Inverted Ink Footer (HOME-V2-11)
- **D-29:** **Footer is `<footer>` with `bg-footer-bg text-footer-fg`** + padding `py-20 px-40` desktop (80px top, 56px bottom, 160px sides) / `py-14 px-7` mobile. 4-column grid desktop, single-column mobile.
- **D-30:** **Footer columns (verbatim from handoff):**
  - **Col 1 (colophon):** Tracked uppercase `MONTY SINGER` (`text-label text-footer-mute`). Then `<h2 className="text-section-feature mt-6 max-w-[20rem]">A calling card, not a billboard.</h2>` in `text-footer-fg`.
  - **Col 2 — Studio:** Title "Studio". Links: Prometheus → https://prometheus.today; Selected Works → /projects; Process Notes → /blog.
  - **Col 3 — Library:** Title "Library". Links: Monty Monthly → /newsletter; Essays → /blog; Reading List → /links.
  - **Col 4 — Person:** Title "About". Links: About → /about; Photo Archive → /photos; Contact → mailto:montydsinger@gmail.com.
  - Cols 2-4 use `<FooterCol>` (PRIM-07 from Phase 9).
- **D-31:** **Bottom row:** Below the 4-column grid with `mt-24 pt-7 border-t border-footer-rule` (1px ish rgba ink divider, 96px above, 28px below). Left: `© 2026 Monty Singer · Washington, D.C.` (text-meta uppercase). Right: social row — Twitter, GitHub, LinkedIn, Email — as inline `<Link>` (`text-meta uppercase text-footer-fg hover:text-footer-fg/70`).

### Mobile Parity (HOME-V2-12)
- **D-32:** **Mobile-first Tailwind classes.** Default classes target 390px reference; `md:` prefix (768px+) enables desktop. Specifically:
  - Header: 28px side padding, items still flex baseline.
  - Manifesto: `text-[56px] leading-[0.96] tracking-[-0.045em] md:text-display` — **note arbitrary value**: 56px isn't in the type-scale tokens. Acceptable exception (HOME-V2-12 specifies 56px exactly per handoff). Document in plan SUMMARY. **Mobile manifesto = 3 lines: `["BRING", "FIRE TO", "HUMANITY."]`** (RESEARCH-recommended — char-width estimate at Inter Bold 56px / -0.045em shows the 2-line "BRING FIRE" overflows the 334px content width at 390px reference; 3-line layout fits cleanly). Plan 10-06 can visually validate and override only if the perceptual result favors 2 lines.
  - Photographs: 2×2 grid on mobile (`grid-cols-2 gap-2`), 12-col asymmetric only at `md:`.
  - Footer: single column on mobile, each column gets `border-b border-footer-rule` divider.
  - All tap targets ≥ 44px (`min-h-11` Tailwind utility = 44px).

### Manifesto Interaction Plan Position
- **D-33:** **MOTION-07 is its own plan (the last in the phase).** Build the static homepage first (Plans 10-01 through 10-05), then the mobile sweep (Plan 10-06), then add the interaction (Plan 10-07). This lets `npm run build` validate the static structure before motion code is introduced.

### Plan Slicing
- **D-34 (REVISED post-research):** **7 plans, all serialized via `depends_on` on `src/app/page.tsx`** (every plan modifies the homepage file). **Plan 10-01 absorbs the global chrome gate as Task 0 (D-42).**
  - **Plan 10-01 — header-hero-manifesto:** D-42 global chrome gate (Task 0 — Navigation + Footer pathname gate, layout.tsx pt-16 gate) + HOME-V2-01 + HOME-V2-02 (static manifesto markup, no animation yet) + HOME-V2-03 + HOME-V2-04. Imports/file scaffold for all primitives. Static markup only — no interaction. **Visual checkpoint:** browse `/` and confirm header + 124px static manifesto + meta row + epigraph photo render correctly with NO double-header or double-footer.
  - **Plan 10-02 — intro-and-building:** HOME-V2-05 (letter-style intro) + HOME-V2-06 (BUILDING section, Prometheus + Selected Works).
  - **Plan 10-03 — writing-and-events:** HOME-V2-07 (WRITING — 3 latest essays as ListRow big + AllLink, using `post.description` per D-17 revised) + HOME-V2-08 (EVENTS — inline featured event with `event.name`/`event.link`/`event.description` per D-19/D-21 revised + 2 secondary ListRows + AllLink) + **NEW `src/lib/dates.ts`** helper (D-21a).
  - **Plan 10-04 — photographs:** HOME-V2-09 (12-col asymmetric grid + 6 plates + mix-blend captions + AllLink to /photos).
  - **Plan 10-05 — personal-and-footer:** HOME-V2-10 (3-card grid) + HOME-V2-11 (inverted ink footer with 4 cols + bottom row).
  - **Plan 10-06 — mobile-parity:** HOME-V2-12 (mobile breakpoint sweep across all sections; manifesto 3-line `["BRING", "FIRE TO", "HUMANITY."]` per D-32 revised; verify tap targets, single-column layouts, 2×2 photo grid, footer column dividers).
  - **Plan 10-07 — manifesto-stagger:** MOTION-07 (build `<ManifestoReveal>` client component using `m` from `motion/react` per D-03 revised + LazyMotion strict trap, wire to manifesto markup from Plan 10-01).
- **D-35:** **Wave structure: 1 wave, plans chained serially.** All 7 plans edit `src/app/page.tsx` (and Plan 10-07 also creates `src/components/home-v2/manifesto-reveal.tsx`). Each plan `depends_on: [previous]`. Each plan should leave the page in a buildable state — `npm run build` exits 0 after every commit.

### Existing Code (Phase 8/9 preservation carryforward)
- **D-36:** **Preserve from Phase 8 D-12 + Phase 9 D-15:** `src/components/animations/scroll-reveal.tsx`, `src/components/providers/lenis-provider.tsx`, `src/app/template.tsx`. DO NOT touch in Phase 10. The 200-300ms page-load fade in `template.tsx` wraps `<main>` automatically; the manifesto stagger fires after that fade resolves (or in parallel — they're orthogonal).
- **D-37:** **Preserve from Phase 8 D-13:** `/newsletter` clickable carousel — out of scope; Phase 12 governs.
- **D-38:** **Old homepage scaffolding to delete in Plan 10-01:** The current `src/app/page.tsx` has the post-Phase-8 v1.0 layout (header + hero + plain Writings/Works link lists + Events section using the legacy `FeaturedUpcoming`/`UpcomingMini`/`PastEventCard`). Plan 10-01 replaces it wholesale. The legacy `event-cards.tsx` components STAY in the codebase (still used by `/events` page until Phase 11 redesigns that route).

### Build & Verification Gates (Phase 8/9 precedent)
- **D-39:** **Per-plan `npm run build` exit 0 before commit.**
- **D-40:** **Phase gate `vercel build --prod` deferred to Vercel preview deploy** on branch push, per Phase 8 + 9 precedent (sandbox node_modules corruption documented in 08-HUMAN-UAT.md and 09-HUMAN-UAT.md).
- **D-41:** **Manifesto interaction verification = HUMAN-UAT.** The letter-stagger is perceptual — automated tests can confirm the `<ManifestoReveal>` component mounts and the sessionStorage flag is set, but the actual stagger experience requires a human in a browser. Plan 10-07's verifier marks this as `human_needed`; HUMAN-UAT.md captures the smoke test.

### Claude's Discretion
- Exact JSDoc comments inside `<ManifestoReveal>` — minimal per CLAUDE.md.
- File location for `<ManifestoReveal>`: `src/components/home-v2/manifesto-reveal.tsx` (new directory for homepage-specific components; alternative is `src/components/editorial/` but that's reserved for cross-page primitives per Phase 9 D-08).
- Whether to extract the inline `HomeFeaturedEvent` into its own file — defer; inline-then-extract pattern. If Phase 11 reuses the layout it can refactor.
- Exact pixel-perfect interpretation of handoff measurements that don't match Tailwind defaults (e.g., 160px outer padding ≈ `px-40` = 160px; 56px below manifesto = `mt-14` = 56px). Use exact values via Tailwind's spacing scale (each unit = 4px).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor, verifier) MUST read these before planning or implementing.**

### Design Contract (v2.0 source of truth)
- `.planning/research/editorial-redesign-handoff/README.md` §"Pages" → §"1. Homepage — Desktop (1440 reference width)" — top-to-bottom layout spec for 9 sections (matches D-13, D-14, D-15..D-31 verbatim).
- `.planning/research/editorial-redesign-handoff/README.md` §"Pages" → §"2. Homepage — Mobile (390 reference width)" — mobile parity spec (matches D-32).
- `.planning/research/editorial-redesign-handoff/README.md` §"Interactions & Behavior" → §"Manifesto reveal" — exact stagger implementation spec (D-03, D-04, D-05).
- `.planning/research/editorial-redesign-handoff/README.md` §"Design Tokens" + §"Typography" — token names used throughout (paper/ink/muted/rule + text-display/text-feature/etc.).
- `.planning/research/editorial-redesign-handoff/README.md` §"Components Catalog" — which primitives compose which sections.
- `.planning/research/editorial-redesign-handoff/README.md` §"Assets" — exact photo filenames + PHOTOS[0..5] mapping (D-23, D-25).

### Milestone & Phase Context
- `.planning/ROADMAP.md` §"Phase 10: Editorial Homepage" — 13 requirements + success criteria + risks.
- `.planning/REQUIREMENTS.md` §"New Homepage" — HOME-V2-01..12 exact contracts. §"Motion Budget" — MOTION-07 manifesto stagger contract.
- `.planning/RETROSPECTIVE.md` (v1.0) — lesson #2: production-build-as-truth (drives D-39, D-40).

### Phase 8 + 9 Carryforward
- `.planning/phases/08-motion-subtractions/08-CONTEXT.md` D-12 preservation list (still applies — D-36 here).
- `.planning/phases/08-motion-subtractions/08-CONTEXT.md` D-13 newsletter preservation (D-37 here).
- `.planning/phases/09-design-tokens-editorial-primitives/09-CONTEXT.md` — tokens + primitives shipped in Phase 9. D-08 primitive directory location.
- `.planning/phases/09-design-tokens-editorial-primitives/09-01-SUMMARY.md` — confirms 12 type-scale roles + 10 palette tokens live + v1.0 alias bridge active.
- `.planning/phases/09-design-tokens-editorial-primitives/09-09-SUMMARY.md` — confirms `/specimen` exists for design-QA reference while Phase 10 builds.

### Codebase Targets (verified at context-gather time)
- `src/app/page.tsx` (191 lines, current v1.0-stripped state) — Plan 10-01 rewrites wholesale; subsequent plans extend.
- `src/components/editorial/{rule,rule-strong,section-label,list-row,all-link,intro-link,footer-col}.tsx` — Phase 9 primitives, all available for import.
- `src/lib/notion.ts` (posts), `src/lib/notion-projects.ts` (projects), `src/lib/notion-events.ts` (events) — existing data sources, reused.
- `src/components/events/event-cards.tsx` — legacy components stay (used by /events). NOT imported by new Phase 10 homepage.
- `src/components/seo/json-ld.tsx` + `src/lib/seo/schemas.ts` — JsonLd / buildPersonSchema. Plan 10-01 preserves these in the new page.
- `public/MSizzle-website-photos/` — all 6 PHOTOS[0..5] files present (verified at context-gather).
- `src/app/template.tsx` (page-load fade, DO NOT TOUCH per D-36).
- `src/components/providers/lenis-provider.tsx` (Lenis wiring, DO NOT TOUCH per D-36).
- `motion` package (12.38.0) installed — needed for `<ManifestoReveal>` in Plan 10-07.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **All 7 Phase 9 primitives** (`Rule`, `RuleStrong`, `SectionLabel`, `ListRow` + `big` variant, `AllLink`, `IntroLink`, `FooterCol`) imported as needed.
- **Phase 9 tokens** — `text-display`, `text-feature`, `text-event-title`, `text-list-title`, `text-list-title-home`, `text-body-lead`, `text-caption`, `text-nav`, `text-label`, `text-meta`; `bg-paper`, `bg-ink`, `bg-footer-bg`, `text-ink`, `text-muted`, `text-footer-fg`, `text-footer-mute`, `border-ink`, `border-rule`, `border-rule-strong`, `border-footer-rule`.
- **`next/font` Inter** at weights 400/700 (Phase 9 D-17). Available globally.
- **`next/image`** for the epigraph + photographs grid (LCP optimization via `priority` on the epigraph).
- **Existing Notion data fetchers** in `src/lib/notion*.ts` — reused as-is.
- **JsonLd + buildPersonSchema** for SEO — preserved.
- **`motion/react`** package — for the manifesto stagger client component.

### Established Patterns
- App Router Server Components for static markup; client components only for interactivity (`<ManifestoReveal>` is the only client child).
- Tailwind v4 utility classes; cn helper at `@/utils/cn` for conditional class merging (only Plan 10-04 and 10-06 likely need this).
- Mobile-first responsive styles via Tailwind `md:` prefix (768px breakpoint).
- `try/catch` around each Notion fetcher to handle data-source failures gracefully (existing pattern in current page.tsx).
- `revalidate = 1800` for ISR (30 minutes).

### Integration Points
- Phase 11 (Archive Pages) builds `/writing`, `/events`, `/photos` — Phase 10's nav links and `<AllLink>` targets will become live then. Until then, `/writing` and `/photos` are 404s (acceptable for v2.0 ship); `/events` is the existing v1.0-stripped page.
- Phase 12 (Sub-page Restyle Sweep) updates `/about`, `/projects`, `/blog`, `/links`, `/newsletter` to inherit the warm-paper palette + editorial typography. The v1.0→v2.0 alias bridge in Phase 9 means these pages already render with the new colors; Phase 12 fine-tunes typography + layouts.
- Phase 13 (QA & GO/NO-GO) runs the homepage through Lighthouse + Visual QA + mobile PSI + dark-mode FOUC test.

### Verified Clean
- `src/app/globals.css` has the warm-paper @theme + alias bridge (Phase 9 shipped).
- All 7 editorial primitives exist and type-check (Phase 9 shipped).
- `next-themes` is unwired (Phase 9 D-04); dark-mode dropped for v2.0.
- `template.tsx` retains the 200-300ms page-load fade.
- 6 photo files present in `/public/MSizzle-website-photos/`.

</code_context>

<specifics>
## Specific Ideas

- **From the handoff (literal quote):** "*One signature interaction: a letter-stagger fade-up on the hero manifesto.*" — This is THE motion budget. Everything else stays static.
- **From the handoff:** Photography section uses `mix-blend-mode: difference` for captions so they stay legible over any image background. D-24 implements this.
- **From the handoff:** "Smooth scroll: Lenis stays as-is." — Phase 8 preserved Lenis wiring; Phase 10 inherits it. No scroll-triggered animations on the new homepage.
- **From ROADMAP HOME-V2-02 (locked):** Manifesto is "BRING FIRE / TO HUMANITY." (the Prometheus-themed alternate). Handoff's default was "I BUILD / MACHINES THAT / THINK CAREFULLY."
- **Verified at context-gather:** All 6 handoff photos exist in `/public/MSizzle-website-photos/`. Filenames preserve original casing + the space in `20230928 MSB_0114.jpg`.

</specifics>

<deferred>
## Deferred Ideas

- **Manifesto alternates** — `MAKE FEWER THINGS. / MAKE THEM MEAN MORE.` and `SOFTWARE IS A WAY / OF READING THE WORLD.` from the handoff. Swap in code if Monty wants.
- **Photograph data source generalization** — Phase 11's `/photos` route will likely introduce a filesystem or Notion-driven photo data source. Phase 10 hard-codes 6 filenames.
- **Extracting `<HomeFeaturedEvent>` to a shared component** — defer until Phase 11 or beyond identifies reuse.
- **Phase 11 link target updates** — when `/writing` and `/photos` archive routes ship, the homepage nav + AllLinks should swap from `/blog` → `/writing` and `/photos` becomes live (currently 404). Phase 11 (or a small follow-up plan) updates.
- **Dark-mode editorial palette** — explicitly dropped for v2.0 (Phase 9 D-04). Future milestone.
- **Mobile navigation menu** — handoff mobile shows the same 5 inline nav links; if the count grows, a hamburger menu would be needed. Defer.
- **Internationalization** — not in scope for v2.0; manifesto + section labels are English-only.

</deferred>

---

*Phase: 10-Editorial Homepage*
*Context gathered: 2026-05-21*
