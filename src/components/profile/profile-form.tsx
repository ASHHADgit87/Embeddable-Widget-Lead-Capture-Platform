"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function handleDeleteAccount() {
    setDeleteError(null);
    setIsDeleting(true);

    const response = await fetch("/api/profile", { method: "DELETE" });
    const json = await response.json();
    setIsDeleting(false);

    if (!json.success) {
      setDeleteError(json.error?.message ?? "Delete failed.");
      return;
    }

    try {
      localStorage.removeItem("app_token");
      localStorage.removeItem("app_token_expires");
    } catch {}

    await signOut({ callbackUrl: "/" });
  }

  function closeDeleteConfirm() {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  }

  return (
    <div className="space-y-4">
      <Link href="/dashboard">
        <Button variant="ghost" className="w-full">
          Back to dashboard
        </Button>
      </Link>

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

      <div className="rounded-lg border border-blue-800 bg-blue-900/60 p-6 backdrop-blur-sm">
        <p className="mb-3 text-sm text-white/70">
          Permanently delete your account and all associated data.
        </p>
        <Button
          type="button"
          variant="danger"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete account
        </Button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12021f]/95 p-6 backdrop-blur-xl">
          <div
            className="w-full max-w-sm rounded-lg border border-blue-800 bg-blue-900/70 p-6 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            <h2
              id="delete-account-title"
              className="mb-2 text-lg font-semibold text-white"
            >
              Delete account?
            </h2>
            <p className="mb-6 text-sm text-white/60">
              This will permanently remove your account, widgets, and all lead
              data from the database. This action cannot be undone.
            </p>

            {deleteError && (
              <p className="mb-4 text-sm text-purple">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={closeDeleteConfirm}
                disabled={isDeleting}
              >
                No
              </Button>
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Yes, delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
