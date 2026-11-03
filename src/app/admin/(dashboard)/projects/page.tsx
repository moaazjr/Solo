import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { AdminHeader, EmptyState, Panel } from "@/components/admin/ui";
import { Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Projects" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await db.project.findMany({ orderBy: [{ order: "asc" }, { year: "desc" }] });
  const newButton = (
    <ButtonLink href="/admin/projects/new">
      <Plus className="size-4" aria-hidden /> New project
    </ButtonLink>
  );

  return (
    <>
      <AdminHeader title="Projects" description="Manage the portfolio shown on the public website." action={newButton} />
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" body="Add your first project to start building the portfolio." action={newButton} />
      ) : (
        <Panel className="divide-y divide-line">
          {projects.map((p) => (
            <Link key={p.id} href={`/admin/projects/${p.id}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-ivory">
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-sand">
                <Image src={p.coverImage} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.title}</p>
                <p className="truncate text-sm text-muted">
                  {p.category} · {p.year}
                </p>
              </div>
              <div className="hidden flex-wrap justify-end gap-1.5 sm:flex">
                {p.featured && <Badge tone="accent">Featured</Badge>}
                {p.isPlaceholder && <Badge tone="warning">Sample</Badge>}
                <Badge tone={p.published ? "success" : "neutral"}>{p.published ? "Published" : "Draft"}</Badge>
              </div>
            </Link>
          ))}
        </Panel>
      )}
    </>
  );
}
