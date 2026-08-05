"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Shield,
  Gauge,
  Globe,
  Layers,
  Code2,
  Cloud,
  Bell,
  BarChart3,
  Lock,
  TestTube2,
} from "lucide-react";

interface CardData {
  title: string;
  description: string;
  Icon: LucideIcon;
  accent: "green" | "purple" | "lightblue";
}

const CARDS: CardData[] = [
  {
    title: "Widget Management API",
    description:
      "Authenticated, tenant-isolated CRUD for creating and configuring signup forms, CTAs, and popovers.",
    Icon: Layers,
    accent: "green",
  },
  {
    title: "Embed Snippet Generation",
    description:
      "One <script> tag per widget wires up config fetch, rendering, and submission handling automatically.",
    Icon: Code2,
    accent: "purple",
  },
  {
    title: "Cached Widget Delivery",
    description:
      "Versioned JS bundles and short-lived config caching, served with the same discipline as a real CDN.",
    Icon: Gauge,
    accent: "lightblue",
  },
  {
    title: "Public Submission Endpoint",
    description:
      "Cross-origin requests handled correctly — CORS, preflight, and boundary validation on every field.",
    Icon: Globe,
    accent: "green",
  },
  {
    title: "Abuse Protection",
    description:
      "Per-IP and per-widget rate limiting, plus honeypot spam detection, stop floods before they land.",
    Icon: Shield,
    accent: "purple",
  },
  {
    title: "Geo Enrichment Fallback",
    description:
      "IP-to-location lookups try Provider A, then Provider B — and never block a submission if both are down.",
    Icon: Cloud,
    accent: "lightblue",
  },
  {
    title: "Safe Side Effects",
    description:
      "Confirmation emails and webhooks fire after storage. A failure there can never break the main path.",
    Icon: Bell,
    accent: "green",
  },
  {
    title: "Owner Dashboard & Analytics",
    description:
      "Submission counts over time, per-widget stats, and geo breakdowns for every widget owner.",
    Icon: BarChart3,
    accent: "purple",
  },
  {
    title: "True Tenant Isolation",
    description:
      "Every query is scoped at the database layer — one customer can never read or modify another's data.",
    Icon: Lock,
    accent: "lightblue",
  },
  {
    title: "Tested, Documented, Reproducible",
    description:
      "CORS preflight, invalid payloads, rate limits, and provider fallback — all covered by automated tests.",
    Icon: TestTube2,
    accent: "green",
  },
];

const accentClasses: Record<
  CardData["accent"],
  { text: string; ring: string; bg: string }
> = {
  green: { text: "text-green", ring: "ring-green/30", bg: "bg-green/10" },
  purple: { text: "text-purple", ring: "ring-purple/30", bg: "bg-purple/10" },
  lightblue: {
    text: "text-[#6f9dfb]",
    ring: "ring-[#6f9dfb]/30",
    bg: "bg-[#6f9dfb]/10",
  },
};

interface StackCardProps extends CardData {
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function StackCard({
  index,
  total,
  title,
  description,
  Icon,
  accent,
  progress,
}: StackCardProps) {
  const targetScale = 1 - (total - index) * 0.045;
  const range: [number, number] = [index / total, 1];
  const scale = useTransform(progress, range, [1, targetScale]);
  const colors = accentClasses[accent];

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center px-6">
      <motion.div
        style={{
          scale,
          top: `calc(-6vh + ${index * 22}px)`,
        }}
        className="relative flex w-full max-w-3xl origin-top flex-col gap-6 rounded-2xl border border-blue-800 bg-blue-900/80 p-8 shadow-2xl backdrop-blur-md sm:flex-row sm:items-start sm:p-10"
      >
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ring-1 ${colors.bg} ${colors.ring}`}
        >
          <Icon className={`h-6 w-6 ${colors.text}`} strokeWidth={1.5} />
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-xs text-white/30">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function FeaturesSection() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section id="features" ref={container} className="relative">
      <div className="sticky top-0 z-10 mx-auto max-w-5xl px-6 pb-4 pt-24 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Built for untrusted traffic
        </h2>
        <p className="mt-2 text-white/50">
          The public internet is the input. Every layer assumes that.
        </p>
      </div>

      {CARDS.map((card, i) => (
        <StackCard
          key={card.title}
          index={i}
          total={CARDS.length}
          progress={scrollYProgress}
          {...card}
        />
      ))}
    </section>
  );
}
