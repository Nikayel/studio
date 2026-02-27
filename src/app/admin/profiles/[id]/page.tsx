"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProfileForm } from "@/components/admin/profile-form";
import type { Profile } from "@/lib/types";

export default function EditProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/profiles/${params.id}`)
      .then((r) => r.json())
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">
          Update profile information
        </p>
      </div>
      <div className="mt-6">
        {loading ? (
          <div className="h-64 animate-pulse rounded bg-muted" />
        ) : profile ? (
          <ProfileForm profile={profile} />
        ) : (
          <p className="text-muted-foreground">Profile not found.</p>
        )}
      </div>
    </AdminShell>
  );
}
