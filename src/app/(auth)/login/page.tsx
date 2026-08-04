"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-graphite-950 px-4">
      <div className="w-full max-w-sm rounded-lg border border-graphite-700 bg-graphite-900 p-8">
        <h1 className="mb-1 text-xl font-semibold text-graphite-100">
          Sign in
        </h1>
        <p className="mb-6 text-sm text-graphite-400">
          Access your widget dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm text-graphite-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-graphite-600 bg-graphite-800 px-3 py-2 text-sm text-graphite-100 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-graphite-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-graphite-600 bg-graphite-800 px-3 py-2 text-sm text-graphite-100 outline-none focus:border-accent"
            />
          </div>

          {error && <p className="text-sm text-signal-danger">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-graphite-950 transition hover:bg-accent-bright disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-graphite-400">
          No account?{" "}
          <Link
            href="/register"
            className="text-accent hover:text-accent-bright"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
