import { z } from "zod";

export const deliverySchema = z.object({
  profile_id: z.string().uuid(),
  amount: z.number().int().min(1),
  local_amount: z.string().max(100).optional(),
  method: z.enum(["cash", "hawala", "bank_transfer", "mobile_money"]).default("cash"),
  notes: z.string().max(1000).optional(),
  delivered_at: z.string(),
  photo_proof_url: z.string().url().optional().or(z.literal("")),
});

export type DeliveryInput = z.infer<typeof deliverySchema>;
