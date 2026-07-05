---
phase: 16-interior-pages-on-notion-data
reviewed: 2026-06-20T00:00:00Z
depth: standard
files_reviewed: 26
files_reviewed_list:
  - src/app/about/page.tsx
  - src/app/blog/[slug]/page.tsx
  - src/app/events/page.tsx
  - src/app/links/page.tsx
  - src/app/newsletter/page.tsx
  - src/app/projects/[slug]/page.tsx
  - src/app/projects/page.tsx
  - src/app/prometheus/page.tsx
  - src/app/uses/page.tsx
  - src/app/watching/page.tsx
  - src/app/writing/page.tsx
  - src/components/editorial/all-link.tsx
  - src/components/editorial/intro-link.tsx
  - src/components/editorial/list-row.tsx
  - src/components/editorial/rule-strong.tsx
  - src/components/editorial/rule.tsx
  - src/components/editorial/section-label.tsx
  - src/components/editorial/year-block.tsx
  - src/components/home-v2/editorial-header.tsx
  - src/components/layout/conditional-footer.tsx
  - src/components/layout/v3-footer.tsx
  - src/components/nav/navigation.tsx
  - src/components/v3/card.tsx
  - src/components/v3/video-card.tsx
  - src/lib/notion-projects.ts
  - src/lib/uses.ts
  - src/lib/watching.ts
findings:
  critical: 2
  warning: 6
  info: 5
  total: 13
status: issues_found
---

# Phase 16: Code Review Report

**Reviewed:** 2026-06-20
**Depth:** standard
**Files Reviewed:** 26
**Status:** issues_found

## Summary

Phase 16 repaints the interior pages onto the Pumpkin Amber design system and adds two static pages (`/uses`, `/watching`) plus a shared nav/footer. The Notion loaders and image proxy are largely preserved, and the static-data pages are clean. The most serious defects are security/robustness gaps around external links: the `/events` Upcoming RSVP CTA and Past rows route outbound URLs through `next/link` with no `target`/`rel`, defeating the tabnabbing protection the file's own comments claim to provide, and creating broken client-side navigation for absolute URLs. There is also a design-token defect: a family of utility classes (`text-accent`, `bg-accent`, `text-ink`, `text-muted`) reference CSS variables that are not in Tailwind v4's `--color-*` namespace, so they likely generate no styles — affecting Card kickers, VideoCard hover, and the desktop nav. Several smaller correctness and consistency issues round out the list.

## Critical Issues

### CR-01: `/events` Upcoming RSVP links bypass tabnabbing protection and break on external URLs

**File:** `src/app/events/page.tsx:99-103` (via `src/components/editorial/all-link.tsx:9-18`)
**Issue:** `event.link` is a Notion URL property (`src/lib/notion-events.ts:44` — `link: string | null`, populated only from a `url`-type property), i.e. an outbound absolute URL. It is rendered with `<AllLink href={event.link}>`, but `AllLink` always renders a `next/link` with no `target` or `rel`. Two problems:
1. Outbound links open in the same tab via the client router. `next/link` to an absolute external URL produces a full navigation, and there is no `rel="noopener noreferrer"` — this is the exact tabnabbing/`window.opener` exposure the project guards against everywhere else (`/links`, `/newsletter`, footer all set `rel`). The file header even documents "AllLink RSVP CTA" as the intended outbound mechanism, but `AllLink` provides none of the outbound safety.
2. Client-side `next/link` navigation to an external absolute URL is not the intended UX for an RSVP and can produce inconsistent behavior across the App Router.

**Fix:** Use a plain anchor for outbound RSVP links, or have `AllLink` accept an `external` flag like `IntroLink` does:
```tsx
{event.link && (
  <a
    href={event.link}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block border-b border-[var(--color-text)] pb-1 text-label uppercase text-[var(--color-text)]"
  >
    {featured ? "Reserve a seat →" : "RSVP →"}
  </a>
)}
```

### CR-02: `/events` Past rows route external URLs through `next/link` with `href="#"` fallback and no `rel`

**File:** `src/app/events/page.tsx:186-204`
**Issue:** Past events wrap each row in `<Link href={event.link ?? "#"}>` (`next/link`). When `event.link` is an external URL this has the same missing-`rel`/same-tab tabnabbing exposure as CR-01. When `event.link` is `null`, the fallback `href="#"` makes the entire row a focusable link that scrolls to the top of the page on click/Enter — a confusing dead interaction and an accessibility defect (a link that goes nowhere). The whole row is also a single giant link wrapping three independent spans.

