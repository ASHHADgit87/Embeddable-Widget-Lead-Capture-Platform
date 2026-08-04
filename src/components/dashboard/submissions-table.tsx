import { Badge } from "@/components/ui/badge";
import type { Submission } from "@prisma/client";

interface SubmissionsTableProps {
  submissions: Submission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-graphite-700 p-8 text-center text-sm text-graphite-500">
        No submissions yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-graphite-700">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-graphite-700 bg-graphite-900 text-graphite-400">
          <tr>
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Notification</th>
            <th className="px-4 py-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              className="border-b border-graphite-800 last:border-0"
            >
              <td className="px-4 py-3 text-graphite-300">
                {new Date(submission.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-graphite-300">
                {submission.geoFailed
                  ? "—"
                  : [submission.city, submission.region, submission.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
              </td>
              <td className="px-4 py-3">
                <Badge variant={submission.notifySent ? "success" : "warning"}>
                  {submission.notifySent ? "Sent" : "Failed (non-blocking)"}
                </Badge>
              </td>
              <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-graphite-400">
                {JSON.stringify(submission.data)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
