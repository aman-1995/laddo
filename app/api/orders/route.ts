import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";
import { authService } from "@/modules/auth/auth.service";
import { ordersService } from "@/modules/orders/orders.service";
import { CreateOrderSchema } from "@/modules/orders/orders.types";

export async function GET() {
  try {
    const user = await authService.requireSession();
    const orders = await ordersService.getUserOrders(user.id);
    return NextResponse.json({ orders });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authService.requireSession();
    const body: unknown = await req.json();
    const input = CreateOrderSchema.parse(body);
    const order = await ordersService.createOrder(user.id, input);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err: unknown) {
  if (err instanceof AppError) {
    return NextResponse.json(
      { error: err.message, code: err.code },
      { status: err.statusCode }
    );
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation error", details: err.flatten() },
      { status: 400 }
    );
  }
  logger.error({ err }, "Unhandled error in orders route");
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