**Fix:** Only render an anchor when a link exists, and use a plain `<a>` with outbound safety; render a non-interactive container otherwise:
```tsx
{past.map((event, i) => {
  const rowClass = cn(
    "grid grid-cols-1 gap-6 py-5 md:grid-cols-[120px_1fr_1fr] md:gap-8",
    i > 0 && "border-t border-[var(--color-border)]"
  );
  const content = (<>{/* the three spans */}</>);
  return event.link ? (
    <a key={event.id} href={event.link} target="_blank" rel="noopener noreferrer" className={rowClass}>
      {content}
    </a>
  ) : (
    <div key={event.id} className={rowClass}>{content}</div>
  );
})}
```

## Warnings

### WR-01: Accent/ink utility classes likely resolve to nothing under Tailwind v4

**File:** `src/components/v3/card.tsx:39,60,68`; `src/components/v3/video-card.tsx:37,55,58`; `src/components/home-v2/editorial-header.tsx:43,56`
**Issue:** Tailwind v4 generates color utilities only from the `--color-*` token namespace. `globals.css` defines the accent as `--accent` (not `--color-accent`) and has no `--color-ink` / `--color-muted` tokens at all. Therefore:
- `text-accent`, `bg-accent`, `border-l-accent`, `border-accent`, `group-hover:bg-accent`, `group-hover:border-l-bg` (Card kicker, VideoCard hover fill + play triangle) have no backing utility.
- `text-ink`, `text-muted` (EditorialHeader brand + nav active/inactive states) have no backing token.

The result is that Card kickers, the VideoCard hover accent, and desktop nav coloring silently fall back to inherited color rather than the intended teal/ink. This pattern is reused throughout the pre-existing v3 library, so it may be a system-wide convention defect rather than Phase 16-specific — but it directly affects the in-scope components' visual correctness and should be verified against a real build (`bg-bg`, `text-text-dim`, `text-text-muted`, `border-border` DO resolve because their tokens are `--color-bg`, `--color-text-dim`, etc.).
**Fix:** Either add aliased tokens in `@theme inline` (`--color-accent: var(--accent); --color-ink: var(--color-text); --color-muted: var(--color-text-muted);`) or switch the classes to arbitrary values (`text-[var(--accent)]`, `text-[var(--color-text)]`, `text-[var(--color-text-muted)]`) as the page-level files already do.

### WR-02: `/projects` groups by `lastEdited` but sorts by Notion "Date" — inconsistent year buckets and ordering

