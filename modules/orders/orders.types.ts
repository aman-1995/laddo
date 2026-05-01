import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
