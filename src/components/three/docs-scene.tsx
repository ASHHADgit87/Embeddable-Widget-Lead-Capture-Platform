"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, Mesh, Points } from "three";

const NODE_COLORS = [
  "#6f9dfb",
  "#caa3ff",
  "#f4d35b",
  "#ff88dd",
  "#34c281",
  "#8b6bff",
  "#e0b7ff",
  "#34c281",
];
const NODE_COUNT = NODE_COLORS.length;
const PULSE_COUNT = 5;
const RING_RADIUS = 3.4;

function PipelineRing() {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const coreShellRef = useRef<Mesh>(null);
  const nodeRefs = useRef<(Mesh | null)[]>([]);
  const pulsesRef = useRef<Points>(null);

  const nodePositions = useMemo(() => {
    return Array.from({ length: NODE_COUNT }, (_, i) => {
      const angle = (i / NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
      return new THREE.Vector3(
        Math.cos(angle) * RING_RADIUS,
        Math.sin(angle * 0.6) * 0.4,
        Math.sin(angle) * RING_RADIUS,
      );
    });
  }, []);

  const { pulsePositions, pulseColors } = useMemo(() => {
    const pulsePositions = new Float32Array(PULSE_COUNT * 3);
    const pulseColors = new Float32Array(PULSE_COUNT * 3);
    return { pulsePositions, pulseColors };
  }, []);

  const pulseProgress = useRef(
    Array.from({ length: PULSE_COUNT }, (_, i) => i / PULSE_COUNT),
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.25;
      coreRef.current.rotation.x += delta * 0.1;
    }
    if (coreShellRef.current) {
      coreShellRef.current.rotation.y -= delta * 0.08;
    }

    nodeRefs.current.forEach((node, i) => {
      if (!node) return;
      const t = performance.now() * 0.001 + i;
      node.scale.setScalar(1 + Math.sin(t * 1.5) * 0.08);
    });

    const posAttr = pulsesRef.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    const colAttr = pulsesRef.current?.geometry.attributes.color as
      | THREE.BufferAttribute
      | undefined;

    if (posAttr && colAttr) {
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;
      const color = new THREE.Color();

      for (let i = 0; i < PULSE_COUNT; i++) {
        pulseProgress.current[i]! += delta * 0.09;
        if (pulseProgress.current[i]! > 1) pulseProgress.current[i]! -= 1;

        const scaled = pulseProgress.current[i]! * NODE_COUNT;
        const fromIdx = Math.floor(scaled) % NODE_COUNT;
        const toIdx = (fromIdx + 1) % NODE_COUNT;
        const localT = scaled - Math.floor(scaled);

        const from = nodePositions[fromIdx]!;
        const to = nodePositions[toIdx]!;

        posArr[i * 3] = THREE.MathUtils.lerp(from.x, to.x, localT);
        posArr[i * 3 + 1] =
          THREE.MathUtils.lerp(from.y, to.y, localT) +
          Math.sin(localT * Math.PI) * 0.3;
        posArr[i * 3 + 2] = THREE.MathUtils.lerp(from.z, to.z, localT);

        color.set(NODE_COLORS[fromIdx]!);
        colArr[i * 3] = color.r;
        colArr[i * 3 + 1] = color.g;
        colArr[i * 3 + 2] = color.b;
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  });

  const ringLinePoints = useMemo(() => {
    const pts = [...nodePositions, nodePositions[0]!];
    return pts.flatMap((p) => [p.x, p.y, p.z]);
  }, [nodePositions]);

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#3b1f7a"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.4}
          wireframe
        />
      </mesh>
      <mesh ref={coreShellRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial
          color="#9b5cf0"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(ringLinePoints), 3]}
            count={ringLinePoints.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#6f2eb2" transparent opacity={0.35} />
      </line>
      {nodePositions.map((pos, i) => (
        <group key={i}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([0, 0, 0, pos.x, pos.y, pos.z]), 3]}
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={NODE_COLORS[i]}
              transparent
              opacity={0.18}
            />
          </line>
          <mesh
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            position={pos}
          >
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color={NODE_COLORS[i]}
              emissive={NODE_COLORS[i]}
              emissiveIntensity={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      <points ref={pulsesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions, 3]}
            count={PULSE_COUNT}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[pulseColors, 3]}
            count={PULSE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.7} />
      <pointLight position={[4, 3, 4]} intensity={1.4} color="#9b5cf0" />
      <pointLight position={[-4, -2, -3]} intensity={1} color="#6f9dfb" />
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#34c281" />
    </group>
  );
}

export function DocsScene() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 2.2, 9.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <PipelineRing />
        </Suspense>
      </Canvas>
    </div>
  );
}
