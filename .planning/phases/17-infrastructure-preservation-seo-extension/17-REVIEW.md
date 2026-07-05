---
phase: 17-infrastructure-preservation-seo-extension
reviewed: 2026-06-20T20:05:00Z
depth: standard
files_reviewed: 6
files_reviewed_list:
  - src/app/sitemap.ts
  - src/__tests__/seo/sitemap.test.ts
  - src/__tests__/seo/robots.test.ts
  - src/__tests__/seo/feed-route.test.ts
  - src/__tests__/pages/uses.test.tsx
  - src/__tests__/pages/watching.test.tsx
findings:
  critical: 0
  warning: 2
  info: 4
  total: 6
status: issues_found
---

# Phase 17: Code Review Report

**Reviewed:** 2026-06-20T20:05:00Z
**Depth:** standard
**Files Reviewed:** 6
**Status:** issues_found

## Summary

Phase 17's single production change — adding `/uses` and `/watching` entries to `staticRoutes` in `src/app/sitemap.ts` (lines 26-27) — is **correct**. Both entries use `priority: 0.6` and `changeFrequency: 'monthly'`, consistent with the sibling `/photos` route, and align with the canonical/metadata values declared in the actual `uses/page.tsx` and `watching/page.tsx` (verified by cross-reference). The five regression test files were run and **all 17 tests pass**, and their assertions accurately reflect the corresponding production code (verified against `robots.ts`, `blog/feed.xml/route.ts`, `lib/rss/blog-feed.ts`, and both page components).

No correctness, security, or data-loss defects were found. The findings below are test-quality issues: one regression test does not actually guard the behavior its name advertises, and one test carries a misleading dead mock. These weaken the regression net rather than break the build.

## Warnings

### WR-01: Sitemap "static routes count" test under-guards and its name/comment contradict

**File:** `src/__tests__/seo/sitemap.test.ts:30-39`
**Issue:** The test is named `includes at least 9 static routes (existing site routes)` and asserts `expect(staticLooking.length).toBeGreaterThanOrEqual(9)`, but the inline comment (lines 32-34) enumerates **11** actual static routes. More importantly, a `>= 9` threshold is too loose to be a meaningful regression guard: the 9 pre-existing static routes alone satisfy it, so this test would still pass even if both Phase 17 additions (`/uses`, `/watching`) were deleted from `sitemap.ts`. It provides false confidence as a "did the static route set survive" check. (The dedicated `/uses` and `/watching` tests on lines 14-28 do cover the new routes, so this is a redundancy/clarity defect, not a coverage hole — but the assertion as written guards nothing the others don't.)
**Fix:** Make the count exact so it actually detects accidental route additions/removals, and fix the name to match:
```ts
it('includes exactly 11 static routes (existing + /uses + /watching)', async () => {
  const result = await sitemap()
  const staticLooking = result.filter(
    (entry) => !entry.url.includes('/blog/') && !entry.url.includes('/projects/')
  )
  expect(staticLooking.length).toBe(11)
})
```

### WR-02: `/uses` page test mocks `next/image`, which the page never imports

**File:** `src/__tests__/pages/uses.test.tsx:16-19`
**Issue:** The test installs a `vi.mock("next/image", ...)` factory, but `src/app/uses/page.tsx` imports no `next/image` — its only children (`PageHero`, `UsesList`, `RuleStrong`, `Breadcrumbs`) are each independently mocked, and `UsesList` is stubbed to an empty `<div>`. The mock is dead: it never intercepts anything. This misleads a future maintainer into believing the page (or its rendered subtree) depends on `next/image`, and it masks a real regression — if someone later adds an `<Image>` to the page, the test will silently keep mocking it out instead of exercising it. (Contrast with `watching.test.tsx`, where the same `next/image` mock is also present and equally unused, since `VideoCard` is stubbed — same defect, noted as IN-04.)
**Fix:** Remove the unused `next/image` mock from `uses.test.tsx` (lines 16-19). If the intent is to defend against future `<Image>` usage, document that intent in a comment; otherwise delete it to keep the mock set honest about the page's real dependencies.

## Info

### IN-01: `await` applied to synchronous page components

**File:** `src/__tests__/pages/uses.test.tsx:64`, `src/__tests__/pages/watching.test.tsx:58`
**Issue:** `renderUsesPage`/`renderWatchingPage` do `const element = await UsesPage()` / `await WatchingPage()`, but both page components are declared as **synchronous** functions (`export default function UsesPage()` returning JSX, not a Promise). Awaiting a non-thenable is harmless, but it implies these are async Server Components when they are not, and would mask a real bug if the page were ever converted to async and started returning a rejected promise that the test should surface.
**Fix:** Drop the `await` (`const element = UsesPage()`), or keep it only if/when the components become `async`. Low priority — purely a clarity/intent issue.

### IN-02: Page-render tests assert presence but not breadcrumb ordering/links

**File:** `src/__tests__/pages/uses.test.tsx:87-95`, `src/__tests__/pages/watching.test.tsx:81-89`
**Issue:** The breadcrumb tests assert only that "Home" and "Uses"/"Watching" text appears at least once (`getAllByText(...).length > 0`). The real `Breadcrumbs` component (`src/components/seo/breadcrumbs.tsx`) emits the trail into an `sr-only` nav and a `BreadcrumbList` JSON-LD schema, and the page passes `{ name: "Home", href: "/" }` then `{ name: "Uses" }`. The tests would still pass if the order were reversed or the `href` dropped, neither of which they verify. Since the component is fully mocked, the test only confirms the page hands the two item names to `Breadcrumbs` — acceptable for a unit test, but the assertions are weaker than the docblock ("renders 'Home' item") implies.
**Fix:** Optional — assert on the items array passed to the mock (e.g., capture the mock's call args and check `[{name:'Home',href:'/'},{name:'Uses'}]`) if breadcrumb structure/SEO ordering is something this phase intends to lock down.

### IN-03: PageHero mock silently drops the `crumb` prop containing the page name

**File:** `src/__tests__/pages/watching.test.tsx:34-37` (and `uses.test.tsx:40-43`)
**Issue:** The `PageHero` mock renders only `title`, discarding the `crumb="Home / Watching"` and `sub` props the page passes. This is intentional (keeps the breadcrumb-count assertion clean — "Watching" then resolves to exactly the breadcrumb span), but it means the test exercises none of the hero's crumb/sub rendering. No defect; flagged so the deliberate narrowing is visible to future readers who might expect the hero crumb to be asserted.
**Fix:** None required. Consider a one-line comment noting the mock intentionally ignores `crumb`/`sub`.

### IN-04: Unused `next/image` mock duplicated in `/watching` test

**File:** `src/__tests__/pages/watching.test.tsx:16-19`
**Issue:** Same dead-mock pattern as WR-02: `next/image` is mocked but `watching/page.tsx` does not import it (thumbnails are passed as a plain `thumbnail` URL string into the mocked `VideoCard`). Tracked separately from WR-02 because it's a distinct file; demoted to Info because the watching page's image rendering genuinely lives inside `VideoCard`, so a future `<Image>` move there is plausible — but as written the mock intercepts nothing.
**Fix:** Remove lines 16-19 from `watching.test.tsx`, or relocate the image assertion into the (out-of-scope, already-passing) `video-card.test.tsx` where the real `<Image>`/thumbnail rendering occurs.

---

_Reviewed: 2026-06-20T20:05:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
