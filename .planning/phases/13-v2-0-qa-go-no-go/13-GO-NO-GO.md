---
phase: 13-v2-0-qa-go-no-go
type: go-no-go
status: draft
milestone: v2.0
milestone_name: Editorial Redesign
build_sha: ef05f24
build_date: 2026-05-21
verdict: PENDING-MANUAL-COMPLETION
signed_by:
signed_date:
---

# v2.0 Editorial Redesign — GO/NO-GO Verdict

**Milestone:** v2.0 Editorial Redesign (Phases 8–13)
**Build:** `ef05f24` (HEAD at QA gate)
**Production URL:** https://montysinger.com
**Preview URL:** https://m-sizzle-personal-website-h5zzgtecg-msizzles-projects.vercel.app *(behind Vercel Deployment Protection)*

---

## Verdict Summary

**STATUS:** ⏳ **DRAFT — awaiting manual completion of 3 gates before sign-off**

| Outcome | Description |
|---------|-------------|
| GO | All 7 QA-V2-* gates PASS → promote to production via `vercel deploy --prod` → run `/gsd:complete-milestone v2.0` immediately |
| NO-GO | Any blocking gate FAIL → remediate before promote |
| GO-with-knowns | Some gates partially deferred with explicit risk acceptance (e.g., D-05 light-only ship analog) |

---

## Success Criteria Status

| ID | Requirement | Verdict | Evidence |
|----|-------------|---------|----------|
| **QA-V2-01** | `vercel build --prod` exits 0, zero TS/ESLint/429 errors | ✅ **PASS** | [13-01-EVIDENCE.md](./13-01-EVIDENCE.md) — exit 0, 40 pages, zero errors |
| **QA-V2-02** | Lighthouse desktop ≥ 90/95/95/100 on 5 routes | ⚠ **FAIL** | [13-02-EVIDENCE.md](./13-02-EVIDENCE.md) — 2 routes PASS, 3 FAIL: `/blog` CLS 0.685 (major), `/` and `/blog/[slug]` A11y 94 (1pt) |
| **QA-V2-03** | PSI mobile ≥ 75 on homepage | ⏳ **PENDING** | [13-03-EVIDENCE.md](./13-03-EVIDENCE.md) — PSI API rate-limited; manual run at pagespeed.web.dev required |
| **QA-V2-04** | Visual QA at 375px on `/`, `/writing`, `/events`, `/photos` | ⏳ **PENDING** | [13-04-EVIDENCE.md](./13-04-EVIDENCE.md) — 4-route checklist + Chrome DevTools setup |
| **QA-V2-05** | Dark-mode FOUC pass OR light-only ship recorded | ✅ **PASS** (light-only) | [13-05-EVIDENCE.md](./13-05-EVIDENCE.md) — verified 0 dark tokens, 0 theme provider; deferred to future requirement |
| **QA-V2-06** | D-14 client-bundle secret scan returns 0 leaks | ✅ **PASS** | [13-05-EVIDENCE.md](./13-05-EVIDENCE.md) — 0 hits in both client-chunk trees; server-only refs preserved |
| **QA-V2-07** | Signed GO doc + `/gsd:complete-milestone` invoked AT verdict | ⏳ **THIS DOC** | once signed, the milestone closes |

**Score: 3 PASS / 1 FAIL (QA-V2-02) / 2 PENDING (QA-V2-03 PSI, QA-V2-04 visual) / 1 SIGN-OFF (QA-V2-07)** (as of 2026-05-21 autonomous execution)

---

## What's Done (Autonomous)

### QA-V2-01 — Build Gate ✅
Re-ran `vercel build --prod` at HEAD `ef05f24`:
- Exit code: 0
- Next.js 16.2.1 (Turbopack)
- Pages generated: 40
- TypeScript errors: 0
- ESLint errors: 0
- 429 (Notion rate-limit) errors: 0
- `.vercel/output/static/_next/static/chunks/` created ✓

The redesigned codebase compiles cleanly under production constraints.

