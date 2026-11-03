import { cn } from "@/lib/utils";

export const inputClasses =
  "w-full rounded-md border border-line bg-paper px-4 py-3 text-[0.97rem] text-ink placeholder:text-muted/60 transition-[border-color,box-shadow] duration-200 hover:border-ink/25 focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/10 disabled:opacity-60";

export function Field({
  id,
  label,
  optional,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium">
        <span>{label}</span>
        {optional && <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
