import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { projectBySlugQuery } from "@/lib/projects";
import { MediaImage } from "@/components/projects/MediaImage";
import { Reveal } from "@/components/site/Reveal";
import { useMediaUrl } from "@/lib/media";

export const Route = createFileRoute("/work/$slug")({
  head: ({ params }) => {
    const title = `Case study — ISOFORM`;
    return {
      meta: [
        { title },
        { name: "description", content: `ISOFORM case study: ${params.slug.replace(/-/g, " ")}.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `ISOFORM case study: ${params.slug.replace(/-/g, " ")}.` },
      ],
    };
  },
  component: ProjectDetail,
  errorComponent: () => <Fallback title="This case study didn't load" />,
  notFoundComponent: () => <Fallback title="Case study not found" />,
});

function Fallback({ title }: { title: string }) {
  return (
    <div className="shell flex min-h-screen flex-col justify-center py-32">
      <h1 className="display-lg">{title}</h1>
      <Link to="/work" className="link-underline mt-8 text-sm">
        Back to all work
      </Link>
    </div>
  );
}

function VideoBlock({ path }: { path: string }) {
  const url = useMediaUrl(path);
  if (!url) return null;
  return (
    <video
      src={url}
      controls
      preload="metadata"
      playsInline
      className="w-full bg-secondary"
      aria-label="Project video"
    />
  );
}

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data: project, isLoading } = useQuery(projectBySlugQuery(slug));

  if (isLoading) {
    return (
      <div className="shell pt-40">
        <p className="eyebrow">Loading case study…</p>
      </div>
    );
  }
  if (!project) return <Fallback title="Case study not found" />;

  const meta = [
    { label: "Client", value: project.client },
    { label: "Industry", value: project.industry },
    { label: "Category", value: project.category },
    { label: "Year", value: project.year },
  ].filter((m) => m.value);

  const sections = [
    { label: "Overview", body: project.description },
    { label: "Challenge", body: project.challenge },
    { label: "Approach", body: project.approach },
    { label: "Solution", body: project.solution },
  ].filter((s) => s.body);

  return (
    <article className="pt-32 md:pt-40">
      <header className="shell">
        <Link to="/work" className="eyebrow link-underline">
          ← Work
        </Link>
        <h1 className="display-xl mt-8">{project.title}</h1>

        <dl className="rule-t mt-12 grid grid-cols-2 gap-8 pt-8 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="eyebrow">{m.label}</dt>
              <dd className="mt-2 text-sm">{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="shell mt-12">
        <MediaImage
          src={project.hero_image}
          alt={`${project.title} — hero visual`}
          ratio="16 / 9"
          priority
          reveal={false}
        />
      </div>

      <div className="shell mt-20 grid gap-16 md:grid-cols-12">
        <div className="space-y-14 md:col-span-7">
          {sections.map((section) => (
            <Reveal key={section.label}>
              <p className="eyebrow">{section.label}</p>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">
                {section.body}
              </p>
            </Reveal>
          ))}
        </div>

        <aside className="space-y-10 md:col-span-4 md:col-start-9">
          {project.services.length ? (
            <div className="rule-t pt-4">
              <p className="eyebrow">Services</p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {project.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.technologies.length ? (
            <div className="rule-t pt-4">
              <p className="eyebrow">Technology</p>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                {project.technologies.map((t) => (
                  <li key={t} className="border border-border px-3 py-1 text-muted-foreground">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="Open site →"
              className="group inline-flex items-center gap-3 border border-foreground/25 px-6 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              Visit live website
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
                →
              </span>
            </a>
          ) : null}
        </aside>
      </div>

      {project.images.length ? (
        <section className="shell mt-24 space-y-6 md:space-y-10" aria-label="Visual showcase">
          {project.images.map((image, i) => (
            <MediaImage
              key={image}
              src={image}
              alt={`${project.title} — visual ${i + 1}`}
              ratio={i % 3 === 0 ? "16 / 9" : "4 / 3"}
              className={i % 3 === 1 ? "md:w-3/4" : i % 3 === 2 ? "md:ml-auto md:w-3/4" : ""}
            />
          ))}
        </section>
      ) : null}

      {project.videos.length ? (
        <section className="shell mt-16 space-y-8" aria-label="Project video">
          {project.videos.map((video) => (
            <VideoBlock key={video} path={video} />
          ))}
        </section>
      ) : null}

      <div className="shell rule-t mt-24 flex flex-wrap items-center justify-between gap-6 py-10">
        <p className="display-md">Next</p>
        <Link to="/work" className="group inline-flex items-center gap-3 text-sm">
          <span className="link-underline">All case studies</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
