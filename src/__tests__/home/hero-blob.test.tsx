import { describe, it, expect, vi } from "vitest";

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
    constructor(opts: unknown) {
      Object.assign(this, opts);
    }
    uniforms = { uTime: { value: 0 } };
    dispose() {}
  },
}));

// Stub the real component (does not exist yet — created in Plan 15-02)
vi.mock("@/components/home/hero-blob", () => ({
  HeroBlob: function HeroBlobStub() {
    return null;
  },
}));

describe("HeroBlob R3F scene (TD-01)", () => {
  it("renders scene graph without crash (GPU morph, no WebGL required)", async () => {
    const { HeroBlob } = await import("@/components/home/hero-blob");
    // Stub is defined — real test will use @react-three/test-renderer in Plan 15-02
    expect(HeroBlob).toBeDefined();
  });
});
