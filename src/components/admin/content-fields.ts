import { iconNames } from "@/components/ui/icon";
import type { FieldDef } from "./content-form";

export const serviceFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "Used in the URL: /services/your-slug" },
  { name: "tagline", label: "Tagline", type: "text", span: 2 },
  { name: "summary", label: "Summary", type: "textarea", rows: 2, span: 2, hint: "Shown on cards and in search results." },
  { name: "description", label: "Description", type: "textarea", rows: 5, span: 2 },
  { name: "features", label: "What's included", type: "textarea", rows: 6, hint: "One item per line." },
  { name: "benefits", label: "Business value", type: "textarea", rows: 6, hint: "One item per line." },
  { name: "icon", label: "Icon", type: "select", options: iconNames },
  { name: "order", label: "Display order", type: "number", hint: "Lower numbers appear first." },
  { name: "published", label: "Published", type: "checkbox", hint: "Visible on the public website." },
];

export const projectFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "Used in the URL: /projects/your-slug" },
  { name: "client", label: "Client", type: "text" },
  { name: "category", label: "Category", type: "text", hint: "Used for filtering, e.g. SaaS, AI Automation." },
  { name: "year", label: "Year", type: "number" },
  { name: "order", label: "Display order", type: "number", hint: "Lower numbers appear first." },
  { name: "coverImage", label: "Cover image", type: "text", span: 2, hint: "A path in /public (e.g. /images/projects/name.svg) or an https URL." },
  { name: "summary", label: "Summary", type: "textarea", rows: 2, span: 2 },
  { name: "challenge", label: "The challenge", type: "textarea", rows: 4, span: 2 },
  { name: "solution", label: "Our solution", type: "textarea", rows: 4, span: 2 },
  { name: "results", label: "Outcomes", type: "textarea", rows: 5, hint: "One item per line." },
  { name: "technologies", label: "Technologies", type: "textarea", rows: 5, hint: "One item per line." },
  { name: "featured", label: "Featured", type: "checkbox", hint: "Show on the home page." },
  { name: "isPlaceholder", label: "Sample / placeholder", type: "checkbox", hint: "Labels the project as a sample on the site." },
  { name: "published", label: "Published", type: "checkbox", hint: "Visible on the public website." },
];
