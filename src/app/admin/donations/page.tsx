"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateRelative } from "@/lib/format";
import type { DonationWithProfile } from "@/lib/types";

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<DonationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setDonations(data.allDonations ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColor: Record<string, "default" | "secondary" | "destructive"> = {
    completed: "default",
    pending: "secondary",
    failed: "destructive",
    refunded: "destructive",
  };

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold">Donations</h1>
        <p className="text-muted-foreground">All donation records</p>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-12 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : donations.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">
          No donations yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {donations.map((d) => (
            <Card key={d.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {d.donor_name || "Anonymous"}
                    </span>
                    <span className="text-muted-foreground">&rarr;</span>
                    <span className="font-medium">
                      {d.profiles.display_name}
                    </span>
                    <Badge variant={statusColor[d.status] ?? "secondary"}>
                      {d.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    #{d.profiles.profile_id} &middot;{" "}
                    {formatDateRelative(d.created_at)}
                    {d.donor_email && ` · ${d.donor_email}`}
                  </p>
                  {d.message && (
                    <p className="mt-1 text-sm italic text-muted-foreground">
                      &ldquo;{d.message}&rdquo;
                    </p>
                  )}
                </div>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(d.amount)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
