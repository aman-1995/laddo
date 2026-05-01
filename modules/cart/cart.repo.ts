import { prisma } from "@/lib/db/prisma";

export const cartRepo = {
  async findByUserId(userId: string) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  },

  async findItem(userId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  },

  async upsertItem(userId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity },
      create: { userId, productId, quantity },
    });
  },

  async deleteItem(userId: string, productId: string) {
    return prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
  },

  async clearCart(userId: string) {
    return prisma.cartItem.deleteMany({ where: { userId } });
  },
};
