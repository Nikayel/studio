"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Profile } from "@/lib/types";

interface ProfileFormProps {
  profile?: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const isEditing = !!profile;

  const [formData, setFormData] = useState({
    display_name: profile?.display_name ?? "",
    profile_id: profile?.profile_id ?? "",
    location: profile?.location ?? "",
    bio: profile?.bio ?? "",
    goals: profile?.goals ?? "",
    photo_url: profile?.photo_url ?? "",
    funding_goal: profile ? String(profile.funding_goal / 100) : "",
    show_amount_raised: profile?.show_amount_raised ?? true,
    is_active: profile?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  function updateField(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePhotoUpload(): Promise<string | null> {
    if (!photoFile) return formData.photo_url || null;

    const uploadFormData = new FormData();
    uploadFormData.append("file", photoFile);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!res.ok) throw new Error("Photo upload failed");
    const { url } = await res.json();
    return url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const photoUrl = await handlePhotoUpload();

      const body = {
        display_name: formData.display_name,
        profile_id: formData.profile_id,
        location: formData.location || undefined,
        bio: formData.bio || undefined,
        goals: formData.goals || undefined,
        photo_url: photoUrl || undefined,
        funding_goal: formData.funding_goal
          ? Math.round(parseFloat(formData.funding_goal) * 100)
          : 0,
        show_amount_raised: formData.show_amount_raised,
        is_active: formData.is_active,
      };

      const url = isEditing
        ? `/api/admin/profiles/${profile.id}`
        : "/api/admin/profiles";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      toast.success(isEditing ? "Profile updated" : "Profile created");
      router.push("/admin/profiles");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => updateField("display_name", e.target.value)}
                placeholder="Fatima R."
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="profile_id">Profile ID *</Label>
              <Input
                id="profile_id"
                value={formData.profile_id}
                onChange={(e) => updateField("profile_id", e.target.value)}
                placeholder="012"
                required
                disabled={isEditing}
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Letters, numbers, hyphens only
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Kabul"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="funding_goal">Funding Goal (USD)</Label>
              <Input
                id="funding_goal"
                type="number"
                min="0"
                step="0.01"
                value={formData.funding_goal}
                onChange={(e) => updateField("funding_goal", e.target.value)}
                placeholder="500"
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio / Story</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell their story..."
              rows={3}
              className="mt-1.5"
              maxLength={1000}
            />
          </div>

          <div>
            <Label htmlFor="goals">Goals / Dreams</Label>
            <Input
              id="goals"
              value={formData.goals}
              onChange={(e) => updateField("goals", e.target.value)}
              placeholder="I want to study medicine"
              className="mt-1.5"
              maxLength={500}
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="mt-1.5"
            />
            {formData.photo_url && !photoFile && (
              <p className="mt-1 text-xs text-muted-foreground">
                Current photo set. Upload a new one to replace it.
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.show_amount_raised}
                onChange={(e) =>
                  updateField("show_amount_raised", e.target.checked)
                }
                className="h-4 w-4 rounded border"
              />
              Show amount raised publicly
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
                className="h-4 w-4 rounded border"
              />
              Active (visible on site)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Profile" : "Create Profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
