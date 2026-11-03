import {
  Bot,
  Briefcase,
  CodeXml,
  Compass,
  Gauge,
  Globe,
  Layers,
  Megaphone,
  ShieldCheck,
  Sparkles,
  UserRound,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Icons that can be referenced by name from the database or content files. */
export const iconMap = {
  Bot,
  Briefcase,
  CodeXml,
  Compass,
  Gauge,
  Globe,
  Layers,
  Megaphone,
  ShieldCheck,
  Sparkles,
  UserRound,
  Workflow,
  Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;
export const iconNames = Object.keys(iconMap) as IconName[];

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name as IconName] ?? Sparkles;
  return <Icon aria-hidden className={className} strokeWidth={1.5} />;
}
