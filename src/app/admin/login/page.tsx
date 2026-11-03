import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-5 py-16">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-10 rounded-md border border-line bg-paper p-8 shadow-[0_30px_60px_-45px_rgba(14,13,12,0.5)]">
          <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
            <Lock className="size-4" aria-hidden />
          </span>
          <h1 className="display mt-6 text-4xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted">Restricted area. Authorised access only.</p>
          <LoginForm />
        </div>
        <Link href="/" className="mt-8 flex items-center justify-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden />
          Back to website
        </Link>
      </div>
    </main>
  );
}
