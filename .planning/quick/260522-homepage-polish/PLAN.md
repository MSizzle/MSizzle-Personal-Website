---
type: quick-plan
status: planned
slug: homepage-polish
date: 2026-05-22
phase: quick/260522-homepage-polish
plan: 01
wave: 1
autonomous: true
files_modified:
  - src/components/nav/navigation.tsx
  - src/components/footer.tsx
  - src/components/home-v2/ink-footer.tsx
  - src/components/home-v2/writing-subscribe-cta.tsx
  - src/components/home-v2/cycling-photo.tsx
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/writing/page.tsx
  - src/app/events/page.tsx
  - src/app/photos/page.tsx
  - src/components/main-offset.tsx
  - src/components/editorial/intro-link.tsx
  - src/__tests__/components/footer.test.tsx
requirements: []
must_haves:
  truths:
    - "Every route on desktop renders exactly one nav (EditorialHeader, globalized via Navigation) and exactly one footer (InkFooter, globalized via layout.tsx)"
    - "Every route on mobile renders exactly one nav (Navigation mobile bar + drawer) and exactly one footer (InkFooter)"
    - "EditorialHeader's `active` prop is derived from pathname (Building/Writing/Events/About/Links) — no caller passes it"
    - "On /writing, a WritingSubscribeCTA section renders inline above the global InkFooter (two distinct sections, visually separated)"
    - "On /, /events, /photos, only the global InkFooter renders (no inline Substack CTA above it)"
    - "Photo caption reads 'A year in motion · 2025–26' with no 'Plate I' prefix and no 'Photographed on film' span"
    - "Intro paragraph reads the verbatim new copy with three working IntroLinks (Prometheus, case studies, Monty Monthly)"
    - "Photo grid (Section 04) shows no 'No. NN' overlay on any tile"
    - "Building section row 1 meta reads 'Active · AI Startup' (not 'AI Studio')"
    - "On mobile (≤768px), CyclingPhoto renders exactly 1 hero photo <img> in the DOM; on desktop (>768px), all 6 still stack for the 400ms cross-fade"
    - "src/components/footer.tsx and src/__tests__/components/footer.test.tsx are deleted"
    - "No page file imports or renders EditorialHeader inline; no page file renders an inline <footer> except for the extracted WritingSubscribeCTA on /writing"
    - "npm run build succeeds; npm run lint succeeds"
  artifacts:
    - path: "src/components/home-v2/ink-footer.tsx"
      provides: "Shared InkFooter server component used globally via layout"
      exports: ["InkFooter"]
    - path: "src/components/home-v2/writing-subscribe-cta.tsx"
      provides: "Extracted /writing Substack subscribe section, rendered inline on /writing above the global InkFooter"
      exports: ["WritingSubscribeCTA"]
  key_links:
    - from: "src/app/layout.tsx"
      to: "src/components/home-v2/ink-footer.tsx"
      via: "<InkFooter /> render"
      pattern: "import .*InkFooter.*from.*home-v2/ink-footer"
    - from: "src/components/nav/navigation.tsx"
      to: "src/components/home-v2/editorial-header.tsx"
      via: "<EditorialHeader active={activeLabel} /> render with derive-active from pathname"
      pattern: "<EditorialHeader active="
    - from: "src/app/writing/page.tsx"
      to: "src/components/home-v2/writing-subscribe-cta.tsx"
      via: "<WritingSubscribeCTA /> render above the global InkFooter"
      pattern: "<WritingSubscribeCTA"
    - from: "src/app/page.tsx"
      to: "src/components/editorial/intro-link.tsx"
      via: "Three <IntroLink> usages in intro <p>, including external ones with target=_blank"
      pattern: "<IntroLink"
---

<objective>
Polish the v2.0 editorial homepage AND unify site chrome across every route. Globalizes both EditorialHeader (via `Navigation`) and InkFooter (via `layout.tsx`), deletes the v1.0 desktop nav block + v1.0 `Footer` component, removes all inline `<EditorialHeader />` from page files, simplifies `MainOffset`, extracts the `/writing` Substack subscribe CTA into its own component (preserved inline on that route only), ships four small homepage copy/markup fixes (caption, intro paragraph, photo-grid overlay, AI Startup label), AND adds a mobile-perf fix that drops 5 unused hero-image requests on mobile so LCP comes down from 3.8s toward the 2.5s gate.

Purpose: The v2.0 milestone signed off as GO; the editorial home at `/` is the canonical look. Path 2 (globalize v2.0 chrome) ships every route the EditorialHeader + InkFooter treatment. The `/writing` subscribe CTA is preserved per user decision Q2 by extracting it into its own component so it can keep rendering inline on `/writing` above the global InkFooter — without polluting any other route. The mobile-perf fix (user decision Q1) closes the PSI LCP failure caused by CyclingPhoto force-loading all 6 hero photos on mobile even though only photos[0] is ever visible there.

Output: One nav (EditorialHeader desktop / Navigation mobile bar) and one footer (InkFooter) per viewport on every route. `/writing` additionally surfaces the extracted Substack CTA above the global InkFooter. v1.0 chrome is dead. Mobile hero loads 1 image instead of 6. Cleaner intro blurb with correct external/internal link semantics and consistent copy/captions throughout the homepage.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@CLAUDE.md
@src/app/page.tsx
@src/app/layout.tsx
@src/app/writing/page.tsx
@src/app/events/page.tsx
@src/app/photos/page.tsx
@src/components/nav/navigation.tsx
@src/components/footer.tsx
@src/components/home-v2/cycling-photo.tsx
@src/components/main-offset.tsx
@src/components/editorial/intro-link.tsx
@src/components/home-v2/editorial-header.tsx
@src/components/editorial/footer-col.tsx

