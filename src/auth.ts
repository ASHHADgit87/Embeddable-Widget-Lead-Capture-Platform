import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/schemas";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    id?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        const isValidPassword = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!isValidPassword) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const tokenWithId = token as typeof token & { id?: string };
      if (user) {
        tokenWithId.id = (user as { id?: string }).id ?? tokenWithId.id;
      }
      return token;
    },
    async session({ session, token }) {
      const tokenWithId = token as typeof token & { id?: string };
      if (session.user) {
        session.user.id = tokenWithId.id ?? "";
      }
      return session;
    },
  },
});
