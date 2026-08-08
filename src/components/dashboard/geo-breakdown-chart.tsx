"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/db/submissions.repository";

interface GeoBreakdownChartProps {
  geoBreakdown: DashboardStats["geoBreakdown"];
}

const BAR_COLORS = [
  "#34c281",
  "#6f9dfb",
  "#9b5cf0",
  "#c9b3ff",
  "#5fd6a3",
  "#f4d35b",
  "#8b6bff",
  "#e0b7ff",
];

export function GeoBreakdownChart({ geoBreakdown }: GeoBreakdownChartProps) {
  if (geoBreakdown.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Geo breakdown</CardTitle>
        </CardHeader>
        <p className="text-sm text-white/40">No enriched submissions yet.</p>
      </Card>
    );
  }

  const max = geoBreakdown[0]?.count ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geo breakdown</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        {geoBreakdown.slice(0, 8).map((entry, i) => (
          <div key={entry.country}>
            <div className="mb-1 flex justify-between text-xs text-white/40">
              <span>{entry.country}</span>
              <span>{entry.count}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f0a3d]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(entry.count / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
