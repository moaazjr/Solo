"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { CACHE_TAGS } from "@/lib/data/content";
import {
  leadStatusSchema,
  projectSchema,
  serviceSchema,
  toFieldErrors,
  type FormState,
} from "@/validation/admin";

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/* ─────────────── Leads ─────────────── */

export async function updateLeadStatus(id: string, status: string) {
  await requireAdmin();
  const parsed = leadStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: "Invalid status." };
  await db.lead.update({ where: { id }, data: { status: parsed.data } });
  return { ok: true };
}

export async function deleteLead(id: string) {
  await requireAdmin();
  await db.lead.delete({ where: { id } });
  redirect("/admin/leads");
}

/* ─────────────── Services ─────────────── */

export async function saveService(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };

  try {
    if (id) await db.service.update({ where: { id }, data: parsed.data });
    else await db.service.create({ data: parsed.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, fieldErrors: { slug: "This slug is already in use." } };
    throw error;
  }
  updateTag(CACHE_TAGS.services);
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requireAdmin();
  await db.service.delete({ where: { id } });
  updateTag(CACHE_TAGS.services);
  redirect("/admin/services");
}

/* ─────────────── Projects ─────────────── */

export async function saveProject(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };

  try {
    if (id) await db.project.update({ where: { id }, data: parsed.data });
    else await db.project.create({ data: parsed.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, fieldErrors: { slug: "This slug is already in use." } };
    throw error;
  }
  updateTag(CACHE_TAGS.projects);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await db.project.delete({ where: { id } });
  updateTag(CACHE_TAGS.projects);
  redirect("/admin/projects");
}
