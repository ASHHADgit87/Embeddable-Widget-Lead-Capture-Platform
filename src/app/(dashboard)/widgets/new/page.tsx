import { WidgetForm } from "@/components/widgets/widget-form";

export default function NewWidgetPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-graphite-100">New widget</h1>
      <WidgetForm />
    </div>
  );
}
