import { z } from "zod";
import { iconNames } from "@/components/ui/icon";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password.").max(200),
});

export const leadStatusSchema = z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED"]);

/** Splits a textarea into a clean list: one item per line. */
const lines = z
  .string()
  .transform((v) =>
    v
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().max(200)).max(30));

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Slug is required.")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.");

const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(100),
  slug,
  tagline: z.string().trim().min(2, "Tagline is required.").max(200),
  summary: z.string().trim().min(10, "Summary is required.").max(400),
  description: z.string().trim().min(20, "Description is required.").max(4000),
  icon: z.enum(iconNames as [string, ...string[]]),
  features: lines,
  benefits: lines,
  order: z.coerce.number().int().min(0).max(999),
  published: checkbox,
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(100),
  slug,
  client: z.string().trim().min(1, "Client is required.").max(100),
  category: z.string().trim().min(2, "Category is required.").max(60),
  year: z.coerce.number().int().min(2000).max(2100),
  summary: z.string().trim().min(10, "Summary is required.").max(400),
  challenge: z.string().trim().min(10, "Challenge is required.").max(4000),
  solution: z.string().trim().min(10, "Solution is required.").max(4000),
  results: lines,
  technologies: lines,
  coverImage: z
    .string()
    .trim()
    .min(1, "Cover image is required.")
    .max(500)
    .refine((v) => v.startsWith("/") || /^https:\/\//.test(v), "Use a path like /images/projects/x.svg or an https URL."),
  order: z.coerce.number().int().min(0).max(999),
  featured: checkbox,
  isPlaceholder: checkbox,
  published: checkbox,
});

export type FormState = { ok: boolean; message?: string; fieldErrors?: Record<string, string> } | null;

export function toFieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
