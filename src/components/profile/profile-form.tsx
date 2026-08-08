"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  AuthFormSection,
  authCardClassName,
} from "@/components/auth/auth-form-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
}

export function ProfileForm({ initialName, initialEmail }: ProfileFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
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
    await updateSession({ name, email });

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-white/70">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-white/70">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={200}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-white/70">
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
            <label className="mb-1.5 block text-sm text-white/70">
              Current password (required to save)
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-purple">{error}</p>}
        {success && <p className="text-sm text-green">Profile updated.</p>}

        <Button
          type="submit"
          variant="secondary"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>

      <AuthFormSection>
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-white/70">
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
      </AuthFormSection>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12031c]/90 p-6 backdrop-blur-xl">
          <div
            className={cn(authCardClassName, "w-full max-w-sm p-6")}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ad8cff]">
              Confirm action
            </p>
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
