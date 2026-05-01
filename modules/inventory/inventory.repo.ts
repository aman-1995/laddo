import { prisma } from "@/lib/db/prisma";

export const inventoryRepo = {
  async getStock(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { inventory: true },
    });
    return product?.inventory ?? null;
  },

  async setStock(productId: string, quantity: number) {
    return prisma.product.update({
      where: { id: productId },
      data: { inventory: quantity },
    });
  },

  async adjustStock(productId: string, delta: number) {
    return prisma.product.update({
      where: { id: productId },
      data: { inventory: { increment: delta } },
    });
  },
};
