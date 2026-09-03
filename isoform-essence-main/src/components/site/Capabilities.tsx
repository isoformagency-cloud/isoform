import { useState } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import ShinyText from "@/components/ui/ShinyText";

const CAPABILITIES = [
  {
    index: "01",
    title: "Digital Design",
    detail: "Interface systems, art direction, typography, motion language.",
  },
  {
    index: "02",
    title: "Web Development",
    detail: "Performance-first front-ends, headless architecture, CMS tooling.",
  },
  {
    index: "03",
    title: "Interactive Experiences",
    detail: "Scroll narratives, generative visuals, considered micro-interaction.",
  },
  {
    index: "04",
    title: "Creative Direction",
    detail: "Positioning, narrative, editorial structure, launch craft.",
  },
  {
    index: "05",
    title: "Brand Systems",
    detail: "Identity systems, design tokens, documentation that survives handover.",
  },
];

export function Capabilities() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="py-24 md:py-36" aria-labelledby="capabilities-title">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="eyebrow">02 — Capabilities</p>
          <h2 id="capabilities-title" className="display-md max-w-md">
            What we do, and how far we take it
          </h2>
        </div>

        <Reveal className="rule-t mt-14" stagger>
          {CAPABILITIES.map((item, idx) => (
            <div
              key={item.index}
              onMouseEnter={() => setActive(item.index)}
              onMouseLeave={() => setActive(null)}
              className={cn(
                "rule-b group grid grid-cols-12 items-baseline gap-4 py-6 transition-colors duration-500 md:py-8",
                active && active !== item.index ? "opacity-50" : "opacity-100",
              )}
            >
              <span className="eyebrow col-span-2 md:col-span-1">{item.index}</span>
              <h3
                className={cn(
                  "col-span-10 display-md transition-[transform,color] duration-500 md:col-span-6",
                  active === item.index ? "translate-x-2" : "",
                )}
              >
                <ShinyText
                  text={item.title}
                  speed={2.8}
                  delay={idx * 0.35}
                  color="#111111"
                  shineColor="#d97736"
                  spread={120}
                  direction="left"
                  pauseOnHover={false}
                />
              </h3>
              <p className="col-span-12 text-sm text-muted-foreground md:col-span-5 md:col-start-8">
                {item.detail}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
