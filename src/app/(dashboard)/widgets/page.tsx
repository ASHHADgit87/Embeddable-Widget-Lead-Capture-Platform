import Link from "next/link";
import { auth } from "@/auth";
import { listWidgetsForTenant } from "@/lib/db/widgets.repository";
import { WidgetListItem } from "@/components/widgets/widget-list-item";
import { Button } from "@/components/ui/button";

export default async function WidgetsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const widgets = await listWidgetsForTenant(userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-50">Widgets</h1>
        <Link href="/widgets/new">
          <Button>New widget</Button>
        </Link>
      </div>

      {widgets.length === 0 ? (
        <p className="rounded-md border border-dashed border-neutral-700 p-8 text-center text-sm text-neutral-500">
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
  );
}
