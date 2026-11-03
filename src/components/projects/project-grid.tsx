"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard, type ProjectCardData } from "./project-card";
import { cn } from "@/lib/utils";

const ALL = "All";

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  const [active, setActive] = useState<string>(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.category))).sort()],
    [projects],
  );
  const visible = active === ALL ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const count = c === ALL ? projects.length : projects.filter((p) => p.category === c).length;
          const isActive = c === active;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(c)}
              className={cn(
                "relative rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                isActive ? "border-ink text-ivory" : "border-line text-muted hover:border-ink/40 hover:text-ink",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 -z-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative z-10">
                {c} <span className="ml-1 font-mono text-[0.7rem] opacity-60">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <motion.div layout className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
              className={cn(i % 2 === 1 && "md:mt-24")}
            >
              <ProjectCard project={p} priority={i < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="mt-12 rounded-md border border-dashed border-line p-10 text-center text-muted">No projects in this category yet.</p>
      )}
    </div>
  );
}
