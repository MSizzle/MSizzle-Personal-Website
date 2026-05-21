---
phase: 7
slug: seo-overhaul
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-15
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.x + @testing-library/react 16.x + jsdom 29.x (already installed) |
| **Config file** | `vitest.config.ts` (exists) |
| **Quick run command** | `npx vitest run src/__tests__/seo/ --reporter=dot` |
| **Full suite command** | `npx vitest run --reporter=verbose && npm run lint && npm run build` |
| **Estimated runtime** | ~35 seconds full, ~5 seconds quick |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/__tests__/seo/ --reporter=dot` (or narrower path for the plan being worked)
- **After every plan wave:** Run full suite (`vitest run` + `npm run lint` + `npm run build`)
- **Before `/gsd-verify-work`:** Full suite must be green; `next build` must succeed; manual Schema.org validator check on `/` and `/prometheus`.
- **Max feedback latency:** 10 seconds for quick, 60 seconds for full.

---

## Per-Task Verification Map

> *Filled in by the planner as tasks are created. Each task gets one row.*
> *Status lifecycle: ⬜ pending → ✅ green / ❌ red / ⚠️ flaky.*

| Task ID | Plan | Wave | Decision Ref | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|--------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 07-01-XX | 01 | 1 | D-07..D-18 | — | N/A (no secrets, read-only) | unit | `npx vitest run src/__tests__/seo/schemas.test.ts` | ❌ W0 | ⬜ pending |
| 07-02-XX | 02 | 1 | D-40, D-41 | — | N/A | unit | `npx vitest run src/__tests__/seo/excerpt.test.ts` | ❌ W0 | ⬜ pending |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

*Planner: expand this table once PLAN.md files are written.*

---

## Wave 0 Requirements

- [ ] `src/__tests__/seo/schemas.test.ts` — unit tests for Person, FAQPage, BreadcrumbList builders
- [ ] `src/__tests__/seo/excerpt.test.ts` — unit tests for `extractExcerpt` helper
- [ ] `src/__tests__/seo/rss-parser.test.ts` — unit tests for Substack RSS parsing + fallback path
- [ ] `src/__tests__/seo/blog-feed.test.ts` — unit tests for `buildRssXml` (XML escaping, empty posts case)
- [ ] `src/__tests__/seo/metadata.test.ts` — integration-ish tests for `generateMetadata` on sampled routes (3 blog posts, 3 projects, /prometheus, /newsletter, /uses)
- [ ] `src/__tests__/seo/feed-route.test.ts` — integration test that hits `/blog/feed.xml` route handler returns `application/rss+xml`

*Existing infrastructure:* vitest + jsdom + @testing-library/react are already installed (see `package.json` devDependencies); no framework install needed.

---

## Grep-Gate Acceptance (mandatory on every plan touching user-facing copy)

**Deny-list scan** — every modified file must pass:

```bash
# Em dash detection in source files (HTML entities OR raw characters)
grep -lP '(&mdash;|—|&#8212;)' src/app src/components src/data 2>/dev/null && exit 1

# Location regression
grep -liE '\bNYC\b|\bbased in\b|New York' src/app src/components 2>/dev/null && exit 1

# Past-identity regression
grep -liE '\binvestor\b|\bLeerink\b|\binvesting career\b' src/app src/components 2>/dev/null && exit 1
```

(Planner: encode these as task acceptance criteria; exclude `node_modules`, `.planning/`, and `claude-code-prompt.md` from scans.)

---

## Manual-Only Verifications

| Behavior | Decision | Why Manual | Test Instructions |
|----------|----------|------------|-------------------|
| Person schema JSON-LD validates on Schema.org | D-13 | Schema.org validator is web-only | After deploy to preview: paste rendered HTML of `/` into https://validator.schema.org. Zero errors expected. |
| FAQ rich snippet eligible on Google | D-14 | Google's Rich Results Test is web-only | Paste rendered HTML of `/prometheus` into https://search.google.com/test/rich-results. FAQPage detected. |
| Substack RSS carousel renders with real data | D-24..D-27 | Depends on live feed | Visit `/newsletter` in preview. Confirm 6–10 cards with thumbnails, titles, dates. Disable network and confirm fallback CTA renders. |
| Lighthouse SEO score ≥ 95 on homepage | D-07..D-52 | Requires Chrome DevTools | Preview URL → Lighthouse → SEO tab. |
| Mobile responsiveness on new pages | D-52 | Device testing | Preview `/prometheus`, `/newsletter`, `/uses` at 375px, 768px, 1440px. No horizontal scroll; breadcrumbs don't wrap awkwardly. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (schemas, excerpt, rss-parser, blog-feed, metadata, feed-route)
- [ ] No watch-mode flags in commands
- [ ] Feedback latency < 60s full, < 10s quick
- [ ] `nyquist_compliant: true` set in frontmatter after planner expands the Per-Task map

**Approval:** pending
