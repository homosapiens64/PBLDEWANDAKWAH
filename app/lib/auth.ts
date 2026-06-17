import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  educationInstitutions,
  institutionLabels,
  isEducationInstitution,
  roleHomePaths,
  roleLabels,
  type EducationInstitution,
  type UserRole,
} from "./roles";

export {
  educationInstitutions,
  institutionLabels,
  isEducationInstitution,
  roleHomePaths,
  roleLabels,
};
export type { EducationInstitution, UserRole };

export type SessionUser = {
  institution: EducationInstitution | null;
  name: string;
  role: UserRole;
};

export const sessionCookieName = "dd_role_session";

const sessionMaxAge = 60 * 60 * 6;

const fallbackUsers: Record<string, SessionUser & { password: string }> = {
  superadmin: {
    institution: null,
    name: "Super Admin",
    password: "superadmin123",
    role: "super_admin",
  },
  "admin.adi": {
    institution: "adi",
    name: "Admin ADI",
    password: "adminadi123",
    role: "admin",
  },
  "admin.alkhawarizmi": {
    institution: "al-khawarizmi",
    name: "Admin Al Khawarizmi",
    password: "adminalkhawarizmi123",
    role: "admin",
  },
  "admin.ponpes": {
    institution: "ponpes-suruh",
    name: "Admin Ponpes Suruh",
    password: "adminponpes123",
    role: "admin",
  },
  pengurus: {
    institution: null,
    name: "Pengurus Harian",
    password: "pengurus123",
    role: "pengurus",
  },
  bendahara: {
    institution: null,
    name: "Bendahara",
    password: "bendahara123",
    role: "bendahara",
  },
  ustadz: {
    institution: null,
    name: "Ustadz Konsultasi",
    password: "ustadz123",
    role: "ustadz",
  },
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
    JSON.stringify({
      institution: user.institution,
      name: user.name,
      role: user.role,
      expiresAt,
    }),
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

    if (
      !Object.keys(roleHomePaths).includes(session.role)
      || !isEducationInstitutionOrNull(session.institution)
      || (session.role === "admin" && !session.institution)
    ) {
      return null;
    }

    return {
      institution: session.institution,
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

function isEducationInstitutionOrNull(
  institution: unknown,
): institution is EducationInstitution | null {
  return institution === null
    || (typeof institution === "string" && isEducationInstitution(institution));
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password: string, storedPassword: string) {
  if (!storedPassword.startsWith("scrypt$")) {
    return safeCompare(password, storedPassword);
  }

  const [, salt, expectedHash] = storedPassword.split("$");
  if (!salt || !expectedHash) {
    return false;
  }

  return safeCompare(
    scryptSync(password, salt, 64).toString("hex"),
    expectedHash,
  );
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
        institution: true,
      },
    });

    if (
      !user
      || !verifyPassword(password, user.password)
      || !isUserRole(user.role)
      || !isEducationInstitutionOrNull(user.institution)
      || (user.role === "admin" && !user.institution)
    ) {
      return null;
    }

    return {
      institution: user.institution,
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
    institution: fallbackUser.institution,
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
