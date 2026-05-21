---
phase: 13-v2-0-qa-go-no-go
plan: "05"
subsystem: qa-secret-scan-and-darkmode
tags: [secret-scan, D-14, dark-mode, QA-V2-05, QA-V2-06]
dependency_graph:
  requires: [13-01]
  provides: [QA-V2-05, QA-V2-06]
  affects: [13-06]
tech_stack:
  added: []
  patterns: [ripgrep-secret-scan, light-only-palette]
key_files:
  created:
    - .planning/phases/13-v2-0-qa-go-no-go/13-05-EVIDENCE.md
  modified: []
decisions:
  - D-05: Light-only ship — VERIFIED (no dark-mode tokens, no next-themes, no ThemeProvider)
  - D-06: D-14 dual-tree secret scan — VERIFIED (0 client-chunk hits; server-only refs preserved)
metrics:
  duration: ~3 minutes (vercel build + dual-tree grep + verification)
  completed: 2026-05-21
  commit_sha: pending
---

# Phase 13 Plan 05: Secret Scan + Dark-Mode Decision Summary

## One-Liner

D-14 secret scan and dark-mode light-only decision both PASS — `secret_`/`NOTION_TOKEN` literals found zero times in client chunks; server-only references in `src/lib/notion*.ts` are preserved by design; no dark-mode infrastructure exists in the codebase, so light-only ship is the natural and explicit outcome.

## Verdicts

- **QA-V2-05: PASS** (light-only ship recorded; no FOUC test needed for single-mode site)
- **QA-V2-06: PASS** (D-14 dual-tree secret scan — 0 client-chunk hits)

## Evidence

Full breakdown in `13-05-EVIDENCE.md`. Includes:
- Dual-tree grep output (both `.next/static/chunks/` and `.vercel/output/static/_next/static/chunks/` returned 0 matches)
- Per-file classification of full-tree matches (all server-side: OG functions, server chunks, edge functions)
- Source code verification confirming `process.env.NOTION_TOKEN` only appears in server-only modules
- Dark-mode token / theme provider absence verification

## Impact on GO/NO-GO

Both gates green. Two of the seven QA-V2-* requirements satisfied by this plan. 13-06's GO doc can cite these results directly.

## Commands Run

```bash
vercel build --prod                                                     # Produced fresh .vercel/output/
rg -c "secret_|NOTION_TOKEN" .next/static/chunks/                       # → 0
rg -c "secret_|NOTION_TOKEN" .vercel/output/static/_next/static/chunks/ # → 0
rg -n "process\.env\.NOTION_TOKEN" src/                                  # → server-only files only
rg -n "\.dark\b|next-themes" src/                                        # → 0 results
```
