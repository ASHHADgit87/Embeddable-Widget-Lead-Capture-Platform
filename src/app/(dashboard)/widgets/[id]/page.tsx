import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getWidgetForTenant } from "@/lib/db/widgets.repository";
import { WidgetForm } from "@/components/widgets/widget-form";
import { EmbedSnippetBox } from "@/components/widgets/embed-snippet-box";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WidgetDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) return null;

  const { id } = await params;
  const widget = await getWidgetForTenant(id, session.user.id);
  if (!widget) notFound();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-graphite-100">
          {widget.title}
        </h1>
        <p className="mt-1 text-sm text-graphite-400">
          Manage this widget and its embed snippet.
        </p>
      </div>

      <EmbedSnippetBox
        widgetId={widget.id}
        bundleVersion={widget.bundleVersion}
      />

      <WidgetForm initialWidget={widget} />
    </div>
  );
}
