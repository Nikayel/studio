export const SITE_CONFIG = {
  name: "Diaspora Bridge",
  tagline: "100% of Your Donation Reaches Afghan Families",
  description:
    "A direct donation platform for Afghan girls' education. Browse profiles, pick a person, donate. Every dollar is hand-delivered to families.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

export const DONATION_PRESETS = [2500, 5000, 10000, 25000] as const; // in cents

export const DONATION_MIN = 100; // $1.00
export const DONATION_MAX = 1000000; // $10,000.00
