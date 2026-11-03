import "server-only";
import { db } from "@/lib/db";

const MINUTE = 60_000;

/**
 * Database-backed rate limiting. Works across serverless instances without Redis.
 * Limits are counted from stored leads for the same (hashed) IP.
 */
export async function checkLeadRateLimit(ipHash: string) {
  const now = Date.now();
  const [lastTenMinutes, lastDay] = await Promise.all([
    db.lead.count({ where: { ipHash, createdAt: { gte: new Date(now - 10 * MINUTE) } } }),
    db.lead.count({ where: { ipHash, createdAt: { gte: new Date(now - 24 * 60 * MINUTE) } } }),
  ]);
  return { allowed: lastTenMinutes < 3 && lastDay < 10 };
}

/** True if the same email already sent the same message in the last 24 hours. */
export async function isDuplicateLead(email: string, message: string) {
  const existing = await db.lead.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      message,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * MINUTE) },
    },
    select: { id: true },
  });
  return Boolean(existing);
}

/** Admin login throttling: max 5 failed attempts per IP in 15 minutes. */
export async function checkLoginRateLimit(ipHash: string) {
  const failures = await db.loginAttempt.count({
    where: { ipHash, success: false, createdAt: { gte: new Date(Date.now() - 15 * MINUTE) } },
  });
  return { allowed: failures < 5 };
}
