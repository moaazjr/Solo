"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import type { LeadStatus } from "@/generated/prisma/client";
import { deleteLead, updateLeadStatus } from "@/actions/admin";
import { statusLabels } from "./status-labels";
import { cn } from "@/lib/utils";

const statuses = Object.keys(statusLabels) as LeadStatus[];

export function LeadStatusControl({ id, status }: { id: string; status: LeadStatus }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const change = (next: LeadStatus) => {
    const previous = current;
    setCurrent(next);
    setError(null);
    startTransition(async () => {
      const result = await updateLeadStatus(id, next);
      if (!result.ok) {
        setCurrent(previous);
        setError(result.message ?? "Could not update status.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div>
      <div role="radiogroup" aria-label="Lead status" className="grid grid-cols-2 gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={current === s}
            disabled={pending}
            onClick={() => change(s)}
            className={cn(
              "rounded-md border px-3 py-2.5 text-sm transition-colors disabled:opacity-60",
              current === s ? "border-ink bg-ink text-ivory" : "border-line bg-paper hover:border-ink/30",
            )}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>
      <p className="mt-2 h-5 text-xs text-muted" aria-live="polite">
        {pending ? "Saving…" : error ? <span className="text-danger">{error}</span> : null}
      </p>
    </div>
  );
}

export function DeleteButton({
  action,
  label = "Delete",
  confirmText,
}: {
  action: () => Promise<unknown>;
  label?: string;
  confirmText: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(async () => {
          await action();
        });
      }}
      className="inline-flex items-center gap-2 rounded-md border border-danger/30 px-4 py-2.5 text-sm text-danger transition-colors hover:bg-danger hover:text-white disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
      {label}
    </button>
  );
}

export function DeleteLeadButton({ id }: { id: string }) {
  return (
    <DeleteButton
      action={() => deleteLead(id)}
      label="Delete lead"
      confirmText="Delete this lead permanently? This cannot be undone."
    />
  );
}
