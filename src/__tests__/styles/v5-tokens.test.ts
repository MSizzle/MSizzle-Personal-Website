import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// globals.css is NOT loaded into the jsdom test environment, so this is a
// source-text regression guard (not a getComputedStyle assertion), following
// the nav-reachability.test.ts convention.
const rawCss = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf-8");
// Strip comments first so prose mentioning old hex values or the ratio list
// cannot satisfy -- or accidentally break -- a match. The token block's own
// lead comment documents every hex value and the WCAG ratio list, and would
// otherwise trivially satisfy every assertion below.
const css = rawCss.replace(/\/\*[\s\S]*?\*\//g, "");

// ── WCAG contrast helper, inlined per plan (not a shipped util) ────────────
function srgbChannelToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b)
  );
}

function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

const BONE = "#F5F2EB";

// Locked accent palette, ordered 0..9 -- the executable copy of the locked
// spec, so a future "slight" palette tweak cannot pass silently.
const EXPECTED_ACCENTS: { hex: string; ratio: number }[] = [
  { hex: "#6B1F2B", ratio: 10.12 },
  { hex: "#185661", ratio: 7.39 },
  { hex: "#8E6214", ratio: 4.81 },
  { hex: "#2A3A6B", ratio: 9.8 },
  { hex: "#1E4D3C", ratio: 8.61 },
  { hex: "#4A2547", ratio: 11.41 },
  { hex: "#14524F", ratio: 7.99 },
  { hex: "#7A5230", ratio: 6.1 },
  { hex: "#17395B", ratio: 10.6 },
  { hex: "#55632F", ratio: 5.85 },
];

