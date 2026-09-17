import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ACCENT_COUNT, accentVar, accentStyle } from "@/lib/accent-rotation";

describe("accentVar", () => {
  it("accentVar(0) is 'var(--ac-0)'", () => {
    expect(accentVar(0)).toBe("var(--ac-0)");
  });

  it("accentVar(9) is 'var(--ac-9)'", () => {
    expect(accentVar(9)).toBe("var(--ac-9)");
  });

  it("accentVar(10) wraps to 'var(--ac-0)'", () => {
    expect(accentVar(10)).toBe("var(--ac-0)");
  });

  it("accentVar(13) is 'var(--ac-3)'", () => {
    expect(accentVar(13)).toBe("var(--ac-3)");
  });

  it("accentVar(-1) is 'var(--ac-9)', never the malformed 'var(--ac--1)'", () => {
    expect(accentVar(-1)).toBe("var(--ac-9)");
  });
});

describe("accentStyle", () => {
  it("accentStyle(4) returns an object whose --ac key is 'var(--ac-4)'", () => {
    const style = accentStyle(4) as Record<string, string>;
    expect(style["--ac"]).toBe("var(--ac-4)");
  });
});

describe("ACCENT_COUNT", () => {
  it("is 10 and matches the number of --ac-N tokens declared in globals.css", () => {
    expect(ACCENT_COUNT).toBe(10);
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf-8"
    ).replace(/\/\*[\s\S]*?\*\//g, "");
    const matches = [...css.matchAll(/--ac-\d+:\s*#[0-9a-fA-F]{6}/g)];
    expect(matches).toHaveLength(ACCENT_COUNT);
  });
});