<interfaces>
<!-- Key contracts pre-extracted so the executor doesn't have to re-read the codebase. -->

From src/components/home-v2/editorial-header.tsx:
```typescript
type Props = {
  active?: "Building" | "Writing" | "Events" | "About" | "Links";
};
export function EditorialHeader({ active }: Props);
```
- Self-gates desktop-only via `className="hidden md:flex ..."` — safe to render unconditionally; mobile won't see it.
- Server Component (no `'use client'`).

From src/components/editorial/intro-link.tsx (current — needs minimal extension for Task C):
```typescript
type Props = {
  children: ReactNode;
  href: string;
};
export function IntroLink({ children, href }: Props) {
  return <Link href={href} className="border-b border-ink">{children}</Link>;
}
```
NOTE: Current IntroLink uses `next/link` only. Task C adds an explicit `external?: boolean`.

From src/components/editorial/footer-col.tsx:
```typescript
type FooterLink = { label: string; href: string; sub?: string };
type Props = { title: string; links: FooterLink[] };
export function FooterCol({ title, links }: Props);
```

From src/components/nav/navigation.tsx (current — being heavily rewritten in Task A):
- `'use client'` — must stay (uses `useState` for `open` and `usePathname` for derive-active).
- Currently imports: `useState`, `Link`, `usePathname`, `cn`.
- After Task A: still imports `useState`, `Link`, `usePathname`, and `EditorialHeader`. Drops `cn` (only used inside the desktop block being removed).
- Mobile bar + drawer (lines 37-65, 93-118) stay byte-for-byte.

From src/components/home-v2/editorial-header.tsx active-label mapping (NEW logic for Task A):
- `/projects` → `"Building"`
- `/writing` or any path starting with `/blog` → `"Writing"`
- `/events` → `"Events"`
- `/about` → `"About"`
- `/links` → `"Links"`
- everything else (including `/`, `/photos`, `/specimen`, `/prometheus`, `/newsletter`, `/api/*`) → `undefined` (no link bolded)

From src/components/home-v2/cycling-photo.tsx (current — Task F target):
```typescript
interface Photo { src: string; no: string }
interface Props {
  photos: Photo[]
  intervalMs?: number     // default 10000
  className?: string
  showBadge?: boolean     // default false
  alt?: string            // default ''
}
export function CyclingPhoto({ photos, intervalMs, className, showBadge, alt }: Props);
```
- `'use client'` — stays (uses `useState`, `useEffect`, `matchMedia`).
- `isDesktop` initializes `false` on first render (SSR + initial client paint). Effect on lines 45-52 flips it to `true` post-hydrate on desktop viewports.
- Current render (lines 81-93): unconditionally maps all `photos` to stacked `<Image>` elements with opacity transition. ALL 6 are in the DOM regardless of viewport.
- `advance()` (lines 64-67) early-returns when `!isDesktop` — already a no-op on mobile.

Existing extracted Substack CTA source (Task A Step 2.4 — being lifted verbatim into `WritingSubscribeCTA`):
- `src/app/writing/page.tsx` lines 150-175: leading comment block + `<footer className="bg-footer-bg text-footer-fg px-7 py-12 md:px-40 md:py-16">` containing the "End of archive" eyebrow, "Receive new essays..." headline, supporting `<p>`, "Subscribe on Substack →" anchor, and the `© 2026 Monty Singer` line.
- Pure markup — no `useState`, `useEffect`, or other client hooks. Safe to ship as a server component.
</interfaces>

<grep-findings>
Confirmed before planning (re-verified for Path 2 + the Q1/Q2 decisions):

- `grep -rn "EditorialHeader" src/` (call sites — all to be deleted in Task A Step 1):
    src/app/page.tsx:15      (import) + :65 (`<EditorialHeader />`)
    src/app/photos/page.tsx:5 (import) + :48 (`<EditorialHeader />`)
    src/app/writing/page.tsx:6 (import) + :84 (`<EditorialHeader active="Writing" />`)
    src/app/events/page.tsx:10 (import) + :139 (`<EditorialHeader active="Events" />`)

- `grep -rn "bg-footer-bg" src/` (inline-footer markers):
    src/app/page.tsx:289                — the canonical InkFooter source (extracted in Task A Step 2.1)
    src/app/writing/page.tsx:154        — the Substack-outbound CTA. Per Q2 decision: EXTRACTED to `WritingSubscribeCTA` (Step 2.4), not deleted.
    src/app/specimen/page.tsx:26,189    — color-swatch references (the "footer-bg" token name), NOT a rendered inline footer. Leave alone.
    NB: src/app/events/page.tsx has NO inline footer. Confirmed.

- `grep -rn "from.*@/components/footer" src/` →
    src/app/layout.tsx:6                  (the layout import — being replaced)
    src/__tests__/components/footer.test.tsx:3 (test file — must also be deleted alongside footer.tsx)

- `grep -rn "HOME_PHOTOS|p\.no" src/` →
    src/app/page.tsx                      (HOME_PHOTOS def + .map + key={p.no} + visible No. {p.no} overlay)
    src/components/home-v2/cycling-photo.tsx (READS photos[idx].no for aria-label + visible overlay)
  ⚠ CyclingPhoto still consumes `p.no`. Task D scope is the grid loop ONLY; the `no` field stays on HOME_PHOTOS so CyclingPhoto keeps working. See Risks/Notes #3.

- `grep -n "photos.map\|isDesktop" src/components/home-v2/cycling-photo.tsx` (Task F target):
    line 41   const [isDesktop, setIsDesktop] = useState(false)
    line 57   if (!isDesktop || intervalMs <= 0 || photos.length <= 1) return
    line 62   useEffect deps include isDesktop
    line 65   if (!isDesktop || photos.length <= 1) return  (advance early-exit)
    line 76   isDesktop && photos.length > 1 ? ... (aria-label branch)
    line 81   photos.map((p, i) => (...))  ← THIS is the unconditional all-photos map being gated by Task F
