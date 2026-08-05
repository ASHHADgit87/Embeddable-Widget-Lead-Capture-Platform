import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { updateProfileSchema } from "@/lib/validation/schemas";
import type { ApiResponse } from "@/types";

export async function PATCH(
  request: Request,
): Promise<NextResponse<ApiResponse<{ updated: true }>>> {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INVALID_JSON", message: "Invalid JSON" },
      },
      { status: 400 },
    );
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      },
      { status: 404 },
    );
  }

  const passwordValid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!passwordValid) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_PASSWORD",
          message: "Current password is incorrect",
        },
      },
      { status: 401 },
    );
  }

  if (parsed.data.email && parsed.data.email !== user.email) {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "EMAIL_TAKEN", message: "Email already in use" },
        },
        { status: 409 },
      );
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(parsed.data.name && { name: parsed.data.name }),
      ...(parsed.data.email && { email: parsed.data.email }),
      ...(parsed.data.newPassword && {
        passwordHash: await bcrypt.hash(parsed.data.newPassword, 12),
      }),
    },
  });

  return NextResponse.json({ success: true, data: { updated: true } });
}
