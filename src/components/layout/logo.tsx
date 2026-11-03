import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}, home`}
      className={cn("group inline-flex items-center gap-2.5", tone === "light" ? "text-ivory" : "text-ink", className)}
    >
      <span aria-hidden className="relative grid size-7 place-items-center">
        <span className="absolute inset-0 rounded-full border border-current opacity-30 transition-transform duration-500 group-hover:scale-110" />
        <span className="size-2.5 rounded-full bg-accent" />
      </span>
      <span className="display text-[1.75rem] leading-none">{siteConfig.name}</span>
    </Link>
  );
}
