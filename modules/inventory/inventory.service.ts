import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";
import { inventoryRepo } from "./inventory.repo";
import { productsRepo } from "@/modules/products/products.repo";
import { INVENTORY_EVENTS } from "./inventory.events";
import type { UpdateInventoryInput } from "./inventory.types";

const LOW_STOCK_THRESHOLD = 5;

export const inventoryService = {
  async updateStock(input: UpdateInventoryInput) {
    const product = await productsRepo.findById(input.productId);
    if (!product) throw AppError.notFound("Product not found");

    const updated = await inventoryRepo.setStock(
      input.productId,
      input.quantity
    );
    logger.info(
      {
        event: INVENTORY_EVENTS.UPDATED,
        productId: input.productId,
        quantity: input.quantity,
      },
      "Inventory updated"
    );

    if (updated.inventory === 0) {
      logger.warn(
        { event: INVENTORY_EVENTS.OUT_OF_STOCK, productId: input.productId },
        "Product out of stock"
      );
    } else if (updated.inventory <= LOW_STOCK_THRESHOLD) {
      logger.warn(
        {
          event: INVENTORY_EVENTS.LOW_STOCK,
          productId: input.productId,
          inventory: updated.inventory,
        },
        "Low stock warning"
      );
    }

    return updated;
  },
};
