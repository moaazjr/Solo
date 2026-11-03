import { Container, PlaceholderNote } from "@/components/ui/primitives";
import { PageHeader } from "./page-header";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title}>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-muted">Last updated {updated}</p>
      </PageHeader>
      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <PlaceholderNote className="mb-10">Template text. Have it reviewed by a legal professional before launch</PlaceholderNote>
          <article className="prose-legal">{children}</article>
        </Container>
      </section>
    </>
  );
}
