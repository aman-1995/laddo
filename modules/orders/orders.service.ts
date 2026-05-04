import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";
import { ordersRepo } from "./orders.repo";
import { ORDER_EVENTS } from "./orders.events";
import type { CreateOrderInput } from "./orders.types";

export const ordersService = {
  async createOrder(userId: string, input: CreateOrderInput) {
    const items = await Promise.all(
      input.items.map(async (item) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { inventory: true },
        });
        if (!variant) throw AppError.notFound(`Variant ${item.variantId} not found`);
        const available = (variant.inventory?.quantity ?? 0) - (variant.inventory?.reserved ?? 0);
        if (available < item.quantity) {
          throw AppError.badRequest(`Insufficient stock for "${variant.name}"`);
        }
        return { variantId: item.variantId, quantity: item.quantity, unitPrice: variant.price };
      })
    );

    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const order = await ordersRepo.create(userId, input.addressId, subtotal, subtotal, items);

    logger.info({ event: ORDER_EVENTS.CREATED, orderId: order.id, userId }, "Order created");
    return order;
  },

  async getUserOrders(userId: string) {
    return ordersRepo.findByUserId(userId);
  },

  async getOrder(id: string, userId: string) {
    const order = await ordersRepo.findById(id);
    if (!order) throw AppError.notFound("Order not found");
    if (order.userId !== userId) throw AppError.forbidden();
    return order;
  },
};
