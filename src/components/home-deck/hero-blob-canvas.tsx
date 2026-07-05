"use client";

import { Canvas } from "@react-three/fiber";
import { HeroBlob } from "./hero-blob";

export default function HeroBlobCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, position: [0, 0, 4.4] as [number, number, number], near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <HeroBlob />
      <directionalLight color={0xffffff} intensity={1.9} position={[3, 4, 5]} />
      <directionalLight color={0xff6a3a} intensity={1.7} position={[-4, -2, -4]} />
      <directionalLight color={0xffffff} intensity={0.45} position={[-3, 2, 3]} />
      <ambientLight color={0x1a0a06} intensity={0.5} />
    </Canvas>
  );
}
