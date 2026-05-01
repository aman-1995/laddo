import { z } from "zod";

export const InitiatePaymentSchema = z.object({
  orderId: z.string().uuid(),
});

export const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type InitiatePaymentInput = z.infer<typeof InitiatePaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
