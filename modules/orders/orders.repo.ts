import { prisma } from "@/lib/db/prisma";
import { OrderStatus } from "@prisma/client";

export const ordersRepo = {
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, payment: true },
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
    totalAmount: number,
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>
  ) {
    return prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: { create: items },
      },
      include: { items: true },
    });
  },

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status } });
  },
};
