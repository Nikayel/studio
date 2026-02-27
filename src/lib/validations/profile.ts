import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().min(1).max(100),
  profile_id: z
    .string()
    .min(1)
    .max(20)
    .regex(/^[A-Za-z0-9-]+$/, "Only letters, numbers, and hyphens"),
  location: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  goals: z.string().max(500).optional(),
  photo_url: z.string().url().optional().or(z.literal("")),
  funding_goal: z.number().int().min(0).default(0),
  show_amount_raised: z.boolean().default(true),
  is_active: z.boolean().default(true),
});

export type ProfileInput = z.infer<typeof profileSchema>;
