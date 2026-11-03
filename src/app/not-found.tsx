import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/primitives";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="relative isolate overflow-hidden">
        <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]" />
        <Container className="flex min-h-[72vh] flex-col items-center justify-center py-24 text-center">
          <Eyebrow className="justify-center">Error 404</Eyebrow>
          <p aria-hidden className="display mt-6 select-none text-[9rem] leading-none text-accent sm:text-[14rem]">
            4<span className="text-ink">0</span>4
          </p>
          <h1 className="display mt-4 text-4xl sm:text-5xl">This page took a different path.</h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            The page you are looking for does not exist or has moved. Even our agents could not find it.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg" arrow>
              Back to home
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
