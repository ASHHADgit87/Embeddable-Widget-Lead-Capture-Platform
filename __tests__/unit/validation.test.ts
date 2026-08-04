import { describe, it, expect } from "vitest";
import {
  createWidgetSchema,
  submissionPayloadSchema,
} from "@/lib/validation/schemas";

describe("createWidgetSchema", () => {
  it("accepts a valid widget payload", () => {
    const result = createWidgetSchema.safeParse({
      type: "SIGNUP_FORM",
      title: "Newsletter",
      buttonText: "Join",
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a widget with zero fields", () => {
    const result = createWidgetSchema.safeParse({
      type: "SIGNUP_FORM",
      title: "Newsletter",
      buttonText: "Join",
      fields: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a field name with invalid characters", () => {
    const result = createWidgetSchema.safeParse({
      type: "SIGNUP_FORM",
      title: "Newsletter",
      buttonText: "Join",
      fields: [
        { name: "bad name!", label: "Email", type: "email", required: true },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("submissionPayloadSchema", () => {
  it("rejects a payload with more than 20 fields", () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < 21; i += 1) data[`field_${i}`] = "value";

    const result = submissionPayloadSchema.safeParse({ widgetId: "w1", data });
    expect(result.success).toBe(false);
  });

  it("rejects a field value over 2000 characters", () => {
    const result = submissionPayloadSchema.safeParse({
      widgetId: "w1",
      data: { message: "a".repeat(2001) },
    });
    expect(result.success).toBe(false);
  });
});
