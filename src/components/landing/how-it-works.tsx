"use client";

import { motion } from "framer-motion";
import { Code2, Rocket, LayoutDashboard } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Code2,
    title: "Create & configure",
    description:
      "Design your widget through the authenticated API — fields, button text, display rules. Get back one embed snippet.",
    accent: "text-green",
    ring: "ring-green/30",
    bg: "bg-green/10",
  },
  {
    number: "02",
    icon: Rocket,
    title: "Paste one script tag",
    description:
      "Drop it into any site you don't control. Config loads cached, CORS-safe, and the widget renders in place.",
    accent: "text-[#6f9dfb]",
    ring: "ring-[#6f9dfb]/30",
    bg: "bg-[#6f9dfb]/10",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Watch it work",
    description:
      "Every submission is validated, rate-limited, geo-enriched, and stored — then shown live in your dashboard.",
    accent: "text-purple",
    ring: "ring-purple/30",
    bg: "bg-purple/10",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-green">
          How it works
        </p>
        <h2 className="text-2xl font-semibold text-white">
          From config to captured lead — in three steps
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative rounded-xl border border-blue-800 bg-blue-900/50 p-6"
          >
            <span className="absolute right-5 top-5 font-mono text-3xl font-semibold text-white/10">
              {step.number}
            </span>
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ring-1 ${step.bg} ${step.ring}`}
            >
              <step.icon
                className={`h-5 w-5 ${step.accent}`}
                strokeWidth={1.5}
              />
            </div>
            <h3 className="mb-2 text-base font-semibold text-white">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/60">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
