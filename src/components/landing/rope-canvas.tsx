"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

interface RopeProps {
  progress: MotionValue<number>;
  total: number;
  cardRefs: React.RefObject<(HTMLDivElement | null)[]>;
  xOffset?: number;
}

function useRopeTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#8b6fd6";
    ctx.fillRect(0, 0, 64, 64);

    ctx.strokeStyle = "#3a1f5c";
    ctx.lineWidth = 7;
    for (let i = -64; i < 128; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 64, 64);
      ctx.stroke();
    }
    ctx.strokeStyle = "#c9b3ff";
    ctx.lineWidth = 3;
    for (let i = -64; i < 128; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i + 6, 0);
      ctx.lineTo(i + 70, 64);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function RopeMesh({ progress, total, cardRefs, xOffset = 0 }: RopeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { size } = useThree();
  const ropeTexture = useRopeTexture();

  const lastActiveIndexRef = useRef<number>(-1);
  const initialGapRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      meshRef.current?.geometry.dispose();
    };
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    const p = progress.get();
    const lead = 0.3;
    const rawIndex = p * total + lead;
    const segmentIndex = Math.floor(rawIndex);
    const segmentFrac = rawIndex - segmentIndex;

    const handoff = 0.4;
    let activeIndex: number;
    let localT: number;
    if (segmentFrac < handoff) {
      activeIndex = segmentIndex;
      localT = segmentFrac / handoff;
    } else {
      activeIndex = segmentIndex + 1;
      localT = (segmentFrac - handoff) / (1 - handoff);
    }

    if (activeIndex < 1) {
      activeIndex = 1;
      localT = Math.min(rawIndex, 1);
    }

    if (activeIndex > total - 1) {
      material.opacity = 0;
      return;
    }

    const anchorEl = cardRefs.current?.[activeIndex - 1];
    const pulledEl = cardRefs.current?.[activeIndex];

    if (!anchorEl || !pulledEl) {
      material.opacity = 0;
      return;
    }

    const anchorRect = anchorEl.getBoundingClientRect();
    const pulledRect = pulledEl.getBoundingClientRect();

    const anchorX =
      anchorRect.left + anchorRect.width / 2 - size.width / 2 + xOffset;
    const anchorY = size.height / 2 - anchorRect.bottom;

    const pulledX =
      pulledRect.left + pulledRect.width / 2 - size.width / 2 + xOffset;
    const pulledY = size.height / 2 - pulledRect.top;

    const currentGap = Math.max(0, pulledRect.top - anchorRect.bottom);

    if (activeIndex !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = activeIndex;
      initialGapRef.current = Math.max(currentGap, 1);
    }

    if (localT < 0.1 && currentGap > initialGapRef.current) {
      initialGapRef.current = currentGap;
    }

    const gapRatio = THREE.MathUtils.clamp(
      currentGap / initialGapRef.current,
      0,
      1,
    );

    const tension = THREE.MathUtils.smoothstep(localT, 0, 0.85);
    const sagAmplitude = THREE.MathUtils.lerp(26, 3, tension);

    const segments = 5;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = THREE.MathUtils.lerp(anchorX, pulledX, t);
      const y = THREE.MathUtils.lerp(anchorY, pulledY, t);
      const wave =
        Math.sin(t * Math.PI * 2.5) * sagAmplitude * Math.sin(t * Math.PI);
      points.push(new THREE.Vector3(x + wave, y, 0));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const ropeLength = curve.getLength();

    const nextGeometry = new THREE.TubeGeometry(curve, 40, 5, 10, false);
    mesh.geometry.dispose();
    mesh.geometry = nextGeometry;

    ropeTexture.repeat.set(1, Math.max(1, ropeLength / 250));

    const fadeIn = THREE.MathUtils.smoothstep(localT, 0, 0.06);

    const fadeOut = THREE.MathUtils.smoothstep(gapRatio, 0.02, 0.18);
    material.opacity = fadeIn * fadeOut;
  });

  return (
    <mesh ref={meshRef}>
      <bufferGeometry />
      <meshBasicMaterial
        ref={materialRef}
        map={ropeTexture}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  );
}

export function RopeCanvas({ progress, total, cardRefs }: RopeProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 100], near: 0.1, far: 1000 }}
        gl={{ alpha: true }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <RopeMesh
          progress={progress}
          total={total}
          cardRefs={cardRefs}
          xOffset={-400}
        />
        <RopeMesh progress={progress} total={total} cardRefs={cardRefs} />
        <RopeMesh
          progress={progress}
          total={total}
          cardRefs={cardRefs}
          xOffset={400}
        />
      </Canvas>
    </div>
  );
}
