---
phase: quick-260723-g2q
plan: 01
subsystem: api
tags: [next-image, sharp, vercel-edge-cache, pinboard, notion, vitest]

# Dependency graph
requires: []
provides:
  - Long-lived edge Cache-Control on /api/notion-cover and /api/notion-image success responses
  - Shared NEUTRAL_BLUR_DATA_URL placeholder + fade-in-on-load for pinboard/card/carousel cover images
  - FRAME_SIZES-driven retina (2x) ?w= sizing for pinboard cover requests
  - unoptimized next/image on every consumer of the already-sharp-processed /api/notion-cover proxy
affects: [phase-23-site-sweep-and-mono-og, phase-25-qa-perf-gate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single shared blurDataURL constant (src/lib/image-placeholder.ts) reused across every next/image LQIP instead of per-image blurhash computation"
    - "FRAME_SIZES map as single source of truth for both dimension attributes and retina ?w= sizing on pinboard covers"
    - "unoptimized on next/image when the src is already a sharp-processed same-origin proxy, to avoid double image optimization"

key-files:
  created:
    - src/lib/image-placeholder.ts
    - src/__tests__/api/notion-cover-route.test.ts
    - src/__tests__/api/notion-image-route.test.ts
    - src/__tests__/components/card-cover.test.tsx
    - src/__tests__/components/newsletter-carousel.test.tsx
  modified:
    - src/app/api/notion-cover/route.ts
    - src/app/api/notion-image/route.ts
    - src/components/v3/card-cover.tsx
    - src/components/v3/newsletter-carousel.tsx
    - src/components/home/pinboard.tsx
    - src/__tests__/home/pinboard.test.tsx
    - src/app/blog/[slug]/page.tsx
    - src/app/building/[slug]/page.tsx
    - src/components/blog/tag-filter.tsx

key-decisions:
  - "Cache-Control on notion-cover/notion-image success responses moved to public, max-age=300, s-maxage=31536000, stale-while-revalidate=86400 (accepted staleness tradeoff, error branches untouched)"
  - "unoptimized added to card-cover.tsx, blog/[slug], building/[slug], tag-filter.tsx (all /api/notion-cover consumers); notion-renderer.tsx (src=/api/notion-image, not sharp-processed) deliberately left alone"
  - "jsdom's CSS attribute-value selector matching does not reliably match a literal & inside a quoted attribute value; exact-src pinboard assertions switched from [src=\"...\"] selectors to getAttribute() comparison"

requirements-completed: [QUICK-260723-g2q]

# Metrics
duration: 20min
completed: 2026-07-23
---

# Phase quick-260723-g2q: Image Pipeline Fade-in, Placeholders, Hard Caching Summary

**Four atomic fixes to the Notion image pipeline: year-long edge caching on the proxy routes, a shared neutral-grey fade-in placeholder across pinboard/card/carousel covers, 2x-retina right-sizing of pinboard cover requests, and removal of double image optimization on every /api/notion-cover consumer.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-23T11:50Z (approx, first baseline test run)
- **Completed:** 2026-07-23T12:00Z (approx, final build verification)
- **Tasks:** 4/4 completed
- **Files modified:** 14 (5 created, 9 modified)

## Accomplishments
- notion-cover and notion-image proxy success responses now carry `Cache-Control: public, max-age=300, s-maxage=31536000, stale-while-revalidate=86400`, letting Vercel's edge serve repeat requests with zero function invocation; error responses are unchanged (no header)
- Pinboard cover images (Place/Book/Movie/Thing/YouTube), card grid covers, and newsletter carousel thumbnails all fade in from a shared neutral-grey placeholder instead of popping in blank/blotchy
- Pinboard covers now request roughly 2x their displayed frame width (420/300/300/400 for Place/Book/Movie/Thing) instead of the proxy's flat 640px default; YouTube thumbnails are unchanged
- Every next/image wrapping `/api/notion-cover` (card-cover, blog/[slug], building/[slug], tag-filter) is marked `unoptimized` so the image is optimized exactly once (by the proxy's own sharp pipeline), not re-optimized a second time by Next's `/_next/image`; notion-renderer.tsx (which proxies `/api/notion-image`, unprocessed) is deliberately unchanged

## Task Commits

Each task was committed atomically:

1. **Task 1: Hard proxy caching (notion-cover + notion-image routes)** - `df7b785` (feat)
2. **Task 2: Fade-in + neutral placeholder (pinboard, card-cover, newsletter-carousel)** - `bde9f25` (feat)
3. **Task 3: Right-size delivery (pinboard retina ?w= sizing)** - `555d8da` (feat)
4. **Task 4: Stop double-optimizing (unoptimized on notion-cover consumers)** - `bb132f6` (fix)

_All four tasks used `tdd="true"` (Tasks 1-3) or a direct verify gate (Task 4); tests were written alongside each implementation change within the same commit, matching the plan's action/verify structure rather than a separate RED/GREEN commit split._

## Files Created/Modified
- `src/app/api/notion-cover/route.ts` - Success-branch Cache-Control changed to the new long-lived directive; error branches untouched; doc comment explains the staleness tradeoff
- `src/app/api/notion-image/route.ts` - Identical Cache-Control change to its success branch only
- `src/__tests__/api/notion-cover-route.test.ts` - New: asserts exact header on success, absence on 404
- `src/__tests__/api/notion-image-route.test.ts` - New: same assertions for the image route
- `src/lib/image-placeholder.ts` - New: exports `NEUTRAL_BLUR_DATA_URL`, an 8x8 solid `#dadada` PNG data URL
- `src/components/v3/card-cover.tsx` - Adds `placeholder="blur"` + `blurDataURL` + (Task 4) `unoptimized` to its Image
- `src/components/v3/newsletter-carousel.tsx` - Adds the same placeholder/blurDataURL pair to its thumbnail Image
- `src/components/home/pinboard.tsx` - Adds `FRAME_SIZES` map, per-card `loaded` state + fade transition on the plain `<img>`, `decoding="async"`, `width`/`height` attrs, and (Task 3) `coverSrc()` retina `?w=` sizing
- `src/__tests__/components/card-cover.test.tsx` - New: asserts blur placeholder attrs
- `src/__tests__/components/newsletter-carousel.test.tsx` - New: asserts blur placeholder attrs + unchanged MM-glyph fallback
- `src/__tests__/home/pinboard.test.tsx` - Updated exact-src assertion to include `&w=420`; added dimension/fade-in test and a Movie `&w=300` retina test
- `src/app/blog/[slug]/page.tsx` - Adds `unoptimized` to the cover Image (priority/fetchPriority untouched)
- `src/app/building/[slug]/page.tsx` - Adds `unoptimized` to the cover Image (priority/fetchPriority untouched)
- `src/components/blog/tag-filter.tsx` - Adds `unoptimized` to the cover Image

## Decisions Made
- Kept sharp in the proxy route as the single point of image processing; stopped Next's optimizer from re-processing an already-processed response (Task 4's core reasoning), rather than removing sharp or rewriting CardCover's error-fallback logic.
- Reused one shared `FRAME_SIZES` map for both the fade-in dimension attributes (Task 2) and the retina `?w=` sizing (Task 3), so the two stay in lockstep instead of duplicating frame numbers.
- Did not touch `notion-renderer.tsx`'s Image (src built from a blockId pointing at `/api/notion-image`) since that route streams original bytes with zero sharp processing; Next's optimizer is the only place that image gets resized.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] jsdom CSS attribute-selector matching fails on literal `&` in quoted attribute values**
- **Found during:** Task 3 (pinboard retina sizing test update)
- **Issue:** The plan specified updating pinboard.test.tsx's exact-src assertion to use `img[src="/api/notion-cover?pageId=p1&w=420"]` (a CSS attribute-value selector). Empirically verified against this exact jsdom version that `querySelector` with a literal `&` inside a quoted attribute-value selector returns `null` even when a matching element exists (confirmed via isolated debug test: `starts-with` selectors without `&` in the pattern work fine, but exact-match and `ends-with` selectors containing `&` do not match).
- **Fix:** Switched the two affected assertions (Place `&w=420` and the new Movie `&w=300` test) from `container.querySelector('img[src="..."]')` to `Array.from(container.querySelectorAll("img")).find((el) => el.getAttribute("src") === "...")`, which does exact string comparison in JS rather than relying on the CSS selector engine.
- **Files modified:** src/__tests__/home/pinboard.test.tsx
- **Verification:** Both tests pass; confirmed via a throwaway debug test that isolated the selector-vs-getAttribute behavior difference before applying the fix.
- **Committed in:** 555d8da (Task 3 commit)

