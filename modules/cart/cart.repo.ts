import { prisma } from "@/lib/db/prisma";

export const cartRepo = {
  async findByUserId(userId: string) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
          },
        },
      },
    });
  },

  async findItem(userId: string, variantId: string) {
    return prisma.cartItem.findUnique({
      where: { userId_variantId: { userId, variantId } },
    });
  },

  async upsertItem(userId: string, variantId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: { userId_variantId: { userId, variantId } },
      update: { quantity },
      create: { userId, variantId, quantity },
    });
  },

  async deleteItem(userId: string, variantId: string) {
    return prisma.cartItem.delete({
      where: { userId_variantId: { userId, variantId } },
    });
  },

  async clearCart(userId: string) {
    return prisma.cartItem.deleteMany({ where: { userId } });
  },
};
