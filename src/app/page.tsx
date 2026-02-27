import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { ImpactStats } from "@/components/landing/impact-stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturedProfiles } from "@/components/landing/featured-profiles";
import { FAQSection } from "@/components/landing/faq-section";
import { TransparencySection } from "@/components/landing/transparency-section";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: statsData } = await supabase
    .from("donations")
    .select("amount")
    .eq("status", "completed");

  const { count: familiesCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const totalRaised = statsData?.reduce((sum, d) => sum + d.amount, 0) ?? 0;

  const { data: deliveriesData } = await supabase
    .from("deliveries")
    .select("amount");

  const totalDelivered = deliveriesData?.reduce((sum, d) => sum + d.amount, 0) ?? 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ImpactStats
          totalRaised={totalRaised}
          totalDelivered={totalDelivered}
          familiesHelped={familiesCount ?? 0}
        />
        <HowItWorks />
        <FeaturedProfiles profiles={profiles ?? []} />
        <TransparencySection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
