import { useEffect } from "react";
import Lenis from "lenis";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Premium smooth scrolling wired into the GSAP ticker so ScrollTrigger stays
 * perfectly in sync. Disabled for reduced-motion and touch devices, where
 * native scrolling is faster and more accessible.
 */
export function SmoothScroll() {
  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (prefersReducedMotion() || isTouch) return;

    const { gsap, ScrollTrigger } = initGsap();
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    // Allow GSAP lag smoothing to absorb minor frame time variations
    gsap.ticker.lagSmoothing(500, 33);

    // Refresh ScrollTrigger once smooth scroll is initialized
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
