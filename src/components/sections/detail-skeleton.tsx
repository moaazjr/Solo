import { Container } from "@/components/ui/primitives";

/** Loading placeholder for service and project detail pages. */
export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <section className="border-b border-line">
        <Container className="pb-16 pt-12 sm:pt-16">
          <div className="h-4 w-28 animate-pulse rounded bg-sand" />
          <div className="mt-12 h-6 w-32 animate-pulse rounded-full bg-sand" />
          <div className="mt-6 h-20 w-full max-w-2xl animate-pulse rounded bg-sand" />
          <div className="mt-6 h-6 w-full max-w-xl animate-pulse rounded bg-sand" />
        </Container>
      </section>
      <Container className="py-16">
        <div className="aspect-[16/9] w-full animate-pulse rounded-md bg-sand" />
      </Container>
    </div>
  );
}
