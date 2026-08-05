"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const SceneCanvas = dynamic(
  () =>
    import("@/components/three/scene-canvas").then((mod) => mod.SceneCanvas),
  { ssr: false },
);

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden border-b border-neutral-800">
      <SceneCanvas />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-green"
        >
          Embeddable widgets, hardened for the open internet
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-4xl font-semibold leading-tight text-neutral-50 sm:text-5xl"
        >
          One script tag.
          <br />A backend that survives the internet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-8 max-w-xl text-neutral-400"
        >
          Create a widget, hand out a single embed snippet, and safely accept
          submissions from any website you don&apos;t control — validated,
          rate-limited, spam-filtered, and geo-enriched.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <Link href="/register">
            <Button size="lg">Get started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Sign in
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
