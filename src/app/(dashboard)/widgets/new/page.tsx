import { WidgetForm } from "@/components/widgets/widget-form";
import { AmbientBubbles } from "@/components/three/ambient-bubbles";

export default function NewWidgetPage() {
  return (
    <div className="relative">
      <AmbientBubbles />
      <div className="relative z-10 max-w-2xl space-y-6">
        <h1 className="text-xl font-semibold text-white">New widget</h1>
        <WidgetForm />
      </div>
    </div>
  );
}
