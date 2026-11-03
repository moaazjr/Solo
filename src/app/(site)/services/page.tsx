import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { CtaSection, ProcessSection } from "@/components/sections/home-sections";
import { Container } from "@/components/ui/primitives";
import { DynamicIcon } from "@/components/ui/icon";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { getServices } from "@/lib/data/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "AI-powered software development, web and product engineering, AI agents and automation, sales outreach systems and technical consulting.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={<>Everything you need to <em className="text-accent">build and grow.</em></>}
        description="Each engagement is led by the founder and delivered by a team of specialised AI agents, with planning, testing and human review built into every step."
      />

      <section className="py-24 sm:py-32">
        <Container>
          {services.length === 0 ? (
            <p className="rounded-md border border-dashed border-line p-10 text-center text-muted">
              No services are published yet. Please check back soon.
            </p>
          ) : (
            <Stagger className="grid gap-5 md:grid-cols-2">
              {services.map((s, i) => (
                <StaggerItem key={s.id} className={i === 0 ? "md:col-span-2" : undefined}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-paper p-8 transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_40px_80px_-50px_rgba(14,13,12,0.5)] sm:p-10"
                  >
                    <div aria-hidden className="absolute -right-24 -top-24 size-64 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover:bg-accent/15" />
                    <div className="relative flex items-start justify-between">
                      <span className="grid size-12 place-items-center rounded-full border border-line text-accent transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-ivory">
                        <DynamicIcon name={s.icon} className="size-5" />
                      </span>
                      <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className={i === 0 ? "relative mt-12 grid gap-10 lg:grid-cols-2" : "relative mt-12"}>
                      <div>
                        <h2 className="display text-4xl sm:text-5xl">{s.title}</h2>
                        <p className="mt-4 text-lg leading-relaxed text-muted">{s.summary}</p>
                      </div>
                      <ul className={i === 0 ? "grid content-start gap-3 sm:grid-cols-2 lg:mt-2" : "mt-8 grid gap-3"}>
                        {s.features.slice(0, i === 0 ? 6 : 3).map((f) => (
                          <li key={f} className="flex gap-3 text-[0.95rem]">
                            <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="relative mt-auto inline-flex items-center gap-1.5 pt-10 text-sm font-medium">
                      Learn more
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Container>
      </section>

      <ProcessSection />
      <div className="pt-24 sm:pt-32">
        <CtaSection
          title={<>Not sure which service <em className="text-rose">fits?</em></>}
          description="Describe your goal and we will recommend the right approach. Honest advice, even if the answer is that you do not need us."
          primary={{ label: "Request a Consultation", href: "/contact" }}
          secondary={null}
        />
      </div>
    </>
  );
}
