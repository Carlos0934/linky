import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;

  request.headers.set("x-url", request.url);
  request.headers.set("x-origin", origin);
  request.headers.set("x-pathname", pathname);
  request.headers.set("x-query", url.searchParams.toString());

  return NextResponse.next({ request });
}
