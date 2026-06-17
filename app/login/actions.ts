"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  findUser,
  roleHomePaths,
} from "../lib/auth";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await findUser(username, password);

  if (!user) {
    redirect("/login?error=1");
  }

  await createSession({
    institution: user.institution,
    name: user.name,
    role: user.role,
  });

  redirect(roleHomePaths[user.role]);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
