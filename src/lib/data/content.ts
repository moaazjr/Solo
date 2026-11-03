import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export const CACHE_TAGS = {
  services: "services",
  projects: "projects",
  testimonials: "testimonials",
} as const;

export async function getServices() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.services);
  return db.service.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getServiceBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.services);
  return db.service.findFirst({ where: { slug, published: true } });
}

export async function getProjects() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.projects);
  return db.project.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { year: "desc" }],
  });
}

export async function getFeaturedProjects(limit = 3) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.projects);
  return db.project.findMany({
    where: { published: true, featured: true },
    orderBy: [{ order: "asc" }, { year: "desc" }],
    take: limit,
  });
}

export async function getProjectBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.projects);
  return db.project.findFirst({ where: { slug, published: true } });
}

export async function getTestimonials() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.testimonials);
  return db.testimonial.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

/** Slugs for build-time prerendering. Cache Components requires at least one entry. */
export async function getServiceSlugs() {
  const rows = await db.service.findMany({ where: { published: true }, select: { slug: true } });
  return rows.length ? rows.map((r) => ({ slug: r.slug })) : [{ slug: "__none__" }];
}

export async function getProjectSlugs() {
  const rows = await db.project.findMany({ where: { published: true }, select: { slug: true } });
  return rows.length ? rows.map((r) => ({ slug: r.slug })) : [{ slug: "__none__" }];
}
