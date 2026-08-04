import { describe, it, expect } from "vitest";
import { buildEnrichWithMockProviders } from "@/lib/geo/enrich";

describe("geo provider fallback chain", () => {
  it("uses provider A when it succeeds", async () => {
    const enrich = buildEnrichWithMockProviders([
      {
        name: "A",
        fn: async () => ({ country: "A-land", region: null, city: null }),
      },
      {
        name: "B",
        fn: async () => ({ country: "B-land", region: null, city: null }),
      },
    ]);
    const result = await enrich("203.0.113.5");
    expect(result.provider).toBe("A");
    expect(result.country).toBe("A-land");
    expect(result.failed).toBe(false);
  });

  it("falls back to provider B when provider A fails", async () => {
    const enrich = buildEnrichWithMockProviders([
      {
        name: "A",
        fn: async () => {
          throw new Error("down");
        },
      },
      {
        name: "B",
        fn: async () => ({ country: "B-land", region: null, city: null }),
      },
    ]);
    const result = await enrich("203.0.113.5");
    expect(result.provider).toBe("B");
    expect(result.failed).toBe(false);
  });

  it("degrades gracefully when every provider fails", async () => {
    const enrich = buildEnrichWithMockProviders([
      {
        name: "A",
        fn: async () => {
          throw new Error("down");
        },
      },
      {
        name: "B",
        fn: async () => {
          throw new Error("down");
        },
      },
    ]);
    const result = await enrich("203.0.113.5");
    expect(result.failed).toBe(true);
    expect(result.country).toBeNull();
  });
});
