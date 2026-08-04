import type { GeoResult } from "@/types";

interface RawGeoData {
  country: string | null;
  region: string | null;
  city: string | null;
}

const FETCH_TIMEOUT_MS = 3000;

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchFromIpApi(ip: string): Promise<RawGeoData> {
  const response = await fetchWithTimeout(
    `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city`,
    FETCH_TIMEOUT_MS,
  );

  if (!response.ok) {
    throw new Error(`ip-api.com responded with status ${response.status}`);
  }

  const json = (await response.json()) as {
    status: string;
    country?: string;
    regionName?: string;
    city?: string;
  };

  if (json.status !== "success") {
    throw new Error("ip-api.com lookup failed");
  }

  return {
    country: json.country ?? null,
    region: json.regionName ?? null,
    city: json.city ?? null,
  };
}

export async function fetchFromIpapiCo(ip: string): Promise<RawGeoData> {
  const response = await fetchWithTimeout(
    `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
    FETCH_TIMEOUT_MS,
  );

  if (!response.ok) {
    throw new Error(`ipapi.co responded with status ${response.status}`);
  }

  const json = (await response.json()) as {
    error?: boolean;
    country_name?: string;
    region?: string;
    city?: string;
  };

  if (json.error) {
    throw new Error("ipapi.co lookup failed");
  }

  return {
    country: json.country_name ?? null,
    region: json.region ?? null,
    city: json.city ?? null,
  };
}