**2. [Process note, not a code deviation] Task 4's automated verify script false-positives on a pre-existing, unrelated file**
- **Found during:** Task 4 verification
- **Issue:** The plan's verify command includes `! grep -q "unoptimized" src/components/notion/notion-renderer.tsx`, intended to confirm this plan did not add `unoptimized` there. That file already contains `unoptimized={false}` (added in commit `d5bda9d`, 2026-04-16, long before this plan and unrelated to it), so the literal grep always fails regardless of this plan's changes.
- **Resolution:** Confirmed via `git diff --stat` that `notion-renderer.tsx` has zero changes from this plan (the done criteria's actual requirement -- "notion-renderer.tsx is untouched" -- is satisfied). No code fix applied since there is nothing to fix; this is a verify-script precision gap, not a functional issue.
- **Files modified:** none
- **Committed in:** n/a (verification-only finding)

---

**Total deviations:** 1 auto-fixed (1 bug), 1 process note
**Impact on plan:** The selector fix was necessary for the tests to correctly verify the intended behavior; no scope creep. The verify-script note does not affect delivered functionality.

## Issues Encountered
- During ad-hoc debugging of the jsdom selector issue, `git stash -u` was run twice by mistake while checking whether a pre-existing tsc error in `robots.test.ts` predated this plan. Both times the stash was popped back immediately (`git stash pop`), fully restoring the in-progress Task 4 edits with no data loss. Confirmed via `git status`/`grep` that all four Task 4 files retained their `unoptimized` additions after each pop. No further `git stash` was used for the remainder of the session.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All four fixes are live on `main`: hard edge caching, fade-in placeholders, retina right-sizing, and de-duplicated image optimization.
- `npx vitest run` = 216 passed, 0 failed, 16 todo (207 baseline + 9 new tests from this plan's Tasks 1-3; Task 4 added no new tests per plan).
- `npx tsc --noEmit` has 3 pre-existing errors, all in `src/__tests__/seo/robots.test.ts` (last touched in unrelated commit `8a93430`, 2026-06-20), untouched by this plan and not blocking `next build`'s own TypeScript pass.
- `npm run build` succeeds (exit 0); all routes including `/`, `/writing`, `/blog/[slug]`, and `/building/[slug]` generate cleanly.
- Manual browser spot-check (fade-in behavior, cached repeat loads, retina `&w=` request sizes) is recommended per the plan's verification step 4 but was not performed in this session (no browser automation available); left for Monty's next visual pass.

## Self-Check: PASSED

All created files verified present (src/lib/image-placeholder.ts, 4 new test files, this SUMMARY.md). All 4 task commit hashes (df7b785, bde9f25, 555d8da, bb132f6) verified present in git log.

---
*Phase: quick-260723-g2q*
*Completed: 2026-07-23*
