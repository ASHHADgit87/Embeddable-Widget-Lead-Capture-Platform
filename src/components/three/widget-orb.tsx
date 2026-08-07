"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, Points } from "three";

const ORB_PARTICLE_COUNT = 30;

function OrbScene() {
  const coreRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);

  const { positions, radii, angles, axis } = useMemo(() => {
    const positions = new Float32Array(ORB_PARTICLE_COUNT * 3);
    const radii: number[] = [];
    const angles: number[] = [];
    const axis: number[] = [];

    for (let i = 0; i < ORB_PARTICLE_COUNT; i++) {
      const radius = 1.6 + Math.random() * 0.5;
      const angle = Math.random() * Math.PI * 2;
      const a = (Math.random() - 0.5) * 1.2;
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
    Array.from(
      { length: ORB_PARTICLE_COUNT },
      () => Math.random() * Math.PI * 2,
    ),
  );

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.3;
      coreRef.current.rotation.x += delta * 0.12;
    }
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.2;

    const posAttr = particlesRef.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (posAttr) {
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < ORB_PARTICLE_COUNT; i++) {
        orbit.current[i]! += delta * 0.07;
        const angle = angles[i]! + orbit.current[i]!;
        const radius = radii[i]!;
        arr[i * 3] = Math.cos(angle) * radius;
        arr[i * 3 + 1] = axis[i]! + Math.sin(orbit.current[i]! * 1.2) * 0.08;
        arr[i * 3 + 2] = Math.sin(angle) * radius;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#3b1f7a"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.4}
          wireframe
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.3, 0.01, 8, 96]} />
        <meshBasicMaterial color="#9b5cf0" transparent opacity={0.6} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={ORB_PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#c9b3ff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.9} />
      <pointLight position={[2, 2, 2]} intensity={1.1} color="#8be6d6" />
      <pointLight position={[-2, -1, 2]} intensity={0.9} color="#d78cff" />
    </group>
  );
}

export function WidgetOrb() {
  return (
    <div className="h-16 w-16 shrink-0">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <OrbScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
