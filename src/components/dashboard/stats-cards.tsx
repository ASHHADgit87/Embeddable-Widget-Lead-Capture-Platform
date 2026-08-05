import { Card, CardHeader } from "@/components/ui/card";
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
    {
      label: "Total submissions",
      value: stats.totalSubmissions.toString(),
      accent: "text-green",
    },
    {
      label: "Last 7 days",
      value: last7DaysTotal.toString(),
      accent: "text-purple",
    },
    {
      label: "Widgets receiving traffic",
      value: activeWidgets.toString(),
      accent: "text-blue",
    },
    { label: "Top country", value: topCountry, accent: "text-white" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="mb-0">
            <p className="text-xs uppercase tracking-wide text-white/40">
              {card.label}
            </p>
            <p className={`mt-2 text-2xl font-semibold ${card.accent}`}>
              {card.value}
            </p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
