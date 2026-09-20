---
status: complete
phase: quick-260920-ofb
plan: 01
completion_date: 2026-09-20
duration_minutes: ~45
commits: 5
tasks_completed: 5/5
---

# Quick Task 260920-ofb: Anonymous "Unsolicited advice" Inbox — Summary

**Status:** COMPLETE

Delivered a full two-screen anonymous advice inbox with Notion database write, public API route, homepage/contact/footer entry points, bootstrap script, and comprehensive test coverage.

## Commits

| # | Message | Hash |
|----|---------|------|
| 1 | feat(advice): notion inbox lib + POST /api/advice | adb26c0 |
| 2 | feat(advice): two-screen anonymous form + /advice page + sitemap | 3f88476 |
| 3 | feat(advice): homepage band, contact row, footer link | 9187e5c |
| 4 | chore(advice): create-inbox-db script + env example | a02cb50 |
| 5 | test(advice): route + form tests | 9c51391 |

## Verification Results

```
npm run lint
  → 0 errors in src/ (pre-existing issues in .planning/, .vercel/ only)

npx tsc --noEmit
  → 0 errors in advice files

npx vitest run
  → 304 passed | 16 todo
  → All new tests passing (8 route + 5 form + 1 footer assertion)

npm run build
  → ✓ Compiled successfully in 1545ms
  → /advice renders as prerendered static route
  → Build completes with no new errors
```

## Deliverables

### 1. src/lib/notion-inbox.ts
- Exports `type InboxEntryInput` and `createInboxEntry()` function
- Creates Notion pages with Name (80-char title), Message (2000-char segments), Status (New), Received (ISO timestamp)
- Conditionally adds Sender, Contact, Page only when provided
- Throws on missing `NOTION_INBOX_DB_ID` env var

### 2. src/app/api/advice/route.ts
- `export const dynamic = "force-dynamic"`
- `GET()` → 405 `{ error: "method not allowed" }`
- `POST()` validates message (1-5000 chars), optional fields (name/contact/path), rejects invalid JSON
- Honeypot gate: `hp` non-empty → 200 silent
- Timing gate: `t < 2500` → 200 silent
- Notion errors → 502 `{ error: "could not save" }`; no IP/UA/headers read or logged

### 3. src/components/advice/advice-form.tsx
- Three-stage client component: "message" | "reply" | "done"
- Auto-growing textarea with blinking cursor (only when empty + unfocused)
- AnimatePresence + motion/react transitions (not motion.div; LazyMotion strict mode)
- Focus management: autofocus textarea on mount, first input in reply stage, link in done
- Honeypot + timing gate sent with submission
- Enter key advances (Shift+Enter for newline)
- Send / Send anonymously buttons with equal visual weight
- Error state shows "Did not send" alert with email fallback
- Done state echoes the sent message as plain text

### 4. src/app/advice/page.tsx
- Server component (no "use client")
- Metadata: title "Unsolicited advice", description from SPEC, OpenGraph tags, canonical
- Renders `<AdviceForm />` at full viewport height

### 5. Sitemap + CSS
- `src/app/sitemap.ts`: added `/advice` entry (priority 0.6, monthly)
- `src/app/globals.css`: added `@keyframes advice-blink` (1s step animation)

### 6. Homepage + Contact + Footer Entry Points
- `src/components/home/section-advice.tsx`: new band rendering ContactRow after #loves
- `src/components/v3/contact-row.tsx`: added optional `accentIndex` prop, hover fill → `var(--ac)`
- `src/components/home/explorative-homepage.tsx`: destructures `loves` offset, mounts SectionAdvice
- `src/app/contact/page.tsx`: added row 05 with handle "Anonymous. Advice, questions, corrections."
- `src/components/layout/site-footer.tsx`: added "Unsolicited advice" to ELSEWHERE links

### 7. Bootstrap + Env
- `scripts/create-inbox-db.ts`: one-shot database creator (7 properties, 4 Status options)
- `package.json`: added `"create-inbox-db": "tsx scripts/create-inbox-db.ts"` script
- `.env.example`: documented `NOTION_INBOX_DB_ID` with usage instructions

### 8. Tests
- `src/__tests__/api/advice-route.test.ts`: 8 cases (valid, empty, over-length, honeypot, timing, error, invalid JSON, GET 405)
- `src/__tests__/components/advice-form.test.tsx`: 5 cases (render, empty Enter, typing+Enter, anon Send, fetch error recovery)
- `src/__tests__/components/footer.test.tsx`: updated to assert `/advice` link presence

## Design Decisions

- **Copy**: All user-visible strings match SPEC section 3 exactly; no "improvements"
- **No em dashes**: Enforced throughout (code, comments, copy) per CLAUDE.md
- **Accent rotation**: ContactRow receives `accentIndex` from `homepageAccentOffsets()` to continue the palette rotation from the Writing section
- **Motion**: Uses `motion/react` with `m.div` inside AnimatePresence (not bare `motion.div`, which throws under LazyMotion strict)
- **API surface**: Public by design; no IP/UA/headers read (only message, optional fields, and bot gates)
- **Bot gates**: Honeypot + timing gate pre-empt Notion write, return 200 silently to avoid revealing the endpoint behavior

## Known Stubs / Deferred Items

None. All SPEC requirements implemented.

## Deviations from Plan

None. Plan executed exactly as written.

## Self-Check

- [ ] 5 commits exist (git log shows adb26c0, 3f88476, 9187e5c, a02cb50, 9c51391)
- [ ] No em dashes in advice files (grep clean)
- [ ] No changes to .env.local (git diff clean)
- [ ] All new files created (advice-form.tsx, advice/page.tsx, section-advice.tsx, notion-inbox.ts, advice/route.ts, advice-route.test.ts, advice-form.test.tsx, create-inbox-db.ts)
- [ ] TypeScript clean (npx tsc --noEmit shows 0 advice-related errors)
- [ ] Tests passing (304 passed, 8 new route + 5 new form + 1 footer assertion)
- [ ] Build succeeds (npm run build → ✓)

---

**Next:** This is a standalone quick task. No follow-up phase required.
