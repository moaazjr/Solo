import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8", className)}>{children}</div>;
}

export function Eyebrow({
  children,
  className,
  tone = "accent",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "accent" | "muted" | "light";
}) {
  const tones = { accent: "text-accent", muted: "text-muted", light: "text-rose" };
  return (
    <p className={cn("eyebrow flex items-center gap-3", tones[tone], className)}>
      <span aria-hidden className="h-px w-6 bg-current opacity-60" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Eyebrow tone={tone === "light" ? "light" : "accent"} className={cn(align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2 className={cn("display mt-5 text-[2.6rem] sm:text-6xl", tone === "light" ? "text-ivory" : "text-ink")}>
        {title}
      </h2>
      {description && (
        <p className={cn("mt-6 text-lg leading-relaxed", tone === "light" ? "text-night-muted" : "text-muted")}>
          {description}
        </p>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "ink" | "success" | "warning" | "info";
  className?: string;
}) {
  const tones = {
    neutral: "bg-sand text-muted",
    accent: "bg-accent-soft text-accent",
    ink: "bg-ink text-ivory",
    success: "bg-[#e3efe8] text-success",
    warning: "bg-[#f6ecd9] text-[#8a5a12]",
    info: "bg-[#e3e9f2] text-[#2c4a72]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A clearly visible marker for content that is not yet real company information. */
export function PlaceholderNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted", className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-[#c9932f]" />
      {children}
    </p>
  );
}
