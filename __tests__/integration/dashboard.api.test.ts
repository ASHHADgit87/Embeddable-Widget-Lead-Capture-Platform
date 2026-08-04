import { describe, it, expect } from "vitest";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";

describe("GET /api/dashboard/stats (requires dev server running)", () => {
  it("rejects unauthenticated requests with 401", async () => {
    const response = await fetch(`${BASE_URL}/api/dashboard/stats`);
    expect(response.status).toBe(401);
  });
});

describe("GET /api/widgets/:id/config (public, no auth required)", () => {
  it("serves the config with a Cache-Control header for an active widget", async () => {
    const response = await fetch(
      `${BASE_URL}/api/widgets/seed-widget-1/config`,
      {
        headers: { Origin: "http://127.0.0.1:8080" },
      },
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("max-age");
  });

  it("returns 404 for a non-existent widget", async () => {
    const response = await fetch(
      `${BASE_URL}/api/widgets/does-not-exist/config`,
      {
        headers: { Origin: "http://127.0.0.1:8080" },
      },
    );
    expect(response.status).toBe(404);
  });
});
