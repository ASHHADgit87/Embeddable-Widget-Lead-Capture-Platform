import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "No active session" },
      },
      { status: 401 },
    );
  }

  return NextResponse.json({ success: true, data: { user: session.user } });
}
