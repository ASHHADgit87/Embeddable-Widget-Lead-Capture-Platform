import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { ProfileForm } from "@/components/profile/profile-form";
import { ParticleField } from "@/components/three/particle-field";

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
    <main className="relative min-h-[calc(100vh-73px)]">
      <ParticleField />
      <div className="relative z-10 mx-auto flex max-w-md flex-col justify-center px-6 py-16">
        <h1 className="mb-1 text-2xl font-semibold text-white">Profile</h1>
        <p className="mb-8 text-sm text-white/50">
          Update your name, email, or password.
        </p>
        <ProfileForm initialName={user.name} initialEmail={user.email} />
      </div>
    </main>
  );
}
