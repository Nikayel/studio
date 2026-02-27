"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/profiles/profile-card";
import type { Profile } from "@/lib/types";

interface ProfilesGridProps {
  profiles: Profile[];
}

export function ProfilesGrid({ profiles }: ProfilesGridProps) {
  const [search, setSearch] = useState("");

  const filtered = profiles.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.display_name.toLowerCase().includes(term) ||
      p.profile_id.toLowerCase().includes(term) ||
      (p.location && p.location.toLowerCase().includes(term))
    );
  });

  return (
    <>
      <div className="mx-auto mt-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">
            {profiles.length === 0
              ? "Profiles are coming soon. Follow us on social media for updates."
              : "No profiles match your search."}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </>
  );
}
