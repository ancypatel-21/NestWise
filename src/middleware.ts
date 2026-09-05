import { NextResponse, type NextRequest } from "next/server";

/**
 * Expose the current pathname to server components (used by the app layout to enforce kid-mode
 * route restrictions). Auth redirects are handled in layouts via the session helpers.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("x-pathname", req.nextUrl.pathname);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
