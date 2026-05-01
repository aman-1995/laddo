import { z } from "zod";

export const UpdateInventorySchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().nonnegative(),
});

export type UpdateInventoryInput = z.infer<typeof UpdateInventorySchema>;
