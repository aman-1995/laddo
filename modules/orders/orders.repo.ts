import { prisma } from "@/lib/db/prisma";
import { OrderStatus } from "@prisma/client";

export const ordersRepo = {
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { variant: { include: { product: true } } } }, payment: true },
    });
  },

  async findByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(
    userId: string,
    addressId: string,
    subtotal: number,
    totalAmount: number,
    items: Array<{ variantId: string; quantity: number; unitPrice: number }>
  ) {
    return prisma.order.create({
      data: {
        userId,
        addressId,
        subtotal,
        totalAmount,
        items: { create: items },
        statusHistory: { create: { status: "PLACED" } },
      },
      include: { items: true },
    });
  },

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status } });
  },
};
