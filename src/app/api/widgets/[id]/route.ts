import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateWidgetSchema } from "@/lib/validation/schemas";
import {
  getWidgetForTenant,
  updateWidgetForTenant,
  deleteWidgetForTenant,
} from "@/lib/db/widgets.repository";
import type { ApiResponse } from "@/types";
import type { Widget } from "@prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse<ApiResponse<Widget>>> {
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

  const { id } = await params;
  const widget = await getWidgetForTenant(id, session.user.id);
  if (!widget) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "Widget not found" },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: widget });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
): Promise<NextResponse<ApiResponse<Widget>>> {
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

  const parsed = updateWidgetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid widget payload",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  const { id } = await params;
  const widget = await updateWidgetForTenant(id, session.user.id, parsed.data);
  if (!widget) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "Widget not found" },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: widget });
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse<ApiResponse<{ deleted: true }>>> {
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

  const { id } = await params;
  const deleted = await deleteWidgetForTenant(id, session.user.id);
  if (!deleted) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "Widget not found" },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: { deleted: true } });
}
