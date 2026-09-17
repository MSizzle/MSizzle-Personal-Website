import type { CSSProperties } from "react";

/**
 * Maps a document-order row index to one of the ten rotating accent tokens
 * declared on `:root` in `src/app/globals.css` (`--ac-0` .. `--ac-9`, D-V5-02).
 *
 * This module deliberately contains no hex value -- the palette itself lives
 * entirely in globals.css. This module only *names* it. `ACCENT_COUNT` must
 * stay in sync with the number of `--ac-N` tokens declared there; if the
 * palette ever grows or shrinks, update both together (guarded by
 * `src/__tests__/styles/v5-tokens.test.ts`, which asserts exactly ten).
 *
 * No React runtime dependency beyond the `CSSProperties` type (imported
 * type-only so nothing here pulls React in at runtime) and no side effects,
 * so this stays safe to import from a Server Component (D-V5-09).
 */
export const ACCENT_COUNT = 10;

/**
 * "var(--ac-N)" for the given document-order index, wrapping every
 * ACCENT_COUNT. Uses the double-modulo form so a negative index cannot
 * produce a malformed custom property name (a bare `%` on a negative number
 * in JS returns a negative remainder, e.g. -1 % 10 === -1, which would emit
 * the invalid "var(--ac--1)").
 */
export function accentVar(index: number): string {
  const wrapped = ((index % ACCENT_COUNT) + ACCENT_COUNT) % ACCENT_COUNT;
  return `var(--ac-${wrapped})`;
}

/**
 * Inline style object setting the row's own `--ac` custom property. Cast to
 * `CSSProperties` because TypeScript's DOM typings reject arbitrary custom
 * property keys without it.
 */
export function accentStyle(index: number): CSSProperties {
  return { "--ac": accentVar(index) } as CSSProperties;
}
