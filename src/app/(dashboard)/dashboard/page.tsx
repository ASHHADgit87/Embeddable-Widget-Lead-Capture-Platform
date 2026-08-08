import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getDashboardStats,
  listSubmissionsForTenant,
} from "@/lib/db/submissions.repository";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SubmissionsTable } from "@/components/dashboard/submissions-table";
import { GeoBreakdownChart } from "@/components/dashboard/geo-breakdown-chart";
import { MonitorFrame } from "@/components/dashboard/monitor-frame";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const [stats, recentSubmissions] = await Promise.all([
    getDashboardStats(userId),
    listSubmissionsForTenant(userId, { limit: 10 }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-white">Overview</h1>
        <p className="mt-1 text-sm text-white/50">
          Submissions and activity across all your widgets.
        </p>
      </div>

      <div className="space-y-16">
        <div>
          <h2 className="mb-4 text-center text-sm font-medium text-white/70">
            Stats
          </h2>
          <MonitorFrame>
            <StatsCards stats={stats} />
          </MonitorFrame>
        </div>

        <div>
          <h2 className="mb-4 text-center text-sm font-medium text-white/70">
            Recent submissions
          </h2>
          <MonitorFrame>
            <SubmissionsTable submissions={recentSubmissions} />
          </MonitorFrame>
        </div>
        <div>
          <h2 className="mb-4 text-center text-sm font-medium text-white/70">
            Geo breakdown
          </h2>
          <MonitorFrame>
            <GeoBreakdownChart geoBreakdown={stats.geoBreakdown} />
          </MonitorFrame>
        </div>
      </div>
    </main>
  );
}
