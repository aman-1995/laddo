import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().int().positive(),
  category: z.string().min(1),
  inventory: z.number().int().nonnegative().default(0),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductQuerySchema = z.object({
  category: z.string().optional(), // category slug
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;

// ─── Storefront response type ────────────────────────────────────────────────

export interface StorefrontProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  primaryImage: string | null;
  primaryImageAlt: string;
  lowestPrice: number; // paise
  mrp: number; // paise
  avgRating: number;
  reviewCount: number;
  vendorName: string;
  calories: string | null; // per 100 g
  categorySlug: string;
  categoryName: string;
}

export interface StorefrontProductList {
  items: StorefrontProduct[];
  total: number;
  page: number;
  limit: number;
}
