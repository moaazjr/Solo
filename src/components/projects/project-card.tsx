import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export type ProjectCardData = Pick<
  Project,
  "slug" | "title" | "client" | "category" | "year" | "summary" | "coverImage" | "technologies" | "isPlaceholder"
>;

export function ProjectCard({
  project,
  size = "default",
  priority = false,
}: {
  project: ProjectCardData;
  size?: "default" | "large";
  priority?: boolean;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block focus-visible:outline-offset-4">
      <div
        className={cn(
          "relative overflow-hidden rounded-md bg-sand",
          size === "large" ? "aspect-[4/3] lg:aspect-[16/11]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={project.coverImage}
          alt={`${project.title} cover image`}
          fill
          priority={priority}
          sizes={size === "large" ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute right-4 top-4 grid size-11 translate-y-2 place-items-center rounded-full bg-ivory text-ink opacity-0 transition-all duration-500 ease-out-soft group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
        {project.isPlaceholder && (
          <Badge tone="neutral" className="absolute left-4 top-4 bg-ivory/90 backdrop-blur">
            Sample project
          </Badge>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="display text-[1.9rem] transition-colors group-hover:text-accent">{project.title}</h3>
          <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted">{project.summary}</p>
        </div>
        <div className="shrink-0 text-right font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <p>{project.category}</p>
          <p className="mt-1">{project.year}</p>
        </div>
      </div>
    </Link>
  );
}
