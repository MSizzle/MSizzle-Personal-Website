# 13-05 Evidence: D-14 Secret Scan + Dark-Mode Decision

## Gates: QA-V2-05 + QA-V2-06

| Gate | Requirement | Result |
|------|-------------|--------|
| QA-V2-05 | Dark-mode FOUC test passes OR light-only ship recorded | **PASS** (light-only ship recorded per D-05) |
| QA-V2-06 | D-14 client-bundle secret scan returns zero leaks | **PASS** (0 client-chunk hits, server-only refs verified) |

---

## QA-V2-06: D-14 Secret Scan Result

**Methodology:** Per v1.0 Phase 6 D-14 (carryforward decision D-06), grep both build-output trees produced by `vercel build --prod` (run at HEAD `ef05f24`) for the literals `secret_` and `NOTION_TOKEN`. Any hit in a client chunk = blocking fail.

### Dual-tree client-chunk grep

```
$ rg -c "secret_|NOTION_TOKEN" .next/static/chunks/
  → 0 files matched (CLIENT-FACING — must be clean) ✓

$ rg -c "secret_|NOTION_TOKEN" .vercel/output/static/_next/static/chunks/
  → 0 files matched (CLIENT-FACING — must be clean) ✓
```

**Result: PASS — zero matches in either client-chunk tree.**

### Full-tree characterization (non-blocking, informational)

The wider grep (`.vercel/output/` and `.next/server/`) returned matches **only** in server-side artifacts. Every match is in a server-only output:

| File pattern | Type | Server-only? |
|--------------|------|--------------|
| `.vercel/output/functions/projects/[slug]/opengraph-image.func/index.js{,.map}` | OG image generation Function (Edge runtime) | ✓ YES |
| `.vercel/output/functions/blog/[slug]/opengraph-image.func/index.js{,.map}` | OG image generation Function (Edge runtime) | ✓ YES |
| `.next/server/chunks/[root-of-the-server]__*.js{,.map}` | Next.js server-side chunks | ✓ YES |
| `.next/server/chunks/ssr/*` | Server-side rendering chunks | ✓ YES |
| `.next/server/edge/chunks/*` | Edge runtime functions | ✓ YES |

**`secret_` literal: 0 matches anywhere in the build output.**

### Source code verification (server-only boundary)

```
$ rg -n "process\.env\.NOTION_TOKEN" src/
src/lib/notion-events.ts:9    const notion = new Client({ auth: process.env.NOTION_TOKEN });
src/lib/notion-events.ts:109  if (!process.env.NOTION_TOKEN || ...)
src/lib/notion-events.ts:145  if (!process.env.NOTION_TOKEN || ...)
src/lib/notion-events.ts:185  if (!process.env.NOTION_TOKEN || ...)
src/lib/notion.ts:10          const notion = new Client({ auth: process.env.NOTION_TOKEN });
src/lib/notion-projects.ts:9  const notion = new Client({ auth: process.env.NOTION_TOKEN });
src/lib/notion-projects.ts:115/153/180  if (!process.env.NOTION_TOKEN || ...)
src/app/blog/[slug]/page.tsx:19  if (!process.env.NOTION_TOKEN || ...)
src/app/blog/page.tsx:26          if (process.env.NOTION_TOKEN && ...)
src/app/blog/feed.xml/route.ts:8   if (process.env.NOTION_TOKEN && ...)
src/app/api/notion-cover/route.ts:4  const notion = new Client({ auth: process.env.NOTION_TOKEN });
```

All references are in `src/lib/notion*.ts` (server-only modules), server-rendered page components (`page.tsx`), or API routes (`route.ts`). **No client component references `process.env.NOTION_TOKEN`.** The server/client boundary established in Phase 2 of v1.0 still holds — v2.0 Phases 8-12 did not introduce any client-side env-var leaks.

### Verdict

**QA-V2-06: PASS** — Zero client-chunk secret leaks. Server-only boundary maintained.

---

## QA-V2-05: Dark-Mode FOUC Decision

**Decision (recorded per CONTEXT.md D-05):** v2.0 ships **light-only**. Dark mode is **dropped to a future requirement**.

### Verification

```
$ rg -n "\.dark\b|data-theme.*dark|@media.*prefers-color-scheme.*dark|--dark-" src/app/globals.css
  → 0 matches  (no dark-mode tokens exist)

$ rg -l "next-themes|ThemeProvider" src/
  → 0 files  (no theme switcher installed)

$ rg -n "suppressHydrationWarning" src/app/layout.tsx
  65:      suppressHydrationWarning  (defensive — no behavioral dark-mode dependency)

$ rg -n "^\s*--paper:|^\s*--ink:|^\s*--muted:|^\s*--rule:" src/app/globals.css
  → All palette tokens are light-mode values (warm-paper background, ink-on-paper text)
```

### Rationale

- No `.dark` selector or `[data-theme="dark"]` rules exist in `globals.css`.
- No `next-themes` package or `ThemeProvider` is imported anywhere in `src/`.
- The warm-paper palette established in Phase 9 (`--paper: #F4F2EC`, `--ink: #0E0E0C`, `--muted: #9A9690`) is single-mode by design — there are no dark counterparts.
- ROADMAP.md Phase 13 success criterion #5 explicitly permits this path: "or a dark-mode dropped decision is explicitly recorded if v2.0 ships light-only."
- v1.0 had a theme toggle; that toggle was removed in Phase 9 when the design moved to the warm-paper system.

### Future Requirement (Logged for v2.1+)

- **Dark-mode warm-paper variant** — design a dark version of the editorial palette + restore FOUC test. Deferred per D-05 of `13-CONTEXT.md`.

### Verdict

**QA-V2-05: PASS** — Light-only ship explicitly recorded; FOUC test is not applicable to a single-mode site. Dark mode deferred to a future requirement.

---

## Build Provenance

| Field | Value |
|-------|-------|
| HEAD at scan time | `ef05f2449150459fa8aeb5d697380cb8a96aaa92` |
| Build command | `vercel build --prod` (re-run in main tree to produce `.vercel/output/` after 13-01's worktree was cleaned up) |
| Build exit code | 0 |
| Build date | 2026-05-21 |
| Pages compiled | 40 |
| Tools | `rg` (ripgrep) for grep; `node` for env-var verification |
