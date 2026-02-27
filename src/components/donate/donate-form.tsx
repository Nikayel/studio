"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import { DONATION_PRESETS, DONATION_MIN, DONATION_MAX } from "@/lib/constants";
import type { Profile } from "@/lib/types";

interface DonateFormProps {
  profile: Profile;
}

export function DonateForm({ profile }: DonateFormProps) {
  const [amount, setAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const effectiveAmount = isCustom
    ? Math.round(parseFloat(customAmount || "0") * 100)
    : amount;

  const isValid =
    effectiveAmount >= DONATION_MIN && effectiveAmount <= DONATION_MAX;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          amount: effectiveAmount,
          donorName: donorName || undefined,
          donorEmail: donorEmail || undefined,
          message: message || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 border-b p-6">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
            {profile.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={profile.display_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground/30" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">
              Donate to {profile.display_name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>#{profile.profile_id}</span>
              {profile.location && (
                <>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <CardContent className="space-y-6 p-6">
          <div>
            <Label className="text-base font-semibold">Choose an amount</Label>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DONATION_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={!isCustom && amount === preset ? "default" : "outline"}
                  className={
                    !isCustom && amount === preset
                      ? "bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"
                      : ""
                  }
                  onClick={() => {
                    setAmount(preset);
                    setIsCustom(false);
                    setCustomAmount("");
                  }}
                >
                  {formatCurrency(preset)}
                </Button>
              ))}
            </div>
            <div className="mt-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  step="0.01"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setIsCustom(true);
                  }}
                  onFocus={() => setIsCustom(true)}
                  className="pl-7"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="donorName">Your name (optional)</Label>
              <Input
                id="donorName"
                placeholder="Shown as supporter"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="donorEmail">Email (optional, for receipt)</Label>
              <Input
                id="donorEmail"
                type="email"
                placeholder="you@example.com"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="message">Message (optional)</Label>
              <Input
                id="message"
                placeholder="A note for the family"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1.5"
                maxLength={500}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            disabled={!isValid || loading}
            size="lg"
            className="w-full bg-[hsl(var(--accent))] text-lg hover:bg-[hsl(var(--accent))]/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecting to payment...
              </>
            ) : (
              `Donate ${isValid ? formatCurrency(effectiveAmount) : ""}`
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            You&apos;ll be securely redirected to Stripe to complete your
            donation. 100% of your donation goes directly to{" "}
            {profile.display_name}.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
