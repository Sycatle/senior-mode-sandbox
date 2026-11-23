import { NextResponse, type NextRequest } from "next/server";
import { hasApiKey } from "./lib/auth/api-key";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/health" || hasApiKey(request.headers)) {
    return NextResponse.next();
  }
  return NextResponse.json({ error: "missing_api_key" }, { status: 401 });
}

export const config = { matcher: ["/api", "/api/:path*"] };
