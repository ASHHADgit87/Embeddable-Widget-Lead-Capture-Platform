import { NextResponse } from "next/server";
import { submissionPayloadSchema } from "@/lib/validation/schemas";
import { buildCorsHeaders, handleCorsPreflight } from "@/lib/cors";
import {
  checkRateLimit,
  extractClientIp,
  ipRateLimiter,
  widgetRateLimiter,
} from "@/lib/rate-limit";
import { getWidgetById } from "@/lib/db/widgets.repository";
import { isHoneypotTripped, stripHoneypotField } from "@/lib/spam/honeypot";
import { enrichWithGeo } from "@/lib/geo/enrich";
import {
  createSubmission,
  attachNotifyResult,
} from "@/lib/db/submissions.repository";
import { notifyNewSubmission } from "@/lib/notifications/notify";
import { prisma } from "@/lib/db/prisma";

const MAX_PAYLOAD_BYTES = 10_000;

export async function OPTIONS(request: Request): Promise<Response> {
  return handleCorsPreflight(request);
}

export async function POST(request: Request): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  if (Object.keys(corsHeaders).length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "ORIGIN_NOT_ALLOWED", message: "Origin not allowed" },
      },
      { status: 403 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: "Submission payload too large",
        },
      },
      { status: 413, headers: corsHeaders },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON",
        },
      },
      { status: 400, headers: corsHeaders },
    );
  }

  const parsed = submissionPayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid submission payload",
          details: parsed.error.flatten(),
        },
      },
      { status: 400, headers: corsHeaders },
    );
  }

  const { widgetId, data } = parsed.data;

  const widget = await getWidgetById(widgetId);
  if (!widget || !widget.isActive) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "Widget not found or inactive" },
      },
      { status: 404, headers: corsHeaders },
    );
  }

  const clientIp = extractClientIp(request);

  const [ipLimit, widgetLimit] = await Promise.all([
    checkRateLimit(ipRateLimiter, clientIp),
    checkRateLimit(widgetRateLimiter, widgetId),
  ]);

  if (!ipLimit.allowed || !widgetLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many submissions, slow down",
        },
      },
      { status: 429, headers: { ...corsHeaders, "Retry-After": "60" } },
    );
  }

  if (isHoneypotTripped(data, widget.honeypotFieldName)) {
    return NextResponse.json(
      { success: true, data: { received: true } },
      { status: 200, headers: corsHeaders },
    );
  }

  const cleanData = stripHoneypotField(data, widget.honeypotFieldName);

  const geo = await enrichWithGeo(clientIp);

  const submission = await createSubmission({
    widgetId: widget.id,
    tenantId: widget.tenantId,
    data: cleanData,
    ipAddress: clientIp,
    geo,
  });

  try {
    const owner = await prisma.user.findUnique({
      where: { id: widget.tenantId },
    });
    const notifyResult = await notifyNewSubmission({
      ownerEmail: owner?.email ?? "unknown@example.com",
      widgetTitle: widget.title,
      submissionData: cleanData,
    });
    await attachNotifyResult(submission.id, notifyResult);
  } catch (error) {
    console.error(
      "[submissions] notification pipeline threw, submission already stored:",
      error,
    );
  }

  return NextResponse.json(
    { success: true, data: { id: submission.id, received: true } },
    { status: 201, headers: corsHeaders },
  );
}
