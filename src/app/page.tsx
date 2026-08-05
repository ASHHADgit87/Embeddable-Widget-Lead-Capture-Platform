"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, Points, Group } from "three";
import { Button } from "@/components/ui/button";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

const PARTICLE_COUNT = 120;

function RainbowGem() {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const ring3Ref = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);
  const [isHovered, setIsHovered] = useState(false);
  const speedRef = useRef(1);

  const geometry = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1.4, 0); 
    const nonIndexed = geo.toNonIndexed();
    const posAttr = nonIndexed.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(posAttr.count * 3);

    const color = new THREE.Color();
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      const hue = (Math.atan2(z, x) / (Math.PI * 2) + 0.5 + y * 0.15) % 1;
      color.setHSL(hue, 0.85, 0.55);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    nonIndexed.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    nonIndexed.computeVertexNormals();
    return nonIndexed;
  }, []);

  
  const { particlePositions, particleRadii, particleAngles, particleSpeeds } =
    useMemo(() => {
      const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
      const particleRadii: number[] = [];
      const particleAngles: number[] = [];
      const particleSpeeds: number[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const radius = 2.4 + Math.random() * 1.2; 
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 2.2;

        particleRadii.push(radius);
        particleAngles.push(angle);
        particleSpeeds.push(0.15 + Math.random() * 0.25);

        particlePositions[i * 3] = Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      }

      return { particlePositions, particleRadii, particleAngles, particleSpeeds };
    }, []);

  const particleYs = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, () => (Math.random() - 0.5) * 2.2),
    []
  );
  const particleOrbitProgress = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => Math.random())
  );

  useFrame((_, delta) => {
    const target = isHovered ? 5 : 1;
    speedRef.current = THREE.MathUtils.damp(speedRef.current, target, 4, delta);
    const speed = speedRef.current;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5 * speed;
      meshRef.current.rotation.x += delta * 0.25 * speed;
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.3 * speed;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.22 * speed;
    if (ring3Ref.current) ring3Ref.current.rotation.z += delta * 0.15 * speed;

    const posAttr = particlesRef.current?.geometry.attributes
      .position as THREE.BufferAttribute | undefined;
    if (posAttr) {
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particleOrbitProgress.current[i]! += delta * particleSpeeds[i]! * 0.15 * speed;
        if (particleOrbitProgress.current[i]! > 1) particleOrbitProgress.current[i]! = 0;

        const progress = particleOrbitProgress.current[i]!;
        const radius = particleRadii[i]! * (1 - progress * 0.6);
        const angle = particleAngles[i]! + progress * 2.2 * speed;

        arr[i * 3] = Math.cos(angle) * radius;
        arr[i * 3 + 1] = particleYs[i]! * (1 - progress * 0.4);
        arr[i * 3 + 2] = Math.sin(angle) * radius;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <mesh>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          flatShading
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

  
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.9, 0.02, 8, 96]} />
        <meshBasicMaterial color="#34c281" transparent opacity={0.85} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 1.7, Math.PI / 5, 0]}>
        <torusGeometry args={[2.2, 0.02, 8, 96]} />
        <meshBasicMaterial color="#4d7cf0" transparent opacity={0.75} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 3, Math.PI / 3, 0]}>
        <torusGeometry args={[2.5, 0.02, 8, 96]} />
        <meshBasicMaterial color="#9b5cf0" transparent opacity={0.65} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#ffffff"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 4]} intensity={1.2} />
      <directionalLight position={[-4, -3, -3]} intensity={0.8} />
    </group>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-20 lg:grid-cols-2 lg:py-32">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-green">
            Embeddable widgets, hardened for the open internet
          </p>
          <h1 className="mb-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            One script tag.
            <br />A backend that survives the internet.
          </h1>
          <p className="mb-8 max-w-lg text-white/60">
            Create a widget, hand out a single embed snippet, and safely accept
            submissions from any website you don&apos;t control — validated,
            rate-limited, spam-filtered, and geo-enriched.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button size="lg">Get started</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="h-[420px] w-full lg:h-[520px]">
          <Canvas
            camera={{ position: [0, 0, 7], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <RainbowGem />
            </Suspense>
          </Canvas>
        </div>
      </section>

      <HowItWorks />
      <FeaturesSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
