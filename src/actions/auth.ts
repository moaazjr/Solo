"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth/session";
import { checkLoginRateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/security";
import { loginSchema, type FormState } from "@/validation/admin";

// A valid bcrypt hash used to keep timing constant when the email does not exist.
const DUMMY_HASH = "$2b$12$dv4vMDDAqRIm6i0a6H84Huvdh/9e51U7z/QumCMPuqjAd4sY4MVmu";

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "Enter your email and password." };

  const { ipHash } = await getRequestMeta();
  if (!(await checkLoginRateLimit(ipHash)).allowed) {
    return { ok: false, message: "Too many failed attempts. Please wait 15 minutes and try again." };
  }

  const user = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
  const valid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);

  await db.loginAttempt.create({ data: { ipHash, success: Boolean(user && valid) } });
  if (!user || !valid) return { ok: false, message: "Invalid email or password." };

  await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
