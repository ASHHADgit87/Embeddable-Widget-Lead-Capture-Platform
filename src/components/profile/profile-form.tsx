"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
}

export function ProfileForm({ initialName, initialEmail }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        currentPassword,
        ...(newPassword && { newPassword }),
      }),
    });
    const json = await response.json();
    setIsSubmitting(false);

    if (!json.success) {
      setError(json.error?.message ?? "Update failed.");
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-blue-800 bg-blue-900/60 p-6 backdrop-blur-sm"
    >
      <div>
        <label className="mb-1 block text-sm text-white/70">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={120}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/70">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={200}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/70">
          New password (optional)
        </label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/70">
          Current password (required to save)
        </label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-purple">{error}</p>}
      {success && <p className="text-sm text-green">Profile updated.</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
