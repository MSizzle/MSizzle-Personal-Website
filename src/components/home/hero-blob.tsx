"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

const BLOB_VERT = /* glsl */`
  uniform float uTime;

  float sineDisplace(vec3 p) {
    return sin(p.x * 2.0 + uTime * 1.6)
         + sin(p.y * 2.3 + uTime * 1.2)
         + sin(p.z * 2.1 + uTime * 1.9);
  }

  void main() {
    float n   = sineDisplace(position);
    float d   = 1.3 + n * 0.11;
    float len = length(position);

    csm_Position = (position / len) * d;

    // Tangent-space normal recalculation (no JS computeVertexNormals needed)
    float shift = 0.001;
    vec3 biTangent = cross(normal, tangent.xyz);
    vec3 posA = position + tangent.xyz * shift;
    vec3 posB = position + biTangent * shift;
    float dA = 1.3 + sineDisplace(posA) * 0.11;
    float dB = 1.3 + sineDisplace(posB) * 0.11;
    posA = (posA / length(posA)) * dA;
    posB = (posB / length(posB)) * dB;
    vec3 toA = normalize(posA - csm_Position);
    vec3 toB = normalize(posB - csm_Position);
    csm_Normal = normalize(cross(toA, toB));
  }
`;

interface HeroBlobProps {
  /** GLB swap-in seam (D-15). When null (default), render the procedural blob.
   *  When set, this path is reserved for a future GLB model load (v2 workstream). */
  modelUrl?: string | null;
}

/** Procedural GPU-morph blob — rendered when modelUrl is null (v1 default). */
function HeroBlobProcedural() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<InstanceType<typeof CustomShaderMaterial>>(null!);

  // Geometry with tangents for normal recalculation in vertex shader
  const blobGeo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.3, 12);
    g.computeTangents(); // required for tangent attribute in vertex shader
    return g;
  }, []);

  // IBL setup: RoomEnvironment + PMREMGenerator (one-time, no external HDR file)
  const { gl, scene } = useThree();
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment()).texture;
    scene.environment = envMap;
    pmrem.dispose();
  }, [gl, scene]);

  // CSM material — keeps all PBR props, injects vertex shader
  const mat = useMemo(() => {
    const m = new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: BLOB_VERT,
      uniforms: { uTime: { value: 0 } },
      color: 0x140805,
      metalness: 0.6,
      roughness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.2,
    });
    matRef.current = m;
    return m;
  }, []);

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.getElapsedTime();
    // Autonomous rotation — cheap quaternion update, stays in JS
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0035;
      meshRef.current.rotation.x = Math.sin(mat.uniforms.uTime.value * 0.3) * 0.22;
    }
  });

  return (
    <mesh ref={meshRef} geometry={blobGeo} material={mat} />
  );
}

/** HeroBlob with GLB swap-in seam (D-15).
 *  modelUrl=null (default) → procedural GPU morph blob (v1 behavior).
 *  modelUrl="..." → reserved for future GLB load (v2 workstream). */
export function HeroBlob({ modelUrl = null }: HeroBlobProps) {
  if (modelUrl) {
    // Future: load GLB via useGLTF(modelUrl) and return the model
    return null;
  }
  return <HeroBlobProcedural />;
}
