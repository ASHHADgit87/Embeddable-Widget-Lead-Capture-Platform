"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  ShieldCheck,
  Gauge,
  ShieldAlert,
  MapPinned,
  CloudCog,
  Database,
  Bell,
  type LucideIcon,
} from "lucide-react";

interface Stage {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  ring: string;
  bg: string;
  dot: string;
}

const stages: Stage[] = [
  {
    number: "01",
    icon: Globe,
    title: "CORS preflight",
    description:
      "Browsers send OPTIONS before the real request. Answered correctly, or the submission never leaves the visitor's browser.",
    accent: "text-[#6f9dfb]",
    ring: "ring-[#6f9dfb]/40",
    bg: "bg-[#6f9dfb]/10",
    dot: "#6f9dfb",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Boundary validation",
    description:
      "Every field is checked before it touches business logic. Malformed or oversized payloads get a clean 4xx, never a 500.",
    accent: "text-[#caa3ff]",
    ring: "ring-[#caa3ff]/40",
    bg: "bg-[#caa3ff]/10",
    dot: "#caa3ff",
  },
  {
    number: "03",
    icon: Gauge,
    title: "Rate limiting",
    description:
      "Per-IP and per-widget limits. A burst returns 429 while the service keeps serving legitimate traffic.",
    accent: "text-[#f4d35b]",
    ring: "ring-[#f4d35b]/40",
    bg: "bg-[#f4d35b]/10",
    dot: "#f4d35b",
  },
  {
    number: "04",
    icon: ShieldAlert,
    title: "Honeypot check",
    description:
      "A hidden field humans never fill. A bot that fills it is silently dropped without knowing why.",
    accent: "text-[#ff88dd]",
    ring: "ring-[#ff88dd]/40",
    bg: "bg-[#ff88dd]/10",
    dot: "#ff88dd",
  },
  {
    number: "05",
    icon: MapPinned,
    title: "Geo · Provider A",
    description:
      "The visitor's IP is resolved to a location through the primary provider first.",
    accent: "text-green",
    ring: "ring-green/40",
    bg: "bg-green/10",
    dot: "#34c281",
  },
  {
    number: "06",
    icon: CloudCog,
    title: "Geo · Provider B fallback",
    description:
      "If A fails, B answers instead. If both are down, the submission still succeeds — just without geo.",
    accent: "text-[#8b6bff]",
    ring: "ring-[#8b6bff]/40",
    bg: "bg-[#8b6bff]/10",
    dot: "#8b6bff",
  },
  {
    number: "07",
    icon: Database,
    title: "Store, tenant-isolated",
    description:
      "The row is written and scoped to its widget and tenant. One customer can never read another's data.",
    accent: "text-[#e0b7ff]",
    ring: "ring-[#e0b7ff]/30",
    bg: "bg-[#e0b7ff]/10",
    dot: "#e0b7ff",
  },
  {
    number: "08",
    icon: Bell,
    title: "Safe side effect",
    description:
      "A confirmation email or webhook fires after storage. If it throws, the submission has already succeeded.",
    accent: "text-green",
    ring: "ring-green/40",
    bg: "bg-green/10",
    dot: "#34c281",
  },
];

const FLOW_ORDER: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
];

const ARROW_GAP = 9;

interface PathData {
  id: string;
  d: string;
  color: string;
}

export function PipelineFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const measure = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    setSvgSize({ width: containerRect.width, height: containerRect.height });

    const rects = cardRefs.current.map((el) =>
      el ? el.getBoundingClientRect() : null,
    );

    const next: PathData[] = [];

    FLOW_ORDER.forEach(([fromIdx, toIdx], i) => {
      const a = rects[fromIdx];
      const b = rects[toIdx];
      if (!a || !b) return;

      const color = stages[fromIdx]!.dot;
      const sameColumn = Math.floor(fromIdx / 2) === Math.floor(toIdx / 2);

      if (sameColumn) {
        const x1 = a.left - containerRect.left + a.width / 2;
        const y1 = a.bottom - containerRect.top;
        const x2 = b.left - containerRect.left + b.width / 2;
        const y2 = b.top - containerRect.top - ARROW_GAP;

        next.push({
          id: `pipe-${i}`,
          d: `M ${x1} ${y1} L ${x2} ${y2}`,
          color,
        });
      } else {
        const x1 = a.right - containerRect.left;
        const y1 = a.top - containerRect.top + a.height / 2;
        const x2raw = b.left - containerRect.left;
        const y2 = b.top - containerRect.top + b.height / 2;
        const x2 = x2raw - ARROW_GAP;
        const midX = x1 + (x2raw - x1) / 2;

        next.push({
          id: `pipe-${i}`,
          d: `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`,
          color,
        });
      }
    });

    setPaths(next);
  };

  useLayoutEffect(() => {
    const t = setTimeout(measure, 650);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <svg
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        width={svgSize.width}
        height={svgSize.height}
        style={{ overflow: "visible" }}
      >
        <defs>
          <marker
            id="pipeline-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#b18aff" />
          </marker>
        </defs>

        {paths.map((p) => (
          <path
            key={p.id}
            d={p.d}
            stroke={p.color}
            strokeWidth={2}
            strokeDasharray="6 8"
            fill="none"
            markerEnd="url(#pipeline-arrow)"
            className="pipeline-path"
          />
        ))}
      </svg>

      <div className="relative z-10 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-flow-col lg:grid-cols-4 lg:grid-rows-2">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.number}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            onAnimationComplete={measure}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
            className="relative rounded-xl border border-[#5b2f99] bg-[#15072d]/80 p-5 shadow-[0_14px_60px_rgba(111,46,221,0.14)] transition-shadow hover:shadow-[0_18px_70px_rgba(139,107,255,0.24)]"
          >
            <span className="absolute right-4 top-4 font-mono text-2xl font-semibold text-white/10">
              {stage.number}
            </span>
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${stage.bg} ${stage.ring}`}
            >
              <stage.icon
                className={`h-4.5 w-4.5 ${stage.accent}`}
                strokeWidth={1.5}
              />
            </div>
            <h3 className="mb-1.5 text-sm font-semibold text-white">
              {stage.title}
            </h3>
            <p className="text-xs leading-relaxed text-white/55">
              {stage.description}
            </p>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .pipeline-path {
          animation: pipeline-dash 1.1s linear infinite;
        }
        @keyframes pipeline-dash {
          from {
            stroke-dashoffset: 32;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
