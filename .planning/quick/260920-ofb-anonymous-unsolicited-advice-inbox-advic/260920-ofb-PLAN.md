---
phase: quick-260920-ofb
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/notion-inbox.ts
  - src/app/api/advice/route.ts
  - src/components/advice/advice-form.tsx
  - src/app/advice/page.tsx
  - src/app/sitemap.ts
  - src/app/globals.css
  - src/components/v3/contact-row.tsx
  - src/components/home/section-advice.tsx
  - src/components/home/explorative-homepage.tsx
  - src/app/contact/page.tsx
  - src/components/layout/site-footer.tsx
  - scripts/create-inbox-db.ts
  - package.json
  - .env.example
  - src/__tests__/api/advice-route.test.ts
  - src/__tests__/components/advice-form.test.tsx
  - src/__tests__/components/footer.test.tsx
autonomous: true
requirements: [ADVICE-INBOX]

must_haves:
  truths:
    - "A visitor at /advice sees only the prompt 'What's on your mind?' and a focused, borderless textarea on a bone ground"
    - "Enter (no Shift) with a non-empty message advances to 'Want a reply?'; Enter with an empty message does nothing"
    - "'Send anonymously' posts to /api/advice with name '' and contact '' and the screen shows 'Sent.'"
    - "POST /api/advice with a valid message creates one Notion page in the Inbox DB with Name/Message/Status=New/Received set; honeypot or t<2500 returns 200 without writing"
    - "The homepage (after #loves), /contact (row 05) and the footer ELSEWHERE column each link to /advice with the exact SPEC copy"
    - "npm run create-inbox-db -- --parent <id> creates the Inbox DB and prints NOTION_INBOX_DB_ID=<id>"
  artifacts:
    - path: "src/lib/notion-inbox.ts"
      provides: "createInboxEntry"
      exports: ["createInboxEntry"]
    - path: "src/app/api/advice/route.ts"
      provides: "POST /api/advice + GET 405"
      exports: ["POST", "GET", "dynamic"]
    - path: "src/components/advice/advice-form.tsx"
      provides: "Three-state client form (message | reply | done)"
      exports: ["AdviceForm"]
    - path: "src/app/advice/page.tsx"
      provides: "/advice route + metadata"
    - path: "src/components/home/section-advice.tsx"
      provides: "Homepage #advice band"
      exports: ["SectionAdvice"]
    - path: "scripts/create-inbox-db.ts"
      provides: "One-shot Notion DB bootstrap"
    - path: "src/__tests__/api/advice-route.test.ts"
      provides: "7 route cases"
    - path: "src/__tests__/components/advice-form.test.tsx"
      provides: "5 form cases"
  key_links:
    - from: "src/components/advice/advice-form.tsx"
      to: "/api/advice"
      via: "fetch POST JSON"
      pattern: "fetch\\(\"/api/advice\""
    - from: "src/app/api/advice/route.ts"
      to: "src/lib/notion-inbox.ts"
      via: "createInboxEntry import"
      pattern: "createInboxEntry"
    - from: "src/lib/notion-inbox.ts"
      to: "notion.pages.create"
      via: "database_id parent"
      pattern: "pages\\.create"
    - from: "src/components/home/explorative-homepage.tsx"
      to: "src/components/home/section-advice.tsx"
      via: "SectionAdvice mounted after #loves"
      pattern: "<SectionAdvice"
---

<objective>
Ship the anonymous "Unsolicited advice" inbox: a two-screen /advice form, POST /api/advice writing to a Notion Inbox DB, entry points on the homepage, /contact and the footer, a bootstrap script for the DB, and tests.

Purpose: give visitors a zero-friction, genuinely anonymous way to tell Monty something, landing in a Notion database he actually reads.
Output: 5 atomic commits on main (do not push), one per task below, matching the SPEC "Commits" section.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/260920-ofb-anonymous-unsolicited-advice-inbox-advic/260920-ofb-SPEC.md
@./CLAUDE.md

The SPEC is the locked source of truth for file names, Notion property names, copy strings, validation rules and the commit split. Every task below points at SPEC section numbers; when this plan and the SPEC disagree on copy, the SPEC wins. Do not redesign, do not improve copy. No em dashes anywhere (code comments included). No gradients. No new npm dependencies.

<interfaces>
<!-- Verified against the codebase on 2026-09-20. Use directly; no exploration needed. -->

Installed: @notionhq/client 4.0.2 (NOT v5; `notion.pages.create({ parent: { database_id }, properties })` and `notion.databases.create({ parent: { type: "page_id", page_id }, title, properties })` are the correct v4 shapes). tsx 4.x and dotenv 17.x are devDependencies. Vitest 4 with jsdom, setup file `src/__tests__/setup.ts` (jest-dom matchers loaded), alias `@` -> `src`.

From src/components/v3/contact-row.tsx (server component, renders a plain `<a>`):
```typescript
type Props = { numeral?: string; title: ReactNode; href: string; handle?: ReactNode; action?: ReactNode; external?: boolean };
export function ContactRow({ numeral, title, href, handle, action, external = false }: Props)
// line 45: "hover:bg-text hover:text-bg"  <- the hover fill this plan re-points at var(--ac)
```
NOTE: ContactRow has NO `accentIndex` prop today. Task 3 adds it.

