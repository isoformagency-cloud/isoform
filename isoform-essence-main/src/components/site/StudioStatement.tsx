import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
const studioTexture = "/images/studio-texture.jpg";

const FACTS = [
  { label: "Founded", value: "2019" },
  { label: "Based", value: "Remote — Europe" },
  { label: "Team", value: "Six senior makers" },
  { label: "Engagements", value: "Studio retainers & builds" },
];

export function StudioStatement() {
  return (
    <section className="pb-24 md:pb-36" aria-labelledby="studio-title">
      <div className="shell">
        <div className="rule-t grid gap-12 pt-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow">04 — Studio</p>
            <h2 id="studio-title" className="display-lg mt-8">
              A studio,
              <br />
              not an agency
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              Six people, one table. No account layers, no handover gaps — the people who design your
              site are the people who build it. We take on a small number of projects each year so each
              one can be finished properly.
            </p>
            <Link to="/about" className="group mt-8 inline-flex items-center gap-3 text-sm">
              <span className="link-underline">Inside the studio</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <img
              src={studioTexture}
              alt="Close detail of an ivory plaster surface with a single incised line"
              loading="lazy"
              width={1400}
              height={1000}
              className="w-full object-cover"
            />
            <Reveal className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6" stagger>
              {FACTS.map((fact) => (
                <div key={fact.label} className="rule-t pt-3">
                  <p className="eyebrow">{fact.label}</p>
                  <p className="mt-1 text-sm">{fact.value}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
