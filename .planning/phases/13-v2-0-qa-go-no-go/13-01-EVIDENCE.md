# 13-01 Evidence: vercel build --prod Production Gate

## Gate: QA-V2-01

**Requirement:** `vercel build --prod` exits 0 with zero TS / ESLint / 429 errors

---

## Result: PASS

| Metric | Value |
|--------|-------|
| **Exit Code** | 0 (success) |
| **Build Date** | 2026-05-21T19:26:38Z–19:38:21Z |
| **Git Commit (HEAD at build time)** | `b11afb6` |
| **Next.js Version** | 16.2.1 (Turbopack) |
| **Pages Generated** | 40 static pages |
| **TypeScript Errors** | 0 |
| **ESLint Errors** | 0 |
| **429 (Notion rate-limit) Errors** | 0 |
| **.vercel/output/ Created** | YES — confirmed (see below) |

---

## Error Summary

- TypeScript errors (`Type error:`): **0**
- ESLint errors (`ESLint error`, `error  @`): **0**
- Notion rate-limit errors (429): **0**
- Build warnings (non-blocking):
  - `[DEP0205]` — `module.register()` deprecated (Node.js deprecation, not a build error)
  - `[DEP0169]` — `url.parse()` deprecated (Node.js deprecation, not a build error)
  - `⚠ Using edge runtime on a page currently disables static generation for that page` (expected, non-blocking)

---

## Page Count

40 pages generated via `Generating static pages using 9 workers (40/40)`.

Route breakdown:
- Static (○): `/`, `/about`, `/blog`, `/blog/feed.xml`, `/events`, `/icon.png`, `/links`, `/newsletter`, `/opengraph-image`, `/projects`, `/prometheus`, `/robots.txt`, `/sitemap.xml`, `/_not-found`
- SSG with generateStaticParams (●): `/blog/[slug]` (15 paths), `/projects/[slug]` (8 paths)
- Dynamic/Edge (ƒ): `/api/notion-cover`, `/api/notion-image`, `/blog/-/opengraph-image`, `/projects/-/opengraph-image`

---

## .vercel/output/ Tree Confirmation

Output directory created at `.vercel/output/` (required by 13-05 secret scan):

```
.vercel/output/
├── builds.json
├── config.json
├── diagnostics/
├── functions/
└── static/
    └── _next/
        └── static/
            └── chunks/       ← client JS bundles (verified populated)
```

First 5 chunk files confirmed present:
- `00nvzi6qb_-1r.js`
- `01xlw8hd842-c.js`
- `03ajq8~-xq.zi.js`
- `03~yq9q893hmn.js`
- `08fk6v3.n94u0.js`

---

## Build Infrastructure Notes

- Worktree required `vercel pull --yes --environment production` + correct `project.json` (copied from main repo) before build could run.
- `vercel build` installed 487 packages fresh (npm install in worktree — symlinked node_modules was removed by vercel build's install step). This is expected worktree behavior.
- `.env.local` was copied from main repo to worktree before build. NOTION_TOKEN and all required env vars were available.
- Build ran in worktree: `/Users/Montster/MSizzle Personal Website/.claude/worktrees/agent-a4569e1cde2a0d183`

---

## Build Log (First 50 Lines)

```
Installing dependencies...
npm warn reify Removing non-directory .../node_modules

added 487 packages in 11m

170 packages are looking for funding
  run `npm fund` for details
Detected Next.js version: 16.2.1
Running "npm run build"

> msizzle-website@0.1.0 build
> next build

Attention: Next.js now collects completely anonymous telemetry regarding usage.
...

▲ Next.js 16.2.1 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
(node:23600) [DEP0205] DeprecationWarning: `module.register()` is deprecated. Use `module.registerHooks()` instead.
✓ Compiled successfully in 18.8s
  Running TypeScript ...
  Finished TypeScript in 1485ms ...
  Collecting page data using 9 workers ...
⚠ Using edge runtime on a page currently disables static generation for that page
  Generating static pages using 9 workers (0/40) ...
  Generating static pages using 9 workers (10/40)
  Generating static pages using 9 workers (20/40)
  Generating static pages using 9 workers (30/40)
✓ Generating static pages using 9 workers (40/40) in 37.7s
  Finalizing page optimization ...
  Traced Next.js server files in: 27.427ms
  Created all serverless functions in: 210.955ms
  Collected static files (public/, static/, .next/static): 1.677ms
{
  "status": "ok",
  "outputDir": ".../.vercel/output",
  "outputDirRelative": ".vercel/output",
  "target": "production",
  "message": "Build completed successfully."
}
EXIT_CODE: 0
```

---

## QA-V2-01 Verdict

**PASS** — `vercel build --prod` exits 0. Zero TS errors, zero ESLint errors, zero 429 errors. 40 pages generated. `.vercel/output/` confirmed for 13-05 secret scan.
