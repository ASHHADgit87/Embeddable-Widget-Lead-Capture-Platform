"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import { useMousePosition } from "@/hooks/use-mouse-position";
import type { Mesh } from "three";

export function HeroScene() {
  const meshRef = useRef<Mesh>(null);
  const mouse = useMousePosition();

  const baseRotation = useMemo(() => ({ x: 0.2, y: 0.3 }), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.12;

    const targetX = baseRotation.x + mouse.y * 0.15;
    const targetY = baseRotation.y + mouse.x * 0.15;
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.02;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} color="#3b5bdb" />
      <directionalLight
        position={[-3, -2, -3]}
        intensity={0.8}
        color="#8b5e34"
      />
      <Icosahedron ref={meshRef} args={[1.6, 8]}>
        <MeshDistortMaterial
          color="#18181b"
          emissive="#7048c9"
          emissiveIntensity={0.15}
          roughness={0.15}
          metalness={0.85}
          distort={0.35}
          speed={1.4}
        />
      </Icosahedron>
    </>
  );
}
