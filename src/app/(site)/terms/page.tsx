import { LegalPage } from "@/components/sections/legal-page";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: `The terms that govern your use of the ${siteConfig.name} website.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="3 November 2026">
      <p>
        These terms govern your use of this website, operated by {siteConfig.legalName}. By using the website you agree
        to these terms. If you do not agree, please do not use the website.
      </p>

      <h2>Use of the website</h2>
      <p>You agree to use this website lawfully and not to:</p>
      <ul>
        <li>Attempt to gain unauthorised access to any part of the website or its systems</li>
        <li>Submit spam, malicious code or misleading information through our forms</li>
        <li>Interfere with the website’s security or performance</li>
      </ul>

      <h2>Information on this website</h2>
      <p>
        Content on this website is provided for general information. Projects and testimonials labelled as samples or
        placeholders are illustrative and do not represent real client engagements. We aim to keep information accurate
        but make no warranty that it is complete or current.
      </p>

      <h2>Services</h2>
      <p>
        Any services we provide are governed by a separate written agreement. Nothing on this website constitutes an
        offer capable of acceptance or a binding commitment to provide services.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The design, text, graphics and code of this website belong to {siteConfig.legalName} unless stated otherwise.
        Third-party names and open-source projects referenced remain the property of their respective owners.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for any indirect or consequential loss arising from
        your use of this website.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continued use of the website means you accept the updated terms.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </LegalPage>
  );
}
