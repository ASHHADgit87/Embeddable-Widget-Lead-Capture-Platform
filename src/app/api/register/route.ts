import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation/schemas";
import { prisma } from "@/lib/db/prisma";
import type { ApiResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON",
        },
      },
      { status: 400 },
    );
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid registration payload",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "EMAIL_TAKEN",
          message: "An account with this email already exists",
        },
      },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true },
  });

  return NextResponse.json(
    { success: true, data: { id: user.id } },
    { status: 201 },
  );
}
