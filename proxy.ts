import { NextRequest, NextResponse } from "next/server";
import {
  readSessionValue,
  roleHomePaths,
  sessionCookieName,
  type UserRole,
} from "./app/lib/auth";

const protectedRoutes: Record<string, UserRole> = {
  "/admin": "admin",
  "/pengurus": "pengurus",
  "/bendahara": "bendahara",
  "/ustadz": "ustadz",
};

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const protectedEntry = Object.entries(protectedRoutes).find(
    ([route]) => path === route || path.startsWith(`${route}/`),
  );
  const session = readSessionValue(req.cookies.get(sessionCookieName)?.value);

  if (path === "/login" && session) {
    return NextResponse.redirect(new URL(roleHomePaths[session.role], req.url));
  }

  if (!protectedEntry) {
    return NextResponse.next();
  }

  const [, requiredRole] = protectedEntry;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session.role !== requiredRole) {
    return NextResponse.redirect(new URL(roleHomePaths[session.role], req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/pengurus/:path*", "/bendahara/:path*", "/ustadz/:path*"],
};
