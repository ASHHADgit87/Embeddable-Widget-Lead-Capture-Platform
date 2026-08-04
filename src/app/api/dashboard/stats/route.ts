import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getDashboardStats,
  type DashboardStats,
} from "@/lib/db/submissions.repository";
import type { ApiResponse } from "@/types";

export async function GET(): Promise<
  NextResponse<ApiResponse<DashboardStats>>
> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Sign in required" },
      },
      { status: 401 },
    );
  }

  const stats = await getDashboardStats(session.user.id);
  return NextResponse.json({ success: true, data: stats });
}
