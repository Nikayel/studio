import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DonateForm } from "@/components/donate/donate-form";
import { createClient } from "@/lib/supabase/server";

interface DonatePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DonatePageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("profile_id", id)
    .eq("is_active", true)
    .single();

  if (!profile) return { title: "Donate" };

  return {
    title: `Donate to ${profile.display_name}`,
    description: `Support ${profile.display_name} with a direct donation. 100% hand-delivered.`,
  };
}

export default async function DonatePage({ params }: DonatePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("profile_id", id)
    .eq("is_active", true)
    .single();

  if (!profile) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <DonateForm profile={profile} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
