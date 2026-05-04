import { z } from "zod";

export const CategoryQuerySchema = z.object({
  parentId: z.string().optional(),
});

export type CategoryQueryInput = z.infer<typeof CategoryQuerySchema>;

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  productCount: number;
}
