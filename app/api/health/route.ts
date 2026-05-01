import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger/logger";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (err) {
    logger.error({ err }, "Health check failed");
    return NextResponse.json(
      { status: "error", db: "disconnected" },
      { status: 503 }
    );
  }
}
