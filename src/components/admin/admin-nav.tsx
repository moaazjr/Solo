"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FolderKanban, Inbox, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Briefcase },
];

/** Reads the current path (runtime data), so it is rendered inside a Suspense boundary. */
export function AdminNavWithPath() {
  return <AdminNav pathname={usePathname()} />;
}

export function AdminNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              active ? "bg-ink text-ivory" : "text-muted hover:bg-sand hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
