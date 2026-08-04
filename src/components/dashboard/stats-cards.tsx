import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/db/submissions.repository";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const last7DaysTotal = stats.submissionsLast7Days.reduce(
    (sum, day) => sum + day.count,
    0,
  );
  const topCountry = stats.geoBreakdown[0]?.country ?? "—";
  const activeWidgets = stats.perWidget.length;

  const cards = [
    { label: "Total submissions", value: stats.totalSubmissions.toString() },
    { label: "Last 7 days", value: last7DaysTotal.toString() },
    { label: "Widgets receiving traffic", value: activeWidgets.toString() },
    { label: "Top country", value: topCountry },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="mb-0">
            <p className="text-xs uppercase tracking-wide text-graphite-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-graphite-100">
              {card.value}
            </p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
