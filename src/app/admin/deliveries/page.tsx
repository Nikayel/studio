"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { DeliveryWithProfile, Profile } from "@/lib/types";

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<DeliveryWithProfile[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    profile_id: "",
    amount: "",
    local_amount: "",
    method: "cash",
    notes: "",
    delivered_at: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/deliveries").then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
    ])
      .then(([deliveriesData, profilesData]) => {
        setDeliveries(deliveriesData);
        setProfiles(profilesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: form.profile_id,
          amount: Math.round(parseFloat(form.amount) * 100),
          local_amount: form.local_amount || undefined,
          method: form.method,
          notes: form.notes || undefined,
          delivered_at: new Date(form.delivered_at).toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to record delivery");

      toast.success("Delivery recorded");
      setDialogOpen(false);
      setForm({
        profile_id: "",
        amount: "",
        local_amount: "",
        method: "cash",
        notes: "",
        delivered_at: new Date().toISOString().split("T")[0],
      });

      // Refresh
      const updated = await fetch("/api/admin/deliveries").then((r) =>
        r.json()
      );
      setDeliveries(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deliveries</h1>
          <p className="text-muted-foreground">Track cash deliveries to families</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Delivery
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Cash Delivery</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Recipient</Label>
                <Select
                  value={form.profile_id}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, profile_id: v }))
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles
                      .filter((p) => p.is_active)
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.display_name} (#{p.profile_id})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount (USD)</Label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Local Amount (AFN)</Label>
                  <Input
                    value={form.local_amount}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        local_amount: e.target.value,
                      }))
                    }
                    placeholder="Optional"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Method</Label>
                  <Select
                    value={form.method}
                    onValueChange={(v) =>
                      setForm((prev) => ({ ...prev, method: v }))
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="hawala">Hawala</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.delivered_at}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        delivered_at: e.target.value,
                      }))
                    }
                    required
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Any context about the delivery..."
                  rows={2}
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Record Delivery
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-12 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">
          No deliveries recorded yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {deliveries.map((d) => (
            <Card key={d.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {d.profiles.display_name}
                    </span>
                    <Badge variant="secondary">{d.method}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    #{d.profiles.profile_id} &middot;{" "}
                    {formatDate(d.delivered_at)}
                    {d.local_amount && ` · ${d.local_amount} AFN`}
                  </p>
                  {d.notes && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {d.notes}
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
