import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSessionToken, verifySessionToken } from "./token";

export type AdminUser = { id: string; name: string; email: string };

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const session = await db.session.create({ data: { userId, expiresAt } });
  const token = await signSessionToken(session.id);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const sessionId = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (sessionId) await db.session.deleteMany({ where: { id: sessionId } });
  store.delete(SESSION_COOKIE);
}

/**
 * Data Access Layer: the single source of truth for "who is the admin?".
 * Verifies the signed cookie AND the session row in the database. Memoised per request.
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  // Session checks compare against the current time, so they must always run at request time.
  await connection();
  const sessionId = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!sessionId) return null;
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
