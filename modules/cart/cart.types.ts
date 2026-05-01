import { z } from "zod";

export const AddCartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

export type AddCartItemInput = z.infer<typeof AddCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
