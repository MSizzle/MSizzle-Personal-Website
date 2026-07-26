# Deferred Items — Quick Task 260726-fe6

Pre-existing, out-of-scope issue discovered during verification (not touched or fixed by this
plan, per the scope boundary rule):

- `npx tsc --noEmit` reports 3 type errors in `src/__tests__/seo/robots.test.ts` (lines 7-9),
  unrelated to `use-scrolled-past.ts`, `sticky-nav.tsx`, or `navigation.tsx`. The `allow`/
  `disallow` properties are typed as not existing on the resolved `MetadataRoute.Robots["rules"]`
  union. This file was not modified by this plan and the errors are unrelated to the scroll-gate
  work.
