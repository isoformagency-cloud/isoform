import { useEffect, useRef, useState } from "react";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

const KEY = "isoform:intro-seen";

/**
 * Cinematic wordmark intro. Runs once per session, ~1.4s, then dissolves
 * into the hero. Skipped entirely for reduced-motion users.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = root.current;
    if (!el) return;
    const { gsap } = initGsap();
    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const letters = el.querySelectorAll("[data-letter]");
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setMounted(false);
        },
      });
      tl.from(letters, {
        yPercent: 115,
        duration: 0.9,
        stagger: 0.045,
        ease: "expo.out",
      })
        .to(
          el.querySelector("[data-word]"),
          { letterSpacing: "0.22em", duration: 1.1, ease: "expo.inOut" },
          0.25,
        )
        .to(el.querySelector("[data-meta]"), { opacity: 1, duration: 0.6 }, 0.5)
        .to(el, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 1.35)
        .set(el, { pointerEvents: "none" });
    }, el);

    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="on-ink fixed inset-0 z-[120] flex flex-col items-center justify-center bg-ink text-ivory"
    >
      <div data-word className="flex" style={{ letterSpacing: "-0.04em" }}>
        {"ISOFORM".split("").map((char, i) => (
          <span key={i} className="mask-line">
            <span
              data-letter
              className="block font-display text-[clamp(2.5rem,9vw,7rem)] font-medium uppercase leading-none"
            >
              {char}
            </span>
          </span>
        ))}
      </div>
      <span data-meta className="eyebrow mt-6 opacity-0">
        Independent Digital Studio
      </span>
    </div>
  );
}
