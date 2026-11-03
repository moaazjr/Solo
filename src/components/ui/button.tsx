import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-all duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-ivory hover:bg-accent shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]",
  secondary: "border border-ink/15 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-ivory",
  ghost: "text-ink hover:text-accent",
  inverse: "bg-ivory text-ink hover:bg-rose",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

function Arrow() {
  return (
    <ArrowUpRight
      aria-hidden
      className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  arrow,
  className,
  children,
  ...rest
}: CommonProps & Omit<React.ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant,
  size,
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
