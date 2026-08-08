import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listSubmissionsForTenant } from "@/lib/db/submissions.repository";
import type { ApiResponse } from "@/types";
import type { Submission } from "@prisma/client";

export async function GET(
  request: Request,
): Promise<NextResponse<ApiResponse<Submission[]>>> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Sign in required" },
      },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const widgetId = url.searchParams.get("widgetId") ?? undefined;
  const limitParam = url.searchParams.get("limit");
  const offsetParam = url.searchParams.get("offset");

  const submissions = await listSubmissionsForTenant(userId, {
    widgetId,
    limit: limitParam ? Number(limitParam) : undefined,
    offset: offsetParam ? Number(offsetParam) : undefined,
  });

  return NextResponse.json({ success: true, data: submissions });
}
