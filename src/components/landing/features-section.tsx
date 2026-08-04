"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Shield, Gauge, Globe, Layers } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Hardened at the boundary",
    description:
      "Every submission is validated before it touches business logic. Malformed and oversized payloads are rejected with clean errors, never a server crash.",
  },
  {
    icon: Gauge,
    title: "Abuse-resistant by default",
    description:
      "Per-IP and per-widget rate limiting enforced across serverless instances, plus honeypot spam detection that never tips off the sender.",
  },
  {
    icon: Globe,
    title: "Enrichment that degrades gracefully",
    description:
      "IP geolocation runs through a two-provider fallback chain. If both providers fail, the submission is still stored — enrichment is a bonus, never a dependency.",
  },
  {
    icon: Layers,
    title: "True tenant isolation",
    description:
      "Every query is scoped at the database layer. One customer can never read or modify another customer\u2019s widgets or submissions.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-semibold text-graphite-100">
          Built for untrusted traffic
        </h2>
        <p className="mt-2 text-graphite-400">
          The public internet is the input. Every layer assumes that.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <Card className="h-full">
              <CardHeader>
                <feature.icon
                  className="mb-3 h-5 w-5 text-accent"
                  strokeWidth={1.5}
                />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
