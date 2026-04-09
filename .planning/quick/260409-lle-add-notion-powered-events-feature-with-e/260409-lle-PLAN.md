---
phase: quick
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/notion-events.ts
  - src/app/events/page.tsx
  - src/components/nav/navigation.tsx
autonomous: true
must_haves:
  truths:
    - "Visiting /events shows upcoming events above past events"
    - "Events are fetched from Notion NOTION_EVENTS_DB_ID database"
    - "Page gracefully shows empty state when env var is missing or no events exist"
    - "Events nav link appears in site navigation"
  artifacts:
    - path: "src/lib/notion-events.ts"
      provides: "Notion events fetcher with rate limiting and retry"
      exports: ["EventItem", "getPublishedEvents", "getUpcomingEvents", "getPastEvents"]
    - path: "src/app/events/page.tsx"
      provides: "Events list page with ISR"
      contains: "revalidate = 1800"
    - path: "src/components/nav/navigation.tsx"
      provides: "Navigation with Events link"
      contains: "/events"
  key_links:
    - from: "src/app/events/page.tsx"
      to: "src/lib/notion-events.ts"
      via: "import getUpcomingEvents, getPastEvents"
      pattern: "import.*notion-events"
---

<objective>
Add a Notion-powered events feature with an /events page and navigation link, following the exact patterns established by the existing projects Notion integration.

Purpose: Extend the site with an events section pulling from a Notion database, consistent with existing CMS patterns.
Output: Events fetcher module, /events page, updated navigation.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/notion-projects.ts (PRIMARY PATTERN — mirror this exactly)
@src/app/projects/page.tsx (Page structure pattern)
@src/components/nav/navigation.tsx (Navigation to update)
@src/components/animations/scroll-reveal.tsx (Animation wrapper)

<interfaces>
<!-- From src/lib/notion-projects.ts — follow this pattern exactly -->
```typescript
// Rate limiter and retry pattern (reuse from notion-projects or duplicate)
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const limit = pLimit(2);
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> { ... }

// Property extraction pattern — access props with fallback names
const titleProp = props["Name"] || props["Title"] || props["title"];
const publishedProp = props["Published"] || props["published"];
```

<!-- From src/components/nav/navigation.tsx -->
```typescript
const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]
```

<!-- Page layout pattern from projects/page.tsx -->
```typescript
// Container: mx-auto max-w-[66ch] px-6 pb-16 pt-24 md:px-0
// Heading: text-sm font-normal uppercase tracking-widest
// Empty state: opacity-50 message
// ISR: export const revalidate = 1800
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create Notion events fetcher module</name>
  <files>src/lib/notion-events.ts</files>
  <action>
Create `src/lib/notion-events.ts` mirroring the exact structure of `src/lib/notion-projects.ts`.

1. Import Client from @notionhq/client, PageObjectResponse type, and pLimit.
2. Reuse the same `notion` client instance pattern, `limit = pLimit(2)`, and `withRetry` function (duplicate them — each module is self-contained, matching the projects pattern).
3. Define `EVENTS_DATABASE_ID = process.env.NOTION_EVENTS_DB_ID!`
4. Define the `EventItem` interface:
   ```typescript
   export interface EventItem {
     id: string;
     name: string;
     date: string | null;       // ISO date string from Notion date property
     endDate: string | null;    // end date if range provided
     location: string;
     link: string | null;
     description: string;
     emoji: string | null;
     published: boolean;
   }
   ```
5. Create `extractEventProperties(page: PageObjectResponse): EventItem` following the same defensive property extraction pattern as `extractProjectProperties`:
   - Name: title property (props["Name"] || props["Title"] || props["title"])
   - Date: date property (props["Date"] || props["date"]) — extract start and end from date object
   - Location: rich_text property (props["Location"] || props["location"])
   - Link: url property (props["Link"] || props["link"])
   - Description: rich_text property (props["Description"] || props["description"])
   - Published: checkbox (props["Published"] || props["published"])
   - emoji: page.icon?.type === "emoji" ? page.icon.emoji : null

6. Create `getPublishedEvents(): Promise<EventItem[]>`:
   - Guard: if !NOTION_TOKEN or !NOTION_EVENTS_DB_ID, return []
   - Query with filter Published=true, sort by Date ascending
   - Paginate with cursor (same do/while pattern as projects)
   - Wrap in try/catch returning [] on failure

7. Create `getUpcomingEvents(): Promise<EventItem[]>`:
   - Guard same as above
   - Query with compound filter: Published=true AND Date on_or_after today (new Date().toISOString().split('T')[0])
   - Sort by Date ascending (soonest first)
   - Paginate, try/catch

8. Create `getPastEvents(): Promise<EventItem[]>`:
   - Guard same as above
   - Query with compound filter: Published=true AND Date before today
   - Sort by Date descending (most recent past first)
   - Paginate, try/catch
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx tsc --noEmit src/lib/notion-events.ts 2>&1 | head -20</automated>
  </verify>
  <done>notion-events.ts exists with EventItem interface and three exported query functions, TypeScript compiles without errors, env var guard prevents crashes when NOTION_EVENTS_DB_ID is unset.</done>
</task>

<task type="auto">
  <name>Task 2: Create /events page and add nav link</name>
  <files>src/app/events/page.tsx, src/components/nav/navigation.tsx</files>
  <action>
**Part A — Create `src/app/events/page.tsx`:**

Create an async Server Component page following the exact layout pattern from `src/app/projects/page.tsx`:

```typescript
import { getUpcomingEvents, getPastEvents } from "@/lib/notion-events";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export const revalidate = 1800;