**File:** `src/app/projects/page.tsx:25-36` and `src/lib/notion-projects.ts:134`
**Issue:** `getPublishedProjects` sorts results by the Notion `Date` property descending, but `groupProjectsByYear` buckets each project by `new Date(project.lastEdited).getUTCFullYear()` (the page's `last_edited_time`). A project authored in 2024 but edited yesterday lands in the 2026 bucket, and within a bucket the order reflects the `Date` sort, not edit recency — so the year heading and the card order can disagree with each other and with user expectation. `/writing` correctly groups by `post.date` (the same field it implicitly orders on), making `/projects` the inconsistent one.
**Fix:** Group by the same field used for the intended chronology. If projects should be grouped by their `Date` property, expose that field on `Project` and group on it; if `lastEdited` is genuinely intended, document why and sort the query by `last_edited_time` so order and buckets agree.

### WR-03: `RuleStrong` exists in two locations with divergent markup and semantics

**File:** `src/components/editorial/rule-strong.tsx` vs `src/components/v3/rule-strong.tsx`; consumed inconsistently in `src/app/blog/[slug]/page.tsx:10` (v3 version) vs every other in-scope page (editorial version)
**Issue:** Two components share the name `RuleStrong` but render different elements and tokens: the editorial one is `<hr className="border-t border-[var(--color-border-strong)]">`; the v3 one is `<div className="h-[2px] bg-text opacity-85 my-8">` (and `bg-text` itself depends on a `--color-text` utility plus adds vertical margin the editorial version lacks). The blog post page imports the v3 variant while sibling pages (`/projects/[slug]`, `/writing`, `/events`, etc.) use the editorial variant, producing visually different separators on otherwise-parallel detail pages.
**Fix:** Consolidate to a single `RuleStrong` (prefer the editorial token-driven `<hr>`), update the blog page import, and delete the duplicate to prevent further drift.

### WR-04: `/events` Upcoming and Past section numerals both labeled "03"

**File:** `src/app/events/page.tsx:151` (`numeral="03 — Upcoming"`) and `src/app/events/page.tsx:184` (`numeral="03 — Past"`)
**Issue:** Both sections on the same page carry the numeral `03`. The editorial numbering convention is a running index (e.g. `/newsletter` uses `02 -- Issues`), so two `03`s on one page is a content bug that misleads the reader and breaks the sequence.
**Fix:** Renumber the Past section (e.g. `04 — Past`) or whatever the intended running index is for `/events`.

### WR-05: `/links` computes redundant `opensNewTab` and applies `data-umami-event` only to http (not mailto)

**File:** `src/app/links/page.tsx:46-63`
**Issue:** Minor logic smell that risks future bugs: `opensNewTab = isHttp || isMailto` is identical to the branch guard `if (isHttp || isMailto)`, so `opensNewTab` is always `true` inside the branch — the ternaries `target={opensNewTab ? ...}` / `rel={opensNewTab ? ...}` can never be false there. Separately, the analytics attribute fires for http links but not the mailto link, so email-click engagement is silently untracked. Neither is a crash, but the dead conditional invites a future editor to "fix" it incorrectly.
**Fix:** Drop the `opensNewTab` indirection (the branch already guarantees new-tab semantics) and decide deliberately whether `mailto` should emit a `links-click-email` event.

### WR-06: `/watching` ships a rickroll placeholder video ID to production data

**File:** `src/lib/watching.ts:22-27`
**Issue:** The first placeholder entry uses `dQw4w9WgXcQ` — the well-known Rick Astley "Never Gonna Give You Up" video — titled "The Philosophy of Building". If this static data is not swapped before launch (the file itself says "Monty to swap in real YouTube video IDs before v3 launch"), the live site links a fake title to a rickroll and renders its thumbnail. Because it is hardcoded data with no build-time guard, nothing prevents it from shipping.
**Fix:** Replace placeholder IDs with real content before launch, or add a guard (e.g. a dev-only assertion / lint) that fails the build while `TODO` channels or known-placeholder IDs remain.

## Info

### IN-01: Hardcoded `TODO` placeholder strings will render verbatim to users

**File:** `src/lib/uses.ts:50-53`; `src/lib/watching.ts:23-57`
**Issue:** `TODO: [Monty to fill in]` appears as the `detail`/`channel` for Hardware uses and every watching channel. These strings are presentational content and will render literally on the live pages if not replaced. Not a code bug, but a launch-blocking content gap that is invisible to type checks.
**Fix:** Track these as launch tasks; consider rendering nothing (or "Coming soon") when a value starts with `TODO:` so an un-filled field degrades gracefully.

### IN-02: `Project.cover` is a redundant alias of `Project.image`

**File:** `src/lib/notion-projects.ts:43-46,93-106`
**Issue:** `cover` and `image` are assigned the identical value (`cover: image`). Two fields holding the same data invite divergence (a future edit updating one but not the other) and add cognitive load — the `/projects` index keys existence off `project.image` while the detail page keys off `project.cover`.
**Fix:** Collapse to a single field and update the two consumers, or document the alias as intentional and permanent.

### IN-03: `Project.lastEdited` typed `string` but consumers guard for falsy/NaN

**File:** `src/lib/notion-projects.ts:51,113` and `src/app/projects/page.tsx:28-30`
**Issue:** `lastEdited: string` is always populated from `page.last_edited_time`, yet `groupProjectsByYear` defensively does `if (!project.lastEdited) continue;` and a `Number.isNaN` guard. The defensiveness is fine, but the type promises a value that the consumer treats as possibly-empty — a minor type/contract mismatch. (Contrast `BlogPost.date` which is documented as possibly `""`.)
**Fix:** Either keep the type honest (it is genuinely always present) and drop the impossible `!project.lastEdited` branch, or document why the guard exists.

### IN-04: `EditorialHeader` is documented for `/photos` but the footer also exposes `/photos` and `/watching` with no active-state mapping

**File:** `src/components/home-v2/editorial-header.tsx:11` and `src/components/nav/navigation.tsx:33-41`
**Issue:** The `active` union includes `Uses`/`Watching` (mapped in `navigation.tsx`) but `EditorialHeader`'s desktop `LINKS` only contains five entries, so `Uses`/`Watching`/`/photos`/`/prometheus` never bold anything on desktop — which is the documented intent, but it means the `active` union carries members that can never visibly take effect on desktop. Low risk; flagged for clarity since the comment chain across the two files is easy to misread as "these bold on desktop."
**Fix:** Add a short note that `Uses`/`Watching` active values are intentionally inert on the desktop bar (footer/mobile-drawer only), or narrow the desktop-relevant union.

### IN-05: `Date.now()`-style `new Date().getFullYear()` in footer is fine but untested for SSR/ISR staleness

**File:** `src/components/layout/v3-footer.tsx:163`
**Issue:** The copyright year is computed at render time in a Server Component. Under ISR (these pages use `revalidate`), the rendered year is frozen until the next revalidation, so on Jan 1 the footer can show last year until the page re-renders. Cosmetic only.
**Fix:** Acceptable as-is; if exactness matters, render the year on the client or rely on frequent revalidation.

---

_Reviewed: 2026-06-20_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
