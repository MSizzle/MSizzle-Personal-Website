import { describe, it, expect } from "vitest";

describe("GSAP setup (HOME-03)", () => {
  it("gsap module is importable", async () => {
    const gsap = await import("gsap");
    expect(gsap.default).toBeDefined();
    expect(typeof gsap.default.to).toBe("function");
  });

  it("ScrollTrigger plugin is importable", async () => {
    const { default: ScrollTrigger } = await import("gsap/ScrollTrigger");
    expect(ScrollTrigger).toBeDefined();
  });

  it("@gsap/react useGSAP hook is importable", async () => {
    const { useGSAP } = await import("@gsap/react");
    expect(useGSAP).toBeDefined();
    expect(typeof useGSAP).toBe("function");
  });
});
