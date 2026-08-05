"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  Icosahedron,
  TorusKnot,
  Octahedron,
} from "@react-three/drei";
import type { Group } from "three";

type ShapeKind = "icosahedron" | "torusKnot" | "octahedronCluster";

interface RotatingStructureProps {
  shape: ShapeKind;
  size?: number;
}

function IcosahedronShape({ size }: { size: number }) {
  return (
    <Icosahedron args={[size, 6]}>
      <MeshDistortMaterial
        color="#0f2148"
        emissive="#34c281"
        emissiveIntensity={0.25}
        roughness={0.2}
        metalness={0.8}
        distort={0.3}
        speed={1.2}
      />
    </Icosahedron>
  );
}

function TorusKnotShape({ size }: { size: number }) {
  return (
    <TorusKnot args={[size * 0.7, size * 0.22, 180, 24]}>
      <MeshDistortMaterial
        color="#1c0f42"
        emissive="#9b5cf0"
        emissiveIntensity={0.3}
        roughness={0.15}
        metalness={0.85}
        distort={0.2}
        speed={1.5}
      />
    </TorusKnot>
  );
}

function OctahedronCluster({ size }: { size: number }) {
  const positions: [number, number, number][] = [
    [0, 0, 0],
    [size * 1.3, size * 0.4, 0],
    [-size * 1.1, -size * 0.5, size * 0.3],
    [0, size * 1.2, -size * 0.4],
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <Octahedron
          key={i}
          args={[size * (i === 0 ? 0.9 : 0.45)]}
          position={pos}
        >
          <MeshDistortMaterial
            color="#0a1530"
            emissive={i % 2 === 0 ? "#34c281" : "#9b5cf0"}
            emissiveIntensity={0.28}
            roughness={0.2}
            metalness={0.8}
            distort={0.25}
            speed={1}
          />
        </Octahedron>
      ))}
    </>
  );
}

function Scene({ shape, size = 1.8 }: RotatingStructureProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = hovered ? 3.5 : 0.35;
    groupRef.current.rotation.x += delta * 0.25 * speed;
    groupRef.current.rotation.y += delta * 0.35 * speed;
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} color="#34c281" />
      <directionalLight position={[-3, -2, -3]} intensity={1} color="#9b5cf0" />
      {shape === "icosahedron" && <IcosahedronShape size={size} />}
      {shape === "torusKnot" && <TorusKnotShape size={size} />}
      {shape === "octahedronCluster" && <OctahedronCluster size={size} />}
    </group>
  );
}

export function RotatingStructure({ shape, size }: RotatingStructureProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene shape={shape} size={size} />
      </Canvas>
    </div>
  );
}
