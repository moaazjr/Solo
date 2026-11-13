import { Hero } from "@/components/sections/hero";
import {
  CtaSection,
  FeaturedProjects,
  IntroStatement,
  LocalBusinessBand,
  ProcessSection,
  ServicesOverview,
  StatsBand,
  Testimonials,
  WhyChooseUs,
} from "@/components/sections/home-sections";
import { getFeaturedProjects, getServices, getTestimonials } from "@/lib/data/content";
import { JsonLd, organizationJsonLd } from "@/lib/seo";

export default async function HomePage() {
  const [services, projects, testimonials] = await Promise.all([
    getServices(),
    getFeaturedProjects(3),
    getTestimonials(),
  ]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />
      <IntroStatement />
      <LocalBusinessBand />
      <ServicesOverview services={services} />
      <WhyChooseUs />
      <StatsBand />
      <FeaturedProjects projects={projects} />
      <ProcessSection />
      <Testimonials testimonials={testimonials} />
      <CtaSection />
    </>
  );
}