From src/lib/accent-rotation.ts:
```typescript
export function accentStyle(index: number): CSSProperties  // returns { "--ac": "var(--ac-N)" }
```

From src/lib/homepage-rows.ts:
```typescript
export function homepageAccentOffsets(projects: Project[], posts: BlogPost[]): { building: number; writing: number; loves: number }
// `loves` = the next document-order accent index after the Writing rows. Use it for the advice row.
```

From src/components/home/explorative-homepage.tsx line 53-54:
```typescript
const { building: buildingAccentStart, writing: writingAccentStart } = homepageAccentOffsets(projects, posts);
```
Lines 74-76 are the `<section className="band pt-40 md:pt-64" id="loves">` wrapper; line 78 is the footer comment; line 79 the closing `</div>`.

From src/components/providers/motion-provider.tsx: the whole app is wrapped in `<LazyMotion features={...} strict>`. Under `strict`, rendering `motion.div` THROWS. The form MUST import `{ m, AnimatePresence, useReducedMotion } from "motion/react"` and use `m.div`.

From src/app/layout.tsx: `<SiteHeader />` then `<main>{children}</main>` then `<SiteFooter />`. The header is `position: sticky` and occupies layout space (globals.css line 530: `height: var(--header-h)`, `--header-h: 64px` at line 148). `main` has no padding-top. So a "fills the viewport below the nav" container is `min-h-[calc(100dvh-var(--header-h))]`.

From src/app/globals.css: `.band { background: var(--color-bg); position: relative }` and `.band + .band { border-top: 1px solid var(--color-border) }` (lines 264-270). That border IS the band divider convention. Tokens: `--color-bg` #F5F2EB, `--color-text` #111111, `--color-text-dim`, `--color-text-muted`, `--color-border`. Tailwind classes `bg-bg`, `text-text`, `text-text-dim`, `text-text-muted`, `border-border`, `bg-text`, `font-display`, `font-mono`, `font-sans` all exist.

From src/app/sitemap.ts lines 18-28: comment block "Static routes: /, /building, /writing, /contact = 4" then `staticRoutes` array with 4 entries; `/contact` is `{ url: \`${SITE_URL}/contact\`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 }`.

From src/app/contact/page.tsx: line 23 doc comment "The four ways to reach Monty."; `const LINKS = [ ...4 entries... ] as const;` (lines 26-59), rows keyed by `link.numeral`.

From src/components/layout/site-footer.tsx lines 25-30: `const ELSEWHERE: { label: string; href: string; external: boolean }[] = [ Email, X / Twitter, LinkedIn, Monty Monthly ]`. Rendered as plain `<a>` (internal href fine). `src/__tests__/components/footer.test.tsx` has NO hard-coded link count.

From scripts/enrich-loves.ts lines 11-14 (env loading pattern to mirror):
```typescript
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
```
package.json scripts today: `"enrich-loves": "tsx scripts/enrich-loves.ts"`.

From src/app/api/enrich-loves/route.ts: route shape is `import { NextResponse } from "next/server"; export const dynamic = "force-dynamic"; export async function POST(request) { const body = await request.json().catch(() => null); ... return NextResponse.json({...}, { status }) }`.

Existing test patterns:
- API tests: `src/__tests__/api/notion-cover-route.test.ts` imports `{ describe, it, expect, vi } from "vitest"`, uses `vi.mock(...)` at top level, then `const { GET } = await import("@/app/api/.../route")` inside the test.
- Component tests: `src/__tests__/components/footer.test.tsx` uses `render, screen, cleanup` from `@testing-library/react`, `beforeEach(cleanup)`, and mocks `next/link` as a plain `<a>`. `src/__tests__/components/project-card.test.tsx` lines 5-11 mock motion this way:
```typescript
vi.mock("motion/react", () => ({
  m: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));
```
No @testing-library/user-event is installed: use `fireEvent` from @testing-library/react.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Notion inbox lib + POST /api/advice</name>
  <files>src/lib/notion-inbox.ts, src/app/api/advice/route.ts</files>
  <action>
Implements SPEC sections 1 and 2 exactly.

