import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { publishedProjectsQuery } from "@/lib/projects";
import { AccordionGallery } from "@/components/ui/AccordionGallery";
import { Reveal } from "./Reveal";

const DEFAULT_STUDIO_ITEMS = [
  {
    image: "/images/project-monolith.jpg",
    label: "Monolith — Spatial Audio",
    link: "/work/monolith-audio",
    alt: "Monolith spatial audio interface",
  },
  {
    image: "/images/project-atlas.jpg",
    label: "Atlas — Planetary Platform",
    link: "/work/atlas-platform",
    alt: "Atlas planetary data design system",
  },
  {
    image: "/images/project-veld.jpg",
    label: "Veld — Architectural Archive",
    link: "/work/veld-archive",
    alt: "Veld architectural archive catalog",
  },
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
    label: "Kinetics — Generative Systems",
    link: "/work",
    alt: "Kinetics generative design system",
  },
  {
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=900&auto=format&fit=crop&q=80",
    label: "Aura — Brand Architecture",
    link: "/work",
    alt: "Aura brand architecture and typography",
  },
];

export function FeaturedWork() {
  const { data: projects = [] } = useQuery(publishedProjectsQuery);

  const galleryItems =
    projects.length > 0
      ? projects.slice(0, 5).map((p) => ({
          image: p.hero_image || "/images/project-monolith.jpg",
          label: `${p.title}${p.client ? ` — ${p.client}` : ""}`,
          link: `/work/${p.slug}`,
          alt: p.title,
        }))
      : DEFAULT_STUDIO_ITEMS;

  return (
    <section className="pb-24 md:pb-36" aria-labelledby="work-title">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="eyebrow">03 — Selected Work</p>
          <h2 id="work-title" className="display-lg">
            Work
          </h2>
        </div>

        <Reveal className="mt-12" delay={0.1}>
          <AccordionGallery
            items={galleryItems}
            defaultIndex={1}
            expandRatio={0.52}
            height={480}
            gap={12}
            radius={2}
            accentColor="var(--accent, #c86536)"
            overlayColor="oklch(0.16 0.006 60)"
            textColor="#ffffff"
            grayscale={true}
            showLabels={true}
            trigger="hover"
            tilt={6}
            parallax={0.4}
          />
        </Reveal>

        <div className="rule-t mt-12 flex justify-end pt-8">
          <Link to="/work" className="group inline-flex items-center gap-3 text-sm">
            <span className="link-underline">All projects</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
