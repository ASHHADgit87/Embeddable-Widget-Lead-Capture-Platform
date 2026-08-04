import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/db/submissions.repository";
import { listSubmissionsForTenant } from "@/lib/db/submissions.repository";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SubmissionsTable } from "@/components/dashboard/submissions-table";
import { GeoBreakdownChart } from "@/components/dashboard/geo-breakdown-chart";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [stats, recentSubmissions] = await Promise.all([
    getDashboardStats(session.user.id),
    listSubmissionsForTenant(session.user.id, { limit: 10 }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-graphite-100">Overview</h1>
        <p className="mt-1 text-sm text-graphite-400">
          Submissions and activity across all your widgets.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-graphite-300">
            Recent submissions
          </h2>
          <SubmissionsTable submissions={recentSubmissions} />
        </div>
        <GeoBreakdownChart geoBreakdown={stats.geoBreakdown} />
      </div>
    </div>
  );
}
