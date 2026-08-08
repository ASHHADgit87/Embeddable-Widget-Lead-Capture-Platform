"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface PowerWiresProps {
  monitorRefs: React.RefObject<(HTMLDivElement | null)[]>;
  socketRefs: React.RefObject<(HTMLDivElement | null)[]>;
  poweredStates: boolean[];
}

const CURRENT_COLOR = "#34c281";
const PARTICLES_PER_WIRE = 8;

function useWireTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 32, 0);
    grad.addColorStop(0, "#1c1c20");
    grad.addColorStop(0.5, "#38383f");
    grad.addColorStop(1, "#1c1c20");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);
}

function WireMesh({
  index,
  monitorRefs,
  socketRefs,
  powered,
}: {
  index: number;
  monitorRefs: React.RefObject<(HTMLDivElement | null)[]>;
  socketRefs: React.RefObject<(HTMLDivElement | null)[]>;
  powered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const wireTexture = useWireTexture();
  const { size } = useThree();

  const particlePositions = useMemo(
    () => new Float32Array(PARTICLES_PER_WIRE * 3),
    [],
  );
  const particleProgress = useRef(
    Array.from(
      { length: PARTICLES_PER_WIRE },
      (_, i) => i / PARTICLES_PER_WIRE,
    ),
  );

  useEffect(() => {
    return () => {
      meshRef.current?.geometry.dispose();
    };
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const monitorEl = monitorRefs.current?.[index];
    const socketEl = socketRefs.current?.[index];

    if (!monitorEl || !socketEl) {
      if (materialRef.current) materialRef.current.opacity = 0;
      const pm = particlesRef.current?.material as
        | THREE.PointsMaterial
        | undefined;
      if (pm) pm.opacity = 0;
      return;
    }

    const mRect = monitorEl.getBoundingClientRect();
    const sRect = socketEl.getBoundingClientRect();
    const startX = mRect.left + mRect.width / 2 - size.width / 2 + 150;
    const startY = size.height / 2 - mRect.bottom + 120;

    const endX = sRect.left + sRect.width / 2 - size.width / 2;
    const endY = size.height / 2 - (sRect.top + sRect.height / 2);

    const dropY = startY - 40;

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(startX, startY, 0),
      new THREE.Vector3(startX, dropY, 0),
      new THREE.Vector3(endX, dropY, 0),
      new THREE.Vector3(endX, endY, 0),
    ]);

    const geometry = new THREE.TubeGeometry(curve, 48, 3, 8, false);
    mesh.geometry.dispose();
    mesh.geometry = geometry;

    if (materialRef.current) {
      materialRef.current.opacity = powered ? 1 : 0.55;
    }

    const pointsMaterial = particlesRef.current?.material as
      | THREE.PointsMaterial
      | undefined;
    if (pointsMaterial) {
      pointsMaterial.opacity = powered ? 0.9 : 0;
    }

    const posAttr = particlesRef.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (posAttr) {
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < PARTICLES_PER_WIRE; i++) {
        if (powered) {
          particleProgress.current[i]! += delta * 0.35;
          if (particleProgress.current[i]! > 1)
            particleProgress.current[i]! -= 1;
        }
        const p = curve.getPointAt(particleProgress.current[i]!);
        arr[i * 3] = p.x;
        arr[i * 3 + 1] = p.y;
        arr[i * 3 + 2] = p.z + 0.5;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <bufferGeometry />
        <meshBasicMaterial
          ref={materialRef}
          map={wireTexture}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
            count={PARTICLES_PER_WIRE}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={3.2}
          color={CURRENT_COLOR}
          transparent
          opacity={0.9}
          sizeAttenuation={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export function PowerWires({
  monitorRefs,
  socketRefs,
  poweredStates,
}: PowerWiresProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden sm:block">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 100], near: 0.1, far: 1000 }}
        gl={{ alpha: true }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        {poweredStates.map((powered, i) => (
          <WireMesh
            key={i}
            index={i}
            monitorRefs={monitorRefs}
            socketRefs={socketRefs}
            powered={powered}
          />
        ))}
      </Canvas>
    </div>
  );
}
