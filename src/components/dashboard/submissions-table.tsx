import { Badge } from "@/components/ui/badge";
import type { Submission } from "@prisma/client";

interface SubmissionsTableProps {
  submissions: Submission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-blue-800 p-8 text-center text-sm text-white/40">
        No submissions yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-blue-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-blue-800 bg-blue-900/60 text-white/50">
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
              className="border-b border-blue-900 last:border-0"
            >
              <td className="px-4 py-3 text-white/70">
                {new Date(submission.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-white/70">
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
              <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-white/40">
                {JSON.stringify(submission.data)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
