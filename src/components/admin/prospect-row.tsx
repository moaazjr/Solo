"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, MapPin, MessageCircle, Phone, Trash2 } from "lucide-react";
import type { ProspectStatus } from "@/generated/prisma/client";
import { deleteProspect, updateProspectNotes, updateProspectStatus } from "@/actions/prospects";
import { categoryLabel } from "@/lib/places/categories";
import { inputClasses } from "@/components/ui/form-field";
import { googleMapsUrl, prospectStatusLabels, socialUrl, whatsappUrl } from "./prospect-links";
import { cn } from "@/lib/utils";

export type ProspectRowData = {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string | null;
  phone: string | null;
  facebook: string | null;
  instagram: string | null;
  status: ProspectStatus;
  notes: string | null;
};

const statuses = Object.keys(prospectStatusLabels) as ProspectStatus[];

export function ProspectRow({ prospect }: { prospect: ProspectRowData }) {
  const router = useRouter();
  const [status, setStatus] = useState(prospect.status);
  const [notes, setNotes] = useState(prospect.notes ?? "");
  const [savedNotes, setSavedNotes] = useState(prospect.notes ?? "");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const changeStatus = (next: ProspectStatus) => {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const res = await updateProspectStatus(prospect.id, next).catch(() => null);
      if (!res?.ok) {
        setStatus(previous);
        setMessage("Couldn't update status.");
      } else {
        router.refresh();
      }
    });
  };

  const saveNotes = () => {
    if (notes === savedNotes) return;
    startTransition(async () => {
      const res = await updateProspectNotes(prospect.id, notes).catch(() => null);
      if (res?.ok) {
        setSavedNotes(notes);
        setMessage("Notes saved.");
      } else {
        setMessage("Couldn't save notes.");
      }
    });
  };

  const remove = () => {
    if (!window.confirm(`Remove “${prospect.name}” from your prospects?`)) return;
    startTransition(async () => {
      await deleteProspect(prospect.id).catch(() => null);
      router.refresh();
    });
  };

  const wa = prospect.phone ? whatsappUrl(prospect.phone) : null;
  const linkClass = "inline-flex items-center gap-1 rounded-md border border-line px-2.5 py-1.5 text-xs hover:border-ink/30";

  return (
    <li className={cn("grid gap-4 p-5 lg:grid-cols-[1.3fr_1fr_1.2fr_auto] lg:items-start", pending && "opacity-70")}>
      <div className="min-w-0">
        <p className="font-medium">{prospect.name}</p>
        <p className="text-sm text-muted">
          {categoryLabel(prospect.category)} · {prospect.city}
        </p>
        {prospect.address && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <MapPin className="size-3" aria-hidden /> {prospect.address}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {prospect.phone && (
            <a href={`tel:${prospect.phone}`} className={linkClass}>
              <Phone className="size-3" aria-hidden /> {prospect.phone}
            </a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <MessageCircle className="size-3" aria-hidden /> WhatsApp
            </a>
          )}
          <a href={googleMapsUrl(prospect.name, prospect.city)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Google Maps
          </a>
          {prospect.facebook && (
            <a href={socialUrl(prospect.facebook, "facebook")} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Facebook
            </a>
          )}
          {prospect.instagram && (
            <a href={socialUrl(prospect.instagram, "instagram")} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Instagram
            </a>
          )}
        </div>
      </div>

      <label className="block">
        <span className="sr-only">Status for {prospect.name}</span>
        <select
          value={status}
          onChange={(e) => changeStatus(e.target.value as ProspectStatus)}
          disabled={pending}
          className={cn(inputClasses, "py-2 text-sm")}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {prospectStatusLabels[s]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="sr-only">Notes for {prospect.name}</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          rows={2}
          maxLength={2000}
          placeholder="Notes: who you spoke to, next step…"
          className={cn(inputClasses, "resize-y py-2 text-sm")}
        />
        <span className="mt-1 block h-4 text-xs text-muted" aria-live="polite">
          {pending ? "Saving…" : message}
        </span>
      </label>

      <button
        type="button"
        onClick={remove}
        disabled={pending}
        aria-label={`Remove ${prospect.name}`}
        className="grid size-9 place-items-center justify-self-end rounded-md text-muted hover:bg-danger/10 hover:text-danger"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
      </button>
    </li>
  );
}
