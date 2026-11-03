"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CircleAlert, LoaderCircle } from "lucide-react";
import type { FormState } from "@/validation/admin";
import { Button, buttonClasses } from "@/components/ui/button";
import { Field, inputClasses } from "@/components/ui/form-field";

export type FieldDef =
  | { name: string; label: string; type: "text" | "number"; hint?: string; span?: 2 }
  | { name: string; label: string; type: "textarea"; rows?: number; hint?: string; span?: 2 }
  | { name: string; label: string; type: "select"; options: string[]; span?: 2 }
  | { name: string; label: string; type: "checkbox"; hint?: string };

type Values = Record<string, string | number | boolean | string[] | Date | null | undefined>;

/** Generic create/edit form for admin-managed content, driven by a server action. */
export function ContentForm({
  fields,
  values,
  action,
  cancelHref,
  submitLabel,
}: {
  fields: FieldDef[];
  values?: Values;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  cancelHref: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const errors = state?.fieldErrors ?? {};

  const textValue = (name: string) => {
    const v = values?.[name];
    if (Array.isArray(v)) return v.join("\n");
    return v === null || v === undefined ? "" : String(v);
  };

  return (
    <form action={formAction} className="rounded-md border border-line bg-paper p-6 sm:p-8">
      {state?.message && !state.ok && (
        <div role="alert" className="mb-6 flex gap-2 rounded-md border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((f) => {
          const error = errors[f.name];
          const common = {
            id: f.name,
            name: f.name,
            "aria-invalid": Boolean(error),
            "aria-describedby": error ? `${f.name}-error` : undefined,
          };

          if (f.type === "checkbox") {
            return (
              <label key={f.name} className="flex cursor-pointer items-start gap-3 rounded-md border border-line p-4 hover:border-ink/25">
                <input
                  type="checkbox"
                  name={f.name}
                  defaultChecked={Boolean(values?.[f.name])}
                  className="mt-1 size-4 accent-[var(--color-accent)]"
                />
                <span>
                  <span className="block text-sm font-medium">{f.label}</span>
                  {f.hint && <span className="block text-xs text-muted">{f.hint}</span>}
                </span>
              </label>
            );
          }

          return (
            <Field
              key={f.name}
              id={f.name}
              label={f.label}
              error={error}
              hint={"hint" in f ? f.hint : undefined}
              className={f.span === 2 ? "sm:col-span-2" : undefined}
            >
              {f.type === "textarea" ? (
                <textarea {...common} rows={f.rows ?? 4} defaultValue={textValue(f.name)} className={`${inputClasses} resize-y`} />
              ) : f.type === "select" ? (
                <select {...common} defaultValue={textValue(f.name) || f.options[0]} className={inputClasses}>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input {...common} type={f.type} defaultValue={textValue(f.name)} className={inputClasses} />
              )}
            </Field>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end gap-3 border-t border-line pt-6">
        <Link href={cancelHref} className={buttonClasses({ variant: "secondary" })}>
          Cancel
        </Link>
        <Button type="submit" disabled={pending}>
          {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
