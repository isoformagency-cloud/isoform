import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { publishedProjectsQuery } from "@/lib/projects";
import { ProjectRow } from "@/components/projects/ProjectRow";

const title = "Work — ISOFORM";
const description =
  "Selected case studies from ISOFORM: websites, interfaces and interactive experiences built for ambitious brands.";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  const { data: projects = [], isLoading } = useQuery(publishedProjectsQuery);

  return (
    <div className="pt-32 md:pt-40">
      <div className="shell">
        <p className="eyebrow">Index of work</p>
        <h1 className="display-xl mt-6">Work</h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Every engagement is treated as a case study — problem, form, and outcome. A selection of what
          we can show publicly.
        </p>

        <div className="mt-16 pb-24 md:pb-32">
          {isLoading ? (
            <p className="rule-t py-16 eyebrow">Loading work…</p>
          ) : projects.length === 0 ? (
            <div className="rule-t py-16">
              <p className="text-sm text-muted-foreground">
                No published projects yet. Published projects appear here automatically.
              </p>
              <Link to="/contact" className="link-underline mt-4 inline-block text-sm">
                Start a project instead
              </Link>
            </div>
          ) : (
            projects.map((project, i) => (
              <ProjectRow key={project.id} project={project} index={i} priority={i === 0} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
