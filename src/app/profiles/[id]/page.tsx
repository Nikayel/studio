import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, User, ArrowLeft, Heart } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, goals, location")
    .eq("profile_id", id)
    .eq("is_active", true)
    .single();

  if (!profile) return { title: "Profile Not Found" };

  return {
    title: `${profile.display_name} — Support Their Education`,
    description: profile.goals
      ? `"${profile.goals}" — ${profile.display_name} from ${profile.location || "Afghanistan"}. 100% of your donation is hand-delivered.`
      : `Support ${profile.display_name} from ${profile.location || "Afghanistan"}. 100% of your donation is hand-delivered.`,
    openGraph: {
      title: `Support ${profile.display_name}`,
      description: `100% of your donation goes directly to ${profile.display_name}. Hand-delivered, no middlemen.`,
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("profile_id", id)
    .eq("is_active", true)
    .single();

  if (!profile) notFound();

  const progressPercent =
    profile.funding_goal > 0
      ? Math.min(
          Math.round((profile.amount_raised / profile.funding_goal) * 100),
          100
        )
      : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Back link */}
        <div className="mx-auto max-w-4xl px-4 pt-6">
          <Link
            href="/profiles"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            All Profiles
          </Link>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Photo */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
              {profile.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.display_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <User className="h-24 w-24 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-primary">
                    {profile.display_name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">#{profile.profile_id}</Badge>
                    {profile.location && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Goals quote */}
              {profile.goals && (
                <blockquote className="mt-6 border-l-4 border-[hsl(var(--accent))] pl-4">
                  <p className="text-lg italic text-foreground/80">
                    &ldquo;{profile.goals}&rdquo;
                  </p>
                </blockquote>
              )}

              {/* Bio */}
              {profile.bio && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Their Story
                  </h2>
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-foreground/80">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Funding progress */}
              {profile.show_amount_raised && profile.funding_goal > 0 && (
                <div className="mt-6 rounded-lg border bg-card p-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">
                      {formatCurrency(profile.amount_raised)} raised
                    </span>
                    <span className="text-muted-foreground">
                      of {formatCurrency(profile.funding_goal)} goal
                    </span>
                  </div>
                  <Progress value={progressPercent} className="mt-3 h-3" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {progressPercent}% of goal reached
                  </p>
                </div>
              )}

              {/* Donate CTA */}
              <div className="mt-8 space-y-3">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-[hsl(var(--accent))] text-lg hover:bg-[hsl(var(--accent))]/90"
                >
                  <Link href={`/donate/${profile.profile_id}`}>
                    <Heart className="mr-2 h-5 w-5" />
                    Donate to {profile.display_name}
                  </Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  100% of your donation is hand-delivered directly to{" "}
                  {profile.display_name}. No fees, no middlemen.
                </p>
              </div>

              {/* Trust note */}
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Verified in person.
                  </span>{" "}
                  I met {profile.display_name} during my trip to{" "}
                  {profile.location || "Afghanistan"} and verified their
                  situation firsthand. Follow my journey on social media for
                  proof of delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
