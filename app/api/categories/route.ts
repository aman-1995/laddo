import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";
import { categoriesService } from "@/modules/categories/categories.service";

export async function GET() {
  try {
    const categories = await categoriesService.listCategories();
    return NextResponse.json(categories);
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    logger.error({ err }, "Unhandled error in categories route");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
