import { fetchFromIpApi, fetchFromIpapiCo } from "./providers";
import type { GeoResult } from "@/types";

type GeoProviderFn = (ip: string) => Promise<{
  country: string | null;
  region: string | null;
  city: string | null;
}>;

interface GeoProviderConfig {
  name: string;
  fn: GeoProviderFn;
}

const providerChain: GeoProviderConfig[] = [
  { name: "ip-api.com", fn: fetchFromIpApi },
  { name: "ipapi.co", fn: fetchFromIpapiCo },
];

const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^::1$/,
  /^unknown$/,
];

function isPrivateOrUnknownIp(ip: string): boolean {
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(ip));
}

export async function enrichWithGeo(ipAddress: string): Promise<GeoResult> {
  if (isPrivateOrUnknownIp(ipAddress)) {
    return {
      country: null,
      region: null,
      city: null,
      provider: null,
      failed: true,
    };
  }

  for (const provider of providerChain) {
    try {
      const result = await provider.fn(ipAddress);
      return { ...result, provider: provider.name, failed: false };
    } catch {
      continue;
    }
  }

  return {
    country: null,
    region: null,
    city: null,
    provider: null,
    failed: true,
  };
}
export function buildEnrichWithMockProviders(providers: GeoProviderConfig[]) {
  return async function enrich(ipAddress: string): Promise<GeoResult> {
    for (const provider of providers) {
      try {
        const result = await provider.fn(ipAddress);
        return { ...result, provider: provider.name, failed: false };
      } catch {
        continue;
      }
    }
    return {
      country: null,
      region: null,
      city: null,
      provider: null,
      failed: true,
    };
  };
}
