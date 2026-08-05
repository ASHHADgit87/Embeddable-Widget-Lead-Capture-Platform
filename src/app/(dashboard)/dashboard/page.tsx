import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getDashboardStats,
  listSubmissionsForTenant,
} from "@/lib/db/submissions.repository";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SubmissionsTable } from "@/components/dashboard/submissions-table";
import { GeoBreakdownChart } from "@/components/dashboard/geo-breakdown-chart";
import { RotatingStructure } from "@/components/three/rotating-structure";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const [stats, recentSubmissions] = await Promise.all([
    getDashboardStats(userId),
    listSubmissionsForTenant(userId, { limit: 10 }),
  ]);

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Overview</h1>
          <p className="mt-1 text-sm text-white/50">
            Submissions and activity across all your widgets.
          </p>
        </div>

        <StatsCards stats={stats} />

        <div>
          <h2 className="mb-3 text-sm font-medium text-white/70">
            Recent submissions
          </h2>
          <SubmissionsTable submissions={recentSubmissions} />
        </div>

        <GeoBreakdownChart geoBreakdown={stats.geoBreakdown} />
      </div>

      <div className="hidden h-[500px] lg:block">
        <RotatingStructure shape="torusKnot" size={1.6} />
      </div>
    </main>
  );
}
