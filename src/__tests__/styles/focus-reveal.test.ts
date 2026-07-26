import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// globals.css is NOT loaded into the jsdom test environment, so this is a
// source-text regression guard (not a getComputedStyle assertion) for the
// :focus-within reveal rules added by quick task 260726-kjp (WCAG 2.4.7).
const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf-8')

describe('keyboard focus reveal (260726-kjp)', () => {
  it('.stickynav reveals on :focus-within in addition to .show', () => {
    expect(css).toMatch(
      /\.stickynav\.show\s*,\s*\.stickynav:focus-within\s*\{\s*transform:\s*translateY\(0\)/
    )
  })

  it('.mobile-header-gate reveals on :focus-within in addition to .show', () => {
    expect(css).toMatch(
      /\.mobile-header-gate\.show\s*,\s*\.mobile-header-gate:focus-within\s*\{\s*transform:\s*translateY\(0\)/
    )
  })
})
