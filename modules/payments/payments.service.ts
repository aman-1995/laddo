import crypto from "crypto";
import { PaymentStatus } from "@prisma/client";
import { AppError } from "@/lib/errors/app-error";
import { razorpay } from "@/lib/payments/razorpay";
import { logger } from "@/lib/logger/logger";
import { paymentsRepo } from "./payments.repo";
import { ordersRepo } from "@/modules/orders/orders.repo";
import { PAYMENT_EVENTS } from "./payments.events";
import type { InitiatePaymentInput, VerifyPaymentInput } from "./payments.types";

export const paymentsService = {
  async initiatePayment(userId: string, input: InitiatePaymentInput) {
    const order = await ordersRepo.findById(input.orderId);
    if (!order) throw AppError.notFound("Order not found");
    if (order.userId !== userId) throw AppError.forbidden();

    const rzpOrder = await razorpay.orders.create({
      amount: order.totalAmount,
      currency: "INR",
      receipt: order.id,
    });

    const payment = await paymentsRepo.create(order.id, rzpOrder.id, order.totalAmount);
    logger.info(
      { event: PAYMENT_EVENTS.INITIATED, orderId: order.id },
      "Payment initiated"
    );
    return { payment, rzpOrderId: rzpOrder.id, amount: order.totalAmount };
  },

  async verifyPayment(input: VerifyPaymentInput) {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== input.razorpaySignature) {
      throw AppError.badRequest("Invalid payment signature");
    }

    const payment = await paymentsRepo.findByRazorpayOrderId(
      input.razorpayOrderId
    );
    if (!payment) throw AppError.notFound("Payment not found");

    const updated = await paymentsRepo.updateStatus(
      payment.orderId,
      PaymentStatus.SUCCESS,
      input.razorpayPaymentId
    );
    logger.info(
      {
        event: PAYMENT_EVENTS.SUCCESS,
        razorpayPaymentId: input.razorpayPaymentId,
      },
      "Payment verified"
    );
    return updated;
  },
};
