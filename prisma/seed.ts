import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const services = [
  {
    slug: "ai-software-development",
    title: "AI-Powered Software Development",
    tagline: "Production software, engineered by agents and owned by a human.",
    icon: "CodeXml",
    summary: "Custom applications built with a disciplined, test-driven agent workflow and reviewed by the founder at every step.",
    description:
      "We build custom software the way a senior engineering team would: plan first, write tests before code, review every change with fresh eyes and verify before release. The difference is that much of the hands-on work is carried out by specialised AI agents running in parallel, which means you get senior-quality engineering delivered faster and with full transparency.",
    features: [
      "Architecture and technical planning",
      "Test-driven implementation",
      "Independent code review on every change",
      "Security scanning and dependency audits",
      "Documentation written as we build",
      "Clean handover of code and knowledge",
    ],
    benefits: [
      "Ship features in weeks, not quarters",
      "Fewer regressions thanks to tests and review at every step",
      "One accountable owner for the whole codebase",
      "Code you fully own, with no lock-in",
    ],
  },
  {
    slug: "web-product-engineering",
    title: "Web & Product Engineering",
    tagline: "Websites and web apps that look premium and perform.",
    icon: "Layers",
    summary: "Fast, accessible, beautifully crafted websites and web applications built on a modern stack.",
    description:
      "From marketing sites to complex web applications, we design and engineer digital products that feel considered in every detail. We work with modern, proven technologies such as Next.js, TypeScript and PostgreSQL, and we care as much about performance, accessibility and SEO as we do about how it looks.",
    features: [
      "Product and UX design",
      "Next.js, React and TypeScript development",
      "Database design and APIs",
      "Performance and Core Web Vitals optimisation",
      "Accessibility (WCAG) and SEO foundations",
      "Hosting, monitoring and launch support",
    ],
    benefits: [
      "A site that reflects the quality of your business",
      "Faster pages that convert more visitors",
      "A codebase that is easy to extend",
      "Launch with confidence, with monitoring in place",
    ],
  },
  {
    slug: "ai-agents-automation",
    title: "AI Agents & Automation",
    tagline: "Put AI to work inside your business, safely.",
    icon: "Bot",
    summary: "Design and deployment of AI agents and automated workflows that remove repetitive work from your team.",
    description:
      "We run our own company on AI agents, so we know what works in practice and what does not. We help you identify the processes worth automating, then design, build and deploy agents and workflows with the right guardrails: human approval where it matters, clear audit trails and predictable costs.",
    features: [
      "Process discovery and automation roadmap",
      "Custom AI agents and assistants",
      "Integrations with your existing tools",
      "Human-in-the-loop approval flows",
      "Monitoring, logging and cost controls",
      "Team training and documentation",
    ],
    benefits: [
      "Hours of repetitive work returned to your team every week",
      "Automation you can trust, with guardrails built in",
      "Clear visibility into what the AI is doing",
      "Practical results instead of experiments",
    ],
  },
  {
    slug: "sales-outreach-automation",
    title: "AI Sales & Outreach",
    tagline: "A pipeline that keeps filling while you focus on closing.",
    icon: "Megaphone",
    summary: "Research-driven outbound systems that find the right prospects and start real conversations, with approval by default.",
    description:
      "We design and operate AI-assisted outbound systems that research prospects, write genuinely personal outreach and manage replies, all with a human approving what goes out. The approach is built on respect for recipients: compliant opt-outs, sensible sending limits and messages worth reading.",
    features: [
      "Ideal customer profile and targeting",
      "Prospect research and enrichment",
      "Personalised multi-step email sequences",
      "Reply handling and meeting booking",
      "Deliverability and domain setup",
      "Compliance: opt-outs and do-not-contact lists",
    ],
    benefits: [
      "A steady flow of qualified conversations",
      "Outreach that sounds human because a human approves it",
      "Protected sender reputation",
      "Clear reporting on what is working",
    ],
  },
  {
    slug: "technical-consulting",
    title: "Technical Consulting",
    tagline: "Senior technical judgment, exactly when you need it.",
    icon: "Compass",
    summary: "Architecture reviews, AI strategy and hands-on guidance for founders and teams making important technical decisions.",
    description:
      "Sometimes what you need is not more code but a clear, honest opinion. We help founders and teams make better technical decisions: choosing a stack, reviewing an architecture, planning an AI strategy or rescuing a project that has lost its way.",
    features: [
      "Architecture and code reviews",
      "AI adoption strategy",
      "Technology and vendor selection",
      "Project rescue and recovery plans",
      "Technical due diligence",
      "Ongoing advisory retainers",
    ],
    benefits: [
      "Avoid expensive technical mistakes",
      "An independent, unbiased perspective",
      "A clear plan your team can execute",
      "Access to senior expertise without a full-time hire",
    ],
  },
];

