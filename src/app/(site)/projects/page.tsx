import { PageHeader } from "@/components/sections/page-header";
import { CtaSection } from "@/components/sections/home-sections";
import { Container, PlaceholderNote } from "@/components/ui/primitives";
import { ProjectGrid } from "@/components/projects/project-grid";
import { getProjects } from "@/lib/data/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description: "Selected projects across software, web platforms, AI automation and sales systems.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  const cards = projects.map(({ slug, title, client, category, year, summary, coverImage, technologies, isPlaceholder }) => ({
    slug,
    title,
    client,
    category,
    year,
    summary,
    coverImage,
    technologies,
    isPlaceholder,
  }));
  const hasPlaceholders = cards.some((p) => p.isPlaceholder);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title={<>Work that <em className="text-accent">speaks for itself.</em></>}
        description="A selection of products, platforms and automation systems, each planned, built and verified with the same rigorous process."
      >
        {hasPlaceholders && (
          <PlaceholderNote className="mt-8">Projects marked “Sample project” are illustrative placeholders</PlaceholderNote>
        )}
      </PageHeader>

      <section className="py-20 sm:py-28">
        <Container>
          {cards.length === 0 ? (
            <p className="rounded-md border border-dashed border-line p-10 text-center text-muted">
              Projects will appear here once they are published.
            </p>
          ) : (
            <ProjectGrid projects={cards} />
          )}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
