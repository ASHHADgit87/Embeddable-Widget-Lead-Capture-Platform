"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import type { Mesh } from "three";

function AmbientMesh() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.03;
    meshRef.current.rotation.y += delta * 0.045;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 4, 4]} intensity={0.8} color="#3b5bdb" />
      <directionalLight
        position={[-4, -3, -2]}
        intensity={0.6}
        color="#2f9e5b"
      />
      <Icosahedron ref={meshRef} args={[2.2, 6]} position={[2.5, -1, -3]}>
        <MeshDistortMaterial
          color="#18181b"
          emissive="#7048c9"
          emissiveIntensity={0.12}
          roughness={0.3}
          metalness={0.7}
          distort={0.25}
          speed={0.8}
          transparent
          opacity={0.55}
        />
      </Icosahedron>
    </>
  );
}

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <AmbientMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
