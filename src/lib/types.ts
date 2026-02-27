export interface Profile {
  id: string;
  display_name: string;
  profile_id: string;
  location: string | null;
  bio: string | null;
  goals: string | null;
  photo_url: string | null;
  funding_goal: number;
  amount_raised: number;
  show_amount_raised: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  profile_id: string;
  amount: number;
  donor_name: string | null;
  donor_email: string | null;
  message: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
}

export interface DonationWithProfile extends Donation {
  profiles: Pick<Profile, "display_name" | "profile_id" | "photo_url">;
}

export interface Delivery {
  id: string;
  profile_id: string;
  amount: number;
  local_amount: string | null;
  method: string;
  notes: string | null;
  delivered_at: string;
  photo_proof_url: string | null;
  created_at: string;
}

export interface DeliveryWithProfile extends Delivery {
  profiles: Pick<Profile, "display_name" | "profile_id">;
}
