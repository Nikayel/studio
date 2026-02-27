import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/profiles/profile-card";
import { ArrowRight } from "lucide-react";
import type { Profile } from "@/lib/types";

interface FeaturedProfilesProps {
  profiles: Profile[];
}

export function FeaturedProfiles({ profiles }: FeaturedProfilesProps) {
  if (profiles.length === 0) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            People You Can Help Today
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each person is verified in-person. Your donation goes directly to them.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.slice(0, 3).map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/profiles">
              See All Profiles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
