"use client";

import { useMemo } from "react";

interface WidgetPreviewProps {
  widgetId: string;
  bundleVersion: number;
}

export function WidgetPreview({ widgetId, bundleVersion }: WidgetPreviewProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const srcDoc = useMemo(
    () => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0d0116;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
    </style>
  </head>
  <body>
    <script src="${appUrl}/api/widget-bundle/v${bundleVersion}?id=${widgetId}"></script>
  </body>
</html>`,
    [appUrl, bundleVersion, widgetId],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[#5b2f99] bg-[#0d0116]">
      <div className="flex items-center gap-1.5 border-b border-[#5b2f99] bg-[#15072d] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff6b6b]/60" />
        <span className="h-2 w-2 rounded-full bg-[#f4d35b]/60" />
        <span className="h-2 w-2 rounded-full bg-green/60" />
        <span className="ml-2 font-mono text-[10px] text-white/30">
          Live preview — real embed bundle
        </span>
      </div>
      <iframe
        title="Widget preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin allow-forms"
        className="h-[380px] w-full"
      />
    </div>
  );
}