const projects = [
  {
    slug: "meridian-analytics",
    title: "Meridian",
    client: "Sample client",
    category: "SaaS",
    year: 2026,
    featured: true,
    summary: "A real-time analytics platform that turns operational data into clear daily decisions.",
    challenge:
      "Teams were exporting spreadsheets from five different tools every morning just to understand yesterday's performance.",
    solution:
      "A unified analytics platform with live dashboards, scheduled reports and anomaly alerts, built test-first with an agent-driven review pipeline.",
    results: ["Reporting time reduced from hours to minutes", "Single source of truth across teams", "Alerts for anomalies before they become problems"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
    coverImage: "/images/projects/meridian.svg",
  },
  {
    slug: "atlas-support-agent",
    title: "Atlas",
    client: "Sample client",
    category: "AI Automation",
    year: 2026,
    featured: true,
    summary: "An AI support agent that resolves common questions instantly and hands complex cases to people.",
    challenge: "A small support team was overwhelmed by repetitive questions, leaving complex customer issues waiting for days.",
    solution:
      "An AI agent grounded in the company's own documentation, with confidence thresholds, human escalation and a full audit log of every answer.",
    results: ["Most routine questions answered instantly", "Complex cases escalated with full context", "Every AI response logged and reviewable"],
    technologies: ["Claude API", "TypeScript", "Node.js", "PostgreSQL", "Vector search"],
    coverImage: "/images/projects/atlas.svg",
  },
  {
    slug: "verdant-commerce",
    title: "Verdant Commerce",
    client: "Sample client",
    category: "E-commerce",
    year: 2025,
    featured: true,
    summary: "A fast, editorial storefront for a premium lifestyle brand.",
    challenge: "A slow, template-based store was hurting conversions and did not reflect the quality of the brand.",
    solution:
      "A custom headless storefront with editorial product storytelling, sub-second page loads and a streamlined checkout.",
    results: ["Significantly faster page loads", "A storefront that matches the brand", "Simpler content updates for the team"],
    technologies: ["Next.js", "React", "Headless commerce", "Tailwind CSS", "Vercel"],
    coverImage: "/images/projects/verdant.svg",
  },
  {
    slug: "pulse-outreach",
    title: "Pulse",
    client: "Sample client",
    category: "Sales Automation",
    year: 2025,
    featured: false,
    summary: "A research-driven outbound engine that books qualified meetings on autopilot, with approval by default.",
    challenge: "The founder was spending most of the week on manual prospecting instead of serving existing customers.",
    solution:
      "An AI-assisted outbound system with prospect research, personalised sequences, reply handling and a daily approval queue.",
    results: ["Consistent weekly pipeline", "Founder time freed for selling", "Compliant, respectful outreach"],
    technologies: ["Python", "AI agents", "SQLite", "SMTP", "Email deliverability"],
    coverImage: "/images/projects/pulse.svg",
  },
  {
    slug: "harbor-booking",
    title: "Harbor",
    client: "Sample client",
    category: "Web Platform",
    year: 2025,
    featured: false,
    summary: "A booking platform for a network of independent studios.",
    challenge: "Bookings were handled over phone and messaging apps, leading to double bookings and lost revenue.",
    solution: "A web platform with real-time availability, online payments, automated reminders and a simple admin dashboard.",
    results: ["Double bookings eliminated", "Automated reminders reduce no-shows", "Clear view of utilisation"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Nodemailer"],
    coverImage: "/images/projects/harbor.svg",
  },
  {
    slug: "lumen-knowledge",
    title: "Lumen",
    client: "Sample client",
    category: "AI Automation",
    year: 2024,
    featured: false,
    summary: "An internal knowledge assistant that answers questions from company documents with sources.",
    challenge: "Critical knowledge was scattered across drives, wikis and inboxes, slowing down onboarding and decisions.",
    solution: "A private assistant that searches internal documents and answers with citations, respecting existing access permissions.",
    results: ["Faster onboarding for new team members", "Answers always linked to their source", "Permissions respected end to end"],
    technologies: ["Claude API", "TypeScript", "PostgreSQL", "pgvector", "Next.js"],
    coverImage: "/images/projects/lumen.svg",
  },
];

const testimonials = [
  {
    quote: "Placeholder testimonial. A short, specific quote from a real client about the outcome of the project will appear here.",
    author: "Client Name",
    role: "Founder",
    company: "Placeholder Company",
  },
  {
    quote: "Placeholder testimonial. This space is reserved for genuine feedback once the first client projects are complete.",
    author: "Client Name",
    role: "Head of Product",
    company: "Placeholder Company",
  },
  {
    quote: "Placeholder testimonial. Real words from real clients only. Nothing on this page is invented.",
    author: "Client Name",
    role: "Operations Director",
    company: "Placeholder Company",
  },
];

async function main() {
  for (const [order, s] of services.entries()) {
    await db.service.upsert({ where: { slug: s.slug }, update: { ...s, order }, create: { ...s, order } });
  }
  for (const [order, p] of projects.entries()) {
    const data = { ...p, order, isPlaceholder: true };
    await db.project.upsert({ where: { slug: p.slug }, update: data, create: data });
  }
  await db.testimonial.deleteMany({ where: { isPlaceholder: true } });
  await db.testimonial.createMany({
    data: testimonials.map((t, order) => ({ ...t, order, isPlaceholder: true })),
  });
  console.log(`Seeded ${services.length} services, ${projects.length} projects, ${testimonials.length} testimonials.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
