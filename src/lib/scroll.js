// One scroll listener for the whole site. Components register an element and a
// callback; on each animation frame all positions are read first, then all
// callbacks run, so reads and writes never interleave.

const items = new Set();
let frame = 0;

function flush() {
  frame = 0;
  const viewportHeight = window.innerHeight;
  const rects = [];
  for (const item of items) rects.push(item.el.getBoundingClientRect());
  let index = 0;
  for (const item of items) item.fn(rects[index++], viewportHeight);
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}

export function trackScroll(el, fn) {
  const item = { el, fn };
  if (items.size === 0) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
  items.add(item);
  schedule();
  return () => {
    items.delete(item);
    if (items.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    }
  };
}

export const clamp01 = (n) => Math.min(1, Math.max(0, n));

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
