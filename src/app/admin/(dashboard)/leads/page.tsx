import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { AdminHeader, EmptyState, Panel, StatusBadge, statusLabels } from "@/components/admin/ui";
import { leadStatusSchema } from "@/validation/admin";
import { cn, formatDateTime } from "@/lib/utils";

export const metadata = { title: "Leads" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;

const PAGE_SIZE = 25;

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  await requireAdmin();
  const params = await searchParams;
  const status = leadStatusSchema.safeParse(params.status).data;
  const page = Math.max(1, Number(params.page) || 1);
  const where = status ? { status } : {};

  const [leads, total] = await Promise.all([
    db.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    db.lead.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filters = [{ label: "All", value: undefined }, ...leadStatusSchema.options.map((s) => ({ label: statusLabels[s], value: s }))];
  const href = (s?: string, p = 1) => {
    const q = new URLSearchParams();
    if (s) q.set("status", s);
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  };

  return (
    <>
      <AdminHeader title="Leads" description={`${total} ${total === 1 ? "submission" : "submissions"}${status ? ` marked ${statusLabels[status].toLowerCase()}` : ""}.`} />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.label}
            href={href(f.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              status === f.value ? "border-ink bg-ink text-ivory" : "border-line bg-paper text-muted hover:text-ink",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <EmptyState title="Nothing here" body={status ? "No leads with this status." : "Contact form submissions will appear here."} />
      ) : (
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line">
              <tr className="eyebrow text-muted">
                <th scope="col" className="p-4 font-normal">Name</th>
                <th scope="col" className="p-4 font-normal">Service</th>
                <th scope="col" className="p-4 font-normal">Budget</th>
                <th scope="col" className="p-4 font-normal">Received</th>
                <th scope="col" className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.map((lead) => (
                <tr key={lead.id} className="transition-colors hover:bg-ivory">
                  <td className="p-4">
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium hover:text-accent">
                      {lead.fullName}
                    </Link>
                    <p className="text-muted">{lead.email}</p>
                  </td>
                  <td className="p-4">{lead.service}</td>
                  <td className="p-4 text-muted">{lead.budget ?? "—"}</td>
                  <td className="whitespace-nowrap p-4 text-muted">{formatDateTime(lead.createdAt)}</td>
                  <td className="p-4">
                    <StatusBadge status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          {page > 1 ? <Link href={href(status, page - 1)} className="text-accent">← Previous</Link> : <span />}
          <span className="text-muted">Page {page} of {pages}</span>
          {page < pages ? <Link href={href(status, page + 1)} className="text-accent">Next →</Link> : <span />}
        </nav>
      )}
    </>
  );
}
