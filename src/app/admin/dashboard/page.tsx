"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { DollarSign, Users, Truck, TrendingUp } from "lucide-react";

interface Stats {
  totalRaised: number;
  totalDelivered: number;
  totalProfiles: number;
  totalDonations: number;
  recentDonations: Array<{
    id: string;
    amount: number;
    donor_name: string | null;
    created_at: string;
    profiles: { display_name: string; profile_id: string };
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your impact</p>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={DollarSign}
              label="Total Raised"
              value={formatCurrency(stats.totalRaised)}
            />
            <StatCard
              icon={Truck}
              label="Total Delivered"
              value={formatCurrency(stats.totalDelivered)}
            />
            <StatCard
              icon={Users}
              label="Active Profiles"
              value={String(stats.totalProfiles)}
            />
            <StatCard
              icon={TrendingUp}
              label="Total Donations"
              value={String(stats.totalDonations)}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Recent Donations</h2>
            {stats.recentDonations.length === 0 ? (
              <p className="mt-4 text-muted-foreground">No donations yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {stats.recentDonations.map((d) => (
                  <Card key={d.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">
                          {d.donor_name || "Anonymous"} &rarr;{" "}
                          {d.profiles.display_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          #{d.profiles.profile_id} &middot;{" "}
                          {new Date(d.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(d.amount)}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="mt-6 text-muted-foreground">Failed to load stats.</p>
      )}
    </AdminShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
