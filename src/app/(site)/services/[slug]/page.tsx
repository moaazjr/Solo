import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { CtaSection } from "@/components/sections/home-sections";
import { getServiceBySlug, getServiceSlugs, getServices } from "@/lib/data/content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getServiceSlugs();
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return pageMetadata({ title: service.title, description: service.summary, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, all] = await Promise.all([getServiceBySlug(slug), getServices()]);
  if (!service) notFound();

  const others = all.filter((s) => s.slug !== service.slug).slice(0, 3);
  const contactHref = `/contact?service=${encodeURIComponent(service.slug)}`;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="absolute -right-32 -top-48 -z-10 size-[520px] rounded-full bg-accent/10 blur-[110px] animate-drift" />
        <Container className="pb-16 pt-12 sm:pb-24 sm:pt-16">
          <Link href="/services" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            All services
          </Link>
          <Reveal className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <span className="grid size-14 place-items-center rounded-full bg-accent text-ivory">
                <DynamicIcon name={service.icon} className="size-6" />
              </span>
              <h1 className="display mt-8 text-[3rem] sm:text-7xl">{service.title}</h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{service.tagline}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <ButtonLink href={contactHref} size="lg" arrow>
                Request a Consultation
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <Eyebrow>Overview</Eyebrow>
            <p className="display mt-6 text-3xl leading-[1.2] sm:text-4xl">{service.description}</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-md border border-line bg-paper p-8 sm:p-10">
            <h2 className="eyebrow text-muted">What&apos;s included</h2>
            <Stagger as="ul" className="mt-6 divide-y divide-line">
              {service.features.map((f) => (
                <StaggerItem as="li" key={f} className="flex items-center gap-4 py-4">
                  <Check className="size-4 shrink-0 text-accent" aria-hidden />
                  <span>{f}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </Container>
      </section>

      <section className="bg-night py-24 text-ivory sm:py-32">
        <Container>
          <Reveal>
            <Eyebrow tone="light">Business value</Eyebrow>
            <h2 className="display mt-5 max-w-2xl text-5xl sm:text-6xl">What it means for your business</h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-md bg-night-line sm:grid-cols-2 lg:grid-cols-4">
            {service.benefits.map((b, i) => (
              <StaggerItem key={b} className="bg-night p-8">
                <span className="font-mono text-xs text-rose">0{i + 1}</span>
                <p className="display mt-10 text-2xl leading-snug">{b}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="py-24 sm:py-32">
          <Container>
            <Reveal>
              <h2 className="display text-4xl sm:text-5xl">Other services</h2>
            </Reveal>
            <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
              {others.map((o) => (
                <StaggerItem key={o.id}>
                  <Link
                    href={`/services/${o.slug}`}
                    className="group flex h-full flex-col rounded-md border border-line bg-paper p-7 transition-all duration-500 hover:-translate-y-1 hover:border-ink/20"
                  >
                    <DynamicIcon name={o.icon} className="size-5 text-accent" />
                    <h3 className="display mt-8 text-2xl">{o.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{o.summary}</p>
                    <ArrowUpRight className="mt-6 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      )}

      <CtaSection
        title={<>Ready when <em className="text-rose">you are.</em></>}
        description={`Tell us about your goals for ${service.title}. You will hear back from the founder personally, usually within one business day.`}
        primary={{ label: "Request a Consultation", href: contactHref }}
        secondary={null}
      />
    </>
  );
}
