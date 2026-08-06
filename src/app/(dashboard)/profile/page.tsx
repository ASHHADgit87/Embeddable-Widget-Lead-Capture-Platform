import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { ProfileForm } from "@/components/profile/profile-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthFormCard } from "@/components/auth/auth-form-card";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
  if (!user) redirect("/login");

  return (
    <AuthPageShell
      maxWidth="md"
      className="-mx-6 -my-10 min-h-[calc(100vh-73px)]"
    >
      <AuthFormCard
        title="Profile"
        description="Update your name, email, or password."
        className="!p-6"
      >
        <ProfileForm initialName={user.name} initialEmail={user.email} />
      </AuthFormCard>
    </AuthPageShell>
  );
}
