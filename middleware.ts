import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const start = Date.now();

  const res = NextResponse.next();

  const duration = Date.now() - start;

  console.log(
    `[${req.method}] ${req.nextUrl.pathname} - ${duration}ms`
  );

  return res;
}

export const config = {
  matcher: "/api/:path*",
};