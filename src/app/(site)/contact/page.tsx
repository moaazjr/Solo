import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/config/site";
import { getServices } from "@/lib/data/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Tell us about your project. You will hear back from the founder personally, usually within one business day.",
  path: "/contact",
});

export default async function ContactPage() {
  const services = (await getServices()).map((s) => ({ slug: s.slug, title: s.title }));

  const details = [
    { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: MapPin, label: "Location", value: siteConfig.contact.location },
    { icon: Clock, label: "Response time", value: siteConfig.contact.responseTime },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Let&apos;s start a <em className="text-accent">conversation.</em></>}
        description="Tell us what you are working on. Every message is read by the founder, never by an automated inbox."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal className="space-y-12 lg:sticky lg:top-28 lg:self-start">
            <div>
              <Eyebrow>Get in touch</Eyebrow>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {details.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex gap-4 py-5">
                    <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden strokeWidth={1.5} />
                    <div>
                      <p className="eyebrow text-muted">{label}</p>
                      {href ? (
                        <a href={href} className="mt-1 block break-all text-lg transition-colors hover:text-accent">
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-lg">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Eyebrow>Follow</Eyebrow>
              <ul className="mt-6 flex flex-wrap gap-2">
                {siteConfig.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
                    >
                      {s.label}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md bg-ink p-8 text-ivory">
              <p className="display text-3xl leading-tight">What happens next?</p>
              <ol className="mt-6 space-y-4 text-sm text-night-muted">
                {[
                  "The founder reads your message personally.",
                  "You receive a reply within one business day.",
                  "If there is a fit, we schedule a short discovery call.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-mono text-rose">0{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm services={services} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
