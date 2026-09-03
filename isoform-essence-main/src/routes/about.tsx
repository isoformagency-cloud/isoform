import { createFileRoute } from "@tanstack/react-router";
import { Capabilities } from "@/components/site/Capabilities";
import { Reveal } from "@/components/site/Reveal";
import { ContactSection } from "@/components/site/ContactSection";

const title = "About — ISOFORM Studio";
const description =
  "ISOFORM is a six-person independent studio. Our philosophy, capabilities and the way we approach every engagement.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: About,
});

const PROCESS = [
  { step: "01", label: "Orientation", body: "Interrogate the brief. Define what the project must achieve and what it must refuse." },
  { step: "02", label: "Form", body: "Structure, composition and typographic system explored in the browser, not slides." },
  { step: "03", label: "Build", body: "Component architecture, motion, content model and CMS built together." },
  { step: "04", label: "Release", body: "Performance, accessibility and analytics tuned before launch, then supported after." },
];

function About() {
  return (
    <div className="pt-32 md:pt-40">
      <header className="shell">
        <p className="eyebrow">Studio</p>
        <h1 className="display-xl mt-6 max-w-5xl">
          Form follows intention.
        </h1>
        <div className="rule-t mt-14 grid gap-10 pt-10 md:grid-cols-12">
          <p className="text-base leading-relaxed text-muted-foreground md:col-span-6 md:text-lg">
            ISOFORM was founded on a simple frustration: most websites are assembled, not designed. We
            work the other way around — a project begins with structure and intent, and every element
            that survives has earned its place.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground md:col-span-5 md:col-start-8 md:text-lg">
            Six senior makers, remote across Europe, deliberately small. Strategy, design and
            engineering sit together so nothing is lost in translation between them.
          </p>
        </div>
      </header>

      <img
        src="/images/studio-texture.jpg"
        alt="Detail of ivory plaster with a single precise incised line"
        loading="lazy"
        width={1400}
        height={1000}
        className="mt-20 h-[42vh] w-full object-cover md:h-[62vh]"
      />

      <section className="shell py-24 md:py-32" aria-labelledby="process-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="eyebrow">Approach</p>
          <h2 id="process-title" className="display-lg">
            Process
          </h2>
        </div>
        <Reveal className="rule-t mt-12" stagger>
          {PROCESS.map((item) => (
            <div key={item.step} className="rule-b grid grid-cols-12 gap-4 py-8">
              <span className="eyebrow col-span-2 md:col-span-1">{item.step}</span>
              <h3 className="display-md col-span-10 md:col-span-4">{item.label}</h3>
              <p className="col-span-12 text-sm leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
                {item.body}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <Capabilities />
      <ContactSection />
    </div>
  );
}
