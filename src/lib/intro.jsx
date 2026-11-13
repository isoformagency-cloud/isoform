import { createContext, useContext } from 'react';
import { prefersReducedMotion } from './scroll.js';

// The home page opens with a scroll-driven intro, but only when the home page
// is the first page of the visit. These flags live for the page load only;
// nothing is written to cookies or browser storage.
let introSeen = false;
let hasNavigated = false;

export const markIntroSeen = () => {
  introSeen = true;
};
export const markNavigated = () => {
  hasNavigated = true;
};
export const shouldShowIntro = () => !introSeen && !hasNavigated;

// While the intro is on screen the fixed header stays out of the way.
export const IntroContext = createContext({ introActive: false, setIntroActive: () => {} });
export const useIntro = () => useContext(IntroContext);

// Where the hero starts: below the intro's scroll distance when it is mounted.
export function heroTop() {
  const stage = document.querySelector('.intro-stage');
  const sticky = stage?.querySelector('.intro-sticky');
  if (!stage || !sticky || getComputedStyle(sticky).position !== 'sticky') return 0;
  return stage.offsetHeight - sticky.offsetHeight;
}

export function scrollToHero() {
  window.scrollTo({ top: heroTop(), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
