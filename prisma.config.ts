import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * URL used by the Prisma CLI (migrate, seed, studio). The app itself connects with
 * DATABASE_URL through the driver adapter in src/lib/db.ts.
 *
 * Migrations take a Postgres advisory lock, which does not work reliably through
 * Neon's connection pooler (P1002 timeouts). So the CLI uses DIRECT_URL if set,
 * otherwise the same Neon URL with the "-pooler" part removed from the host.
 */
function cliDatabaseUrl() {
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL;
  const url = process.env.DATABASE_URL;
  if (!url) return ""; // `prisma generate` (run on install) works without a database
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith(".neon.tech") && parsed.hostname.includes("-pooler.")) {
      parsed.hostname = parsed.hostname.replace("-pooler.", ".");
      return parsed.toString();
    }
  } catch {
    // Not a parseable URL: let Prisma report the problem.
  }
  return url;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: cliDatabaseUrl(),
  },
});
