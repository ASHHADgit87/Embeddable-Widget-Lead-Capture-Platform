import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

export async function GET() {
  const count = await prisma.user.count();
  return NextResponse.json({ success: true, data: { user_exists: count > 0 } });
}
