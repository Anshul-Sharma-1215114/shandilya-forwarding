import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

// Next.js 16 renamed Middleware to "Proxy" - file must be named proxy.ts and
// export a function named `proxy` (see node_modules/next/dist/docs/01-app/
// 03-api-reference/03-file-conventions/proxy.md). This is only an optimistic
// edge-level gate; every seller page/action independently re-verifies the
// session against the backend (see src/lib/seller-session.ts), since a
// cookie's mere presence doesn't prove it's a valid, unexpired seller token.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (pathname === "/seller/login") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/seller", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL("/seller/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/seller/:path*"],
};
