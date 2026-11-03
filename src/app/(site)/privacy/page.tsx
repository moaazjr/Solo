import { LegalPage } from "@/components/sections/legal-page";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your personal information.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="3 November 2026">
      <p>
        This policy explains what personal information {siteConfig.legalName} (“we”, “us”) collects through this website,
        why we collect it and how we protect it. We collect as little as possible and never sell your data.
      </p>

      <h2>Information we collect</h2>
      <p>When you submit our contact form, we collect:</p>
      <ul>
        <li>Your full name and email address</li>
        <li>Your company name and budget range, if you choose to provide them</li>
        <li>The service you are interested in and your message</li>
        <li>A one-way cryptographic hash of your IP address and your browser’s user-agent string, used only to prevent spam and abuse</li>
      </ul>
      <p>We do not store your raw IP address and we do not use advertising or analytics tracking cookies.</p>

      <h2>How we use your information</h2>
      <ul>
        <li>To read and respond to your enquiry</li>
        <li>To prepare proposals and deliver services you request</li>
        <li>To protect the website from spam, fraud and abuse</li>
      </ul>

      <h2>AI and our team</h2>
      <p>
        We are a one-human company that works with AI agents. Your enquiry is read by the founder. If we work together,
        project information may be processed by AI tools under our supervision. We will not use your information to
        train third-party AI models, and we will discuss how your project data is handled before any work begins.
      </p>

      <h2>Storage and security</h2>
      <p>
        Submissions are stored in a secured PostgreSQL database and delivered to us by email over an encrypted
        connection. Access is restricted to the founder through a password-protected administration area.
      </p>

      <h2>Retention</h2>
      <p>
        We keep enquiries for as long as needed to respond and manage any resulting relationship, and delete them when
        they are no longer needed or when you ask us to.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal information at any time by emailing{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Public pages of this website do not set tracking cookies. A strictly necessary session cookie is used only in
        the private administration area.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. The date at the top of this page shows when it last changed.</p>
    </LegalPage>
  );
}
