"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export function HeroBlob() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);
  const tRef = useRef(0);

  // Blob geometry: IcosahedronGeometry(1.3, 12)
  const blobGeo = useMemo(() => new THREE.IcosahedronGeometry(1.3, 12), []);

  // Base positions: Float32Array slice taken once on mount
  const basePositions = useMemo(
    () => new Float32Array(blobGeo.attributes.position.array),
    [blobGeo]
  );

  // Wire overlay geometry: IcosahedronGeometry(1.35, 2)
  const wireGeo = useMemo(() => new THREE.IcosahedronGeometry(1.35, 2), []);

  // IBL setup: RoomEnvironment + PMREMGenerator (one-time, no external HDR file)
  const { gl, scene } = useThree();
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment()).texture;
    scene.environment = envMap;
    pmrem.dispose();
  }, [gl, scene]);

  // Per-frame morph loop + autonomous rotation
  useFrame(() => {
    tRef.current += 0.006;
    const t = tRef.current;

    // Sine-sum vertex displacement (port of initBlob lines 90-98)
    const pos = blobGeo.attributes.position as THREE.BufferAttribute;
    const base = basePositions;

    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const bx = base[ix];
      const by = base[ix + 1];
      const bz = base[ix + 2];
      const l = Math.hypot(bx, by, bz) || 1;
      const n =
        Math.sin(bx * 2 + t * 1.6) +
        Math.sin(by * 2.3 + t * 1.2) +
        Math.sin(bz * 2.1 + t * 1.9);
      const d = 1.3 + n * 0.11;
      (pos.array as Float32Array)[ix] = (bx / l) * d;
      (pos.array as Float32Array)[ix + 1] = (by / l) * d;
      (pos.array as Float32Array)[ix + 2] = (bz / l) * d;
    }

    pos.needsUpdate = true;
    blobGeo.computeVertexNormals();

    // Autonomous rotation (prototype line 100)
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0035;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.22;
    }

    // Wire counter-rotation
    if (wireRef.current) {
      wireRef.current.rotation.y -= 0.0018;
      wireRef.current.rotation.z += 0.001;
    }
  });

  return (
    <>
      <mesh ref={meshRef} geometry={blobGeo}>
        <meshPhysicalMaterial
          color={0x140805}
          metalness={0.6}
          roughness={0.18}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh ref={wireRef} geometry={wireGeo}>
        <meshBasicMaterial wireframe transparent opacity={0.16} color={0x333333} />
      </mesh>
    </>
  );
}