`src/lib/notion-inbox.ts`:
- `import { Client } from "@notionhq/client"` and create the client at module level exactly like `src/lib/notion-loves.ts` does: `const notion = new Client({ auth: process.env.NOTION_TOKEN })`.
- Export `type InboxEntryInput = { message: string; name?: string; contact?: string; path?: string }` and `export async function createInboxEntry(input: InboxEntryInput): Promise<void>`.
- Read `process.env.NOTION_INBOX_DB_ID` INSIDE the function (not at module level, so tests and builds without the var still import cleanly). If falsy, `throw new Error("NOTION_INBOX_DB_ID not set")`.
- Title: `const collapsed = input.message.replace(/\s+/g, " ").trim()`; `const title = collapsed.length > 80 ? collapsed.slice(0, 80) + "..." : collapsed`.
- Message segments: loop `for (let i = 0; i < input.message.length; i += 2000)` pushing `{ type: "text", text: { content: input.message.slice(i, i + 2000) } }` (Notion caps one segment at 2000 chars).
- Build a `properties` object with EXACT keys: `Name: { title: [{ type: "text", text: { content: title } }] }`, `Message: { rich_text: segments }`, `Status: { select: { name: "New" } }`, `Received: { date: { start: new Date().toISOString() } }`. Then ONLY if `input.name` is a non-empty string add `Sender: { rich_text: [{ type: "text", text: { content: input.name } }] }`; same for `input.contact` -> `Contact`, and `input.path` -> `Page`.
- Call `await notion.pages.create({ parent: { database_id: dbId }, properties })`. Type the properties object as `Parameters<typeof notion.pages.create>[0]["properties"]` or cast with `as` if TS complains about the union; do not use `any`.
- Never accept IP / user agent / headers. Never `console.log` the message body. Top-of-file comment: 3 lines max, no em dashes.

`src/app/api/advice/route.ts`:
- `import { NextResponse } from "next/server"` and `import { createInboxEntry } from "@/lib/notion-inbox"`.
- `export const dynamic = "force-dynamic"`.
- `export async function GET()` returns `NextResponse.json({ error: "method not allowed" }, { status: 405 })`.
- `export async function POST(request: Request)` (plain `Request` type so tests can pass `new Request(...)`):
  1. `const body = await request.json().catch(() => null)`; if `body === null || typeof body !== "object"` return 400 `{ ok: false, error: "invalid json" }`.
  2. `const message = typeof body.message === "string" ? body.message.trim() : ""`. If `message.length === 0` return 400 `{ ok: false, error: "message required" }`. If `message.length > 5000` return 400 `{ ok: false, error: "message too long" }`.
  3. Optional fields: write a small helper `optionalText(value: unknown, max: number): string | undefined` that returns `undefined` unless `typeof value === "string"`, trims, returns `undefined` if the trimmed string is empty or longer than `max`. Apply with `name` max 120, `contact` max 200, `path` max 200.
  4. Bot gates BEFORE any Notion call: if `typeof body.hp === "string" && body.hp.length > 0` return 200 `{ ok: true }`. If `typeof body.t === "number" && body.t < 2500` return 200 `{ ok: true }`. Both silent, no logging.
  5. `try { await createInboxEntry({ message, name, contact, path }); return NextResponse.json({ ok: true }) } catch (err) { console.error("advice: " + (err as Error).message); return NextResponse.json({ ok: false, error: "could not save" }, { status: 502 }) }`.
- Do not reference `request.headers`, `x-forwarded-for`, `user-agent`, or `ip` anywhere in the file. No auth: public by design (say so in a one-line comment).

Commit: `feat(advice): notion inbox lib + POST /api/advice`
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx tsc --noEmit && grep -c "x-forwarded-for\|user-agent\|request.headers\|request.ip" src/app/api/advice/route.ts src/lib/notion-inbox.ts | grep -q ":0" && grep -q "NOTION_INBOX_DB_ID not set" src/lib/notion-inbox.ts && grep -q '"method not allowed"' src/app/api/advice/route.ts && echo OK</automated>
  </verify>
  <done>Both files exist, `npx tsc --noEmit` passes, `createInboxEntry` throws the exact env error when unset, route exports `dynamic`, `GET` (405) and `POST` with the SPEC status/body matrix, and neither file touches headers/IP/UA. Committed as commit 1.</done>
</task>

<task type="auto">
  <name>Task 2: Two-screen form + /advice page + sitemap</name>
  <files>src/components/advice/advice-form.tsx, src/app/advice/page.tsx, src/app/sitemap.ts, src/app/globals.css</files>
  <action>
Implements SPEC sections 3 and 4. All user-visible strings are quoted in SPEC section 3 and are final.

`src/app/globals.css`: append, near the end of the file, one keyframe block only:
`@keyframes advice-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }`. Nothing else in globals.css. (If the blink does not appear in the dev server later, `rm -rf .next` and restart; Turbopack serves stale CSS chunks. Do not debug the CSS.)

