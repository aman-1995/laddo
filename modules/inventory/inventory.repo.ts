import { prisma } from "@/lib/db/prisma";
import { InventoryStatus } from "@prisma/client";

export const inventoryRepo = {
  async getStock(variantId: string) {
    return prisma.inventory.findUnique({ where: { variantId } });
  },

  async setStock(variantId: string, quantity: number) {
    const status: InventoryStatus =
      quantity === 0
        ? "OUT_OF_STOCK"
        : quantity <= 10
        ? "LOW_STOCK"
        : "IN_STOCK";

    return prisma.inventory.upsert({
      where: { variantId },
      update: { quantity, status },
      create: { variantId, quantity, status },
    });
  },

  async adjustStock(variantId: string, delta: number) {
    return prisma.inventory.update({
      where: { variantId },
      data: { quantity: { increment: delta } },
    });
  },
};
