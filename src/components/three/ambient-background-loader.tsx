"use client";

import dynamic from "next/dynamic";

const AmbientBackground = dynamic(
  () => import("./ambient-background").then((mod) => mod.AmbientBackground),
  { ssr: false },
);

export function AmbientBackgroundLoader() {
  return <AmbientBackground />;
}
