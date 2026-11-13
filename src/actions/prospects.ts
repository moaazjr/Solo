"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { searchPlacesWithoutWebsite, type FoundPlace } from "@/lib/places/osm";
import {
  placeSearchSchema,
  prospectNotesSchema,
  prospectStatusSchema,
  savePlaceSchema,
} from "@/validation/prospect";

export type SearchPlacesResult =
  | { ok: true; city: string; places: (FoundPlace & { savedId: string | null })[]; truncated: boolean }
  | { ok: false; error: string };

export async function searchPlaces(input: { city: string; category: string }): Promise<SearchPlacesResult> {
  await requireAdmin();
  const parsed = placeSearchSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid search." };

  const result = await searchPlacesWithoutWebsite(parsed.data.city, parsed.data.category);
  if (!result.ok) return result;

  // Mark places that are already saved as prospects.
  const saved = await db.prospect.findMany({
    where: { osmKey: { in: result.places.map((p) => p.osmKey) } },
    select: { id: true, osmKey: true },
  });
  const savedByKey = new Map(saved.map((s) => [s.osmKey, s.id]));
  return { ...result, places: result.places.map((p) => ({ ...p, savedId: savedByKey.get(p.osmKey) ?? null })) };
}

export async function saveProspect(input: unknown) {
  await requireAdmin();
  const parsed = savePlaceSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid place data." };

  const prospect = await db.prospect.upsert({
    where: { osmKey: parsed.data.osmKey },
    update: {},
    create: parsed.data,
    select: { id: true },
  });
  return { ok: true as const, id: prospect.id };
}

export async function updateProspectStatus(id: string, status: string) {
  await requireAdmin();
  const parsed = prospectStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: "Invalid status." };
  await db.prospect.update({ where: { id }, data: { status: parsed.data } });
  return { ok: true };
}

export async function updateProspectNotes(id: string, notes: string) {
  await requireAdmin();
  const parsed = prospectNotesSchema.safeParse(notes);
  if (!parsed.success) return { ok: false, message: "Notes are too long." };
  await db.prospect.update({ where: { id }, data: { notes: parsed.data.trim() || null } });
  return { ok: true };
}

export async function deleteProspect(id: string) {
  await requireAdmin();
  await db.prospect.delete({ where: { id } });
  return { ok: true };
}
