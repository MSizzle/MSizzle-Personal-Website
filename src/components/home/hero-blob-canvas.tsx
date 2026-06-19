"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { HeroBlob } from "./hero-blob";
import { HeroPodium } from "./hero-podium";

export default function HeroBlobCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, position: [0, 0, 4.4] as [number, number, number], near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <HeroBlob />
      <HeroPodium />
      {/* Key light */}
      <directionalLight color={0xffffff} intensity={1.9} position={[3, 4, 5]} />
      {/* Crimson rim light — intensity 2.2 pushes luminance above Bloom's 0.85 threshold */}
      <directionalLight color={0xe23838} intensity={2.2} position={[-4, -2, -4]} />
      {/* Fill light */}
      <directionalLight color={0xffffff} intensity={0.45} position={[-3, 2, 3]} />
      <ambientLight color={0x1a0a06} intensity={0.5} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.9} intensity={0.6} radius={0.4} />
      </EffectComposer>
    </Canvas>
  );
}
