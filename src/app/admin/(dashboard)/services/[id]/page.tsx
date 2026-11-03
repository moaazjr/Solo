import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { deleteService, saveService } from "@/actions/admin";
import { AdminHeader } from "@/components/admin/ui";
import { ContentForm } from "@/components/admin/content-form";
import { serviceFields } from "@/components/admin/content-fields";
import { DeleteButton } from "@/components/admin/lead-controls";

export const metadata = { title: "Edit service" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;

export default async function EditServicePage({ params }: PageProps<"/admin/services/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const service = await db.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <>
      <AdminHeader
        back={{ href: "/admin/services", label: "All services" }}
        title={service.title}
        action={
          service.published ? (
            <Link href={`/services/${service.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm text-accent">
              View live <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          ) : undefined
        }
      />
      <ContentForm
        fields={serviceFields}
        values={service}
        action={saveService.bind(null, service.id)}
        cancelHref="/admin/services"
        submitLabel="Save changes"
      />
      <div className="mt-8 flex justify-end">
        <DeleteButton
          action={deleteService.bind(null, service.id)}
          label="Delete service"
          confirmText={`Delete “${service.title}” permanently? This cannot be undone.`}
        />
      </div>
    </>
  );
}
