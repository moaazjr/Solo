import { z } from "zod";
import { placeCategoryIds } from "@/lib/places/categories";

export const placeSearchSchema = z.object({
  city: z.string().trim().min(2, "Enter a city or area.").max(120),
  category: z.enum(placeCategoryIds),
});

const optionalText = z.string().trim().max(300).nullable();

export const savePlaceSchema = z.object({
  osmKey: z.string().regex(/^(node|way|relation)\/\d+$/),
  name: z.string().trim().min(1).max(300),
  category: z.enum(placeCategoryIds),
  city: z.string().trim().min(1).max(200),
  address: optionalText,
  phone: optionalText,
  email: optionalText,
  facebook: optionalText,
  instagram: optionalText,
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const prospectStatusSchema = z.enum(["NEW", "CONTACTED", "INTERESTED", "WON", "NOT_INTERESTED"]);

export const prospectNotesSchema = z.string().max(2000);
