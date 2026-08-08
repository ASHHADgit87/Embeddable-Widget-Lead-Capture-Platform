import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { signJwt } from "@/lib/jwt";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Not signed in" },
      },
      { status: 401 },
    );
  }

  const secret = process.env.NEXTAUTH_SECRET ?? "dev_secret";
  const token = signJwt({ sub: userId }, secret, 20 * 60 * 60);
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  return NextResponse.json({ success: true, data: { token, expiresAt } });
}
