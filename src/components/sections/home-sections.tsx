import Link from "next/link";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import type { Service, Testimonial } from "@/generated/prisma/client";
import { Container, Eyebrow, PlaceholderNote, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { ProjectCard, type ProjectCardData } from "@/components/projects/project-card";
import { processSteps, stats, whyUs } from "@/content/company";
import { cn } from "@/lib/utils";

export function IntroStatement() {
  return (
    <section className="border-y border-line bg-paper py-24 sm:py-32">
      <Container className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <Reveal>
          <Eyebrow>Who we are</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="display text-[2.1rem] leading-[1.12] sm:text-5xl sm:leading-[1.08]">
            We are a new kind of company: <span className="text-muted">one accountable human, supported by a</span>{" "}
            disciplined team of AI agents. <span className="text-muted">Engineering, research, review and outreach run in
            parallel, around the clock,</span> while every decision that matters stays with a person you can talk to.
          </p>
          <Link
            href="/about"
            className="group mt-10 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            More about how we work
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

export function ServicesOverview({ services }: { services: Service[] }) {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading eyebrow="What we do" title={<>Services built for <em className="text-accent">outcomes</em></>} />
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/services" variant="secondary" arrow>
              Explore Our Services
            </ButtonLink>
          </Reveal>
        </div>

        {services.length === 0 ? (
          <p className="mt-16 rounded-md border border-dashed border-line p-10 text-center text-muted">
            Services will appear here once they are published.
          </p>
        ) : (
          <Stagger as="ul" className="mt-16 border-t border-line">
            {services.map((service, i) => (
              <StaggerItem as="li" key={service.id}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative grid gap-4 border-b border-line py-8 transition-colors sm:grid-cols-[80px_1fr_1.2fr_40px] sm:items-center sm:gap-8"
                >
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display text-3xl transition-transform duration-500 ease-out-soft group-hover:translate-x-2 sm:text-4xl">
                    {service.title}
                  </h3>
                  <p className="text-[0.97rem] leading-relaxed text-muted">{service.summary}</p>
                  <span className="hidden size-10 place-items-center rounded-full border border-line transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory sm:grid">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                  <span aria-hidden className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-soft group-hover:scale-x-100" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Container>
    </section>
  );
}

export function WhyChooseUs() {
  return (
    <section className="bg-sand/60 py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <SectionHeading
              eyebrow="Why choose us"
              title={<>The focus of a founder. <em className="text-accent">The reach of a team.</em></>}
              description="Traditional agencies trade attention for scale. We refuse that trade. Here is what working with a one-human company actually means for you."
            />
          </Reveal>
        </div>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {whyUs.map((item, i) => (
            <StaggerItem
              key={item.title}
              className={cn(
                "group rounded-md border border-line bg-paper p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(14,13,12,0.45)]",
                i === 1 && "sm:translate-y-10 sm:hover:translate-y-9",
                i === 3 && "sm:translate-y-10 sm:hover:translate-y-9",
              )}
            >
              <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-ivory">
                <DynamicIcon name={item.icon} className="size-5" />
              </span>
              <h3 className="display mt-8 text-[1.7rem] leading-tight">{item.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{item.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-night py-20 text-ivory sm:py-24">
      <div aria-hidden className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-rose/50 to-transparent" />
      <Container>
        <Stagger className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StaggerItem key={s.label} className={cn("px-2 sm:px-6", i > 0 && "lg:border-l lg:border-night-line")}>
              <p className="display text-6xl sm:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-night-muted">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function FeaturedProjects({ projects }: { projects: ProjectCardData[] }) {
  const [first, ...rest] = projects;
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading eyebrow="Selected work" title={<>Featured <em className="text-accent">projects</em></>} />
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/projects" variant="secondary" arrow>
              View all projects
            </ButtonLink>
          </Reveal>
        </div>

        {!first ? (
          <p className="mt-16 rounded-md border border-dashed border-line p-10 text-center text-muted">
            Featured projects will appear here once they are published.
          </p>
        ) : (
          <div className="mt-16 grid gap-x-8 gap-y-16 lg:grid-cols-[1.35fr_1fr]">
            <Reveal className="lg:row-span-2">
              <ProjectCard project={first} size="large" />
            </Reveal>
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={0.1 * (i + 1)}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="border-t border-line bg-paper py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Our process"
            title={<>Five steps. <em className="text-accent">No surprises.</em></>}
            description="A clear, repeatable path from first conversation to launch, with a human decision at every gate."
          />
        </Reveal>
        <Stagger as="ol" className="mt-16 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, i) => (
            <StaggerItem as="li" key={step.title} className="group relative bg-paper p-7 transition-colors duration-500 hover:bg-ivory">
              <span className="font-mono text-xs text-accent">Step {String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-10 text-3xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-soft group-hover:scale-x-100" />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  const hasPlaceholders = testimonials.some((t) => t.isPlaceholder);
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Client voices" title={<>In their <em className="text-accent">words</em></>} />
          {hasPlaceholders && <PlaceholderNote>Placeholder testimonials. Real client quotes coming soon</PlaceholderNote>}
        </Reveal>
        <Stagger className="mt-16 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id} as="article" className="flex flex-col rounded-md border border-line bg-paper p-8">
              <Quote className="size-6 text-accent" aria-hidden strokeWidth={1.5} />
              <blockquote className="display mt-6 flex-1 text-[1.6rem] leading-snug">“{t.quote}”</blockquote>
              <footer className="mt-8 border-t border-line pt-5">
                <p className="font-medium">{t.author}</p>
                <p className="text-sm text-muted">
                  {t.role}, {t.company}
                </p>
              </footer>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function CtaSection({
  title = (
    <>
      Let&apos;s build something <em className="text-rose">worth keeping.</em>
    </>
  ),
  description = "Tell us what you are working on. You will hear back from the founder personally, usually within one business day.",
  primary = { label: "Let's Work Together", href: "/contact" },
  secondary = { label: "Explore Our Services", href: "/services" },
}: {
  title?: React.ReactNode;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
}) {
  return (
    <section className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative isolate overflow-hidden rounded-md bg-ink px-6 py-24 text-ivory sm:py-32">
        <div aria-hidden className="absolute -left-20 top-1/2 -z-10 size-[520px] -translate-y-1/2 rounded-full bg-accent/40 blur-[140px] animate-drift" />
        <div aria-hidden className="grain absolute inset-0 -z-10 opacity-[0.07]" />
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow tone="light" className="justify-center">Start a project</Eyebrow>
          <h2 className="display mt-6 text-5xl sm:text-7xl">{title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-night-muted">{description}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={primary.href} variant="inverse" size="lg" arrow>
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink
                href={secondary.href}
                size="lg"
                variant="secondary"
                className="border-ivory/20 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
              >
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
