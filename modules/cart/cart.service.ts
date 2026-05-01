import { AppError } from "@/lib/errors/app-error";
import { cartRepo } from "./cart.repo";
import { productsRepo } from "@/modules/products/products.repo";
import type { AddCartItemInput } from "./cart.types";

export const cartService = {
  async getCart(userId: string) {
    return cartRepo.findByUserId(userId);
  },

  async addItem(userId: string, input: AddCartItemInput) {
    const product = await productsRepo.findById(input.productId);
    if (!product) throw AppError.notFound("Product not found");
    if (product.inventory < input.quantity) {
      throw AppError.badRequest("Insufficient inventory");
    }
    return cartRepo.upsertItem(userId, input.productId, input.quantity);
  },

  async removeItem(userId: string, productId: string) {
    const item = await cartRepo.findItem(userId, productId);
    if (!item) throw AppError.notFound("Cart item not found");
    return cartRepo.deleteItem(userId, productId);
  },

  async clearCart(userId: string) {
    return cartRepo.clearCart(userId);
  },
};
