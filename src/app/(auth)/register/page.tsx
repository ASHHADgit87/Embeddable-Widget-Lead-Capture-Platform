"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import {
  AuthFormCard,
  AuthFormField,
  AuthFormFooter,
} from "@/components/auth/auth-form-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/user-exists");
        const json = await res.json();
        if (mounted && json?.success && json.data?.user_exists) {
          router.push("/login");
        }
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();
    setIsSubmitting(false);

    if (!json.success) {
      setError(json.error?.message ?? "Registration failed.");
      return;
    }

    router.push("/login");
  }

  return (
    <AuthPageShell>
      <AuthFormCard
        title="Create account"
        description="Start creating embeddable widgets."
        footer={
          <AuthFormFooter>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#c9b3ff] transition hover:text-white"
            >
              Sign in
            </Link>
          </AuthFormFooter>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthFormField label="Name" htmlFor="name">
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </AuthFormField>

          <AuthFormField label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </AuthFormField>

          <AuthFormField label="Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </AuthFormField>

          {error && <p className="text-sm text-purple">{error}</p>}

          <Button
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </AuthFormCard>
    </AuthPageShell>
  );
}
