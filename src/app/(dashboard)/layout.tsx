import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-graphite-950">
      <header className="border-b border-graphite-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-graphite-100"
            >
              Widget Platform
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-graphite-400 hover:text-graphite-100"
            >
              Overview
            </Link>
            <Link
              href="/widgets"
              className="text-sm text-graphite-400 hover:text-graphite-100"
            >
              Widgets
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-graphite-400">
              {session?.user?.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
