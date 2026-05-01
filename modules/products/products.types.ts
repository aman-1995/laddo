import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().int().positive(),
  category: z.string().min(1),
  inventory: z.number().int().nonnegative().default(0),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