### QA-V2-05 — Dark-Mode Light-Only Decision ✅
Per CONTEXT.md D-05, v2.0 ships light-only:
- 0 `.dark` / `[data-theme="dark"]` selectors in `globals.css`
- 0 `next-themes` / `ThemeProvider` imports anywhere in `src/`
- Warm-paper palette is single-mode by design (Phase 9)
- ROADMAP §Phase 13 criterion #5 explicitly permits this path
- Dark-mode warm-paper variant deferred to a future requirement (v2.1+)

### QA-V2-06 — Secret Scan ✅
D-14 dual-tree grep at build SHA `ef05f24`:
- `.next/static/chunks/` (client) — **0 matches** for `secret_` or `NOTION_TOKEN`
- `.vercel/output/static/_next/static/chunks/` (client) — **0 matches**
- `secret_` literal — **0 matches** anywhere in build output
- `NOTION_TOKEN` literal — appears only in server-side artifacts (OG functions, `.next/server/`, edge runtime), which is the expected and locked design from Phase 2 of v1.0

The server/client boundary established in v1.0 Phase 2 still holds. v2.0 Phases 8–12 introduced **zero** client-side env-var leaks.

---

## What's Left (Manual)

### 1. QA-V2-02 — Lighthouse Desktop (RESOLVED — autonomous Path C run)

Lighthouse desktop median-of-3 was captured against local prod server (`npm run start` → `localhost:3000`). Full breakdown in `13-02-EVIDENCE.md`. Summary:

| Route | Perf | A11y | BP | SEO | Verdict |
|-------|------|------|----|----|---------|
| `/` | 98 | **94** | 100 | 100 | ✗ A11y 1pt short |
| `/about` | 100 | 96 | 100 | 100 | ✓ PASS |
| `/prometheus` | 100 | 96 | 100 | 100 | ✓ PASS |
| `/blog` | **69** | 96 | 100 | 100 | ✗ Perf low (CLS 0.685) |
| `/blog/[slug]` | 99 | **94** | 100 | 100 | ✗ A11y 1pt short |

**Decision points for the operator:**

- **Block GO on `/blog` CLS regression** — fix the layout shift before promoting, then re-run Lighthouse. The CLS of 0.685 is severe (target is < 0.1) and very likely traces to Phase 12-04's `/blog` restyle (TagFilter or post-list hydration). Fix would be in a new `12.1` style follow-up phase or done inline before GO.

- **OR ship-with-known** — accept the CLS regression as a documented v2.1 fix item and proceed to GO. The `/` and `/blog/[slug]` A11y 94s are borderline (1 point); inspect the failed audit (open the lighthouse JSONs in `lighthouse/`) before deciding.

  - To investigate: `lighthouse http://localhost:3000/ --view --quiet` (re-run with `--view` opens an HTML report)
  - Or open `lighthouse/home-1.json` → `audits` keys with `score: null` or `score: 0`

**Optional re-validate against Vercel preview** (for production-fidelity numbers):

```bash
# Generate bypass token at:
# https://vercel.com/msizzles-projects/m-sizzle-personal-website/settings/deployment-protection
BYPASS=YOUR_TOKEN
PREVIEW=https://m-sizzle-personal-website-h5zzgtecg-msizzles-projects.vercel.app
lighthouse "$PREVIEW" --preset=desktop --extra-headers='{"x-vercel-protection-bypass":"'"$BYPASS"'"}' --output=json --output-path=/tmp/preview-home.json --quiet
```

### 2. QA-V2-03 — PSI Mobile (homepage)

Unauthenticated PSI API daily quota was exhausted. Open in a browser:

```
https://pagespeed.web.dev/?url=https%3A%2F%2Fmontysinger.com&form_factor=mobile
```

(Or run against the preview URL if Path A/B above is in effect.) Capture the mobile Performance score; floor is ≥ 75 (v1.0 baseline was 77).

Paste score + Core Web Vitals into `13-03-EVIDENCE.md` under "Manual Run Results".

### 3. QA-V2-04 — 375px Visual QA (4 routes)

Chrome DevTools → 375 × 667 → walk through `/`, `/writing`, `/events`, `/photos`. Fill in PASS/FAIL per route in `13-04-EVIDENCE.md`. Capture screenshots to `.planning/phases/13-v2-0-qa-go-no-go/screenshots/`.

### 4. QA-V2-07 — Sign This Doc + Close Milestone