describe("v5 token identity (D-V5-01)", () => {
  it("@theme inline declares the four core v5 surface/ink tokens", () => {
    const theme = (css.match(/@theme inline\s*\{[\s\S]*?\n\}/) || [""])[0];
    expect(theme).toMatch(/--color-bg:\s*#F5F2EB/i);
    expect(theme).toMatch(/--color-text:\s*#111111/i);
    expect(theme).toMatch(/--color-invert:\s*#111111/i);
    expect(theme).toMatch(/--color-text-inverse:\s*#F5F2EB/i);
  });
});

describe("v5 token derivation (D-V5-01)", () => {
  it("derived text/border tokens are built on rgba(17,17,17,*) and carry zero rgba(0,0,0,*)", () => {
    const theme = (css.match(/@theme inline\s*\{[\s\S]*?\n\}/) || [""])[0];
    const derived = ["--color-text-dim", "--color-text-muted", "--color-border", "--color-border-strong"];
    for (const token of derived) {
      const match = theme.match(new RegExp(`${token}:\\s*([^;]+);`));
      expect(match, `expected ${token} to be declared in @theme inline`).not.toBeNull();
      const value = match![1];
      expect(value).toMatch(/rgba\(\s*17,\s*17,\s*17,/);
      expect(value).not.toMatch(/rgba\(\s*0,\s*0,\s*0,/);
    }
  });
});

describe("v5 accent palette presence and order (D-V5-02)", () => {
  it("declares exactly ten --ac-N tokens, indices 0..9 ascending, matching the locked hex list", () => {
    const matches = [...css.matchAll(/--ac-(\d+):\s*(#[0-9a-fA-F]{6})/g)];
    expect(matches).toHaveLength(10);
    matches.forEach((m, i) => {
      expect(Number(m[1])).toBe(i);
      expect(m[2].toLowerCase()).toBe(EXPECTED_ACCENTS[i].hex.toLowerCase());
    });
  });
});

describe("Ochre darkening guard (D-V5-08)", () => {
  it("--ac-2 is #8E6214 and the failing #9A6A16 hex appears nowhere in the comment-stripped CSS", () => {
    expect(css).toMatch(/--ac-2:\s*#8E6214/i);
    expect(css).not.toMatch(/9A6A16/i);
  });
});

describe("WCAG AA contrast proof (D-V5-08)", () => {
  it("every one of the ten accent fills clears AA 4.5:1 against bone and matches the locked ratio", () => {
    for (const { hex, ratio } of EXPECTED_ACCENTS) {
      const computed = contrastRatio(BONE, hex);
      expect(computed).toBeGreaterThanOrEqual(4.5);
      expect(Number(computed.toFixed(2))).toBeCloseTo(ratio, 2);
    }
  });
});

describe("muted-text legibility (D-07)", () => {
  it("the rgba(17,17,17,0.60) composite over bone clears 4.5:1 for normal text", () => {
    const ink = { r: 0x11, g: 0x11, b: 0x11 };
    const bone = { r: 0xf5, g: 0xf2, b: 0xeb };
    const alpha = 0.6;
    const composite = {
      r: Math.round(ink.r * alpha + bone.r * (1 - alpha)),
      g: Math.round(ink.g * alpha + bone.g * (1 - alpha)),
      b: Math.round(ink.b * alpha + bone.b * (1 - alpha)),
    };
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    const compositeHex = `#${toHex(composite.r)}${toHex(composite.g)}${toHex(composite.b)}`;
    expect(contrastRatio(BONE, compositeHex)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("rest-state guard (D-V5-03)", () => {
  // Updated by 21.5-02: the rotation mechanism now wires --ac into the two
  // row ::before fills. Those fills sit at opacity: 0 at rest and are only
  // revealed via :hover / :focus-visible, so the invariant becomes "exactly
  // these two references exist, and nothing else in globals.css touches
  // --ac" rather than "zero references anywhere" (true only for 21.5-01).
  it("the only --ac references in globals.css are the two row ::before fallback fills", () => {
    const hits = css.match(/var\(--ac/g) || [];
    expect(hits).toHaveLength(2);

    const aRowBefore = css.match(/\.a-row::before\s*\{([^}]*)\}/);
    const ePostBefore = css.match(/\.e-post::before\s*\{([^}]*)\}/);
    expect(aRowBefore).not.toBeNull();
    expect(ePostBefore).not.toBeNull();
    expect(aRowBefore![1]).toMatch(/background:\s*var\(--ac,\s*var\(--color-invert\)\)/);
    expect(ePostBefore![1]).toMatch(/background:\s*var\(--ac,\s*var\(--color-invert\)\)/);

    const withoutFills = css
      .replace(/\.a-row::before\s*\{[^}]*\}/, "")
      .replace(/\.e-post::before\s*\{[^}]*\}/, "");
    expect(withoutFills).not.toMatch(/var\(--ac/);
  });
});

describe("chrome exception guard (D-V5-06)", () => {
  it(".prometheus-link never references an accent token", () => {
    // Capture the rule BODY only (group 1) -- ".nav-cell--active" itself
    // contains the literal substring "--ac", so matching the whole rule
    // (selector included) would produce a false positive.
    const match = css.match(/\.prometheus-link\s*\{([^}]*)\}/);
    expect(match).not.toBeNull();
    expect(match![1]).not.toMatch(/--ac/);
  });

  it(".nav-cell--active never references an accent token", () => {
    const match = css.match(/\.nav-cell--active\s*\{([^}]*)\}/);
    expect(match).not.toBeNull();
    expect(match![1]).not.toMatch(/--ac/);
  });
});

describe("MO-05 preservation", () => {
  it("the retheme did not sneak a gradient back in", () => {
    expect(css).not.toMatch(/gradient\(/);
  });
});

describe("quick task 260916-lqq regression guard", () => {
  it("body declares no overflow-x (an overflow-x:hidden body stops propagating to the viewport and kills position: sticky)", () => {
    // Bare `body { ... }` rules only -- excludes `body.no-motion { ... }`,
    // which is a different, unrelated selector.
    const bodyRules = [...css.matchAll(/(?<![.\w-])body\s*\{[^}]*\}/g)];
    expect(bodyRules.length).toBeGreaterThan(0);
    for (const rule of bodyRules) {
      expect(rule[0]).not.toMatch(/overflow-x/);
    }
  });

  it("html keeps its own overflow-x: hidden", () => {
    const htmlRules = [...css.matchAll(/(?<![.\w-])html\s*\{[^}]*\}/g)];
    expect(htmlRules.length).toBeGreaterThan(0);
    const combined = htmlRules.map((r) => r[0]).join("\n");
    expect(combined).toMatch(/overflow-x:\s*hidden/);
  });
});

describe("out-of-scope guard (D-V5-11)", () => {
  it(".pb-frame--cream still exists, proving the pinboard block was not swept in this plan", () => {
    expect(css).toMatch(/\.pb-frame--cream\s*\{[^}]*background:\s*#ffffff[^}]*\}/i);
  });
});
