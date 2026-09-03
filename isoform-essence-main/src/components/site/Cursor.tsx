import { useEffect, useRef, useState } from "react";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Minimal magnetic cursor. Desktop pointer only.
 * Elements can set data-cursor="Label" to show contextual copy.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const { gsap } = initGsap();
    const el = dot.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button",
      );
      setActive(Boolean(target));
      setLabel(target?.dataset["cursor"] ?? null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference max-md:hidden"
    >
      <div
        className="flex items-center justify-center rounded-full bg-ivory transition-[width,height] duration-300"
        style={{ width: active ? 56 : 10, height: active ? 56 : 10 }}
      >
        {label ? (
          <span className="eyebrow max-w-[7rem] text-center leading-tight text-ink">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
