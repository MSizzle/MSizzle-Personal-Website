# Phase 12: Sub-page Restyle Sweep — Context

**Gathered:** 2026-05-21
**Status:** Ready for planning
**Source:** Synthesized from ROADMAP + REQUIREMENTS + Phase 9/10/11 SUMMARYs + operator UAT feedback (no discuss-phase Q&A — operator requested forward motion with no clarifying questions)

<domain>
## Phase Boundary

Apply the v2.0 warm-paper editorial design language (Phase 9 tokens + primitives, Phase 10/11 layout vocabulary) to the **6 sub-pages that escaped the Phase 10/11 sweep**: `/about`, `/projects` (index + `[slug]`), `/blog` (index + `[slug]`), `/links`, `/prometheus`, `/newsletter`.

**What's in scope:** palette swap, typography pass, hairline rules, drop v1.0 card chrome (rounded corners, shadows, gradient buttons, glass effects), token-driven spacing.

**What's out of scope (Phase 13):** Lighthouse perf, secret scan, dark-mode FOUC, GO/NO-GO doc.

**What's explicitly NOT a restyle:** layout/structure changes. Breadcrumbs stay on /about. Project cards stay on /projects. Tag filter stays on /blog. Link list stays on /links. FAQ stays on /prometheus. **One exception:** `/newsletter` is permitted a structural redesign per operator feedback (see D-NEWSLETTER-REDESIGN below).

The 6 sub-pages keep v1.0 chrome (Nav + Footer + MainOffset pt-16) — they were intentionally excluded from the Phase 11 D-26 chrome gate. Don't change that.

</domain>

<decisions>
## Implementation Decisions

### Locked decisions (do not litigate during planning)

- **D-01 — Restyle Recipe lands first.** Per ROADMAP risk note, palette-token drift across the 6 routes is the dominant risk. Plan 12-01 ships a single-page "restyle recipe" document (or component-level codification) that subsequent route plans cite. This is non-negotiable — every other Phase 12 plan must reference the recipe.

- **D-02 — Use Phase 9 tokens, period.** No new tokens introduced. Anything not covered by `--color-paper`, `--color-ink`, `--color-muted`, `--color-faint`, `--color-rule`, `--color-rule-strong`, `--color-footer-*` + the existing type-scale utilities (`text-page-title`, `text-section-feature`, `text-list-title`, `text-list-title-home`, `text-body-lead`, `text-caption`, `text-label`, `text-meta`, `text-nav`, `text-event-title`) is out of scope. Arbitrary values (`text-[14px]`, custom hex) are forbidden unless flagged in the recipe as an explicit token gap to address.

- **D-03 — v1.0 vocabulary to delete on every route:**
  - `rounded-*` (all rounded corners — except `rounded-full` for genuine pill shapes, decided per-case in the recipe)
  - `shadow-*` (drop all shadows)
  - `bg-[var(--bg)]`, `border-[var(--border)]`, `text-[var(--accent)]` (v1.0 CSS-var aliases — swap to Phase 9 tokens)
  - `bg-gradient-*`, `backdrop-blur-*` (no glass effects)
  - Hover scale transforms (`hover:scale-*`, `group-hover:scale-*`) — drop or replace with opacity transitions
  - `font-bold` on body text (use type-scale roles, not weight overrides)

- **D-04 — Preserve URL structure.** /blog/[slug] permalinks stay (Phase 11 D-02 carryforward). /projects/[slug] permalinks stay. Restyling does NOT change href shapes, OG image generation paths, sitemap entries, or feed.xml.

- **D-05 — v1.0 chrome (Nav + Footer + MainOffset) stays visible on all 6 routes.** Phase 11 D-26 chrome gate covers only [/, /writing, /events, /photos]. The 6 Phase 12 routes intentionally retain v1.0 chrome — restyling the v1.0 Nav/Footer is OUT of scope (those components are shared and were lightly cleaned in Phase 11, D-26 + footer LINKS).

- **D-06 — Breadcrumbs preserved.** `/about` uses `<Breadcrumbs>` per RESTYLE-01 success criteria. `/newsletter` also uses it. The component stays; if its visual treatment needs token alignment, the recipe handles it once.

- **D-07 — Photo treatment matches Phase 10/11.** Any photos on these pages use `saturate-[0.92]` filter (matches HOME_PHOTOS treatment from Phase 10 and atmosphere photos from Phase 11).

