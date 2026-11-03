import type { LeadStatus } from "@/generated/prisma/client";

export const statusLabels: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};
