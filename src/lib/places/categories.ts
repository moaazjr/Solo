/**
 * Business categories the prospect finder can search, mapped to OpenStreetMap tags.
 * Shared by the admin UI (labels) and the server (Overpass filters).
 */
export const placeCategories = [
  { id: "cafe", label: "Cafés", filters: [["amenity", "cafe"]] },
  { id: "restaurant", label: "Restaurants", filters: [["amenity", "restaurant"]] },
  { id: "fast_food", label: "Fast food", filters: [["amenity", "fast_food"]] },
  { id: "bakery", label: "Bakeries & sweets", filters: [["shop", "bakery"], ["shop", "confectionery"], ["shop", "pastry"]] },
  { id: "beauty", label: "Beauty salons", filters: [["shop", "beauty"]] },
  { id: "hairdresser", label: "Barbers & hairdressers", filters: [["shop", "hairdresser"]] },
  { id: "gym", label: "Gyms & fitness", filters: [["leisure", "fitness_centre"], ["leisure", "sports_centre"]] },
  { id: "clinic", label: "Clinics & doctors", filters: [["amenity", "clinic"], ["amenity", "doctors"]] },
  { id: "dentist", label: "Dentists", filters: [["amenity", "dentist"]] },
  { id: "pharmacy", label: "Pharmacies", filters: [["amenity", "pharmacy"]] },
  { id: "clothes", label: "Clothing & boutiques", filters: [["shop", "clothes"], ["shop", "boutique"], ["shop", "shoes"]] },
  { id: "hotel", label: "Hotels & guest houses", filters: [["tourism", "hotel"], ["tourism", "guest_house"]] },
  { id: "car_repair", label: "Car services", filters: [["shop", "car_repair"], ["amenity", "car_wash"]] },
] as const;

export type PlaceCategoryId = (typeof placeCategories)[number]["id"];
export const placeCategoryIds = placeCategories.map((c) => c.id) as [PlaceCategoryId, ...PlaceCategoryId[]];

export function categoryLabel(id: string) {
  return placeCategories.find((c) => c.id === id)?.label ?? id;
}
