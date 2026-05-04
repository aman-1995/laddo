import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/errors/app-error";
import { cartRepo } from "./cart.repo";
import type { AddCartItemInput } from "./cart.types";

export const cartService = {
  async getCart(userId: string) {
    return cartRepo.findByUserId(userId);
  },

  async addItem(userId: string, input: AddCartItemInput) {
    const inventory = await prisma.inventory.findUnique({
      where: { variantId: input.variantId },
    });
    if (!inventory) throw AppError.notFound("Product variant not found");
    const available = inventory.quantity - inventory.reserved;
    if (available < input.quantity) {
      throw AppError.badRequest("Insufficient stock");
    }
    return cartRepo.upsertItem(userId, input.variantId, input.quantity);
  },

  async removeItem(userId: string, variantId: string) {
    const item = await cartRepo.findItem(userId, variantId);
    if (!item) throw AppError.notFound("Cart item not found");
    return cartRepo.deleteItem(userId, variantId);
  },

  async clearCart(userId: string) {
    return cartRepo.clearCart(userId);
  },
};
