import { Link } from "@tanstack/react-router";
import type { Project } from "@/lib/projects";
import { MediaImage } from "./MediaImage";
import { cn } from "@/lib/utils";

type ProjectRowProps = {
  project: Project;
  index: number;
  priority?: boolean;
};

/** Large alternating editorial project entry. Not a card. */
export function ProjectRow({ project, index, priority = false }: ProjectRowProps) {
  const flipped = index % 2 === 1;

  return (
    <article className="rule-t py-10 md:py-16">
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        data-cursor="View project →"
        className="group grid gap-6 md:grid-cols-12 md:items-center md:gap-10"
      >
        <div className={cn("md:col-span-7", flipped && "md:order-2 md:col-start-6")}>
          <MediaImage
            src={project.hero_image}
            alt={`${project.title} — ${project.category || "project"} by ISOFORM`}
            ratio="16 / 11"
            priority={priority}
            className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.015]"
          />
        </div>

        <div className={cn("md:col-span-4", flipped ? "md:order-1 md:col-start-1" : "md:col-start-9")}>
          <div className="flex items-baseline gap-4">
            <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
            <span className="eyebrow">{project.year}</span>
          </div>
          <h3 className="display-md mt-4 transition-colors duration-500 group-hover:text-accent">
            {project.title}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            {project.client}
            {project.category ? ` — ${project.category}` : ""}
          </p>
          {project.description ? (
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          ) : null}
          <span className="mt-6 inline-flex items-center gap-2 text-sm">
            <span className="link-underline">View case study</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
