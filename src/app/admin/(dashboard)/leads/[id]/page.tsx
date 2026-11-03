import { notFound } from "next/navigation";
import { CircleAlert, CircleCheck, Mail } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { AdminHeader, Panel, StatusBadge } from "@/components/admin/ui";
import { DeleteLeadButton, LeadStatusControl } from "@/components/admin/lead-controls";
import { buttonClasses } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Lead details" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;

export default async function LeadDetailPage({ params }: PageProps<"/admin/leads/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  const details: [string, string][] = [
    ["Email", lead.email],
    ["Company", lead.company ?? "Not provided"],
    ["Service", lead.service],
    ["Budget", lead.budget ?? "Not provided"],
    ["Received", formatDateTime(lead.createdAt)],
    ["Last updated", formatDateTime(lead.updatedAt)],
  ];

  return (
    <>
      <AdminHeader
        back={{ href: "/admin/leads", label: "All leads" }}
        title={lead.fullName}
        action={
          <a href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: your enquiry about ${lead.service}`)}`} className={buttonClasses()}>
            <Mail className="size-4" aria-hidden /> Reply by email
          </a>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Panel className="p-6 sm:p-8">
            <h2 className="eyebrow text-muted">Message</h2>
            <p className="mt-4 whitespace-pre-wrap text-[1.02rem] leading-relaxed">{lead.message}</p>
          </Panel>
          <Panel>
            <dl className="divide-y divide-line">
              {details.map(([k, v]) => (
                <div key={k} className="grid gap-1 p-5 sm:grid-cols-[160px_1fr]">
                  <dt className="eyebrow text-muted">{k}</dt>
                  <dd className="break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="eyebrow text-muted">Status</h2>
              <StatusBadge status={lead.status} />
            </div>
            <LeadStatusControl id={lead.id} status={lead.status} />
          </Panel>

          <Panel className="p-6">
            <h2 className="eyebrow text-muted">Notification email</h2>
            {lead.emailSent ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-success">
                <CircleCheck className="size-4" aria-hidden /> Delivered to your inbox
              </p>
            ) : lead.emailError ? (
              <div className="mt-3 text-sm text-danger">
                <p className="flex items-center gap-2">
                  <CircleAlert className="size-4" aria-hidden /> Failed to send
                </p>
                <p className="mt-2 break-words text-xs text-muted">{lead.emailError}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Pending</p>
            )}
          </Panel>

          <Panel className="p-6">
            <h2 className="eyebrow text-muted">Danger zone</h2>
            <p className="mt-2 text-sm text-muted">Permanently remove this lead and all of its data.</p>
            <div className="mt-4">
              <DeleteLeadButton id={lead.id} />
            </div>
          </Panel>
        </aside>
      </div>
    </>
  );
}
