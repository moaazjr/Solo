import { Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-line", className)}>
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div aria-hidden className="absolute -right-32 -top-48 -z-10 size-[520px] rounded-full bg-accent/10 blur-[110px] animate-drift" />
      <Container className="pb-16 pt-16 sm:pb-24 sm:pt-24">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="display mt-6 max-w-4xl text-[3rem] sm:text-7xl lg:text-[5.2rem]">{title}</h1>
          {description && <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{description}</p>}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
