import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Badge, Container, Eyebrow, PlaceholderNote } from "@/components/ui/primitives";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { CtaSection } from "@/components/sections/home-sections";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjectBySlug, getProjectSlugs, getProjects } from "@/lib/data/content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getProjectSlugs();
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return pageMetadata({ title: project.title, description: project.summary, path: `/projects/${project.slug}` });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;

  return (
    <>
      <section className="border-b border-line">
        <Container className="pb-14 pt-12 sm:pt-16">
          <Link href="/projects" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            All projects
          </Link>
          <Reveal className="mt-12">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">{project.category}</Badge>
              {project.isPlaceholder && <Badge>Sample project</Badge>}
            </div>
            <h1 className="display mt-6 text-[3.4rem] sm:text-8xl">{project.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted">{project.summary}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-8 md:grid-cols-4">
              {[
                ["Client", project.client],
                ["Category", project.category],
                ["Year", String(project.year)],
                ["Stack", project.technologies.slice(0, 2).join(", ")],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow text-muted">{k}</dt>
                  <dd className="mt-2 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      <Container className="pt-10">
        <Reveal className="relative aspect-[16/10] overflow-hidden rounded-md bg-sand">
          <Image src={project.coverImage} alt={`${project.title} cover image`} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
        </Reveal>
        {project.isPlaceholder && (
          <PlaceholderNote className="mt-4">This is an illustrative sample project, not a real client engagement</PlaceholderNote>
        )}
      </Container>

      <section className="py-24 sm:py-32">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-14">
            <Reveal>
              <Eyebrow>The challenge</Eyebrow>
              <p className="mt-5 text-lg leading-relaxed text-muted">{project.challenge}</p>
            </Reveal>
            <Reveal>
              <Eyebrow>Technologies</Eyebrow>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li key={t} className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="space-y-14">
            <Reveal>
              <Eyebrow>Our solution</Eyebrow>
              <p className="display mt-5 text-3xl leading-[1.2] sm:text-4xl">{project.solution}</p>
            </Reveal>
            <div>
              <Reveal>
                <Eyebrow>Outcomes</Eyebrow>
              </Reveal>
              <Stagger as="ul" className="mt-5 divide-y divide-line border-y border-line">
                {project.results.map((r) => (
                  <StaggerItem as="li" key={r} className="flex items-center gap-4 py-5 text-lg">
                    <Check className="size-5 shrink-0 text-accent" aria-hidden />
                    {r}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </Container>
      </section>

      {next && (
        <section className="border-t border-line bg-paper py-24 sm:py-28">
          <Container>
            <Reveal>
              <Eyebrow>Next project</Eyebrow>
              <div className="mt-10 max-w-3xl">
                <ProjectCard project={next} />
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      <div className="pt-3 sm:pt-5">
        <CtaSection />
      </div>
    </>
  );
}
