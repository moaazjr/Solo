-- Data migration: add the "Websites for Local Businesses" service and show it first.
-- Safe to re-run: does nothing if the service already exists (e.g. created by the seed).

UPDATE "Service"
SET "order" = "order" + 1
WHERE NOT EXISTS (SELECT 1 FROM "Service" WHERE "slug" = 'websites-for-local-businesses');

INSERT INTO "Service" ("id", "slug", "title", "tagline", "summary", "description", "icon", "features", "benefits", "order", "published", "createdAt", "updatedAt")
VALUES (
  'svc_websites_for_local_businesses',
  'websites-for-local-businesses',
  'Websites for Local Businesses',
  'Your café, restaurant or shop, finally online.',
  'Beautiful, mobile-first websites for cafés, restaurants, salons, clinics and shops that are not online yet.',
  'Most customers search on their phone before they visit. If your business has no website, they find your competitors instead. We design and launch a fast, professional website for your business: your story, your menu or services, photos, opening hours, a map and one-tap call and WhatsApp buttons. We handle the domain, hosting and setup, so you can focus on running your business.',
  'Globe',
  ARRAY['A custom design that matches your brand', 'Menu, services or product showcase', 'Opening hours, location and Google Maps', 'One-tap call and WhatsApp buttons', 'Mobile-first and fast on any phone', 'Domain, hosting and launch handled for you'],
  ARRAY['Be found by customers searching online', 'Look as professional as the big brands', 'Turn visitors into calls, bookings and orders', 'A website you own, without technical hassle'],
  0,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;
