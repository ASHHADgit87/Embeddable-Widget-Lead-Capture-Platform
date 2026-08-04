import { describe, it, expect } from "vitest";
import { isHoneypotTripped, stripHoneypotField } from "@/lib/spam/honeypot";

describe("isHoneypotTripped", () => {
  it("returns false when the honeypot field is empty", () => {
    expect(isHoneypotTripped({ company_website: "" }, "company_website")).toBe(
      false,
    );
  });

  it("returns true when a bot fills the honeypot field", () => {
    expect(
      isHoneypotTripped(
        { company_website: "http://spam.example" },
        "company_website",
      ),
    ).toBe(true);
  });

  it("returns false when the honeypot field is missing entirely", () => {
    expect(isHoneypotTripped({ email: "a@b.com" }, "company_website")).toBe(
      false,
    );
  });
});

describe("stripHoneypotField", () => {
  it("removes the honeypot key without affecting other fields", () => {
    const result = stripHoneypotField(
      { email: "a@b.com", company_website: "x" },
      "company_website",
    );
    expect(result).toEqual({ email: "a@b.com" });
  });
});z
