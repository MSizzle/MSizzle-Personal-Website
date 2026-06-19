"use client";

import { useEffect, useRef } from "react";
import { Canvas, addEffect, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { HeroBlob } from "./hero-blob";
import { HeroPodium } from "./hero-podium";

/** Reads DOM scroll position into a shared ref each frame via addEffect.
 *  Drives camera dolly (z: 4.4 → 5.6) and group scale (1.0 → 0.65)
 *  over the first 30% of page scroll (clamps at p=0.3 to prevent blob disappearing). */
function ScrollCueDriver({
  scrollProgressRef,
  groupRef,
}: {
  scrollProgressRef: React.MutableRefObject<number>;
  groupRef: React.MutableRefObject<THREE.Group | null>;
}) {
  useFrame(({ camera }) => {
    const raw = scrollProgressRef.current;
    // Clamp to first 30% of scroll so blob doesn't fully disappear
    const p = Math.min(raw / 0.3, 1.0);
    // Camera dolly: 4.4 → 5.6 (pull back as user scrolls)
    camera.position.z = 4.4 + p * 1.2;
    // Group scale: 1.0 → 0.65
    if (groupRef.current) {
      const s = 1.0 - p * 0.35;
      groupRef.current.scale.setScalar(s);
    }
  });
  return null;
}

export default function HeroBlobCanvas() {
  const scrollProgressRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  // Register addEffect to read DOM scroll position each R3F frame
  useEffect(() => {
    const cleanup = addEffect(() => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollProgressRef.current = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    });
    return cleanup;
  }, []);

  return (
    <div
      data-testid="hero-canvas-container"
      style={{ position: "absolute", inset: 0 }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 42, position: [0, 0, 4.4] as [number, number, number], near: 0.1, far: 100 }}
        style={{ position: "absolute", inset: 0 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ScrollCueDriver scrollProgressRef={scrollProgressRef} groupRef={groupRef} />
        <group ref={groupRef}>
          <HeroBlob />
          <HeroPodium />
        </group>
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
    </div>
  );
}
