-- Diaspora Bridge Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Profiles: each person/family you create
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  profile_id TEXT UNIQUE NOT NULL,
  location TEXT,
  bio TEXT,
  goals TEXT,
  photo_url TEXT,
  funding_goal INTEGER DEFAULT 0,
  amount_raised INTEGER DEFAULT 0,
  show_amount_raised BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Donations: every donation through Stripe
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  donor_name TEXT,
  donor_email TEXT,
  message TEXT,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Deliveries: track cash delivery to families
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  local_amount TEXT,
  method TEXT DEFAULT 'cash',
  notes TEXT,
  delivered_at TIMESTAMPTZ DEFAULT now(),
  photo_proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_id ON profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_donations_profile_id ON donations(profile_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_session ON donations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_profile_id ON deliveries(profile_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Public: can read active profiles
CREATE POLICY "Public can view active profiles"
  ON profiles FOR SELECT
  USING (is_active = true);

-- Public: can read completed donations (for amount raised display)
CREATE POLICY "Public can view completed donations"
  ON donations FOR SELECT
  USING (status = 'completed');

-- Service role bypasses RLS automatically, so admin operations
-- using supabaseAdmin (service role key) will have full access.

-- Storage bucket for profile photos
-- Run this separately or create via Supabase dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);
