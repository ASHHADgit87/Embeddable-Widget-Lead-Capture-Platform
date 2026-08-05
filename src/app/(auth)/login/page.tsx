"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ParticleField } from "@/components/three/particle-field";

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
    <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <ParticleField />
      <div className="relative z-10 w-full max-w-sm rounded-lg border border-blue-800 bg-blue-900/70 p-8 backdrop-blur-md">
        <h1 className="mb-1 text-xl font-semibold text-white">Sign in</h1>
        <p className="mb-6 text-sm text-white/50">
          Access your widget dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-white/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-blue-700 bg-blue-900 px-3 py-2 text-sm text-white outline-none focus:border-green"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-white/70"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-blue-700 bg-blue-900 px-3 py-2 text-sm text-white outline-none focus:border-green"
            />
          </div>

          {error && <p className="text-sm text-purple">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-green px-4 py-2 text-sm font-medium text-blue-950 transition hover:bg-green-dark disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          No account?{" "}
          <Link href="/register" className="text-purple hover:text-purple-dark">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
