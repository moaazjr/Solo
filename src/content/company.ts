/**
 * Editorial content that describes how the company works.
 * Database-driven content (services, projects, testimonials) lives in Prisma.
 */

export const stats = [
  { value: 1, suffix: "", label: "Human founder, accountable for every decision" },
  { value: 71, suffix: "", label: "Specialised engineering agents on call" },
  { value: 24, suffix: "/7", label: "Work continues across every time zone" },
  { value: 100, suffix: "%", label: "Of client-facing work reviewed by the founder" },
] as const;

export const whyUs = [
  {
    icon: "UserRound",
    title: "A founder, not an account manager",
    body: "You work directly with the person who owns the outcome. No hand-offs, no diluted briefs, no layers between you and the decisions.",
  },
  {
    icon: "Zap",
    title: "The output of a full team",
    body: "Specialised AI agents handle engineering, research, testing and outreach in parallel, so delivery moves at a pace a solo studio never could.",
  },
  {
    icon: "ShieldCheck",
    title: "Review is built in, not bolted on",
    body: "Every change is planned, tested, independently reviewed and verified before it reaches you. Nothing ships without the founder's sign-off.",
  },
  {
    icon: "Gauge",
    title: "Lean by design",
    body: "No office overhead, no idle headcount. You pay for focused, senior-level work and results, not for the size of an org chart.",
  },
] as const;

export const processSteps = [
  {
    title: "Discover",
    body: "A focused conversation about your goals, constraints and what success looks like. You leave with clarity, even if we never work together.",
  },
  {
    title: "Plan",
    body: "A written plan with scope, milestones and risks. Agents research and draft; the founder decides and signs off before anything is built.",
  },
  {
    title: "Build",
    body: "Test-driven engineering with independent review at every step. You see real progress weekly, not a reveal at the end.",
  },
  {
    title: "Verify",
    body: "Automated checks, security scans and a final human review. We hand over only what we would be proud to put our name on.",
  },
  {
    title: "Grow",
    body: "Launch support, measurement and iteration. The team remembers what it learned on your project and gets sharper for the next phase.",
  },
] as const;

export const values = [
  { title: "Judgment stays human", body: "AI does the work. A person makes the calls that matter and answers for them." },
  { title: "Craft over volume", body: "Fewer, better things. Quality is the strategy, not a feature." },
  { title: "Radical transparency", body: "You always know what is being done, by whom, and why. Including which parts are AI." },
  { title: "Always learning", body: "Every project leaves the team sharper. Lessons are captured, not forgotten." },
] as const;

export const team = [
  {
    name: "Your Name", // PLACEHOLDER
    role: "Founder & CEO",
    kind: "human" as const,
    body: "Sets direction, owns every client relationship and signs off on all work before it ships.",
  },
  {
    name: "ECC",
    role: "Engineering",
    kind: "agent" as const,
    body: "An engineering system of specialised agents for planning, architecture, test-driven development, code review and security.",
    href: "https://github.com/affaan-m/ECC",
  },
  {
    name: "Harvey",
    role: "Sales & Outreach",
    kind: "agent" as const,
    body: "Researches businesses, drafts personal outreach and manages replies. Every message is approved by the founder before it is sent.",
    href: "https://github.com/ethanplusai/harvey",
  },
] as const;
