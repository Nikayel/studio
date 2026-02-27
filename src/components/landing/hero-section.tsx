import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(213,52%,35%),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[hsl(var(--secondary))]">
            100% of every dollar reaches families
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            Every Dollar.{" "}
            <span className="text-[hsl(var(--accent))]">Hand-Delivered.</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 md:text-xl">
            I travel to Afghanistan, film the families, and hand-deliver your
            donations directly. No NGOs. No overhead. No middlemen. Just you and
            the family you choose to help.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[hsl(var(--accent))] text-lg hover:bg-[hsl(var(--accent))]/90"
            >
              <Link href="/profiles">
                See Who You Can Help
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-lg text-white hover:bg-white/10"
            >
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
