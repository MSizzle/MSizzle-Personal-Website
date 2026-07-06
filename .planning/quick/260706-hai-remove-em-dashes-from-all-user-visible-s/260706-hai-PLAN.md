---
phase: quick/260706-remove-em-dashes
plan: 01
type: auto
wave: 1
depends_on: []
files_modified:
  - src/app/about/page.tsx
  - src/app/projects/page.tsx
  - src/lib/uses.ts
  - src/lib/photos.ts
autonomous: true
requirements: []
user_setup: []

must_haves:
  truths:
    - User-visible copy contains no em dashes (—) anywhere
    - All rewritten sentences read naturally without dashes
    - No replacements with "--" or hyphens; restructure instead
    - Code comments remain unchanged (not edited)
  artifacts:
    - path: src/app/about/page.tsx
      provides: "About page metadata (description) and visible prose"
      contains: "Monty Singer: builder, writer..."
    - path: src/app/projects/page.tsx
      provides: "Projects page metadata and visible subheading"
      contains: "is building or has built through Prometheus..."
    - path: src/lib/uses.ts
      provides: "Uses page item descriptions"
      contains: "Cursor AI (VS Code...)" and "Notion for notes..."
    - path: src/lib/photos.ts
      provides: "Photo gallery alt text"
      contains: "Film negative: a year in motion"
  key_links:
    - from: src/app/about/page.tsx
      to: src/app/layout.tsx
      via: "metadata export consumed by layout"
      pattern: "export.*metadata"
    - from: src/lib/uses.ts
      to: src/app/uses/page.tsx
      via: "items array rendered in page"
      pattern: "import.*uses"
---

<objective>
Remove em dashes (—) from ALL user-visible site copy per site owner direction. Em dashes read as an "AI-writing tell" and are not welcome anywhere in visible text. Rewrite each sentence to read naturally without the dash: use colons, commas, parentheses, or drop the phrase entirely.

Purpose: Site brand consistency and human voice
Output: Four edited files with em dashes removed from user-visible strings only
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
.planning/STATE.md
./CLAUDE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove em dashes from user-visible copy</name>
  <files>src/app/about/page.tsx, src/app/projects/page.tsx, src/lib/uses.ts, src/lib/photos.ts</files>
  <action>
Apply the exhaustive list of 9 em dash removals verified by grep:

1. src/app/about/page.tsx lines 10, 15 (metadata description): Change "Monty Singer — builder, writer, Founder of Prometheus." → "Monty Singer: builder, writer, Founder of Prometheus." (use colon)

2. src/app/about/page.tsx line 41 (visible prose): Change "A startup that AI-enables enterprise businesses — automating processes..." → "A startup that AI-enables enterprise businesses: automating processes..." (use colon)

3. src/app/projects/page.tsx lines 14, 19 (metadata description): Change "...is building or has built — through Prometheus and independent work." → "...is building or has built through Prometheus and independent work." (drop the dash and preceding phrase)

4. src/app/projects/page.tsx line 68 (visible subheading, first person): Same edit as #3

5. src/lib/uses.ts line 26: Change "Cursor AI — VS Code with native AI editing" → "Cursor AI (VS Code with native AI editing)" (use parens to match existing style in the file)

6. src/lib/uses.ts line 28: Change "GSD (Get Shit Done) — AI-native project planning system" → "GSD (Get Shit Done), an AI-native project planning system" (use comma + "an")

7. src/lib/uses.ts line 34: Change "Notion — notes, projects, writing, and content pipeline" → "Notion for notes, projects, writing, and the content pipeline" (use "for")

8. src/lib/uses.ts line 42: Change "Gmail — primary inbox" → "Gmail as primary inbox" (use "as")

9. src/lib/photos.ts line 29 (alt text): Change "Film negative — a year in motion" → "Film negative: a year in motion" (use colon)

Match the natural, plain phrasing style already present in the file (e.g., "Claude (Anthropic) for code, thinking, and research" and "Git + GitHub for all projects"). Rewrites must read smoothly—no awkward constructions.

After all edits, run npm test. Three pre-existing vitest failures (explorative-homepage ×2, section-building ×1) must remain unchanged. If any test asserts on the old copy strings, update those assertions to match the new rewrites in the same commit.
  </action>
  <verify>
    <automated>grep -n '—' src/app/about/page.tsx src/app/projects/page.tsx src/lib/uses.ts src/lib/photos.ts 2>&1 | wc -l</automated>
  </verify>
  <done>All em dashes removed from user-visible strings in the four files. All sentences read naturally. npm test passes with the same three pre-existing failures. Single atomic commit: fix(copy): remove em dashes from user-visible copy</done>
</task>

</tasks>

<threat_model>
No security implications for this task.
</threat_model>

<verification>
After the task completes:
1. Grep confirms zero em dashes remain in the four files (grep output line count is 0 or shows no matches)
2. npm test passes with no new failures (three pre-existing vitest failures remain)
3. All rewritten sentences are verified to read naturally (visual spot-check against the "before" list in task details)
4. One atomic commit created with message "fix(copy): remove em dashes from user-visible copy"
</verification>

<success_criteria>
- No em dashes (—) remain in any user-visible string in the four files
- All rewrites read naturally and match the plain phrasing style already in the codebase
- No replacements with "--" or hyphens anywhere
- Code comments unchanged
- npm test passes (same three pre-existing failures)
- Single atomic commit on main
</success_criteria>

<output>
After task completion, create: .planning/quick/260706-hai-remove-em-dashes-from-all-user-visible-s/260706-hai-SUMMARY.md
</output>
