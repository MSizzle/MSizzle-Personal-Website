---
phase: 12-sub-page-restyle-sweep
reviewed: 2026-05-21T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - src/app/about/page.tsx
  - src/app/blog/[slug]/page.tsx
  - src/app/blog/page.tsx
  - src/app/links/page.tsx
  - src/app/newsletter/page.tsx
  - src/app/projects/[slug]/page.tsx
  - src/app/projects/page.tsx
  - src/app/prometheus/page.tsx
  - src/components/projects/project-card.tsx
findings:
  critical: 0
  warning: 3
  info: 6
  total: 9
status: issues_found
---

# Phase 12 (Wave 2): Code Review Report

**Reviewed:** 2026-05-21
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found
**Diff base:** b25912b (Phase 12 Wave 2 restyle sweep)

## Summary

Wave 2 swaps v1 styling utilities (e.g., `text-2xl font-normal tracking-tight`, `opacity-75`, `[var(--border)]`) for v2.0 warm-paper tokens (`text-section-feature`, `text-muted`, `border-rule`, etc.) across seven pages plus the `ProjectCard` component, and replaces the carousel on `/newsletter` with a full-width responsive grid.

The token swap itself is mechanical and looks correct: every new class name resolves to a defined `@theme inline` token in `globals.css` (verified `--color-muted`, `--color-ink`, `--color-paper`, `--color-rule`, `--text-section-feature`, `--text-label`, `--text-list-title`, `--text-meta`, `--text-body-lead`). The Newsletter href fix in `links/page.tsx` (`/blog` -> `/newsletter`) is correct.

Three warnings flag real defects introduced or surfaced by the restyle: a missing `dateTime` attribute on the new `/newsletter` `<time>` element (SEO + a11y regression vs. blog post pattern), an unwrapped `<img>` tag on `/projects/[slug]` that lost the `aria-label` /accessibility hint the original muted background implied (and may load eagerly above the fold without dimensions, hurting CLS), and a missing `data-umami-event` on the new newsletter issue cards that breaks the analytics contract every other external link on the site obeys.

The remaining findings are info-level: pre-existing patterns surfaced by the diff (internal `/blog` link in `/about` rendered as a raw `<a>` instead of `next/link`, `mailto:` link forced into a new tab, mixed type-token usage in `ProjectCard`), plus minor consistency issues.

No critical security issues, no injection vectors, no unhandled-rejection patterns, no hardcoded secrets, no introduced regressions in error handling. `getPublishedPosts` / `getPostExcerpt` failures are wrapped in try/catch with empty-state fallbacks. The substack RSS fetch swallows errors and returns `[]`, which is matched by the conditional render in `newsletter/page.tsx`.

## Warnings

### WR-01: `<time>` on `/newsletter` issue cards is missing `dateTime` attribute

