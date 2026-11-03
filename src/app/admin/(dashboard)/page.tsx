import Link from "next/link";
import { ArrowUpRight, CircleAlert } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { AdminHeader, EmptyState, Panel, StatusBadge } from "@/components/admin/ui";
import { daysAgo, formatDateTime } from "@/lib/utils";

export const metadata = { title: "Overview" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  const weekAgo = daysAgo(7);

  const [total, byStatus, thisWeek, emailFailures, recent, projects, services] = await Promise.all([
    db.lead.count(),
    db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    db.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    db.lead.count({ where: { emailSent: false, emailError: { not: null } } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    db.project.count({ where: { published: true } }),
    db.service.count({ where: { published: true } }),
  ]);
  const count = (s: string) => byStatus.find((b) => b.status === s)?._count._all ?? 0;

  const cards = [
    { label: "Total leads", value: total, note: `${thisWeek} this week` },
    { label: "New", value: count("NEW"), note: "Awaiting first reply" },
    { label: "In progress", value: count("IN_PROGRESS") + count("CONTACTED"), note: "Contacted or active" },
    { label: "Completed", value: count("COMPLETED"), note: "Closed out" },
  ];

  return (
    <>
      <AdminHeader title={`Welcome back, ${admin.name.split(" ")[0]}`} description="Here is what is happening with your website." />

      {emailFailures > 0 && (
        <div role="alert" className="mb-6 flex gap-3 rounded-md border border-[#e5c98f] bg-[#f6ecd9] p-4 text-sm text-[#8a5a12]">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            {emailFailures} lead notification {emailFailures === 1 ? "email" : "emails"} failed to send. The leads are safe in the
            database. Check your SMTP settings in <code>.env</code>.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Panel key={c.label} className="p-6">
            <p className="eyebrow text-muted">{c.label}</p>
            <p className="display mt-4 text-5xl">{c.value}</p>
            <p className="mt-1 text-sm text-muted">{c.note}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_280px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="display text-3xl">Recent submissions</h2>
            <Link href="/admin/leads" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState title="No leads yet" body="Contact form submissions will appear here as soon as they arrive." />
          ) : (
            <Panel className="divide-y divide-line">
              {recent.map((lead) => (
                <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-ivory">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{lead.fullName}</p>
                    <p className="truncate text-sm text-muted">
                      {lead.service} · {formatDateTime(lead.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </Link>
              ))}
            </Panel>
          )}
        </section>

        <aside className="space-y-4">
          <h2 className="display text-3xl">Content</h2>
          {[
            { label: "Published projects", value: projects, href: "/admin/projects" },
            { label: "Published services", value: services, href: "/admin/services" },
          ].map((c) => (
            <Link key={c.label} href={c.href} className="group flex items-center justify-between rounded-md border border-line bg-paper p-5 hover:border-ink/20">
              <div>
                <p className="display text-3xl">{c.value}</p>
                <p className="text-sm text-muted">{c.label}</p>
              </div>
              <ArrowUpRight className="size-4 text-muted group-hover:text-ink" aria-hidden />
            </Link>
          ))}
        </aside>
      </div>
    </>
  );
}
