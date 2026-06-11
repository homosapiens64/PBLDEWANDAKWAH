import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "pengurus" | "bendahara" | "ustadz";

export type SessionUser = {
  name: string;
  role: UserRole;
};

export const sessionCookieName = "dd_role_session";

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  pengurus: "Pengurus",
  bendahara: "Bendahara",
  ustadz: "Ustadz",
};

export const roleHomePaths: Record<UserRole, string> = {
  admin: "/admin",
  pengurus: "/pengurus",
  bendahara: "/bendahara",
  ustadz: "/ustadz",
};

const sessionMaxAge = 60 * 60 * 6;

const fallbackUsers: Record<string, SessionUser & { password: string }> = {
  admin: { name: "Ahmad Hasan", password: "admin123", role: "admin" },
  pengurus: { name: "Pengurus Harian", password: "pengurus123", role: "pengurus" },
  bendahara: { name: "Bendahara", password: "bendahara123", role: "bendahara" },
  ustadz: { name: "Ustadz Konsultasi", password: "ustadz123", role: "ustadz" },
};

function getSessionSecret() {
  return process.env.AUTH_SECRET ?? "dev-secret-dewan-dakwah";
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

export function createSessionValue(user: SessionUser) {
  const expiresAt = Date.now() + sessionMaxAge * 1000;
  const payload = Buffer.from(
    JSON.stringify({ name: user.name, role: user.role, expiresAt }),
  ).toString("base64url");
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function readSessionValue(value?: string): SessionUser | null {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature || !safeCompare(signature, signPayload(payload))) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as
      | (SessionUser & { expiresAt: number })
      | null;

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    if (!Object.keys(roleHomePaths).includes(session.role)) {
      return null;
    }

    return {
      name: session.name,
      role: session.role,
    };
  } catch {
    return null;
  }
}

function isUserRole(role: string): role is UserRole {
  return Object.keys(roleHomePaths).includes(role);
}

export async function findUser(username: string, password: string) {
  try {
    const { prisma } = await import("./prisma");
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        name: true,
        password: true,
        role: true,
      },
    });

    if (!user || user.password !== password || !isUserRole(user.role)) {
      return null;
    }

    return {
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error("Gagal membaca user login dari database", error);
  }

  const fallbackUser = fallbackUsers[username];

  if (!fallbackUser || fallbackUser.password !== password) {
    return null;
  }

  return {
    name: fallbackUser.name,
    role: fallbackUser.role,
  };
}

export async function createSession(user: SessionUser) {
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, createSessionValue(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAge,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getSession() {
  const cookieStore = await cookies();
  return readSessionValue(cookieStore.get(sessionCookieName)?.value);
}

export async function requireRole(role: UserRole) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== role) {
    redirect(roleHomePaths[session.role]);
  }

  return session;
}
