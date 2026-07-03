# 18-05 Evidence: D-14 Secret Scan + D-10 Theme Decision

## Gates: D-06 (D-14 Secret Scan) + D-10 (Theme / FOUC Decision)

| Gate | Requirement | Result |
|------|-------------|--------|
| D-06 | Dual-tree grep for `secret_` and `NOTION_TOKEN` returns 0 client-side leaks | **PASS** (0 client-chunk hits, server-only refs verified) |
| D-10 | Record single-mode ship if no dark v3 palette; else FOUC incognito check | **PASS** (single-mode Pumpkin Amber ship recorded; FOUC test N/A) |

---

## Gate 1: D-06 (D-14 Secret Scan)

**Requirement:** Dual-tree grep for `secret_` and `NOTION_TOKEN` returns 0 client-side leaks.

**Methodology:** Per CONTEXT.md D-06 (carryforward of v1.0 Phase 6 D-14 + v2.0 Phase 13 QA-V2-06), grep both build-output trees produced by `vercel build --prod` at HEAD `5a97f54` (confirmed PASS in 18-01-EVIDENCE.md) for the literals `secret_` and `NOTION_TOKEN`. Any hit in a client chunk = blocking security failure.

**Build trees scanned:**
- Tree 1: `.next/static/chunks/` (local build artifacts)
- Tree 2: `.vercel/output/static/_next/static/chunks/` (Vercel remote output, what browsers download)

---

### Command Sequence

```bash
# Tree 1: local build chunks
grep -r "secret_" .next/static/chunks/ 2>/dev/null | grep -v "^Binary" | wc -l
# → 0

grep -r "NOTION_TOKEN" .next/static/chunks/ 2>/dev/null | grep -v "^Binary" | wc -l
# → 0

# Tree 2: Vercel output chunks
grep -r "secret_" .vercel/output/static/_next/static/chunks/ 2>/dev/null | grep -v "^Binary" | wc -l
# → 0

grep -r "NOTION_TOKEN" .vercel/output/static/_next/static/chunks/ 2>/dev/null | grep -v "^Binary" | wc -l
# → 0

# Full-tree paranoid check (entire .vercel/output/ minus functions/)
grep -r "secret_" .vercel/output/ 2>/dev/null | grep -v "^Binary\|/functions/" | head -20
# → (no output — 0 matches outside functions/)

# Server-side confirmation (NOTION_TOKEN expected here)
grep -r "NOTION_TOKEN" .vercel/output/functions/ 2>/dev/null | grep -v "^Binary" | wc -l
# → 4 refs (server-only Edge functions — expected and correct)
```

---

### Dual-Tree Client-Chunk Results

| Tree | Search Term | Matches | Status |
|------|-------------|---------|--------|
| `.next/static/chunks/` | `secret_` | 0 | PASS |
| `.next/static/chunks/` | `NOTION_TOKEN` | 0 | PASS |
| `.vercel/output/static/_next/static/chunks/` | `secret_` | 0 | PASS |
| `.vercel/output/static/_next/static/chunks/` | `NOTION_TOKEN` | 0 | PASS |
| `.vercel/output/` (full tree, excl. functions/) | `secret_` | 0 | PASS |
| `.vercel/output/functions/` | `NOTION_TOKEN` (expected server-only) | 4 refs | PASS (server-side; expected) |

**Result: PASS — zero client-chunk matches for both search terms in both build trees.**

---

### Server-Side Characterization (Informational)

The 4 `NOTION_TOKEN` references in `.vercel/output/functions/` are all in Edge runtime server function bundles:

| File | Type | Server-only? |
|------|------|--------------|
| `.vercel/output/functions/blog/[slug]/opengraph-image.func/index.js` | OG image Edge function | YES |
| `.vercel/output/functions/blog/[slug]/opengraph-image.func/index.js.map` | Source map (non-deployed) | YES |
| `.vercel/output/functions/projects/[slug]/opengraph-image.func/index.js` | OG image Edge function | YES |
| `.vercel/output/functions/projects/[slug]/opengraph-image.func/index.js.map` | Source map (non-deployed) | YES |

**`secret_` literal: 0 matches anywhere in the entire build output.**

The server/client boundary from the original Phases 1–3 infrastructure holds through Phases 14–17 (presentation-layer-only changes). No client component references `NOTION_TOKEN`.

---

### D-06 Verdict

**PASS** — 0 client-side secret leaks. `NOTION_TOKEN` appears only in `.vercel/output/functions/` (server-side Edge functions; expected and correct). Server-only boundary maintained.

---

## Gate 2: D-10 (Theme / FOUC Decision)

**Requirement:** Record single-mode ship if no dark v3 palette exists; else run FOUC incognito check.

---

### Command Sequence

```bash
# Check for dark selectors in globals.css
grep -c "\.dark\|data-theme.*dark\|prefers-color-scheme.*dark" src/app/globals.css
# → 0

# Check for ThemeProvider / next-themes usage in src/app/
grep -rc "ThemeProvider\|next-themes\|useTheme" src/app/ | grep -v ":0"
# → (no output — 0 files)
```

---

### Finding

- **Dark selectors in `src/app/globals.css`:** 0
- **ThemeProvider / next-themes / useTheme in `src/app/`:** 0 files

The `globals.css` file comment (line 4) explicitly states: `"Pumpkin Amber palette — v3 single fixed theme (no dark mode)"`. The token definitions confirm single-mode: all palette tokens (`--color-bg`, `--color-surface`, `--color-text`, etc.) are light/amber values with no dark counterparts. There is no `@media (prefers-color-scheme: dark)` block, no `.dark` selector, and no `[data-theme="dark"]` rule anywhere in `globals.css`.

No `next-themes`, `ThemeProvider`, or theme-toggle component was introduced in Phases 14–17.

---

### Decision: Single-Mode (Pumpkin Amber Only) Ship

**v3.0 ships single-mode (Pumpkin Amber only).**

- No dark v3 palette was built in Phases 14–17.
- No `ThemeProvider` or `next-themes` is installed.
- FOUC incognito test is **not required** (nothing to flicker between modes).
- Dark Pumpkin Amber variant deferred to v3.1+ per CONTEXT.md Deferred Ideas.

This matches the precedent from v2.0 Phase 13 (QA-V2-05: light-only ship recorded).

---

### D-10 Verdict

**PASS** — Single-mode (Pumpkin Amber only) ship explicitly recorded. FOUC incognito test is not applicable to a single-mode site. Dark mode deferred to a future requirement.

---

## Build Provenance

| Field | Value |
|-------|-------|
| HEAD at scan time | `5a97f54` (branch: `v3`) |
| Build command | `vercel build --prod` (run in 18-01) |
| Build exit code | 0 |
| Build date (UTC) | 2026-07-03T02:39:39Z |
| Pages compiled | 39 |
| Scan date (UTC) | 2026-07-03T03:03:43Z |
| Tools | `grep` for secret scan; `grep -c` for dark-selector count |
