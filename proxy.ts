import { NextRequest, NextResponse } from "next/server";
import {
  roleHomePaths,
  type UserRole,
} from "./app/lib/roles";

const sessionCookieName = "dd_role_session";

const protectedRoutes: Record<string, UserRole> = {
  "/super-admin": "super_admin",
  "/admin": "admin",
  "/pengurus": "pengurus",
  "/bendahara": "bendahara",
  "/ustadz": "ustadz",
};

function readProxySessionRole(value?: string): UserRole | null {
  if (!value) return null;

  const [payload] = value.split(".");
  if (!payload) return null;

  try {
    const normalized = payload.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - normalized.length % 4) % 4),
      "=",
    );
    const session = JSON.parse(atob(padded)) as { expiresAt?: number; role?: string } | null;

    if (!session?.role || !Object.keys(roleHomePaths).includes(session.role)) {
      return null;
    }

    if (typeof session.expiresAt === "number" && session.expiresAt < Date.now()) {
      return null;
    }

    return session.role as UserRole;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const protectedEntry = Object.entries(protectedRoutes).find(
    ([route]) => path === route || path.startsWith(`${route}/`),
  );
  const sessionRole = readProxySessionRole(req.cookies.get(sessionCookieName)?.value);

  if (path === "/login" && sessionRole) {
    return NextResponse.redirect(new URL(roleHomePaths[sessionRole], req.url));
  }

  if (!protectedEntry) {
    return NextResponse.next();
  }

  const [, requiredRole] = protectedEntry;

  if (!sessionRole) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (sessionRole !== requiredRole) {
    return NextResponse.redirect(new URL(roleHomePaths[sessionRole], req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/super-admin/:path*",
    "/admin/:path*",
    "/pengurus/:path*",
    "/bendahara/:path*",
    "/ustadz/:path*",
  ],
};
