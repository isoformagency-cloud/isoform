import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";
import Prism from "@/components/ui/Prism";

const LINES = ["We shape", "digital", "experiences."];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        yPercent: 110,
        duration: 1.25,
        stagger: 0.09,
        delay: 0.15,
        ease: "expo.out",
        clearProps: "transform",
      });
      gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 18,
        duration: 1,
        stagger: 0.1,
        delay: 0.7,
        clearProps: "transform,opacity",
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[90vh] flex-col justify-between overflow-hidden pt-32 md:pt-40"
      aria-labelledby="hero-title"
    >
      {/* Full-space Prism background spanning the entire Hero section with darker, deeper tones */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-85">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={0.65}
          bloom={0.7}
          transparent={true}
          suspendWhenOffscreen={true}
        />
      </div>

      <div className="shell relative z-10 flex flex-1 flex-col justify-between">
        <div className="max-w-5xl">
          <p data-hero-fade className="eyebrow mb-8">
            Isoform — Independent Digital Studio
          </p>
          <h1 id="hero-title" className="display-hero">
            {LINES.map((line) => (
              <span key={line} className="mask-line">
                <span data-hero-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div className="rule-t mt-16 grid gap-8 py-8 md:mt-24 md:grid-cols-12 md:items-start">
          <p
            data-hero-fade
            className="max-w-xl text-base leading-relaxed text-muted-foreground md:col-span-6 md:text-lg"
          >
            ISOFORM is an independent digital studio creating distinctive websites and experiences for
            ambitious brands. Precision in form, restraint in detail.
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-8 md:col-span-6 md:justify-end">
            <Link to="/work" className="group inline-flex items-center gap-3 text-sm">
              <span className="link-underline">Explore our work</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
                →
              </span>
            </Link>
            <Link
              to="/start-project"
              className="group inline-flex items-center gap-3 text-sm text-accent"
            >
              <span className="link-underline">Start a project</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
