import { requireAdmin } from "@/lib/auth/session";
import { saveProject } from "@/actions/admin";
import { AdminHeader } from "@/components/admin/ui";
import { ContentForm } from "@/components/admin/content-form";
import { projectFields } from "@/components/admin/content-fields";

export const metadata = { title: "New project" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader back={{ href: "/admin/projects", label: "All projects" }} title="New project" />
      <ContentForm
        fields={projectFields}
        values={{ year: 2026, order: 0, published: true, isPlaceholder: false }}
        action={saveProject.bind(null, null)}
        cancelHref="/admin/projects"
        submitLabel="Create project"
      />
    </>
  );
}
