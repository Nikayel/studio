import { z } from "zod";
import { DONATION_MIN, DONATION_MAX } from "@/lib/constants";

export const donationSchema = z.object({
  profileId: z.string().uuid(),
  amount: z.number().int().min(DONATION_MIN).max(DONATION_MAX),
  donorName: z.string().max(100).optional(),
  donorEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().max(500).optional(),
});

export type DonationInput = z.infer<typeof donationSchema>;
