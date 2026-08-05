import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Widget } from "@prisma/client";

interface WidgetListItemProps {
  widget: Widget;
}

const typeLabels: Record<Widget["type"], string> = {
  SIGNUP_FORM: "Signup form",
  CONTACT_FORM: "Contact form",
  CTA_POPOVER: "CTA popover",
};

export function WidgetListItem({ widget }: WidgetListItemProps) {
  return (
    <Link href={`/widgets/${widget.id}`}>
      <Card className="transition hover:border-blue/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-50">
              {widget.title}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {typeLabels[widget.type]}
            </p>
          </div>
          <Badge variant={widget.isActive ? "success" : "default"}>
            {widget.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
