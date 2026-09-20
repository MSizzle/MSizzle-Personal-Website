# Quick task 260920-ofb: Anonymous "Unsolicited advice" inbox

/advice page (two-screen Typeform-feel form), POST /api/advice writing to a Notion Inbox DB, plus entry points on homepage, /contact and footer.

## Context (already verified, do not re-survey)
- Branch: main. Site = Next 16 App Router, Tailwind v4, Motion (`motion/react`), @notionhq/client ^4.0.2 (existing code uses `notion.databases.query`; `notion.pages.create` is fine). Server components default; `"use client"` only where needed. `dynamic({ssr:false})` must live in a "use client" loader if used.
- Tokens: `bg-bg` (bone #F5F2EB), `text-text` ink #111, `text-text-dim`, `text-text-muted`, `border-border`, `font-display` (Hanken), `font-mono`, `font-sans`. Brand rules: NO gradients, NO em dashes anywhere in copy or comments, no hue except the existing accent rotation, hard offset solids for depth.
- Existing patterns to reuse: `src/components/v3/contact-row.tsx` (brutalist link row w/ accentIndex), `src/components/editorial/rule-strong.tsx`, `src/lib/accent-rotation.ts` (`accentStyle(i)`), `src/app/api/enrich-loves/route.ts` (route shape), `src/lib/notion-loves.ts` (Notion client init + env var pattern).
- Homepage orchestrator: `src/components/home/explorative-homepage.tsx`. Bands: Hero, SectionBuilding, SectionWriting, `<section className="band" id="loves">` SectionLoves. Footer is rendered by app/layout.tsx via `src/components/layout/site-footer.tsx` (EXPLORE + ELSEWHERE arrays).
- /contact: `src/app/contact/page.tsx`, LINKS array of 4 ContactRow entries (numeral 01..04).
- Tests: vitest in `src/__tests__/**` (api/, components/, pages/). 3 pre-existing failing homepage tests are known (section-building, explorative-homepage); do not touch them.
- Env: add `NOTION_INBOX_DB_ID` to `.env.example` (with comment). Do NOT edit `.env.local`.

## Deliverables

### 1. `src/lib/notion-inbox.ts`
- `createInboxEntry({ message, name?, contact?, path? })` -> `notion.pages.create` with parent `{ database_id: process.env.NOTION_INBOX_DB_ID }`. If env var missing, throw `new Error("NOTION_INBOX_DB_ID not set")`.
- Properties (exact names; the DB will be created to match): `Name` (title: first 80 chars of message, whitespace collapsed to single spaces, append "..." if truncated), `Message` (rich_text; Notion caps one text segment at 2000 chars, so split into multiple `{ text: { content } }` segments), `Sender` (rich_text, only if provided), `Contact` (rich_text, only if provided), `Status` (select: "New"), `Received` (date: `new Date().toISOString()`), `Page` (rich_text, only if provided).
- Never accept or store IP / user agent / headers. Never log the message body.

### 2. `src/app/api/advice/route.ts`
- `export const dynamic = "force-dynamic"`. Export POST. Export GET returning 405 `{ error: "method not allowed" }`.
- Body JSON: `{ message: string, name?: string, contact?: string, path?: string, hp?: string, t?: number }`. Invalid JSON -> 400.
- Validation: message trimmed length 1..5000 else 400 `{ ok:false, error:"message required" | "message too long" }`; name trimmed and capped: if > 120 chars drop it; contact if > 200 drop; path if > 200 drop. Non-string optional fields are ignored.
- `hp` non-empty string -> respond 200 `{ok:true}` silently, do NOT call createInboxEntry. `t` present as number and < 2500 -> same silent 200.
- Do not read request.ip, x-forwarded-for, or user-agent anywhere.
- Success 200 `{ok:true}`. On createInboxEntry throw -> 502 `{ok:false, error:"could not save"}`, `console.error("advice: " + err.message)` only (never the body).
- No auth (public endpoint by design).

### 3. `src/components/advice/advice-form.tsx` ("use client")
Three states in one component: "message" | "reply" | "done". Full-viewport feel, bone background, nothing else on the page (no hero band, no breadcrumb; footer still renders from layout).
- State "message": centered column `max-w-[62ch]` inside a flex container that fills the viewport height minus the nav. Small mono label above (`<label htmlFor>`): "What's on your mind?" (`font-mono text-sm text-text-muted`). Below it an auto-growing `<textarea id="advice-message" rows={1}>` (height = scrollHeight on each input; no border, no outline, no box, transparent bg, `font-sans text-2xl md:text-3xl leading-snug text-text`, `style={{ caretColor: "var(--color-text)" }}`, `resize: none`). AUTOFOCUS on mount (call `.focus()` in a useEffect, do not rely on the autoFocus attr alone). Also render a custom blinking cursor: a `2px` wide, `1.1em` tall ink bar (`bg-text`) positioned at the start of the textarea line, with a CSS keyframes step blink at 1s (define `@keyframes advice-blink` in a `<style>` tag inside the component or in globals.css, whichever is cleaner), `aria-hidden`. It renders ONLY while the textarea value is empty AND the textarea is NOT focused, so a visitor whose browser blocked autofocus still sees a moving cursor. Clicking anywhere on the screen container focuses the textarea. No placeholder attr (the label is the prompt). Key handling: Enter (without Shift) advances to "reply" if message.trim() is non-empty, else does nothing; Shift+Enter inserts a newline (default behaviour). Below the field, right-aligned, a small mono button "Continue" (disabled when message.trim() is empty). Under that, hint text `font-mono text-xs text-text-muted`: "Enter to continue. Shift+Enter for a new line." Under that, one plain line, same style: "Anonymous by default. No account, no IP logged."
- State "reply": same column. Label "Want a reply?" (same mono style). Sub line `text-text-dim`: "Leave a name, a contact, or both. Or neither." Two `<input type="text">` stacked, same borderless style, `text-xl`: first `placeholder="Name"` (id advice-name, aria-label Name, autoComplete off), second `placeholder="Email or handle"` (id advice-contact, aria-label Email or handle, autoComplete off). Focus the first input on entering this state (useEffect). Two buttons side by side, equal visual weight (mono, underline-on-hover text buttons or thin-bordered pills, no fills): "Send" and "Send anonymously". "Send" submits with name/contact; "Send anonymously" clears name and contact in state then submits. Enter in either input = Send. Escape key or a small mono "Back" text button returns to "message" preserving the message text.
- State "done": label "Sent." then one line `text-text-dim`: "It lands in a Notion database I actually read." then a link "Back to home" to "/" (next/link). Below, the message they sent, rendered as plain preformatted text (`whitespace-pre-wrap text-text-dim`), so they can copy it.
- Transitions: Motion `AnimatePresence mode="wait"` around the active state's panel, `initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.15}}`. `useReducedMotion()` true -> duration 0 and no y offset.
- Hidden honeypot: `<input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true">` in a visually off-screen wrapper (`absolute -left-[9999px] h-px w-px overflow-hidden`), value tracked in state and sent as `hp`.
- Track `mountTime = useRef(Date.now())`; send `t: Date.now() - mountTime.current`.
- Submit: `fetch("/api/advice", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ message, name, contact, path, hp, t }) })`. `path` = pathname of `document.referrer` if its origin equals `window.location.origin`, else "". On `res.ok` -> state "done". Else or on throw -> error state: inline mono line `role="alert"`: "Did not send. Try again, or email monty@prometheus.today." Message, name and contact stay intact. Buttons disabled while pending (`aria-busy`).
- Accessibility: labels wired via htmlFor; a `aria-live="polite"` region announces "Sent." on done; focus moves to the first interactive element on each state change.
- No gradients, no em dashes, no emoji, no external deps beyond motion/react and next/link.

### 4. `src/app/advice/page.tsx`
- Server component. `export const metadata`: title "Unsolicited advice", description "Tell Monty Singer something anonymously: advice, a question, a correction. No account, no IP logged.", `alternates: { canonical: "/advice" }`, openGraph { title, description, url: "/advice", type: "website" }.
- Renders `<AdviceForm />` inside a container that fills the viewport below the fixed nav. Check `src/app/layout.tsx` and existing pages to see how the nav height is offset (padding-top on main, a CSS var, or similar) and mirror it. `min-h-[100dvh]` style flex-center is acceptable if the nav is fixed and the page already pads for it.
- Add `/advice` to `src/app/sitemap.ts` following the existing static-route pattern.

### 5. Entry points (all link to /advice; copy exact)
- Homepage: new server component `src/components/home/section-advice.tsx` rendering `<section className="band" id="advice">` with the same horizontal gutters the contact page uses (`px-6 md:px-40`), a `<RuleStrong />` (or the existing band divider convention) above, and a single `ContactRow` with: no numeral (omit the prop), title "Unsolicited advice", handle "Anonymous. No login. I read every one.", action "Say it", href "/advice", external false, accentIndex: read `src/lib/homepage-rows.ts` and if `homepageAccentOffsets` exposes a next/total index use it, else pass 3. Mount it in `explorative-homepage.tsx` after the `#loves` section and before the closing div, with the same "band" rhythm.
- /contact: append a 5th LINKS entry `{ numeral: "05", title: "Unsolicited advice", href: "/advice", handle: "Anonymous. Advice, questions, corrections.", action: "Say it", external: false }`. ContactRow renders a plain <a>; an internal href is fine. Update the /contact intro doc comment count if it says "four".
- Footer: add `{ label: "Unsolicited advice", href: "/advice", external: false }` to ELSEWHERE in `src/components/layout/site-footer.tsx`. Check `src/__tests__/components/footer.test.tsx` for a hard-coded link count and update it if needed.

### 6. `scripts/create-inbox-db.ts`
- Look at existing files under `scripts/` and package.json to see how scripts load env and run (tsx? node? dotenv?). Mirror that. If no TS runner exists, write `scripts/create-inbox-db.mjs` in plain ESM JS using `@notionhq/client` and read `.env.local` manually (simple line parser, no new deps).
- Args: `--parent <notion page id>` (required; print usage and exit 1 if missing).
- Calls `notion.databases.create({ parent: { type: "page_id", page_id }, title: [{ type: "text", text: { content: "Inbox" } }], properties: { Name: { title: {} }, Message: { rich_text: {} }, Sender: { rich_text: {} }, Contact: { rich_text: {} }, Status: { select: { options: [{name:"New"},{name:"Read"},{name:"Replied"},{name:"Spam"}] } }, Received: { date: {} }, Page: { rich_text: {} } } })`.
- Prints the DB url and the line `NOTION_INBOX_DB_ID=<id>` so it can be pasted into .env.local and Vercel.
- Add npm script `"create-inbox-db"` pointing at it.

### 7. Tests
- `src/__tests__/api/advice-route.test.ts`: `vi.mock("@/lib/notion-inbox")`; cases: valid -> 200 and createInboxEntry called with trimmed fields; empty/whitespace message -> 400; 5001 chars -> 400; honeypot filled -> 200 and NOT called; t=1000 -> 200 and NOT called; createInboxEntry rejects -> 502; GET -> 405. Build requests with `new Request("http://localhost/api/advice", { method:"POST", body: JSON.stringify(...) })` (look at the existing api tests for the request pattern they use).
- `src/__tests__/components/advice-form.test.tsx` (jsdom, @testing-library/react as used by existing component tests): renders state 1 with label text and the textarea focused; Enter with empty message keeps "What's on your mind?" visible; typing + Enter shows "Want a reply?"; clicking "Send anonymously" calls fetch with name "" / contact "" and shows "Sent."; fetch rejecting shows "Did not send." and the message text is still present after clicking Back. Mock `global.fetch` with vi.fn. Motion's AnimatePresence in jsdom: if exit animations hang the test, mock `motion/react` minimally (see how existing tests handle motion, if any).
- Run `npm run lint`, `npx tsc --noEmit`, `npx vitest run` (only the 3 known pre-existing homepage failures may remain). Run `npm run build` at the end and fix anything it surfaces.

### 8. Copy
All user-visible copy above is final. Do not "improve" it. No em dashes anywhere, including comments.

## Commits
Atomic, conventional, on main, do not push:
1. feat(advice): notion inbox lib + POST /api/advice
2. feat(advice): two-screen anonymous form + /advice page + sitemap
3. feat(advice): homepage band, contact row, footer link
4. chore(advice): create-inbox-db script + env example
5. test(advice): route + form tests
