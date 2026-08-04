import { Hero } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-graphite-950">
      <Hero />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
