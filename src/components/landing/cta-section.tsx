"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  isAuthenticated: boolean;
  userExists: boolean | null;
}

export function CtaSection({ isAuthenticated, userExists }: CtaSectionProps) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-[#6f33b8] bg-gradient-to-br from-[#11021d] via-[#22094b] to-[#2d0e52] px-8 py-16 text-center shadow-[0_0_90px_rgba(133,71,255,0.18)]"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#8f7bff]/15 blur-3xl" />

        <p className="relative mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#ad8cff]">
          Ready when you are
        </p>
        <h2 className="relative mb-4 text-3xl font-semibold text-white sm:text-4xl">
          Ship your first widget in minutes
        </h2>
        <p className="relative mx-auto mb-8 max-w-lg text-white/70">
          No credit card, no hosting to set up. Create an account, generate a
          snippet, and start capturing leads from a site you don&apos;t even
          own.
        </p>
        {!isAuthenticated && (
          <div className="relative flex items-center justify-center gap-3">
            {(userExists === false || userExists === null) && (
              <Link href="/register">
                <Button size="lg">Get started free</Button>
              </Link>
            )}
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Sign in
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
}
