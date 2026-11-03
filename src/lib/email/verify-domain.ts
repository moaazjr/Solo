import "server-only";
import { Resolver } from "node:dns/promises";

const LOOKUP_TIMEOUT_MS = 3_000;
const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { ok: boolean; expires: number }>();

/** DNS codes that mean "this domain definitely has no such records". */
const DEFINITIVE_MISS = new Set(["ENOTFOUND", "ENODATA", "NXDOMAIN"]);

// System resolver first; public resolvers as a fallback when the system one is
// unreachable (e.g. a local VPN or DNS proxy that refuses Node's lookups).
const systemResolver = new Resolver({ timeout: LOOKUP_TIMEOUT_MS, tries: 1 });
const publicResolver = new Resolver({ timeout: LOOKUP_TIMEOUT_MS, tries: 1 });
publicResolver.setServers(["1.1.1.1", "8.8.8.8"]);

type Code = string | undefined;
const codeOf = (error: unknown): Code => (error as { code?: string })?.code;

async function lookup<T>(query: (r: Resolver) => Promise<T>) {
  try {
    return await query(systemResolver);
  } catch (error) {
    if (DEFINITIVE_MISS.has(codeOf(error) ?? "")) throw error;
    return query(publicResolver);
  }
}

async function hasRecords(domain: string) {
  try {
    const mx = await lookup((r) => r.resolveMx(domain));
    // A "null MX" (RFC 7505) explicitly declares that the domain accepts no mail.
    return mx.some((r) => r.exchange && r.exchange !== ".");
  } catch (error) {
    if (!DEFINITIVE_MISS.has(codeOf(error) ?? "")) throw error;
  }
  // No MX records: mail servers fall back to the domain's A/AAAA record.
  const results = await Promise.allSettled([
    lookup((r) => r.resolve4(domain)),
    lookup((r) => r.resolve6(domain)),
  ]);
  if (results.some((r) => r.status === "fulfilled" && r.value.length > 0)) return true;
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failures.some((f) => !DEFINITIVE_MISS.has(codeOf(f.reason) ?? ""))) {
    throw failures[0].reason;
  }
  return false;
}

/**
 * Checks whether an email's domain can receive mail. Fails open: if DNS is
 * unreachable altogether, the address is accepted so real visitors are never
 * blocked by a network problem on our side.
 */
export async function canReceiveEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  const cached = cache.get(domain);
  if (cached && cached.expires > Date.now()) return cached.ok;

  let ok: boolean;
  try {
    ok = await hasRecords(domain);
  } catch (error) {
    console.warn(`[lead] DNS check skipped for ${domain}:`, codeOf(error) ?? error);
    return true;
  }
  cache.set(domain, { ok, expires: Date.now() + CACHE_TTL_MS });
  return ok;
}
