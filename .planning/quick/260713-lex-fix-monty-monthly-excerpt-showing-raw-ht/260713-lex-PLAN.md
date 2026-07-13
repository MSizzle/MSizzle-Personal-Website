---
phase: quick-260713-lex
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/rss/substack.ts
  - src/__tests__/seo/rss-parser.test.ts
autonomous: true
requirements: [QUICK-260713-lex]

must_haves:
  truths:
    - "Monty Monthly carousel excerpts show real punctuation for named entities (e.g. the source text \"I&rsquo;m\" renders as \"I'm\", not \"I m\" or \"I&rsquo;m\")"
    - "Monty Monthly carousel excerpts show real punctuation for numeric decimal entities (e.g. \"I&#8217;m\" renders as \"I'm\", not the literal string \"&#8217;\")"
    - "Monty Monthly carousel excerpts show real punctuation for numeric hex entities (e.g. \"I&#x2019;m\" renders as \"I'm\")"
    - "An unrecognized named entity in source HTML degrades to a single space rather than leaking raw markup into the excerpt"
  artifacts:
    - path: "src/lib/rss/substack.ts"
      provides: "decodeHtmlEntities(str) exported pure function: decodes named entities (amp, lt, gt, quot, apos, nbsp, hellip, mdash, ndash, rsquo, lsquo, rdquo, ldquo), decimal numeric entities (&#NNNN;), and hex numeric entities (&#xHHHH;); unknown named entities fall back to a space"
    - path: "src/__tests__/seo/rss-parser.test.ts"
      provides: "Unit tests for decodeHtmlEntities covering every named entity in the list, decimal numeric, hex numeric, and unknown-entity fallback"
  key_links:
    - from: "extractDescription"
      to: "decodeHtmlEntities"
      via: "direct function call on the tag-stripped HTML string, applied BEFORE the whitespace-collapse regex"
      pattern: "decodeHtmlEntities\\("
---

<objective>
Fix the Monty Monthly carousel excerpt (`extractDescription` in `src/lib/rss/substack.ts`) leaking raw HTML entities like `&#8217;` into visible copy, and collapsing named entities like `&rsquo;` into a bare space (turning "I'm" into "I m").

Add a `decodeHtmlEntities` helper that decodes numeric entities (decimal `&#8217;` and hex `&#x2019;`) via `String.fromCodePoint`, decodes a fixed set of common named entities (`&amp; &lt; &gt; &quot; &apos; &nbsp; &hellip; &mdash; &ndash; &rsquo; &lsquo; &rdquo; &ldquo;`) to their real characters, and falls back to a space for any other named entity it doesn't recognize. Wire it into `extractDescription` so decoding happens on the tag-stripped string BEFORE the whitespace-collapse step (order matters: decoding first prevents "&nbsp;&nbsp;" runs from collapsing incorrectly and ensures decoded punctuation isn't itself stripped).

Purpose: Substack issue bodies routinely contain smart quotes, em dashes, and apostrophes encoded as HTML entities. The current implementation only strips tags and blindly space-replaces every `&word;` pattern, so real punctuation either leaks through as literal entity text or gets mangled into a stray space. This is user-visible on the homepage Monty Monthly carousel.
Output: `decodeHtmlEntities` exported from `src/lib/rss/substack.ts`, used by `extractDescription`, covered by unit tests.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md
</context>

<interfaces>
Current `extractDescription` in src/lib/rss/substack.ts (lines 20-31), to be modified:

```typescript
function extractDescription(item: CustomItem): string {
  const html = item['content:encoded']
  if (!html) return ''
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= 200) return text
  return text.slice(0, 200).replace(/\s+\S*$/, '') + '…'
}
```

The `.replace(/&[a-z]+;/gi, ' ')` line is the bug: it never handles numeric entities (`&#8217;`, `&#x2019;` pass through untouched as literal text), and it blindly space-replaces every named entity instead of decoding known ones first.

Existing test file structure (src/__tests__/seo/rss-parser.test.ts) mocks `rss-parser` and imports from `@/lib/rss/substack`. Follow the existing `describe`/`it` style; add a new top-level `describe('decodeHtmlEntities', ...)` block rather than modifying the existing `fetchMontyMonthlyIssues` describe block.
</interfaces>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Add decodeHtmlEntities, wire into extractDescription, add tests</name>
  <files>src/lib/rss/substack.ts, src/__tests__/seo/rss-parser.test.ts</files>
  <behavior>
    decodeHtmlEntities(str: string): string — pure function, no side effects.
    - Named entities decode to real characters: `&amp;` -> `&`, `&lt;` -> `<`, `&gt;` -> `>`, `&quot;` -> `"`, `&apos;` -> `'`, `&nbsp;` -> ` ` (space), `&hellip;` -> `…`, `&mdash;` -> `—`, `&ndash;` -> `–`, `&rsquo;` -> `'` (U+2019), `&lsquo;` -> `'` (U+2018), `&rdquo;` -> `"` (U+201D), `&ldquo;` -> `"` (U+201C).
    - Matching is case-insensitive on the entity name (e.g. `&AMP;` also decodes).
    - Decimal numeric entities decode via code point: `&#8217;` -> `'` (U+2019).
    - Hex numeric entities decode via code point: `&#x2019;` -> `'` (U+2019), case-insensitive hex digits (`&#X2019;` also works).
    - A named entity not in the known list falls back to a single space: `&foobar;` -> ` `.
    - Mixed input decodes correctly in place: `I&#8217;m happy &mdash; really!` -> `I'm happy — really!` (apostrophe here is U+2019, not ASCII).
    - Plain text with no entities passes through unchanged.
  </behavior>
  <action>