- **D-08 — Inter (not Helvetica Neue) is the font.** The handoff doc specifies Helvetica Neue → Helvetica → Arial, but the project ships Inter via `next/font/google`. Phase 9 D-01 already made this swap. The recipe should NOT re-introduce Helvetica Neue.

- **D-NEWSLETTER-REDESIGN — `/newsletter` gets a structural redesign, not just a restyle.** RESTYLE-06's original success criterion ("existing carousel preserved as the one clickable-carousel exception") is **overridden by operator feedback on 2026-05-21**:

  > "The Monty Monthly page should display the issues more prominently. Currently it's a small carousel with rounded edges. The issues should be larger, take up more of the page. Make it feel **full** of all the different Monty Monthlys."

  Captured at `.planning/todos/pending/2026-05-21-newsletter-page-issues-prominence-redesign.md`. The /newsletter restyle plan must:
  1. Break the issue gallery out of the `max-w-[66ch]` reading column (intro copy + Subscribe CTA can stay in the narrow column; the gallery expands to full editorial page width like Phase 11 archive pages)
  2. Replace the horizontal-scroll carousel with a multi-row grid that shows all issues at once
  3. Bigger thumbnails (current aspect-[16/9] @ 384px wide → poster-feel, sized per recipe)
  4. Drop card chrome (`rounded-lg`, `border`, `shadow-sm`, `bg-[var(--bg)]`) for Phase 9 editorial tokens (flat, paper-bg, `border-rule` hairlines, no shadow)
  5. Optionally bump `fetchMontyMonthlyIssues(10)` to a higher count once the grid can absorb it

  **Carousel exception is REMOVED for /newsletter** — the operator decision invalidates that ROADMAP note. `NewsletterCarousel` component can be repurposed or deleted in favor of a server-rendered grid (no client interactivity required if the scroll arrows disappear).

- **D-DEFER-/SPECIMEN-CLEANUP — /specimen stays as-is.** It's a noindex internal page from Phase 9; restyling is unnecessary and out of scope (Phase 13 will revisit if needed).

- **D-DEFER-/BLOG-INDEX-LAYOUT-OVERHAUL — /blog index gets palette + typography only, no structural change.** Even though `/writing` is the canonical archive now, `/blog` index continues to exist (Phase 11 D-02) as a tag-filterable archive of all posts. The Phase 11 redirect plan (if any) was not built — /blog remains a real route. Restyling preserves the existing tag filter UI; if visual issues remain after the restyle, that's a backlog item for v2.1.

### Claude's Discretion

- **Plan slicing.** The planner decides whether to ship one plan per route (7 plans total: recipe + 6 routes) or grouped (e.g., 4 plans: recipe + grouped restyles). Recommend per-route plans for clean isolation but the planner can argue for grouping if shared shared concerns dominate (e.g., 1 plan for all four `prose`-driven pages: /about, /prometheus, /links).
- **Recipe format.** The recipe plan (Plan 12-01) can produce either (a) a markdown document at `.planning/phases/12-sub-page-restyle-sweep/12-RECIPE.md` that subsequent plans cite, or (b) a small component contract (e.g., `<RestyleContainer>` wrapper) that subsequent plans consume. Planner's call.
- **Wave structure.** Recipe goes first (Wave 1). After recipe ships, all per-route plans can ship in parallel (Wave 2) — files are disjoint per-route except the recipe doc. /newsletter is the only complex one due to D-NEWSLETTER-REDESIGN; planner may push it into its own wave if it needs more research/sketching.
- **Empty-state handling on /projects, /links, /blog if Notion returns empty.** Existing v1.0 pages already handle this; preserve their existing graceful copy unless the recipe specifies a token-aligned alternative.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 12 inputs
- `.planning/REQUIREMENTS.md` — RESTYLE-01..06 (the 6 requirements this phase ships)
- `.planning/ROADMAP.md` (§Phase 12) — goal, success criteria, risks, dependencies
- `.planning/todos/pending/2026-05-21-newsletter-page-issues-prominence-redesign.md` — D-NEWSLETTER-REDESIGN source

### Design language (Phase 9 — the foundation)
- `.planning/phases/09-design-tokens-editorial-primitives/09-01-SUMMARY.md` — Tailwind v4 `@theme` block with the 10 palette tokens + 10 typography roles + v1.0 alias bridge
- `.planning/phases/09-design-tokens-editorial-primitives/09-09-SUMMARY.md` — /specimen reference page (every token + primitive rendered for inspection)
- `src/app/globals.css` — the live source of truth for tokens
- `src/components/editorial/` — the 7 Phase 9 primitives (Rule, RuleStrong, SectionLabel, ListRow, AllLink, IntroLink, FooterCol) + the Phase 11 YearBlock

