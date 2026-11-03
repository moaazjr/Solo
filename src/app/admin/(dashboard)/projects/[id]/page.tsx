import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { deleteProject, saveProject } from "@/actions/admin";
import { AdminHeader } from "@/components/admin/ui";
import { ContentForm } from "@/components/admin/content-form";
import { projectFields } from "@/components/admin/content-fields";
import { DeleteButton } from "@/components/admin/lead-controls";

export const metadata = { title: "Edit project" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <AdminHeader
        back={{ href: "/admin/projects", label: "All projects" }}
        title={project.title}
        action={
          project.published ? (
            <Link href={`/projects/${project.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm text-accent">
              View live <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          ) : undefined
        }
      />
      <ContentForm
        fields={projectFields}
        values={project}
        action={saveProject.bind(null, project.id)}
        cancelHref="/admin/projects"
        submitLabel="Save changes"
      />
      <div className="mt-8 flex justify-end">
        <DeleteButton
          action={deleteProject.bind(null, project.id)}
          label="Delete project"
          confirmText={`Delete “${project.title}” permanently? This cannot be undone.`}
        />
      </div>
    </>
  );
}