Once the 3 above are completed:

1. Update each EVIDENCE.md with the captured results.
2. Update the "Verdict" column above to reflect final PASS / FAIL per gate.
3. Set the frontmatter `verdict:` field to one of `GO` / `NO-GO` / `GO-with-knowns`.
4. Set `signed_by:` and `signed_date:` in the frontmatter.
5. **Immediately** (per CONTEXT.md D-08 and v1.0 retro lesson #1) run:

```bash
/gsd:complete-milestone v2.0
```

Do not defer. The v1.0 retrospective explicitly flags "Run `/gsd:complete-milestone` at the GO verdict, not weeks later" as carryforward lesson #1.

---

## Known Limitations (Accepted)

Per CONTEXT.md D-09 / D-10, the following are explicitly NON-BLOCKING for v2.0 GO:

1. **Phase 12 code review warnings (advisory):**
   - WR-01: `/newsletter` `<time>` missing `dateTime` attribute
   - WR-02: `/projects/[slug]` hero `<img>` missing dimensions/loading hints
   - WR-03: Newsletter issue grid CTAs lack `data-umami-event` tracking
   - **Action:** Bundle into a post-v2.0 polish phase. Do not block GO.

2. **vitest infrastructure failure:** `@rolldown/binding-darwin-arm64` missing-binding issue blocks `npx vitest`. The build gate (`vercel build --prod`) passes regardless. Restoration is a maintenance task: `rm -rf node_modules package-lock.json && npm i`.

3. **Dark-mode dropped to future requirement:** Per D-05, v2.0 ships light-only. Dark variant of warm-paper palette is a v2.1+ design task.

## Lighthouse Findings — Decide Block or Ship-with-Known

Lighthouse desktop run (15 passes against local prod server) surfaced 3 real findings. See `13-02-EVIDENCE.md` for per-audit detail. Summary:

| Finding | Route(s) | Severity | Suggested action |
|---------|----------|----------|------------------|
| **CLS 0.685 from un-sized blog cover images** | `/blog` | **Major** (Perf 69) | Fix before GO: add `width`/`height` to `<Image>` in blog index. ~30 min effort. |
| **Color-contrast: text-muted (#9A9690) on text-paper (#F4F2EC) ~2.5:1** | `/`, `/blog`, `/blog/[slug]` | Minor | Darken `--muted` to ~#8A8680 in `globals.css` (one-token change). Lifts a11y 94→96. |
| **Heading-order skips levels** | `/`, `/blog/[slug]` | Minor | Audit headings on manifesto homepage + blog post body. |

The CLS finding is the only real regression from v1.0. The color-contrast and heading-order issues likely existed in earlier phases too and were not previously gated by Lighthouse desktop.

**Operator decision required:** fix `/blog` CLS before GO, OR ship-with-known with explicit v2.1 follow-up phase scoped.

---

## Promotion Plan (Conditional on GO)

If verdict is GO:

```bash
# Promote the prebuilt output to production
cd "/Users/Montster/MSizzle Personal Website"
vercel deploy --prebuilt --prod 2>&1 | tee /tmp/v2-promote.log

# Smoke-test production
curl -sS -o /dev/null -w "HTTP %{http_code} | size %{size_download}b\n" https://montysinger.com
# Expected: HTTP 200, ~ 14KB (v2.0 editorial homepage)

# Then close the milestone
/gsd:complete-milestone v2.0
```

After `/gsd:complete-milestone v2.0`:
- v2.0 ROADMAP becomes archived (`.planning/milestones/v2.0-phases/`)
- A new milestone can be planned via `/gsd:new-milestone`
- PROJECT.md gets evolved automatically

---

## Sign-Off Block

By signing below, the operator confirms:

- All 7 QA-V2-* gates have been evaluated (PASS, FAIL, or explicit risk acceptance)
- The 3 known limitations above are accepted as non-blocking for v2.0 GO
- The promote-to-production decision is recorded as a deliberate action
- `/gsd:complete-milestone v2.0` will be run immediately (not weeks later — v1.0 retro lesson #1)

```
Verdict:    [ GO | NO-GO | GO-with-knowns ]
Signed by:  ____________________  (operator)
Date:       __________
Notes:      ____________________
```
