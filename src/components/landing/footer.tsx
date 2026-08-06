"use client";

import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";

const productLinks = [
  { href: "/register", label: "Get started" },
  { href: "/login", label: "Sign in" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/widgets", label: "Widgets" },
];

const platformLinks = [
  { href: "#features", label: "Public Submission API" },
  { href: "#features", label: "Rate Limiting & Abuse Protection" },
  { href: "#features", label: "Geo Enrichment" },
  { href: "#features", label: "Tenant Isolation" },
];

const legalLinks = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/cookies", label: "Cookie Policy" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const yearText = currentYear === 2026 ? "2026" : `2026-${currentYear}`;

  return (
    <footer className="bg-gradient-to-b from-[#18071f] via-[#150419] to-[#12021f]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-4  inline-flex items-center">
              <Image src="/logo.png" alt="WidgetLy" width={180} height={38} />
            </Link>
            <p className="max-w-xs text-sm text-white/50">
              An embeddable widget and lead-capture engine built for the open
              internet — validated, rate-limited, and enriched, request by
              request.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a
                href="https://github.com/ashhadgit87/widgetly"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/60 transition hover:text-[#c8b0ff]"
              >
                <Github className="h-4 w-4" strokeWidth={1.5} />
                View source on GitHub
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition hover:text-[#c8b0ff]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition hover:text-[#c8b0ff]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition hover:text-[#c8b0ff]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="py-6 text-center text-sm font-semibold text-white/70">
        <p>
          Copyright © {yearText} Widget Platform — Muhammad Ashhadullah Zaheer.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