</grep-findings>
</context>

## Goal

Land one cross-route chrome unification (Task A) + four small homepage edits + one mobile-perf fix in six atomic-commit-friendly tasks:

- **A**: Globalize EditorialHeader + InkFooter, delete v1.0 chrome, extract `/writing` Substack CTA into `WritingSubscribeCTA` (preserved inline on `/writing` above the global InkFooter), simplify `MainOffset`.
- **B**: Trim the photo figcaption to one line.
- **C**: Replace the intro paragraph with the new copy and three properly-attributed links (extends `IntroLink` to support external `target=_blank`).
- **D**: Remove the `No. NN` overlay from the photo grid.
- **E**: Change "AI Studio" → "AI Startup" in the Building section meta.
- **F**: Gate `CyclingPhoto`'s photo stack so mobile renders only `photos[0]` instead of all 6 — closes the PSI LCP gap.

Verify with `npm run build` and `npm run lint` plus a per-route dev-server pass, plus a mobile DOM-count check after Task F.

## Task list

<tasks>

<task type="auto">
  <name>Task A: Globalize EditorialHeader + InkFooter, extract /writing Substack CTA, delete v1.0 chrome</name>
  <files>
    src/components/home-v2/ink-footer.tsx (new),
    src/components/home-v2/writing-subscribe-cta.tsx (new),
    src/components/nav/navigation.tsx,
    src/components/footer.tsx (delete),
    src/__tests__/components/footer.test.tsx (delete),
    src/app/layout.tsx,
    src/app/page.tsx,
    src/app/writing/page.tsx,
    src/app/events/page.tsx,
    src/app/photos/page.tsx,
    src/components/main-offset.tsx
  </files>
  <action>
    This is one logical change (chrome unification + CTA extraction). Execute all 5 steps, then commit as one atomic.

    Step 1 — Make EditorialHeader globally rendered via `Navigation`.

    Rewrite `src/components/nav/navigation.tsx`:
    1. Add a new top-level `import { EditorialHeader } from "@/components/home-v2/editorial-header"`.
    2. Inside the `Navigation` component (after `const pathname = usePathname()`), derive the active label:
       ```ts
       const activeLabel: "Building" | "Writing" | "Events" | "About" | "Links" | undefined =
         pathname === "/projects" ? "Building"
         : pathname === "/writing" || pathname.startsWith("/blog") ? "Writing"
         : pathname === "/events" ? "Events"
         : pathname === "/about" ? "About"
         : pathname === "/links" ? "Links"
         : undefined;
       ```
       (Type the variable explicitly so TS narrows when passed to `<EditorialHeader active={...} />`.)
    3. Delete the `DESKTOP_LINKS` const (lines 9-12).
    4. Delete the `isV2Route` variable + its surrounding comment (lines 29-32).
    5. Delete the entire `{!isV2Route && (<header ...>... DESKTOP_LINKS.map ...</header>)}` block (lines 67-91).
    6. In place of that deleted desktop block, render `<EditorialHeader active={activeLabel} />` unconditionally. EditorialHeader self-gates desktop via `hidden md:flex` so mobile won't double-render.
    7. Drop the `cn` import — its only consumer was the deleted desktop block. Keep `useState`, `Link`, `usePathname`, and the new `EditorialHeader` import. Keep `'use client'` (still needed for `useState` + `usePathname`).
    8. Mobile header (lines 37-65) + mobile drawer (lines 93-118) stay byte-for-byte.

    Step 1.5 — Remove every inline `<EditorialHeader />` render.

    Per `grep -rn "EditorialHeader" src/app/`:
    - `src/app/page.tsx`: delete the import on line 15 and the `<EditorialHeader />` JSX on line 65.
    - `src/app/writing/page.tsx`: delete the import on line 6 and the `<EditorialHeader active="Writing" />` JSX on line 84. Also delete the comment line 54 (`*   1. <EditorialHeader active="Writing" /> — ...`) so the doc comment stays accurate.
    - `src/app/events/page.tsx`: delete the import on line 10 and the `<EditorialHeader active="Events" />` JSX on line 139. Also delete the comment line 114 (`*   1. <EditorialHeader active="Events" /> — ...`).
    - `src/app/photos/page.tsx`: delete the import on line 5 and the `<EditorialHeader />` JSX (with its comment) on lines 47-48.
    Any other call site surfaced by the grep gets the same treatment.

    Step 2 — Globalize InkFooter.

    2.1 — Create `src/components/home-v2/ink-footer.tsx` as a server component named `InkFooter`. Copy the entire `<footer className="bg-footer-bg text-footer-fg ...">` block currently at `src/app/page.tsx:289-371` verbatim (the 4-column grid using `FooterCol` + the bottom socials row). Import: `import { FooterCol } from "@/components/editorial/footer-col"`. Match the style of `src/components/home-v2/editorial-header.tsx` (no `'use client'`, named export, server component).

    2.2 — In `src/app/layout.tsx`:
       - Replace `import { Footer } from "@/components/footer"` with `import { InkFooter } from "@/components/home-v2/ink-footer"`.
       - Replace `<Footer />` on line 72 with `<InkFooter />`. Render position stays the same (after `<MainOffset>{children}</MainOffset>`, inside the `MotionProvider`).

    2.3 — In `src/app/page.tsx`: delete the inline `<footer>...</footer>` block (lines 288-371 including the leading comment on 288). Then remove the `import { FooterCol } from "@/components/editorial/footer-col"` on line 13 if no other usage remains in page.tsx (verify with `grep -n FooterCol src/app/page.tsx` post-edit — expect 0).

    2.4 — Extract `/writing` Substack CTA into its own component (per user decision Q2 — keep the CTA on `/writing`).

      a. Create `src/components/home-v2/writing-subscribe-cta.tsx`. Read `src/app/writing/page.tsx` lines 150-175 first to confirm — they're pure markup with no hooks. Ship the new file as a **server component** (no `'use client'`, named export `WritingSubscribeCTA`). Copy the existing markup verbatim into the component body:
         - The leading comment block (lines 150-153) becomes the JSDoc / file-top comment on the new component.
         - The `<footer className="bg-footer-bg text-footer-fg px-7 py-12 md:px-40 md:py-16">...</footer>` element becomes the component's return value. Keep the `<footer>` semantic tag — it's a section-level footer for the writing archive, not the site footer, and renders alongside (above) the global InkFooter.
         - Preserve every byte of the inner markup: "── End of archive" eyebrow, the "Receive new essays the morning they're published." headline, the supporting `<p>`, the "Subscribe on Substack →" anchor (target=_blank, rel=noopener noreferrer, href https://montymonthly.substack.com), and the "© 2026 Monty Singer · montymonthly.substack.com" line.

      b. In `src/app/writing/page.tsx`:
         - Add `import { WritingSubscribeCTA } from "@/components/home-v2/writing-subscribe-cta"` at the top of the file (group with other component imports).
         - Replace the inline `<footer>...</footer>` block (lines 154-175) AND its leading comment block (lines 150-153) with a single `<WritingSubscribeCTA />` render. Position is unchanged — it stays just after the `<RuleStrong />` on line 148, immediately before the route's closing `</>` fragment.
         - The global `InkFooter` from `layout.tsx` will render BELOW `<WritingSubscribeCTA />` (layout renders the footer after `children`, so the route's own CTA section sits above it). Result on `/writing`: Substack CTA section, then global InkFooter — two distinct sections, visually separated by the dark band stacking.

    2.5 — Confirm `src/app/events/page.tsx` and `src/app/photos/page.tsx` have NO inline `<footer>` to remove (re-grep `grep -n "<footer" src/app/events/page.tsx src/app/photos/page.tsx` → expect 0 lines). They render only the global InkFooter.

    Step 3 — Delete v1.0 chrome.

    1. Delete `src/components/footer.tsx`.
    2. Delete `src/__tests__/components/footer.test.tsx` (its tests target the now-removed component; leaving it will break `npm run lint`/Vitest).
    3. Note: the v1.0 nav's `#contact` link is gone with `DESKTOP_LINKS` (Step 1), so no dangling `#contact` reference remains. If `grep -rn "#contact" src/` surfaces anything else, leave those — they're outside this task's scope.

    Step 4 — Simplify `MainOffset`.

    Rewrite `src/components/main-offset.tsx` as a server component (drop `'use client'`, `usePathname`, the v2Route list):
    ```tsx
    import type { ReactNode } from "react";

    /**
     * Mobile Navigation bar is fixed (height 64px) — needs pt-16 offset on mobile.
     * Desktop EditorialHeader is inline content (not fixed) — no offset needed.
     * Globalized post-Path-2: same behavior on every route.
     */
    export function MainOffset({ children }: { children: ReactNode }) {
      return <main className="pt-16 md:pt-0">{children}</main>;
    }
    ```
    Keep the exported function signature so `layout.tsx` does not change beyond the Footer→InkFooter import swap.

    Step 5 — Acceptance / verification (see <verify> + <done> below).

    Commit as one atomic with message:
    `refactor(chrome): unify nav + footer across all routes — EditorialHeader + InkFooter global, extract WritingSubscribeCTA, delete v1.0 Navigation desktop block + Footer`
  </action>
  <verify>
    <automated>npm run build && npm run lint</automated>
    Manual grep gates:
    - `grep -rn "from.*@/components/footer\"" src/` returns 0 lines (note: trailing quote — avoid matching the new `home-v2/ink-footer` path).
    - `grep -rn "DESKTOP_LINKS\|isV2Route" src/` returns 0 lines.
    - `grep -rn "EditorialHeader" src/app/` returns 0 lines (no page file imports or renders it inline).
    - `grep -n "EditorialHeader" src/components/nav/navigation.tsx` returns 2 lines (import + JSX).
    - `grep -n "InkFooter" src/app/layout.tsx` returns 2 lines (import + JSX).
    - `grep -n "WritingSubscribeCTA" src/app/writing/page.tsx` returns 2 lines (import + JSX).
    - `grep -n "<footer" src/app/page.tsx src/app/events/page.tsx src/app/photos/page.tsx` returns 0 lines.
    - `grep -n "<footer" src/app/writing/page.tsx` returns 0 lines (CTA was extracted out into the new component file).
    - `grep -n "<footer" src/components/home-v2/writing-subscribe-cta.tsx` returns 1 line (the section-level CTA wrapper).
    - `grep -n "key={p.src}\|HOME_PHOTOS" src/app/page.tsx` still resolves (page.tsx markup is intact apart from the deleted footer + header).
    Manual dev-server visual pass (`npm run dev`):
    - Visit `/`, `/about`, `/blog` (or `/blog/[slug]` if a published post exists), `/links`, `/newsletter`, `/projects`, `/writing`, `/events`, `/photos`, `/specimen`, `/prometheus`. On each:
        - Desktop: EditorialHeader renders at the top. Correct nav label is bolded per the derive-active mapping (`/` and `/photos` and `/specimen` and `/prometheus` and `/newsletter` show no bolded label).
        - Mobile (Chrome DevTools narrow viewport): only the Navigation mobile bar + drawer renders, no EditorialHeader.
        - InkFooter renders below content on every route.
    - On `/writing` specifically: the Substack subscribe CTA section renders above the global InkFooter, visibly as two distinct dark-band sections stacked vertically. On `/`, `/events`, `/photos`, `/about`, `/blog`, `/links`, `/newsletter`, `/projects`, `/specimen`, `/prometheus`: only the global InkFooter renders (no subscribe CTA above it).
  </verify>
  <done>
    Build passes. Lint passes. `src/components/footer.tsx` and `src/__tests__/components/footer.test.tsx` no longer exist. `InkFooter` is rendered from `layout.tsx` on every route. `EditorialHeader` is rendered from `Navigation` on every route (desktop-only via its own class gate). `Navigation` ships only a mobile bar + drawer (and the globalized EditorialHeader). `MainOffset` is a server component with a static `pt-16 md:pt-0` className. No page file imports or renders `EditorialHeader` inline. `WritingSubscribeCTA` exists at `src/components/home-v2/writing-subscribe-cta.tsx` as a server component and renders inline on `/writing` above the global InkFooter; no other route renders it.
  </done>
</task>

<task type="auto">
  <name>Task B: Trim photo figcaption (Edits 2 + 3)</name>
  <files>src/app/page.tsx</files>
  <action>
    Edit the `<figcaption>` at `src/app/page.tsx:87-90`:
    1. Line 87 — change `className="mt-4 flex justify-between text-meta uppercase text-muted"` to `className="mt-4 text-meta uppercase text-muted"` (drop `flex justify-between`).
    2. Line 88 — change the inner text from `Plate I — A year in motion · 2025–26` to `A year in motion · 2025–26`.
    3. Line 89 — delete the entire `<span>Photographed on film</span>` element.
    4. Optional cleanup — with only one remaining text node, the wrapping `<span>` on line 88 can be removed; render the text directly inside the `<figcaption>`. (Keep the en-dash `–` and middle-dot `·` characters as-is.)
  </action>
  <verify>
    <automated>npm run build</automated>
    Manual sanity:
    - `grep -n "Plate I\|Photographed on film" src/app/page.tsx` returns 0 lines
    - `grep -n "A year in motion · 2025–26" src/app/page.tsx` returns 1 line
  </verify>
  <done>The hero figcaption reads exactly `A year in motion · 2025–26` and the `flex justify-between` styling is gone.</done>
</task>

<task type="auto">
  <name>Task C: Replace intro blurb + extend IntroLink for external links (Edit 4)</name>
  <files>src/components/editorial/intro-link.tsx, src/app/page.tsx</files>
  <action>
    Step 1 — Extend `src/components/editorial/intro-link.tsx`:
    - Add an optional `external?: boolean` to the `Props` type.
    - When `external` is true, render a plain `<a href={href} target="_blank" rel="noopener noreferrer" className="border-b border-ink">{children}</a>` instead of `<Link>`.
    - When `external` is false / undefined (default), preserve the existing behavior exactly (`next/link` with the same className) so no existing internal usages on the homepage change.
    - Do NOT auto-detect external by inspecting `href` — explicit boolean prop only. (Avoids surprise behavior for any future internal absolute URL.)

    Step 2 — In `src/app/page.tsx` lines 95-102, replace the `<p>` body verbatim with the new copy. Preserve the wrapping `<p className="max-w-[45rem] text-body-lead text-ink">`. Use the `&rsquo;` HTML entity for apostrophes (matches existing file convention). Use `<IntroLink>` for all three links: the two prometheus.today links pass `external` (and the {" "} spacing pattern already used at line 97); Monty Monthly stays internal.

    Final paragraph (markup template):
    `<p className="max-w-[45rem] text-body-lead text-ink">`
    `  I&rsquo;m Monty. I build, write, learn, and lift. I run <IntroLink href="https://prometheus.today" external>Prometheus</IntroLink>, a startup that AI-enables enterprise businesses. We automate processes, build agentic systems, and increase operating leverage. (Check out our <IntroLink href="https://prometheus.today/case-studies.html" external>case studies</IntroLink>.) Once a month I publish <IntroLink href="/newsletter">Monty Monthly</IntroLink>. If you like science, technology, agriculture, fitness, finance, culture, and beekeeping, we&rsquo;ll get along.`
    `</p>`

    Preserve surrounding whitespace via the same `{" "}` pattern the file already uses between text and `<IntroLink>` elements so wrap behavior matches the rest of the page.
  </action>
  <verify>
    <automated>npm run build && npm run lint</automated>
    Manual sanity:
    - `grep -n "AI-enables enterprise businesses" src/app/page.tsx` returns 1 line
    - `grep -n "case-studies.html" src/app/page.tsx` returns 1 line
    - `grep -n "external" src/components/editorial/intro-link.tsx` returns the new prop in both the type and the function body
    - Visual: clicking "Prometheus" or "case studies" in the rendered home page opens a new tab; "Monty Monthly" navigates client-side to `/newsletter`.
  </verify>
  <done>
    `IntroLink` accepts an `external` prop without breaking existing internal callers. The homepage intro paragraph matches the verbatim copy in this plan and the three links resolve to their correct destinations with correct target/rel semantics.
  </done>
</task>

<task type="auto">
  <name>Task D: Remove photograph numbering overlay (Edit 5)</name>
  <files>src/app/page.tsx</files>
  <action>
    In the Section 04 (Photographs) grid loop at `src/app/page.tsx:247-260`:
    1. Delete the entire `<span className="absolute left-3.5 bottom-3 text-[10px] uppercase tracking-[0.2em] font-bold text-paper mix-blend-difference">No. {p.no}</span>` element (lines 256-258).
    2. Change `<div key={p.no} className={p.className}>` (line 248) to `<div key={p.src} className={p.className}>` so the `key` no longer depends on the `no` field.

    DO NOT remove the `no` field from `HOME_PHOTOS` (lines 22-29). The user's original instruction assumed nothing else read `no`, but `src/components/home-v2/cycling-photo.tsx` consumes `photos[idx].no` for both an `aria-label` and a visible epigraph overlay. Removing the field would break the epigraph component. Scope this edit to the photo grid only; see Risks/Notes #3 for a follow-up question on whether the epigraph overlay should also lose its numbering.
  </action>
  <verify>
    <automated>npm run build && npm run lint</automated>
    Manual sanity:
    - `grep -n "No\\. {p.no}" src/app/page.tsx` returns 0 lines
    - `grep -n "mix-blend-difference" src/app/page.tsx` returns 0 lines (the overlay was the only user)
    - `grep -n "key={p.src}" src/app/page.tsx` returns 1 line
    - `grep -n "HOME_PHOTOS\\|photos\\[idx\\]\\.no" src/components/home-v2/cycling-photo.tsx` still resolves (epigraph still works)
  </verify>
  <done>The Section 04 photo grid renders six photos with no number overlay. The hero epigraph (CyclingPhoto) still labels each photo correctly via its existing `no` field.</done>
</task>

<task type="auto">
  <name>Task E: Active · AI Studio → Active · AI Startup (Edit 6)</name>
  <files>src/app/page.tsx</files>
  <action>
    Line 112 of `src/app/page.tsx`: change the text inside `<div className="text-meta uppercase text-muted">` from `Active · AI Studio` to `Active · AI Startup`. Preserve the middle-dot `·` and surrounding whitespace.
  </action>
  <verify>
    <automated>npm run build</automated>
    Manual sanity:
    - `grep -n "AI Studio" src/app/page.tsx` returns 0 lines
    - `grep -n "AI Startup" src/app/page.tsx` returns 1 line
  </verify>
  <done>The Building section row 1 meta reads `Active · AI Startup`.</done>
</task>

<task type="auto">
  <name>Task F: Mobile-perf fix — render only active photo on mobile in CyclingPhoto</name>
  <files>src/components/home-v2/cycling-photo.tsx</files>
  <action>
    Context: PSI mobile score is 87, LCP is 3.8s (gate: 2.5s); PSI flags 611 KiB of image-delivery savings. Root cause: `CyclingPhoto` renders all 6 hero photos on mobile via the `photos.map` on lines 81-93, but only `photos[0]` is ever visible there (cycling is desktop-only). The other 5 photos still load because they share photo[0]'s absolute-positioned bounding box, so IntersectionObserver sees them as in-viewport. Fix is a viewport gate on the render.

    Step 1 — Gate the photo render by `isDesktop` in `src/components/home-v2/cycling-photo.tsx`.

    Replace the existing `photos.map(...)` block (lines 81-93) with a conditional render:

    ```tsx
    {isDesktop ? (
      photos.map((p, i) => (
        <Image
          key={p.src}
          src={p.src}
          alt={i === idx ? alt : ''}
          fill
          sizes="(max-width: 768px) 100vw, 1120px"
          priority={i === 0}
          className={`object-cover saturate-[0.92] transition-opacity duration-[400ms] ease-in-out ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))
    ) : (
      <Image
        key={photos[0].src}
        src={photos[0].src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1120px"
        className="object-cover saturate-[0.92]"
      />
    )}
    ```

    Notes for the executor while editing:
    - Mobile branch (`!isDesktop`) renders exactly one `<Image>` — `photos[0]`. No opacity transition class (it's the only image, always visible). Keep `priority` and `sizes` matching the existing photo-0 config so LCP image hints stay intact.
    - Desktop branch keeps the existing stacked behavior byte-for-byte (same key, alt, sizes, priority gate, opacity transition class) — required for the 400ms cross-fade.
    - SSR / hydration behavior: `isDesktop` starts `false` on first render. SSR therefore emits only `photos[0]`. Post-hydrate on desktop viewports, the effect on lines 45-52 flips `isDesktop` to `true` and React re-renders to stack all 6. This causes a small client-side reflow ONLY on desktop. Acceptable because: (1) mobile (the broken case) gets the LCP win; (2) the 5 added images render at `opacity-0` so the reflow is invisible; (3) photos 1-5 retain `priority={false}` so they still load lazily after photo 0 paints.

    Step 2 — Leave the existing `advance()` handler and the `useEffect` cycle untouched. Both already early-return when `!isDesktop` (lines 57, 65) — they're a no-op on mobile, so the mobile static render is fine. The outer `<button>` wrapper stays as-is.

    Step 3 — Commit as one atomic AFTER Task A's chrome-refactor commit, with message:
    `perf(cycling-photo): render only active photo on mobile — kills 5 unused image requests, drops mobile LCP`
  </action>
  <verify>
    <automated>npm run build</automated>
    Manual checks (`npm run dev`):
    - Mobile (Chrome DevTools narrow viewport ≤768px): open `/`, inspect the hero `<button>` element. Count `<img>` (or Next.js `<Image>`'s underlying `<img>`) elements inside the button — expect exactly 1. Network tab: only 1 hero-photo request, not 6.
    - Desktop (>768px): open `/`, inspect the hero `<button>` — expect 6 `<img>` elements stacked. Click the hero, confirm the 400ms cross-fade still cycles between photos. No hydration warnings in the dev server console.
    - `grep -n "isDesktop \?" src/components/home-v2/cycling-photo.tsx` returns at least 1 line (the new ternary gating the render).
    - `grep -n "photos.map" src/components/home-v2/cycling-photo.tsx` returns 1 line (the desktop branch only).
    Post-deploy verification (cannot run pre-deploy; surfaced in Risks #8): run PageSpeed Insights on the deployed homepage, mobile run. Expect LCP to drop from 3.8s toward 2.0s and the "Improve image delivery" audit to no longer flag the 5 hero photos.
  </verify>
  <done>On mobile, CyclingPhoto renders exactly 1 `<Image>` and triggers exactly 1 hero-photo network request. On desktop, all 6 photos still render and cycle on click / auto-advance over a 400ms cross-fade. `npm run build` passes; no hydration warnings.</done>
</task>

</tasks>

## File paths (all touched by this plan)

Created:
- `src/components/home-v2/ink-footer.tsx`
- `src/components/home-v2/writing-subscribe-cta.tsx`

Modified:
- `src/components/nav/navigation.tsx`
- `src/components/home-v2/cycling-photo.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/writing/page.tsx`
- `src/app/events/page.tsx`
- `src/app/photos/page.tsx`
- `src/components/main-offset.tsx`
- `src/components/editorial/intro-link.tsx`

Deleted:
- `src/components/footer.tsx`
- `src/__tests__/components/footer.test.tsx`

## Acceptance criteria

- [ ] Desktop on **every** route (`/`, `/about`, `/blog`, `/blog/[slug]`, `/links`, `/newsletter`, `/projects`, `/writing`, `/events`, `/photos`, `/specimen`, `/prometheus`) renders EditorialHeader as the only nav. The correct nav label is bolded per the pathname mapping: `/projects → Building`, `/writing` or `/blog*` → `Writing`, `/events → Events`, `/about → About`, `/links → Links`, everything else → no label bolded.
- [ ] Mobile on every route renders only the Navigation mobile bar + drawer; EditorialHeader is hidden by its own `hidden md:flex` gate.
- [ ] InkFooter renders globally as the footer on every route (via `layout.tsx`). No route renders its own inline `<footer>` directly inside the page file.
- [ ] On `/writing`, the extracted `WritingSubscribeCTA` renders inline above the global InkFooter as two distinct sections, visually separated.
- [ ] On `/`, `/events`, `/photos`, `/about`, `/blog`, `/blog/[slug]`, `/links`, `/newsletter`, `/projects`, `/specimen`, `/prometheus`, only the global InkFooter renders (no Substack CTA above it).
- [ ] `src/components/footer.tsx` and `src/__tests__/components/footer.test.tsx` no longer exist.
- [ ] `src/app/page.tsx` does not import or render EditorialHeader inline; no page file in `src/app/` does either.
- [ ] Hero photo figcaption reads exactly `A year in motion · 2025–26` (no "Plate I", no "Photographed on film").
- [ ] Intro paragraph matches the verbatim new copy with `Prometheus` and `case studies` opening in new tabs (external) and `Monty Monthly` navigating internally to `/newsletter`.
- [ ] Section 04 photo grid has no `No. NN` overlay on any tile; each `<div>` keys off `p.src`.
- [ ] Building section row 1 meta reads `Active · AI Startup`.
- [ ] On mobile (≤768px viewport), the CyclingPhoto button contains exactly 1 hero `<img>` and the page issues exactly 1 hero-photo network request.
- [ ] On desktop (>768px viewport), the CyclingPhoto button contains all 6 hero `<img>` elements stacked, and the 400ms cross-fade cycle still works on click / auto-advance.
- [ ] `npm run build` succeeds.
- [ ] `npm run lint` succeeds.
- [ ] `grep -rn "from.*@/components/footer\"" src/` returns zero matches.
- [ ] `grep -rn "EditorialHeader" src/app/` returns zero matches.

## Verification commands

```bash
# From repo root:
npm run build                                                   # MUST pass
npm run lint                                                    # MUST pass

