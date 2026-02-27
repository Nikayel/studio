import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProfilesGrid } from "@/components/profiles/profiles-grid";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Browse Profiles",
  description:
    "Browse verified profiles of Afghan families and students. Choose someone to support with a direct donation.",
};

export default async function ProfilesPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary md:text-4xl">
              Who You Can Help
            </h1>
            <p className="mt-3 text-muted-foreground">
              Every person below has been verified in-person. Pick someone whose
              story moves you.
            </p>
          </div>
          <ProfilesGrid profiles={profiles ?? []} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
