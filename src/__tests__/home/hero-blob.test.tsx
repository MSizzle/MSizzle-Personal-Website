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

// Mock CSM — three-custom-shader-material/vanilla has no WebGL dep, but we stub
// to avoid the ES-module interop issues in Vitest's jsdom environment
vi.mock("three-custom-shader-material/vanilla", () => ({
  default: class CustomShaderMaterial {
    uniforms = { uTime: { value: 0 } };
    constructor(opts: unknown) {
      Object.assign(this, opts);
    }
    dispose() {}
  },
}));

describe("HeroBlob R3F scene (TD-01)", () => {
  it("renders scene graph without crash (GPU morph, no WebGL required)", async () => {
    const { HeroBlob } = await import("@/components/home/hero-blob");
    const renderer = await create(<HeroBlob />);
    expect(renderer.scene.children.length).toBeGreaterThan(0);
  });
});
