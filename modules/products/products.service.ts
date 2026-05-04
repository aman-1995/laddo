import { AppError } from "@/lib/errors/app-error";
import { productsRepo } from "./products.repo";
import type { ProductQueryInput } from "./products.types";

export const productsService = {
  async listStorefront(query: ProductQueryInput) {
    const skip = (query.page - 1) * query.limit;
    const { items, total } = await productsRepo.findStorefront({
      categorySlug: query.category,
      skip,
      take: query.limit,
    });
    return { items, total, page: query.page, limit: query.limit };
  },

  async getProduct(id: string) {
    const product = await productsRepo.findById(id);
    if (!product) throw AppError.notFound("Product not found");
    return product;
  },
};
