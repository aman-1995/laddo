import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/api/auth", "/api/health"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!isPublic && !req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/api/:path*"],
};
