import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";
import { productsService } from "@/modules/products/products.service";
import { ProductQuerySchema } from "@/modules/products/products.types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query = ProductQuerySchema.parse({
      category: searchParams.get("category") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    const result = await productsService.listStorefront(query);
    return NextResponse.json(result);
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
  logger.error({ err }, "Unhandled error in products route");
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
