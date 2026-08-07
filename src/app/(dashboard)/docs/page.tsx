import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DocsScene } from "@/components/three/docs-scene";
import { PipelineFlow } from "@/components/docs/pipeline-flow";

const endpoints = [
  {
    method: "GET",
    path: "/api/widgets/:id/config",
    description:
      "Public, cached widget config. Short-lived cache headers, small payload — served the way a CDN would.",
    access: "Public · CORS",
  },
  {
    method: "POST",
    path: "/api/submissions",
    description:
      "Public submission endpoint. Validates every field, rate-limits per IP and per widget, checks the honeypot, enriches with geo, and stores — all before the response returns.",
    access: "Public · CORS",
  },
  {
    method: "GET",
    path: "/api/widget-bundle/:version",
    description:
      "Versioned widget JavaScript bundle. Cached long, immutable — bust the cache by publishing a new version.",
    access: "Public · CORS",
  },
  {
    method: "GET / POST",
    path: "/api/widgets",
    description:
      "Authenticated widget CRUD. Tenant-isolated — one account can never see another's widgets.",
    access: "Authenticated",
  },
  {
    method: "GET",
    path: "/api/widgets/:id/submissions",
    description: "Owner-only submissions for a single widget, paginated.",
    access: "Authenticated",
  },
  {
    method: "GET",
    path: "/api/dashboard/stats",
    description:
      "Aggregate counts, per-widget stats, and geo breakdown across all your widgets.",
    access: "Authenticated",
  },
];

const statusCodes = [
  { code: "200 / 201", meaning: "Submission or resource accepted and stored." },
  {
    code: "400",
    meaning: "Malformed or invalid JSON — rejected before validation runs.",
  },
  { code: "403", meaning: "Origin not in the allowed CORS list." },
  {
    code: "404",
    meaning: "Widget not found, inactive, or owned by another tenant.",
  },
  { code: "413", meaning: "Payload exceeds the maximum allowed size." },
  { code: "429", meaning: "Rate limit hit — retry after the window resets." },
];

export default async function DocsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-16">
      <div className="relative overflow-hidden rounded-2xl border border-[#5b2f99] bg-[#15072d]/70">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <DocsScene />
        </div>
        <div className="relative z-10 max-w-xl p-8">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ad8cff]">
            API reference
          </p>
          <h1 className="text-2xl font-semibold text-white">
            How submissions move through the system
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Every endpoint your widgets rely on, and the eight-stage pipeline
            every public submission passes through before it lands in your
            dashboard.
          </p>
        </div>
        <div className="h-[280px] w-full sm:h-[340px]" />
      </div>

      <div>
        <h2 className="mb-6 text-sm font-medium text-white/70">
          The hardened submission pipeline
        </h2>
        <PipelineFlow />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-white/70">Endpoints</h2>
        <div className="overflow-hidden rounded-xl border border-[#5b2f99] bg-[#15072d]/70">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#5b2f99] text-white/50">
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Path</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Access</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((endpoint) => (
                <tr
                  key={endpoint.path}
                  className="border-b border-[#5b2f99]/50 text-white/80 last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-green">
                    {endpoint.method}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#c9b3ff]">
                    {endpoint.path}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {endpoint.description}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${
                        endpoint.access === "Public · CORS"
                          ? "border-[#6f9dfb]/40 text-[#6f9dfb]"
                          : "border-purple/40 text-purple"
                      }`}
                    >
                      {endpoint.access}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-white/70">
          Response codes you&apos;ll see
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {statusCodes.map((item) => (
            <div
              key={item.code}
              className="rounded-lg border border-[#5b2f99] bg-[#15072d]/70 p-4"
            >
              <span className="font-mono text-sm text-[#c9b3ff]">
                {item.code}
              </span>
              <p className="mt-1 text-xs text-white/55">{item.meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
