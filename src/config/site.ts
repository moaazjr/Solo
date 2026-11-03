/**
 * Central company configuration.
 * Values marked PLACEHOLDER must be replaced with real company details.
 */
export const siteConfig = {
  name: "Solo", // PLACEHOLDER: company name
  legalName: "Solo", // PLACEHOLDER: registered legal entity name
  founder: "Your Name", // PLACEHOLDER: founder name
  tagline: "One founder. A team of AI agents.",
  description:
    "Solo is a one-human technology company. A single founder directs a team of specialised AI agents to design, engineer and grow digital products for clients around the world.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    email: "mohamedmoaaz375@gmail.com",
    location: "Remote · Working worldwide",
    responseTime: "Replies within one business day",
  },
  // PLACEHOLDER: replace with real profile URLs
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "X", href: "https://x.com/" },
  ],
} as const;

export const mainNav = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const budgetOptions = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Not sure yet",
] as const;
