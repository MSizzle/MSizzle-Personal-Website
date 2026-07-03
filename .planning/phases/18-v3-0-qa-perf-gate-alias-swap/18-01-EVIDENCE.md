# 18-01 Evidence: vercel build --prod Production Gate

## Gate: DQ-02

**Requirement:** `vercel build --prod` exits 0 with zero TS / ESLint / 429 errors before any alias swap.

---

## Result: PASS

| Metric | Value |
|--------|-------|
| **Exit Code** | 0 (success) |
| **Build Date (UTC)** | 2026-07-03T02:39:39Z |
| **Git Commit (HEAD at build time)** | `5a97f54` (branch: `v3`) |
| **Next.js Version** | 16.2.1 (Turbopack) |
| **Pages Generated** | 39 static pages |
| **TypeScript Errors** | 0 |
| **ESLint Errors** | 0 |
| **429 (Notion rate-limit) Errors** | 0 |
| **.vercel/output/ Created** | YES — confirmed (see below) |

---

## Error Summary

- TypeScript errors (`Type error:`): **0**
- ESLint errors (`ESLint:`): **0**
- Notion rate-limit errors (429): **0**
- Build warnings (non-blocking):
  - `[DEP0205]` — `module.register()` deprecated (Node.js deprecation, not a build error)
  - `[DEP0169]` — `url.parse()` deprecated (Node.js deprecation, not a build error)
  - `⚠ Using edge runtime on a page currently disables static generation for that page` (expected, non-blocking)

---

## Page Count

39 pages generated via `Generating static pages using 9 workers (39/39) in 16.3s`.

Route breakdown (from build output):
- Static (○): `/`, `/_not-found`, `/about`, `/blog/feed.xml`, `/icon.png`, `/opengraph-image`, `/portfolio`, `/projects`, `/prometheus`, `/robots.txt`, `/sitemap.xml`, `/uses`, `/writing`
- SSG with generateStaticParams (●): `/blog/[slug]` (15 paths), `/projects/[slug]` (8 paths)
- Dynamic/Edge (ƒ): `/api/notion-cover`, `/api/notion-image`, `/blog/-/opengraph-image`, `/projects/-/opengraph-image`

**v3 route coverage confirmed:** `/`, `/about`, `/projects` (+`/projects/[slug]`), `/portfolio` (new, 17.3), `/writing` (+`/blog/[slug]`, `/blog/feed.xml`), `/uses`, `/prometheus`. All routes per R-3 (18-CONTEXT.md post-17.3 reconciliation) are present.

---

## .vercel/output/ Tree Confirmation

Output directory created at `.vercel/output/` (required by 18-05 secret scan):

```
.vercel/output/
├── builds.json
├── config.json
├── diagnostics/
├── functions/
└── static/
    └── _next/
        └── static/
            └── chunks/       <- client JS bundles (verified populated)
```

First 5 chunk files confirmed present:
- `0.smn5th3g8nr.js`
- `00xu5rw__q86c.js`
- `00~e3w~-1fs9y.css`
- `01xm7kgh1tdwj.js`
- `03~yq9q893hmn.js`

---

## Threat Model Notes (T-18-02)

Branch verified: `git branch --show-current` returned `v3`. HEAD SHA recorded as `5a97f54`. T-18-02 (build on wrong branch) — **mitigated**.

---

## Build Log Excerpts

```
▲ Next.js 16.2.1 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
(node:27577) [DEP0205] DeprecationWarning: `module.register()` is deprecated.
✓ Compiled successfully in 29.2s
  Running TypeScript ...
  Finished TypeScript in 32.0s ...
  Collecting page data using 9 workers ...
⚠ Using edge runtime on a page currently disables static generation for that page
✓ Generating static pages using 9 workers (39/39) in 16.3s
  Finalizing page optimization ...
...
{
  "status": "ok",
  "outputDir": "/Users/Montster/MSizzle Personal Website/.vercel/output",
  "outputDirRelative": ".vercel/output",
  "target": "production",
  "message": "Build completed successfully."
}
EXIT_CODE: 0
```

---

## DQ-02 Verdict

**PASS** — `vercel build --prod` exits 0. Zero TS errors, zero ESLint errors, zero 429 errors. 39 pages generated. `.vercel/output/static/_next/static/chunks/` confirmed for secret scan (18-05).

Plans 18-02 through 18-07 are **unblocked**.
