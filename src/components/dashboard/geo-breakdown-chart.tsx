import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/db/submissions.repository";

interface GeoBreakdownChartProps {
  geoBreakdown: DashboardStats["geoBreakdown"];
}

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
        {geoBreakdown.slice(0, 8).map((entry) => (
          <div key={entry.country}>
            <div className="mb-1 flex justify-between text-xs text-white/40">
              <span>{entry.country}</span>
              <span>{entry.count}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-900">
              <div
                className="h-full rounded-full bg-green"
                style={{ width: `${(entry.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
