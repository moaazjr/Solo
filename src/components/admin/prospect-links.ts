import type { ProspectStatus } from "@/generated/prisma/client";

export const prospectStatusLabels: Record<ProspectStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  WON: "Won",
  NOT_INTERESTED: "Not interested",
};

/** Google Maps search for the business: the quickest way to find its phone number and reviews. */
export function googleMapsUrl(name: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${city}`)}`;
}

export function openStreetMapUrl(osmKey: string) {
  return `https://www.openstreetmap.org/${osmKey}`;
}

/** Turns a phone number into a WhatsApp chat link (digits only, as wa.me requires). */
export function whatsappUrl(phone: string) {
  const digits = phone.replace(/[^\d]/g, "").replace(/^00/, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export function socialUrl(value: string, network: "facebook" | "instagram") {
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@/, "");
  return network === "facebook" ? `https://www.facebook.com/${handle}` : `https://www.instagram.com/${handle}`;
}
