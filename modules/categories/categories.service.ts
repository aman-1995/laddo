import { AppError } from "@/lib/errors/app-error";
import { categoriesRepo } from "./categories.repo";

export const categoriesService = {
  async listCategories() {
    return categoriesRepo.findAll();
  },

  async getCategory(slug: string) {
    const category = await categoriesRepo.findBySlug(slug);
    if (!category) throw AppError.notFound("Category not found");
    return category;
  },
};
