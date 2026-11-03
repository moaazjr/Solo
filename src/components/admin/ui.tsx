import Link from "next/link";
import type { LeadStatus } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { statusLabels } from "./status-labels";

export { statusLabels };

const statusTones = { NEW: "accent", CONTACTED: "info", IN_PROGRESS: "warning", COMPLETED: "success" } as const;

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <Badge tone={statusTones[status]}>{statusLabels[status]}</Badge>;
}

export function AdminHeader({
  title,
  description,
  action,
  back,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {back && (
          <Link href={back.href} className="mb-4 inline-block text-sm text-muted hover:text-ink">
            ← {back.label}
          </Link>
        )}
        <h1 className="display text-4xl sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-md border border-line bg-paper", className)}>{children}</div>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <Panel className="px-6 py-16 text-center">
      <p className="display text-3xl">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </Panel>
  );
}

export function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-6">
      <div className="h-12 w-64 animate-pulse rounded bg-sand" />
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-md bg-sand" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-md bg-sand" />
    </div>
  );
}
