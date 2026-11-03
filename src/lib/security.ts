import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import sanitizeHtml from "sanitize-html";

/** Strips all HTML and control characters from free-text input. */
export function sanitizeText(value: string | undefined | null) {
  if (!value) return "";
  const stripped = sanitizeHtml(value, { allowedTags: [], allowedAttributes: {}, disallowedTagsMode: "discard" });
  return stripped
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

/** Escapes a string for safe interpolation into HTML (e.g. email templates). */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** One-way hash of the visitor IP so we can rate-limit without storing raw IPs. */
export function hashIp(ip: string) {
  const secret = process.env.AUTH_SECRET ?? "";
  return createHash("sha256").update(`${ip}:${secret}`).digest("hex");
}

export async function getRequestMeta() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "unknown";
  return { ipHash: hashIp(ip), userAgent: (h.get("user-agent") ?? "").slice(0, 300) };
}
