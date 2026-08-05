import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { auth } from "@/auth";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Widget Platform — Embeddable Widgets & Lead Capture",
  description:
    "Create embeddable widgets and safely capture leads from any website.",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="relative antialiased">
        <Providers>
          <Navbar
            isAuthenticated={!!session?.user}
            userEmail={session?.user?.email ?? undefined}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