### Layout patterns (Phase 10/11 — what to mirror)
- `.planning/phases/10-editorial-homepage/10-CONTEXT.md` — homepage layout decisions (manifesto, ink footer, section structure)
- `.planning/phases/11-archive-pages/11-CONTEXT.md` — archive page decisions (title block 2-col, atmosphere photo, year-grouped lists, Substack outbound)
- `src/app/writing/page.tsx` — canonical archive page template (title block + RuleStrong + content + Substack footer)
- `src/components/home-v2/editorial-header.tsx` — NOT used here (these 6 routes keep v1.0 chrome), but cited for the v2.0 nav vocabulary

### Original handoff
- `.planning/research/editorial-redesign-handoff/README.md` — full design system reference (tokens, typography, spacing scale)
- `.planning/research/editorial-redesign-handoff/preview.html` — visual reference

### Files this phase will touch (route-by-route)
- `src/app/about/page.tsx`
- `src/app/projects/page.tsx` + `src/app/projects/[slug]/page.tsx`
- `src/app/blog/page.tsx` + `src/app/blog/[slug]/page.tsx`
- `src/app/links/page.tsx`
- `src/app/prometheus/page.tsx`
- `src/app/newsletter/page.tsx` + `src/components/newsletter/newsletter-carousel.tsx`

### v1.0 chrome (DO NOT restyle in Phase 12 — out of scope per D-05)
- `src/components/nav/navigation.tsx`
- `src/components/footer.tsx`
- `src/components/main-offset.tsx`
- `src/components/seo/breadcrumbs.tsx`

</canonical_refs>

<specifics>
## Specific Ideas

### Restyle Recipe (Plan 12-01) — what the doc/component should codify

A canonical "before → after" mapping that subsequent plans can apply mechanically:

| v1.0 pattern | v2.0 replacement |
|---|---|
| `bg-[var(--bg)]` | `bg-paper` |
| `text-[var(--foreground)]` / `text-[var(--text)]` | `text-ink` |
| `text-[var(--muted)]` (if exists) | `text-muted` |
| `border-[var(--border)]` | `border-rule` (hairline) or `border-rule-strong` (bold) |
| `text-[var(--accent)]` | drop the accent color entirely — use `text-ink` with an `IntroLink` for emphasis |
| `bg-[var(--accent)]` button (e.g., Subscribe) | flat `border border-ink px-7 py-3 text-label uppercase` (matches /writing footer Substack CTA) |
| `rounded-lg`, `rounded-xl`, `rounded-2xl` | drop (no rounded corners) |
| `shadow-sm`, `shadow-md`, `shadow-lg` | drop (no shadows) |
| `hover:shadow-*`, `hover:scale-*`, `group-hover:scale-*` | replace with `hover:opacity-60` or `hover:opacity-80` |
| `text-2xl font-normal tracking-tight sm:text-3xl` (current h1 pattern on /newsletter, /about) | `text-page-title uppercase text-ink` for archive feel, OR `text-section-feature text-ink` for less-prominent pages — recipe picks per route |
| `text-base font-normal` body | `text-body-lead` or default body (16-18px from Phase 9) |
| `font-normal uppercase tracking-widest` section labels (`Recent Issues`) | `text-label uppercase text-muted` |
| `prose` (Tailwind typography plugin) | keep `prose` for Notion markdown, but constrain via `prose-headings:text-ink prose-p:text-ink prose-a:text-ink` overrides — recipe codifies the exact `.prose` token alignment |

### Per-route specifics (planner can lift these wholesale)

**/about** (RESTYLE-01)
- Breadcrumbs at top → keep, but apply recipe to text color/size
- h1 currently 2xl/3xl — promote to `text-section-feature` (28px) or `text-page-title` (120px) — recipe picks. Probably `text-section-feature` since /about isn't an archive
- Prose body → recipe `.prose-*` overrides
- Existing layout structure unchanged

**/projects** (RESTYLE-02)
- Index: project cards currently visual-heavy with shadows/borders → flatten to `ListRow`-style rows (or keep a card grid with `border-rule` hairline and no shadow/rounded). Recipe picks card vs row.
- /[slug]: similar — Notion-rendered markdown gets `.prose` overrides
- OG image generation untouched

