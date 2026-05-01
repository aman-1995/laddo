import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";
import { ordersRepo } from "./orders.repo";
import { productsRepo } from "@/modules/products/products.repo";
import { ORDER_EVENTS } from "./orders.events";
import type { CreateOrderInput } from "./orders.types";

export const ordersService = {
  async createOrder(userId: string, input: CreateOrderInput) {
    const items = await Promise.all(
      input.items.map(async (item) => {
        const product = await productsRepo.findById(item.productId);
        if (!product)
          throw AppError.notFound(`Product ${item.productId} not found`);
        if (product.inventory < item.quantity) {
          throw AppError.badRequest(
            `Insufficient inventory for product "${product.name}"`
          );
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        };
      })
    );

    const totalAmount = items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );
    const order = await ordersRepo.create(userId, totalAmount, items);

    logger.info(
      { event: ORDER_EVENTS.CREATED, orderId: order.id, userId },
      "Order created"
    );
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
