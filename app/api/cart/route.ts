import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";
import { authService } from "@/modules/auth/auth.service";
import { cartService } from "@/modules/cart/cart.service";
import { AddCartItemSchema } from "@/modules/cart/cart.types";

export async function GET() {
  try {
    const user = await authService.requireSession();
    const cart = await cartService.getCart(user.id);
    return NextResponse.json({ cart });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authService.requireSession();
    const body: unknown = await req.json();
    const input = AddCartItemSchema.parse(body);
    const item = await cartService.addItem(user.id, input);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await authService.requireSession();
    const { searchParams } = req.nextUrl;
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { error: "productId query param required" },
        { status: 400 }
      );
    }
    await cartService.removeItem(user.id, productId);
    return NextResponse.json({ success: true });
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
  logger.error({ err }, "Unhandled error in cart route");
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
