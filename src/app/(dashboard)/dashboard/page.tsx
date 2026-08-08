import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getDashboardStats,
  listSubmissionsForTenant,
} from "@/lib/db/submissions.repository";
import { WiredDashboardSections } from "@/components/dashboard/wired-dashboard-sections";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const [stats, recentSubmissions] = await Promise.all([
    getDashboardStats(userId),
    listSubmissionsForTenant(userId, { limit: 10 }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 pt-2 pb-16">
      <div className="mb-10 text-center">
        <h1 className="text-xl font-semibold text-white">Overview</h1>
        <p className="mt-1 text-sm text-white/50">
          Submissions and activity across all your widgets.
        </p>
      </div>

      <WiredDashboardSections
        stats={stats}
        recentSubmissions={recentSubmissions}
      />
    </main>
  );
}
