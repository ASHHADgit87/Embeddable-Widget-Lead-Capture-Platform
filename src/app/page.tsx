import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RotatingStructure } from "@/components/three/rotating-structure";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-20 lg:grid-cols-2 lg:py-32">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-green">
            Embeddable widgets, hardened for the open internet
          </p>
          <h1 className="mb-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            One script tag.
            <br />A backend that survives the internet.
          </h1>
          <p className="mb-8 max-w-lg text-white/60">
            Create a widget, hand out a single embed snippet, and safely accept
            submissions from any website you don&apos;t control — validated,
            rate-limited, spam-filtered, and geo-enriched.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button size="lg">Get started</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="h-[420px] w-full lg:h-[520px]">
          <RotatingStructure shape="icosahedron" size={2.2} />
        </div>
      </section>

      <FeaturesSection />
      <Footer />
    </main>
  );
}
