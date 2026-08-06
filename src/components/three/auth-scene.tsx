"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, Mesh, Points } from "three";

const PARTICLE_COUNT = 140;

function AuthSceneContent() {
  const groupRef = useRef<Group>(null);
  const widgetGroupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const ring3Ref = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);
  const gridRef = useRef<Mesh>(null);

  const { positions, radii, angles, axis } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const radii: number[] = [];
    const angles: number[] = [];
    const axis: number[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 2.4 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.2;

      radii.push(radius);
      angles.push(angle);
      axis.push(y);

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return { positions, radii, angles, axis };
  }, []);

  const particleColors = useMemo(() => {
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const palette = [
      new THREE.Color("#9b5cf0"),
      new THREE.Color("#c9b3ff"),
      new THREE.Color("#8b5e34"),
      new THREE.Color("#6f9dfb"),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color = palette[i % palette.length]!;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return colors;
  }, []);

  const orbit = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => Math.random() * Math.PI * 2),
  );

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.12) * 0.12;
    }

    if (widgetGroupRef.current) {
      widgetGroupRef.current.rotation.y -= delta * 0.1;
      widgetGroupRef.current.rotation.x = Math.sin(time * 0.35) * 0.08;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.18;
      coreRef.current.rotation.x += delta * 0.09;
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.14;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.1;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.06;

    if (gridRef.current) {
      gridRef.current.position.y = -2.4 + Math.sin(time * 0.4) * 0.04;
    }

    const positionAttribute = particlesRef.current?.geometry.attributes
      .position as THREE.BufferAttribute | undefined;

    if (positionAttribute) {
      const arr = positionAttribute.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        orbit.current[i]! += delta * 0.04;
        const angle = angles[i]! + orbit.current[i]!;
        const radius = radii[i]!;
        arr[i * 3] = Math.cos(angle) * radius;
        arr[i * 3 + 1] =
          axis[i]! + Math.sin(orbit.current[i]! * 1.4 + i) * 0.12;
        arr[i * 3 + 2] = Math.sin(angle) * radius;
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}>
        <planeGeometry args={[28, 28, 24, 24]} />
        <meshBasicMaterial color="#9b5cf0" wireframe transparent opacity={0.07} />
      </mesh>

      <group ref={widgetGroupRef} position={[0, 0.15, 0]}>
        <mesh>
          <boxGeometry args={[2.4, 1.5, 0.1]} />
          <meshBasicMaterial color="#8f5cf0" wireframe transparent opacity={0.32} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[1.9, 0.08, 0.02]} />
          <meshBasicMaterial color="#c9b3ff" transparent opacity={0.55} />
        </mesh>
        <mesh ref={coreRef} position={[0, 0, 0.2]}>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshBasicMaterial color="#9b5cf0" wireframe transparent opacity={0.55} />
        </mesh>
      </group>

      <mesh ref={ring1Ref} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.6, 0.012, 8, 128]} />
        <meshBasicMaterial color="#6f9dfb" transparent opacity={0.42} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 1.75, Math.PI / 6, 0]}>
        <torusGeometry args={[3.2, 0.01, 8, 128]} />
        <meshBasicMaterial color="#8f5cf0" transparent opacity={0.34} />
      </mesh>

      <mesh ref={ring3Ref} rotation={[Math.PI / 3.2, Math.PI / 4, 0]}>
        <torusGeometry args={[4, 0.008, 8, 128]} />
        <meshBasicMaterial color="#8b5e34" transparent opacity={0.22} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[particleColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.55} />
      <pointLight position={[4, 3, 5]} intensity={1.3} color="#9b5cf0" />
      <pointLight position={[-4, -2, 4]} intensity={0.9} color="#8b5e34" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#6f9dfb" />
    </group>
  );
}

export function AuthScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[#12031c]" />
      <Canvas
        camera={{ position: [0, 0.4, 9], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <AuthSceneContent />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-[#12031c]/30 via-transparent to-[#12031c]/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#12031c_72%)]" />
    </div>
  );
}
