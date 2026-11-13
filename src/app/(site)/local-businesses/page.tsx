import { Check, Clock, Coffee, MapPin, MessageCircle, Phone, Scissors, ShoppingBag, Smartphone, Stethoscope, Utensils } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { CtaSection } from "@/components/sections/home-sections";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Websites for Local Businesses",
  description:
    "Professional, mobile-first websites for cafés, restaurants, salons, clinics and shops. Get found online, look professional and turn searches into customers.",
  path: "/local-businesses",
});

const CONTACT_HREF = "/contact?service=websites-for-local-businesses";

const audiences = [
  { icon: Coffee, label: "Cafés" },
  { icon: Utensils, label: "Restaurants" },
  { icon: Scissors, label: "Salons & barbers" },
  { icon: Stethoscope, label: "Clinics & dentists" },
  { icon: ShoppingBag, label: "Shops & boutiques" },
];

const included = [
  { icon: Smartphone, title: "Built for phones", body: "Most of your customers will find you on their phone. Your site looks sharp and loads fast on any screen." },
  { icon: MapPin, title: "On the map", body: "Your address, a live map and directions, so new customers can find their way to your door." },
  { icon: Phone, title: "One-tap contact", body: "Big, clear buttons to call you or message you on WhatsApp, right from the first screen." },
  { icon: Utensils, title: "Menu or services", body: "Show what you offer with photos and prices, and keep it easy to update when things change." },
  { icon: Clock, title: "Opening hours", body: "No more “are you open?” calls. Your hours, holidays and special days, always up to date." },
  { icon: MessageCircle, title: "Enquiries to your inbox", body: "A simple contact form for bookings, catering and questions, delivered straight to you." },
];

const steps = [
  { title: "We talk", body: "A short conversation about your business, your customers and what you want people to do." },
  { title: "We build", body: "We design your site, write the words with you, and set up your domain and hosting." },
  { title: "You go live", body: "Your site launches, ready to share on social media, Google Maps and your shop window." },
];

export default function LocalBusinessesPage() {
  return (
    <>
      <PageHeader
        eyebrow="For local businesses"
        title={<>Your business deserves to be <em className="text-accent">found online.</em></>}
        description="Customers search before they visit. If your café, restaurant, salon or shop has no website, they find someone else. We build you a beautiful, fast website, and handle everything technical."
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={CONTACT_HREF} size="lg" arrow>
            Get my website
          </ButtonLink>
          <ButtonLink href="#included" size="lg" variant="secondary">
            See what&apos;s included
          </ButtonLink>
        </div>
      </PageHeader>

      {/* Who it's for */}
      <section className="border-b border-line bg-paper py-12">
        <Container>
          <Stagger as="ul" className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {audiences.map(({ icon: Icon, label }) => (
              <StaggerItem as="li" key={label} className="inline-flex items-center gap-2 rounded-full border border-line bg-ivory px-4 py-2 text-sm">
                <Icon className="size-4 text-accent" aria-hidden strokeWidth={1.5} />
                {label}
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* The problem */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <Reveal>
            <Eyebrow>Why it matters</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="display text-[2.1rem] leading-[1.12] sm:text-5xl sm:leading-[1.08]">
              A social media page is a start, <span className="text-muted">but it&apos;s not yours, it&apos;s hard to find on Google,
              and it buries the basics.</span> A website puts your menu, hours, location and phone number one search away,
              and makes a small business look as trustworthy as a big brand.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What's included */}
      <section id="included" className="scroll-mt-24 bg-sand/60 py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What you get"
              title={<>Everything your customers <em className="text-accent">look for.</em></>}
              description="A complete website, designed for your business, not a template with your name dropped in."
            />
          </Reveal>
          <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map(({ icon: Icon, title, body }) => (
              <StaggerItem key={title} className="rounded-md border border-line bg-paper p-8">
                <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
                  <Icon className="size-5" aria-hidden strokeWidth={1.5} />
                </span>
                <h3 className="display mt-8 text-[1.7rem] leading-tight">{title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{body}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 rounded-md bg-ink p-8 text-ivory sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              {["Domain and hosting set up for you", "Secure (HTTPS) and fast", "Ready for Google search", "You own your website"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-rose" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href={CONTACT_HREF} variant="inverse" arrow className="mt-8 shrink-0 sm:mt-0">
              Ask for a quote
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="How it works" title={<>Three steps. <em className="text-accent">No tech headaches.</em></>} />
          </Reveal>
          <Stagger as="ol" className="mt-16 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
            {steps.map((step, i) => (
              <StaggerItem as="li" key={step.title} className="bg-paper p-8">
                <span className="font-mono text-xs text-accent">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="display mt-10 text-3xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <CtaSection
        title={<>Ready to get <em className="text-rose">found?</em></>}
        description="Tell us about your business. You'll hear back personally, usually within one business day."
        primary={{ label: "Get my website", href: CONTACT_HREF }}
        secondary={null}
      />
    </>
  );
}
