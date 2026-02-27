import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    { data: donations },
    { data: deliveries },
    { count: profileCount },
  ] = await Promise.all([
    supabaseAdmin
      .from("donations")
      .select("*, profiles(display_name, profile_id, photo_url)")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("deliveries").select("amount"),
    supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const completedDonations =
    donations?.filter((d) => d.status === "completed") ?? [];
  const totalRaised = completedDonations.reduce(
    (sum, d) => sum + d.amount,
    0
  );
  const totalDelivered =
    deliveries?.reduce((sum, d) => sum + d.amount, 0) ?? 0;

  return NextResponse.json({
    totalRaised,
    totalDelivered,
    totalProfiles: profileCount ?? 0,
    totalDonations: completedDonations.length,
    recentDonations: (donations ?? []).slice(0, 10),
    allDonations: donations ?? [],
  });
}
