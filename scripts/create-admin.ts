/**
 * Creates (or resets the password of) the admin account from environment variables:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 * Run with:  npm run admin:create
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  if (password === "choose-a-strong-password-min-12-chars") throw new Error("Change ADMIN_PASSWORD from the example value.");

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });
  // Invalidate existing sessions whenever the password is (re)set.
  await db.session.deleteMany({ where: { userId: user.id } });
  await db.$disconnect();
  console.log(`Admin account ready for ${email}. You can now remove ADMIN_PASSWORD from .env.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