**/blog** (RESTYLE-03)
- Index page may still exist alongside /writing — restyle the existing v1.0 layout
- Tag filter UI preserved structurally
- /[slug] post body → `.prose` overrides
- RSS feed (`/blog/feed.xml`) untouched

**/links** (RESTYLE-04)
- Link list — likely the simplest restyle. Use `ListRow` with no big flag, or a denser variant the recipe defines
- Drop button-style chrome on links (no rounded, no border boxes)

**/prometheus** (RESTYLE-05)
- Prose + FAQ — biggest text-heavy page after /blog/[slug]
- `.prose` overrides are the lever; FAQ accordion structure (if present) gets token-aligned hairlines

**/newsletter** (RESTYLE-06 + D-NEWSLETTER-REDESIGN — this one needs more work)
- Intro paragraph + Subscribe CTA stay in `max-w-[66ch]` reading column
- Section label `Recent Issues` → `text-label uppercase text-muted`
- Issue gallery EXPANDS to full editorial page width (`md:px-40` like archive pages)
- Replace `NewsletterCarousel` with a multi-row grid: e.g., 2-col mobile / 3-col desktop, no horizontal scroll, all issues visible
- Each issue card: bigger thumbnail (poster-feel), flat (no rounded/shadow/border-box), title in `text-list-title` or `text-list-title-home`, date in `text-meta uppercase text-muted`
- Substack CTA button → flat outlined style matching /writing Substack footer (`border border-ink px-7 py-3 text-label uppercase`)
- Consider: also adopt an inverted-ink Substack footer block at the bottom of /newsletter matching /writing's subscribe footer? Planner decides — if it adds visual rhyme, do it; if it duplicates the CTA above redundantly, skip

### Validation gates each restyle plan must verify
- `npm run build` exits 0
- Visual smoke at 1440px + 390px — no horizontal overflow, palette consistent with /writing as the reference
- No `rounded-*` / `shadow-*` / `bg-[var(--bg)]` / `text-[var(--accent)]` survivors in the touched files (`rg` gates per plan)
- `prose` blocks render correctly with token-aligned color/size (manual inspect on dev server)

</specifics>

<deferred>
## Deferred Ideas

- **Dark-mode editorial palette.** Phase 9 D-04 dropped dark mode for v2.0. Phase 13 GO/NO-GO either records "light-only ship" or revisits. Phase 12 does NOT re-introduce dark-mode tokens.
- **/blog → /writing redirect or merge.** D-04 above keeps /blog as a real route. A future milestone might merge them; not Phase 12.
- **OG image redesign.** Per-post OG images (`@vercel/og`) are dynamic; their visual treatment is a separate effort, not part of restyle.
- **Animation budget.** Phase 8 set the budget (Lenis + page-fade only). Restyle plans don't add motion — and per D-03, they REMOVE hover-scale transforms.
- **Header/footer (v1.0 chrome) restyle.** Out of scope per D-05. The v1.0 Nav and Footer are intentionally retained for these 6 routes.
- **Newsletter pipeline backend.** D-15 REVISED from Phase 11 confirmed Substack outbound IS the pipeline. No /api/subscribe or form submissions.

</deferred>

<scope_fence>
## Scope Fence (what plans MUST refuse)

A Phase 12 plan must refuse and surface for re-scoping if it discovers it needs to:
- Add a new design token (color, type role, spacing scale value) — go back to Phase 9
- Change a URL structure (rename a route, add a redirect)
- Touch the v1.0 Nav / Footer / MainOffset components (out of scope per D-05)
- Add a new third-party dependency
- Re-introduce dark-mode support
- Touch Phase 9 primitives (Rule, RuleStrong, SectionLabel, ListRow, AllLink, IntroLink, FooterCol) or Phase 11 primitives (YearBlock, EditorialHeader)
- Modify Notion fetchers (`src/lib/notion.ts`, `src/lib/notion-events.ts`, `src/lib/rss/substack.ts`) beyond bumping a fetch limit — and only if D-NEWSLETTER-REDESIGN requires it

</scope_fence>

---

*Phase: 12-sub-page-restyle-sweep*
*Context gathered: 2026-05-21*
*Synthesized from ROADMAP + REQUIREMENTS + Phase 11 prior art + operator UAT feedback*
