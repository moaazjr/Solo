import { requireAdmin } from "@/lib/auth/session";
import { saveService } from "@/actions/admin";
import { AdminHeader } from "@/components/admin/ui";
import { ContentForm } from "@/components/admin/content-form";
import { serviceFields } from "@/components/admin/content-fields";

export const metadata = { title: "New service" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;

export default async function NewServicePage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader back={{ href: "/admin/services", label: "All services" }} title="New service" />
      <ContentForm
        fields={serviceFields}
        values={{ icon: "Sparkles", order: 0, published: true }}
        action={saveService.bind(null, null)}
        cancelHref="/admin/services"
        submitLabel="Create service"
      />
    </>
  );
}
