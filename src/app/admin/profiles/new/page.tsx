"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { ProfileForm } from "@/components/admin/profile-form";

export default function NewProfilePage() {
  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold">Add Profile</h1>
        <p className="text-muted-foreground">
          Create a new recipient profile
        </p>
      </div>
      <div className="mt-6">
        <ProfileForm />
      </div>
    </AdminShell>
  );
}
