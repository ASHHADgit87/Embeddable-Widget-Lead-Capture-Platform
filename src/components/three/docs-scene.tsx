"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, Points } from "three";

const PARTICLE_COUNT = 50;

function DocsFlow() {
  const coreRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);

  const { positions, radii, angles, axis } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const radii: number[] = [];
    const angles: number[] = [];
    const axis: number[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 3.5 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      const a = (Math.random() - 0.5) * 1.5;
      radii.push(radius);
      angles.push(angle);
      axis.push(a);
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = a;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return { positions, radii, angles, axis };
  }, []);

  const orbit = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => Math.random() * Math.PI * 2),
  );

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15;
      coreRef.current.rotation.x += delta * 0.06;
    }
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.1;

    const posAttr = particlesRef.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (posAttr) {
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        orbit.current[i]! += delta * 0.03;
        const angle = angles[i]! + orbit.current[i]!;
        const radius = radii[i]!;
        arr[i * 3] = Math.cos(angle) * radius;
        arr[i * 3 + 1] = axis[i]! + Math.sin(orbit.current[i]! * 1.1) * 0.1;
        arr[i * 3 + 2] = Math.sin(angle) * radius;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[3, 0, 0]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#9b5cf0"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2, 0.01, 8, 96]} />
        <meshBasicMaterial color="#6f9dfb" transparent opacity={0.4} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#c9b3ff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.7} />
      <pointLight position={[3, 2, 3]} intensity={1} color="#9b5cf0" />
    </group>
  );
}

export function DocsScene() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <DocsFlow />
        </Suspense>
      </Canvas>
    </div>
  );
}
