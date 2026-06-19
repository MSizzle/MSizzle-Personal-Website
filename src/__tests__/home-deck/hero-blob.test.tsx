import { describe, it, expect, vi } from "vitest";
import { create } from "@react-three/test-renderer";

// Mock RoomEnvironment to avoid WebGL dependency
vi.mock("three/examples/jsm/environments/RoomEnvironment.js", () => ({
  RoomEnvironment: class {
    constructor() {}
  },
}));

// Mock PMREMGenerator to avoid WebGL dependency
vi.mock("three", async () => {
  const actual = await vi.importActual<typeof import("three")>("three");
  return {
    ...actual,
    PMREMGenerator: class {
      constructor(_renderer: unknown) {}
      fromScene(_scene: unknown) {
        return { texture: {} };
      }
      dispose() {}
    },
  };
});

describe("HeroBlob R3F scene (TD-01)", () => {
  it("renders scene graph without crash (no WebGL required)", async () => {
    const { HeroBlob } = await import("@/components/home-deck/hero-blob");
    const renderer = await create(<HeroBlob />);
    expect(renderer.scene.children.length).toBeGreaterThan(0);
  });
});
