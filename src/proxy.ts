import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

/**
 * Optimistic guard for the admin area: rejects requests without a validly signed
 * session cookie before any admin page renders. Every admin page and action still
 * performs a full database-backed check via requireAdmin().
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const sessionId = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!sessionId) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
