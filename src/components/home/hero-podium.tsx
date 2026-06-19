"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * HeroPodium — thin reflective disc beneath the hero blob (D-08).
 * Simple CylinderGeometry. MeshStandardMaterial with faint crimson emissive.
 */
export function HeroPodium() {
  const geo = useMemo(() => new THREE.CylinderGeometry(1.6, 1.6, 0.06, 64), []);

  return (
    <mesh geometry={geo} position={[0, -1.55, 0]}>
      <meshStandardMaterial
        color={0x141414}
        metalness={0.8}
        roughness={0.1}
        emissive={0xe23838}
        emissiveIntensity={0.04}
      />
    </mesh>
  );
}
