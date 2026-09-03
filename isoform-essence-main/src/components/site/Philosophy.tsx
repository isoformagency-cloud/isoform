import { Reveal } from "./Reveal";

export function Philosophy() {
  return (
    <section className="on-ink bg-ink py-24 text-ivory md:py-36" aria-labelledby="philosophy-title">
      <div className="shell">
        <p className="eyebrow">01 — Philosophy</p>
        <Reveal as="h2" className="display-lg mt-8 max-w-5xl" id="philosophy-title">
          We don't build more websites.
          <br />
          We build <span className="text-accent">better</span> experiences.
        </Reveal>

        <div className="rule-t mt-16 grid gap-10 pt-10 md:grid-cols-12">
          <Reveal className="md:col-span-6 md:col-start-7 space-y-6 text-muted-foreground" stagger>
            <p className="text-base leading-relaxed md:text-lg">
              Every project starts as a question about form: what shape should this idea take, and what
              should be removed until only the essential remains. We work in small, senior teams —
              strategy, design and engineering in the same room, from first sketch to final deploy.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              The result is work that performs as carefully as it looks: fast, accessible, durable, and
              specific to the brand it belongs to.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
