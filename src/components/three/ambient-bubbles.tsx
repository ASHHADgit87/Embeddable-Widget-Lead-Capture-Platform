"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { InstancedMesh } from "three";

const PALETTE = ["#5fb8ff", "#9b5cf0", "#4dd985"];

interface BubbleFieldProps {
  count?: number;
}

function BubbleField({ count = 90 }: BubbleFieldProps) {
  const mesh = useRef<InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        speed: 0.02 + Math.random() * 0.05,
        x: (Math.random() - 0.5) * 40,
        yStart: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 20,
        size: 0.05 + Math.random() * 0.15,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)]!,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      const { speed, x, yStart, z, size } = particle;
      particle.t += speed;
      const yPos = ((particle.t + yStart) % 40) - 20;
      const xOscillation = Math.sin(particle.t * 0.5) * 0.5;

      dummy.position.set(x + xOscillation, yPos, z);
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      mesh.current!.setColorAt(i, new THREE.Color(particle.color));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor)
      mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        roughness={0}
        metalness={0.8}
        emissiveIntensity={0.9}
        transparent
        opacity={0.5}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export function AmbientBubbles() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[15, 15, 15]} intensity={1.2} color="#ffffff" />
        <Suspense fallback={null}>
          <BubbleField count={90} />
        </Suspense>
      </Canvas>
    </div>
  );
}