# Grep gates:
grep -rn "from.*@/components/footer\"" src/                     # expect 0 matches (note: trailing quote)
grep -rn "DESKTOP_LINKS\|isV2Route" src/                        # expect 0 matches
grep -rn "EditorialHeader" src/app/                             # expect 0 matches
grep -n "EditorialHeader" src/components/nav/navigation.tsx     # expect 2 matches (import + JSX)
grep -n "<footer" src/app/page.tsx src/app/events/page.tsx src/app/photos/page.tsx src/app/writing/page.tsx  # expect 0 matches
grep -n "<footer" src/components/home-v2/writing-subscribe-cta.tsx  # expect 1 match
grep -n "InkFooter" src/app/layout.tsx                          # expect 2 matches (import + JSX)
grep -n "WritingSubscribeCTA" src/app/writing/page.tsx          # expect 2 matches (import + JSX)
grep -n "Plate I\|Photographed on film\|AI Studio" src/app/page.tsx   # expect 0 matches
grep -n "AI-enables enterprise businesses" src/app/page.tsx     # expect 1 match
grep -n "case-studies.html" src/app/page.tsx                    # expect 1 match
grep -n "A year in motion · 2025–26" src/app/page.tsx           # expect 1 match
grep -n "key={p.src}" src/app/page.tsx                          # expect 1 match
grep -n "isDesktop ?" src/components/home-v2/cycling-photo.tsx  # expect at least 1 match (new ternary gate)
grep -n "photos.map" src/components/home-v2/cycling-photo.tsx   # expect 1 match (desktop branch only)
```

Dev-server visual check (`npm run dev`) is REQUIRED after Task A given the cross-route blast radius — see Risks/Notes #1. Browse: `/`, `/about`, `/blog`, `/blog/[slug]` (any published post), `/links`, `/newsletter`, `/projects`, `/writing`, `/events`, `/photos`, `/specimen`, `/prometheus`. Confirm EditorialHeader renders + correct label bolded + InkFooter below. On `/writing` specifically, confirm the Substack CTA sits above the global InkFooter.

Dev-server DOM/network check is REQUIRED after Task F — see Risks/Notes #8. Use Chrome DevTools mobile viewport to count `<img>` elements in the hero `<button>` (expect 1) and confirm only 1 hero-photo network request fires.

## Risks / notes

1. **Path 2 is a chrome refactor with cross-route blast radius.** Verification must include visiting every route (v1.0 and v2.0) to confirm EditorialHeader renders correctly and the InkFooter is below it. Routes touched: `/`, `/about`, `/blog`, `/blog/[slug]`, `/links`, `/newsletter`, `/projects`, `/writing`, `/events`, `/photos`, `/specimen`, `/prometheus`, `/api/*`. (`/api/*` doesn't render UI, but layout.tsx applies to them — non-issue, noted for completeness.)

2. **v1.0 pages now inherit the dark editorial ink palette in their footer.** The old `src/components/footer.tsx` rendered a footer styled for the light v1.0 palette on `/about`, `/blog/*`, `/links`, `/newsletter`, `/projects`. After this task, those routes render the inverted-ink `InkFooter` (designed for the v2.0 home's dark footer band). Visually correct per Path 2's intent — but worth confirming visually on `/about` and `/blog/[slug]` that the contrast band reads well after the page content.

3. **`HOME_PHOTOS.no` is still in use.** The user's edit 5 instruction said to "remove the `no` field from each of the 6 entries since nothing else reads it (verify with grep)". The grep verification found `src/components/home-v2/cycling-photo.tsx` actively reads `photos[idx].no` to build its `aria-label` and to render its own `No. {photos[idx].no}` overlay on the hero epigraph. This plan therefore KEEPS the `no` field on `HOME_PHOTOS` and scopes Task D to only removing the grid overlay + switching the grid `key` to `p.src`. **Open question for the user:** should the hero epigraph (CyclingPhoto) also lose its `No. NN` overlay for consistency with Section 04? Easy follow-up if yes — strip the overlay span and its aria-label fragment from `cycling-photo.tsx`. Not done here because edit 5 specifically referenced the photos grid (lines 256-258), not the hero.

4. **IntroLink extension is additive.** The new `external` prop defaults to `undefined`, so every existing internal call (`/newsletter`, `/blog` and any future internal href) keeps using `next/link` exactly as before. Only the two new external links in the updated intro paragraph pass `external`. Test surface stays small.

5. **`Navigation` stays a client component.** It still needs `useState` (drawer open state) and `usePathname` (derive-active mapping). The derive-active logic adds ~6 lines of branching to compute a string-or-undefined — negligible client-bundle impact. EditorialHeader itself remains a server component; passing it `active={activeLabel}` from a client parent is fine in App Router (server components rendered as children of client components serialize at build/render).

6. **`/writing` Substack CTA preserved via extraction (per user decision Q2).** Rather than deleting the inline `<footer>` on `/writing`, this plan extracts it to `src/components/home-v2/writing-subscribe-cta.tsx` (server component) and renders it inline on `/writing` above the global InkFooter. Result: `/writing` shows the Substack subscribe CTA section, then the global InkFooter — two distinct dark-band sections stacked. No other route gets the CTA. The Substack CTA is preserved without polluting the global InkFooter or any other route.

7. **`/photos` and `/events` have no inline footer.** Confirmed via `grep -n "<footer" src/app/photos/page.tsx src/app/events/page.tsx` → 0 lines. So Step 2.5 (re-confirm no inline footers) is a no-op for both. Only `/` and `/writing` had inline footers — `/`'s is lifted into InkFooter, `/writing`'s is extracted to WritingSubscribeCTA. Surfacing this so the executor doesn't waste cycles looking for one that isn't there.

8. **Mobile-perf verification post-deploy requires a fresh PSI run.** Task F's automated verification (`npm run build`) only proves the change compiles and the dev-server DOM check proves the gate works locally. The real win — mobile LCP dropping from 3.8s toward the 2.5s gate, and the "Improve image delivery" PSI audit dropping the 611 KiB flag — can only be confirmed after the change is deployed to production (Vercel preview or main). Run PageSpeed Insights against the deployed URL (mobile run) post-deploy and record the new LCP. If LCP stays above 2.5s, file a follow-up to investigate other causes (font loading, JS hydration cost). Not blocking for shipping this plan — the DOM/network check is sufficient to prove the underlying cause is fixed.

9. **Desktop hydration reflow in Task F is intentional but visually invisible.** Because `isDesktop` starts `false` on first render, SSR emits only `photos[0]`. Post-hydrate on desktop, the effect flips `isDesktop` to `true` and React re-renders to stack all 6. The 5 newly-mounted images are `opacity-0`, so no visible flash occurs. If a `useLayoutEffect`-style early-detect ever becomes necessary, it's a follow-up — for now, the trade favors mobile, which is the broken case.

<verification>
After every task, run `npm run build` and verify the relevant grep gate(s) for that task. After Task A specifically, also run `npm run lint` AND do the per-route dev-server pass (Risks/Notes #1) — Task A is by far the highest-blast-radius change in this plan. After Task F, do the mobile DOM-count + network-request check (Risks/Notes #8) and queue a post-deploy PSI run for LCP verification.
</verification>

<success_criteria>
All acceptance criteria above pass. `npm run build` and `npm run lint` both succeed on the final state. Every route renders one nav and one footer per viewport (EditorialHeader desktop + Navigation mobile bar + InkFooter); `/writing` additionally renders the extracted `WritingSubscribeCTA` above the global InkFooter. All six homepage edits are visibly applied. Mobile DOM contains exactly 1 hero photo (Task F win).
</success_criteria>

<output>
This is a quick task (no SUMMARY.md required by convention for `.planning/quick/*`). On completion, leave a short note in this directory or in the commit message describing what landed. Six atomic commits expected: A (chrome unification + WritingSubscribeCTA extraction), B (figcaption), C (blurb + IntroLink external), D (photo numbering), E (AI Studio → AI Startup), F (mobile perf).
</output>
