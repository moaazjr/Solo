"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleAlert, LoaderCircle, MapPin, Phone, Plus, Search } from "lucide-react";
import { saveProspect, searchPlaces, type SearchPlacesResult } from "@/actions/prospects";
import { placeCategories } from "@/lib/places/categories";
import { Button } from "@/components/ui/button";
import { Field, inputClasses } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/primitives";
import { googleMapsUrl, openStreetMapUrl } from "./prospect-links";

type Found = Extract<SearchPlacesResult, { ok: true }>;

export function PlaceFinder() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<string>("cafe");
  const [onlyWithPhone, setOnlyWithPhone] = useState(false);
  const [result, setResult] = useState<Found | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, startSearch] = useTransition();
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startSearch(async () => {
      const res = await searchPlaces({ city, category }).catch(() => null);
      if (!res) return setError("Could not reach the server. Please try again.");
      if (!res.ok) {
        setResult(null);
        return setError(res.error);
      }
      setResult(res);
    });
  };

  const save = async (place: Found["places"][number]) => {
    if (!result) return;
    setSavingKey(place.osmKey);
    const { osmKey, name, category: placeCategory, address, phone, email, facebook, instagram, lat, lon } = place;
    const res = await saveProspect({ osmKey, name, category: placeCategory, address, phone, email, facebook, instagram, lat, lon, city: result.city }).catch(() => null);
    setSavingKey(null);
    if (!res?.ok) return setError("Could not save this place. Please try again.");
    setResult({
      ...result,
      places: result.places.map((p) => (p.osmKey === place.osmKey ? { ...p, savedId: res.id } : p)),
    });
    router.refresh();
  };

  const places = result ? result.places.filter((p) => !onlyWithPhone || p.phone) : [];
  const withPhone = result?.places.filter((p) => p.phone).length ?? 0;
  const categoryName = placeCategories.find((c) => c.id === category)?.label ?? "places";

  return (
    <section className="rounded-md border border-line bg-paper">
      <form onSubmit={search} className="grid gap-4 border-b border-line p-6 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end sm:p-8">
        <Field id="city" label="City or area">
          <input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Amman, Jordan · Beirut · Abdoun, Amman"
            className={inputClasses}
            required
            minLength={2}
          />
        </Field>
        <Field id="category" label="Type of business">
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClasses}>
            {placeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <div>
          <Button type="submit" disabled={searching} className="w-full sm:w-auto">
            {searching ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Search className="size-4" aria-hidden />}
            {searching ? "Searching…" : "Find places"}
          </Button>
        </div>
      </form>

      <div className="p-6 sm:p-8" aria-live="polite">
        {error && (
          <div role="alert" className="mb-6 flex gap-2 rounded-md border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            {error}
          </div>
        )}

        {searching ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Searching OpenStreetMap. Large cities can take up to a minute.
          </p>
        ) : !result ? (
          <p className="text-sm text-muted">
            Search a city to list {categoryName.toLowerCase()} that have <strong>no website listed</strong> on OpenStreetMap.
            Chains are skipped automatically.
          </p>
        ) : (
          <>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">
                <strong>{result.places.length}</strong> {categoryName.toLowerCase()} without a website in{" "}
                <strong>{result.city}</strong>
                {result.truncated && " (showing the first 300)"} · {withPhone} with a phone number
              </p>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={onlyWithPhone}
                  onChange={(e) => setOnlyWithPhone(e.target.checked)}
                  className="size-4 accent-[var(--color-accent)]"
                />
                Only with phone number
              </label>
            </div>

            {places.length === 0 ? (
              <p className="rounded-md border border-dashed border-line p-8 text-center text-sm text-muted">No places match.</p>
            ) : (
              <ul className="divide-y divide-line rounded-md border border-line">
                {places.map((p) => (
                  <li key={p.osmKey} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">{p.name}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                        {p.address && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3.5" aria-hidden />
                            {p.address}
                          </span>
                        )}
                        {p.phone ? (
                          <a href={`tel:${p.phone}`} className="inline-flex items-center gap-1 text-ink hover:text-accent">
                            <Phone className="size-3.5" aria-hidden />
                            {p.phone}
                          </a>
                        ) : (
                          <span className="text-xs">No phone listed</span>
                        )}
                        {(p.facebook || p.instagram) && <Badge>Social only</Badge>}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={googleMapsUrl(p.name, result.city)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-line px-3 py-2 text-sm hover:border-ink/30"
                      >
                        Google Maps
                      </a>
                      <a
                        href={openStreetMapUrl(p.osmKey)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden rounded-md border border-line px-3 py-2 text-sm hover:border-ink/30 md:inline-block"
                      >
                        OSM
                      </a>
                      {p.savedId ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#e3efe8] px-3 py-2 text-sm text-success">
                          <Check className="size-4" aria-hidden /> Saved
                        </span>
                      ) : (
                        <Button size="sm" onClick={() => save(p)} disabled={savingKey === p.osmKey}>
                          {savingKey === p.osmKey ? (
                            <LoaderCircle className="size-4 animate-spin" aria-hidden />
                          ) : (
                            <Plus className="size-4" aria-hidden />
                          )}
                          Save
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-muted">
              Data © OpenStreetMap contributors. A missing website on OpenStreetMap doesn&apos;t guarantee the business has
              none. Check Google Maps before reaching out.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
