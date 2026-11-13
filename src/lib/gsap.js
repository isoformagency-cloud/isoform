// GSAP for the site, loaded on demand.
//
// GSAP (about 47 KB compressed) is only needed by the home page's scroll
// effects, so it is not part of the main bundle: useGsap() fetches it after the
// page has loaded, then runs the animation setup. Until then the CSS shows each
// effect in its finished state, so nothing jumps.
//
// Rules for animation code (see FIX-PLAN.md, "GSAP and React Bits"):
// - Animate only inside useGsap (never during render), so the build-time
//   prerender, which runs in Node without a browser, is never affected.
// - Wrap scroll and motion effects in `mm.add(MOTION_OK, ...)` (gsap.matchMedia),
//   so people who prefer reduced motion keep the finished, still state.
// - Never let GSAP and other code drive the same element.

import { useEffect, useEffectEvent } from 'react';

// Media queries shared by the animations.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const DESKTOP_TALL = '(min-width: 64rem) and (min-height: 44rem)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

let runtime;
export const loadGsap = () => (runtime ??= import('./gsap-runtime.js'));

// Runs setup({ gsap, ScrollTrigger }) once GSAP has loaded, inside a gsap.context,
// and reverts everything it created (tweens, ScrollTriggers, matchMedia) on
// unmount or when `key` changes. setup may return a cleanup function.
export function useGsap(setup, scopeRef, key) {
  const run = useEffectEvent(setup);

  useEffect(() => {
    let context;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      context = gsap.context(() => run({ gsap, ScrollTrigger }), scopeRef?.current ?? undefined);
    });
    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [scopeRef, key]);
}

// ScrollTrigger measures positions once. Whenever the page's height changes
// after that (the services showcase switching to its tall mode, fonts arriving),
// measure again. Used once, on the home page.
export function useScrollTriggerRefresh() {
  useGsap(({ ScrollTrigger }) => {
    if (typeof ResizeObserver === 'undefined') return undefined;
    let timer = 0;
    let lastHeight = document.body.offsetHeight;
    const observer = new ResizeObserver(() => {
      const height = document.body.offsetHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  });
}
