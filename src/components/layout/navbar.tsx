"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface NavbarProps {}

const authedLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/widgets", label: "Widgets" },
  { href: "/profile", label: "Profile" },
];

export function Navbar({}: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-blue-900 bg-blue-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Widget Platform"
              width={210}
              height={45}
              priority
            />
          </Link>
        </div>

        <nav className="hidden flex-1 justify-center items-center gap-6 sm:flex">
          <Link
            href="/"
            className={`text-sm transition ${pathname === "/" ? "text-green" : "text-white/70 hover:text-green"}`}
          >
            Home
          </Link>
          {isAuthenticated &&
            authedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${pathname === link.href ? "text-purple" : "text-white/70 hover:text-purple"}`}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => signOut({ redirectTo: "/" })}
            >
              Sign out
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="secondary">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
