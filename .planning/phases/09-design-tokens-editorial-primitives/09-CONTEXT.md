# Phase 9: Design Tokens & Editorial Primitives - Context

**Gathered:** 2026-05-21
**Status:** Ready for planning
**Mode:** `--auto` (Claude auto-selected recommended option for every gray area; Claude Design editorial-redesign handoff used as canonical context per Monty's standing instruction from Phase 8)

<domain>
## Phase Boundary

Phase 9 builds the **foundation** the entire v2.0 redesign composes with. Two deliverables:

1. **Design tokens** — Tailwind v4 `@theme` block in `src/app/globals.css` defining the warm-paper palette (10 color tokens) + editorial type scale (9 typography utilities) + dark-mode disposition (dropped for v2.0). Inter at weights 400/700 already loaded (verified at context-gather time).
2. **Seven shared editorial primitive components** — `Rule`, `RuleStrong`, `SectionLabel`, `ListRow` (+ `big` variant), `AllLink`, `IntroLink`, `FooterCol` — in a new `src/components/editorial/` directory. Phase 10 + 11 + 12 import these.

**In scope (10 requirements):** TOKEN-01 (warm-paper palette tokens), TOKEN-02 (editorial type scale utilities), TOKEN-03 (Inter weights 400/700 verification), PRIM-01..07 (seven primitives).

**Out of scope:** Phase 10's editorial homepage, Phase 11's archive pages, Phase 12's sub-page restyle sweep. No layout work in Phase 9. No new pages (the specimen route is a dev resource, not user-facing). No new dependencies (Tailwind v4 + next-themes + Inter are all already installed).

</domain>

<decisions>
## Implementation Decisions

### Token Replacement Strategy (TOKEN-01)
- **D-01:** **Replace the `@theme inline` block contents in `src/app/globals.css` with the 10 role-named tokens from the handoff.** Specifically:
  - `--color-paper: #F4F2EC;` (page background; warm off-white)
  - `--color-ink: #0E0E0C;` (body text & primary type; near-black, warm tint)
  - `--color-muted: #9A9690;` (metadata, captions, secondary nav, blurbs)
  - `--color-faint: #C7C3BA;` (tertiary text, rare)
  - `--color-rule: #E5E2D9;` (hairline horizontal dividers, 1px)
  - `--color-rule-strong: #1A1A18;` (bold horizontal section dividers, 1px)
  - `--color-footer-bg: #0E0E0C;` (footer inverts to Ink)
  - `--color-footer-fg: #F4F2EC;` (footer text on Ink)
  - `--color-footer-mute: #7A7770;` (footer secondary text, warm gray on Ink)
  - `--color-footer-rule: rgba(244, 242, 236, 0.18);` (hairline divider on Ink)
- **D-02:** **Keep v1.0 token names (`--bg`, `--fg`, `--bg-secondary`, `--fg-muted`, `--border`, `--accent`, `--accent-warm`, `--gold`) as compat aliases.** Each aliases to a new token (e.g., `--bg: var(--color-paper); --fg: var(--color-ink);` etc.). This prevents the live site (currently the post-Phase-8 v1.0 layout) from breaking during Phase 9. **Phase 12's sub-page restyle sweep removes the aliases entirely** — that's the explicit handoff into Phase 12. Phase 13's QA verifies no old token names remain.
- **D-03:** **`@theme inline` keyword stays.** Tailwind v4's `inline` modifier preserves the `var()` indirection, which is what enables D-02's alias bridge. Without `inline`, Tailwind would resolve the `var()` at build time and the aliases would freeze.

### Dark Mode Disposition (Phase 13 carryforward)
- **D-04:** **Drop dark mode for v2.0.** The Claude Design handoff is light-only (warm-paper monochrome) and the editorial palette does not have a documented dark-mode equivalent. Specifically in Phase 9:
  - **Remove the `.dark { ... }` block** from `src/app/globals.css` entirely.
  - **Remove `<ThemeProvider>` wrap** from `src/app/layout.tsx`.
  - **Remove `<ThemeToggle>` UI** from the nav (where it currently sits).
  - **Delete `src/components/providers/theme-provider.tsx`** and `src/components/theme-toggle.tsx`.
  - **Keep `next-themes` installed** in package.json (zero-cost; potential reuse if a future milestone restores dark mode).
  - **Document the drop:** This CONTEXT.md is the authoritative record for Phase 13's QA-V2-05 ("Dark-mode FOUC test passes incognito Chrome — system theme controls first paint with no flash (warm-paper palette in light, ink-inverted equivalent in dark — or light-only with explicit decision recorded if dark dropped)"). Phase 13 reads this section and marks QA-V2-05 satisfied via "explicit decision recorded".
- **D-05:** **`suppressHydrationWarning` on `<html>`** in `src/app/layout.tsx` — keep if present (harmless without theme switching; cheap insurance against future theme reintroduction).

### Type Scale Authoring (TOKEN-02)
- **D-06:** **Tailwind v4 `@theme` typography extensions.** Add to the `@theme` block in `globals.css`:
  ```css
  --text-display: 124px;
  --text-display--line-height: 0.96;
  --text-display--letter-spacing: -0.045em;
  --text-display--font-weight: 700;
  --text-page-title: 120px;
  --text-page-title--line-height: 0.95;
  --text-page-title--letter-spacing: -0.045em;
  --text-page-title--font-weight: 700;
  --text-feature: 44px;
  --text-feature--line-height: 1.05;
  --text-feature--letter-spacing: -0.03em;
  --text-feature--font-weight: 700;
  --text-event-title: 36px;
  --text-event-title--line-height: 1.1;
  --text-event-title--letter-spacing: -0.02em;
  --text-event-title--font-weight: 700;
  --text-section-feature: 28px;
  --text-section-feature--line-height: 1.15;
  --text-section-feature--letter-spacing: -0.025em;
  --text-section-feature--font-weight: 700;
  --text-list-title: 28px;
  --text-list-title--line-height: 1.2;
  --text-list-title--letter-spacing: -0.01em;
  --text-list-title--font-weight: 400;
  --text-list-title-home: 20px;
  --text-list-title-home--line-height: 1.4;
  --text-list-title-home--letter-spacing: -0.005em;
  --text-list-title-home--font-weight: 400;
  --text-body-lead: 22px;
  --text-body-lead--line-height: 1.55;
  --text-body-lead--letter-spacing: -0.005em;
  --text-body-lead--font-weight: 400;
  --text-nav: 13px;
  --text-nav--line-height: 1.4;
  --text-nav--letter-spacing: 0.02em;
  --text-nav--font-weight: 400;
  --text-label: 11px;
  --text-label--line-height: 1;
  --text-label--letter-spacing: 0.2em;
  --text-label--font-weight: 700;
  --text-meta: 11px;
  --text-meta--line-height: 1;
  --text-meta--letter-spacing: 0.16em;
  --text-meta--font-weight: 400;
  ```
  This is the idiomatic Tailwind v4 way. Consumers write `className="text-display"` or `className="text-label uppercase"` and get the full bundle.
- **D-07:** **Label vs meta tracking range.** Handoff specifies "0.18em–0.22em" for labels and "0.14em–0.18em" for meta. Pick a single value each: **label = 0.2em** (middle of range), **meta = 0.16em** (middle of range). Phase 10/11 can override per-instance if specific sections need the edges of the range.

### Primitive Components (PRIM-01..07)
- **D-08:** **All 7 primitives live in `src/components/editorial/`** — new directory. File naming follows the project's existing `kebab-case.tsx` convention with `PascalCase` named exports:
  - `src/components/editorial/rule.tsx` → `export function Rule(...)` (PRIM-01)
  - `src/components/editorial/rule-strong.tsx` → `export function RuleStrong(...)` (PRIM-02)
  - `src/components/editorial/section-label.tsx` → `export function SectionLabel(...)` (PRIM-03)
  - `src/components/editorial/list-row.tsx` → `export function ListRow(...)` (PRIM-04, with `big?: boolean` prop)
  - `src/components/editorial/all-link.tsx` → `export function AllLink(...)` (PRIM-05)
  - `src/components/editorial/intro-link.tsx` → `export function IntroLink(...)` (PRIM-06)
  - `src/components/editorial/footer-col.tsx` → `export function FooterCol(...)` (PRIM-07)
- **D-09:** **Token-driven, zero arbitrary values.** Every primitive uses `border-rule` / `border-rule-strong` / `text-ink` / `text-muted` / `text-label` etc. — no `border-[1px]`, no `text-[11px]`, no `tracking-[0.2em]`. If a value is needed that isn't a token, add the token first (Phase 9 decision), don't reach for arbitrary values. Phase 9's plan-checker should flag any arbitrary values in primitive code.
- **D-10:** **`ListRow` `big` variant** — implement as a single component with a `big?: boolean` prop, not two separate components. `big` switches: row vertical padding 20px → 28px; title font from `text-list-title-home` (20px) → `text-list-title` (28px). Matches React idioms; matches handoff §"Components Catalog" which lists it as a variant of one component.
- **D-11:** **PRIM components are `'use client'` only if they need event handlers.** None of the 7 primitives have interactive state (they're presentational). Default to Server Components — no `'use client'` directive. Hover styles are CSS-only (`hover:` Tailwind variants), which work in Server Components.

### Specimen Page (SC1 of Phase 9 success criteria)
- **D-12:** **Route: `/_specimen`** at `src/app/_specimen/page.tsx`. Underscore prefix excludes it from sitemap by convention; manual `noindex` metadata as belt-and-suspenders. Permanent dev resource — useful for ongoing design QA in Phases 10–13 and post-ship.
- **D-13:** **Specimen content:** Render a section per token category:
  - Palette swatches (10 swatches with role name + hex + `bg-paper`/`bg-ink`/etc. class)
  - Type scale specimens (one line of representative text per `text-*` utility — "The quick brown fox" for body sizes, "BUILDING" for label/meta)
  - Each of the 7 primitive components rendered with sensible default props
  - A "no animations" note confirming Phase 8's motion budget holds on this page (no auto-anything)
- **D-14:** **Specimen page metadata:** `export const metadata = { robots: { index: false, follow: false } }` on the Next.js metadata export. Also add to `app/sitemap.ts` exclusion list if that file exists.

### Existing Code (CONTEXT.md D-12/D-13 from Phase 8 still apply)
- **D-15:** **Preserve from Phase 8:** `src/components/animations/scroll-reveal.tsx`, `src/components/providers/lenis-provider.tsx`, `src/app/template.tsx` — DO NOT touch in Phase 9. These are the only surviving site-wide motion components per the v2.0 motion budget. Phase 10 still depends on them.
- **D-16:** **Preserve from Phase 8:** `/newsletter` route + its clickable carousel. The handoff sanctioned it as the lone clickable-carousel exception. Phase 9 does NOT touch newsletter code; Phase 12 governs its restyle.
- **D-17:** **Inter is the typeface.** REQUIREMENTS.md TOKEN-03 locks this: "Helvetica Neue spec values applied to Inter; no font swap." Verified at context-gather time: `src/app/layout.tsx:13–17` already loads Inter with `weight: ["400", "700"]`. Phase 9 verifies this is still true at the end of the phase and does not change it.

### Build & Verification Gates
- **D-18:** **Per-plan `npm run build` MUST exit 0 before commit** (CONTEXT.md D-10 from Phase 8 carries forward). For each primitive plan, build the project and confirm TypeScript catches any token usage that doesn't resolve.
- **D-19:** **Phase gate `vercel build --prod` exits 0** (Phase 8 D-11 carries forward). Plan 09-09 (specimen) is the natural place to run this. Or fold into a final Plan 09-10 verification plan.

### Plan Slicing
- **D-20:** **9 plans, two waves:**
  - **Wave 1 (8 plans, parallelizable — each plan edits a different file):**
    - **09-01-tokens-and-typescale** — TOKEN-01 + TOKEN-02 + TOKEN-03. Rewrites `@theme` block in `src/app/globals.css`. Adds palette + type-scale tokens. Adds compat aliases (D-02). Removes `.dark` block. Verifies `src/app/layout.tsx` still loads Inter 400/700. **Special:** This plan also removes `ThemeProvider` wrap from `src/app/layout.tsx`, removes `theme-toggle` from the nav (whichever file it's in), and deletes `theme-provider.tsx` + `theme-toggle.tsx` files (D-04). Plan touches `globals.css` + `layout.tsx` + nav file + deletes two files.
    - **09-02-prim-rule** — PRIM-01. Creates `src/components/editorial/rule.tsx`.
    - **09-03-prim-rule-strong** — PRIM-02. Creates `src/components/editorial/rule-strong.tsx`.
    - **09-04-prim-section-label** — PRIM-03. Creates `src/components/editorial/section-label.tsx`.
    - **09-05-prim-list-row** — PRIM-04. Creates `src/components/editorial/list-row.tsx` with `big` variant.
    - **09-06-prim-all-link** — PRIM-05. Creates `src/components/editorial/all-link.tsx`.
    - **09-07-prim-intro-link** — PRIM-06. Creates `src/components/editorial/intro-link.tsx`.
    - **09-08-prim-footer-col** — PRIM-07. Creates `src/components/editorial/footer-col.tsx`.
  - **Wave 2 (1 plan, depends on Wave 1):**
    - **09-09-specimen-route** — SC1. Creates `src/app/_specimen/page.tsx` rendering all tokens + all 7 primitives. Adds `noindex` metadata. Runs `vercel build --prod` (D-19) as the phase gate.
- **D-21:** **Wave 1 parallelization:** Plans 09-02..09-08 (7 primitives) are parallel-safe — each creates a different new file in `src/components/editorial/`. Plan 09-01 (tokens) does NOT share files with any primitive plan. So all 8 Wave-1 plans can run in parallel if the executor supports it. If sequential is forced (worktree conflicts unlikely since each plan has a unique `files_modified` set), the natural order is tokens-first (09-01), then primitives (09-02..09-08).

### Claude's Discretion
- Exact JSDoc comments inside each primitive — minimal, only WHY-not-obvious (per CLAUDE.md no-comments default).
- Exact `cn(...)` helper import if used in primitives (project may already have a `cn` from clsx + tailwind-merge — verify and reuse; do NOT add a new dependency).
- Specimen page section ordering — start with palette (10 swatches), then type scale (9 specimens), then primitives (7 sections, one per primitive).
- Whether to also add a `_dev` index that links to `_specimen` (skip — overkill for a 1-page dev resource).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor, verifier) MUST read these before planning or implementing.**

### Design Contract (v2.0 source of truth)
- `.planning/research/editorial-redesign-handoff/README.md` §"Design Tokens" — exact hex values, role definitions, suggested Tailwind v4 `@theme` block (matches D-01 verbatim).
- `.planning/research/editorial-redesign-handoff/README.md` §"Typography" — exact font-size + line-height + letter-spacing + weight per type-scale role (matches D-06 verbatim).
- `.planning/research/editorial-redesign-handoff/README.md` §"Components Catalog" — explicit list of 7 cross-page primitives + variant notes ("`big` variant for archive pages" for ListRow).
- `.planning/research/editorial-redesign-handoff/README.md` §"Implementation Notes for the Developer" — Tailwind v4 + Motion + Inter guidance; explicit "you'll probably want these as `app/_components/...` co-located with their page, or hoisted to `components/editorial/...` if they're truly cross-page" (rationale for D-08).

### Milestone & Phase Context
- `.planning/ROADMAP.md` §"Phase 9: Design Tokens & Editorial Primitives" — success criteria (specimen page renders all tokens; Inter 124px manifesto renders correctly; 7 primitives render in isolation with documented props; vercel build --prod exit 0).
- `.planning/REQUIREMENTS.md` §"Design Tokens & Typography" — TOKEN-01..03 exact contracts.
- `.planning/REQUIREMENTS.md` §"Shared Editorial Primitives" — PRIM-01..07 exact contracts (each names the component, its purpose, and its props/variants).
- `.planning/ROADMAP.md` §"Phase 13: v2.0 QA & GO/NO-GO" — QA-V2-05 (dark-mode FOUC test or explicit drop) — D-04 satisfies this requirement by recording the drop.
- `.planning/RETROSPECTIVE.md` (v1.0) — lesson #2 (production-build-as-truth) drives D-19.

### Phase 8 Carryforward
- `.planning/phases/08-motion-subtractions/08-CONTEXT.md` D-12 — preserve `scroll-reveal.tsx`, `lenis-provider.tsx`, `template.tsx` (D-15 here).
- `.planning/phases/08-motion-subtractions/08-CONTEXT.md` D-13 — preserve `/newsletter` carousel (D-16 here).
- `.planning/phases/08-motion-subtractions/08-04-SUMMARY.md` — Phase 8 explicit handoff note: "After this plan, `src/app/globals.css` contains no carousel animation rules. Phase 9 can introduce the warm-paper palette on a clean slate." Confirmed at context-gather: globals.css contains no leftover keyframe blocks.
- `.planning/phases/08-motion-subtractions/08-VERIFICATION.md` — confirms Phase 8 left the codebase clean for Phase 9 to build on.

### Codebase Targets (verified at context-gather time)
- `src/app/globals.css` — current `@theme inline { --color-background, --color-foreground, --color-accent, --color-accent-warm }` block + `:root { --bg, --fg, ... }` block + `.dark` block + body/prose rules. This is THE file Plan 09-01 rewrites.
- `src/app/layout.tsx` — `inter = Inter({ variable: '--font-inter', subsets: ['latin'], weight: ['400', '700'] })` (line 13–17). TOKEN-03 already satisfied at the font-loader level. Plan 09-01 verifies + removes the `<ThemeProvider>` wrap if it sits in this file.
- `src/components/providers/theme-provider.tsx` — to be deleted by Plan 09-01 (D-04).
- `src/components/theme-toggle.tsx` — to be deleted by Plan 09-01 (D-04). Also need to find + remove the `<ThemeToggle>` usage site (likely in a nav component under `src/components/nav/`).
- `src/components/editorial/` — does NOT exist. Plans 09-02..09-08 create files in this new directory.
- `src/app/_specimen/` — does NOT exist. Plan 09-09 creates this route.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`cn` utility helper** — Project likely already has a `clsx + tailwind-merge` helper (typical shadcn/ui setup). Primitives should `import { cn } from "@/lib/utils"` (or wherever it lives) to handle conditional className merging in the `ListRow big` variant. If no `cn` exists yet, primitives can use template literals + `clsx` directly; do NOT add new dependencies.
- **Existing `next/font/google` Inter loader** — Phase 9 reuses as-is.
- **Existing `<Link>` from `next/link`** — used by `ListRow`, `AllLink`, `IntroLink`, `FooterCol` for navigation.

### Established Patterns
- **Component file structure:** Each component file exports a `PascalCase` named function. Props typed via inline TypeScript `Props` interface. Default export NOT used (forces named imports for refactor safety).
- **Tailwind v4 class composition:** Direct utility strings; no `styled()`-style abstractions. Conditional classes via `cn(...)` helper if available.
- **No CSS Modules** — project uses Tailwind v4 utilities + `@theme` tokens exclusively (per CLAUDE.md "What NOT to Use").
- **Server Components by default** — primitives that don't need interactivity stay as Server Components (no `'use client'`).

### Integration Points
- Phase 10 (Editorial Homepage) imports all 7 primitives from `src/components/editorial/*`. The homepage manifesto uses `--text-display` token. The 5 labeled sections (Building / Writing / Events / Photographs / Personal) use `SectionLabel`. The inverted footer uses `FooterCol`.
- Phase 11 (Archive Pages) imports `Rule`, `RuleStrong`, `SectionLabel`, `ListRow big`, `AllLink`.
- Phase 12 (Sub-page Restyle Sweep) uses the `text-*` utilities but probably NOT the primitives (sub-pages retain existing layouts; only palette + type-scale apply).
- The specimen route at `/_specimen` is the unit-test-equivalent for design tokens — visible regression check for Phase 13 QA.

### Verified Clean
- `src/app/globals.css` has no leftover `@keyframes` blocks (Phase 8 Plan 04 cleaned `scroll-left`).
- No `animate-(ping|pulse|bounce|spin)` anywhere (Phase 8 Plan 05 swept).
- The `.dark` block exists in globals.css and has `--bg`, `--fg`, etc. defined — Plan 09-01 removes this block.
- `ThemeProvider` is wired in layout.tsx (verified via `rg -l next-themes`). Plan 09-01 unwires it.

</code_context>

<specifics>
## Specific Ideas

- **From the handoff (literal quote):** "*One typeface family, two weights. Helvetica Neue → Helvetica → Arial → sans-serif. Regular (400) and Bold (700). No italics. No condensed.*" — REQUIREMENTS.md TOKEN-03 explicitly applies these to Inter instead. D-17 locks this.
- **From the handoff (literal quote):** "*Suggested Tailwind v4 tokens:*" with the exact `@theme { --color-paper: #F4F2EC; ... }` block. D-01 uses this verbatim.
- **Inter at 124px** is the most extreme rendering case in the type scale. The handoff acknowledges that Helvetica Neue would render this slightly differently. We accept Inter's rendering as the v2.0 baseline.
- **Underscore-prefixed routes** in Next.js App Router (e.g., `_specimen`) are NOT automatically excluded from routing — only from sitemap by convention. Need explicit `noindex` metadata. D-12 + D-14 lock this.
- **Tailwind v4 typography utility extensions** via `--text-{name}` + `--text-{name}--line-height` is the official v4 pattern. Documented at https://tailwindcss.com/docs/typography (or the v4 migration guide).

</specifics>

<deferred>
## Deferred Ideas

- **Dark-mode editorial palette** — explicitly dropped for v2.0 (D-04). If Monty wants dark mode later, a follow-up milestone defines `--color-paper-dark`, `--color-ink-dark`, etc. and reintroduces `next-themes` wiring. Phase 13 records this as "v2.0 ships light-only" per QA-V2-05.
- **Storybook integration** — could replace the specimen route with a true Storybook setup. Adds dependencies + build complexity. Defer to a future tooling milestone if design QA needs more.
- **Animated specimen page** — adding subtle hover/transition demos for primitives could be useful for design QA. Violates v2.0 motion budget if not careful. Defer; current static specimen is enough.
- **Token contrast accessibility audit** — handoff doesn't specify WCAG contrast ratios. The paper/ink combo (#F4F2EC on #0E0E0C) is high-contrast and clearly accessible. The muted/paper combo (#9A9690 on #F4F2EC) is ~3.2:1 — passes WCAG AA for large text only, not for body text. Phase 9 doesn't enforce a contrast gate; Phase 13 QA can flag if it becomes an issue. Deferred — design decision belongs to the handoff author, not Phase 9 implementer.
- **CSS Custom Properties polyfill** — not needed; modern browsers support all the CSS used. Defer indefinitely.

</deferred>

---

*Phase: 9-Design Tokens & Editorial Primitives*
*Context gathered: 2026-05-21*