`src/components/advice/advice-form.tsx` starts with `"use client"`. Imports: `{ useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"`, `Link from "next/link"`, `{ m, AnimatePresence, useReducedMotion } from "motion/react"`. Use `m.div` (NOT `motion.div`: the app's MotionProvider uses `LazyMotion strict`, which throws on `motion.*`).

State: `stage: "message" | "reply" | "done"`, `message`, `name`, `contact`, `hp` (all strings), `pending: boolean`, `error: boolean`. Refs: `textareaRef`, `nameInputRef`, `doneLinkRef`, `mountTime = useRef(Date.now())`, `focused: boolean` state (tracks textarea focus for the fake cursor).

Motion: `const reduced = useReducedMotion()`; `const dy = reduced ? 0 : 8`; `const duration = reduced ? 0 : 0.15`. Wrap the active panel in `<AnimatePresence mode="wait">` with a single `<m.div key={stage} initial={{ opacity: 0, y: dy }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -dy }} transition={{ duration }}>`.

Focus effect: `useEffect` on `[stage]`: "message" -> `textareaRef.current?.focus()`; "reply" -> `nameInputRef.current?.focus()`; "done" -> `doneLinkRef.current?.focus()`. This is the autofocus on mount too (do not rely on the `autoFocus` attr).

Auto-grow: a function `grow(el: HTMLTextAreaElement) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px" }` called from the textarea `onInput` and from a `useEffect` on `[message, stage]` when `textareaRef.current` exists.

Outer container: `<div className="flex min-h-[calc(100dvh-var(--header-h))] items-center bg-bg px-6 md:px-40" onClick={() => { if (stage === "message") textareaRef.current?.focus() }}>` containing `<div className="w-full max-w-[62ch] mx-auto">` around the AnimatePresence. Honeypot lives outside the AnimatePresence: `<div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></div>`. Also outside: `<div aria-live="polite" className="sr-only">{stage === "done" ? "Sent." : ""}</div>`.

Panel "message":
- `<label htmlFor="advice-message" className="font-mono text-sm text-text-muted">What's on your mind?</label>`
- A `relative` wrapper div carrying `font-sans text-2xl md:text-3xl leading-snug`. Inside it: the fake cursor `{message.length === 0 && !focused && (<span aria-hidden="true" className="pointer-events-none absolute left-0 top-[0.15em] h-[1.1em] w-[2px] bg-text animate-[advice-blink_1s_steps(1,end)_infinite]" />)}` and the `<textarea id="advice-message" ref={textareaRef} rows={1} value={message} ... className="block w-full resize-none border-0 bg-transparent p-0 text-text outline-none focus:outline-none focus:ring-0" style={{ caretColor: "var(--color-text)" }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={(e) => setMessage(e.target.value)} onInput={(e) => grow(e.currentTarget)} onKeyDown={onMessageKeyDown} />`. No `placeholder` attr.
- `onMessageKeyDown(e: KeyboardEvent<HTMLTextAreaElement>)`: if `e.key === "Enter" && !e.shiftKey` then `e.preventDefault()` and if `message.trim().length > 0` `setStage("reply")`. Shift+Enter falls through (newline).
- Below: `<div className="mt-6 flex justify-end"><button type="button" disabled={message.trim().length === 0} onClick={() => setStage("reply")} className="font-mono text-sm underline-offset-4 hover:underline disabled:opacity-40 disabled:no-underline">Continue</button></div>`.
- Then two `<p className="mt-4 font-mono text-xs text-text-muted">` lines: "Enter to continue. Shift+Enter for a new line." and "Anonymous by default. No account, no IP logged."

Panel "reply": a `<form onSubmit={(e: FormEvent) => { e.preventDefault(); submit(false) }} onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); setStage("message") } }}>`:
- `<label htmlFor="advice-name" className="font-mono text-sm text-text-muted">Want a reply?</label>` then `<p className="mt-1 text-text-dim">Leave a name, a contact, or both. Or neither.</p>`.
- Two inputs stacked (`mt-6 space-y-4`), each `type="text"`, `autoComplete="off"`, same borderless class list as the textarea but `text-xl`: first `id="advice-name" ref={nameInputRef} placeholder="Name" aria-label="Name" value={name}`; second `id="advice-contact" placeholder="Email or handle" aria-label="Email or handle" value={contact}`. Enter in either input submits the form natively (= Send).
- Buttons row `mt-8 flex items-center gap-6`: `<button type="submit" disabled={pending} aria-busy={pending} className="font-mono text-sm underline-offset-4 hover:underline disabled:opacity-40">Send</button>` and `<button type="button" disabled={pending} aria-busy={pending} onClick={() => submit(true)} className=(same)>Send anonymously</button>` and, pushed right with `ml-auto`, `<button type="button" onClick={() => setStage("message")} className="font-mono text-xs text-text-muted hover:underline">Back</button>`. Equal visual weight for Send / Send anonymously; no fills, no borders.
- Error line, rendered only when `error`: `<p role="alert" className="mt-4 font-mono text-xs text-text">Did not send. Try again, or email monty@prometheus.today.</p>`.

`submit(anonymous: boolean)`: `const n = anonymous ? "" : name; const c = anonymous ? "" : contact; if (anonymous) { setName(""); setContact("") }`. `let path = ""; try { const ref = new URL(document.referrer); if (ref.origin === window.location.origin) path = ref.pathname } catch {}`. `setPending(true); setError(false); try { const res = await fetch("/api/advice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, name: n, contact: c, path, hp, t: Date.now() - mountTime.current }) }); if (res.ok) setStage("done"); else setError(true) } catch { setError(true) } finally { setPending(false) }`. Message, name and contact stay in state on failure.

Panel "done": `<p className="font-mono text-sm text-text-muted">Sent.</p>`, `<p className="mt-1 text-text-dim">It lands in a Notion database I actually read.</p>`, `<Link ref={doneLinkRef} href="/" className="mt-6 inline-block font-mono text-sm underline-offset-4 hover:underline">Back to home</Link>`, then `<pre className="mt-10 whitespace-pre-wrap font-sans text-text-dim">{message}</pre>`. (If `ref` on `Link` types poorly, wrap the Link in a `<span>` and put a `tabIndex={-1}` ref on a wrapping `<div>` instead; the requirement is that focus moves to the first interactive element.)

Export `export function AdviceForm()`. Top-of-file comment: what the three stages are, why `m` not `motion`, no em dashes.

`src/app/advice/page.tsx` (server component, no "use client"):
- `import type { Metadata } from "next"` and `import { AdviceForm } from "@/components/advice/advice-form"`.
- `const DESCRIPTION = "Tell Monty Singer something anonymously: advice, a question, a correction. No account, no IP logged."`.
- `export const metadata: Metadata = { title: "Unsolicited advice", description: DESCRIPTION, alternates: { canonical: "/advice" }, openGraph: { title: "Unsolicited advice", description: DESCRIPTION, url: "/advice", type: "website" } }` (mirror `src/app/contact/page.tsx` lines 11-21).
- `export default function AdvicePage() { return <AdviceForm /> }`. The viewport-height container already lives in the form. No hero band, no breadcrumb.

`src/app/sitemap.ts`: change the comment on line 18 to `// Static routes: /, /building, /writing, /contact, /advice = 5` and add a line after the `/contact` entry: `{ url: \`${SITE_URL}/advice\`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },`. Add one comment line `// (/advice added in quick task 260920-ofb.)` in the existing comment block. Keep the file's single-quote / no-semicolon style.

Commit: `feat(advice): two-screen anonymous form + /advice page + sitemap`
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx tsc --noEmit && npm run lint && grep -q '"use client"' src/components/advice/advice-form.tsx && grep -q "from \"motion/react\"" src/components/advice/advice-form.tsx && ! grep -q "motion\.div" src/components/advice/advice-form.tsx && grep -q "advice-blink" src/app/globals.css && grep -q "/advice" src/app/sitemap.ts && ! grep -rq "—" src/components/advice src/app/advice && echo OK</automated>
  </verify>
  <done>`/advice` renders the form only; the form uses `m.div` under AnimatePresence, autofocuses the textarea via effect, shows the blinking bar only when empty and unfocused, Enter/Shift+Enter behave per SPEC, reply stage has Send / Send anonymously / Back / Escape, done stage shows the sent text; metadata matches SPEC 4; sitemap lists /advice; tsc and lint clean; no em dashes. Committed as commit 2.</done>
</task>

<task type="auto">
  <name>Task 3: Entry points: homepage band, contact row, footer link</name>
  <files>src/components/v3/contact-row.tsx, src/components/home/section-advice.tsx, src/components/home/explorative-homepage.tsx, src/app/contact/page.tsx, src/components/layout/site-footer.tsx</files>
  <action>
Implements SPEC section 5. Copy strings below are final.

`src/components/v3/contact-row.tsx`: ContactRow has no accent prop today, so add one (this is the only way to honor the SPEC's `accentIndex` on the homepage row).
- `import { accentStyle } from "@/lib/accent-rotation"`.
- Add to `Props`: `/** Document-order accent index (homepage rotation). Omit for the ink fill. */ accentIndex?: number;` and destructure it.
- On the `<a>`, add `style={accentIndex === undefined ? undefined : accentStyle(accentIndex)}`.
- Replace the class string `"hover:bg-text hover:text-bg"` (line 45) with `"hover:bg-[var(--ac,var(--color-text))] hover:text-bg"`. With `--ac` unset (every /contact row) this computes to the same ink fill as before, so `/contact` is visually unchanged; `src/__tests__/components/contact-row.test.tsx` only asserts `group-hover:text-bg` classes and keeps passing. Update the doc comment at the top (one sentence) to mention the optional accent. Do not change anything else.

`src/components/home/section-advice.tsx` (server component, no hooks):
```
import { ContactRow } from "@/components/v3/contact-row";
export function SectionAdvice({ accentIndex }: { accentIndex: number }) {
  return (
    <section className="band py-20 md:py-28" id="advice">
      <div className="px-6 md:px-40">
        <div className="-mx-[18px]">
          <ContactRow title="Unsolicited advice" handle="Anonymous. No login. I read every one." action="Say it" href="/advice" external={false} accentIndex={accentIndex} />
        </div>
      </div>
    </section>
  );
}
```
No `numeral` prop. The `.band + .band` rule in globals.css already draws the 1px divider above this band (that IS the existing band divider convention), so do NOT add `<RuleStrong />`; a second line would double up. Short doc comment, no em dashes.

`src/components/home/explorative-homepage.tsx`:
- Add `import { SectionAdvice } from "./section-advice";`.
- Change lines 53-54 to also take the `loves` offset: `const { building: buildingAccentStart, writing: writingAccentStart, loves: adviceAccentIndex } = homepageAccentOffsets(projects, posts);`. `loves` is the next continuous index after the Writing rows, which is exactly the "next/total index" the SPEC asks for. Rewrite the comment above it: drop the sentence "Not destructuring `loves` here -- Phase 22 will, and an unused binding is a lint error today." and replace with one line saying the advice row takes the `loves` slot until Phase 22 renumbers.
- Mount `<SectionAdvice accentIndex={adviceAccentIndex} />` directly after the closing `</section>` of `#loves` (line 76) and before the footer comment on line 78. Update the band-order doc comment at the top of the file (line 14) to `Hero -> 01 Building -> 02 Writing -> 03 Things I Love -> Unsolicited advice`.

`src/app/contact/page.tsx`: append a 5th entry to `LINKS` (keep `as const`): `{ numeral: "05", title: "Unsolicited advice", href: "/advice", handle: "Anonymous. Advice, questions, corrections.", action: "Say it", external: false }`. Change the doc comment on line 23 from "The four ways to reach Monty." to "The five ways to reach Monty." and its sentence "Only Email is in-place (mailto:); the rest open off-site in a new tab." to "Email is a mailto: and Unsolicited advice is an internal route; the rest open off-site in a new tab." Nothing else changes.

`src/components/layout/site-footer.tsx`: append `{ label: "Unsolicited advice", href: "/advice", external: false },` as the last ELSEWHERE entry (after Monty Monthly). The footer test has no hard-coded count; leave the test file alone in this commit (Task 5 adds an assertion).

Commit: `feat(advice): homepage band, contact row, footer link`
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx tsc --noEmit && npm run lint && npx vitest run src/__tests__/components/contact-row.test.tsx src/__tests__/components/footer.test.tsx src/__tests__/home/explorative-homepage.test.tsx && grep -q "<SectionAdvice" src/components/home/explorative-homepage.tsx && grep -q 'numeral: "05"' src/app/contact/page.tsx && grep -q 'href: "/advice"' src/components/layout/site-footer.tsx && grep -q "accentIndex" src/components/v3/contact-row.tsx && echo OK</automated>
  </verify>
  <done>Homepage renders `section#advice` after `#loves` with the single accent-rotated ContactRow; /contact shows row 05; footer ELSEWHERE has the /advice link; ContactRow accepts an optional `accentIndex` and /contact rows still invert to ink; contact-row, footer and explorative-homepage tests pass. Committed as commit 3.</done>
</task>

<task type="auto">
  <name>Task 4: create-inbox-db script + env example</name>
  <files>scripts/create-inbox-db.ts, package.json, .env.example</files>
  <action>
Implements SPEC section 6. The repo already runs TS scripts with `tsx` and loads env with `dotenv` (see scripts/enrich-loves.ts lines 11-14), so write TypeScript, not .mjs.

`scripts/create-inbox-db.ts`:
- Header comment (3-5 lines, no em dashes): usage `npm run create-inbox-db -- --parent <notion page id>`; one-shot; creates the "Inbox" database with the exact properties `src/lib/notion-inbox.ts` writes.
- `import { config } from "dotenv"; config({ path: ".env.local" }); config({ path: ".env" });` then `import { Client } from "@notionhq/client";` (static import is fine here; the client reads the token at construction inside `main`).
- Parse args: `const i = process.argv.indexOf("--parent"); const parentId = i >= 0 ? process.argv[i + 1] : undefined;`. If `!parentId`, `console.error("usage: npm run create-inbox-db -- --parent <notion page id>")` and `process.exit(1)`. If `!process.env.NOTION_TOKEN`, print `NOTION_TOKEN not set (add it to .env.local)` and exit 1.
- `const notion = new Client({ auth: process.env.NOTION_TOKEN })`.
- `const db = await notion.databases.create({ parent: { type: "page_id", page_id: parentId }, title: [{ type: "text", text: { content: "Inbox" } }], properties: { Name: { title: {} }, Message: { rich_text: {} }, Sender: { rich_text: {} }, Contact: { rich_text: {} }, Status: { select: { options: [{ name: "New" }, { name: "Read" }, { name: "Replied" }, { name: "Spam" }] } }, Received: { date: {} }, Page: { rich_text: {} } } })`. This is the @notionhq/client 4.0.2 shape (verified in api-endpoints.d.ts: bodyParams parent, properties, title).
- Print: `console.log("Created Inbox database")`, `console.log("url: " + ((db as { url?: string }).url ?? "(no url in response)"))`, `console.log("NOTION_INBOX_DB_ID=" + db.id)`, then `console.log("Paste that line into .env.local and into the Vercel project env.")`.
- `main().catch((err) => { console.error("create-inbox-db: " + (err as Error).message); process.exit(1) })`.

`package.json`: add `"create-inbox-db": "tsx scripts/create-inbox-db.ts"` to `scripts`, right after `"enrich-loves"`. No other change.

`.env.example`: append at the end:
```
# --- Unsolicited advice inbox (/advice, POST /api/advice) ---
# Notion database that anonymous messages land in. Create it once with
# `npm run create-inbox-db -- --parent <notion page id>` and paste the printed id here and into Vercel.
NOTION_INBOX_DB_ID=
```
Do NOT touch `.env.local`.

Commit: `chore(advice): create-inbox-db script + env example`
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx tsc --noEmit && grep -q '"create-inbox-db": "tsx scripts/create-inbox-db.ts"' package.json && grep -q "^NOTION_INBOX_DB_ID=" .env.example && npx tsx scripts/create-inbox-db.ts 2>&1 | grep -q "usage:" && echo OK</automated>
  </verify>
  <done>Script compiles, prints usage and exits 1 without `--parent`, calls `databases.create` with the exact 7 properties and 4 Status options, prints `NOTION_INBOX_DB_ID=<id>`; npm script and .env.example entry exist; `.env.local` untouched. Committed as commit 4.</done>
</task>

<task type="auto">
  <name>Task 5: Route + form tests, full verification</name>
  <files>src/__tests__/api/advice-route.test.ts, src/__tests__/components/advice-form.test.tsx, src/__tests__/components/footer.test.tsx</files>
  <action>
Implements SPEC section 7. Run `npx vitest run` FIRST and note the baseline failure count (STATE.md says the suite is fully green; the SPEC's "3 known homepage failures" are historical). Only pre-existing failures may remain at the end.

`src/__tests__/api/advice-route.test.ts`:
- `import { describe, it, expect, vi, beforeEach } from "vitest"`. Top-level `vi.mock("@/lib/notion-inbox", () => ({ createInboxEntry: vi.fn(async () => undefined) }))`, then `import { createInboxEntry } from "@/lib/notion-inbox"` and `import { POST, GET } from "@/app/api/advice/route"`. Cast the mock: `const mockCreate = vi.mocked(createInboxEntry)`. `beforeEach(() => mockCreate.mockReset().mockResolvedValue(undefined))`.
- Helper `post(body: unknown) { return POST(new Request("http://localhost/api/advice", { method: "POST", headers: { "Content-Type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) })) }`.
- Cases (one `it` each):
  1. valid `{ message: "  hello there  ", name: " Monty ", contact: " m@x.com ", path: "/contact", t: 9000 }` -> status 200, json `{ ok: true }`, `mockCreate` called once with `{ message: "hello there", name: "Monty", contact: "m@x.com", path: "/contact" }`.
  2. `{ message: "   " }` -> 400 and json.error === "message required"; mockCreate not called.
  3. `{ message: "a".repeat(5001) }` -> 400 and json.error === "message too long".
  4. `{ message: "hi", hp: "http://spam" }` -> 200, `{ ok: true }`, mockCreate NOT called.
  5. `{ message: "hi", t: 1000 }` -> 200, mockCreate NOT called.
  6. `mockCreate.mockRejectedValueOnce(new Error("boom"))`; `{ message: "hi", t: 9000 }` -> 502 and json.error === "could not save". Spy `console.error` with `vi.spyOn(console, "error").mockImplementation(() => {})` and assert it was called with a string that does NOT contain "hi" is optional; at minimum silence it.
  7. `await GET()` -> status 405, json.error === "method not allowed".
  Also add: invalid JSON body string `"{not json"` -> 400.

`src/__tests__/components/advice-form.test.tsx`:
- Imports: `{ describe, it, expect, vi, beforeEach, afterEach } from "vitest"`, `{ render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react"`.
- Top-level mocks, copied from the patterns in the interfaces block: `vi.mock("motion/react", ...)` with `m.div` passthrough (strip non-DOM props `initial`, `animate`, `exit`, `transition` before spreading onto the div so React does not warn), `AnimatePresence` passthrough, `useReducedMotion: () => false`; `vi.mock("next/link", ...)` as a plain `<a>` (see footer.test.tsx lines 17-31; forward `ref` is not needed).
- `beforeEach(() => { cleanup(); vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true }))) })`; `afterEach(() => vi.unstubAllGlobals())`.
- Import `{ AdviceForm } from "@/components/advice/advice-form"` AFTER the mocks.
- Helper `typeAndAdvance(text)`: `const ta = screen.getByLabelText("What's on your mind?"); fireEvent.change(ta, { target: { value: text } }); fireEvent.keyDown(ta, { key: "Enter" });`.
- Cases:
  1. renders stage 1: `screen.getByText("What's on your mind?")` exists and `document.activeElement === screen.getByLabelText("What's on your mind?")` (the focus effect runs synchronously after render under RTL's act).
  2. Enter with empty message: `fireEvent.keyDown(textarea, { key: "Enter" })`; "What's on your mind?" still in the document; `screen.queryByText("Want a reply?")` is null.
  3. typing + Enter: `typeAndAdvance("hello")`; `await screen.findByText("Want a reply?")`.
  4. Send anonymously: `typeAndAdvance("hello")`; fill Name with "Monty" via `fireEvent.change(screen.getByLabelText("Name"), ...)`; `fireEvent.click(screen.getByText("Send anonymously"))`; `await screen.findAllByText("Sent.")` (it appears in both the label and the aria-live region, so use the All variant); `const [url, init] = vi.mocked(fetch).mock.calls[0]; expect(url).toBe("/api/advice"); const body = JSON.parse(String(init?.body)); expect(body.message).toBe("hello"); expect(body.name).toBe(""); expect(body.contact).toBe(""); expect(typeof body.t).toBe("number")`.
  5. fetch rejects: `vi.mocked(fetch).mockRejectedValueOnce(new Error("net"))`; `typeAndAdvance("keep me")`; `fireEvent.click(screen.getByText("Send"))`; `const alert = await screen.findByRole("alert"); expect(alert.textContent).toContain("Did not send.")`; `fireEvent.click(screen.getByText("Back"))`; `await waitFor(() => expect(screen.getByLabelText("What's on your mind?")).toHaveValue("keep me"))`.
- If a test hangs on exit animations despite the mock, the mock is wrong (AnimatePresence must be a pure passthrough); fix the mock, not the component.

`src/__tests__/components/footer.test.tsx`: in the test "renders the core route links", add one line `expect(document.querySelector('a[href="/advice"]')).not.toBeNull();` and extend its title to "(Building, Writing, Things I Love, Unsolicited advice)".

Full verification, in order: `npm run lint`, `npx tsc --noEmit`, `npx vitest run` (compare to baseline; the two new files must be fully green), then `npm run build`. Fix anything the build surfaces (typical: a `ref` on `next/link` typing in the done panel, or a client/server boundary error). Do not weaken tests to pass.

Commit: `test(advice): route + form tests`
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/api/advice-route.test.ts src/__tests__/components/advice-form.test.tsx src/__tests__/components/footer.test.tsx && npm run lint && npx tsc --noEmit && npm run build</automated>
  </verify>
  <done>Route test covers all 8 cases (7 from SPEC + invalid JSON) and the form test covers all 5; footer test asserts the /advice link; lint, tsc, the full vitest suite (no new failures versus baseline) and `npm run build` all pass. Committed as commit 5. Five commits total on main, none pushed.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| browser -> POST /api/advice | Untrusted, unauthenticated JSON from anyone on the internet |
| /api/advice -> Notion API | Server-side write with the site's NOTION_TOKEN into a single database |
| scripts/create-inbox-db.ts -> Notion | Local one-shot run with the same token, reads .env.local |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-ofb-01 | Tampering | route.ts body parsing | mitigate | Strict type checks per field, message 1..5000 trimmed, optional fields dropped when non-string or over cap (Task 1) |
| T-ofb-02 | Denial of service | route.ts / Notion write quota | mitigate (partial) | Honeypot `hp` and `t < 2500` timing gate short-circuit before any Notion call; 5000-char cap bounds each write. No rate limiting by IP because IP is deliberately never read (accepted residual: a patient scripted spammer can fill the Inbox; Status "Spam" option exists for triage) |
| T-ofb-03 | Information disclosure | route.ts logging | mitigate | Only `err.message` is logged, never the body; no IP/UA/headers read or stored (grep-gated in Task 1 verify) |
| T-ofb-04 | Information disclosure | notion-inbox.ts `Page` property | accept | `path` is only the same-origin referrer pathname, capped at 200 chars; no query string, no cross-origin referrers |
| T-ofb-05 | Spoofing | Sender / Contact fields | accept | Free-text by design (anonymous inbox); nothing on the site trusts them |
| T-ofb-06 | Elevation of privilege | route.ts | mitigate | Route can only call `createInboxEntry`; `NOTION_INBOX_DB_ID` fixes the target database, `notion.pages.create` cannot escape it |
| T-ofb-07 | Tampering | Notion rich_text injection | accept | Notion stores text as plain segments; no markdown/HTML is interpreted by the site (the message is never rendered back except as `<pre>` on the sender's own screen) |
| T-ofb-SC | Tampering | npm installs | n/a | No new packages; all imports (`@notionhq/client`, `motion`, `dotenv`, `tsx`) are already in package.json |
</threat_model>

<verification>
- `npx tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build` all exit 0 (Task 5).
- `git log --oneline -5` shows exactly the five SPEC commit messages in order, on `main`, not pushed.
- `grep -rn "—" src/components/advice src/app/advice src/components/home/section-advice.tsx scripts/create-inbox-db.ts src/lib/notion-inbox.ts src/app/api/advice` returns nothing (no em dashes).
- `.env.local` is not in the diff of any commit.
</verification>

<success_criteria>
- Visiting /advice shows the one-prompt screen with a focused borderless textarea; Enter advances; "Send anonymously" produces "Sent." with the message echoed below.
- POST /api/advice writes a page with properties Name, Message, Status=New, Received (+ Sender/Contact/Page when provided) to the DB named by NOTION_INBOX_DB_ID, returns 502 on Notion failure, 200 silently for bots.
- Homepage `#advice` band, /contact row 05 and footer ELSEWHERE all link to /advice with SPEC copy; /contact rows still invert to ink.
- `npm run create-inbox-db -- --parent <id>` creates the matching DB and prints the env line.
- 13 new test cases green, no regressions, build clean, five atomic commits.
</success_criteria>

<output>
Create `.planning/quick/260920-ofb-anonymous-unsolicited-advice-inbox-advic/260920-ofb-SUMMARY.md` when done, listing the five commit hashes and the baseline vs final vitest counts.
</output>
