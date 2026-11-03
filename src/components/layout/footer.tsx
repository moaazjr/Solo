import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { mainNav, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { Logo } from "./logo";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-night-muted">
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.06]" />
      <Container className="relative">
        <div className="grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed">
              A one-human technology company. One founder, a team of AI agents, and work delivered to a standard.
            </p>
          </div>

          <FooterColumn title="Company">
            {mainNav.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Legal">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
          </FooterColumn>

          <FooterColumn title="Connect">
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="break-all text-sm transition-colors hover:text-ivory">
                {siteConfig.contact.email}
              </a>
            </li>
            {siteConfig.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm transition-colors hover:text-ivory"
                >
                  {s.label}
                  <ArrowUpRight className="size-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-3 border-t border-night-line py-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.14em]">1 human · many agents</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow text-ivory/60">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm transition-colors hover:text-ivory">
        {children}
      </Link>
    </li>
  );
}
