import "server-only";
import { placeCategories, type PlaceCategoryId } from "./categories";

/**
 * Finds local businesses that have no website listed on OpenStreetMap.
 * Uses the free Nominatim (city lookup) and Overpass (place search) APIs, which ask
 * clients to identify themselves and keep request volume low, so results are cached.
 */

const USER_AGENT = `SoloWebsite-ProspectFinder/1.0 (+${process.env.NEXT_PUBLIC_SITE_URL ?? "https://github.com/moaazjr/Solo"})`;
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const MAX_RESULTS = 300;
const MAX_AREA_SPAN_DEGREES = 1.2; // roughly a large city; larger areas are too slow for Overpass
const CACHE_TTL_MS = 15 * 60 * 1000;
const OVERPASS_BUDGET_MS = 45_000; // plus up to 10s for the city lookup stays under the 60s function limit

export type FoundPlace = {
  osmKey: string;
  name: string;
  category: PlaceCategoryId;
  address: string | null;
  phone: string | null;
  email: string | null;
  facebook: string | null;
  instagram: string | null;
  lat: number;
  lon: number;
};

export type PlaceSearchResult =
  | { ok: true; city: string; places: FoundPlace[]; truncated: boolean }
  | { ok: false; error: string };

export class PlaceSearchError extends Error {}

type BBox = { south: number; west: number; north: number; east: number };
type NominatimResult = { display_name: string; boundingbox: [string, string, string, string]; name?: string };
type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const cache = new Map<string, { expires: number; value: PlaceSearchResult }>();

async function findCity(query: string): Promise<{ name: string; bbox: BBox }> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "en" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new PlaceSearchError("The map service could not look up that city. Please try again in a minute.");
  const [first] = (await res.json()) as NominatimResult[];
  if (!first) throw new PlaceSearchError(`Couldn't find “${query}”. Try the city name in English, e.g. “Amman, Jordan”.`);

  const [south, north, west, east] = first.boundingbox.map(Number);
  if (north - south > MAX_AREA_SPAN_DEGREES || east - west > MAX_AREA_SPAN_DEGREES) {
    throw new PlaceSearchError(`“${query}” is too large an area. Search a city or district instead of a whole region.`);
  }
  return { name: first.display_name.split(",").slice(0, 2).join(",").trim(), bbox: { south, west, north, east } };
}

function buildQuery(categoryId: PlaceCategoryId, b: BBox) {
  const category = placeCategories.find((c) => c.id === categoryId)!;
  const box = `(${b.south},${b.west},${b.north},${b.east})`;
  // Named places with no website of any kind; chains (which have a brand Wikidata id) are skipped.
  const noWebsite = `["name"][!"website"][!"contact:website"][!"url"][!"brand:wikidata"]`;
  const lines = category.filters.map(([k, v]) => `nwr["${k}"="${v}"]${noWebsite}${box};`).join("");
  return `[out:json][timeout:40];(${lines});out center tags ${MAX_RESULTS + 1};`;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runOverpass(query: string): Promise<OverpassElement[]> {
  // One overall budget across all servers, so the search always answers within the function time limit.
  // The main server often answers "at capacity" instantly and then succeeds a few seconds later,
  // so it is retried with short pauses before falling back to the (less reliable) mirrors.
  const deadline = Date.now() + OVERPASS_BUDGET_MS;
  const [primary, ...mirrors] = OVERPASS_ENDPOINTS;
  const attempts = [primary, primary, primary, ...mirrors];
  let lastError = "";
  for (const [i, endpoint] of attempts.entries()) {
    const remaining = deadline - Date.now();
    if (remaining < 3_000) break;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "User-Agent": USER_AGENT, "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(remaining),
      });
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        // Busy or rate-limited: back off briefly before the next attempt.
        if ([429, 502, 503, 504].includes(res.status) && i < attempts.length - 1) await sleep(2_000 * (i + 1));
        continue;
      }
      const json = (await res.json()) as { elements?: OverpassElement[] };
      return json.elements ?? [];
    } catch (error) {
      lastError = error instanceof Error ? error.name : "network error";
    }
  }
  console.warn("[places] all Overpass endpoints failed:", lastError);
  throw new PlaceSearchError("The OpenStreetMap search servers are busy right now. Please try again in a minute.");
}

function pick(tags: Record<string, string>, ...keys: string[]) {
  for (const key of keys) {
    const value = tags[key]?.trim();
    if (value) return value.slice(0, 300);
  }
  return null;
}

function toPlace(el: OverpassElement, category: PlaceCategoryId): FoundPlace | null {
  const tags = el.tags ?? {};
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  const name = pick(tags, "name:en", "name");
  if (!name || lat === undefined || lon === undefined) return null;

  const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  const address = [street, tags["addr:suburb"] ?? tags["addr:district"], tags["addr:city"]].filter(Boolean).join(", ") || null;

  return {
    osmKey: `${el.type}/${el.id}`,
    name: tags.name && tags["name:en"] && tags.name !== tags["name:en"] ? `${tags["name:en"]} (${tags.name})`.slice(0, 300) : name,
    category,
    address,
    phone: pick(tags, "phone", "contact:phone", "mobile", "contact:mobile"),
    email: pick(tags, "email", "contact:email"),
    facebook: pick(tags, "contact:facebook", "facebook"),
    instagram: pick(tags, "contact:instagram", "instagram"),
    lat,
    lon,
  };
}

export async function searchPlacesWithoutWebsite(cityQuery: string, category: PlaceCategoryId): Promise<PlaceSearchResult> {
  const cacheKey = `${cityQuery.toLowerCase()}|${category}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.value;

  try {
    const city = await findCity(cityQuery);
    const elements = await runOverpass(buildQuery(category, city.bbox));
    const places = elements
      .map((el) => toPlace(el, category))
      .filter((p): p is FoundPlace => p !== null)
      // Places with contact details first: they are the easiest to reach.
      .sort((a, b) => Number(Boolean(b.phone)) - Number(Boolean(a.phone)) || a.name.localeCompare(b.name));

    const value: PlaceSearchResult = {
      ok: true,
      city: city.name,
      places: places.slice(0, MAX_RESULTS),
      truncated: places.length > MAX_RESULTS,
    };
    cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, value });
    return value;
  } catch (error) {
    if (error instanceof PlaceSearchError) return { ok: false, error: error.message };
    console.error("[places] search failed:", error instanceof Error ? error.message : error);
    return { ok: false, error: "Something went wrong while searching. Please try again." };
  }
}
