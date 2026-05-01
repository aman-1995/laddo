import { AppError } from "@/lib/errors/app-error";
import { productsRepo } from "./products.repo";
import type {
  CreateProductInput,
  ProductQueryInput,
  UpdateProductInput,
} from "./products.types";

export const productsService = {
  async listProducts(query: ProductQueryInput) {
    const skip = (query.page - 1) * query.limit;
    return productsRepo.findAll({
      category: query.category,
      skip,
      take: query.limit,
    });
  },

  async getProduct(id: string) {
    const product = await productsRepo.findById(id);
    if (!product) throw AppError.notFound("Product not found");
    return product;
  },

  async createProduct(input: CreateProductInput) {
    return productsRepo.create(input);
  },

  async updateProduct(id: string, input: UpdateProductInput) {
    const product = await productsRepo.findById(id);
    if (!product) throw AppError.notFound("Product not found");
    return productsRepo.update(id, input);
  },
};
