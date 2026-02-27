import Link from "next/link";
import Image from "next/image";
import { MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";
import type { Profile } from "@/lib/types";

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const progressPercent =
    profile.funding_goal > 0
      ? Math.min(
          Math.round((profile.amount_raised / profile.funding_goal) * 100),
          100
        )
      : 0;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-muted">
        {profile.photo_url ? (
          <Image
            src={profile.photo_url}
            alt={profile.display_name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <User className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{profile.display_name}</h3>
            {profile.location && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </p>
            )}
          </div>
          <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            #{profile.profile_id}
          </span>
        </div>

        {profile.goals && (
          <p className="mt-3 line-clamp-2 text-sm italic text-muted-foreground">
            &ldquo;{profile.goals}&rdquo;
          </p>
        )}

        {profile.show_amount_raised && profile.funding_goal > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {formatCurrency(profile.amount_raised)} raised
              </span>
              <span className="text-muted-foreground">
                of {formatCurrency(profile.funding_goal)}
              </span>
            </div>
            <Progress value={progressPercent} className="mt-2 h-2" />
          </div>
        )}

        <Button
          asChild
          className="mt-4 w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"
        >
          <Link href={`/donate/${profile.profile_id}`}>Donate</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