export const metadata = {
  title: "Events — Monty Singer",
  description: "Upcoming and past events.",
};
```

Page structure:
- Container: `mx-auto max-w-[66ch] px-6 pb-16 pt-24 md:px-0`
- Heading in ScrollReveal: `<h1 className="text-sm font-normal uppercase tracking-widest">Events</h1>`
- Fetch both `getUpcomingEvents()` and `getPastEvents()` with `Promise.all` to avoid waterfall
- If both arrays empty, show empty state: `<p className="mt-8 opacity-50">No events yet.</p>`

Upcoming events section (only if upcoming.length > 0):
- Section heading: `<h2 className="mt-10 text-xs font-normal uppercase tracking-widest opacity-50">Upcoming</h2>`
- Map over upcoming events rendering event cards in a `flex flex-col gap-4 mt-4` container

Past events section (only if past.length > 0):
- Section heading: `<h2 className="mt-10 text-xs font-normal uppercase tracking-widest opacity-50">Past</h2>`
- Same card layout

Each event card (inline, no separate component needed for this scope):
- Wrap in ScrollReveal with staggered delay
- Container: `border border-[var(--border)] rounded-lg p-5`
- Top row: emoji (if present) + event name as `text-base font-medium`
- Second row: formatted date using `new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })` + location, both in `text-sm opacity-50`, separated by a dot or dash
- Description: `text-sm opacity-70 mt-2` (only if description is non-empty)
- Link button (only if event.link): `<a href={event.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm uppercase tracking-wide opacity-50 hover:opacity-100 transition-opacity">RSVP / Details</a>`
- Handle null date gracefully — show "TBD" if date is null

**Part B — Update navigation:**

In `src/components/nav/navigation.tsx`, add Events to the NAV_LINKS array, inserted before Contact:

```typescript
const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '#contact', label: 'Contact' },
]
```
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx tsc --noEmit src/app/events/page.tsx src/components/nav/navigation.tsx 2>&1 | head -20</automated>
  </verify>
  <done>
- /events page renders with upcoming and past sections
- Empty state displays when no events or env vars missing
- Events dates formatted nicely, links open in new tab
- "Events" appears in site navigation between "About" and "Contact"
- TypeScript compiles clean
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Notion API -> Server | External data from Notion database enters the app |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-quick-01 | Spoofing | notion-events.ts | accept | Notion API auth via NOTION_TOKEN; same trust model as existing projects/blog |
| T-quick-02 | Information Disclosure | events/page.tsx | mitigate | Only Published=true events are queried; unpublished events never fetched from API |
| T-quick-03 | Denial of Service | notion-events.ts | mitigate | Rate limiter (pLimit 2) and retry with exponential backoff; same as existing pattern |
</threat_model>

<verification>
1. `npx tsc --noEmit` passes with no errors
2. `npm run build` completes successfully (events page builds as static with ISR)
3. Navigation shows "Events" link on desktop and mobile
4. Without NOTION_EVENTS_DB_ID set, /events shows "No events yet." (no crash)
</verification>

<success_criteria>
- src/lib/notion-events.ts exists with getPublishedEvents, getUpcomingEvents, getPastEvents
- src/app/events/page.tsx renders upcoming/past sections with ISR revalidation
- Navigation includes Events link
- Graceful empty state when env var is missing
- All patterns match existing notion-projects.ts conventions
</success_criteria>

<output>
After completion, create `.planning/quick/260409-lle-add-notion-powered-events-feature-with-e/260409-lle-SUMMARY.md`
</output>
