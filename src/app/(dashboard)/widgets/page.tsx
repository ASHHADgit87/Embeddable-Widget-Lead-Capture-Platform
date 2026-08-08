import Link from "next/link";
import { auth } from "@/auth";
import { listWidgetsForTenant } from "@/lib/db/widgets.repository";
import { WidgetListItem } from "@/components/widgets/widget-list-item";
import { Button } from "@/components/ui/button";
import { AmbientBubbles } from "@/components/three/ambient-bubbles";

export default async function WidgetsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const widgets = await listWidgetsForTenant(userId);

  return (
    <div className="relative">
      <AmbientBubbles />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Widgets</h1>
          <Link href="/widgets/new">
            <Button variant="secondary">New widget</Button>
          </Link>
        </div>

        {widgets.length === 0 ? (
          <p className="rounded-md border border-dashed border-[#5b2f99] p-8 text-center text-sm text-white/40">
            No widgets yet. Create your first one.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {widgets.map((widget) => (
              <WidgetListItem key={widget.id} widget={widget} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