In src/lib/rss/substack.ts, add a new exported function `decodeHtmlEntities(str: string): string` above `extractDescription`. Implement it as a chain of three `.replace()` calls in this order: (1) hex numeric entities matching `/&#x([0-9a-f]+);/gi`, replacing via `String.fromCodePoint(parseInt(hex, 16))`; (2) decimal numeric entities matching `/&#(\d+);/g`, replacing via `String.fromCodePoint(parseInt(dec, 10))`; (3) named entities matching `/&([a-z]+);/gi`, looking up the captured name (lowercased) in a local `Record<string, string>` map containing exactly the pairs listed in the behavior block above, falling back to `' '` when the name isn't in the map. Order matters: numeric entities must be decoded before the named-entity pass so a decoded `&` character (e.g. from `&amp;` decoding is fine since that's step 3, but numeric decoding producing a literal `&` character in the output must not be re-matched by the named-entity regex — decoding numeric first avoids this since numeric entities never produce the literal three-character sequence `&#`).

Then modify `extractDescription` so the tag-stripped HTML is passed through `decodeHtmlEntities` before the whitespace-collapse step. Replace the existing `.replace(/&[a-z]+;/gi, ' ')` line: the new pipeline is `html.replace(/<[^>]+>/g, ' ')` piped into `decodeHtmlEntities(...)`, then `.replace(/\s+/g, ' ').trim()` as before. Keep the 200-char truncation and ellipsis logic at the end unchanged.

In src/__tests__/seo/rss-parser.test.ts, add `import { decodeHtmlEntities } from '@/lib/rss/substack'` at the top alongside the existing imports, and add a new `describe('decodeHtmlEntities', () => { ... })` block (separate from the existing `describe('fetchMontyMonthlyIssues', ...)` block) with one `it` per behavior case listed above: each of the 13 named entities, decimal numeric, hex numeric (including uppercase X and uppercase hex digits), unknown-entity fallback, the mixed "I'm happy — really!" case, and a no-entities passthrough case.
  </action>
  <verify>
    <automated>cd "/Users/Montster/MSizzle Personal Website" && npx vitest run src/__tests__/seo/rss-parser.test.ts</automated>
  </verify>
  <done>All tests in src/__tests__/seo/rss-parser.test.ts pass, including the new decodeHtmlEntities describe block. decodeHtmlEntities is exported from src/lib/rss/substack.ts and extractDescription calls it before whitespace collapse.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|--------------|
| Substack RSS feed -> extractDescription | Externally-hosted content (Substack) is parsed and rendered into the homepage carousel. `decodeHtmlEntities` only transforms already-tag-stripped text (all `<...>` markup is removed first by the existing regex before this function runs), so it cannot reintroduce executable markup. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-------------------|
| T-260713lex-01 | Tampering | decodeHtmlEntities numeric entity decode | accept | `String.fromCodePoint` on attacker-controlled numeric input can only ever produce a single Unicode character, never markup; the surrounding tag-strip regex already runs first, so there is no path from a decoded entity back into an `<script>`-style payload. |
| T-260713lex-02 | Denial of Service | decodeHtmlEntities regex chain | accept | Fixed feed content (max 10 items, bounded by upstream RSS size); no catastrophic-backtracking pattern (`&#x([0-9a-f]+);` etc. are linear, non-nested groups). |
</threat_model>

<verification>
1. `npx vitest run src/__tests__/seo/rss-parser.test.ts` passes with the new decodeHtmlEntities tests green.
2. `npx vitest run` (full suite) still passes — confirms no regression to the existing fetchMontyMonthlyIssues tests.
3. Manual spot-check (optional): a Substack issue body containing `I&#8217;m` or `&mdash;` in `content:encoded` now produces a real apostrophe/dash in the carousel excerpt instead of literal entity text or a stray space.
</verification>

<success_criteria>
- `decodeHtmlEntities` is exported from src/lib/rss/substack.ts and covers all 13 named entities plus decimal and hex numeric entities, falling back to a space for unrecognized named entities.
- `extractDescription` decodes entities before collapsing whitespace, so decoded punctuation is preserved rather than accidentally re-collapsed.
- No raw `&#NNNN;` or `&#xHHHH;` sequences, and no mangled "I m"-style gaps, appear in Monty Monthly carousel excerpts sourced from entity-bearing Substack content.
- `npx vitest run` passes with zero failures.
</success_criteria>

<output>
Create `.planning/quick/260713-lex-fix-monty-monthly-excerpt-showing-raw-ht/260713-lex-SUMMARY.md` when done.
</output>
