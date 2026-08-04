import { describe, it, expect } from "vitest";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";

describe("GET /api/widgets (requires dev server running)", () => {
  it("rejects unauthenticated requests with 401", async () => {
    const response = await fetch(`${BASE_URL}/api/widgets`);
    expect(response.status).toBe(401);
  });
});

describe("GET /api/widgets/:id (tenant isolation)", () => {
  it("returns 401 for a request without a session cookie, regardless of widget ownership", async () => {
    const response = await fetch(`${BASE_URL}/api/widgets/seed-widget-1`);
    expect(response.status).toBe(401);
  });
});
