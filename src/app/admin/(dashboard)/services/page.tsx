import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { AdminHeader, EmptyState, Panel } from "@/components/admin/ui";
import { Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/icon";

export const metadata = { title: "Services" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;

export default async function AdminServicesPage() {
  await requireAdmin();
  const services = await db.service.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  const newButton = (
    <ButtonLink href="/admin/services/new">
      <Plus className="size-4" aria-hidden /> New service
    </ButtonLink>
  );

  return (
    <>
      <AdminHeader title="Services" description="Manage the services shown on the public website." action={newButton} />
      {services.length === 0 ? (
        <EmptyState title="No services yet" body="Create your first service to show it on the website." action={newButton} />
      ) : (
        <Panel className="divide-y divide-line">
          {services.map((s) => (
            <Link key={s.id} href={`/admin/services/${s.id}`} className="flex items-center gap-4 p-5 transition-colors hover:bg-ivory">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <DynamicIcon name={s.icon} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{s.title}</p>
                <p className="truncate text-sm text-muted">/services/{s.slug}</p>
              </div>
              <span className="hidden font-mono text-xs text-muted sm:inline">#{s.order}</span>
              <Badge tone={s.published ? "success" : "neutral"}>{s.published ? "Published" : "Draft"}</Badge>
            </Link>
          ))}
        </Panel>
      )}
    </>
  );
}
