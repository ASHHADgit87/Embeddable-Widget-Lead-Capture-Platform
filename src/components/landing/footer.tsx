"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Mail } from "lucide-react";

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

  return (
    <footer className="border-t border-blue-900 bg-blue-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Widget Platform"
                width={180}
                height={38}
              />
            </Link>
            <p className="max-w-xs text-sm text-white/50">
              An embeddable widget and lead-capture engine built for the open
              internet — validated, rate-limited, and enriched, request by
              request.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a
                href="mailto:hello@widgetplatform.dev"
                className="flex items-center gap-2 text-white/60 transition hover:text-green"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                hello@widgetplatform.dev
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/60 transition hover:text-purple"
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
                    className="text-sm text-white/50 transition hover:text-green"
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
                    className="text-sm text-white/50 transition hover:text-purple"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
            <ul className="mb-6 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition hover:text-[#6f9dfb]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mb-2 text-sm font-semibold text-white">Subscribe</h4>
            <p className="mb-3 text-xs text-white/40">
              Build notes and engineering updates, occasionally.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="w-full rounded-md border border-blue-800 bg-blue-900/60 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-green focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-green px-3 py-2 text-sm font-medium text-blue-950 transition hover:bg-green-dark"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-blue-900 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {currentYear} Widget Platform. All rights reserved.</p>
          <p>Built with Next.js, Prisma, and Neon Postgres.</p>
          <p>FlyRank Backend Engineering Internship — Capstone Project.</p>
        </div>
      </div>
    </footer>
  );
}