**File:** `src/app/newsletter/page.tsx:79-86`
**Issue:** The new issue-grid renders a `<time>` element without a machine-readable `dateTime` attribute. This is an HTML semantics regression (a `<time>` element without `dateTime` only works when the textual content itself is a valid date string — "January 1, 2026" is not parseable as a `datetime` value), an SEO miss (Google's structured data parsers prefer machine-readable timestamps), and inconsistent with `blog/[slug]/page.tsx:64-70` which correctly sets `dateTime={post.date}`.

**Fix:**
```tsx
<time
  dateTime={issue.pubDate}
  className="mt-2 block text-meta uppercase text-muted"
>
  {new Date(issue.pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })}
</time>
```
Use the raw RFC-2822 / ISO `pubDate` string from the RSS feed as the `dateTime` value.

### WR-02: `/projects/[slug]` hero `<img>` has no width/height, no `loading`, and no `decoding` hint

**File:** `src/app/projects/[slug]/page.tsx:51-56`
**Issue:** The phase removed `rounded-lg` from the wrapper but left the underlying plain `<img>` (escaped from `next/image` via the `eslint-disable @next/next/no-img-element` directive) in its original shape: no `width`/`height`, no `loading` attribute, no `decoding="async"`. Combined with `bg-muted` (`#9A9690`) as the placeholder background, this:
1. Causes a Cumulative Layout Shift (CLS) hit when the image arrives, because the browser cannot reserve space without intrinsic dimensions.
2. Renders a fairly dark gray block (`#9A9690`) above the fold while loading, which is much more visible than the original `rounded-lg` + token-muted combo and looks like an intentional gray slug rather than a loading placeholder.
3. Loses optimization opportunities (`loading="eager"` is the default; `fetchpriority="high"` and `decoding="async"` would help LCP).

**Fix:** Either reserve aspect ratio explicitly or set explicit dimensions; also signal hero priority:
```tsx
<div className="w-full aspect-[16/9] overflow-hidden bg-muted">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src={`/api/notion-cover?pageId=${project.id}`}
    alt={project.title}
    className="w-full h-full object-cover"
    loading="eager"
    decoding="async"
    fetchpriority="high"
  />
</div>
```
Alternatively, migrate to `next/image` against the `/api/notion-cover` route — the proxy already serves a content-typed image, so `next/image` with `unoptimized` or a configured loader will work.

### WR-03: Newsletter issue links are not tracked via Umami `data-umami-event`

**File:** `src/app/newsletter/page.tsx:57-63`
**Issue:** Every other external link on the site that we want analytics on uses `data-umami-event="..."` (see `src/app/links/page.tsx:50`, `src/app/projects/[slug]/page.tsx:91-92`). The new `/newsletter` issue grid links straight out to `montymonthly.substack.com/p/...` with no event attribute. Given the project's core value statement explicitly calls out "real data about who's visiting and what resonates," dropping tracking on the highest-intent CTA on the newsletter page is a measurable regression vs. the previous carousel layout (which the diff shows also had no tracking — so this is a missed opportunity to fix during the restyle, not a brand-new bug, but is now the most visible click target on the page).

**Fix:**
```tsx
<a
  key={issue.link}
  href={issue.link}
  target="_blank"
  rel="noopener noreferrer"
  data-umami-event="newsletter-issue-click"
  data-umami-event-title={issue.title}
  className="group block bg-paper border border-rule no-underline"
>
```

## Info

### IN-01: `/about` links to internal `/blog` via raw `<a>` instead of `next/link`

**File:** `src/app/about/page.tsx:41`
**Issue:** `<a href="/blog">essays on philosophy, technology, and life</a>` triggers a full page reload instead of client-side navigation. Pre-existing pattern, but it lives in a file the phase touched, and breaks the SPA feel the design system targets ("a site that feels alive").
**Fix:** `import Link from 'next/link'` and use `<Link href="/blog">`. Apply the same fix to any other internal hrefs in `prose` content if/when they appear.

### IN-02: `mailto:` links forced into `target="_blank"` on `/links`

**File:** `src/app/links/page.tsx:42-49`
**Issue:** `opensNewTab = isHttp || isMailto` causes the email link to render `target="_blank" rel="noopener noreferrer"`. Mail clients open in their own app/window already; the `_blank` is a no-op at best and on some platforms causes a stray empty browser tab to flash open. Pre-existing logic, not changed in this phase.
**Fix:** Drop `isMailto` from `opensNewTab`:
```ts
const opensNewTab = isHttp
```

### IN-03: `ProjectCard` h3 still uses v1-style utility, not v2.0 type token

**File:** `src/components/projects/project-card.tsx:10`
**Issue:** The card got a token-swap on its border (`border-rule`) and description (`text-muted`), but the title uses `text-base font-normal` instead of a v2.0 token (`text-list-title` would be the obvious match — it is defined for exactly this scale). This leaves the component half-migrated and means future theme tweaks (e.g., changing list title sizing) will skip project list items.
**Fix:** `className="text-list-title text-ink"` (or whichever scale the v2.0 recipe prescribes for compact list rows — `text-base font-normal` reads as ~16px regular, `text-list-title` is 28px so verify intent before swapping).

### IN-04: Newsletter `<Image>` `alt={issue.title}` may render as empty string

**File:** `src/app/newsletter/page.tsx:67-72`
**Issue:** `fetchMontyMonthlyIssues` defaults `title` to `''` if the RSS feed item is missing it. An empty `alt=""` signals "decorative image" to screen readers, but these thumbnails are content (they're the only visual differentiator between issues). If a feed item ever lacks a title, the card collapses to an unreachable visual.
**Fix:** Provide a fallback in the JSX:
```tsx
alt={issue.title || 'Monty Monthly newsletter issue'}
```

### IN-05: Inconsistent ScrollReveal usage between sibling pages

**File:** `src/app/about/page.tsx`, `src/app/prometheus/page.tsx`, `src/app/newsletter/page.tsx` (no ScrollReveal) vs. `src/app/blog/page.tsx`, `src/app/projects/page.tsx`, `src/app/links/page.tsx` (ScrollReveal on h1 + content)
**Issue:** Half the sub-pages animate their h1 in on scroll; half render statically. This is design-intentional in some cases (prose-heavy pages) but reads as inconsistent during page-to-page navigation. Worth confirming the recipe explicitly excludes prose pages from ScrollReveal; if not, add them. If yes, document that decision in `12-RECIPE.md`.
**Fix:** Either add `ScrollReveal` wrappers to about/prometheus/newsletter, or document the exclusion in the recipe so future restyles don't add them back.

### IN-06: `key={issue.link}` on newsletter grid relies on link uniqueness

**File:** `src/app/newsletter/page.tsx:58`
**Issue:** Substack post links are unique per issue, but if the RSS feed ever returns duplicates (e.g., during a republish, or two items missing `link` so both default to `''`), React throws the duplicate-key dev warning and may mis-reconcile updates. Low risk for this specific feed but not robust.
**Fix:** `key={issue.link || \`issue-${idx}\`}` or just include the index alongside link.

---

_Reviewed: 2026-05-21_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
