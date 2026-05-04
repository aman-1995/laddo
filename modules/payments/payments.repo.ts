import { prisma } from "@/lib/db/prisma";
import { PaymentStatus } from "@prisma/client";

export const paymentsRepo = {
  async findByOrderId(orderId: string) {
    return prisma.payment.findUnique({ where: { orderId } });
  },

  async findByRazorpayOrderId(razorpayOrderId: string) {
    return prisma.payment.findFirst({ where: { razorpayOrderId } });
  },

  async create(orderId: string, razorpayOrderId: string, amount: number) {
    return prisma.payment.create({
      data: { orderId, razorpayOrderId, amount },
    });
  },

  async updateStatus(
    orderId: string,
    status: PaymentStatus,
    razorpayPaymentId?: string
  ) {
    return prisma.payment.update({
      where: { orderId },
      data: { status, ...(razorpayPaymentId && { razorpayPaymentId }) },
    });
  },
};
