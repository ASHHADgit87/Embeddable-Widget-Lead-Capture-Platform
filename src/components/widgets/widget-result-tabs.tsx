"use client";

import { useState } from "react";
import { WidgetPreview } from "@/components/widgets/widget-preview";
import { EmbedSnippetBox } from "@/components/widgets/embed-snippet-box";

interface WidgetResultTabsProps {
  widgetId: string;
  bundleVersion: number;
}

type Tab = "preview" | "code";

export function WidgetResultTabs({
  widgetId,
  bundleVersion,
}: WidgetResultTabsProps) {
  const [tab, setTab] = useState<Tab>("preview");

  return (
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-[#5b2f99] bg-[#15072d]/70 p-1">
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
            tab === "preview"
              ? "bg-gradient-to-r from-[#8d5cff] via-[#b184ff] to-[#dbaefd] text-[#12021f]"
              : "text-white/50 hover:text-white"
          }`}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => setTab("code")}
          className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
            tab === "code"
              ? "bg-gradient-to-r from-[#8d5cff] via-[#b184ff] to-[#dbaefd] text-[#12021f]"
              : "text-white/50 hover:text-white"
          }`}
        >
          Code
        </button>
      </div>

      {tab === "preview" ? (
        <WidgetPreview widgetId={widgetId} bundleVersion={bundleVersion} />
      ) : (
        <EmbedSnippetBox widgetId={widgetId} bundleVersion={bundleVersion} />
      )}
    </div>
  );
}
