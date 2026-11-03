import { z } from "zod";
import { budgetOptions } from "@/config/site";

export const GENERAL_ENQUIRY = "general";

/** Shared by the contact form (client) and the server action. */
export const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z.email("Please enter a valid email address.").trim().max(254),
  company: z.string().trim().max(120, "Company name must be 120 characters or fewer.").optional().or(z.literal("")),
  service: z.string().trim().min(1, "Please choose a service.").max(100),
  budget: z.enum(budgetOptions).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please tell us a little more (at least 20 characters).")
    .max(5000, "Message must be 5,000 characters or fewer."),
  // Anti-spam fields. `website` is a honeypot that real visitors never see.
  website: z.string().max(500).optional(),
  startedAt: z.number().int().positive(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof LeadInput, string>> };
