import { describe, it, expect, vi } from "vitest";

vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => ({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})));

// ---------------------------------------------------------------------------
// Tests for detectDeckMode() — the touch/small-screen detection utility
// HD-05: Touch / small screens → showDeck=false (no wheel controller)
// ---------------------------------------------------------------------------
describe("touch/small-screen detection (HD-05)", () => {
  it("returns showDeck=false when pointer: coarse matches (touch device)", async () => {
    const { detectDeckMode } = await import(
      "@/components/home-deck/deck-controller"
    );
    const { showDeck } = detectDeckMode({ matchesCoarse: true, innerWidth: 1440 });
    expect(showDeck).toBe(false);
  });

  it("returns showDeck=false when innerWidth < 760 (small screen)", async () => {
    const { detectDeckMode } = await import(
      "@/components/home-deck/deck-controller"
    );
    const { showDeck } = detectDeckMode({ matchesCoarse: false, innerWidth: 500 });
    expect(showDeck).toBe(false);
  });

  it("returns showDeck=true when not coarse and wide screen", async () => {
    const { detectDeckMode } = await import(
      "@/components/home-deck/deck-controller"
    );
    const { showDeck } = detectDeckMode({ matchesCoarse: false, innerWidth: 1440 });
    expect(showDeck).toBe(true);
  });
});
