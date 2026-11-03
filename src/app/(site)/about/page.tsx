import { ArrowUpRight, Check, Minus } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { CtaSection } from "@/components/sections/home-sections";
import { AgentNetwork } from "@/components/sections/agent-network";
import { Badge, Container, Eyebrow, PlaceholderNote, SectionHeading } from "@/components/ui/primitives";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { team, values } from "@/content/company";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description: `${siteConfig.name} is a one-human technology company: one founder leading a team of specialised AI agents. Learn about our mission, values and the way we work.`,
  path: "/about",
});

const comparison = [
  { label: "Who you talk to", agency: "Account managers", us: "The founder, directly" },
  { label: "Who does the work", agency: "Whoever is available", us: "Specialised agents, reviewed by the founder" },
  { label: "Working hours", agency: "Office hours", us: "Around the clock" },
  { label: "Overhead in your price", agency: "Offices, layers, idle time", us: "Almost none" },
  { label: "Quality control", agency: "Varies by team", us: "Tests, independent review and human sign-off" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={<>A company of one, <em className="text-accent">built to work like many.</em></>}
        description={`${siteConfig.name} is an experiment that became a business model: a single founder who directs a team of AI agents to deliver the work of a full studio, without giving up the care, accountability and judgment of a person.`}
      />

      {/* Introduction */}
      <section className="py-24 sm:py-32">
        <Container className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="display mt-5 text-5xl sm:text-6xl">Why one human?</h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Most companies grow by adding people, and with every person comes more meetings, more hand-offs and more
                distance between the client and the person who actually cares about the result.
              </p>
              <p>
                We took a different path. Instead of hiring, we built a team of AI agents, each specialised in a
                discipline, each held to a written standard, and each reporting to one founder who owns every outcome.
              </p>
              <p className="text-ink">The result is a company that is small where it matters and large where it counts.</p>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="rounded-md border border-line bg-paper p-6 sm:p-10">
            <AgentNetwork className="h-auto w-full" />
          </Reveal>
        </Container>
      </section>

      {/* Mission & vision */}
      <section className="bg-night py-24 text-ivory sm:py-32">
        <Container className="grid gap-px overflow-hidden rounded-md bg-night-line md:grid-cols-2">
          {[
            {
              k: "Mission",
              t: "To give every client the attention of a founder and the capability of a full team.",
              b: "We exist to prove that great work does not require a big organisation, only clear thinking, rigorous process and the right tools.",
            },
            {
              k: "Vision",
              t: "A world where small, accountable companies do work that once needed hundreds of people.",
              b: "We believe the future belongs to lean companies that pair human judgment with AI capability, and we intend to show what that looks like at its best.",
            },
          ].map((item, i) => (
            <Reveal key={item.k} delay={i * 0.1} className="bg-night p-8 sm:p-14">
              <Eyebrow tone="light">{item.k}</Eyebrow>
              <p className="display mt-8 text-4xl leading-[1.1] sm:text-5xl">{item.t}</p>
              <p className="mt-6 leading-relaxed text-night-muted">{item.b}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Values */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Core values" title={<>What we <em className="text-accent">stand for</em></>} />
          </Reveal>
          <Stagger className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <StaggerItem key={v.title} className="border-t border-ink pt-6">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <h3 className="display mt-6 text-3xl">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Philosophy */}
      <section className="border-y border-line bg-paper py-24 sm:py-32">
        <Container className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <Reveal>
            <Eyebrow>Our philosophy</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="display text-[2.2rem] leading-[1.1] sm:text-6xl">
              “AI should multiply human judgment, <span className="text-accent">never replace it.</span>”
            </blockquote>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              Our agents plan, research, build, test and draft. But they do not decide what is good enough, what is
              ethical, or what gets sent to a client. That remains a human responsibility, and we are transparent about
              which parts of our work are done by AI.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Team */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="The team"
              title={<>One human. <em className="text-accent">A growing roster of agents.</em></>}
              description="Every role is filled by a specialist, and every specialist reports to the founder."
            />
            <PlaceholderNote>Founder profile is a placeholder</PlaceholderNote>
          </Reveal>
          <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <StaggerItem
                key={m.name}
                as="article"
                className={
                  m.kind === "human"
                    ? "flex flex-col rounded-md bg-ink p-8 text-ivory"
                    : "flex flex-col rounded-md border border-line bg-paper p-8"
                }
              >
                <div className="flex items-center justify-between">
                  <Badge tone={m.kind === "human" ? "accent" : "neutral"}>{m.kind === "human" ? "Human" : "AI agent"}</Badge>
                  <span className={m.kind === "human" ? "text-xs text-night-muted" : "text-xs text-muted"}>{m.role}</span>
                </div>
                <h3 className="display mt-12 text-4xl">{m.name}</h3>
                <p className={m.kind === "human" ? "mt-3 flex-1 text-sm leading-relaxed text-night-muted" : "mt-3 flex-1 text-sm leading-relaxed text-muted"}>
                  {m.body}
                </p>
                {"href" in m && (
                  <a
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent"
                  >
                    View on GitHub
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </a>
                )}
              </StaggerItem>
            ))}
            <StaggerItem as="article" className="flex flex-col rounded-md border border-dashed border-ink/20 p-8">
              <div className="flex items-center justify-between">
                <Badge>Open role</Badge>
                <span className="text-xs text-muted">Next hire</span>
              </div>
              <h3 className="display mt-12 text-4xl text-muted">Growing</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Support, marketing and operations agents join the team as the company grows, each chosen and trained with care.
              </p>
            </StaggerItem>
          </Stagger>
        </Container>
      </section>

      {/* Difference */}
      <section className="bg-sand/60 py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="What makes us different" title={<>Not an agency. <em className="text-accent">Not a freelancer.</em></>} />
          </Reveal>
          <Reveal delay={0.1} className="mt-14 overflow-x-auto rounded-md border border-line bg-paper">
            <table className="w-full min-w-[640px] text-left">
              <caption className="sr-only">How {siteConfig.name} compares to a traditional agency</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="eyebrow p-6 font-normal text-muted">&nbsp;</th>
                  <th scope="col" className="eyebrow p-6 font-normal text-muted">Traditional agency</th>
                  <th scope="col" className="eyebrow p-6 font-normal text-accent">{siteConfig.name}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <th scope="row" className="p-6 font-medium">{row.label}</th>
                    <td className="p-6 text-muted">
                      <span className="inline-flex items-center gap-2"><Minus className="size-4 shrink-0" aria-hidden />{row.agency}</span>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center gap-2"><Check className="size-4 shrink-0 text-accent" aria-hidden />{row.us}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Container>
      </section>

      <div className="pt-24 sm:pt-32">
        <CtaSection />
      </div>
    </>
  );
}
