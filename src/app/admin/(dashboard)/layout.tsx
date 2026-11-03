import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { Logo } from "@/components/layout/logo";
import { AdminNav, AdminNavWithPath } from "@/components/admin/admin-nav";
import { AdminLoading } from "@/components/admin/ui";

// Admin pages are per-request by design (session + live data), so skip instant-navigation validation.
export const instant = false;

/** Verifies the session at request time, then renders the protected page. */
async function AuthGate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}

async function SignedInAs() {
  const admin = await requireAdmin();
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium">{admin.name}</p>
      <p className="truncate text-xs text-muted">{admin.email}</p>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:py-6">
          <Logo />
          <span className="rounded-full bg-sand px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">Admin</span>
        </div>
        <div className="px-3 pb-3 lg:flex-1 lg:pb-0">
          <Suspense fallback={<AdminNav pathname="" />}>
            <AdminNavWithPath />
          </Suspense>
        </div>
        <div className="hidden space-y-4 border-t border-line p-5 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-1 text-sm text-muted hover:text-ink">
            View website <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
          <div className="flex items-center justify-between gap-3">
            <Suspense fallback={<div className="h-9 w-32 animate-pulse rounded bg-sand" />}>
              <SignedInAs />
            </Suspense>
            <form action={logout}>
              <button type="submit" aria-label="Sign out" className="grid size-9 place-items-center rounded-md text-muted hover:bg-sand hover:text-ink">
                <LogOut className="size-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
          <Suspense fallback={<AdminLoading />}>
            <AuthGate>{children}</AuthGate>
          </Suspense>
        </div>
        <form action={logout} className="px-5 pb-10 lg:hidden">
          <button type="submit" className="flex items-center gap-2 text-sm text-muted">
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
