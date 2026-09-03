import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
  delay?: number;
  y?: number;
  /** stagger direct children instead of the element itself */
  stagger?: boolean;
};

/**
 * Scroll-triggered reveal. Content is fully visible without JS/motion —
 * GSAP only animates it in when available.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  id,
  delay = 0,
  y = 28,
  stagger = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = initGsap();
    const targets = stagger ? Array.from(el.children) : [el];

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1.1,
        delay,
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        clearProps: "transform,opacity",
      });
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, y]);

  return (
    <Tag ref={ref} id={id} className={cn("reveal-target", className)}>
      {children}
    </Tag>
  );
}
