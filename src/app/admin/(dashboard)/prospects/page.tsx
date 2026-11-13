import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { AdminHeader, EmptyState, Panel } from "@/components/admin/ui";
import { PlaceFinder } from "@/components/admin/place-finder";
import { ProspectRow } from "@/components/admin/prospect-row";
import { prospectStatusLabels } from "@/components/admin/prospect-links";
import { prospectStatusSchema } from "@/validation/prospect";
import { cn } from "@/lib/utils";

export const metadata = { title: "Prospects" };
// Live, per-request admin data: opt out of instant-navigation validation.
export const instant = false;
// OpenStreetMap searches for big cities can take up to a minute.
export const maxDuration = 60;

export default async function ProspectsPage({ searchParams }: PageProps<"/admin/prospects">) {
  await requireAdmin();
  const params = await searchParams;
  const status = prospectStatusSchema.safeParse(params.status).data;

  const [prospects, counts] = await Promise.all([
    db.prospect.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" }, take: 200 }),
    db.prospect.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const total = counts.reduce((sum, c) => sum + c._count._all, 0);
  const countOf = (s?: string) => (s ? (counts.find((c) => c.status === s)?._count._all ?? 0) : total);
  const filters = [{ label: "All", value: undefined }, ...prospectStatusSchema.options.map((s) => ({ label: prospectStatusLabels[s], value: s }))];

  return (
    <>
      <AdminHeader
        title="Prospects"
        description="Find local businesses with no website, save them, and track your outreach."
      />

      <PlaceFinder />

      <section className="mt-12">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display text-3xl">Saved prospects</h2>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Link
                key={f.label}
                href={f.value ? `/admin/prospects?status=${f.value}` : "/admin/prospects"}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  status === f.value ? "border-ink bg-ink text-ivory" : "border-line bg-paper text-muted hover:text-ink",
                )}
              >
                {f.label} <span className="ml-1 font-mono text-[0.7rem] opacity-60">{countOf(f.value)}</span>
              </Link>
            ))}
          </div>
        </div>

        {prospects.length === 0 ? (
          <EmptyState
            title={status ? "Nothing here" : "No prospects yet"}
            body={status ? "No prospects with this status." : "Search a city above and save the places you want to contact."}
          />
        ) : (
          <Panel>
            <ul className="divide-y divide-line">
              {prospects.map((p) => (
                <ProspectRow key={p.id} prospect={p} />
              ))}
            </ul>
          </Panel>
        )}
      </section>
    </>
  );
}
