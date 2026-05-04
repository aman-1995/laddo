import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";
import { inventoryRepo } from "./inventory.repo";
import { INVENTORY_EVENTS } from "./inventory.events";
import type { UpdateInventoryInput } from "./inventory.types";

export const inventoryService = {
  async updateStock(input: UpdateInventoryInput) {
    const existing = await inventoryRepo.getStock(input.variantId);
    if (!existing) throw AppError.notFound("Variant inventory record not found");

    const updated = await inventoryRepo.setStock(input.variantId, input.quantity);

    logger.info(
      { event: INVENTORY_EVENTS.UPDATED, variantId: input.variantId, quantity: input.quantity },
      "Inventory updated"
    );

    if (updated.quantity === 0) {
      logger.warn({ event: INVENTORY_EVENTS.OUT_OF_STOCK, variantId: input.variantId }, "Variant out of stock");
    } else if (updated.quantity <= updated.lowStockThreshold) {
      logger.warn({ event: INVENTORY_EVENTS.LOW_STOCK, variantId: input.variantId, quantity: updated.quantity }, "Low stock warning");
    }

    return updated;
  },
};
