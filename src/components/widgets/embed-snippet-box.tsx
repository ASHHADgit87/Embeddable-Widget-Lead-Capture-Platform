"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmbedSnippetBoxProps {
  widgetId: string;
  bundleVersion: number;
}

export function EmbedSnippetBox({
  widgetId,
  bundleVersion,
}: EmbedSnippetBoxProps) {
  const [copied, setCopied] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const snippet = `<script src="${appUrl}/api/widget-bundle/v${bundleVersion}?id=${widgetId}"></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-md border border-graphite-700 bg-graphite-950 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-graphite-500">
          Embed snippet
        </p>
        <Button size="sm" variant="ghost" onClick={handleCopy}>
          {copied ? (
            <Check size={14} className="mr-1" />
          ) : (
            <Copy size={14} className="mr-1" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded bg-graphite-900 p-3 font-mono text-xs text-accent">
        {snippet}
      </pre>
    </div>
  );
}
